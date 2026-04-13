// OAR Pro v4 — ASVAB Free Diagnostic (15 questions)
// Route: #/asvab-diagnostic
// Public, email-gated. Fetches difficulty-1 questions tagged ASVAB from Supabase,
// groups by section, runs a one-at-a-time quiz with immediate feedback.
// Results show estimated AFQT range + per-section breakdown + upgrade CTA.
// localStorage key: asvab_preview_email
// — Benjamin Rodriguez

// ── State ─────────────────────────────────────────────────────────────────────

const ASVAB_DIAG = {
  questions: [],
  current: 0,
  answers: [],   // { section, correct }
  startedAt: null,
};

// ── Shuffle utility ────────────────────────────────────────────────────────────

function _asvabShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Question loader ────────────────────────────────────────────────────────────

async function _asvabLoadQuestions() {
  try {
    const res = await fetch(
      `https://ugblwepfptumffzcljot.supabase.co/rest/v1/questions?difficulty=eq.1&select=id,section,question_text,passage,options,correct_index,explanation&limit=60`,
      { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const all = await res.json();
    if (!Array.isArray(all) || !all.length) throw new Error('empty');

    // Client-side filter for ASVAB questions
    const asvab = all.filter(q => q.test_types && q.test_types.includes('ASVAB'));

    if (asvab.length >= 8) {
      // Group by section, shuffle each, take 3-4 per section to reach 15
      const buckets = {};
      for (const q of asvab) {
        const s = q.section || 'General';
        if (!buckets[s]) buckets[s] = [];
        buckets[s].push(q);
      }

      const sectionKeys = Object.keys(buckets);
      const pool = [];
      const perSection = Math.ceil(15 / sectionKeys.length);
      for (const key of sectionKeys) {
        pool.push(..._asvabShuffle(buckets[key]).slice(0, perSection));
      }
      if (pool.length >= 10) return _asvabShuffle(pool).slice(0, 15);
    }
  } catch (_) {}

  // Fallback: representative difficulty-1 questions across ASVAB sections
  return _asvabShuffle([
    // Word Knowledge
    { id: 'AV_WK1', section: 'Word Knowledge', question_text: 'ARID most nearly means:', options: ['Wet', 'Dry', 'Fertile', 'Foggy'], correct_index: 1, explanation: 'Arid means extremely dry — as in an arid desert.' },
    { id: 'AV_WK2', section: 'Word Knowledge', question_text: 'CONCISE most nearly means:', options: ['Lengthy', 'Vague', 'Brief and clear', 'Repetitive'], correct_index: 2, explanation: 'Concise means expressing a lot in few words — the opposite of lengthy.' },
    { id: 'AV_WK3', section: 'Word Knowledge', question_text: 'BENEVOLENT most nearly means:', options: ['Hostile', 'Generous and kind', 'Indifferent', 'Cunning'], correct_index: 1, explanation: 'Benevolent means well-meaning and generous.' },
    // Paragraph Comprehension
    { id: 'AV_PC1', section: 'Paragraph Comprehension', passage: 'The M4 carbine is a shorter, lighter version of the M16A2 assault rifle. Its collapsible stock makes it well-suited for airborne units and vehicle crews where space is limited. Despite its smaller size, it fires the same 5.56mm NATO cartridge and achieves an effective range of 500 meters.', question_text: 'According to the passage, why is the M4 preferred by airborne and vehicle units?', options: ['It fires a larger round', 'It has a longer effective range', 'Its collapsible stock saves space', 'It is more accurate than the M16A2'], correct_index: 2, explanation: 'The passage explicitly states the collapsible stock makes it suited for confined spaces.' },
    { id: 'AV_PC2', section: 'Paragraph Comprehension', passage: 'Sleep deprivation significantly impairs decision-making and reaction time. Studies show that being awake for 18 consecutive hours produces impairment equivalent to a blood alcohol level of 0.05%. After 24 hours without sleep, impairment equals 0.10% blood alcohol — above the legal limit in most states.', question_text: 'What is the main point of this passage?', options: ['Alcohol causes sleep problems', 'Driving tired is illegal in most states', 'Sleep deprivation impairs performance like alcohol', 'Eight hours of sleep prevents all errors'], correct_index: 2, explanation: 'The passage compares sleep deprivation to alcohol impairment to illustrate the severity of the performance decline.' },
    // Arithmetic Reasoning
    { id: 'AV_AR1', section: 'Arithmetic Reasoning', question_text: 'A soldier runs 3 miles in 24 minutes. At that pace, how long does it take to run 5 miles?', options: ['35 min', '40 min', '42 min', '45 min'], correct_index: 1, explanation: 'Pace = 24 ÷ 3 = 8 min/mile. 5 × 8 = 40 minutes.' },
    { id: 'AV_AR2', section: 'Arithmetic Reasoning', question_text: 'A base has 400 personnel. If 15% are deployed, how many remain?', options: ['340', '360', '380', '320'], correct_index: 0, explanation: '15% of 400 = 60 deployed. 400 − 60 = 340 remain.' },
    { id: 'AV_AR3', section: 'Arithmetic Reasoning', question_text: 'If you buy 4 items at $3.50 each and pay with a $20 bill, how much change do you receive?', options: ['$4', '$6', '$8', '$5.50'], correct_index: 1, explanation: '4 × $3.50 = $14.00. $20 − $14 = $6.00.' },
    // Mathematics Knowledge
    { id: 'AV_MK1', section: 'Mathematics Knowledge', question_text: 'Solve for x: 2x − 5 = 11', options: ['x = 3', 'x = 6', 'x = 8', 'x = 16'], correct_index: 2, explanation: '2x = 11 + 5 = 16. x = 8.' },
    { id: 'AV_MK2', section: 'Mathematics Knowledge', question_text: 'What is the area of a rectangle with length 9 and width 4?', options: ['26', '36', '18', '40'], correct_index: 1, explanation: 'Area = length × width = 9 × 4 = 36.' },
    { id: 'AV_MK3', section: 'Mathematics Knowledge', question_text: 'Simplify: 3² + 4²', options: ['25', '49', '7', '14'], correct_index: 0, explanation: '3² = 9, 4² = 16. 9 + 16 = 25.' },
    // General Science
    { id: 'AV_GS1', section: 'General Science', question_text: 'Which part of the human body produces insulin?', options: ['Liver', 'Kidney', 'Pancreas', 'Stomach'], correct_index: 2, explanation: 'The pancreas produces insulin, which regulates blood glucose.' },
    { id: 'AV_GS2', section: 'General Science', question_text: 'What is the chemical formula for water?', options: ['HO', 'H₂O₂', 'H₂O', 'O₂H'], correct_index: 2, explanation: 'Water is two hydrogen atoms bonded to one oxygen atom: H₂O.' },
    // Mechanical Comprehension
    { id: 'AV_MC1', section: 'Mechanical Comprehension', question_text: 'If a gear with 10 teeth drives a gear with 40 teeth, the driven gear turns at:', options: ['4× the input speed', '1/4 the input speed', 'The same speed', '2× the input speed'], correct_index: 1, explanation: 'Gear ratio = 10/40 = 1/4. The larger gear turns 4× slower than the driver.' },
    { id: 'AV_MC2', section: 'Mechanical Comprehension', question_text: 'A fixed pulley changes:', options: ['The amount of force required', 'The direction of force only', 'Both force and direction', 'Neither force nor direction'], correct_index: 1, explanation: 'A fixed pulley redirects force but does not provide mechanical advantage — you still pull with the same force.' },
  ]).slice(0, 15);
}

// ── Route entry ────────────────────────────────────────────────────────────────

route('/asvab-diagnostic', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  let previewEmail = '';
  try { previewEmail = localStorage.getItem('asvab_preview_email') || ''; } catch (_) {}

  if (!previewEmail) {
    _asvabRenderEmailGate(app);
    return;
  }

  _asvabRenderLoading(app);
  ASVAB_DIAG.questions = await _asvabLoadQuestions();
  ASVAB_DIAG.current = 0;
  ASVAB_DIAG.answers = [];
  ASVAB_DIAG.startedAt = Date.now();
  _asvabRenderQuestion(app);
});

// ── Email gate ─────────────────────────────────────────────────────────────────

function _asvabRenderEmailGate(app) {
  app.innerHTML = `
    <div style="max-width:500px;margin:0 auto;padding:60px 24px">
      <a href="#/asvab-score-guide" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:40px">← ASVAB Score Guide</a>
      <div style="text-align:center">
        <div style="font-size:40px;margin-bottom:16px">🎯</div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">Free ASVAB Diagnostic</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;letter-spacing:-.02em">15 Free ASVAB Practice Questions</h2>
        <p style="color:var(--text-2);font-size:14px;line-height:1.6;margin:0 auto 20px;max-width:380px">
          Enter your email to start. Covers Word Knowledge, Arithmetic Reasoning, Math Knowledge,
          Reading, and Mechanical. You'll see your estimated AFQT range at the end.
        </p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:420px;margin:0 auto 28px">
          ${[
            ['WK + PC', 'Verbal (AFQT)'],
            ['AR + MK', 'Math (AFQT)'],
            ['MC + GS', 'Technical'],
          ].map(([abbr, label]) => `
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 10px;text-align:center">
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:var(--accent);margin-bottom:3px">${abbr}</div>
              <div style="font-size:11px;color:var(--text-3)">${label}</div>
            </div>`).join('')}
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:360px;margin:0 auto">
          <input type="email" id="asvabEmailInput" placeholder="your@email.com"
            style="padding:12px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s"
            onkeydown="if(event.key==='Enter')window._asvabSubmitEmail()"
          />
          <button id="asvabEmailBtn" onclick="window._asvabSubmitEmail()" class="btn btn-primary"
            style="padding:12px 20px;font-size:15px;font-weight:700">
            Start Free Diagnostic →
          </button>
        </div>
        <div style="margin-top:12px;font-size:11px;color:var(--text-3)">No spam. Unsubscribe anytime. Takes ~8 minutes.</div>
      </div>
    </div>`;
  setTimeout(() => document.getElementById('asvabEmailInput')?.focus(), 100);
}

window._asvabSubmitEmail = async function () {
  const input = document.getElementById('asvabEmailInput');
  const btn   = document.getElementById('asvabEmailBtn');
  if (!input || !input.value.trim()) { if (input) input.focus(); return; }
  const email = input.value.trim();
  if (!email.includes('@')) { input.style.borderColor = 'var(--red)'; input.focus(); return; }

  btn.disabled = true;
  btn.textContent = 'Starting…';

  try { localStorage.setItem('asvab_preview_email', email.toLowerCase()); } catch (_) {}

  if (window._emailCapture) {
    window._emailCapture.submitLeadCapture({ email, onSuccess: function () {}, onError: function () {} });
  }

  handleRoute();
};

// ── Loading state ──────────────────────────────────────────────────────────────

function _asvabRenderLoading(app) {
  app.innerHTML = `<div style="text-align:center;padding:80px 24px;color:var(--text-3)">Loading questions…</div>`;
}

// ── Question renderer ──────────────────────────────────────────────────────────

function _asvabRenderQuestion(app) {
  const { questions, current } = ASVAB_DIAG;
  if (current >= questions.length) { _asvabRenderResults(app); return; }

  const q = questions[current];
  const total = questions.length;
  const progressPct = Math.round((current / total) * 100);
  let opts = [];
  try { opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []); } catch (_) {}

  app.innerHTML = `
    <div style="max-width:680px;margin:0 auto;padding:40px 24px 80px">

      <!-- Progress -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px">
        <span style="font-size:13px;font-weight:600;color:var(--text-2)">Question ${current + 1} of ${total}</span>
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);background:var(--surface-2);padding:3px 10px;border-radius:999px">${q.section || 'ASVAB'}</span>
      </div>
      <div style="height:4px;background:var(--surface-2);border-radius:2px;overflow:hidden;margin-bottom:32px">
        <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,var(--accent),var(--purple));transition:width .3s"></div>
      </div>

      <!-- Passage -->
      ${q.passage ? `
        <div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:8px;padding:16px 18px;margin-bottom:18px;font-size:13px;color:var(--text-2);line-height:1.7;max-height:220px;overflow-y:auto">
          ${q.passage}
        </div>` : ''}

      <!-- Question text -->
      <h3 style="font-size:17px;font-weight:600;line-height:1.55;margin-bottom:24px;color:var(--text)">${q.question_text}</h3>

      <!-- Options -->
      <div id="asvabOptions" style="display:flex;flex-direction:column;gap:8px">
        ${opts.map((opt, i) => `
          <button id="asvabOpt${i}" onclick="window._asvabAnswer(${i})"
            style="text-align:left;padding:14px 18px;background:var(--surface);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;font-family:inherit;cursor:pointer;transition:border-color .15s,background .15s;line-height:1.45"
            onmouseover="if(!this.dataset.locked){this.style.borderColor='var(--accent)';this.style.background='rgba(59,130,246,.06)'}"
            onmouseout="if(!this.dataset.locked){this.style.borderColor='var(--border)';this.style.background='var(--surface)'}">
            <span style="font-weight:700;color:var(--text-3);margin-right:10px">${String.fromCharCode(65 + i)}.</span>${opt}
          </button>`).join('')}
      </div>

      <div id="asvabExplanation" style="display:none"></div>
      <div id="asvabNextWrap" style="display:none;margin-top:20px;text-align:right"></div>

      <div style="margin-top:16px;font-size:12px;color:var(--text-3);text-align:center">Press 1–${opts.length} to select</div>
    </div>`;

  // Keyboard shortcuts
  const _kb = (e) => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= opts.length) {
      document.removeEventListener('keydown', _kb);
      window._asvabAnswer(n - 1);
    }
  };
  document.addEventListener('keydown', _kb);
  ASVAB_DIAG._kb = _kb;

  window._asvabAnswer = function (selectedIdx) {
    if (ASVAB_DIAG._kb) {
      document.removeEventListener('keydown', ASVAB_DIAG._kb);
      ASVAB_DIAG._kb = null;
    }

    const isCorrect = selectedIdx === q.correct_index;
    ASVAB_DIAG.answers.push({ section: q.section || 'General', correct: isCorrect });

    const btns = document.querySelectorAll('#asvabOptions button');
    btns.forEach(b => {
      b.dataset.locked = '1';
      b.style.cursor = 'default';
      b.onmouseover = null;
      b.onmouseout = null;
    });

    btns.forEach((b, i) => {
      if (i === q.correct_index) {
        b.style.borderColor = 'var(--green)';
        b.style.background  = 'rgba(34,197,94,.1)';
      } else if (i === selectedIdx && !isCorrect) {
        b.style.borderColor = 'var(--red)';
        b.style.background  = 'rgba(239,68,68,.1)';
      }
    });

    const expEl = document.getElementById('asvabExplanation');
    if (expEl) {
      expEl.style.display = 'block';
      expEl.innerHTML = `
        <div style="margin-top:16px;padding:14px 16px;background:${isCorrect ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)'};border:1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'};border-radius:10px">
          <div style="font-size:12px;font-weight:700;color:${isCorrect ? 'var(--green)' : 'var(--red)'};margin-bottom:6px">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</div>
          <div style="font-size:13px;color:var(--text-2);line-height:1.55">${q.explanation || ''}</div>
        </div>`;
    }

    const nextEl = document.getElementById('asvabNextWrap');
    if (nextEl) {
      nextEl.style.display = 'block';
      nextEl.innerHTML = `<button onclick="window._asvabNext()" class="btn btn-primary">${ASVAB_DIAG.current + 1 < questions.length ? 'Next →' : 'See Results →'}</button>`;
    }
  };

  window._asvabNext = function () {
    ASVAB_DIAG.current++;
    _asvabRenderQuestion(app);
  };
}

