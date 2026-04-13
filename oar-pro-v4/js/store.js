// OAR Pro v4 — State Management (Supabase-backed)
// Replaces all localStorage calls with Supabase queries

const Store = {
  // Cache for current session
  _cache: {},

  // ==========================================
  // LESSON PROGRESS
  // ==========================================
  async getLessonProgress(lessonId) {
    const user = await getUser();
    if (!user) return null;

    const cacheKey = `lesson_${lessonId}`;
    if (this._cache[cacheKey]) return this._cache[cacheKey];

    const { data } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    this._cache[cacheKey] = data;
    return data;
  },

  async setLessonProgress(lessonId, status, timeSpent) {
    const user = await getUser();
    if (!user) return;

    const { data } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        status: status,
        time_spent_seconds: timeSpent || 0,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      }, { onConflict: 'user_id,lesson_id' })
      .select()
      .single();

    this._cache[`lesson_${lessonId}`] = data;
    return data;
  },

  async getAllLessonProgress() {
    const user = await getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    return data || [];
  },

  // ==========================================
  // QUIZ RESULTS
  // ==========================================
  async saveQuizResult(mode, section, totalQuestions, correct, timeSeconds, answers) {
    const user = await getUser();
    if (!user) return;

    const { data } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        mode,
        section,
        total_questions: totalQuestions,
        correct,
        time_seconds: timeSeconds,
        answers
      })
      .select()
      .single();

    // Also update topic mastery
    if (answers) {
      await this.updateTopicMastery(answers);
    }

    // Log study streak
    await this.logStudyActivity(0, totalQuestions);

    return data;
  },

  async getQuizHistory(limit = 20) {
    const user = await getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  },

  // ==========================================
  // TOPIC MASTERY
  // ==========================================
  async updateTopicMastery(answers) {
    const user = await getUser();
    if (!user) return;

    // Group answers by topic, weighting by difficulty so hard questions count more
    const topicStats = {};
    for (const [qId, answer] of Object.entries(answers)) {
      const topic = answer.topic || 'Unknown';
      const section = answer.section || 'Unknown';
      if (!topicStats[topic]) topicStats[topic] = { section, correct: 0, total: 0 };
      // Weight: Hard=2.0, Medium=1.5, Easy=1.0 — mirrors CAT scoring philosophy
      const diff = answer.difficulty || answer.difficulty_shown || 1;
      const w = diff === 3 ? 2.0 : diff === 2 ? 1.5 : 1.0;
      topicStats[topic].total += w;
      if (answer.correct) topicStats[topic].correct += w;
    }

    // Upsert each topic
    for (const [topic, stats] of Object.entries(topicStats)) {
      // Get current mastery
      const { data: existing } = await supabase
        .from('topic_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic', topic)
        .single();

      const totalAttempted = (existing?.attempted || 0) + stats.total;
      const totalCorrect = (existing?.correct || 0) + stats.correct;
      const accuracy = totalAttempted > 0 ? totalCorrect / totalAttempted : 0;

      let level = 'unstarted';
      if (totalAttempted >= 8) {
        // Require meaningful sample before assigning mastery (8 weighted attempts)
        if (accuracy >= 0.9) level = 'mastered';
        else if (accuracy >= 0.7) level = 'strong';
        else if (accuracy >= 0.5) level = 'developing';
        else level = 'weak';
      }

      await supabase
        .from('topic_mastery')
        .upsert({
          user_id: user.id,
          topic: topic,
          section: stats.section,
          attempted: totalAttempted,
          correct: totalCorrect,
          mastery_level: level,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,topic' });
    }
  },

  async getAllTopicMastery() {
    const user = await getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('topic_mastery')
      .select('*')
      .eq('user_id', user.id);

    return data || [];
  },

  // ==========================================
  // STUDY STREAKS
  // ==========================================
  async logStudyActivity(minutesStudied, questionsAnswered) {
    const user = await getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('study_streaks')
      .select('*')
      .eq('user_id', user.id)
      .eq('study_date', today)
      .single();

    if (existing) {
      await supabase
        .from('study_streaks')
        .update({
          minutes_studied: existing.minutes_studied + minutesStudied,
          questions_answered: existing.questions_answered + questionsAnswered
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('study_streaks')
        .insert({
          user_id: user.id,
          study_date: today,
          minutes_studied: minutesStudied,
          questions_answered: questionsAnswered
        });
    }
  },

  async getStreaks(days = 30) {
    const user = await getUser();
    if (!user) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('study_streaks')
      .select('*')
      .eq('user_id', user.id)
      .gte('study_date', startDate.toISOString().split('T')[0])
      .order('study_date', { ascending: false });

    return data || [];
  },

  async getCurrentStreak() {
    const streaks = await this.getStreaks(60);
    if (!streaks.length) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 60; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (streaks.find(s => s.study_date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break; // Gap found
      }
    }

    return streak;
  },

  // ==========================================
  // ADAPTIVE TESTS
  // ==========================================
  async saveAdaptiveTest(result) {
    const user = await getUser();
    if (!user) return;

    return await supabase
      .from('adaptive_tests')
      .insert({
        user_id: user.id,
        ...result
      })
      .select()
      .single();
  },

  async getAdaptiveTestHistory() {
    const user = await getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('adaptive_tests')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    return data || [];
  },

  // ==========================================
  // CONTENT FETCHING (RLS-protected)
  // ==========================================
  async getLessons(testType) {
    let query = supabase
      .from('lessons')
      .select('id, section, title, description, tags, sort_order, test_types')
      .order('sort_order');
    // Filter by test if provided — uses GIN index on test_types array
    if (testType) query = query.contains('test_types', [testType]);
    const { data } = await query;
    return data || [];
  },

  async getLesson(id) {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  async getQuestions(filters = {}) {
    // Fetch a broader pool, then shuffle client-side and slice.
    // Supabase doesn't support ORDER BY random() via PostgREST, so we shuffle in JS.
    let query = supabase.from('questions').select('*');

    // Filter by test — uses GIN index on test_types array (migration 013)
    if (filters.testType) query = query.contains('test_types', [filters.testType]);
    if (filters.section) query = query.eq('section', filters.section);
    if (filters.topic) query = query.eq('topic', filters.topic);
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);

    const { data } = await query;
    let rows = data || [];

    if (filters.random) {
      // Fisher-Yates shuffle for uniform randomness
      for (let i = rows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rows[i], rows[j]] = [rows[j], rows[i]];
      }
    }

    if (filters.limit) rows = rows.slice(0, filters.limit);
    return rows;
  },

  // Generate fresh parameterized questions (no memorization possible)
  getGeneratedQuestions(count, filter = {}) {
    if (typeof generateQuestions === 'function') {
      return generateQuestions(count, filter);
    }
    return [];
  },

  // Mix static + generated questions for a drill.
  // ratio = percentage of generated (0.0 to 1.0). Default 0.5 = half and half.
  async getMixedQuestions(totalCount, filters = {}, generatedRatio = 0.5) {
    const generatedCount = Math.round(totalCount * generatedRatio);
    const staticCount = totalCount - generatedCount;

    const [staticQs, genQs] = await Promise.all([
      staticCount > 0
        ? this.getQuestions({ ...filters, limit: staticCount, random: true })
        : Promise.resolve([]),
      Promise.resolve(this.getGeneratedQuestions(generatedCount, filters))
    ]);

    // Interleave and shuffle
    const mixed = [...staticQs, ...genQs];
    for (let i = mixed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
    }
    return mixed;
  },

  async getFormulas() {
    const { data } = await supabase
      .from('formulas')
      .select('*')
      .order('sort_order');
    return data || [];
  },

  async getWorkedProblems(topic, difficulty) {
    let query = supabase.from('worked_problems').select('*');
    if (topic) query = query.eq('topic', topic);
    if (difficulty) query = query.eq('difficulty', difficulty);
    query = query.limit(5);

    const { data } = await query;
    return data || [];
  },

  // ==========================================
  // STUDY PLAN
  // ==========================================
  async getStudyPlan() {
    const user = await getUser();
    if (!user) return [];

    const { data } = await supabase.rpc('get_study_plan', { p_user_id: user.id });
    return data || [];
  },

  // ==========================================
  // PROFILE
  // ==========================================
  async updateProfile(updates) {
    const user = await getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    return data;
  },

  // ==========================================
  // SCORE PREDICTOR
  // ==========================================
  async predictScore() {
    const mastery = await this.getAllTopicMastery();
    const quizHistory = await this.getQuizHistory(10);

    if (!mastery.length && !quizHistory.length) return { total: null, math: null, reading: null, mechanical: null };

    // Calculate accuracy by section
    const sections = { Math: [], Reading: [], Mechanical: [] };
    for (const m of mastery) {
      const key = m.section === 'math' ? 'Math' : m.section === 'reading' ? 'Reading' : 'Mechanical';
      if (m.attempted > 0) {
        sections[key].push(m.correct / m.attempted);
      }
    }

    const avgAccuracy = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0.5;

    const mathAcc = avgAccuracy(sections.Math);
    const readAcc = avgAccuracy(sections.Reading);
    const mechAcc = avgAccuracy(sections.Mechanical);
    const overallAcc = (mathAcc + readAcc + mechAcc) / 3;

    // Scale to 20-80 OAR range with power curve (more realistic — harder to get 80)
    // Linear was too generous: 50% acc → 50 score felt wrong. Power curve: 50%→44, 75%→60, 90%→72, 100%→80
    const scale = (acc) => Math.round(20 + Math.pow(acc, 1.3) * 60);

    return {
      total: scale(overallAcc),
      math: scale(mathAcc),
      reading: scale(readAcc),
      mechanical: scale(mechAcc),
      confidence: mastery.length > 5 ? 'medium' : 'low'
    };
  },

  // Clear session cache
  clearCache() {
    this._cache = {};
  }
};
