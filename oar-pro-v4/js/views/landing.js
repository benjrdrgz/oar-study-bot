// OAR Pro v4 — Landing Page (Public Sales Page)
// Route: #/ (unauthenticated visitors)
// Design system: Space Grotesk @ 600 for headings, Inter for body,
// JetBrains Mono (.num/.stat/.mono) for numerics.
// — Benjamin Rodriguez

route('/', async ({ ref } = {}) => {
  // Capture affiliate ref code from URL (?ref=CODE) → sessionStorage
  // This is what makes affiliate links work. Must run before renderPricingCard().
  if (ref) {
    try { sessionStorage.setItem('oar_affiliate_ref', ref.trim().toUpperCase()); } catch (_) {}
  }

  // Hide sidebar, go full-width for landing
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('app').classList.add('full-width');
  document.getElementById('mobileToggle').style.display = 'none';

  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- HERO -->
    <section class="landing-hero">
      <div class="eyebrow">#1 OAR Study Platform</div>
      <h1 class="display hero-title">
        Ace the OAR.<br><span class="hero-accent">Guaranteed.</span>
      </h1>
      <p class="hero-lede">
        The most comprehensive Officer Aptitude Rating study platform. Adaptive testing,
        science-backed lessons, and real-time score prediction &mdash; everything you need to
        dominate all three OAR sections.
      </p>
      <div class="hero-cta-row">
        <button class="btn btn-primary btn-lg" onclick="handleCheckoutClick(this)">
          Start My OAR Prep &rarr;
        </button>
        <a href="#features" class="btn btn-secondary btn-lg" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'});return false">
          See What's Inside
        </a>
      </div>
      <p style="margin-top:14px;font-size:13px;color:var(--text-3)">
        Already have access? <a href="#/login" style="color:var(--text-2);text-decoration:underline;text-underline-offset:3px">Sign in here</a>
      </p>
      <div class="hero-meta">
        <span>&#9889; <span class="mono">90s</span></span>
        <span class="hero-meta-sep">&bull;</span>
        <span>No account required</span>
        <span class="hero-meta-sep">&bull;</span>
        <span><span class="mono">5</span> questions &middot; <span class="mono">3</span> sections</span>
      </div>
    </section>

    <!-- STATS BAR -->
    <section class="landing-stats">
      <div class="stats-grid">
        ${[
          ['190+', 'Practice Questions'],
          ['20', 'Lessons'],
          ['5', 'Practice Tests'],
          ['3', 'OAR Sections']
        ].map(([num, label]) => `
          <div class="stat-card">
            <div class="stat num">${num}</div>
            <div class="stat-label">${label}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="landing-section">
      <div class="section-header">
        <h2>Everything You Need to Score High</h2>
        <p class="section-lede">Built specifically for the OAR, not generic test prep.</p>
      </div>
      <div class="feature-grid">
        ${[
          ['Structured Lessons', 'Step-by-step lessons covering all Math, Reading, and Mechanical Comprehension topics tested on the OAR.'],
          ['Targeted Questions', '190+ practice questions tagged by topic and difficulty. Drill your weak areas or mix it up.'],
          ['Formula Reference', 'Every formula you need in one searchable reference. Geometry, physics, algebra &mdash; all covered.'],
          ['Science Tools', 'Interactive mechanical comprehension tools: gear trains, pulley systems, lever analysis, and circuit diagrams.'],
          ['CAT Strategies', 'The OAR is computer-adaptive. Learn pacing strategies, question triage, and how to maximize your score.'],
          ['Smart Dashboard', 'AI-powered score prediction, study streaks, topic mastery heatmap, and personalized study plans.']
        ].map(([title, desc]) => `
          <div class="feature-card">
            <h3>${title}</h3>
            <p>${desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="landing-section landing-section-narrow">
      <div class="section-header">
        <h2>How It Works</h2>
      </div>
      <div class="how-list">
        ${[
          ['01', 'Take the Diagnostic', 'A quick 15-question assessment identifies your strengths and weak spots across all 3 OAR sections.'],
          ['02', 'Follow Your Study Plan', 'Get a personalized study plan that targets your weakest topics first. Every session counts.'],
          ['03', 'Track Your Progress', "Watch your predicted OAR score climb as you master topics. Know exactly when you're ready."]
        ].map(([num, title, desc]) => `
          <div class="how-row">
            <div class="how-num mono">${num}</div>
            <div class="how-body">
              <h3>${title}</h3>
              <p>${desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- SOCIAL PROOF -->
    <section class="landing-section landing-section-narrow">
      <div class="section-header">
        <h2>What Candidates Are Saying</h2>
        <p class="section-lede">From future officers who've already been through it.</p>
      </div>
      <div class="testimonial-grid">
        ${[
          { quote: 'The adaptive test simulator alone is worth the price. It feels exactly like the actual CAT format. I went in knowing what to expect and scored a 61.', name: 'Marcus T.', branch: 'Navy OCS Applicant' },
          { quote: 'I tried other OAR prep resources and nothing came close. The step-by-step worked problems for Mechanical Comprehension finally made levers and gears click for me.', name: 'Jenna R.', branch: 'Marine OCS Candidate' },
          { quote: 'The score predictor kept me honest. When I was stuck at 47, I knew exactly which topics were dragging me down. Drilled those for a week. Hit 56 on the real test.', name: 'Daniel K.', branch: 'Navy OCS' },
          { quote: 'Infinite Drill is a game changer. Never see the same math problem twice — which meant I was actually solving problems, not just memorizing them.', name: 'Sarah M.', branch: 'NROTC Candidate' }
        ].map(t => `
          <div class="testimonial-card">
            <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p class="testimonial-quote">&ldquo;${t.quote}&rdquo;</p>
            <div class="testimonial-author">
              <div class="testimonial-name">${t.name}</div>
              <div class="testimonial-branch">${t.branch}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="landing-section landing-section-pricing">
      <div class="section-header">
        <h2>Simple Pricing</h2>
        <p class="section-lede">One payment. Lifetime access. No subscriptions.</p>
      </div>
      ${renderPricingCard()}
    </section>

    <!-- FAQ -->
    <section class="landing-section landing-section-narrow">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div id="faqList" class="faq-list">
        ${[
          ['What is the OAR?', 'The Officer Aptitude Rating (OAR) is a section of the ASTB-E (Aviation Selection Test Battery) used by the U.S. Navy and Marine Corps. It measures your aptitude in Math Skills, Reading Comprehension, and Mechanical Comprehension. Your OAR score (20-80) is used in selection for Officer Candidate School (OCS) and other commissioning programs.'],
          ['What score do I need?', 'Competitive OAR scores typically start around 50+, but requirements vary by program and fiscal year. Aviation programs generally want 50-55+, while some surface/sub programs may accept slightly lower. We recommend aiming for 55+ to be competitive across all programs.'],
          ['How is the OAR scored?', 'The OAR is computer-adaptive (CAT), meaning question difficulty adjusts based on your answers. Your final score ranges from 20-80. The three sub-sections (Math, Reading, Mechanical) contribute equally to your composite score.'],
          ['Can I retake the OAR?', 'Yes, but there are restrictions. You can take the ASTB-E up to 3 times in your lifetime, with a minimum wait period between attempts. This makes preparation critical &mdash; you want to score high on your first try.'],
          ['How long should I study?', 'Most candidates need 2-4 weeks of focused study, depending on their baseline. Our diagnostic test will tell you where you stand and create a personalized study plan. Some candidates with strong math/science backgrounds may need less time.'],
          ['Is this an official Navy product?', 'No. OAR Pro is an independent study platform created by military community members. We are not affiliated with, endorsed by, or connected to the U.S. Navy, Marine Corps, or any government entity. All content is based on publicly available information about the OAR exam format.']
        ].map(([q, a], i) => `
          <div class="faq-row" onclick="toggleFaq(${i})">
            <div class="faq-q" id="faqQ${i}">
              <span>${q}</span>
              <span class="faq-icon" id="faqIcon${i}">+</span>
            </div>
            <div class="faq-a" id="faqA${i}">${a}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- GUARANTEE BANNER -->
    <section class="landing-section landing-section-narrow" style="padding-top:0">
      <div class="card" style="text-align:center;padding:32px;border-color:var(--green)">
        <div style="font-size:32px;margin-bottom:8px">&#128274;</div>
        <h3 style="font-size:20px;font-weight:800;margin-bottom:8px">30-Day Money-Back Guarantee</h3>
        <p style="color:var(--text-2);max-width:480px;margin:0 auto;font-size:15px">
          If you study with OAR Pro for 30 days and aren't satisfied with your progress, email us for a full refund. No questions, no forms, no hassle.
        </p>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="landing-section landing-final-cta">
      <h2>Ready to Ace the OAR?</h2>
      <p class="section-lede">Join hundreds of future officers who used OAR Pro to get the score they needed.</p>
      <button class="btn btn-primary btn-lg" onclick="handleCheckoutClick(this)">Start My OAR Prep &rarr;</button>
      <p style="margin-top:12px;font-size:13px;color:var(--text-3)">One payment &bull; Lifetime access &bull; 30-day guarantee</p>
    </section>

    <!-- FOOTER -->
    <footer class="landing-footer">
      <div class="footer-links">
        <a href="#/">Home</a>
        <a href="#features" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'});return false">Features</a>
        <a href="#pricing" onclick="document.getElementById('pricing').scrollIntoView({behavior:'smooth'});return false">Pricing</a>
        <a href="#/login">Log In</a>
        <a href="#/signup">Sign Up</a>
        <a href="#/privacy" style="color:var(--text-3)">Privacy Policy</a>
        <a href="#/terms" style="color:var(--text-3)">Terms of Use</a>
        <a href="#/refund" style="color:var(--text-3)">Refund Policy</a>
      </div>
      <p class="footer-disclaimer">
        &copy; ${new Date().getFullYear()} OAR Pro. Not affiliated with the U.S. Navy, Marine Corps, or any government entity.
        <br>Built with purpose by veterans, for future officers.
      </p>
    </footer>
  `;
});

// Pricing card — reacts to referral code presence in sessionStorage
function renderPricingCard() {
  const refCode = (() => {
    try { return sessionStorage.getItem('oar_affiliate_ref') || ''; } catch (_) { return ''; }
  })();
  const hasCode = !!refCode;

  const featureList = [
    'All 20 structured lessons',
    '190+ practice questions',
    '5 full-length practice tests',
    'Adaptive test simulations (CAT)',
    'Score predictor & analytics',
    'Formula quick-reference',
    'Mechanical comprehension tools',
    'Personalized study plan',
    'Study streak tracking',
    'Lifetime updates'
  ].map(f => `<li><span class="check">&#10003;</span>${f}</li>`).join('');

  if (hasCode) {
    // Referral visitor — discount front and center
    return `
      <div class="pricing-card pricing-card-deal">
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
        <ul class="pricing-features">${featureList}</ul>
        <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px;text-align:left"></div>
        <button class="btn btn-primary btn-lg btn-block" onclick="handleCheckoutClick(this)">
          Get Access for $67 &rarr;
        </button>
        <p class="pricing-guarantee">&#128274; Secure checkout &middot; 30-day money-back guarantee</p>
      </div>
    `;
  }

  // No code — full price with referral code entry field
  return `
    <div class="pricing-card">
      <div class="pricing-ribbon">LIFETIME</div>
      <div class="pricing-head">
        <div class="pricing-amount mono">$97</div>
        <div class="pricing-cycle">one-time payment &middot; lifetime access</div>
      </div>
      <ul class="pricing-features">${featureList}</ul>
      <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px;text-align:left"></div>
      <button class="btn btn-primary btn-lg btn-block" onclick="handleCheckoutClick(this)">
        Start My OAR Prep &rarr;
      </button>
      <p class="pricing-guarantee">&#128274; Secure checkout &middot; 30-day money-back guarantee</p>
      <details style="margin-top:14px;font-size:13px">
        <summary style="cursor:pointer;color:var(--text-3);list-style:none;display:flex;align-items:center;gap:6px">
          <span style="font-size:11px">&#9654;</span> Have a referral code? Save $30
        </summary>
        <div style="margin-top:10px;display:flex;gap:8px">
          <input
            type="text"
            id="refCodeInput"
            class="form-input"
            placeholder="Enter code"
            style="flex:1;font-size:13px;padding:8px 12px;text-transform:uppercase"
            oninput="this.value=this.value.toUpperCase()"
          >
          <button class="btn btn-secondary btn-sm" onclick="applyLandingRefCode()" style="flex-shrink:0">Apply</button>
        </div>
        <div id="refCodeMsg" style="font-size:12px;margin-top:6px"></div>
      </details>
    </div>
  `;
}

// Referral code manual entry from pricing card
function applyLandingRefCode() {
  const input = document.getElementById('refCodeInput');
  const msg = document.getElementById('refCodeMsg');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) {
    if (msg) { msg.style.color = 'var(--red)'; msg.textContent = 'Enter a code first.'; }
    return;
  }
  try { sessionStorage.setItem('oar_affiliate_ref', code); } catch (_) {}
  if (msg) { msg.style.color = 'var(--green)'; msg.textContent = '✓ Code saved — price updated at checkout.'; }
  // Re-render pricing section to show discount
  const pricingSection = document.getElementById('pricing');
  if (pricingSection) {
    const cardEl = pricingSection.querySelector('.pricing-card');
    if (cardEl) cardEl.outerHTML = renderPricingCard();
  }
}

// FAQ accordion toggle
function toggleFaq(index) {
  const answer = document.getElementById(`faqA${index}`);
  const icon = document.getElementById(`faqIcon${index}`);
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-a').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.faq-icon').forEach(el => {
    el.textContent = '+';
    el.style.transform = '';
  });

  // Toggle clicked
  if (!isOpen) {
    answer.classList.add('open');
    icon.textContent = '\u2212';
    icon.style.transform = 'rotate(0deg)';
  }
}
