# Service Agreement — Quick Reference

## TL;DR

- **Template**: `Service_Agreement_v1.0.docx` (40 KB)
- **Location**: `/Website Agency/Templates/Contracts/`
- **Ready to use**: Yes — customize with client info and print to sign

## 30-Second Setup

```bash
cd ~/Website\ Agency/Scripts

python3 fill_contract.py \
  --agency "Your Agency Name" \
  --client "Client Name" \
  --business "Business Name" \
  --date "2026-03-25" \
  --state "Wisconsin" \
  --billing-day "15"
```

Done. Open the output DOCX, print, sign, and send to client.

## The Contract Covers

✓ Three pricing tiers ($997-$3,497 setup + $149-$397/mo)
✓ Website design, hosting, SSL, SEO, revisions
✓ Project timeline (5 days draft → 24 hours go-live)
✓ Payment terms (late fees, suspension rights)
✓ IP ownership (agency keeps design unless $497 transfer)
✓ Term (3-month minimum, then month-to-month)
✓ Liability limits (capped to 3 months of fees)

## Signature Blocks

Both parties sign:
- **Agency**: Benjamin Rodriguez (authorized rep)
- **Client**: Client name, business, title, date

## 6 Placeholders to Replace

| Text | Example |
|------|---------|
| `[AGENCY_NAME]` | Local Web Solutions |
| `[CLIENT_NAME]` | John Smith |
| `[CLIENT_BUSINESS_NAME]` | Smith Plumbing |
| `[DATE]` | March 25, 2026 |
| `[STATE]` | Wisconsin |
| `[BILLING_DAY]` | 15 |

Use Find & Replace in Word/Docs or use the `fill_contract.py` script.

## When to Use

→ Customer says "yes" to a service tier
→ You customize the contract with their info
→ You print and they sign
→ Work begins after payment

## Important Clauses

**Payment**: Setup fee due before work starts. Monthly fee on the [BILLING_DAY]. Late = 1.5%/month penalty.

**Work**: Draft in 5 days. Review in 7 days. Revisions in 3 days. Go-live in 24 hours.

**Revisions**: Quick Start = 1 round. Growth = 3 rounds. Dominate = unlimited.

**IP**: You keep the website design. Client can buy full ownership for $497.

**Cancel**: 30 days notice. No refunds (but can credit toward future months).

**Overdue**: After 30 days past due, you can suspend hosting.

## File Overview

| File | Purpose |
|------|---------|
| `Service_Agreement_v1.0.docx` | Master template — use this |
| `fill_contract.py` | Auto-fill script for placeholders |
| `generate_service_agreement.py` | Regenerate template from scratch |
| `README.md` | Full documentation |
| `QUICK_REFERENCE.md` | This file |

## Troubleshooting

**"PlaceHolder didn't fill in script"**
→ Make sure you're in the correct directory and the placeholder text is exactly as shown

**"Can't open DOCX in Google Docs"**
→ Upload to Drive first, then right-click "Open with → Google Docs"

**"Script says template not found"**
→ Run from `/Website Agency/Scripts/` and verify the path

**"Want to modify the contract structure"**
→ Edit `generate_service_agreement.py` and run it to regenerate the template

## Billing Setup Tips

When you set `[BILLING_DAY]` to (for example) "15":
- First invoice: Full month, due 30 days from invoice
- Recurring: Auto-bill on the 15th each month

Use Stripe Billing, Wave, or invoicing system that matches.

## Common Scenarios

**Client wants to own the website**
→ They can pay $497 any time (Section 7.3)

**Client is 30 days late on payment**
→ Suspend their website (Section 4.5)

**Client wants more revisions than their tier includes**
→ Charge for additional rounds at your standard rate

**Client wants to cancel after 2 months**
→ They must give 30 days notice; they're responsible for fees during notice period (Section 8.3)

## Numbers at a Glance

| Tier | Setup | /mo | Pages | Revisions |
|------|-------|-----|-------|-----------|
| Quick Start | $997 | $149 | 5 | 1 |
| Growth | $1,997 | $249 | 5-10 | 3 |
| Dominate | $3,497 | $397 | ∞ | ∞ |

## Before First Use

1. Have attorney review (optional but recommended)
2. Change `[STATE]` to your state for governing law
3. Test `fill_contract.py` script with sample client
4. Print and review one filled contract
5. Get signed copy from first real client

---

**Questions?** See `README.md` for full details.

**Version**: v1.0 (March 25, 2026)
