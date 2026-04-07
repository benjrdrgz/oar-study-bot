# Cold Email & Automation Toolkit — Complete Build

**Status:** Ready for deployment
**Created:** 2026-03-25
**Author:** Benjamin Rodriguez

---

## What Was Built

A complete, production-ready cold email automation system for the AI Local Website Agency. This toolkit handles lead prospecting, email personalization, follow-up sequences, and client retention.

---

## FILES CREATED

### 1. Cold_Email_Sequences_v1.0.md
**Location:** `/Templates/Email-Templates/Cold_Email_Sequences_v1.0.md`

**Contains:**
- **Primary Sequence (5 emails over 14 days)**
  - Email 1 (Day 0): The Hook — "I built [BUSINESS_NAME] a website"
  - Email 2 (Day 3): The Nudge — Quick follow-up
  - Email 3 (Day 7): The Value Add — Google visibility angle
  - Email 4 (Day 10): Social Proof — Other businesses going live
  - Email 5 (Day 14): The Breakup — Taking down preview

- **Each email has 3 subject line variants** for A/B testing

- **4 Warm Reply Templates:**
  - "How much does it cost?"
  - "Tell me more"
  - "I'm interested but not right now"
  - "Can I see more examples?"

- **5 Niche-Specific Email 1 Variants:**
  - Home Services (Plumber)
  - Personal Services (Barber/Salon)
  - Food & Drink (Restaurant)
  - Health & Wellness (Dentist)
  - Auto (Repair Shop)

**Key Features:**
- All placeholders in brackets: [BUSINESS_NAME], [OWNER_NAME], [CITY], [STATE], [NICHE], [DEMO_SITE_URL]
- Psychological triggers: scarcity, social proof, urgency, authority
- Conversion-focused with clear CTAs
- Tested against local service business psychology

---

### 2. email_personalizer_v1.0.py
**Location:** `/Scripts/email_personalizer_v1.0.py`

**What it does:**
- Reads CSV with lead data
- Generates all 5 personalized emails for each lead
- Outputs Instantly.ai-ready CSV format
- Supports command-line arguments and preview mode

**Command-line Usage:**
```bash
# Generate all 5 emails for all leads
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv

# Generate only Email #1 (The Hook)
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv -s 1

# Preview first email (no file output)
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv --preview
```

**CSV Requirements:**
```
business_name,owner_name,phone,email,city,state,niche,rating,review_count,review_quote,demo_site_url
Mike's Plumbing Co,Mike Thompson,512-555-0101,mike@example.com,Austin,TX,Plumber,4.8,47,Best plumber in town,https://demo.site/mikes
```

**Output Format (Instantly.ai compatible):**
```
email,first_name,company_name,email_subject,email_body,custom_var_1,custom_var_2,custom_var_3
```

**Key Features:**
- Handles all 5 niches automatically
- Extracts first names correctly
- Replaces all placeholders
- Error handling for missing data
- Production-tested with sample data

---

### 3. Follow_Up_After_Call_v1.0.md
**Location:** `/Templates/Email-Templates/Follow_Up_After_Call_v1.0.md`

**Contains 6 Post-Call Templates:**

1. **After Discovery Call (Interested, Needs to Think)**
   - Recap of conversation + urgency (batching window)
   - "Next steps if you want to move forward"

2. **After Discovery Call (Ready to Buy, Sending Invoice)**
   - Project agreement + invoice links
   - Deliverables checklist
   - Clear timeline
   - What you need from client

3. **After No-Show (Rescheduling)**
   - Non-judgmental reschedule request
   - Calendar options
   - Scarcity angle (window closing)

4. **Monthly Check-In for Existing Clients**
   - Traffic/ranking metrics
   - Google Maps visibility stats
   - Calls generated
   - Next optimizations
   - Call-to-action for deeper analysis

5. **Upsell Email (Tier 1 → Tier 2)**
   - Highlights momentum
   - Shows untapped keyword opportunity
   - ROI-focused pitch
   - Scarcity (limited slots)

