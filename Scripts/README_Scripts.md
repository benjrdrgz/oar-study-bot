# Email Automation Scripts

v1.0 — Scripts for cold email generation, personalization, and campaign management

---

## Overview

This folder contains automation tools for the AI Local Website Agency cold email and follow-up campaigns. All scripts are designed to integrate with Instantly.ai and other email marketing platforms.

---

## email_personalizer_v1.0.py

### Purpose
Converts lead CSV data into personalized, Instantly.ai-ready email sequences.

### Requirements
- Python 3.7+
- CSV file with lead data (see schema below)

### Lead CSV Schema
```
business_name,owner_name,phone,email,city,state,niche,rating,review_count,review_quote,demo_site_url
Mike's Plumbing Co,Mike Thompson,512-555-0101,mike@example.com,Austin,TX,Plumber,4.8,47,...
```

**Required columns:**
- `business_name` — Business name
- `owner_name` — Owner's full name (first & last)
- `email` — Owner's email address
- `city` — City where business operates
- `state` — State abbreviation
- `niche` — Business type (Plumber, Barber, Restaurant, Dentist, Auto Repair)
- `demo_site_url` — Fully built demo website URL

**Optional columns:**
- `phone` — Owner's phone number
- `rating` — Google rating (4.0-5.0)
- `review_count` — Number of reviews
- `review_quote` — Sample review text
- `state` — State code

### Usage

**Generate all 5 emails for each lead:**
```bash
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv
```

**Generate only email #1 (The Hook):**
```bash
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv -s 1
```

**Generate only email #3 (Value Add):**
```bash
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv -s 3
```

**Preview first email without writing file:**
```bash
python3 email_personalizer_v1.0.py -i leads.csv -o output.csv --preview
```

### Output CSV Format

The output is formatted specifically for Instantly.ai import:

```
email,first_name,company_name,email_subject,email_body,custom_var_1,custom_var_2,custom_var_3
mike@example.com,Mike,Mike's Plumbing Co,"Quick question: Has Mike's Plumbing Co been on Google lately?","Hi Mike, I just finished...",https://demo.site/mikes,Austin,Plumber
```

**Fields:**
- `email` — Recipient email
- `first_name` — First name only (for personalization)
- `company_name` — Business name
- `email_subject` — Personalized subject line
- `email_body` — Personalized email body
- `custom_var_1` — Demo site URL
- `custom_var_2` — City
- `custom_var_3` — Niche

### How to Use with Instantly.ai

1. Generate output CSV using this script
2. Log into Instantly.ai
3. Create new campaign → Import CSV
4. Select the output file
5. Map columns:
   - `email` → Email
   - `first_name` → First Name
   - `company_name` → Company Name
   - `email_subject` → Subject Line
   - `email_body` → Email Body
   - `custom_var_1`, `custom_var_2`, `custom_var_3` → Custom Variables
6. Set send schedule (recommend spreading across 2-3 hours to avoid spam filters)
7. Launch

### Niche Support

The script automatically personalizes emails for these niches:
- Plumber (Home Services)
- Barber (Personal Services)
- Salon (Personal Services)
- Restaurant (Food & Drink)
- Dentist (Health & Wellness)
- Auto Repair (Auto)

The niche is automatically detected from the `niche` column in your CSV.

### Sample Data

See `sample_leads.csv` for 10 realistic example leads across all 5 niches. This is useful for testing the script.

### Testing

```bash
# Test with sample data
python3 email_personalizer_v1.0.py -i sample_leads.csv -o test_output.csv

# Preview what the output looks like
python3 email_personalizer_v1.0.py -i sample_leads.csv --preview
```

---

## sample_leads.csv

Pre-built CSV with 10 realistic leads across all five niches:
- 5 leads in Austin, TX (plumber, barber, restaurant, dentist, auto)
- 5 leads in Denver, CO (same niches)

Use this to test the email personalizer script before running on real leads.

```bash
python3 email_personalizer_v1.0.py -i sample_leads.csv -o sample_output.csv
```

---

## sample_output.csv

Pre-generated output showing 50 personalized emails (5 emails × 10 leads) ready to import into Instantly.ai.

This is the output you get when running the personalizer on `sample_leads.csv`.

---

## Workflow: Cold Email Campaign

### Step 1: Prepare Your Lead List
Create a CSV with one lead per row:
```
business_name,owner_name,email,city,state,niche,demo_site_url,...
```

### Step 2: Generate Personalized Emails
```bash
python3 email_personalizer_v1.0.py -i your_leads.csv -o campaign_output.csv -s 1
```

### Step 3: Import into Instantly.ai
- Create new campaign
- Upload `campaign_output.csv`
- Map columns as described above
- Set send schedule

### Step 4: Follow-Up Sequences
Use the Follow_Up_After_Call_v1.0.md templates for:
- Day 3, 7, 10, 14 follow-ups (if no reply to cold email)
- Post-discovery call templates
- Upsell sequences for existing clients

---

## Troubleshooting

**Q: Script says "No leads found"**
A: Check that your CSV has the required columns: `business_name`, `owner_name`, `email`, `city`, `state`, `niche`, `demo_site_url`

**Q: Emails aren't personalizing [PLACEHOLDER]**
A: The placeholder is missing from your CSV. Check the column name exactly matches (case-sensitive).

**Q: Want to generate only certain email #s?**
A: Use `-s` flag: `python3 email_personalizer_v1.0.py -i leads.csv -o out.csv -s 2` for just email #2

**Q: How do I test before running on real leads?**
A: Use `sample_leads.csv`: `python3 email_personalizer_v1.0.py -i sample_leads.csv --preview`

---

## Related Files

- `/Templates/Email-Templates/Cold_Email_Sequences_v1.0.md` — Full email templates with all variants
- `/Templates/Email-Templates/Follow_Up_After_Call_v1.0.md` — Post-call follow-up templates
- `/Contracts/` — Service agreements and proposals

---

**Author:** Benjamin Rodriguez
**Last Updated:** 2026-03-25
**Status:** Ready for production use
