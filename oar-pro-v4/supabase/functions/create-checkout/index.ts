// OAR Pro v4 — Stripe Checkout Session Creator
// Uses inline price_data — no STRIPE_PRICE_ID env var required.
//
// Pricing:
//   No affiliate code (or invalid code): $97
//   Valid affiliate code:                $67 ($30 discount)
//
// Security: affiliate codes are validated against DB before applying discount.
// Passing a random string does NOT get you $67 — code must exist in
//   affiliates.code (active=true) OR profiles.referral_code.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PRICE_ID_FULL    = 'price_1TLSKOJ5g57Qu9urZXKPADqg'; // $97 — OAR Pro Lifetime
const PRICE_ID_REFERRAL = 'price_1TLSKPJ5g57Qu9urh2tqtYau'; // $67 — Referral discount
const FULL_PRICE_CENTS = 9700;
const DEAL_PRICE_CENTS = 6700;

/**
 * Validate an affiliate/referral code against the DB.
 * Returns the validated code (uppercase) if found, or "" if not.
 */
async function validateAffiliateCode(code: string): Promise<string> {
  if (!code || code.trim().length === 0) return "";

  const clean = code.trim().toUpperCase();

  // 1. Check admin-created affiliate codes
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("code")
    .eq("code", clean)
    .eq("active", true)
    .single();

  if (affiliate) return clean;

  // 2. Check user referral codes (profiles.referral_code)
  const { data: referrer } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("referral_code", clean)
    .single();

  if (referrer) return clean;

  // Not found in either table — code is invalid, full price applies
  return "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, affiliate_code } = await req.json();

    // Validate the code against the DB — no discount for fake codes
    const validatedCode = await validateAffiliateCode(affiliate_code || "");
    const hasCode = !!validatedCode;
    const priceId = hasCode ? PRICE_ID_REFERRAL : PRICE_ID_FULL;
    const unitAmount = hasCode ? DEAL_PRICE_CENTS : FULL_PRICE_CENTS;

    const origin =
      req.headers.get("origin") ||
      "https://oar-pro-v4.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/#/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/`,
      customer_email: email && email.trim() ? email.trim() : undefined,
      billing_address_collection: "auto",
      metadata: {
        affiliate_code: validatedCode, // empty string if invalid
        amount_cents: String(unitAmount),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[create-checkout] Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
