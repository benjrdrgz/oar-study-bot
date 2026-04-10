#!/usr/bin/env python3
"""
seed_formulas.py — OAR Pro v4
Seeds the Supabase `formulas` table from the hardcoded FORMULA_DATA in formulas.js.

Usage:
    python3 seed_formulas.py

Steps:
  1. Parse FORMULA_DATA from JS source (no JS engine needed — data extracted inline here)
  2. Check existing row count; DELETE all if > 0
  3. Bulk POST all rows to /rest/v1/formulas
  4. Fetch first 3 rows back to verify single backslashes in latex

— Benjamin Rodriguez
"""

import json
import urllib.request
import urllib.error

# ── CONFIG ────────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://ugblwepfptumffzcljot.supabase.co"
SERVICE_KEY  = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYmx3ZXBmcHR1bWZmemNsam90Iiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc4OTUxNiwiZXhwIjoyMDkxMzY1NTE2fQ."
    "REDACTED_ROTATED_KEY"
)
HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

# ── tab → section label mapping (matches Supabase schema) ─────────────────────
TAB_TO_SECTION = {
    "math":       "Math",
    "mechanical": "Mechanical",
    "reading":    "Reading",
}

# ── RAW FORMULA DATA (extracted from formulas.js) ─────────────────────────────
# Python strings use single backslash — these map 1-to-1 to MathJax LaTeX.
FORMULA_DATA = [
    # ── ARITHMETIC ──────────────────────────────────────────────────────────
    {
        "section": "Arithmetic",
        "tab": "math",
        "formulas": [
            {
                "name": "Order of Operations (PEMDAS)",
                "latex": r"\text{Parentheses} \to \text{Exponents} \to \text{Mult/Div} \to \text{Add/Sub}",
                "note": "Left to right within same tier.",
            },
            {
                "name": "Percent of a Number",
                "latex": r"\text{Part} = \frac{\text{Percent}}{100} \times \text{Whole}",
                "note": "Example: 35% of 80 = 0.35 × 80 = 28",
            },
            {
                "name": "Percent Change",
                "latex": r"\% \text{ Change} = \frac{\text{New} - \text{Old}}{\text{Old}} \times 100",
                "note": "Positive = increase, negative = decrease.",
            },
            {
                "name": "Fraction Division",
                "latex": r"\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c}",
                "note": "Multiply by the reciprocal.",
            },
            {
                "name": "Average (Mean)",
                "latex": r"\bar{x} = \frac{\sum x_i}{n}",
                "note": "Sum of all values divided by count.",
            },
            {
                "name": "Ratio / Proportion",
                "latex": r"\frac{a}{b} = \frac{c}{d} \implies ad = bc",
                "note": "Cross-multiply to solve.",
            },
        ],
    },
    # ── ALGEBRA ─────────────────────────────────────────────────────────────
    {
        "section": "Algebra",
        "tab": "math",
        "formulas": [
            {
                "name": "Quadratic Formula",
                "latex": r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
                "note": "Solves ax² + bx + c = 0",
            },
            {
                "name": "Slope of a Line",
                "latex": r"m = \frac{y_2 - y_1}{x_2 - x_1}",
                "note": "Rise over run between two points.",
            },
            {
                "name": "Slope-Intercept Form",
                "latex": r"y = mx + b",
                "note": "m = slope, b = y-intercept",
            },
            {
                "name": "Distance Formula",
                "latex": r"d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
                "note": "Distance between two coordinate points.",
            },
            {
                "name": "Distance / Rate / Time",
                "latex": r"d = r \times t",
                "note": "Rearranges to r = d/t and t = d/r.",
            },
            {
                "name": "Work Rate",
                "latex": r"\frac{1}{t_1} + \frac{1}{t_2} = \frac{1}{t_{combined}}",
                "note": "How long two workers finish a job together.",
            },
        ],
    },
    # ── GEOMETRY ────────────────────────────────────────────────────────────
    {
        "section": "Geometry",
        "tab": "math",
        "formulas": [
            {
                "name": "Pythagorean Theorem",
                "latex": r"a^2 + b^2 = c^2",
                "note": "c is the hypotenuse. Common triples: 3-4-5, 5-12-13.",
            },
            {
                "name": "Area — Rectangle",
                "latex": r"A = l \times w",
                "note": "",
            },
            {
                "name": "Area — Triangle",
                "latex": r"A = \frac{1}{2} b h",
                "note": "b = base, h = perpendicular height.",
            },
            {
                "name": "Area — Circle",
                "latex": r"A = \pi r^2",
                "note": "Use π ≈ 3.14 on OAR.",
            },
            {
                "name": "Circumference — Circle",
                "latex": r"C = 2\pi r = \pi d",
                "note": "",
            },
            {
                "name": "Volume — Rectangular Prism",
                "latex": r"V = l \times w \times h",
                "note": "",
            },
            {
                "name": "Volume — Cylinder",
                "latex": r"V = \pi r^2 h",
                "note": "",
            },
        ],
    },
    # ── WORD PROBLEMS ────────────────────────────────────────────────────────
    {
        "section": "Word Problems",
        "tab": "math",
        "formulas": [
            {
                "name": "Simple Interest",
                "latex": r"I = P \times r \times t",
                "note": "P = principal, r = annual rate (decimal), t = years.",
            },
            {
                "name": "Mixture / Weighted Average",
                "latex": r"\bar{x} = \frac{n_1 x_1 + n_2 x_2}{n_1 + n_2}",
                "note": "Combine two groups with different averages.",
            },
            {
                "name": "Profit / Loss",
                "latex": r"\text{Profit} = \text{Revenue} - \text{Cost}",
                "note": "",
            },
        ],
    },
    # ── FORCES ──────────────────────────────────────────────────────────────
    {
        "section": "Forces",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Newton's Second Law",
                "latex": r"F = ma",
                "note": "F = force (N), m = mass (kg), a = acceleration (m/s²).",
            },
            {
                "name": "Weight",
                "latex": r"W = mg",
                "note": "g ≈ 9.8 m/s² on Earth.",
            },
            {
                "name": "Pressure",
                "latex": r"P = \frac{F}{A}",
                "note": "Force per unit area (Pa or psi).",
            },
            {
                "name": "Friction Force",
                "latex": r"f = \mu N",
                "note": "μ = coefficient of friction, N = normal force.",
            },
        ],
    },
    # ── LEVERS ──────────────────────────────────────────────────────────────
    {
        "section": "Levers",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Lever Balance",
                "latex": r"F_1 \times d_1 = F_2 \times d_2",
                "note": "Effort × effort arm = load × load arm.",
            },
            {
                "name": "Mechanical Advantage — Lever",
                "latex": r"MA = \frac{\text{Load}}{\text{Effort}} = \frac{d_{effort}}{d_{load}}",
                "note": "MA > 1 means mechanical advantage gained.",
            },
        ],
    },
    # ── GEARS ───────────────────────────────────────────────────────────────
    {
        "section": "Gears",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Gear Ratio",
                "latex": r"GR = \frac{N_{driven}}{N_{driver}}",
                "note": "N = number of teeth. GR > 1 = more torque, less speed.",
            },
            {
                "name": "Speed Ratio",
                "latex": r"\frac{\omega_1}{\omega_2} = \frac{N_2}{N_1}",
                "note": "Gear speed is inversely proportional to tooth count.",
            },
            {
                "name": "Gear Direction",
                "latex": r"\text{Meshing gears rotate in opposite directions}",
                "note": "Even number of gears in a chain → same direction as input.",
            },
        ],
    },
    # ── PULLEYS ─────────────────────────────────────────────────────────────
    {
        "section": "Pulleys",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Mechanical Advantage — Pulley",
                "latex": r"MA = \text{number of rope segments supporting the load}",
                "note": "Count only segments attached to the moving block.",
            },
            {
                "name": "Effort Force",
                "latex": r"E = \frac{L}{MA}",
                "note": "L = load weight, ignoring friction.",
            },
        ],
    },
    # ── ENERGY ──────────────────────────────────────────────────────────────
    {
        "section": "Energy",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Kinetic Energy",
                "latex": r"KE = \frac{1}{2}mv^2",
                "note": "m = mass (kg), v = velocity (m/s).",
            },
            {
                "name": "Potential Energy",
                "latex": r"PE = mgh",
                "note": "h = height above reference point.",
            },
            {
                "name": "Work",
                "latex": r"W = F \times d \times \cos\theta",
                "note": "θ = angle between force and displacement direction.",
            },
            {
                "name": "Power",
                "latex": r"P = \frac{W}{t}",
                "note": "Watts = Joules per second.",
            },
            {
                "name": "Conservation of Energy",
                "latex": r"KE_1 + PE_1 = KE_2 + PE_2",
                "note": "Total mechanical energy constant (no friction).",
            },
        ],
    },
    # ── FLUIDS ──────────────────────────────────────────────────────────────
    {
        "section": "Fluids",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Density",
                "latex": r"\rho = \frac{m}{V}",
                "note": "kg/m³. Water ≈ 1000 kg/m³.",
            },
            {
                "name": "Buoyancy (Archimedes)",
                "latex": r"F_b = \rho_{fluid} \times V_{displaced} \times g",
                "note": "Object floats if F_b ≥ weight.",
            },
            {
                "name": "Pascal's Principle",
                "latex": r"\frac{F_1}{A_1} = \frac{F_2}{A_2}",
                "note": "Pressure transmitted equally in enclosed fluid.",
            },
            {
                "name": "Continuity Equation",
                "latex": r"A_1 v_1 = A_2 v_2",
                "note": "Narrow pipe → faster flow. Volume flow rate constant.",
            },
        ],
    },
    # ── ELECTRICITY ──────────────────────────────────────────────────────────
    {
        "section": "Electricity",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Ohm's Law",
                "latex": r"V = IR",
                "note": "V = voltage (V), I = current (A), R = resistance (Ω).",
            },
            {
                "name": "Power (Electrical)",
                "latex": r"P = IV = I^2R = \frac{V^2}{R}",
                "note": "Watts. Use whichever form has known variables.",
            },
            {
                "name": "Series Resistance",
                "latex": r"R_{total} = R_1 + R_2 + R_3 + \cdots",
                "note": "Total resistance increases. Current same through all.",
            },
            {
                "name": "Parallel Resistance",
                "latex": r"\frac{1}{R_{total}} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots",
                "note": "Total resistance decreases. Voltage same across all.",
            },
        ],
    },
    # ── MOMENTUM ────────────────────────────────────────────────────────────
    {
        "section": "Momentum",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Linear Momentum",
                "latex": r"p = mv",
                "note": "kg·m/s. Momentum is conserved in collisions.",
            },
            {
                "name": "Conservation of Momentum",
                "latex": r"m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'",
                "note": "Before = after in closed system.",
            },
            {
                "name": "Impulse",
                "latex": r"J = F \Delta t = \Delta p",
                "note": "Force × time = change in momentum.",
            },
        ],
    },
    # ── KINEMATICS ──────────────────────────────────────────────────────────
    {
        "section": "Kinematics",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Velocity (constant acceleration)",
                "latex": r"v = v_0 + at",
                "note": "v₀ = initial velocity, a = acceleration, t = time.",
            },
            {
                "name": "Displacement",
                "latex": r"d = v_0 t + \frac{1}{2}at^2",
                "note": "",
            },
            {
                "name": "Velocity² Relation",
                "latex": r"v^2 = v_0^2 + 2ad",
                "note": "Useful when time is not given.",
            },
        ],
    },
    # ── GAS LAWS ─────────────────────────────────────────────────────────────
    {
        "section": "Gas Laws",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Boyle's Law",
                "latex": r"P_1 V_1 = P_2 V_2",
                "note": "Constant temperature. Pressure × volume = constant.",
            },
            {
                "name": "Charles's Law",
                "latex": r"\frac{V_1}{T_1} = \frac{V_2}{T_2}",
                "note": "Constant pressure. T must be in Kelvin (K = °C + 273).",
            },
            {
                "name": "Combined Gas Law",
                "latex": r"\frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}",
                "note": "Use when P, V, and T all change.",
            },
        ],
    },
    # ── HEAT TRANSFER ────────────────────────────────────────────────────────
    {
        "section": "Heat Transfer",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Heat Energy",
                "latex": r"Q = mc\Delta T",
                "note": "m = mass, c = specific heat, ΔT = temp change.",
            },
            {
                "name": "Thermal Conduction",
                "latex": r"Q = \frac{kA\Delta T \cdot t}{d}",
                "note": "k = conductivity, A = area, d = thickness.",
            },
        ],
    },
    # ── MAGNETISM ────────────────────────────────────────────────────────────
    {
        "section": "Magnetism",
        "tab": "mechanical",
        "formulas": [
            {
                "name": "Magnetic Force on a Charge",
                "latex": r"F = qvB\sin\theta",
                "note": "q = charge, v = velocity, B = magnetic field strength.",
            },
            {
                "name": "Electromagnetic Induction",
                "latex": r"\mathcal{E} = -\frac{\Delta \Phi}{\Delta t}",
                "note": "Changing magnetic flux induces voltage (Faraday's Law).",
            },
            {
                "name": "Right-Hand Rule",
                "latex": r"\text{Point fingers in direction of } \vec{v}, \text{ curl toward } \vec{B} \Rightarrow \text{thumb} = \vec{F}",
                "note": "For positive charges. Reverse for negative.",
            },
        ],
    },
]


