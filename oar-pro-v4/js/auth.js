// OAR Pro v4 — Authentication Module

// XSS-safe HTML escaping (mirrors dashboard.js esc() — must be defined before auth runs)
function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Render nav based on auth state
async function renderNav() {
  const nav = document.getElementById('topnav');
  const user = await getUser();
  const profile = user ? await getProfile() : null;

  if (!user) {
    // Public nav
    nav.innerHTML = `
      <div class="nav-inner">
        <a href="#/" class="nav-logo">⚓ OAR <span>Pro</span></a>
        <div class="nav-links">
          <a href="#/login" class="nav-link">Log In</a>
          <button class="btn btn-primary btn-sm" onclick="handleCheckoutClick(this)">Get Access</button>
        </div>
      </div>
    `;
    // Hide sidebar and go full width
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('app').classList.add('full-width');
    document.getElementById('mobileToggle').style.display = 'none';
    const mnm = document.getElementById('mobileNavMenu');
    if (mnm) mnm.innerHTML = '';
  } else {
    // Authenticated nav
    const initials = escHtml((profile?.display_name || profile?.email || '?').substring(0, 2).toUpperCase());
    const isAdminUser = profile?.account_type === 'admin';

    nav.innerHTML = `
      <div class="nav-inner">
        <div style="display:flex;align-items:center">
          <button class="hamburger-btn" onclick="toggleMobileNav()" aria-label="Menu">&#9776;</button>
          <a href="#/dashboard" class="nav-logo">⚓ OAR <span>Pro</span></a>
        </div>
        <div class="nav-links">
          <a href="#/dashboard" class="nav-link">Dashboard</a>
          <a href="#/study" class="nav-link">Study</a>
          <a href="#/practice" class="nav-link">Practice</a>
          <a href="#/adaptive" class="nav-link">Test Sim</a>
          <a href="#/formulas" class="nav-link">Formulas</a>
          <a href="#/strategies" class="nav-link">Strategies</a>
          ${isAdminUser ? '<a href="#/admin/sales" class="nav-link" style="color:var(--yellow)">Admin</a>' : ''}
        </div>
        <div class="nav-user">
          <div class="nav-avatar" onclick="toggleUserMenu()">${initials}</div>
          <div class="nav-user-menu" id="userMenu">
            <div style="padding:8px 12px;border-bottom:1px solid var(--border);margin-bottom:4px">
              <div style="font-weight:600;font-size:14px">${escHtml(profile?.display_name || 'OAR Candidate')}</div>
              <div style="font-size:12px;color:var(--text-3)">${escHtml(profile?.email || '')}</div>
            </div>
            <a href="#/profile">⚙️ Settings</a>
            <a href="#/tutor">🧠 Problem Tutor</a>
            <a href="#/test-day">🎯 Test Day Mode</a>
            ${isAdminUser ? '<a href="#/admin/sales">📊 Admin Dashboard</a>' : ''}
            <a href="#" onclick="signOut()" style="color:var(--red)">🚪 Sign Out</a>
          </div>
        </div>
      </div>
    `;

    // Populate mobile nav menu
    const mobileNav = document.getElementById('mobileNavMenu');
    if (mobileNav) {
      mobileNav.innerHTML = `
        <a href="#/dashboard">📊 Dashboard</a>
        <a href="#/study">📚 Study</a>
        <a href="#/practice">🎯 Practice</a>
        <a href="#/adaptive">🧪 Test Sim</a>
        <a href="#/formulas">📐 Formulas</a>
        <a href="#/strategies">💡 Strategies</a>
        ${isAdminUser ? '<a href="#/admin/sales" class="admin">⚙️ Admin</a>' : ''}
        <div style="height:1px;background:var(--border);margin:4px 0"></div>
        <a href="#/tutor">🧠 Tutor</a>
        <a href="#/test-day">🎯 Test Day</a>
        <a href="#/profile">👤 Profile</a>
        <a href="#" onclick="signOut();return false;" style="color:var(--red)">🚪 Sign Out</a>
      `;
    }

    // Show sidebar
    document.getElementById('sidebar').style.display = '';
    document.getElementById('app').classList.remove('full-width');
  }
}

function toggleUserMenu() {
  document.getElementById('userMenu').classList.toggle('open');
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  if (menu && !e.target.closest('.nav-user')) {
    menu.classList.remove('open');
  }
});

// Sign up with email/password
async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  if (error) throw error;

  // Capture affiliate ref code if present (from ?ref=CODE or sessionStorage)
  let refCode = null;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    refCode = urlParams.get('ref') || sessionStorage.getItem('oar_affiliate_ref');
  } catch (e) { /* ignore */ }

  // Update display name and affiliate code in profile
  if (data.user) {
    const updates = { display_name: displayName };
    if (refCode) updates.affiliate_code_used = refCode;
    await supabase.from('profiles').update(updates).eq('id', data.user.id);
  }

  return data;
}

// Capture ?ref= on first visit and persist for the session
(function captureAffiliateRef() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) sessionStorage.setItem('oar_affiliate_ref', ref);
  } catch (e) { /* ignore */ }
})();

// Sign in with email/password
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Magic link
async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

// Sign out
async function signOut() {
  await supabase.auth.signOut();
  navigate('#/');
  renderNav();
}

