#!/usr/bin/env python3
"""ASVAB question insertion script — WK, GS, EI, AS sections (400 questions)
Run from /tmp where the section files live.
Does NOT push to Supabase — writes questions and prints counts for verification.
To insert: call insert_all() after reviewing.
"""
import json
import subprocess
import sys
import os

# ── Load questions from section modules ──────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from asvab_questions_wk import WK_QUESTIONS
from asvab_questions_gs import GS_QUESTIONS
from asvab_questions_ei import EI_QUESTIONS
from asvab_questions_as import AS_QUESTIONS

QUESTIONS = WK_QUESTIONS + GS_QUESTIONS + EI_QUESTIONS + AS_QUESTIONS

# ── Supabase config ───────────────────────────────────────────────────────────
PAT = "sbp_b365307addee578acb0ed1e4239fab0bd14f8195"
PROJECT_REF = "ugblwepfptumffzcljot"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"


def build_sql_batch(questions):
    """Build a single UPSERT SQL statement for a batch of questions."""
    def esc(s):
        return s.replace("'", "''") if isinstance(s, str) else s

    values = []
    for q in questions:
        opts_json = json.dumps(q["options"]).replace("'", "''")
        types_json = json.dumps(q["test_types"]).replace("'", "''")
        values.append(
            f"('{esc(q['id'])}', '{esc(q['section'])}', '{esc(q.get('topic', ''))}', "
            f"'{esc(q['question_text'])}', NULL, ARRAY{opts_json}::text[], "
            f"{q['correct_index']}, '{esc(q['explanation'])}', {q['difficulty']}, "
            f"ARRAY{types_json}::text[])"
        )

    sql = (
        "INSERT INTO questions "
        "(id, section, topic, question_text, passage, options, correct_index, "
        "explanation, difficulty, test_types)\nVALUES\n"
        + ",\n".join(values)
        + "\nON CONFLICT (id) DO UPDATE SET\n"
        "  question_text = EXCLUDED.question_text,\n"
        "  options       = EXCLUDED.options,\n"
        "  correct_index = EXCLUDED.correct_index,\n"
        "  explanation   = EXCLUDED.explanation,\n"
        "  difficulty    = EXCLUDED.difficulty;"
    )
    return sql


def run_query(sql):
    """Execute SQL via Supabase Management API using curl."""
    payload = json.dumps({"query": sql})
    cmd = [
        "curl", "-s", "-X", "POST", API_URL,
        "-H", "Content-Type: application/json",
        "-H", f"Authorization: Bearer {PAT}",
        "-d", payload,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    return result.stdout, result.returncode


def insert_all(batch_size=50):
    """Insert all questions in batches."""
    total = len(QUESTIONS)
    print(f"Inserting {total} questions in batches of {batch_size}...")
    inserted = 0
    for i in range(0, total, batch_size):
        batch = QUESTIONS[i : i + batch_size]
        sql = build_sql_batch(batch)
        out, code = run_query(sql)
        if '"error"' in out.lower() or code != 0:
            print(f"  BATCH {i//batch_size + 1} FAILED (questions {i+1}-{i+len(batch)})")
            print(f"  Response: {out[:400]}")
        else:
            inserted += len(batch)
            print(f"  Batch {i//batch_size + 1}: inserted {len(batch)} questions "
                  f"({inserted}/{total} total)")
    print(f"\nDone. {inserted}/{total} questions inserted.")


def print_summary():
    from collections import Counter
    counts = Counter(q["section"] for q in QUESTIONS)
    print("\n── Question counts by section ──────────────────")
    for section, count in sorted(counts.items()):
        print(f"  {section:<35} {count}")
    print(f"  {'TOTAL':<35} {len(QUESTIONS)}")
    print()

    # Spot-check 5 random questions
    import random
    random.seed(99)
    print("── Spot-check (5 random questions) ────────────")
    for q in random.sample(QUESTIONS, 5):
        correct = q["options"][q["correct_index"]]
        print(f"  [{q['id']}] {q['question_text'][:70]}")
        print(f"        Answer: {correct}  (idx={q['correct_index']}, diff={q['difficulty']})")
    print()


if __name__ == "__main__":
    print_summary()

    if "--insert" in sys.argv:
        insert_all()
    else:
        print("Dry run complete. Pass --insert to push to Supabase.")
