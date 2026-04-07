# AGENCY OPERATIONS SOP v1.0

**v1.0 — Complete agency operations manual: daily routines, SOPs, and automation playbook**

— Benjamin Rodriguez

---

## EXECUTIVE OVERVIEW

This is your operational bible. It defines how the agency runs when you're executing, when you're sleeping, and when you're scaling. Every routine, process, and threshold is documented here. **Follow these SOPs exactly for the first 30 days.** After that, you have permission to optimize based on what you learn.

**Key metrics to track:**
- Daily emails sent (target: 50-100)
- Demo sites built (target: 5-10/day)
- Replies received (target: 2-5/day)
- Calls booked (target: 1-3/day)
- New clients closed (target: 2-5/week)

---

## PART 1: THE DAILY ROUTINE (2-hour daily playbook)

### MORNING BLOCK: Outreach & Leads (1 hour)

**Time Allocation:**
- 0:00-0:10 — Review Instantly.ai dashboard
- 0:10-0:20 — Respond to warm leads
- 0:20-0:30 — Check client support inbox
- 0:30-0:45 — Build 1-2 demo sites
- 0:45-1:00 — Update lead tracker spreadsheet

**Detailed Steps:**

**0:00-0:10 — Instantly Dashboard Review**

What to check:
1. Open Instantly.ai dashboard
2. Go to "Campaigns" tab
3. Note yesterday's metrics:
   - Emails sent (should match plan)
   - Open rate (target: 35-45%)
   - Reply rate (target: 5-10%)
   - Click rate (target: 3-5%)
4. Check "Inbox" for new replies (they arrive in the dashboard)
5. Take a screenshot for your weekly metrics

**Red flags that need immediate action:**
- Open rate <25% (possible deliverability issue)
- Reply rate 0% (subject lines might be wrong)
- Bounce rate >5% (list quality problem)
- Gmail/Outlook complaints (reputation damage)

If you see a red flag: STOP and check the "Better Ways" section at the end of this SOP.

---

**0:10-0:20 — Warm Lead Response (2-hour SLA)**

Priority order (respond in this exact order):

1. **HOT:** Leads asking about pricing, timelines, or ready to talk (respond within 30 minutes)
2. **WARM:** Leads asking questions, interested but cautious (respond within 2 hours)
3. **COLD:** Leads asking generic questions or requesting generic info (respond within 24 hours)

Warm lead response template:

```
Subject: Re: I built [BUSINESS NAME] a website

Hi [NAME],

Thanks for getting back to me — I'm glad you got the preview.

Here's the quick version: I can have the live version on your domain in 24-48 hours. The setup includes all the basics — your services, address, phone, map, and reviews. After that, it's $[PRICE]/month and I handle all the updates and maintenance.

The fastest way to move forward is a 15-minute call where I can answer any questions and get your domain set up.

Are you free [TOMORROW] at [TIME] or [DAY] at [TIME]?

— Benjamin
```

For each warm reply:
1. Read the email carefully (they usually ask specific questions)
2. Answer their specific question (not a template response)
3. Include a 15-minute call link (Calendly or Google Meet)
4. Set a reminder to follow up if they don't reply in 24 hours

**Action:** Mark the lead in your sheet as "Replied — Awaiting Confirmation" so you don't double-touch them.

---

**0:20-0:30 — Client Support Inbox**

Check your main email inbox for client support requests:
- Site updates ("Can you change our phone number?")
- Billing questions ("When is my invoice due?")
- Technical issues ("My site is down")

Respond to all within 4 hours. Most are simple.

**Escalation:** If a client is unhappy (angry email, demands refund), see the "Escalation Procedures" section of this SOP.

---

**0:30-0:45 — Build 1-2 Demo Sites**

You'll have a list of qualified leads ready for demo sites. Pick the next 2 from your "Ready for Site Build" list.

Using your Master Templates:
1. Pick the right niche template (plumber = Home Services, salon = Personal Services)
2. Open in Lovable, clone it
3. Update: business name, phone, address, services, color scheme
4. Generate
5. Deploy to Netlify under new subdomain (e.g., joes-plumbing.localpreview.site)
6. Mobile test: Open on your phone, tap all buttons, verify the call button works
7. Add URL to your tracker sheet

**Target time per site: 15-20 minutes**

If you're taking longer, you're customizing too much. These are demos, not finished products. People buy based on the concept, not pixel perfection.

---

**0:45-1:00 — Update Lead Tracker**

Review your Google Sheet (the master lead tracker):

1. **New qualified leads:** Any leads you identified today as "No Website" or "Bad Website"?
   - Add them to the sheet
   - Mark status as "Qualified — Ready for Site Build"

2. **Demo sites deployed today:** Update the URL column for any sites you built this morning

3. **Outreach status:** Any campaigns you're launching today?
   - Mark leads as "Outreach Scheduled"

4. **Call schedule:** Any calls booked? Add to a "Calls This Week" section at the top of the sheet

5. **Revenue tracking:** Anyone who said "yes" today?
   - Mark as "Closed — Invoice Pending"
   - Add to a "Revenue This Week" summary

---

### AFTERNOON BLOCK: Lead Generation & Client Work (1 hour)

**Time Allocation:**
- 0:00-0:15 — Scrape new leads
- 0:15-0:30 — Qualify leads
- 0:30-0:45 — Load into outreach queue
- 0:45-1:00 — Client work or admin

---

**0:00-0:15 — Scrape New Leads (one niche-city combo per day)**

Process:

1. Pick a niche (e.g., "plumber") and city (e.g., "Austin, TX")
2. Go to Outscraper (outscraper.com)
3. Run a Google Maps scrape with filters:
   - Category: your niche
   - Location: your city
   - Website status: "No Website" OR "Website not found"
4. Wait for results (usually 2-5 minutes)
5. Export as CSV
6. Download and open in Google Sheets

**Daily target: 50-100 new leads per scrape**

---

**0:15-0:30 — Qualify Leads**

Open the CSV from your scrape. For each lead:

1. **Check business type:**
   - If it's a chain/franchise (Verizon, Home Depot, etc.) → DELETE
   - If it's a solo business or local shop → KEEP

