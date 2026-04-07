# Claude PhD — Living Optimization Knowledge Base

**v1.0 — A continuously-updated reference that makes every Claude interaction faster, smarter, and more efficient**

— Benjamin Rodriguez

---

## HOW TO USE THIS FILE

This is a **living document**. Every time we discover a new technique, wording trick, or optimization, it gets added here. Over time, this becomes the most valuable file in your system — a custom-trained playbook that turns every Claude session into peak performance.

**Commands:**
- "PhD review [task/prompt]" → Claude analyzes and optimizes your approach before executing
- "Add to the PhD: [learning]" → New technique gets logged in Section 6
- "PhD mode" → Claude reads this file and applies all optimizations to the current session
- "What does the PhD say about [topic]?" → Claude checks this file for relevant techniques

**Auto-Learning (always on):**
Claude automatically logs new learnings to Section 6 without being asked when:
1. A technique or workflow produced significantly better results than expected
2. A tool combination or workaround solved a problem in a novel way
3. A prompt structure or approach outperformed the previous method
4. A mistake was made — the error AND the fix get logged so it never repeats
5. A new tool, integration, or pricing insight was discovered during research
6. An outside-the-box idea was validated or well-received

No permission needed. Claude just logs it. The PhD gets smarter every session automatically.

---

## SECTION 1: PROMPT ENGINEERING GOLD (proven techniques)

### Structure Matters More Than Words
1. **Put documents ABOVE instructions, question at the BOTTOM** — 30% quality boost on long-context tasks
2. **Use XML tags** — Claude was trained on them. `<context>`, `<task>`, `<examples>`, `<output_format>` create unambiguous boundaries
3. **3-5 few-shot examples** for any repeating task dramatically improve accuracy
4. **Match prompt style to desired output** — prose prompt = prose output; markdown prompt = markdown output

### The Magic Phrases
| Want this... | Say this... |
|---|---|
| Thorough output | "Be comprehensive. Cover edge cases and variations." |
| Concise output | "Be concise and direct. Skip unnecessary explanations." |
| Creative output | "Make unexpected choices that feel genuinely designed." |
| Autonomous work | "Use your best judgment. Don't ask unless truly stuck." |
| Deeper analysis | "Before answering, identify the three most important factors." |
| No hallucinations | "Only use information from the provided documents." |
| Less hedging | "Give clear, committed recommendations." |
| Outside-the-box | "What would surprise me here? Challenge assumptions." |
| Verify accuracy | "After completing, verify your work against [criteria]." |

### Anti-Patterns (things that waste tokens/time)
- Repeating context Claude already has (check memory first)
- Vague instructions without specifying output format
- Asking for 10 things in one prompt instead of breaking into steps
- Not using XML tags when content is structured
- Running Opus on simple tasks when Sonnet is fine
- Over-prompting ("CRITICAL: YOU MUST") — Claude 4.6 responds better to normal language

---

## SECTION 2: MODE SELECTION INTELLIGENCE

### Decision Tree: What Should I Use?

```
What do I need to do?
│
├─ THINK about something → Regular Chat (web/mobile)
│   ├─ Quick question → Free chat, any device
│   ├─ Deep strategy → Chat with Project loaded
│   └─ On my phone → Mobile app + right Project
│
├─ BUILD something → Cowork (desktop)
│   ├─ Documents, spreadsheets, presentations
│   ├─ Research reports, multi-step tasks
│   ├─ Anything requiring file creation
│   └─ Autonomous overnight sprints
│
├─ BUILD while I'm away → Dispatch (phone → desktop)
│   ├─ Send task from coffee shop
│   ├─ Desktop must be on and running
│   └─ Returns results to phone
│
├─ CODE something → Claude Code (terminal)
│   ├─ Scripts, automation, debugging
│   ├─ Git operations, PR creation
│   └─ CI/CD integration
│
├─ AUTOMATE a website → Chrome Extension
│   ├─ Fill forms, scrape data
│   ├─ Test web apps
│   └─ Use logged-in sessions
│
└─ REMEMBER across sessions → Projects + CLAUDE.md + Session Logs
    ├─ Projects: permanent business context
    ├─ CLAUDE.md: rules and preferences
    ├─ Auto-memory: organic learnings
    └─ Session logs: what happened + what's next
```

---

## SECTION 3: AUTO-DELEGATION ENGINE (Universal)

### The Golden Rule
When Benjamin gives a task, Claude AUTOMATICALLY determines the optimal execution strategy.
No manual instruction needed. This is the default behavior for every task, every business.