// ── Results ────────────────────────────────────────────────────────────────────

function _asvabRenderResults(app) {
  const { answers, startedAt } = ASVAB_DIAG;
  const total   = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const elapsed = Math.round((Date.now() - startedAt) / 1000);

  // AFQT estimate: difficulty-1 correct rate → rough AFQT percentile
  // Formula: 25 + (correct/total) * 50 → range ~25–75
  const afqtEst = Math.round(25 + (correct / total) * 50);
  const scoreColor = afqtEst >= 60 ? 'var(--green)' : afqtEst >= 40 ? 'var(--yellow)' : 'var(--red)';

  const verdict = afqtEst >= 65
    ? { label: 'Strong Score', msg: "You're in competitive territory. Most branches want 50+ — you're tracking well above that. Reinforce your weakest section and you'll have strong job selection leverage on test day." }
    : afqtEst >= 50
    ? { label: 'On Track', msg: "You're above the minimum for all branches. With targeted prep on the sections below, you can push into the 65+ range that unlocks the best MOS options and signing bonuses." }
    : afqtEst >= 36
    ? { label: 'Close to Minimums', msg: "You're in range for some branches but below others. The gap is closeable — most candidates in this range gain 10–15 AFQT points in 3–4 weeks of focused math and vocabulary prep." }
    : { label: 'Below Minimums', msg: "Your current score is below most branch minimums, but this is a diagnostic — not the real test, and not with hard questions. A structured 4-week plan targeting AR + MK + WK will move you significantly." };

  // Section breakdown
  const bySection = {};
  for (const a of answers) {
    const s = a.section;
    if (!bySection[s]) bySection[s] = { correct: 0, total: 0 };
    bySection[s].total++;
    if (a.correct) bySection[s].correct++;
  }

  app.innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:40px 24px 80px">

      <!-- Score display -->
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:8px">Estimated AFQT Range</div>
        <div style="font-family:'Space Grotesk',sans-serif;font-size:88px;font-weight:700;color:${scoreColor};letter-spacing:-.05em;line-height:1;margin-bottom:6px">
          ${afqtEst}
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text-3)">
          ${correct}/${total} correct &bull; ${elapsed}s &bull; difficulty-1 estimate
        </div>
      </div>

      <!-- Verdict card -->
      <div style="background:var(--surface);border:1px solid ${scoreColor};border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;font-weight:700;color:${scoreColor};margin-bottom:6px">${verdict.label}</div>
        <p style="font-size:14px;color:var(--text);line-height:1.6;margin:0">${verdict.msg}</p>
      </div>

      <!-- Branch threshold context -->
      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin-bottom:20px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:12px">Your Score vs. Branch Minimums</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            { branch: 'Army',                   min: 31 },
            { branch: 'Marine Corps',           min: 32 },
            { branch: 'Navy',                   min: 35 },
            { branch: 'Air Force / Space Force', min: 36 },
            { branch: 'Coast Guard',            min: 40 },
          ].map(b => {
            const pass = afqtEst >= b.min;
            return `
              <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px">
                <span style="color:var(--text-2)">${b.branch}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-3)">min ${b.min}</span>
                  <span style="font-weight:700;color:${pass ? 'var(--green)' : 'var(--red)'}">${pass ? '✓ Meets' : '✗ Below'}</span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Section breakdown -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="font-size:13px;font-weight:700;margin-bottom:14px">Section Breakdown</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${Object.entries(bySection).map(([sec, s]) => {
            const pct  = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const col  = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
            return `
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:13px">
                  <span style="font-weight:600">${sec}</span>
                  <span style="font-weight:700;color:${col}">${s.correct}/${s.total} — ${pct}%</span>
                </div>
                <div style="height:4px;background:var(--surface-2);border-radius:2px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;background:${col};border-radius:2px;transition:width .5s"></div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Upgrade CTA -->
      <div style="background:linear-gradient(135deg,hsla(214,100%,62%,.12),hsla(264,80%,68%,.08));border:1px solid var(--accent);border-radius:16px;padding:28px;text-align:center;margin-bottom:16px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:8px">Get Full Access</div>
        <h3 style="font-size:18px;font-weight:800;margin-bottom:8px">Ready to hit your target AFQT?</h3>
        <p style="font-size:14px;color:var(--text-2);line-height:1.6;margin:0 auto 20px;max-width:400px">
          620+ practice questions, adaptive drills, 24 lesson modules, score predictor — everything you need to close the gap.
        </p>
        <button class="btn btn-primary btn-lg" onclick="handleTestCheckoutClick(this,'ASVAB')" style="margin-bottom:10px">
          Get ASVAB Access — $47 →
        </button>
        <div style="font-size:12px;color:var(--text-3)">One-time payment &bull; Lifetime access &bull; 30-day guarantee</div>
      </div>

      <!-- Retake -->
      <div style="text-align:center">
        <button class="btn btn-secondary btn-sm" onclick="window._asvabRetake()">Retake Diagnostic</button>
        <a href="#/asvab-score-guide" style="font-size:13px;color:var(--text-3);text-decoration:none;margin-left:16px">Score Guide →</a>
      </div>
    </div>`;

  window._asvabRetake = function () {
    ASVAB_DIAG.current  = 0;
    ASVAB_DIAG.answers  = [];
    ASVAB_DIAG.startedAt = Date.now();
    _asvabRenderQuestion(app);
  };
}

// ── Global window exports ──────────────────────────────────────────────────────

window._asvabSubmitEmail = window._asvabSubmitEmail || function () {};
