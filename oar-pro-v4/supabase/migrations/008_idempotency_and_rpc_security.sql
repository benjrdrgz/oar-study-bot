-- OAR Pro v4 — Migration 008: Idempotency + RPC Security
--
-- Fixes:
--   1. Webhook idempotency: unique constraint on stripe_payment_id in affiliate_referrals
--      → Stripe can retry the same event 100x and affiliates only get credited once
--   2. Unique constraint on profiles.stripe_payment_id
--      → prevents double-processing a payment at the profile level
--   3. credit_profile_referral: restrict to service_role only
--      → authenticated users cannot self-credit referral earnings via supabase.rpc()
--   4. generate_profile_referral_code: own-user-only for authenticated callers
--      → users can't generate/overwrite referral codes for other users

-- ============================================
-- 1. IDEMPOTENCY: stripe_payment_id uniqueness
-- ============================================

-- Prevent the same Stripe payment from being recorded twice on profiles
-- (webhook retry safety — UPDATE on dup is a no-op because of WHERE clause, but belt+suspenders)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_stripe_payment_id
  ON profiles(stripe_payment_id)
  WHERE stripe_payment_id IS NOT NULL;

-- Prevent double affiliate crediting if Stripe retries the event
-- webhook INSERTs into affiliate_referrals — if payment_id already exists, it fails cleanly
ALTER TABLE affiliate_referrals
  ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_affiliate_referrals_payment_id
  ON affiliate_referrals(stripe_payment_id)
  WHERE stripe_payment_id IS NOT NULL;

-- ============================================
-- 2. credit_profile_referral — SERVICE_ROLE ONLY
--    auth.role() reads from the JWT, not the executing role.
--    Even inside SECURITY DEFINER, auth.role() returns the caller's JWT role.
--    'service_role' JWT → webhook access only. 'authenticated'/'anon' → blocked.
-- ============================================
CREATE OR REPLACE FUNCTION credit_profile_referral(
  p_referral_code TEXT,
  p_commission_cents INTEGER DEFAULT 1675
)
RETURNS TABLE(credited BOOLEAN, referrer_id UUID) AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
  -- Restrict to service_role (webhook) only
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'credit_profile_referral: restricted to internal use only';
  END IF;

  SELECT id INTO v_referrer_id
  FROM profiles
  WHERE referral_code = p_referral_code
  LIMIT 1;

  IF v_referrer_id IS NOT NULL THEN
    UPDATE profiles
    SET
      referral_earnings_cents = referral_earnings_cents + p_commission_cents,
      referral_count = referral_count + 1
    WHERE id = v_referrer_id;

    RETURN QUERY SELECT TRUE, v_referrer_id;
  ELSE
    RETURN QUERY SELECT FALSE, NULL::UUID;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. generate_profile_referral_code — OWN-USER ONLY for authenticated callers
--    service_role can generate for any user (admin use, auto-triggers).
--    authenticated users can only generate for themselves.
-- ============================================
CREATE OR REPLACE FUNCTION generate_profile_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT;
  attempts INTEGER := 0;
BEGIN
  -- Authenticated users can only generate their own code
  IF auth.role() = 'authenticated' AND p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'generate_profile_referral_code: can only generate your own referral code';
  END IF;

  -- Return existing code if already set
  SELECT referral_code INTO code FROM profiles WHERE id = p_user_id;
  IF code IS NOT NULL THEN
    RETURN code;
  END IF;

  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, (floor(random() * length(chars)))::integer + 1, 1);
    END LOOP;

    BEGIN
      UPDATE profiles SET referral_code = code WHERE id = p_user_id AND referral_code IS NULL;
      IF FOUND THEN
        RETURN code;
      END IF;
    EXCEPTION WHEN unique_violation THEN
      NULL; -- collision, retry
    END;

    attempts := attempts + 1;
    IF attempts > 50 THEN
      RAISE EXCEPTION 'Could not generate unique referral code after 50 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- — Benjamin Rodriguez
