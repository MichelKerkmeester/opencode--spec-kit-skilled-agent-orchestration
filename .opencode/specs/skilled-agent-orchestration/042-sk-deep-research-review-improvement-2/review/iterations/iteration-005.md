---
iteration: 5
dimension: correctness
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:53:22Z
completedAt: 2026-04-12T09:57:20Z
---

# Deep Review Iteration 005 — correctness

**Focus:** Phase 003 wave-executor: fan-out/join logic, segment identity determinism, activation gates in .opencode/skill/system-spec-kit/scripts/lib/wave-*.cjs (5 modules). Check wave-lifecycle.cjs for state transitions, wave-segment-planner.cjs for deterministic ordering, wave-convergence.cjs for per-segment convergence.

---

Reading additional input from stdin...
OpenAI Codex v0.120.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d811c-34e1-72d2-be48-9e48371ee416
--------
user
You are a senior code reviewer executing iteration 5 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: correctness
FOCUS: Phase 003 wave-executor: fan-out/join logic, segment identity determinism, activation gates in .opencode/skill/system-spec-kit/scripts/lib/wave-*.cjs (5 modules). Check wave-lifecycle.cjs for state transitions, wave-segment-planner.cjs for deterministic ordering, wave-convergence.cjs for per-segment convergence.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for correctness issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-005-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: correctness
   - File: exact file path
   - Line: line number(s) if applicable
   - Title: brief descriptive title
   - Description: detailed explanation of the issue
   - Evidence: relevant code snippet or reference
   - Recommendation: specific fix or improvement

4. After listing all findings, provide:
   - ITERATION SUMMARY: total findings, breakdown by severity
   - COVERAGE ASSESSMENT: what percentage of the focus area was reviewed
   - CONFIDENCE: your confidence in the completeness of this iteration (low/medium/high)
   - NEXT PRIORITIES: what should the next iteration examine that you could not cover

Be thorough and precise. Cite exact file paths and line numbers. Do not report findings that require subjective style preferences — focus on functional correctness, security, traceability, and maintainability risks.

Prior session context: A previous 10-iteration review (rvw-2026-04-11T13-50-06Z) found 16 findings (0 P0 / 10 P1 / 6 P2) with CONDITIONAL verdict. That review led to a 5-lane remediation (REQ-026 through REQ-034). This session validates the remediation AND examines areas not previously covered.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
Reviewing iteration 5 against the Phase 003 wave-executor surfaces now. I’m starting with the required routing and context steps, then I’ll read the focused `wave-*.cjs` modules and the 042 spec evidence before I assess correctness findings.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|rvw-2026-04-11T13-50-06Z|REQ-026|REQ-034|wave-executor|wave-lifecycle|wave-segment-planner|wave-convergence" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg --files -g 'CLAUDE.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep review iteration 5 for spec folder 042-sk-deep-research-review-improvement-2 focused on correctness in Phase 003 wave-executor wave-*.cjs modules" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 175ms:
CLAUDE.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md

 succeeded in 510ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-Tm0h6tZT' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-research(explicit), deep(name), iteration, loop, research(name)"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), correctness, review(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !folder, !spec, document~, folder, score~"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.89,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), iteration, loop, review(name)"
  }
]

codex
The routing pass points to `sk-code-review` and `sk-deep-review`, so I’m following those review conventions now. I’m also pulling the repo-local `CLAUDE.md` and the 042 packet context so the findings stay aligned with the existing review workflow rather than doing a generic pass.
exec
/bin/zsh -lc "sed -n '1,220p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work. Memory saves use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for DB indexing, embedding generation, and `description.json` refresh. AI may directly edit `_memory.continuity` frontmatter blocks in spec docs for session continuity updates, but must NEVER manually author standalone packet continuity artifacts under `memory/`.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **Code Search Decision Tree** (MANDATORY):
  - Semantic/concept search → `mcp__cocoindex_code__search` (CocoIndex). Skill: `.opencode/skill/mcp-coco-index/`
  - Structural queries (callers, imports, deps) → `code_graph_query` (Code Graph)
  - Exact text/regex → `Grep`

**GIT WORKFLOW:** 
Full details: `.opencode/skill/sk-git/`
- Worktree setup, conventional commits, PR creation, branch management
- Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | Semantic/concept → `CocoIndex search` · Structural (callers/imports/deps) → `code_graph_query` · Exact text → `Grep` · File paths → `Glob` · Read contents → `Read` |
| **Resume prior work**     | `/spec_kit:resume` → Rebuild context from `handover.md` → `_memory.continuity` → canonical spec docs → Review checklist → Continue |
| **Save context**          | Continuity-only `_memory.continuity` updates may be edited directly in canonical spec docs; use `/memory:save` or `generate-context.js --json '<data>' [spec-folder]` for indexed saves |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify                            |
| **Web code**              | sk-code-web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → `create.sh --phase` → Populate → Plan first child  |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init state → Loop (@deep-research iterations) → Convergence → Synthesize → Memory save                            |
| **Deep review**           | `/spec_kit:deep-review` → Init state → Loop (@deep-review iterations) → Convergence → Synthesize → Memory save                                |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                            |
| **Constitutional memory** | `/memory:learn` → Constitutional memory manager: create, list, edit, remove, budget                                               |
| **Shared memory**         | `/memory:manage shared` → Shared-memory lifecycle: create spaces, manage memberships, inspect rollout                                    |

## Context Recovery

These recovery steps are universal across Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI.

### After Context Compaction Or `/clear`

1. **FIRST ACTION** — use `/spec_kit:resume` as the canonical recovery surface
2. Rebuild prior work in this order: `handover.md` → `_memory.continuity` → canonical spec docs (`implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`)
3. Use `memory_context()` or `memory_search()` only when those packet-local continuity sources do not answer the question
4. Re-read the active runtime-specific instructions if they exist (`CODEX.md`, `GEMINI.md`, `.claude/CLAUDE.md`, runtime agent docs)
5. Present a concise recovered summary and WAIT for confirmation before proceeding

### Coding Analysis Lenses 

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

#### GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT] BLOCK
Trigger: EACH new user message (re-evaluate even in ongoing conversations)
1. Call `memory_match_triggers(prompt)` → Surface relevant context
2. Classify intent: Research or Implementation
3. Parse request → Check confidence AND uncertainty (see §4)
4. **Dual-threshold:** confidence ≥ 0.70 AND uncertainty ≤ 0.35 → PROCEED. Either fails → INVESTIGATE (max 3 iterations) → ESCALATE. Simple: <40% ASK | 40-69% CAUTION | ≥70% PASS

> Gate 1 is SOFT — if file modification detected, Gate 3 (HARD) takes precedence. Ask spec folder question BEFORE analysis.

####  GATE 2: SKILL ROUTING [REQUIRED for non-trivial tasks]
1. A) Run: `python3 .opencode/skill/scripts/skill_advisor.py "[request]" --threshold 0.8`
2. B) Cite user's explicit direction: "User specified: [exact quote]"
- Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed
- Output: `SKILL ROUTING: [result]` or `SKILL ROUTING: User directed → [name]`
- Skip: trivial queries only (greetings, single-line questions)

#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK — PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Triggers:** rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase — or any task resulting in file changes
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **DO NOT** use Read/Edit/Write/Bash (except Gate Actions) before asking. ASK FIRST, wait for response, THEN proceed
- **Phase boundary:** Gate 3 answers apply ONLY within current workflow phase. Plan→implement transition MUST re-evaluate. Exception: carry-over IS valid for Memory Save Rule

#### CONSOLIDATED QUESTION PROTOCOL
When multiple inputs are needed, consolidate into a SINGLE prompt — never split across messages. Include only applicable questions; omit when pre-determined.
- **Round-trip optimization** — Only 1 user interaction needed for setup
- **First Message Protocol** — ALL questions asked BEFORE any analysis or tool calls
- **Violation:** Multiple separate prompts → STOP, apologize, re-present as single prompt
- **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading; Level 1 tasks skip completion verification

---

### 🔒 POST-EXECUTION RULES

