# Site Generator v1.0 — Zero-Cost Site Factory

**v1.0 — Initial release: reads leads CSV, generates custom HTML sites, outputs manifest**

The Site Generator is the automated pipeline for transforming lead lists into deployment-ready websites. It reads business data from a CSV, matches each business to the appropriate template based on niche, replaces all placeholders with real data, and outputs standalone HTML files ready to host.

## What It Does

1. **Reads your lead CSV** — business name, niche, phone, address, services, hours, etc.
2. **Selects the right template** — plumbing → home-services template, gym → health-wellness template, etc.
3. **Replaces ALL placeholders** — [BUSINESS_NAME], [PHONE], [SERVICE_1], [CITY], etc.
4. **Generates complete HTML sites** — One file per lead, ready to deploy instantly
5. **Creates a deployment manifest** — JSON tracking all generated sites, status, file paths

## Installation & Setup

No external dependencies. Uses Python 3 standard library only.

```bash
# Make script executable
chmod +x site_generator_v1.0.py

# Verify templates exist
ls ../Templates/Website-Templates/
```

Expected templates:
- `home-services_v1.0.html`
- `personal-services_v1.0.html`
- `food-drink_v1.0.html`
- `health-wellness_v1.0.html`
- `auto_v1.0.html`

## Usage

### Basic: Generate all sites

```bash
python3 site_generator_v1.0.py -i sample_site_generation_input.csv
```

Output: Creates `./Generated-Sites/` with HTML files.

### With custom output directory

```bash
python3 site_generator_v1.0.py -i leads.csv -o /path/to/output/
```

### Test first: Preview only first 5 leads

```bash
python3 site_generator_v1.0.py -i leads.csv --preview 5
```

### Filter by niche

```bash
python3 site_generator_v1.0.py -i leads.csv --niche plumbing
```

### Generate manifest (tracking file)

```bash
python3 site_generator_v1.0.py -i leads.csv --manifest
```

Creates `generation_manifest.json` in output directory with:
- List of all generated sites
- File paths
- Business metadata (name, city, phone, niche)
- Template used for each
- Generation timestamp

### Combined: Full production run

```bash
python3 site_generator_v1.0.py -i my_leads.csv -o ./Generated-Sites/ --manifest
```

## CSV Format

Required columns:
- `business_name` — Business name (required)
- `niche` — Business type: Plumbing, Hair Salon, Mechanic, Gym, Cafe, etc. (required)
- `phone` — Phone number (required)
- `city` — City name (required)
- `state` — State abbreviation (required)

Optional columns:
- `address` — Street address
- `zip` — ZIP/postal code
- `email` — Email address
- `services` — Comma-separated list of services (max 6, will fill template slots)
- `years` — Years in business
- `open_time` — Opening time (e.g., "9:00 AM")
- `close_time` — Closing time (e.g., "5:00 PM")
- `sat_hours` — Saturday hours
- `sun_hours` — Sunday hours
- `rating` — Star rating (e.g., "4.8")
- `service_description` — Short description for schema.org

### Example CSV row

```
Mike's Plumbing Co,Plumbing,(512) 555-0101,456 Oak Street,Austin,TX,78704,info@mikesplumbing.com,Drain Cleaning,Pipe Repair,Water Heater Installation,Leak Detection,Emergency Service,Bathroom Remodeling,12,7:00 AM,6:00 PM,9:00 AM - 4:00 PM,Closed,4.9,Expert plumbing services for Austin
```

## Niche Mapping

The script automatically selects templates based on niche keywords:

**Home Services** → `home-services_v1.0.html`
- Plumbing, Electrical, HVAC, Carpentry, Roofing, Painting, "Home Services"

**Personal Services** → `personal-services_v1.0.html`
- Hair Salon, Barbering, Beauty, Spa, Massage, "Personal Services"

**Food & Drink** → `food-drink_v1.0.html`
- Restaurant, Cafe, Bakery, Pizza, Bar, "Food & Drink"

**Health & Wellness** → `health-wellness_v1.0.html`
- Gym, Fitness, Yoga, Personal Training, Chiropractor, Doctor, Dentist, Therapy

**Auto** → `auto_v1.0.html`
- Mechanic, Automotive, Car Repair, "Auto Shop"

**Unknown niche?** Falls back to `home-services_v1.0.html`.

## Placeholder Replacement Map

These placeholders are automatically replaced in templates:

| Placeholder | Source | Example |
|---|---|---|
| `[BUSINESS_NAME]` | CSV `business_name` | "Mike's Plumbing Co" |
| `[PHONE]` | CSV `phone` | "(512) 555-0101" |
| `[STREET_ADDRESS]` | CSV `address` | "456 Oak Street" |
| `[CITY]` | CSV `city` | "Austin" |
| `[STATE]` | CSV `state` | "TX" |
| `[ZIP_CODE]` | CSV `zip` | "78704" |
| `[SERVICE_TYPE]` | First service from CSV `services` | "Drain Cleaning" |
| `[SERVICE_1]` through `[SERVICE_6]` | CSV `services` (comma-separated) | "Pipe Repair", "Water Heater Installation", etc. |
| `[NUMBER_OF_YEARS]` | CSV `years` | "12" |
| `[OPEN_TIME]` | CSV `open_time` | "7:00 AM" |
| `[CLOSE_TIME]` | CSV `close_time` | "6:00 PM" |
| `[SAT_HOURS]` | CSV `sat_hours` | "9:00 AM - 4:00 PM" |
| `[SUN_HOURS]` | CSV `sun_hours` | "Closed" |
| `[EMAIL]` | CSV `email` | "info@mikesplumbing.com" |
| `[RATING]` | CSV `rating` | "4.9" |
| `[SERVICE_DESCRIPTION]` | CSV `service_description` | "Expert plumbing services..." |
| `[CUSTOMER_NAME_1]` through `[CUSTOMER_NAME_3]` | Auto-generated | "John Smith", "Sarah Johnson", etc. |

