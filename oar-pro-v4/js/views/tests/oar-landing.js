// OAR Pro v4 — OAR Landing Page
// Route: #/tests/oar (public)
// Tone: Naval officer, competitive, precise. "Score 50+. Access every billet."
// — Benjamin Rodriguez

route('/tests/oar', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('mobileToggle').style.display = 'none';

  const affiliateCode = (() => {
    try { return sessionStorage.getItem('oar_affiliate_ref') || ''; } catch (_) { return ''; }
  })();
  const hasCode = !!affiliateCode;
  const displayPrice = hasCode ? '$67' : '$97';
  const strikePrice = hasCode ? '$97' : '';

  app.innerHTML = `
    <div style="max-width:680px;margin:0 auto;padding:48px 24px 80px">

      <a href="#/tests" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:36px">
        ← All Tests
      </a>

      <!-- Hero -->
      <div style="margin-bottom:40px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <span style="font-size:32px">⚓</span>
          <div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600">Navy & Marine Corps · Officers</div>
            <h1 style="font-size:30px;font-weight:800;line-height:1.2;margin:0">OAR Prep</h1>
          </div>
        </div>
        <p style="font-size:16px;color:var(--text-2);line-height:1.7;margin-bottom:0">
          Score 50+. Access every aviation and ground billet. The OAR determines your commissioning options — our adaptive platform targets exactly what costs you points and fixes it fast.
        </p>
      </div>

      <!-- What's covered -->
      <div style="margin-bottom:36px;padding:24px;background:var(--surface-1);border:1px solid var(--border);border-radius:12px">
        <h3 style="font-size:14px;font-weight:700;margin-bottom:16px;color:var(--text-1)">Three sections. All covered.</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
          ${[
            ['Math', '⚡', 'Algebra, geometry, word problems, percentages, rates'],
            ['Reading', '📖', 'Passage comprehension, inference, main idea, tone'],
            ['Mechanical', '⚙️', 'Levers, pulleys, gears, fluid dynamics, forces'],
          ].map(([title, icon, desc]) => `
            <div style="text-align:center;padding:16px;border:1px solid var(--border);border-radius:10px">
              <div style="font-size:24px;margin-bottom:8px">${icon}</div>
              <div style="font-size:14px;font-weight:700;margin-bottom:6px">${title}</div>
              <div style="font-size:12px;color:var(--text-3);line-height:1.5">${desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Features grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:36px">
        ${[
          ['⚡', 'Adaptive Testing', 'Adjusts to your level in real time — just like the real test'],
          ['🎯', 'Weak Spot AI', 'Detects where you lose points and routes you to fix it'],
          ['📊', 'Score Predictor', 'Estimated OAR score before you walk in'],
          ['📐', 'Formula Sheets', 'Every formula you need, organized for fast review'],
          ['⏱️', 'Timed Drills', 'Build speed so time pressure never costs you points'],
          ['♾️', 'Unlimited Math', 'Auto-generated problems — never run out of practice'],
        ].map(([icon, title, desc]) => `
          <div style="padding:16px;border:1px solid var(--border);border-radius:12px;background:var(--surface-1)">
            <div style="font-size:22px;margin-bottom:8px">${icon}</div>
            <div style="font-size:13px;font-weight:700;margin-bottom:4px">${title}</div>
            <div style="font-size:12px;color:var(--text-3);line-height:1.5">${desc}</div>
          </div>
        `).join('')}
      </div>

      <!-- Score context -->
      <div style="margin-bottom:36px;padding:18px 20px;background:var(--surface-1);border:1px solid var(--border);border-radius:10px">
        <div style="font-size:12px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">OAR score targets by billet</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">
          ${[
            ['35', 'Minimum qualify'],
            ['40', 'Average selectee'],
            ['50+', 'Aviation competitive'],
            ['55+', 'Top 10% selectees'],
          ].map(([score, label]) => `
            <div>
              <div style="font-size:20px;font-weight:800;font-family:var(--font-mono);color:var(--accent)">${score}</div>
              <div style="font-size:11px;color:var(--text-3)">${label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Pricing / CTA -->
      <div style="border:1px solid var(--border);border-radius:14px;padding:28px;background:var(--surface-1)">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;gap:12px">
          <div>
            <h2 style="font-size:20px;font-weight:800;margin:0 0 4px">OAR Prep — Lifetime Access</h2>
            <p style="font-size:13px;color:var(--text-3);margin:0">One payment. No subscription. Access forever.</p>
          </div>
          <div style="text-align:right">
            ${strikePrice ? `<div style="font-size:14px;color:var(--text-3);text-decoration:line-through;font-family:var(--font-mono)">${strikePrice}</div>` : ''}
            <div style="font-size:32px;font-weight:800;font-family:var(--font-mono);color:var(--accent)">${displayPrice}</div>
          </div>
        </div>

        ${hasCode
          ? `<div style="margin-bottom:16px;padding:10px 14px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:8px;font-size:13px;color:var(--green)">✓ Referral code applied — $30 off your purchase</div>`
          : `<div style="margin-bottom:16px;padding:10px 14px;background:var(--surface-2);border-radius:8px;font-size:12px;color:var(--text-3)">Have a referral code from a recruiter? Enter it on the next screen to save $30.</div>`
        }

        <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px"></div>

        <button class="btn btn-primary btn-lg" style="width:100%" onclick="handleTestCheckoutClick(this,'OAR')">
          Get OAR Access for ${displayPrice} →
        </button>
        <p style="font-size:12px;color:var(--text-3);text-align:center;margin:12px 0 0">
          🔒 Secure checkout via Stripe · 30-day money-back guarantee
        </p>
      </div>

      <p style="font-size:13px;color:var(--text-3);text-align:center;margin-top:20px">
        Already purchased? <a href="#/login">Sign in</a> and start studying immediately.
        &nbsp;·&nbsp; Questions? <a href="mailto:hello@armedprep.com">hello@armedprep.com</a>
      </p>

    </div>
  `;
});
