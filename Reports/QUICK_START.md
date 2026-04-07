# Weekly Dashboard — Quick Start

## File Location
```
/Website Agency/Reports/Weekly_Report_Template_v1.0.xlsx
```

## What You Get
- **5 Professional Sheets** with 75+ automated metrics
- **All formulas** reference cells (zero hardcoding)
- **Color-coded**: Blue input cells, black formula cells
- **Cross-sheet sync**: Changes cascade automatically

## The 30-Second Setup
1. Open `Weekly_Report_Template_v1.0.xlsx`
2. Go to **Sheet 1: Weekly Dashboard**
3. Enter this week's numbers in **blue cells** only
4. All other cells auto-calculate

## Where to Input Data

### Every Week
- **Weekly Dashboard**: Input blue cells (B column)
  - Leads Scraped, Qualified, Demo Sites, Deployed, Build Time
  - Emails Sent, Open Rate, Reply Rate, Positive Replies
  - Calls Booked, Proposals Sent, Clients Won
  - Setup Fees, New MRR, Total MRR

### Every Month
- **Financial Summary**: Update monthly expenses
  - Domain costs (B15)
  - Other expenses (B17)
- **Client Roster**: Add new clients (A-I rows 3-22)

## What Auto-Calculates
These are **formula cells** — do NOT edit:
- Cost per Lead: `307 / Leads Scraped`
- Win Rate: `Clients Won / Proposals Sent`
- Revenue per Hour: `Weekly Revenue / (Build Hours × 8)`
- Profit Margin: `Weekly Profit / Weekly Revenue`
- Client Lifetime Value: `Months Active × Monthly Fee`
- Total MRR, Weekly Profit, Runway, etc.

## Dashboard Outputs

| Sheet | Purpose | Update |
|-------|---------|--------|
| **Weekly Dashboard** | Single-week snapshot | Every Friday |
| **12-Week Tracker** | Trend analysis (12 weeks) | Weekly copy from Dashboard |
| **Financial Summary** | P&L, runway, break-even | Weekly |
| **Client Roster** | Client database, LTV | Monthly (add new clients) |
| **Goals & Targets** | Actual vs. Target comparison | Auto-pulls live data |

## Key Metrics at a Glance

### Lead Funnel
- Leads Scraped → Cost per Lead
- Leads Qualified → Conversion rate

### Operational
- Sites Deployed → Build Time Avg
- Sites per Hour (productivity)

### Sales
- Calls Booked → Proposals Sent → Clients Won → Win Rate %

### Revenue
- Setup Fees + MRR = Weekly Revenue
- Weekly Profit = Revenue - Expenses
- Runway = Cash on Hand / Monthly Burn

### Efficiency
- Revenue per Hour
- Cost per Acquisition
- Profit Margin %

## Tips

1. **Always update blue cells first** — formulas depend on them
2. **Save weekly as:** `Weekly_Report_2026-03-25.xlsx` (for archival)
3. **Use the 12-Week Tracker** for monthly performance reviews
4. **Check Goals & Targets** against actuals for instant variance reporting
5. **Runway is critical** — watch it in Financial Summary

## File Management

### Each week:
```bash
cp Weekly_Report_Template_v1.0.xlsx Weekly_Report_2026-03-25.xlsx
# Now edit the copy, keep template pristine
```

### Recalculate after major edits:
```bash
python3 Scripts/recalc.py Weekly_Report_YYYY-MM-DD.xlsx
```

## Customization

| Want to change? | Where | How |
|-----------------|-------|-----|
| Tool cost | Weekly Dashboard B8 | Change `307` to your cost |
| Work hours/day | Efficiency formulas | Change `8` to your hours |
| Client capacity | Client Roster | Insert rows before SUMMARY |
| MRR per client | Financial Summary B35 | Change `1000` assumption |
| Break-even target | Financial Summary | Add new targets |

## Questions?
See `Weekly_Report_README_v1.0.md` for detailed documentation on every formula.

---
**Benjamin Rodriguez** | AI Local Website Agency | Week of 2026-03-25
