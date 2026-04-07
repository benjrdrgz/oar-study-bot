#!/usr/bin/env python3
"""
Site Generator v1.0 — Zero-Cost Site Factory
Generates complete, deployable HTML websites from a CSV of leads.
Usage: python3 site_generator_v1.0.py -i leads.csv -o ./Generated-Sites/ --manifest

Author: Benjamin Rodriguez
"""

import csv
import json
import os
import sys
import argparse
import re
from datetime import datetime
from pathlib import Path


# Niche to template mapping
NICHE_TO_TEMPLATE = {
    "plumbing": "home-services_v1.0.html",
    "electrical": "home-services_v1.0.html",
    "hvac": "home-services_v1.0.html",
    "carpentry": "home-services_v1.0.html",
    "roofing": "home-services_v1.0.html",
    "painting": "home-services_v1.0.html",
    "home services": "home-services_v1.0.html",

    "haircutting": "personal-services_v1.0.html",
    "barbering": "personal-services_v1.0.html",
    "hair salon": "personal-services_v1.0.html",
    "beauty": "personal-services_v1.0.html",
    "spa": "personal-services_v1.0.html",
    "massage": "personal-services_v1.0.html",
    "personal services": "personal-services_v1.0.html",

    "restaurant": "food-drink_v1.0.html",
    "cafe": "food-drink_v1.0.html",
    "bakery": "food-drink_v1.0.html",
    "pizza": "food-drink_v1.0.html",
    "bar": "food-drink_v1.0.html",
    "food": "food-drink_v1.0.html",
    "drink": "food-drink_v1.0.html",
    "food & drink": "food-drink_v1.0.html",

    "gym": "health-wellness_v1.0.html",
    "fitness": "health-wellness_v1.0.html",
    "yoga": "health-wellness_v1.0.html",
    "personal training": "health-wellness_v1.0.html",
    "chiropractor": "health-wellness_v1.0.html",
    "doctor": "health-wellness_v1.0.html",
    "dentist": "health-wellness_v1.0.html",
    "therapy": "health-wellness_v1.0.html",
    "health & wellness": "health-wellness_v1.0.html",
    "wellness": "health-wellness_v1.0.html",

    "mechanic": "auto_v1.0.html",
    "automotive": "auto_v1.0.html",
    "car repair": "auto_v1.0.html",
    "auto shop": "auto_v1.0.html",
    "auto": "auto_v1.0.html",
}


