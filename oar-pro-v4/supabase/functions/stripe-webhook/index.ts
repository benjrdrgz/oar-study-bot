// OAR Pro v4 — Stripe Webhook Edge Function
// Receives checkout.session.completed events from Stripe
// Marks user as paid in Supabase profiles table

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service_role to bypass RLS
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const stripeCustomerId = session.customer as string;
      const paymentId = session.payment_intent as string;

      // Check for affiliate code in metadata
      const affiliateCode = session.metadata?.affiliate_code;

      if (customerEmail) {
        // Update the user's profile to mark as paid
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .update({
            is_paid: true,
            stripe_customer_id: stripeCustomerId,
            stripe_payment_id: paymentId,
            paid_at: new Date().toISOString(),
            affiliate_code_used: affiliateCode || null,
          })
          .eq("email", customerEmail)
          .select()
          .single();

        if (profileError) {
          // User might not have created account yet — store for later
          console.log(`Profile not found for ${customerEmail}, will be linked on signup`);

          // Alternative: try to find by stripe customer ID
          // Or create a pending_payments table to reconcile later
        } else {
          console.log(`Marked ${customerEmail} as paid (profile: ${profile.id})`);
        }

        // Handle affiliate referral
        if (affiliateCode) {
          const { data: affiliate } = await supabase
            .from("affiliates")
            .select("id, commission_rate")
            .eq("code", affiliateCode)
            .eq("active", true)
            .single();

          if (affiliate) {
            const amount = (session.amount_total || 2900) / 100; // cents to dollars
            const commission = amount * Number(affiliate.commission_rate);

            // Record the referral
            await supabase.from("affiliate_referrals").insert({
              affiliate_id: affiliate.id,
              customer_id: profile?.id || null,
              purchase_amount: amount,
              commission_amount: commission,
            });

            // Update affiliate totals
            await supabase.rpc("increment_affiliate_stats", {
              p_affiliate_id: affiliate.id,
              p_earned: commission,
            });

            console.log(`Affiliate ${affiliateCode}: $${commission} commission on $${amount} sale`);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
