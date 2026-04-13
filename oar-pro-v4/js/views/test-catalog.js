// OAR Pro v4 — Test Catalog / Shop
// Route: #/tests (public)
// Shows all available tests: owned (w/ progress) + locked (w/ buy CTA)
// — Benjamin Rodriguez

route('/tests', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('mobileToggle').style.display = 'none';

  // Check affiliate code for discount display
  const affiliateCode = (() => {
    try { return sessionStorage.getItem('oar_affiliate_ref') || ''; } catch (_) { return ''; }
  })();
  const hasCode = !!affiliateCode;

  // Check auth + access for any test the user owns
  let userAccess = {};
  try {
    const user = await getUser();
    if (user) {
      const profile = await getProfile();
      if (profile) {
        const tests = ['OAR', 'ASVAB', 'AFOQT', 'SIFT', 'ASTB-E'];
        for (const t of tests) {
          userAccess[t] = await hasAccess(t);
        }
      }
    }
  } catch (_) { /* unauthenticated visitor */ }

  const TESTS = [
    {
      id: 'ASVAB',
      icon: '🎖️',
      name: 'ASVAB',
      subtitle: 'All Branches · Enlisted',
      tagline: 'Pass the ASVAB. Get the job you want.',
      desc: 'Covers AFQT core + technical sections. Adaptive practice, timed drills, score predictor. 1M+ test takers per year.',
      fullPrice: hasCode ? '$37' : '$47',
      strikePrice: hasCode ? '$47' : '',
      route: '/tests/asvab',
      badge: 'Most Popular',
      badgeColor: 'var(--accent)',
      available: true,
    },
    {
      id: 'OAR',
      icon: '⚓',
      name: 'OAR',
      subtitle: 'Navy & Marine Corps · Officers',
      tagline: 'Score 50+. Access every aviation and ground billets.',
      desc: 'Full Officer Aptitude Rating prep. Math, Reading, Mechanical. 190+ adaptive questions, formula sheets, AI tutor.',
      fullPrice: hasCode ? '$67' : '$97',
      strikePrice: hasCode ? '$97' : '',
      route: '/tests/oar',
      badge: 'Flagship',
      badgeColor: 'var(--purple)',
      available: true,
    },
    {
      id: 'AFOQT',
      icon: '✈️',
      name: 'AFOQT',
      subtitle: 'Air Force & Space Force · Officers',
      tagline: 'Qualify for the cockpit or any officer commissioning program.',
      desc: 'Verbal analogies, quantitative reasoning, situational judgment, reading, and math. Adaptive and timed.',
      fullPrice: hasCode ? '$67' : '$97',
      strikePrice: hasCode ? '$97' : '',
      route: '/tests/afoqt',
      badge: 'Coming Soon',
      badgeColor: 'var(--yellow)',
      available: false,
    },
    {
      id: 'SIFT',
      icon: '🚁',
      name: 'SIFT',
      subtitle: 'Army Aviation · Warrant Officers',
      tagline: 'Two attempts. No second chances. Prepare like it matters.',
      desc: 'Army Aviation Information Test, simple drawings, hidden figures, spatial reasoning. Highest WTP of any military test.',
      fullPrice: hasCode ? '$97' : '$127',
      strikePrice: hasCode ? '$127' : '',
      route: '/tests/sift',
      badge: 'Coming Soon',
      badgeColor: 'var(--yellow)',
      available: false,
    },
  ];

  const testCards = TESTS.map(t => {
    const owned = !!userAccess[t.id];
    const availableToBuy = t.available && !owned;

    return `
      <div style="border:1px solid var(--border);border-radius:14px;padding:24px;background:var(--surface-1);display:flex;flex-direction:column;gap:14px;${!t.available && !owned ? 'opacity:.7' : ''}">

        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:28px">${t.icon}</span>
            <div>
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--text-3);font-weight:600">${t.subtitle}</div>
              <div style="font-size:20px;font-weight:800">${t.name}</div>
            </div>
          </div>
          <span style="font-size:11px;font-weight:700;padding:4px 9px;border-radius:20px;white-space:nowrap;background:${t.badgeColor}22;color:${t.badgeColor}">${t.badge}</span>
        </div>

        <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin:0">${t.desc}</p>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
          ${owned
            ? `<span style="font-size:12px;font-weight:700;color:var(--green);padding:4px 10px;background:var(--green-bg);border-radius:20px">✓ Access Active</span>
               <a href="#/study?test=${t.id}" class="btn btn-primary" style="font-size:13px;padding:8px 16px">Continue Studying →</a>`
            : t.available
              ? `<div>
                   ${t.strikePrice ? `<div style="font-size:12px;color:var(--text-3);text-decoration:line-through;font-family:var(--font-mono)">${t.strikePrice}</div>` : ''}
                   <div style="font-size:22px;font-weight:800;font-family:var(--font-mono);color:var(--accent)">${t.fullPrice}</div>
                 </div>
                 <button class="btn btn-primary" style="font-size:13px;padding:8px 16px" onclick="handleTestCheckoutClick(this,'${t.id}')">
                   Get ${t.name} Access →
                 </button>`
              : `<div style="font-size:13px;color:var(--text-3)">Starting at ${t.fullPrice}</div>
                 <button class="btn btn-secondary" style="font-size:13px;padding:8px 16px" disabled>Coming Soon</button>`
          }
        </div>

      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div style="max-width:760px;margin:0 auto;padding:48px 24px 80px">

      <a href="#/" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:36px">
        ← Back to Home
      </a>

      <div style="margin-bottom:40px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:8px">Military Test Prep Platform</div>
        <h1 style="font-size:32px;font-weight:800;line-height:1.2;margin:0 0 12px">Every military test.<br>One adaptive platform.</h1>
        <p style="font-size:15px;color:var(--text-2);line-height:1.7;margin:0">Enlisted or officer, Army or Navy — one platform, one account. Buy only the tests you need. Lifetime access, no subscription.</p>
      </div>

      ${hasCode
        ? `<div style="margin-bottom:28px;padding:12px 16px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:10px;font-size:13px;color:var(--green)">
             ✓ Referral discount applied — all prices shown are your discounted rate
           </div>`
        : ''
      }

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:40px">
        ${testCards}
      </div>

      <!-- All-Access Bundle teaser -->
      <div style="border:1px dashed var(--border-strong);border-radius:14px;padding:24px;background:var(--surface-1);text-align:center">
        <div style="font-size:22px;margin-bottom:8px">🎯</div>
        <div style="font-size:16px;font-weight:800;margin-bottom:6px">All-Access Bundle — Coming Soon</div>
        <p style="font-size:13px;color:var(--text-2);margin:0 0 8px">All tests. One price. ~40% off buying them separately.</p>
        <div style="font-size:11px;color:var(--text-3)">Join the waitlist — be first when AFOQT + SIFT launch</div>
      </div>

      <p style="font-size:13px;color:var(--text-3);text-align:center;margin-top:24px">
        Already purchased? <a href="#/login">Sign in</a> to access your tests.
        &nbsp;·&nbsp; Questions? <a href="mailto:hello@armedprep.com">hello@armedprep.com</a>
      </p>

    </div>
  `;
});