# ── HELPERS ───────────────────────────────────────────────────────────────────

def supabase_request(method, path, body=None, extra_headers=None):
    """Make a Supabase REST request using urllib only."""
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    headers = dict(HEADERS)
    if extra_headers:
        headers.update(extra_headers)

    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        raw = e.read()
        return e.code, json.loads(raw) if raw else None


def get_row_count():
    """SELECT count(*) from formulas."""
    status, data = supabase_request(
        "GET",
        "formulas?select=id",
        extra_headers={"Prefer": "count=exact", "Range": "0-0"},
    )
    # Supabase returns Content-Range header; we just check if any rows exist
    # by trying to get the first row and seeing the response
    status2, data2 = supabase_request("GET", "formulas?select=id&limit=1")
    if status2 == 200 and isinstance(data2, list):
        # Get exact count with a different approach
        status3, data3 = supabase_request(
            "GET",
            "formulas?select=count",
            extra_headers={"Prefer": "count=exact"},
        )
        # Fall back: just return len of full fetch
        status_all, data_all = supabase_request("GET", "formulas?select=id")
        if status_all == 200 and isinstance(data_all, list):
            return len(data_all)
    return 0


def delete_all_rows():
    """DELETE all rows from formulas."""
    # Supabase REST: DELETE with a filter that matches everything
    status, data = supabase_request(
        "DELETE",
        "formulas?id=gte.0",  # id >= 0 = all rows
        extra_headers={"Prefer": "return=minimal"},
    )
    return status


