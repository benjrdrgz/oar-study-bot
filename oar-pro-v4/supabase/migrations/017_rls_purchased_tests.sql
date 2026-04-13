-- OAR Pro v4 — Migration 017: Update RLS to check purchased_tests
--
-- Context: Migration 013 added purchased_tests[] to profiles for per-test access.
-- The old RLS on lessons/questions/formulas only checked is_paid + account_type.
-- Any user granted access via purchased_tests (without is_paid=true) was locked out.
-- This migration makes the RLS forward-compatible with the multi-test access model.
--
-- Applied to production via Management API: 2026-04-13
-- — Benjamin Rodriguez

-- ── lessons ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Paid users can read lessons" ON lessons;
CREATE POLICY "Paid users can read lessons"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.is_paid = TRUE
        OR profiles.account_type IN ('preview', 'admin')
        OR cardinality(COALESCE(profiles.purchased_tests, ARRAY[]::TEXT[])) > 0
      )
    )
  );

-- ── questions ──────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Paid users can read questions" ON questions;
CREATE POLICY "Paid users can read questions"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.is_paid = TRUE
        OR profiles.account_type IN ('preview', 'admin')
        OR cardinality(COALESCE(profiles.purchased_tests, ARRAY[]::TEXT[])) > 0
      )
    )
  );

-- ── formulas ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Paid users can read formulas" ON formulas;
CREATE POLICY "Paid users can read formulas"
  ON formulas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.is_paid = TRUE
        OR profiles.account_type IN ('preview', 'admin')
        OR cardinality(COALESCE(profiles.purchased_tests, ARRAY[]::TEXT[])) > 0
      )
    )
  );

-- ── worked_problems ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Paid users can read worked problems" ON worked_problems;
CREATE POLICY "Paid users can read worked problems"
  ON worked_problems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.is_paid = TRUE
        OR profiles.account_type IN ('preview', 'admin')
        OR cardinality(COALESCE(profiles.purchased_tests, ARRAY[]::TEXT[])) > 0
      )
    )
  );
