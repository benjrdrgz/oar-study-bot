-- OAR Pro v4 — Migration 006: Pending Payments Reconciliation
--
-- Problem: Stripe webhook fires BEFORE user creates their account.
-- Webhook can't find a profile to mark as paid → user is stuck.
--
-- Fix:
--   1. Store payment in pending_payments when no profile found
--   2. handle_new_user() trigger checks pending_payments on signup
--      and immediately marks the new profile as paid

-- ============================================
-- 1. PENDING PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pending_payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_payment_id  TEXT,
  amount_cents       INTEGER NOT NULL DEFAULT 9700,
  affiliate_code     TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_payments_email ON pending_payments(email);

-- ============================================
-- 2. UPDATE handle_new_user TRIGGER
--    Checks pending_payments on every new signup
--    and immediately grants paid access if found
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  pending RECORD;
BEGIN
  -- Create base profile
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  -- Reconcile pending payment if one exists for this email
  SELECT * INTO pending
  FROM pending_payments
  WHERE email = NEW.email
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.profiles SET
      is_paid            = true,
      stripe_customer_id = pending.stripe_customer_id,
      stripe_payment_id  = pending.stripe_payment_id,
      paid_at            = pending.created_at,
      affiliate_code_used = pending.affiliate_code
    WHERE id = NEW.id;

    -- Clean up so it can't be used again
    DELETE FROM pending_payments WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- — Benjamin Rodriguez
