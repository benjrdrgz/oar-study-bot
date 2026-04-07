# Build vs Buy: AI Local Website Agency Infrastructure Analysis

**v1.0 — Complete analysis of self-hosted, cloud, and SaaS options for every part of the agency stack**

**Date:** 2026-03-25
**Status:** Current as of March 2026
**Author:** Benjamin Rodriguez

---

## EXECUTIVE SUMMARY

Benjamin's AI local website agency currently operates on a lean SaaS stack (~$131/month) optimized for speed, not cost. The analysis below evaluates every component: site generation, email outreach, lead scraping, hosting, CRM, and automation.

**Key Finding:** At current scale (0-50 clients), SaaS is the right choice. The opportunity cost of building infrastructure ($5,000-$10,000 in lost sales hours) exceeds savings by 10x. Self-hosting becomes viable only when volume justifies the engineering effort.

---

## SECTION 1: WEBSITE GENERATION INFRASTRUCTURE

### Option A: SaaS (Current — Lovable AI)

**Cost:** $50/month (Business plan)

**What's Included:**
- 100-10,000 credits/month depending on tier
- Cloud hosting ($25/month free allowance + usage-based overage)
- Full visual drag-and-drop builder
- AI-powered component generation
- Template library
- Unlimited collaborators

**Pros:**
- Fast iteration (build sites in hours, not days)
- No maintenance overhead
- Professional quality guaranteed
- Handles hosting automatically
- Scales to any traffic level

**Cons:**
- Monthly recurring cost ($50/mo = $600/year)
- Vendor dependency (price increases, feature changes)
- Limited customization beyond what UI allows
- Each site consumes credits (complex sites cost more)

**At Current Scale:**
- 1 site/week generation = ~2,600 credits/month
- Business plan (10,000 credits) is overkill; could use Pro ($25) but sites would be constrained
- Cost per site: ~$5-10 depending on complexity

---

### Option B: Claude API for HTML Site Generation

**Feasibility:** HIGH | **Setup Time:** 2-4 hours | **Quality:** 7/10

