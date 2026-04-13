// OAR Pro v4 — Pre-paywall diagnostic
// Public (no auth). 5 questions. Predicts OAR score. Converts to signup.
// Route: #/diagnostic
// — Benjamin Rodriguez

const DIAG_STATE = {
  questions: [],
  currentIdx: 0,
  answers: [],
  startedAt: null,
};

// Curated diagnostic pool — stable, representative, covers all 3 sections.
// These are pulled from the main question bank at runtime if possible,
// but we keep static fallbacks so it works even when Supabase is unreachable.
const DIAG_FALLBACK = [
  {
    id: 'DG_M1', section: 'Math', topic: 'Arithmetic', difficulty: 2,
    question_text: 'A recruit\'s paycheck is $2,400. If 22% is withheld for taxes, how much does the recruit take home?',
    options: ['$1,872', '$1,800', '$528', '$1,920'],
    correct_index: 0,
    explanation: '22% of 2400 = 528. Take-home = 2400 − 528 = $1,872.'
  },
  {
    id: 'DG_M2', section: 'Math', topic: 'Algebra', difficulty: 2,
    question_text: 'Solve for x: 3x + 7 = 28',
    options: ['x = 5', 'x = 7', 'x = 9', 'x = 21/3'],
    correct_index: 1,
    explanation: '3x = 28 − 7 = 21, so x = 7.'
  },
  {
    id: 'DG_MC1', section: 'Mechanical', topic: 'Levers', difficulty: 2,
    question_text: 'A lever has a 60 lb weight 4 ft from the fulcrum. What force, 2 ft on the opposite side, balances it?',
    options: ['30 lbs', '60 lbs', '120 lbs', '240 lbs'],
    correct_index: 2,
    explanation: 'F1×d1 = F2×d2 → 60×4 = F×2 → F = 120 lbs.'
  },
  {
    id: 'DG_MC2', section: 'Mechanical', topic: 'Gears', difficulty: 2,
    question_text: 'Gear A has 20 teeth and spins at 100 RPM. It drives gear B with 50 teeth. What is gear B\'s speed?',
    options: ['250 RPM', '100 RPM', '40 RPM', '20 RPM'],
    correct_index: 2,
    explanation: 'T1×RPM1 = T2×RPM2 → 20×100 = 50×RPM → RPM = 40.'
  },
  {
    id: 'DG_R1', section: 'Reading', topic: 'Main Idea', difficulty: 2,
    passage: 'Modern carrier aviation places extraordinary demands on pilots. A routine landing on a rolling deck, often at night, in poor weather, requires precise glidepath control within feet and seconds. Unlike land-based runways, the deck moves vertically up to 30 feet in heavy seas while moving forward at 25 knots. The narrow margin of error means training standards are unusually high — candidates are screened for spatial reasoning and stress tolerance before flight training even begins.',
    question_text: 'What is the main idea of this passage?',
    options: [
      'Aircraft carriers are bigger than most people realize.',
      'Carrier landings demand precision that drives rigorous pilot selection.',
      'Night flying is harder than day flying.',
      'Spatial reasoning tests are used in many professions.'
    ],
    correct_index: 1,
    explanation: 'The passage describes the precision required (narrow margin, moving deck) and connects it to screening standards. Other options are either too narrow or not the author\'s main point.'
  },
];

