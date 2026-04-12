// OAR Pro v4 — Adaptive Test View (CAT Simulation)
// Route: #/adaptive
// "Am I Ready?" full OAR simulation with adaptive difficulty
// — Benjamin Rodriguez

// ==========================================
// STATE
// ==========================================
let catState = null;

function resetCatState() {
  catState = {
    phase: 'intro',           // intro | testing | break | results
    sections: ['Math', 'Reading', 'Mechanical'],
    sectionConfig: {
      Math:       { total: 10, timeLimit: 25 * 60 },
      Reading:    { total: 10, timeLimit: 25 * 60 },
      Mechanical: { total: 10, timeLimit: 15 * 60 }
    },
    currentSectionIdx: 0,
    currentQuestionIdx: 0,
    currentDifficulty: 2,     // Start medium
    timerSeconds: 0,
    timerInterval: null,
    answered: false,
    questionSequence: [],      // {question_id, section, difficulty_shown, correct, time_ms}
    sectionResults: {
      Math:       { correct: 0, total: 0, points: 0 },
      Reading:    { correct: 0, total: 0, points: 0 },
      Mechanical: { correct: 0, total: 0, points: 0 }
    },
    startTime: null,
    questionStartTime: null,
    availableQuestions: {},     // Pre-fetched by section+difficulty
    usedQuestionIds: new Set()
  };
}


// ==========================================
// SECTION LABELS & ICONS
// ==========================================
const SECTION_META = {
  Math:       { icon: '&#128208;', color: 'var(--accent)',  label: 'Math Knowledge' },
  Reading:    { icon: '&#128214;', color: 'var(--green)',   label: 'Reading Comprehension' },
  Mechanical: { icon: '&#9881;',   color: 'var(--yellow)',  label: 'Mechanical Comprehension' }
};


// ==========================================
// INTRO SCREEN
// ==========================================
async function renderAdaptiveIntro() {
  const app = document.getElementById('app');

  // Get previous test history
  const history = await Store.getAdaptiveTestHistory();
  const lastTest = history.length > 0 ? history[0] : null;

  app.innerHTML = `
    <div style="max-width:600px;margin:0 auto;text-align:center">
      <h1 style="font-size:32px;font-weight:800;margin-bottom:8px">Am I Ready?</h1>
      <p class="text-muted mb-8" style="font-size:16px">Full adaptive OAR simulation. Questions get harder or easier based on your answers.</p>

      <div class="card" style="text-align:left;margin-bottom:20px">
        <div class="card-title" style="margin-bottom:12px">Test Structure</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${catState.sections.map(sec => {
            const cfg = catState.sectionConfig[sec];
            const meta = SECTION_META[sec];
            return `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:20px">${meta.icon}</span>
                  <span style="font-weight:600">${meta.label}</span>
                </div>
                <div class="text-muted text-sm">${cfg.total} Qs &bull; ${Math.round(cfg.timeLimit / 60)} min</div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="margin-top:12px;font-size:13px;color:var(--text-3)">
          30 total questions &bull; ~65 minutes &bull; No going back
        </div>
      </div>

      <div class="callout callout-warning" style="text-align:left;margin-bottom:20px">
        <div class="callout-title">How It Works</div>
        <ul style="margin:0;padding-left:18px;line-height:1.8;font-size:14px">
          <li>Questions adapt to your level &mdash; correct answers increase difficulty</li>
          <li>You cannot skip or go back to previous questions</li>
          <li>Each section is timed separately</li>
          <li>Your predicted OAR score (20-80) is calculated at the end</li>
        </ul>
      </div>

      ${lastTest ? `
        <div class="card" style="text-align:left;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="card-title">Last Attempt</div>
              <div class="text-muted text-sm">${new Date(lastTest.completed_at || lastTest.created_at).toLocaleDateString()}</div>
            </div>
            <div style="font-size:32px;font-weight:800;color:${lastTest.predicted_score >= 50 ? 'var(--green)' : 'var(--yellow)'}">
              ${lastTest.predicted_score}
            </div>
          </div>
        </div>
      ` : ''}

      <button class="btn btn-primary btn-lg" onclick="beginAdaptiveTest()" style="width:100%;justify-content:center">
        Start Simulation
      </button>

      <p class="text-muted text-sm" style="margin-top:12px">
        <a href="#/practice">Or try a quick practice quiz instead</a>
      </p>
    </div>
  `;
}


// ==========================================
// BEGIN TEST — pre-fetch questions
// ==========================================
async function beginAdaptiveTest() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="text-align:center;padding:80px 0">
      <div class="skeleton skeleton-title" style="margin:0 auto 16px"></div>
      <p class="text-muted">Preparing your adaptive test...</p>
    </div>
  `;

  resetCatState();
  catState.phase = 'testing';
  catState.startTime = Date.now();

  // Pre-fetch questions for all sections and difficulties.
  // For Math + Mechanical: mix static + generated so repeat runs see different problems.
  // For Reading: static only (can't generate reading passages).
  for (const section of catState.sections) {
    catState.availableQuestions[section] = {};
    const [easy, medium, hard] = await Promise.all([
      Store.getQuestions({ section, difficulty: 1, limit: 20 }),
      Store.getQuestions({ section, difficulty: 2, limit: 20 }),
      Store.getQuestions({ section, difficulty: 3, limit: 20 })
    ]);

    // For Math/Mechanical, mix in generated questions at each difficulty level
    // so users don't see the same questions across multiple sim runs.
    let genEasy = [], genMed = [], genHard = [];
    if (section !== 'Reading' && typeof Store.getGeneratedQuestions === 'function') {
      genEasy = Store.getGeneratedQuestions(10, { section, difficulty: 1 });
      genMed  = Store.getGeneratedQuestions(10, { section, difficulty: 2 });
      genHard = Store.getGeneratedQuestions(10, { section, difficulty: 3 });
    }

    catState.availableQuestions[section][1] = shuffleArray([...easy, ...genEasy]);
    catState.availableQuestions[section][2] = shuffleArray([...medium, ...genMed]);
    catState.availableQuestions[section][3] = shuffleArray([...hard, ...genHard]);
  }

  // Start first section timer
  const firstSection = catState.sections[0];
  catState.timerSeconds = catState.sectionConfig[firstSection].timeLimit;
  startCatTimer();

  // Add keyboard listener
  document.addEventListener('keydown', handleCatKeyboard);

  renderCatQuestion();
}