### Auto-Delegation Decision Tree
```
Benjamin gives a task
│
├─ Is it a single, simple task? (< 5 min, one deliverable)
│   └─ DO IT DIRECTLY. No agents needed.
│
├─ Is it a multi-part task? (3+ independent pieces)
│   └─ SPAWN PARALLEL AGENTS. Each handles one piece.
│       ├─ Break into cleanest independent chunks
│       ├─ Give each agent FULL context + PhD rules
│       ├─ Run all agents simultaneously
│       └─ Verify + assemble results when done
│
├─ Is it research + build? (need info before creating)
│   └─ SEQUENTIAL: Research agent(s) first → Build agent(s) after
│
├─ Is it a big build? (10+ files, 1+ hour)
│   └─ WAVE PATTERN: 5-7 agents per wave, 3-4 waves
│       ├─ Wave 1: Foundation (templates, structure, core docs)
│       ├─ Wave 2: Content (guides, scripts, detailed docs)
│       ├─ Wave 3: Polish (reports, summaries, checklists)
│       └─ Wave 4: Verification (test, validate, cross-reference)
│
└─ Is it ambiguous? (unclear scope)
    └─ ASK ONE CLARIFYING QUESTION, then execute autonomously
```

### Agent Prompting Template (Universal — works for any business)
```
You are working for Benjamin Rodriguez, a multi-business operator.
BUSINESS: [Which business this is for]
CONTEXT: [2-3 sentences on what this business does]

YOUR TASK: [Specific, single deliverable]
SAVE TO: [Exact file path inside the business folder]
FORMAT: [Exactly how it should look]
VERSION: filename_v1.0 (follow versioning rules)

QUALITY RULES:
- Verify your work before marking complete
- If something fails, try 3 approaches before flagging
- Think outside the box — include a "Better way?" note if you spot one
- Sign with: — Benjamin Rodriguez
```

### Efficiency Rules for All Agents
1. **Read before writing** — Check Templates/ first. Don't build from scratch what already exists.
2. **5-7 agents per wave** — More causes coordination overhead, fewer wastes parallelism.
3. **Right model for the job** — Haiku for simple lookup/formatting, Sonnet for standard work, Opus for complex strategy/creative.
4. **Full context every time** — Agents don't share memory. Each one gets complete business context.
5. **Verification is mandatory** — Every agent validates its own output before completing.
6. **Cross-pollinate** — If a technique works in one business, flag it for reuse in others.
7. **Auto-log learnings** — If an agent discovers something new, it goes into the PhD Section 6.

### When NOT to Spawn Agents
- Task depends on sequential steps (A must finish before B starts)
- Task requires back-and-forth conversation with Benjamin
- Task is a single file edit or quick lookup
- Benjamin explicitly says "do this yourself" or "walk me through it"

---

## SECTION 4: TOKEN EFFICIENCY PLAYBOOK

### Cost Hierarchy (most to least expensive)
1. Output tokens (5x input cost) — constrain output format
2. Extended thinking tokens (2-4x standard) — use only when needed
3. Input tokens (base cost) — don't repeat context
4. Cached tokens (90% discount) — cache long documents