#### MEMORY SAVE RULE [HARD] BLOCK
Trigger: "save context", "save memory", `/memory:save`, continuity support artifact refresh
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Script:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - Use this for DB indexing, embedding generation, and `description.json` refresh. AI may directly edit `_memory.continuity` frontmatter blocks in spec docs when only the doc-local continuity hints need updating.
  - AI composes structured JSON with session context, writes to `/tmp/save-context-data.json`, passes as first arg. Alternatively use `--json '<inline-json>'` or `--stdin`. The AI has strictly better information about its own session than any DB extraction.
  - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents)
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()`
- **Violation:** Manually authored standalone continuity support artifact under `memory/` → DELETE and re-run via script
- **Post-Save Review:** After `generate-context.js` completes, check the POST-SAVE QUALITY REVIEW output.
  - **HIGH** issues: MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)
  - **MEDIUM** issues: patch when practical
  - **PASSED/SKIPPED**: no action needed

#### COMPLETION VERIFICATION RULE [HARD] BLOCK
Trigger: Claiming "done", "complete", "finished", "works"
1. Validation runs automatically on spec folder (if exists)
2. Load `checklist.md` → Verify ALL items → Mark `[x]` with evidence
- Skip: Level 1 tasks (no checklist.md required) | Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix)

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT

#### Self-Check (before ANY tool-using response):
- [ ] File modification? Asked spec folder question?
- [ ] Skill routing verified?
- [ ] Saving indexed memory? Using `generate-context.js` and avoiding standalone `memory/` files?
- [ ] Aligned with ORIGINAL request? No scope drift?
- [ ] Claiming completion? `checklist.md` verified?

---

## 3. 📝 CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details:** system-spec-kit SKILL.md (§1 When to Use, §3 How it Works, §4 Rules)

### Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500           | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

> **Note:** `implementation-summary.md` is REQUIRED for all levels but created **after implementation completes**, not at spec folder creation time. See SKILL.md §4 Rule 13.

**Rules:** When in doubt → higher level. LOC is soft guidance (risk/complexity can override). Single typo/whitespace fixes (<5 characters in one file) are exempt.

**Spec folder path:** `specs/[###-short-name]/` | **Templates:** `.opencode/skill/system-spec-kit/templates/`

**For details on:** folder structure, `scratch/` vs `memory/` usage, sub-folder versioning, checklist verification (P0/P1/P2), and completion workflow — see system-spec-kit SKILL.md §3.

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

**Core Principle:** If confidence < 80%, pause and ask for clarification with multiple-choice options.

| Confidence   | Action                                       |
| ------------ | -------------------------------------------- |
| **≥80%**     | Proceed with citable source                  |
| **40-79%**   | Proceed with caveats                         |
| **<40%**     | Ask for clarification or mark "UNKNOWN"      |
| **Override** | Blockers/conflicts → ask regardless of score |

**Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?"

**Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step.

---


exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code-opencode, sk-code-web, and sk-code-full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code-review` and paired with one `sk-code-*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
- A workflow dispatches `@review` for pre-commit or gate validation.
- A user requests security/correctness risk analysis before merge.
- A user wants severity-ranked findings with file:line evidence.

### Keyword Triggers

`review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `request changes`, `findings`, `blocking issues`, `merge readiness`

### Use Cases

1. Review-only pass: findings-first output with no code edits.
2. Gate validation: score + pass/fail recommendation for orchestrated workflows.
3. Focused risk pass: security, concurrency, correctness, or removal-focused review.

### When NOT to Use

- Feature implementation without review intent.
- Pure documentation editing where code behavior is not being assessed.
- Git-only workflow tasks (branching, rebasing, commit hygiene) without code-quality evaluation intent.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Primary Detection Signal

Review behavior follows a baseline+overlay model:

- Baseline (always): `sk-code` (implemented by this skill: `sk-code-review`)
- Overlay (exactly one `sk-code-*`):
  - OpenCode system context -> `sk-code-opencode`
  - Frontend/web context -> `sk-code-web`
  - Default/other stacks -> `sk-code-full-stack`

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect `sk-code` baseline + one `sk-code-*` overlay
    +- STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
    +- Phase 1: Scope and baseline checks
    +- Phase 2: Overlay alignment
    +- Phase 3: Findings-first analysis
    +- Phase 4: Output contract and next action
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies weighted intent scoring.

Knowledge is organized by domain mapping:

```text
references/review_core.md
references/review_ux_single_pass.md
references/*_checklist.md
assets/review/...
```

- `references/review_core.md` for shared doctrine consumed by both `@review` and `@deep-review`.
- `references/review_ux_single_pass.md` for interactive single-pass review behavior.
- `references/` for baseline review flow, severity contracts, and risk checklists.
- `assets/` for optional reusable templates/checklists (if present in this skill).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | `references/review_core.md`, `references/review_ux_single_pass.md`, `references/security_checklist.md`, `references/code_quality_checklist.md` |
| CONDITIONAL | Intent score indicates need | `references/solid_checklist.md`, `references/code_quality_checklist.md`, `references/removal_plan.md`, `references/test_quality_checklist.md` |
| ON_DEMAND | Explicit deep-dive request | Full mapped reference set |

### Precedence Matrix

| Rule Type | Source of Truth | Behavior |
| --- | --- | --- |
| Security/correctness minimums | `sk-code` baseline (`sk-code-review`) | Always enforced; never relaxed by overlay |
| Stack style/process conventions | Overlay skill | Overlay guidance overrides baseline generic style/process advice |
| Verification/build/test commands | Overlay skill | Overlay commands are authoritative for the detected stack |
| Ambiguous conflicts | Escalation | Ask for clarification; do not guess |

### Unknown Fallback Checklist

If intent/stack detection is unclear, request:

1. Review target scope (full diff, staged files, commit range, or explicit file list).
2. Primary risk class (security, correctness, performance, maintainability).
3. Architecture lens priority (KISS/DRY/SOLID strict or optional).
4. Stack/context (OpenCode system code, web/frontend, or other/full-stack).
5. Desired output mode (findings-only or findings + gated fix follow-up).

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# Discover resources recursively across references and assets.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCES = [
    "references/review_core.md",
    "references/review_ux_single_pass.md",
    "references/security_checklist.md",
    "references/code_quality_checklist.md",
]

INTENT_SIGNALS = {
    "SECURITY": {"weight": 5, "keywords": ["security", "auth", "injection", "vulnerability", "race"]},
    "QUALITY": {"weight": 4, "keywords": ["correctness", "bug", "regression", "performance", "boundary", "contract", "breaking change", "backward compatible", "compatibility"]},
    "KISS": {"weight": 3, "keywords": ["kiss", "simple", "simplicity", "over-engineer", "overengineering"]},
    "DRY": {"weight": 3, "keywords": ["dry", "duplication", "duplicate", "copy-paste", "repeated logic"]},
    "SOLID": {"weight": 3, "keywords": ["solid", "architecture", "design", "coupling", "cohesion", "module", "adapter", "interface", "abstraction", "responsibility", "dependency", "boundary"]},
    "REMOVAL": {"weight": 3, "keywords": ["remove", "dead code", "cleanup", "deprecate"]},
    "TESTING": {"weight": 3, "keywords": ["test", "tests", "testing", "coverage", "assertion", "mock", "stub", "fixture", "test quality", "brittle"]},
}

RESOURCE_MAP = {
    "SECURITY": ["references/security_checklist.md"],
    "QUALITY": ["references/code_quality_checklist.md"],
    "KISS": ["references/code_quality_checklist.md"],
    "DRY": ["references/code_quality_checklist.md"],
    "SOLID": ["references/solid_checklist.md"],
    "REMOVAL": ["references/removal_plan.md"],
    "TESTING": ["references/test_quality_checklist.md"],
}

ON_DEMAND_KEYWORDS = ["deep review", "full review", "all checks", "comprehensive"]
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm review scope (diff/staged/files/commit range)",
    "Confirm risk priority (security/correctness/performance/maintainability/test quality/contract safety)",
    "Confirm architecture lens (KISS/DRY/SOLID required or optional)",
    "Confirm stack context (opencode/web/full-stack)",
    "Confirm findings-only vs findings+fix follow-up",
]


def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "description", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()


def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()


def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}


def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    return scores


def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]


def detect_overlay_skill(task, workspace_files=None, changed_files=None) -> str:
    text = _task_text(task)
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if "opencode" in text or ".opencode/" in files or "jsonc" in text or "mcp" in text:
        return "sk-code-opencode"
    if any(term in text for term in ["frontend", "web", "css", "dom", "browser", "webflow"]) or any(
        marker in files for marker in ["next.config", "vite.config", "package.json", "src/"]
    ):
        return "sk-code-web"
    return "sk-code-full-stack"


def route_review_resources(task, workspace_files=None, changed_files=None):
    inventory = discover_markdown_resources()
    text = _task_text(task)

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-deep-review
description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search]
# Note: Task tool is for the command executor (loop management). The @deep-review agent itself does NOT have Task (LEAF-only).
# No WebFetch: review is code-only and read-only. No external resource fetching.
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.3.1.0
---

<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code-review` instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code-opencode` or `/spec_kit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
LOCAL_REFS   = SKILL_ROOT / "references"
LOCAL_ASSETS = SKILL_ROOT / "assets"
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "code audit", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/loop_protocol.md",
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
        "assets/deep_review_strategy.md",
    ],
    "REVIEW_ITERATION":   [
        "references/loop_protocol.md",
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_REPORT":      [
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND":         [
        "references/loop_protocol.md",
        "references/state_format.md",
        "references/convergence.md",
    ],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active
```

### Phase Detection

Detect the current review phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists in `review/` | Loop protocol, state format, review contract |
| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, review contract |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Review contract, state format |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-review "target"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-review command  │  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (review-report)   │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-review (LEAF agent)    │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE review cycle    │
    │  - Writes: findings + state      │
    │  - Tools: Grep, Read, Glob, etc │
    │  - No WebFetch (code-only)      │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-review-config.json         │  Persists across iterations
    │  deep-review-state.jsonl        │
    │  deep-review-strategy.md        │
    │  deep-review-dashboard.md       │
    │  review/iterations/             │
    │    iteration-NNN.md             │
    │  review/review-report.md        │
    └─────────────────────────────────┘
```

### State Packet Location

The review state packet lives under `{spec_folder}/review/`:

```text
review/
  deep-review-config.json            # Immutable after init: review parameters
  deep-review-state.jsonl            # Append-only review iteration log
  deep-review-strategy.md            # Review dimensions, findings, next focus
  deep-review-dashboard.md           # Auto-generated review dashboard
  .deep-review-pause                 # Pause sentinel checked between iterations
  review-report.md                   # Final review report (synthesis output)
  iterations/
    iteration-NNN.md                 # Write-once review findings per iteration
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-review
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Select ONE dimension (from strategy "Next Focus")
  |                                         3. Review target code (read-only, 3-5 actions)
  |                                         4. Write iteration-NNN.md (P0/P1/P2 findings)
  |                                         5. Update deep-review-strategy.md
  |                                         6. Append deep-review-state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile review/review-report.md (9 sections, verdict)
  |
Save --> generate-context.js --> verify memory artifact
```

### Review Dimensions

The four primary review dimensions (configured in `assets/review_mode_contract.yaml`):

| Dimension | Focus | Key Questions |
|-----------|-------|---------------|
| **Correctness** | Logic, behavior, error handling | Does the code do what it claims? Are edge cases handled? |
| **Security** | Vulnerabilities, exposure, trust boundaries | Are inputs validated? Are credentials exposed? |
| **Spec-Alignment / Traceability** | Spec vs. implementation fidelity | Does code match spec.md? Are all planned items present? |
| **Completeness / Maintainability** | Coverage, dead code, documentation | Are TODOs resolved? Is the code self-documenting? |

### Lifecycle + Reducer Contract

Review mode is lineage-aware. Every packet uses canonical review-mode artifacts:
- `deep-review-config.json`

exec
/bin/zsh -lc "rg --files | rg '042-sk-deep-research-review-improvement-2|wave-(executor|lifecycle|segment-planner|convergence|.*)\\.cjs"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 178ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/findings-registry.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-state.jsonl
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/tasks.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/description.json
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/README.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/graph-metadata.json
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs

codex
I’ve got the packet and runtime surface mapped. Next I’m reading the 003-wave-executor spec plus the five `wave-*` modules side by side with the archived review notes so I can tell whether I’m seeing a true remaining bug, a regression, or an already-remediated path.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-code-opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Writing or modifying OpenCode system code (.opencode/, MCP servers, scripts)
- Creating new JavaScript modules for MCP servers or utilities
- Writing Python scripts (validators, advisors, test utilities)
- Creating Shell scripts (automation, validation, deployment)
- Configuring JSON/JSONC files (manifests, schemas, configs)
- Preparing stack-specific standards evidence for `sk-code-review` baseline runs
- Need naming, formatting, or structure guidance

**Keyword triggers:**

| Language   | Keywords                                                                          |
| ---------- | --------------------------------------------------------------------------------- |
| JavaScript | `opencode`, `mcp`, `commonjs`, `require`, `module.exports`, `strict`              |
| TypeScript | `typescript`, `ts`, `tsx`, `interface`, `type`, `tsconfig`, `tsc`, `strict`       |
| Python     | `python`, `pytest`, `argparse`, `docstring`, `snake_case`                         |
| Shell      | `bash`, `shell`, `shebang`, `set -e`, `pipefail`                                  |
| Config     | `json`, `jsonc`, `config`, `schema`, `manifest`                                   |

### When NOT to Use

**Do NOT use this skill for:**
- Web/frontend development (use `sk-code-web` instead)
- Browser-specific patterns (DOM, observers, animations)
- CSS styling or responsive design
- CDN deployment or minification workflows
- Full development lifecycle (research/debug/verify phases)

### Skill Overview

| Aspect        | This Skill (opencode)        | sk-code-web        |
| ------------- | ---------------------------- | --------------------- |
| **Target**    | System/backend code          | Web/frontend code     |
| **Languages** | JS, TS, Python, Shell, JSON  | HTML, CSS, JavaScript |
| **Phases**    | Standards only               | 4 phases (0-3)        |
| **Browser**   | Not applicable               | Required verification |
| **Focus**     | Internal tooling             | User-facing features  |

**The Standard**: Evidence-based patterns extracted from actual OpenCode codebase files with file:line citations.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/shared/` for universal cross-language patterns, structure conventions, and organization guidance.
- `references/javascript/` for JavaScript style, quality standards, and quick-reference guidance.
- `references/typescript/` for TypeScript style, quality standards, and quick-reference guidance.
- `references/python/` for Python style, quality standards, and quick-reference guidance.
- `references/shell/` for shell scripting style, quality standards, and quick-reference guidance.
- `references/config/` for JSON/JSONC style rules and configuration guidance.
- `assets/checklists/` for language-specific quality gates and completion checklists.

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If language keywords match | Language-specific references |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/shared/universal_patterns.md"

LANGUAGE_KEYWORDS = {
    "JAVASCRIPT": {"node": 1.8, "commonjs": 2.0, "require": 1.5, "module.exports": 2.1},
    "TYPESCRIPT": {"typescript": 2.4, "interface": 2.0, "tsconfig": 2.1, "tsc": 1.8},
    "PYTHON": {"python": 2.3, "pytest": 2.0, "argparse": 1.7, "docstring": 1.6},
    "SHELL": {"bash": 2.2, "shebang": 1.5, "set -e": 1.5, "pipefail": 1.7},
    "CONFIG": {"json": 2.0, "jsonc": 2.1, "schema": 1.8, "manifest": 1.5},
}

FILE_EXTENSIONS = {
    ".js": "JAVASCRIPT", ".mjs": "JAVASCRIPT", ".cjs": "JAVASCRIPT",
    ".ts": "TYPESCRIPT", ".tsx": "TYPESCRIPT", ".mts": "TYPESCRIPT", ".d.ts": "TYPESCRIPT",
    ".py": "PYTHON",
    ".sh": "SHELL", ".bash": "SHELL",
    ".json": "CONFIG", ".jsonc": "CONFIG"
}

NOISY_SYNONYMS = {
    "TYPESCRIPT": {"typecheck": 1.8, "lint": 1.3, "strict": 1.2, "ci": 1.0},
    "SHELL": {"shell safety": 2.0, "pipefail": 1.7, "unsafe": 1.6, "script warning": 1.4},
    "CONFIG": {"jsonc": 2.0, "schema": 1.3, "config drift": 1.4, "format": 1.2},
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "List changed file extensions in the patch",
    "Confirm CI failure category (style, typecheck, shell safety, config parsing)",
    "Provide one representative failing command/output",
    "Confirm minimum verification command set before completion claim",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "context", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "path", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def detect_languages(task):
    """Weighted language intent scoring with top-2 ambiguity handling."""
    ext = Path(task.path).suffix.lower() if getattr(task, "path", "") else ""
    if ext in FILE_EXTENSIONS:
        return [FILE_EXTENSIONS[ext]], {FILE_EXTENSIONS[ext]: 100.0}

    text = _task_text(task)
    scores = {lang: 0.0 for lang in LANGUAGE_KEYWORDS}
    for language, signals in LANGUAGE_KEYWORDS.items():
        for term, weight in signals.items():
            if term in text:
                scores[language] += weight
    for language, synonyms in NOISY_SYNONYMS.items():
        for term, weight in synonyms.items():
            if term in text:
                scores[language] += weight

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    best_lang, best_score = ranked[0]
    second_lang, second_score = ranked[1]
    if best_score == 0:
        return ["UNKNOWN"], scores
    adaptive_limit = 3 if sum(1 for term in ["ci", "mixed", "multi", "format", "safety"] if term in text) >= 2 else 2
    if (best_score - second_score) <= 0.8:
        top_languages = [language for language, score in ranked if score > 0][:adaptive_limit]
        return top_languages, scores
    return [best_lang], scores

def route_opencode_resources(task):
    inventory = discover_markdown_resources()

    selected = ["references/shared/universal_patterns.md", "references/shared/code_organization.md"]

    languages, language_scores = detect_languages(task)

    # Ambiguity handling: when top-2 are close, load both quick references.
    for language in languages:
        if language == "JAVASCRIPT":
            selected.extend([
                "references/javascript/style_guide.md",
                "references/javascript/quality_standards.md",
                "references/javascript/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/javascript_checklist.md")

        elif language == "TYPESCRIPT":
            selected.extend([
                "references/typescript/style_guide.md",
                "references/typescript/quality_standards.md",
                "references/typescript/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/typescript_checklist.md")

        elif language == "PYTHON":
            selected.extend([
                "references/python/style_guide.md",
                "references/python/quality_standards.md",
                "references/python/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/python_checklist.md")

        elif language == "SHELL":
            selected.extend([
                "references/shell/style_guide.md",
                "references/shell/quality_standards.md",
                "references/shell/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/shell_checklist.md")

        elif language == "CONFIG":
            selected.extend([
                "references/config/style_guide.md",
                "references/config/quality_standards.md",
                "references/config/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/config_checklist.md")

    if languages == ["UNKNOWN"]:
        return {
            "languages": languages,
            "language_scores": language_scores,
            "resources": selected,
            "needs_clarification": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
        }

    deduped = []

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-code-review/references/review_core.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

---

## 1. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.

---

## 2. EVIDENCE REQUIREMENTS

- Every `P0` and `P1` finding must include a concrete `file:line` citation.
- Evidence must tie the finding to observed code behavior, not just a general concern.
- `P2` findings should still include specific evidence when available, even if impact is advisory.
- If evidence is incomplete, state the assumption and why the risk still matters.

---

## 3. FINDINGS OUTPUT ORDERING

- Present findings before summary or praise sections.
- Order findings by severity first: `P0`, then `P1`, then `P2`.
- Keep ordering stable within a severity bucket by impact and confidence.
- Separate required fixes from optional suggestions so merge decisions stay clear.

---

## 4. BASELINE + OVERLAY PRECEDENCE

Apply this skill as the baseline first, then pair it with exactly one overlay:

- OpenCode system code -> `sk-code-opencode`
- Frontend/web code -> `sk-code-web`
- Default/other stacks -> `sk-code-full-stack`

Precedence rules:

- Baseline security and correctness minimums are always enforced.
- Overlay style, process, build, and test conventions override generic baseline guidance.
- Unclear conflicts must be escalated rather than guessed.

---

## 5. BASELINE CHECK FAMILIES

Mandatory baseline families:

- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.

These minimums cannot be relaxed by an overlay.

---

## 6. FINDING SCHEMA

Each finding should provide:

| Field | Requirement |
| --- | --- |
| `id` | Stable label within the review report, such as `P1-001` |
| `severity` | One of `P0`, `P1`, `P2` |
| `title` | Short, risk-oriented summary |
| `file` | Primary `path:line` location |
| `evidence` | Plain-language explanation tied to observed code |
| `recommendation` | Specific, scope-proportional fix or follow-up |

Suggested shape:

```markdown
### P1-001 [P1] Missing authorization check
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- Recommendation: Enforce the existing permission guard before mutation.
```

---

## 7. RELATED RESOURCES

- [review_ux_single_pass.md](./review_ux_single_pass.md) - Interactive single-pass report flow and next-step prompts.
- [quick_reference.md](./quick_reference.md) - Lightweight index across baseline review references.
- [security_checklist.md](./security_checklist.md) - Security and reliability checks.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, KISS, DRY, and maintainability checks.

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Feature Specification: Wave Executor [042.003]"
description: "Define orchestrator-managed parallel wave execution for deep research and deep review so large targets can be segmented, converged, and merged without turning LEAF agents into sub-agent managers."
trigger_phrases:
  - "042.003"
  - "wave executor"
  - "segment planner"
  - "coordination board"
  - "parallel deep loop"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 003 adds orchestrator-managed parallel wave execution so deep research and deep review can handle very large targets without abandoning the LEAF-worker model. It formalizes deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the coverage-graph foundation from Phase 002.

Critical prerequisite: workflow fan-out/join capability must be proven before wave execution can be built. The current YAML workflow engine has no native parallel dispatch, so this phase must first establish either helper-module orchestration that safely performs fan-out/join outside the YAML surface or an explicit engine extension that makes parallel dispatch and join first-class.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Parent Packet** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 3 of 4 |
| **Predecessor** | `../002-semantic-coverage-graph/spec.md` |
| **Successor** | `../004-offline-loop-optimizer/spec.md` |
| **Handoff Criteria** | Phase 004 can replay wave runs as deterministic, segment-aware traces with stable board and merge artifacts. |

<!-- ANCHOR:phase-context -->
**Phase Context**: This phase adds orchestrator-managed parallel batches on top of the coverage-graph substrate from Phase 002. The goal is scale without architectural drift: the workers stay LEAF, while orchestration logic handles segmentation, fan-out, pruning, promotion, and merge.

**Dependencies**:
- Proven fan-out/join capability via helper-module orchestration or YAML workflow engine extension.
- Phase 002 graph tools, especially graph-backed convergence and gap detection.
- Phase 001 stop reasons, journals, resume semantics, and reducer-owned sections.
- Existing deep-research and deep-review command or YAML entrypoints.

**Deliverables**:
- Proven workflow fan-out/join path before any wave-mode runtime wiring proceeds.
- v1 deterministic segmentation using heuristics: file-count thresholds, directory grouping, simple hotspot ranking, and stable segment identities.
- v2 graph/cluster-enhanced segmentation using the Phase 002 coverage graph once the graph surfaces are operational.
- Wave lifecycle orchestration for plan, fan-out, prune, promote, and merge.
- Mandatory decomposition prepass artifacts: `hotspot-inventory.json` for review and `domain-ledger.json` for research.
- Reducer-owned `board.json` execution ledger plus a derived human-readable dashboard render.
- Segment JSONL contract and merge rules keyed by explicit identifiers rather than append order.
- Verification for segment isolation, merge correctness, and default-path preservation.
<!-- /ANCHOR:phase-context -->
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop products are currently optimized for one iteration stream at a time. That works for moderate targets, but it becomes inefficient and hard to govern once a review scope crosses 1000 files or a research scope spans dozens of domains. Without a structured wave executor, operators must either accept slow sequential progress or invent ad hoc parallelism that risks duplicated work, conflicting findings, and unmergeable state. The problem is amplified by the current YAML workflow engine, which has no native parallel dispatch or join capability today.

### Purpose

Define an orchestrator-layer wave execution model that segments large review and research targets into bounded parallel batches, tracks each segment through convergence and promotion, and merges the results back into one auditable packet without changing the LEAF-worker rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Prove workflow fan-out/join capability before wave execution is wired into deep research or deep review.
- Add shared CommonJS planners for v1 deterministic review-file segmentation and research-domain segmentation.
- Add v2 graph/cluster-enhanced segmentation that refines decomposition using the Phase 002 coverage graph once it is operational.
- Define wave lifecycle steps: plan, fan-out, prune, promote, and merge.
- Introduce machine-first, reducer-owned packet-local coordination tracking with `board.json` as the canonical execution ledger and a derived human-readable dashboard render.
- Define mandatory decomposition prepass artifacts: `hotspot-inventory.json` for review and `domain-ledger.json` for research.
- Define segment-local JSONL or state artifacts and deterministic merge rules into the main packet lineage using explicit keys: `sessionId`, `generation`, `segment`, `wave`, and `findingId`.
- Apply Phase 002 graph convergence per segment so pruning and promotion decisions are evidence-backed.
- Add activation gates so wave execution only activates for review scopes with at least 1000 files plus hotspot spread, or research scopes with at least 50 domains plus cluster diversity; otherwise the default sequential path remains unchanged.
- Add workflow, config, and strategy surfaces for wave-aware execution without changing the default small-target path.
- Add tests for lifecycle correctness, segment isolation, merge idempotence, and resume or recovery behavior.

### Out of Scope

- Graph storage and graph-tool creation from Phase 002.
- Offline replay optimization, config search, and promotion gates from Phase 004.
- Allowing LEAF research or review agents to spawn child agents directly.
- Replacing the existing single-stream path for small review or research runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs` | Create | Shared planner for v1 heuristic segmentation and v2 graph-enhanced review or research segments. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` | Create | Orchestrator lifecycle helpers for fan-out, join, prune, promote, merge, and resume state transitions. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs` | Create | Reducer-owned `board.json` execution-ledger schema, status transitions, conflict tracking, and derived dashboard renderer helpers. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs` | Create | Segment JSONL, lineage, and merge helpers keyed by explicit segment identifiers. |
| `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs` | Create | Segment-level convergence helpers that wrap Phase 002 graph metrics and stop traces. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document domain-ledger prepass, activation gates, v1/v2 segmentation, fan-out/join, prune or promote rules, and merge behavior for research. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add `domain-ledger.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add segment plan, promoted findings, and merge checkpoints while keeping execution-ledger ownership machine-first. |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document `hotspot-inventory.json`, activation gates, v1/v2 segmentation, wave lifecycle, and merge behavior for review. |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add `hotspot-inventory.json`, segment JSONL, `board.json`, derived dashboard, and keyed merge contracts. |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add wave mode, activation gates, segment planner versioning, and board configuration fields. |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add segment queues, conflict tracking, and merge checkpoints while keeping execution-ledger ownership machine-first. |
| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Define wave-aware review outputs and reducer-owned coordination sections. |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for research. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Document wave-mode legality, activation gates, and the prerequisite fan-out/join proof for review. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add domain-ledger prepass, fan-out/join, prune, promote, and keyed merge steps for research. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode research flow aligned with activation-gated wave lifecycle rules. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add hotspot-inventory prepass, fan-out/join, prune, promote, and keyed merge steps for review. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode review flow aligned with activation-gated wave lifecycle rules. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts` | Create | Verify segment planning, ranking, and clustering behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` | Create | Verify lifecycle transitions, prune rules, and promotion rules. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts` | Create | Verify segment isolation, deterministic merge, and idempotent replay behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts` | Create | Verify wave interruption and resume behavior. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-000 | Workflow fan-out/join capability MUST be proven before wave execution can be built. | The packet defines and verifies one canonical path for parallel dispatch plus join, either through helper-module orchestration or a YAML engine extension; until that proof exists, wave execution remains blocked and the default sequential path stays authoritative. |
| REQ-001 | The phase MUST define two segmentation versions for both large review scopes and large research scopes. | v1 uses deterministic heuristics such as file-count thresholds, directory grouping, simple hotspot ranking, domain counts, authority levels, and stable cluster assignment; v2 explicitly layers Phase 002 coverage-graph or cluster signals on top of v1 once the graph surfaces are operational. |
| REQ-002 | Parallelism MUST live at the orchestrator layer while LEAF agents remain non-spawning workers. | Wave lifecycle steps are owned by shared orchestration logic and YAML workflows; no requirement or task asks `@deep-research` or `@deep-review` workers to spawn child agents directly. |
| REQ-003 | The phase MUST define a packet-local coordination board that is reducer-owned and machine-first. | `board.json` is the canonical execution ledger for per-segment state, conflict notes, deduplication markers, and promotion outcomes; the dashboard is a derived human-readable render and not a human-edited strategy surface. |
| REQ-004 | Segment-local JSONL and merge rules MUST preserve auditability when wave results are merged back into the main packet lineage. | Segment artifacts remain replayable on their own, merged records always include explicit keys `sessionId`, `generation`, `segment`, `wave`, and `findingId`, and merge logic never relies on append order as the source of truth. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each segment MUST use Phase 002 graph signals independently for convergence, pruning, promotion, and v2 decomposition upgrades. | Segment convergence explicitly references coverage-graph status or convergence outputs; prune logic can retire converged or stuck segments without dropping unresolved global gaps silently; graph-enhanced segmentation is blocked until the Phase 002 coverage graph is operational. |
| REQ-006 | Deep-research and deep-review workflows MUST expose wave execution as a bounded mode for large targets while preserving the default small-target path. | Wave mode activates only when review targets have at least 1000 files with hotspot spread or research targets have at least 50 domains with cluster diversity; otherwise command docs, YAML workflows, and config surfaces keep the normal single-stream flow as the default path. |
| REQ-007 | Wave planning MUST emit mandatory decomposition prepass artifacts before any segment fan-out occurs. | Review writes `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities; research writes `domain-ledger.json` with source domains, authority levels, and cluster assignments; both artifacts are consumed by later wave steps rather than treated as optional notes. |
| REQ-008 | Segment promotion and merge MUST preserve conflict and dedupe metadata instead of flattening segment results into one anonymous stream. | The coordination board and merge outputs explicitly keep `conflict`, `duplicate`, or `promoted` state so later synthesis and replay can explain where findings came from. |
| REQ-009 | The phase MUST add verification for lifecycle correctness, segment isolation, merge correctness, and resume behavior. | Planned tests cover fan-out/join proof, planner determinism, lifecycle transitions, keyed merge idempotence, interruption or resume semantics, activation-gate fallbacks, and protection against duplicate or conflicting promoted findings. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fan-out/join capability is proven before wave mode is wired into deep research or deep review.
- **SC-002**: Research and review each have documented v1 heuristic segmentation plus v2 graph-enhanced segmentation that scale to the large-target examples in the phase brief.
- **SC-003**: The wave lifecycle is explicit and ordered: prepass, plan, fan-out, prune, promote, join, then merge.
- **SC-004**: `board.json` is treated as the canonical packet-local execution ledger and the dashboard is clearly derived from it.
- **SC-005**: `hotspot-inventory.json` and `domain-ledger.json` are mandatory prepass artifacts before wave dispatch.
- **SC-006**: Segment-local artifacts remain replayable and mergeable without losing segment provenance or keyed identity.
- **SC-007**: Phase 002 graph convergence is reused per segment in v2 rather than redefined for wave mode.
- **SC-008**: Default non-wave execution remains the canonical small-target path.
- **SC-009**: Verification covers fan-out/join proof, planner determinism, lifecycle behavior, merge correctness, activation gates, and resume safety.

### Acceptance Scenarios

1. **Given** the current YAML workflow engine has no native parallel dispatch, **when** this phase begins implementation, **then** a helper-module orchestration proof or engine extension must be chosen and validated before wave execution is treated as buildable.
2. **Given** a review scope with at least 1000 files and meaningful hotspot spread, **when** wave planning runs, **then** the review prepass emits `hotspot-inventory.json` and the planner emits stable v1 hotspot-ranked segments instead of one monolithic file list.
3. **Given** a research scope with at least 50 source domains and cluster diversity, **when** wave planning runs, **then** the research prepass emits `domain-ledger.json` and the planner emits bounded domain clusters with stable identities.
4. **Given** Phase 002 graph signals are operational, **when** v2 segmentation runs, **then** the planner refines decomposition using graph coverage or cluster signals rather than replacing the v1 heuristic baseline blindly.
5. **Given** one segment converges early, **when** prune evaluation runs, **then** that segment can retire without making global STOP legal until remaining gaps are satisfied.
6. **Given** two segments surface duplicate or conflicting findings, **when** promotion and merge happen, **then** the coordination board preserves those states and the merged JSONL remains keyed by explicit identifiers rather than append order.
7. **Given** a wave is interrupted mid-run, **when** resume starts, **then** only incomplete segment work is resumed and previously merged segment lineage remains intact.
8. **Given** a small-target run or a large target that lacks hotspot spread or cluster diversity, **when** deep research or deep review starts, **then** execution stays on the existing single-stream path and does not invoke wave machinery unnecessarily.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Workflow fan-out/join capability is not yet native in the YAML workflow engine | High | Treat proof of helper-module orchestration or engine extension as the first blocking deliverable before any wave runtime build begins. |
| Dependency | Phase 002 graph convergence must exist before segment pruning is trustworthy | High | Treat graph status and convergence as prerequisite surfaces for prune and promote decisions. |
| Dependency | Phase 001 resume semantics remain the lineage authority | Medium | Build wave resume on top of the same typed stop and journal model rather than creating a second checkpoint system. |
| Risk | Segment planners produce unstable partitions between runs | Medium | Require deterministic ranking and stable segment IDs based on scope metadata. |
| Risk | Merge behavior duplicates or overwrites findings across segments | High | Preserve segment provenance, conflict markers, and dedupe metadata through merge rules and tests. |
| Risk | Coordination-board maintenance becomes manual busywork | Medium | Keep `board.json` reducer-owned and generate the dashboard as a derived render, not a human-maintained strategy surface. |
| Risk | Wave mode leaks into small-target defaults and makes normal runs harder to understand | Medium | Gate wave mode behind explicit large-target criteria and keep the default path unchanged. |
| Risk | YAML workflow engine needs extension work before fan-out/join is trustworthy | High | Treat engine extension or helper-orchestration proof as the biggest implementation risk and keep sequential execution as the fallback until it is validated. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Segment planning should stay linear or near-linear in the size of the inventory so orchestration overhead does not dominate the run.
- Merge and board updates must remain cheap enough to execute after each wave.

### Reliability

- Segment lineage must survive interruption and replay without losing provenance.
- Default single-stream behavior must remain available when wave mode is disabled or inapplicable.
- Merge correctness must be keyed by explicit identifiers and never depend on JSONL append order.

### Maintainability


exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/implementation-summary.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Implementation Summary: Wave Executor [042.003]"
description: "Orchestrator-managed parallel wave execution for deep research and deep review: fan-out/join proof, deterministic segmentation, activation gates, keyed merge, and 97 tests."
trigger_phrases:
  - "042.003"
  - "implementation summary"
  - "wave executor"
  - "segment planner"
  - "coordination board"
importance_tier: "important"
contextType: "planning"
---
# Implementation Summary: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-wave-executor |
| **Completed** | 2026-04-10 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep research and deep review can now handle very large targets through orchestrator-managed parallel wave execution without abandoning the LEAF-worker model. The implementation adds deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the Phase 002 coverage-graph foundation.

### Fan-Out/Join Proof

Workflow fan-out/join capability was proven through helper-module orchestration that safely performs parallel dispatch and join outside the YAML workflow surface. This was the hard prerequisite that blocked all wave-mode runtime work.

### Heuristic Segmentation and Prepass Artifacts

The v1 deterministic heuristic segmentation produces reproducible segment identity and ordering for both review files and research domains. Review targets get `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities. Research targets get `domain-ledger.json` with source domains, authority levels, and cluster assignments. Segment-plan versioning and activation-gate configuration are exposed through strategy and config surfaces.

### Graph-Enhanced Segmentation and Lifecycle

The v2 graph-enhanced segmentation wraps Phase 002 graph signals for per-segment convergence, pruning, and promotion decisions. The shared wave lifecycle manager handles fan-out, join, prune, promote, and merge transitions. The reducer-owned `board.json` tracks conflicts, dedupe, and promoted findings, while the human-facing dashboard stays a derived render and is never directly maintained.

### Activation Gates

Wave mode only activates for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity. Default single-stream deep research and deep review remain completely intact for smaller targets.

### Keyed Merge and Segment Lineage

The JSONL merge contract uses explicit key ordering by `sessionId`, `generation`, `segment`, `wave`, and `findingId` rather than append order. Segment provenance, dedupe, and conflict metadata survive repeated merges. Segment JSONL lineage is deterministic and auditable.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded through 3 sub-phases: fan-out/join prerequisite proof, heuristic segmentation with prepass artifacts, and graph-enhanced segmentation with lifecycle integration. 11 files were touched (9 new), adding approximately 3,300 lines. 97 tests cover planner determinism, lifecycle transitions, keyed merge provenance, resume safety, and default-path regression.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Helper-module orchestration for fan-out/join | The YAML workflow engine has no native parallel dispatch, so orchestration logic lives in CJS helpers |
| Orchestrator-layer parallelism, not LEAF-agent spawning | Workers stay LEAF; orchestration handles segmentation, fan-out, pruning, promotion, and merge |
| Reducer-owned `board.json` with a derived dashboard render | Board is the machine source of truth; the dashboard is a human-readable projection |
| Deterministic keyed merge by explicit identifiers | Append-order dependence would break replay and produce non-deterministic merged outputs |
| Activation gates with explicit large-target thresholds | Prevents wave overhead for small targets where single-stream execution is already optimal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out/join proof via helper-module orchestration | PASS |
| Deterministic v1 segmentation for review and research | PASS (97 tests) |
| Activation gates prevent wave mode for small targets | PASS |
| Keyed merge preserves provenance, dedupe, and conflict metadata | PASS |
| `board.json` is reducer-owned and the dashboard is derived | PASS |
| Default single-stream paths remain intact | PASS |
| Resume and fallback regression tests | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **V2 graph-enhanced segmentation depends on Phase 002 graph readiness.** If graph convergence signals are unavailable, segmentation falls back to v1 heuristic mode.
2. **Wave mode has not been exercised on production-scale targets yet.** Activation thresholds (1000+ files / 50+ domains) are based on design estimates; real production runs will validate them.
<!-- /ANCHOR:limitations -->

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/archive-rvw-2026-04-11/review-report.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Review Report: 042 Deep Research & Review Runtime Improvement Bundle [Closing Audit]"
description: "Synthesis of 10 Codex-driven deep review iterations against the entire 042 bundle. Verdict: CONDITIONAL — 0 P0, 10 P1, 6 P2."
---

# Review Report: 042 Bundle Closing Audit

## 1. Executive Summary

- **Verdict**: CONDITIONAL
- **activeP0**: 0
- **activeP1**: 10
- **activeP2**: 6
- **hasAdvisories**: false
- **Session**: `rvw-2026-04-11T13-50-06Z`
- **Scope**: Entire 042 bundle — `spec.md` plus all 8 phase folders (`001` through `008`) and shipped runtime code across `sk-deep-research`, `sk-deep-review`, `sk-improve-agent`, the `system-spec-kit` coverage-graph stack, 6 YAML workflows, vitest suites, changelog surfaces, and packet-root completion artifacts.
- **Stop reason**: `maxIterationsReached` (`10/10`, planned hard cap)
- **Coverage**: all 4 dimensions reached during the session: correctness, security, traceability, and maintainability
- **Convergence**: `newFindingsRatio` fell from `1.00` to `0.06`; final reducer `convergenceScore` is `0.94`, but legal release readiness remains blocked by 10 active P1 findings

The dominant pattern across the 10 iterations was contract drift, not isolated code polish. The bundle added meaningful reducer, workflow, and test hardening, but several user-visible promises still do not match the live execution path: STOP gating does not consume claim-adjudication state, lifecycle branches are advertised without persisted lineage transitions, and the coverage-graph namespace contract is still weak at both storage and documentation layers.

The second pattern was release-surface optimism outrunning evidence. Phase 008 closeout and packet-root summaries certify completion in places where the live review packet still records required debt, so operators can receive a "finished" signal even though the current closing audit is still CONDITIONAL.

## 2. Planning Trigger

CONDITIONAL routes to `/spec_kit:plan` for remediation before the 042 bundle can be treated as PASS. The next packet should preserve this closing audit as the baseline, open with the active P1 registry below, and sequence the remediation lanes in implementation dependency order so runtime and persistence fixes land before documentation and packet-root closeout updates.

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Origin | Key evidence | First seen | Last seen | Status |
|---|---|---|---|---|---|---:|---:|---|
| F001 | P1 | correctness | Canonical deep-review agent still emits an unparseable iteration schema | `I001` (`iteration-001.md:18`) | `.opencode/agent/deep-review.md:147`; `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:137-206` | 1 | 1 | active |
| F002 | P1 | correctness | Claim-adjudication is documented as a hard stop gate but never participates in STOP eligibility | `I001` (`iteration-001.md:19`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:574`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:388-429` | 1 | 1 | active |
| F003 | P2 | correctness | Review config JSONL collapses requested dimensions into one string element | `I001` (`iteration-001.md:22`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:259` | 1 | 1 | active |
| F004 | P1 | security | Coverage-graph writes are not session-isolated when IDs collide | `I002` (`iteration-002.md:19`) | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` | 2 | 2 | active |
| F005 | P2 | security | Session-isolation regression omits the ID-collision path | `I002` (`iteration-002.md:22`) | `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376` | 2 | 2 | active |
| F006 | P1 | security | Graph-event namespace contract is still undocumented on the visible path | `I003` (`iteration-003.md:19`) | `.opencode/skill/sk-deep-research/references/state_format.md:145`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:658-665` | 3 | 3 | active |
| F007 | P1 | traceability | Claim-adjudication state format still documents a prose block instead of the typed packet the workflow enforces | `I004` (`iteration-004.md:18`) | `.opencode/skill/sk-deep-review/references/state_format.md:621`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:619-628` | 4 | 4 | active |
| F008 | P1 | traceability | Deep-review quick reference teaches the wrong weighted convergence signal set | `I004` (`iteration-004.md:19`) | `.opencode/skill/sk-deep-review/references/quick_reference.md:145`; `.opencode/skill/sk-deep-review/references/convergence.md:165-171` | 4 | 4 | active |
| F009 | P2 | traceability | Convergence reference still describes a persisted `legalStop` synthesis payload the shipped JSONL schema does not write | `I004` (`iteration-004.md:22`) | `.opencode/skill/sk-deep-review/references/convergence.md:44`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:896` | 4 | 4 | active |
| F010 | P1 | correctness | Resume/restart/fork/completed-continue are exposed as live lifecycle branches without any matching lineage write path | `I005` (`iteration-005.md:19`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:143-146` | 5 | 5 | active |
| F011 | P2 | traceability | Resume-event examples remain skeletal even where the visible state contract expects lineage metadata | `I005` (`iteration-005.md:22`) | `.opencode/skill/sk-deep-research/references/loop_protocol.md:83`; `.opencode/skill/sk-deep-review/references/state_format.md:240-243` | 5 | 5 | active |
| F012 | P1 | correctness | Improve-agent docs promise resumable lineage modes that the shipped workflow cannot execute or surface | `I006` (`iteration-006.md:19`) | `.opencode/skill/sk-improve-agent/SKILL.md:292`; `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:36-42` | 6 | 6 | active |
| F013 | P2 | traceability | Phase 008 implementation summary overclaims REQ-024 closure | `I008` (`iteration-008.md:19`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:59`; `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:61-91` | 8 | 8 | active |
| F014 | P1 | traceability | Phase 008 closeout claims full requirement closure while open review P1s remain | `I009` (`iteration-009.md:19`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:157`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-dashboard.md:35` | 9 | 9 | active |
| F015 | P2 | traceability | Reducer-owned `ACTIVE RISKS` summary hides non-P0 release-readiness debt | `I009` (`iteration-009.md:22`) | `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:832`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-dashboard.md:100` | 9 | 9 | active |
| F016 | P1 | traceability | Root packet completion surfaces still certify an obsolete four-phase "implemented" state | `I010` (`iteration-010.md:18`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md:60`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md:95`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:98`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:23` | 10 | 10 | active |

### Finding Digests

#### F001
- **Risk**: a canonical reviewer following `.opencode/agent/deep-review.md` can produce markdown the reducer does not parse, which drops real findings out of the registry and dashboard.
- **Carry-forward note**: fix the authoritative authoring contract before relying on any parser-driven closeout automation.

#### F002
- **Risk**: claim-adjudication failure is recorded but not consumed by the legal-stop tree, so synthesis can happen even when the required adjudication packet is invalid or absent.
- **Carry-forward note**: this is the highest-priority loop-control gap because it affects release gating directly.

#### F003
- **Risk**: the persisted config row serializes `reviewDimensions` as one string element, which weakens replay quality and future schema migrations.
- **Carry-forward note**: keep it coupled to F001 so the emitted state contract is fixed together with the authoring contract.

#### F004
- **Risk**: the coverage graph still mutates rows by bare ID, so two sessions reusing the same node or edge ID can overwrite each other.
- **Carry-forward note**: this is the core session-isolation defect; the other graph findings are downstream evidence, tests, and docs.

#### F005
- **Risk**: the current regression suite proves filtered reads on disjoint fixtures, not isolation under shared-ID collision.
- **Carry-forward note**: keep this behind F004 so the test is updated against the repaired storage contract rather than the current broken behavior.

#### F006
- **Risk**: visible review and research references do not tell operators how graph-event IDs must remain namespaced or unique per session.
- **Carry-forward note**: land after F004 so the documentation reflects the repaired runtime, not the old bare-ID behavior.

#### F007
- **Risk**: reviewers are told to write prose claim-adjudication blocks even though the confirm workflow now requires typed packet fields.
- **Carry-forward note**: pair with F002 because runtime gating and the visible packet contract must close together.

#### F008
- **Risk**: the quick reference teaches the wrong weighted convergence vote, which points operators at the wrong tuning levers during manual audits.
- **Carry-forward note**: repair alongside F009 so the quick reference, convergence reference, and persisted JSONL contract align.

#### F009
- **Risk**: `convergence.md` still shows a persisted `legalStop` synthesis payload that the JSONL schema no longer writes.
- **Carry-forward note**: keep this in the documentation lane unless the remediation packet decides to restore `legalStop` persistence instead.

#### F010
- **Risk**: review and research workflows advertise resume/restart/fork/completed-continue branches but only initialize `new` lineage metadata and never emit transition events.
- **Carry-forward note**: this is the lifecycle runtime defect; fix it before touching example rows or packet closeout claims.

#### F011
- **Risk**: even if F010 is fixed later, the visible resume examples are still under-specified and omit lineage metadata fields operators are told to expect.
- **Carry-forward note**: close in the same packet as F010, after the real lifecycle event payload is settled.

#### F012
- **Risk**: `sk-improve-agent` promises resumable lineage modes without any workflow inputs, runtime branches, or reducer ancestry output to support them.
- **Carry-forward note**: the remediation packet must choose between shipping the lifecycle feature or shrinking the claim surface.

#### F013
- **Risk**: phase 008 implementation summary claims REQ-024 is fully closed even though the cited test still misses collision behavior.
- **Carry-forward note**: do not fix this summary until F004/F005 are resolved or explicitly descoped.

#### F014
- **Risk**: phase 008 closeout says all 25 requirements are closed while the live review packet still carries required debt.
- **Carry-forward note**: this should only move once the runtime/doc fixes are either landed or reclassified.

#### F015
- **Risk**: the reducer-generated dashboard hides active release-readiness debt whenever there is no P0, which makes quick scans deceptively calm.
- **Carry-forward note**: land with root closeout reconciliation so the dashboard and packet summaries tell the same truth.

#### F016
- **Risk**: the packet root still presents 042 as a completed four-phase bundle even though phases 005-008 and the live review ledger are not absorbed there.
- **Carry-forward note**: treat this as the final closure lane because it depends on the outcome of every earlier remediation decision.

## 4. Remediation Workstreams

### Lane 1: Claim-Adjudication Stop Gate Wiring

- **Findings**: F002, F007
- **Why first**: the loop can currently synthesize after a failed claim-adjudication packet, so the closing audit cannot trust required-stop behavior until this lane is fixed.
- **Target surfaces**: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`, `.opencode/skill/sk-deep-review/references/state_format.md`, `.opencode/skill/sk-deep-review/references/loop_protocol.md`
- **Required decision**: either wire `claim_adjudication_passed` into the legal-stop gate or explicitly downgrade the documentation so claim adjudication is no longer described as STOP-blocking.
- **Exit condition**: a failed or missing typed adjudication packet demonstrably blocks STOP and the operator-facing schema shows the exact typed fields the workflow enforces.
- **Validation proof**: add or extend static contract tests around STOP gating and packet schema parity, then re-run the targeted parity suite.

### Lane 2: Coverage-Graph Session Isolation

- **Findings**: F004, F005, F006, F013
- **Why second**: this is the only active security lane, and every release-facing REQ-024 claim depends on the storage contract actually being session-safe under collision.
- **Target surfaces**: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`, `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-review/references/state_format.md`, phase 008 closeout docs
- **Required decision**: choose a stable storage namespace model such as composite primary keys or deterministic session-qualified IDs; then document that model on the visible graph-event contract.
- **Exit condition**: shared-ID collisions no longer overwrite prior session rows, the isolation test fails on the pre-fix path and passes on the repaired path, and REQ-024 closeout language cites the repaired test coverage honestly.
- **Validation proof**: targeted vitest for collision reuse plus any DB-level migration or query proof the packet introduces.

### Lane 3: Lifecycle Persistence Across Review, Research, and Improve-Agent

- **Findings**: F010, F011, F012
- **Why third**: lineage branches are currently advertised but not persisted, and the packet should decide once whether it is implementing those branches or retracting them.
- **Target surfaces**: `spec_kit_deep-review_confirm.yaml`, `spec_kit_deep-research_confirm.yaml`, `sk-deep-review` and `sk-deep-research` references, `sk-improve-agent` skill/command/workflow/reducer surfaces
- **Required decision**: either implement `resume` / `restart` / `fork` / `completed-continue` as real runtime branches with event emission and ancestry metadata or narrow every user-facing promise to match the current one-session model.
- **Exit condition**: review, research, and improve-agent all tell the same lifecycle story and produce auditable lineage metadata consistent with their visible contract.
- **Validation proof**: contract-parity checks plus reducer/state-log assertions for the chosen lineage model.

### Lane 4: Canonical Documentation and State Contract Cleanup

- **Findings**: F001, F003, F008, F009
- **Why fourth**: these are still serious, but they are safer to repair after the runtime and lifecycle decisions stop moving.
- **Target surfaces**: `.opencode/agent/deep-review.md`, `sk-deep-review` references, the deep-review config JSONL writer in both workflow mirrors
- **Required decision**: pick one canonical iteration schema and one canonical persisted stop schema, then make every example and writer match it.
- **Exit condition**: the canonical agent, workflow outputs, quick reference, convergence reference, and state-format reference all describe the same parser-accepted structures.
- **Validation proof**: reducer-parity tests and a sample iteration file that round-trips into the registry without manual fixes.

### Lane 5: Packet Root Release-Readiness Reconciliation

- **Findings**: F014, F015, F016
- **Why last**: packet closeout surfaces should only be rewritten after the runtime, state, and documentation decisions are resolved.
- **Target surfaces**: phase 008 `implementation-summary.md`, packet-root `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and the reducer-owned `ACTIVE RISKS` branch
- **Required decision**: either hold the packet in an explicitly conditional state until follow-up work lands or rewrite the closeout surfaces to describe the remaining debt accurately.
- **Exit condition**: packet root and dashboard no longer imply release-ready completion while active required findings remain.
- **Validation proof**: strict packet validation plus a fresh closing review snapshot that matches the packet-root summary.

### Workstream Dependency Notes

- Lane 1 unlocks trustworthy stop semantics; until it lands, any later PASS-style synthesis is still suspect.
- Lane 2 is the only security lane and should not be deferred behind documentation cleanup.
- Lane 3 depends on a product decision as much as implementation effort: ship lineage branches for real, or retract them everywhere.
- Lane 4 should be treated as canonical-surface cleanup after runtime truth is stable; otherwise the docs may be rewritten twice.
- Lane 5 is a release-management lane, not a discovery lane. It should consume the outputs of the first four lanes rather than run in parallel with them.
- F001 and F003 are best handled together because the canonical authoring schema and persisted config schema are the same operator contract from two directions.
- F004, F005, F006, and F013 should stay in one packet because each later finding only makes sense once the storage-layer identity story is fixed.
- F010, F011, and F012 should share one owner if possible so review, research, and improve-agent do not diverge again during remediation.
- F014, F015, and F016 should be revalidated with a fresh dashboard snapshot after edits; static prose updates alone are not enough.
- If the follow-up packet needs to split, split between runtime/state fixes (lanes 1-3) and release-surface reconciliation (lanes 4-5), not inside a lane.

## 5. Spec Seed

1. **REQ-026 [correctness] Claim adjudication must participate in legal STOP eligibility.**
The deep-review runtime must treat a failed or missing typed claim-adjudication packet as a STOP veto until remediation or downgrade logic explicitly clears it. Applies to `spec_kit_deep-review_auto.yaml` and its operator-facing confirm mirror.

2. **REQ-027 [traceability] Claim-adjudication packet schema must be canonical on the visible path.**
`state_format.md`, `loop_protocol.md`, and confirm/runtime validation must name the same machine-readable fields for adjudicating P0/P1 findings.

3. **REQ-028 [security] Coverage-graph storage identity must be session-isolated under shared IDs.**
Coverage-graph writes must preserve `specFolder + loopType + sessionId + id` isolation semantics even when multiple sessions reuse the same node or edge ID.

4. **REQ-029 [traceability] Graph-event namespace rules must be documented and regression-tested.**
Review and research state-format references must define `graphEvents` payload shape, namespace expectations, and the collision regression that proves the contract.

5. **REQ-030 [correctness] Lifecycle branches must either persist lineage transitions or be removed from exposed runtime choices.**
Review, research, and improve-agent may not advertise `resume`, `restart`, `fork`, or `completed-continue` unless those branches write auditable ancestry metadata.

6. **REQ-031 [traceability] Lifecycle examples must include the full persisted event contract.**
If lifecycle branches remain supported, all resume/restart/fork/completed-continue examples must carry the same metadata fields the JSONL/state-format contract requires.

7. **REQ-032 [correctness] Canonical review iteration output must match reducer parsing and config persistence.**
The deep-review agent schema and both config writers must emit structures that the shipped reducer accepts without hand normalization.

8. **REQ-033 [traceability] Convergence and stop-contract references must match persisted JSONL reality.**
Quick references and convergence docs must describe the same weighted signals, blocked-stop schema, and synthesis payload shape the runtime actually writes.

9. **REQ-034 [traceability] Release-readiness surfaces must not certify PASS while required review debt remains.**
Phase closeout summaries, packet-root completion artifacts, and reducer-owned dashboard risk summaries must reflect active P1/P2 debt until a fresh PASS review exists.

## 6. Plan Seed

1. **T001 [correctness] Wire claim-adjudication into the deep-review legal-stop tree**  
Target files: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`  
Findings: F002  
REQ: REQ-026

2. **T002 [traceability] Replace prose claim-adjudication examples with the typed packet contract**  
Target files: `.opencode/skill/sk-deep-review/references/state_format.md`, `.opencode/skill/sk-deep-review/references/loop_protocol.md`  
Findings: F007  
REQ: REQ-027

3. **T003 [security] Change coverage-graph upsert identity to a session-safe namespace**  
Target files: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`, related query helpers if needed  
Findings: F004  
REQ: REQ-028

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs .opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-004.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     436 .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
     623 .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs
     315 .opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs
     455 .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
     410 .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs
    5777 .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-004.md
    8016 total

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-004.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
iteration: 4
dimension: maintainability
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:48:47Z
completedAt: 2026-04-12T09:53:22Z
---

# Deep Review Iteration 004 — maintainability

**Focus:** Phase 001-002 code structure: review 4 CJS shared libraries in .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs for module boundaries, error handling, function complexity, and export surface area. Check vitest coverage in scripts/tests/coverage-graph-*.vitest.ts files.

---

Reading additional input from stdin...
OpenAI Codex v0.120.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d8118-00dc-7443-8d7f-6f028931c82b
--------
user
You are a senior code reviewer executing iteration 4 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: maintainability
FOCUS: Phase 001-002 code structure: review 4 CJS shared libraries in .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs for module boundaries, error handling, function complexity, and export surface area. Check vitest coverage in scripts/tests/coverage-graph-*.vitest.ts files.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for maintainability issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-004-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: maintainability
   - File: exact file path
   - Line: line number(s) if applicable
   - Title: brief descriptive title
   - Description: detailed explanation of the issue
   - Evidence: relevant code snippet or reference
   - Recommendation: specific fix or improvement

4. After listing all findings, provide:
   - ITERATION SUMMARY: total findings, breakdown by severity
   - COVERAGE ASSESSMENT: what percentage of the focus area was reviewed
   - CONFIDENCE: your confidence in the completeness of this iteration (low/medium/high)
   - NEXT PRIORITIES: what should the next iteration examine that you could not cover

Be thorough and precise. Cite exact file paths and line numbers. Do not report findings that require subjective style preferences — focus on functional correctness, security, traceability, and maintainability risks.

Prior session context: A previous 10-iteration review (rvw-2026-04-11T13-50-06Z) found 16 findings (0 P0 / 10 P1 / 6 P2) with CONDITIONAL verdict. That review led to a 5-lane remediation (REQ-026 through REQ-034). This session validates the remediation AND examines areas not previously covered.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-review pass focused on the four `coverage-graph-*.cjs` shared libraries and their Vitest coverage. I’ll load the relevant review guidance and prior context first, then inspect the implementation and tests closely for maintainability risks with exact file and line evidence.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "deep review maintainability review of .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-*.cjs and scripts/tests/coverage-graph-*.vitest.ts" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 457ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-IKzw201K' (errno=Operation not permitted)
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, folder"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), opencode, review(name)"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), deep(name), opencode~, review(name)"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !opencode, opencode(name), system"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
    "confidence": 0.82,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, kit(name), plan~, spec(name), specification~"
  }
]

codex
Skill routing points strongly to `sk-code-review` and `sk-deep-review`, so I’m using those review standards for this pass. I’m also doing a quick memory lookup for prior packet context, then I’ll read the target libraries and their tests line-by-line before drafting findings.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code-opencode, sk-code-web, and sk-code-full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code-review` and paired with one `sk-code-*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
- A workflow dispatches `@review` for pre-commit or gate validation.
- A user requests security/correctness risk analysis before merge.
- A user wants severity-ranked findings with file:line evidence.

### Keyword Triggers

`review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `request changes`, `findings`, `blocking issues`, `merge readiness`

### Use Cases

1. Review-only pass: findings-first output with no code edits.
2. Gate validation: score + pass/fail recommendation for orchestrated workflows.
3. Focused risk pass: security, concurrency, correctness, or removal-focused review.

### When NOT to Use

- Feature implementation without review intent.
- Pure documentation editing where code behavior is not being assessed.
- Git-only workflow tasks (branching, rebasing, commit hygiene) without code-quality evaluation intent.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Primary Detection Signal

Review behavior follows a baseline+overlay model:

- Baseline (always): `sk-code` (implemented by this skill: `sk-code-review`)
- Overlay (exactly one `sk-code-*`):
  - OpenCode system context -> `sk-code-opencode`
  - Frontend/web context -> `sk-code-web`
  - Default/other stacks -> `sk-code-full-stack`

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect `sk-code` baseline + one `sk-code-*` overlay
    +- STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
    +- Phase 1: Scope and baseline checks
    +- Phase 2: Overlay alignment
    +- Phase 3: Findings-first analysis
    +- Phase 4: Output contract and next action
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies weighted intent scoring.

Knowledge is organized by domain mapping:

```text
references/review_core.md
references/review_ux_single_pass.md
references/*_checklist.md
assets/review/...
```

- `references/review_core.md` for shared doctrine consumed by both `@review` and `@deep-review`.
- `references/review_ux_single_pass.md` for interactive single-pass review behavior.
- `references/` for baseline review flow, severity contracts, and risk checklists.
- `assets/` for optional reusable templates/checklists (if present in this skill).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation | `references/review_core.md`, `references/review_ux_single_pass.md`, `references/security_checklist.md`, `references/code_quality_checklist.md` |
| CONDITIONAL | Intent score indicates need | `references/solid_checklist.md`, `references/code_quality_checklist.md`, `references/removal_plan.md`, `references/test_quality_checklist.md` |
| ON_DEMAND | Explicit deep-dive request | Full mapped reference set |

### Precedence Matrix

| Rule Type | Source of Truth | Behavior |
| --- | --- | --- |
| Security/correctness minimums | `sk-code` baseline (`sk-code-review`) | Always enforced; never relaxed by overlay |

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
iteration: 3
dimension: traceability
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:43:05Z
completedAt: 2026-04-12T09:48:47Z
---

# Deep Review Iteration 003 — traceability

**Focus:** Phase 001-002 spec-code alignment: verify .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md claims match the actual reduce-state.cjs and runtime-capabilities.cjs implementations. Cross-check references/ docs (state_format.md, loop_protocol.md, convergence.md) for both sk-deep-research and sk-deep-review.

---

Reading additional input from stdin...
OpenAI Codex v0.120.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d8112-c910-70a3-97fe-f3a74dc58d23
--------
user
You are a senior code reviewer executing iteration 3 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: traceability
FOCUS: Phase 001-002 spec-code alignment: verify .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md claims match the actual reduce-state.cjs and runtime-capabilities.cjs implementations. Cross-check references/ docs (state_format.md, loop_protocol.md, convergence.md) for both sk-deep-research and sk-deep-review.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for traceability issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-003-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: traceability
   - File: exact file path
   - Line: line number(s) if applicable
   - Title: brief descriptive title
   - Description: detailed explanation of the issue
   - Evidence: relevant code snippet or reference
   - Recommendation: specific fix or improvement

4. After listing all findings, provide:
   - ITERATION SUMMARY: total findings, breakdown by severity
   - COVERAGE ASSESSMENT: what percentage of the focus area was reviewed
   - CONFIDENCE: your confidence in the completeness of this iteration (low/medium/high)
   - NEXT PRIORITIES: what should the next iteration examine that you could not cover

Be thorough and precise. Cite exact file paths and line numbers. Do not report findings that require subjective style preferences — focus on functional correctness, security, traceability, and maintainability risks.

Prior session context: A previous 10-iteration review (rvw-2026-04-11T13-50-06Z) found 16 findings (0 P0 / 10 P1 / 6 P2) with CONDITIONAL verdict. That review led to a 5-lane remediation (REQ-026 through REQ-034). This session validates the remediation AND examines areas not previously covered.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep review pass focused on traceability in Phase 001-002. I’ll start by loading any relevant project memory and routing guidance, then I’ll read the spec, runtime files, and referenced docs closely before I assess findings.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|runtime truth|reduce-state|runtime-capabilities|traceability|sk-deep-review|sk-deep-research" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
111:- 003-modus-memory-main, dont ask for spec folder, auto mode, validate.sh --strict, research/iterations/iteration-NNN.md, reduce-state.cjs, deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, max 6 agent threads
153:- safe continuation sequence: validate packet shape first, repair missing Level 3 docs if needed, preserve existing synthesis/legacy transcripts, extend iterations, run `reduce-state.cjs`, then sync packet docs and rerun strict validation [Task 2][Task 3][Task 5]
276:- packet 002 status/traceability must reflect real downstream readiness; once the 010 validator exists, document 002 as “Implemented — predecessor verified” instead of blocked to avoid traceability P1 findings [Task 1]
280:- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
558:- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093
636:- deep-research extension runbook: align `maxIterations` in config/state/strategy first, keep lineage/execution mode unchanged, run reducer after each iteration (`node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`), then refresh synthesis/registry/dashboard artifacts [Task 2]
896:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
904:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
906:## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success
914:- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md
916:## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success
1916:# Task Group: Documentation Enforcement Wiring and sk-deep-research Playbook Packaging
1930:## Task 2: Build sk-deep-research manual testing playbook (index + per-feature snippets)

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Deep review iteration 3 for spec folder 042-sk-deep-research-review-improvement-2 traceability focus on 001-runtime-truth-foundation spec.md vs reduce-state.cjs runtime-capabilities.cjs and referenced docs state_format.md loop_protocol.md convergence.md for sk-deep-research and sk-deep-review" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 421ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-2VwJ4svQ' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), !sk-deep-review(explicit), convergence, deep(name), iteration"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !convergence, !sk-deep-research(explicit), convergence, deep(name), iteration"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !folder, !spec, documentation, document~, folder"
  },
  {
    "skill": "command-create-folder-readme",
    "kind": "command",
    "confidence": 0.89,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create(name), documentation, document~, folder(name)"
  }
]

codex
I’ve got the routing signal: `sk-deep-review` is the right review workflow here, with the earlier memory index pointing at prior remediation work around `reduce-state.cjs` and `runtime-capabilities.cjs`. Next I’m locating the exact spec and doc surfaces, then I’ll compare their claims against the live runtime code line by line.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '900,920p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- rollout_summaries/2026-04-03T06-52-50-dog7-deep_research_90_iter_external_wave.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T08-52-50-019d521d-afbc-7da0-817d-675090a19d1f.jsonl, updated_at=2026-04-03T08:23:39+00:00, thread_id=019d521d-afbc-7da0-817d-675090a19d1f)

### keywords

- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave

## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T08-52-11-1f0W-deep_research_phase1_100pct.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-52-11-019d528a-f2bc-7053-9269-e85eded82c3e.jsonl, updated_at=2026-04-03T09:49:06+00:00, thread_id=019d528a-f2bc-7053-9269-e85eded82c3e)

### keywords

- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md

## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-53-06-019d528b-cc68-77b3-9b4d-8b5dc37b791e.jsonl, updated_at=2026-04-03T09:42:20+00:00, thread_id=019d528b-cc68-77b3-9b4d-8b5dc37b791e)

 succeeded in 0ms:
---
name: sk-deep-review
description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search]
# Note: Task tool is for the command executor (loop management). The @deep-review agent itself does NOT have Task (LEAF-only).
# No WebFetch: review is code-only and read-only. No external resource fetching.
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.3.1.0
---

<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code-review` instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code-opencode` or `/spec_kit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   261	          // Keep higher severity
   262	          if (compareSeverity(finding.severity, existing.severity) > 0) {
   263	            conflicts.push({
   264	              findingId: key,
   265	              kept: finding,
   266	              replaced: existing,
   267	              reason: 'priority-upgrade',
   268	            });
   269	            findingMap.set(key, {
   270	              ...finding,
   271	              mergedFrom: result.segmentId || 'unknown',
   272	              mergeState: 'promoted',
   273	              priorSegment: existing.mergedFrom,
   274	            });
   275	          } else {
   276	            conflicts.push({
   277	              findingId: key,
   278	              kept: existing,
   279	              replaced: finding,
   280	              reason: 'priority-kept',
   281	            });
   282	          }
   283	        } else {
   284	          // DEDUPE: keep first occurrence, record conflict
   285	          conflicts.push({
   286	            findingId: key,
   287	            kept: existing,
   288	            duplicate: finding,
   289	            duplicateSegment: result.segmentId || 'unknown',
   290	            reason: 'dedupe',
   291	          });
   292	        }
   293	      } else {
   294	        findingMap.set(key, {
   295	          ...finding,
   296	          mergedFrom: result.segmentId || 'unknown',
   297	          mergeState: 'original',
   298	        });
   299	      }
   300	    }
   301	  }
   302	
   303	  const merged = Array.from(findingMap.values());
   304	
   305	  return {
   306	    merged,
   307	    conflicts,
   308	    stats: {
   309	      totalInput: results.reduce((sum, r) => sum + ((r && r.findings) ? r.findings.length : 0), 0),
   310	      totalMerged: merged.length,
   311	      totalConflicts: conflicts.length,
   312	      mergeStrategy: strategy,
   313	    },
   314	  };
   315	}
   316	
   317	/* ---------------------------------------------------------------
   318	   6. LIFECYCLE TRANSITIONS
   319	----------------------------------------------------------------*/
   320	
   321	/**
   322	 * Advance the wave context to the next lifecycle phase.
   323	 *
   324	 * @param {object} waveContext - The wave context object
   325	 * @param {string} targetPhase - The phase to transition to
   326	 * @returns {{ success: boolean, previousPhase: string, currentPhase: string, error?: string }}
   327	 */
   328	function advancePhase(waveContext, targetPhase) {
   329	  if (!waveContext || typeof waveContext !== 'object') {
   330	    return { success: false, previousPhase: 'unknown', currentPhase: 'unknown', error: 'Invalid wave context' };
   331	  }
   332	
   333	  const currentIndex = LIFECYCLE_PHASES.indexOf(waveContext.phase);
   334	  const targetIndex = LIFECYCLE_PHASES.indexOf(targetPhase);
   335	
   336	  if (targetIndex < 0) {
   337	    return {
   338	      success: false,
   339	      previousPhase: waveContext.phase,
   340	      currentPhase: waveContext.phase,
   341	      error: `Invalid target phase: ${targetPhase}`,
   342	    };
   343	  }
   344	
   345	  // Allow forward transitions only (no backward jumps)
   346	  if (targetIndex <= currentIndex) {
   347	    return {
   348	      success: false,
   349	      previousPhase: waveContext.phase,
   350	      currentPhase: waveContext.phase,
   351	      error: `Cannot transition backward from "${waveContext.phase}" to "${targetPhase}"`,
   352	    };
   353	  }
   354	
   355	  const previousPhase = waveContext.phase;
   356	  waveContext.phase = targetPhase;
   357	  waveContext.updatedAt = new Date().toISOString();
   358	
   359	  return {
   360	    success: true,
   361	    previousPhase,
   362	    currentPhase: targetPhase,
   363	  };
   364	}
   365	
   366	/**
   367	 * Check whether all segments in a wave have completed (or been pruned/failed).
   368	 *
   369	 * @param {Array<object>} dispatches - Dispatch records from dispatchWave
   370	 * @returns {boolean}
   371	 */
   372	function isWaveComplete(dispatches) {
   373	  if (!Array.isArray(dispatches) || dispatches.length === 0) return true;
   374	
   375	  const terminalStatuses = new Set(['completed', 'converged', 'pruned', 'failed']);
   376	  return dispatches.every(d => terminalStatuses.has(d.status));
   377	}
   378	
   379	/* ---------------------------------------------------------------
   380	   7. HELPERS
   381	----------------------------------------------------------------*/
   382	
   383	/**
   384	 * Build a deterministic finding key from its identifying fields.
   385	 * Keys by findingId if present, otherwise by file:line + title.
   386	 *
   387	 * @param {object} finding
   388	 * @returns {string}
   389	 */
   390	function buildFindingKey(finding) {
   391	  if (!finding) return 'unknown';
   392	  if (finding.findingId) return finding.findingId;
   393	
   394	  const file = finding.file || finding.filePath || '';
   395	  const line = finding.line || finding.lineNumber || 0;
   396	  const title = finding.title || finding.summary || '';
   397	  return `${file}:${line}::${title}`.toLowerCase().replace(/\s+/g, '_');
   398	}
   399	
   400	/**
   401	 * Compare two severity values. Returns >0 if a is higher severity.
   402	 * P0 > P1 > P2.
   403	 *
   404	 * @param {string} a
   405	 * @param {string} b
   406	 * @returns {number}
   407	 */
   408	function compareSeverity(a, b) {
   409	  const order = { P0: 3, P1: 2, P2: 1 };
   410	  return (order[a] || 0) - (order[b] || 0);
   411	}
   412	
   413	/* ---------------------------------------------------------------
   414	   8. EXPORTS
   415	----------------------------------------------------------------*/
   416	
   417	module.exports = {
   418	  // Constants
   419	  LIFECYCLE_PHASES,
   420	  SEGMENT_STATUSES,
   421	  MAX_PARALLEL_SEGMENTS,
   422	  MERGE_STRATEGIES,
   423	  // Fan-out/join proof
   424	  canFanOut,
   425	  // Wave context
   426	  createWaveContext,
   427	  // Fan-out/join
   428	  dispatchWave,
   429	  joinWave,
   430	  // Lifecycle
   431	  advancePhase,
   432	  isWaveComplete,
   433	  // Helpers
   434	  buildFindingKey,
   435	  compareSeverity,
   436	};

 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Wave Lifecycle (T-WE-NEW-1, T004)
     5	// ---------------------------------------------------------------
     6	// Orchestrator lifecycle helpers for fan-out, join, prune, promote,
     7	// merge, and resume state transitions. Parallelism lives at the
     8	// orchestrator layer; LEAF agents remain non-spawning workers.
     9	//
    10	// Fan-out/join is implemented as helper-module orchestration that
    11	// safely performs parallel dispatch outside the YAML surface. The
    12	// YAML workflow engine delegates to these helpers rather than
    13	// requiring native parallel-step support.
    14	// ---------------------------------------------------------------
    15	
    16	/* ---------------------------------------------------------------
    17	   1. CONSTANTS
    18	----------------------------------------------------------------*/
    19	
    20	/**
    21	 * Valid wave lifecycle phases in execution order.
    22	 * @type {ReadonlyArray<string>}
    23	 */
    24	const LIFECYCLE_PHASES = Object.freeze([
    25	  'prepass',
    26	  'plan',
    27	  'fan-out',
    28	  'prune',
    29	  'promote',
    30	  'join',
    31	  'merge',
    32	]);
    33	
    34	/**
    35	 * Valid segment statuses.
    36	 * @type {ReadonlyArray<string>}
    37	 */
    38	const SEGMENT_STATUSES = Object.freeze([
    39	  'pending',
    40	  'dispatched',
    41	  'running',
    42	  'converged',
    43	  'pruned',
    44	  'failed',
    45	  'completed',
    46	]);
    47	
    48	/**
    49	 * Maximum number of parallel segments per wave.
    50	 * @type {number}
    51	 */
    52	const MAX_PARALLEL_SEGMENTS = 8;
    53	
    54	/**
    55	 * Check whether a value is a non-empty string.
    56	 * @param {unknown} value
    57	 * @returns {boolean}
    58	 */
    59	function isNonEmptyString(value) {
    60	  return typeof value === 'string' && value.trim().length > 0;
    61	}
    62	
    63	/* ---------------------------------------------------------------
    64	   2. FAN-OUT/JOIN PROOF
    65	----------------------------------------------------------------*/
    66	
    67	/**
    68	 * Check if the current workflow supports parallel dispatch.
    69	 * Returns a proof object describing the orchestration path.
    70	 *
    71	 * This is the canonical proof that wave execution has a viable
    72	 * parallel dispatch mechanism before any wave-mode runtime build.
    73	 *
    74	 * @param {object} workflowEngine - Description of the workflow engine capabilities
    75	 * @param {boolean} [workflowEngine.hasNativeParallel] - Whether engine supports parallel steps natively
    76	 * @param {boolean} [workflowEngine.hasHelperOrchestration] - Whether helper-module orchestration is available
    77	 * @returns {{ canFanOut: boolean, method: string, proof: string, maxParallel: number }}
    78	 */
    79	function canFanOut(workflowEngine) {
    80	  if (!workflowEngine || typeof workflowEngine !== 'object') {
    81	    return {
    82	      canFanOut: false,
    83	      method: 'none',
    84	      proof: 'No workflow engine provided',
    85	      maxParallel: 0,
    86	    };
    87	  }
    88	
    89	  // Prefer helper-module orchestration (proven path for current YAML engine)
    90	  if (workflowEngine.hasHelperOrchestration) {
    91	    return {
    92	      canFanOut: true,
    93	      method: 'helper-module',
    94	      proof: 'Helper-module orchestration wraps YAML engine for safe fan-out/join',
    95	      maxParallel: MAX_PARALLEL_SEGMENTS,
    96	    };
    97	  }
    98	
    99	  // Native parallel dispatch (future engine extension)
   100	  if (workflowEngine.hasNativeParallel) {
   101	    return {
   102	      canFanOut: true,
   103	      method: 'native',
   104	      proof: 'YAML engine supports native parallel step dispatch',
   105	      maxParallel: MAX_PARALLEL_SEGMENTS,
   106	    };
   107	  }
   108	
   109	  return {
   110	    canFanOut: false,
   111	    method: 'none',
   112	    proof: 'Neither helper orchestration nor native parallel dispatch available',
   113	    maxParallel: 0,
   114	  };
   115	}
   116	
   117	/* ---------------------------------------------------------------
   118	   3. WAVE CONTEXT
   119	----------------------------------------------------------------*/
   120	
   121	/**
   122	 * Create a wave execution context for tracking lifecycle state.
   123	 *
   124	 * @param {string} target - The review/research target identifier
   125	 * @param {'review'|'research'} loopType - Type of deep loop
   126	 * @param {object} [options] - Additional configuration
   127	 * @param {string} [options.sessionId] - Session identifier (auto-generated if absent)
   128	 * @param {number} [options.generation] - Generation counter (default: 1)
   129	 * @returns {object} Wave context object
   130	 */
   131	function createWaveContext(target, loopType, options) {
   132	  if (!isNonEmptyString(target)) return null;
   133	  if (loopType !== 'review' && loopType !== 'research') {
   134	    return null;
   135	  }
   136	
   137	  const opts = options || {};
   138	  const now = new Date().toISOString();
   139	
   140	  return {
   141	    target,
   142	    loopType,
   143	    sessionId: opts.sessionId || `wave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
   144	    generation: typeof opts.generation === 'number' ? opts.generation : 1,
   145	    phase: 'prepass',
   146	    createdAt: now,
   147	    updatedAt: now,
   148	    segments: [],
   149	    waves: [],
   150	    currentWave: null,
   151	    mergedResults: [],
   152	    status: 'initialized',
   153	  };
   154	}
   155	
   156	/* ---------------------------------------------------------------
   157	   4. FAN-OUT
   158	----------------------------------------------------------------*/
   159	
   160	/**
   161	 * Dispatch a wave of segments for parallel execution.
   162	 * Each segment becomes an independent worker dispatch.
   163	 *
   164	 * @param {Array<object>} segments - Segment descriptors from the planner
   165	 * @param {object} config - Wave dispatch configuration
   166	 * @param {string} config.sessionId - Session identifier
   167	 * @param {number} config.generation - Generation counter
   168	 * @param {number} config.waveNumber - Current wave number (1-based)
   169	 * @param {number} [config.maxParallel] - Maximum parallel dispatches
   170	 * @returns {{ waveId: string, dispatches: Array<object>, timestamp: string }}
   171	 */
   172	function dispatchWave(segments, config) {
   173	  if (!Array.isArray(segments) || segments.length === 0) {
   174	    return null;
   175	  }
   176	  if (!config || !isNonEmptyString(config.sessionId) || !config.waveNumber) {
   177	    return null;
   178	  }
   179	
   180	  const maxParallel = config.maxParallel || MAX_PARALLEL_SEGMENTS;
   181	  const now = new Date().toISOString();
   182	  const waveId = `${config.sessionId}-w${config.waveNumber}`;
   183	
   184	  // Cap segments to maxParallel
   185	  const activeSegments = segments.slice(0, maxParallel);
   186	
   187	  const dispatches = activeSegments.map((segment, index) => ({
   188	    dispatchId: `${waveId}-s${index}`,
   189	    waveId,
   190	    segmentId: segment.segmentId || `seg-${index}`,
   191	    segmentIndex: index,
   192	    status: 'dispatched',
   193	    dispatchedAt: now,
   194	    completedAt: null,
   195	    result: null,
   196	    error: null,
   197	  }));
   198	
   199	  return {
   200	    waveId,
   201	    dispatches,
   202	    timestamp: now,
   203	    sessionId: config.sessionId,
   204	    generation: config.generation || 1,
   205	    waveNumber: config.waveNumber,
   206	    totalSegments: segments.length,
   207	    activeSegments: activeSegments.length,
   208	    deferredSegments: Math.max(0, segments.length - maxParallel),
   209	  };
   210	}
   211	
   212	/* ---------------------------------------------------------------
   213	   5. JOIN
   214	----------------------------------------------------------------*/
   215	
   216	/**
   217	 * Merge strategy definitions for joining wave results.
   218	 * @type {Readonly<Record<string, string>>}
   219	 */
   220	const MERGE_STRATEGIES = Object.freeze({
   221	  CONCAT: 'concat',
   222	  DEDUPE: 'dedupe',
   223	  PRIORITY: 'priority',
   224	});
   225	
   226	/**
   227	 * Join results from parallel workers back into a single result set.
   228	 * Applies the specified merge strategy to handle duplicates and conflicts.
   229	 *
   230	 * @param {Array<object>} results - Results from completed segment dispatches
   231	 * @param {string} [mergeStrategy='dedupe'] - How to merge: 'concat', 'dedupe', or 'priority'
   232	 * @returns {{ merged: Array<object>, conflicts: Array<object>, stats: object }}
   233	 */
   234	function joinWave(results, mergeStrategy) {
   235	  if (!Array.isArray(results)) {
   236	    return { merged: [], conflicts: [], stats: { totalResults: 0, mergedFindings: 0, conflicts: 0 } };
   237	  }
   238	
   239	  const strategy = mergeStrategy || MERGE_STRATEGIES.DEDUPE;
   240	  const conflicts = [];
   241	  const findingMap = new Map();
   242	
   243	  for (const result of results) {
   244	    if (!result || !result.findings) continue;
   245	
   246	    for (const finding of result.findings) {
   247	      const key = buildFindingKey(finding);
   248	
   249	      if (findingMap.has(key)) {
   250	        const existing = findingMap.get(key);
   251	
   252	        if (strategy === MERGE_STRATEGIES.CONCAT) {
   253	          // Keep both under different composite keys
   254	          const altKey = `${key}::${result.segmentId || 'unknown'}`;
   255	          findingMap.set(altKey, {
   256	            ...finding,
   257	            mergedFrom: result.segmentId || 'unknown',
   258	            mergeState: 'appended',
   259	          });
   260	        } else if (strategy === MERGE_STRATEGIES.PRIORITY) {

exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts/tests | rg 'wave|deep-loop-wave'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs | sed -n '521,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   521	
   522	/* ---------------------------------------------------------------
   523	   7. HELPERS
   524	----------------------------------------------------------------*/
   525	
   526	/**
   527	 * Extract the directory portion of a file path.
   528	 * @param {string} filePath
   529	 * @returns {string}
   530	 */
   531	function extractDirectory(filePath) {
   532	  if (!filePath) return '';
   533	  const lastSlash = filePath.lastIndexOf('/');
   534	  return lastSlash > 0 ? filePath.slice(0, lastSlash) : '.';
   535	}
   536	
   537	/**
   538	 * Compute hotspot spread: fraction of directories that contain files
   539	 * with above-median complexity or churn.
   540	 * @param {Array<object>} files
   541	 * @returns {number}
   542	 */
   543	function computeHotspotSpread(files) {
   544	  if (!Array.isArray(files) || files.length === 0) return 0;
   545	
   546	  const allDirs = new Set();
   547	  const hotDirs = new Set();
   548	
   549	  // Compute median complexity
   550	  const complexities = files
   551	    .map(f => typeof f.complexity === 'number' ? f.complexity : 1)
   552	    .sort((a, b) => a - b);
   553	  const median = complexities[Math.floor(complexities.length / 2)] || 1;
   554	
   555	  for (const f of files) {
   556	    const dir = extractDirectory(f.path || '');
   557	    allDirs.add(dir);
   558	    const complexity = typeof f.complexity === 'number' ? f.complexity : 1;
   559	    if (complexity >= median) {
   560	      hotDirs.add(dir);
   561	    }
   562	  }
   563	
   564	  return allDirs.size > 0 ? hotDirs.size / allDirs.size : 0;
   565	}
   566	
   567	/**
   568	 * Compute cluster diversity: fraction of unique clusters across domains.
   569	 * @param {Array<object>} domains
   570	 * @returns {number}
   571	 */
   572	function computeClusterDiversity(domains) {
   573	  if (!Array.isArray(domains) || domains.length === 0) return 0;
   574	
   575	  const clusters = new Set();
   576	  for (const d of domains) {
   577	    clusters.add(d.cluster || assignCluster(d));
   578	  }
   579	
   580	  return clusters.size / domains.length;
   581	}
   582	
   583	/**
   584	 * Assign a default cluster to a domain based on its name.
   585	 * Simple heuristic: uses the top-level domain category.
   586	 * @param {object} source
   587	 * @returns {string}
   588	 */
   589	function assignCluster(source) {
   590	  if (!source || !source.domain) return 'unclustered';
   591	  // Simple heuristic: split by dot and use first meaningful segment
   592	  const parts = source.domain.split('.');
   593	  if (parts.length >= 2) return parts[parts.length - 1];
   594	  return parts[0] || 'unclustered';
   595	}
   596	
   597	/* ---------------------------------------------------------------
   598	   8. EXPORTS
   599	----------------------------------------------------------------*/
   600	
   601	module.exports = {
   602	  // Constants
   603	  REVIEW_FILE_THRESHOLD,
   604	  RESEARCH_DOMAIN_THRESHOLD,
   605	  DEFAULT_SEGMENT_SIZE_REVIEW,
   606	  DEFAULT_SEGMENT_SIZE_RESEARCH,
   607	  HOTSPOT_SPREAD_THRESHOLD,
   608	  CLUSTER_DIVERSITY_THRESHOLD,
   609	  MAX_SEGMENTS_DEFAULT,
   610	  // Activation gates
   611	  shouldActivateReviewWave,
   612	  shouldActivateResearchWave,
   613	  // Prepass artifacts
   614	  generateHotspotInventory,
   615	  generateDomainLedger,
   616	  // Segmentation
   617	  segmentForReview,
   618	  segmentForResearch,
   619	  // Helpers
   620	  extractDirectory,
   621	  computeHotspotSpread,
   622	  computeClusterDiversity,
   623	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Wave Segment Planner (T001, T-WE-NEW-2, T-WE-NEW-3)
     5	// ---------------------------------------------------------------
     6	// Deterministic segmentation for review files and research domains.
     7	// v1: heuristic-based (file counts, directory grouping, hotspot ranking)
     8	// v2: graph/cluster-enhanced (Phase 002 coverage graph overlay)
     9	//
    10	// Segment identity and ordering are reproducible from the same inputs.
    11	// Activation gates ensure wave mode only activates for large targets.
    12	// ---------------------------------------------------------------
    13	
    14	/* ---------------------------------------------------------------
    15	   1. CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	/**
    19	 * Minimum file count to activate wave mode for review.
    20	 * @type {number}
    21	 */
    22	const REVIEW_FILE_THRESHOLD = 1000;
    23	
    24	/**
    25	 * Minimum domain count to activate wave mode for research.
    26	 * @type {number}
    27	 */
    28	const RESEARCH_DOMAIN_THRESHOLD = 50;
    29	
    30	/**
    31	 * Default maximum files per review segment.
    32	 * @type {number}
    33	 */
    34	const DEFAULT_SEGMENT_SIZE_REVIEW = 200;
    35	
    36	/**
    37	 * Default maximum domains per research segment.
    38	 * @type {number}
    39	 */
    40	const DEFAULT_SEGMENT_SIZE_RESEARCH = 10;
    41	
    42	/**
    43	 * Minimum hotspot spread ratio to justify wave segmentation.
    44	 * At least this fraction of directories must contain hotspots.
    45	 * @type {number}
    46	 */
    47	const HOTSPOT_SPREAD_THRESHOLD = 0.15;
    48	
    49	/**
    50	 * Minimum cluster diversity ratio to justify wave segmentation for research.
    51	 * At least this fraction of domains must span distinct clusters.
    52	 * @type {number}
    53	 */
    54	const CLUSTER_DIVERSITY_THRESHOLD = 0.20;
    55	
    56	/* ---------------------------------------------------------------
    57	   2. ACTIVATION GATES
    58	----------------------------------------------------------------*/
    59	
    60	/**
    61	 * Check whether wave mode should activate for a review scope.
    62	 * Requires >= REVIEW_FILE_THRESHOLD files with sufficient hotspot spread.
    63	 *
    64	 * @param {Array<object>} files - File inventory list
    65	 * @param {object} [metrics] - Optional precomputed metrics
    66	 * @param {number} [metrics.hotspotSpread] - Fraction of directories with hotspots
    67	 * @returns {{ activate: boolean, reason: string, fileCount: number, hotspotSpread: number }}
    68	 */
    69	function shouldActivateReviewWave(files, metrics) {
    70	  const fileCount = Array.isArray(files) ? files.length : 0;
    71	  const hotspotSpread = (metrics && typeof metrics.hotspotSpread === 'number')
    72	    ? metrics.hotspotSpread
    73	    : computeHotspotSpread(files);
    74	
    75	  if (fileCount < REVIEW_FILE_THRESHOLD) {
    76	    return {
    77	      activate: false,
    78	      reason: `File count ${fileCount} below threshold ${REVIEW_FILE_THRESHOLD}`,
    79	      fileCount,
    80	      hotspotSpread,
    81	    };
    82	  }
    83	
    84	  if (hotspotSpread < HOTSPOT_SPREAD_THRESHOLD) {
    85	    return {
    86	      activate: false,
    87	      reason: `Hotspot spread ${hotspotSpread.toFixed(3)} below threshold ${HOTSPOT_SPREAD_THRESHOLD}`,
    88	      fileCount,
    89	      hotspotSpread,
    90	    };
    91	  }
    92	
    93	  return {
    94	    activate: true,
    95	    reason: `Wave activated: ${fileCount} files, hotspot spread ${hotspotSpread.toFixed(3)}`,
    96	    fileCount,
    97	    hotspotSpread,
    98	  };
    99	}
   100	
   101	/**
   102	 * Check whether wave mode should activate for a research scope.
   103	 * Requires >= RESEARCH_DOMAIN_THRESHOLD domains with sufficient cluster diversity.
   104	 *
   105	 * @param {Array<object>} domains - Domain inventory list
   106	 * @param {object} [metrics] - Optional precomputed metrics
   107	 * @param {number} [metrics.clusterDiversity] - Fraction of domains in distinct clusters
   108	 * @returns {{ activate: boolean, reason: string, domainCount: number, clusterDiversity: number }}
   109	 */
   110	function shouldActivateResearchWave(domains, metrics) {
   111	  const domainCount = Array.isArray(domains) ? domains.length : 0;
   112	  const clusterDiversity = (metrics && typeof metrics.clusterDiversity === 'number')
   113	    ? metrics.clusterDiversity
   114	    : computeClusterDiversity(domains);
   115	
   116	  if (domainCount < RESEARCH_DOMAIN_THRESHOLD) {
   117	    return {
   118	      activate: false,
   119	      reason: `Domain count ${domainCount} below threshold ${RESEARCH_DOMAIN_THRESHOLD}`,
   120	      domainCount,
   121	      clusterDiversity,
   122	    };
   123	  }
   124	
   125	  if (clusterDiversity < CLUSTER_DIVERSITY_THRESHOLD) {
   126	    return {
   127	      activate: false,
   128	      reason: `Cluster diversity ${clusterDiversity.toFixed(3)} below threshold ${CLUSTER_DIVERSITY_THRESHOLD}`,
   129	      domainCount,
   130	      clusterDiversity,
   131	    };
   132	  }
   133	
   134	  return {
   135	    activate: true,
   136	    reason: `Wave activated: ${domainCount} domains, cluster diversity ${clusterDiversity.toFixed(3)}`,
   137	    domainCount,
   138	    clusterDiversity,
   139	  };
   140	}
   141	
   142	/* ---------------------------------------------------------------
   143	   3. HOTSPOT INVENTORY (T-WE-NEW-2)
   144	----------------------------------------------------------------*/
   145	
   146	/**
   147	 * Generate hotspot-inventory.json for review.
   148	 * Produces file ranking, directory clusters, and coverage priorities.
   149	 *
   150	 * Deterministic: same inputs always produce same output order.
   151	 *
   152	 * @param {Array<object>} files - File list with metadata
   153	 * @param {string} files[].path - File path
   154	 * @param {number} [files[].complexity] - Complexity score (higher = more complex)
   155	 * @param {number} [files[].churnRate] - Change frequency (higher = more active)
   156	 * @param {number} [files[].issueCount] - Known issues in this file
   157	 * @param {object} [metrics] - Additional scoring metrics
   158	 * @returns {object} Hotspot inventory artifact
   159	 */
   160	function generateHotspotInventory(files, metrics) {
   161	  if (!Array.isArray(files)) {
   162	    return { files: [], directories: [], segments: [], version: 'v1', generatedAt: new Date().toISOString() };
   163	  }
   164	
   165	  // Score each file for hotspot ranking
   166	  const scored = files.map(f => {
   167	    const complexity = typeof f.complexity === 'number' ? f.complexity : 1;
   168	    const churnRate = typeof f.churnRate === 'number' ? f.churnRate : 0;
   169	    const issueCount = typeof f.issueCount === 'number' ? f.issueCount : 0;
   170	
   171	    const hotspotScore = (complexity * 0.4) + (churnRate * 0.35) + (issueCount * 0.25);
   172	
   173	    return {
   174	      path: f.path || '',
   175	      directory: extractDirectory(f.path || ''),
   176	      complexity,
   177	      churnRate,
   178	      issueCount,
   179	      hotspotScore,
   180	    };
   181	  });
   182	
   183	  // Sort deterministically: by hotspotScore descending, then path ascending
   184	  scored.sort((a, b) => {
   185	    if (b.hotspotScore !== a.hotspotScore) return b.hotspotScore - a.hotspotScore;
   186	    return a.path.localeCompare(b.path);
   187	  });
   188	
   189	  // Group by directory
   190	  const dirMap = new Map();
   191	  for (const file of scored) {
   192	    if (!dirMap.has(file.directory)) {
   193	      dirMap.set(file.directory, { directory: file.directory, files: [], totalScore: 0 });
   194	    }
   195	    const entry = dirMap.get(file.directory);
   196	    entry.files.push(file);
   197	    entry.totalScore += file.hotspotScore;
   198	  }
   199	
   200	  // Sort directories by total score descending, then name ascending
   201	  const directories = Array.from(dirMap.values())
   202	    .sort((a, b) => {
   203	      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
   204	      return a.directory.localeCompare(b.directory);
   205	    })
   206	    .map((d, idx) => ({
   207	      directory: d.directory,
   208	      fileCount: d.files.length,
   209	      totalScore: d.totalScore,
   210	      rank: idx + 1,
   211	    }));
   212	
   213	  return {
   214	    files: scored,
   215	    directories,
   216	    totalFiles: scored.length,
   217	    totalDirectories: directories.length,
   218	    version: 'v1',
   219	    generatedAt: new Date().toISOString(),
   220	  };
   221	}
   222	
   223	/* ---------------------------------------------------------------
   224	   4. DOMAIN LEDGER (T-WE-NEW-3)
   225	----------------------------------------------------------------*/
   226	
   227	/**
   228	 * Generate domain-ledger.json for research.
   229	 * Produces source domains, authority levels, and cluster assignments.
   230	 *
   231	 * Deterministic: same inputs always produce same output order.
   232	 *
   233	 * @param {Array<object>} sources - Source list with metadata
   234	 * @param {string} sources[].domain - Domain identifier
   235	 * @param {string} [sources[].url] - Source URL
   236	 * @param {number} [sources[].authority] - Authority score (0.0-1.0)
   237	 * @param {string} [sources[].cluster] - Pre-assigned cluster name
   238	 * @param {string[]} [sources[].topics] - Topics this source covers
   239	 * @param {object} [metrics] - Additional clustering metrics
   240	 * @returns {object} Domain ledger artifact
   241	 */
   242	function generateDomainLedger(sources, metrics) {
   243	  if (!Array.isArray(sources)) {
   244	    return { domains: [], clusters: [], version: 'v1', generatedAt: new Date().toISOString() };
   245	  }
   246	
   247	  // Score and normalize each domain
   248	  const scored = sources.map(s => ({
   249	    domain: s.domain || '',
   250	    url: s.url || '',
   251	    authority: typeof s.authority === 'number' ? Math.max(0, Math.min(1, s.authority)) : 0.5,
   252	    cluster: s.cluster || assignCluster(s),
   253	    topics: Array.isArray(s.topics) ? [...s.topics].sort() : [],
   254	  }));
   255	
   256	  // Sort deterministically: by authority descending, then domain ascending
   257	  scored.sort((a, b) => {
   258	    if (b.authority !== a.authority) return b.authority - a.authority;
   259	    return a.domain.localeCompare(b.domain);
   260	  });

 succeeded in 0ms:
   261	
   262	  // Group by cluster
   263	  const clusterMap = new Map();
   264	  for (const domain of scored) {
   265	    if (!clusterMap.has(domain.cluster)) {
   266	      clusterMap.set(domain.cluster, { cluster: domain.cluster, domains: [], totalAuthority: 0 });
   267	    }
   268	    const entry = clusterMap.get(domain.cluster);
   269	    entry.domains.push(domain);
   270	    entry.totalAuthority += domain.authority;
   271	  }
   272	
   273	  // Sort clusters by total authority descending, then name ascending
   274	  const clusters = Array.from(clusterMap.values())
   275	    .sort((a, b) => {
   276	      if (b.totalAuthority !== a.totalAuthority) return b.totalAuthority - a.totalAuthority;
   277	      return a.cluster.localeCompare(b.cluster);
   278	    })
   279	    .map((c, idx) => ({
   280	      cluster: c.cluster,
   281	      domainCount: c.domains.length,
   282	      totalAuthority: c.totalAuthority,
   283	      rank: idx + 1,
   284	    }));
   285	
   286	  return {
   287	    domains: scored,
   288	    clusters,
   289	    totalDomains: scored.length,
   290	    totalClusters: clusters.length,
   291	    version: 'v1',
   292	    generatedAt: new Date().toISOString(),
   293	  };
   294	}
   295	
   296	/* ---------------------------------------------------------------
   297	   5. REVIEW SEGMENTATION (T001)
   298	----------------------------------------------------------------*/
   299	
   300	/**
   301	 * Segment files for review using deterministic heuristics.
   302	 * Groups by directory, ranks by hotspot score, and produces stable
   303	 * segment identities reproducible from the same inventory.
   304	 *
   305	 * @param {object} inventory - Hotspot inventory from generateHotspotInventory
   306	 * @param {object} [config] - Segmentation configuration
   307	 * @param {number} [config.segmentSize] - Max files per segment
   308	 * @param {number} [config.maxSegments] - Maximum number of segments
   309	 * @returns {Array<object>} Ordered array of segment descriptors
   310	 */
   311	function segmentForReview(inventory, config) {
   312	  if (!inventory || !Array.isArray(inventory.files)) {
   313	    return [];
   314	  }
   315	
   316	  const cfg = config || {};
   317	  if (!cfg.segmentSize || cfg.segmentSize < 1) cfg.segmentSize = DEFAULT_SEGMENT_SIZE_REVIEW;
   318	  const segmentSize = cfg.segmentSize;
   319	  const maxSegments = cfg.maxSegments || MAX_SEGMENTS_DEFAULT;
   320	
   321	  const files = inventory.files;
   322	  if (files.length === 0) return [];
   323	
   324	  // Group files by directory (preserving hotspot-score order within each group)
   325	  const dirGroups = new Map();
   326	  for (const file of files) {
   327	    const dir = file.directory || extractDirectory(file.path || '');
   328	    if (!dirGroups.has(dir)) {
   329	      dirGroups.set(dir, []);
   330	    }
   331	    dirGroups.get(dir).push(file);
   332	  }
   333	
   334	  // Sort directory groups by aggregate score descending
   335	  const sortedDirs = Array.from(dirGroups.entries())
   336	    .map(([dir, groupFiles]) => ({
   337	      dir,
   338	      files: groupFiles,
   339	      totalScore: groupFiles.reduce((s, f) => s + (f.hotspotScore || 0), 0),
   340	    }))
   341	    .sort((a, b) => {
   342	      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
   343	      return a.dir.localeCompare(b.dir);
   344	    });
   345	
   346	  // Split any oversized directory groups into chunks of segmentSize
   347	  const expandedGroups = [];
   348	  for (const group of sortedDirs) {
   349	    if (group.files.length <= segmentSize) {
   350	      expandedGroups.push(group);
   351	    } else {
   352	      // Split oversized directory into segmentSize chunks
   353	      for (let i = 0; i < group.files.length; i += segmentSize) {
   354	        expandedGroups.push({
   355	          dir: group.dir,
   356	          files: group.files.slice(i, i + segmentSize),
   357	          totalScore: group.files.slice(i, i + segmentSize).reduce((s, f) => s + (f.hotspotScore || 0), 0),
   358	        });
   359	      }
   360	    }
   361	  }
   362	
   363	  // Pack directories into segments up to segmentSize
   364	  const segments = [];
   365	  let currentSegment = { files: [], directories: [] };
   366	
   367	  for (const group of expandedGroups) {
   368	    // If adding this directory would exceed segment size, finalize current
   369	    if (currentSegment.files.length > 0 &&
   370	        currentSegment.files.length + group.files.length > segmentSize) {
   371	      segments.push(currentSegment);
   372	      currentSegment = { files: [], directories: [] };
   373	
   374	      if (segments.length >= maxSegments) break;
   375	    }
   376	
   377	    currentSegment.files.push(...group.files);
   378	    if (!currentSegment.directories.includes(group.dir)) {
   379	      currentSegment.directories.push(group.dir);
   380	    }
   381	
   382	    // If current segment is full, finalize
   383	    if (currentSegment.files.length >= segmentSize) {
   384	      segments.push(currentSegment);
   385	      currentSegment = { files: [], directories: [] };
   386	
   387	      if (segments.length >= maxSegments) break;
   388	    }
   389	  }
   390	
   391	  // Push remaining files
   392	  if (currentSegment.files.length > 0 && segments.length < maxSegments) {
   393	    segments.push(currentSegment);
   394	  }
   395	
   396	  // Assign stable segment IDs
   397	  return segments.map((seg, idx) => ({
   398	    segmentId: `review-seg-${String(idx + 1).padStart(3, '0')}`,
   399	    segmentIndex: idx,
   400	    files: seg.files.map(f => f.path || f),
   401	    directories: seg.directories,
   402	    fileCount: seg.files.length,
   403	    directoryCount: seg.directories.length,
   404	    totalHotspotScore: seg.files.reduce((s, f) => s + (f.hotspotScore || 0), 0),
   405	  }));
   406	}
   407	
   408	/**
   409	 * Maximum segments default (safety cap).
   410	 * @type {number}
   411	 */
   412	const MAX_SEGMENTS_DEFAULT = 20;
   413	
   414	/* ---------------------------------------------------------------
   415	   6. RESEARCH SEGMENTATION (T001)
   416	----------------------------------------------------------------*/
   417	
   418	/**
   419	 * Segment domains for research using deterministic heuristics.
   420	 * Groups by cluster, ranks by authority, and produces stable
   421	 * segment identities reproducible from the same ledger.
   422	 *
   423	 * @param {object} domainLedger - Domain ledger from generateDomainLedger
   424	 * @param {object} [config] - Segmentation configuration
   425	 * @param {number} [config.segmentSize] - Max domains per segment
   426	 * @param {number} [config.maxSegments] - Maximum number of segments
   427	 * @returns {Array<object>} Ordered array of segment descriptors
   428	 */
   429	function segmentForResearch(domainLedger, config) {
   430	  if (!domainLedger || !Array.isArray(domainLedger.domains)) {
   431	    return [];
   432	  }
   433	
   434	  const cfg = config || {};
   435	  if (!cfg.segmentSize || cfg.segmentSize < 1) cfg.segmentSize = DEFAULT_SEGMENT_SIZE_RESEARCH;
   436	  const segmentSize = cfg.segmentSize;
   437	  const maxSegments = cfg.maxSegments || MAX_SEGMENTS_DEFAULT;
   438	
   439	  const domains = domainLedger.domains;
   440	  if (domains.length === 0) return [];
   441	
   442	  // Group domains by cluster (preserving authority order within each group)
   443	  const clusterGroups = new Map();
   444	  for (const domain of domains) {
   445	    const cluster = domain.cluster || 'unclustered';
   446	    if (!clusterGroups.has(cluster)) {
   447	      clusterGroups.set(cluster, []);
   448	    }
   449	    clusterGroups.get(cluster).push(domain);
   450	  }
   451	
   452	  // Sort cluster groups by aggregate authority descending
   453	  const sortedClusters = Array.from(clusterGroups.entries())
   454	    .map(([cluster, clusterDomains]) => ({
   455	      cluster,
   456	      domains: clusterDomains,
   457	      totalAuthority: clusterDomains.reduce((s, d) => s + (d.authority || 0), 0),
   458	    }))
   459	    .sort((a, b) => {
   460	      if (b.totalAuthority !== a.totalAuthority) return b.totalAuthority - a.totalAuthority;
   461	      return a.cluster.localeCompare(b.cluster);
   462	    });
   463	
   464	  // Split any oversized cluster groups into chunks of segmentSize
   465	  const expandedClusters = [];
   466	  for (const group of sortedClusters) {
   467	    if (group.domains.length <= segmentSize) {
   468	      expandedClusters.push(group);
   469	    } else {
   470	      for (let i = 0; i < group.domains.length; i += segmentSize) {
   471	        expandedClusters.push({
   472	          cluster: group.cluster,
   473	          domains: group.domains.slice(i, i + segmentSize),
   474	          totalAuthority: group.domains.slice(i, i + segmentSize).reduce((s, d) => s + (d.authority || 0), 0),
   475	        });
   476	      }
   477	    }
   478	  }
   479	
   480	  // Pack clusters into segments up to segmentSize
   481	  const segments = [];
   482	  let currentSegment = { domains: [], clusters: [] };
   483	
   484	  for (const group of expandedClusters) {
   485	    if (currentSegment.domains.length > 0 &&
   486	        currentSegment.domains.length + group.domains.length > segmentSize) {
   487	      segments.push(currentSegment);
   488	      currentSegment = { domains: [], clusters: [] };
   489	
   490	      if (segments.length >= maxSegments) break;
   491	    }
   492	
   493	    currentSegment.domains.push(...group.domains);
   494	    if (!currentSegment.clusters.includes(group.cluster)) {
   495	      currentSegment.clusters.push(group.cluster);
   496	    }
   497	
   498	    if (currentSegment.domains.length >= segmentSize) {
   499	      segments.push(currentSegment);
   500	      currentSegment = { domains: [], clusters: [] };
   501	
   502	      if (segments.length >= maxSegments) break;
   503	    }
   504	  }
   505	
   506	  if (currentSegment.domains.length > 0 && segments.length < maxSegments) {
   507	    segments.push(currentSegment);
   508	  }
   509	
   510	  // Assign stable segment IDs
   511	  return segments.map((seg, idx) => ({
   512	    segmentId: `research-seg-${String(idx + 1).padStart(3, '0')}`,
   513	    segmentIndex: idx,
   514	    domains: seg.domains.map(d => d.domain || d),
   515	    clusters: seg.clusters,
   516	    domainCount: seg.domains.length,
   517	    clusterCount: seg.clusters.length,
   518	    totalAuthority: seg.domains.reduce((s, d) => s + (d.authority || 0), 0),
   519	  }));
   520	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Wave Coordination Board (T003, T-WE-NEW-4)
     5	// ---------------------------------------------------------------
     6	// Reducer-owned board.json execution ledger, status transitions,
     7	// conflict tracking, and derived dashboard renderer helpers.
     8	//
     9	// board.json is the canonical execution ledger.
    10	// dashboard.md is a derived human-readable render, never manually edited.
    11	// ---------------------------------------------------------------
    12	
    13	/* ---------------------------------------------------------------
    14	   1. CONSTANTS
    15	----------------------------------------------------------------*/
    16	
    17	/**
    18	 * Valid board-level statuses.
    19	 * @type {ReadonlyArray<string>}
    20	 */
    21	const BOARD_STATUSES = Object.freeze([
    22	  'initialized',
    23	  'planning',
    24	  'executing',
    25	  'merging',
    26	  'completed',
    27	  'failed',
    28	]);
    29	
    30	/**
    31	 * Valid finding merge states.
    32	 * @type {ReadonlyArray<string>}
    33	 */
    34	const FINDING_MERGE_STATES = Object.freeze([
    35	  'original',
    36	  'promoted',
    37	  'duplicate',
    38	  'conflict',
    39	  'resolved',
    40	  'pruned',
    41	]);
    42	
    43	/**
    44	 * Check whether a value is a non-empty string.
    45	 * @param {unknown} value
    46	 * @returns {boolean}
    47	 */
    48	function isNonEmptyString(value) {
    49	  return typeof value === 'string' && value.trim().length > 0;
    50	}
    51	
    52	/* ---------------------------------------------------------------
    53	   2. BOARD CREATION
    54	----------------------------------------------------------------*/
    55	
    56	/**
    57	 * Create a new coordination board.
    58	 * The board is machine-first and reducer-owned.
    59	 *
    60	 * @param {object} options
    61	 * @param {string} options.sessionId - Session identifier
    62	 * @param {number} [options.generation] - Generation counter
    63	 * @param {'review'|'research'} options.loopType - Loop type
    64	 * @param {string} [options.target] - Review/research target
    65	 * @returns {object} Board object (serializable to board.json)
    66	 */
    67	function createBoard(options) {
    68	  if (!options || !isNonEmptyString(options.sessionId)) {
    69	    return null;
    70	  }
    71	  if (options.loopType !== 'review' && options.loopType !== 'research') {
    72	    return null;
    73	  }
    74	
    75	  const now = new Date().toISOString();
    76	
    77	  return {
    78	    schema: 'wave-board-v1',
    79	    sessionId: options.sessionId,
    80	    generation: typeof options.generation === 'number' ? options.generation : 1,
    81	    loopType: options.loopType,
    82	    target: options.target || '',
    83	    status: 'initialized',
    84	    createdAt: now,
    85	    updatedAt: now,
    86	    segments: [],
    87	    waves: [],
    88	    findings: [],
    89	    conflicts: [],
    90	    dedupeLog: [],
    91	    promotions: [],
    92	    mergeHistory: [],
    93	    stats: {
    94	      totalSegments: 0,
    95	      completedSegments: 0,
    96	      prunedSegments: 0,
    97	      failedSegments: 0,
    98	      totalFindings: 0,
    99	      promotedFindings: 0,
   100	      duplicateFindings: 0,
   101	      conflictFindings: 0,
   102	    },
   103	  };
   104	}
   105	
   106	/* ---------------------------------------------------------------
   107	   3. BOARD UPDATE
   108	----------------------------------------------------------------*/
   109	
   110	/**
   111	 * Merge segment results into the coordination board.
   112	 * Updates segment status, findings, conflicts, and deduplication log.
   113	 *
   114	 * @param {object} board - The board object
   115	 * @param {Array<object>} segmentResults - Results from completed segments
   116	 * @returns {object} Updated board (mutates in-place and returns)
   117	 */
   118	function updateBoard(board, segmentResults) {
   119	  if (!board || typeof board !== 'object') {
   120	    return null;
   121	  }
   122	  if (!Array.isArray(segmentResults)) {
   123	    return board;
   124	  }
   125	
   126	  const now = new Date().toISOString();
   127	  board.updatedAt = now;
   128	
   129	  for (const result of segmentResults) {
   130	    if (!result) continue;
   131	
   132	    const segmentId = result.segmentId || `seg-unknown-${Date.now()}`;
   133	
   134	    // Update segment record
   135	    const existingSegment = board.segments.find(s => s.segmentId === segmentId);
   136	    if (existingSegment) {
   137	      existingSegment.status = result.status || 'completed';
   138	      existingSegment.completedAt = now;
   139	      existingSegment.findingCount = result.findings ? result.findings.length : 0;
   140	    } else {
   141	      board.segments.push({
   142	        segmentId,
   143	        status: result.status || 'completed',
   144	        startedAt: result.startedAt || now,
   145	        completedAt: now,
   146	        findingCount: result.findings ? result.findings.length : 0,
   147	        waveId: result.waveId || null,
   148	      });
   149	    }
   150	
   151	    // Process findings with explicit keys
   152	    if (Array.isArray(result.findings)) {
   153	      for (const finding of result.findings) {
   154	        const findingRecord = buildFindingRecord(finding, segmentId, board, result);
   155	        mergeFinding(board, findingRecord);
   156	      }
   157	    }
   158	  }
   159	
   160	  // Update stats
   161	  recalculateStats(board);
   162	
   163	  return board;
   164	}
   165	
   166	/* ---------------------------------------------------------------
   167	   4. FINDING RECORDS AND MERGE
   168	----------------------------------------------------------------*/
   169	
   170	/**
   171	 * Build a board finding record with explicit key fields.
   172	 * Keys: sessionId, generation, segment, wave, findingId.
   173	 *
   174	 * @param {object} finding - Raw finding from a segment
   175	 * @param {string} segmentId - Segment that produced this finding
   176	 * @param {object} board - Board context for sessionId/generation
   177	 * @returns {object} Board finding record
   178	 */
   179	function buildFindingRecord(finding, segmentId, board, segmentResult) {
   180	  if (!finding || typeof finding !== 'object' || !board || typeof board !== 'object') {
   181	    return null;
   182	  }
   183	  // Fall back to the segment result's waveId if the finding itself has no wave info
   184	  const resolvedWave = finding.wave || finding.waveId || (segmentResult && segmentResult.waveId) || null;
   185	
   186	  return {
   187	    // Explicit merge keys (never rely on append order)
   188	    sessionId: board.sessionId,
   189	    generation: board.generation,
   190	    segment: segmentId,
   191	    wave: resolvedWave,
   192	    findingId: finding.findingId || generateFindingId(finding, segmentId),
   193	    // Finding content
   194	    title: finding.title || finding.summary || '',
   195	    severity: finding.severity || 'P2',
   196	    file: finding.file || finding.filePath || null,
   197	    line: finding.line || finding.lineNumber || null,
   198	    dimension: finding.dimension || null,
   199	    domain: finding.domain || null,
   200	    evidence: finding.evidence || null,
   201	    mergeState: 'original',
   202	    mergedAt: new Date().toISOString(),
   203	    provenance: {
   204	      sourceSegment: segmentId,
   205	      sourceWave: resolvedWave,
   206	      originalFindingId: finding.findingId || null,
   207	    },
   208	  };
   209	}
   210	
   211	/**
   212	 * Merge a finding record into the board.
   213	 * Uses findingId as the primary key for deduplication.
   214	 * Preserves conflict and duplicate metadata.
   215	 *
   216	 * @param {object} board - Board object
   217	 * @param {object} findingRecord - Finding record to merge
   218	 */
   219	function mergeFinding(board, findingRecord) {
   220	  if (!board || typeof board !== 'object' || !findingRecord || typeof findingRecord !== 'object') {
   221	    return board;
   222	  }
   223	  const existingIndex = board.findings.findIndex(
   224	    f => f.findingId === findingRecord.findingId
   225	  );
   226	
   227	  if (existingIndex >= 0) {
   228	    const existing = board.findings[existingIndex];
   229	
   230	    // Check for conflict: same findingId, different evidence or severity
   231	    if (existing.severity !== findingRecord.severity ||
   232	        existing.evidence !== findingRecord.evidence) {
   233	      board.conflicts.push({
   234	        findingId: findingRecord.findingId,
   235	        existingSegment: existing.segment,
   236	        newSegment: findingRecord.segment,
   237	        existingSeverity: existing.severity,
   238	        newSeverity: findingRecord.severity,
   239	        resolution: 'pending',
   240	        detectedAt: new Date().toISOString(),
   241	      });
   242	
   243	      // If new finding has higher severity, promote it
   244	      if (compareSeverity(findingRecord.severity, existing.severity) > 0) {
   245	        findingRecord.mergeState = 'promoted';
   246	        board.promotions.push({
   247	          findingId: findingRecord.findingId,
   248	          fromSeverity: existing.severity,
   249	          toSeverity: findingRecord.severity,
   250	          fromSegment: existing.segment,
   251	          toSegment: findingRecord.segment,
   252	          promotedAt: new Date().toISOString(),
   253	        });
   254	        board.findings[existingIndex] = findingRecord;
   255	      } else {
   256	        findingRecord.mergeState = 'conflict';
   257	      }
   258	    } else {
   259	      // Exact duplicate
   260	      board.dedupeLog.push({

 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Wave Convergence (T005)
     5	// ---------------------------------------------------------------
     6	// Segment-level convergence helpers that wrap Phase 002 graph
     7	// metrics and stop traces. Provides wave-level convergence
     8	// evaluation, segment pruning logic, and promotion decisions.
     9	//
    10	// v2 graph-enhanced convergence is gated on Phase 002 coverage
    11	// graph being operational. v1 uses heuristic signals only.
    12	// ---------------------------------------------------------------
    13	
    14	/* ---------------------------------------------------------------
    15	   1. CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	/**
    19	 * Default convergence threshold for wave segments.
    20	 * @type {number}
    21	 */
    22	const DEFAULT_WAVE_CONVERGENCE_THRESHOLD = 0.05;
    23	
    24	/**
    25	 * Minimum iterations per segment before convergence is evaluable.
    26	 * @type {number}
    27	 */
    28	const MIN_ITERATIONS_FOR_CONVERGENCE = 2;
    29	
    30	/**
    31	 * Maximum consecutive low-progress iterations before prune is suggested.
    32	 * @type {number}
    33	 */
    34	const PRUNE_STUCK_THRESHOLD = 3;
    35	
    36	/**
    37	 * Convergence signal weights for wave-level evaluation.
    38	 * @type {Readonly<Record<string, number>>}
    39	 */
    40	const WAVE_CONVERGENCE_WEIGHTS = Object.freeze({
    41	  segmentConvergence: 0.40,
    42	  crossSegmentNovelty: 0.30,
    43	  gapCoverage: 0.30,
    44	});
    45	
    46	/* ---------------------------------------------------------------
    47	   2. WAVE-LEVEL CONVERGENCE
    48	----------------------------------------------------------------*/
    49	
    50	/**
    51	 * Evaluate whether wave-level convergence has been reached.
    52	 * Combines per-segment convergence scores, cross-segment novelty,
    53	 * and overall gap coverage.
    54	 *
    55	 * @param {object} board - Coordination board state
    56	 * @param {object} signals - Convergence signal inputs
    57	 * @param {Array<object>} [signals.segmentStates] - Per-segment states with convergence scores
    58	 * @param {number} [signals.crossSegmentNovelty] - Novelty ratio across segments (0.0-1.0)
    59	 * @param {number} [signals.gapCoverage] - Fraction of known gaps covered (0.0-1.0)
    60	 * @param {object} [signals.graphMetrics] - Phase 002 graph metrics (optional, v2)
    61	 * @param {number} [threshold] - Custom convergence threshold
    62	 * @returns {{ converged: boolean, score: number, signals: object, blockedBy: Array<string> }}
    63	 */
    64	function evaluateWaveConvergence(board, signals, threshold) {
    65	  const thresh = typeof threshold === 'number' ? threshold : DEFAULT_WAVE_CONVERGENCE_THRESHOLD;
    66	
    67	  if (!board || !signals) {
    68	    return {
    69	      converged: false,
    70	      score: 0,
    71	      signals: {},
    72	      blockedBy: ['missing-inputs'],
    73	    };
    74	  }
    75	
    76	  const segmentStates = signals.segmentStates || [];
    77	  const blockedBy = [];
    78	  const signalResults = {};
    79	
    80	  // Gate: All board segments must be in terminal status before convergence is possible
    81	  const TERMINAL_STATUSES = new Set(['completed', 'pruned', 'failed', 'converged']);
    82	  if (board.segments && board.segments.length > 0) {
    83	    const nonTerminal = board.segments.filter(s => !TERMINAL_STATUSES.has(s.status));
    84	    if (nonTerminal.length > 0) {
    85	      blockedBy.push(`${nonTerminal.length} segments not in terminal status`);
    86	    }
    87	  }
    88	
    89	  // Signal 1: Segment convergence (per-segment scores)
    90	  let segmentConvergenceScore = 0;
    91	  if (segmentStates.length > 0) {
    92	    const convergenceScores = segmentStates.map(s => s.convergenceScore || 0);
    93	    segmentConvergenceScore = convergenceScores.reduce((a, b) => a + b, 0) / convergenceScores.length;
    94	
    95	    // Check if any segment has not converged (score must reach >= 1-threshold, e.g. >= 0.95 for threshold 0.05)
    96	    const unconverged = segmentStates.filter(s => (s.convergenceScore || 0) < (1.0 - thresh));
    97	    if (unconverged.length > 0) {
    98	      blockedBy.push(`${unconverged.length} segments not converged`);
    99	    }
   100	  } else {
   101	    blockedBy.push('no-segment-states');
   102	  }
   103	  signalResults.segmentConvergence = {
   104	    score: segmentConvergenceScore,
   105	    weight: WAVE_CONVERGENCE_WEIGHTS.segmentConvergence,
   106	    detail: `${segmentStates.length} segments evaluated`,
   107	  };
   108	
   109	  // Signal 2: Cross-segment novelty
   110	  const crossNovelty = typeof signals.crossSegmentNovelty === 'number' ? signals.crossSegmentNovelty : 1.0;
   111	  const crossNoveltyConverged = crossNovelty <= thresh;
   112	  if (!crossNoveltyConverged) {
   113	    blockedBy.push(`cross-segment novelty ${crossNovelty.toFixed(3)} above threshold`);
   114	  }
   115	  signalResults.crossSegmentNovelty = {
   116	    score: 1.0 - crossNovelty, // Invert: low novelty = high convergence
   117	    weight: WAVE_CONVERGENCE_WEIGHTS.crossSegmentNovelty,
   118	    converged: crossNoveltyConverged,
   119	  };
   120	
   121	  // Signal 3: Gap coverage
   122	  const gapCov = typeof signals.gapCoverage === 'number' ? signals.gapCoverage : 0;
   123	  const gapCoverageConverged = gapCov >= (1.0 - thresh);
   124	  if (!gapCoverageConverged) {
   125	    blockedBy.push(`gap coverage ${gapCov.toFixed(3)} below required ${(1.0 - thresh).toFixed(3)}`);
   126	  }
   127	  signalResults.gapCoverage = {
   128	    score: gapCov,
   129	    weight: WAVE_CONVERGENCE_WEIGHTS.gapCoverage,
   130	    converged: gapCoverageConverged,
   131	  };
   132	
   133	  // Signal 4: Graph metrics (v2, optional)
   134	  if (signals.graphMetrics) {
   135	    signalResults.graphMetrics = {
   136	      available: true,
   137	      sourceDiversity: signals.graphMetrics.sourceDiversity || 0,
   138	      evidenceDepth: signals.graphMetrics.evidenceDepth || 0,
   139	      clusterCoverage: signals.graphMetrics.clusterCoverage || 0,
   140	    };
   141	  } else {
   142	    signalResults.graphMetrics = { available: false };
   143	  }
   144	
   145	  // Compute weighted convergence score
   146	  const weightedScore =
   147	    (signalResults.segmentConvergence.score * WAVE_CONVERGENCE_WEIGHTS.segmentConvergence) +
   148	    (signalResults.crossSegmentNovelty.score * WAVE_CONVERGENCE_WEIGHTS.crossSegmentNovelty) +
   149	    (signalResults.gapCoverage.score * WAVE_CONVERGENCE_WEIGHTS.gapCoverage);
   150	
   151	  const converged = blockedBy.length === 0;
   152	
   153	  return {
   154	    converged,
   155	    score: weightedScore,
   156	    signals: signalResults,
   157	    blockedBy,
   158	    threshold: thresh,
   159	  };
   160	}
   161	
   162	/* ---------------------------------------------------------------
   163	   3. SEGMENT PRUNING
   164	----------------------------------------------------------------*/
   165	
   166	/**
   167	 * Check if a segment should be pruned (retired early).
   168	 * A segment can be pruned if it has converged or is stuck.
   169	 * Pruning does not make global STOP legal -- remaining segments
   170	 * must still satisfy their own convergence criteria.
   171	 *
   172	 * @param {object} segment - Segment state
   173	 * @param {object} signals - Pruning signal inputs
   174	 * @param {number} [signals.stuckCount] - Consecutive low-progress iterations
   175	 * @param {number} [signals.convergenceScore] - Current convergence score
   176	 * @param {boolean} [signals.graphConverged] - Phase 002 graph says converged
   177	 * @param {number} [threshold] - Custom convergence threshold
   178	 * @returns {{ shouldPrune: boolean, reason: string, pruneType: string }}
   179	 */
   180	function shouldPruneSegment(segment, signals, threshold) {
   181	  const thresh = typeof threshold === 'number' ? threshold : DEFAULT_WAVE_CONVERGENCE_THRESHOLD;
   182	
   183	  if (!segment || !signals) {
   184	    return { shouldPrune: false, reason: 'Missing segment or signals', pruneType: 'none' };
   185	  }
   186	
   187	  // Already in a terminal state
   188	  if (segment.status === 'completed' || segment.status === 'pruned' || segment.status === 'failed' || segment.status === 'converged') {
   189	    return { shouldPrune: false, reason: `Already in terminal status: ${segment.status}`, pruneType: 'none' };
   190	  }
   191	
   192	  // Check convergence-based pruning
   193	  const convergenceScore = typeof signals.convergenceScore === 'number' ? signals.convergenceScore : 0;
   194	  if (convergenceScore >= (1.0 - thresh)) {
   195	    return {
   196	      shouldPrune: true,
   197	      reason: `Segment converged: score ${convergenceScore.toFixed(3)} >= threshold ${(1.0 - thresh).toFixed(3)}`,
   198	      pruneType: 'converged',
   199	    };
   200	  }
   201	
   202	  // Check graph-backed convergence (v2)
   203	  if (signals.graphConverged === true) {
   204	    return {
   205	      shouldPrune: true,
   206	      reason: 'Graph convergence signals segment is complete',
   207	      pruneType: 'graph-converged',
   208	    };
   209	  }
   210	
   211	  // Check stuck-based pruning
   212	  const stuckCount = typeof signals.stuckCount === 'number' ? signals.stuckCount : 0;
   213	  if (stuckCount >= PRUNE_STUCK_THRESHOLD) {
   214	    return {
   215	      shouldPrune: true,
   216	      reason: `Stuck for ${stuckCount} iterations (threshold: ${PRUNE_STUCK_THRESHOLD})`,
   217	      pruneType: 'stuck',
   218	    };
   219	  }
   220	
   221	  return {
   222	    shouldPrune: false,
   223	    reason: 'No prune criteria met',
   224	    pruneType: 'none',
   225	  };
   226	}
   227	
   228	/* ---------------------------------------------------------------
   229	   4. SEGMENT CONVERGENCE
   230	----------------------------------------------------------------*/
   231	
   232	/**
   233	 * Evaluate convergence for a single segment.
   234	 * Uses the same convergence algorithm as the main loop but
   235	 * scoped to segment-local metrics.
   236	 *
   237	 * @param {object} segmentState - Per-segment state
   238	 * @param {object} [options] - Evaluation options
   239	 * @param {number} [options.threshold] - Convergence threshold
   240	 * @param {number} [options.windowSize] - Rolling average window
   241	 * @returns {{ converged: boolean, score: number, iterationCount: number, signals: object }}
   242	 */
   243	function evaluateSegmentConvergence(segmentState, options) {
   244	  const opts = options || {};
   245	  const threshold = typeof opts.threshold === 'number' ? opts.threshold : DEFAULT_WAVE_CONVERGENCE_THRESHOLD;
   246	  const windowSize = typeof opts.windowSize === 'number' ? opts.windowSize : 3;
   247	
   248	  if (!segmentState || !Array.isArray(segmentState.iterations)) {
   249	    return { converged: false, score: 0, iterationCount: 0, signals: {} };
   250	  }
   251	
   252	  const iterations = segmentState.iterations;
   253	  const count = iterations.length;
   254	
   255	  if (count < MIN_ITERATIONS_FOR_CONVERGENCE) {
   256	    return {
   257	      converged: false,
   258	      score: 0,
   259	      iterationCount: count,
   260	      signals: { reason: `Need ${MIN_ITERATIONS_FOR_CONVERGENCE} iterations, have ${count}` },
   261	    };
   262	  }
   263	
   264	  // Extract novelty ratios
   265	  const ratios = iterations
   266	    .filter(it => it.status !== 'thought')
   267	    .map(it => typeof it.newInfoRatio === 'number' ? it.newInfoRatio : (typeof it.newFindingsRatio === 'number' ? it.newFindingsRatio : 1.0));
   268	
   269	  const signals = {};
   270	
   271	  // Rolling average
   272	  if (ratios.length >= windowSize) {
   273	    const window = ratios.slice(-windowSize);
   274	    const avg = window.reduce((a, b) => a + b, 0) / window.length;
   275	    signals.rollingAvg = { value: avg, converged: avg < threshold };
   276	  }
   277	
   278	  // Latest ratio
   279	  if (ratios.length > 0) {
   280	    const latest = ratios[ratios.length - 1];
   281	    signals.latestRatio = { value: latest, converged: latest < threshold };
   282	  }
   283	
   284	  // Compute overall convergence score
   285	  const score = ratios.length > 0
   286	    ? 1.0 - (ratios.slice(-windowSize).reduce((a, b) => a + b, 0) / Math.min(ratios.length, windowSize))
   287	    : 0;
   288	
   289	  const allSignalsConverged = Object.values(signals).every(s => s.converged === true || s.converged === undefined);
   290	
   291	  return {
   292	    converged: allSignalsConverged && ratios.length >= windowSize,
   293	    score: Math.max(0, Math.min(1, score)),
   294	    iterationCount: count,
   295	    signals,
   296	  };
   297	}
   298	
   299	/* ---------------------------------------------------------------
   300	   5. EXPORTS
   301	----------------------------------------------------------------*/
   302	
   303	module.exports = {
   304	  // Constants
   305	  DEFAULT_WAVE_CONVERGENCE_THRESHOLD,
   306	  MIN_ITERATIONS_FOR_CONVERGENCE,
   307	  PRUNE_STUCK_THRESHOLD,
   308	  WAVE_CONVERGENCE_WEIGHTS,
   309	  // Wave convergence
   310	  evaluateWaveConvergence,
   311	  // Segment pruning
   312	  shouldPruneSegment,
   313	  // Segment convergence
   314	  evaluateSegmentConvergence,
   315	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   261	        findingId: findingRecord.findingId,
   262	        duplicateSegment: findingRecord.segment,
   263	        originalSegment: existing.segment,
   264	        deduplicatedAt: new Date().toISOString(),
   265	      });
   266	      findingRecord.mergeState = 'duplicate';
   267	    }
   268	  } else {
   269	    board.findings.push(findingRecord);
   270	  }
   271	
   272	  // Record merge history
   273	  board.mergeHistory.push({
   274	    findingId: findingRecord.findingId,
   275	    segment: findingRecord.segment,
   276	    mergeState: findingRecord.mergeState,
   277	    timestamp: new Date().toISOString(),
   278	  });
   279	}
   280	
   281	/* ---------------------------------------------------------------
   282	   5. DASHBOARD RENDERING
   283	----------------------------------------------------------------*/
   284	
   285	/**
   286	 * Generate dashboard.md content from board.json.
   287	 * This is a derived render, never manually edited.
   288	 *
   289	 * @param {object} board - Board object
   290	 * @returns {string} Markdown dashboard content
   291	 */
   292	function renderDashboard(board) {
   293	  if (!board) return '# Wave Execution Dashboard\n\nNo board data available.\n';
   294	
   295	  const lines = [];
   296	
   297	  lines.push('# Wave Execution Dashboard');
   298	  lines.push('');
   299	  lines.push('> Auto-generated from board.json. Do not edit manually.');
   300	  lines.push('');
   301	
   302	  // Status section
   303	  lines.push('## Status');
   304	  lines.push('');
   305	  lines.push(`| Field | Value |`);
   306	  lines.push(`|-------|-------|`);
   307	  lines.push(`| Session | ${board.sessionId || 'N/A'} |`);
   308	  lines.push(`| Generation | ${board.generation || 1} |`);
   309	  lines.push(`| Loop Type | ${board.loopType || 'N/A'} |`);
   310	  lines.push(`| Status | ${board.status || 'unknown'} |`);
   311	  lines.push(`| Target | ${board.target || 'N/A'} |`);
   312	  lines.push(`| Updated | ${board.updatedAt || 'N/A'} |`);
   313	  lines.push('');
   314	
   315	  // Stats section
   316	  lines.push('## Statistics');
   317	  lines.push('');
   318	  const s = board.stats || {};
   319	  lines.push(`| Metric | Count |`);
   320	  lines.push(`|--------|------:|`);
   321	  lines.push(`| Total Segments | ${s.totalSegments || 0} |`);
   322	  lines.push(`| Completed | ${s.completedSegments || 0} |`);
   323	  lines.push(`| Pruned | ${s.prunedSegments || 0} |`);
   324	  lines.push(`| Failed | ${s.failedSegments || 0} |`);
   325	  lines.push(`| Total Findings | ${s.totalFindings || 0} |`);
   326	  lines.push(`| Promoted | ${s.promotedFindings || 0} |`);
   327	  lines.push(`| Duplicates | ${s.duplicateFindings || 0} |`);
   328	  lines.push(`| Conflicts | ${s.conflictFindings || 0} |`);
   329	  lines.push('');
   330	
   331	  // Segments section
   332	  if (board.segments && board.segments.length > 0) {
   333	    lines.push('## Segments');
   334	    lines.push('');
   335	    lines.push(`| Segment | Status | Findings | Wave |`);
   336	    lines.push(`|---------|--------|---------|------|`);
   337	    for (const seg of board.segments) {
   338	      lines.push(`| ${seg.segmentId} | ${seg.status} | ${seg.findingCount || 0} | ${seg.waveId || '-'} |`);
   339	    }
   340	    lines.push('');
   341	  }
   342	
   343	  // Conflicts section
   344	  if (board.conflicts && board.conflicts.length > 0) {
   345	    lines.push('## Conflicts');
   346	    lines.push('');
   347	    lines.push(`| Finding | Segments | Severities | Resolution |`);
   348	    lines.push(`|---------|----------|------------|------------|`);
   349	    for (const conflict of board.conflicts) {
   350	      lines.push(`| ${conflict.findingId} | ${conflict.existingSegment} vs ${conflict.newSegment} | ${conflict.existingSeverity} vs ${conflict.newSeverity} | ${conflict.resolution} |`);
   351	    }
   352	    lines.push('');
   353	  }
   354	
   355	  // Promotions section
   356	  if (board.promotions && board.promotions.length > 0) {
   357	    lines.push('## Promotions');
   358	    lines.push('');
   359	    lines.push(`| Finding | From | To | Segment |`);
   360	    lines.push(`|---------|------|----|---------|`);
   361	    for (const promo of board.promotions) {
   362	      lines.push(`| ${promo.findingId} | ${promo.fromSeverity} | ${promo.toSeverity} | ${promo.toSegment} |`);
   363	    }
   364	    lines.push('');
   365	  }
   366	
   367	  return lines.join('\n');
   368	}
   369	
   370	/* ---------------------------------------------------------------
   371	   6. HELPERS
   372	----------------------------------------------------------------*/
   373	
   374	/**
   375	 * Generate a deterministic finding ID from finding content.
   376	 * ID is segment-independent so cross-segment dedup works correctly.
   377	 * @param {object} finding
   378	 * @param {string} _segmentId - Unused, kept for API compatibility
   379	 * @returns {string}
   380	 */
   381	function generateFindingId(finding, _segmentId) {
   382	  const file = finding.file || finding.filePath || '';
   383	  const line = finding.line || finding.lineNumber || 0;
   384	  const title = finding.title || finding.summary || '';
   385	  const hash = simpleHash(`${file}:${line}::${title}`);
   386	  return `f-${hash}`;
   387	}
   388	
   389	/**
   390	 * Simple string hash for deterministic IDs.
   391	 * @param {string} str
   392	 * @returns {string}
   393	 */
   394	function simpleHash(str) {
   395	  let hash = 0;
   396	  for (let i = 0; i < str.length; i++) {
   397	    const char = str.charCodeAt(i);
   398	    hash = ((hash << 5) - hash) + char;
   399	    hash = hash & hash; // Convert to 32bit integer
   400	  }
   401	  return Math.abs(hash).toString(36);
   402	}
   403	
   404	/**
   405	 * Compare two severity values. Returns >0 if a is higher severity.
   406	 * @param {string} a
   407	 * @param {string} b
   408	 * @returns {number}
   409	 */
   410	function compareSeverity(a, b) {
   411	  const order = { P0: 3, P1: 2, P2: 1 };
   412	  return (order[a] || 0) - (order[b] || 0);
   413	}
   414	
   415	/**
   416	 * Recalculate board stats from current state.
   417	 * @param {object} board
   418	 */
   419	function recalculateStats(board) {
   420	  if (!board || typeof board !== 'object') return null;
   421	  const segments = board.segments || [];
   422	  board.stats = {
   423	    totalSegments: segments.length,
   424	    completedSegments: segments.filter(s => s.status === 'completed').length,
   425	    prunedSegments: segments.filter(s => s.status === 'pruned').length,
   426	    failedSegments: segments.filter(s => s.status === 'failed').length,
   427	    totalFindings: (board.findings || []).length,
   428	    promotedFindings: (board.promotions || []).length,
   429	    duplicateFindings: (board.dedupeLog || []).length,
   430	    conflictFindings: (board.conflicts || []).length,
   431	  };
   432	  return board.stats;
   433	}
   434	
   435	/* ---------------------------------------------------------------
   436	   7. EXPORTS
   437	----------------------------------------------------------------*/
   438	
   439	module.exports = {
   440	  // Constants
   441	  BOARD_STATUSES,
   442	  FINDING_MERGE_STATES,
   443	  // Board operations
   444	  createBoard,
   445	  updateBoard,
   446	  // Finding operations
   447	  buildFindingRecord,
   448	  mergeFinding,
   449	  // Dashboard
   450	  renderDashboard,
   451	  // Helpers
   452	  generateFindingId,
   453	  recalculateStats,
   454	  compareSeverity,
   455	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs | sed -n '261,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	'use strict';
     2	
     3	// ---------------------------------------------------------------
     4	// MODULE: Wave Segment State (T003, T-WE-NEW-4)
     5	// ---------------------------------------------------------------
     6	// Per-segment state management, JSONL lineage, and merge helpers
     7	// keyed by explicit segment identifiers.
     8	//
     9	// Segment artifacts remain replayable on their own. Merged records
    10	// always include explicit keys: sessionId, generation, segment,
    11	// wave, and findingId. Merge logic never relies on append order.
    12	// ---------------------------------------------------------------
    13	
    14	/* ---------------------------------------------------------------
    15	   1. CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	/**
    19	 * Required keys for every JSONL merge record.
    20	 * Merge correctness is keyed by these fields, not append order.
    21	 * @type {ReadonlyArray<string>}
    22	 */
    23	const MERGE_KEYS = Object.freeze([
    24	  'sessionId',
    25	  'generation',
    26	  'segment',
    27	  'wave',
    28	  'findingId',
    29	]);
    30	
    31	/**
    32	 * Valid segment state statuses.
    33	 * @type {ReadonlyArray<string>}
    34	 */
    35	const SEGMENT_STATE_STATUSES = Object.freeze([
    36	  'initialized',
    37	  'running',
    38	  'converged',
    39	  'pruned',
    40	  'failed',
    41	  'completed',
    42	]);
    43	
    44	/**
    45	 * Check whether a value is a non-empty string.
    46	 * @param {unknown} value
    47	 * @returns {boolean}
    48	 */
    49	function isNonEmptyString(value) {
    50	  return typeof value === 'string' && value.trim().length > 0;
    51	}
    52	
    53	/* ---------------------------------------------------------------
    54	   2. SEGMENT STATE CREATION
    55	----------------------------------------------------------------*/
    56	
    57	/**
    58	 * Create a per-segment state object.
    59	 *
    60	 * @param {string} segmentId - Unique segment identifier
    61	 * @param {object} config - Segment configuration
    62	 * @param {string} config.sessionId - Parent session identifier
    63	 * @param {number} [config.generation] - Generation counter
    64	 * @param {string} [config.waveId] - Wave identifier
    65	 * @param {'review'|'research'} [config.loopType] - Loop type
    66	 * @param {Array<string>} [config.files] - Files in this segment (review)
    67	 * @param {Array<string>} [config.domains] - Domains in this segment (research)
    68	 * @returns {object} Segment state object
    69	 */
    70	function createSegmentState(segmentId, config) {
    71	  if (!isNonEmptyString(segmentId)) {
    72	    return null;
    73	  }
    74	  if (!config || !isNonEmptyString(config.sessionId)) {
    75	    return null;
    76	  }
    77	
    78	  const now = new Date().toISOString();
    79	
    80	  return {
    81	    segmentId,
    82	    sessionId: config.sessionId,
    83	    generation: typeof config.generation === 'number' ? config.generation : 1,
    84	    waveId: config.waveId || null,
    85	    loopType: config.loopType || 'review',
    86	    status: 'initialized',
    87	    createdAt: now,
    88	    updatedAt: now,
    89	    // Scope
    90	    files: Array.isArray(config.files) ? [...config.files] : [],
    91	    domains: Array.isArray(config.domains) ? [...config.domains] : [],
    92	    // Findings with explicit keys
    93	    findings: [],
    94	    // Iteration tracking
    95	    iterations: [],
    96	    iterationCount: 0,
    97	    // Convergence state
    98	    convergenceScore: 0,
    99	    convergedAt: null,
   100	    // JSONL records for this segment
   101	    jsonlRecords: [],
   102	  };
   103	}
   104	
   105	/* ---------------------------------------------------------------
   106	   3. JSONL RECORD MANAGEMENT
   107	----------------------------------------------------------------*/
   108	
   109	/**
   110	 * Create a JSONL record with explicit merge keys.
   111	 * Every record includes sessionId, generation, segment, wave, and findingId.
   112	 *
   113	 * @param {object} data - Record data
   114	 * @param {object} segmentState - Segment state for key extraction
   115	 * @returns {object} JSONL record with all merge keys
   116	 */
   117	function createJsonlRecord(data, segmentState) {
   118	  if (!data || typeof data !== 'object') {
   119	    return null;
   120	  }
   121	  if (!segmentState || !segmentState.segmentId) {
   122	    return null;
   123	  }
   124	
   125	  return {
   126	    // Explicit merge keys (MERGE-KEYED rule)
   127	    sessionId: segmentState.sessionId,
   128	    generation: segmentState.generation,
   129	    segment: segmentState.segmentId,
   130	    wave: segmentState.waveId || null,
   131	    findingId: data.findingId || null,
   132	    // Record content
   133	    type: data.type || 'finding',
   134	    timestamp: data.timestamp || new Date().toISOString(),
   135	    ...data,
   136	    // Re-assert ALL 5 merge keys after spread to prevent override
   137	    sessionId: segmentState.sessionId,
   138	    generation: segmentState.generation,
   139	    segment: segmentState.segmentId,
   140	    wave: segmentState.waveId || null,
   141	    findingId: data.findingId || null,
   142	  };
   143	}
   144	
   145	/**
   146	 * Append a JSONL record to a segment state.
   147	 *
   148	 * @param {object} segmentState - Target segment state
   149	 * @param {object} record - JSONL record (should have merge keys)
   150	 * @returns {object} The appended record
   151	 */
   152	function appendRecord(segmentState, record) {
   153	  if (!segmentState || !Array.isArray(segmentState.jsonlRecords)) {
   154	    return null;
   155	  }
   156	  if (!record || typeof record !== 'object') return null;
   157	
   158	  // Ensure merge keys are present
   159	  const enriched = {
   160	    ...record,
   161	    sessionId: record.sessionId || segmentState.sessionId,
   162	    generation: record.generation || segmentState.generation,
   163	    segment: record.segment || segmentState.segmentId,
   164	    wave: record.wave || segmentState.waveId || null,
   165	  };
   166	
   167	  segmentState.jsonlRecords.push(enriched);
   168	  segmentState.updatedAt = new Date().toISOString();
   169	
   170	  return enriched;
   171	}
   172	
   173	/* ---------------------------------------------------------------
   174	   4. STATE MERGE
   175	----------------------------------------------------------------*/
   176	
   177	/**
   178	 * Merge multiple segment states into a combined result.
   179	 * Uses explicit keys for deduplication and conflict detection.
   180	 *
   181	 * @param {Array<object>} states - Array of segment state objects
   182	 * @param {string} [mergeStrategy='dedupe'] - Merge strategy: 'dedupe' or 'concat'
   183	 * @returns {{ merged: object, conflicts: Array<object>, dedupeLog: Array<object> }}
   184	 */
   185	function mergeSegmentStates(states, mergeStrategy) {
   186	  if (!Array.isArray(states) || states.length === 0) {
   187	    return { merged: null, conflicts: [], dedupeLog: [] };
   188	  }
   189	
   190	  const strategy = mergeStrategy || 'dedupe';
   191	  const findingMap = new Map();
   192	  const conflicts = [];
   193	  const dedupeLog = [];
   194	  const allRecords = [];
   195	
   196	  for (const state of states) {
   197	    if (!state) continue;
   198	
   199	    // Merge findings
   200	    for (const finding of (state.findings || [])) {
   201	      const key = finding.findingId || buildMergeKey(finding);
   202	
   203	      if (findingMap.has(key)) {
   204	        const existing = findingMap.get(key);
   205	
   206	        if (strategy === 'dedupe') {
   207	          // Check for conflicts
   208	          if (existing.severity !== finding.severity) {
   209	            conflicts.push({
   210	              findingId: key,
   211	              existingSegment: existing.segment || existing.segmentId,
   212	              newSegment: state.segmentId,
   213	              existingSeverity: existing.severity,
   214	              newSeverity: finding.severity,
   215	              resolution: 'keep-higher',
   216	            });
   217	
   218	            // Keep higher severity
   219	            if (compareSeverity(finding.severity, existing.severity) > 0) {
   220	              findingMap.set(key, {
   221	                ...finding,
   222	                provenance: {
   223	                  sourceSegment: state.segmentId,
   224	                  promotedFrom: existing.segment || existing.segmentId,
   225	                },
   226	              });
   227	            }
   228	          } else {
   229	            dedupeLog.push({
   230	              findingId: key,
   231	              duplicateSegment: state.segmentId,
   232	              originalSegment: existing.segment || existing.segmentId,
   233	            });
   234	          }
   235	        } else {
   236	          // concat: keep all
   237	          findingMap.set(`${key}::${state.segmentId}`, {
   238	            ...finding,
   239	            provenance: { sourceSegment: state.segmentId },
   240	          });
   241	        }
   242	      } else {
   243	        findingMap.set(key, {
   244	          ...finding,
   245	          provenance: { sourceSegment: state.segmentId },
   246	        });
   247	      }
   248	    }
   249	
   250	    // Collect all JSONL records sorted by explicit keys
   251	    for (const record of (state.jsonlRecords || [])) {
   252	      allRecords.push(record);
   253	    }
   254	  }
   255	
   256	  // Sort merged records by all 5 merge keys, not append order
   257	  allRecords.sort((a, b) => {
   258	    // Sort by sessionId, generation, segment, wave, findingId (then timestamp as tiebreaker)
   259	    if ((a.sessionId || '') !== (b.sessionId || '')) return (a.sessionId || '').localeCompare(b.sessionId || '');
   260	    if ((a.generation || 0) !== (b.generation || 0)) return (a.generation || 0) - (b.generation || 0);

 succeeded in 0ms:
   261	    if ((a.segment || '') !== (b.segment || '')) return (a.segment || '').localeCompare(b.segment || '');
   262	    if ((a.wave || '') !== (b.wave || '')) return (a.wave || '').localeCompare(b.wave || '');
   263	    if ((a.findingId || '') !== (b.findingId || '')) return (a.findingId || '').localeCompare(b.findingId || '');
   264	    return (a.timestamp || '').localeCompare(b.timestamp || '');
   265	  });
   266	
   267	  return {
   268	    merged: {
   269	      findings: Array.from(findingMap.values()),
   270	      jsonlRecords: allRecords,
   271	      totalSegments: states.length,
   272	      mergeStrategy: strategy,
   273	      mergedAt: new Date().toISOString(),
   274	    },
   275	    conflicts,
   276	    dedupeLog,
   277	  };
   278	}
   279	
   280	/* ---------------------------------------------------------------
   281	   5. SERIALIZATION
   282	----------------------------------------------------------------*/
   283	
   284	/**
   285	 * Serialize segment state JSONL records to a string.
   286	 * Each record is a single JSON line.
   287	 *
   288	 * @param {object} segmentState - Segment state object
   289	 * @returns {string} JSONL string
   290	 */
   291	function serializeJsonl(segmentState) {
   292	  if (!segmentState || !Array.isArray(segmentState.jsonlRecords)) {
   293	    return '';
   294	  }
   295	
   296	  return segmentState.jsonlRecords
   297	    .map(record => JSON.stringify(record))
   298	    .join('\n');
   299	}
   300	
   301	/**
   302	 * Parse JSONL string into records array.
   303	 * Validates that each record has the required merge keys.
   304	 *
   305	 * @param {string} jsonlString - JSONL content
   306	 * @returns {{ records: Array<object>, errors: Array<{ line: number, error: string }> }}
   307	 */
   308	function parseJsonl(jsonlString) {
   309	  if (!jsonlString || typeof jsonlString !== 'string') {
   310	    return { records: [], errors: [], validationErrors: [] };
   311	  }
   312	
   313	  const lines = jsonlString.split('\n').filter(l => l.trim());
   314	  const records = [];
   315	  const errors = [];
   316	  const validationErrors = [];
   317	
   318	  for (let i = 0; i < lines.length; i++) {
   319	    try {
   320	      const record = JSON.parse(lines[i]);
   321	
   322	      // Validate that all 5 merge keys exist
   323	      const missingKeys = MERGE_KEYS.filter(key => !(key in record));
   324	      if (missingKeys.length > 0) {
   325	        validationErrors.push({
   326	          line: i + 1,
   327	          error: `Missing merge keys: ${missingKeys.join(', ')}`,
   328	          missingKeys,
   329	        });
   330	        continue; // Skip records with missing merge keys
   331	      }
   332	
   333	      records.push(record);
   334	    } catch (e) {
   335	      errors.push({ line: i + 1, error: e.message });
   336	    }
   337	  }
   338	
   339	  return { records, errors, validationErrors };
   340	}
   341	
   342	/**
   343	 * Validate that a record has all required merge keys.
   344	 *
   345	 * @param {object} record - JSONL record to validate
   346	 * @returns {{ valid: boolean, missingKeys: Array<string> }}
   347	 */
   348	function validateMergeKeys(record) {
   349	  if (!record || typeof record !== 'object') {
   350	    return { valid: false, missingKeys: [...MERGE_KEYS] };
   351	  }
   352	
   353	  const missingKeys = MERGE_KEYS.filter(key => !(key in record));
   354	
   355	  return {
   356	    valid: missingKeys.length === 0,
   357	    missingKeys,
   358	  };
   359	}
   360	
   361	/* ---------------------------------------------------------------
   362	   6. HELPERS
   363	----------------------------------------------------------------*/
   364	
   365	/**
   366	 * Build a merge key from finding fields when findingId is absent.
   367	 * @param {object} finding
   368	 * @returns {string}
   369	 */
   370	function buildMergeKey(finding) {
   371	  const file = finding.file || finding.filePath || '';
   372	  const line = finding.line || finding.lineNumber || 0;
   373	  const title = finding.title || finding.summary || '';
   374	  return `${file}:${line}::${title}`.toLowerCase().replace(/\s+/g, '_');
   375	}
   376	
   377	/**
   378	 * Compare severity levels. Returns >0 if a is higher.
   379	 * @param {string} a
   380	 * @param {string} b
   381	 * @returns {number}
   382	 */
   383	function compareSeverity(a, b) {
   384	  const order = { P0: 3, P1: 2, P2: 1 };
   385	  return (order[a] || 0) - (order[b] || 0);
   386	}
   387	
   388	/* ---------------------------------------------------------------
   389	   7. EXPORTS
   390	----------------------------------------------------------------*/
   391	
   392	module.exports = {
   393	  // Constants
   394	  MERGE_KEYS,
   395	  SEGMENT_STATE_STATUSES,
   396	  // State management
   397	  createSegmentState,
   398	  // JSONL records
   399	  createJsonlRecord,
   400	  appendRecord,
   401	  // Merge
   402	  mergeSegmentStates,
   403	  // Serialization
   404	  serializeJsonl,
   405	  parseJsonl,
   406	  validateMergeKeys,
   407	  // Helpers
   408	  buildMergeKey,
   409	  compareSeverity,
   410	};

codex
I’ve finished the first code pass through the five shared modules. I’m on the validation step now: reading the wave Vitest suites to see which edge cases are actually covered and to confirm whether the suspicious paths I found are real gaps or intentionally constrained behavior.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const lifecycle = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs',
    13	)) as {
    14	  canFanOut: (engine: any) => any;
    15	  createWaveContext: (target: string, loopType: 'review' | 'research', opts?: any) => any;
    16	  dispatchWave: (segments: any[], config: any) => any;
    17	  joinWave: (results: any[], strategy?: string) => any;
    18	  advancePhase: (ctx: any, phase: string) => any;
    19	  isWaveComplete: (dispatches: any[]) => boolean;
    20	};
    21	
    22	const planner = require(path.join(
    23	  WORKSPACE_ROOT,
    24	  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs',
    25	)) as {
    26	  shouldActivateReviewWave: (files: any[], metrics?: any) => any;
    27	  shouldActivateResearchWave: (domains: any[], metrics?: any) => any;
    28	  generateHotspotInventory: (files: any[]) => any;
    29	  segmentForReview: (inv: any, config?: any) => any[];
    30	};
    31	
    32	const board = require(path.join(
    33	  WORKSPACE_ROOT,
    34	  '.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs',
    35	)) as {
    36	  createBoard: (opts: any) => any;
    37	  updateBoard: (board: any, results: any[]) => any;
    38	};
    39	
    40	const convergence = require(path.join(
    41	  WORKSPACE_ROOT,
    42	  '.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs',
    43	)) as {
    44	  evaluateWaveConvergence: (board: any, signals: any, threshold?: number) => any;
    45	  shouldPruneSegment: (segment: any, signals: any, threshold?: number) => any;
    46	  evaluateSegmentConvergence: (state: any, opts?: any) => any;
    47	};
    48	
    49	const segState = require(path.join(
    50	  WORKSPACE_ROOT,
    51	  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs',
    52	)) as {
    53	  createSegmentState: (id: string, config: any) => any;
    54	  appendRecord: (state: any, record: any) => any;
    55	  mergeSegmentStates: (states: any[], strategy?: string) => any;
    56	};
    57	
    58	/* ---------------------------------------------------------------
    59	   RESUME AND DEFAULT-PATH REGRESSION TESTS
    60	----------------------------------------------------------------*/
    61	
    62	describe('wave-resume', () => {
    63	
    64	  describe('resume after partial wave completion', () => {
    65	    it('preserves previously merged segment lineage', () => {
    66	      // Simulate a partial wave: 2 of 3 segments completed
    67	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
    68	
    69	      // First two segments complete
    70	      board.updateBoard(b, [
    71	        { segmentId: 'seg-1', status: 'completed', findings: [{ findingId: 'f1', title: 'A', severity: 'P1' }] },
    72	        { segmentId: 'seg-2', status: 'completed', findings: [{ findingId: 'f2', title: 'B', severity: 'P2' }] },
    73	      ]);
    74	
    75	      expect(b.segments.length).toBe(2);
    76	      expect(b.findings.length).toBe(2);
    77	
    78	      // On resume: third segment completes
    79	      board.updateBoard(b, [
    80	        { segmentId: 'seg-3', status: 'completed', findings: [{ findingId: 'f3', title: 'C', severity: 'P0' }] },
    81	      ]);
    82	
    83	      // All three segments present, previous findings intact
    84	      expect(b.segments.length).toBe(3);
    85	      expect(b.findings.length).toBe(3);
    86	      // Previously merged findings unchanged
    87	      expect(b.findings.find((f: any) => f.findingId === 'f1')).toBeDefined();
    88	      expect(b.findings.find((f: any) => f.findingId === 'f2')).toBeDefined();
    89	    });
    90	
    91	    it('only resumes incomplete segments', () => {
    92	      const dispatches = [
    93	        { dispatchId: 'd1', segmentId: 'seg-1', status: 'completed' },
    94	        { dispatchId: 'd2', segmentId: 'seg-2', status: 'running' },
    95	        { dispatchId: 'd3', segmentId: 'seg-3', status: 'pending' },
    96	      ];
    97	
    98	      expect(lifecycle.isWaveComplete(dispatches)).toBe(false);
    99	
   100	      // Identify incomplete segments
   101	      const incomplete = dispatches.filter(d => d.status !== 'completed' && d.status !== 'pruned' && d.status !== 'converged' && d.status !== 'failed');
   102	      expect(incomplete.length).toBe(2);
   103	      expect(incomplete.map(d => d.segmentId)).toEqual(['seg-2', 'seg-3']);
   104	    });
   105	  });
   106	
   107	  describe('segment state merge preserves provenance after resume', () => {
   108	    it('merged state includes provenance from all segments', () => {
   109	      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
   110	      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1', segment: 'seg-1' }];
   111	
   112	      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
   113	      s2.findings = [{ findingId: 'f2', title: 'Issue', severity: 'P2', segment: 'seg-2' }];
   114	
   115	      const result = segState.mergeSegmentStates([s1, s2]);
   116	      expect(result.merged.findings.length).toBe(2);
   117	      expect(result.merged.findings[0].provenance.sourceSegment).toBeDefined();
   118	      expect(result.merged.findings[1].provenance.sourceSegment).toBeDefined();
   119	    });
   120	  });
   121	
   122	  describe('convergence after partial wave', () => {
   123	    it('does not converge while segments remain incomplete', () => {
   124	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
   125	      const result = convergence.evaluateWaveConvergence(b, {
   126	        segmentStates: [
   127	          { convergenceScore: 0.98 },
   128	          { convergenceScore: 0.01 },
   129	        ],
   130	        crossSegmentNovelty: 0.02,
   131	        gapCoverage: 0.95,
   132	      });
   133	
   134	      expect(result.converged).toBe(false);
   135	      expect(result.blockedBy.length).toBeGreaterThan(0);
   136	    });
   137	
   138	    it('converges when all segments pass threshold', () => {
   139	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
   140	      const result = convergence.evaluateWaveConvergence(b, {
   141	        segmentStates: [
   142	          { convergenceScore: 0.98 },
   143	          { convergenceScore: 0.97 },
   144	        ],
   145	        crossSegmentNovelty: 0.02,
   146	        gapCoverage: 0.98,
   147	      });
   148	
   149	      expect(result.converged).toBe(true);
   150	      expect(result.blockedBy.length).toBe(0);
   151	    });
   152	  });
   153	
   154	  describe('segment pruning during wave', () => {
   155	    it('allows pruning a converged segment without stopping global wave', () => {
   156	      const segment = { segmentId: 'seg-1', status: 'running' };
   157	      const pruneResult = convergence.shouldPruneSegment(segment, {
   158	        convergenceScore: 0.98,
   159	        stuckCount: 0,
   160	      });
   161	
   162	      expect(pruneResult.shouldPrune).toBe(true);
   163	      expect(pruneResult.pruneType).toBe('converged');
   164	    });
   165	
   166	    it('allows pruning a stuck segment', () => {
   167	      const segment = { segmentId: 'seg-2', status: 'running' };
   168	      const pruneResult = convergence.shouldPruneSegment(segment, {
   169	        convergenceScore: 0.1,
   170	        stuckCount: 4,
   171	      });
   172	
   173	      expect(pruneResult.shouldPrune).toBe(true);
   174	      expect(pruneResult.pruneType).toBe('stuck');
   175	    });
   176	
   177	    it('does not prune an active segment below threshold', () => {
   178	      const segment = { segmentId: 'seg-3', status: 'running' };
   179	      const pruneResult = convergence.shouldPruneSegment(segment, {
   180	        convergenceScore: 0.3,
   181	        stuckCount: 1,
   182	      });
   183	
   184	      expect(pruneResult.shouldPrune).toBe(false);
   185	    });
   186	
   187	    it('skips pruning for already-terminal segments', () => {
   188	      const segment = { segmentId: 'seg-4', status: 'completed' };
   189	      const pruneResult = convergence.shouldPruneSegment(segment, {
   190	        convergenceScore: 0.99,
   191	        stuckCount: 10,
   192	      });
   193	
   194	      expect(pruneResult.shouldPrune).toBe(false);
   195	    });
   196	  });
   197	});
   198	
   199	/* ---------------------------------------------------------------
   200	   DEFAULT-PATH REGRESSION TESTS
   201	----------------------------------------------------------------*/
   202	
   203	describe('wave-default-path-regression', () => {
   204	
   205	  describe('small targets stay sequential', () => {
   206	    it('review with <1000 files does not activate wave', () => {
   207	      const files = Array.from({ length: 500 }, (_, i) => ({
   208	        path: `src/file${i}.ts`,
   209	        complexity: 5,
   210	        churnRate: 0.5,
   211	        issueCount: 0,
   212	      }));
   213	      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.5 });
   214	      expect(result.activate).toBe(false);
   215	    });
   216	
   217	    it('research with <50 domains does not activate wave', () => {
   218	      const domains = Array.from({ length: 30 }, (_, i) => ({
   219	        domain: `domain${i}.com`,
   220	        authority: 0.5,
   221	        cluster: `c-${i % 5}`,
   222	      }));
   223	      const result = planner.shouldActivateResearchWave(domains, { clusterDiversity: 0.5 });
   224	      expect(result.activate).toBe(false);
   225	    });
   226	  });
   227	
   228	  describe('fan-out proof fallback', () => {
   229	    it('when fan-out is not proven, wave mode stays blocked', () => {
   230	      const proof = lifecycle.canFanOut({});
   231	      expect(proof.canFanOut).toBe(false);
   232	      expect(proof.maxParallel).toBe(0);
   233	
   234	      // Without fan-out proof, wave context can still be created
   235	      // but dispatch should not proceed
   236	      const ctx = lifecycle.createWaveContext('test', 'review');
   237	      expect(ctx.phase).toBe('prepass');
   238	      // Attempting to advance to fan-out should be blocked by
   239	      // the orchestrator checking canFanOut first
   240	    });
   241	  });
   242	
   243	  describe('large target with no spread stays sequential', () => {
   244	    it('1000+ files but low hotspot spread does not activate', () => {
   245	      const files = Array.from({ length: 1500 }, (_, i) => ({
   246	        path: `src/single-dir/file${i}.ts`,
   247	        complexity: 1,
   248	        churnRate: 0,
   249	        issueCount: 0,
   250	      }));
   251	      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.05 });
   252	      expect(result.activate).toBe(false);
   253	      expect(result.reason).toContain('spread');
   254	    });
   255	  });
   256	
   257	  describe('segment convergence evaluation', () => {
   258	    it('requires minimum iterations before convergence', () => {
   259	      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
   260	      state.iterations = [{ newInfoRatio: 0.01, status: 'evidence' }];
   261	
   262	      const result = convergence.evaluateSegmentConvergence(state);
   263	      expect(result.converged).toBe(false);
   264	      expect(result.iterationCount).toBe(1);
   265	    });
   266	
   267	    it('converges after sufficient low-ratio iterations', () => {
   268	      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
   269	      state.iterations = [
   270	        { newInfoRatio: 0.2, status: 'evidence' },
   271	        { newInfoRatio: 0.1, status: 'evidence' },
   272	        { newInfoRatio: 0.02, status: 'evidence' },
   273	        { newInfoRatio: 0.01, status: 'evidence' },
   274	        { newInfoRatio: 0.01, status: 'evidence' },
   275	      ];
   276	
   277	      const result = convergence.evaluateSegmentConvergence(state, { threshold: 0.05 });
   278	      expect(result.converged).toBe(true);
   279	      expect(result.score).toBeGreaterThan(0);
   280	    });
   281	  });
   282	});

 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const planner = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs',
    13	)) as {
    14	  REVIEW_FILE_THRESHOLD: number;
    15	  RESEARCH_DOMAIN_THRESHOLD: number;
    16	  DEFAULT_SEGMENT_SIZE_REVIEW: number;
    17	  DEFAULT_SEGMENT_SIZE_RESEARCH: number;
    18	  HOTSPOT_SPREAD_THRESHOLD: number;
    19	  CLUSTER_DIVERSITY_THRESHOLD: number;
    20	  MAX_SEGMENTS_DEFAULT: number;
    21	  shouldActivateReviewWave: (files: object[], metrics?: { hotspotSpread?: number }) => { activate: boolean; reason: string; fileCount: number; hotspotSpread: number };
    22	  shouldActivateResearchWave: (domains: object[], metrics?: { clusterDiversity?: number }) => { activate: boolean; reason: string; domainCount: number; clusterDiversity: number };
    23	  generateHotspotInventory: (files: object[], metrics?: object) => { files: object[]; directories: object[]; totalFiles: number; version: string };
    24	  generateDomainLedger: (sources: object[], metrics?: object) => { domains: object[]; clusters: object[]; totalDomains: number; version: string };
    25	  segmentForReview: (inventory: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
    26	  segmentForResearch: (ledger: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
    27	  extractDirectory: (filePath: string) => string;
    28	  computeHotspotSpread: (files: object[]) => number;
    29	  computeClusterDiversity: (domains: object[]) => number;
    30	};
    31	
    32	/* ---------------------------------------------------------------
    33	   HELPERS
    34	----------------------------------------------------------------*/
    35	
    36	function makeFiles(count: number, opts: { spread?: boolean } = {}): Array<{ path: string; complexity: number; churnRate: number; issueCount: number }> {
    37	  const files = [];
    38	  const dirs = opts.spread ? Math.max(10, Math.floor(count / 50)) : 3;
    39	  for (let i = 0; i < count; i++) {
    40	    const dirIdx = i % dirs;
    41	    files.push({
    42	      path: `src/dir${dirIdx}/file${i}.ts`,
    43	      complexity: (i % 10) + 1,
    44	      churnRate: (i % 5) * 0.2,
    45	      issueCount: i % 3,
    46	    });
    47	  }
    48	  return files;
    49	}
    50	
    51	function makeDomains(count: number, opts: { diverse?: boolean } = {}): Array<{ domain: string; authority: number; cluster: string; topics: string[] }> {
    52	  const domains = [];
    53	  const clusters = opts.diverse ? Math.max(10, Math.floor(count / 5)) : 2;
    54	  for (let i = 0; i < count; i++) {
    55	    const clusterIdx = i % clusters;
    56	    domains.push({
    57	      domain: `source${i}.example.com`,
    58	      authority: 0.3 + (i % 7) * 0.1,
    59	      cluster: `cluster-${clusterIdx}`,
    60	      topics: [`topic-${i % 4}`],
    61	    });
    62	  }
    63	  return domains;
    64	}
    65	
    66	/* ---------------------------------------------------------------
    67	   TESTS
    68	----------------------------------------------------------------*/
    69	
    70	describe('wave-segment-planner', () => {
    71	
    72	  describe('constants', () => {
    73	    it('exports expected thresholds', () => {
    74	      expect(planner.REVIEW_FILE_THRESHOLD).toBe(1000);
    75	      expect(planner.RESEARCH_DOMAIN_THRESHOLD).toBe(50);
    76	      expect(planner.DEFAULT_SEGMENT_SIZE_REVIEW).toBe(200);
    77	      expect(planner.DEFAULT_SEGMENT_SIZE_RESEARCH).toBe(10);
    78	    });
    79	  });
    80	
    81	  describe('activation gates', () => {
    82	    it('rejects review scope below 1000 files', () => {
    83	      const files = makeFiles(500, { spread: true });
    84	      const result = planner.shouldActivateReviewWave(files);
    85	      expect(result.activate).toBe(false);
    86	      expect(result.fileCount).toBe(500);
    87	    });
    88	
    89	    it('rejects review scope with low hotspot spread', () => {
    90	      const files = makeFiles(1200, { spread: false });
    91	      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.05 });
    92	      expect(result.activate).toBe(false);
    93	    });
    94	
    95	    it('activates review for 1000+ files with spread', () => {
    96	      const files = makeFiles(1200, { spread: true });
    97	      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.25 });
    98	      expect(result.activate).toBe(true);
    99	      expect(result.fileCount).toBe(1200);
   100	    });
   101	
   102	    it('rejects research scope below 50 domains', () => {
   103	      const domains = makeDomains(30, { diverse: true });
   104	      const result = planner.shouldActivateResearchWave(domains);
   105	      expect(result.activate).toBe(false);
   106	      expect(result.domainCount).toBe(30);
   107	    });
   108	
   109	    it('activates research for 50+ domains with cluster diversity', () => {
   110	      const domains = makeDomains(60, { diverse: true });
   111	      const result = planner.shouldActivateResearchWave(domains, { clusterDiversity: 0.30 });
   112	      expect(result.activate).toBe(true);
   113	      expect(result.domainCount).toBe(60);
   114	    });
   115	  });
   116	
   117	  describe('hotspot inventory (generateHotspotInventory)', () => {
   118	    it('returns empty inventory for null input', () => {
   119	      const inv = planner.generateHotspotInventory(null as any);
   120	      expect(inv.files).toEqual([]);
   121	      expect(inv.version).toBe('v1');
   122	    });
   123	
   124	    it('scores and ranks files by hotspot score descending', () => {
   125	      const files = [
   126	        { path: 'src/a.ts', complexity: 10, churnRate: 5, issueCount: 3 },
   127	        { path: 'src/b.ts', complexity: 1, churnRate: 0, issueCount: 0 },
   128	        { path: 'src/c.ts', complexity: 5, churnRate: 3, issueCount: 1 },
   129	      ];
   130	      const inv = planner.generateHotspotInventory(files);
   131	      expect(inv.files.length).toBe(3);
   132	      // Highest score should be first
   133	      expect((inv.files[0] as any).path).toBe('src/a.ts');
   134	      // Lowest score should be last
   135	      expect((inv.files[2] as any).path).toBe('src/b.ts');
   136	    });
   137	
   138	    it('groups directories and ranks by total score', () => {
   139	      const files = [
   140	        { path: 'src/hot/a.ts', complexity: 10, churnRate: 5, issueCount: 3 },
   141	        { path: 'src/hot/b.ts', complexity: 8, churnRate: 4, issueCount: 2 },
   142	        { path: 'src/cold/c.ts', complexity: 1, churnRate: 0, issueCount: 0 },
   143	      ];
   144	      const inv = planner.generateHotspotInventory(files);
   145	      expect(inv.directories.length).toBe(2);
   146	      expect((inv.directories[0] as any).directory).toBe('src/hot');
   147	    });
   148	
   149	    it('produces deterministic output for identical inputs', () => {
   150	      const files = makeFiles(100, { spread: true });
   151	      const inv1 = planner.generateHotspotInventory(files);
   152	      const inv2 = planner.generateHotspotInventory(files);
   153	      // Compare file order (ignoring timestamps)
   154	      const paths1 = inv1.files.map((f: any) => f.path);
   155	      const paths2 = inv2.files.map((f: any) => f.path);
   156	      expect(paths1).toEqual(paths2);
   157	    });
   158	  });
   159	
   160	  describe('domain ledger (generateDomainLedger)', () => {
   161	    it('returns empty ledger for null input', () => {
   162	      const ledger = planner.generateDomainLedger(null as any);
   163	      expect(ledger.domains).toEqual([]);
   164	      expect(ledger.version).toBe('v1');
   165	    });
   166	
   167	    it('ranks domains by authority descending', () => {
   168	      const sources = [
   169	        { domain: 'low.example.com', authority: 0.2, cluster: 'a' },
   170	        { domain: 'high.example.com', authority: 0.9, cluster: 'b' },
   171	        { domain: 'mid.example.com', authority: 0.5, cluster: 'a' },
   172	      ];
   173	      const ledger = planner.generateDomainLedger(sources);
   174	      expect(ledger.domains.length).toBe(3);
   175	      expect((ledger.domains[0] as any).domain).toBe('high.example.com');
   176	    });
   177	
   178	    it('groups domains by cluster', () => {
   179	      const sources = [
   180	        { domain: 'a1.com', authority: 0.5, cluster: 'alpha' },
   181	        { domain: 'b1.com', authority: 0.8, cluster: 'beta' },
   182	        { domain: 'a2.com', authority: 0.6, cluster: 'alpha' },
   183	      ];
   184	      const ledger = planner.generateDomainLedger(sources);
   185	      expect(ledger.clusters.length).toBe(2);
   186	    });
   187	
   188	    it('produces deterministic output for identical inputs', () => {
   189	      const sources = makeDomains(50, { diverse: true });
   190	      const ledger1 = planner.generateDomainLedger(sources);
   191	      const ledger2 = planner.generateDomainLedger(sources);
   192	      const domains1 = ledger1.domains.map((d: any) => d.domain);
   193	      const domains2 = ledger2.domains.map((d: any) => d.domain);
   194	      expect(domains1).toEqual(domains2);
   195	    });
   196	  });
   197	
   198	  describe('review segmentation (segmentForReview)', () => {
   199	    it('returns empty array for null inventory', () => {
   200	      expect(planner.segmentForReview(null as any)).toEqual([]);
   201	    });
   202	
   203	    it('assigns stable segment IDs', () => {
   204	      const inv = planner.generateHotspotInventory(makeFiles(500, { spread: true }));
   205	      const segments = planner.segmentForReview(inv, { segmentSize: 100 });
   206	      expect(segments.length).toBeGreaterThan(0);
   207	      for (const seg of segments) {
   208	        expect((seg as any).segmentId).toMatch(/^review-seg-\d{3}$/);
   209	      }
   210	    });
   211	
   212	    it('respects segment size limits', () => {
   213	      const inv = planner.generateHotspotInventory(makeFiles(500, { spread: true }));
   214	      const segments = planner.segmentForReview(inv, { segmentSize: 100 });
   215	      for (const seg of segments) {
   216	        expect((seg as any).fileCount).toBeLessThanOrEqual(200); // directory packing may slightly exceed
   217	      }
   218	    });
   219	
   220	    it('produces deterministic segments for identical inputs', () => {
   221	      const inv = planner.generateHotspotInventory(makeFiles(300, { spread: true }));
   222	      const seg1 = planner.segmentForReview(inv, { segmentSize: 100 });
   223	      const seg2 = planner.segmentForReview(inv, { segmentSize: 100 });
   224	      const ids1 = seg1.map((s: any) => s.segmentId);
   225	      const ids2 = seg2.map((s: any) => s.segmentId);
   226	      expect(ids1).toEqual(ids2);
   227	    });
   228	  });
   229	
   230	  describe('research segmentation (segmentForResearch)', () => {
   231	    it('returns empty array for null ledger', () => {
   232	      expect(planner.segmentForResearch(null as any)).toEqual([]);
   233	    });
   234	
   235	    it('assigns stable segment IDs', () => {
   236	      const ledger = planner.generateDomainLedger(makeDomains(60, { diverse: true }));
   237	      const segments = planner.segmentForResearch(ledger, { segmentSize: 10 });
   238	      expect(segments.length).toBeGreaterThan(0);
   239	      for (const seg of segments) {
   240	        expect((seg as any).segmentId).toMatch(/^research-seg-\d{3}$/);
   241	      }
   242	    });
   243	
   244	    it('produces deterministic segments for identical inputs', () => {
   245	      const ledger = planner.generateDomainLedger(makeDomains(60, { diverse: true }));
   246	      const seg1 = planner.segmentForResearch(ledger, { segmentSize: 10 });
   247	      const seg2 = planner.segmentForResearch(ledger, { segmentSize: 10 });
   248	      const ids1 = seg1.map((s: any) => s.segmentId);
   249	      const ids2 = seg2.map((s: any) => s.segmentId);
   250	      expect(ids1).toEqual(ids2);
   251	    });
   252	  });
   253	
   254	  describe('helpers', () => {
   255	    it('extractDirectory works for nested paths', () => {
   256	      expect(planner.extractDirectory('src/lib/file.ts')).toBe('src/lib');
   257	      expect(planner.extractDirectory('file.ts')).toBe('.');
   258	      expect(planner.extractDirectory('')).toBe('');
   259	    });
   260	
   261	    it('computeHotspotSpread returns 0 for empty input', () => {
   262	      expect(planner.computeHotspotSpread([])).toBe(0);
   263	    });
   264	
   265	    it('computeClusterDiversity returns 0 for empty input', () => {
   266	      expect(planner.computeClusterDiversity([])).toBe(0);
   267	    });
   268	  });
   269	});

 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const lifecycle = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs',
    13	)) as {
    14	  LIFECYCLE_PHASES: ReadonlyArray<string>;
    15	  SEGMENT_STATUSES: ReadonlyArray<string>;
    16	  MAX_PARALLEL_SEGMENTS: number;
    17	  MERGE_STRATEGIES: Readonly<Record<string, string>>;
    18	  canFanOut: (engine: { hasNativeParallel?: boolean; hasHelperOrchestration?: boolean }) => { canFanOut: boolean; method: string; proof: string; maxParallel: number };
    19	  createWaveContext: (target: string, loopType: 'review' | 'research', options?: { sessionId?: string; generation?: number }) => object;
    20	  dispatchWave: (segments: object[], config: { sessionId: string; generation?: number; waveNumber: number; maxParallel?: number }) => { waveId: string; dispatches: object[]; timestamp: string; totalSegments: number; activeSegments: number; deferredSegments: number };
    21	  joinWave: (results: object[], mergeStrategy?: string) => { merged: object[]; conflicts: object[]; stats: object };
    22	  advancePhase: (ctx: any, phase: string) => { success: boolean; previousPhase: string; currentPhase: string; error?: string };
    23	  isWaveComplete: (dispatches: object[]) => boolean;
    24	  buildFindingKey: (finding: object) => string;
    25	  compareSeverity: (a: string, b: string) => number;
    26	};
    27	
    28	/* ---------------------------------------------------------------
    29	   TESTS
    30	----------------------------------------------------------------*/
    31	
    32	describe('wave-lifecycle', () => {
    33	
    34	  describe('constants', () => {
    35	    it('exports lifecycle phases in correct order', () => {
    36	      expect(lifecycle.LIFECYCLE_PHASES).toEqual([
    37	        'prepass', 'plan', 'fan-out', 'prune', 'promote', 'join', 'merge',
    38	      ]);
    39	    });
    40	
    41	    it('exports segment statuses', () => {
    42	      expect(lifecycle.SEGMENT_STATUSES).toContain('pending');
    43	      expect(lifecycle.SEGMENT_STATUSES).toContain('completed');
    44	      expect(lifecycle.SEGMENT_STATUSES).toContain('pruned');
    45	    });
    46	
    47	    it('lifecycle phases are frozen', () => {
    48	      expect(Object.isFrozen(lifecycle.LIFECYCLE_PHASES)).toBe(true);
    49	    });
    50	  });
    51	
    52	  describe('fan-out/join proof (canFanOut)', () => {
    53	    it('returns false for null input', () => {
    54	      const result = lifecycle.canFanOut(null as any);
    55	      expect(result.canFanOut).toBe(false);
    56	      expect(result.method).toBe('none');
    57	    });
    58	
    59	    it('returns true for helper orchestration', () => {
    60	      const result = lifecycle.canFanOut({ hasHelperOrchestration: true });
    61	      expect(result.canFanOut).toBe(true);
    62	      expect(result.method).toBe('helper-module');
    63	      expect(result.maxParallel).toBe(lifecycle.MAX_PARALLEL_SEGMENTS);
    64	    });
    65	
    66	    it('returns true for native parallel', () => {
    67	      const result = lifecycle.canFanOut({ hasNativeParallel: true });
    68	      expect(result.canFanOut).toBe(true);
    69	      expect(result.method).toBe('native');
    70	    });
    71	
    72	    it('prefers helper orchestration over native', () => {
    73	      const result = lifecycle.canFanOut({ hasHelperOrchestration: true, hasNativeParallel: true });
    74	      expect(result.method).toBe('helper-module');
    75	    });
    76	
    77	    it('returns false when neither capability exists', () => {
    78	      const result = lifecycle.canFanOut({});
    79	      expect(result.canFanOut).toBe(false);
    80	    });
    81	  });
    82	
    83	  describe('createWaveContext', () => {
    84	    it('creates a valid review context', () => {
    85	      const ctx = lifecycle.createWaveContext('my-repo', 'review') as any;
    86	      expect(ctx.target).toBe('my-repo');
    87	      expect(ctx.loopType).toBe('review');
    88	      expect(ctx.phase).toBe('prepass');
    89	      expect(ctx.status).toBe('initialized');
    90	      expect(ctx.sessionId).toMatch(/^wave-/);
    91	    });
    92	
    93	    it('creates a valid research context', () => {
    94	      const ctx = lifecycle.createWaveContext('ml-papers', 'research', { generation: 2 }) as any;
    95	      expect(ctx.loopType).toBe('research');
    96	      expect(ctx.generation).toBe(2);
    97	    });
    98	
    99	    it('returns null for empty target', () => {
   100	      expect(lifecycle.createWaveContext('', 'review')).toBeNull();
   101	    });
   102	
   103	    it('returns null for invalid loop type', () => {
   104	      expect(lifecycle.createWaveContext('test', 'invalid' as any)).toBeNull();
   105	    });
   106	  });
   107	
   108	  describe('dispatchWave', () => {
   109	    it('dispatches segments with unique IDs', () => {
   110	      const segments = [
   111	        { segmentId: 'seg-001' },
   112	        { segmentId: 'seg-002' },
   113	        { segmentId: 'seg-003' },
   114	      ];
   115	      const result = lifecycle.dispatchWave(segments, {
   116	        sessionId: 'test-session',
   117	        waveNumber: 1,
   118	      });
   119	      expect(result.dispatches.length).toBe(3);
   120	      expect(result.waveId).toBe('test-session-w1');
   121	      expect(result.totalSegments).toBe(3);
   122	      expect(result.deferredSegments).toBe(0);
   123	    });
   124	
   125	    it('caps dispatches to maxParallel', () => {
   126	      const segments = Array.from({ length: 15 }, (_, i) => ({ segmentId: `seg-${i}` }));
   127	      const result = lifecycle.dispatchWave(segments, {
   128	        sessionId: 'test',
   129	        waveNumber: 1,
   130	        maxParallel: 5,
   131	      });
   132	      expect(result.activeSegments).toBe(5);
   133	      expect(result.deferredSegments).toBe(10);
   134	    });
   135	
   136	    it('returns null for empty segments', () => {
   137	      expect(lifecycle.dispatchWave([], { sessionId: 's', waveNumber: 1 })).toBeNull();
   138	    });
   139	
   140	    it('returns null for missing config', () => {
   141	      expect(lifecycle.dispatchWave([{ segmentId: 'x' }], null as any)).toBeNull();
   142	    });
   143	  });
   144	
   145	  describe('joinWave', () => {
   146	    it('merges findings from multiple segments', () => {
   147	      const results = [
   148	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
   149	        { segmentId: 'seg-2', findings: [{ findingId: 'f2', title: 'Bug B', severity: 'P0' }] },
   150	      ];
   151	      const joined = lifecycle.joinWave(results);
   152	      expect(joined.merged.length).toBe(2);
   153	      expect(joined.conflicts.length).toBe(0);
   154	    });
   155	
   156	    it('deduplicates findings with same findingId', () => {
   157	      const results = [
   158	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
   159	        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
   160	      ];
   161	      const joined = lifecycle.joinWave(results, 'dedupe');
   162	      expect(joined.merged.length).toBe(1);
   163	      expect(joined.conflicts.length).toBe(1);
   164	      expect((joined.conflicts[0] as any).reason).toBe('dedupe');
   165	    });
   166	
   167	    it('promotes higher severity in priority mode', () => {
   168	      const results = [
   169	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2' }] },
   170	        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0' }] },
   171	      ];
   172	      const joined = lifecycle.joinWave(results, 'priority');
   173	      expect(joined.merged.length).toBe(1);
   174	      expect((joined.merged[0] as any).severity).toBe('P0');
   175	      expect((joined.merged[0] as any).mergeState).toBe('promoted');
   176	    });
   177	
   178	    it('keeps all findings in concat mode', () => {
   179	      const results = [
   180	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
   181	        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
   182	      ];
   183	      const joined = lifecycle.joinWave(results, 'concat');
   184	      expect(joined.merged.length).toBe(2);
   185	    });
   186	
   187	    it('handles empty results gracefully', () => {
   188	      const joined = lifecycle.joinWave([]);
   189	      expect(joined.merged.length).toBe(0);
   190	      expect((joined.stats as any).totalInput).toBe(0);
   191	    });
   192	  });
   193	
   194	  describe('advancePhase', () => {
   195	    it('advances forward through lifecycle', () => {
   196	      const ctx = lifecycle.createWaveContext('test', 'review') as any;
   197	      const r1 = lifecycle.advancePhase(ctx, 'plan');
   198	      expect(r1.success).toBe(true);
   199	      expect(r1.previousPhase).toBe('prepass');
   200	      expect(r1.currentPhase).toBe('plan');
   201	      expect(ctx.phase).toBe('plan');
   202	    });
   203	
   204	    it('rejects backward transitions', () => {
   205	      const ctx = lifecycle.createWaveContext('test', 'review') as any;
   206	      lifecycle.advancePhase(ctx, 'fan-out');
   207	      const r2 = lifecycle.advancePhase(ctx, 'plan');
   208	      expect(r2.success).toBe(false);
   209	      expect(r2.error).toContain('Cannot transition backward');
   210	    });
   211	
   212	    it('rejects invalid phases', () => {
   213	      const ctx = lifecycle.createWaveContext('test', 'review') as any;
   214	      const r = lifecycle.advancePhase(ctx, 'invalid-phase');
   215	      expect(r.success).toBe(false);
   216	    });
   217	  });
   218	
   219	  describe('isWaveComplete', () => {
   220	    it('returns true for all-completed dispatches', () => {
   221	      const dispatches = [
   222	        { status: 'completed' },
   223	        { status: 'pruned' },
   224	        { status: 'converged' },
   225	      ];
   226	      expect(lifecycle.isWaveComplete(dispatches)).toBe(true);
   227	    });
   228	
   229	    it('returns false when dispatches are still running', () => {
   230	      const dispatches = [
   231	        { status: 'completed' },
   232	        { status: 'running' },
   233	      ];
   234	      expect(lifecycle.isWaveComplete(dispatches)).toBe(false);
   235	    });
   236	
   237	    it('returns true for empty array', () => {
   238	      expect(lifecycle.isWaveComplete([])).toBe(true);
   239	    });
   240	  });
   241	
   242	  describe('helpers', () => {
   243	    it('buildFindingKey uses findingId when available', () => {
   244	      expect(lifecycle.buildFindingKey({ findingId: 'abc' })).toBe('abc');
   245	    });
   246	
   247	    it('buildFindingKey builds from file:line:title', () => {
   248	      const key = lifecycle.buildFindingKey({ file: 'src/a.ts', line: 42, title: 'Bug Here' });
   249	      expect(key).toContain('src/a.ts');
   250	      expect(key).toContain('42');
   251	    });
   252	
   253	    it('compareSeverity ranks P0 > P1 > P2', () => {
   254	      expect(lifecycle.compareSeverity('P0', 'P1')).toBeGreaterThan(0);
   255	      expect(lifecycle.compareSeverity('P1', 'P2')).toBeGreaterThan(0);
   256	      expect(lifecycle.compareSeverity('P2', 'P0')).toBeLessThan(0);
   257	      expect(lifecycle.compareSeverity('P1', 'P1')).toBe(0);
   258	    });
   259	  });
   260	});

 succeeded in 0ms:
     1	import path from 'node:path';
     2	import { createRequire } from 'node:module';
     3	import { fileURLToPath } from 'node:url';
     4	import { describe, expect, it } from 'vitest';
     5	
     6	const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
     7	const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
     8	const require = createRequire(import.meta.url);
     9	
    10	const board = require(path.join(
    11	  WORKSPACE_ROOT,
    12	  '.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs',
    13	)) as {
    14	  BOARD_STATUSES: ReadonlyArray<string>;
    15	  FINDING_MERGE_STATES: ReadonlyArray<string>;
    16	  createBoard: (opts: { sessionId: string; generation?: number; loopType: string; target?: string }) => any;
    17	  updateBoard: (board: any, results: any[]) => any;
    18	  buildFindingRecord: (finding: any, segmentId: string, board: any) => any;
    19	  mergeFinding: (board: any, record: any) => void;
    20	  renderDashboard: (board: any) => string;
    21	  generateFindingId: (finding: any, segmentId: string) => string;
    22	  recalculateStats: (board: any) => void;
    23	  compareSeverity: (a: string, b: string) => number;
    24	};
    25	
    26	const segState = require(path.join(
    27	  WORKSPACE_ROOT,
    28	  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs',
    29	)) as {
    30	  MERGE_KEYS: ReadonlyArray<string>;
    31	  SEGMENT_STATE_STATUSES: ReadonlyArray<string>;
    32	  createSegmentState: (id: string, config: { sessionId: string; generation?: number; waveId?: string; loopType?: string; files?: string[]; domains?: string[] }) => any;
    33	  createJsonlRecord: (data: any, state: any) => any;
    34	  appendRecord: (state: any, record: any) => any;
    35	  mergeSegmentStates: (states: any[], strategy?: string) => { merged: any; conflicts: any[]; dedupeLog: any[] };
    36	  serializeJsonl: (state: any) => string;
    37	  parseJsonl: (jsonl: string) => { records: any[]; errors: any[] };
    38	  validateMergeKeys: (record: any) => { valid: boolean; missingKeys: string[] };
    39	  buildMergeKey: (finding: any) => string;
    40	  compareSeverity: (a: string, b: string) => number;
    41	};
    42	
    43	/* ---------------------------------------------------------------
    44	   COORDINATION BOARD TESTS
    45	----------------------------------------------------------------*/
    46	
    47	describe('wave-coordination-board', () => {
    48	
    49	  describe('createBoard', () => {
    50	    it('creates a board with required fields', () => {
    51	      const b = board.createBoard({ sessionId: 'sess-1', loopType: 'review', target: 'my-repo' });
    52	      expect(b.schema).toBe('wave-board-v1');
    53	      expect(b.sessionId).toBe('sess-1');
    54	      expect(b.loopType).toBe('review');
    55	      expect(b.status).toBe('initialized');
    56	      expect(b.findings).toEqual([]);
    57	      expect(b.conflicts).toEqual([]);
    58	    });
    59	
    60	    it('throws for missing sessionId', () => {
    61	      expect(board.createBoard({ loopType: 'review' } as any)).toBeNull();
    62	    });
    63	
    64	    it('throws for invalid loopType', () => {
    65	      expect(board.createBoard({ sessionId: 's', loopType: 'invalid' } as any)).toBeNull();
    66	    });
    67	  });
    68	
    69	  describe('updateBoard', () => {
    70	    it('adds segment results to board', () => {
    71	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
    72	      board.updateBoard(b, [
    73	        { segmentId: 'seg-1', status: 'completed', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
    74	      ]);
    75	      expect(b.segments.length).toBe(1);
    76	      expect(b.findings.length).toBe(1);
    77	      expect(b.stats.totalFindings).toBe(1);
    78	    });
    79	
    80	    it('deduplicates identical findings', () => {
    81	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
    82	      board.updateBoard(b, [
    83	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1', evidence: 'e1' }] },
    84	        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1', evidence: 'e1' }] },
    85	      ]);
    86	      expect(b.findings.length).toBe(1);
    87	      expect(b.dedupeLog.length).toBe(1);
    88	    });
    89	
    90	    it('detects conflicts for different severity on same findingId', () => {
    91	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
    92	      board.updateBoard(b, [
    93	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2', evidence: 'e1' }] },
    94	        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0', evidence: 'e2' }] },
    95	      ]);
    96	      expect(b.conflicts.length).toBe(1);
    97	      expect(b.promotions.length).toBe(1);
    98	      // The promoted finding should now be P0
    99	      const promoted = b.findings.find((f: any) => f.findingId === 'f1');
   100	      expect(promoted.severity).toBe('P0');
   101	    });
   102	
   103	    it('preserves merge history for every operation', () => {
   104	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
   105	      board.updateBoard(b, [
   106	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'A', severity: 'P1' }] },
   107	        { segmentId: 'seg-2', findings: [{ findingId: 'f2', title: 'B', severity: 'P2' }] },
   108	      ]);
   109	      expect(b.mergeHistory.length).toBe(2);
   110	      for (const entry of b.mergeHistory) {
   111	        expect(entry).toHaveProperty('findingId');
   112	        expect(entry).toHaveProperty('segment');
   113	        expect(entry).toHaveProperty('mergeState');
   114	        expect(entry).toHaveProperty('timestamp');
   115	      }
   116	    });
   117	  });
   118	
   119	  describe('buildFindingRecord', () => {
   120	    it('attaches all explicit merge keys', () => {
   121	      const b = board.createBoard({ sessionId: 's1', generation: 2, loopType: 'review' });
   122	      const record = board.buildFindingRecord(
   123	        { findingId: 'f1', title: 'Bug', severity: 'P1' },
   124	        'seg-1',
   125	        b,
   126	      );
   127	      expect(record.sessionId).toBe('s1');
   128	      expect(record.generation).toBe(2);
   129	      expect(record.segment).toBe('seg-1');
   130	      expect(record.findingId).toBe('f1');
   131	      expect(record.mergeState).toBe('original');
   132	      expect(record.provenance.sourceSegment).toBe('seg-1');
   133	    });
   134	
   135	    it('generates deterministic findingId when absent', () => {
   136	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
   137	      const r1 = board.buildFindingRecord({ title: 'Bug', file: 'a.ts', line: 10 }, 'seg-1', b);
   138	      const r2 = board.buildFindingRecord({ title: 'Bug', file: 'a.ts', line: 10 }, 'seg-1', b);
   139	      expect(r1.findingId).toBe(r2.findingId);
   140	    });
   141	  });
   142	
   143	  describe('renderDashboard', () => {
   144	    it('renders markdown for empty board', () => {
   145	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
   146	      const md = board.renderDashboard(b);
   147	      expect(md).toContain('# Wave Execution Dashboard');
   148	      expect(md).toContain('Do not edit manually');
   149	    });
   150	
   151	    it('renders segments and conflicts when present', () => {
   152	      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
   153	      board.updateBoard(b, [
   154	        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2', evidence: 'e1' }] },
   155	        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0', evidence: 'e2' }] },
   156	      ]);
   157	      const md = board.renderDashboard(b);
   158	      expect(md).toContain('seg-1');
   159	      expect(md).toContain('seg-2');
   160	      expect(md).toContain('## Conflicts');
   161	      expect(md).toContain('## Promotions');
   162	    });
   163	
   164	    it('returns fallback for null board', () => {
   165	      const md = board.renderDashboard(null);
   166	      expect(md).toContain('No board data available');
   167	    });
   168	  });
   169	});
   170	
   171	/* ---------------------------------------------------------------
   172	   SEGMENT STATE + JSONL MERGE TESTS
   173	----------------------------------------------------------------*/
   174	
   175	describe('wave-segment-state', () => {
   176	
   177	  describe('MERGE_KEYS', () => {
   178	    it('contains exactly 5 required keys', () => {
   179	      expect(segState.MERGE_KEYS).toEqual(['sessionId', 'generation', 'segment', 'wave', 'findingId']);
   180	    });
   181	  });
   182	
   183	  describe('createSegmentState', () => {
   184	    it('creates state with required fields', () => {
   185	      const s = segState.createSegmentState('seg-1', { sessionId: 'sess-1', files: ['a.ts'] });
   186	      expect(s.segmentId).toBe('seg-1');
   187	      expect(s.sessionId).toBe('sess-1');
   188	      expect(s.status).toBe('initialized');
   189	      expect(s.files).toEqual(['a.ts']);
   190	      expect(s.jsonlRecords).toEqual([]);
   191	    });
   192	
   193	    it('throws for empty segmentId', () => {
   194	      expect(segState.createSegmentState('', { sessionId: 's' })).toBeNull();
   195	    });
   196	
   197	    it('throws for missing sessionId', () => {
   198	      expect(segState.createSegmentState('seg-1', {} as any)).toBeNull();
   199	    });
   200	  });
   201	
   202	  describe('createJsonlRecord', () => {
   203	    it('attaches all merge keys from segment state', () => {
   204	      const state = segState.createSegmentState('seg-1', { sessionId: 's1', generation: 2, waveId: 'w1' });
   205	      const record = segState.createJsonlRecord({ type: 'finding', findingId: 'f1' }, state);
   206	      expect(record.sessionId).toBe('s1');
   207	      expect(record.generation).toBe(2);
   208	      expect(record.segment).toBe('seg-1');
   209	      expect(record.wave).toBe('w1');
   210	      expect(record.findingId).toBe('f1');
   211	    });
   212	  });
   213	
   214	  describe('appendRecord', () => {
   215	    it('appends record to segment state', () => {
   216	      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
   217	      segState.appendRecord(state, { type: 'iteration', findingId: null });
   218	      expect(state.jsonlRecords.length).toBe(1);
   219	      expect(state.jsonlRecords[0].sessionId).toBe('s1');
   220	      expect(state.jsonlRecords[0].segment).toBe('seg-1');
   221	    });
   222	  });
   223	
   224	  describe('mergeSegmentStates', () => {
   225	    it('merges findings from multiple segments', () => {
   226	      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
   227	      s1.findings = [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }];
   228	
   229	      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
   230	      s2.findings = [{ findingId: 'f2', title: 'Bug B', severity: 'P2' }];
   231	
   232	      const result = segState.mergeSegmentStates([s1, s2]);
   233	      expect(result.merged.findings.length).toBe(2);
   234	      expect(result.conflicts.length).toBe(0);
   235	    });
   236	
   237	    it('deduplicates findings with same ID', () => {
   238	      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
   239	      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1' }];
   240	
   241	      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
   242	      s2.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1' }];
   243	
   244	      const result = segState.mergeSegmentStates([s1, s2], 'dedupe');
   245	      expect(result.merged.findings.length).toBe(1);
   246	      expect(result.dedupeLog.length).toBe(1);
   247	    });
   248	
   249	    it('detects severity conflicts and keeps higher', () => {
   250	      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
   251	      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P2' }];
   252	
   253	      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
   254	      s2.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P0' }];
   255	
   256	      const result = segState.mergeSegmentStates([s1, s2], 'dedupe');
   257	      expect(result.conflicts.length).toBe(1);
   258	      expect(result.merged.findings[0].severity).toBe('P0');
   259	    });
   260	
   261	    it('sorts JSONL records by explicit keys, not append order', () => {
   262	      const s1 = segState.createSegmentState('seg-2', { sessionId: 's1', generation: 1 });
   263	      segState.appendRecord(s1, { type: 'iter', timestamp: '2026-01-02T00:00:00Z' });
   264	
   265	      const s2 = segState.createSegmentState('seg-1', { sessionId: 's1', generation: 1 });
   266	      segState.appendRecord(s2, { type: 'iter', timestamp: '2026-01-01T00:00:00Z' });
   267	
   268	      const result = segState.mergeSegmentStates([s1, s2]);
   269	      // seg-1 should come before seg-2 (sorted by segment name)
   270	      expect(result.merged.jsonlRecords[0].segment).toBe('seg-1');
   271	      expect(result.merged.jsonlRecords[1].segment).toBe('seg-2');
   272	    });
   273	
   274	    it('returns null merged for empty input', () => {
   275	      const result = segState.mergeSegmentStates([]);
   276	      expect(result.merged).toBeNull();
   277	    });
   278	  });
   279	
   280	  describe('JSONL serialization', () => {
   281	    it('serializes and parses round-trip', () => {
   282	      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
   283	      segState.appendRecord(state, { type: 'finding', findingId: 'f1' });
   284	      segState.appendRecord(state, { type: 'iteration', findingId: null });
   285	
   286	      const jsonl = segState.serializeJsonl(state);
   287	      const parsed = segState.parseJsonl(jsonl);
   288	      expect(parsed.records.length).toBe(2);
   289	      expect(parsed.errors.length).toBe(0);
   290	    });
   291	
   292	    it('handles malformed JSONL lines', () => {
   293	      const jsonl = [
   294	        '{"sessionId":"s1","generation":1,"segment":"seg-1","wave":"w1","findingId":"f1","valid":true}',
   295	        'not json',
   296	        '{"sessionId":"s1","generation":1,"segment":"seg-1","wave":"w1","findingId":"f2","also":"valid"}',
   297	      ].join('\n');
   298	      const parsed = segState.parseJsonl(jsonl);
   299	      expect(parsed.records.length).toBe(2);
   300	      expect(parsed.errors.length).toBe(1);
   301	      expect(parsed.errors[0].line).toBe(2);
   302	    });
   303	  });
   304	
   305	  describe('validateMergeKeys', () => {
   306	    it('passes for complete record', () => {
   307	      const result = segState.validateMergeKeys({
   308	        sessionId: 's1', generation: 1, segment: 'seg-1', wave: 'w1', findingId: 'f1',
   309	      });
   310	      expect(result.valid).toBe(true);
   311	      expect(result.missingKeys).toEqual([]);
   312	    });
   313	
   314	    it('fails for incomplete record', () => {
   315	      const result = segState.validateMergeKeys({ sessionId: 's1' });
   316	      expect(result.valid).toBe(false);
   317	      expect(result.missingKeys).toContain('generation');
   318	      expect(result.missingKeys).toContain('segment');
   319	    });
   320	

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Tasks: Wave Executor [042.003]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "042.003"
  - "tasks"
  - "wave executor"
  - "segment planner"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### or T-WE-NEW-N [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the fan-out/join proof path before implementing any wave-mode runtime work.
- Confirm whether the task touches planner logic, workflow lifecycle, or merge verification.
- Confirm the exact large-target trigger being implemented for research or review.
- Confirm whether the task belongs to v1 heuristic segmentation or v2 graph-enhanced segmentation.
- Confirm which mandatory prepass artifact must exist before dispatch.
- Confirm how segment provenance will be preserved after merge.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `FANOUT-PROVEN` | No wave-execution task may proceed past design until fan-out/join capability is proven. |
| `REQ-LINKED` | Every task must map to at least one wave-executor requirement. |
| `LEAF-SAFE` | No task may move orchestration responsibilities into LEAF workers. |
| `SEGMENT-DETERMINISTIC` | Segment identity and order must be reproducible from the same inputs. |
| `GATED-ACTIVATION` | Wave mode must activate only for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity. |
| `BOARD-MACHINE-FIRST` | `board.json` is reducer-owned and the dashboard is derived; neither is a human-maintained strategy surface. |
| `MERGE-KEYED` | Merge contracts must key by `sessionId`, `generation`, `segment`, `wave`, and `findingId`, not append order. |
| `MERGE-AUDITABLE` | Segment merge must preserve provenance, dedupe, and conflict metadata. |

### Status Reporting Format
- `pending`: task has not started and still fits the current phase scope.
- `in-progress`: implementation or validation is underway.
- `blocked`: a dependency such as graph convergence or merge semantics is unresolved.
- `completed`: implementation and verification are both complete.

### Blocked Task Protocol
- If fan-out/join is unproven on the current YAML engine, block all wave-execution work beyond prototype or proof tasks.
- If Phase 002 graph convergence is not ready, block prune/promote work instead of inventing stop heuristics.
- If Phase 002 coverage graph is not operational, block v2 graph-enhanced segmentation and stay on v1 heuristic planning.
- If segment IDs are unstable between replay runs, block merge tasks until planner determinism is restored.
- If wave mode begins to alter the default small-target path, block release until the routing boundary is corrected.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Fan-Out/Join Proof

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T-WE-NEW-1 | Completed | REQ-000, REQ-002 | `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |

- [x] T-WE-NEW-1 Prototype or implement workflow fan-out/join capability so wave execution has a proven orchestration path before any wave-mode runtime build proceeds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### v1 Deterministic Heuristic Segmentation

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T001 | Completed | REQ-001 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/references/loop_protocol.md` |
| T002 | Completed | REQ-001, REQ-006 | `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json` |
| T003 | Completed | REQ-003, REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |
| T-WE-NEW-2 | Completed | REQ-007 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/references/loop_protocol.md` |
| T-WE-NEW-3 | Completed | REQ-007 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md` |
| T-WE-NEW-4 | Completed | REQ-004 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |
| T-WE-NEW-5 | Completed | REQ-006 | `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md` |

- [x] T001 Define v1 deterministic heuristic segmentation for review files and research domains, keeping segment identity and ordering reproducible.
- [x] T002 Add segment-plan versioning, activation-gate configuration, and strategy surfaces for research and review.
- [x] T003 Define reducer-owned `board.json`, a derived dashboard render, and segment-state artifact contracts.
- [x] T-WE-NEW-2 Build `hotspot-inventory.json` generation for review with file ranking, directory clusters, and coverage priorities.
- [x] T-WE-NEW-3 Build `domain-ledger.json` generation for research with source domains, authority levels, and cluster assignments.
- [x] T-WE-NEW-4 Define the JSONL merge contract with explicit key ordering and keyed dedupe semantics.
- [x] T-WE-NEW-5 Add activation gates so wave mode only activates for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Phase 2b: Graph-Enhanced Segmentation and Lifecycle Integration

### v2 Graph-Enhanced Segmentation and Wave Lifecycle

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T004 | Completed | REQ-002 | `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| T005 | Completed | REQ-005 | `.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| T006 | Completed | REQ-003, REQ-008 | `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` |
| T007 | Completed | REQ-006 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json` |
| T008 | Completed | REQ-006 | `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` |
| T009 | Completed | REQ-004, REQ-008 | `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-review/references/state_format.md` |

- [x] T004 Implement the shared wave lifecycle manager for fan-out, join, prune, promote, and merge transitions once T-WE-NEW-1 is proven.
- [x] T005 Wrap Phase 002 graph signals for per-segment convergence, pruning, and v2 graph-enhanced segmentation.
- [x] T006 Add reducer-owned coordination-board updates for conflicts, dedupe, promoted findings, `board.json`, and derived dashboard rendering.
- [x] T007 Wire research command and workflow surfaces for activation-gated wave mode.
- [x] T008 Wire review command and workflow surfaces for activation-gated wave mode.
- [x] T009 Implement segment JSONL lineage and deterministic merge helpers keyed by explicit identifiers.
<!-- /ANCHOR:phase-3 -->

---

## Phase 3: Verification

### Merge Proof and Recovery Hardening

| Task ID | Status | Parent REQ | Files |
|---------|--------|------------|-------|
| T010 | Completed | REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts` |
| T011 | Completed | REQ-004, REQ-008, REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs` |
| T012 | Completed | REQ-006, REQ-009 | `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |

- [x] T010 Create planner and lifecycle tests for fan-out/join proof, deterministic v1 segmentation, and gated wave transitions.
- [x] T011 Create merge tests that prove explicit-key provenance, dedupe, and conflict metadata survive repeated merges without trusting append order.
- [x] T012 Create resume and default-path regression tests so wave mode stays bounded to large-target execution and falls back cleanly when prerequisites are missing.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task remains mapped to a wave-executor requirement and concrete file set.
- [x] Fan-out/join proof remains a hard prerequisite for all wave-mode execution work.
- [x] Wave orchestration stays outside LEAF worker responsibilities.
- [x] Segment provenance, dedupe, and conflict tracking survive merge.
- [x] `board.json` remains reducer-owned and the dashboard remains derived.
- [x] Default single-stream deep research and deep review remain intact.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Decision Record: Wave Executor [042.003]"
description: "Accepted architecture decision for orchestrator-managed wave execution in deep research and deep review."
trigger_phrases:
  - "042.003"
  - "decision record"
  - "wave executor"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep parallelism at the orchestrator layer with a reducer-owned execution ledger

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Packet 042 closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed a way to handle very large review and research targets without asking the deep-loop worker agents to become managers of their own child fleets. The current YAML workflow engine also has no native fan-out/join support, so any wave model had to prove a safe orchestration path before it could be treated as buildable. Once segments exist, merge behavior also has to preserve lineage, conflicts, and dedupe state without trusting append order or human-maintained notes.

### Constraints

- LEAF agents had to stay non-spawning workers.
- Sequential mode had to remain the default path for ordinary targets.
- Packet-local traceability had to survive retries, resume, and repeated merges.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep parallelism at the orchestrator layer, require a proven fan-out/join path before wave-mode runtime wiring proceeds, and make `board.json` the reducer-owned execution ledger for keyed merge behavior.

**How it works**: Shared lifecycle helpers own segmentation, dispatch, prune/promote decisions, join behavior, and merge. Research and review workers remain focused on their local segment work, while the reducer-owned board tracks segment status, promoted findings, dedupe markers, and conflicts and the human-facing dashboard remains a derived render.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Orchestrator-managed waves with a reducer-owned board and keyed merge** | Keeps worker responsibilities clean, preserves lineage, and stays auditable under retries | Requires explicit orchestration helpers and prerequisite proof work | 9/10 |
| Let LEAF workers spawn child agents | Flexible in theory | Breaks the product contract and makes packet lineage much harder to audit | 3/10 |
| Keep large targets strictly sequential | Simplest execution model | Fails the scale problem this phase exists to solve | 5/10 |

**Why this one**: It solves the scale problem while staying closest to the repo's existing architectural boundaries and preserving deterministic merge behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Wave execution gains a clear lifecycle owner and prerequisite proof path.
- Merge behavior stays deterministic and explainable through explicit keys and reducer-owned state.
- Resume logic can target incomplete segment work without corrupting previously merged lineage.

**What it costs**:
- The orchestration layer becomes a new shared runtime surface. Mitigation: keep it explicit, tested, and phase-scoped.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fan-out/join proof is weaker than expected | H | Treat proof work as the first blocker before lifecycle integration |
| Wave mode leaks into small-target defaults | M | Gate activation behind explicit large-target criteria |
| Conflict state is flattened during merge | H | Keep conflict and dedupe metadata on the board and in merged outputs |
| Derived reporting is mistaken for canonical state | M | Use "derived dashboard render" language consistently across the phase docs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Large-target sequential execution was the explicit problem to solve |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include worker-spawning, sequential-only, and explicit keyed orchestration |
| 3 | **Sufficient?** | PASS | Shared orchestration plus a reducer-owned board is enough without changing worker identity |
| 4 | **Fits Goal?** | PASS | The decision stays inside the phase scope and handoff goals |
| 5 | **Open Horizons?** | PASS | Later replay and optimizer work can consume stable wave traces without redesigning workers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add wave planner, lifecycle, convergence, segment-state, and coordination-board helpers
- Keep command/workflow docs explicit about the fan-out/join prerequisite and activation gates
- Update docs and workflows so merge, prune, promote, and resume use the keyed lineage contract

**How to roll back**: Disable wave-mode routing, keep segment helpers unused, preserve board artifacts for debugging, and return to sequential packet execution without mutating canonical single-stream state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

exec
/bin/zsh -lc "rg -n \"dispatchWave|joinWave|advancePhase|isWaveComplete|evaluateWaveConvergence|shouldPruneSegment|evaluateSegmentConvergence|segmentForReview|segmentForResearch|shouldActivateReviewWave|shouldActivateResearchWave|updateBoard|mergeSegmentStates\" .opencode/command .opencode/skill/system-spec-kit/scripts .opencode/skill/sk-deep-review .opencode/skill/sk-deep-research | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:185:function mergeSegmentStates(states, mergeStrategy) {
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs:402:  mergeSegmentStates,
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:172:function dispatchWave(segments, config) {
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:234:function joinWave(results, mergeStrategy) {
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:328:function advancePhase(waveContext, targetPhase) {
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:369: * @param {Array<object>} dispatches - Dispatch records from dispatchWave
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:372:function isWaveComplete(dispatches) {
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:428:  dispatchWave,
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:429:  joinWave,
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:431:  advancePhase,
.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:432:  isWaveComplete,
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:20:  dispatchWave: (segments: object[], config: { sessionId: string; generation?: number; waveNumber: number; maxParallel?: number }) => { waveId: string; dispatches: object[]; timestamp: string; totalSegments: number; activeSegments: number; deferredSegments: number };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:21:  joinWave: (results: object[], mergeStrategy?: string) => { merged: object[]; conflicts: object[]; stats: object };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:22:  advancePhase: (ctx: any, phase: string) => { success: boolean; previousPhase: string; currentPhase: string; error?: string };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:23:  isWaveComplete: (dispatches: object[]) => boolean;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:108:  describe('dispatchWave', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:115:      const result = lifecycle.dispatchWave(segments, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:127:      const result = lifecycle.dispatchWave(segments, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:137:      expect(lifecycle.dispatchWave([], { sessionId: 's', waveNumber: 1 })).toBeNull();
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:141:      expect(lifecycle.dispatchWave([{ segmentId: 'x' }], null as any)).toBeNull();
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:145:  describe('joinWave', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:151:      const joined = lifecycle.joinWave(results);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:161:      const joined = lifecycle.joinWave(results, 'dedupe');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:172:      const joined = lifecycle.joinWave(results, 'priority');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:183:      const joined = lifecycle.joinWave(results, 'concat');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:188:      const joined = lifecycle.joinWave([]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:194:  describe('advancePhase', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:197:      const r1 = lifecycle.advancePhase(ctx, 'plan');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:206:      lifecycle.advancePhase(ctx, 'fan-out');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:207:      const r2 = lifecycle.advancePhase(ctx, 'plan');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:214:      const r = lifecycle.advancePhase(ctx, 'invalid-phase');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:219:  describe('isWaveComplete', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:226:      expect(lifecycle.isWaveComplete(dispatches)).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:234:      expect(lifecycle.isWaveComplete(dispatches)).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:238:      expect(lifecycle.isWaveComplete([])).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:17:  updateBoard: (board: any, results: any[]) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:35:  mergeSegmentStates: (states: any[], strategy?: string) => { merged: any; conflicts: any[]; dedupeLog: any[] };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:69:  describe('updateBoard', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:72:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:82:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:92:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:105:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:153:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:224:  describe('mergeSegmentStates', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:232:      const result = segState.mergeSegmentStates([s1, s2]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:244:      const result = segState.mergeSegmentStates([s1, s2], 'dedupe');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:256:      const result = segState.mergeSegmentStates([s1, s2], 'dedupe');
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:268:      const result = segState.mergeSegmentStates([s1, s2]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts:275:      const result = segState.mergeSegmentStates([]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:21:  shouldActivateReviewWave: (files: object[], metrics?: { hotspotSpread?: number }) => { activate: boolean; reason: string; fileCount: number; hotspotSpread: number };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:22:  shouldActivateResearchWave: (domains: object[], metrics?: { clusterDiversity?: number }) => { activate: boolean; reason: string; domainCount: number; clusterDiversity: number };
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:25:  segmentForReview: (inventory: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:26:  segmentForResearch: (ledger: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:84:      const result = planner.shouldActivateReviewWave(files);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:91:      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.05 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:97:      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.25 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:104:      const result = planner.shouldActivateResearchWave(domains);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:111:      const result = planner.shouldActivateResearchWave(domains, { clusterDiversity: 0.30 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:198:  describe('review segmentation (segmentForReview)', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:200:      expect(planner.segmentForReview(null as any)).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:205:      const segments = planner.segmentForReview(inv, { segmentSize: 100 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:214:      const segments = planner.segmentForReview(inv, { segmentSize: 100 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:222:      const seg1 = planner.segmentForReview(inv, { segmentSize: 100 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:223:      const seg2 = planner.segmentForReview(inv, { segmentSize: 100 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:230:  describe('research segmentation (segmentForResearch)', () => {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:232:      expect(planner.segmentForResearch(null as any)).toEqual([]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:237:      const segments = planner.segmentForResearch(ledger, { segmentSize: 10 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:246:      const seg1 = planner.segmentForResearch(ledger, { segmentSize: 10 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts:247:      const seg2 = planner.segmentForResearch(ledger, { segmentSize: 10 });
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:64:function evaluateWaveConvergence(board, signals, threshold) {
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:180:function shouldPruneSegment(segment, signals, threshold) {
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:243:function evaluateSegmentConvergence(segmentState, options) {
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:310:  evaluateWaveConvergence,
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:312:  shouldPruneSegment,
.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs:314:  evaluateSegmentConvergence,
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:118:function updateBoard(board, segmentResults) {
.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:445:  updateBoard,
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:16:  dispatchWave: (segments: any[], config: any) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:17:  joinWave: (results: any[], strategy?: string) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:18:  advancePhase: (ctx: any, phase: string) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:19:  isWaveComplete: (dispatches: any[]) => boolean;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:26:  shouldActivateReviewWave: (files: any[], metrics?: any) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:27:  shouldActivateResearchWave: (domains: any[], metrics?: any) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:29:  segmentForReview: (inv: any, config?: any) => any[];
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:37:  updateBoard: (board: any, results: any[]) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:44:  evaluateWaveConvergence: (board: any, signals: any, threshold?: number) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:45:  shouldPruneSegment: (segment: any, signals: any, threshold?: number) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:46:  evaluateSegmentConvergence: (state: any, opts?: any) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:55:  mergeSegmentStates: (states: any[], strategy?: string) => any;
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:70:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:79:      board.updateBoard(b, [
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:98:      expect(lifecycle.isWaveComplete(dispatches)).toBe(false);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:115:      const result = segState.mergeSegmentStates([s1, s2]);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:125:      const result = convergence.evaluateWaveConvergence(b, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:140:      const result = convergence.evaluateWaveConvergence(b, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:157:      const pruneResult = convergence.shouldPruneSegment(segment, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:168:      const pruneResult = convergence.shouldPruneSegment(segment, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:179:      const pruneResult = convergence.shouldPruneSegment(segment, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:189:      const pruneResult = convergence.shouldPruneSegment(segment, {
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:213:      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.5 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:223:      const result = planner.shouldActivateResearchWave(domains, { clusterDiversity: 0.5 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:251:      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.05 });
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:262:      const result = convergence.evaluateSegmentConvergence(state);
.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:277:      const result = convergence.evaluateSegmentConvergence(state, { threshold: 0.05 });
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:69:function shouldActivateReviewWave(files, metrics) {
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:110:function shouldActivateResearchWave(domains, metrics) {
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:311:function segmentForReview(inventory, config) {
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:429:function segmentForResearch(domainLedger, config) {
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:611:  shouldActivateReviewWave,
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:612:  shouldActivateResearchWave,
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:617:  segmentForReview,
.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:618:  segmentForResearch,

codex
I’ve isolated a few candidate correctness defects, and I’m sanity-checking them with tiny runtime probes now. This is the last pass before I write the findings, so I want the report to distinguish real behavioral bugs from merely underspecified helpers.
2026-04-12T09:55:46.140967Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const planner = require('./.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs');
const sources = [
  { domain: 'alpha.example.com' },
  { domain: 'beta.vendor.com' },
  { domain: 'gamma.docs.com' },
  { domain: 'delta.api.org' },
];
console.log(JSON.stringify(sources.map(s => ({ domain: s.domain, cluster: planner.generateDomainLedger([s]).domains[0].cluster })), null, 2));
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-12T09:55:46.141000Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const planner = require('./.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs');
const files = Array.from({length: 1000}, (_, i) => ({ path: "'`src/dir${i % 20}/file${i}.ts`, complexity: 1, churnRate: 0, issueCount: 0 }));
console.log(JSON.stringify({ hotspotSpread: planner.computeHotspotSpread(files), activation: planner.shouldActivateReviewWave(files) }, null, 2));
NODE'`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-12T09:55:46.143904Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const lifecycle = require('./.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs');
const ctx = lifecycle.createWaveContext('target', 'review');
console.log(JSON.stringify({before: ctx.phase, transition: lifecycle.advancePhase(ctx, 'merge'), after: ctx.phase}, null, 2));
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-12T09:55:46.159536Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const seg = require('./.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs');
const s1 = seg.createSegmentState('seg-1', { sessionId: 'sess', generation: 1, waveId: 'w1' });
const s2 = seg.createSegmentState('seg-2', { sessionId: 'sess', generation: 1, waveId: 'w2' });
s1.findings = [{ findingId: 'F-001', title: 'Bug A', severity: 'P1', segment: 'seg-1' }];
s2.findings = [{ findingId: 'F-001', title: 'Bug B', severity: 'P1', segment: 'seg-2' }];
console.log(JSON.stringify(seg.mergeSegmentStates([s1, s2], 'dedupe'), null, 2));
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
2026-04-12T09:55:46.159562Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc "node - <<'NODE'
const boardLib = require('./.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs');
const b = boardLib.createBoard({ sessionId: 'sess', generation: 1, loopType: 'review' });
boardLib.updateBoard(b, [
  { segmentId: 'seg-1', waveId: 'w1', findings: [{ findingId: 'F-001', title: 'Bug A', severity: 'P1', evidence: 'a' }] },
  { segmentId: 'seg-2', waveId: 'w1', findings: [{ findingId: 'F-001', title: 'Bug B', severity: 'P1', evidence: 'b' }] },
]);
console.log(JSON.stringify({ findings: b.findings, conflicts: b.conflicts, mergeHistory: b.mergeHistory }, null, 2));
NODE"`: CreateProcess { message: "Codex(Sandbox(Denied { output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: \"\", truncated_after_lines: None }, stderr: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, aggregated_output: StreamOutput { text: \"zsh:1: can't create temp file for here document: operation not permitted\\n\", truncated_after_lines: None }, duration: 0ns, timed_out: false }, network_policy_decision: None }))" }
codex
The sandbox blocks here-doc execution, so I’m switching to single-line `node -e` probes instead of stopping there. I already have enough static evidence for the main issues; this is just to tighten a couple of examples before I finalize the report.
exec
/bin/zsh -lc "node -e \"const p=require('./.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs');const sources=[{domain:'alpha.example.com'},{domain:'beta.vendor.com'},{domain:'gamma.docs.com'},{domain:'delta.api.org'}];console.log(JSON.stringify(sources.map(s=>({domain:s.domain,cluster:p.generateDomainLedger([s]).domains[0].cluster})),null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "node -e \"const p=require('./.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs');const files=Array.from({length:1000},(_,i)=>({path:'src/dir'+(i%20)+'/file'+i+'.ts',complexity:1,churnRate:0,issueCount:0}));console.log(JSON.stringify({hotspotSpread:p.computeHotspotSpread(files),activation:p.shouldActivateReviewWave(files)},null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
[
  {
    "domain": "alpha.example.com",
    "cluster": "com"
  },
  {
    "domain": "beta.vendor.com",
    "cluster": "com"
  },
  {
    "domain": "gamma.docs.com",
    "cluster": "com"
  },
  {
    "domain": "delta.api.org",
    "cluster": "org"
  }
]

 succeeded in 0ms:
{
  "hotspotSpread": 1,
  "activation": {
    "activate": true,
    "reason": "Wave activated: 1000 files, hotspot spread 1.000",
    "fileCount": 1000,
    "hotspotSpread": 1
  }
}

exec
/bin/zsh -lc "node -e \"const bLib=require('./.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs');const b=bLib.createBoard({sessionId:'sess',generation:1,loopType:'review'});bLib.updateBoard(b,[{segmentId:'seg-1',waveId:'w1',findings:[{findingId:'F-001',title:'Bug A',severity:'P1',evidence:'a'}]},{segmentId:'seg-2',waveId:'w1',findings:[{findingId:'F-001',title:'Bug B',severity:'P1',evidence:'b'}]}]);console.log(JSON.stringify({findingCount:b.findings.length,conflictCount:b.conflicts.length,dedupeCount:b.dedupeLog.length,stored:b.findings[0]},null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "node -e \"const l=require('./.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs');const ctx=l.createWaveContext('target','review');console.log(JSON.stringify({before:ctx.phase,transition:l.advancePhase(ctx,'merge'),after:ctx.phase},null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "findingCount": 1,
  "conflictCount": 1,
  "dedupeCount": 0,
  "stored": {
    "sessionId": "sess",
    "generation": 1,
    "segment": "seg-1",
    "wave": "w1",
    "findingId": "F-001",
    "title": "Bug A",
    "severity": "P1",
    "file": null,
    "line": null,
    "dimension": null,
    "domain": null,
    "evidence": "a",
    "mergeState": "original",
    "mergedAt": "2026-04-12T09:55:59.242Z",
    "provenance": {
      "sourceSegment": "seg-1",
      "sourceWave": "w1",
      "originalFindingId": "F-001"
    }
  }
}

 succeeded in 0ms:
{
  "before": "prepass",
  "transition": {
    "success": true,
    "previousPhase": "prepass",
    "currentPhase": "merge"
  },
  "after": "merge"
}

exec
/bin/zsh -lc "node -e \"const seg=require('./.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs');const s1=seg.createSegmentState('seg-1',{sessionId:'sess',generation:1,waveId:'w1'});const s2=seg.createSegmentState('seg-2',{sessionId:'sess',generation:1,waveId:'w2'});s1.findings=[{findingId:'F-001',title:'Bug A',severity:'P1',segment:'seg-1'}];s2.findings=[{findingId:'F-001',title:'Bug B',severity:'P1',segment:'seg-2'}];const r=seg.mergeSegmentStates([s1,s2],'dedupe');console.log(JSON.stringify({mergedCount:r.merged.findings.length,conflictCount:r.conflicts.length,dedupeCount:r.dedupeLog.length,stored:r.merged.findings[0]},null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "mergedCount": 1,
  "conflictCount": 0,
  "dedupeCount": 1,
  "stored": {
    "findingId": "F-001",
    "title": "Bug A",
    "severity": "P1",
    "segment": "seg-1",
    "provenance": {
      "sourceSegment": "seg-1"
    }
  }
}

exec
/bin/zsh -lc 'rg -n "explicit keys|1000 files|50 domains|hotspot spread|cluster diversity|ordered: prepass, plan, fan-out, prune, promote, join, then merge|same inputs|deterministic" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md:65:**Why this one**: It solves the scale problem while staying closest to the repo's existing architectural boundaries and preserving deterministic merge behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/decision-record.md:75:- Merge behavior stays deterministic and explainable through explicit keys and reducer-owned state.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:22:Phase 003 adds orchestrator-managed parallel wave execution so deep research and deep review can handle very large targets without abandoning the LEAF-worker model. It formalizes deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the coverage-graph foundation from Phase 002.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:41:| **Handoff Criteria** | Phase 004 can replay wave runs as deterministic, segment-aware traces with stable board and merge artifacts. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:54:- v1 deterministic segmentation using heuristics: file-count thresholds, directory grouping, simple hotspot ranking, and stable segment identities.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:71:The deep-loop products are currently optimized for one iteration stream at a time. That works for moderate targets, but it becomes inefficient and hard to govern once a review scope crosses 1000 files or a research scope spans dozens of domains. Without a structured wave executor, operators must either accept slow sequential progress or invent ad hoc parallelism that risks duplicated work, conflicting findings, and unmergeable state. The problem is amplified by the current YAML workflow engine, which has no native parallel dispatch or join capability today.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:86:- Add shared CommonJS planners for v1 deterministic review-file segmentation and research-domain segmentation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:91:- Define segment-local JSONL or state artifacts and deterministic merge rules into the main packet lineage using explicit keys: `sessionId`, `generation`, `segment`, `wave`, and `findingId`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:93:- Add activation gates so wave execution only activates for review scopes with at least 1000 files plus hotspot spread, or research scopes with at least 50 domains plus cluster diversity; otherwise the default sequential path remains unchanged.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:130:| `.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts` | Create | Verify segment isolation, deterministic merge, and idempotent replay behavior. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:144:| REQ-001 | The phase MUST define two segmentation versions for both large review scopes and large research scopes. | v1 uses deterministic heuristics such as file-count thresholds, directory grouping, simple hotspot ranking, domain counts, authority levels, and stable cluster assignment; v2 explicitly layers Phase 002 coverage-graph or cluster signals on top of v1 once the graph surfaces are operational. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:147:| REQ-004 | Segment-local JSONL and merge rules MUST preserve auditability when wave results are merged back into the main packet lineage. | Segment artifacts remain replayable on their own, merged records always include explicit keys `sessionId`, `generation`, `segment`, `wave`, and `findingId`, and merge logic never relies on append order as the source of truth. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:154:| REQ-006 | Deep-research and deep-review workflows MUST expose wave execution as a bounded mode for large targets while preserving the default small-target path. | Wave mode activates only when review targets have at least 1000 files with hotspot spread or research targets have at least 50 domains with cluster diversity; otherwise command docs, YAML workflows, and config surfaces keep the normal single-stream flow as the default path. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:167:- **SC-003**: The wave lifecycle is explicit and ordered: prepass, plan, fan-out, prune, promote, join, then merge.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:178:2. **Given** a review scope with at least 1000 files and meaningful hotspot spread, **when** wave planning runs, **then** the review prepass emits `hotspot-inventory.json` and the planner emits stable v1 hotspot-ranked segments instead of one monolithic file list.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:179:3. **Given** a research scope with at least 50 source domains and cluster diversity, **when** wave planning runs, **then** the research prepass emits `domain-ledger.json` and the planner emits bounded domain clusters with stable identities.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:184:8. **Given** a small-target run or a large target that lacks hotspot spread or cluster diversity, **when** deep research or deep review starts, **then** execution stays on the existing single-stream path and does not invoke wave machinery unnecessarily.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:197:| Risk | Segment planners produce unstable partitions between runs | Medium | Require deterministic ranking and stable segment IDs based on scope metadata. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:234:- JSONL append order differs from logical merge order after retries or resumed segments. Merge must sort and dedupe by explicit keys rather than line position.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md:242:| **Planning** | High: deterministic segmentation for two different product types is non-trivial. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md:51:| `SEGMENT-DETERMINISTIC` | Segment identity and order must be reproducible from the same inputs. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md:52:| `GATED-ACTIVATION` | Wave mode must activate only for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md:101:- [x] T001 Define v1 deterministic heuristic segmentation for review files and research domains, keeping segment identity and ordering reproducible.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md:107:- [x] T-WE-NEW-5 Add activation gates so wave mode only activates for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md:131:- [x] T009 Implement segment JSONL lineage and deterministic merge helpers keyed by explicit identifiers.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/tasks.md:146:- [x] T010 Create planner and lifecycle tests for fan-out/join proof, deterministic v1 segmentation, and gated wave transitions.

codex
### F-005-001 [P1] Uniform review inventories can incorrectly activate wave mode
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:69)
- Line: `69-99`, `543-564`
- Title: `computeHotspotSpread()` treats every median-complexity directory as a hotspot
- Description: The review activation gate is supposed to stay off unless a large target also has meaningful hotspot spread. Instead, `computeHotspotSpread()` marks a directory as “hot” whenever any file has `complexity >= median`, and it ignores `churnRate`/`issueCount` entirely. On a flat 1000-file inventory where every file has the same low complexity and no churn/issues, the median equals every file, so every directory becomes hot and `shouldActivateReviewWave()` returns `activate: true`. That violates the Phase 003 contract that large targets without hotspot spread should remain on the sequential path.
- Evidence: `if (complexity >= median) { hotDirs.add(dir); }` at lines `558-560`; a direct probe on 1000 uniform files returns `hotspotSpread: 1` and `activate: true`.
- Recommendation: Define hotspot directories from a strict-above-baseline composite hotspot score, not `complexity >= median`, and include churn/issues in the calculation. Add a regression test for a 1000-file uniform inventory without injected `hotspotSpread`.

### F-005-002 [P1] Fallback research clustering collapses unrelated domains into one cluster
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:242)
- Line: `242-253`, `589-594`
- Title: `assignCluster()` uses the TLD, not a meaningful domain cluster
- Description: When research sources arrive without a preassigned cluster, `generateDomainLedger()` falls back to `assignCluster()`. That helper returns the last domain label (`com`, `org`, etc.), even though the comment says it should use the “first meaningful segment.” In practice this collapses most web research sources into one cluster, drives `clusterDiversity` artificially low, and can either block wave activation or produce meaningless research segments.
- Evidence: `if (parts.length >= 2) return parts[parts.length - 1];` at lines `592-594`. A probe with `alpha.example.com`, `beta.vendor.com`, and `gamma.docs.com` assigns all three to `com`.
- Recommendation: Derive fallback clusters from a registrable-domain or topic-based heuristic, not the TLD. Add tests covering absent-cluster inputs so the fallback path is exercised.

### F-005-003 [P1] Lifecycle helper allows illegal phase skips straight to merge
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:321)
- Line: `321-364`
- Title: `advancePhase()` enforces monotonicity but not the required phase order
- Description: Phase 003 defines an explicit lifecycle order: `prepass -> plan -> fan-out -> prune -> promote -> join -> merge`. `advancePhase()` only checks `targetIndex > currentIndex`, so a fresh context can jump directly from `prepass` to `merge` and still return success. That makes the lifecycle contract unenforceable and allows callers to mark a wave as merged without any proven plan/fan-out/join path having occurred.
- Evidence: the forward-only check is `if (targetIndex <= currentIndex) ...` at lines `345-353`; a direct probe from a new context returns success for `advancePhase(ctx, 'merge')`.
- Recommendation: Enforce adjacent transitions with an allowed-transition matrix. If resume/repair needs non-adjacent jumps, expose a separate audited API for that path and test it explicitly.

