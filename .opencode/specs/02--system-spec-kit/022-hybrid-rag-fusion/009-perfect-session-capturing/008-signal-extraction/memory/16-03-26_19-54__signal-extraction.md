---
title: "Signal Extraction [008-signal-extraction/16-03-26_19-54__signal-extraction]"
description: "I’m implementing 008-signal-extraction now, starting with the live extractor seams and tests so we can unify the engine without breaking the existing public contracts. I’ll..."
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing/008 signal extraction"
  - "over engineering"
  - "tree thinning"
  - "trigger extractor"
  - "semantic summarizer"
  - "script side"
  - "activity only"
  - "topic extractor"
  - "session extractor"
  - "implementation summary"
  - "merged-small-files tree-thinning merged small"
  - "tree-thinning merged small files"
  - "update phase docs"
  - "updated plan system"
  - "quality principles prefer simplicity"
  - "principles prefer simplicity reuse"
  - "prefer simplicity reuse existing"
  - "simplicity reuse existing patterns"
  - "reuse existing patterns cite"
  - "existing patterns cite evidence"
  - "patterns cite evidence sources"
  - "cite evidence sources solve"
  - "evidence sources solve stated"
  - "sources solve stated problem"
  - "solve stated problem avoid"
  - "stated problem avoid over-engineering"
  - "kit/022"
  - "fusion/010"
  - "capturing/008"
  - "signal"
  - "extraction"
importance_tier: "critical"
contextType: "general"
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":true,"score":1,"errors":0,"warnings":0}
---

# Signal Extraction

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-16 |
| Session ID | session-1773687240311-2d49e7673ff4 |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction |
| Channel | main |
| Importance Tier | critical |
| Context Type | general |
| Total Messages | 5 |
| Tool Executions | 90 |
| Decisions Made | 1 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-16 |
| Created At (Epoch) | 1773687240 |
| Last Accessed (Epoch) | 1773687240 |
| Access Count | 1 |