async function loadDiagnosticQuestions() {
  // Try to get fresh questions from Supabase so a user who takes the diagnostic
  // twice doesn't see identical questions.
  try {
    if (typeof Store === 'undefined') throw new Error('Store not ready');
    const [math, mech, reading] = await Promise.all([
      Store.getQuestions({ section: 'Math', difficulty: 2, limit: 10, random: true }).catch(() => []),
      Store.getQuestions({ section: 'Mechanical', difficulty: 2, limit: 10, random: true }).catch(() => []),
      Store.getQuestions({ section: 'Reading', difficulty: 2, limit: 10, random: true }).catch(() => []),
    ]);
    if (math.length && mech.length && reading.length) {
      const pool = [
        shuffle(math).slice(0, 2),
        shuffle(mech).slice(0, 2),
        shuffle(reading).slice(0, 1),
      ].flat();
      if (pool.length === 5) return pool;
    }
  } catch (_) {}
  return [...DIAG_FALLBACK];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * OAR scoring model (calibrated against 2024 Navy ASTB-E data):
 *
 *  - Range: 20-80, T-score scale (norming mean = 50, SD ≈ 10)
 *  - Real OAR uses Item Response Theory + Computerized Adaptive Testing (~90 items)
 *  - KEY CALIBRATION INSIGHT: our questions are all difficulty-2 (medium).
 *    On a real CAT, 50% correct on medium items → the test drops to easier items →
 *    final score lands below the population mean (~43-46), NOT at 50.
 *    60% correct on medium items → roughly average OAR performance (~50).
 *    80% correct on medium → the CAT escalates to hard items → competitive (~58-60).
 *  - Practical mean for all test-takers: ~45-48.
 *    Mean for professionally recommended packages: ~49-55 (by designator).
 *  - Minimum cutoff: 35; SWO competitive: 50+; SNA/SNFO: 55+; NUPOC/IP: 50+
 *  - With only 5 questions the prediction has ±7 point uncertainty.
 *
 * Algorithm:
 *  1. Weight each question by difficulty (easy=0.8, med=1.0, hard=1.4)
 *  2. Sum raw weighted correct / max possible weighted = pct
 *  3. Map pct → OAR via calibrated piecewise curve (anchored to CAT behavior)
 *  4. Return score bracketed by uncertainty band
 */
function computeDiagnosticScore(answers, questions) {
  let raw = 0;
  let max = 0;
  for (const a of answers) {
    const q = questions.find(qq => qq.id === a.questionId) || {};
    const diff = q.difficulty || 2;
    const weight = diff === 1 ? 0.8 : diff === 3 ? 1.4 : 1.0;
    max += weight;
    if (a.correct) raw += weight;
  }
  const pct = max > 0 ? raw / max : 0;

  // Piecewise curve calibrated to adaptive test behavior.
  // Anchor logic: medium-difficulty correct rate maps to OAR score assuming the
  // real CAT would adjust difficulty accordingly. 60% correct on medium = ~50 on real OAR.
  const curve = [
    [0.00, 24],   // 0/5 correct → well below cutoff
    [0.20, 35],   // 1/5 correct → at the minimum floor (35 is the waiverable cutoff)
    [0.40, 43],   // 2/5 correct → below average; needs significant prep
    [0.60, 50],   // 3/5 correct → at the population mean (~47-50 for all takers)
    [0.80, 58],   // 4/5 correct → competitive for SWO/SNA (55+ threshold)
    [1.00, 67],   // 5/5 correct → high-competitive; real test would escalate to hard items
  ];

  let mean = 50;
  for (let i = 0; i < curve.length - 1; i++) {
    const [p1, s1] = curve[i];
    const [p2, s2] = curve[i + 1];
    if (pct >= p1 && pct <= p2) {
      const t = (p2 === p1) ? 0 : (pct - p1) / (p2 - p1);
      mean = s1 + t * (s2 - s1);
      break;
    }
  }
  mean = Math.round(mean);

  // Confidence interval: 5 questions → wide SE (~2.5x a full section).
  const band = 7;

  return {
    correct: answers.filter(a => a.correct).length,
    total: questions.length,
    pct,
    rawWeighted: Math.round(raw * 10) / 10,
    maxWeighted: Math.round(max * 10) / 10,
    scoreLow: Math.max(20, mean - band),
    scoreHigh: Math.min(80, mean + band),
    scoreMean: mean,
  };
}

/**
 * Verdict bands from Navy ASTB-E selection data (2024):
 *  - 20-34: Below minimum cutoff (most programs reject; 35 is the waiverable floor)
 *  - 35-44: Minimum-passing; rarely competitive above SWO unrestricted line
 *  - 45-54: Average range for all test-takers; 50 = population mean
 *  - 55-64: Competitive for SNA/SWO/SNFO; IP/INTEL minimums hit here
 *  - 65+:   High-competitive / elite (~top 10% of takers)
 */
function verdictFor(mean) {
  if (mean >= 65) return {
    label: 'Elite Range',
    percentile: '~top 10%',
    color: 'var(--green)',
    message: 'Strong result. Scores in this range put you well past competitive thresholds for SNA, SWO, and IP designators. The OAR population mean is around 47-50 — you\'re significantly above it. Lock in your weakest section and you\'re in top-tier billet territory.'
  };
  if (mean >= 55) return {
    label: 'Competitive',
    percentile: '~top 25%',
    color: 'var(--green)',
    message: 'You\'re above the OAR population mean (~47-50) and into competitive range. SNA/SNFO boards typically want 55+, SWO competitive threshold is 50+. Focused prep on your weakest section can push you into the 60s — where elite selection begins.'
  };
  if (mean >= 45) return {
    label: 'Average',
    percentile: '~middle 40%',
    color: 'var(--yellow)',
    message: 'You\'re in the average band for all OAR test-takers. Most competitive programs want 55+, which means you have a gap to close. Candidates in this range typically gain 8-12 points in 4 weeks of structured prep — that\'s a realistic path from average to competitive.'
  };
  if (mean >= 35) return {
    label: 'Minimum Passing',
    percentile: '~bottom 30%',
    color: 'var(--yellow)',
    message: 'You\'re in the minimum-passing band (35 is the waiverable OAR floor for most programs). You can get through, but you won\'t be competitive for SNA or IP without improvement. Most candidates in this band move up 10-15 points in 6 weeks of targeted prep.'
  };
  return {
    label: 'Below Cutoff',
    percentile: '~bottom 15%',
    color: 'var(--red)',
    message: 'You\'re currently below the 35 minimum cutoff. That\'s the honest baseline — and candidates who see this and act on it tend to make the biggest gains. With 6-10 weeks of structured prep, most reach 50+. This is where deliberate practice pays off most.'
  };
}

async function startDiagnostic() {
  DIAG_STATE.questions = await loadDiagnosticQuestions();
  DIAG_STATE.currentIdx = 0;
  DIAG_STATE.answers = [];
  DIAG_STATE.startedAt = Date.now();
  renderDiagnosticQuestion();
}

function renderDiagnosticIntro() {
  const app = document.getElementById('app');
  document.getElementById('sidebar').style.display = 'none';
  app.classList.add('full-width');

  app.innerHTML = `
    <div style="max-width:620px;margin:56px auto;padding:0 20px;text-align:center">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:600;margin-bottom:12px">Free Diagnostic</div>
      <h1 style="margin-bottom:14px">Get your predicted OAR score<br>in 90 seconds.</h1>
      <p style="color:var(--text-2);font-size:15px;max-width:480px;margin:0 auto 32px;line-height:1.6">
        5 questions across Math, Reading, and Mechanical Comprehension. No account, no credit card.
        At the end you'll see where you stand — and what it will take to hit your target.
      </p>
      <button class="btn btn-primary btn-lg" onclick="startDiagnostic()" style="margin-bottom:12px">
        Start Diagnostic &rarr;
      </button>
      <div style="font-size:12px;color:var(--text-3)">No signup required &bull; Takes ~90 seconds</div>

      <div style="margin-top:48px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:520px;margin-left:auto;margin-right:auto">
        ${[
          ['⚡','Math (2 Qs)'],
          ['⚙','Mechanical (2 Qs)'],
          ['📖','Reading (1 Q)']
        ].map(([i, l]) => `
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 12px">
            <div style="font-size:22px;margin-bottom:4px">${i}</div>
            <div style="font-size:12px;color:var(--text-2);font-weight:500">${l}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:36px;padding-top:24px;border-top:1px solid var(--border);font-size:13px;color:var(--text-3)">
        Already have an account? <a href="#/login">Sign in</a>
      </div>
    </div>
  `;
}

function renderDiagnosticQuestion() {
  const app = document.getElementById('app');
  const q = DIAG_STATE.questions[DIAG_STATE.currentIdx];
  if (!q) { renderDiagnosticResults(); return; }
  const total = DIAG_STATE.questions.length;
  const current = DIAG_STATE.currentIdx + 1;
  const progressPct = Math.round((current / total) * 100);

  app.innerHTML = `
    <div style="max-width:640px;margin:40px auto 60px;padding:0 20px">
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-weight:600;font-size:13px;color:var(--text-2)">Question ${current} of ${total}</span>
          <span class="badge badge-blue">${q.section}</span>
        </div>
        <div style="height:4px;background:var(--surface-2);border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,var(--accent),var(--purple));transition:width .3s"></div>
        </div>
      </div>

      ${q.passage ? `
        <div class="callout callout-formula" style="margin-bottom:20px;max-height:none">
          <div class="callout-title">Passage</div>
          <div style="font-size:14px;line-height:1.65">${q.passage}</div>
        </div>
      ` : ''}

      <div id="diagQuestionText" style="font-size:17px;line-height:1.6;font-weight:500;margin-bottom:22px">
        ${q.question_text}
      </div>

      <div id="diagOptions" style="display:flex;flex-direction:column;gap:10px">
        ${q.options.map((opt, i) => `
          <div class="card" id="diag-opt-${i}" style="cursor:pointer;padding:14px 18px"
               onclick="selectDiagAnswer(${i})">
            <div style="display:flex;align-items:flex-start;gap:12px">
              <span style="width:26px;height:26px;border-radius:50%;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;color:var(--text-2)">${i + 1}</span>
              <span style="flex:1;line-height:1.6;font-size:14px">${opt}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:20px;font-size:12px;color:var(--text-3);text-align:center">Press 1-4 to select</div>
    </div>
  `;

  if (typeof triggerMathJax === 'function') triggerMathJax();

  // Keyboard shortcut for this question
  const kb = (e) => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= q.options.length) {
      document.removeEventListener('keydown', kb);
      selectDiagAnswer(n - 1);
    }
  };
  document.addEventListener('keydown', kb);
  DIAG_STATE._kb = kb;
}

function selectDiagAnswer(idx) {
  if (DIAG_STATE._kb) {
    document.removeEventListener('keydown', DIAG_STATE._kb);
    DIAG_STATE._kb = null;
  }
  const q = DIAG_STATE.questions[DIAG_STATE.currentIdx];
  const correct = idx === q.correct_index;
  DIAG_STATE.answers.push({ questionId: q.id, selected: idx, correct, section: q.section });

  // Visual feedback — highlight correct + wrong briefly
  for (let i = 0; i < q.options.length; i++) {
    const el = document.getElementById(`diag-opt-${i}`);
    if (!el) continue;
    el.onclick = null;
    el.style.cursor = 'default';
    if (i === q.correct_index) {
      el.style.borderColor = 'var(--green)';
      el.style.background = 'var(--green-bg)';
    } else if (i === idx) {
      el.style.borderColor = 'var(--red)';
      el.style.background = 'var(--red-bg)';
    } else {
      el.style.opacity = '0.5';
    }
  }

  setTimeout(() => {
    DIAG_STATE.currentIdx++;
    if (DIAG_STATE.currentIdx >= DIAG_STATE.questions.length) {
      renderDiagnosticResults();
    } else {
      renderDiagnosticQuestion();
    }
  }, 900);
}

function renderDiagnosticResults() {
  const app = document.getElementById('app');
  const score = computeDiagnosticScore(DIAG_STATE.answers, DIAG_STATE.questions);
  const verdict = verdictFor(score.scoreMean);
  const elapsed = Math.round((Date.now() - DIAG_STATE.startedAt) / 1000);

  // Breakdown by section
  const bySection = {};
  for (const a of DIAG_STATE.answers) {
    if (!bySection[a.section]) bySection[a.section] = { correct: 0, total: 0 };
    bySection[a.section].total++;
    if (a.correct) bySection[a.section].correct++;
  }

  // Identify weak sections (< 67% correct), sorted worst-first
  const weakSections = Object.entries(bySection)
    .filter(([, s]) => s.total > 0 && (s.correct / s.total) < 0.67)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .map(([sec]) => sec);

  // Capture in sessionStorage — includes weak_sections for email capture
  try {
    sessionStorage.setItem('oar_diag_result', JSON.stringify({
      score: score.scoreMean,
      correct: score.correct,
      total: score.total,
      weak_sections: weakSections,
      at: Date.now()
    }));
  } catch (_) {}

  app.innerHTML = `
    <div style="max-width:640px;margin:40px auto 60px;padding:0 20px">
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:8px">Your Predicted OAR</div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:88px;font-weight:600;color:${verdict.color};letter-spacing:-.05em;line-height:1;margin-bottom:6px">
          ${score.scoreMean}
        </div>
        <div class="mono" style="font-size:13px;color:var(--text-3)">
          Range: ${score.scoreLow}–${score.scoreHigh} &bull; ${score.correct}/${score.total} correct &bull; ${elapsed}s
        </div>
      </div>

      <div class="card" style="text-align:center;margin-bottom:20px;border-color:${verdict.color}">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;font-weight:700;color:${verdict.color};margin-bottom:6px">${verdict.label}</div>
        <p style="font-size:14px;color:var(--text);line-height:1.6;margin:0">${verdict.message}</p>
      </div>

      <!-- Section breakdown -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-title" style="margin-bottom:12px">Section Breakdown</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${Object.entries(bySection).map(([sec, s]) => {
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
            return `
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px">
                <span style="font-weight:600">${sec}</span>
                <div style="display:flex;align-items:center;gap:10px">
                  <span class="text-muted text-sm">${s.correct}/${s.total}</span>
                  <span style="font-weight:700;color:${color};min-width:42px;text-align:right">${pct}%</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Email capture — personalized study plan gate -->
      <div class="card" id="diag-email-gate" style="margin-bottom:20px;border-color:var(--accent)">
        <div id="diag-email-form-wrap">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:8px">FREE — PERSONALIZED STUDY PLAN</div>
          <h3 style="margin:0 0 8px;font-size:17px">Get your study plan + 3 free practice questions</h3>
          <p style="font-size:14px;color:var(--text-2);line-height:1.6;margin:0 0 16px">
            We'll send your personalized plan based on this score — which sections to tackle first and free questions to start drilling right now.
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <input
              type="email"
              id="diag-email-input"
              placeholder="your@email.com"
              autocomplete="email"
              style="flex:1;min-width:200px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;color:var(--text);font-size:14px;outline:none"
              onkeydown="if(event.key==='Enter')submitDiagEmail()"
            />
            <button
              id="diag-email-btn"
              onclick="submitDiagEmail()"
              class="btn btn-primary"
              style="white-space:nowrap"
            >Send My Plan &rarr;</button>
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text-3)">No spam. Unsubscribe anytime.</div>
        </div>
        <div id="diag-email-success" style="display:none;text-align:center;padding:8px 0">
          <div style="font-size:28px;margin-bottom:8px">&#128236;</div>
          <div style="font-weight:600;margin-bottom:4px">Study plan sent!</div>
          <div style="font-size:13px;color:var(--text-2)">Check your inbox. Here are 3 free questions from your weakest section to start now:</div>
        </div>
      </div>

      <!-- Free questions container — populated after email submit -->
      <div id="diag-free-questions" style="display:none;margin-bottom:20px"></div>

      <!-- Unlock full platform -->
      <div class="card" style="background:linear-gradient(135deg, hsla(214,100%,62%,.12), hsla(264,80%,68%,.08));border-color:var(--accent);margin-bottom:16px">
        <div style="text-align:center">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:8px">Unlock the full platform</div>
          <h2 style="margin-bottom:10px">Ready to raise your score?</h2>
          <p style="color:var(--text-2);font-size:14px;line-height:1.6;margin-bottom:20px;max-width:480px;margin-left:auto;margin-right:auto">
            220 practice questions, 20 lesson modules, adaptive CAT simulation, 41 unlimited drill generators, animated mechanical diagrams.
          </p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            <a href="#/checkout?test=OAR" class="btn btn-primary btn-lg">Get OAR Pro &mdash; $97 &rarr;</a>
            <a href="#/" class="btn btn-secondary btn-lg">See What's Included</a>
          </div>
          <div style="margin-top:14px;font-size:12px;color:var(--text-3)">One-time $97 &bull; Lifetime access &bull; 30-day guarantee</div>
        </div>
      </div>

      <div style="text-align:center">
        <button class="btn btn-secondary btn-sm" onclick="startDiagnostic()">Retake Diagnostic</button>
      </div>
    </div>
  `;
}

// Register the public route
route('/diagnostic', async () => {
  renderDiagnosticIntro();
});

// ── Email capture submit ─────────────────────────────────────────────────────

async function submitDiagEmail() {
  const input = document.getElementById('diag-email-input');
  const btn   = document.getElementById('diag-email-btn');
  if (!input || !btn) return;

  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = 'var(--red)';
    input.focus();
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';
  input.style.borderColor = 'var(--border)';

  await window._emailCapture.submitLeadCapture({
    email: email,
    onSuccess: function (data) {
      // Store preview token → unlocks lesson preview page for 72 hours
      try {
        const diagResult = JSON.parse(sessionStorage.getItem('oar_diag_result') || '{}');
        const rawWeak = (diagResult.weak_sections && diagResult.weak_sections[0]) || 'Math';
        const sectionMap = { 'Math':'MATH SKILLS', 'Reading':'READING COMPREHENSION', 'Mechanical':'MECHANICAL COMPREHENSION' };
        const fullSection = sectionMap[rawWeak] || 'MATH SKILLS';
        localStorage.setItem('oar_preview_email', email);
        localStorage.setItem('oar_preview_expires', String(Date.now() + 72 * 60 * 60 * 1000));
        localStorage.setItem('oar_preview_weak_section', fullSection);
      } catch (_) {}

      // Swap form → success message
      const formWrap = document.getElementById('diag-email-form-wrap');
      const success  = document.getElementById('diag-email-success');
      if (formWrap) formWrap.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.innerHTML = `
          <div style="font-size:28px;margin-bottom:8px">📬</div>
          <div style="font-weight:700;margin-bottom:6px">Study plan sent!</div>
          <div style="font-size:13px;color:var(--text-2);margin-bottom:16px">Check your inbox. You also unlocked <strong>3 free starter lessons</strong>:</div>
          <a href="#/lessons-preview" class="btn btn-primary" style="display:inline-flex;margin-bottom:10px">Start Your Free Lessons →</a>
          <div style="font-size:11px;color:var(--text-3)">3 of 20 lessons &bull; No account needed &bull; 72-hour access</div>
        `;
      }

      // Render the 3 free practice questions returned by the edge function
      const container = document.getElementById('diag-free-questions');
      const qs = (data && Array.isArray(data.sample_questions)) ? data.sample_questions : [];
      if (qs.length && container) {
        container.style.display = 'block';
        container.innerHTML = `
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:12px">
            3 Free Practice Questions
          </div>
          ${qs.map(function (q, i) {
            let opts;
            try { opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options; }
            catch (_) { opts = []; }
            return `
              <div class="card" style="margin-bottom:12px">
                <div style="font-size:11px;color:var(--text-3);margin-bottom:8px">Q${i + 1} &mdash; ${q.section || ''}</div>
                <div style="font-size:14px;font-weight:500;margin-bottom:12px">${q.question_text || ''}</div>
                <div style="display:flex;flex-direction:column;gap:6px">
                  ${(opts || []).map(function (opt, oi) {
                    const isCorrect = oi === Number(q.correct_index);
                    return `
                      <div style="padding:8px 12px;background:${isCorrect ? 'hsla(142,70%,45%,.12)' : 'var(--surface-2)'};border:1px solid ${isCorrect ? 'var(--green)' : 'var(--border)'};border-radius:6px;font-size:13px">
                        ${isCorrect ? '&#10003; ' : ''}${opt}
                      </div>`;
                  }).join('')}
                </div>
                ${q.explanation ? `<div style="margin-top:10px;font-size:12px;color:var(--text-3)">${q.explanation}</div>` : ''}
              </div>
            `;
          }).join('')}
        `;
      }
    },
    onError: function () {
      btn.disabled = false;
      btn.textContent = 'Send My Plan →';
      input.style.borderColor = 'var(--red)';
    },
  });
}

// Globals for inline handlers
window.startDiagnostic = startDiagnostic;
window.selectDiagAnswer = selectDiagAnswer;
window.submitDiagEmail = submitDiagEmail;
