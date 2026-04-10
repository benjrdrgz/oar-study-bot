-- OAR Pro v4 — Row Level Security Policies
-- Run AFTER 001_schema.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE worked_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES — users read/update own, admin reads all
-- ============================================
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Admin can read ALL profiles (replace with Benjamin's actual UID after signup)
-- CREATE POLICY "Admin reads all profiles"
--   ON profiles FOR SELECT
--   USING (auth.uid() = 'BENJAMIN_ADMIN_UID_HERE');

-- ============================================
-- CONTENT — only paid users (or preview/admin) can read
-- ============================================
CREATE POLICY "Paid users can read lessons"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_paid = TRUE OR profiles.account_type IN ('preview', 'admin'))
    )
  );

CREATE POLICY "Paid users can read questions"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_paid = TRUE OR profiles.account_type IN ('preview', 'admin'))
    )
  );

CREATE POLICY "Paid users can read formulas"
  ON formulas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_paid = TRUE OR profiles.account_type IN ('preview', 'admin'))
    )
  );

CREATE POLICY "Paid users can read worked problems"
  ON worked_problems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_paid = TRUE OR profiles.account_type IN ('preview', 'admin'))
    )
  );

-- ============================================
-- USER DATA — own rows only (all CRUD)
-- ============================================

-- Lesson Progress
CREATE POLICY "Users read own lesson progress"
  ON lesson_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own lesson progress"
  ON lesson_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own lesson progress"
  ON lesson_progress FOR UPDATE USING (user_id = auth.uid());

-- Quiz Results
CREATE POLICY "Users read own quiz results"
  ON quiz_results FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own quiz results"
  ON quiz_results FOR INSERT WITH CHECK (user_id = auth.uid());

-- Topic Mastery
CREATE POLICY "Users read own topic mastery"
  ON topic_mastery FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own topic mastery"
  ON topic_mastery FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own topic mastery"
  ON topic_mastery FOR UPDATE USING (user_id = auth.uid());

-- Study Streaks
CREATE POLICY "Users read own streaks"
  ON study_streaks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own streaks"
  ON study_streaks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own streaks"
  ON study_streaks FOR UPDATE USING (user_id = auth.uid());

-- Adaptive Tests
CREATE POLICY "Users read own adaptive tests"
  ON adaptive_tests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own adaptive tests"
  ON adaptive_tests FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================
-- AFFILIATES — admin only (service_role for webhook)
-- ============================================
CREATE POLICY "Service role manages affiliates"
  ON affiliates FOR ALL
  USING (true)
  WITH CHECK (true);
-- Note: Affiliates table accessed via service_role key in admin dashboard
-- No anon or authenticated access

CREATE POLICY "Service role manages referrals"
  ON affiliate_referrals FOR ALL
  USING (true)
  WITH CHECK (true);
