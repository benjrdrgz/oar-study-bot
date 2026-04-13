// OAR Pro v4 — ASVAB Score Requirements Guide
// Route: #/asvab-score-guide
// Public SEO page. Ranks for "ASVAB score requirements", "what AFQT score do I need",
// "ASVAB minimum scores by branch". CTA: free ASVAB diagnostic → nurture → upgrade.
// — Benjamin Rodriguez

route('/asvab-score-guide', () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  const _sb = document.getElementById('sidebar');
  const _mt = document.getElementById('mobileToggle');
  if (_sb) _sb.style.display = 'none';
  if (_mt) _mt.style.display = 'none';

  app.innerHTML = `
    <div style="max-width:780px;margin:0 auto;padding:60px 24px 80px">

      <!-- Header -->
      <div style="margin-bottom:48px">
        <a href="#/" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:28px">← OAR Pro</a>
        <div style="display:inline-block;padding:5px 14px;border-radius:999px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#60a5fa;margin-bottom:16px">ASVAB Score Guide</div>
        <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:-.03em;margin-bottom:14px;line-height:1.15">What AFQT Score Do You Need?</h1>
        <p style="font-size:1rem;color:var(--text-2);line-height:1.7;max-width:620px">
          The AFQT is scored on a percentile scale of <strong style="color:var(--text)">1–99</strong>.
          Your score determines which branches will accept you — and which jobs you qualify for.
          Here's everything you need to know before test day.
        </p>
      </div>

      <!-- AFQT score zone bar -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:36px">
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:20px">AFQT Score Zones (1–99 Percentile)</div>
        <div style="position:relative;height:36px;background:linear-gradient(90deg,rgba(239,68,68,.4) 0%,rgba(239,68,68,.4) 31%,rgba(245,158,11,.4) 31%,rgba(245,158,11,.4) 50%,rgba(59,130,246,.35) 50%,rgba(59,130,246,.35) 65%,rgba(34,197,94,.4) 65%,rgba(34,197,94,.4) 100%);border-radius:8px;margin-bottom:36px">
          ${[
            { pct: 0,   label: '1',   sub: 'Scale start' },
            { pct: 31,  label: '31',  sub: 'Army min' },
            { pct: 50,  label: '50',  sub: 'Most jobs open' },
            { pct: 65,  label: '65',  sub: 'Best options' },
          ].map(m => `
            <div style="position:absolute;left:${m.pct === 0 ? 0 : m.pct}%;top:0;transform:${m.pct === 0 ? 'none' : 'translateX(-50%)'};text-align:center">
              <div style="width:2px;height:36px;background:rgba(255,255,255,.25);margin:0 auto"></div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:var(--text);margin-top:6px;white-space:nowrap">${m.label}</div>
              <div style="font-size:10px;color:var(--text-3);white-space:nowrap">${m.sub}</div>
            </div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:8px">
          ${[
            { range: 'Below 31', label: 'Disqualified', color: 'var(--red)', note: 'No branch will accept you without a waiver' },
            { range: '31–49',    label: 'Limited Options', color: 'var(--yellow)', note: 'Meets minimums but fewer MOS/rate choices' },
            { range: '50–64',    label: 'Most Jobs Open', color: 'var(--accent)', note: 'Competitive for most enlisted roles' },
            { range: '65+',      label: 'Best Options', color: 'var(--green)', note: 'Strong negotiating leverage on job selection' },
          ].map(z => `
            <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:14px 12px;text-align:center">
              <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${z.color};margin-bottom:4px">${z.range}</div>
              <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px">${z.label}</div>
              <div style="font-size:11px;color:var(--text-3);line-height:1.5">${z.note}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Branch minimum table -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">Minimum AFQT Score by Branch</h2>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:var(--surface-2);padding:12px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-3);border-bottom:1px solid var(--border)">
            <span>Branch</span><span>AFQT Minimum</span><span>Notes</span>
          </div>
          ${[
            ['Army',                  '31', 'Waiver possible below 31 for HS diploma holders'],
            ['Navy',                  '35', '31 with HS diploma; 50+ for nuclear programs'],
            ['Marine Corps',          '32', 'ASVAB line scores matter equally for MOS'],
            ['Air Force / Space Force','36', 'Competition is high — aim for 50+ in practice'],
            ['Coast Guard',           '40', 'Highest enlisted floor; competitive is 55+'],
            ['National Guard',        '31–50', 'Varies by state; confirm with your state recruiter'],
          ].map((row, i) => `
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:13px 20px;border-bottom:1px solid var(--border);font-size:14px;background:${i % 2 === 1 ? 'var(--surface-2)' : 'transparent'}">
              <span style="font-weight:600">${row[0]}</span>
              <span style="font-family:'JetBrains Mono',monospace;color:var(--yellow);font-weight:700">${row[1]}</span>
              <span style="font-size:12px;color:var(--text-3)">${row[2]}</span>
            </div>`).join('')}
        </div>
        <p style="font-size:12px;color:var(--text-3);margin-top:10px">
          * Minimums are based on 2024 recruiting standards and may change each cycle. Always confirm with your recruiter.
        </p>
      </div>

      <!-- AFQT formula breakdown -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">What the AFQT Actually Measures</h2>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px">
          <p style="font-size:14px;color:var(--text-2);line-height:1.7;margin-bottom:20px">
            The AFQT is not your overall ASVAB score. It's a percentile derived from <strong style="color:var(--text)">four specific subtests</strong>:
          </p>
          <div style="background:var(--surface-2);border:1px solid var(--accent);border-radius:12px;padding:20px 24px;text-align:center;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--text-3);margin-bottom:10px">AFQT Formula</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700;color:var(--accent)">AFQT = 2VE + AR + MK</div>
            <div style="font-size:12px;color:var(--text-3);margin-top:10px">
              VE = Verbal Expression (WK + PC combined) &nbsp;·&nbsp; AR = Arithmetic Reasoning &nbsp;·&nbsp; MK = Mathematics Knowledge
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
            ${[
              { abbr: 'WK', name: 'Word Knowledge',           weight: '1× (part of VE)', tip: 'Vocabulary, synonyms, context clues. 35 questions.' },
              { abbr: 'PC', name: 'Paragraph Comprehension',  weight: '1× (part of VE)', tip: 'Reading strategies, main idea, inference. 15 questions.' },
              { abbr: 'AR', name: 'Arithmetic Reasoning',     weight: '1×',              tip: 'Word problems, rates, ratios. 30 questions on CAT.' },
              { abbr: 'MK', name: 'Mathematics Knowledge',    weight: '1×',              tip: 'Algebra, geometry, equations. 25 questions on CAT.' },
            ].map(s => `
              <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                  <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--accent);background:rgba(59,130,246,.1);padding:3px 8px;border-radius:6px">${s.abbr}</span>
                  <span style="font-size:13px;font-weight:700">${s.name}</span>
                </div>
                <div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:6px">${s.weight}</div>
                <div style="font-size:12px;color:var(--text-3);line-height:1.55">${s.tip}</div>
              </div>`).join('')}
          </div>
          <div style="margin-top:16px;padding:14px 16px;background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:8px;font-size:13px;color:var(--text-2)">
            VE is counted twice in the AFQT formula. That means Verbal Expression has double the impact of AR or MK.
            Strong vocabulary and reading comprehension scores lift your AFQT more than most candidates expect.
          </div>
        </div>
      </div>

      <!-- Line scores for job qualification -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">Beyond AFQT: Line Scores Determine Your Job</h2>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;display:flex;flex-direction:column;gap:14px">
          <p style="font-size:14px;color:var(--text-2);line-height:1.7;margin:0">
            Your AFQT gets you in the door. But once you're eligible, each branch uses
            <strong style="color:var(--text)">composite line scores</strong> — combinations of individual ASVAB subtests —
            to determine which specific jobs (MOS/rate/AFSC) you qualify for.
          </p>
          ${[
            {
              score: 'GT — General Technical',
              formula: 'VE + AR',
              usage: 'Army's most important composite. Required for officer programs, warrant officer, intelligence, cyber, and most technical MOS. GT 110+ unlocks elite opportunities.',
              color: 'var(--accent)'
            },
            {
              score: 'CL — Clerical',
              formula: 'VE + AR + MK',
              usage: 'Navy/Army admin, finance, legal, and personnel roles. Often overlooked but high CL = broad job options in office-of-record billets.',
              color: 'var(--purple)'
            },
            {
              score: 'EL — Electronics',
              formula: 'GS + AR + MK + EI',
              usage: 'Aviation electrician, fire control technician, nuclear rates. High demand, high pay-grade ceiling. Requires strong math and science base.',
              color: 'var(--yellow)'
            },
            {
              score: 'MM — Mechanical Maintenance',
              formula: 'AS + MC + EI + GS',
              usage: 'Wheeled/tracked vehicle mechanic, aircraft maintenance, ordnance. The most common line score requirement for Army combat MOS.',
              color: 'var(--green)'
            },
          ].map(s => `
            <div style="display:flex;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--border)">
              <span style="color:${s.color};font-size:18px;flex-shrink:0;margin-top:2px">→</span>
              <div>
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;flex-wrap:wrap">
                  <span style="font-size:13px;font-weight:700">${s.score}</span>
                  <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${s.color};background:rgba(59,130,246,.06);padding:2px 8px;border-radius:4px">${s.formula}</span>
                </div>
                <div style="font-size:13px;color:var(--text-2);line-height:1.65">${s.usage}</div>
              </div>
            </div>`).join('')}
          <p style="font-size:12px;color:var(--text-3);margin:0">
            There are 10 composite line scores total. Your recruiter will run them once you have an ASVAB score on file.
          </p>
        </div>
      </div>

      <!-- Improvement potential -->
      <div style="margin-bottom:48px">
        <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:16px">How Much Can You Improve?</h2>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            {
              num: '01',
              title: 'The math sections are the most coachable',
              body: 'Arithmetic Reasoning and Mathematics Knowledge are formula-driven. Most candidates gain 10–20 AFQT points just by mastering the 40 most common question types. You don\'t need to be a math person — you need to know the playbook.'
            },
            {
              num: '02',
              title: 'Vocabulary compounds quickly',
              body: 'Word Knowledge is a 35-question section and VE counts twice in your AFQT. Candidates who spend 10 minutes/day on vocabulary for 3 weeks see measurable lifts in their AFQT estimate. It\'s the highest ROI section after math.'
            },
            {
              num: '03',
              title: 'Take a diagnostic before studying anything',
              body: 'Candidates who skip a baseline test often spend 60% of their study time on sections they already pass. Find your weak spots first — then drill those exclusively. Smart prep beats volume prep every time.'
            },
            {
              num: '04',
              title: 'Most candidates improve 10–20 points with structured prep',
              body: 'The ASVAB is highly coachable compared to aptitude tests like the SAT. A 4-week daily study plan targeting your weak composite scores is enough for most candidates to unlock their first-choice MOS.'
            },
          ].map(item => `
            <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;display:flex;gap:16px">
              <div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:var(--accent);flex-shrink:0;min-width:20px">${item.num}</div>
              <div>
                <div style="font-size:13px;font-weight:700;margin-bottom:4px">${item.title}</div>
                <div style="font-size:13px;color:var(--text-2);line-height:1.65">${item.body}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;background:linear-gradient(135deg,hsla(214,100%,62%,.1),hsla(264,80%,68%,.06));border:1px solid var(--accent);border-radius:16px;padding:40px 28px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--accent);font-weight:700;margin-bottom:12px">Free — No Account Required</div>
        <h2 style="font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:800;margin-bottom:10px">Find out where you stand right now</h2>
        <p style="color:var(--text-2);font-size:14px;max-width:480px;margin:0 auto 24px">
          Take the free 15-question ASVAB diagnostic. You'll see your estimated AFQT range, a per-section
          breakdown, and exactly which sections to focus on first.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a href="#/asvab-diagnostic" class="btn btn-primary btn-lg">Take Free ASVAB Diagnostic →</a>
          <button class="btn btn-secondary btn-lg" onclick="handleTestCheckoutClick(this,'ASVAB')">Get ASVAB Access — $47</button>
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-3)">No account needed for the diagnostic &bull; 30-day guarantee on access</div>
      </div>

    </div>
  `;
});
