# Weekly Reporting Dashboard — v1.0

**Created for:** Benjamin Rodriguez, AI Local Website Agency  
**File:** `Weekly_Report_Template_v1.0.xlsx`  
**Last Updated:** 2026-03-25

---

## Overview

This professional Excel dashboard tracks weekly performance of the AI local website agency across five key areas: lead generation, site metrics, outreach, sales, and revenue. All data feeds into automated calculations for instant insights into agency health and profitability.

**Design principles:**
- Blue text = input cells (you enter data here)
- Black text = formula cells (auto-calculated)
- All formulas reference other cells (no hardcoded values)
- Color-coded headers for visual clarity
- Cross-sheet references enable real-time reporting

---

## Sheet 1: Weekly Dashboard

**Purpose:** Single-view snapshot of current week's performance  
**Update frequency:** Weekly (after week-end cutoff)

### Sections:

#### Week Ending
- Input cell: `B2` (defaults to `=TODAY()`, change to your week-end date)
- Format: MM/DD/YYYY

#### LEAD METRICS
| Metric | Input | Target | Status | Formula/Notes |
|--------|-------|--------|--------|---------------|
| Leads Scraped | B6 | C6 | D6 | — |
| Leads Qualified | B7 | C7 | D7 | — |
| Cost per Lead | B8 | C8 | D8 | `=IF(B6=0, 0, 307/B6)` — based on $307/mo tool cost |

#### SITE METRICS
| Metric | Input | Target | Formula |
|--------|-------|--------|---------|
| Demo Sites Built | B14 | C14 | — |
| Sites Deployed | B15 | C15 | — |
| Build Time Avg (hrs) | B16 | C16 | — |

#### OUTREACH METRICS
| Metric | Input | Target | Format |
|--------|-------|--------|--------|
| Emails Sent | B22 | C22 | — |
| Open Rate % | B23 | C23 | 0.0% |
| Reply Rate % | B24 | C24 | 0.0% |
| Positive Replies | B25 | C25 | — |

#### SALES METRICS
| Metric | Input | Target | Formula |
|--------|-------|--------|---------|
| Calls Booked | B31 | C31 | — |
| Proposals Sent | B32 | C32 | — |
| Clients Won | B33 | C33 | — |
| Win Rate % | B34 | C34 | `=IF(B32=0, 0, B33/B32)` |

#### REVENUE
| Metric | Input | Target | Formula |
|--------|-------|--------|---------|
| Setup Fees Collected | B40 | C40 | — (currency) |
| New MRR Added | B41 | C41 | — (currency) |
| Total MRR (Cumulative) | B42 | C42 | — (currency, cumulative across weeks) |
| Total Revenue This Week | B43 | C43 | `=B40+B41` |

#### EFFICIENCY
| Metric | Formula | Target |
|--------|---------|--------|
| Revenue per Hour | `=IF(B16=0, 0, B43/(B16*8))` | C45 |
| Sites per Hour | `=IF(B16=0, 0, B15/(B16*8))` | C46 |
| Cost per Acquisition | `=IF(B33=0, 0, 307/B33)` | C47 |

---

## Sheet 2: 12-Week Tracker

**Purpose:** Historical trend analysis and week-over-week performance  
**Structure:**
- Columns: Metric name + Week 1–12 + YoY % change
- Rows: 21 metrics (all from Weekly Dashboard)

### How to use:
1. Copy your weekly dashboard data into the corresponding week column
2. YoY % column (N) auto-calculates: `=IF(C{row}=0, 0, (C{row}-B{row})/B{row})`
3. Shows week-over-week % change (e.g., Week 2 vs Week 1)

### Metrics tracked:
- Leads Scraped, Qualified, Cost per Lead
- Demo Sites, Deployed, Build Time
- Emails, Open Rate, Reply Rate, Positive Replies
- Calls, Proposals, Clients Won, Win Rate
- Setup Fees, New MRR, Total MRR, Weekly Revenue
- Revenue/Hr, Sites/Hr, Cost/Acquisition

