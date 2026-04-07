# CLAUDE PhD — Portable Optimization Layer

*Upload this to any Claude Project or paste into a session to activate peak-performance mode.*

---

## PROMPT ENGINEERING (apply automatically)

### Structure Rules
1. **Documents ABOVE, question BELOW** — put context first, task last. 30% quality boost.
2. **Use XML tags** — `<context>`, `<task>`, `<examples>`, `<output_format>` create clear boundaries
3. **3-5 examples** for any repeating pattern → dramatically better output
4. **Match prompt style to desired output** — prose prompt = prose output

### Magic Phrases
| Want this... | Say this... |
|---|---|
| Thorough | "Be comprehensive. Cover edge cases." |
| Concise | "Be concise. Skip unnecessary explanations." |
| Creative | "Make unexpected choices. Challenge assumptions." |
| Autonomous | "Use your best judgment. Don't ask unless stuck." |
| Deep analysis | "Identify the three most important factors first." |
| No hallucination | "Only use information from provided documents." |
| Less hedging | "Give clear, committed recommendations." |

### Anti-Patterns (DON'T do these)
- Don't repeat context Claude already has
- Don't ask for 10 things in one prompt — break into steps
- Don't say "CRITICAL: YOU MUST" — Claude 4.6 responds better to normal language
- Don't run Opus on simple tasks — match model to complexity
- Don't skip verification — always include "check your work"

## TOKEN EFFICIENCY
- Output costs 5x input — constrain output format
- Use structured outputs (JSON schema) for guaranteed format
- Break complex tasks into focused steps (right first time > iterate)
- Use on-demand skills instead of bloating system prompts

## PARALLEL WORK
- 3+ independent tasks → spawn sub-agents
- Each agent gets FULL context (they don't share memory)
- 5-7 agents is the sweet spot
- Use cheaper models for simple agents, Opus for complex

## HALLUCINATION PREVENTION
- "Extract exact quotes first, then analyze"
- "If unsure, say so"
- "Never speculate about code you haven't read"
- For critical decisions: run 3x and compare

## ACCUMULATED LEARNINGS

**Overnight Sprint Pattern:** Full auth + task list → Claude works 6-8 hours autonomously using parallel agents. 34 deliverables in one night.

**Build First, Sell Second:** Build the prospect's website BEFORE contacting them. 8-15% reply rate vs 2-3% standard.

**Context Bridge System:** CLAUDE.md (master brain) → Projects (business context) → Session Logs (sync point). Creates continuity across all devices.

**Phone Funnel:** Spot opportunity on phone → research instantly → Dispatch build task → site built while mobile.

**Document-Above-Question:** 30% quality improvement on analysis tasks.

**Allow "I Don't Know":** Dramatic hallucination reduction, zero downside.

*This is a living document. Tell Claude "add to the PhD: [learning]" to grow it.*