def build_rows():
    """Flatten FORMULA_DATA into DB rows with correct section/category/sort_order."""
    rows = []
    for group in FORMULA_DATA:
        tab      = group["tab"]
        category = group["section"]   # JS "section" → DB "category"
        section  = TAB_TO_SECTION.get(tab, tab.capitalize())  # DB "section"

        for i, f in enumerate(group["formulas"]):
            note_raw = f.get("note", "") or ""
            note_val = note_raw.strip() if note_raw.strip() else None

            rows.append({
                "section":    section,
                "category":   category,
                "name":       f["name"],
                "latex":      f["latex"],   # Python raw string = single backslash
                "description": note_val,    # JS 'note' → DB 'description' column
                "sort_order": (i + 1) * 10,
            })
    return rows


def insert_rows(rows):
    """Bulk POST rows. Supabase accepts a JSON array."""
    status, data = supabase_request(
        "POST",
        "formulas",
        body=rows,
        extra_headers={"Prefer": "return=minimal"},
    )
    return status, data


def fetch_sample(n=3):
    """Fetch first n rows ordered by id."""
    status, data = supabase_request(
        "GET",
        f"formulas?select=id,section,category,name,latex,description,sort_order&order=id.asc&limit={n}",
    )
    return status, data


# ── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("OAR Pro v4 — Supabase Formula Seeder")
    print("=" * 60)

    # 1. Build rows
    rows = build_rows()
    total_extracted = len(rows)

    # Count by section
    section_counts = {}
    for r in rows:
        sec = r["section"]
        section_counts[sec] = section_counts.get(sec, 0) + 1

    print(f"\nExtracted {total_extracted} formulas from FORMULA_DATA:")
    for sec, cnt in sorted(section_counts.items()):
        print(f"  {sec}: {cnt}")

    # 2. Check existing row count
    print("\nChecking existing rows in Supabase...")
    existing = get_row_count()
    print(f"  Found {existing} existing row(s).")

    if existing > 0:
        print(f"  Deleting all {existing} rows before re-seeding...")
        del_status = delete_all_rows()
        if del_status in (200, 204):
            print("  Deleted successfully.")
        else:
            print(f"  WARNING: DELETE returned status {del_status}. Proceeding anyway.")

    # 3. Insert
    print(f"\nInserting {total_extracted} rows...")
    ins_status, ins_data = insert_rows(rows)

    if ins_status in (200, 201):
        print(f"  Inserted {total_extracted} rows successfully (HTTP {ins_status}).")
        total_inserted = total_extracted
    else:
        print(f"  ERROR: INSERT returned HTTP {ins_status}")
        print(f"  Response: {ins_data}")
        total_inserted = 0

    # 4. Summary by section
    print("\nInsertion summary:")
    for sec, cnt in sorted(section_counts.items()):
        status_icon = "OK" if total_inserted > 0 else "FAIL"
        print(f"  [{status_icon}] {sec}: {cnt} formula(s)")

    print(f"\nTotal extracted : {total_extracted}")
    print(f"Total inserted  : {total_inserted}")

    # 5. Verification — fetch first 3 rows
    print("\nVerification — first 3 rows from Supabase:")
    print("-" * 60)
    v_status, v_data = fetch_sample(3)

    if v_status == 200 and isinstance(v_data, list):
        for row in v_data:
            latex_val = row.get("latex", "")
            double_bs = latex_val.count("\\\\")
            single_bs = latex_val.count("\\") - double_bs * 2

            print(f"  id          : {row.get('id')}")
            print(f"  section     : {row.get('section')}")
            print(f"  category    : {row.get('category')}")
            print(f"  name        : {row.get('name')}")
            print(f"  latex       : {latex_val}")
            print(f"  backslash check: {single_bs} single, {double_bs} double (want 0 double)")
            print(f"  description : {row.get('description')}")
            print(f"  sort_order  : {row.get('sort_order')}")
            print()

        if all(row.get("latex", "").count("\\\\") == 0 for row in v_data):
            print("PASS — No double backslashes detected. MathJax will render correctly.")
        else:
            print("WARN — Double backslashes found in latex. Check the insert pipeline.")
    else:
        print(f"  Could not fetch sample rows (HTTP {v_status}): {v_data}")

    print("=" * 60)
    print("Done.")


if __name__ == "__main__":
    main()
