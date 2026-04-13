// OAR Pro v4 — Practice View (Quiz Engine)
// Route: #/practice?mode=drill|topic|full|lesson&topic=X&section=X
// — Benjamin Rodriguez

// ==========================================
// STATE
// ==========================================
let quizState = null;

function resetQuizState() {
  // Clear any running timer and keyboard listener before blowing away state
  if (quizState && quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }
  document.removeEventListener('keydown', handleQuizKeyboard);

  quizState = {
    mode: 'drill',
    section: null,
    topic: null,
    questions: [],
    currentIndex: 0,
    answers: {},
    startTime: null,
    timerInterval: null,
    timerSeconds: 0,
    timerLimit: 0,
    answered: false
  };
}

// Clean up quiz state on any navigation away from practice
window.addEventListener('hashchange', () => {
  if (!window.location.hash.startsWith('#/practice')) {
    if (quizState && quizState.timerInterval) clearInterval(quizState.timerInterval);
    document.removeEventListener('keydown', handleQuizKeyboard);
  }
});


// ==========================================
// MODE CONFIG
// ==========================================
const QUIZ_MODES = {
  drill:    { label: 'Quick Drill',     count: 5,  timer: 120,  description: '5 random questions, 2-minute timer' },
  topic:    { label: 'Topic Practice',  count: 15, timer: 0,    description: 'Filter by section/topic, untimed' },
  full:     { label: 'Full Test',       count: 30, timer: 2400, description: '30 questions (10/section), 40-minute timer' },
  lesson:   { label: 'Lesson Quiz',     count: 5,  timer: 0,    description: '5 questions from a specific topic' },
  infinite: { label: 'Infinite Drill',  count: 10, timer: 0,    description: '10 fresh parameterized problems (different numbers every time)' }
};