### Quick Wins
- Set `max_tokens` to expected output size (don't leave unlimited)
- Use structured outputs (JSON schema) to force concise responses
- Break complex tasks into steps — focused prompts get it right first time
- Use skills that load on-demand instead of bloating CLAUDE.md
- Match model to task: Haiku for simple, Sonnet for moderate, Opus for complex

---

## SECTION 5: CONTEXT BRIDGE SYSTEM (cross-session continuity)

### The Three-Layer Memory Stack

**Layer 1: CLAUDE.md** (master brain, loaded every session)
- Who Benjamin is
- His businesses and current priorities
- Operating rules (versioning, permissions, execution style)
- Business router ("working on X" → load right context)

**Layer 2: Projects** (permanent business context, accessible from phone)
- One Project per business in claude.ai
- Upload key docs, SOPs, current status
- Custom instructions per project
- Accessible from web + mobile + Cowork

**Layer 3: Session Logs** (sync point between all modes)
- Written after every work session
- Read at the start of every new session
- Format: What was done / Decisions made / What's next
- Location: `/Outputs/session-log-[date]-[business].md`

### Cross-Device Workflow
```
Phone (coffee shop) → Chat with Project → brainstorm
         ↓ Dispatch task
Desktop (home) → Cowork executes → writes session log
         ↓ Next session reads log
Any device → full continuity
```

---

## SECTION 6: THE LEARNING LOG (continuously updated)

*When we discover something new, it goes here. This section grows over time.*

### 2026-03-25 — Overnight Autonomous Sprint
**What:** Full auth + comprehensive task list → Claude works 6-8 hours unsupervised using parallel sub-agents
**Why it works:** Sub-agents parallelize. Auto-memory persists. Session logs bridge.
**When to use:** 5+ independent tasks. Benjamin is sleeping, at gym, or away.
**Impact:** 34 deliverables in one session. Equivalent to 3-5 weeks of freelancer work.

### 2026-03-25 — The "Build First, Sell Second" Email
**What:** Build the prospect's website BEFORE contacting them. Send the live link in the cold email.
**Why it works:** Flips the sales funnel. Prospect sees proof before you ask for money. Loss aversion kicks in with breakup email.
**When to use:** Every lead in the website agency. Subject line: "I built [BUSINESS] a website"
**Impact:** 8-15% reply rate vs 2-3% for standard cold email.

### 2026-03-25 — XML Tags for Complex Prompts
**What:** Wrapping prompt sections in `<context>`, `<task>`, `<output_format>` tags
**Why it works:** Claude was literally trained to parse XML. Creates unambiguous boundaries between sections.
**When to use:** Any prompt with multiple parts (context + instructions + examples + format).
**Impact:** Measurably better output quality. Fewer misinterpretations.

### 2026-03-25 — Document-Above-Question Pattern
**What:** Put long documents at the TOP of the prompt, question/task at the BOTTOM
**Why it works:** Claude processes better when context is loaded before the question (like reading a brief before being asked to analyze it)
**When to use:** Any task involving documents over 1,000 words
**Impact:** ~30% quality improvement on document analysis tasks

### 2026-03-25 — "Allow I Don't Know" for Accuracy
**What:** Explicitly telling Claude "If you're unsure, say so" in the system prompt
**Why it works:** Removes pressure to always have an answer. Dramatically reduces hallucination.
**When to use:** Any fact-checking, research, or critical decision task
**Impact:** Major hallucination reduction with zero downside

### 2026-03-25 — Matching Prompt Style to Output Style
**What:** If you want prose output, write your prompt in prose. If you want markdown, use markdown in your prompt.
**Why it works:** Claude mirrors the style of its input
**When to use:** Whenever output formatting matters
**Impact:** Reduces post-formatting rework by 50%+

---

## SECTION 7: BENJAMIN-SPECIFIC OPTIMIZATIONS

### Known Preferences (from auto-memory + observation)
- Prefers autonomous CEO-mode work — don't ask, just decide
- Values outside-the-box thinking — always include a "Better Way?" section
- Wants plain English — no jargon unless talking to Claude about Claude
- Revenue is the primary filter — "does this make me money?"
- Loves parallel execution — spawn agents aggressively
- Version everything — filename_v1.0.md, never overwrite
- Sign everything — "— Benjamin Rodriguez"

### Optimal Benjamin Session Flow
1. Read CLAUDE.md + latest session log + auto-memory
2. "What business are we working on?" → load right context
3. Break task into parallel agents if 3+ independent pieces
4. Execute with verification steps
5. Write session log when done
6. Note any new learnings for the PhD

---

## SECTION 8: HIDDEN FEATURES & POWER MOVES

### Things Most Claude Users Don't Know
1. **Projects work on mobile** — full context, anywhere
2. **Dispatch queues tasks** — send 5 tasks rapid-fire, they execute in order
3. **Skills load on-demand** — way more efficient than giant CLAUDE.md files
4. **Structured Outputs guarantee JSON** — no more parsing errors
5. **Prompt caching saves 90%** on repeated context (API)
6. **Extended thinking** dramatically improves complex reasoning — enable it
7. **Claude can say "I don't know"** if you tell it to — reduces BS by 80%
8. **Model selection per task** — Haiku for simple ($0.80/M), Opus for complex ($5/M)
9. **Batch API is 50% off** — use for bulk processing
10. **Computer use in Cowork** — Claude can literally click through your apps

### Things to Try Next
- [ ] Set up scheduled Monday CEO Briefing task
- [ ] Create the "Idea Capture → Auto-Execute" pipeline
- [ ] Test Dispatch from phone → desktop workflow
- [ ] Build custom skill for lead processing pipeline
- [ ] Test Chrome extension for automated Google Maps scraping

---

*This document is alive. Every session makes it better. Every learning makes us faster. The compound effect of optimization is the real edge — not any single technique, but all of them working together.*

— Benjamin Rodriguez