// ==========================================
// GET NEXT ADAPTIVE QUESTION
// ==========================================
function getNextAdaptiveQuestion() {
  const section = catState.sections[catState.currentSectionIdx];
  const difficulty = catState.currentDifficulty;

  // Try requested difficulty first, then adjacent
  const tryOrder = [difficulty];
  if (difficulty < 3) tryOrder.push(difficulty + 1);
  if (difficulty > 1) tryOrder.push(difficulty - 1);
  // Fallback to any remaining difficulty
  [1, 2, 3].forEach(d => { if (!tryOrder.includes(d)) tryOrder.push(d); });

  for (const d of tryOrder) {
    const pool = catState.availableQuestions[section]?.[d] || [];
    const available = pool.filter(q => !catState.usedQuestionIds.has(q.id));
    if (available.length > 0) {
      const question = available[0];
      catState.usedQuestionIds.add(question.id);
      return { question, actualDifficulty: d };
    }
  }

  return null; // No questions available
}


// ==========================================
// RENDER CAT QUESTION
// ==========================================
function renderCatQuestion() {
  const app = document.getElementById('app');
  const section = catState.sections[catState.currentSectionIdx];
  const sectionCfg = catState.sectionConfig[section];
  const meta = SECTION_META[section];
  const qIdx = catState.currentQuestionIdx;

  const result = getNextAdaptiveQuestion();
  if (!result) {
    // No more questions for this section, advance
    advanceSection();
    return;
  }

  const { question: q, actualDifficulty } = result;
  catState._currentQuestion = q;
  catState._currentActualDifficulty = actualDifficulty;
  catState.questionStartTime = Date.now();
  catState.answered = false;

  const progressPct = Math.round(((qIdx + 1) / sectionCfg.total) * 100);
  const diffLabel = ['', 'Easy', 'Medium', 'Hard'][actualDifficulty] || '';
  const diffBadgeClass = actualDifficulty === 3 ? 'badge-red' : actualDifficulty === 2 ? 'badge-yellow' : 'badge-green';

  app.innerHTML = `
    <div style="max-width:680px">
      <!-- Section header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px">
          ${catState.sections.map((s, i) => `
            <div style="display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;
              ${i === catState.currentSectionIdx ? `background:${SECTION_META[s].color};color:white` : `background:var(--surface-2);color:var(--text-3)${i < catState.currentSectionIdx ? ';opacity:.5' : ''}`}">
              ${i < catState.currentSectionIdx ? '&#10003; ' : ''}${s}
            </div>
          `).join('')}
        </div>
        <div id="catTimer" style="font-size:16px;font-weight:600;color:var(--text-2);font-variant-numeric:tabular-nums">
          ${formatCatTime(catState.timerSeconds)}
        </div>
      </div>

      <!-- Progress bar -->
      <div style="height:4px;background:var(--surface-2);border-radius:2px;margin-bottom:20px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:${meta.color};border-radius:2px;transition:width .3s"></div>
      </div>

      <!-- Question info -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-weight:700;font-size:14px">${section} &mdash; Question ${qIdx + 1} of ${sectionCfg.total}</span>
        <span class="badge ${diffBadgeClass}">${diffLabel}</span>
      </div>

      <!-- Question text -->
      <div style="font-size:17px;line-height:1.7;margin-bottom:24px;font-weight:500" id="catQuestionText">
        ${q.question_html || q.question_text || ''}
      </div>

      <!-- Answer options -->
      <div id="catAnswerOptions" style="display:flex;flex-direction:column;gap:10px">
        ${renderCatOptions(q)}
      </div>

      <!-- Explanation -->
      <div id="catExplanation" style="display:none;margin-top:20px"></div>

      <!-- Next button -->
      <div style="margin-top:20px;display:flex;justify-content:flex-end">
        <button class="btn btn-primary" id="catNextBtn" style="display:none" onclick="catNextQuestion()">
          Next &rarr;
        </button>
      </div>

      <!-- Keyboard hint -->
      <div class="text-muted text-sm" style="margin-top:12px;text-align:center">
        Press 1-4 to answer &bull; Cannot go back
      </div>
    </div>
  `;

  triggerMathJax();
}