// Render login view
function renderLoginView() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="max-width:400px;margin:60px auto;text-align:center">
      <h1 style="font-size:28px;margin-bottom:8px">Welcome Back</h1>
      <p class="text-muted mb-8">Sign in to continue studying</p>

      <div id="authError" style="display:none" class="callout callout-warning mb-4"></div>

      <div class="card" style="text-align:left">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="loginEmail" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="loginPassword" placeholder="••••••••">
        </div>
        <button class="btn btn-primary btn-block btn-lg" onclick="handleLogin()">Sign In</button>

        <div class="divider"></div>

        <button class="btn btn-secondary btn-block" onclick="handleMagicLink()">Send Magic Link Instead</button>
      </div>

      <p class="text-muted mt-4" style="font-size:13px">
        Don't have an account? <a href="#/signup">Sign up here</a>
      </p>
    </div>
  `;
}

// Render signup view
function renderSignupView() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="max-width:400px;margin:60px auto;text-align:center">
      <h1 style="font-size:28px;margin-bottom:8px">Create Your Account</h1>
      <p class="text-muted mb-8">Start your OAR prep journey</p>

      <div id="authError" style="display:none" class="callout callout-warning mb-4"></div>

      <div class="card" style="text-align:left">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="signupName" placeholder="Benjamin Rodriguez">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="signupEmail" placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-input" id="signupPassword" placeholder="Min 8 characters">
        </div>
        <button class="btn btn-primary btn-block btn-lg" onclick="handleSignup()">Create Account</button>
      </div>

      <p class="text-muted mt-4" style="font-size:13px">
        Already have an account? <a href="#/login">Sign in here</a>
      </p>
    </div>
  `;
}

// Handle login
async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errDiv = document.getElementById('authError');

  try {
    await signIn(email, password);
    await renderNav();
    const profile = await getProfile();
    if (!profile?.onboarding_complete) {
      navigate('#/onboarding');
    } else {
      navigate('#/dashboard');
    }
  } catch (err) {
    errDiv.style.display = 'block';
    errDiv.textContent = err.message || 'Invalid email or password';
  }
}

// Handle signup
async function handleSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const errDiv = document.getElementById('authError');

  if (password.length < 8) {
    errDiv.style.display = 'block';
    errDiv.textContent = 'Password must be at least 8 characters';
    return;
  }

  try {
    await signUp(email, password, name);
    await renderNav();
    navigate('#/onboarding');
  } catch (err) {
    errDiv.style.display = 'block';
    errDiv.textContent = err.message || 'Signup failed';
  }
}

// Handle magic link
async function handleMagicLink() {
  const email = document.getElementById('loginEmail').value;
  const errDiv = document.getElementById('authError');

  if (!email) {
    errDiv.style.display = 'block';
    errDiv.textContent = 'Enter your email first';
    return;
  }

  try {
    await sendMagicLink(email);
    errDiv.style.display = 'block';
    errDiv.style.borderColor = 'var(--green)';
    errDiv.style.background = 'var(--green-bg)';
    errDiv.style.color = 'var(--green)';
    errDiv.textContent = 'Magic link sent! Check your email.';
  } catch (err) {
    errDiv.style.display = 'block';
    errDiv.textContent = err.message;
  }
}

// Register auth routes
route('/login', () => { renderLoginView(); });
route('/signup', () => { renderSignupView(); });

// Payment success route — shown after Stripe checkout
route('/payment-success', async () => {
  const app = document.getElementById('app');
  app.classList.add('full-width');
  app.innerHTML = `
    <div style="max-width:500px;margin:80px auto;text-align:center;padding:0 20px">
      <div style="font-size:64px;margin-bottom:16px">🎉</div>
      <h1 style="font-size:32px;margin-bottom:12px">Welcome to OAR Pro!</h1>
      <p class="text-muted mb-8" style="font-size:16px">
        Your payment was successful. You now have lifetime access to everything.
      </p>
      <div class="card" style="text-align:left;margin-bottom:24px">
        <div style="font-weight:600;margin-bottom:12px">What's next:</div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0">
          <span style="color:var(--green)">&#10003;</span>
          <span>Create your account or sign in</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0">
          <span style="color:var(--green)">&#10003;</span>
          <span>Complete the 5-minute diagnostic pretest</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;padding:6px 0">
          <span style="color:var(--green)">&#10003;</span>
          <span>Get your personalized study plan</span>
        </div>
      </div>
      <button class="btn btn-primary btn-lg btn-block" onclick="handlePaymentSuccess()">
        Continue &rarr;
      </button>
      <p class="text-muted mt-4" style="font-size:13px">
        Need help? Email <a href="mailto:ben@rodriguezwi.com">ben@rodriguezwi.com</a>
      </p>
    </div>
  `;
});

async function handlePaymentSuccess() {
  const user = await getUser();
  if (user) {
    const paid = await isPaid();
    if (paid) {
      // Paid + logged in — go to onboarding if not complete, else dashboard
      const profile = await getProfile();
      navigate(profile?.onboarding_complete ? '#/dashboard' : '#/onboarding');
    } else {
      // Logged in but payment not yet confirmed — wait a moment and recheck
      // (webhook may still be processing — Stripe can take a few seconds)
      const btn = document.querySelector('[onclick="handlePaymentSuccess()"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Confirming payment...'; }

      await new Promise(r => setTimeout(r, 3000));
      const paidAfterWait = await isPaid();
      if (paidAfterWait) {
        const profile = await getProfile();
        navigate(profile?.onboarding_complete ? '#/dashboard' : '#/onboarding');
      } else {
        // Still not confirmed — send to dashboard which shows the upgrade wall with a helpful message
        navigate('#/dashboard');
      }
    }
  } else {
    // Not logged in — route to signup (pending_payments will reconcile on signup)
    navigate('#/signup');
  }
}
