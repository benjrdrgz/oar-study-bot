// OAR Pro v4 — ASVAB Prep Landing Page (Premium Redesign)
// Route: #/tests/asvab (public)
// Target: 19-year-old who just Googled "ASVAB practice test" from Reddit.
// Tone: direct, stakes-driven, enlisted-voice. No fluff.
// — Benjamin Rodriguez

route('/tests/asvab', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  // Check affiliate code for discount display
  const affiliateCode = (() => {
    try { return sessionStorage.getItem('oar_affiliate_ref') || ''; } catch (_) { return ''; }
  })();
  const hasCode      = !!affiliateCode;
  const displayPrice = hasCode ? '$37' : '$47';
  const strikePrice  = hasCode ? '$47' : '';

  app.innerHTML = `

    <!-- ── HERO ────────────────────────────────────────────────────────────── -->
    <section style="background:linear-gradient(180deg,var(--bg) 0%,var(--surface) 100%);border-bottom:1px solid var(--border);padding:72px 24px 64px;text-align:center">
      <div style="max-width:720px;margin:0 auto">
        <div style="display:inline-block;padding:5px 16px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#60a5fa;margin-bottom:20px">
          All Branches · Enlisted
        </div>
        <h1 style="font-size:clamp(2rem,5vw,3.2rem);font-weight:900;letter-spacing:-.04em;line-height:1.05;margin-bottom:18px">
          Pass the ASVAB.<br>Get the job you want.
        </h1>
        <p style="font-size:clamp(15px,2vw,18px);color:var(--text-2);line-height:1.7;max-width:560px;margin:0 auto 32px">
          Your AFQT score determines which branches will even look at your application
          and which jobs you qualify for. A low score = no options.
          A high score = your pick of MOS, signing bonuses, and career paths.
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="handleTestCheckoutClick(this,'ASVAB')" style="padding:14px 28px;font-size:15px;font-weight:700">
            Get ASVAB Access — ${displayPrice} →
          </button>
          <a href="#/asvab-diagnostic" class="btn btn-secondary btn-lg" style="padding:14px 28px;font-size:15px">
            Take Free Diagnostic
          </a>
        </div>
        ${hasCode ? `
          <div style="margin-top:14px;font-size:13px;color:var(--green)">✓ Referral code applied — $10 off</div>
        ` : ''}
        <div style="margin-top:12px;font-size:12px;color:var(--text-3)">30-day guarantee &bull; One-time payment &bull; Lifetime access</div>
      </div>
    </section>

    <!-- ── SOCIAL PROOF BAR ────────────────────────────────────────────────── -->
    <section style="background:var(--surface);border-bottom:1px solid var(--border);padding:20px 24px">
      <div style="max-width:800px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap">
        ${[
          { stat: '1M+',   label: 'ASVAB test-takers per year' },
          { stat: '+18 pts', label: 'Avg AFQT gain with structured prep' },
          { stat: 'All 6',  label: 'Branches covered' },
          { stat: '620+',  label: 'Practice questions' },
        ].map(s => `
          <div style="text-align:center">
            <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700;color:var(--text)">${s.stat}</div>
            <div style="font-size:11px;color:var(--text-3)">${s.label}</div>
          </div>`).join('')}
      </div>
    </section>

    <!-- ── THE STAKES ─────────────────────────────────────────────────────── -->
    <section style="padding:64px 24px;background:var(--bg)">
      <div style="max-width:800px;margin:0 auto">
        <div style="text-align:center;margin-bottom:36px">
          <h2 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-.03em;margin-bottom:10px">Your AFQT score determines everything</h2>
          <p style="font-size:14px;color:var(--text-2);max-width:520px;margin:0 auto">
            Most candidates are 8–15 points away from unlocking their top job choice.
            That gap closes with the right prep — not random YouTube videos.
          </p>
        </div>

        <!-- Branch table -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:28px">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:var(--surface-2);padding:12px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);border-bottom:1px solid var(--border)">
            <span>Branch</span><span>AFQT Minimum</span><span>Competitive Target</span>
          </div>
          ${[
            ['Army',                   '31', '50+', 'Unlocks GT-score jobs (intelligence, cyber, signal)'],
            ['Navy',                   '35', '50+', '50+ opens nuclear, crypto, and aviation support rates'],
            ['Marine Corps',           '32', '50+', 'Combat roles need strong line scores beyond AFQT'],
            ['Air Force / Space Force','36', '55+', 'Highly competitive; most jobs require 50–65+'],
            ['Coast Guard',            '40', '55+', 'Hardest civilian-to-service branch to qualify for'],
          ].map((row, i) => `
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:13px 20px;border-bottom:1px solid var(--border);font-size:13px;background:${i % 2 === 1 ? 'var(--surface-2)' : 'transparent'}">
              <span style="font-weight:600">${row[0]}</span>
              <span style="font-family:'JetBrains Mono',monospace;color:var(--yellow);font-weight:700">${row[1]}</span>
              <span style="color:var(--text-3);font-size:12px">${row[3]}</span>
            </div>`).join('')}
        </div>

        <div style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:16px 18px;font-size:13px;color:var(--text-2);line-height:1.65">
          Most candidates are 8–15 points away from unlocking their top job choice.
          That gap closes with the right prep. The math sections (AR + MK) account for half your AFQT
          and are the most coachable part of the entire test.
        </div>
      </div>
    </section>

    <!-- ── WHAT YOU GET ────────────────────────────────────────────────────── -->
    <section style="padding:64px 24px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
      <div style="max-width:860px;margin:0 auto">
        <div style="text-align:center;margin-bottom:36px">
          <h2 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-.03em;margin-bottom:10px">Everything you need. Nothing you don't.</h2>
          <p style="font-size:14px;color:var(--text-2)">Built specifically for AFQT improvement — not a generic test-prep subscription.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
          ${[
            {
              icon: '⚡',
              title: 'Adaptive Practice Tests',
              desc: 'CAT-style engine adjusts difficulty based on your answers — exactly like the real ASVAB computerized test. You stop drilling easy questions once you pass them.'
            },
            {
              icon: '📊',
              title: '620+ Practice Questions',
              desc: 'Covers all 4 AFQT subtests plus Mechanical Comprehension, Electronics Information, General Science, and Auto & Shop. Questions are explained, not just answered.'
            },
            {
              icon: '🎓',
              title: '24 Lesson Modules',
              desc: 'Visual explanations that actually teach the concept — not just the formula. Built around the highest-frequency ASVAB question types.'
            },
            {
              icon: '🔮',
              title: 'Score Predictor',
              desc: 'See your estimated AFQT range after every practice session. Know where you stand before test day — no surprises at the MEPS station.'
            },
            {
              icon: '⏱️',
              title: 'Timed Drills',
              desc: 'Practice at real ASVAB pace. Speed is a factor on Math Knowledge and Word Knowledge — you can know the material and still run out of time.'
            },
            {
              icon: '🎯',
              title: 'Weak Spot Targeting',
              desc: 'The platform tracks what you miss, identifies the underlying concept gap, and routes you to the right lesson. Stop guessing where to study next.'
            },
          ].map(f => `
            <div style="background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:22px 20px">
              <div style="font-size:24px;margin-bottom:10px">${f.icon}</div>
              <div style="font-size:14px;font-weight:700;margin-bottom:6px">${f.title}</div>
              <div style="font-size:13px;color:var(--text-3);line-height:1.6">${f.desc}</div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- ── WHAT'S COVERED ─────────────────────────────────────────────────── -->
    <section style="padding:64px 24px;background:var(--bg)">
      <div style="max-width:860px;margin:0 auto">
        <div style="text-align:center;margin-bottom:36px">
          <h2 style="font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-.03em;margin-bottom:10px">Full subtest coverage</h2>
          <p style="font-size:14px;color:var(--text-2)">The ASVAB has 9 subtests. 4 of them determine your AFQT. All of them determine your job.</p>
        </div>

        <!-- AFQT Core -->
        <div style="margin-bottom:28px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">AFQT Core</span>
            <span style="font-size:10px;font-weight:700;background:rgba(59,130,246,.1);color:#60a5fa;border:1px solid rgba(59,130,246,.2);padding:2px 10px;border-radius:999px">Counts toward your AFQT percentile</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
            ${[
              { abbr: 'WK', name: 'Word Knowledge',          qs: '35 questions', tests: 'Synonyms, vocabulary, context clues', tip: 'Learn the top 200 military-context words — they repeat.' },
              { abbr: 'PC', name: 'Paragraph Comprehension', qs: '15 questions', tests: 'Main idea, detail, inference', tip: 'Skim first, then read the question before the passage.' },
              { abbr: 'AR', name: 'Arithmetic Reasoning',    qs: '30 questions (CAT)', tests: 'Word problems, rates, percentages', tip: 'Most coachable section. Master 15 question types = strong AR.' },
              { abbr: 'MK', name: 'Mathematics Knowledge',   qs: '25 questions (CAT)', tests: 'Algebra, geometry, equations', tip: 'Formula sheet + practice = biggest AFQT score gains.' },
            ].map(s => `
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                  <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--accent);background:rgba(59,130,246,.1);padding:3px 8px;border-radius:5px">${s.abbr}</span>
                  <span style="font-size:13px;font-weight:700">${s.name}</span>
                </div>
                <div style="font-size:11px;color:var(--text-3);margin-bottom:6px">${s.qs}</div>
                <div style="font-size:12px;color:var(--text-2);margin-bottom:8px">${s.tests}</div>
                <div style="font-size:11px;color:var(--green);background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.2);border-radius:6px;padding:6px 8px;line-height:1.4">Tip: ${s.tip}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Technical sections -->
        <div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-2)">Technical Sections</span>
            <span style="font-size:10px;font-weight:700;background:rgba(168,85,247,.1);color:var(--purple);border:1px solid rgba(168,85,247,.2);padding:2px 10px;border-radius:999px">Determines MOS / rate / AFSC eligibility</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
            ${[
              { abbr: 'MC', name: 'Mechanical Comprehension', tests: 'Gears, levers, pulleys, fluid dynamics', tip: 'Critical for mechanical MOS. Diagrams are the key — practice visually.' },
              { abbr: 'EI', name: 'Electronics Information',  tests: "Ohm's law, circuits, AC/DC, components", tip: 'Formula-driven. Memorize V=IR and power relationships.' },
              { abbr: 'GS', name: 'General Science',          tests: 'Biology, chemistry, physics, earth science', tip: 'Broad but shallow. Review each category briefly — it spreads across 25 Qs.' },
              { abbr: 'AS', name: 'Auto & Shop',              tests: 'Engine parts, tools, shop processes', tip: 'Know basic engine components and common hand tools. High-impact for low study time.' },
            ].map(s => `
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                  <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--purple);background:rgba(168,85,247,.1);padding:3px 8px;border-radius:5px">${s.abbr}</span>
                  <span style="font-size:13px;font-weight:700">${s.name}</span>
                </div>
                <div style="font-size:12px;color:var(--text-2);margin-bottom:8px">${s.tests}</div>
                <div style="font-size:11px;color:var(--yellow);background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2);border-radius:6px;padding:6px 8px;line-height:1.4">Tip: ${s.tip}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- ── TESTIMONIALS ────────────────────────────────────────────────────── -->
    <section style="padding:64px 24px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
      <div style="max-width:860px;margin:0 auto">
        <div style="text-align:center;margin-bottom:32px">
          <h2 style="font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:800;letter-spacing:-.02em">Used across all branches</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
          ${[
            {
              initials: 'AR',
              branch:   'Army',
              score:    'AFQT 58 → 76',
              quote:    'Started at 58 which was fine for enlistment, but I needed 73 for my MOS. The adaptive drills hammered AR and MK until I hit it. Shipped to Fort Jackson in March.',
              color:    'var(--green)'
            },
            {
              initials: 'NK',
              branch:   'Navy',
              score:    'AFQT 41 → 59',
              quote:    'Failed my first attempt at 41. Went through all the AR and MK lessons — the explanations actually showed me WHY the steps work, not just the formula. Passed with a 59.',
              color:    'var(--accent)'
            },
            {
              initials: 'DJ',
              branch:   'Marines',
              score:    'AFQT 34 → 52',
              quote:    "I was told I needed to wait 6 months and retest. Used this for 5 weeks instead. The weak spot targeting found my actual gap fast — it wasn't what I thought it was.",
              color:    'var(--red)'
            },
          ].map(t => `
            <div style="background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:22px">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
                <div style="width:38px;height:38px;border-radius:50%;background:${t.color};opacity:.8;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;color:var(--bg);flex-shrink:0">${t.initials}</div>
                <div>
                  <div style="font-size:13px;font-weight:700">${t.branch}</div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${t.color};font-weight:600">${t.score}</div>
                </div>
              </div>
              <p style="font-size:13px;color:var(--text-2);line-height:1.65;margin:0">"${t.quote}"</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- ── PRICING / CTA ───────────────────────────────────────────────────── -->
    <section style="padding:72px 24px;background:var(--bg)">
      <div style="max-width:560px;margin:0 auto">
        <div style="background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:20px;padding:40px 32px;text-align:center">

          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:12px">ASVAB Prep — Lifetime Access</div>
          <div style="display:flex;align-items:baseline;justify-content:center;gap:8px;margin-bottom:6px">
            ${strikePrice ? `<span style="font-family:'JetBrains Mono',monospace;font-size:18px;color:var(--text-3);text-decoration:line-through">${strikePrice}</span>` : ''}
            <span style="font-family:'JetBrains Mono',monospace;font-size:52px;font-weight:800;color:var(--text);letter-spacing:-.03em">${displayPrice}</span>
          </div>
          <div style="font-size:13px;color:var(--text-3);margin-bottom:28px">One payment. No subscription. Access forever.</div>

          ${hasCode ? `
            <div style="margin-bottom:20px;padding:10px 14px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:8px;font-size:13px;color:var(--green)">
              ✓ Referral code applied — $10 off your purchase
            </div>
          ` : ''}

          <div style="text-align:left;margin-bottom:24px;display:flex;flex-direction:column;gap:8px">
            ${[
              '620+ practice questions across all subtests',
              'Adaptive CAT-style test engine',
              '24 lesson modules with visual explanations',
              'AFQT score predictor (calibrated to real test data)',
              'Timed drills at real test pace',
              'AI weak spot targeting and study routing',
              'Full formula reference sheet',
              'Lifetime access — no expiration',
            ].map(item => `
              <div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--text-2)">
                <span style="color:var(--green);flex-shrink:0;margin-top:1px">✓</span>
                <span>${item}</span>
              </div>`).join('')}
          </div>

          <div id="asvabCheckoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px"></div>

          <button class="btn btn-primary btn-lg" style="width:100%;margin-bottom:12px" onclick="handleTestCheckoutClick(this,'ASVAB')">
            Get ASVAB Access for ${displayPrice} →
          </button>

          <div style="font-size:12px;color:var(--text-3);margin-bottom:16px">
            Secure checkout via Stripe &bull; 30-day money-back guarantee
          </div>

          <a href="#/asvab-diagnostic" style="font-size:13px;color:var(--text-3);text-decoration:none">
            Not ready? Take the free 15-question diagnostic first →
          </a>
        </div>

        <p style="font-size:13px;color:var(--text-3);text-align:center;margin-top:20px">
          Already purchased? <a href="#/login" style="color:var(--accent)">Sign in</a> and start studying immediately.
          &nbsp;·&nbsp; Questions? <a href="mailto:hello@armedprep.com" style="color:var(--text-3)">hello@armedprep.com</a>
        </p>
      </div>
    </section>

    <!-- ── FAQ ────────────────────────────────────────────────────────────── -->
    <section style="padding:64px 24px 80px;background:var(--surface);border-top:1px solid var(--border)">
      <div style="max-width:680px;margin:0 auto">
        <h2 style="font-size:clamp(1.3rem,2.5vw,1.7rem);font-weight:800;letter-spacing:-.02em;margin-bottom:28px;text-align:center">Frequently asked questions</h2>
        <div style="display:flex;flex-direction:column;gap:0">
          ${[
            {
              q: 'How is this different from free ASVAB practice tests online?',
              a: 'Free tests give you questions with answer keys. This gives you adaptive difficulty that adjusts like the real CAT-ASVAB, explanations that teach the underlying concept (not just the correct answer), and a score predictor calibrated to real test data. You also get a structured path — the platform tells you what to study next based on your actual gaps, not what page comes next in a book.'
            },
            {
              q: "Do I need to know military stuff to use this?",
              a: "No. The ASVAB doesn't test military knowledge — it tests math, reading, vocabulary, and technical reasoning. You don't need any prior service knowledge to prep effectively. The platform assumes zero military background."
            },
            {
              q: 'How long until I see improvement?',
              a: "Most users improve within 1–2 weeks of daily 20-minute sessions, especially in Arithmetic Reasoning and Mathematics Knowledge. Vocabulary (Word Knowledge) compounds over 3–4 weeks. If you have 6+ weeks before your test date, you're in a strong position. If you have less than 2 weeks, focus exclusively on AR and MK — highest ROI per hour."
            },
            {
              q: 'Which branches accept what scores?',
              a: "Army: 31 minimum, Navy: 35, Marine Corps: 32, Air Force/Space Force: 36, Coast Guard: 40. These are the AFQT floors — getting in the door. Your actual job (MOS/rate/AFSC) depends on composite line scores. See the full breakdown →"
            },
          ].map((faq, i) => `
            <details style="border-top:1px solid var(--border);padding:0" ${i === 0 ? 'open' : ''}>
              <summary style="padding:18px 0;font-size:14px;font-weight:700;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;color:var(--text)">
                ${faq.q}
                <span style="font-size:18px;color:var(--text-3);flex-shrink:0;margin-left:12px;font-weight:300;line-height:1">+</span>
              </summary>
              <div style="padding:0 0 18px;font-size:13px;color:var(--text-2);line-height:1.7">
                ${faq.a}
                ${faq.q.includes('branches') ? ` <a href="#/asvab-score-guide" style="color:var(--accent)">Full score guide →</a>` : ''}
              </div>
            </details>`).join('')}
          <div style="border-top:1px solid var(--border)"></div>
        </div>
      </div>
    </section>

  `;
});
