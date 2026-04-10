// OAR Pro v4 — Hash-Based SPA Router
// Routes: #/ (landing), #/login, #/signup, #/onboarding, #/dashboard,
//         #/study, #/study/:id, #/practice, #/adaptive, #/formulas,
//         #/strategies, #/tutor, #/profile, #/admin/*

const routes = {};
let currentView = null;

function route(path, handler) {
  routes[path] = handler;
}

function navigate(path) {
  window.location.hash = path;
}

async function handleRoute() {
  const hash = window.location.hash || '#/';
  const fullPath = hash.replace('#', '');

  // Strip query string before route matching, parse query params separately
  const qIdx = fullPath.indexOf('?');
  const path = qIdx !== -1 ? fullPath.slice(0, qIdx) : fullPath;
  const queryString = qIdx !== -1 ? fullPath.slice(qIdx + 1) : '';
  const queryParams = {};
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx !== -1) {
        const k = decodeURIComponent(pair.slice(0, eqIdx));
        const v = decodeURIComponent(pair.slice(eqIdx + 1));
        if (k) queryParams[k] = v;
      } else if (pair) {
        queryParams[decodeURIComponent(pair)] = '';
      }
    });
  }

  // Parse route and params
  let matchedRoute = null;
  let params = {};

  // Try exact match first
  if (routes[path]) {
    matchedRoute = routes[path];
  } else {
    // Try parameterized routes (e.g., /study/:id)
    for (const [pattern, handler] of Object.entries(routes)) {
      const patternParts = pattern.split('/');
      const pathParts = path.split('/');
      if (patternParts.length !== pathParts.length) continue;

      let match = true;
      const extractedParams = {};
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          extractedParams[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        matchedRoute = handler;
        params = extractedParams;
        break;
      }
    }
  }

  if (!matchedRoute) {
    matchedRoute = () => {
      const app = document.getElementById('app');
      app.classList.add('full-width');
      document.getElementById('sidebar').style.display = 'none';
      document.getElementById('mobileToggle').style.display = 'none';
      app.innerHTML = `
        <div style="max-width:480px;margin:100px auto;text-align:center;padding:0 24px">
          <div style="font-size:64px;margin-bottom:16px">⚓</div>
          <h1 style="font-size:32px;margin-bottom:12px">Page Not Found</h1>
          <p class="text-muted" style="margin-bottom:28px">That route doesn't exist. You might have a typo in the URL.</p>
          <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
          <span style="margin:0 12px;color:var(--text-3)">or</span>
          <a href="#/" class="btn btn-secondary">Home</a>
        </div>
      `;
    };
  }

  // Auth guard — check if route requires auth
  const publicRoutes = ['/', '/login', '/signup', '/payment-success', '/diagnostic', '/checkout',
                        '/forgot-password', '/update-password'];
  const adminRoutes = ['/admin', '/admin/sales', '/admin/affiliates', '/admin/preview'];

  if (!publicRoutes.includes(path)) {
    const user = await getUser();
    if (!user) {
      navigate('#/login');
      return;
    }

    // Check paid access for content routes
    const contentRoutes = ['/study', '/practice', '/adaptive', '/formulas', '/strategies', '/tutor'];
    const isContentRoute = contentRoutes.some(r => path.startsWith(r));
    if (isContentRoute) {
      const paid = await isPaid();
      if (!paid) {
        navigate('#/dashboard'); // Dashboard shows upgrade prompt
        return;
      }
    }

    // Admin guard
    if (adminRoutes.some(r => path.startsWith(r))) {
      const admin = await isAdmin();
      if (!admin) {
        navigate('#/dashboard');
        return;
      }
    }
  }

  // Transition: fade out current view, render new, fade in
  const app = document.getElementById('app');
  app.style.opacity = '0';

  setTimeout(async () => {
    // ── Layout reset ──────────────────────────────────────────────────────────
    // Prevents sidebar/full-width state from bleeding between routes.
    // Public routes: hide sidebar, go full-width.
    // Authenticated routes: show sidebar (individual views override if needed).
    const _sidebar = document.getElementById('sidebar');
    const _mobileToggle = document.getElementById('mobileToggle');
    const _isPublic = ['/', '/login', '/signup', '/forgot-password', '/update-password',
                        '/payment-success', '/checkout'].includes(path)
                      || path.startsWith('/diagnostic');
    if (_isPublic) {
      _sidebar.style.display = 'none';
      app.classList.add('full-width');
      _mobileToggle.style.display = 'none';
    } else {
      _sidebar.style.display = '';
      app.classList.remove('full-width');
      _mobileToggle.style.display = '';
    }
    // ─────────────────────────────────────────────────────────────────────────

    await matchedRoute({ ...params, ...queryParams });
    app.style.opacity = '1';

    // Update nav active state
    updateNav(path);

    // Update sidebar if visible
    if (typeof updateSidebar === 'function') {
      updateSidebar(path);
    }

    // Re-render MathJax (v3 API)
    if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
      if (typeof MathJax.typesetClear === 'function') {
        try { MathJax.typesetClear([app]); } catch (e) { /* ignore */ }
      }
      MathJax.typesetPromise([app]).catch(() => {});
    }

    // Update Tawk.to context
    if (typeof Tawk_API !== 'undefined' && Tawk_API.setAttributes) {
      Tawk_API.setAttributes({ current_view: path });
    }
  }, 150);
}

function updateNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkPath = href.replace('#', '');
      link.classList.toggle('active', path.startsWith(linkPath) && linkPath !== '/');
    }
  });
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
