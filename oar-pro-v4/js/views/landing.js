// OAR Pro v4 — Landing Page v3
// Full redesign matching ArmedPrep design system.
// Route: #/ (public, no auth required)
// — Benjamin Rodriguez

route('/', async ({ ref } = {}) => {
  // Persist affiliate ref code from URL (?ref=CODE)
  if (ref) {
    try { sessionStorage.setItem('oar_affiliate_ref', ref.trim().toUpperCase()); } catch (_) {}
  }

  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('app').classList.add('full-width');
  document.getElementById('mobileToggle').style.display = 'none';

  const app = document.getElementById('app');
  app.innerHTML = `

    <!-- ── TOP NAV ──────────────────────────────────────────────── -->
    <nav style="position:sticky;top:0;z-index:100;background:rgba(6,11,24,.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border)">
      <div class="ap-wrap" style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;padding-bottom:12px">
        <div style="font-size:15px;font-weight:700;letter-spacing:-.01em;color:var(--text)">&#9875; OAR <span style="color:var(--accent)">Pro</span></div>
        <a href="#/login" class="ap-btn ap-btn-secondary" style="padding:7px 18px;font-size:13px">Sign In</a>
      </div>
    </nav>

    <!-- ── HERO ──────────────────────────────────────────────────── -->
    <section class="ap-hero">
      <div class="ap-wrap">
        <div class="ap-badge">
          <span class="ap-badge-dot"></span> Free Diagnostic — See Where You Stand
        </div>
        <h1>Ace the OAR.<br><span class="ap-gradient">Score Guaranteed.</span></h1>
        <p class="ap-hero-sub">
          The most comprehensive Officer Aptitude Rating prep platform.
          Adaptive testing, AI tutoring, 190+ questions — built for the OAR, not recycled from generic test prep.
        </p>
        <div class="ap-hero-actions">
          <button class="ap-btn ap-btn-primary ap-btn-lg" onclick="handleCheckoutClick(this)">
            Get OAR Pro — $97 →
          </button>
          <div style="display:flex;flex-direction:column;align-items:center;gap:5px">
            <a href="#/lessons-preview" class="ap-btn ap-btn-secondary ap-btn-lg">Get Free Access →</a>
            <span style="font-size:11px;color:var(--text-3);font-weight:600;letter-spacing:.04em"><span class="ap-free-badge">3 lessons free</span> &bull; No account required</span>
          </div>
        </div>
        <div style="text-align:center;margin-top:8px">
          <a href="#/diagnostic" style="font-size:12px;color:var(--text-3);text-decoration:none;transition:color .15s" onmouseover="this.style.color='var(--text-2)'" onmouseout="this.style.color='var(--text-3)'">Or get a free OAR score estimate — 90-second diagnostic →</a>
        </div>
        <div class="ap-hero-meta">
          <span>📖 3 lessons free</span>
          <span>·</span>
          <span>No account needed</span>
          <span>·</span>
          <span>Score 55+ on the OAR</span>
        </div>

        <!-- Score mockup -->
        <div class="ap-score-mockup">
          <div class="ap-sm-chrome">
            <div class="ap-sm-dots">
              <span class="ap-sm-dot" style="background:#ff5f57"></span>
              <span class="ap-sm-dot" style="background:#ffbd2e"></span>
              <span class="ap-sm-dot" style="background:#28c940"></span>
            </div>
            <div class="ap-sm-url">oar.armedprep.com &mdash; Adaptive CAT Simulation</div>
          </div>
          <div class="ap-sm-body">
            <div class="ap-sm-row">
              <div>
                <div class="ap-sm-label">Predicted OAR Score</div>
                <div class="ap-sm-score">
                  <span class="ap-sm-num" id="apScoreNum">35</span>
                  <span class="ap-sm-delta">&#8593; +11 this week</span>
                </div>
                <div class="ap-sm-bars">
                  <div class="ap-sm-bar-row">
                    <div class="ap-sm-bar-meta"><span>Math</span><span>64%</span></div>
                    <div class="ap-sm-bar-track"><div class="ap-sm-bar-fill" style="width:64%;background:#3b82f6;transition:width 1.2s ease"></div></div>
                  </div>
                  <div class="ap-sm-bar-row">
                    <div class="ap-sm-bar-meta"><span>Reading</span><span>78%</span></div>
                    <div class="ap-sm-bar-track"><div class="ap-sm-bar-fill" style="width:78%;background:#22c55e;transition:width 1.2s .2s ease"></div></div>
                  </div>
                  <div class="ap-sm-bar-row">
                    <div class="ap-sm-bar-meta"><span>Mechanical</span><span>51%</span></div>
                    <div class="ap-sm-bar-track"><div class="ap-sm-bar-fill" style="width:51%;background:#f59e0b;transition:width 1.2s .4s ease"></div></div>
                  </div>
                </div>
              </div>
              <div>
                <div class="ap-sm-stat-grid">
                  <div class="ap-sm-stat">
                    <div class="ap-sm-stat-n">87</div>
                    <div class="ap-sm-stat-l">Questions<br>Answered</div>
                  </div>
                  <div class="ap-sm-stat">
                    <div class="ap-sm-stat-n">14</div>
                    <div class="ap-sm-stat-l">Day<br>Streak</div>
                  </div>
                  <div class="ap-sm-stat">
                    <div class="ap-sm-stat-n">6/20</div>
                    <div class="ap-sm-stat-l">Lessons<br>Done</div>
                  </div>
                  <div class="ap-sm-stat">
                    <div class="ap-sm-stat-n">67%</div>
                    <div class="ap-sm-stat-l">Overall<br>Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── STATS BAR ──────────────────────────────────────────────── -->
    <div class="ap-stats-bar">
      <div class="ap-stats-grid">
        ${[['190+','Practice Questions'],['20','Structured Lessons'],['41','Drill Generators'],['3','OAR Sections']].map(([n,l]) => `
          <div class="ap-stat-item">
            <div class="ap-stat-n">${n}</div>
            <div class="ap-stat-l">${l}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- ── FEATURES ───────────────────────────────────────────────── -->
    <section class="ap-section">
      <div class="ap-wrap">
        <div class="ap-section-head">
          <div class="ap-section-label">What's Included</div>
          <h2>Everything You Need to Score High</h2>
          <p>Built specifically for the OAR — not generic test prep recycled from another platform.</p>
        </div>
        <div class="ap-feature-grid">
          ${[
            ['📚','Structured Lessons','Step-by-step lessons covering all Math, Reading, and Mechanical Comprehension topics tested on the OAR.'],
            ['🎯','Adaptive Practice','190+ questions tagged by topic and difficulty. The system finds your weak spots and drills them first.'],
            ['🔢','Formula Reference','Every formula you need in one searchable card — geometry, physics, algebra, all covered.'],
            ['⚙️','Mechanical Tools','Interactive diagrams: gear trains, pulleys, levers, circuits. Mechanical concepts actually stick.'],
            ['🧠','AI Tutor','Stuck on a problem? The tutor walks through it step by step — unlimited, available 24/7.'],
            ['📈','Score Predictor','Live OAR score estimate that updates as you practice. Know exactly where you stand.']
          ].map(([icon,title,desc]) => `
            <div class="ap-feature-card">
              <div class="ap-feature-icon">${icon}</div>
              <h3>${title}</h3>
              <p>${desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ───────────────────────────────────────────── -->
    <section class="ap-section ap-section-dark">
      <div class="ap-wrap">
        <div class="ap-section-head">
          <div class="ap-section-label">How It Works</div>
          <h2>Study Smarter. Score Higher.</h2>
          <p>Most candidates waste 60% of study time on the wrong topics. We fix that.</p>
        </div>
        <div class="ap-how-grid">
          ${[
            ['01','Take the Free Diagnostic','A 5-question assessment across all 3 OAR sections. Tells you exactly where your score is coming from and where to improve.'],
            ['02','Follow Your Study Plan','We target your weakest sections first. Every session is 20–30 minutes. Short, consistent sessions beat marathon cramming every time.'],
            ['03','Track Your Score','Your predicted OAR score updates in real time as you practice. Know exactly when you\'re ready to walk in.']
          ].map(([num,title,desc]) => `
            <div class="ap-how-card">
              <div class="ap-how-num">${num}</div>
              <h3>${title}</h3>
              <p>${desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ── PRICING ────────────────────────────────────────────────── -->
    <section class="ap-section ap-section-dark" id="pricing">
      <div class="ap-wrap">
        <div class="ap-section-head">
          <div class="ap-section-label">Pricing</div>
          <h2>Simple Pricing</h2>
          <p>One payment. Lifetime access. No subscriptions, no renewals.</p>
        </div>
        ${renderPricingCard()}
      </div>
    </section>

    <!-- ── FAQ ───────────────────────────────────────────────────── -->
    <section class="ap-section ap-section-dark">
      <div class="ap-wrap">
        <div class="ap-section-head">
          <div class="ap-section-label">FAQ</div>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div class="ap-faq-list">
          ${[
            ['What is the OAR?','The Officer Aptitude Rating (OAR) is a section of the ASTB-E used by the U.S. Navy and Marine Corps. It measures Math Skills, Reading Comprehension, and Mechanical Comprehension. Your score (20–80) is used in selection for OCS and other commissioning programs.'],
            ['What score do I need?','Competitive OAR scores typically start around 50+. Aviation programs generally want 50–55+. We recommend aiming for 55+ to stay competitive across all programs.'],
            ['How is the OAR scored?','The OAR is computer-adaptive (CAT) — difficulty adjusts based on your answers. Final score ranges from 20–80. Math, Reading, and Mechanical contribute equally to your composite.'],
            ['Can I retake the OAR?','Yes, but there are restrictions. You can take the ASTB-E up to 3 times in your lifetime with required wait periods between attempts. This makes preparation critical — score high the first time.'],
            ['How long should I study?','Most candidates need 2–4 weeks of focused study depending on baseline. Our diagnostic tells you exactly where to start. Short sessions (20–30 min/day) beat marathon cramming every time.'],
            ['Is this an official Navy product?','No. OAR Pro is an independent study platform. We are not affiliated with, endorsed by, or connected to the U.S. Navy, Marine Corps, or any government entity. All content is based on publicly available information about the OAR exam format.']
          ].map(([q,a],i) => `
            <div class="ap-faq-item" id="apFaq${i}">
              <button class="ap-faq-q" onclick="toggleApFaq(${i})">
                <span>${q}</span>
                <span class="ap-faq-chevron" id="apFaqChev${i}">&#9660;</span>
              </button>
              <div class="ap-faq-a" id="apFaqA${i}">
                <div class="ap-faq-a-inner">${a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ── FINAL CTA ──────────────────────────────────────────────── -->
    <section class="ap-section ap-final-cta">
      <div class="ap-wrap">
        <div class="ap-section-label" style="display:inline-block;margin-bottom:20px">Get Started</div>
        <h2>Ready to Ace the OAR?</h2>
        <p class="ap-final-sub">Join hundreds of future officers who used OAR Pro to score what they needed.</p>
        <div class="ap-hero-actions" style="justify-content:center">
          <button class="ap-btn ap-btn-primary ap-btn-lg" onclick="handleCheckoutClick(this)">Get OAR Pro — $97 →</button>
          <a href="#/diagnostic" class="ap-btn ap-btn-secondary ap-btn-lg">Try Free Diagnostic</a>
        </div>
        <p class="ap-final-note">One payment &bull; Lifetime access &bull; 30-day guarantee</p>
      </div>
    </section>

    <!-- ── FOOTER ─────────────────────────────────────────────────── -->
    <footer class="ap-footer">
      <div class="ap-wrap">
        <div class="ap-footer-inner">
          <div class="ap-footer-brand">
            <div class="ap-footer-logo">&#9875; OAR <span>Pro</span></div>
            <p>The most comprehensive OAR study platform. Not affiliated with the U.S. Navy, Marine Corps, or any government entity.</p>
          </div>
          <div class="ap-footer-links">
            <a href="#/">Home</a>
            <a href="#/diagnostic">Free Diagnostic</a>
            <a href="#/login">Log In</a>
            <a href="#/signup">Sign Up</a>
            <a href="https://armedprep.com">ArmedPrep</a>
            <a href="#/privacy">Privacy</a>
            <a href="#/terms">Terms</a>
            <a href="#/refund">Refund Policy</a>
            <a href="#/recruiters">Recruiters</a>
          </div>
        </div>
        <div class="ap-footer-bottom">
          <span>&copy; ${new Date().getFullYear()} OAR Pro by ArmedPrep</span>
          <a href="https://armedprep.com">armedprep.com</a>
        </div>
      </div>
    </footer>
  `;

  // Animate score counter: 35 → 52
  const numEl = document.getElementById('apScoreNum');
  if (numEl) {
    let count = 35;
    const timer = setInterval(() => {
      count++;
      numEl.textContent = count;
      if (count >= 52) clearInterval(timer);
    }, 45);
  }
});

// ── Pricing card ──────────────────────────────────────────────────────────────
// Reads affiliate ref from sessionStorage; shows discount if code present.
function renderPricingCard() {
  const refCode = (() => { try { return sessionStorage.getItem('oar_affiliate_ref') || ''; } catch (_) { return ''; } })();
  const hasCode = !!refCode;

  const features = [
    'All 20 structured lessons',
    '190+ practice questions',
    'Adaptive CAT simulations',
    'Score predictor & analytics',
    'Formula quick-reference',
    'Mechanical comprehension tools',
    'Personalized study plan',
    'AI Problem Tutor — unlimited',
    'Study streak tracking',
    'Lifetime updates'
  ];
  const featureGrid = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 16px;margin:16px 0 24px;padding-top:16px;border-top:1px solid var(--border)">
    ${features.map(f => `<div style="display:flex;align-items:center;gap:7px;padding:5px 0;font-size:13px;color:var(--text)"><span style="color:var(--green);flex-shrink:0;font-size:14px">&#10003;</span>${f}</div>`).join('')}
  </div>`;

  if (hasCode) {
    return `
      <div class="pricing-card pricing-card-deal" style="max-width:620px;margin:0 auto">
        <div class="pricing-ribbon pricing-ribbon-deal">$30 OFF</div>
        <div class="pricing-deal-banner">
          <span class="pricing-deal-icon">&#127881;</span>
          <span>Referral discount applied &mdash; your code saves you $30!</span>
        </div>
        <div class="pricing-head">
          <div class="pricing-strike mono">$97</div>
          <div class="pricing-amount mono pricing-amount-deal">$67</div>
          <div class="pricing-cycle">one-time payment &middot; lifetime access</div>
        </div>
        ${featureGrid}
        <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px"></div>
        <button class="ap-btn ap-btn-primary ap-btn-lg" style="width:100%;justify-content:center" onclick="handleCheckoutClick(this)">Get Access for $67 &rarr;</button>
        <p style="text-align:center;font-size:12px;color:var(--text-3);margin:12px 0 0">&#128274; Secure checkout &middot; 30-day money-back guarantee</p>
      </div>
    `;
  }

  return `
    <div class="pricing-card" style="max-width:620px;margin:0 auto">
      <div class="pricing-ribbon">LIFETIME</div>
      <div class="pricing-head">
        <div class="pricing-amount mono">$97</div>
        <div class="pricing-cycle">one-time payment &middot; lifetime access</div>
      </div>
      ${featureGrid}
      <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px"></div>
      <button class="ap-btn ap-btn-primary ap-btn-lg" style="width:100%;justify-content:center" onclick="handleCheckoutClick(this)">Start My OAR Prep &rarr;</button>
      <p style="text-align:center;font-size:12px;color:var(--text-3);margin:12px 0 0">&#128274; Secure checkout &middot; 30-day money-back guarantee</p>
      <details style="margin-top:14px;font-size:13px">
        <summary style="cursor:pointer;color:var(--text-3);list-style:none;display:flex;align-items:center;gap:6px">
          <span style="font-size:11px">&#9654;</span> Have a referral code? Save $30
        </summary>
        <div style="margin-top:10px;display:flex;gap:8px">
          <input type="text" id="refCodeInput" class="form-input" placeholder="Enter code" style="flex:1;font-size:13px;padding:8px 12px;text-transform:uppercase" oninput="this.value=this.value.toUpperCase()">
          <button class="btn btn-secondary btn-sm" onclick="applyLandingRefCode()" style="flex-shrink:0">Apply</button>
        </div>
        <div id="refCodeMsg" style="font-size:12px;margin-top:6px"></div>
      </details>
    </div>
  `;
}

// Apply referral code entered manually in the pricing card
function applyLandingRefCode() {
  const input = document.getElementById('refCodeInput');
  const msg = document.getElementById('refCodeMsg');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) {
    if (msg) { msg.style.color = 'var(--red)'; msg.textContent = 'Enter a code first.'; }
    return;
  }
  try { sessionStorage.setItem('oar_affiliate_ref', code); } catch (_) {}
  if (msg) { msg.style.color = 'var(--green)'; msg.textContent = '&#10003; Code saved — discount applied at checkout.'; }
  const pricingSection = document.getElementById('pricing');
  if (pricingSection) {
    const cardEl = pricingSection.querySelector('.pricing-card');
    if (cardEl) cardEl.outerHTML = renderPricingCard();
  }
}

// FAQ accordion — animated chevron, max-height transition
function toggleApFaq(index) {
  const item = document.getElementById(`apFaq${index}`);
  const answer = document.getElementById(`apFaqA${index}`);
  if (!item || !answer) return;
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.ap-faq-item').forEach(el => el.classList.remove('open'));

  // Open clicked (if it was closed)
  if (!isOpen) item.classList.add('open');
}