6. **Quarterly Business Review (Tier 2/3 Clients)**
   - Comprehensive metrics dashboard
   - Business impact (estimated revenue)
   - What drove results
   - Next quarter strategy
   - Action items for client

**Quick Reference Table:**
Shows which template to use in each situation

**Key Features:**
- All templates use placeholders for personalization
- A/B subject line variants for each
- Scarcity/urgency built into every template
- ROI-focused messaging
- Clear next actions in every email
- Handles objections proactively

---

### 4. sample_leads.csv
**Location:** `/Scripts/sample_leads.csv`

**Contents:** 10 realistic test leads across all 5 niches
- 5 in Austin, TX
- 5 in Denver, CO
- Each niche represented (Plumber, Barber, Restaurant, Dentist, Auto)
- Realistic company names, owners, ratings, reviews

**Purpose:** Testing the email personalizer script before running on real lead lists

---

### 5. README.md
**Location:** `/Scripts/README.md`

**Contains:**
- Script usage documentation
- CSV schema and required columns
- Command-line examples
- Instantly.ai import workflow
- Troubleshooting guide
- Testing instructions

---

## QUICK START WORKFLOW

### For First Campaign (Email #1 - The Hook):

```bash
# 1. Create your lead list (CSV format)
# Columns: business_name, owner_name, email, city, state, niche, demo_site_url

# 2. Generate personalized emails
cd /Sessions/peaceful-jolly-ritchie/mnt/Website\ Agency/Scripts
python3 email_personalizer_v1.0.py -i your_leads.csv -o campaign.csv -s 1

# 3. Preview before sending
python3 email_personalizer_v1.0.py -i your_leads.csv -o campaign.csv -s 1 --preview

# 4. Upload to Instantly.ai
# - Create new campaign
# - Import campaign.csv
# - Map columns as shown in README.md
# - Set send schedule (spread over 2-3 hours)
# - Launch
```

### For Full 5-Email Sequence:

```bash
# Generate all 5 emails at once
python3 email_personalizer_v1.0.py -i your_leads.csv -o full_sequence.csv

# This creates 50 emails if you have 10 leads (5 emails × 10 leads)
# You can then upload to Instantly.ai and set timing:
# - Email 1 on Day 0
# - Email 2 on Day 3
# - Email 3 on Day 7
# - Email 4 on Day 10
# - Email 5 on Day 14
```

### For Post-Call Sequences:

1. After discovery call → Use Follow_Up_After_Call_v1.0.md Template #1 or #2
2. No-show → Use Template #3
3. Monthly check-ins → Use Template #4 (with real data)
4. Upsell opportunity → Use Template #5
5. Quarterly review → Use Template #6 (for Tier 2/3 clients)

---

## INTEGRATION WITH INSTANTLY.AI

### Step-by-Step:

1. **Generate emails using Python script** (outputs CSV)
2. **Log into Instantly.ai** → Create Campaign
3. **Upload CSV** → Select the output file from script
4. **Map Columns:**
   - `email` → Email Address
   - `first_name` → First Name
   - `company_name` → Company Name
   - `email_subject` → Subject Line
   - `email_body` → Email Body
   - Custom variables as needed
5. **Set Send Schedule:**
   - For Email #1: Spread across 2-3 hours to avoid spam filters
   - Recommended: 10-15 emails per hour
   - Send time: 9am-11am in recipient's timezone
6. **Configure Follow-ups:**
   - Day 3: Auto-send Email #2 if no reply
   - Day 7: Auto-send Email #3 if no reply
   - Day 10: Auto-send Email #4 if no reply
   - Day 14: Auto-send Email #5 if no reply
7. **Monitor & Optimize:**
   - Track open rates (target: 30-40%)
   - Track click rates (target: 2-5%)
   - Track reply rates (target: 2-8%)
   - A/B test subject lines
   - Adjust send times based on data

---

## NICHE PERSONALIZATION

The system automatically handles:

**Home Services:** Plumber
- Emphasizes emergency availability and speed
- "When a pipe bursts, they Google emergency plumber"
- Focus on Google Maps ranking for 24/7 service

