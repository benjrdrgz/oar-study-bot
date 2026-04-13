// OAR Pro v4 — OAR Score Requirements Guide
// Route: #/oar-score-guide
// Public SEO page. Ranks for "OAR score requirements", "what OAR score do I need", etc.
// CTA: free diagnostic → email capture → nurture sequence.
// — Benjamin Rodriguez

route('/oar-score-guide', () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');

  app.innerHTML = `
    <div style="max-width:780px;margin:0 auto;padding:60px 24px 80px">

      <!-- Header -->
      <div style="margin-bottom:48px">
        <a href="#/" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:28px">← OAR Pro</a>
        <div style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:16px">OAR Score Guide</div>
        <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-.03em;margin-bottom:14px;line-height:1.15">What OAR Score Do You Need?</h1>
        <p style="font-size:1rem;color:var(--text-2);line-height:1.7;max-width:600px">
          The Officer Aptitude Rating (OAR) is scored on a scale of <strong style="color:var(--text)">20–80</strong>.
          Minimum cutoffs vary by branch and commissioning program — but "minimum" rarely gets you the billet you want.
          Here's everything you need to know.
        </p>
      </div>

      <!-- Score range visual -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:36px">
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:18px">OAR Score Scale (20–80)</div>
        <div style="position:relative;height:36px;background:linear-gradient(90deg,rgba(239,68,68,.3) 0%,rgba(245,158,11,.35) 35%,rgba(34,197,94,.35) 65%,rgba(59,130,246,.35) 100%);border-radius:8px;overflow:visible;margin-bottom:24px">
          ${[
            { pct:0,   label:'20', sub:'Minimum pass' },
            { pct:37.5,label:'50', sub:'Competitive' },
            { pct:50,  label:'55', sub:'Strong' },
            { pct:75,  label:'65', sub:'Top scorer' },
          ].map(m => `
            <div style="position:absolute;left:${m.pct}%;top:0;transform:translateX(-50%);text-align:center">
              <div style="width:2px;height:36px;background:rgba(255,255,255,.2);margin:0 auto"></div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:var(--text);margin-top:6px">${m.label}</div>
              <div style="font-size:10px;color:var(--text-3);white-space:nowrap">${m.sub}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Score by program table -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">Score Requirements by Program</h2>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:var(--bg-elevated);padding:12px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);border-bottom:1px solid var(--border)">
            <span>Program</span><span>Minimum</span><span>Competitive</span>
          </div>
          ${[
            ['Navy OCS (General)', '35', '50+'],
            ['Surface Warfare Officer (SWO)', '40', '50+'],
            ['Student Naval Aviator (SNA)', '46', '55+'],
            ['Naval Flight Officer (NFO)', '46', '55+'],
            ['Nuclear Propulsion (NUPOC)', '46', '60+'],
            ['Navy EOD / Diver', '35', '45+'],
            ['Marine Corps OCS', '40', '50+'],
            ['Marine Corps Aviation', '46', '55+'],
          ].map((row, i) => `
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:13px 20px;border-bottom:1px solid var(--border);font-size:14px;background:${i%2===1?'var(--surface-2)':'transparent'}">
              <span style="font-weight:500">${row[0]}</span>
              <span style="font-family:'JetBrains Mono',monospace;color:var(--yellow)">${row[1]}</span>
              <span style="font-family:'JetBrains Mono',monospace;color:var(--green);font-weight:600">${row[2]}</span>
            </div>`).join('')}
        </div>
        <p style="font-size:12px;color:var(--text-3);margin-top:10px">
          * Scores are guidelines based on historical selection data. Official cutoffs are set by each officer selection board and can change each cycle.
          Always confirm with your recruiter.
        </p>
      </div>

      <!-- Section breakdown -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">What's Actually on the OAR?</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
          ${[
            { icon:'📐', section:'Math Skills',               pct:'40%', desc:'Arithmetic, algebra, geometry, and word problems. The most coachable section — gains come fast with focused drill.' },
            { icon:'📖', section:'Reading Comprehension',     pct:'30%', desc:'Passages with main idea, inference, and detail questions. Strategy matters more than content knowledge here.' },
            { icon:'⚙️', section:'Mechanical Comprehension',  pct:'30%', desc:'Gears, levers, pulleys, circuits, and physics concepts. The section most candidates neglect until it\'s too late.' },
          ].map(s => `
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px">
              <div style="font-size:24px;margin-bottom:10px">${s.icon}</div>
              <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px">${s.section}</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700;color:var(--accent);margin-bottom:8px">${s.pct}</div>
              <div style="font-size:12px;color:var(--text-3);line-height:1.6">${s.desc}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- How scoring works -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">How the OAR Is Scored</h2>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;display:flex;flex-direction:column;gap:14px">
          ${[
            ['Computer-Adaptive (CAT)', 'The OAR adjusts difficulty based on your answers. Get a question right → next question is harder. Get it wrong → easier. Your final score reflects both accuracy and difficulty level.'],
            ['Scale: 20–80', 'The OAR is scaled from 20–80. There\'s no fixed number of questions — the test ends when the algorithm has enough data to calculate your score reliably.'],
            ['Three sections, one composite', 'Math, Reading, and Mechanical Comprehension each contribute to your composite OAR score. You don\'t get separate section scores on your report — just the composite.'],
            ['You can retake it', 'The ASTB-E can be taken up to 3 times total in your lifetime, with mandatory wait periods between attempts. Study hard the first time.'],
          ].map(([title,body]) => `
            <div style="display:flex;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--border)">
              <span style="color:var(--accent);font-size:18px;flex-shrink:0;margin-top:2px">→</span>
              <div>
                <div style="font-size:13px;font-weight:700;margin-bottom:4px">${title}</div>
                <div style="font-size:13px;color:var(--text-2);line-height:1.65">${body}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Score improvement tips -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">How to Get from Borderline to Competitive</h2>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            ['Find your baseline first', 'Don\'t start studying without knowing your baseline. Take the free diagnostic to see where you\'re starting from. Candidates who skip this waste 40% of their study time on strong sections.'],
            ['Short sessions beat marathons', '20–30 minutes per day is more effective than 4-hour weekend sessions. The CAT format rewards consistent, spaced practice over cramming.'],
            ['Mechanical Comprehension first', 'Most candidates underestimate mechanical comprehension and overestimate how much extra Math drilling will move their score. If you\'re starting from scratch, build mechanical foundations early.'],
            ['Target 55+, not 50', 'Aiming for the minimum puts you at risk of a bad test day. Build a 5-point buffer. Candidates who score 55+ have significantly more program flexibility and negotiating leverage.'],
          ].map(([title,body],i) => `
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:flex;gap:16px">
              <div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--accent);flex-shrink:0;min-width:20px">0${i+1}</div>
              <div>
                <div style="font-size:13px;font-weight:700;margin-bottom:4px">${title}</div>
                <div style="font-size:13px;color:var(--text-2);line-height:1.65">${body}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:16px;padding:40px 28px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:12px">Free — No Account Required</div>
        <h2 style="font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:800;margin-bottom:10px">Find out where you stand right now</h2>
        <p style="color:var(--text-2);font-size:14px;max-width:460px;margin:0 auto 24px">
          Take the 90-second free diagnostic. 5 questions across all 3 sections. You'll see your predicted score and which section to tackle first.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a href="#/diagnostic" class="btn btn-primary btn-lg">Take Free Diagnostic →</a>
          <button class="btn btn-secondary btn-lg" onclick="handleCheckoutClick(this)">Get OAR Pro — $97</button>
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-3)">No account needed for the diagnostic &bull; 30-day guarantee on Pro</div>
      </div>

    </div>
  `;
});
