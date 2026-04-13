-- Migration 016: Free Preview Lesson Access
-- Allows unauthenticated (anon) users to read the 3 foundational preview lessons.
-- These are unlocked after email capture on the diagnostic results page.
-- Paid users already have full access via the existing "Paid users can read lessons" policy.
-- — Benjamin Rodriguez

CREATE POLICY "Anyone can read preview lessons"
  ON lessons FOR SELECT
  USING (id IN (1, 5, 7));
  -- 1 = Arithmetic Fundamentals (Math)
  -- 5 = Main Idea & Purpose (Reading)
  -- 7 = Forces & Newton's Laws (Mechanical)
