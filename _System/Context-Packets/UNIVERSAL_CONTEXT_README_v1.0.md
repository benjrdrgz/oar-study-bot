# How to Use the Universal Context Files

**v1.0 — Making every Claude session seamless, no matter where you start**

— Benjamin Rodriguez

---

## What These Files Are

I've created 3 portable context files. Each one is designed to be copy-pasted (or uploaded) into a new Claude conversation so Claude instantly has your full context without you explaining anything.

---

## THE THREE FILES

### 1. `Master_Context_Packet.md` — THE ESSENTIAL ONE
**Use this:** At the start of ANY new Claude chat, Cowork session, or Claude Code session
**What it contains:** Who you are, your businesses, how you want Claude to behave, current priorities
**How to use:** Copy the entire file and paste it as your first message. Or upload it to a Claude Project.
**Size:** ~2 pages — small enough to paste, big enough to give full context

### 2. `Claude_PhD_Portable.md` — THE OPTIMIZATION LAYER
**Use this:** When you want Claude to work at peak performance on a complex task
**What it contains:** The best prompt techniques, anti-patterns to avoid, mode selection guide, magic phrases
**How to use:** Upload to a Claude Project, or paste at the start of a technical/complex session
**Size:** ~3 pages — the distilled version of the full PhD Knowledge Base

### 3. `Agency_Quick_Brief.md` — WEBSITE AGENCY SPECIFIC
**Use this:** When working on the website agency from any device
**What it contains:** Agency status, current week in the plan, tool stack, pricing, what's been done, what's next
**How to use:** Upload to a Claude Project called "Website Agency", or paste when starting agency work
**Size:** ~2 pages — everything Claude needs to be your agency Chief of Staff

---

## SETUP INSTRUCTIONS

### For Claude.ai (Web + Mobile)

**Step 1: Create 2 Projects**
1. Go to claude.ai → Projects → New Project
2. **Project 1: "Benjamin OS"**
   - Upload: `Master_Context_Packet.md`
   - Upload: `Claude_PhD_Portable.md`
   - Custom instructions: "Read the uploaded files. You are Benjamin's Chief of Staff. Apply the PhD optimization techniques to all work."

3. **Project 2: "Website Agency"**
   - Upload: `Agency_Quick_Brief.md`
   - Upload: `Claude_PhD_Portable.md`
   - Custom instructions: "Read the uploaded files. You are the Chief of Staff for Benjamin's AI website agency. Apply PhD techniques. Be autonomous."

**Step 2: Use from anywhere**
- Phone at coffee shop? → Open "Website Agency" project → Claude has full context
- Quick general question? → Open "Benjamin OS" project → Claude knows you
- New idea for any business? → Open "Benjamin OS" → brainstorm with full context

### For New Cowork Sessions
- Your CLAUDE.md already references the PhD file and has the business router
- Auto-memory persists across sessions
- Session logs provide continuity
- No extra setup needed — it's already wired in

### For Claude Code
- Copy `Master_Context_Packet.md` content into a CLAUDE.md in any project repo
- Claude Code reads CLAUDE.md automatically
- The PhD techniques will be applied to all coding work

### For Sharing with Someone Else's Claude
- Send them `Master_Context_Packet.md` to paste as first message
- They paste it, and their Claude becomes your Chief of Staff for that conversation
- Works with any Claude subscription (free or paid)

---

## KEEPING EVERYTHING IN SYNC

When things change (new business, new priority, new learning):

1. **Update the source files** in /Website Agency/Outputs/
2. **Re-upload to Projects** in claude.ai (replace old versions)
3. **Add new PhD learnings** by telling any Claude session: "Add to the PhD: [learning]"
4. The Cowork auto-memory and CLAUDE.md updates happen automatically

---

**What I did:** Created 3 portable context files + this README for universal Claude continuity.

**What to do next:** Create the 2 Projects in claude.ai and upload the files. Takes 5 minutes.

**Automation opportunity:** When you update these files in Cowork, set a reminder to re-upload to claude.ai Projects. Eventually this could be automated via the API.

— Benjamin Rodriguez
