#!/usr/bin/env python3
"""
Shuffle question options so the correct answer is not always at a fixed position.
Updates both `options` (array) and `correct_index` (0-3) atomically.
"""
import os
import pathlib
import random
import sys
import json
import urllib.request

# Load .env from project root (zero external dependencies)
_env_file = pathlib.Path(__file__).resolve().parent.parent / ".env"
if _env_file.exists():
    for _line in _env_file.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _v = _line.split("=", 1)
            os.environ.setdefault(_k.strip(), _v.strip())

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://ugblwepfptumffzcljot.supabase.co")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
if not SERVICE_KEY:
    raise EnvironmentError(
        "SUPABASE_SERVICE_ROLE_KEY not set.\n"
        "Copy .env.example → .env and fill in your service role key."
    )

URL = SUPABASE_URL

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

def fetch_all():
    req = urllib.request.Request(
        f"{URL}/rest/v1/questions?select=id,options,correct_index",
        headers={"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def update_question(qid, options, correct_index):
    body = json.dumps({"options": options, "correct_index": correct_index}).encode()
    # URL-encode the qid in case it has special chars
    safe_id = urllib.parse.quote(qid, safe='')
    req = urllib.request.Request(
        f"{URL}/rest/v1/questions?id=eq.{safe_id}",
        data=body,
        headers=HEADERS,
        method="PATCH",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status


def main():
    random.seed(20260410)  # deterministic shuffle so repeated runs are stable
    questions = fetch_all()
    print(f"Loaded {len(questions)} questions")

    updated = 0
    skipped = 0
    before_dist = {0: 0, 1: 0, 2: 0, 3: 0}
    after_dist = {0: 0, 1: 0, 2: 0, 3: 0}

    for q in questions:
        opts = q.get("options") or []
        ci = q.get("correct_index")
        if not isinstance(opts, list) or len(opts) != 4 or ci is None:
            skipped += 1
            continue
        before_dist[ci] = before_dist.get(ci, 0) + 1

        # Create an index permutation: [0,1,2,3] -> shuffled
        idx = [0, 1, 2, 3]
        random.shuffle(idx)
        new_opts = [opts[i] for i in idx]
        # Find where the original correct answer ended up in the new array
        new_ci = idx.index(ci)
        after_dist[new_ci] = after_dist.get(new_ci, 0) + 1

        try:
            update_question(q["id"], new_opts, new_ci)
            updated += 1
        except Exception as e:
            print(f"  FAIL {q['id']}: {e}")

    print()
    print(f"Updated:  {updated}")
    print(f"Skipped:  {skipped}")
    print()
    letters = ["A", "B", "C", "D"]
    print("Before shuffle correct_index distribution:")
    for i in range(4):
        print(f"  {letters[i]}: {before_dist[i]}")
    print("After shuffle correct_index distribution:")
    for i in range(4):
        print(f"  {letters[i]}: {after_dist[i]}")


if __name__ == "__main__":
    import urllib.parse
    main()
