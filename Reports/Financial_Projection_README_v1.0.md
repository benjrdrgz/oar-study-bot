# 90-Day Financial Projection — Documentation

**File:** Financial_Projection_90Day_v1.0.xlsx  
**Created:** 2026-03-25  
**Status:** Ready to use

---

## Overview

A comprehensive 90-day financial model for the AI local website agency. All calculations use Excel formulas (not hardcoded values), so you can:
- Adjust assumptions on the "Assumptions" sheet
- See real-time updates across all sheets
- Model different scenarios easily

---

## Sheet 1: Assumptions

**Purpose:** Single source of truth for all business parameters

### Pricing Tiers (INPUT — Blue text, yellow background)
- **Tier 1:** $997 setup + $149/month
- **Tier 2:** $1,997 setup + $249/month  
- **Tier 3:** $3,497 setup + $397/month

### Tier Mix
- Tier 1: 60% of closes
- Tier 2: 30% of closes
- Tier 3: 10% of closes

### Monthly Costs
- Claude Max: $200
- Lovable: $50
- Instantly.ai: $37
- Google Workspace: $14
- Outscraper: $10
- Domains: $3
- **Total: $314/month**

### Email Campaign Parameters
- Target: 100 emails/week (ramps up week 3)
- Reply rates: 5% (conservative), 10% (realistic), 15% (optimistic)
- Close rate: 20% on replies
- Churn rate: 5% monthly

---

## Sheet 2: Week-by-Week (12 Weeks)

**Purpose:** Track daily progress and identify when break-even hits

### Metrics Tracked (All auto-calculated)
1. **Leads scraped** — Ramps from 20→100 over 12 weeks
2. **Demo sites built** — 50% of leads
3. **Emails sent** — 0 for weeks 1-2 (warm-up), then 20→100 by week 8
4. **Expected replies** — Emails × 10% reply rate
5. **Expected closes** — Replies × 20% close rate
6. **New setup revenue** — Closes × weighted avg setup fee ($1,664.40)
7. **New MRR added** — Closes × weighted avg monthly fee ($223.40)
8. **Cumulative clients** — Running total minus 5% monthly churn
9. **Cumulative MRR** — Running total minus churn
10. **Weekly revenue** — Setup fees + (MRR ÷ 4.33 weeks)
11. **Weekly expenses** — $314 ÷ 4.33 = $72.50/week
12. **Weekly profit** — Revenue − Expenses

**Key Insight:** Break-even ($72.50/week) happens by Week 3-4 if email campaign converts at 10%.

---

## Sheet 3: 3 Scenarios

**Purpose:** Model conservative/realistic/optimistic outcomes for months 1-3

### Columns
- **Conservative:** 5% reply rate → 2 clients/month → ~$1,665 revenue/month
- **Realistic:** 10% reply rate → 4 clients/month → ~$3,330 revenue/month
- **Optimistic:** 15% reply rate → 6 clients/month → ~$4,995 revenue/month

### Results by Month
For each month, shows:
- Total clients acquired
- Total setup revenue
- Ending MRR
- Total revenue  
- Total expenses ($314)
- Net profit
- All calculated with formulas

---

## Sheet 4: Monthly P&L

**Purpose:** Traditional income statement format for months 1-3

### Revenue
- **Setup Fees** — New client onboarding payments
- **Monthly Recurring Revenue** — MRR from cumulative client base
- **Add-on Revenue** — Domain resales, email hosting (estimated)
- **Total Revenue**

### Expenses
- Individual line items (Claude, Lovable, etc.)
- **Total Expenses** — $314/month

### Profit Analysis
- **Gross Profit** = Revenue − Expenses
- **Profit Margin %** = Gross Profit ÷ Revenue

**Month 1 Expectation (Realistic):**
- Setup: ~$3,328
- MRR: ~$224
- Total Revenue: ~$3,552
- Expenses: $314
- Profit: ~$3,238 (91% margin)

---

## Sheet 5: Revenue Milestones

**Purpose:** Track when you hit key financial targets

### Milestones
1. **First client** — 1 client (Week 3-4)
2. **Break even** — ~1.4 clients to cover $324/mo costs
3. **$1,000 MRR** — ~4.5 clients → Month 2-3
4. **$2,500 MRR** — ~11 clients → Month 3-4
5. **$5,000 MRR** — ~22 clients → Month 5-6
6. **$10,000 MRR** — ~45 clients → Month 8-9

**Calculation:** Based on weighted average MRR per client = $223.40 (60% T1 + 30% T2 + 10% T3)

---

## How to Use This Spreadsheet

### 1. Adjust Assumptions
- Change any blue input cell (pricing, costs, email volume, reply rates)
- All sheets update automatically

### 2. Review Different Scenarios
- Use "3 Scenarios" sheet to understand range of outcomes
- Conservative = 1 close/month → positive cash flow but slower growth
- Optimistic = 6 closes/month → rapid scaling

### 3. Plan Email Campaigns
- Week-by-Week shows when to expect first closes (Week 3-4)
- If you're hitting 5% reply rate, you're on track
- If you're hitting 10%+, you're crushing it

### 4. Monitor Cash Flow
- Weekly profit row shows when you turn positive
- Monthly P&L gives you accounting view
- Expect profitability by Week 3-4 if email campaign works

---

## Key Assumptions & Risks

**Assumptions:**
- 10% reply rate (conservative: 5%, optimistic: 15%)
- 20% close rate on replies
- 5% monthly churn (clients cancel)
- 100 emails/week by week 8 (requires email infrastructure working)
- All clients pay on time

**Risks:**
- Email deliverability: 10% reply rate assumes proper warm-up (Instantly.ai handles this)
- Sales skills: 20% close rate assumes solid pitch and discovery call
- Client retention: 5% churn is reasonable but depends on product quality
- Time constraints: 20 hrs/week at $100/hr = $2,000/week revenue target

---

## Recalculation

To refresh formulas in Excel:
```bash
python Scripts/recalc.py "Reports/Financial_Projection_90Day_v1.0.xlsx"
```

This forces Excel to recalculate all dependent formulas on next open.

---

## Version History

**v1.0** — Initial 90-day projection
- 5 sheets: Assumptions, Week-by-Week, 3 Scenarios, Monthly P&L, Milestones
- All formulas use relative references for flexibility
- Blue inputs, black formulas, currency/percentage formatting
- Based on realistic tier mix and email marketing assumptions

---

**Created by:** Benjamin Rodriguez  
**Last Updated:** 2026-03-25
