// OAR Pro v4 — Free Lesson Preview
// Routes: #/lessons-preview (grid), #/lesson-preview/:id (viewer)
// Public — email-gated via localStorage token set by diagnostic email capture.
// 3 lessons unlocked (one per section), 17 locked with FOMO UI.
// — Benjamin Rodriguez

const PREVIEW_FREE_IDS = new Set([1, 5, 7]);

const PREVIEW_LESSONS = [
  { id:1,  section:'MATH SKILLS',             title:'Arithmetic Fundamentals',               desc:'PEMDAS, fractions, decimals, percentages, and ratios' },
  { id:2,  section:'MATH SKILLS',             title:'Algebra',                               desc:'Linear equations, systems, exponents, quadratics, inequalities' },
  { id:3,  section:'MATH SKILLS',             title:'Geometry',                              desc:'Angles, triangles, circles, areas, volumes, coordinate geometry' },
  { id:4,  section:'MATH SKILLS',             title:'Word Problems',                         desc:'Distance-rate-time, work rate, mixtures, probability, averages' },
  { id:5,  section:'READING COMPREHENSION',   title:'Main Idea & Purpose',                  desc:'Identifying topic, main idea, theme, and author\'s purpose' },
  { id:6,  section:'READING COMPREHENSION',   title:'Inference & Detail',                   desc:'Drawing conclusions, finding details, vocabulary in context' },
  { id:18, section:'READING COMPREHENSION',   title:'Common Text Organizations',             desc:'Chronological, cause-effect, problem-solution, compare-contrast' },
  { id:19, section:'READING COMPREHENSION',   title:'Reading Informational Texts',           desc:'Literal vs figurative language, inference, author purpose' },
  { id:20, section:'READING COMPREHENSION',   title:'Technical Language',                    desc:'Technical vs literary language, writing for different audiences' },
  { id:7,  section:'MECHANICAL COMPREHENSION',title:'Forces & Newton\'s Laws',               desc:'Three laws of motion, weight, friction, free fall' },
  { id:8,  section:'MECHANICAL COMPREHENSION',title:'Levers & Torque',                       desc:'Three classes of levers, lever formula, mechanical advantage, torque' },
  { id:9,  section:'MECHANICAL COMPREHENSION',title:'Gears & Pulleys',                       desc:'Gear direction, gear ratios, pulley systems, mechanical advantage' },
  { id:10, section:'MECHANICAL COMPREHENSION',title:'Energy, Work & Power',                  desc:'Work, kinetic energy, potential energy, conservation, power' },
  { id:11, section:'MECHANICAL COMPREHENSION',title:'Fluids & Pressure',                     desc:'Pressure, Pascal\'s law, buoyancy, continuity, Bernoulli\'s principle' },
  { id:12, section:'MECHANICAL COMPREHENSION',title:'Electricity Basics',                    desc:'Ohm\'s law, series and parallel circuits, power' },
  { id:13, section:'MECHANICAL COMPREHENSION',title:'Momentum & Impulse',                    desc:'Conservation of momentum, impulse-momentum theorem, collisions' },
  { id:14, section:'MECHANICAL COMPREHENSION',title:'Kinematics',                            desc:'Displacement, velocity, acceleration, kinematic equations' },
  { id:15, section:'MECHANICAL COMPREHENSION',title:'Gas Laws',                              desc:'Boyle\'s, Charles\'s, Gay-Lussac\'s, combined and ideal gas laws' },
  { id:16, section:'MECHANICAL COMPREHENSION',title:'Heat Transfer',                         desc:'Conduction, convection, radiation, specific heat, calorimetry' },
  { id:17, section:'MECHANICAL COMPREHENSION',title:'Magnetism & Electrical Components',    desc:'Magnetic fields, inductors, capacitors, transformers' },
];

const SECTION_ICONS  = { 'MATH SKILLS':'📐', 'READING COMPREHENSION':'📖', 'MECHANICAL COMPREHENSION':'⚙️' };
const SECTION_SHORT  = { 'MATH SKILLS':'Math', 'READING COMPREHENSION':'Reading', 'MECHANICAL COMPREHENSION':'Mechanical' };