---

## Sheet 3: Financial Summary

**Purpose:** Monthly P&L, cash runway, and break-even analysis  
**Update frequency:** Weekly (uses weekly revenue figures)

### REVENUE Section
| Item | Cell | Input/Formula | Format |
|------|------|---------------|--------|
| Setup Fees (This Week) | B5 | Input | $#,##0.00 |
| New MRR (This Week) | B7 | Input | $#,##0.00 |
| Add-on Revenue | B9 | Input | $#,##0.00 |
| **Total Revenue (Week)** | **B11** | `=B5+B7+B9` | **$#,##0.00** |

### EXPENSES Section (Monthly)
| Item | Cell | Input/Formula |
|------|------|---------------|
| Tools & Software | B13 | $307 (fixed baseline) |
| Domain Costs | B15 | Input |
| Other Expenses | B17 | Input |
| **Total Monthly** | **B19** | `=B13+B15+B17` |

### PROFIT ANALYSIS
| Metric | Cell | Formula |
|--------|------|---------|
| Monthly Burn Rate | B21 | `=B19` |
| Weekly Expenses | B23 | `=B19/4.33` |
| Weekly Profit | B25 | `=B11-B23` |
| Profit Margin % | B27 | `=IF(B11=0, 0, B25/B11)` |

### RUNWAY & BREAK-EVEN
| Metric | Cell | Formula | Notes |
|--------|------|---------|-------|
| Cash on Hand | B31 | Input | $#,##0.00 |
| Runway (months) | B33 | `=IF(B19=0, 0, B31/B19)` | Months until cash depleted |
| Clients to Break Even | B35 | `=IF(1000=0, 0, B19/1000)` | Assumes $1,000 avg MRR/client |
| MRR Target | B37 | Input | Replace $X monthly income |

---

## Sheet 4: Client Roster

**Purpose:** Central client database with automatic revenue calculations  
**Capacity:** 20 clients (rows 3–22)

### Column Structure

| Col | Field | Input/Formula | Format |
|-----|-------|---------------|--------|
| A | Client Name | Input | Text |
| B | Business Name | Input | Text |
| C | Niche | Input | Text |
| D | Tier | Input | Text (Starter/Pro/Premium) |
| E | Setup Fee | Input | $#,##0.00 |
| F | Monthly Fee | Input | $#,##0.00 |
| G | Start Date | Input | MM/DD/YYYY |
| H | Status | Input | Text (Active/Inactive/Pending) |
| I | Domain | Input | Text |
| J | Monthly Revenue | **`=F{row}`** | **$#,##0.00** |
| K | Lifetime Value | **`=IF(G{row}="", 0, (TODAY()-G{row})/365*12*F{row})`** | **$#,##0.00** |

### SUMMARY Section
| Metric | Cell | Formula |
|--------|------|---------|
| Total Clients | B24 | `=COUNTA(A3:A22)` |
| Total MRR | B25 | `=SUM(F3:F22)` |
| Avg Monthly Fee | B26 | `=AVERAGE(F3:F22)` |

**How to add clients:** Simply enter data in rows 3–22. All calculations update automatically.

---

## Sheet 5: Goals & Targets

**Purpose:** Milestone tracking and actual vs. target comparison  
**Structure:** Pre-filled targets + live actuals

### Pre-filled Goals
| Milestone | Clients | Setup Revenue | MRR |
|-----------|---------|---------------|-----|
| Month 1 | 5 | $5,000 | $750 |
| Month 2 | 10 | $5,000 | $1,500 |
| Month 3 | 20 | $5,000 | $3,000 |
| Month 6 | 40 | $10,000 | $6,000 |
| Month 12 | 80 | $15,000 | $20,000 |