function renderCatOptions(q) {
  const opts = q.options || [];
  const options = [
    { key: 'A', text: opts[0] },
    { key: 'B', text: opts[1] },
    { key: 'C', text: opts[2] },
    { key: 'D', text: opts[3] }
  ];

  return options.map((opt, idx) => `
    <div class="card" id="cat-option-${opt.key}"
         style="padding:14px 18px;cursor:pointer;transition:all .15s"
         onclick="catSelectAnswer('${opt.key}')">
      <div style="display:flex;align-items:flex-start;gap:12px">
        <span style="width:28px;height:28px;border-radius:50%;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;color:var(--text-2)">${idx + 1}</span>
        <span style="flex:1;line-height:1.6">${opt.text || ''}</span>
      </div>
    </div>
  `).join('');
}


// ==========================================
// ANSWER SELECTION (CAT)
// ==========================================
function catSelectAnswer(key) {
  if (catState.answered) return;
  catState.answered = true;

  const q = catState._currentQuestion;
  // Convert correct_index (0-3) to letter (A-D)
  const correct = ['A', 'B', 'C', 'D'][q.correct_index] || q.correct_answer || 'A';
  const isCorrect = key === correct;
  const timeMs = Date.now() - catState.questionStartTime;
  const section = catState.sections[catState.currentSectionIdx];
  const difficulty = catState._currentActualDifficulty;

  // Record in sequence — store full question data for post-test review
  catState.questionSequence.push({
    question_id: q.id,
    question_html: q.question_html || q.question_text || '',
    options: q.options || [],
    correct_index: typeof q.correct_index === 'number' ? q.correct_index : ['A','B','C','D'].indexOf(correct),
    explanation: q.explanation || '',
    selected_key: key,
    correct_key: correct,
    section,
    difficulty_shown: difficulty,
    correct: isCorrect,
    time_ms: timeMs
  });

  // Update section results
  catState.sectionResults[section].total++;
  if (isCorrect) {
    catState.sectionResults[section].correct++;
    // Points weighted by difficulty: easy=1, medium=2, hard=3
    catState.sectionResults[section].points += difficulty;
  }

  // Adaptive difficulty adjustment
  if (isCorrect) {
    catState.currentDifficulty = Math.min(catState.currentDifficulty + 1, 3);
  } else {
    catState.currentDifficulty = Math.max(catState.currentDifficulty - 1, 1);
  }

  // Visual feedback
  ['A', 'B', 'C', 'D'].forEach(k => {
    const el = document.getElementById(`cat-option-${k}`);
    if (!el) return;
    el.style.cursor = 'default';
    el.onclick = null;

    if (k === correct) {
      el.style.borderColor = 'var(--green)';
      el.style.background = 'var(--green-bg)';
    } else if (k === key && !isCorrect) {
      el.style.borderColor = 'var(--red)';
      el.style.background = 'var(--red-bg)';
    } else {
      el.style.opacity = '0.5';
    }
  });

  // Show explanation briefly
  const explDiv = document.getElementById('catExplanation');
  if (explDiv) {
    explDiv.style.display = 'block';
    explDiv.innerHTML = `
      <div class="callout ${isCorrect ? 'callout-example' : 'callout-warning'}" style="padding:12px 14px">
        <div class="callout-title" style="margin-bottom:2px">${isCorrect ? 'Correct!' : 'Incorrect'}</div>
        ${q.explanation ? `<p style="font-size:13px">${q.explanation}</p>` : `<p style="font-size:13px">The correct answer is ${correct}.</p>`}
      </div>
    `;
    triggerMathJax();
  }

  // Show next button
  const nextBtn = document.getElementById('catNextBtn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
}


// ==========================================
// NEXT QUESTION / SECTION ADVANCE
// ==========================================
function catNextQuestion() {
  catState.currentQuestionIdx++;
  const section = catState.sections[catState.currentSectionIdx];
  const sectionCfg = catState.sectionConfig[section];

  if (catState.currentQuestionIdx >= sectionCfg.total) {
    advanceSection();
  } else {
    renderCatQuestion();
  }
}

function advanceSection() {
  // Stop timer
  if (catState.timerInterval) clearInterval(catState.timerInterval);

  catState.currentSectionIdx++;

  if (catState.currentSectionIdx >= catState.sections.length) {
    // All sections done
    showCatResults();
    return;
  }

  // Show break screen
  catState.phase = 'break';
  renderBreakScreen();
}


// ==========================================
// BREAK SCREEN
// ==========================================
function renderBreakScreen() {
  const app = document.getElementById('app');
  const completedSection = catState.sections[catState.currentSectionIdx - 1];
  const nextSection = catState.sections[catState.currentSectionIdx];
  const nextMeta = SECTION_META[nextSection];
  const nextCfg = catState.sectionConfig[nextSection];

  const completedResults = catState.sectionResults[completedSection];
  const completedPct = completedResults.total > 0
    ? Math.round((completedResults.correct / completedResults.total) * 100)
    : 0;

  app.innerHTML = `
    <div style="max-width:500px;margin:0 auto;text-align:center;padding:40px 0">
      <div style="font-size:48px;margin-bottom:16px">&#10003;</div>
      <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">
        ${completedSection} Section Complete
      </h2>
      <p class="text-muted mb-8">You got ${completedResults.correct}/${completedResults.total} correct (${completedPct}%)</p>

      <div class="divider"></div>

      <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">
        Up Next: ${nextMeta.icon} ${nextMeta.label}
      </h3>
      <p class="text-muted mb-8">${nextCfg.total} questions &bull; ${Math.round(nextCfg.timeLimit / 60)} minutes</p>

      <button class="btn btn-primary btn-lg" onclick="startNextSection()" style="width:100%;justify-content:center">
        Begin ${nextSection} Section
      </button>

      <p class="text-muted text-sm" style="margin-top:12px">Take a breath. You've got this.</p>
    </div>
  `;
}

function startNextSection() {
  catState.phase = 'testing';
  catState.currentQuestionIdx = 0;
  catState.currentDifficulty = 2; // Reset to medium for each section

  const section = catState.sections[catState.currentSectionIdx];
  catState.timerSeconds = catState.sectionConfig[section].timeLimit;
  startCatTimer();

  renderCatQuestion();
}


// ==========================================
// TIMER (CAT)
// ==========================================
function startCatTimer() {
  if (catState.timerInterval) clearInterval(catState.timerInterval);

  catState.timerInterval = setInterval(() => {
    catState.timerSeconds--;
    updateCatTimerDisplay();

    if (catState.timerSeconds <= 0) {
      clearInterval(catState.timerInterval);
      // Time's up for this section — advance
      advanceSection();
    }
  }, 1000);
}

function updateCatTimerDisplay() {
  const el = document.getElementById('catTimer');
  if (!el) return;

  el.textContent = formatCatTime(catState.timerSeconds);

  if (catState.timerSeconds <= 60) {
    el.style.color = 'var(--red)';
    el.style.fontWeight = '800';
  } else {
    el.style.color = 'var(--text-2)';
    el.style.fontWeight = '600';
  }
}

function formatCatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}