// ── Token helpers ─────────────────────────────────────────────────────────────

function _getPreviewToken() {
  try {
    return {
      email:   localStorage.getItem('oar_preview_email')  || '',
      expires: parseInt(localStorage.getItem('oar_preview_expires') || '0'),
      weak:    localStorage.getItem('oar_preview_weak_section') || 'MATH SKILLS',
    };
  } catch (_) { return { email:'', expires:0, weak:'MATH SKILLS' }; }
}

function _getCompletedIds() {
  try { return new Set(JSON.parse(localStorage.getItem('oar_preview_completed') || '[]')); }
  catch (_) { return new Set(); }
}

function _markCompleted(id) {
  try {
    const arr = JSON.parse(localStorage.getItem('oar_preview_completed') || '[]');
    if (!arr.includes(id)) { arr.push(id); localStorage.setItem('oar_preview_completed', JSON.stringify(arr)); }
  } catch (_) {}
}

function _formatCountdown(ms) {
  if (ms <= 0) return 'Expired';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}

function _sectionOrder(weakSection) {
  const all = ['MATH SKILLS','READING COMPREHENSION','MECHANICAL COMPREHENSION'];
  return [weakSection, ...all.filter(s => s !== weakSection)];
}

// ── Grid view ─────────────────────────────────────────────────────────────────

