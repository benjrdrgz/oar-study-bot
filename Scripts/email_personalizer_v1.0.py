#!/usr/bin/env python3
"""
Email Personalizer for AI Local Website Agency Cold Email Sequences
Converts lead CSV data into Instantly.ai-ready personalized email sequences
"""

import csv
import argparse
import sys
from pathlib import Path
from typing import List, Dict

# Email templates with all variants
EMAIL_TEMPLATES = {
    1: {
        "name": "THE HOOK (Day 0)",
        "subjects": [
            "Quick question: Has [BUSINESS_NAME] been on Google lately?",
            "[OWNER_NAME], I built something for [BUSINESS_NAME]",
            "Your new [CITY] website is live (no strings attached)"
        ],
        "body": """Hi [OWNER_NAME],

I just finished building a fresh website for [BUSINESS_NAME] in [CITY]. It's live and ready to show.

The whole thing took about 72 hours — from domain setup to a fully optimized site with local SEO built in.

[DEMO_SITE_URL]

I'm not selling you anything yet. Just want your honest feedback: Does it feel right for your business?

— Benjamin Rodriguez
AI Local Website Agency"""
    },
    2: {
        "name": "THE NUDGE (Day 3)",
        "subjects": [
            "Did you get a chance to check it out?",
            "[OWNER_NAME] — quick follow-up",
            "Your [CITY] website preview (expiring soon)"
        ],
        "body": """[OWNER_NAME],

Sent you a preview of the [BUSINESS_NAME] site on Monday.

Wanted to check: did you get a chance to look it over?

If the design direction feels off, let me know — I can adjust in 24 hours. If it looks good, we should jump on the next step before I take it down.

Quick call next week to walk through the strategy behind it?

— Benjamin Rodriguez"""
    },
    3: {
        "name": "THE VALUE ADD (Day 7)",
        "subjects": [
            "Why your [NICHE] competitors are killing it on Google",
            "[OWNER_NAME], Google visibility opportunity",
            "The #1 reason [NICHE] businesses get found first"
        ],
        "body": """[OWNER_NAME],

Been reviewing the [CITY] [NICHE] market. Here's what I'm seeing:

Businesses showing up on Google right now have one thing in common: they invested in local SEO 6-12 months ago.

The window is still wide open. Once your competitors catch on, it gets crowded fast.

The website I built for [BUSINESS_NAME] is optimized for exactly this — it's built to rank locally from day one.

You've got the foundation. The question is: do you want to be the first one customers find, or wait for someone else to take that spot?

Quick 15-min call this week?

— Benjamin Rodriguez"""
    },
    4: {
        "name": "SOCIAL PROOF (Day 10)",
        "subjects": [
            "[BUSINESS_NAME] is going live next week — thought of you",
            "Three local [NICHE] businesses just launched",
            "Your competition is moving — is [BUSINESS_NAME]?"
        ],
        "body": """[OWNER_NAME],

Just launched three new sites in [CITY] this week:
- A [NICHE] business on Elm Street
- Another one in the [NICHE] space doing $400k+ annually
- A third that's been around for 8 years but had no online presence

All three are now visible on Google Maps. All three went live with full local SEO strategy baked in.

[BUSINESS_NAME] could be next.

The difference between moving now vs. waiting? About 90 days of visibility your competitors will own instead.

Let's talk about your timeline.

— Benjamin Rodriguez"""
    },
    5: {
        "name": "THE BREAKUP (Day 14)",
        "subjects": [
            "Taking down your [CITY] preview — final chance",
            "[OWNER_NAME], last chance to see [BUSINESS_NAME] online",
            "End of week update — your preview expires Friday"
        ],
        "body": """[OWNER_NAME],

Two weeks ago I sent over a preview of the [BUSINESS_NAME] website.

I'm taking it down Friday to clean up server space.

Before I do, wanted to make sure: is this something you want to move forward with, or should I archive it?

If you want to keep it live and start the full launch process, let's lock in a call for next Tuesday. We can get you set up and publishing within the week.

If now's not the right time, no pressure — but I'd rather hear that than guess.

What's your call?

— Benjamin Rodriguez"""
    }
}