// ==========================================
// KEYBOARD HANDLER (CAT)
// ==========================================
function handleCatKeyboard(e) {
  if (!catState || catState.phase !== 'testing') return;

  const keyMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
  if (keyMap[e.key] && !catState.answered) {
    catSelectAnswer(keyMap[e.key]);
  } else if ((e.key === 'Enter' || e.key === ' ') && catState.answered) {
    e.preventDefault();
    catNextQuestion();
  }
}


// ==========================================
// RESULTS SCREEN
// ==========================================
async function showCatResults() {
  // Clean up
  if (catState.timerInterval) clearInterval(catState.timerInterval);
  document.removeEventListener('keydown', handleCatKeyboard);
  catState.phase = 'results';

  const totalTime = Math.round((Date.now() - catState.startTime) / 1000);

  // Calculate predicted OAR score (20-80 scale)
  // Each correct answer earns points weighted by difficulty (easy=1, medium=2, hard=3)
  // Max possible: 10 questions * 3 difficulty * 3 sections = 90 points
  const totalPoints = Object.values(catState.sectionResults).reduce((sum, s) => sum + s.points, 0);
  const maxPoints = 90; // 10 * 3 * 3
  const rawRatio = totalPoints / maxPoints;
  const predictedScore = Math.round(20 + rawRatio * 60);

  // Section scores (each on 20-80 scale)
  const sectionScores = {};
  for (const [sec, result] of Object.entries(catState.sectionResults)) {
    const maxSecPts = 30; // 10 * 3
    const secRatio = result.points / maxSecPts;
    sectionScores[sec] = Math.round(20 + secRatio * 60);
  }

  // Get previous tests for comparison
  const history = await Store.getAdaptiveTestHistory();
  const prevTest = history.length > 0 ? history[0] : null;

  // Identify weak topics from question sequence
  const topicStats = {};
  for (const entry of catState.questionSequence) {
    // We need to find the topic from the question data
    const section = entry.section;
    if (!topicStats[section]) topicStats[section] = { correct: 0, total: 0 };
    topicStats[section].total++;
    if (entry.correct) topicStats[section].correct++;
  }

  // Save result
  await Store.saveAdaptiveTest({
    predicted_score: predictedScore,
    math_score: sectionScores.Math,
    reading_score: sectionScores.Reading,
    mechanical_score: sectionScores.Mechanical,
    total_time_seconds: totalTime,
    question_sequence: catState.questionSequence,
    completed_at: new Date().toISOString()
  });

  const isReady = predictedScore >= 50;
  const scoreColor = isReady ? 'var(--green)' : 'var(--yellow)';

  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="max-width:640px;margin:0 auto">
      <!-- Header -->
      <div class="text-center" style="margin-bottom:32px">
        <div style="font-size:48px;margin-bottom:12px">${isReady ? '&#127942;' : '&#128170;'}</div>
        <h1 style="font-size:28px;font-weight:800;margin-bottom:4px">
          ${isReady ? 'You ARE Ready!' : 'Keep Studying These Areas'}
        </h1>
        <p class="text-muted" style="font-size:15px">
          ${isReady ? 'Your performance suggests you\'re prepared for the OAR.' : 'You\'re making progress. Focus on the areas below to boost your score.'}
        </p>
      </div>

      <!-- Predicted Score -->
      <div class="card text-center" style="margin-bottom:20px;padding:32px;border-color:${scoreColor}">
        <div class="text-muted text-sm" style="text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Predicted OAR Score</div>
        <div style="font-size:64px;font-weight:800;color:${scoreColor};line-height:1">${predictedScore}</div>
        <div class="text-muted" style="font-size:14px;margin-top:4px">out of 80</div>
        ${prevTest ? `
          <div style="margin-top:12px;font-size:14px">
            ${predictedScore > prevTest.predicted_score
              ? `<span style="color:var(--green)">&#9650; ${predictedScore - prevTest.predicted_score} points from last test</span>`
              : predictedScore < prevTest.predicted_score
              ? `<span style="color:var(--red)">&#9660; ${prevTest.predicted_score - predictedScore} points from last test</span>`
              : `<span class="text-muted">Same as last test</span>`
            }
          </div>
        ` : ''}
      </div>

      <!-- Section Breakdown -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-title" style="margin-bottom:16px">Section Breakdown</div>
        ${catState.sections.map(sec => {
          const result = catState.sectionResults[sec];
          const score = sectionScores[sec];
          const meta = SECTION_META[sec];
          const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
          const barWidth = Math.round(((score - 20) / 60) * 100);
          const barColor = score >= 50 ? 'var(--green)' : score >= 40 ? 'var(--yellow)' : 'var(--red)';

          return `
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <div style="display:flex;align-items:center;gap:8px">
                  <span>${meta.icon}</span>
                  <span style="font-weight:600;font-size:14px">${sec}</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <span class="text-muted text-sm">${result.correct}/${result.total} (${pct}%)</span>
                  <span style="font-weight:800;font-size:18px;color:${barColor}">${score}</span>
                </div>
              </div>
              <div style="height:8px;background:var(--surface-2);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${barWidth}%;background:${barColor};border-radius:4px;transition:width .5s"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Time & Stats -->
      <div class="grid-3" style="margin-bottom:20px">
        <div class="card text-center">
          <div style="font-size:24px;font-weight:800">${formatCatTime(totalTime)}</div>
          <div class="text-muted text-sm">Total Time</div>
        </div>
        <div class="card text-center">
          <div style="font-size:24px;font-weight:800">
            ${catState.questionSequence.filter(q => q.correct).length}/${catState.questionSequence.length}
          </div>
          <div class="text-muted text-sm">Correct</div>
        </div>
        <div class="card text-center">
          <div style="font-size:24px;font-weight:800">
            ${Math.round(catState.questionSequence.reduce((s, q) => s + q.time_ms, 0) / catState.questionSequence.length / 1000)}s
          </div>
          <div class="text-muted text-sm">Avg per Q</div>
        </div>
      </div>

      <!-- Difficulty progression -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-title" style="margin-bottom:12px">Difficulty Progression</div>
        <div style="display:flex;gap:3px;align-items:flex-end;height:60px">
          ${catState.questionSequence.map(q => {
            const h = q.difficulty_shown * 20;
            const color = q.correct ? 'var(--green)' : 'var(--red)';
            return `<div style="flex:1;height:${h}px;background:${color};border-radius:2px;min-width:4px" title="${q.section} D${q.difficulty_shown} ${q.correct ? 'Correct' : 'Wrong'}"></div>`;
          }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-top:6px">
          <span>Q1</span>
          <span>Q${catState.questionSequence.length}</span>
        </div>
        <div style="display:flex;gap:16px;margin-top:8px;font-size:12px">
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--green);border-radius:2px"></span> Correct</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--red);border-radius:2px"></span> Incorrect</span>
        </div>
      </div>

      <!-- Previous tests comparison -->
      ${history.length > 1 ? `
        <div class="card" style="margin-bottom:20px">
          <div class="card-title" style="margin-bottom:12px">Score History</div>
          ${history.slice(0, 5).map((t, i) => {
            const d = new Date(t.completed_at || t.created_at).toLocaleDateString();
            const c = t.predicted_score >= 50 ? 'var(--green)' : 'var(--yellow)';
            const w = Math.round(((t.predicted_score - 20) / 60) * 100);
            return `
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                <span class="text-muted text-sm" style="width:80px">${i === 0 ? 'Latest' : d}</span>
                <div style="flex:1;height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
                  <div style="height:100%;width:${w}%;background:${c};border-radius:3px"></div>
                </div>
                <span style="font-weight:700;color:${c};width:30px;text-align:right">${t.predicted_score}</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Actions -->
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="navigate('#/adaptive')">Take Again</button>
        <button class="btn btn-secondary" onclick="shareCatResult(${predictedScore}, ${JSON.stringify(sectionScores).replace(/"/g, '&quot;')}, ${totalTime})">Share Result</button>
        <button class="btn btn-secondary" onclick="navigate('#/practice')">Practice Weak Areas</button>
        <button class="btn btn-secondary" onclick="navigate('#/dashboard')">Dashboard</button>
      </div>

      <!-- POST-TEST QUESTION REVIEW -->
      <div style="margin-top:40px;padding-top:32px;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <h2 style="font-size:18px;font-weight:700;margin:0">Question Review</h2>
          <span style="font-size:13px;color:var(--text-3)">${catState.questionSequence.length} questions</span>
        </div>
        ${catState.questionSequence.map((entry, i) => {
          const opts = entry.options || [];
          const correctLetter = entry.correct_key || ['A','B','C','D'][entry.correct_index] || 'A';
          const selectedLetter = entry.selected_key || '';
          const diffLabel = ['', 'Easy', 'Medium', 'Hard'][entry.difficulty_shown] || '';
          const diffBadge = entry.difficulty_shown === 3 ? 'badge-red' : entry.difficulty_shown === 2 ? 'badge-yellow' : 'badge-green';
          return `
            <div class="card" style="margin-bottom:12px;border-left:3px solid ${entry.correct ? 'var(--green)' : 'var(--red)'}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <span style="font-size:11px;font-weight:700;color:var(--text-3);background:var(--surface-2);padding:2px 6px;border-radius:4px">Q${i + 1}</span>
                  <span class="badge ${diffBadge}">${diffLabel}</span>
                  <span class="badge">${entry.section}</span>
                </div>
                <span style="font-size:13px;font-weight:700;color:${entry.correct ? 'var(--green)' : 'var(--red)'};white-space:nowrap">
                  ${entry.correct ? '&#10003; Correct' : '&#10005; Wrong'}
                </span>
              </div>
              ${entry.question_html ? `<div style="font-size:14px;line-height:1.6;margin-bottom:12px">${entry.question_html}</div>` : ''}
              <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:${entry.explanation ? '10px' : '0'}">
                ${['A','B','C','D'].map((letter, idx) => {
                  const optText = opts[idx] || '';
                  if (!optText) return '';
                  const isCorrect = letter === correctLetter;
                  const isSelected = letter === selectedLetter && !isCorrect;
                  const bg = isCorrect ? 'var(--green-bg)' : isSelected ? 'var(--red-bg)' : 'var(--surface-2)';
                  const border = isCorrect ? 'var(--green)' : isSelected ? 'var(--red)' : 'var(--border)';
                  const marker = isCorrect ? ' &#10003;' : isSelected ? ' &#10005;' : '';
                  return `<div style="display:flex;gap:8px;padding:7px 12px;background:${bg};border:1px solid ${border};border-radius:8px;font-size:13px">
                    <span style="font-weight:700;flex-shrink:0;min-width:20px">${letter}${marker}</span>
                    <span style="flex:1">${optText}</span>
                  </div>`;
                }).join('')}
              </div>
              ${entry.explanation ? `<div style="font-size:13px;color:var(--text-2);padding:10px 12px;background:var(--surface-2);border-radius:8px;border-left:3px solid var(--accent);margin-top:4px">${entry.explanation}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// SHARE CAT RESULT (score card modal)
// ==========================================
async function shareCatResult(predictedScore, sectionScores, totalTime) {
  if (typeof sectionScores === 'string') {
    try { sectionScores = JSON.parse(sectionScores); } catch(e) { sectionScores = {}; }
  }
  const user = typeof getUser === 'function' ? await getUser() : null;
  const userName = user?.user_metadata?.full_name || user?.email || '';
  const minutes = Math.floor((totalTime || 0) / 60);
  const subline = minutes > 0
    ? `Adaptive test completed in ${minutes} min`
    : 'Adaptive test complete';

  let badge = null;
  if (predictedScore >= 65) badge = 'Elite Range';
  else if (predictedScore >= 55) badge = 'Competitive';
  else if (predictedScore >= 50) badge = 'Passing';

  const breakdown = Object.entries(sectionScores || {})
    .slice(0, 3)
    .map(([sec, score]) => [sec.slice(0, 4), String(score)]);

  if (typeof showScoreCardModal !== 'function') {
    alert('Score card not available — please refresh.');
    return;
  }
  await showScoreCardModal({
    title: 'Adaptive CAT',
    score: predictedScore,
    scoreLabel: 'Predicted OAR',
    subline: subline,
    breakdown: breakdown,
    badge: badge,
    userName: userName,
  });
}


// ==========================================
// UTILITY (shared shuffleArray from practice.js)
// ==========================================
if (typeof shuffleArray === 'undefined') {
  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}


// ==========================================
// REGISTER ROUTE
// ==========================================
route('/adaptive', async () => {
  resetCatState();
  await renderAdaptiveIntro();
});