def slugify(text):
    """Convert text to URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text


def get_template_path(niche, template_dir):
    """Get template file path based on niche."""
    template_name = NICHE_TO_TEMPLATE.get(niche.lower(), "home-services_v1.0.html")
    template_path = os.path.join(template_dir, template_name)
    return template_path, template_name


def read_csv_leads(csv_path):
    """Read and parse CSV file."""
    leads = []
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                leads.append(row)
        return leads
    except FileNotFoundError:
        print(f"Error: CSV file not found: {csv_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        sys.exit(1)


def load_template(template_path):
    """Load HTML template."""
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: Template not found: {template_path}")
        sys.exit(1)


def parse_services(services_str):
    """Parse comma-separated services into list."""
    if not services_str:
        return []
    return [s.strip() for s in services_str.split(',') if s.strip()]


def generate_customer_names():
    """Generate realistic customer names for testimonials."""
    first_names = ["John", "Sarah", "Michael", "Jessica", "David", "Emily", "Robert", "Maria"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
    return [f"{first_names[i]} {last_names[i]}" for i in range(len(first_names))]


def replace_placeholders(html_content, lead_data):
    """Replace all placeholders in HTML with lead data."""
    # Parse services
    services = parse_services(lead_data.get('services', ''))

    # Generate customer names if not provided
    customer_names = generate_customer_names()

    # Generate domain name from business name
    domain_name = slugify(lead_data.get('business_name', 'business'))

    # Build replacement map
    replacements = {
        '[BUSINESS_NAME]': lead_data.get('business_name', 'Business'),
        '[PHONE]': lead_data.get('phone', '(XXX) XXX-XXXX'),
        '[STREET_ADDRESS]': lead_data.get('address', '123 Main St'),
        '[CITY]': lead_data.get('city', 'City'),
        '[STATE]': lead_data.get('state', 'ST'),
        '[ZIP_CODE]': lead_data.get('zip', '12345'),
        '[SERVICE_TYPE]': services[0] if services else 'Professional Services',
        '[NUMBER_OF_YEARS]': lead_data.get('years', '10'),
        '[OPEN_TIME]': lead_data.get('open_time', '9:00 AM'),
        '[CLOSE_TIME]': lead_data.get('close_time', '5:00 PM'),
        '[SAT_HOURS]': lead_data.get('sat_hours', '10:00 AM - 3:00 PM'),
        '[SUN_HOURS]': lead_data.get('sun_hours', 'Closed'),
        '[EMAIL]': lead_data.get('email', 'contact@business.com'),
        '[RATING]': lead_data.get('rating', '5.0'),
        '[SERVICE_DESCRIPTION]': lead_data.get('service_description', 'Professional services for your needs'),
        '[DOMAIN_NAME]': domain_name,
        '[AGENCY_NAME]': lead_data.get('business_name', 'Business'),
        '[INSERT GOOGLE MAPS EMBED HERE]': '<p style="color: #999; font-size: 0.9rem;">📍 ' + lead_data.get('city', 'City') + ', ' + lead_data.get('state', 'ST') + '</p>',
    }

    # Add individual services
    for i, service in enumerate(services[:6], 1):
        replacements[f'[SERVICE_{i}]'] = service

    # Fill in remaining services if less than 6
    for i in range(len(services) + 1, 7):
        replacements[f'[SERVICE_{i}]'] = "Professional Services"

    # Add customer names
    for i, name in enumerate(customer_names[:3], 1):
        replacements[f'[CUSTOMER_NAME_{i}]'] = name

    # Apply replacements
    result = html_content
    for placeholder, value in replacements.items():
        result = result.replace(placeholder, str(value))

    return result


def generate_site(lead_data, template_dir, output_dir):
    """Generate a single website from lead data."""
    # Get template based on niche
    template_path, template_name = get_template_path(
        lead_data.get('niche', 'home services'),
        template_dir
    )

    # Load template
    html_content = load_template(template_path)

    # Replace placeholders
    html_content = replace_placeholders(html_content, lead_data)

    # Generate output filename
    business_slug = slugify(lead_data.get('business_name', 'business'))
    city_slug = slugify(lead_data.get('city', 'location'))
    output_filename = f"{business_slug}-{city_slug}.html"
    output_path = os.path.join(output_dir, output_filename)

    # Write file
    os.makedirs(output_dir, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    return {
        'filename': output_filename,
        'filepath': output_path,
        'business_name': lead_data.get('business_name', 'Business'),
        'city': lead_data.get('city', 'City'),
        'state': lead_data.get('state', 'ST'),
        'niche': lead_data.get('niche', 'Unknown'),
        'template_used': template_name,
        'phone': lead_data.get('phone', ''),
        'generated_at': datetime.now().isoformat(),
    }


def validate_csv_row(row):
    """Validate that a CSV row has required fields."""
    required = ['business_name', 'niche', 'phone', 'city', 'state']
    for field in required:
        if not row.get(field, '').strip():
            return False, f"Missing required field: {field}"
    return True, "OK"


def main():
    parser = argparse.ArgumentParser(
        description='Generate HTML websites from a CSV of leads.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python3 site_generator_v1.0.py -i leads.csv -o ./Generated-Sites/
  python3 site_generator_v1.0.py -i leads.csv --preview 5 --manifest
  python3 site_generator_v1.0.py -i leads.csv --niche plumbing -o ./sites/
        '''
    )

    parser.add_argument('-i', '--input', required=True, help='Path to CSV file with leads')
    parser.add_argument('-o', '--output', default='./Generated-Sites/', help='Output directory (default: ./Generated-Sites/)')
    parser.add_argument('--niche', help='Filter to generate only for specific niche')
    parser.add_argument('--preview', type=int, help='Generate for first N leads only (for testing)')
    parser.add_argument('--manifest', action='store_true', help='Output a manifest JSON of generated sites')
    parser.add_argument('--template-dir', default='../Templates/Website-Templates/', help='Path to template directory')

    args = parser.parse_args()

    # Resolve paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    template_dir = os.path.join(script_dir, args.template_dir)
    output_dir = os.path.abspath(args.output)

    # Verify template directory exists
    if not os.path.isdir(template_dir):
        print(f"Error: Template directory not found: {template_dir}")
        sys.exit(1)

    # Read leads
    print(f"Reading leads from: {args.input}")
    leads = read_csv_leads(args.input)
    print(f"Found {len(leads)} total leads")

    # Filter by preview if specified
    if args.preview:
        leads = leads[:args.preview]
        print(f"Previewing first {len(leads)} leads")

    # Filter by niche if specified
    if args.niche:
        leads = [l for l in leads if l.get('niche', '').lower() == args.niche.lower()]
        print(f"Filtered to {len(leads)} leads for niche: {args.niche}")

    # Generate sites
    results = []
    skipped = 0

    print(f"\nGenerating websites...\n")

    for i, lead in enumerate(leads, 1):
        # Validate row
        is_valid, msg = validate_csv_row(lead)
        if not is_valid:
            print(f"  [{i}] SKIP: {lead.get('business_name', 'Unknown')} — {msg}")
            skipped += 1
            continue

        try:
            result = generate_site(lead, template_dir, output_dir)
            results.append(result)
            print(f"  [{i}] ✓ {result['business_name']} ({result['city']}, {result['state']}) → {result['filename']}")
        except Exception as e:
            print(f"  [{i}] ERROR: {lead.get('business_name', 'Unknown')} — {str(e)}")
            skipped += 1

    # Summary
    print(f"\n{'='*70}")
    print(f"SUMMARY: Generated {len(results)} websites, {skipped} skipped")
    print(f"Output directory: {output_dir}")

    # Write manifest if requested
    if args.manifest:
        manifest = {
            'generated_at': datetime.now().isoformat(),
            'total_generated': len(results),
            'total_skipped': skipped,
            'output_directory': output_dir,
            'sites': results,
        }

        manifest_path = os.path.join(output_dir, 'generation_manifest.json')
        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)

        print(f"Manifest written: {manifest_path}")

    print(f"{'='*70}\n")

    # Exit with success
    sys.exit(0 if len(results) > 0 else 1)


if __name__ == '__main__':
    main()
