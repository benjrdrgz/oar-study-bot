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
  const path = hash.replace('#', '');

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
    matchedRoute = routes['/'] || (() => { document.getElementById('app').innerHTML = '<h1>404</h1>'; });
  }

  // Auth guard — check if route requires auth
  const publicRoutes = ['/', '/login', '/signup', '/payment-success'];
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
    await matchedRoute(params);
    app.style.opacity = '1';

    // Update nav active state
    updateNav(path);

    // Update sidebar if visible
    if (typeof updateSidebar === 'function') {
      updateSidebar(path);
    }

    // Re-render MathJax if available
    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, app]);
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
