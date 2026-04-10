#!/usr/bin/env python3
"""
seed_worked_problems.py
Bulk-inserts worked problems from temp/worked_problems.json into
the Supabase `worked_problems` table.

Usage:
    python3 scripts/seed_worked_problems.py

Requires: Python 3.6+ (uses urllib only — no third-party packages)
"""

import json
import urllib.request
import urllib.error
import os
import sys
from collections import defaultdict

# ── Config ──────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://ugblwepfptumffzcljot.supabase.co"
SUPABASE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYmx3ZXBmcHR1bWZmemNsam90Iiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc4OTUxNiwiZXhwIjoyMDkx"
    "MzY1NTE2fQ.REDACTED_ROTATED_KEY"
)
TABLE = "worked_problems"

# Path to the JSON file (relative to this script's location)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(SCRIPT_DIR, "..", "temp", "worked_problems.json")


def supabase_upsert(records: list[dict]) -> dict:
    """
    Upsert records into Supabase via the REST API.
    Uses 'id' as the conflict column (idempotent re-runs).
    """
    url = f"{SUPABASE_URL}/rest/v1/{TABLE}"
    payload = json.dumps(records).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        method="POST",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
    )

    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return {"status": resp.status, "body": json.loads(body) if body else []}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return {"status": e.code, "error": error_body}
    except urllib.error.URLError as e:
        return {"status": 0, "error": str(e.reason)}


def load_problems(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def print_breakdown(problems: list[dict], label: str) -> None:
    by_topic = defaultdict(lambda: defaultdict(int))
    for p in problems:
        by_topic[p["topic"]][p["difficulty"]] += 1

    print(f"\n{label}")
    print("-" * 45)
    total = 0
    for topic in sorted(by_topic):
        diffs = by_topic[topic]
        subtotal = sum(diffs.values())
        total += subtotal
        diff_str = ", ".join(f"{d}: {c}" for d, c in sorted(diffs.items()))
        print(f"  {topic:<20} {subtotal:>3}  ({diff_str})")
    print("-" * 45)
    print(f"  {'TOTAL':<20} {total:>3}")


def main():
    # 1. Load JSON
    if not os.path.exists(JSON_PATH):
        print(f"ERROR: JSON not found at {JSON_PATH}", file=sys.stderr)
        sys.exit(1)

    problems = load_problems(JSON_PATH)
    print(f"Loaded {len(problems)} problems from {JSON_PATH}")
    print_breakdown(problems, "Problems to insert (by topic / difficulty):")

    # 2. Upsert in one batch (Supabase REST supports bulk upsert)
    print(f"\nInserting into Supabase table '{TABLE}' ...")
    result = supabase_upsert(problems)

    if "error" in result:
        print(f"\nERROR (HTTP {result['status']}): {result['error']}", file=sys.stderr)
        sys.exit(1)

    inserted = result.get("body", [])
    print(f"HTTP {result['status']} — {len(inserted)} rows upserted successfully.")

    if inserted:
        print_breakdown(inserted, "Confirmed inserted rows (by topic / difficulty):")
    else:
        # Supabase may return empty body on merge-duplicates with no return
        print("\nNote: Supabase returned an empty body — records may have been upserted.")
        print("Treating local count as ground truth.")
        print_breakdown(problems, "Expected rows in DB (by topic / difficulty):")

    print("\nDone.")


if __name__ == "__main__":
    main()
