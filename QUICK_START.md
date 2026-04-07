# Cold Email Toolkit — Quick Start Guide

**Last Updated:** 2026-03-25
**Status:** Ready to deploy

---

## In 3 Steps

### Step 1: Create Lead List (CSV)
```
business_name,owner_name,email,city,state,niche,demo_site_url
Mike's Plumbing Co,Mike Thompson,mike@example.com,Austin,TX,Plumber,https://demo.site/mikes
```

### Step 2: Generate Emails
```bash
cd Scripts
python3 email_personalizer_v1.0.py -i your_leads.csv -o campaign.csv -s 1
```

### Step 3: Send via Instantly.ai
- Create campaign
- Upload `campaign.csv`
- Map columns (see README.md)
- Launch

**Result:** 10-15 personalized cold emails per hour, automatically scheduled.

---

## Files You Have

| File | Purpose |
|------|---------|
| `Cold_Email_Sequences_v1.0.md` | 5 email templates + warm replies + niche variants |
| `email_personalizer_v1.0.py` | Convert lead list to Instantly.ai format |
| `Follow_Up_After_Call_v1.0.md` | Post-call templates (discovery, upsell, QBR) |
| `sample_leads.csv` | 10 test leads (use to test script) |
| `README.md` | Full documentation |
| `TOOLKIT_SUMMARY.md` | Comprehensive build guide |

---

## First Campaign

1. **Gather 20-50 leads** in your target city/niche
2. **Create CSV** with: business_name, owner_name, email, city, state, niche, demo_site_url
3. **Generate:** `python3 email_personalizer_v1.0.py -i leads.csv -o out.csv -s 1`
4. **Preview:** `python3 email_personalizer_v1.0.py -i leads.csv -o out.csv -s 1 --preview`
5. **Upload to Instantly.ai** and send

**Expected Results:**
- 30-40% open rate
- 2-8% reply rate
- 10-20% of replies = demos scheduled

---

## Post-Call Sequences

After discovery call with interested lead:

**If they want to buy:**
→ Use `Follow_Up_After_Call_v1.0.md` Template #2
→ Send invoice + agreement + timeline

**If they need time to think:**
→ Use Template #1
→ Add urgency (batching window closes)
→ Follow up in 3 days

**If they don't show:**
→ Use Template #3
→ Non-judgmental reschedule request

---

## Monthly Client Emails

Once site is live:
→ Use Template #4 each month
→ Include: traffic metrics, rankings, calls generated
→ Propose next optimization

---

## Upsell Sequence

When Tier 1 client is seeing traction:
→ Use Template #5
→ Show revenue opportunity
→ Limited slots angle

---

## Need Help?

1. **Script troubleshooting:** See `/Scripts/README.md`
2. **Email templates:** Edit `Cold_Email_Sequences_v1.0.md`
3. **Full guide:** Read `TOOLKIT_SUMMARY.md`

---

**Author:** Benjamin Rodriguez
**Ready to use:** Yes