### F-005-004 [P1] Merge helpers collapse distinct segment findings that reuse a local finding ID
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:219)
- Line: `219-279`
- Title: Board merge deduplicates by `findingId` alone instead of the explicit 5-key contract
- Description: Phase 003 requires merge lineage to be keyed by `sessionId`, `generation`, `segment`, `wave`, and `findingId`, but `mergeFinding()` looks up existing records with `f.findingId === findingRecord.findingId`. That means two different segment-local findings that both use `F-001` are treated as the same logical record even when their evidence differs. The same defect appears in segment-state merge logic (`wave-segment-state.cjs:199-247`), so cross-segment collisions can silently flatten lineage during board updates and replay merges.
- Evidence: `findIndex(f => f.findingId === findingRecord.findingId)` at lines `223-225`; a probe with `seg-1/F-001/Bug A` and `seg-2/F-001/Bug B` leaves only one stored board finding. A second probe through `mergeSegmentStates()` also collapses the pair to one merged finding with `dedupeLog.length === 1`.
- Recommendation: Use the full composite key for storage and replay, then run semantic duplicate/conflict detection as a second pass. Add regression tests for same-`findingId` collisions across different segments, waves, and generations.

**ITERATION SUMMARY**  
4 findings total: `0 P0`, `4 P1`, `0 P2`.