// ==========================================
// PRACTICE LANDING (mode selector)
// ==========================================
async function renderPracticeLanding(urlParams) {
  const app = document.getElementById('app');

  // If URL has mode param, jump straight to quiz
  if (urlParams.mode) {
    await startQuiz(urlParams.mode, urlParams.section, urlParams.topic);
    return;
  }

  // Render sidebar with study sidebar if available
  if (typeof renderStudySidebar === 'function') {
    await renderStudySidebar(null);
  }

  // Get mastery data for recommendations
  const mastery = await Store.getAllTopicMastery();
  const weakTopics = mastery.filter(m => m.mastery_level === 'weak' || m.mastery_level === 'developing');

  app.innerHTML = `
    <div style="max-width:640px">
      <h1 style="font-size:28px;font-weight:800;margin-bottom:8px">Practice</h1>
      <p class="text-muted mb-8">Choose a practice mode to test your knowledge.</p>

      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="card" style="cursor:pointer" onclick="startQuiz('drill')">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="card-title">Quick Drill</div>
              <div class="card-subtitle">5 real OAR-style questions &bull; 2-minute timer &bull; Math, Reading &amp; Mechanical</div>
            </div>
            <span style="font-size:24px">&#9889;</span>
          </div>
        </div>

        <div class="card" style="border-color:var(--accent)">
          <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="startQuiz('infinite')">
            <div>
              <div class="card-title">Infinite Drill <span class="badge badge-blue" style="margin-left:6px">UNLIMITED</span></div>
              <div class="card-subtitle">10 fresh math &amp; mechanics problems &bull; New numbers every time &bull; Animated diagrams &bull; Untimed</div>
            </div>
            <span style="font-size:24px">&#8734;</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);align-items:center">
            <span class="text-muted text-sm" style="margin-right:4px">Difficulty:</span>
            <button class="btn btn-sm" onclick="event.stopPropagation();startQuiz('infinite',null,null,1)" style="background:var(--green-bg);color:var(--green);border:1px solid var(--green);padding:4px 12px;font-size:12px">Easy</button>
            <button class="btn btn-sm" onclick="event.stopPropagation();startQuiz('infinite',null,null,2)" style="background:var(--yellow-bg);color:var(--yellow);border:1px solid var(--yellow);padding:4px 12px;font-size:12px">Medium</button>
            <button class="btn btn-sm" onclick="event.stopPropagation();startQuiz('infinite',null,null,3)" style="background:var(--red-bg);color:var(--red);border:1px solid var(--red);padding:4px 12px;font-size:12px">Hard</button>
            <span class="text-muted text-sm" style="margin-left:auto">or click card for mixed</span>
          </div>
        </div>

        <div class="card" style="cursor:pointer" onclick="showTopicSelector()">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="card-title">Topic Practice</div>
              <div class="card-subtitle">Choose a section or topic &bull; Untimed</div>
            </div>
            <span style="font-size:24px">&#127919;</span>
          </div>
        </div>

        <div class="card" style="cursor:pointer" onclick="startQuiz('full')">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div class="card-title">Full Practice Test</div>
              <div class="card-subtitle">30 questions (10/section) &bull; 40-minute timer</div>
            </div>
            <span style="font-size:24px">&#128221;</span>
          </div>
        </div>
      </div>

      ${weakTopics.length > 0 ? `
        <div class="divider"></div>
        <h2 style="font-size:16px;font-weight:700;margin-bottom:12px">Recommended Practice</h2>
        <div class="callout callout-warning">
          <div class="callout-title">Focus Areas</div>
          <p style="margin-bottom:8px">These topics need more practice:</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${weakTopics.slice(0, 5).map(t => `
              <span class="badge badge-red" style="cursor:pointer" onclick="startQuiz('topic','${t.section}','${t.topic}')">
                ${t.topic}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="divider"></div>
      <h2 style="font-size:16px;font-weight:700;margin-bottom:12px">Recent Results</h2>
      <div id="recentResults"><div class="skeleton skeleton-card"></div></div>
    </div>
  `;

  // Load recent quiz results
  loadRecentResults();
}


// ==========================================
// RECENT RESULTS
// ==========================================
async function loadRecentResults() {
  const container = document.getElementById('recentResults');
  if (!container) return;

  const history = await Store.getQuizHistory(5);

  if (!history.length) {
    container.innerHTML = '<p class="text-muted text-sm">No quiz results yet. Start practicing!</p>';
    return;
  }

  // Render as a compact list (not cards) so users don't confuse with drill mode cards
  container.innerHTML = history.map(r => {
    const pct = r.total_questions > 0 ? Math.round((r.correct / r.total_questions) * 100) : 0;
    const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)';
    const date = new Date(r.created_at).toLocaleDateString();
    const modeLabel = QUIZ_MODES[r.mode]?.label || r.mode;

    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border);font-size:14px">
        <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1">
          <div style="font-weight:600;color:var(--text)">${modeLabel}</div>
          <div class="text-muted text-sm" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${date}${r.section ? ' • ' + r.section : ''}</div>
        </div>
        <div style="display:flex;align-items:baseline;gap:8px;flex-shrink:0">
          <span class="text-muted text-sm">${r.correct}/${r.total_questions}</span>
          <span style="font-weight:700;color:${color};font-size:15px;min-width:42px;text-align:right">${pct}%</span>
        </div>
      </div>
    `;
  }).join('');
}


// ==========================================
// TOPIC SELECTOR
// ==========================================
async function showTopicSelector() {
  const app = document.getElementById('app');
  const lessons = await Store.getLessons();

  // Group unique topics by section
  const sections = {};
  for (const l of lessons) {
    const sec = l.section || 'General';
    if (!sections[sec]) sections[sec] = new Set();
    if (l.tags) l.tags.forEach(t => sections[sec].add(t));
    sections[sec].add(l.title);
  }

  app.innerHTML = `
    <div style="max-width:640px">
      <div style="margin-bottom:16px">
        <a href="#/practice" style="color:var(--text-3);font-size:13px">&larr; Back to Practice</a>
      </div>
      <h1 style="font-size:24px;font-weight:800;margin-bottom:8px">Choose a Topic</h1>
      <p class="text-muted mb-8">Select a section to practice all topics, or pick a specific topic.</p>

      ${Object.entries(sections).map(([secName, topics]) => `
        <div class="card" style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div class="card-title">${secName}</div>
            <button class="btn btn-primary btn-sm" onclick="startQuiz('topic','${secName}')">All ${secName}</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${[...topics].map(t => `
              <span class="badge badge-blue" style="cursor:pointer;padding:6px 14px;font-size:12px"
                    onclick="startQuiz('topic','${secName}','${t}')">
                ${t}
              </span>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}


// ==========================================
// START QUIZ
// ==========================================
async function startQuiz(mode, section, topic, difficulty) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="text-align:center;padding:60px 0">
      <div class="skeleton skeleton-title" style="margin:0 auto 16px"></div>
      <p class="text-muted">Loading questions...</p>
    </div>
  `;

  resetQuizState();
  quizState.mode = mode;
  quizState.section = section || null;
  quizState.topic = topic || null;
  quizState.difficulty = difficulty || null;

  const config = QUIZ_MODES[mode] || QUIZ_MODES.drill;
  quizState.timerLimit = config.timer;

  // Build filters
  const filters = { limit: config.count };
  if (section) filters.section = section;
  if (topic) filters.topic = topic;
  filters.random = true;

  // For full test, fetch 10 per section
  let questions = [];
  if (mode === 'full') {
    const [math, reading, mechanical] = await Promise.all([
      Store.getQuestions({ section: 'Math', limit: 10, random: true }),
      Store.getQuestions({ section: 'Reading', limit: 10, random: true }),
      Store.getQuestions({ section: 'Mechanical', limit: 10, random: true })
    ]);
    questions = [...math, ...reading, ...mechanical];
  } else if (mode === 'infinite') {
    // INFINITE DRILL: pure parameterized generators, untimed, unlimited practice.
    // Every question has randomized numbers + animated diagrams where applicable.
    // Math + mechanical only — Reading can't be generated.
    const genFilter = {};
    if (section && section !== 'all') genFilter.section = section;
    if (difficulty) genFilter.difficulty = difficulty;
    questions = generateQuestions(config.count, genFilter);
  } else if (mode === 'drill') {
    // QUICK DRILL: 5 static hand-crafted OAR-style questions, 2-min timer.
    // Pulls from the 190-question bank (Math, Reading, Mechanical) — real test feel.
    questions = await Store.getQuestions(filters);
  } else {
    questions = await Store.getQuestions(filters);
  }

  // Shuffle questions
  questions = shuffleArray(questions);

  if (!questions.length) {
    app.innerHTML = `
      <div style="max-width:500px;margin:60px auto;text-align:center">
        <h2 style="font-size:22px;font-weight:700;margin-bottom:8px">No Questions Found</h2>
        <p class="text-muted mb-8">We couldn't find questions matching your criteria. Try a different topic or section.</p>
        <button class="btn btn-primary" onclick="navigate('#/practice')">Back to Practice</button>
      </div>
    `;
    return;
  }

  quizState.questions = questions;
  quizState.startTime = Date.now();

  // Start timer if timed mode
  if (quizState.timerLimit > 0) {
    quizState.timerSeconds = quizState.timerLimit;
    startTimer();
  }

  // Add keyboard listener
  document.addEventListener('keydown', handleQuizKeyboard);

  renderQuestion();
}


// ==========================================
// TIMER
// ==========================================
function startTimer() {
  quizState.timerInterval = setInterval(() => {
    quizState.timerSeconds--;
    updateTimerDisplay();

    if (quizState.timerSeconds <= 0) {
      clearInterval(quizState.timerInterval);
      endQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('quizTimer');
  if (!el) return;

  const mins = Math.floor(quizState.timerSeconds / 60);
  const secs = quizState.timerSeconds % 60;
  el.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

  // Turn red under 30 seconds
  if (quizState.timerSeconds <= 30) {
    el.style.color = 'var(--red)';
    el.style.fontWeight = '800';
  } else {
    el.style.color = 'var(--text-2)';
    el.style.fontWeight = '600';
  }
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}


// ==========================================
// RENDER QUESTION
// ==========================================
function renderQuestion() {
  const app = document.getElementById('app');
  const q = quizState.questions[quizState.currentIndex];
  const total = quizState.questions.length;
  const current = quizState.currentIndex + 1;
  const progressPct = Math.round((current / total) * 100);
  const config = QUIZ_MODES[quizState.mode];

  quizState.answered = false;

  app.innerHTML = `
    <div style="max-width:680px">
      <!-- Header: progress + timer -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <span style="font-weight:700;font-size:14px">Question ${current} of ${total}</span>
          <span class="text-muted text-sm" style="margin-left:8px">${config.label}</span>
        </div>
        ${quizState.timerLimit > 0 ? `
          <div id="quizTimer" style="font-size:16px;font-weight:600;color:var(--text-2);font-variant-numeric:tabular-nums">
            ${formatTime(quizState.timerSeconds)}
          </div>
        ` : ''}
      </div>

      <!-- Progress bar -->
      <div style="height:4px;background:var(--surface-2);border-radius:2px;margin-bottom:24px;overflow:hidden">
        <div style="height:100%;width:${progressPct}%;background:var(--accent);border-radius:2px;transition:width .3s"></div>
      </div>

      <!-- Section + difficulty badges -->
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        ${q.section ? `<span class="badge badge-blue">${q.section}</span>` : ''}
        ${q.topic ? `<span class="badge" style="background:var(--surface-2);color:var(--text-3)">${q.topic}</span>` : ''}
        ${q.difficulty ? `<span class="badge ${q.difficulty === 3 ? 'badge-red' : q.difficulty === 2 ? 'badge-yellow' : 'badge-green'}">${['', 'Easy', 'Medium', 'Hard'][q.difficulty] || ''}</span>` : ''}
      </div>

      <!-- Diagram (if generator provided one) -->
      ${q.diagram_svg ? `
        <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center">
          ${q.diagram_svg}
        </div>
      ` : ''}

      <!-- Question text -->
      <div style="font-size:17px;line-height:1.7;margin-bottom:24px;font-weight:500" id="questionText">
        ${q.question_html || (typeof mathifyText === 'function' ? mathifyText(q.question_text) : q.question_text) || ''}
      </div>

      <!-- Answer options -->
      <div id="answerOptions" style="display:flex;flex-direction:column;gap:10px">
        ${renderAnswerOptions(q)}
      </div>

      <!-- Explanation (hidden until answered) -->
      <div id="explanation" style="display:none;margin-top:20px"></div>

      <!-- Navigation -->
      <div id="quizNav" style="display:none;margin-top:20px;justify-content:flex-end">
        <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()">
          ${current === total ? 'Finish Quiz' : 'Next Question'} &rarr;
        </button>
      </div>

      <!-- Keyboard hint -->
      <div class="text-muted text-sm" style="margin-top:16px;text-align:center">
        Press 1-4 to select an answer
      </div>
    </div>
  `;

  triggerMathJax();
}

function renderAnswerOptions(q) {
  // options is a JSON array from Supabase: ["choice1", "choice2", ...]
  const opts = q.options || [];
  const options = [
    { key: 'A', text: opts[0] },
    { key: 'B', text: opts[1] },
    { key: 'C', text: opts[2] },
    { key: 'D', text: opts[3] }
  ];

  return options.map((opt, idx) => `
    <div class="card" id="option-${opt.key}"
         style="padding:14px 18px;cursor:pointer;transition:all .15s"
         onclick="selectAnswer('${opt.key}')">
      <div style="display:flex;align-items:flex-start;gap:12px">
        <span style="width:28px;height:28px;border-radius:50%;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;color:var(--text-2)">${idx + 1}</span>
        <span style="flex:1;line-height:1.6">${typeof mathifyText === 'function' ? mathifyText(opt.text || '') : (opt.text || '')}</span>
      </div>
    </div>
  `).join('');
}


// ==========================================
// ANSWER SELECTION
// ==========================================
function selectAnswer(key) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizState.questions[quizState.currentIndex];
  // Convert correct_index (0-3) to letter (A-D)
  const correct = ['A', 'B', 'C', 'D'][q.correct_index] || q.correct_answer || 'A';
  const isCorrect = key === correct;

  // Store answer
  quizState.answers[q.id] = {
    selected: key,
    correct: isCorrect,
    topic: q.topic || 'Unknown',
    section: q.section || 'Unknown',
    difficulty: q.difficulty || 1
  };

  // Highlight selected and correct
  ['A', 'B', 'C', 'D'].forEach(k => {
    const el = document.getElementById(`option-${k}`);
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

  // Show explanation
  const explDiv = document.getElementById('explanation');
  if (explDiv) {
    explDiv.style.display = 'block';
    explDiv.innerHTML = `
      <div class="callout ${isCorrect ? 'callout-example' : 'callout-warning'}">
        <div class="callout-title">${isCorrect ? 'Correct!' : 'Incorrect'}</div>
        ${q.explanation ? `<p>${typeof mathifyText === 'function' ? mathifyText(q.explanation) : q.explanation}</p>` : `<p>The correct answer is ${correct}.</p>`}
      </div>
    `;
    triggerMathJax();
  }

  // Show nav bar with next button
  const quizNav = document.getElementById('quizNav');
  if (quizNav) quizNav.style.display = 'flex';
}


// ==========================================
// KEYBOARD HANDLING
// ==========================================
function handleQuizKeyboard(e) {
  if (!quizState || quizState.currentIndex >= quizState.questions.length) return;

  const keyMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
  if (keyMap[e.key] && !quizState.answered) {
    selectAnswer(keyMap[e.key]);
  } else if ((e.key === 'Enter' || e.key === ' ') && quizState.answered) {
    e.preventDefault();
    nextQuestion();
  }
}


// ==========================================
// NEXT QUESTION / END QUIZ
// ==========================================
function nextQuestion() {
  quizState.currentIndex++;

  if (quizState.currentIndex >= quizState.questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

async function endQuiz() {
  // Clean up
  if (quizState.timerInterval) clearInterval(quizState.timerInterval);
  document.removeEventListener('keydown', handleQuizKeyboard);

  const totalTime = Math.round((Date.now() - quizState.startTime) / 1000);
  const totalQuestions = quizState.questions.length;
  const correctCount = Object.values(quizState.answers).filter(a => a.correct).length;
  const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Save result
  await Store.saveQuizResult(
    quizState.mode,
    quizState.section,
    totalQuestions,
    correctCount,
    totalTime,
    quizState.answers
  );

  // Build accuracy by topic
  const topicAccuracy = {};
  for (const ans of Object.values(quizState.answers)) {
    const topic = ans.topic;
    if (!topicAccuracy[topic]) topicAccuracy[topic] = { correct: 0, total: 0 };
    topicAccuracy[topic].total++;
    if (ans.correct) topicAccuracy[topic].correct++;
  }

  // Find missed questions
  const missed = quizState.questions.filter(q => {
    const ans = quizState.answers[q.id];
    return ans && !ans.correct;
  });

  const scoreColor = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)';
  const config = QUIZ_MODES[quizState.mode];

  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="max-width:600px;margin:0 auto">
      <div class="text-center" style="margin-bottom:32px">
        <h1 style="font-size:24px;font-weight:800;margin-bottom:8px">${config.label} Complete</h1>
        <p class="text-muted">Here's how you did.</p>
      </div>

      <!-- Score card -->
      <div class="card text-center" style="margin-bottom:20px;padding:32px">
        <div style="font-size:56px;font-weight:800;color:${scoreColor}">${pct}%</div>
        <div class="text-muted" style="font-size:16px;margin-bottom:16px">${correctCount} of ${totalQuestions} correct</div>
        <div style="display:flex;justify-content:center;gap:24px">
          <div>
            <div style="font-size:20px;font-weight:700">${formatTime(totalTime)}</div>
            <div class="text-muted text-sm">Time</div>
          </div>
          ${quizState.section ? `
          <div>
            <div style="font-size:20px;font-weight:700">${quizState.section}</div>
            <div class="text-muted text-sm">Section</div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Accuracy by topic -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-title" style="margin-bottom:12px">Accuracy by Topic</div>
        ${Object.entries(topicAccuracy).map(([topic, stats]) => {
          const topicPct = Math.round((stats.correct / stats.total) * 100);
          const barColor = topicPct >= 80 ? 'var(--green)' : topicPct >= 60 ? 'var(--yellow)' : 'var(--red)';
          return `
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                <span>${topic}</span>
                <span style="color:${barColor};font-weight:600">${stats.correct}/${stats.total} (${topicPct}%)</span>
              </div>
              <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${topicPct}%;background:${barColor};border-radius:3px"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Missed questions review -->
      ${missed.length > 0 ? `
        <div class="card" style="margin-bottom:20px">
          <div class="card-title" style="margin-bottom:12px">Review Missed (${missed.length})</div>
          <div id="missedQuestions" style="display:none">
            ${missed.map((q, i) => `
              <div style="padding:12px 0;${i > 0 ? 'border-top:1px solid var(--border)' : ''}">
                <div style="font-size:14px;font-weight:600;margin-bottom:6px;line-height:1.6">Q${i + 1}: ${typeof mathifyText === 'function' ? mathifyText(q.question_text || '') : (q.question_text || '')}</div>
                <div style="font-size:13px;color:var(--red);margin-bottom:4px">Your answer: ${quizState.answers[q.id]?.selected || '?'} — ${typeof mathifyText === 'function' ? mathifyText((q.options || [])[['A','B','C','D'].indexOf(quizState.answers[q.id]?.selected)] || '') : ((q.options || [])[['A','B','C','D'].indexOf(quizState.answers[q.id]?.selected)] || '')}</div>
                <div style="font-size:13px;color:var(--green);margin-bottom:4px">Correct: ${['A','B','C','D'][q.correct_index] || '?'} — ${typeof mathifyText === 'function' ? mathifyText((q.options || [])[q.correct_index] || '') : ((q.options || [])[q.correct_index] || '')}</div>
                ${q.explanation ? `<div style="font-size:13px;color:var(--text-3);line-height:1.7;margin-top:6px">${typeof mathifyText === 'function' ? mathifyText(q.explanation) : q.explanation}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm btn-block" onclick="toggleMissed()">Show Missed Questions</button>
        </div>
      ` : ''}

      <!-- Actions -->
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startQuiz('${quizState.mode}', ${quizState.section ? `'${quizState.section}'` : 'null'}, ${quizState.topic ? `'${quizState.topic}'` : 'null'})">
          Try Again
        </button>
        <button class="btn btn-secondary" onclick="shareQuickDrillResult(${pct}, ${correctCount}, ${totalQuestions}, ${totalTime})">
          Share Result
        </button>
        <button class="btn btn-secondary" onclick="navigate('#/practice')">
          Change Mode
        </button>
        <button class="btn btn-secondary" onclick="navigate('#/dashboard')">
          Dashboard
        </button>
      </div>
    </div>
  `;

  triggerMathJax();
}


// ==========================================
// TOGGLE MISSED QUESTIONS
// ==========================================
function toggleMissed() {
  const el = document.getElementById('missedQuestions');
  if (!el) return;
  const visible = el.style.display !== 'none';
  el.style.display = visible ? 'none' : 'block';
  triggerMathJax();
}


// ==========================================
// PARSE URL PARAMS
// ==========================================
function parseQuizParams() {
  const hash = window.location.hash || '';
  const qIdx = hash.indexOf('?');
  if (qIdx === -1) return {};

  const params = {};
  const search = hash.substring(qIdx + 1);
  for (const pair of search.split('&')) {
    const [key, val] = pair.split('=');
    if (key && val) params[decodeURIComponent(key)] = decodeURIComponent(val);
  }
  return params;
}


// ==========================================
// SHARE QUICK DRILL RESULT (score card modal)
// ==========================================
async function shareQuickDrillResult(pct, correct, total, totalTime) {
  const user = typeof getUser === 'function' ? await getUser() : null;
  const userName = user?.user_metadata?.full_name || user?.email || '';
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const label = (typeof quizState !== 'undefined' && quizState?.mode === 'infinite') ? 'Infinite Drill' : 'Quick Drill';

  // Badge logic: personal best or elite
  let badge = null;
  if (pct === 100) badge = 'Perfect';
  else if (pct >= 90) badge = 'Elite';
  else if (pct >= 80) badge = 'Strong';

  if (typeof showScoreCardModal !== 'function') {
    alert('Score card not available — please refresh.');
    return;
  }
  await showScoreCardModal({
    title: label,
    score: `${pct}%`,
    scoreLabel: 'Accuracy',
    subline: `${correct} of ${total} correct in ${timeStr}`,
    badge: badge,
    userName: userName,
  });
}


// ==========================================
// UTILITY
// ==========================================
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


// ==========================================
// REGISTER ROUTE
// ==========================================
route('/practice', async () => {
  const params = parseQuizParams();
  await renderPracticeLanding(params);
});
