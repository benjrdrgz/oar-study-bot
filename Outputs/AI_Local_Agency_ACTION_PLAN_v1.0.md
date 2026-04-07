# AI Local Website Agency — ACTION PLAN v1.0

**v1.0 — Complete rebuild from master blueprint. Automation-first, lean-budget, week-by-week execution.**

— Benjamin Rodriguez

---

## EXECUTIVE SUMMARY

Your original blueprint is a solid vision doc. But it reads like a business plan, not a battle plan. Here's what's different about this version: every section has a specific tool, a cost, a timeline, and a "do this now" action. No theory — just execution.

**The core insight your blueprint missed:** Don't wait for leads to say yes before building their site. Build it first. Email them a link. The ones who click are pre-sold. This flips the entire sales funnel upside down and is the single biggest leverage point in this business.

**Total new monthly spend:** ~$67-107/mo on top of your existing $250 (Claude + Lovable)
**Time to first outreach:** 7 days
**Time to first revenue:** 14-30 days

---

## PART 1: WHAT'S WRONG WITH THE ORIGINAL BLUEPRINT

Before the new plan, here's what needs to change and why.

**Problem 1: Too many custom systems.**
Your blueprint describes building custom dashboards, custom scoring systems, custom lead databases. That's months of work before you make a dollar. You don't need custom anything at day zero. You need Google Sheets, a free CRM, and speed.

**Problem 2: Google Places API is expensive and slow.**
The blueprint says "use Google Places API" for lead discovery. That API costs $17 per 1,000 requests for place details. At scale, you're burning hundreds of dollars just finding leads. There are tools that do this for $3-4 per 1,000 records with more data.

**Problem 3: The scoring system is premature.**
A 0-100 weighted scoring system with 8 signals is overengineering for day zero. The only score that matters right now: does this business have a website? Yes or no. If no, they're a lead. If yes but it's terrible, they're a lead. Everything else is noise until you have 10 paying clients.

**Problem 4: No specific outreach infrastructure.**
The blueprint says "Claude generates personalized emails" but doesn't address deliverability, warm-up, sending limits, or follow-up sequences. Cold email is 80% infrastructure and 20% copy. Without proper setup, your emails land in spam and the whole system fails.

**Problem 5: Revenue model is too cheap.**
$500 for a starter website is leaving money on the table. The market research shows AI agencies charging $1,500-5,000+ for managed services. Local businesses don't buy "websites" — they buy "more customers." Price accordingly.

**Problem 6: No mention of hosting economics.**
If you're hosting sites on Netlify/Vercel free tiers, your margin on the $100/mo maintenance is nearly 100%. But the blueprint suggests traditional hosting without specifying where. This is a huge cost lever.

---

## PART 2: THE REBUILT SYSTEM

### Architecture: Three Machines

Instead of two pipelines, think of three machines that feed each other:

**Machine 1: The Lead Factory** — Finds businesses, filters for no/bad website, outputs a clean list with contact info.

**Machine 2: The Site Factory** — Takes a business name + niche + location, outputs a live demo site in under 30 minutes.

**Machine 3: The Sales Factory** — Sends personalized outreach with the demo site link, handles follow-ups, routes warm replies to you for closing.

Each machine runs independently. You can crank one without waiting for the others. But when all three are running together, you have a fully automated pipeline from "stranger" to "paying client."

---

## PART 3: MACHINE 1 — THE LEAD FACTORY

### What it does
Finds local businesses without websites (or with terrible ones), captures their contact info, and loads them into your outreach queue.

### The tool stack

**Primary: Outscraper Google Maps Scraper**
Cost: Free for first 500 records, then $0.003/record
Why: Pulls business name, phone, address, website URL, rating, reviews, category — everything you need. You can filter for businesses with no website URL directly.
URL: outscraper.com