**Current API Pricing** ([source](https://platform.claude.com/docs/en/about-claude/pricing)):
- Haiku 3: $0.25/$1.25 per million tokens (input/output)
- Sonnet 4.5: $3/$15 per million tokens
- Opus 4.5: $5/$25 per million tokens

**Batch Processing Discount:** 50% off all models (Sonnet drops to $1.50/$7.50 per MTok)

**Calculation: Cost Per Site via Claude API**

Assumptions:
- Prompt: 2,000 tokens (describe site, constraints, branding)
- Response: 8,000 tokens (HTML, CSS, JS for full landing page)
- Model: Sonnet 4.5 (best price/quality ratio)

**Cost per site:**
```
(2,000 input × $0.003) + (8,000 output × $0.015) = $6 + $120 = $126/site
```

**With batch processing (50% discount):**
```
($6 + $120) × 0.5 = $63/site
```

**Benjamin's Question: Can I use Claude Max ($200/mo) API?**

No. Claude Max ($200/month subscription) does NOT include API credits. The API charges separately per token, regardless of subscription. However:
- If running batch jobs at scale (50+ sites/month), batch API becomes cheaper
- $63/site × 50 sites = $3,150/month
- Still more expensive than Lovable at current volume

**Viable When:**
- If you had 200+ site generations/month (batch processing efficiency)
- Or if you needed custom HTML that Lovable can't produce
- Or if you wanted to own the generation code completely

**Verdict:** Not worth it at current scale. Lovable is 6x cheaper and way faster.

---

### Option C: Self-Hosted Open Source AI (Llama 3.2, Mistral)

**Feasibility:** MEDIUM | **Setup Time:** 20-40 hours | **Quality:** 6/10

**Hardware Options:**

1. **Local on Benjamin's Mac:**
   - Llama 3.2 1B: Fits on any Mac (15GB RAM)
   - Llama 3.2 8B: Needs M3+ with 16GB+ RAM
   - Speed: Slow (1 site = 10-15 minutes)
   - Zero additional cost
   - Limited by single machine

2. **Cloud GPU (RunPod, Lambda Labs, Vast.ai):**
   - RTX 4090: ~$0.40-0.60/hour
   - 1 site generation: 5 minutes
   - Cost per site: $0.04-0.06 compute + electricity
   - + $4-5/month baseline server cost
   - **Total: ~$5/site + $5/month**

**Quality Trade-offs:**
- Llama 3.2 generates functional HTML but not beautiful
- No built-in design sense (no spacing, no color harmony)
- Requires human review/refinement: 30-45 mins per site
- Output quality: 6/10 vs Lovable's 9/10

**True Cost:**
- Setup: 40 hours = $10,000 (at $250/hour opportunity cost)
- Per site: $5 compute + 0.5 hours refinement ($125) = $130/site
- Total: $10,000 + $130/site

**Viable When:**
- 100+ sites/month (compute costs become predictable)
- You want complete control over generation logic
- You have unique design requirements that Lovable can't handle

**Verdict:** Not viable for Benjamin at current scale. Setup cost kills ROI.

---

### Option D: Template Engine (No AI Needed)

**Feasibility:** DONE | **Setup Time:** 0 hours | **Quality:** 5/10

**What Benjamin Already Has:**
- `site_generator_v1.0.py` (exists in Scripts folder)
- Swap placeholders in HTML templates
- Generate 50+ variations from single template

**Cost:** $0 + free hosting

**Speed:** 2-3 minutes per site

**Quality:** 5/10 (templated look, obvious repetition)

**Pros:**
- Zero cost
- Unlimited sites
- Fast (minutes, not hours)
- Good for low-touch clients

**Cons:**
- All sites look similar
- Doesn't scale to multiple niches
- Clients notice they're "templated"
- Reduces perceived value

**Use Case:** Perfect for volume + low-price clients. Terrible for premium positioning.

---

## SECTION 2: EMAIL OUTREACH INFRASTRUCTURE

### Option A: SaaS (Current — Instantly.ai)

**Cost:** $37/month (Growth plan) + ~$75/month hidden costs

**Breakdown:**
- Base plan: $37/month (5,000 emails/month, unlimited warmup)
- Recommended setup: 3-5 email domains: $15/year per domain = ~$45/year
- Mailboxes for each domain: $5/month per mailbox × 3 = $15/month
- SuperSearch credits (optional): $9-50/month for lead enrichment
- **Total realistic cost: $85-120/month**

**What's Included:**
- Unlimited email warmup (critical for deliverability)
- Automated follow-ups and sequences
- A/B testing
- Basic analytics and reply tracking
- LinkedIn integration

**Pros:**
- Industry-leading warmup (essential for cold email)
- Handles deliverability complexity
- Built-in CRM + lead capture
- No technical setup required
- White-glove domain management

**Cons:**
- Recurring cost ($1,000+/year)
- Vendor dependency
- Email volume caps (upgrade to Hypergrowth $97 for 15,000/month)
- Learning curve (Instantly has quirks)

**At Current Scale:**
- 10-15 emails/day = 300-450/month
- Growth plan provides 5,000/month (overkill)
- Cost per email sent: ~$0.02
- **ROI:** 1 reply = ~$50 value (worth it)

---

### Option B: Self-Hosted Email (Mautic + Amazon SES)

**Feasibility:** MEDIUM-HIGH | **Setup Time:** 40-60 hours | **Cost:** $5-50/month

**Infrastructure:**

1. **Mautic (Open Source Marketing Automation)**
   - **Cost:** Free software
   - **Hosting:** $4-20/month on DigitalOcean/Hetzner
   - **Setup:** 20-30 hours (database, backups, security)
   - **Features:** Email campaigns, lead scoring, automation, CRM

2. **Amazon SES (Email Sending)**
   - **Cost:** $0.10 per 1,000 emails
   - **Free tier:** 62,000 emails/month for first 12 months
   - **After:** ~$6/month for 60,000 emails
   - **Caveat:** Charges per RECIPIENT, not per message
   - **Real math:** 10,000 emails to 100 contacts = $0.10

3. **Email Warmup (Manual or Tool)**
   - **Problem:** SES has poor sender reputation unless warmed properly
   - **Solution:** Lemwarm, Mail Warmup, or Instantly ($37)
   - **Cost:** $20-40/month for warmup
   - **Complexity:** High (domain reputation takes weeks to build)

**True Cost:**
```
Hosting: $10/month
Mautic setup/maintenance: ~$50/month (opportunity cost)
SES: $6/month
Warmup tool: $30/month
—————————————————
TOTAL: $96/month + 40-hour setup
```

**Quality Trade-offs:**
- Deliverability: 7/10 (need perfect domain hygiene)
- Reply handling: 6/10 (no native threading like Instantly)
- Automation: 8/10 (Mautic is powerful)
- Setup complexity: 8/10 (many failure points)

**Viable When:**
- Sending 100,000+ emails/month (SES cost becomes negligible)
- You want full control over automation logic
- You have time for troubleshooting

**Verdict:** For Benjamin, Instantly.ai wins. The $37/month saves $60/month in setup/maintenance costs + eliminates deliverability risk.

---

### Option C: Amazon SES + Custom Python Scripts

**Feasibility:** MEDIUM | **Setup Time:** 8-12 hours | **Cost:** $6-50/month

**Stack:**
- Python script using boto3 (AWS SDK)
- SES for sending ($0.10/1,000 emails)
- Lambda for scheduling (free tier or $1-5/month)
- DynamoDB for tracking opens/clicks (manual parsing of SES bounce events)

**Cost:**
- SES: ~$6/month (at 60,000 emails/month)
- Lambda/DynamoDB: ~$1-5/month
- Warmup tool: $30/month (still need this)
- Development: 10 hours = $2,500 opportunity cost

**Advantages:**
- Owns the code
- Can build custom logic
- Cheap at scale

**Disadvantages:**
- No UI for campaign management (Python-only)
- Reply handling is manual
- Warmup is still needed (SES cold start)
- No automation features
- Troubleshooting is 100% on Benjamin

**Viable When:**
- Only if Benjamin wants to learn AWS + Python email handling
- And doesn't mind manual campaign management

**Verdict:** Not worth it. Instantly abstracts away the hard parts (warmup, deliverability, reply tracking).

---

## SECTION 3: LEAD GENERATION INFRASTRUCTURE

### Option A: SaaS (Current — Outscraper)

**Cost:** ~$15/month for typical usage

**Pricing Model:**
- Free tier: 500 business records/month
- Pay-as-you-go: $3 per 1,000 after free tier
- After 100k records/month: $1 per 1,000 records
- Enrichment (emails, phone): Additional $1-3 per field

**What's Included:**
- Google Maps scraping
- Business details (name, phone, address, website, rating)
- Optional: emails, social links, LinkedIn

**At Current Scale:**
- Scraping 50-100 leads/month = Free (under 500/month)
- Enrichment (emails for some leads): $10/month
- **Total: ~$10-15/month**

**Pros:**
- Dead simple (web UI, no coding)
- Fast (results in hours)
- Accurate data
- No warm-up needed

**Cons:**
- Google probably violates ToS (legal risk is low but exists)
- Price per lead increases with volume
- Relies on Google Maps data (sometimes outdated)

**Viable at 100+ leads/month:** Yes ($30-50 cost stays reasonable)

---

### Option B: Google Maps API Direct

**Feasibility:** MEDIUM | **Setup Time:** 4-6 hours | **Cost:** $50-200/month

**How It Works:**
- Use Google Maps Platform API directly
- Search for businesses in area + niche
- Scrape results and details
- Extract contact info from websites

**Cost Structure:**
- Google Maps API: ~$0.017 per request (first 25,000 requests/month ~$425, then cheaper)
- Actually very expensive
- Each business = 1-2 API calls

**Calculation:**
- 100 leads/month = 100-200 API calls = ~$3.40/month (if under limit)
- But need monitoring, error handling, retry logic
- Real cost with infrastructure: $50-100/month

**Complications:**
- Setup Python script with API auth
- Handle rate limiting
- Store results in database
- Missing emails (API doesn't provide them)
- Need to scrape websites separately to get emails

**Verdict:** Overkill for Benjamin. Outscraper handles it cheaper + faster.

---

### Option C: Self-Built Web Scraper (Selenium/BeautifulSoup)

**Feasibility:** HIGH (if comfortable with Python) | **Setup Time:** 16-20 hours | **Cost:** $5-30/month

**Stack:**
- Python + Selenium (browser automation)
- Or Playwright (faster)
- Or BeautifulSoup (if just parsing HTML)
- Puppeteer/headless Chrome for JavaScript-heavy pages

**Cost:**
- Hosting (run script hourly): $5-10/month on DigitalOcean
- Proxy service (rotate IPs): $15-30/month (Google throttles otherwise)
- Development: 20 hours = $5,000 opportunity cost

**Quality Issues:**
- Google actively blocks scrapers
- Captchas block headless browsers
- Need proxy rotation + delays
- IP bans are common
- Maintenance overhead high

**Scraping Google Maps Directly:**
- Very risky (violates ToS badly)
- Google blocks at scale
- Requires advanced techniques (residential proxies, random delays)
- Cost spirals to $100+/month in proxies

**Email Extraction:**
- Get website from Google Maps
- Scrape website for contact page
- Regex extract email addresses
- Or use Hunter.io API for enrichment ($20-50/month)

**True Cost:**
```
Setup: 20 hours = $5,000
Hosting: $10/month
Proxies: $30/month
Maintenance: ~$50/month (ongoing support)
Email enrichment (Hunter): $30/month
———————————————————————————
TOTAL: $5,000 + $120/month
```

**Viable When:**
- Benjamin wants to learn Python
- And needs 1,000+ leads/month (DIY tools only beat SaaS at massive scale)
- And legal risk doesn't concern him

**Verdict:** Outscraper is cheaper + legal + zero maintenance. Stick with it.

---

### Option D: Free/Open Source Tools

**Apollo.io Free Tier:**
- 50 verified contacts/month free
- Requires manual searching
- Limited use case

**Hunter.io Free Tier:**
- 100 searches/month free
- Manual email finding
- Good for verification, not prospecting

**ZoomInfo Free Trial:**
- 30-day free trial only
- Not sustainable

**Verdict:** Outscraper's free tier (500/month) beats all free alternatives.

---

## SECTION 4: HOSTING INFRASTRUCTURE

### Option A: Free Tiers (Netlify/Vercel/Cloudflare Pages)

**Current Approach:** Netlify Free

**Netlify Free Tier** ([source](https://www.netlify.com/guides/netlify-vs-vercel/)):
- 100GB bandwidth/month
- 1 million Edge Function requests/month
- 300 build minutes/month
- Serverless functions (10-second timeout)
- No cost

**When You Hit Limits:**
- 50 client sites × 2GB traffic each = 100GB (at limit)
- Exceeding bandwidth = temporary suspend until next month
- Suitable up to ~40 client sites

**Vercel Free Tier** ([source](https://www.freetiers.com/blog/vercel-vs-cloudflare-pages-comparison)):
- 100GB bandwidth/month
- 100K serverless function invocations
- **Restriction:** Hobby tier for personal/non-commercial projects only
- Running client sites = violates ToS (requires Pro plan)

**Cloudflare Pages Free Tier** ([source](https://www.digitalapplied.com/blog/vercel-vs-netlify-vs-cloudflare-pages-comparison)):
- **Unlimited bandwidth** (!)
- 500 builds/month (daily limits for large builds)
- No serverless functions (Pages doesn't support them)
- Free on all plans

**Verdict for Benjamin:**
- For static HTML sites: **Cloudflare Pages is best** (unlimited bandwidth)
- For dynamic sites with serverless: **Netlify Free** (until 40 sites)
- Vercel: Not suitable (commercial restriction)

**Cost at 100 Client Sites:**
- Netlify: $0 (unless exceeding 100GB/month bandwidth)
- Vercel: Violates ToS
- Cloudflare: $0 (truly unlimited)

---

### Option B: Own VPS (DigitalOcean/Hetzner/Vultr)

**Feasibility:** HIGH (if comfortable with Linux) | **Setup Time:** 4-8 hours | **Cost:** $5-30/month

**DigitalOcean Droplets** ([source](https://www.digitalocean.com/pricing)):
- **Shared CPU:** $4/month (512MB RAM, 10GB SSD)
- **Premium:** $7/month (1GB RAM, 25GB SSD)
- **Dedicated CPU:** $24/month (2 vCPU, 4GB RAM)

**Stack to Run Multiple Sites:**
1. **Nginx** (free web server)
2. **Let's Encrypt** (free SSL)
3. **Simple bash scripts** or Python to deploy sites

**Setup:**
- Install Nginx, configure virtual hosts
- Set up SSL per domain
- Deploy generated HTML sites

**For 100+ Client Sites:**
- Use $7/month droplet (1GB RAM)
- Host 20-50 static sites per droplet
- Need 2-3 droplets = $14-21/month
- Add backups: +$2-4/month

**Pros:**
- Total cost: $20/month for unlimited sites
- Full control (can customize anything)
- Fast performance (Cloudflare still faster though)

**Cons:**
- Setup complexity: 8/10
- Security: 7/10 (need to manage SSL, keep software patched)
- Maintenance: Must monitor disk space, logs, security
- Downtime: You're responsible for uptime
- No CDN = slower for global clients

**Break-even:**
- Cloudflare: $0
- DigitalOcean: $20/month
- Break-even when Cloudflare would cost money (50+ sites with heavy traffic)

**Verdict:** Not worth it. Cloudflare Pages is free + faster.

---

### Option C: Cloudflare Pages (Free, Truly Unlimited)

**Cost:** $0

**Limitations:**
- 500 builds/month free (unlimited if using Git)
- Static sites only (no serverless)
- 25MB file size limit per site

**Perfect For:**
- Benjamin's Lovable-generated static sites
- All templated HTML sites
- Clean, simple deployment via Git

**Verdict:** Use Cloudflare Pages. Zero cost, unlimited bandwidth, best performance.

---

### Option D: AWS/GCP Free Tiers

**AWS S3 + CloudFront:**
- S3 storage: $0.023 per GB/month
- CloudFront: $0.085 per GB (varies by region)
- Free tier: 1GB/month for first 12 months
- After: 100 client sites @ 2GB each = 200GB = $17 + $17 = $34/month

**GCP Cloud Storage + CDN:**
- Similar pricing to AWS
- Free tier: 5GB/month
- After free: ~$20-30/month for 100 sites

**Verdict:** Cloudflare wins (completely free, no tier limits).

---

## SECTION 5: CRM & CLIENT MANAGEMENT

### Option A: Google Sheets (Current)

**Cost:** $0 (included with Google Workspace)

**Current Setup:**
- Columns: Client name, niche, email, phone, site URL, contract date, renewal date, monthly fee
- Formulas: =SUM for MRR, pivot tables for by-niche metrics

**Pros:**
- Zero cost
- Everyone knows how to use it
- Real-time collaboration
- Simple reporting with QUERY()

**Cons:**
- Doesn't scale past 50 clients (slow, hard to query)
- No native automations (have to trigger manually)
- No timeline/pipeline view
- Can't trigger follow-ups automatically
- Status tracking is manual

**Scalability Limit:**
- 10 clients: Perfect
- 50 clients: Workable but slow
- 100+ clients: Breaks down (sorting, filtering, formulas lag)

**Viable up to:** 40-50 clients (then need real CRM)

---

### Option B: HubSpot Free CRM

**Cost:** $0

**Included Features** ([source](https://www.hubspot.com/pricing/crm)):
- Up to 2 users
- 1,000 contacts
- 1 deal pipeline
- Email tracking
- Basic forms and landing pages (20 pages)
- Task management
- 2,000 marketing emails/month
- Basic reporting (3 dashboards)

**Pros:**
- Free tier is surprisingly powerful
- Deal pipeline visualizations
- Email integration
- Automation triggers (if-this-then-that)
- Better than Sheets for team collaboration

**Cons:**
- 2-user limit (Benjamin + VA = at limit)
- 1,000 contact limit (hit at 1,000 clients if tracking prospects)
- Custom fields require paid plan
- Limited automation (100 workflows/month on free)

**Viable up to:** 100 clients (contacts is limiting factor)

---

### Option C: GoHighLevel ($97-497/month)

**Cost:** $97-497/month ([source](https://www.gohighlevel.com/pricing))

**Starter Plan: $97/month**
- Unlimited contacts and users
- Full CRM + sales pipeline
- Email + SMS marketing
- Workflow automation
- 3 sub-accounts (for white-label)

**Unlimited Plan: $297/month**
- Everything in Starter +
- Unlimited sub-accounts
- Custom domain
- More automation capacity

**What It Replaces:**
- HubSpot CRM ($50-300)
- Instantly.ai ($37/mo can be replicated with GoHighLevel email)
- Email campaigns ($0-50)
- Automation tools ($29-99/mo in Make.com)

**Total Savings if Consolidating:**
- Without GoHighLevel: $50 HubSpot + $37 Instantly + $29 Make = $116
- GoHighLevel: $97
- **Net savings: $19-119/month**

**Pros:**
- All-in-one platform
- Better for white-label (can offer to clients)
- Powerful automation
- Email + SMS together
- Support is excellent

**Cons:**
- $97/month for Benjamin's current scale is overkill
- He already has free tools that work
- No learning curve advantage (already using Instantly)

**Viable When:**
- Planning to white-label to agencies (could resell)
- Want to consolidate 5+ tools into one
- Need more complex automation

**Verdict:** Not yet. Stick with free tier HubSpot until hitting 50+ clients.

---

### Option D: Self-Hosted CRM (SuiteCRM, ERPNext)

**Feasibility:** MEDIUM-HIGH (if comfortable with server setup) | **Setup Time:** 30-50 hours | **Cost:** $10-50/month

**SuiteCRM (Free, Open Source):**
- Download and install on VPS
- Full-featured CRM (leads, deals, accounts)
- Email integration
- Reporting + dashboards
- API for custom integrations

**Hosting:**
- DigitalOcean: $7/month (minimal)
- Or $20-30/month for managed database backup

**Setup:**
- Install Linux, MySQL, PHP
- Configure SuiteCRM
- Set up email sync
- Create custom fields for Benjamin's needs

**Maintenance:**
- Security updates
- Backups
- Performance tuning
- Troubleshooting

**True Cost:**
```
Setup: 40 hours = $10,000
Hosting: $15/month
Maintenance: ~$100/month (opportunity cost)
———————————————
TOTAL: $10,000 + $115/month
```

**Verdict:** Not worth it. Free HubSpot + Google Sheets is simpler and free.

---

## SECTION 6: AUTOMATION INFRASTRUCTURE

### Option A: SaaS Tools (Make.com / Zapier)

**Make.com** (formerly Integromat):
- Free tier: 1,000 operations/month
- Paid: $10.59/month (10,000 ops), $20/month (50,000 ops)
- Operations: Each task (send email, create spreadsheet row, etc.)

**Typical Automations for Benjamin:**
1. Lead scraping → Instantly campaign → Google Sheets
2. Instantly reply → Google Sheet → Slack notification
3. Client signs → Invoice sent → Calendly created

**Cost:**
- 10 workflows × 200 ops/month = 2,000 ops = $10.59/month

**Zapier:**
- Minimum: $29/month (750 tasks)
- Operations are called "Tasks"
- More expensive than Make

**Pros:**
- No code required
- Easy to modify workflows
- Good error handling
- Support for 1000+ apps

**Cons:**
- Recurring cost
- Make.com UI is complex
- Debugging failures is manual
- Cost scales with complexity

**Viable:** Yes, at $10-30/month

---

### Option B: n8n (Self-Hosted, Free)

**Feasibility:** MEDIUM | **Setup Time:** 6-10 hours | **Cost:** $0-500/month

**What It Is:**
- Open-source workflow automation (Make.com alternative)
- Visual workflow builder
- 400+ integrations

**Deployment Options:**

1. **Self-Hosted (Free)**
   - Download from GitHub
   - Run on Benjamin's VPS
   - Cost: $0 + hosting

2. **n8n Cloud (Managed)**
   - $20/month for basic tier
   - Handles scaling + security
   - Better than self-hosting for small teams

3. **Self-Hosted Production** (what most enterprises do)
   - Requires: PostgreSQL, Redis, monitoring
   - Hosting: $100-300/month for proper infrastructure
   - Maintenance: $50-100/month opportunity cost

**Setup Complexity:**
- Docker deployment: 4-6 hours
- Learning the UI: 2-4 hours
- Building first workflows: 10-20 hours

**Cost Analysis:**

**Self-Hosted Free Version:**
```
Hosting (DigitalOcean): $7/month
PostgreSQL setup: +$5/month
Learning curve: 20 hours = $5,000
Real monthly cost: $12/month + $250/month maintenance
= $262/month true cost
```

**n8n Cloud ($20/month):**
- $20/month + $100/month support/learning
- = $120/month true cost

**vs Make.com ($10/month):**
- $10/month + $50/month support
- = $60/month true cost

**Verdict:** Make.com is cheaper + simpler.

---

### Option C: Custom Python Scripts + Cron Jobs

**Feasibility:** HIGH (if Benjamin codes) | **Setup Time:** 8-16 hours | **Cost:** $5-10/month

**What to Automate:**
1. Daily lead scraping (Outscraper API)
2. Weekly email campaign creation (generate from template)
3. Monthly client reporting (pull metrics → send email)

**Stack:**
- Python scripts on VPS
- Cron jobs for scheduling
- Gmail API / Outscraper API for integration

**Cost:**
- Hosting: $7/month VPS
- Script development: 15 hours = $3,750
- Maintenance: ~$30/month for troubleshooting

**Advantages:**
- Total cost stays low ($12/month)
- Benjamin owns the code
- Flexible customization

**Disadvantages:**
- No UI to modify workflows
- Debugging requires coding
- Breaks when APIs change
- Requires Python knowledge

**True Cost:**
```
Setup: $3,750
Hosting: $7/month
Maintenance: $30/month
= $3,787 startup + $37/month
```

**Viable When:**
- Benjamin wants to learn Python
- Only needs 3-4 simple automations
- Happy to maintain code

**Verdict:** For 1-2 workflows, Make.com at $10/month wins. For 10+ workflows, Python scripts might be cheaper long-term.

---

## SECTION 7: COST MATRIX — THE VERDICT

| Component | SaaS Cost/mo | Self-Hosted Cost/mo | DIY/Free Cost/mo | True Cost/mo (incl. setup) | Recommendation |
|-----------|-------------|--------------------|--------------------|---------------------------|----------------|
| **Site Generation** | $50 (Lovable) | $5-50 (GPU cloud) | $0 (Templates) | $50 | **Lovable ($50)** |
| **Email Outreach** | $85 (Instantly) | $96 (Mautic+SES) | $0 (Manual) | $85 | **Instantly ($85)** |
| **Lead Scraping** | $15 (Outscraper) | $120 (DIY scraper) | $0 (Manual) | $15 | **Outscraper ($15)** |
| **Hosting** | $0 (Cloudflare) | $20 (DigitalOcean) | $0 (Free tier) | $0 | **Cloudflare Pages ($0)** |
| **CRM** | $0 (HubSpot Free) | $115 (SuiteCRM) | $0 (Sheets) | $0 | **HubSpot Free ($0)** |
| **Automation** | $10 (Make.com) | $262 (n8n self) | $3,787 (Python+cron) | $10 | **Make.com ($10)** |
| **TOTAL** | **$160/mo** | **$498/mo** | **$3,787+** | **$160/mo** | **SaaS is best** |

---

## SECTION 8: DETAILED COST BREAKDOWN AT SCALE

**STARTUP PHASE (0-10 clients, 1-5 sites/month):**

| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| Lovable | $50 | 1-2 sites/month |
| Instantly | $85 | 500 emails/month |
| Outscraper | $0 | Free tier (500 leads) |
| Hosting | $0 | Cloudflare Pages |
| CRM | $0 | Google Sheets + HubSpot Free |
| Automation | $0 | Manual workflows |
| **TOTAL** | **$135/mo** | **$1,620/year** |

**GROWTH PHASE (10-50 clients, 5-20 sites/month):**

| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| Lovable | $50 | 10-15 sites/month |
| Instantly | $85 | 3,000 emails/month |
| Outscraper | $25 | 2,000 leads/month |
| Hosting | $0 | Cloudflare Pages |
| CRM | $0 | HubSpot Free |
| Automation | $10 | Make.com (basic) |
| **TOTAL** | **$170/mo** | **$2,040/year** |

**SCALE PHASE (50-200 clients, 20-50 sites/month):**

| Component | Monthly Cost | Alternative | Notes |
|-----------|-------------|-------------|-------|
| Lovable | $100+ | Claude API ($1,500) | Lovable Pro with more credits |
| Instantly | $200 | GoHighLevel ($297) | Upgraded to Hypergrowth |
| Outscraper | $100 | DIY scraper ($500 setup) | 10,000+ leads/month |
| Hosting | $0 | DigitalOcean ($20) | Still free with Cloudflare |
| CRM | $50 | HubSpot Sales Hub ($50) | Upgraded from free |
| Automation | $30 | n8n Cloud ($20) | More workflows needed |
| **TOTAL** | **$480/mo** | **$887/mo** | **$5,760-10,644/year** |

---

## SECTION 9: THE REAL QUESTION — TIME vs MONEY

**Benjamin's Opportunity Cost:**

If Benjamin closes 1 client/week:
- Setup fee: $997
- Monthly fee: $149/month × 12 = $1,788/year
- **Value per client: ~$2,000 in year 1**

If Benjamin's fully-loaded cost is $250/hour:
- Each hour spent on infrastructure = $250 in lost potential revenue
- Building n8n automation: 10 hours = $2,500 sunk cost
- n8n Cloud: $20/month = $240/year
- Break-even: ~10 months (if he would have closed 10 more clients)

**This is Why SaaS Wins Right Now:**

| Activity | Time | Cost | Opportunity Cost | Total Cost |
|----------|------|------|-------------------|-----------|
| **Setup Lovable** | 0 hrs | $600/year | $0 | $600 |
| **Setup n8n self-hosted** | 20 hrs | $120/year | $5,000 | $5,120 |
| **Build API scraper** | 40 hrs | $600/year | $10,000 | $10,600 |
| **Run manual process** | 5 hrs/month | $0 | $60,000/year | $60,000 |

**The verdict is clear:** At Benjamin's current scale, every hour spent building infrastructure is an hour NOT spent closing clients. The payoff is only worth it when:
1. You've hit a real constraint (e.g., cost rising faster than revenue)
2. The infrastructure will pay for itself in <6 months
3. You have automation leverage (sell to 50+ agencies, not 50 clients)

---

## SECTION 10: PHASED RECOMMENDATION

### MONTH 1-3: STARTUP (Do This Now)

**Stack:**
- Lovable ($50) for sites
- Instantly ($85) for email
- Outscraper ($0 free tier) for leads
- Cloudflare Pages ($0) for hosting
- Google Sheets + HubSpot Free ($0) for CRM
- Make.com ($10) for basic automation

**Monthly cost: $145**

**Action items:**
1. Set up Lovable workspace (1 day)
2. Build 3 email sequences in Instantly (1 day)
3. Run first campaign: 50 leads from Outscraper (1 day)
4. Set up Google Sheets template for client tracking (2 hours)
5. Build 2 automations in Make.com (email → Sheets, reply → Slack) (1 day)

**Success metric:** Close 2-4 clients/month

---

### MONTH 4-6: GROWTH (Don't Overthink)

**Changes:**
- Lovable: Keep at $50 (still efficient)
- Instantly: Upgrade to Hypergrowth ($97) only if hitting 5,000 emails/month
- Outscraper: Upgrade to $25/month (need more leads)
- Cloudflare: Still free
- HubSpot Free: Still free
- Make.com: Upgrade to $10/month for more operations

**Monthly cost: $182**

**When to upgrade Instantly:** When you're sending 5,000+ emails and hitting the limit (means you're scaling, which is good)

**When to NOT upgrade:** Just because. Constraints are often motivating.

---

### MONTH 7-12: SCALE (Now It's Worth Optimizing)

**Evaluation criteria for each tool:**

| Component | Upgrade When | What To Do |
|-----------|------------|-----------|
| **Lovable** | Cost >15% of client fees | Consider Claude API or templates |
| **Instantly** | Sending 10,000+ emails/month | Evaluate SES ($6/mo) + own tool |
| **Outscraper** | Scraping 10,000+ leads/month | Build DIY scraper (ROI becomes positive) |
| **Hosting** | Bandwidth exceeding 100GB/month | Move to DigitalOcean VPS ($20/mo) |
| **CRM** | Hitting 1,000 contact limit | Upgrade to HubSpot Sales ($50/mo) |
| **Automation** | 5+ complex workflows | Evaluate n8n Cloud ($20/mo) vs Make |

**Projected monthly cost at 200 clients:** $480-600/month (vs $5,000 spent to save $100-200)

---

## SECTION 11: WHEN TO BUILD vs BUY — DECISION FRAMEWORK

**BUILD if:**
1. Cost of SaaS exceeds 10% of gross revenue
2. You've hit a real technical constraint (SaaS tool can't do X)
3. You have 2+ engineers with spare time
4. The ROI payback is <6 months
5. You're planning to white-label or sell the tool

**BUY if:**
1. You're below 50 clients (almost always true)
2. Setup time > 1 month
3. Maintenance burden > 5 hours/month
4. SaaS cost is <5% of gross revenue
5. Your competitive advantage is NOT the infrastructure

**Example Decision Trees:**

**"Should I build email infrastructure?"**
- Current: Instantly $85/month
- DIY: $5,000 setup + $50/month Mautic + $0 SES = $150/mo true cost
- Break-even: ~40 months (not worth it)
- **Decision: BUY (Instantly)**

**"Should I self-host my CRM?"**
- Current: HubSpot Free + Google Sheets = $0
- DIY: SuiteCRM $10,000 setup + $100/month = $5,000+ annually
- Break-even: Never (free alternative exists)
- **Decision: BUY (HubSpot Free)**

**"Should I build a lead scraper?"**
- Current: Outscraper $15-25/month
- DIY: $5,000 setup + $50/month proxies = $5,000 annually
- At 100 leads/month: $25 vs $5,042 = 200x worse
- At 10,000 leads/month: $250 vs $5,600 = 22x worse (still not ROI positive)
- **Decision: BUY (Outscraper) — even at scale**

---

## SECTION 12: PITFALLS TO AVOID

**Trap #1: "Let's Save 30% on SaaS"**
- Benjamin spends 40 hours building infrastructure
- Saves $30/month ($360/year)
- Lost opportunity cost: $10,000
- Net: -$9,640 (worse off)

**Trap #2: "We Can Use Free Tiers"**
- Lovable free tier = slow development (fewer credits)
- Instantly free = too few emails
- Result: Can't serve clients, no revenue, save $100/month
- **Use paid SaaS when it enables revenue, not to save money**

**Trap #3: "Self-Hosting Is More Secure"**
- Self-hosted email = poor deliverability + your reputation at stake
- Client sites on your VPS = you're liable for downtime
- DIY automation = no error handling, manual debugging
- **Managed SaaS often has BETTER security + reliability**

**Trap #4: "Let's Build It In-House"**
- Instantly has 10+ engineers + deliverability experts
- Benjamin has himself
- Trying to replicate = 90% feature parity at 10x the cost
- **Some things can't be built cheaper than bought**

---

## SECTION 13: AUTOMATION OPPORTUNITIES SPOTTED

**Quick Win #1: Daily Lead Gen Automation**
- Current: Manual Outscraper searches
- Automation: Make.com workflow to run Outscraper daily, save to Google Sheets
- Time saved: 5 hours/week = $1,250/month value
- Cost: $10/month Make
- **ROI: 125x (do this immediately)**

**Quick Win #2: Campaign Performance Dashboard**
- Current: Manually log Instantly stats in Sheets
- Automation: Zapier sync Instantly → Sheets weekly
- Time saved: 2 hours/week = $500/month value
- Cost: $10/month (Make.com)
- **ROI: 50x (do this month 2)**

**Quick Win #3: Client Onboarding Sequence**
- Current: Manual email + call + agreement = 2 hours/client
- Automation: Make.com workflow (email template, Calendly link, payment reminder)
- Time saved: 1.5 hours/client × 1 client/week = $6,000/year value
- Cost: $5/month (additional Make operations)
- **ROI: 100x (implement in month 3)**

**Bigger Win #4: Warm-Up Pipeline Builder**
- Current: Manual warm-up before campaigns
- Automation: Script to gradually increase email volume in Instantly
- Time saved: 10 hours/month = $2,500/month value
- Cost: $0 (Python script, one-time 8 hours)
- **ROI: Infinite if executed well**

---

## FINAL VERDICT — THE ROADMAP

### MONTHS 1-3: SPEED OVER SAVINGS
**Stack:** All SaaS, minimal automation
**Cost:** $145/month
**Focus:** Close clients, not infrastructure

### MONTHS 4-6: SMART SCALING
**Stack:** Upgrade 2-3 tools based on real constraints
**Cost:** $180-250/month
**Focus:** Automate repetitive tasks with Make.com

### MONTHS 7-12: JUSTIFIED OPTIMIZATION
**Stack:** Evaluate 1-2 infrastructure builds if ROI is clear
**Cost:** $300-500/month
**Focus:** Consolidate tools (e.g., GoHighLevel replaces 3 SaaS)

### YEAR 2+: ENTERPRISE DECISIONS
**Stack:** Custom builds only where competitive advantage exists
**Cost:** $500-2,000/month
**Focus:** White-label, automation as product, not just tool

---

## BOTTOM LINE

**Benjamin: Use SaaS. All of it. Until revenue justifies the infrastructure cost.**

The math is brutal:
- SaaS stack: $145-170/month = $1,740-2,040/year
- DIY stack: $10,000+ setup + $300-500/month = $13,600-16,000/year
- **SaaS is 8-9x cheaper at your current scale**

Build infrastructure when:
1. You're closing 10+ clients/month (not 1-2)
2. SaaS cost exceeds 5% of MRR
3. You have a technical co-founder with spare capacity
4. You've identified a competitive advantage in owning the tech

Until then: **Buy fast, move fast, close clients.**

---

**Author:** Benjamin Rodriguez
**Last Updated:** 2026-03-25
**Next Review:** 2026-06-25 (post-growth evaluation)

