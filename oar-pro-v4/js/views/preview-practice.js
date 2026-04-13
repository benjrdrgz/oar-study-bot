// OAR Pro v4 — Free Practice Quiz Preview
// Route: #/preview-practice
// 15 difficulty-1 questions from the public OAR question pool (5 per section).
// Email-gated: same oar_preview_email token as lessons-preview.
// — Benjamin Rodriguez

route('/preview-practice', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  // Check email token
  let previewEmail = '';
  try { previewEmail = localStorage.getItem('oar_preview_email') || ''; } catch (_) {}

  if (!previewEmail) {
    _ppRenderEmailGate(app);
    return;
  }

  app.innerHTML = `<div style="text-align:center;padding:80px 24px;color:var(--text-3)">Loading questions…</div>`;

  try {
    // RLS policy enforces difficulty=1 + test_types contains OAR server-side,
    // so no test_types filter needed in the URL (avoids PostgREST array literal issues).
    const res = await fetch(
      `https://ugblwepfptumffzcljot.supabase.co/rest/v1/questions?difficulty=eq.1&select=id,section,question_text,options,correct_index,explanation&limit=60`,
      { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const all = await res.json();
    if (!Array.isArray(all) || all.length === 0) throw new Error('no questions');

    // Group by section, shuffle each bucket, take up to 5 per section
    const bySection = {};
    for (const q of all) {
      const s = q.section || 'Other';
      if (!bySection[s]) bySection[s] = [];
      bySection[s].push(q);
    }

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // Build 15-question pool: 5 per section
    const questions = [];
    for (const qs of Object.values(bySection)) {
      shuffle(qs);
      questions.push(...qs.slice(0, 5));
    }

    _ppRunQuiz(app, questions.slice(0, 15));

  } catch (err) {
    app.innerHTML = `
      <div style="text-align:center;padding:60px 24px">
        <p style="color:var(--text-3)">Could not load questions. <a href="#/lessons-preview" style="color:var(--accent)">← Back to lessons</a></p>
      </div>`;
  }
});

// ── Email gate ────────────────────────────────────────────────────────────────

function _ppRenderEmailGate(app) {
  app.innerHTML = `
    <div style="max-width:500px;margin:0 auto;padding:60px 24px">
      <a href="#/lessons-preview" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:40px">← Back to free preview</a>
      <div style="text-align:center">
        <div style="font-size:40px;margin-bottom:16px">📝</div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">Free Practice Quiz</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;letter-spacing:-.02em">15 Free OAR Practice Questions</h2>
        <p style="color:var(--text-2);font-size:14px;line-height:1.6;margin:0 auto 24px;max-width:380px">
          Enter your email to start — no account or payment required. 5 questions from each OAR section.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:360px;margin:0 auto">
          <input type="email" id="ppEmailInput" placeholder="your@email.com"
            style="padding:12px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s"
            onkeydown="if(event.key==='Enter')window._ppSubmitEmail()"
          />
          <button id="ppEmailBtn" onclick="window._ppSubmitEmail()" class="btn btn-primary"
            style="padding:12px 20px;font-size:15px;font-weight:700">
            Start Free Quiz →
          </button>
        </div>
        <div style="margin-top:12px;font-size:11px;color:var(--text-3)">No spam. Unsubscribe anytime.</div>
      </div>
    </div>`;
  setTimeout(() => document.getElementById('ppEmailInput')?.focus(), 100);
}

window._ppSubmitEmail = async function () {
  const input = document.getElementById('ppEmailInput');
  const btn   = document.getElementById('ppEmailBtn');
  if (!input || !input.value.trim()) { if (input) input.focus(); return; }
  const email = input.value.trim();
  if (!email.includes('@')) { input.style.borderColor = 'var(--red)'; input.focus(); return; }

  btn.disabled = true;
  btn.textContent = 'Starting…';

  localStorage.setItem('oar_preview_email', email.toLowerCase());
  localStorage.setItem('oar_preview_expires', String(Date.now() + 72 * 60 * 60 * 1000));

  if (window._emailCapture) {
    window._emailCapture.submitLeadCapture({ email, onSuccess: function () {}, onError: function () {} });
  }

  navigate('#/preview-practice');
};

// ── Quiz engine ───────────────────────────────────────────────────────────────

function _ppRunQuiz(app, questions) {
  let current = 0;
  let correct  = 0;

  function renderQuestion() {
    if (current >= questions.length) { renderResults(); return; }

    const q = questions[current];
    let opts = [];
    try { opts = typeof q.options === 'string' ? JSON.parse(q.options) : (q.options || []); } catch (_) {}

    app.innerHTML = `
      <div style="max-width:680px;margin:0 auto;padding:40px 24px 80px">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:8px">
          <a href="#/lessons-preview" style="font-size:13px;color:var(--text-3);text-decoration:none">← Back</a>
          <span style="font-size:12px;color:var(--text-3)">Question <strong style="color:var(--text)">${current + 1}</strong> of ${questions.length}</span>
          <span style="font-size:12px;color:var(--green);font-weight:600">${correct} correct</span>
        </div>

        <!-- Progress bar -->
        <div style="height:4px;background:var(--border);border-radius:2px;margin-bottom:32px;overflow:hidden">
          <div style="height:4px;background:var(--accent);border-radius:2px;width:${((current / questions.length) * 100).toFixed(1)}%;transition:width .3s"></div>
        </div>

        <!-- Question -->
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:14px">${q.section || 'OAR'}</div>
        <h3 style="font-size:17px;font-weight:600;line-height:1.55;margin-bottom:24px;color:var(--text)">${q.question_text}</h3>

        <!-- Options -->
        <div id="ppOptions" style="display:flex;flex-direction:column;gap:8px">
          ${opts.map((opt, i) => `
            <button id="ppOpt${i}" onclick="window._ppAnswer(${i})"
              style="text-align:left;padding:14px 18px;background:var(--surface);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;font-family:inherit;cursor:pointer;transition:border-color .15s,background .15s;line-height:1.45"
              onmouseover="if(!this.dataset.locked){this.style.borderColor='var(--accent)';this.style.background='rgba(59,130,246,.06)'}"
              onmouseout="if(!this.dataset.locked){this.style.borderColor='var(--border)';this.style.background='var(--surface)'}">
              <span style="font-weight:700;color:var(--text-3);margin-right:10px">${String.fromCharCode(65 + i)}.</span>${opt}
            </button>
          `).join('')}
        </div>

        <div id="ppExplanation" style="display:none"></div>
        <div id="ppNextWrap" style="display:none;margin-top:20px;text-align:right"></div>
      </div>`;

    window._ppAnswer = function (selectedIdx) {
      const btns = document.querySelectorAll('#ppOptions button');
      btns.forEach(b => { b.dataset.locked = '1'; b.style.cursor = 'default'; b.onmouseover = null; b.onmouseout = null; });

      const isCorrect = selectedIdx === q.correct_index;
      if (isCorrect) correct++;

      btns.forEach((b, i) => {
        if (i === q.correct_index) {
          b.style.borderColor = 'var(--green)';
          b.style.background  = 'rgba(34,197,94,.1)';
        } else if (i === selectedIdx && !isCorrect) {
          b.style.borderColor = 'var(--red)';
          b.style.background  = 'rgba(239,68,68,.1)';
        }
      });

      const expEl = document.getElementById('ppExplanation');
      expEl.style.display = 'block';
      expEl.innerHTML = `
        <div style="margin-top:16px;padding:14px 16px;background:${isCorrect ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)'};border:1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'};border-radius:10px">
          <div style="font-size:12px;font-weight:700;color:${isCorrect ? 'var(--green)' : 'var(--red)'};margin-bottom:6px">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</div>
          <div style="font-size:13px;color:var(--text-2);line-height:1.55">${q.explanation || ''}</div>
        </div>`;

      const nextEl = document.getElementById('ppNextWrap');
      nextEl.style.display = 'block';
      nextEl.innerHTML = `<button onclick="window._ppNext()" class="btn btn-primary">${current + 1 < questions.length ? 'Next Question →' : 'See Results →'}</button>`;
    };

    window._ppNext = function () { current++; renderQuestion(); };
  }

  function renderResults() {
    const pct = Math.round((correct / questions.length) * 100);
    const icon = pct >= 70 ? '🎯' : pct >= 50 ? '📈' : '💪';
    const msg  = pct >= 70
      ? "Strong work — you're already competitive on the easier questions."
      : pct >= 50
      ? 'Solid foundation. Focused prep will move you into billet-competitive range.'
      : "This is your starting point. Most candidates improve 15-20 points with targeted practice.";
    const scoreColor = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';

    app.innerHTML = `
      <div style="max-width:600px;margin:0 auto;padding:40px 24px 80px">
        <div style="text-align:center;margin-bottom:36px">
          <div style="font-size:56px;margin-bottom:16px">${icon}</div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:10px">Practice Quiz Complete</div>
          <div style="font-size:clamp(2rem,5vw,3rem);font-weight:900;color:${scoreColor};letter-spacing:-.03em;margin-bottom:6px">${pct}%</div>
          <div style="font-size:16px;color:var(--text-2);margin-bottom:12px">${correct} of ${questions.length} correct</div>
          <p style="color:var(--text-2);font-size:14px;line-height:1.6;max-width:420px;margin:0 auto">${msg}</p>
        </div>

        <!-- Upgrade CTA -->
        <div style="background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:16px;padding:32px 24px;text-align:center;margin-bottom:20px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:10px">Unlock the Full Platform</div>
          <h3 style="font-size:19px;font-weight:800;margin-bottom:8px">220 questions &bull; Adaptive testing &bull; AI tutor</h3>
          <p style="color:var(--text-2);font-size:13px;margin-bottom:20px;max-width:380px;margin-left:auto;margin-right:auto">
            The adaptive CAT pinpoints your exact weak spots and drills them until you improve. Most users move 8–12 points in their first week.
          </p>
          <button class="btn btn-primary btn-lg" onclick="handleCheckoutClick(this)">Get OAR Pro — $97 →</button>
          <div style="margin-top:10px;font-size:11px;color:var(--text-3)">30-day money-back guarantee &bull; One-time payment</div>
        </div>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button onclick="navigate('#/preview-practice')" class="btn btn-secondary">Retake Quiz</button>
          <a href="#/lessons-preview" class="btn btn-secondary">Back to Lessons</a>
        </div>
      </div>`;
  }

  renderQuestion();
}
