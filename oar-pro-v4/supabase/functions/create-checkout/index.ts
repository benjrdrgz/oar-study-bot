// OAR Pro v4 — Stripe Checkout Session Creator (multi-test)
// Supports: OAR ($97/$67), ASVAB ($47/$37), AFOQT ($97/$67), SIFT ($127/$97)
//
// Pricing: all prices set inline via price_data — no pre-created Stripe price IDs needed.
// Affiliate codes: validated against DB before applying discount (same as before).
// test_type passed via metadata so webhook knows which test to grant.
//
// Backward compat: test_type defaults to 'OAR' if not sent.
//
// — Benjamin Rodriguez

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

// ── Test catalog ─────────────────────────────────────────────────────────────
// Each entry: display name, full price (cents), affiliate/deal price (cents)
// Add new tests here — no Stripe dashboard setup required (inline price_data).

interface TestConfig {
  name: string;
  fullCents: number;
  dealCents: number;
}

const TEST_CATALOG: Record<string, TestConfig> = {
  'OAR':    { name: 'OAR Pro — Lifetime Access',          fullCents: 9700,  dealCents: 6700  },
  'ASVAB':  { name: 'ASVAB Prep — Lifetime Access',       fullCents: 4700,  dealCents: 3700  },
  'AFOQT':  { name: 'AFOQT Prep — Lifetime Access',       fullCents: 9700,  dealCents: 6700  },
  'SIFT':   { name: 'SIFT Prep — Lifetime Access',        fullCents: 12700, dealCents: 9700  },
  'ASTB-E': { name: 'ASTB-E Full — Lifetime Access',      fullCents: 12700, dealCents: 9700  },
};

/**
 * Validate an affiliate/referral code against the DB.
 * Returns the validated code (uppercase) or "" if not found.
 */
async function validateAffiliateCode(code: string): Promise<string> {
  if (!code || code.trim().length === 0) return "";

  const clean = code.trim().toUpperCase();

  // 1. Admin-created affiliate codes
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("code")
    .eq("code", clean)
    .eq("active", true)
    .single();

  if (affiliate) return clean;

  // 2. User referral codes (profiles.referral_code)
  const { data: referrer } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("referral_code", clean)
    .single();

  if (referrer) return clean;

  return "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, affiliate_code, test_type } = await req.json();

    // Resolve test config — default to OAR for backward compat
    const testKey = (test_type || 'OAR').trim().toUpperCase().replace('ASTB-E', 'ASTB-E');
    const testConfig = TEST_CATALOG[testKey] || TEST_CATALOG['OAR'];

    // Validate affiliate code
    const validatedCode = await validateAffiliateCode(affiliate_code || "");
    const hasCode = !!validatedCode;
    const unitAmount = hasCode ? testConfig.dealCents : testConfig.fullCents;

    const origin =
      req.headers.get("origin") ||
      "https://oar.armedprep.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: testConfig.name,
              description: "Adaptive practice tests • AI tutor • Lifetime access",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/#/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/`,
      customer_email: email && email.trim() ? email.trim() : undefined,
      billing_address_collection: "auto",
      metadata: {
        affiliate_code: validatedCode,    // empty string if invalid
        amount_cents: String(unitAmount),
        test_type: testKey,               // NEW: tells webhook which test to grant
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
