// OAR Pro v4 — Recruiter Affiliate Application Page
// Route: #/recruiters (public)
// — Benjamin Rodriguez

route('/recruiters', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('mobileToggle').style.display = 'none';

  app.innerHTML = `
    <div style="max-width:600px;margin:0 auto;padding:60px 24px 80px">

      <!-- Back -->
      <a href="#/" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-3);text-decoration:none;margin-bottom:40px">
        ← Back to OAR Pro
      </a>

      <!-- Header -->
      <div style="margin-bottom:40px">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--text-3);font-weight:600;margin-bottom:10px">Recruiter Program</div>
        <h1 style="font-size:32px;font-weight:800;line-height:1.15;margin-bottom:16px">
          Give your candidates a real advantage.
        </h1>
        <p style="font-size:16px;color:var(--text-2);line-height:1.7">
          OAR Pro is a comprehensive study platform built specifically for the OAR — adaptive practice tests, science-backed lessons, and a real-time AI tutor. Recruiters who refer candidates get complimentary access so they know exactly what they're recommending.
        </p>
      </div>

      <!-- What you get -->
      <div style="margin-bottom:40px;padding:24px;background:var(--surface-1);border:1px solid var(--border);border-radius:12px">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:16px;color:var(--text-1)">What's included</h3>
        <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px">
          ${[
            'Free access to OAR Pro so you can evaluate it yourself',
            'A personal referral code — candidates who use it save $30',
            '20% commission on each sale through your code',
            'A private dashboard to track referrals and request payouts',
          ].map(item => `
            <li style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--text-2)">
              <span style="color:var(--green);margin-top:1px;flex-shrink:0">✓</span>
              ${item}
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Application Form -->
      <div style="border:1px solid var(--border);border-radius:14px;padding:32px;background:var(--surface-1)">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:6px">Apply for a referral code</h2>
        <p style="font-size:13px;color:var(--text-3);margin-bottom:28px">We'll follow up within 48 hours with your code and access credentials.</p>

        <div style="display:flex;flex-direction:column;gap:18px">
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:140px;margin-bottom:0">
              <label class="form-label">Full name</label>
              <input type="text" class="form-input" id="affAppName" placeholder="Jane Smith">
            </div>
            <div class="form-group" style="flex:1;min-width:110px;margin-bottom:0">
              <label class="form-label">Rank / title</label>
              <input type="text" class="form-input" id="affAppRank" placeholder="LT, CPO, GS-12...">
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="affAppEmail" placeholder="you@navy.mil">
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:130px;margin-bottom:0">
              <label class="form-label">Branch</label>
              <select class="form-input" id="affAppBranch">
                <option value="Navy">Navy</option>
                <option value="Marine Corps">Marine Corps</option>
                <option value="Coast Guard">Coast Guard</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group" style="flex:1;min-width:130px;margin-bottom:0">
              <label class="form-label">Candidates / year</label>
              <select class="form-input" id="affAppVolume">
                <option value="1-10">1–10</option>
                <option value="11-30">11–30</option>
                <option value="31-60">31–60</option>
                <option value="60+">60+</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Anything else? <span style="color:var(--text-3);font-weight:400">(optional)</span></label>
            <input type="text" class="form-input" id="affAppNotes" placeholder="District, duty station, questions...">
          </div>

          <div id="affAppMsg" style="display:none;font-size:13px;padding:12px;border-radius:8px"></div>

          <button class="btn btn-primary" id="affAppBtn" onclick="submitAffiliateApplication()" style="width:100%">
            Submit Application
          </button>

          <p style="font-size:12px;color:var(--text-3);text-align:center;margin:0">
            No obligation. We review every application personally.
          </p>
        </div>
      </div>

    </div>
  `;
});

async function submitAffiliateApplication() {
  const name   = (document.getElementById('affAppName')?.value || '').trim();
  const rank   = (document.getElementById('affAppRank')?.value || '').trim();
  const email  = (document.getElementById('affAppEmail')?.value || '').trim();
  const branch = document.getElementById('affAppBranch')?.value;
  const volume = document.getElementById('affAppVolume')?.value;
  const notes  = (document.getElementById('affAppNotes')?.value || '').trim();
  const msg    = document.getElementById('affAppMsg');
  const btn    = document.getElementById('affAppBtn');

  const showMsg = (text, color) => {
    msg.style.display = 'block';
    msg.style.background = `${color}22`;
    msg.style.color = color;
    msg.style.border = `1px solid ${color}40`;
    msg.textContent = text;
  };

  if (!name) { showMsg('Please enter your full name.', 'var(--red)'); return; }
  if (!email || !email.includes('@')) { showMsg('Please enter a valid email address.', 'var(--red)'); return; }

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const { error } = await supabase.from('affiliate_applications').insert({
    name, rank: rank || null, email, branch, volume, notes: notes || null
  });

  if (error) {
    showMsg('Something went wrong. Email hello@armedprep.com to apply directly.', 'var(--red)');
    btn.disabled = false;
    btn.textContent = 'Submit Application';
  } else {
    msg.style.display = 'block';
    msg.style.background = 'rgba(16,185,129,.08)';
    msg.style.border = '1px solid rgba(16,185,129,.3)';
    msg.style.color = 'var(--green)';
    msg.style.borderRadius = '8px';
    msg.style.padding = '16px';
    msg.innerHTML = '<strong>Application received.</strong><br><span style="font-size:12px;opacity:.8">We\'ll review it and reach out within 48 hours with your referral code and access link.</span>';
    btn.textContent = 'Application Submitted';
    ['affAppName','affAppRank','affAppEmail','affAppNotes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = true;
    });
    document.getElementById('affAppBranch').disabled = true;
    document.getElementById('affAppVolume').disabled = true;
  }
}
