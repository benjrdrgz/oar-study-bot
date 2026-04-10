# OAR Pro Mega Build Session — April 9, 2026
# Duration: ~8+ hours across multiple sessions

## What Was Built

### OAR Pro v1-v3 (Static Site — GitHub Pages)
- **OAR Cram Sheet** — Visual formula reference with embedded images
- **OAR Eval** — 28-concept self-assessment with personalized cram output
- **OAR Pro v2.0** — 5-page professional platform (dashboard, study, practice, formulas, strategies)
- **180 practice questions** (up from 67 original)
- **21 lessons** (up from 12) with 5 new Mometrix-sourced topics
- **MathJax rendering** on all content pages
- **Learning science features** (brain dump, anxiety reappraisal, study timer, sleep reminder)
- **Mometrix strategy integration** (5 Secret Keys, Q&A strategies, anxiety guide)
- **Lecture-style lesson rewrites** (Arithmetic, Newton's Laws, Levers)
- **Landing page + Stripe paywall** (localStorage-based MVP)

### Mometrix Scrape — 100% COMPLETE
- ALL 20 math lessons scraped
- ALL 13 mechanical lessons scraped
- ALL 6 reading lessons scraped
- ALL 5 practice tests (428 questions)
- ALL strategy content (5 Secret Keys + 3 strategies + test anxiety + math anxiety)
- ALL study guide pages (Where/How to Study, Scheduling, Reading Methods, Notes, Health, Exam Day)

### OAR Pro v4 (Supabase + SPA — Vercel)
- **Supabase project**: ugblwepfptumffzcljot
- **12 database tables** with RLS policies
- **Content seeded**: 20 lessons + 170 questions in Supabase
- **Stripe product**: OAR Pro — Lifetime Access ($29) — prod_UJ7pELO8b5eset
- **Stripe payment link**: https://buy.stripe.com/00waEY7Ad3mZ1Fk8Lc3oA00
- **SPA shell** with hash-based router, auth guards, persistent nav/sidebar
- **13 view files** (9,090 lines total):
  - landing.js, dashboard.js, onboarding.js, study.js, practice.js
  - adaptive.js (CAT simulation), formulas.js, strategies.js
  - tutor.js (worked problems), profile.js
  - admin/sales.js, admin/affiliates.js, admin/preview.js
- **Deployed to Vercel**: https://oar-pro-v4.vercel.app

### Research Reports Saved
- PhD-level learning science (spaced repetition, active recall, interleaving)
- External OAR sources + competitor analysis
- Mometrix scraped content index

## Current Bug — BLOCKING
**Supabase client not initializing on Vercel.**
Error: `Cannot read properties of undefined (reading 'signUp')`
Root cause: The Supabase JS CDN UMD build exposes the client differently than expected. `window.supabase.createClient` may need to be `window.supabase.createClient` or the CDN URL may need a specific version pin.

**Fix needed in next session:**
1. Check browser console on https://oar-pro-v4.vercel.app to see exact error
2. The CDN link is: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js`
3. The UMD build may expose as `window.supabase` (an object with `createClient`) or differently
4. Fix in `oar-pro-v4/js/supabase-init.js` line 6
5. Redeploy: `cd oar-pro-v4 && vercel --prod --yes`

## Supabase Auth Setup Still Needed
1. Set Site URL to `https://oar-pro-v4.vercel.app` in Auth → URL Configuration
2. Add redirect URL: `https://oar-pro-v4.vercel.app/**`
3. Enable email provider, disable email confirmation for MVP
4. Run admin RLS SQL (see plan file)
5. After signup with ben@rodriguezwi.com: `UPDATE profiles SET account_type = 'admin', is_paid = true WHERE email = 'ben@rodriguezwi.com';`

## Credentials (in .env, gitignored)
- Supabase URL: https://ugblwepfptumffzcljot.supabase.co
- Supabase Anon Key: eyJhbG...OOOF38 (real JWT)
- Supabase Service Role: eyJhbG...n-qE
- Stripe Secret: sk_live_51TJxkk...50Y21y (in Website Agency .env)
- Stripe Publishable: pk_live_51TJxkk...GOi9

## Files Modified This Session
- /OAR Study Bot/oar-pro-v4/ (entire v4 directory — 22 files, 9,090+ lines)
- /OAR Study Bot/study.html (lecture rewrites, MathJax fixes, new CSS)
- /OAR Study Bot/practice.html (MathJax fix, 35 new questions)
- /OAR Study Bot/formulas.html (duplicate fix, MathJax everywhere, examples converted)
- /OAR Study Bot/strategies.html (Mometrix 5 Keys, Q&A strategies, anxiety)
- /OAR Study Bot/index.html (landing page for v3)
- /OAR Study Bot/app.html (dashboard moved from index)
- /OAR Study Bot/Reports/ (research reports, scrape progress)

## Plan File
Full architecture plan at: ~/.claude/plans/synthetic-herding-hinton.md

— Benjamin Rodriguez