def personalize_text(text: str, lead: Dict) -> str:
    """Replace all placeholders with lead data"""
    replacements = {
        "[BUSINESS_NAME]": lead.get("business_name", ""),
        "[OWNER_NAME]": lead.get("owner_name", "").split()[0],  # First name only
        "[CITY]": lead.get("city", ""),
        "[STATE]": lead.get("state", ""),
        "[NICHE]": lead.get("niche", ""),
        "[DEMO_SITE_URL]": lead.get("demo_site_url", ""),
        "[REVIEW_QUOTE]": lead.get("review_quote", ""),
        "[REVIEW_COUNT]": lead.get("review_count", ""),
        "[RATING]": lead.get("rating", ""),
        "[PLUMBER_NAME]": lead.get("business_name", ""),
        "[SALON_NAME]": lead.get("business_name", ""),
        "[RESTAURANT_NAME]": lead.get("business_name", ""),
        "[DENTIST_NAME]": lead.get("owner_name", ""),
        "[PRACTICE_NAME]": lead.get("business_name", ""),
        "[SHOP_NAME]": lead.get("business_name", ""),
        "[PERSONAL_SERVICE]": lead.get("niche", "").lower(),
        "[CUISINE]": lead.get("niche", "").lower(),
        "[SERVICE]": lead.get("niche", "").lower(),
        "[PORTFOLIO_URL]": "https://portfolio.example.com",  # Placeholder
    }
    
    result = text
    for placeholder, value in replacements.items():
        result = result.replace(placeholder, str(value))
    
    return result


def read_leads(input_file: str) -> List[Dict]:
    """Read CSV file and return list of lead dictionaries"""
    leads = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
    return leads


def generate_emails(leads: List[Dict], sequence_num: int = None, preview: bool = False) -> List[Dict]:
    """Generate personalized emails for all leads"""
    output_rows = []
    
    sequences = [sequence_num] if sequence_num else [1, 2, 3, 4, 5]
    
    for lead in leads:
        for seq in sequences:
            template = EMAIL_TEMPLATES[seq]
            
            # Use first subject line variant for actual sending
            subject = personalize_text(template["subjects"][0], lead)
            body = personalize_text(template["body"], lead)
            
            output_row = {
                "email": lead.get("email", ""),
                "first_name": lead.get("owner_name", "").split()[0],
                "company_name": lead.get("business_name", ""),
                "email_subject": subject,
                "email_body": body,
                "custom_var_1": lead.get("demo_site_url", ""),  # demo_url
                "custom_var_2": lead.get("city", ""),  # city
                "custom_var_3": lead.get("niche", ""),  # niche
                "sequence_number": str(seq),
                "niche": lead.get("niche", ""),
                "city": lead.get("city", "")
            }
            
            output_rows.append(output_row)
            
            # Print preview if requested
            if preview and seq == 1:  # Only preview first email
                print(f"\n{'='*80}")
                print(f"PREVIEW: Email {seq} for {lead.get('business_name', 'UNKNOWN')}")
                print(f"{'='*80}\n")
                print(f"TO: {output_row['email']}")
                print(f"SUBJECT: {subject}\n")
                print(f"BODY:\n{body}\n")
                print(f"{'='*80}\n")
                return output_rows  # Return after preview
    
    return output_rows


def write_output(output_rows: List[Dict], output_file: str):
    """Write personalized emails to Instantly.ai-ready CSV"""
    if not output_rows:
        print("Error: No emails generated")
        return
    
    fieldnames = [
        "email",
        "first_name",
        "company_name",
        "email_subject",
        "email_body",
        "custom_var_1",
        "custom_var_2",
        "custom_var_3"
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in output_rows:
            writer.writerow({field: row.get(field, "") for field in fieldnames})
    
    print(f"✓ Generated {len(output_rows)} personalized emails")
    print(f"✓ Output saved to: {output_file}")
    print(f"✓ Ready to import into Instantly.ai")


def main():
    parser = argparse.ArgumentParser(
        description="Generate personalized cold emails for AI Local Website Agency"
    )
    parser.add_argument(
        "-i", "--input",
        required=True,
        help="Input CSV file with lead data"
    )
    parser.add_argument(
        "-o", "--output",
        required=True,
        help="Output CSV file (Instantly.ai format)"
    )
    parser.add_argument(
        "-s", "--sequence",
        type=int,
        choices=[1, 2, 3, 4, 5],
        default=None,
        help="Generate only specific sequence number (1-5). Default: all sequences"
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Preview first generated email and exit"
    )
    
    args = parser.parse_args()
    
    # Validate input file
    if not Path(args.input).exists():
        print(f"Error: Input file not found: {args.input}")
        sys.exit(1)
    
    try:
        # Read leads
        leads = read_leads(args.input)
        if not leads:
            print("Error: No leads found in input file")
            sys.exit(1)
        
        print(f"✓ Loaded {len(leads)} leads from {args.input}")
        
        # Generate emails
        output_rows = generate_emails(
            leads,
            sequence_num=args.sequence,
            preview=args.preview
        )
        
        # Exit after preview
        if args.preview:
            print("(Preview mode - no file written)")
            return
        
        # Write output
        write_output(output_rows, args.output)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
