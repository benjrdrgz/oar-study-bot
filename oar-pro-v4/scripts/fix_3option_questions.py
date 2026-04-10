#!/usr/bin/env python3
"""
fix_3option_questions.py
------------------------
Finds all OAR practice questions with only 3 options and appends a
plausible-but-wrong 4th distractor to each. PATCHes Supabase with the
updated options array. correct_index is never touched.

Rules:
  - Fetch only rows where jsonb_array_length(options) = 3
  - Generate a thematically consistent wrong answer
  - Append to end of options array (correct_index stays valid)
  - PATCH each row; report before/after

Author: Benjamin Rodriguez
"""

import json
import re
import urllib.request
import urllib.error

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SUPABASE_URL = "https://ugblwepfptumffzcljot.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYmx3ZXBmcHR1bWZmemNsam90Iiwicm9sZSI6"
    "InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc4OTUxNiwiZXhwIjoyMDkxMzY1NTE2fQ"
    ".REDACTED_ROTATED_KEY"
)
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}


# ---------------------------------------------------------------------------
# HTTP helpers (urllib only)
# ---------------------------------------------------------------------------

def _request(method, url, data=None):
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            if raw:
                return resp.status, json.loads(raw)
            return resp.status, None
    except urllib.error.HTTPError as e:
        body_text = e.read().decode("utf-8", errors="replace")
        return e.code, body_text


def fetch_3option_questions():
    """Fetch all questions where options array has exactly 3 elements."""
    url = (
        f"{SUPABASE_URL}/rest/v1/questions"
        "?select=id,question_text,options,correct_index,explanation"
        "&options=not.is.null"
        # PostgREST filter: jsonb_array_length = 3
        # Use RPC or filter via computed column — PostgREST supports this syntax:
        # We'll use the raw SQL filter via ?filter= or just fetch all and filter locally.
        # Fetching all is safer here since count is small (<500).
        "&limit=500"
    )
    status, data = _request("GET", url)
    if status not in (200, 206):
        raise RuntimeError(f"Fetch failed: HTTP {status} — {data}")
    if not isinstance(data, list):
        raise RuntimeError(f"Unexpected response: {data}")
    # Filter client-side for exactly 3 options
    return [q for q in data if isinstance(q.get("options"), list) and len(q["options"]) == 3]


def patch_options(qid, new_options):
    """PATCH a single question's options array."""
    url = f"{SUPABASE_URL}/rest/v1/questions?id=eq.{qid}"
    status, _ = _request("PATCH", url, {"options": new_options})
    return status in (200, 204)


# ---------------------------------------------------------------------------
# Distractor generation
# ---------------------------------------------------------------------------

def _extract_numbers(text):
    """Return all numeric strings found in text."""
    return re.findall(r"\d+(?:\.\d+)?", text)


def _has_unit(text, unit_patterns):
    """Check if text contains any of the given unit patterns (case-insensitive)."""
    for pat in unit_patterns:
        if re.search(pat, text, re.IGNORECASE):
            return True
    return False


def _numeric_distractor(options, question_text, explanation):
    """
    For questions with numeric options, generate a number that:
      - Is not already in options
      - Is in the same ballpark (same order of magnitude)
      - Shares the same unit suffix
    """
    # Collect all option numbers and units
    existing_nums = set()
    unit_suffix = ""
    for opt in options:
        nums = _extract_numbers(opt)
        existing_nums.update(float(n) for n in nums)
        # Detect unit suffix — grab trailing non-numeric chars
        m = re.search(r"[\d.]+\s*([^\d]+)$", opt.strip())
        if m and not unit_suffix:
            unit_suffix = m.group(1).strip()

    if not existing_nums:
        return None

    sorted_nums = sorted(existing_nums)
    lo, hi = sorted_nums[0], sorted_nums[-1]

    # Strategy: pick values adjacent to the range, or interpolated
    candidates = []
    step = (hi - lo) / max(len(sorted_nums), 1)
    if step == 0:
        step = lo * 0.5 if lo > 0 else 1.0

    for mult in [0.5, 0.6, 0.75, 1.25, 1.5, 2.0, 0.4, 1.75, 3.0]:
        val = round(hi * mult, 2) if hi > 0 else round(lo + step * mult, 2)
        if val not in existing_nums and val > 0:
            candidates.append(val)

    # Also try lo - step
    below = round(lo - step, 2)
    if below > 0 and below not in existing_nums:
        candidates.insert(0, below)

    if not candidates:
        return None

    val = candidates[0]
    # Format: if all options are integers, use int
    if all(n == int(n) for n in existing_nums) and val == int(val):
        val_str = str(int(val))
    else:
        val_str = str(val).rstrip("0").rstrip(".")

    return f"{val_str} {unit_suffix}".strip() if unit_suffix else val_str


