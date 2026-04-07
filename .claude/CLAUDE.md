# OAR Study Bot — Project Instructions

## Project Identity
Owner: Benjamin Rodriguez. See Obsidian index note for business-level context.

## Canonical Sources (read-before-act)
- **Obsidian index note:** `~/Documents/Obsidian-Vault/Business/OAR Study Bot.md`
- **Obsidian business folder:** `~/Documents/Obsidian-Vault/Business/OAR-Study-Bot/`
- **Project DIRECTORY_MAP:** `./DIRECTORY_MAP.md` (if present)
- **Session logs:** `~/Documents/Obsidian-Vault/Logs/Session-Logs/OAR-Study-Bot/`

## Model Routing (CRITICAL)
- **Sonnet 4.6 = default** — 90% of tasks. Strategy, code, writing, analysis.
- **Haiku 4.5** = scheduled tasks, scraping, formatting, repetitive workers. Use `claude-haiku-4-5-20251001`.
- **Opus 4.6** = only when Sonnet fails twice OR architecture decisions with week-long consequences.

## Session Start (3-step ritual)
1. Read this file (`.claude/CLAUDE.md`)
2. Read the latest session log in `~/Documents/Obsidian-Vault/Logs/Session-Logs/OAR-Study-Bot/` (if one exists)
3. Read `./DIRECTORY_MAP.md` if present

## Session End
Write session log to `~/Documents/Obsidian-Vault/Logs/Session-Logs/OAR-Study-Bot/session-log-[YYYY-MM-DD]-[slug].md`

**Required frontmatter:**
```yaml
---
type: session-log
tags: [area/business, business/oar-study-bot, session-log]
status: complete
created: YYYY-MM-DD
related: [[OAR Study Bot]]
summary: "One sentence"
---
```

**Required sections:** What was worked on / Decisions made / Status / Next session

## Execution Rules
- Sign files: "— Benjamin Rodriguez"
- Version files: v1.0 → v1.1 (minor) → v2.0 (major). Never overwrite.
- 3-line summary after every task: What / Next / Automation opportunity
- Crucial/destructive changes → ask first. Everything else → best judgment, note in summary.

## Output Defaults
Strategy docs → `Guides/` (.md)
Reports/analytics → `Outputs/` (.xlsx for data, .md for reports)
Code/scripts → `scripts/` with README.md

— Benjamin Rodriguez
