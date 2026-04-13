# Recruiter Notes — OAR Pro

Quick orientation for a reviewing engineer or technical recruiter. Skip the README if you want the shortest path to "what should I look at and why is it interesting."

## 60-second orientation

- **What it is:** a shipped SaaS for U.S. Navy/Marine officer candidates prepping for the OAR exam. Public diagnostic → paywall → full study platform. One-time $97 lifetime purchase.
- **Stack:** vanilla JS SPA (no framework), Supabase (Postgres + Auth + Edge Functions), Stripe Checkout. No build step. Deployed on Vercel.
- **Codebase size:** ~15 view modules, ~200-line router, 10 SQL migrations, 2 Edge Functions. Small enough to read end-to-end in an afternoon.

## What to highlight in an interview

### 1. Security engineering (the strongest signal)

Walk through `supabase/migrations/007_security_hardening.sql` first. Three layers of defense for `is_paid`:

1. Frontend route guard (low-trust).
2. RLS policies requiring `is_paid = TRUE` on every content table.
3. **A BEFORE-UPDATE trigger that silently resets privileged columns back to OLD values for any non-`service_role` caller.** This means even if an attacker finds an RLS bypass, they still can't self-upgrade.

Also: `pending_payments` and `affiliates` tables have RLS enabled with **zero policies** — invisible to anon and authenticated roles entirely. Only the Stripe webhook (service-role) can reach them.

Ask: "How would you exploit a $97 paywall?" Then walk through each layer you built to block it.

### 2. Zero-build philosophy

No webpack, no Vite, no React. A hash router (`js/router.js`) + vanilla modules loaded as `<script>` tags in order. Why this matters:

- Sub-second cold load (no hydration).
- Hostable on any static server, any CDN.
- No supply-chain risk from 900 npm deps.
- Trivial to debug — stack traces point at real source, no sourcemaps needed.

Trade-off you should acknowledge: no type safety, no component model. Appropriate for a small, scoped product; would migrate to React/Svelte + Vite if the view count tripled.

### 3. Design system

Inline CSS in `index.html` (lines ~35–560). HSL-token based, single hue driver, layered shadows (Linear / Raycast pattern), custom easing curves. No Tailwind. Explicit references listed in the source comments.

Notable details: Space Grotesk @ 600 for headings, 540 weight for body emphasis (Linear's trick), JetBrains Mono for numerics (stats, scores, question numbering). Background is `hsl(220, 22%, 4%)` — not pure black, matching Raycast's `#07080A`.

### 4. Adaptive diagnostic

`js/views/diagnostic.js` — 5 questions, predicts a scaled OAR score with a confidence range, bands the user against real-world cutoffs, and drives conversion. Works offline via static fallbacks so a Supabase outage doesn't kill the top-of-funnel.

The score prediction is in `js/scorecard.js` — item-response theory-inspired, calibrated against the real OAR scoring scale.

### 5. Migration discipline

Ten numbered migrations, each with a header comment explaining *why*. No destructive edits to earlier migrations — the file `007_security_hardening.sql` starts with a literal list of what was wrong and what the fix is. That history is a feature; it's how I'd want to read a teammate's code.

## Likely interview questions and how to answer them

**"Why vanilla JS and not React?"**
- Scope doesn't justify the build system. 15 views, one developer, no team onboarding to amortize.
- Cold-load performance matters for a marketing site with a diagnostic as the top funnel.
- Explicit about the trade: would migrate at ~40 views or when a second developer joined.

**"How do you handle state?"**
- `js/store.js` for transient in-flight state (current quiz, cached profile).
- Supabase as the source of truth for anything persistent.
- No complex cache invalidation because the data surfaces are small.

**"What would you do differently next time?"**
- Extract the inline CSS (39KB in `index.html`) into a `css/` file with CSS layers for better cascade control.
- Ship a TypeScript type-check pass via `tsc --checkJs --noEmit` — even without a build step, JSDoc types would catch most of the bugs I hit.
- Move question data into a CDN-fronted JSON blob for faster reads; Supabase RLS adds ~80ms of auth check per request.

**"Walk me through a user journey from first visit to paid."**
1. Land on `#/` (public, sidebar hidden, full-width hero).
2. Click **Start Diagnostic** → `#/diagnostic` (still public, still no account).
3. 5 questions → results screen with predicted score + conversion CTA.
4. Click **Create Free Account** → `#/signup` (Supabase email/password).
5. Redirected to `#/onboarding` — test date, target score, section priorities.
6. `#/dashboard` shows upgrade prompt (is_paid = false, RLS blocks content).
7. Click **Get Access** → `checkout.js` calls the `create-checkout` Edge Function → Stripe hosted page.
8. Stripe webhook hits `stripe-webhook` Edge Function → flips `is_paid = true` via service role.
9. Return to `#/dashboard` — now unlocked. Sidebar shows Study / Practice / Adaptive / Formulas / Strategies / Tutor.

## Files to read in order (if you have 30 minutes)

1. `README.md` — what the product is.
2. `index.html` (top 150 lines for the design-system tokens, last 150 for shell + scripts + keyboard shortcuts).
3. `js/router.js` — how routing and auth gates work.
4. `js/supabase-init.js` — the UMD var bug comment at the top is a real-world gotcha worth reading.
5. `supabase/migrations/001_schema.sql` — data model.
6. `supabase/migrations/002_rls.sql` — RLS baseline.
7. `supabase/migrations/007_security_hardening.sql` — the privilege-escalation fix. This is the strongest signal in the whole repo.
8. `js/views/diagnostic.js` — public conversion surface.
9. `supabase/functions/stripe-webhook/` — the one path that can legitimately flip `is_paid`.

## What I'd want the recruiter to ask me

- "Walk me through migration 007 and tell me what bug you were fixing."
- "Why doesn't a webhook need RLS policies on `pending_payments`?"
- "How does the diagnostic work if Supabase is down?"
- "Why MathJax v3 and not KaTeX?" (A: CHTML output is faster on slow devices and the `\(...\)` delimiter avoids the `$50` currency collision.)
- "What's the biggest thing you'd refactor?"

— Benjamin Rodriguez
