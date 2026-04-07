# Lead Tracker Spreadsheet - Setup Complete

**Created:** 2026-03-25  
**Status:** ✓ Ready for Use  
**File:** `Templates/Lead-Tracker_v1.0.xlsx`

## What Was Built

A professional, formula-driven lead tracking spreadsheet with 4 sheets, built with openpyxl and ready for the AI-powered local website agency operation.

### Sheet 1: Lead Pipeline (20 columns)
The core tracking sheet with:
- **Input Columns (Blue text):** Lead ID, Business Name, Contact Info, Address, Niche, Website Status, Lead Source
- **Metric Columns:** Google Rating, Review Count
- **Action Columns:** Demo Site URL, Demo Site Built?, Outreach Status
- **Tracking:** Last Contact Date, Notes

**Features:**
- Auto-filter on all columns
- Frozen top row for easy scrolling
- Dropdown validation for: Niche (5 options), Website Status (3), Lead Source (3), Outreach Status (10), Demo Built (Y/N)
- Conditional formatting: Green for "Closed - Won", Yellow for "Replied - Warm", Red for "Closed - Lost"
- 3 example rows with realistic sample leads (landscaping, dental, restaurant)
- Formatted for 100 leads (expandable)

### Sheet 2: Dashboard
Live summary dashboard with Excel formulas:

**Key Metrics:**
- Total Leads: `=COUNTA('Lead Pipeline'!A2:A101)`
- Demo Sites Built: `=COUNTIF('Lead Pipeline'!Q2:Q101,"Y")`
- Conversion Rate: `=COUNTIF(Closed Won)/COUNTA(Total)` (shown as %)
- Pipeline Value: `=Closed Won count * $997` (shown in $)

**Breakdowns:**
- Leads by Niche (5 COUNTIF formulas)
- Leads by Outreach Status (10 COUNTIF formulas)
- Auto-updates as data is added to Lead Pipeline

### Sheet 3: Weekly Tracker
12 pre-formatted rows for weekly reporting with formulas:

**Columns:**
- Week Starting, Leads Scraped, Demo Sites Built, Emails Sent, Replies Received
- **Reply Rate (formula):** `=IF(E2=0,0,D2/E2)` → displays as %
- Calls Booked, Clients Closed
- Revenue (Setup), MRR Added
- **Total MRR (running sum):** Row 2: `=J2` | Rows 3+: `=K[prev]+J[current]`
- Notes

**Formatting:**
- Date column (YYYY-MM-DD)
- Currency formatting for Revenue and MRR columns
- Percentage formatting for Reply Rate
- All formulas use blue text to indicate calculated fields

### Sheet 4: Settings
Configuration reference sheet with:
- **Pricing Tiers:** Tier 1 ($997/$149), Tier 2 ($1,997/$249), Tier 3 ($3,497/$397)
- **Niche List:** Home Services, Personal Services, Food & Drink, Health & Wellness, Auto
- **Status Options:** All 10 outreach statuses (Not Started → Closed - Lost)
- **Color Codes:** Reference for conditional formatting

## Professional Formatting

- **Font:** Arial throughout, 11pt headers, 10pt data
- **Colors:** Dark blue headers (#1F4E78), white text, color-coded status cells
- **Borders:** Thin borders on all cells for clarity
- **Column widths:** Optimized for readability (addresses 20px, email 22px, etc.)
- **Number formats:** Proper formatting for dates, currency ($#,##0), percentages (0.0%)

## How to Use

1. **Data Entry:** Enter leads in Sheet 1, starting at row 2
   - Use dropdowns for Niche, Website Status, Lead Source, Outreach Status
   - Fill in contact details and tracking info
   
2. **Track Progress:** Update Outreach Status as you send emails
   - System auto-colors: Green = won, Yellow = warm, Red = lost
   
3. **Monitor Weekly:** Log weekly activity in Sheet 3
   - Reply Rate and Total MRR calculate automatically
   - Running MRR total tracks cumulative revenue growth
   
4. **Review Dashboard:** Sheet 2 updates live
   - See conversion rate, pipeline value, lead distribution by niche
   - Monitor progress toward goals

## Expansion Notes

- Lead Pipeline sheet ready for up to 100 leads (rows 2-101)
- Weekly Tracker has 12 rows (can add more as needed)
- All formulas reference the full range, so adding rows auto-extends tracking
- Dropdowns apply to rows 2-101 (update if expanding further)

## Signing

— Benjamin Rodriguez