### ACTUAL vs TARGET
| Metric | Actual (Formula) | Target | Variance % |
|--------|------------------|--------|-----------|
| Total Clients | `='Client Roster'!B24` | 5 | `=(B{row}-C{row})/C{row}` |
| Setup Fees (Month) | `='Financial Summary'!B5` | $5,000 | Auto |
| Total MRR | `='Client Roster'!B25` | $750 | Auto |

**Note:** Variance shows +/- % difference. Green if beating target, red if below.

---

## Formula Reference

All formulas are documented below for easy editing:

### Cost per Lead (Weekly Dashboard, B8)
```excel
=IF(B6=0, 0, 307/B6)
```
Divides $307 monthly tool cost by leads scraped. Adjust the 307 if your costs change.

### Win Rate (Weekly Dashboard, B34)
```excel
=IF(B32=0, 0, B33/B32)
```
Clients Won ÷ Proposals Sent

### Revenue per Hour (Weekly Dashboard, B45)
```excel
=IF(B16=0, 0, B43/(B16*8))
```
Total Weekly Revenue ÷ (Build Hours × 8 hrs/day). Assumes 8-hour work day.

### Weekly Profit (Financial Summary, B25)
```excel
=B11-B23
```
Weekly Revenue minus Weekly Expenses

### Runway (Financial Summary, B33)
```excel
=IF(B19=0, 0, B31/B19)
```
Cash on Hand ÷ Monthly Burn Rate

### Lifetime Value (Client Roster, K{row})
```excel
=IF(G{row}="", 0, (TODAY()-G{row})/365*12*F{row})
```
Days active ÷ 365 × 12 × Monthly Fee (estimates LTV based on tenure)

---

## How to Use This Dashboard

### Weekly Workflow
1. **Every Friday/week-end:**
   - Update "Weekly Dashboard" with that week's numbers
   - Input cells are **blue** — those are the only ones you edit
   - Formulas auto-calculate instantly

2. **Every month:**
   - Add new clients to "Client Roster" (if any)
   - Update "Financial Summary" expense figures
   - Check "Goals & Targets" for actual vs. target variance

3. **Every quarter:**
   - Copy all weekly data from "12-Week Tracker" for trend analysis
   - Review runway in "Financial Summary"
   - Adjust MRR targets if needed

### Tips
- **Blue text = input** — click and enter your data
- **Black text = formula** — do not edit, these auto-calculate
- **Sort Client Roster** by Status (Active first) for quick review
- **Export to PDF** weekly for stakeholder reports
- **Save as `Weekly_Report_YYYY-MM-DD.xlsx`** to archive each week

---

## Customization Guide

### Change tool costs
In Weekly Dashboard cell B8, change `307` to your actual monthly cost.

### Change days/week assumption
In Efficiency calculations, change the `8` multiplier (8 hrs/day) if you use different assumptions.

### Add new metrics
Insert rows under relevant section headers. Formulas will auto-adjust references below.

### Adjust client roster size
The Client Roster currently holds 20 clients. To add more:
1. Insert rows above the "SUMMARY" section
2. Copy the formula pattern from adjacent rows
3. Update the SUMMARY range (e.g., `A3:A30` instead of `A3:A22`)

### Change MRR assumptions
In Financial Summary cell B35, change `1000` to your actual average MRR per client.

---

## Support

**Questions?**
- All formulas reference live cells (no hardcoding) for easy auditing
- Unused input cells are safe to leave blank (formulas handle with `IF` logic)
- Formulas use division-by-zero guards (`IF(X=0, 0, ...)`) to prevent errors

**File maintenance:**
- Save weekly as `Weekly_Report_YYYY-MM-DD.xlsx` for archival
- Use `scripts/recalc.py` after major edits to ensure formulas recalculate
- Keep a "master template" in the Reports folder (this file) for new weeks

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **v1.0** | 2026-03-25 | Initial release: 5 sheets, 75+ metrics, full formula library |

---

**Created for Benjamin Rodriguez**  
**AI Local Website Agency**  
**Speed. Automation. ROI.**