**COVERAGE ASSESSMENT**  
About `95%` of the requested focus area. I reviewed all five `wave-*.cjs` modules plus the four dedicated wave Vitest suites, with spot checks against the Phase 003 spec/tasks for contract intent.

**CONFIDENCE**  
High.

**NEXT PRIORITIES**  
Check the real command/YAML integration next: whether deferred segments are ever scheduled into later waves, whether board/lifecycle state is persisted consistently across actual deep-review/deep-research runs, and whether graph-backed convergence inputs are wired the same way the helper modules assume.
hook: Stop
hook: Stop Completed
tokens used
149,022
### F-005-001 [P1] Uniform review inventories can incorrectly activate wave mode
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:69)
- Line: `69-99`, `543-564`
- Title: `computeHotspotSpread()` treats every median-complexity directory as a hotspot
- Description: The review activation gate is supposed to stay off unless a large target also has meaningful hotspot spread. Instead, `computeHotspotSpread()` marks a directory as “hot” whenever any file has `complexity >= median`, and it ignores `churnRate`/`issueCount` entirely. On a flat 1000-file inventory where every file has the same low complexity and no churn/issues, the median equals every file, so every directory becomes hot and `shouldActivateReviewWave()` returns `activate: true`. That violates the Phase 003 contract that large targets without hotspot spread should remain on the sequential path.
- Evidence: `if (complexity >= median) { hotDirs.add(dir); }` at lines `558-560`; a direct probe on 1000 uniform files returns `hotspotSpread: 1` and `activate: true`.
- Recommendation: Define hotspot directories from a strict-above-baseline composite hotspot score, not `complexity >= median`, and include churn/issues in the calculation. Add a regression test for a 1000-file uniform inventory without injected `hotspotSpread`.

