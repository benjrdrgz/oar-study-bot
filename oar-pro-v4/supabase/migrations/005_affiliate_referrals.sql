-- OAR Pro v4 — Migration 005: Affiliate & Referral System
--
-- Pricing model:
--   Normal price:          $97  (STRIPE_PRICE_ID_FULL)
--   With affiliate code:   $67  (STRIPE_PRICE_ID_FULL + STRIPE_AFFILIATE_COUPON_ID = $30 off)
--   Affiliate commission:  25% of sale price
--     → referred sale ($67):   $16.75 to affiliate
--     → non-referred ($97):    no commission
--
-- Buyer DOES get $30 off when using a code. Affiliate earns from our margin.

-- ============================================
-- 1. ADD REFERRAL FIELDS TO PROFILES
-- ============================================

-- Personal referral code shown on profile page
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Earnings credited in cents (avoid float drift)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_earnings_cents INTEGER DEFAULT 0;

-- Count of successful referrals
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- ============================================
-- 2. UPDATE AFFILIATE TABLE DEFAULTS
-- ============================================

ALTER TABLE affiliates ALTER COLUMN commission_rate SET DEFAULT 0.25;

-- ============================================
-- 3. UPDATE AFFILIATE REFERRALS DEFAULT PURCHASE AMOUNT
-- ============================================

-- Referred sale = $67 (after $30 affiliate discount)
ALTER TABLE affiliate_referrals ALTER COLUMN purchase_amount SET DEFAULT 67.00;

-- ============================================
-- 4. INDEX ON REFERRAL CODE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- ============================================
-- 5. FUNCTION: Generate unique referral code
-- 6-char uppercase alphanumeric, no I/O/0/1 (visual confusion).
-- ============================================

CREATE OR REPLACE FUNCTION generate_profile_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT;
  attempts INTEGER := 0;
BEGIN
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
      NULL; -- collision, try again
    END;

    attempts := attempts + 1;
    IF attempts > 50 THEN
      RAISE EXCEPTION 'Could not generate unique referral code after 50 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. FUNCTION: Credit a profile-based referral
-- p_referral_code: the code that was used
-- p_commission_cents: 25% of amount_total from Stripe (calculated in webhook)
-- ============================================

CREATE OR REPLACE FUNCTION credit_profile_referral(
  p_referral_code TEXT,
  p_commission_cents INTEGER DEFAULT 1675  -- 25% of $67 = $16.75
)
RETURNS TABLE(credited BOOLEAN, referrer_id UUID) AS $$
DECLARE
  v_referrer_id UUID;
BEGIN
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
-- 7. TRIGGER: Auto-generate referral code when user becomes paid
-- ============================================

CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_paid = TRUE AND (OLD.is_paid = FALSE OR OLD.is_paid IS NULL) AND NEW.referral_code IS NULL THEN
    PERFORM generate_profile_referral_code(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_paid ON profiles;
CREATE TRIGGER on_profile_paid
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION auto_generate_referral_code();

-- — Benjamin Rodriguez