## Output Structure

### Generated Site Files

```
Generated-Sites/
├── mikes-plumbing-co-austin.html         ← Slugified: business-name-city.html
├── downtown-hair-salon-denver.html
├── tonys-auto-repair-seattle.html
├── sunny-fitness-gym-denver.html
├── la-bella-cafe-san-francisco.html
└── generation_manifest.json              ← If --manifest flag used
```

Each HTML file is standalone, fully customized, and deployment-ready.

### Manifest File Structure

```json
{
  "generated_at": "2026-03-25T14:30:00.123456",
  "total_generated": 5,
  "total_skipped": 0,
  "output_directory": "/full/path/to/Generated-Sites/",
  "sites": [
    {
      "filename": "mikes-plumbing-co-austin.html",
      "filepath": "/full/path/Generated-Sites/mikes-plumbing-co-austin.html",
      "business_name": "Mike's Plumbing Co",
      "city": "Austin",
      "state": "TX",
      "niche": "Plumbing",
      "template_used": "home-services_v1.0.html",
      "phone": "(512) 555-0101",
      "generated_at": "2026-03-25T14:30:00.123456"
    },
    ...
  ]
}
```

## Validation & Error Handling

### Required fields validation

The script checks each CSV row for required fields:
- `business_name`
- `niche`
- `phone`
- `city`
- `state`

If any required field is missing, that row is **skipped** and reported. The script continues with remaining rows.

### Service parsing

If no services provided, defaults to "Professional Services". If fewer than 6 services provided, remaining slots filled with "Professional Services".

### Missing data

Optional fields have sensible defaults:
- Missing phone → "(XXX) XXX-XXXX"
- Missing address → "123 Main St"
- Missing email → "contact@business.com"
- Missing hours → "9:00 AM" / "5:00 PM"

## Example Run

```bash
$ python3 site_generator_v1.0.py -i sample_site_generation_input.csv -o ./Generated-Sites/ --manifest

Reading leads from: sample_site_generation_input.csv
Found 5 total leads

Generating websites...

  [1] ✓ Mike's Plumbing Co (Austin, TX) → mikes-plumbing-co-austin.html
  [2] ✓ Downtown Hair Salon (Denver, CO) → downtown-hair-salon-denver.html
  [3] ✓ Tony's Auto Repair (Seattle, WA) → tonys-auto-repair-seattle.html
  [4] ✓ Sunny Fitness Gym (Denver, CO) → sunny-fitness-gym-denver.html
  [5] ✓ La Bella Cafe (San Francisco, CA) → la-bella-cafe-san-francisco.html

======================================================================
SUMMARY: Generated 5 websites, 0 skipped
Output directory: /full/path/to/Generated-Sites/
Manifest written: /full/path/to/Generated-Sites/generation_manifest.json
======================================================================
```

## Deployment

Once generated, HTML files are ready to deploy:

1. **Simple hosting** — Drop files into any web server, S3, Netlify, Vercel, etc.
2. **Custom domains** — Point domain to hosting provider
3. **Updates** — Regenerate files any time with updated CSV and re-deploy

## Automation Ideas

1. **Batch generation** — Run script in cron job on daily lead list
2. **Deployment pipeline** — Pipe manifest into deployment script
3. **Email notification** — Parse manifest and email links to stakeholders
4. **Database sync** — Store manifest JSON in database for CRM integration

## Troubleshooting

### "Template not found" error

Check that template directory path is correct:
```bash
ls ../Templates/Website-Templates/
```

If templates are in different location, use `--template-dir` flag:
```bash
python3 site_generator_v1.0.py -i leads.csv --template-dir /path/to/templates/
```

### CSV encoding issues

If CSV has special characters, ensure file is saved as UTF-8:
```bash
file sample_site_generation_input.csv
# Should show: UTF-8 Unicode text
```

### Empty output

Verify CSV has required columns and at least one valid row. Check console output for skip reasons.

### Permission denied on output

Ensure output directory is writable:
```bash
mkdir -p ./Generated-Sites/
chmod 755 ./Generated-Sites/
```

## Advanced Usage

### Filter + Preview + Manifest

```bash
python3 site_generator_v1.0.py -i all_leads.csv --niche gym --preview 3 --manifest
```

Generates first 3 gym-related leads with manifest.

### Custom templates directory (absolute path)

```bash
python3 site_generator_v1.0.py -i leads.csv --template-dir /opt/templates/website-templates/
```

## Performance

- **Generation speed**: ~100-200 sites per second (template loading + placeholder replacement)
- **Memory**: Minimal (loads one template into memory, then streams output)
- **Bottleneck**: File I/O and CSV reading

For 10,000+ leads, consider chunking into separate runs to avoid memory buildup.

## Support & Customization

For custom template mappings, edit the `NICHE_TO_TEMPLATE` dictionary in the script.

For new placeholder types, add to the `replacements` dictionary in `replace_placeholders()` function.

---

**Author:** Benjamin Rodriguez

**Version:** 1.0

**Last Updated:** 2026-03-25

**Status:** Production ready