### F-005-002 [P1] Fallback research clustering collapses unrelated domains into one cluster
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:242)
- Line: `242-253`, `589-594`
- Title: `assignCluster()` uses the TLD, not a meaningful domain cluster
- Description: When research sources arrive without a preassigned cluster, `generateDomainLedger()` falls back to `assignCluster()`. That helper returns the last domain label (`com`, `org`, etc.), even though the comment says it should use the “first meaningful segment.” In practice this collapses most web research sources into one cluster, drives `clusterDiversity` artificially low, and can either block wave activation or produce meaningless research segments.
- Evidence: `if (parts.length >= 2) return parts[parts.length - 1];` at lines `592-594`. A probe with `alpha.example.com`, `beta.vendor.com`, and `gamma.docs.com` assigns all three to `com`.
- Recommendation: Derive fallback clusters from a registrable-domain or topic-based heuristic, not the TLD. Add tests covering absent-cluster inputs so the fallback path is exercised.

### F-005-003 [P1] Lifecycle helper allows illegal phase skips straight to merge
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:321)
- Line: `321-364`
- Title: `advancePhase()` enforces monotonicity but not the required phase order
- Description: Phase 003 defines an explicit lifecycle order: `prepass -> plan -> fan-out -> prune -> promote -> join -> merge`. `advancePhase()` only checks `targetIndex > currentIndex`, so a fresh context can jump directly from `prepass` to `merge` and still return success. That makes the lifecycle contract unenforceable and allows callers to mark a wave as merged without any proven plan/fan-out/join path having occurred.
- Evidence: the forward-only check is `if (targetIndex <= currentIndex) ...` at lines `345-353`; a direct probe from a new context returns success for `advancePhase(ctx, 'merge')`.
- Recommendation: Enforce adjacent transitions with an allowed-transition matrix. If resume/repair needs non-adjacent jumps, expose a separate audited API for that path and test it explicitly.

