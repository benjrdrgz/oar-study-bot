#!/usr/bin/env python3
"""
Business Bootstrap Script
=========================
Creates the complete folder structure for a new business with all standard
directories, starter files, and templates. Run this when Benjamin starts
any new business and it instantly gets the same infrastructure.

Usage:
    python bootstrap_business.py "Business Name"

Example:
    python bootstrap_business.py "Real Estate Rentals"
    python bootstrap_business.py "E-Commerce Brand"

— Benjamin Rodriguez
"""

import os
import sys
from datetime import datetime

def create_business(name):
    """Create full business scaffold."""

    # Determine base path (same level as Website Agency)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)  # Goes up from _System to workspace root
    base = os.path.join(os.path.dirname(parent_dir), name) if os.path.basename(parent_dir) == '_System' else os.path.join(parent_dir, name)

    # Actually, keep businesses at the same level as Website Agency
    workspace = os.path.dirname(os.path.abspath(__file__)).replace('/_System', '').replace('/Website Agency/_System', '').replace('/Website Agency', '')
    # Simple approach: go to the parent of Website Agency
    parts = os.path.abspath(__file__).split('/')
    # Find "Website Agency" in path and go one level above
    for i, part in enumerate(parts):
        if part == 'Website Agency':
            workspace = '/'.join(parts[:i])
            break

    base = os.path.join(workspace, name)

    folders = [
        # Core
        f"{base}/Brand",
        f"{base}/Client-Onboarding",
        # Guides
        f"{base}/Guides/Operations",
        f"{base}/Guides/Sales",
        f"{base}/Guides/Technical",
        f"{base}/Guides/Research",
        # Logs
        f"{base}/Logs/Session-Logs",
        # Outputs
        f"{base}/Outputs",
        f"{base}/Outputs/Summaries",
        # Reports
        f"{base}/Reports",
        # Scripts
        f"{base}/Scripts",
        f"{base}/Scripts/Sample-Data",
        # Templates
        f"{base}/Templates",
        f"{base}/Templates/Contracts",
        f"{base}/Templates/Email-Templates",
        f"{base}/Templates/Proposals",
        # Projects (business-specific initiatives)
        f"{base}/Projects",
    ]

    for folder in folders:
        os.makedirs(folder, exist_ok=True)

    today = datetime.now().strftime('%Y-%m-%d')

    # Create DIRECTORY_MAP.md
    dir_map = f"""# {name} — Directory Map

**Last updated:** {today}
**Status:** Just bootstrapped — ready for buildout

---

## Folder Structure

```
{name}/
├── Brand/                  ← Business identity, names, logos, colors
├── Client-Onboarding/      ← Welcome packets, intake forms
├── Guides/
│   ├── Operations/         ← SOPs, daily checklists, processes
│   ├── Sales/              ← Call scripts, objection handling
│   ├── Technical/          ← Setup guides, tool configs
│   └── Research/           ← Market research, competitive intel
├── Logs/
│   └── Session-Logs/       ← What was worked on each session
├── Outputs/
│   └── Summaries/          ← Session summaries, delivery notes
├── Reports/                ← Financial projections, dashboards, KPIs
├── Scripts/                ← Automation scripts
│   └── Sample-Data/        ← Test CSVs and sample inputs
├── Templates/              ← Reusable templates
│   ├── Contracts/          ← Service agreements, legal docs
│   ├── Email-Templates/    ← Outreach sequences, follow-ups
│   └── Proposals/          ← Client-facing proposals
└── Projects/               ← Active initiatives and sub-projects
```

## Quick Start
1. Define the business model and revenue streams
2. Build out Brand/ with name, identity, positioning
3. Create Templates/ for core deliverables
4. Set up Scripts/ for automation
5. Log everything in Logs/Session-Logs/

— Benjamin Rodriguez
"""
    with open(f"{base}/DIRECTORY_MAP.md", 'w') as f:
        f.write(dir_map)

    # Create first session log
    session_log = f"""# Session Log — {today}

## What was worked on
- Business folder bootstrapped with standard structure
- Ready for initial buildout

## Decisions made
- Using standard Rodriguez business template
- All cross-business tools (PhD, context packets) in _System/

## Current status
- **Phase:** Day 0 — Infrastructure created
- **Next milestone:** Define business model, revenue streams, and core deliverables

## What to pick up next time
- [ ] Define the business model (what are we selling, to whom, at what price?)
- [ ] Identify the 3 highest-ROI deliverables to build first
- [ ] Create brand identity (name, positioning, elevator pitch)
- [ ] Build first templates and automation scripts

— Benjamin Rodriguez
"""
    with open(f"{base}/Logs/Session-Logs/session-log-{today}.md", 'w') as f:
        f.write(session_log)

    # Create starter README
    readme = f"""# {name}

**Created:** {today}
**Owner:** Benjamin Rodriguez
**Status:** Bootstrapped — ready for buildout

## About This Business
[Define: What is this business? Who does it serve? How does it make money?]

## Revenue Model
[Define: What are the revenue streams? Pricing? Recurring vs one-time?]

## Current Phase
Day 0 — Folder structure created. Ready for initial buildout.

## Key Files
- `DIRECTORY_MAP.md` — Where everything lives
- `Logs/Session-Logs/` — Session continuity logs
- `_System/` (parent level) — PhD Knowledge Base, context packets, global tools

— Benjamin Rodriguez
"""
    with open(f"{base}/README.md", 'w') as f:
        f.write(readme)

    print(f"\n{'='*60}")
    print(f"  ✅ Business '{name}' bootstrapped successfully!")
    print(f"{'='*60}")
    print(f"\n  Location: {base}/")
    print(f"  Folders created: {len(folders)}")
    print(f"  Files created: 3 (DIRECTORY_MAP.md, README.md, session-log)")
    print(f"\n  Next steps:")
    print(f"  1. Tell Claude: 'working on {name.lower()}'")
    print(f"  2. Define the business model")
    print(f"  3. Start building\n")

    return base

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python bootstrap_business.py 'Business Name'")
        print("Example: python bootstrap_business.py 'Real Estate Rentals'")
        sys.exit(1)

    name = sys.argv[1]
    create_business(name)
