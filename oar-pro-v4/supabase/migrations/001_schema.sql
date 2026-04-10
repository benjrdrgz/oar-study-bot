-- OAR Pro v4 — Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  account_type TEXT DEFAULT 'customer' CHECK (account_type IN ('customer', 'preview', 'admin')),
  is_paid BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_payment_id TEXT,
  paid_at TIMESTAMPTZ,
  test_date DATE,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  affiliate_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- CONTENT TABLES (protected by RLS)
-- ============================================
CREATE TABLE lessons (
  id INTEGER PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  content_html TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  passage TEXT,
  options TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE formulas (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  latex TEXT NOT NULL,
  description TEXT,
  example TEXT,
  memory_trick TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE worked_problems (
  id SERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  section TEXT NOT NULL,
  difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
  problem_text TEXT NOT NULL,
  hints TEXT[],
  solution_steps JSONB NOT NULL,
  final_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PROGRESS TABLES
-- ============================================
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('drill', 'test', 'lesson_quiz', 'diagnostic', 'adaptive')),
  section TEXT,
  total_questions INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  time_seconds INTEGER,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE topic_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  section TEXT NOT NULL,
  attempted INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  mastery_level TEXT DEFAULT 'unstarted' CHECK (mastery_level IN ('unstarted', 'weak', 'developing', 'strong', 'mastered')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic)
);

CREATE TABLE study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  study_date DATE NOT NULL,
  minutes_studied INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  UNIQUE(user_id, study_date)
);

CREATE TABLE adaptive_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  predicted_score INTEGER,
  math_score INTEGER,
  reading_score INTEGER,
  mechanical_score INTEGER,
  total_time_seconds INTEGER,
  question_sequence JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AFFILIATE SYSTEM
-- ============================================
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL DEFAULT 0.20,
  total_referred INTEGER DEFAULT 0,
  total_earned DECIMAL DEFAULT 0,
  total_paid DECIMAL DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  customer_id UUID REFERENCES profiles(id),
  purchase_amount DECIMAL NOT NULL DEFAULT 29.00,
  commission_amount DECIMAL NOT NULL,
  paid_out BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_is_paid ON profiles(is_paid);
CREATE INDEX idx_profiles_account_type ON profiles(account_type);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX idx_topic_mastery_user ON topic_mastery(user_id);
CREATE INDEX idx_study_streaks_user_date ON study_streaks(user_id, study_date);
CREATE INDEX idx_adaptive_tests_user ON adaptive_tests(user_id);
CREATE INDEX idx_questions_section ON questions(section);
CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_affiliates_code ON affiliates(code);
CREATE INDEX idx_affiliate_referrals_affiliate ON affiliate_referrals(affiliate_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Increment affiliate stats (called by Stripe webhook)
CREATE OR REPLACE FUNCTION increment_affiliate_stats(
  p_affiliate_id UUID,
  p_earned DECIMAL
)
RETURNS VOID AS $$
BEGIN
  UPDATE affiliates
  SET total_referred = total_referred + 1,
      total_earned = total_earned + p_earned
  WHERE id = p_affiliate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's study plan (ordered lessons by weakness)
CREATE OR REPLACE FUNCTION get_study_plan(p_user_id UUID)
RETURNS TABLE(
  lesson_id INTEGER,
  title TEXT,
  section TEXT,
  mastery TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id as lesson_id,
    l.title,
    l.section,
    COALESCE(tm.mastery_level, 'unstarted') as mastery,
    COALESCE(lp.status, 'not_started') as status
  FROM lessons l
  LEFT JOIN topic_mastery tm ON tm.user_id = p_user_id AND tm.topic = l.title
  LEFT JOIN lesson_progress lp ON lp.user_id = p_user_id AND lp.lesson_id = l.id
  ORDER BY
    CASE COALESCE(tm.mastery_level, 'unstarted')
      WHEN 'unstarted' THEN 0
      WHEN 'weak' THEN 1
      WHEN 'developing' THEN 2
      WHEN 'strong' THEN 3
      WHEN 'mastered' THEN 4
    END ASC,
    l.sort_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