### F-005-004 [P1] Merge helpers collapse distinct segment findings that reuse a local finding ID
- Dimension: correctness
- File: [.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs:219)
- Line: `219-279`
- Title: Board merge deduplicates by `findingId` alone instead of the explicit 5-key contract
- Description: Phase 003 requires merge lineage to be keyed by `sessionId`, `generation`, `segment`, `wave`, and `findingId`, but `mergeFinding()` looks up existing records with `f.findingId === findingRecord.findingId`. That means two different segment-local findings that both use `F-001` are treated as the same logical record even when their evidence differs. The same defect appears in segment-state merge logic (`wave-segment-state.cjs:199-247`), so cross-segment collisions can silently flatten lineage during board updates and replay merges.
- Evidence: `findIndex(f => f.findingId === findingRecord.findingId)` at lines `223-225`; a probe with `seg-1/F-001/Bug A` and `seg-2/F-001/Bug B` leaves only one stored board finding. A second probe through `mergeSegmentStates()` also collapses the pair to one merged finding with `dedupeLog.length === 1`.
- Recommendation: Use the full composite key for storage and replay, then run semantic duplicate/conflict detection as a second pass. Add regression tests for same-`findingId` collisions across different segments, waves, and generations.

**ITERATION SUMMARY**  
4 findings total: `0 P0`, `4 P1`, `0 P2`.

**COVERAGE ASSESSMENT**  
About `95%` of the requested focus area. I reviewed all five `wave-*.cjs` modules plus the four dedicated wave Vitest suites, with spot checks against the Phase 003 spec/tasks for contract intent.

**CONFIDENCE**  
High.

**NEXT PRIORITIES**  
Check the real command/YAML integration next: whether deferred segments are ever scheduled into later waves, whether board/lifecycle state is persisted consistently across actual deep-review/deep-research runs, and whether graph-backed convergence inputs are wired the same way the helper modules assume.
