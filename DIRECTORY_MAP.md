# Website Agency — Directory Map

**Last updated:** 2026-03-25
**Status:** Fully built — ready for Week 1 execution

---

## Folder Structure

```
Website Agency/
│
├── _System/                              ← GLOBAL (cross-business assets)
│   ├── Claude_PhD_Knowledge_Base_v1.0.md ← The optimization brain
│   ├── Context-Packets/                  ← Portable context for new sessions
│   └── bootstrap_business.py             ← Script to scaffold new businesses
│
├── Brand/
│   └── Agency_Brand_Kit_v1.0.md          ← Name options, colors, taglines, bios
│
├── Client-Onboarding/
│   └── Welcome_Packet_v1.0.docx          ← 6-page onboarding doc for new clients
│
├── Guides/
│   ├── Claude-System/
│   │   └── Claude_PhD_Knowledge_Base_v1.0.md  ← (agency copy, global in _System/)
│   ├── Operations/
│   │   ├── Agency_Operations_SOP_v1.0.md      ← Full SOP with 8 procedures
│   │   └── Daily_Checklist_Quick_Ref_v1.0.md  ← Daily 2-hour routine
│   ├── Research/
│   │   ├── AI_Agency_Trends_Research_v1.0.md  ← Market data, Reddit insights
│   │   └── Competitive_Intelligence_Report_v1.0.md ← Competitors + battlecard
│   ├── Sales/
│   │   ├── Objection_Handling_Quick_Reference_v1.0.md ← Top 10 objections
│   │   └── Sales_Call_Script_v1.0.md          ← Full call script
│   └── Technical/
│       ├── Build_vs_Buy_Infrastructure_Analysis_v1.0.md
│       ├── DNS_Email_Infrastructure_Guide_v1.0.md ← Step-by-step DNS setup
│       ├── DNS_Quick_Reference_v1.0.md            ← 1-page DNS cheat sheet
│       ├── Google_Business_Profile_Setup_Guide_v1.0.md
│       ├── SEO_Delivery_Checklist_v1.0.md         ← 36-point pre-delivery checklist
│       └── Tool_Comparison_Report_v1.0.md         ← Lovable vs alternatives
│
├── Logs/
│   └── Session-Logs/
│       ├── session-log-2026-03-25.md
│       ├── session-log-2026-03-25-v2.md
│       ├── session-log-2026-03-25-v3.md
│       └── session-log-2026-03-25-MASTER.md       ← Most recent/comprehensive
│
├── Outputs/
│   ├── AI_Local_Agency_ACTION_PLAN_v1.0.md
│   ├── Business_Overview_For_Dad_v1.0.docx
│   ├── Revenue_Expansion_Playbook_v1.0.docx       ← Social media upsell strategy
│   ├── Revenue_Timeline_v1.0.md
│   ├── Claude-Context/                             ← Context packets (copies in _System/)
│   └── Summaries/
│       └── MASTER_SUMMARY_Overnight_Sprint_v1.0.md
│
├── Reports/
│   ├── Financial_Projection_90Day_v1.0.xlsx       ← 3-scenario projections
│   └── Weekly_Report_Template_v1.0.xlsx           ← 35+ KPIs, 12-week tracker
│
├── Scripts/
│   ├── site_generator_v1.0.py                     ← Batch HTML site generation from CSV
│   ├── email_personalizer_v1.0.py                 ← Batch email generation from CSV
│   ├── website_auditor_v1.0.py                    ← URL audit tool (SSL, speed, SEO)
│   ├── generate_service_agreement.py              ← Auto-fill contracts
│   ├── generate_proposal.py                       ← Auto-fill proposals
│   ├── batch_generate_proposals.py                ← Batch proposal generation
│   ├── Sample-Data/                               ← Test CSVs
│   └── Test-Output/                               ← Generated test HTML sites
│
└── Templates/
    ├── Contracts/
    │   └── Service_Agreement_v1.0.docx            ← Master contract template
    ├── Email-Templates/
    │   ├── Cold_Email_Sequences_v1.0.md           ← 5-email cold sequence
    │   └── Follow_Up_After_Call_v1.0.md           ← Post-call follow-ups
    ├── Lovable-Prompts/
    │   └── Lovable_Prompt_Library_v1.0.md         ← Copy-paste prompts for 5 niches
    ├── Proposals/
    │   └── Client_Proposal_v1.0.docx              ← 4-page pricing proposal
    ├── Website-Templates/                          ← 8 HTML templates (5 niches + agency + pricing + ROI)
    ├── Lead-Tracker_v1.0.xlsx                     ← 4-sheet CRM spreadsheet
    ├── Social_Media_Content_Plan_v1.0.md          ← 30 pre-written posts
    ├── Referral_Program_v1.0.md
    └── Website_Audit_Scorecard_v1.0.md            ← 0-100 scoring system

```

## Quick Reference: Where to Find Things

| Need this... | Go here... |
|---|---|
| Start a new business | `_System/bootstrap_business.py "Name"` |
| PhD optimization tips | `_System/Claude_PhD_Knowledge_Base_v1.0.md` |
| What happened last session | `Logs/Session-Logs/` (most recent file) |
| Build a demo site | `Templates/Website-Templates/` + `Scripts/site_generator_v1.0.py` |
| Send cold emails | `Templates/Email-Templates/` + `Scripts/email_personalizer_v1.0.py` |
| Close a deal | `Guides/Sales/` (script + objection handler) |
| Onboard a client | `Contracts/` → `Proposals/` → `Client-Onboarding/` |
| Set up DNS/email | `Guides/Technical/DNS_Email_Infrastructure_Guide_v1.0.md` |
| Financial projections | `Reports/Financial_Projection_90Day_v1.0.xlsx` |
| Social media upsell | `Outputs/Revenue_Expansion_Playbook_v1.0.docx` |

— Benjamin Rodriguez