def _conceptual_distractor(options, question_text, explanation):
    """
    For conceptual (non-numeric) questions, produce a plausible-but-wrong option
    by applying logical negation, substitution, or domain-specific opposites.
    """
    # Collect option text (lowercased for analysis)
    opts_lower = [o.lower() for o in options]
    combined = " ".join(opts_lower) + " " + question_text.lower()

    # Domain-specific distractor banks keyed by topic signals
    DISTRACTOR_BANKS = {
        # Physics — forces / motion
        ("velocity", "speed", "m/s", "mph", "km/h", "acceleration", "deceleration"):
            ["The object moves at constant speed", "The velocity remains unchanged",
             "The net force doubles the speed", "The object decelerates uniformly"],
        ("force", "newton", "net force", "resultant"):
            ["The forces are always balanced", "Net force acts perpendicular to motion",
             "The object experiences zero acceleration", "Force is inversely proportional to mass"],
        ("pressure", "pascal", "fluid", "water"):
            ["Pressure increases with decreased depth", "Pressure is independent of depth",
             "The fluid pressure acts only downward", "Pressure decreases with greater depth"],
        ("energy", "joule", "kinetic", "potential", "work"):
            ["Energy is always lost as light", "Potential energy remains constant throughout",
             "Kinetic energy is independent of velocity", "Work done equals force times time"],
        ("wave", "frequency", "wavelength", "amplitude", "hertz"):
            ["Frequency increases as wavelength increases", "Amplitude determines wave speed",
             "Wave speed depends only on frequency", "Wavelength and frequency are independent"],
        ("current", "voltage", "resistance", "ohm", "circuit", "ampere"):
            ["Resistance decreases as current increases", "Voltage is independent of resistance",
             "Current flows opposite to electron movement", "Power equals current divided by voltage"],
        ("gravity", "gravitational", "weight", "mass"):
            ["Weight is independent of gravitational field", "Mass changes with altitude",
             "Gravity acts only on charged objects", "Weight equals mass times velocity"],
        ("friction", "coefficient", "normal force", "drag"):
            ["Friction always acts in the direction of motion", "Friction is independent of surface area",
             "The coefficient of friction depends on speed", "Kinetic friction is greater than static friction"],

        # Math / rates
        ("ratio", "proportion", "percent", "rate", "average"):
            ["The ratio remains constant regardless of scale", "The percentage decreases as the total increases",
             "The average equals the highest value divided by two", "The rate of change is always zero"],
        ("probability", "chance", "likelihood"):
            ["The probability always sums to more than 1", "Each outcome has equal probability",
             "Past outcomes affect future probability", "The probability is independent of sample size"],

        # Reading / verbal
        ("main idea", "passage", "author", "paragraph", "tone"):
            ["The author expresses a neutral, detached tone throughout",
             "The passage presents only one perspective",
             "The main idea is stated only in the conclusion",
             "The author relies exclusively on emotional appeals"],

        # Biology / science
        ("cell", "membrane", "nucleus", "protein", "dna", "rna"):
            ["The cell membrane is impermeable to all substances",
             "DNA is found only in the cytoplasm",
             "Proteins are synthesized in the nucleus",
             "The mitochondria control cell division"],
    }

    # Check which bank applies
    for keywords, distractors in DISTRACTOR_BANKS.items():
        if any(kw in combined for kw in keywords):
            # Return first distractor not already present as an option
            for d in distractors:
                if not any(d.lower() in o.lower() or o.lower() in d.lower() for o in options):
                    return d

    # Generic fallback: invert the "most descriptive" option
    # Find the longest option (usually most specific) and negate it
    longest_opt = max(options, key=len)

    # Common inversion patterns
    INVERSIONS = [
        (r"\bincreases\b", "decreases"), (r"\bdecreases\b", "increases"),
        (r"\bgreater\b", "less"), (r"\bless\b", "greater"),
        (r"\bhigher\b", "lower"), (r"\blower\b", "higher"),
        (r"\bfaster\b", "slower"), (r"\bslower\b", "faster"),
        (r"\bmore\b", "less"), (r"\bless\b", "more"),
        (r"\bpositive\b", "negative"), (r"\bnegative\b", "positive"),
        (r"\bdirect\b", "inverse"), (r"\binverse\b", "direct"),
        (r"\bparallel\b", "perpendicular"), (r"\bperpendicular\b", "parallel"),
        (r"\bmaximum\b", "minimum"), (r"\bminimum\b", "maximum"),
        (r"\bdoubles\b", "halves"), (r"\bhalves\b", "doubles"),
        (r"\bequal\b", "unequal"), (r"\bunequal\b", "equal"),
    ]

    inverted = longest_opt
    for pattern, replacement in INVERSIONS:
        new = re.sub(pattern, replacement, inverted, flags=re.IGNORECASE, count=1)
        if new != inverted:
            inverted = new
            break

    if inverted != longest_opt and not any(
        inverted.lower() in o.lower() or o.lower() in inverted.lower() for o in options
    ):
        return inverted

    # Last resort: add a plausible-sounding generic wrong answer based on question stem
    return _stem_based_distractor(question_text, options)


