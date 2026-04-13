// OAR Pro v4 — Stripe Webhook Edge Function
// Handles: checkout.session.completed
//
// Affiliate logic:
//   1. Check if affiliate_code matches affiliates.code (admin-created)
//   2. If not, check if it matches profiles.referral_code (user referral link)
//   3. Commission: 25% of sale price
//
// Idempotency:
//   - Stripe retries webhooks for 72 hours. We check payment_intent ID before processing.
//   - affiliate_referrals has a UNIQUE index on stripe_payment_id — double-inserts fail silently.
//   - profiles has a UNIQUE index on stripe_payment_id — duplicate profile updates are no-ops.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service_role bypasses RLS
);

const COMMISSION_RATE = 0.25; // 25% of amount actually paid

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const stripeCustomerId = session.customer as string;
      const paymentId = session.payment_intent as string;
      const affiliateCode = (session.metadata?.affiliate_code || "").trim();
      const amountPaid = session.amount_total || 9700; // cents

      if (!customerEmail) {
        console.warn("[webhook] No customer email on session", session.id);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // ── IDEMPOTENCY CHECK ────────────────────────────────────────────────────
      // If we've already processed this payment_intent, skip everything.
      // Stripe retries for 72 hours — this prevents double affiliate credits.
      if (paymentId) {
        const { data: alreadyProcessed } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_payment_id", paymentId)
          .single();

        if (alreadyProcessed) {
          console.log(`[webhook] Payment ${paymentId} already processed — skipping (idempotent)`);
          return new Response(JSON.stringify({ received: true }), { status: 200 });
        }
      }

      // ── 1. Mark user as paid ─────────────────────────────────────────────────
      // Read test_type from metadata (migration-013 adds per-test access).
      // Defaults to 'OAR' for any legacy webhook events without test_type.
      const testType = (session.metadata?.test_type || "OAR").trim() || "OAR";

      const profileUpdate: Record<string, unknown> = {
        stripe_customer_id: stripeCustomerId,
        stripe_payment_id: paymentId,
        paid_at: new Date().toISOString(),
        affiliate_code_used: affiliateCode || null,
      };
      // Legacy is_paid field: keep setting true for OAR purchases (backward compat)
      if (testType === "OAR") profileUpdate.is_paid = true;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("email", customerEmail)
        .select()
        .single();

      if (profileError) {
        // User hasn't created their account yet (paid before signing up).
        // Store in pending_payments — handle_new_user trigger reconciles on signup.
        const { error: pendingError } = await supabase
          .from("pending_payments")
          .upsert(
            {
              email: customerEmail,
              stripe_customer_id: stripeCustomerId,
              stripe_payment_id: paymentId,
              amount_cents: amountPaid,
              affiliate_code: affiliateCode || null,
              test_type: testType,
            },
            { onConflict: "email" }
          );

        if (pendingError) {
          console.error(`[webhook] Failed to store pending payment for ${customerEmail}:`, pendingError.message);
        } else {
          console.log(`[webhook] Stored pending payment for ${customerEmail} (${testType}) — reconcile on signup`);
        }
      } else {
        // Append the purchased test to the user's purchased_tests array
        const { error: appendError } = await supabase.rpc("append_purchased_test", {
          p_user_id: profile.id,
          p_test_type: testType,
        });
        if (appendError) {
          console.error(`[webhook] append_purchased_test error:`, appendError.message);
        }
        console.log(`[webhook] Marked ${customerEmail} as paid — granted ${testType} access`);
      }

      // ── 2. Affiliate attribution ─────────────────────────────────────────────
      if (affiliateCode) {
        let credited = false;

        // 2a. Admin-created affiliate codes (influencers, partners)
        const { data: affiliate } = await supabase
          .from("affiliates")
          .select("id, commission_rate")
          .eq("code", affiliateCode)
          .eq("active", true)
          .single();

        if (affiliate) {
          const commissionDollars = (amountPaid / 100) * Number(affiliate.commission_rate);

          // Insert with stripe_payment_id for idempotency — unique index makes retries safe
          const { error: referralError } = await supabase
            .from("affiliate_referrals")
            .insert({
              affiliate_id: affiliate.id,
              customer_id: profile?.id || null,
              purchase_amount: amountPaid / 100,
              commission_amount: commissionDollars,
              stripe_payment_id: paymentId,
            });

          if (referralError) {
            // Unique violation = already credited (retry). Any other error = log it.
            if (!referralError.message.includes("unique")) {
              console.error(`[webhook] Failed to insert affiliate referral:`, referralError.message);
            } else {
              console.log(`[webhook] Affiliate referral already credited (dupe stripe_payment_id)`);
            }
          } else {
            await supabase.rpc("increment_affiliate_stats", {
              p_affiliate_id: affiliate.id,
              p_earned: commissionDollars,
            });
            console.log(`[webhook] Admin affiliate ${affiliateCode}: $${commissionDollars.toFixed(2)}`);
          }

          credited = true;
        }

        // 2b. User referral codes (profiles.referral_code) — one commission per sale
        if (!credited) {
          const commissionCents = Math.round(amountPaid * COMMISSION_RATE);
          const { data: creditResult, error: creditError } = await supabase.rpc(
            "credit_profile_referral",
            {
              p_referral_code: affiliateCode,
              p_commission_cents: commissionCents,
            }
          );

          if (creditError) {
            console.error(`[webhook] credit_profile_referral error:`, creditError.message);
          } else if (creditResult?.[0]?.credited) {
            console.log(
              `[webhook] User referral ${affiliateCode}: $${(commissionCents / 100).toFixed(2)} → ${creditResult[0].referrer_id}`
            );
          } else {
            console.log(`[webhook] Code ${affiliateCode} not found — no commission credited`);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[webhook] Error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