---

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
- [IMPLEMENTATION GUIDE](#implementation-guide)
- [OVERVIEW](#overview)
- [DETAILED CHANGES](#detailed-changes)
- [DECISIONS](#decisions)
- [CONVERSATION](#conversation)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 24% |
| Last Activity | 2026-03-16T18:42:50.276Z |
| Time in Session | 4m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** I’m treating this as a `/spec_kit:implement` planning pass because we’re still i, I’ve confirmed the command prompt and skill routing: `command-spec-kit` and `sys, I’m implementing `008-signal-extraction` now, starting with the live extractor s

**Summary:** I’m implementing `008-signal-extraction` now, starting with the live extractor seams and tests so we can unify the engine without breaking the existing public contracts. I’ll keep the code changes foc...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction
Last: I’m implementing `008-signal-extraction` now, starting with the live extractor s
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: scripts/lib/semantic-signal-extractor.ts, scripts/lib/trigger-extractor.ts, scripts/core/topic-extractor.ts

- Check: plan.md, tasks.md, checklist.md

- Last: I’m implementing `008-signal-extraction` now, starting with the live...

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | scripts/lib/semantic-signal-extractor.ts |
| Last Action | I’m implementing `008-signal-extraction` now, starting with the live extractor s |
| Next Action | Continue implementation |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist

**Key Topics:** `perfect capturing/008` | `capturing/008 signal` | `fusion/010 perfect` | `signal extraction` | `kit/022 hybrid` | `rag fusion/010` | `spec kit/022` | `system spec` | `hybrid rag` | `extraction system` | `over-engineering premature` | `avoid over-engineering` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **I’m treating this as a `/spec_kit:implement` planning pass because we’re still i** - I’m treating this as a /spec_kit:implement planning pass because we’re still in Plan Mode.

- **I’ve confirmed the command prompt and skill routing: `command-spec-kit` and `sys** - I’ve confirmed the command prompt and skill routing: command-spec-kit and system-spec-kit are the strong matches, with sk-code--web as a weaker generic implementation overlay.

- **I’m implementing `008-signal-extraction` now, starting with the live extractor s** - I’m implementing 008-signal-extraction now, starting with the live extractor seams and tests so we can unify the engine without breaking the existing public contracts.

**Key Files and Their Roles**:

- `scripts/lib/semantic-signal-extractor.ts` - Unified script-side engine with mode-aware extraction,...

- `scripts/lib/trigger-extractor.ts` - Convert the script-side trigger entrypoint into a thin...

- `scripts/core/topic-extractor.ts` - Convert to thin adapter delegating to unified engine;...

- `scripts/extractors/session-extractor.ts` - Remove inline extraction logic (lines 381-437); delegate...

- `scripts/lib/semantic-summarizer.ts` - Replace direct trigger-extractor calls with unified...

- `scripts/tests/semantic-signal-golden.vitest.ts` - Frozen trigger/output regression coverage plus...

- `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` - Uncommitted: modify during session

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/checklist.md` - Documentation

**How to Extend**:

- Add new modules following the existing file structure patterns

- Create corresponding test files for new implementations

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

I’m implementing `008-signal-extraction` now, starting with the live extractor seams and tests so we can unify the engine without breaking the existing public contracts. I’ll keep the code changes focused on the `008` scope first, then run the targeted verification bar and update the phase docs with real evidence.

**Key Outcomes**:
- I’m treating this as a `/spec_kit:implement` planning pass because we’re still i
- I’ve confirmed the command prompt and skill routing: `command-spec-kit` and `sys
- I’m implementing `008-signal-extraction` now, starting with the live extractor s

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `scripts/lib/(merged-small-files)` | Tree-thinning merged 3 small files (semantic-signal-extractor.ts, trigger-extractor.ts, semantic-summarizer.ts).  Merged from scripts/lib/semantic-signal-extractor.ts : `mode: 'topics' | 'triggers' | 's | Merged from scripts/lib/trigger-extractor.ts : Convert the script-side trigger entrypoint into a thin... | Merged from scripts/lib/semantic-summarizer.ts : Tiered outcomes (placeholder/activity-only/semantic/high-... |
| `scripts/core/(merged-small-files)` | Tree-thinning merged 1 small files (topic-extractor.ts).  Merged from scripts/core/topic-extractor.ts : Convert to thin adapter delegating to unified engine;... |
| `scripts/extractors/(merged-small-files)` | Tree-thinning merged 1 small files (session-extractor.ts).  Merged from scripts/extractors/session-extractor.ts : Remove inline extraction logic (lines 381-437); delegate... |
| `scripts/tests/(merged-small-files)` | Tree-thinning merged 1 small files (semantic-signal-golden.vitest.ts).  Merged from scripts/tests/semantic-signal-golden.vitest.ts : Updated semantic signal golden.vitest |
| `.opencode/skill/system-spec-kit/scripts/lib/(merged-small-files)` | Tree-thinning merged 1 small files (semantic-signal-extractor.ts).  Merged from .opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts : Updated semantic signal extractor |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/(merged-small-files)` | Tree-thinning merged 3 small files (checklist.md, implementation-summary.md, plan.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/checklist.md : Updated checklist | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/implementation-summary.md : Updated implementation summary | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/plan.md : Updated plan |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-treating-speckitimplement-planning-pass-59cbc774 -->
### FEATURE: I’m treating this as a `/spec_kit:implement` planning pass because we’re still i

I’m treating this as a `/spec_kit:implement` planning pass because we’re still in Plan Mode. I’ll first read the implementation prompt, the root phase docs you pointed to, and the prior phase outputs so we can ground the plan in the actual repo state before deciding anything.

<!-- /ANCHOR:implementation-treating-speckitimplement-planning-pass-59cbc774 -->

<!-- ANCHOR:implementation-ive-confirmed-command-prompt-e5631764 -->
### FEATURE: I’ve confirmed the command prompt and skill routing: `command-spec-kit` and `sys

I’ve confirmed the command prompt and skill routing: `command-spec-kit` and `system-spec-kit` are the strong matches, with `sk-code--web` as a weaker generic implementation overlay. Next I’m narrowing to the root decision docs and the phase packet so we can lock the actual behavior this phase is supposed to add, not just the folder names.

<!-- /ANCHOR:implementation-ive-confirmed-command-prompt-e5631764 -->

<!-- ANCHOR:implementation-008signalextraction-now-starting-live-bb938e24 -->
### FEATURE: I’m implementing `008-signal-extraction` now, starting with the live extractor s

I’m implementing `008-signal-extraction` now, starting with the live extractor seams and tests so we can unify the engine without breaking the existing public contracts. I’ll keep the code changes focused on the `008` scope first, then run the targeted verification bar and update the phase docs with real evidence.

<!-- /ANCHOR:implementation-008signalextraction-now-starting-live-bb938e24 -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-user-decision-c00d174b -->
### Decision 1: user decision 1

**Context**: **QUALITY PRINCIPLES:** - **Prefer simplicity**, reuse existing patterns, and cite evidence with sources - Solve only the stated problem; **avoid over-engineering** and premature optimization - **Veri

**Timestamp**: 2026-03-16T18:54:00.333Z

**Importance**: medium

#### Visual Decision Tree

```
╭────────────────────────────────────────────────────────────────╮
│  DECISION: user decision 1                                     │
│  Context: **QUALITY PRINCIPLES:** - **Prefer simplicity**,...  │
│  Confidence: 50%                                               │
│  2026-03-16 @ 18:54:00                                         │
╰────────────────────────────────────────────────────────────────╯
                      │
                      ▼
              ╱────────────────╲
             ╱  Choose option?  ╲
            ╱                  ╲
            ╲                  ╱
             ╲────────────────╱
      │
   Chosen Appr
┌──────────────────┐
│  Chosen Approac  │
└──────────────────┘
             │           │
             │           ▼
             │  ┌────────────────────────────────────────┐
             │  │  ✅ CHOSEN: Chosen Approach             │
             │  │                                        │
             │  │  Rationale:                            │
             │  │  **QUALITY PRINCIPLES:** - **Prefer    │
             │  │  simplicity**, reuse existing          │
             │  │  patterns, and cite evidence with sou  │
             │  └────────────────────────────────────────┘
             │           │
             └─────┬─────┘
                   │
                   ▼
        ╭────────────────╮
        │ Decision Logged │
        ╰────────────────╯
```

#### Options Considered

1. **Chosen Approach**
   **QUALITY PRINCIPLES:** - **Prefer simplicity**, reuse existing patterns, and cite evidence with...

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: **QUALITY PRINCIPLES:** - **Prefer simplicity**, reuse existing patterns, and cite evidence with sources - Solve only the stated problem; **avoid over-engineering** and premature optimization - **Veri

#### Trade-offs

**Confidence**: 50%

<!-- /ANCHOR:decision-user-decision-c00d174b -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Sequential with Decision Points** conversation pattern with **1** distinct phases.

##### Conversation Phases
- **Planning** - 2 actions
- **Discussion** - 90 actions
- **Verification** - 1 actions

---

### Message Timeline

> **User** | 2026-03-16 @ 19:37:51

# AGENTS.md instructions for /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public  # AI Assistant Framework (Universal Template) > **Universal behavior framework** defining guardrails, standards, and decision protocols. --- ## 1. 🚨 CRITICAL RULES **HARD BLOCKERS (The "Four Laws" of Agent Safety):** 1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying. 2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN. 3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits. 4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below). **OPERATIONAL MANDATES:** - **All file modifications require a spec folder** (Gate 3). - **Never lie or fabricate** - use "UNKNOWN" when uncertain. - **Clarify** if confidence < 80% (see §5 Confidence Framework). - **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:". **QUALITY PRINCIPLES:** - **Prefer simplicity**, reuse existing patterns, and cite evidence with sources - Solve only the stated problem; **avoid over-engineering** and premature optimization - **Verify with checks** (simplicity, performance, maintainability, scope) before making changes - **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow **HALT CONDITIONS (Stop and Report):** - [ ] Target file does not exist or line numbers don't match. - [ ] Syntax check or Tests fail after edit. - [ ] Merge conflicts encountered. - [ ] Edit tool reports "string not found". - [ ] Test/Production boundary is unclear. **MANDATORY TOOLS:** - **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work. **Memory saves MUST use `node.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`** - NEVER manually create memory files. **GIT WORKFLOW:** Full details: `.opencode/skill/sk-git/` - Worktree setup, conventional commits, PR creation, branch management - Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes ### Quick Reference: Common Workflows | Task | Flow | | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | | **File modification** | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute | | **Research/exploration** | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings | | **Code search** | `Grep()` for text patterns, `Glob()` for file discovery, `Read()` for file contents | | **Resume prior work** | `/memory:continue` OR `memory_search({ query, specFolder, anchors: ['state', 'next-steps'] })` → Review checklist → Continue | | **Save context** | `/memory:save` OR `node.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]` → Auto-indexed | | **Claim completion** | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence | | **End session** | `/spec_kit:handover` → Save context → Provide continuation prompt | | **New spec folder** | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement | | **Complex multi-step** | Task tool → Decompose → Delegate → Synthesize | | **Documentation** | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify | | **Web code** | sk-code--web skill → Webflow/CDN standards, minification, browser testing | | **OpenCode system code** | sk-code--opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists | | **Git workflow** | sk-git skill → Worktree setup / Commit / Finish (PR) | | **Phase workflow** | `/spec_kit:phase` → Decompose → `create.sh --phase` → Populate parent/children → `validate.sh --recursive` | | **Database maintenance** | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations | | **Analysis/evaluation** | `/memory:analyze` → preflight, postflight, causal graph, ablation, dashboard, history | ### Coding Analysis Lenses | Lens | Focus | Detection Questions | | ------------------ | ---------------- | ---------------------------------------------------------------------------------- | | **CLARITY** | Simplicity | Is this the simplest code that solves the problem? Are abstractions earned? | | **SYSTEMS** | Dependencies | What does this change touch? What calls this? What are the side effects? | | **BIAS** | Wrong problem | Is user solving a symptom? Is this premature optimization? Is the framing correct? | | **SUSTAINABILITY** | Maintainability | Will future devs understand this? Is it self-documenting? Tech debt implications? | | **VALUE** | Actual impact | Does this change behavior or just refactor? Is it cosmetic or functional? | | **SCOPE** | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction? | ### Coding Anti-Patterns (Detect Silently) | Anti-Pattern | Trigger Phrases | Response | | ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- | | Over-engineering | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?" | | Premature optimization | "could be slow", "might bottleneck" | Ask: "Has this been measured? What's the actual performance?" | | Cargo culting | "best practice", "always should" | Ask: "Does this pattern fit this specific case?" | | Gold-plating | "while we're here", "might as well" | Flag scope creep: "That's a separate change - shall I note it for later?" | | Wrong abstraction | "DRY this up" for 2 instances | "These look similar but might not be the same concept. Let's verify first." | | Scope creep | "also add", "bonus feature" | "That's outside the current scope. Want to track it separately?" | --- ## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING **⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.** ### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use) #### GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT] BLOCK Trigger: EACH new user message (re-evaluate even in ongoing conversations) 1. Call `memory_match_triggers(prompt)` → Surface relevant context 2. Classify intent: Research or Implementation 3. Parse request → Check confidence AND uncertainty (see §4) 4. **Dual-threshold:** confidence ≥ 0.70 AND uncertainty ≤ 0.35 → PROCEED. Either fails → INVESTIGATE (max 3 iterations) → ESCALATE. Simple: <40% ASK | 40-69% CAUTION | ≥70% PASS > Gate 1 is SOFT — if file modification detected, Gate 3 (HARD) takes precedence. Ask spec folder question BEFORE analysis. #### GATE 2: SKILL ROUTING [REQUIRED for non-trivial tasks] 1. A) Run: `python3.opencode/skill/scripts/skill_advisor.py "[request]" --threshold 0.8` 2. B) Cite user's explicit direction: "User specified: [exact quote]" - Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed - Output: `SKILL ROUTING: [result]` or `SKILL ROUTING: User directed → [name]` - Skip: trivial queries only (greetings, single-line questions) #### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK — PRIORITY GATE - **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls - **Triggers:** rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase — or any task resulting in file changes - **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`) - **DO NOT** use Read/Edit/Write/Bash (except Gate Actions) before asking. ASK FIRST, wait for response, THEN proceed - **Phase boundary:** Gate 3 answers apply ONLY within current workflow phase. Plan→implement transition MUST re-evaluate. Exception: carry-over IS valid for Memory Save Rule #### CONSOLIDATED QUESTION PROTOCOL When multiple inputs are needed, consolidate into a SINGLE prompt — never split across messages. Include only applicable questions; omit when pre-determined. - **Round-trip optimization** — Only 1 user interaction needed for setup - **First Message Protocol** — ALL questions asked BEFORE any analysis or tool calls - **Violation:** Multiple separate prompts → STOP, apologize, re-present as single prompt - **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading; Level 1 tasks skip completion verification --- ### 🔒 POST-EXECUTION RULES #### MEMORY SAVE RULE [HARD] BLOCK Trigger: "save context", "save memory", `/memory:save`, memory file creation - If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves - If NO folder and Gate 3 never answered → HARD BLOCK → Ask user - **Script:** `node.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]` - Mode 1 (JSON): Write JSON to `/tmp/save-context-data.json`, pass as arg - Mode 2 (Direct): Pass spec folder path (e.g., `specs/005-memory`) - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents) - **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()` - **Violation:** Write tool on `memory/` path → DELETE and re-run via script #### COMPLETION VERIFICATION RULE [HARD] BLOCK Trigger: Claiming "done", "complete", "finished", "works" 1. Validation runs automatically on spec folder (if exists) 2. Load `checklist.md` → Verify ALL items → Mark `[x]` with evidence - Skip: Level 1 tasks (no checklist.md required) | Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix) #### VIOLATION RECOVERY [SELF-CORRECTION] Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT #### Self-Check (before ANY tool-using response): - [ ] File modification? Asked spec folder question? - [ ] Skill routing verified? - [ ] Saving memory? Using `generate-context.js` (not Write tool)? - [ ] Aligned with ORIGINAL request? No scope drift? - [ ] Claiming completion? `checklist.md` verified? --- ## 3. 📝 CONVERSATION DOCUMENTATION Every conversation that modifies files MUST have a spec folder. **Full details:** system-spec-kit SKILL.md (§1 When to Use, §3 How it Works, §4 Rules) ### Documentation Levels | Level | LOC | Required Files | Use When | | ------ | -------------- | ----------------------------------------------------- | ---------------------------------- | | **1** | <100 | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum) | | **2** | 100-499 | Level 1 + checklist.md | QA validation needed | | **3** | ≥500 | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes | | **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance | > **Note:** `implementation-summary.md` is REQUIRED for all levels but created **after implementation completes**, not at spec folder creation time. See SKILL.md §4 Rule 13. **Rules:** When in doubt → higher level. LOC is soft guidance (risk/complexity can override). Single typo/whitespace fixes (<5 characters in one file) are exempt. **Spec folder path:** `specs/[###-short-name]/` | **Templates:** `.opencode/skill/system-spec-kit/templates/` **For details on:** folder structure, `scratch/` vs `memory/` usage, sub-folder versioning, checklist verification (P0/P1/P2), and completion workflow — see system-spec-kit SKILL.md §3. --- ## 4. 🧑🏫 CONFIDENCE & CLARIFICATION FRAMEWORK **Core Principle:** If confidence < 80%, pause and ask for clarification with multiple-choice options. | Confidence | Action | | ------------ | -------------------------------------------- | | **≥80%** | Proceed with citable source | | **40-79%** | Proceed with caveats | | **<40%** | Ask for clarification or mark "UNKNOWN" | | **Override** | Blockers/conflicts → ask regardless of score | **Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?" **Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step. --- ## 5. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK **Flow:** Parse request → Read files first → Analyze → Design simplest solution → Validate → Execute | Principle | Rule | Anti-Pattern | | ----------------- | -------------------------------------------------- | --------------------------------------- | | **Simplicity** | Reuse patterns; earn every abstraction | Utilities for <3 uses, single-impl intf | | **Evidence** | Cite `[SOURCE: file:lines]` or `[CITATION: NONE]` | Claims without verification | | **Scope Match** | Solution size = problem size | Refactoring during bug fix | | **Right Problem** | Root cause, not symptom; measure before optimizing | Premature optimization, wrong framing | **CLARITY Triggers** (justify before proceeding): - Utility for <3 uses | Config for single value | Abstraction without clear boundary - Pattern where simple code suffices | Interface for single impl - On bias → don't argue, redirect to root cause **Pre-Change Checklist:** - [ ] Read first? | Simplest solution? | Scope discipline? - [ ] Confidence ≥80%? | Sources cited? | Spec folder? | Approval? **Five Checks (>100 LOC):** Necessary now? | Alternatives (≥2)? | Simplest sufficient? | On critical path? | No tech debt? **STOP CONDITIONS:** Any check unchecked | no spec folder | no approval → STOP and address --- ## 6. 🤖 AGENT ROUTING When using the orchestrate agent or Task tool for complex multi-step workflows, route to specialized agents: ### Runtime Agent Directory Resolution Use the agent directory that matches the active runtime/provider profile: | Runtime / Profile | Agent Directory | Usage Rule | | -------------------------------------- | -------------------------- | ----------------------------------------------------------- | | **Copilot (default OpenCode profile)** | `.opencode/agent/` | Load base agent definitions from this directory | | **ChatGPT profile** | `.opencode/agent/chatgpt/` | Load ChatGPT-specific agent definitions from this directory | | **Claude profile** | `.claude/agents/` | Load Claude-specific agent definitions from this directory | | **Gemini CLI** | `.gemini/agents/` | Load Gemini-specific agent definitions from this directory | **Resolution rule:** pick one directory by runtime and stay consistent for that workflow phase. ### Agent Definitions - **`@general`** — Implementation, complex tasks - **`@context`** — ALL codebase exploration, file search, pattern discovery, context loading. Dispatches sub-agents for fast search and deep investigation - **`@orchestrate`** — Multi-agent coordination, complex workflows - **`@research`** — Evidence gathering, planning, Gate 3 Option B. May write `research.md` inside spec folders - **`@write`** — Creating READMEs, Skills, Guides - **`@review`** — Code review, PRs, quality gates (READ-ONLY) - **`@speckit`** — Spec folder creation Level 1-3+. **EXCLUSIVE:** Only agent permitted to write `*.md` inside spec folders. Exceptions: `memory/` (generate-context.js), `scratch/` (any agent), `handover.md` (@handover), `research.md` (@research), `debug-delegation.md` (@debug) - **`@debug`** — Fresh perspective debugging, root cause analysis. May write `debug-delegation.md` inside spec folders - **`@handover`** — Session continuation, context preservation. May write `handover.md` inside spec folders - **`@ultra-think`** — Multi-strategy planning architect. Dispatches diverse thinking strategies, scores via 5-dimension rubric, synthesizes optimal plan. Planning-only: no file modifications --- ## 7. ⚙️ MCP CONFIGURATION **Two systems:** 1. **Native MCP** (`opencode.json`) - Direct tools, called natively - Sequential Thinking, Spec Kit Memory, Code Mode server 2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()` - Figma, Github, ClickUp, Chrome DevTools, etc. - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `clickup.clickup_get_teams({})`) - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json` --- ## 8. 🧩 SKILLS SYSTEM Skills are specialized, on-demand capabilities that provide domain expertise. Unlike knowledge files (passive references), skills are explicitly invoked to handle complex, multi-step workflows. ### How Skills Work ``` Task Received → Gate 2: Run skill_advisor.py ↓ Confidence > 0.8 → MUST invoke recommended skill ↓ Invoke Skill → Read(".opencode/skill/<skill-name>/SKILL.md") ↓ Instructions Load → SKILL.md content + resource paths ↓ Follow Instructions → Complete task using skill guidance ``` ### Skill Loading Protocol 1. Gate 2 provides skill recommendation via `skill_advisor.py` 2. Invoke using appropriate method for your environment 3. Read bundled resources from `references/`, `scripts/`, `assets/` paths 4. Follow skill instructions to completion 5. Do NOT re-invoke a skill already in context ### Primary Skill: sk-code--opencode For ALL OpenCode system code (`.opencode/`, MCP servers, scripts), `sk-code--opencode` provides multi-language standards. Includes the `system-spec-kit` skill for spec folder workflows and the Spec Kit Memory system for context preservation across sessions. **Supported Languages:** | Language | Target | Key Patterns | | ---------- | ----------------------------- | ------------------------------------------- | | JavaScript | MCP servers, CommonJS modules | `require`/`module.exports`, strict mode | | TypeScript | Type-safe modules, configs | Interfaces, strict tsconfig, type guards | | Python | Validators, advisors, tests | snake_case, argparse, pytest, docstrings | | Shell | Automation, deployment | `set -euo pipefail`, shebang, quoting | | JSON/JSONC | Manifests, schemas, configs | Schema validation, commented config | **Key Systems:** - **system-spec-kit**: Spec folder lifecycle (Levels 1-3+), validation, template architecture - **Spec Kit Memory**: Context preservation, semantic search, session continuity (`/memory:save`, `/memory:continue`) **Invocation:** Automatic via Gate 2 routing when OpenCode system code tasks detected. ### Git Workflow Skill: sk-git For ALL git workflows, `sk-git` orchestrates workspace setup, commit hygiene, and work completion. **Sub-workflows:** - **Worktree**: Branch creation via `git worktree`, workspace isolation, parallel development - **Commit**: Conventional commit format, staged change analysis, clean commit messages - **Finish**: PR creation, branch cleanup, integration workflows **Trigger Keywords:** worktree, branch, commit, merge, pr, pull request, git workflow, conventional commits, finish work, integrate changes **Invocation:** Automatic via Gate 2 routing when git tasks detected, or manually via `Read(".opencode/skill/sk-git/SKILL.md")`. ## Skills A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for full instructions when using a specific skill. ### Available skills - cli-claude-code: Claude Code CLI orchestrator enabling external AI assistants (Gemini, Codex, Copilot) to invoke Anthropic's Claude Code CLI for supplementary tasks including deep reasoning, code editing, structured output, code review, agent delegation, and extended thinking. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/cli-claude-code/SKILL.md) - cli-codex: Codex CLI orchestrator enabling any AI assistant to invoke OpenAI's Codex CLI for supplementary AI tasks including code generation, code review, web research, codebase analysis, cross-AI validation, and parallel task processing. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/cli-codex/SKILL.md) - cli-copilot: GitHub Copilot CLI orchestrator enabling external AI assistants to invoke the standalone 'copilot' binary for supplementary tasks including collaborative planning, cloud delegation, versatile code generation, and autonomous task execution. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/cli-copilot/SKILL.md) - cli-gemini: Gemini CLI orchestrator enabling any AI assistant to invoke Google's Gemini CLI for supplementary AI tasks including code generation, web research via Google Search, codebase architecture analysis, cross-AI validation, and parallel task processing. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/cli-gemini/SKILL.md) - mcp-chrome-devtools: Chrome DevTools orchestrator providing intelligent routing between CLI (bdg) and MCP (Code Mode) approaches. CLI prioritized for speed and token efficiency; MCP fallback for multi-tool integration scenarios. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-chrome-devtools/SKILL.md) - mcp-clickup: ClickUp project management orchestrator providing intelligent routing between CLI (cu) and MCP (Code Mode) approaches. CLI prioritized for speed and token efficiency; MCP for enterprise features like docs, goals, webhooks, and bulk operations. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-clickup/SKILL.md) - mcp-code-mode: MCP orchestration via TypeScript execution for efficient multi-tool workflows. Use Code Mode for ALL MCP tool calls (ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.). Provides 98.7% context reduction, 60% faster execution, and type-safe invocation. Mandatory for external tool integration. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-code-mode/SKILL.md) - mcp-figma: Figma design file access via MCP providing 18 tools for file retrieval, image export, component/style extraction, team management, and collaborative commenting. Accessed via Code Mode for token-efficient workflows. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-figma/SKILL.md) - sk-code--full-stack: Stack-agnostic development orchestrator guiding developers through implementation, testing, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--full-stack/SKILL.md) - sk-code--opencode: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--opencode/SKILL.md) - sk-code--review: Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--review/SKILL.md) - sk-code--web: Orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project) (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/SKILL.md) - sk-doc: Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts and install guides. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc/SKILL.md) - sk-git: Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-git/SKILL.md) - sk-prompt-improver: Prompt engineering specialist that transforms vague requests into structured, scored AI prompts using 7 proven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), DEPTH thinking methodology, and CLEAR scoring across text modes. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-prompt-improver/SKILL.md) - system-spec-kit: Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications. (file: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/SKILL.md) - openai-docs: Use when the user asks how to build with OpenAI products or APIs and needs up-to-date official documentation with citations, help choosing the latest model for a use case, or explicit GPT-5.4 upgrade and prompt-upgrade guidance; prioritize OpenAI docs MCP tools, use bundled references only as helper context, and restrict any fallback browsing to official OpenAI domains. (file: /Users/michelkerkmeester/.codex/skills/.system/openai-docs/SKILL.md) - skill-creator: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Codex's capabilities with specialized knowledge, workflows, or tool integrations. (file: /Users/michelkerkmeester/.codex/skills/.system/skill-creator/SKILL.md) - skill-installer: Install Codex skills into $CODEX_HOME/skills from a curated list or a GitHub repo path. Use when a user asks to list installable skills, install a curated skill, or install a skill from another repo (including private repos). (file: /Users/michelkerkmeester/.codex/skills/.system/skill-installer/SKILL.md) ### How to use skills - Discovery: The list above is the skills available in this session (name + description + file path). Skill bodies live on disk at the listed paths. - Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned. - Missing/blocked: If a named skill isn't in the list or the path can't be read, say so briefly and continue with the best fallback. - How to use a skill (progressive disclosure): 1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow. 2) When `SKILL.md` references relative paths (e.g., `scripts/foo.py`), resolve them relative to the skill directory listed above first, and only consider other paths if needed. 3) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; don't bulk-load everything. 4) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks. 5) If `assets/` or templates exist, reuse them instead of recreating from scratch. - Coordination and sequencing: - If multiple skills apply, choose the minimal set that covers the request and state the order you'll use them. - Announce which skill(s) you're using and why (one short line). If you skip an obvious skill, say why. - Context hygiene: - Keep context small: summarize long sections instead of pasting them; only load extra files when needed. - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless you're blocked. - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice. - Safety and fallback: If a skill can't be applied cleanly (missing files, unclear instructions), state the issue, pick the next-best approach, and continue. Files called AGENTS.md commonly appear in many places inside a container - at "/", in "~", deep within git repositories, or in any other directory; their location is not limited to version-controlled folders. Their purpose is to pass along human guidance to you, the agent. Such guidance can include coding standards, explanations of the project layout, steps for building or testing, and even wording that must accompany a GitHub pull-request description produced by the agent; all of it is to be followed. Each AGENTS.md governs the entire directory that contains it and every child directory beneath that point. Whenever you change a file, you have to comply with every AGENTS.md whose scope covers that file. Naming conventions, stylistic rules and similar directives are restricted to the code that falls inside that scope unless the document explicitly states otherwise. When two AGENTS.md files disagree, the one located deeper in the directory structure overrides the higher-level file, while instructions given directly in the prompt by the system, developer, or user outrank any AGENTS.md content.   /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public zsh 2026-03-16 Europe/Amsterdam

---

> **User** | 2026-03-16 @ 19:37:51

Run /spec_kit:implement (/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.codex/prompts/spec_kit-implement.md) --- 1. Implement this phase: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/007-phase-classification 2a. But be sure review the spec, plan, tasks, checklist, decision-record in the root FIRST: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing 2b. And ALSO the work done in: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/004-type-consolidation /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/006-description-enrichment ---

---

> **Assistant** | 2026-03-16 @ 19:37:51

# AGENTS.md instructions for /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public  # AI Assistant Framework (Universal Template) > **Universal behavior framework** defining guar... → I’m treating this as a `/spec_kit:implement` planning pass because we’re still in Plan Mode.  I’ll first read the implementation prompt, the root phase docs you pointed to, and the prior phase outputs so we can ground the plan in the actual repo state before deciding anything. Used tools: exec_command, exec_command, exec_command and 25 more.

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

---

> **User** | 2026-03-16 @ 19:42:50

PLEASE IMPLEMENT THIS PLAN: # Re-sequence `009-perfect-session-capturing`: implement `008-signal-extraction` before `007-phase-classification` ## Summary Per your choice, `007-phase-classification` should not be implemented yet. Its spec explicitly depends on `008-signal-extraction`, and the repo still shows `008` as pre-implementation. The next implementation pass should therefore target `008`, then return to `007` only after the extraction contract is unified and green. ## Key Changes ### Immediate phase to implement: `008-signal-extraction` - Add a new unified engine in `scripts/lib/semantic-signal-extractor.ts` as the single owner of text preprocessing, stopword filtering, n-gram extraction, weighting, and ranked signal output. - Give that engine one stable input contract: `mode: 'topics' | 'triggers' | 'summary' | 'all'`, `stopwordProfile: 'balanced' | 'aggressive'`, and `ngramDepth: 1 | 2 | 3 | 4`. - Preserve current external behavior by making the existing trigger, topic, session, and semantic-summary entrypoints thin adapters over the new engine rather than changing their public signatures. - Remove the duplicated stopword/topic logic currently split across `session-extractor.ts`, `core/topic-extractor.ts`, and `shared/trigger-extractor.ts`; the new engine becomes the only preprocessing source of truth. - Keep placeholder/simulation filtering inside the unified engine so downstream callers do not re-implement their own special cases. - Treat current `shared/trigger-extractor.ts` behavior as the baseline for regression locking unless a deliberate divergence is documented during verification. ### Explicit unlock condition for `007-phase-classification` - After `008` lands, `007` must build per-exchange vectors from the unified extraction contract, not from new local tokenization or new phase-specific stopword lists. - `007` may then add clustering, non-contiguous phase tracking, and structural `FLOW_PATTERN` derivation on top of the unified signals. - Do not start `TopicCluster`, cosine grouping, or phase-timeline rewrites in the `008` pass; keep `008` focused on signal unification only. ### Documentation and completion artifacts - Update the `008-signal-extraction` spec folder docs to reflect the actual shipped design and evidence. - Keep `007-phase-classification` docs unchanged except for its blocked-by/depends-on status if the implementation workflow requires a note. - After implementation, generate the phase memory via `node.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js ` rather than writing memory files directly. ## Public APIs / Interfaces - New internal module/API: `SemanticSignalExtractor` in `scripts/lib/semantic-signal-extractor.ts`. - Stable adapter-facing options: - `mode: 'topics' | 'triggers' | 'summary' | 'all'` - `stopwordProfile: 'balanced' | 'aggressive'` - `ngramDepth: 1 | 2 | 3 | 4` - Existing public entrypoints keep their current signatures and output shapes; only their implementation source changes. ## Test Plan - Add golden tests for at least 3 frozen inputs: technical implementation text, debugging text, and research/planning text. - Verify the same input produces consistent ranked output across trigger, topic, session, and semantic-summary call paths. - Add unit coverage for stopword-profile behavior and n-gram depth `1-4`. - Re-run the existing extractor/module regression suites that currently cover `session-extractor`, `tool-detection`, and summary generation. - Only mark `008` complete once the golden tests and existing targeted extractor suites pass without introducing signature regressions. ## Assumptions - We are honoring your explicit choice to do `008` first rather than partially implementing `007` against the current preprocessing seam. - `008` is the next executable phase; `007` remains blocked until `008` is complete and validated. - Backward compatibility of the current extraction entrypoints is required. - Any intentional ranking/output changes discovered during `008` must be documented as accepted deltas, not silently absorbed.

---

> **Assistant** | 2026-03-16 @ 19:43:09

PLEASE IMPLEMENT THIS PLAN: # Re-sequence `009-perfect-session-capturing`: implement `008-signal-extraction` before `007-phase-classification` ## Summary Per your choice, `007-phase-classification` sh... → exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command update_plan exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command exec_command Unify description validation into shared validateDescription() with tiered outcomes (placeholder/activity-only/semantic/high-confidence).  Add provenance trust weighting to quality scorer. Used tools: exec_command, exec_command, exec_command and 31 more.

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

**Tool: exec_command**
Tool: exec_command

---

<!-- /ANCHOR:session-history -->

---

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

### Session Integrity Checks

| Check | Status | Details |
|-------|--------|---------|
| Memory File Exists |  |  |
| Index Entry Valid |  | Last indexed:  |
| Checksums Match |  |  |
| No Dedup Conflicts |  |  |
<!-- /ANCHOR:recovery-hints -->

---

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1773687240311-2d49e7673ff4"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction"
channel: "main"

# Classification
importance_tier: "critical"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: ""         # episodic|procedural|semantic|constitutional
  half_life_days:      # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate:            # 0.0-1.0, daily decay multiplier
    access_boost_factor:    # boost per access (default 0.1)
    recency_weight:              # weight for recent accesses (default 0.5)
    importance_multiplier:  # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced:    # count of memories shown this session
  dedup_savings_tokens:    # tokens saved via deduplication
  fingerprint_hash: ""         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:

    []

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-03-16"
created_at_epoch: 1773687240
last_accessed_epoch: 1773687240
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 5
decision_count: 1
tool_count: 90
file_count: 10
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "perfect capturing/008"
  - "capturing/008 signal"
  - "fusion/010 perfect"
  - "signal extraction"
  - "kit/022 hybrid"
  - "rag fusion/010"
  - "spec kit/022"
  - "system spec"
  - "hybrid rag"
  - "extraction system"
  - "over-engineering premature"
  - "avoid over-engineering"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing/008 signal extraction"
  - "over engineering"
  - "tree thinning"
  - "trigger extractor"
  - "semantic summarizer"
  - "script side"
  - "activity only"
  - "topic extractor"
  - "session extractor"
  - "implementation summary"
  - "merged-small-files tree-thinning merged small"
  - "tree-thinning merged small files"
  - "update phase docs"
  - "updated plan system"
  - "quality principles prefer simplicity"
  - "principles prefer simplicity reuse"
  - "prefer simplicity reuse existing"
  - "simplicity reuse existing patterns"
  - "reuse existing patterns cite"
  - "existing patterns cite evidence"
  - "patterns cite evidence sources"
  - "cite evidence sources solve"
  - "evidence sources solve stated"
  - "sources solve stated problem"
  - "solve stated problem avoid"
  - "stated problem avoid over-engineering"
  - "kit/022"
  - "fusion/010"
  - "capturing/008"
  - "signal"
  - "extraction"

key_files:

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

