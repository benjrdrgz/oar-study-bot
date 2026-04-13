-- OAR Pro v4 — Migration 013: Multi-Test Schema
-- Expands platform from OAR-only to multi-test (ASVAB, AFOQT, SIFT, ASTB-E).
--
-- Changes:
--   1. questions.test_types TEXT[] — a question can belong to multiple tests
--   2. lessons.test_types TEXT[]  — same
--   3. profiles.purchased_tests TEXT[] — per-test access tracking
--   4. pending_payments.test_type TEXT — preserves test through pay-before-signup flow
--   5. append_purchased_test() RPC — safe array append for webhook
--
-- Backward compat:
--   - All existing questions/lessons default to ['OAR']
--   - Math/Reading/Mechanical shared with ASVAB immediately (same content)
--   - Existing is_paid=true users get purchased_tests=['OAR'] automatically
--   - isPaid() in frontend is now an alias for hasAccess('OAR') — no breakage
--
-- — Benjamin Rodriguez

-- ── 1. questions.test_types ────────────────────────────────────────────────

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS test_types TEXT[] DEFAULT ARRAY['OAR']::TEXT[];

CREATE INDEX IF NOT EXISTS idx_questions_test_types
  ON questions USING GIN(test_types);

-- Backfill: all existing questions are OAR
UPDATE questions
  SET test_types = ARRAY['OAR']::TEXT[]
  WHERE test_types IS NULL OR test_types = '{}';

-- Share Math/Reading/Mechanical with ASVAB.
-- These core sections are identical across both tests — no new content needed.
UPDATE questions
  SET test_types = ARRAY['OAR', 'ASVAB']::TEXT[]
  WHERE section IN ('Math', 'Reading', 'Mechanical');

-- ── 2. lessons.test_types ──────────────────────────────────────────────────

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS test_types TEXT[] DEFAULT ARRAY['OAR']::TEXT[];

CREATE INDEX IF NOT EXISTS idx_lessons_test_types
  ON lessons USING GIN(test_types);

UPDATE lessons
  SET test_types = ARRAY['OAR']::TEXT[]
  WHERE test_types IS NULL OR test_types = '{}';

-- Share Math/Reading/Mechanical lessons with ASVAB
UPDATE lessons
  SET test_types = ARRAY['OAR', 'ASVAB']::TEXT[]
  WHERE section IN ('Math', 'Reading', 'Mechanical');

-- ── 3. profiles.purchased_tests ────────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS purchased_tests TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill: existing paid users get OAR access
UPDATE profiles
  SET purchased_tests = ARRAY['OAR']::TEXT[]
  WHERE is_paid = true
    AND (purchased_tests IS NULL OR purchased_tests = '{}');

-- Preview/admin accounts get access to all current tests
UPDATE profiles
  SET purchased_tests = ARRAY['OAR', 'ASVAB', 'AFOQT', 'SIFT', 'ASTB-E']::TEXT[]
  WHERE account_type IN ('preview', 'admin')
    AND (purchased_tests IS NULL OR purchased_tests = '{}');

-- ── 4. pending_payments.test_type ──────────────────────────────────────────
-- Preserves which test was purchased when user pays before signing up.

ALTER TABLE pending_payments
  ADD COLUMN IF NOT EXISTS test_type TEXT NOT NULL DEFAULT 'OAR';

-- ── 5. append_purchased_test RPC ───────────────────────────────────────────
-- Called by the Stripe webhook after payment to append a test to the user's array.
-- Safe: does not duplicate if test already in array.
-- SECURITY DEFINER: callable by service_role only (webhook uses service key).

CREATE OR REPLACE FUNCTION append_purchased_test(p_user_id UUID, p_test_type TEXT)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET purchased_tests = array_append(
    COALESCE(purchased_tests, ARRAY[]::TEXT[]),
    p_test_type
  )
  WHERE id = p_user_id
    AND NOT (COALESCE(purchased_tests, ARRAY[]::TEXT[]) @> ARRAY[p_test_type]::TEXT[]);
$$;

-- ── 6. handle_new_user trigger update ──────────────────────────────────────
-- Reconcile pending_payments on signup: grant the correct test, not just is_paid.
-- Replaces the existing trigger with an updated version.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pending RECORD;
BEGIN
  -- Create profile row for new user
  INSERT INTO public.profiles (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Check for pending payment (user paid before signing up)
  SELECT * INTO v_pending
  FROM public.pending_payments
  WHERE email = NEW.email
  LIMIT 1;

  IF FOUND THEN
    -- Grant access and mark paid
    UPDATE public.profiles
    SET
      is_paid             = true,
      stripe_customer_id  = v_pending.stripe_customer_id,
      stripe_payment_id   = v_pending.stripe_payment_id,
      paid_at             = NOW(),
      affiliate_code_used = v_pending.affiliate_code,
      purchased_tests     = COALESCE(purchased_tests, ARRAY[]::TEXT[])
                            || CASE
                                 WHEN NOT (COALESCE(purchased_tests, ARRAY[]::TEXT[])
                                           @> ARRAY[COALESCE(v_pending.test_type, 'OAR')]::TEXT[])
                                 THEN ARRAY[COALESCE(v_pending.test_type, 'OAR')]::TEXT[]
                                 ELSE ARRAY[]::TEXT[]
                               END
    WHERE id = NEW.id;

    -- Clean up
    DELETE FROM public.pending_payments WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$;
