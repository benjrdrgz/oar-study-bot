-- OAR Pro v4 — Migration 007: Security Hardening
--
-- Fixes:
--   1. CRITICAL: Prevent self-escalation of is_paid / account_type via profile UPDATE
--   2. CRITICAL: Enable RLS on pending_payments (no policies = service_role only)
--   3. MEDIUM:   Lock down affiliates / affiliate_referrals tables (drop open policies)
--
-- After this migration:
--   - Authenticated users can only update display_name, test_date, onboarding_complete
--   - is_paid, account_type, stripe IDs, referral fields → service_role only
--   - pending_payments → service_role only (webhook writes, trigger reads via SECURITY DEFINER)
--   - affiliates / affiliate_referrals → service_role only

-- ============================================
-- 1. PROFILE FIELD PROTECTION
--    Trigger runs BEFORE every UPDATE on profiles.
--    If the caller is a regular auth user (not service_role / postgres),
--    silently reset all privileged fields back to their old values.
--    SECURITY INVOKER = runs as the calling role so current_user is accurate.
-- ============================================
CREATE OR REPLACE FUNCTION prevent_profile_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- service_role and postgres are trusted — let them update anything
  IF current_user IN ('service_role', 'postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  -- For all other roles (authenticated, anon) → freeze privileged fields
  NEW.is_paid                 := OLD.is_paid;
  NEW.account_type            := OLD.account_type;
  NEW.stripe_customer_id      := OLD.stripe_customer_id;
  NEW.stripe_payment_id       := OLD.stripe_payment_id;
  NEW.paid_at                 := OLD.paid_at;
  NEW.affiliate_code_used     := OLD.affiliate_code_used;
  NEW.referral_code           := OLD.referral_code;
  NEW.referral_earnings_cents := COALESCE(OLD.referral_earnings_cents, 0);
  NEW.referral_count          := COALESCE(OLD.referral_count, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Drop if exists from a previous attempt, then recreate
DROP TRIGGER IF EXISTS enforce_profile_field_restrictions ON profiles;

CREATE TRIGGER enforce_profile_field_restrictions
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_profile_privilege_escalation();

-- ============================================
-- 2. PENDING PAYMENTS — RLS LOCK DOWN
--    No policies = no access for anon/authenticated roles.
--    service_role (webhook) bypasses RLS entirely — still works.
--    handle_new_user() is SECURITY DEFINER (runs as postgres) — still works.
-- ============================================
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- No SELECT / INSERT / UPDATE / DELETE policies for public roles.
-- Intentionally left empty. Only service_role reaches this table.

-- ============================================
-- 3. AFFILIATES & REFERRALS — DROP OPEN POLICIES
--    The existing "Service role manages affiliates" policies use USING(true)
--    which exposes the table to ALL authenticated users. Drop them.
--    With RLS enabled + no policies, service_role still has full access
--    (it bypasses RLS). Regular users get nothing.
-- ============================================
DROP POLICY IF EXISTS "Service role manages affiliates" ON affiliates;
DROP POLICY IF EXISTS "Service role manages referrals" ON affiliate_referrals;

-- Confirm RLS is still on (already enabled in 002, but be explicit)
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. SAFETY NET: ensure profiles RLS UPDATE policy
--    still restricts to own rows (in case it was ever dropped)
-- ============================================
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- The trigger above handles column-level restrictions.
-- This policy just scopes updates to own row.

-- — Benjamin Rodriguez