route('/lessons-preview', () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  const { email, expires, weak } = _getPreviewToken();
  const remaining = expires - Date.now();
  const completedIds = _getCompletedIds();

  const order = email ? _sectionOrder(weak) : ['MATH SKILLS', 'READING COMPREHENSION', 'MECHANICAL COMPREHENSION'];
  const grouped = {};
  for (const s of order) grouped[s] = [];
  for (const l of PREVIEW_LESSONS) {
    if (grouped[l.section]) grouped[l.section].push(l);
  }

  const completedCount = [...completedIds].filter(id => PREVIEW_FREE_IDS.has(id)).length;

  app.innerHTML = `
    <!-- Sticky top bar -->
    <div style="position:sticky;top:0;z-index:50;background:var(--bg-elevated);border-bottom:1px solid var(--border);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:20px">
        <a href="#/" style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:15px;color:var(--text);text-decoration:none">⚓ OAR <span style="color:var(--accent)">Pro</span></a>
        <span style="font-size:12px;color:var(--text-3)"><span style="color:var(--text-2);font-weight:700">3</span> / 20 lessons free</span>
      </div>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        ${email
          ? `<span style="font-size:12px;color:var(--text-3)">Access expires: <span id="pvTimer" style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${remaining<=3600000?'var(--red)':'var(--yellow)'}">${_formatCountdown(remaining)}</span></span>`
          : `<span style="font-size:12px;color:var(--text-3)">3 lessons free &bull; No account required</span>`}
        <button class="btn btn-primary btn-sm" onclick="handleCheckoutClick(this)">Upgrade — $97 →</button>
      </div>
    </div>

    <!-- Body -->
    <div style="max-width:860px;margin:0 auto;padding:40px 24px 80px">

      <!-- Header -->
      <div style="text-align:center;margin-bottom:36px">
        <div style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:14px">${email ? 'Your Free Access' : 'Free Preview'}</div>
        <h1 style="font-size:clamp(1.5rem,3vw,2rem);font-weight:800;margin-bottom:10px;letter-spacing:-.025em">${email ? '3 Starter Lessons Unlocked' : 'Start Your Free OAR Prep'}</h1>
        <p style="color:var(--text-2);font-size:14px;max-width:500px;margin:0 auto">
          ${email
            ? `Based on your diagnostic, we recommend starting with <strong style="color:var(--text)">${SECTION_SHORT[weak] || 'Math'}</strong>. Complete these, then upgrade to access all 20 lessons.`
            : 'Browse all 20 OAR lessons. Click any free lesson to start — just enter your email when you open one.'}
        </p>
      </div>

      <!-- Progress overview -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px 24px;margin-bottom:36px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:13px;font-weight:600">Your lesson progress</span>
          <span style="font-size:12px;color:var(--text-3)">${completedCount} of 3 free completed</span>
        </div>
        <div style="display:flex;gap:3px;height:8px">
          ${Array.from({length:20},(_,i)=>`<div style="flex:1;height:100%;border-radius:3px;background:${i<3?'var(--accent)':'var(--bg)'}"></div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-top:6px">
          <span>Free (3)</span><span>OAR Pro unlocks 17 more</span>
        </div>
      </div>

      <!-- Lesson sections -->
      ${order.map(section => `
        <div style="margin-bottom:36px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <span style="font-size:18px">${SECTION_ICONS[section]}</span>
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">${section}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${grouped[section].map(lesson => {
              const free = PREVIEW_FREE_IDS.has(lesson.id);
              const done = completedIds.has(lesson.id);
              if (free) {
                return `<div onclick="navigate('#/lesson-preview/${lesson.id}')"
                  style="background:var(--surface);border:1px solid ${done?'var(--green)':' var(--accent)'};border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:transform .15s,border-color .15s"
                  onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
                  <div style="width:34px;height:34px;border-radius:8px;background:${done?'rgba(34,197,94,.12)':'rgba(59,130,246,.1)'};border:1px solid ${done?'var(--green)':'rgba(59,130,246,.25)'};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">
                    ${done?'✓':SECTION_ICONS[section]}
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px">${lesson.title}</div>
                    <div style="font-size:12px;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${lesson.desc}</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                    <span style="font-size:10px;font-weight:700;letter-spacing:.06em;background:rgba(59,130,246,.1);color:#60a5fa;border:1px solid rgba(59,130,246,.2);padding:3px 8px;border-radius:999px">FREE</span>
                    <span style="color:var(--text-3);font-size:20px;line-height:1">›</span>
                  </div>
                </div>`;
              } else {
                return `<div onclick="_pvLockModal('${lesson.title.replace(/'/g,"\\'")}')"
                  style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;opacity:.65;transition:opacity .15s"
                  onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='0.65'">
                  <div style="width:34px;height:34px;border-radius:8px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;color:var(--text-3)">🔒</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:14px;font-weight:600;color:var(--text-2);margin-bottom:2px">${lesson.title}</div>
                    <div style="font-size:12px;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${lesson.desc}</div>
                  </div>
                  <span style="font-size:10px;font-weight:700;letter-spacing:.06em;background:var(--bg);color:var(--text-3);border:1px solid var(--border);padding:3px 8px;border-radius:999px;flex-shrink:0">OAR PRO</span>
                </div>`;
              }
            }).join('')}
          </div>
        </div>
      `).join('')}

      <!-- Bottom upgrade CTA -->
      <div style="text-align:center;background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:16px;padding:40px 28px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:12px">Unlock Everything</div>
        <h2 style="font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:800;margin-bottom:10px">Get all 20 lessons + 190+ questions + AI tutor</h2>
        <p style="color:var(--text-2);font-size:14px;max-width:440px;margin:0 auto 24px">One payment. Lifetime access. Everything you need to score 55+ on the OAR.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="handleCheckoutClick(this)">Get OAR Pro — $97 →</button>
          <a href="#/diagnostic" class="btn btn-secondary btn-lg">Retake Diagnostic</a>
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-3)">30-day guarantee &bull; One-time payment &bull; Lifetime access</div>
      </div>
    </div>

    <!-- Lock modal -->
    <div id="pvModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:300;align-items:center;justify-content:center;padding:24px" onclick="if(event.target===this)_pvCloseLock()">
      <div style="background:var(--surface);border:1px solid var(--border-hover);border-radius:16px;padding:36px 28px;max-width:420px;width:100%;text-align:center">
        <div style="font-size:36px;margin-bottom:16px">🔒</div>
        <h3 style="font-size:18px;font-weight:800;margin-bottom:8px">Lesson Locked</h3>
        <p style="font-size:14px;color:var(--text-2);margin-bottom:20px"><em id="pvModalTitle" style="font-style:normal;color:var(--text);font-weight:600"></em> is available with OAR Pro.</p>
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px 16px;text-align:left;margin-bottom:24px">
          ${['All 20 structured lessons','190+ practice questions','Adaptive CAT simulations','AI Problem Tutor — unlimited','Score predictor & analytics'].map(f=>`
            <div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:13px"><span style="color:var(--green)">✓</span>${f}</div>`).join('')}
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%;margin-bottom:12px" onclick="handleCheckoutClick(this)">Get OAR Pro — $97 →</button>
        <button onclick="_pvCloseLock()" style="background:none;border:none;color:var(--text-3);font-size:13px;cursor:pointer;font-family:inherit">Maybe later</button>
      </div>
    </div>
  `;

  // Countdown ticker
  if (document.getElementById('pvTimer')) {
    clearInterval(window._pvTimerInt);
    window._pvTimerInt = setInterval(() => {
      const el = document.getElementById('pvTimer');
      if (!el) { clearInterval(window._pvTimerInt); return; }
      const rem = parseInt(localStorage.getItem('oar_preview_expires')||'0') - Date.now();
      el.textContent = _formatCountdown(rem);
      el.style.color = rem <= 3600000 ? 'var(--red)' : 'var(--yellow)';
    }, 1000);
  }
});

function _pvLockModal(title) {
  const el = document.getElementById('pvModalTitle');
  if (el) el.textContent = title;
  const m = document.getElementById('pvModal');
  if (m) m.style.display = 'flex';
}
function _pvCloseLock() {
  const m = document.getElementById('pvModal');
  if (m) m.style.display = 'none';
}
window._pvLockModal = _pvLockModal;
window._pvCloseLock = _pvCloseLock;

// ── Inline email capture for lesson viewer ────────────────────────────────────

function _renderLessonEmailCapture(lessonId, app) {
  const lesson = PREVIEW_LESSONS.find(l => l.id === lessonId);
  app.innerHTML = `
    <div style="max-width:500px;margin:0 auto;padding:60px 24px">
      <a href="#/lessons-preview" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:40px">← Back to lessons</a>
      <div style="text-align:center">
        <div style="font-size:40px;margin-bottom:16px">📖</div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:8px">${lesson ? lesson.section : 'OAR PRO'}</div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:8px;letter-spacing:-.02em">${lesson ? lesson.title : 'Free Lesson'}</h2>
        <p style="color:var(--text-2);font-size:14px;line-height:1.6;margin:0 auto 24px;max-width:380px">Enter your email to read this free lesson — no account or payment required.</p>
        <div style="display:flex;flex-direction:column;gap:10px;max-width:360px;margin:0 auto">
          <input type="email" id="pvEmailInput" placeholder="your@email.com"
            style="padding:12px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s"
            onkeydown="if(event.key==='Enter')_pvSubmitEmail(${lessonId})"
          />
          <button id="pvEmailBtn" onclick="_pvSubmitEmail(${lessonId})" class="btn btn-primary"
            style="padding:12px 20px;font-size:15px;font-weight:700">
            Read Free Lesson →
          </button>
        </div>
        <div style="margin-top:12px;font-size:11px;color:var(--text-3)">No spam. Unsubscribe anytime. 72-hour free access.</div>
      </div>
    </div>
  `;
  setTimeout(function () {
    const inp = document.getElementById('pvEmailInput');
    if (inp) inp.focus();
  }, 100);
}

async function _pvSubmitEmail(lessonId) {
  const input = document.getElementById('pvEmailInput');
  const btn   = document.getElementById('pvEmailBtn');
  if (!input || !input.value.trim()) { if (input) input.focus(); return; }

  const email = input.value.trim();
  if (!email.includes('@')) {
    input.style.borderColor = 'var(--red)';
    input.focus();
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Unlocking…';

  // Store preview token immediately — 72 hours
  localStorage.setItem('oar_preview_email', email.toLowerCase());
  localStorage.setItem('oar_preview_expires', String(Date.now() + 72 * 60 * 60 * 1000));
  if (!localStorage.getItem('oar_preview_weak_section')) {
    localStorage.setItem('oar_preview_weak_section', 'MATH SKILLS');
  }

  // Fire lead capture in background (non-blocking)
  if (window._emailCapture) {
    window._emailCapture.submitLeadCapture({ email: email, onSuccess: function () {}, onError: function () {} });
  }

  navigate('#/lesson-preview/' + lessonId);
}
window._pvSubmitEmail = _pvSubmitEmail;

// ── Individual lesson viewer ───────────────────────────────────────────────────

route('/lesson-preview/:id', async ({ id }) => {
  const lessonId = parseInt(id);
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  if (!PREVIEW_FREE_IDS.has(lessonId)) {
    const l = PREVIEW_LESSONS.find(x => x.id === lessonId);
    navigate('#/lessons-preview');
    setTimeout(() => _pvLockModal(l ? l.title : 'This lesson'), 200);
    return;
  }

  const { email } = _getPreviewToken();
  if (!email) { _renderLessonEmailCapture(lessonId, app); return; }

  app.innerHTML = `
    <div style="max-width:720px;margin:0 auto;padding:40px 24px 80px">
      <a href="#/lessons-preview" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:28px">← Back to lessons</a>
      <div id="pvLessonWrap"><div style="text-align:center;padding:60px 0;color:var(--text-3)">Loading…</div></div>
    </div>`;

  try {
    const res = await fetch(
      `https://ugblwepfptumffzcljot.supabase.co/rest/v1/lessons?id=eq.${lessonId}&select=id,title,section,description,content_html`,
      { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const rows = await res.json();
    const lesson = rows && rows[0];
    if (!lesson || !lesson.content_html) throw new Error('not found');

    _markCompleted(lessonId);

    const sectionLessons = PREVIEW_LESSONS.filter(l => l.section === lesson.section);
    const idx = sectionLessons.findIndex(l => l.id === lessonId);
    const next = sectionLessons[idx + 1] || null;

    document.getElementById('pvLessonWrap').innerHTML = `
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);margin-bottom:8px">${lesson.section}</div>
      <div class="lesson-content">${lesson.content_html}</div>

      <!-- Next lesson / upgrade -->
      <div style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border)">
        ${next ? `
          <div style="background:var(--surface);border:1px solid var(--border-hover);border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px">
            <div>
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);margin-bottom:4px">Up next — locked</div>
              <div style="font-size:15px;font-weight:700;margin-bottom:3px">🔒 ${next.title}</div>
              <div style="font-size:12px;color:var(--text-3)">${next.desc}</div>
            </div>
            <button class="btn btn-primary" onclick="handleCheckoutClick(this)">Unlock with OAR Pro →</button>
          </div>` : ''}
        <div style="text-align:center;background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:14px;padding:32px 24px">
          <h3 style="font-size:18px;font-weight:800;margin-bottom:8px">Ready to keep going?</h3>
          <p style="color:var(--text-2);font-size:14px;margin-bottom:20px">Unlock all 20 lessons, 190+ questions, adaptive testing, and the AI tutor for $97.</p>
          <button class="btn btn-primary btn-lg" onclick="handleCheckoutClick(this)">Get OAR Pro — $97 →</button>
          <div style="margin-top:10px;font-size:11px;color:var(--text-3)">30-day money-back guarantee</div>
        </div>
      </div>
    `;
  } catch (_) {
    document.getElementById('pvLessonWrap').innerHTML = `
      <div style="text-align:center;padding:40px">
        <p style="color:var(--text-3)">Could not load lesson. <a href="#/lessons-preview" style="color:var(--accent)">← Back to lessons</a></p>
      </div>`;
  }
});
