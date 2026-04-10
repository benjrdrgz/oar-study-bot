// OAR Pro v4 — Landing Page (Public Sales Page)
// Route: #/ (unauthenticated visitors)

route('/', async () => {
  // Hide sidebar, go full-width for landing
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('app').classList.add('full-width');
  document.getElementById('mobileToggle').style.display = 'none';

  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- HERO -->
    <section style="text-align:center;padding:80px 20px 60px;max-width:720px;margin:0 auto">
      <div style="display:inline-block;padding:6px 16px;border-radius:20px;background:var(--accent-glow);color:var(--accent);font-size:13px;font-weight:700;margin-bottom:20px">
        #1 OAR Study Platform
      </div>
      <h1 style="font-size:clamp(36px,5vw,56px);font-weight:800;line-height:1.1;letter-spacing:-1.5px;margin-bottom:16px">
        Ace the OAR.<br><span style="color:var(--accent)">Guaranteed.</span>
      </h1>
      <p style="font-size:18px;color:var(--text-2);max-width:540px;margin:0 auto 32px;line-height:1.7">
        The most comprehensive Officer Aptitude Rating study platform. Adaptive testing,
        science-backed lessons, and real-time score prediction &mdash; everything you need to
        dominate all three OAR sections.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="#/signup" class="btn btn-primary btn-lg" style="font-size:17px;padding:18px 40px">
          Start Studying Free &rarr;
        </a>
        <a href="#features" class="btn btn-secondary btn-lg" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'});return false">
          See Features
        </a>
      </div>
    </section>

    <!-- STATS BAR -->
    <section style="max-width:800px;margin:0 auto 60px;padding:0 20px">
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-radius:16px;overflow:hidden">
        ${[
          ['180+', 'Practice Questions'],
          ['21', 'Lessons'],
          ['5', 'Practice Tests'],
          ['3', 'OAR Sections']
        ].map(([num, label]) => `
          <div style="background:var(--surface);padding:24px 16px;text-align:center">
            <div style="font-size:28px;font-weight:800;color:var(--accent)">${num}</div>
            <div style="font-size:13px;color:var(--text-3);margin-top:4px">${label}</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" style="max-width:900px;margin:0 auto 80px;padding:0 20px">
      <div style="text-align:center;margin-bottom:40px">
        <h2 style="font-size:32px;font-weight:800;letter-spacing:-1px">Everything You Need to Score High</h2>
        <p style="color:var(--text-2);margin-top:8px;font-size:16px">Built specifically for the OAR, not generic test prep</p>
      </div>
      <div class="grid-3">
        ${[
          ['📖', 'Structured Lessons', 'Step-by-step lessons covering all Math, Reading, and Mechanical Comprehension topics tested on the OAR.', 'var(--accent)'],
          ['🎯', 'Targeted Questions', '180+ practice questions tagged by topic and difficulty. Drill your weak areas or mix it up.', 'var(--green)'],
          ['📐', 'Formula Reference', 'Every formula you need in one searchable reference. Geometry, physics, algebra &mdash; all covered.', 'var(--purple)'],
          ['🔬', 'Science Tools', 'Interactive mechanical comprehension tools: gear trains, pulley systems, lever analysis, and circuit diagrams.', 'var(--yellow)'],
          ['🧠', 'CAT Strategies', 'The OAR is computer-adaptive. Learn pacing strategies, question triage, and how to maximize your score.', 'var(--red)'],
          ['📊', 'Smart Dashboard', 'AI-powered score prediction, study streaks, topic mastery heatmap, and personalized study plans.', 'var(--accent)']
        ].map(([icon, title, desc, color]) => `
          <div class="card" style="text-align:center;padding:32px 24px">
            <div style="font-size:36px;margin-bottom:12px">${icon}</div>
            <h3 style="font-size:16px;font-weight:700;margin-bottom:8px;color:${color}">${title}</h3>
            <p style="font-size:14px;color:var(--text-2);line-height:1.6">${desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section style="max-width:700px;margin:0 auto 80px;padding:0 20px">
      <div style="text-align:center;margin-bottom:40px">
        <h2 style="font-size:32px;font-weight:800;letter-spacing:-1px">How It Works</h2>
      </div>
      <div style="display:flex;flex-direction:column;gap:24px">
        ${[
          ['1', 'Take the Diagnostic', 'A quick 15-question assessment identifies your strengths and weak spots across all 3 OAR sections.'],
          ['2', 'Follow Your Study Plan', 'Get a personalized study plan that targets your weakest topics first. Every session counts.'],
          ['3', 'Track Your Progress', 'Watch your predicted OAR score climb as you master topics. Know exactly when you\'re ready.']
        ].map(([num, title, desc]) => `
          <div style="display:flex;gap:20px;align-items:flex-start">
            <div style="min-width:48px;height:48px;border-radius:50%;background:var(--accent-glow);color:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px">${num}</div>
            <div>
              <h3 style="font-size:17px;font-weight:700;margin-bottom:4px">${title}</h3>
              <p style="font-size:14px;color:var(--text-2);line-height:1.6">${desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" style="max-width:480px;margin:0 auto 80px;padding:0 20px">
      <div style="text-align:center;margin-bottom:32px">
        <h2 style="font-size:32px;font-weight:800;letter-spacing:-1px">Simple Pricing</h2>
        <p style="color:var(--text-2);margin-top:8px">One payment. Lifetime access. No subscriptions.</p>
      </div>
      <div class="card" style="border-color:var(--accent);position:relative;overflow:hidden">
        <div style="position:absolute;top:16px;right:-32px;transform:rotate(45deg);background:var(--accent);color:white;padding:4px 40px;font-size:11px;font-weight:700">BEST VALUE</div>
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-size:14px;color:var(--text-3);text-decoration:line-through">$59</div>
          <div style="font-size:48px;font-weight:800;color:var(--text)">$29</div>
          <div style="font-size:14px;color:var(--text-2)">one-time payment &bull; lifetime access</div>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:20px;margin-bottom:24px">
          ${[
            'All 21 structured lessons',
            '180+ practice questions',
            '5 full-length practice tests',
            'Adaptive test simulations (CAT)',
            'Score predictor & analytics',
            'Formula quick-reference',
            'Mechanical comprehension tools',
            'Personalized study plan',
            'Study streak tracking',
            'Lifetime updates'
          ].map(f => `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;font-size:14px">
              <span style="color:var(--green);font-size:16px;flex-shrink:0">&#10003;</span>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
        <a href="#/signup" class="btn btn-primary btn-lg btn-block" style="font-size:17px">
          Get Access &rarr;
        </a>
        <p style="text-align:center;font-size:12px;color:var(--text-3);margin-top:12px">
          30-day money-back guarantee
        </p>
      </div>
    </section>

    <!-- FAQ -->
    <section style="max-width:700px;margin:0 auto 80px;padding:0 20px">
      <div style="text-align:center;margin-bottom:32px">
        <h2 style="font-size:32px;font-weight:800;letter-spacing:-1px">Frequently Asked Questions</h2>
      </div>
      <div id="faqList" style="display:flex;flex-direction:column;gap:8px">
        ${[
          ['What is the OAR?', 'The Officer Aptitude Rating (OAR) is a section of the ASTB-E (Aviation Selection Test Battery) used by the U.S. Navy and Marine Corps. It measures your aptitude in Math Skills, Reading Comprehension, and Mechanical Comprehension. Your OAR score (20-80) is used in selection for Officer Candidate School (OCS) and other commissioning programs.'],
          ['What score do I need?', 'Competitive OAR scores typically start around 50+, but requirements vary by program and fiscal year. Aviation programs generally want 50-55+, while some surface/sub programs may accept slightly lower. We recommend aiming for 55+ to be competitive across all programs.'],
          ['How is the OAR scored?', 'The OAR is computer-adaptive (CAT), meaning question difficulty adjusts based on your answers. Your final score ranges from 20-80. The three sub-sections (Math, Reading, Mechanical) contribute equally to your composite score.'],
          ['Can I retake the OAR?', 'Yes, but there are restrictions. You can take the ASTB-E up to 3 times in your lifetime, with a minimum wait period between attempts. This makes preparation critical &mdash; you want to score high on your first try.'],
          ['How long should I study?', 'Most candidates need 2-4 weeks of focused study, depending on their baseline. Our diagnostic test will tell you where you stand and create a personalized study plan. Some candidates with strong math/science backgrounds may need less time.'],
          ['Is this an official Navy product?', 'No. OAR Pro is an independent study platform created by military community members. We are not affiliated with, endorsed by, or connected to the U.S. Navy, Marine Corps, or any government entity. All content is based on publicly available information about the OAR exam format.']
        ].map(([q, a], i) => `
          <div class="card" style="padding:0;cursor:pointer" onclick="toggleFaq(${i})">
            <div style="padding:18px 24px;display:flex;justify-content:space-between;align-items:center" id="faqQ${i}">
              <span style="font-weight:600;font-size:15px">${q}</span>
              <span style="color:var(--text-3);font-size:20px;transition:transform .2s" id="faqIcon${i}">+</span>
            </div>
            <div style="display:none;padding:0 24px 18px;color:var(--text-2);font-size:14px;line-height:1.7" id="faqA${i}">
              ${a}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- FINAL CTA -->
    <section style="text-align:center;padding:60px 20px 80px;max-width:600px;margin:0 auto">
      <h2 style="font-size:32px;font-weight:800;letter-spacing:-1px;margin-bottom:12px">Ready to Ace the OAR?</h2>
      <p style="color:var(--text-2);font-size:16px;margin-bottom:28px">Join hundreds of future officers who used OAR Pro to get the score they needed.</p>
      <a href="#/signup" class="btn btn-primary btn-lg" style="font-size:17px;padding:18px 48px">
        Get Started &rarr;
      </a>
    </section>

    <!-- FOOTER -->
    <footer style="border-top:1px solid var(--border);padding:32px 20px;text-align:center;max-width:900px;margin:0 auto">
      <div style="display:flex;justify-content:center;gap:24px;margin-bottom:16px;flex-wrap:wrap">
        <a href="#/" style="color:var(--text-3);font-size:13px">Home</a>
        <a href="#features" style="color:var(--text-3);font-size:13px" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'});return false">Features</a>
        <a href="#pricing" style="color:var(--text-3);font-size:13px" onclick="document.getElementById('pricing').scrollIntoView({behavior:'smooth'});return false">Pricing</a>
        <a href="#/login" style="color:var(--text-3);font-size:13px">Log In</a>
        <a href="#/signup" style="color:var(--text-3);font-size:13px">Sign Up</a>
      </div>
      <p style="font-size:12px;color:var(--text-3);line-height:1.6">
        &copy; ${new Date().getFullYear()} OAR Pro. Not affiliated with the U.S. Navy, Marine Corps, or any government entity.
        <br>Built with purpose by veterans, for future officers.
      </p>
    </footer>
  `;
});

// FAQ accordion toggle
function toggleFaq(index) {
  const answer = document.getElementById(`faqA${index}`);
  const icon = document.getElementById(`faqIcon${index}`);
  const isOpen = answer.style.display === 'block';

  // Close all
  document.querySelectorAll('[id^="faqA"]').forEach(el => el.style.display = 'none');
  document.querySelectorAll('[id^="faqIcon"]').forEach(el => {
    el.textContent = '+';
    el.style.transform = '';
  });

  // Toggle clicked
  if (!isOpen) {
    answer.style.display = 'block';
    icon.textContent = '\u2212';
    icon.style.transform = 'rotate(180deg)';
  }
}