def _stem_based_distractor(question_text, options):
    """
    Generate a distractor by analyzing the question stem for domain context
    and picking a plausible-sounding wrong numerical or conceptual answer.
    """
    q = question_text.lower()

    # Speed / velocity questions
    if any(kw in q for kw in ["speed", "velocity", "rate"]):
        nums = _extract_numbers(question_text)
        if nums:
            base = float(nums[0])
            new_val = round(base * 1.5, 1)
            return f"{new_val} m/s"
        return "45 m/s"

    # Distance / displacement
    if any(kw in q for kw in ["distance", "displacement", "how far", "length"]):
        nums = _extract_numbers(question_text)
        if nums:
            base = float(nums[0])
            new_val = round(base * 0.75, 1)
            return f"{new_val} m"
        return "15 m"

    # Time
    if any(kw in q for kw in ["time", "how long", "seconds", "minutes"]):
        nums = _extract_numbers(question_text)
        if nums:
            base = float(nums[0])
            new_val = round(base * 2, 1)
            return f"{new_val} seconds"
        return "8 seconds"

    # Force / weight
    if any(kw in q for kw in ["force", "weight", "mass"]):
        return "The net force acts in the same direction as displacement"

    # Conceptual fallback
    return "None of the other options are correct"


def generate_distractor(options, question_text, explanation):
    """
    Main entry: determine whether question is numeric or conceptual
    and delegate to the appropriate generator.
    """
    # Check if options are predominantly numeric
    numeric_count = sum(1 for o in options if re.search(r"\d", o))
    is_numeric = numeric_count >= 2

    if is_numeric:
        result = _numeric_distractor(options, question_text, explanation)
        if result:
            return result

    # Fall through to conceptual
    result = _conceptual_distractor(options, question_text, explanation)
    if result:
        return result

    # Final safety net
    return _stem_based_distractor(question_text, options)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 70)
    print("OAR Pro v4 — Fix 3-option questions (add 4th distractor)")
    print("=" * 70)

    print("\nFetching questions with exactly 3 options from Supabase...")
    questions = fetch_3option_questions()
    print(f"  Found {len(questions)} questions to fix.\n")

    if not questions:
        print("No questions with 3 options found. Nothing to do.")
        return

    fixed = 0
    failed = []

    for q in questions:
        qid = q["id"]
        question_text = q.get("question_text", "")
        options = q["options"]
        correct_index = q.get("correct_index", 0)
        explanation = q.get("explanation", "")

        distractor = generate_distractor(options, question_text, explanation)
        new_options = options + [distractor]

        # Report before/after
        print(f"  [{qid}]")
        print(f"    Question: {question_text[:80]}{'...' if len(question_text) > 80 else ''}")
        print(f"    BEFORE options:   {options}")
        print(f"    NEW distractor:   \"{distractor}\"")
        print(f"    AFTER options:    {new_options}")
        print(f"    correct_index:    {correct_index} (unchanged) -> \"{options[correct_index]}\"")

        ok = patch_options(qid, new_options)
        if ok:
            print(f"    STATUS: PATCHED OK\n")
            fixed += 1
        else:
            print(f"    STATUS: FAILED\n")
            failed.append(qid)

    print("=" * 70)
    print("FINAL REPORT")
    print("=" * 70)
    print(f"  Total 3-option questions found:  {len(questions)}")
    print(f"  Successfully fixed (4 options):  {fixed}")
    print(f"  Failed to patch:                 {len(failed)}")
    if failed:
        print(f"  Failed IDs: {failed}")
    print("=" * 70)


if __name__ == "__main__":
    main()