**Backup: Apify Google Maps Scraper**
Cost: $5/mo free credits (gets you ~1,250 businesses)
Why: More flexible, lets you run custom filters, stores results in datasets you can re-query.

**Lead storage: Google Sheets (free) → upgrade to Airtable ($0) or Notion ($0) when needed**
Why: Zero cost, Claude can read/write to it, you can share it, it's good enough for the first 1,000 leads.

### The process (do this weekly)

Step 1: Pick a niche + city combo (e.g., "plumbers in Milwaukee" or "barbers in Austin").

Step 2: Run Outscraper with these filters: category = your niche, location = your city, has no website OR website returns 404/error.

Step 3: Export to Google Sheets. Columns: Business Name, Phone, Address, City, State, ZIP, Website (or "NONE"), Category, Google Rating, Review Count.

Step 4: Quick manual scan — remove duplicates, remove chains/franchises (they won't buy from you), remove any business that already has a decent site.

Step 5: Tag each lead as "No Website" or "Bad Website" — that's your only scoring system for now.

Step 6: Move qualified leads to the "Ready for Site Build" sheet.

### Volume targets
Week 1: 100 leads (one niche, one city — proof of concept)
Week 2-4: 200 leads/week (expand to 2-3 niches, same city)
Month 2+: 500 leads/week (multiple cities)

### Cost at scale
1,000 leads/month = ~$3 with Outscraper (after free tier)
5,000 leads/month = ~$15

### Outside-the-box move: The "No Website" Google Search Hack
Before you spend a dollar on Outscraper, try this free method:
1. Go to Google Maps
2. Search "plumbers in [city]"
3. Look at results — businesses without a "Website" button are your leads
4. Copy their info manually for the first 20-30 to test the system

This costs $0 and gets you enough leads to validate the entire business model in one afternoon.

---

## PART 4: MACHINE 2 — THE SITE FACTORY

### What it does
Takes a lead's business info and produces a live, professional demo website in under 30 minutes.

### The tool stack

**Primary builder: Lovable.dev ($50/mo — you already have this)**
Why: AI-generated full websites from a prompt. You describe the business, it builds the site. With good prompts and templates, you can produce a complete 5-page local business site in 15-20 minutes.

**Hosting: Netlify (free tier)**
Why: Unlimited sites on free tier. 100GB bandwidth/month. SSL included. Custom subdomains. Deploy from GitHub in one click. Your demo sites cost you literally $0 to host.

**Domain strategy: One domain + unlimited subdomains**
Buy one domain like "localpreview.site" or "youragency.com" (~$10/year on Namecheap or Porkbun).
Demo sites live at: joes-plumbing.localpreview.site, marias-salon.localpreview.site
Cost per demo site: $0

### The template system (this is where speed comes from)

Don't build every site from scratch. Build 5 master templates, then customize.

**Priority niche templates (build these first):**
1. Home Services (plumbers, electricians, HVAC, roofers, cleaners)
2. Personal Services (barbers, salons, spas, tattoo shops)
3. Food & Drink (restaurants, cafes, food trucks, catering)
4. Health & Wellness (dentists, chiropractors, gyms, yoga studios)
5. Auto (repair shops, detailing, body shops)

**What each template includes:**
- Hero section with business name, tagline, and call-to-action
- Services section (3-6 services with icons)
- About section with placeholder text
- Reviews/testimonials section (pull from their actual Google reviews)
- Contact section with phone, address, embedded Google Map
- Mobile-responsive design
- Fast load time (static site, no database)

**The customization workflow (15-20 minutes per site):**
1. Clone the niche template in Lovable
2. Swap in: business name, phone number, address, services, Google reviews
3. Pick a color scheme that matches their industry (blue for plumbers, red for restaurants, etc.)
4. Generate the site
5. Deploy to Netlify under their subdomain
6. Verify it loads and looks good
7. Add to the "Ready for Outreach" list

### The prompt template for Lovable (save this)

"Build a professional single-page website for [BUSINESS NAME], a [NICHE] business located in [CITY, STATE]. Phone: [PHONE]. Address: [ADDRESS]. Services offered: [SERVICE 1, SERVICE 2, SERVICE 3]. Include a hero section with a strong CTA to call, a services section with icons, a reviews section with these real Google reviews: [REVIEW 1, REVIEW 2], a contact section with embedded map, and a footer. Use a [COLOR SCHEME] color palette. Modern, clean, mobile-first design. Include a sticky header with phone number."

### Volume targets
Week 1: Build 5 master templates (one per niche)
Week 2: Build 10 demo sites (2 per niche) — takes ~3 hours total
Week 3+: Build 20-30 demo sites/week as leads come in

### Outside-the-box move: Batch-build with Claude
Instead of building one site at a time in Lovable, use Claude to generate the HTML/CSS/JS for simple landing pages. I can produce a complete, deployable local business website in a single prompt. You push it to Netlify via GitHub. Time per site drops to 5-10 minutes. This is how you go from 20 sites/week to 100 sites/week.

---

## PART 5: MACHINE 3 — THE SALES FACTORY

### What it does
Sends personalized cold emails to leads with their demo site link, follows up automatically, and routes warm replies to you for closing.

### The tool stack

**Primary: Instantly.ai ($37/mo — Growth plan)**
Why: Purpose-built for cold email. Includes email warm-up (critical for deliverability), automated follow-up sequences, reply detection, and a basic CRM. This is the single most important paid tool in the stack.

**Email accounts: Google Workspace ($7/mo per account)**
You need 2-3 sending accounts to stay under daily limits. Buy 2 domains (~$20/year total) and set up Google Workspace on each. This gives you 2-3 email addresses that look professional (ben@yourwebagency.com, hello@localwebsolutions.com).

**Alternative if budget is ultra-tight: Smartlead.ai ($39/mo)**
Similar to Instantly but slightly different feature set. Pick one, not both.

### Email infrastructure setup (do this BEFORE sending anything)

This is the part most people skip and then wonder why their emails go to spam.

1. Buy 2 domains (not your main agency domain — you don't want that blacklisted). Examples: "localwebsolutions.com" and "webpresencepro.com". Cost: ~$20/year total.

2. Set up Google Workspace on each ($7/mo each = $14/mo).

3. Configure SPF, DKIM, and DMARC records on both domains. Claude can walk you through this in 10 minutes.

4. Connect both accounts to Instantly.ai.

5. Enable email warm-up in Instantly. Let it run for 14 days before sending any campaigns. This builds sender reputation so your emails actually reach inboxes.

6. While warm-up is running, build your templates and demo sites.

### The outreach sequence (5 emails over 14 days)

**Email 1 (Day 0) — The Hook**
Subject: I built [BUSINESS NAME] a website
Body (under 75 words):
"Hi [NAME/there], I noticed [BUSINESS NAME] doesn't have a website yet — so I went ahead and built one for you. Here's the preview: [DEMO SITE LINK]. If you like it, I can take it live with your own domain in 24 hours. No pressure — just thought you'd want to see it. — Benjamin Rodriguez"

**Email 2 (Day 3) — The Nudge**
Subject: Re: I built [BUSINESS NAME] a website
Body: "Just checking if you had a chance to look at the preview I sent. Here's the link again: [LINK]. Happy to hop on a quick call if you have questions."

**Email 3 (Day 7) — The Value Add**
Subject: Quick thought about [BUSINESS NAME]
Body: "I was looking at your Google reviews — you have [X] great reviews but no website for people to find you through Google search. That means you're invisible to anyone who doesn't already know your name. The preview I built would fix that: [LINK]. Takes 24 hours to go live."

**Email 4 (Day 10) — Social Proof**
Subject: Other [NICHE] businesses in [CITY] are going live
Body: "Wanted to let you know I've been helping other [NICHE] businesses in [CITY] get online this month. Your preview is still ready if you want it: [LINK]. Most clients go live within a day of saying yes."

**Email 5 (Day 14) — The Breakup**
Subject: Should I take down your preview?
Body: "I'm going to remove the preview site I built for [BUSINESS NAME] at the end of this week to free up the slot for another business. If you'd like to keep it, just reply and we'll get it live. Either way, no hard feelings. — Benjamin"

### Volume and conversion math
Send 100 outreach sequences/week.
Industry average cold email reply rate (personalized + demo): 8-15%.
That's 8-15 warm replies/week.
Close rate on warm replies (they've already seen the site): 20-30%.
That's 2-5 new clients/week.
At $1,000 setup + $150/mo each = $2,000-5,000 setup revenue + $300-750 MRR added per week.

### Outside-the-box move: The "Breakup Email" is your secret weapon
Email 5 uses loss aversion — the fear of losing something they already "have." This consistently outperforms all other emails in the sequence. Some agencies report 40%+ of their closes come from the breakup email alone.

---

## PART 6: REVISED PRICING MODEL

Your original pricing is too low. Here's the adjusted model based on market research.

### Tier 1: Quick Start — $997 setup + $149/mo
What they get: Professional 5-page website, mobile-optimized, hosted and maintained, basic SEO, SSL certificate, one round of revisions.
Your cost to deliver: ~30 minutes of work + $0 hosting = nearly 100% margin.
Who buys this: Businesses with zero web presence who just want to exist online.

### Tier 2: Growth — $1,997 setup + $249/mo
What they get: Everything in Quick Start, plus Google Business Profile optimization, 3 directory listings, monthly content update, basic analytics dashboard.
Your cost to deliver: ~1 hour of work + $0-10/mo tools.
Who buys this: Businesses who understand they need visibility, not just a website.

### Tier 3: Dominate — $3,497 setup + $397/mo
What they get: Everything in Growth, plus full local SEO package, review management automation, monthly performance report, priority support, social media profile setup.
Your cost to deliver: ~2 hours of work + $20-30/mo tools.
Who buys this: Businesses in competitive niches who want to own their local market.

### Add-ons
Business email hosting (Google Workspace resale): $49 setup + $29/mo (your cost: $7/mo = $22/mo profit each)
Domain registration and management: $99/year (your cost: $10-15/year)
Additional pages: $197 per page
Website ownership transfer: $497 (when a client wants to leave with their site)

### Why this pricing works
Local businesses don't comparison-shop web agencies the way tech people do. They see "I need a website," you show them one that already exists with their name on it, and $997 feels like a steal compared to the $5,000-15,000 quotes they've gotten from traditional agencies. You're not competing on price — you're competing on speed and proof.

---

## PART 7: THE COMPLETE TOOL STACK + MONTHLY COST

| Tool | Purpose | Monthly Cost |
|------|---------|-------------|
| Claude (Max) | AI orchestration, content, automation | $200 (existing) |
| Lovable.dev (Pro) | Website builder | $50 (existing) |
| Instantly.ai (Growth) | Cold email + warm-up + CRM | $37 |
| Google Workspace x2 | Sending email accounts | $14 |
| Outscraper | Lead scraping | ~$3-15 (usage-based) |
| Netlify | Demo site hosting | $0 (free tier) |
| Namecheap | Domains (2 outreach + 1 preview) | ~$3/mo (~$36/yr) |
| Google Sheets | Lead database + tracking | $0 |
| **TOTAL** | | **~$307-319/mo** |

When you hit 10 clients at Tier 1 ($149/mo each), your MRR is $1,490/mo. That covers your entire tool stack 4-5x over, plus the setup fees are pure profit.

### Tools you DON'T need yet (save for Month 3+)
- GoHighLevel ($97/mo) — only when you have 15+ clients and need CRM/SMS/invoicing in one place
- Custom dashboards — Google Sheets is your dashboard for now
- Social media automation — future revenue stream, not day-zero priority
- D7 Lead Finder — Outscraper does enough for now
- Paid hosting (Hostinger) — Netlify free tier handles everything

---

## PART 8: WEEK-BY-WEEK EXECUTION PLAN

### WEEK 1: Foundation (Days 1-7)

**Day 1-2: Domain + Email Setup**
- [ ] Buy 2 outreach domains ($10 each on Namecheap/Porkbun)
- [ ] Buy 1 preview domain for demo sites ($10)
- [ ] Set up Google Workspace on both outreach domains ($7/mo each)
- [ ] Configure SPF, DKIM, DMARC on all domains
- [ ] Sign up for Instantly.ai Growth ($37/mo)
- [ ] Connect email accounts to Instantly + start warm-up (runs 14 days)

**Day 2-3: Lead Factory Setup**
- [ ] Create Outscraper account (free)
- [ ] Run first scrape: pick your #1 niche + your home city
- [ ] Export 100 leads to Google Sheets
- [ ] Create the master lead tracking sheet (columns: Business Name, Phone, Address, City, State, ZIP, Website Status, Niche, Google Rating, Review Count, Lead Status, Demo Site URL, Outreach Status, Notes)

**Day 3-5: Site Factory Setup**
- [ ] Build Master Template #1 in Lovable (Home Services)
- [ ] Build Master Template #2 in Lovable (Personal Services)
- [ ] Set up Netlify account + connect GitHub
- [ ] Deploy first test site to confirm the subdomain workflow works
- [ ] Document your Lovable prompt template (save in Templates folder)

**Day 5-7: Build First Batch of Demo Sites**
- [ ] Pick top 10 leads from your sheet
- [ ] Build demo sites for all 10 (target: 20-30 min each)
- [ ] Deploy all 10 to Netlify under your preview domain
- [ ] Update Google Sheet with demo site URLs

### WEEK 2: Templates + Warm-up (Days 8-14)

Email warm-up is still running — DO NOT send campaigns yet.

- [ ] Build Master Template #3 (Food & Drink)
- [ ] Build Master Template #4 (Health & Wellness)
- [ ] Build Master Template #5 (Auto)
- [ ] Scrape 200 more leads across 2-3 niches
- [ ] Build 15-20 more demo sites
- [ ] Write all 5 email templates in Instantly
- [ ] Set up the automated follow-up sequence (Day 0, 3, 7, 10, 14)
- [ ] Practice your sales call script (what to say when they reply "yes")
- [ ] Set up a simple invoicing method (Stripe link, PayPal, or Wave — all free)

### WEEK 3: Launch Outreach (Days 15-21)

Warm-up complete. Time to send.

- [ ] Load first 50 leads + demo site links into Instantly campaign
- [ ] Launch Campaign 1 (50 leads)
- [ ] Monitor deliverability (open rates should be 40%+, if not, troubleshoot)
- [ ] Respond to any replies within 2 hours (speed = close rate)
- [ ] Scrape 200 more leads
- [ ] Build 15-20 more demo sites
- [ ] Launch Campaign 2 (50 more leads)

### WEEK 4: Optimize + Scale (Days 22-30)

- [ ] Review Campaign 1 metrics: open rate, reply rate, click rate
- [ ] A/B test subject lines on Campaign 2
- [ ] Close your first 1-3 clients
- [ ] Deliver: connect their domain, go live, set up hosting
- [ ] Send first invoices (setup fee + first month)
- [ ] Scrape 300 more leads (expand to new city or niche)
- [ ] Build 20-30 more demo sites
- [ ] Launch Campaign 3 + 4 (100 leads each)

### MONTH 2: Scale the Machine

Target: 200 outreach emails/week, 5-10 demo sites/day, 3-5 new clients/week.

- [ ] Systematize: create a daily 2-hour routine (30 min scraping, 60 min building sites, 30 min managing outreach)
- [ ] Build remaining niche templates (contractors, med spas, cleaning services)
- [ ] Expand to 3-5 cities
- [ ] Consider hiring a VA for lead scraping + data entry ($3-5/hr on OnlineJobs.ph)
- [ ] Start tracking: Customer Acquisition Cost, Lifetime Value, Churn Rate

### MONTH 3: Add Revenue Streams

- [ ] Launch Tier 2 (Growth) upsell to existing clients
- [ ] Add Google Business Profile optimization service
- [ ] Add business email hosting (Google Workspace resale)
- [ ] Evaluate GoHighLevel ($97/mo) for client CRM + SMS follow-up
- [ ] Begin building the Visibility Score system from your original blueprint
- [ ] Start planning social media automation add-on

---

## PART 9: AUTOMATION OPPORTUNITIES (WHAT CLAUDE CAN DO FOR YOU)

Here's what I can automate for you in future sessions — each of these is a buildable project:

1. **Lead scraping script** — Python script that calls Outscraper API, filters results, and appends to your Google Sheet automatically. Run it once a week with one command.

2. **Site generation prompts** — A library of niche-specific Lovable prompts that you just fill in the blanks. Copy, paste, generate, deploy.

3. **Email personalization engine** — Feed me a CSV of leads, I generate all 5 emails per lead with their business name, niche, city, review quotes, and demo site URL pre-filled. Export to Instantly-ready format.

4. **Client onboarding automation** — When someone says "yes," I generate: welcome email, domain purchase checklist, DNS setup guide, and invoicing template. One command.

5. **Weekly reporting** — I pull your Instantly campaign stats + Google Sheets data and produce a one-page weekly report: leads scraped, sites built, emails sent, replies received, clients closed, revenue this week.

6. **Review scraper** — Pull a business's Google reviews automatically to include in their demo site. Makes the site feel tailor-made.

---

## PART 10: BETTER WAY? SECTION

As required by your operating rules — here's what I'd do differently from what you originally asked:

**Skip the dashboard entirely for now.** Your blueprint describes an elaborate lead acquisition dashboard with geographic coverage, ZIP code status labels, and nested navigation. That's a Month 6 project. For Month 1-3, your "dashboard" is a Google Sheet with conditional formatting. It does 95% of what you need at 0% of the cost.

**Consider the "reverse agency" model.** Instead of selling websites, sell "local digital presence" as a subscription. The client pays $297/mo, you handle everything — website, Google Business Profile, directory listings, review management. No big setup fee to scare them off, you get recurring revenue immediately, and the LTV per client is higher. Some agencies using this model hit $50K MRR within 6 months.

**Use Claude (me) as your sales copilot.** Before every call with a warm lead, run the business through me. I'll research them, pull their Google reviews, check their competitors, and give you a 1-minute briefing with talking points. This makes you sound like you've been studying their business for a week when you actually spent 30 seconds.

**Build a referral engine early.** Offer existing clients $100 off their monthly bill for every referral that signs up. Local business owners know other local business owners. One good referral client can bring you 3-5 more without any cold outreach.

---

## SUMMARY

**What I did:** Rebuilt your master blueprint into a week-by-week actionable plan with specific tools, costs, and execution steps. Revised pricing upward based on market research. Designed a three-machine system (Lead Factory → Site Factory → Sales Factory) that can run on ~$307/mo total.

**What to do next:** Start Week 1, Day 1. Buy your domains and set up email infrastructure. The 14-day warm-up period is your bottleneck — everything else can be built while you wait.

**Automation opportunity I spotted:** The entire lead-to-demo-site pipeline can be scripted. Give me a niche + city, and I can output a ready-to-deploy site + personalized email sequence in under 10 minutes. That's the build I'd prioritize for our next session.

— Benjamin Rodriguez