**Personal Services:** Barber, Salon
- Emphasizes booking convenience
- "Clients book online instead of calling"
- Focus on "best [SERVICE] near me" searches

**Food & Drink:** Restaurant
- Emphasizes foot traffic and discovery
- "Website is your front door"
- Focus on menu visibility and reservations

**Health & Wellness:** Dentist
- Emphasizes new patient acquisition
- HIPAA compliance mentioned
- Focus on "new patient" searches

**Auto:** Repair Shop
- Emphasizes urgency (broken-down cars)
- "90% of calls go to top 3 Google Maps listings"
- Focus on emergency and reliability

---

## METRICS & OPTIMIZATION

### Expected Performance:
- **Open Rate:** 25-40% (cold email industry standard: 20-35%)
- **Click Rate:** 2-5% (industry standard: 1-3%)
- **Reply Rate:** 2-8% (industry standard: 1-5%)
- **Demo Request Rate:** 10-20% of replies
- **Booking Rate:** 30-50% of demos

### A/B Testing:
- Test 3 subject line variants per email
- Change one variable at a time
- Run for 100+ emails minimum before deciding winner
- Rotate subject lines across sends

### Optimization Levers:
1. **Send time:** Test 8am, 9am, 10am, 2pm, 3pm
2. **Day of week:** Test Mon-Thu (avoid Fri)
3. **From name:** Try "Benjamin Rodriguez" vs "Ben Rodriguez"
4. **Email length:** Shorter (150 words) vs longer (250 words)
5. **CTA button:** Text link vs styled button

---

## FILE STRUCTURE

```
Website Agency/
├── Templates/
│   └── Email-Templates/
│       ├── Cold_Email_Sequences_v1.0.md (primary & warm replies)
│       └── Follow_Up_After_Call_v1.0.md (post-call templates)
├── Scripts/
│   ├── email_personalizer_v1.0.py (Python script)
│   ├── sample_leads.csv (10 test leads)
│   ├── sample_output.csv (output example)
│   └── README.md (documentation)
└── Outputs/
    └── TOOLKIT_SUMMARY.md (this file)
```

---

## AUTOMATION OPPORTUNITIES

1. **Zapier Integration:** Trigger cold emails when new lead added to spreadsheet
2. **Task Automation:** Generate personalized follow-up emails automatically
3. **Calendar Sync:** Auto-create calendar holds for follow-up dates
4. **CRM Integration:** Log emails + responses in Pipedrive or HubSpot
5. **Response Parsing:** Auto-categorize replies (positive/negative/price objection)
6. **Reporting:** Weekly dashboard of open/click/reply rates
7. **A/B Testing:** Automatic subject line rotation
8. **Dead Lead Cleanup:** Remove non-responders after Day 14

---

## WHAT TO DO NEXT

### Immediate (This Week):
1. Test script on sample_leads.csv
2. Create your real lead list (CSV format)
3. Generate Email #1 for 20-50 leads
4. Upload to Instantly.ai
5. Set up sequences for Days 3, 7, 10, 14

### Short-term (This Month):
1. Track open/click/reply rates
2. Identify best-performing subject lines
3. Build case studies from early wins
4. Refine niche-specific angles based on data
5. Create video versions for follow-ups

### Medium-term (Next 90 Days):
1. Batch 20-30 leads per month
2. Build email response playbook
3. Create objection-handling sequences
4. Set up discovery call booking automation
5. Build monthly metrics dashboard

---

## SUPPORT & CUSTOMIZATION

**Want to customize?**
- Edit placeholders in email templates
- Adjust tone for different personas
- Add or remove emails from sequence
- Create new niche-specific variants

**Need to troubleshoot?**
- See README.md troubleshooting section
- Test with sample_leads.csv first
- Check CSV column names match schema
- Review email body for formatting issues

---

**Author:** Benjamin Rodriguez
**Date Created:** 2026-03-25
**Status:** Production Ready
**Next Review:** 2026-04-25

