// OAR Pro v4 — Legal Pages
// Routes: #/privacy, #/terms, #/refund
// Required for ad platforms (Google, Meta) and user trust.
// — Benjamin Rodriguez

function renderLegalShell(title, content) {
  const app = document.getElementById('app');
  document.getElementById('sidebar').style.display = 'none';
  app.classList.add('full-width');
  app.innerHTML = `
    <div style="max-width:680px;margin:40px auto;padding:0 24px 80px">
      <a href="#/" style="font-size:13px;color:var(--text-3);text-decoration:none;display:inline-flex;align-items:center;gap:4px;margin-bottom:32px">
        &larr; Back to home
      </a>
      <h1 style="font-size:28px;font-weight:800;margin-bottom:6px">${title}</h1>
      <p style="font-size:13px;color:var(--text-3);margin-bottom:32px">Last updated: April 2026</p>
      <div style="font-size:14px;line-height:1.8;color:var(--text-2)">
        ${content}
      </div>
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid var(--border);font-size:13px;color:var(--text-3)">
        Questions? Email <a href="mailto:hello@armedprep.com">hello@armedprep.com</a>
      </div>
    </div>
  `;
}

// ==========================================
// PRIVACY POLICY
// ==========================================
route('/privacy', () => {
  renderLegalShell('Privacy Policy', `
    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">What We Collect</h2>
    <p>When you create an account, we collect your email address and the name you provide. When you study, we collect your quiz answers, lesson progress, and test results to power your personalized study plan and score predictor. We also collect basic usage data (pages visited, time on site) to improve the product.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">How We Use It</h2>
    <p>Your data is used exclusively to:</p>
    <ul style="padding-left:20px;margin:10px 0">
      <li style="margin-bottom:6px">Power your personalized study experience (score predictor, weak-topic alerts, study plan)</li>
      <li style="margin-bottom:6px">Send transactional emails (account confirmation, password resets)</li>
      <li style="margin-bottom:6px">Attribute affiliate referrals if you used a referral code at signup</li>
      <li style="margin-bottom:6px">Improve OAR Pro features over time</li>
    </ul>
    <p>We do not sell your data. We do not share your data with third parties for advertising.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Third-Party Services</h2>
    <p>We use the following services to operate OAR Pro:</p>
    <ul style="padding-left:20px;margin:10px 0">
      <li style="margin-bottom:6px"><strong>Supabase</strong> — database and authentication (supabase.com)</li>
      <li style="margin-bottom:6px"><strong>Stripe</strong> — payment processing (stripe.com). We never store your card details.</li>
    </ul>
    <p>Each provider has their own privacy policy governing how they handle data.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Data Retention</h2>
    <p>Your study data is retained for as long as your account is active. If you close your account, you may request full deletion by emailing hello@armedprep.com. We will delete your account and associated data within 30 days.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Cookies</h2>
    <p>OAR Pro uses cookies and session storage only for authentication (keeping you logged in) and storing your study session preferences. We do not use tracking cookies or advertising cookies.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Contact</h2>
    <p>For any privacy questions or data requests, email <a href="mailto:hello@armedprep.com">hello@armedprep.com</a>.</p>
  `);
});


// ==========================================
// TERMS OF USE
// ==========================================
route('/terms', () => {
  renderLegalShell('Terms of Use', `
    <p>By accessing or using OAR Pro, you agree to these Terms of Use. If you do not agree, do not use the platform.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">License</h2>
    <p>OAR Pro grants you a personal, non-transferable, non-exclusive license to access and use the study platform for your own individual exam preparation. You may not resell, redistribute, screenshot for commercial use, or share your account with others.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Not Affiliated With the U.S. Military</h2>
    <p>OAR Pro is an independent educational product. We are not affiliated with, endorsed by, or connected to the U.S. Navy, Marine Corps, NROTC, Officer Candidate School, or any government entity. All content is based on publicly available information about the OAR exam format and general academic subjects.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">No Score Guarantee</h2>
    <p>OAR Pro provides educational study tools and a score predictor for reference. We do not guarantee any specific outcome on the actual OAR exam. Your score depends on your effort, preparation, and test-day performance. Our 30-day money-back guarantee is based on satisfaction with the platform, not on achieving a specific score.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Acceptable Use</h2>
    <p>You agree not to:</p>
    <ul style="padding-left:20px;margin:10px 0">
      <li style="margin-bottom:6px">Attempt to reverse-engineer, scrape, or copy platform content</li>
      <li style="margin-bottom:6px">Share login credentials with others</li>
      <li style="margin-bottom:6px">Use automated tools to access the platform</li>
      <li style="margin-bottom:6px">Submit false information to manipulate affiliate or referral systems</li>
    </ul>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Modifications</h2>
    <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Limitation of Liability</h2>
    <p>OAR Pro is provided "as is." To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
  `);
});


// ==========================================
// REFUND POLICY
// ==========================================
route('/refund', () => {
  renderLegalShell('Refund Policy', `
    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">30-Day Money-Back Guarantee</h2>
    <p>If you're not satisfied with OAR Pro for any reason within 30 days of purchase, we will refund your payment in full — no questions, no forms, no hassle.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">How to Request a Refund</h2>
    <p>Email <a href="mailto:hello@armedprep.com">hello@armedprep.com</a> with the subject line "Refund Request" and include the email address associated with your account. That's it. We will process your refund within 5 business days.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Refund Timeline</h2>
    <p>Once processed, refunds typically appear on your original payment method within 5-10 business days, depending on your bank or card issuer. The exact timing is controlled by your financial institution, not by us.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">After a Refund</h2>
    <p>Upon refund, your access to OAR Pro study content will be removed. Your account will be closed. If you later decide to repurchase, you are welcome to do so at the current price.</p>

    <h2 style="font-size:18px;font-weight:700;color:var(--text);margin:24px 0 10px">Contact</h2>
    <p>Questions about your purchase? Email <a href="mailto:hello@armedprep.com">hello@armedprep.com</a>. We respond to all billing inquiries within one business day.</p>
  `);
});
