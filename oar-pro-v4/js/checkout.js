// OAR Pro v4 — Stripe Checkout Handler
// Calls create-checkout Edge Function → redirects to Stripe hosted page
// No price logic lives here — all pricing is in Stripe and the Edge Function.

const OAR_FUNCTIONS_URL = 'https://ugblwepfptumffzcljot.supabase.co/functions/v1';

/**
 * Kick off Stripe checkout.
 * @param {string} [email]       - Pre-fill customer email (optional)
 * @param {HTMLElement} [btnEl]  - Button to disable/restore on error (optional)
 */
async function startCheckout(email, btnEl) {
  // Show loading state if a button element was passed
  const originalText = btnEl ? btnEl.textContent : null;
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.textContent = 'Loading checkout...';
  }

  // Grab any affiliate/referral code captured on landing
  const affiliateCode = (() => {
    try {
      return sessionStorage.getItem('oar_affiliate_ref') || '';
    } catch (_) { return ''; }
  })();

  try {
    const res = await fetch(`${OAR_FUNCTIONS_URL}/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Supabase Edge Functions require the anon key for auth
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: email && email.trim() ? email.trim() : undefined,
        affiliate_code: affiliateCode || undefined,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    const { url } = await res.json();
    if (!url) throw new Error('No checkout URL returned');

    // Hand off to Stripe — no coming back from here (Stripe manages the redirect)
    window.location.href = url;
  } catch (err) {
    console.error('[OAR] Checkout error:', err);
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.textContent = originalText;
    }
    // Show inline error rather than alert
    const errContainer = document.getElementById('checkoutError');
    if (errContainer) {
      errContainer.textContent = 'Checkout failed — please try again or contact support.';
      errContainer.style.display = 'block';
    } else {
      alert('Checkout failed. Please try again or email ben@rodriguezwi.com');
    }
  }
}

/**
 * Called from a button: passes the button element for loading state handling.
 * Pre-fills the logged-in user's email for a smoother Stripe checkout experience.
 * Usage: onclick="handleCheckoutClick(this)"
 */
async function handleCheckoutClick(btn) {
  let email;
  try {
    const user = await getUser();
    email = user?.email || undefined;
  } catch (_) { /* unauthenticated — proceed without email */ }
  startCheckout(email, btn);
}

// Render the checkout/pricing route (#/checkout) — bridge page
// Also shown when an affiliate link redirects to /#/checkout
route('/checkout', () => {
  const app = document.getElementById('app');
  document.getElementById('sidebar').style.display = 'none';
  app.classList.add('full-width');

  // Check if buyer has an affiliate code (saves $30)
  const affiliateCode = (() => {
    try { return sessionStorage.getItem('oar_affiliate_ref') || ''; } catch (_) { return ''; }
  })();
  const hasCode = !!affiliateCode;
  const displayPrice = hasCode ? '$67' : '$97';
  const originalPrice = hasCode ? '$97' : '';
  const savingsNote = hasCode
    ? `<div style="font-size:12px;color:var(--green);padding:10px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:8px;margin-bottom:16px">&#10003; Referral discount applied &mdash; you're saving $30!</div>`
    : `<div style="font-size:12px;color:var(--text-3);padding:10px;background:var(--surface-2);border-radius:8px;margin-bottom:16px">One-time payment &middot; Lifetime access &middot; 30-day money-back guarantee</div>`;

  app.innerHTML = `
    <div style="max-width:480px;margin:80px auto;text-align:center;padding:0 20px">
      <div style="font-size:48px;margin-bottom:16px">⚓</div>
      <h1 style="font-size:28px;margin-bottom:8px">Get OAR Pro</h1>
      <p class="text-muted" style="margin-bottom:28px">One-time payment &middot; Lifetime access</p>

      <div class="card" style="text-align:left;padding:24px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div>
            <div style="font-weight:700;font-size:16px">OAR Pro — Lifetime Access</div>
            <div style="font-size:13px;color:var(--text-3)">All lessons, questions, tests &amp; tools</div>
          </div>
          <div style="text-align:right">
            ${originalPrice ? `<div style="font-size:13px;color:var(--text-3);text-decoration:line-through" class="mono">${originalPrice}</div>` : ''}
            <div style="font-size:28px;font-weight:700;color:var(--accent)" class="mono">${displayPrice}</div>
          </div>
        </div>
        ${savingsNote}
        <div id="checkoutError" style="display:none;color:var(--red);font-size:13px;margin-bottom:12px;padding:10px;background:rgba(239,68,68,.1);border-radius:6px"></div>
        <button class="btn btn-primary btn-lg btn-block" onclick="handleCheckoutClick(this)">
          Pay ${displayPrice} &rarr;
        </button>
        <p style="font-size:12px;color:var(--text-3);text-align:center;margin-top:10px">
          &#128274; Secure payment via Stripe &middot; 30-day money-back guarantee
        </p>
      </div>

      <p style="font-size:13px;color:var(--text-3)">
        Already purchased? <a href="#/signup">Create your account</a> or <a href="#/login">sign in</a>
      </p>
    </div>
  `;
});