2. **Check website status:**
   - If website field says "none" or "404" → QUALIFIED
   - If website exists but looks outdated (no reviews, no content) → QUALIFIED ("Bad Website")
   - If website looks professional → DELETE (they don't need you)

3. **Check contact info:**
   - Phone number exists? (required for calls-based business)
   - Address valid? (not a PO Box)
   - Email extractable? (use a tool like RocketReach if needed)

4. **Final check:**
   - Do they have 10+ Google reviews? (sign of established business)
   - Are they in a niche you target?
   - Is the city on your list?

5. Tag remaining leads as "Qualified" and move to "Ready for Site Build" section

**Typical conversion:** 100 raw leads → 60-70 qualified leads per day

---

**0:30-0:45 — Load New Leads Into Outreach Queue**

For leads that have demo sites built:

1. Go to Instantly.ai → Campaigns
2. Start a new campaign
3. Upload CSV with columns:
   - first_name
   - last_name
   - email
   - business_name
   - demo_site_url (this goes in the email body)
4. Select your email sequence (the 5-email template you set up)
5. Set follow-up timing:
   - Email 1: Now
   - Email 2: +3 days
   - Email 3: +7 days
   - Email 4: +10 days
   - Email 5: +14 days
6. Launch

**Daily target:** Launch one campaign with 25-50 leads (once you have demo sites built)

---

**0:45-1:00 — Client Work or Admin**

Catch-up time. Use this for:
- Site updates for existing clients
- Invoice follow-ups
- Contractual work
- Or prep for tomorrow (review lead list, plan which niches to scrape tomorrow)

---

### WEEKLY TASKS (Friday, 30 minutes)

**Friday Morning, 9-9:30 AM:**

1. **Update Weekly Report Spreadsheet** (10 min)
   - Total leads generated this week
   - Total sites built this week
   - Total emails sent this week
   - Total replies received
   - Total calls booked
   - Total clients closed
   - Total revenue (setup fees + first month MRR)
   - Email open rate this week (average)
   - Email reply rate this week (average)

2. **Review Campaign Metrics & A/B Tests** (10 min)
   - Which email subject lines performed best?
   - Which niches had the highest reply rates?
   - Which cities are converting fastest?
   - What's your average reply rate this week? (target: 5-10%)

3. **Plan Next Week's Niche-City Targets** (5 min)
   - Review which niches/cities had best conversion
   - Decide which niches to scrape next week (2-3 per day)
   - Make a list and post it in your Notion/Sheet for Monday morning

4. **Send Referral Program Reminder** (5 min)
   - Email all clients from previous 2 weeks
   - Include referral link (if you're offering referral discounts)
   - Example: "Know another [NICHE] who needs a website? I'll give you $100 off your month for every referral who signs up."

**Note:** This is review + planning, not execution. The goal is to understand what's working so you can do more of it next week.

---

### MONTHLY TASKS (1st of month, 1 hour)

**First of Every Month, Morning:**

1. **Invoice All Clients** (15 min)
   - Go to your "Active Clients" sheet
   - For each client, send invoice for this month's maintenance fee
   - Note due date (typically 15 days from invoice date)
   - Use a template: "Invoice for Website Maintenance — [MONTH]. Due [DATE]."
   - Include: amount due, payment link, services delivered this month

2. **Review Monthly Financials** (15 min)
   - Sum all setup fees from last month
   - Sum all recurring revenue from active clients
   - Calculate churn (any cancellations?)
   - Calculate monthly profit (revenue - tool costs - hosting - time valued at $150/hr)

3. **Evaluate Tool Spend vs. ROI** (10 min)
   - Are you getting ROI on Instantly.ai ($37)?
   - Are you getting ROI on Lovable ($50)?
   - Are you using all your Google Workspace seats ($7 x N)?
   - Any tools you should cut?

4. **Send Monthly Reports to Growth/Dominate Clients** (15 min)
   - For Tier 2 (Growth) clients: Send traffic metrics + search rankings + calls generated
   - For Tier 3 (Dominate) clients: Send a full report (traffic, rankings, review activity, recommendations)
   - Template is in your Reports folder

5. **Content Update for Clients (Tier 2 & 3 only)** (5 min)
   - Tier 1 clients: No update this month
   - Tier 2 clients: Update one service page or add a blog post (send update to them)
   - Tier 3 clients: Full monthly refresh (new blog post, update service pages, add new testimonials)

---

## PART 2: STANDARD OPERATING PROCEDURES (SOPs)

Each SOP includes: trigger, inputs, steps, outputs, and success criteria.

---

### SOP 1: NEW LEAD PROCESSING

**Trigger:** New leads exported from Outscraper

**Inputs:**
- CSV file from Outscraper containing: Business Name, Phone, Address, City, State, Website URL, Google Rating, Review Count

**Steps:**

1. Download CSV from Outscraper
2. Open Google Sheets (your master lead tracker)
3. Create new rows for each lead
4. For each lead, fill in:
   - Business Name
   - Phone
   - Address
   - City / State / ZIP
   - Niche (categorized based on Outscraper category)
   - Google Rating (from Outscraper)
   - Review Count (from Outscraper)
   - Website Status ("None" or "Bad Website")
5. Manual scan (2-3 seconds per lead):
   - Is this a chain/franchise? → DELETE
   - Do they have a phone number? → KEEP
   - Do they have 5+ reviews? → KEEP (more likely to buy)
   - Is the address valid (not PO Box)? → KEEP
6. For remaining leads, set status to "Qualified — Ready for Site Build"
7. Move to "Ready for Site Build" section of your sheet

**Outputs:**
- Clean list of qualified leads with complete contact info
- Each lead tagged by niche and ready for demo site build

**Success Criteria:**
- 60-70% of raw leads are qualified
- All qualified leads have phone numbers and valid addresses
- No chains/franchises remain in the list

---

### SOP 2: DEMO SITE BUILD (15-20 min target)

**Trigger:** Qualified lead ready for demo site

**Inputs:**
- Business name
- Phone number
- Address
- Niche (determines which Master Template to use)
- Google reviews (optional but recommended)

**Steps:**

1. Determine the correct Master Template:
   - Plumber/Electrician/HVAC/Roofer/Cleaner → Home Services template
   - Barber/Salon/Spa/Tattoo → Personal Services template
   - Restaurant/Cafe/Food Truck → Food & Drink template
   - Dentist/Chiropractor/Gym/Yoga → Health & Wellness template
   - Auto Repair/Detailing/Body Shop → Auto template

2. Open Lovable.dev and clone the appropriate Master Template

3. In the template, replace:
   - [BUSINESS_NAME] → actual business name
   - [PHONE] → their phone number
   - [ADDRESS] → their full address
   - [CITY/STATE] → city and state
   - [SERVICES] → 3-5 main services they offer (research their Google listing)
   - [REVIEWS] → 2-3 of their actual Google reviews (keep them authentic)
   - [COLOR_SCHEME] → pick a color that matches their industry (blue for trades, warm colors for food/wellness)

4. Generate the site in Lovable

5. Deploy to Netlify:
   - Go to Netlify
   - Connect GitHub repo (you should have one set up already)
   - Deploy to a new subdomain: `[businessname].localpreview.site`
   - Wait for deploy to finish (usually 30 seconds)

6. Test on mobile:
   - Open the live URL on your phone
   - Tap the "Call" button (should open phone dialer)
   - Scroll through all sections
   - Check for any visual breaks

7. Update your lead tracker:
   - Find the lead's row
   - Add demo site URL to the "Demo Site URL" column
   - Change status to "Site Built — Ready for Outreach"

**Outputs:**
- Live, mobile-responsive demo site
- Unique subdomain URL
- Lead marked as ready for outreach

**Success Criteria:**
- Site loads in under 3 seconds
- Mobile responsive (no broken layout)
- All buttons work (especially Call button)
- Business name and phone number are correct and visible

---

### SOP 3: CAMPAIGN LAUNCH

**Trigger:** 25-50 leads with demo sites ready

**Inputs:**
- CSV with qualified leads
- Demo site URLs (one per lead)
- Email sequence (pre-written in Instantly)

**Steps:**

1. **Prepare the lead CSV** with these columns:
   - first_name
   - last_name
   - email
   - business_name
   - city
   - demo_site_url
   - niche (optional, for tracking)

2. **Go to Instantly.ai → Campaigns**

3. **Create New Campaign:**
   - Click "Create Campaign"
   - Name: "Campaign — [NICHE] — [CITY] — [DATE]" (e.g., "Campaign — Plumbers — Austin — Mar 25")
   - Select your connected sending account

4. **Upload lead CSV:**
   - Click "Upload Leads"
   - Select your CSV
   - Map columns (first_name, last_name, email, etc.)
   - Verify 0 errors, 0 duplicates

5. **Select Email Template:**
   - Choose your pre-written 5-email sequence
   - The template should reference {demo_site_url} and {business_name}
   - Preview one email to confirm personalization works

6. **Set Follow-up Schedule:**
   - Email 1: Immediately
   - Email 2: +3 days
   - Email 3: +7 days
   - Email 4: +10 days
   - Email 5: +14 days

7. **Review Settings:**
   - Sending account: Correct? (rotate between your 2 accounts)
   - Daily sending limit: Don't exceed 50/day per account (stay below daily limits)
   - Reply handling: Enabled (so replies come to your inbox)

8. **Launch:**
   - Click "Start Campaign"
   - Confirm in the popup
   - Wait for first email to send (should see "X emails sent" within 60 seconds)

9. **Update Tracker:**
   - Mark all leads in this batch as "Outreach Scheduled"
   - Add campaign name to tracker

**Outputs:**
- Active campaign in Instantly
- First batch of 25-50 personalized emails sent
- Automatic follow-up sequence running

**Success Criteria:**
- All emails sent within 5 minutes
- No bounces in first hour (if bounces >5%, list quality issue)
- Open rate hits 35%+ within 24 hours
- First replies arrive within 24 hours

---

### SOP 4: WARM LEAD RESPONSE (2-hour SLA)

**Trigger:** Reply received in Instantly (arrives in your inbox)

**Inputs:**
- Email reply from prospect
- Their business info (should have your demo site URL)

**Steps:**

1. **Read and Categorize:**
   - HOT: "Want to move forward," "How much," "What's the timeline?" → Respond within 30 min
   - WARM: Asking questions, interested but cautious → Respond within 2 hours
   - COLD: "Not interested," "Too expensive," one-word replies → Respond within 24 hours

2. **For HOT leads:**
   - Respond immediately with:
     - Answer to their specific question
     - 3 time slots for a 15-minute call (same day or next day)
     - Calendly link or Google Meet link
   - Example: "Great — I'm glad the preview resonates. A 15-minute call is the fastest way to move forward. I can do tomorrow at [TIME] or [TIME], or Monday at [TIME]. Which works best? [CALENDLY_LINK]"

3. **For WARM leads:**
   - Respond within 2 hours (not a template, personalized)
   - Answer their specific question
   - Include call link if they're showing interest
   - If they're just asking questions with no clear intent, send a light follow-up in 2 days

4. **For COLD leads:**
   - Simple "thanks for your feedback" response
   - No pressure
   - Move on

5. **Track in Your Sheet:**
   - Update lead row with status: "Replied — Awaiting Confirmation" or "Replied — Scheduled Call [DATE]"
   - Add the call date/time if scheduled

6. **Set Calendar Reminder:**
   - 5 minutes before their call slot, review their business info (Google reviews, website status, etc.)
   - Have 2-3 talking points ready (see "Sales Call Execution" SOP)

**Outputs:**
- Reply sent within SLA
- Call scheduled or follow-up scheduled
- Lead status updated

**Success Criteria:**
- All HOT leads get response within 30 minutes
- All WARM leads get response within 2 hours
- 30%+ of warm replies result in scheduled calls

---

### SOP 5: SALES CALL EXECUTION

**Trigger:** Call scheduled with warm lead

**Inputs:**
- Business name and niche
- Their Google reviews
- Any prior email replies
- The demo site URL you sent them

**Steps:**

1. **Pre-Call Research (5 minutes before):**
   - Google their business name
   - Check their Google reviews (read 3-5 real reviews)
   - Look for pain points ("Always hard to reach them," "Hard to find online," etc.)
   - Check their current website (if they have one)
   - Take notes on 2-3 things you noticed

2. **Greeting (first 60 seconds):**
   - "Hi [NAME], thanks for hopping on. I'm Benjamin. Did the preview site I built resonate with you?"
   - Let them talk. Most will say yes or ask a question.

3. **Discovery (next 5 minutes):**
   If they liked it:
   - "What specifically did you like about it?"
   - "How long have you been wanting a web presence?"
   - "What's been the biggest challenge without a website?"

   Listen for pain points. They'll often tell you exactly what they need.

4. **The Pitch (next 3 minutes):**
   Once you understand their situation, anchor to the pain point:
   - "Okay, so the main thing is [PAIN_POINT]. That's exactly what our Tier 1 plan solves. Here's what you get..."

   **Tier 1 Quick Start ($997 + $149/mo):** Professional website, hosted, maintained, mobile-optimized, your domain, basic SEO, 1 round of revisions.

   **Tier 2 Growth ($1,997 + $249/mo):** Tier 1 + Google Business Profile setup, directory listings, monthly content update, analytics dashboard.

   **Tier 3 Dominate ($3,497 + $397/mo):** Tier 2 + full local SEO, review management, monthly reports, priority support.

   Default to Tier 1. Upsell to Tier 2 only if they mention wanting visibility/rankings.

5. **Objection Handling:**
   - "That's expensive" → "Compared to what? Most traditional agencies charge $3-5K just to build it. You're getting a live site plus ongoing maintenance. And most clients see 10-20 calls per month from the site, so it pays for itself."
   - "I need to think about it" → "I totally understand. Here's the thing — I batch these builds, and this month's batch closes [DATE]. If you want in, I'd need to know by then. Otherwise, it's next month. Does that timeline work for you?"
   - "How much?" → Already answered in pitch. If they push back, stand firm: "That's the Tier 1 price, and it includes everything. But if budget's the constraint, we can talk about a 6-month plan instead of month-to-month."

   See "Objection Handling Quick Reference" guide for more.

6. **Close:**
   If they're hot:
   - "Let's get you set up. Here's what happens next: You send me a $[AMOUNT] to get started. That covers the site setup, domain transfer, and 30 days of hosting. I'll have you live in 24-48 hours. After that, it's $[MONTHLY] per month. Sound good?"
   - Send invoice via email immediately after call

   If they need more time:
   - "No problem. Here's what I'll do: I'll hold your slot until [DATE]. After that, I need to move on to the next client. So if you want to move forward, just reply to this email and I'll send the invoice."
   - Send a follow-up email 3 days later if they don't respond

7. **Update Tracker:**
   - Mark lead as "Closed — Invoice Sent" or "Closed — Awaiting Payment"
   - Add revenue amount
   - Set reminder for follow-up invoice in 7 days if unpaid

**Outputs:**
- Invoice sent (if they said yes)
- Follow-up scheduled (if they need time)
- Lead moved to "Awaiting Payment" or "Follow-Up Queue"

**Success Criteria:**
- Call is 10-15 minutes (not longer; you're not a consultant yet)
- 20-30% of calls result in immediate closes
- 40%+ of calls result in follow-ups (not maybes)

---

### SOP 6: NEW CLIENT ONBOARDING

**Trigger:** Client says yes and pays setup fee

**Inputs:**
- Signed agreement (or invoice acknowledged)
- Payment received
- Business info (name, phone, address, services)
- Domain they want (or we buy one for them)

**Steps:**

1. **Send Welcome Packet (same day, within 4 hours):**

   Subject: "Welcome to [Your Agency] — Let's Get Live!"

   ```
   Hi [CLIENT_NAME],

   Excited to get [BUSINESS_NAME] online!

   Here's what happens next:

   1. TOMORROW: I'll send you a domain questionnaire (what domain name do you want? Is it available?)
   2. Once domain is ready (2-3 days): Full site preview for your review
   3. You approve: We connect your domain and go live (24 hours)
   4. Day 7: I'll check in to make sure everything's running smoothly

   In the meantime, reply with:
   - Preferred domain name (e.g., "joesplumbing.com")
   - 2-3 current Google reviews you want featured on the site
   - Any specific colors or branding you want

   Questions? Just reply to this email.

   — Benjamin
   ```

2. **Collect Business Info:**
   - Domain preference (buy if not available)
   - Google reviews (for social proof on the site)
   - Branding preferences (colors, logo if they have one)
   - Any specific copy updates (services, hours, etc.)

3. **Customize the Site:**
   - Take your demo site
   - Update with any final customizations they requested
   - Swap in their real domain name (instead of subdomain)
   - Deploy new version

4. **Connect Domain:**
   - Go to their domain registrar (Namecheap, GoDaddy, etc.)
   - Add CNAME record pointing to Netlify
   - Wait for DNS to propagate (5 minutes to 2 hours)
   - Test: Type their domain into browser, confirm site loads

5. **Send Final Preview:**
   - Email them the live site URL (their real domain)
   - Ask for final approval
   - "Any tweaks needed before we move to maintenance mode?"

6. **Go Live Confirmation Email:**

   ```
   Subject: You're Live! 🚀

   Hi [CLIENT_NAME],

   [BUSINESS_NAME] is now live at [DOMAIN].com

   Here's what's included in your $149/month plan:
   - Hosting (unlimited traffic, 99.9% uptime)
   - Maintenance (I'll handle any updates)
   - SSL certificate (secure connection)
   - Mobile optimization
   - Monthly check-in

   Your first invoice is due [DATE].

   Over the next 30 days, I'll monitor your site performance and send you a report on:
   - Page load time
   - Mobile usability
   - SEO basics

   Any questions, just reply to this email.

   — Benjamin
   ```

7. **Set Calendar Reminder:**
   - 7 days after go-live: Send first check-in email
   - 30 days after go-live: Send first monthly report + renewal invoice

8. **Update Tracker:**
   - Mark as "Live"
   - Add to "Active Clients" section
   - Add monthly recurring revenue (MRR) amount

**Outputs:**
- Live website on their domain
- Client onboarded and informed
- First invoice sent
- 7-day reminder set

**Success Criteria:**
- Site goes live within 48 hours of approval
- Domain connects without issues
- Client receives go-live confirmation email
- Zero support complaints in first week

---

### SOP 7: MONTHLY CLIENT MAINTENANCE

**Trigger:** 1st of each month

**Inputs:**
- List of active clients
- Their service tier (Tier 1/2/3)

**Steps:**

1. **Invoice Sending:**
   - Open your "Active Clients" sheet
   - For each client, send monthly invoice with:
     - "Invoice — Website Maintenance — [MONTH]"
     - Amount due (their monthly plan price)
     - Due date (15 days from invoice date)
     - Payment link
   - Example: "Invoice for [BUSINESS_NAME] — March maintenance. Due March 15. [PAYMENT_LINK]"

2. **Apply Monthly Content Updates (Tier 2 & 3 only):**

   **Tier 1:** No update. Site stays as-is.

   **Tier 2:** Update one section (e.g., "Check out our new service," or add a blog post about seasonal tips)

   **Tier 3:** Full monthly refresh (new blog post, update 1-2 service pages, add new customer reviews)

3. **Generate & Send Monthly Reports:**

   **Tier 1 clients:** No report. Just a "thanks for being a client" message.

   **Tier 2 clients:** One-page report with:
   - Website traffic (page views, unique visitors)
   - Top landing page
   - Mobile vs. desktop traffic
   - One recommendation for next month

   **Tier 3 clients:** Full performance report:
   - Traffic metrics (same as Tier 2)
   - Search engine rankings (top 5 keywords)
   - Review activity (new reviews added, average rating)
   - Call volume estimation (based on traffic)
   - Recommendations for next month

4. **Check Site Uptime & Performance:**
   - Open each client's site
   - Confirm it loads in <3 seconds
   - Check for broken links or images
   - If any issues found, fix immediately (no charge)

5. **Send Monthly Client Check-In Email:**

   ```
   Subject: March Update — [BUSINESS_NAME]

   Hi [CLIENT_NAME],

   March recap for [BUSINESS_NAME]:

   Traffic: [NUMBER] visitors
   Top page: [PAGE_NAME]
   Site status: ✅ All systems go

   I've also [UPDATED SERVICE PAGES / ADDED NEW BLOG POST / OPTIMIZED REVIEWS].

   Anything you'd like to update this month? Just reply.

   — Benjamin
   ```

**Outputs:**
- All invoices sent
- Content updates applied (Tier 2/3)
- Reports generated and sent (Tier 2/3)
- Uptime verification completed

**Success Criteria:**
- 100% of active clients invoiced on the 1st
- Zero overdue invoices after 30 days
- All sites running without issues
- Tier 2/3 clients receive detailed reports

---

### SOP 8: CLIENT CANCELLATION

**Trigger:** Client requests cancellation

**Inputs:**
- Cancellation request (email or message)
- Current plan tier and MRR
- Reason for cancellation (if provided)

**Steps:**

1. **Acknowledge & Clarify:**
   - Reply within 4 hours
   - "Hi [CLIENT_NAME], I got your message about canceling. Before we do that, let me ask a few quick questions..."

2. **Dig for the Real Reason:**
   - "What's driving this decision?"
   - "Is it budget?" (offer discount)
   - "Is it something with the site?" (offer to fix)
   - "Are you scaling down?" (offer to pause instead of cancel)

3. **Offer Retention Discounts:**
   - If it's budget: "What if I reduce it to $99/month for the next 3 months?"
   - If it's service issues: "Let me fix whatever's wrong. I'll give you 50% off this month."
   - If it's inactivity: "What if we pause it for 3 months instead? You can restart anytime."

4. **If They Still Want to Cancel:**
   - Confirm 30-day notice (required in most contracts)
   - Example: "Okay, I understand. Per our agreement, I'll need 30 days notice. So cancellation is effective [DATE]. Sound good?"

5. **Process Cancellation:**
   - Mark them as "Canceling" in your tracker
   - Set reminder for 30 days out to:
     - Stop billing
     - Archive their site (move it to a subfolder or keep as backup)
     - Send final invoice
   - Send this email:

   ```
   Subject: [BUSINESS_NAME] — Cancellation Confirmation

   Hi [CLIENT_NAME],

   Confirmed: Your site maintenance will end on [DATE].

   Here's what happens:
   1. Final invoice due [DATE] (for prorated remainder of this month)
   2. Your site will remain online for 30 days after cancellation (you can download it anytime)
   3. After 30 days, the site goes offline

   If you ever want to reactivate, just let me know. Getting you back online takes 10 minutes.

   Thanks for letting me help [BUSINESS_NAME].

   — Benjamin
   ```

6. **Exit Offer:**
   - "By the way — if you ever need a website again or know another [NICHE] who needs one, just send them my way."
   - Note them as a "Past Client — Good Standing" in your tracker

7. **Update Tracker:**
   - Move from "Active Clients" to "Canceled Clients"
   - Note the reason (budget, inactivity, solved problem, etc.)
   - Record the MRR lost

**Outputs:**
- Cancellation confirmed
- 30-day notice period started
- Final invoice sent
- Client relationship maintained (for referrals)

**Success Criteria:**
- Retention offered (at least one discount option)
- Cancellation processed without friction
- Client leaves on good terms (opens door to referrals or re-engagement)

---

## PART 3: KPI DASHBOARD (what to track)

Track these metrics daily, weekly, and monthly. They tell you if the machine is working.

### DAILY METRICS

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Emails sent | 50-100 | Volume indicator; tells you if you're being consistent |
| Demo sites built | 5-10 | Speed indicator; 15-20 min per site is the goal |
| Replies received | 2-5 | Early indicator of campaign health; low replies = problem |
| Warm leads (hot + warm) | 1-3 | Qualified leads; these are the ones to call |
| Calls scheduled | 1-2 | Closing velocity; without calls, no revenue |

**How to track:** Spreadsheet with one row per day. Spend 2 minutes at end of day filling it in.

---

### WEEKLY METRICS

| Metric | Target | Formula |
|--------|--------|---------|
| Total emails sent | 250-500 | Sum of daily emails |
| Reply rate (%) | 5-10% | Total replies / Total emails sent |
| Call booking rate (%) | 30-50% | Calls scheduled / Warm leads |
| Clients closed | 2-5 | New clients who said yes |
| Weekly revenue | $2,000-7,500 | Sum of setup fees + MRR for new clients |
| Email open rate (%) | 35-45% | Instantly dashboard |
| Email click rate (%) | 3-5% | Instantly dashboard |

**How to track:** Friday morning, fill in "Weekly Report" tab in your spreadsheet.

---

### MONTHLY METRICS

| Metric | Target | Formula | Action If Missed |
|--------|--------|---------|------------------|
| MRR (Monthly Recurring Revenue) | $1,000+ | Sum of all active clients x monthly fee | Increase cold outreach volume |
| New clients closed | 8-20 | Sum for the month | Increase emails sent or improve call close rate |
| Customer Acquisition Cost (CAC) | <$250 | Total marketing spend / New clients | Tool spend is too high or close rate is too low |
| Lifetime Value (LTV) | >$3,000 | Average client lifetime (months) x monthly fee | Price may be too low or churn too high |
| Churn rate (%) | <10% | Clients canceled / Previous month's active clients | Client satisfaction issue; fix before hiring |
| Revenue per client (month 1) | $1,150+ | Setup fee / 1 month spread + monthly fee | Pricing may need adjustment |

**How to track:** Spreadsheet tab called "Monthly Dashboard." Fill in on the 1st of each month.

---

## PART 4: ESCALATION PROCEDURES

What to do when things break.

### Escalation 1: Site Goes Down

**Detection:** Client calls or emails: "My site isn't loading"

**Immediate Action (within 5 minutes):**
1. Check Netlify status: Is Netlify down? (check netlify.com/status)
2. Try opening the site yourself from multiple devices
3. Check DNS: Is the domain pointing to Netlify correctly? (use nslookup)
4. Check Netlify dashboard: Are there deploy errors?

**If Netlify is down:**
- Email client: "Netlify (our hosting provider) is experiencing a brief outage. Should be back within 30 minutes. I'll monitor and send you an update."

**If DNS is broken:**
- Go to domain registrar (Namecheap, etc.)
- Verify CNAME record is correct
- Re-add if needed
- Wait for DNS propagation (up to 2 hours)
- Email client: "There was a DNS routing issue. I've fixed it. Site should be back within 2 hours. I'll confirm once it's live."

**If there's a deploy error in Netlify:**
- Check the error log
- Redeploy the previous working version
- Fix the error (or call Claude)
- Email client: "Brief hiccup on my end. Redeployed. You're back live now."

**Follow-up (within 24 hours):**
- Send email: "Sorry about that. Everything's solid now. I'm adding monitoring alerts so I catch issues like this automatically next time."

**Prevention:**
- Set up Netlify alerts (Status → Email alerts for deploy failures)
- Check all client sites weekly (Monday morning, 5-minute sweep)

---

### Escalation 2: Unhappy Client

**Detection:** Angry email, low rating, or support request with frustrated tone

**Immediate Action (within 2 hours):**
1. READ the email fully. Understand the specific complaint.
2. DON'T respond yet. Wait 30 minutes. Re-read. Take notes on what they actually want.
3. Identify the core issue:
   - Site technical issue? (down, broken link, wrong content)
   - Communication issue? (didn't know how to do something, felt ignored)
   - Expectation issue? (thought they'd get more for the price)
4. Response template:

   ```
   Subject: Let's Fix This — [CLIENT_NAME]

   Hi [CLIENT_NAME],

   I got your email, and I hear you. [SPECIFIC ISSUE] is not acceptable, and I'm going to fix it personally.

   Here's what I'm doing right now:
   1. [SPECIFIC FIX — e.g., "Redeploying the site with the correct phone number"]
   2. [TIMELINE — e.g., "Should be live within 2 hours"]
   3. [FOLLOW-UP — e.g., "I'll call you tomorrow to confirm everything's working"]

   I apologize for the frustration. This is on me.

   — Benjamin
   ```

5. DO the fix immediately. Don't wait.

6. Follow-up call (next day):
   - "Hey [CLIENT_NAME], just wanted to confirm the fix is working on your end."
   - Listen to their response.
   - If satisfied: "Thanks for being patient. I'm adding an extra check to prevent this. You won't have this issue again."
   - If still not satisfied: Offer 50% off next month.

**Prevention:**
- Over-deliver in month 1 (extra attention = prevents escalations)
- Check in week 1 after go-live
- Respond within 2 hours to all support requests

---

### Escalation 3: Email Deliverability Drops

**Detection:** Open rate falls below 25%, bounce rate rises above 5%, or Gmail/Outlook complaints appear

**Immediate Action (within 1 hour):**

1. Check Instantly dashboard:
   - Bounce rate (target: <2%)
   - Spam complaints (should be 0)
   - Authentication status (SPF, DKIM, DMARC should all show "Passing")

2. Check postmaster.google.com:
   - Go to Security → Authentication
   - Look for SPF/DKIM issues
   - Look for bounce or spam complaint spikes

3. If SPF/DKIM is failing:
   - Go to your domain registrar
   - Verify SPF record is correct (see DNS guide)
   - Verify DKIM record is correct
   - Wait 30 minutes for DNS to propagate

4. If bounce rate is high:
   - Sample 10 bounced emails
   - Are they typos (easy fix)? Or invalid addresses (list quality)?
   - If list quality: Run next batch through email verification tool (ZeroBounce, RocketReach)

5. If open rate is low (25-30%):
   - A/B test subject lines (test 2 variations on next batch)
   - Check timing: Are emails sending at good times? (9 AM EST is typically best)
   - Check: Have you been sending from same domain for 14+ days? New domains need warm-up.

6. If spam complaints spike:
   - PAUSE all campaigns immediately
   - Email all recipients: "We noticed some people marked our emails as spam. We're cleaning up our list and will be much more targeted going forward. If you don't want to hear from us, just reply 'unsubscribe.'"
   - Reduce sending volume by 50% for next 2 weeks
   - Focus on higher-quality, smaller lists

**Prevention:**
- Monitor postmaster.google.com weekly
- Warm-up is 14 days; don't skip it
- Keep bounce rate tracking dashboard (max bounce is 3%)
- Never send to purchased lists; only send to organic leads

---

### Escalation 4: You Hit Capacity

**Detection:** You can't keep up with incoming leads, calls, or client requests

**Immediate Action (within 1 week):**

1. **Assess the bottleneck:**
   - Too many leads to build demo sites? (Site Factory bottleneck)
   - Too many calls scheduled? (Sales/Closing bottleneck)
   - Too many clients requiring support? (Client Service bottleneck)

2. **For Site Factory bottleneck:**
   - Automate: Use Claude to batch-generate HTML sites instead of Lovable (drops build time to 5-10 min)
   - Outsource: Hire a VA for 10 hours/week to clone templates in Lovable ($40-50/week on OnlineJobs.ph)
   - Reduce: Focus on top 2 niches instead of 5 (more templates perfected = faster builds)

3. **For Sales bottleneck:**
   - You're winning! This is good.
   - Don't hire a salesperson yet (Month 2-3 move)
   - For now: Raise pricing (move from $997 to $1,497) to reduce volume while increasing revenue

4. **For Client Service bottleneck:**
   - Hire a VA for 5 hours/week to handle routine updates, invoicing, check-ins ($20-25/week)
   - Create a client support playbook (routine questions get template responses)

**Prevention:**
- Before hiring anyone, document what they'd do (don't hire for vague reasons)
- Hire when you've proved demand exists (Month 2+, not Month 1)
- Automate before you hire (scripts > people in early stages)

---

## PART 5: SCALING PLAYBOOK

What to do at each growth milestone.

### MILESTONE 1: First 5 Clients (Week 3-4)

**What it means:** You've closed first 5 clients. Revenue: ~$5,000-7,500 setup + $750/mo MRR.

**What to do:**
- Take a weekend off. You earned it.
- Review what worked: Which niches converted best? Which cities? Which email subject lines?
- Double down on what worked: Next week, focus 80% of your effort on the top-converting niche + city combo.
- Keep the machine running: Continue daily 2-hour routine. Don't change anything yet.

**Signs you're ready to move to next milestone:** You can consistently close 2-3 clients per week without extra effort.

---

### MILESTONE 2: 10 Clients (Week 5-6)

**What it means:** Revenue: ~$15,000-20,000 setup + $1,500/mo MRR. Your tool costs are now covered 5x over.

**What to do:**
- Review churn: Are any clients canceling? If yes, call them and fix the issue before it spreads.
- Expand niches: You've nailed 1-2 niches. Pick 2-3 new niches to test (same city).
- Expand cities: Test 1-2 new cities (same proven niche).
- Document your winning playbook: Write down exactly what worked for these first 10. This becomes your template.

**Consider hiring:** A part-time VA ($3-5/hr, 10 hours/week) to handle:
- Lead scraping (Outscraper → Google Sheet)
- Demo site cloning (takes the most time)
- Client invoicing and reminders

**Capacity check:**
- Can you personally handle 20 clients' monthly maintenance? Yes (1 hour/week per client = 20 hours/week)
- Can you personally close 20-30 new leads per month? Getting tight. This is where a VA helps (they handle the grunt work, you close).

---

### MILESTONE 3: 20 Clients (Month 2)

**What it means:** Revenue: ~$30,000-50,000 cumulative + $3,000/mo MRR. You've proven the model.

**What to do:**
- Formalize your tiers: Offer Tier 1/2/3 pricing officially. Probably 60% are Tier 1, 30% Tier 2, 10% Tier 3. That's healthy.
- Hire a Virtual Assistant full-time (~20 hours/week):
  - Lead scraping and qualification
  - Demo site building (using your templates)
  - Client invoicing and check-ins
  - Basic support questions
  - You do: sales calls, customization, strategy

- Build your master playbook document (this SOP you're reading, but customized to your niche/market)

- Evaluate tool spend vs. ROI:
  - Instantly.ai ($37): Worth it? (should have 10-20x return)
  - Lovable ($50): Worth it? (probably)
  - Domains + Google Workspace ($14-20): Cheap
  - Outscraper ($15+): Getting expensive?

  Consider: Should you switch from Outscraper (pay-per-lead) to a subscription model (monthly flat fee)?

---

### MILESTONE 4: 30-40 Clients (Month 3)

**What it means:** Revenue: ~$50,000-100,000 cumulative + $4,000-6,000/mo MRR. This is a real business.

**What to do:**
- You can't do all the sales calls anymore. Hire a salesperson (commissioned-based: 20% of setup fees they close).
  - They only close calls; you still do the lead generation and demo site building
  - Expected: They close 15-20 leads/month
  - Cost to you: ~$3,000-4,000/month (but they generate $15,000-20,000 new revenue, so ROI is 4-5x)

- Tier 2 & 3 upsell: Create a "6-month review" process. For clients who've been with you 30+ days, reach out with upsell to higher tier (e.g., "Your site's getting traction — want to unlock SEO features?")
  - Target: Convert 30% of Tier 1 clients to Tier 2 (adds $100/month per client)
  - That's +$300-1,000/mo in incremental revenue

- Add revenue streams:
  - Google Workspace resale ($29/month, your cost $7 = $22/month profit)
  - Local SEO add-on ($297 setup + $97/month)
  - Review management ($49/month)
  - Social media profile setup ($197)

- Consider CRM: GoHighLevel ($97/mo) becomes worth it. Consolidates: invoicing, SMS follow-up, client portal, email campaigns. Replaces 3-4 other tools.

---

### MILESTONE 5: 50+ Clients (Month 4-6)

**What it means:** Revenue: $200,000+ cumulative + $7,000-10,000+/mo MRR. You're at 6-figure annual revenue.

**What to do:**
- Hire a developer/designer part-time (10 hours/week, ~$2,000/month) to:
  - Build custom sites for high-tier clients (Dominate tier)
  - Improve template system
  - Automate site deployment

- Hire a second salesperson (if first one is closing 20/month). Now you have capacity for 40+ new clients/month.

- Build out Tier 3 services aggressively:
  - Full local SEO (keyword research, optimization, backlinks)
  - Review management automation (tools like Trustpilot, Google Review Links)
  - Social media content (1-2 posts/month per client)
  - Monthly performance reports

- Consider specializing: Pick your #1 niche (e.g., "Plumbers") and become THE plumber website agency in your region. This is where 7-figure agencies start.

---

### Hiring Priority Order

**Month 1:** You, just you. Prove the model.

**Month 2:** Part-time VA for lead scraping + site building (~10 hours/week, $50-75/week)

**Month 3:** Full-time VA + commissioned salesperson (~40 hours/week VA + 0.5-1 FTE salesperson)

**Month 4-6:** Developer + second salesperson

**Month 6+:** Operations manager (to handle everything except sales + strategy)

---

## PART 6: AUTOMATION OPPORTUNITIES (Scripts Claude Can Build)

These are projects for future sessions. Each saves 5-10 hours/week once built.

### Automation 1: Lead Scraping Script

**What it does:** Calls Outscraper API automatically, filters results, appends to your Google Sheet.

**How you'd use it:** `python scraper.py plumber austin`
Result: 100 new qualified leads in your sheet, ready for site building.

**Time saved:** 45 min/week (currently manual)

---

### Automation 2: Niche-Specific Site Prompts

**What it does:** A library of templated Lovable prompts for each niche. You fill in 5 blanks, run the script, and it generates + deploys the site.

**How you'd use it:** `python build_site.py --niche plumber --business "Joe's Plumbing" --phone "555-1234" --address "Austin, TX"`
Result: Live demo site on your subdomain in 3 minutes.

**Time saved:** 30-45 min/week (currently 15-20 min per site, this drops to 3-5 min)

---

### Automation 3: Email Personalizer

**What it does:** Takes a CSV of leads and generates all 5 personalized emails with their name, business, demo site URL, reviews embedded.

**How you'd use it:** `python emailgen.py --input leads.csv --output ready_for_instantly.csv`
Result: CSV ready to upload to Instantly with all 5 emails pre-written and personalized.

**Time saved:** 1-2 hours/week (email personalization is currently manual)

---

### Automation 4: Client Onboarding Automation

**What it does:** When you mark a lead as "Closed," it auto-generates:
- Welcome email
- Domain checklist
- DNS setup instructions
- Invoicing template
- Calendar reminders (7-day check-in, 30-day renewal)

**How you'd use it:** Mark lead as "Closed" in your sheet → Script runs → You get a folder with everything pre-done.

**Time saved:** 30 min per client x 20 clients/month = 10 hours/month

---

### Automation 5: Weekly Report Generator

**What it does:** Pulls data from Instantly (campaign stats), Google Sheets (lead tracker), and generates a one-page report:
- Leads generated this week
- Sites built
- Emails sent + open rate + reply rate
- Calls booked + close rate
- Revenue (setup + MRR)
- Top converting niche/city
- Action items for next week

**How you'd use it:** `python weekly_report.py`
Result: Report.pdf in your Outputs folder.

**Time saved:** 30 min/week (currently manual)

---

### Automation 6: Review Scraper

**What it does:** Takes a business name + location, scrapes their actual Google reviews, and pulls the top 3-5 for use in demo sites.

**How you'd use it:** `python scrape_reviews.py --business "Joe's Plumbing" --city "Austin"`
Result: 5 real reviews ready to drop into Lovable.

**Time saved:** 5 min per site x 20 sites/month = 1.5 hours/month

---

## PART 7: DAILY CHECKLIST

Print this out. Check off items as you go.

### MORNING (1 hour)

- [ ] Review Instantly dashboard (open rate, reply rate)
- [ ] Respond to warm leads (HOT within 30 min, WARM within 2 hours)
- [ ] Check client support inbox
- [ ] Build 1-2 demo sites
- [ ] Update lead tracker spreadsheet

### AFTERNOON (1 hour)

- [ ] Scrape new leads (one niche-city combo)
- [ ] Qualify leads (remove chains, verify contact info)
- [ ] Load qualified leads into outreach queue (in Instantly)
- [ ] Client work or admin (updates, invoices, follow-ups)

### WEEKLY (Friday, 30 min)

- [ ] Update weekly report (totals, metrics, A/B results)
- [ ] Review campaign performance (what converted best?)
- [ ] Plan next week's niche-city targets
- [ ] Send referral program reminder to clients

### MONTHLY (1st, 1 hour)

- [ ] Invoice all active clients
- [ ] Review monthly financials
- [ ] Evaluate tool spend vs. ROI
- [ ] Send monthly reports (Tier 2/3 only)
- [ ] Apply content updates (Tier 2/3 only)

---

## SUMMARY

**What this SOP does:** Gives you a daily, weekly, and monthly routine that turns leads into revenue on autopilot.

**What to do next:**
1. Print the Daily Checklist. Put it on your desk.
2. Start with the Morning Block tomorrow. Hit the metrics.
3. After 2 weeks, you'll have 20-30 demo sites and 2-5 clients. Then scale.

**The philosophy:** Speed > Perfection. Your first sites don't need to be beautiful; they need to work and get customers. Optimize after you've proven the model. The best SOPs are ones you follow exactly once, then improve based on what you learned.

**Final note:** These SOPs are guides, not laws. After 30 days, you'll spot ways to improve them. Document those improvements and use them. The goal is to have a system so automatic that you can run the agency on your phone, from anywhere, in 2 hours a day.

— Benjamin Rodriguez

