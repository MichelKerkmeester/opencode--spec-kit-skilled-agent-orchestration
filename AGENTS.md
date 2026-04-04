# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

### Safety Constraints

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail.

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** — use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

---

### Tools & Search

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** — research tasks, context recovery, finding prior work. Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` — NEVER manually create memory files.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **CocoIndex Code MCP** — semantic code search. MUST use when exploring unfamiliar code, finding implementations by concept/intent, or when Grep/Glob exact matching is insufficient. Skill: `.opencode/skill/mcp-coco-index/`
- **Git (sk-git)** — worktree setup, conventional commits, PR creation. Full details: `.opencode/skill/sk-git/`. Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

**CODE SEARCH DECISION TREE:**

```text
Need to find code?
  |
  +-- Know the exact text/token/symbol?
  |     YES --> Grep (exact match)
  |
  +-- Know the file name or path?
  |     YES --> Glob (pattern match)
  |
  +-- Searching by concept, intent, or "how does X work"?
  |     YES --> CocoIndex search (semantic)
  |             +-- Verify hits with Read
  |             +-- Confirm with Grep if needed
  |
  +-- Exploring unfamiliar code?
        YES --> CocoIndex search FIRST, then Grep/Glob to fill gaps
```

CocoIndex triggers: "find code that does X", "how is X implemented", "where is the logic for X", "similar code", "find patterns", exploring unfamiliar modules, any intent-based query where exact tokens are unknown.

| Approach | Command | When |
| --- | --- | --- |
| **MCP tool** | `search(query, languages, paths, num_results, refresh_index)` | AI agent integration |
| **CLI** | `ccc search "query" --lang X --path Y --limit N` | Direct terminal use |

Set `refresh_index=false` after the first search in a session unless the codebase changed.

---

### Session Start & Recovery

**Hook-capable runtimes** auto-inject startup context — no manual action needed. 
**Fallback** — when hooks fail or are unavailable in any runtime:

1. Call `session_bootstrap()` — one composite call that runs `session_resume` + `session_health` and returns structural context
2. If structural context shows `stale` or `missing`, run `code_graph_scan` to rebuild
3. If the graph remains unavailable, fall back to CocoIndex + direct file reads
4. Re-anchor on the recovered spec folder, current task, blockers, and next steps before making changes

---

### Quality & Anti-Patterns

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** — correct user misconceptions with evidence; do not agree for conversational flow

**ANTI-PATTERNS (Detect Silently):**

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

**ANALYSIS LENSES:**

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

---

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | CocoIndex for semantic/intent → Grep for exact text → Glob for file paths → Read for contents                                       |
| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` → Review → Continue    |
| **Save context**          | `/memory:save` OR compose JSON → `generate-context.js --json '<data>' [spec-folder]` → Auto-indexed                                 |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate → DQI score → Verify                                                     |
| **Web code**              | sk-code--web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code--opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → Populate → Plan first child                        |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init → Loop iterations → Convergence → Synthesize → Memory save                                        |
| **Deep review**           | `/spec_kit:deep-review` → Scope → Loop iterations → Convergence → review-report.md → Memory save                                   |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                               |
| **Constitutional memory** | `/memory:learn` → create, list, edit, remove, budget                                                                                |
| **Shared memory**         | `/memory:manage shared` → create spaces, manage memberships, inspect rollout                                                        |

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
Trigger: "save context", "save memory", `/memory:save`, memory file creation
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Script:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - AI composes structured JSON with session context, writes to `/tmp/save-context-data.json`, passes as first arg. Alternatively use `--json '<inline-json>'` or `--stdin`. The AI has strictly better information about its own session than any DB extraction.
  - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents)
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()`
- **Violation:** Write tool on `memory/` path → DELETE and re-run via script
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
- [ ] Saving memory? Using `generate-context.js` (not Write tool)?
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

## 5. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK

**Flow:** Parse request → Read files first → Analyze → Design simplest solution → Validate → Execute

| Principle         | Rule                                               | Anti-Pattern                            |
| ----------------- | -------------------------------------------------- | --------------------------------------- |
| **Simplicity**    | Reuse patterns; earn every abstraction             | Utilities for <3 uses, single-impl intf |
| **Evidence**      | Cite `[SOURCE: file:lines]` or `[CITATION: NONE]`  | Claims without verification             |
| **Scope Match**   | Solution size = problem size                       | Refactoring during bug fix              |
| **Right Problem** | Root cause, not symptom; measure before optimizing | Premature optimization, wrong framing   |

**CLARITY Triggers** (justify before proceeding):
- Utility for <3 uses | Config for single value | Abstraction without clear boundary
- Pattern where simple code suffices | Interface for single impl
- On bias → don't argue, redirect to root cause

**Pre-Change Checklist:**
- [ ] Read first? | Simplest solution? | Scope discipline?
- [ ] Confidence ≥80%? | Sources cited? | Spec folder? | Approval?

**Five Checks (>100 LOC):** Necessary now? | Alternatives (≥2)? | Simplest sufficient? | On critical path? | No tech debt?

**STOP CONDITIONS:** Any check unchecked | no spec folder | no approval → STOP and address

---

## 6. 🤖 AGENT ROUTING

When using the orchestrate agent or Task tool for complex multi-step workflows, route to specialized agents:

### Runtime Agent Directory Resolution

Use the agent directory that matches the active runtime/provider profile:

| Runtime / Profile                      | Agent Directory            | Usage Rule                                                  |
| -------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| **Copilot (default OpenCode profile)** | `.opencode/agent/`         | Load base agent definitions from this directory             |
| **Claude profile**                     | `.claude/agents/`          | Load Claude-specific agent definitions from this directory  |
| **Codex CLI**                          | `.codex/agents/`           | Load Codex-specific agent definitions from this directory   |
| **Gemini CLI**                         | `.gemini/agents/`          | Load Gemini-specific agent definitions from this directory  |

**Resolution rule:** pick one directory by runtime and stay consistent for that workflow phase.

### Agent Definitions

- **`@general`** — Implementation, complex tasks
- **`@context`** — Retrieval-first exploration agent for codebase search, pattern discovery, and context loading using memory triggers/context, memory search, CocoIndex, and direct code evidence as needed
- **`@context-prime`** — Lightweight bootstrap agent for session start or after `/clear`. Loads memory context, checks code graph and CocoIndex health, returns a compact Prime Package with spec folder, task status, system health, and recommended next steps
- **`@orchestrate`** — Multi-agent coordination, complex workflows
- **`@write`** — Creating READMEs, Skills, Guides
- **`@review`** — Code review, PRs, quality gates (READ-ONLY)
- **`@speckit`** — Spec folder creation Level 1-3+. **EXCLUSIVE:** Only agent permitted to write `*.md` inside spec folders. Exceptions: `memory/` (generate-context.js), `scratch/` (any agent), `handover.md` (@handover), `research.md` (@deep-research), `review-report.md` (@deep-review), `debug-delegation.md` (@debug)
- **`@debug`** — Fresh perspective debugging, root cause analysis. May write `debug-delegation.md` inside spec folders
- **`@handover`** — Session continuation, context preservation. May write `handover.md` inside spec folders
- **`@deep-research`** — Autonomous deep research iterations. LEAF agent executing single research cycles with externalized JSONL + strategy.md state. Dispatched by `/spec_kit:deep-research` command
- **`@deep-review`** — Autonomous deep review iterations. LEAF agent executing single review cycles with P0/P1/P2 findings, severity-weighted convergence, and 4 review dimensions. Dispatched by `/spec_kit:deep-review` command
- **`@ultra-think`** — Multi-strategy planning architect. Dispatches diverse thinking strategies, scores via 5-dimension rubric, synthesizes optimal plan. Planning-only: no file modifications

---

## 7. ⚙️  MCP CONFIGURATION

**Two systems:**

1. **Native MCP** (`opencode.json`) - Direct tools, called natively
   - Sequential Thinking, Spec Kit Memory, Code Mode, CocoIndex Code

2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()`
   - Figma, Github, ClickUp, Chrome DevTools, etc.
   - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `clickup.clickup_get_teams({})`)
   - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json`
  
---

## 8. 🧩 SKILLS SYSTEM

Skills are specialized, on-demand capabilities that provide domain expertise. Unlike knowledge files (passive references), skills are explicitly invoked to handle complex, multi-step workflows.

### How Skills Work

```
Task Received → Gate 2: Run skill_advisor.py
                    ↓
    Confidence > 0.8 → MUST invoke recommended skill
                    ↓
     Invoke Skill → Read(".opencode/skill/<skill-name>/SKILL.md")
                    ↓
    Instructions Load → SKILL.md content + resource paths
                    ↓
      Follow Instructions → Complete task using skill guidance
```

### Skill Loading Protocol

1. Gate 2 provides skill recommendation via `skill_advisor.py`
2. Invoke using appropriate method for your environment
3. Read bundled resources from `references/`, `scripts/`, `assets/` paths
4. Follow skill instructions to completion
5. Do NOT re-invoke a skill already in context

### Primary Skill: sk-code--opencode

For ALL OpenCode system code (`.opencode/`, MCP servers, scripts), `sk-code--opencode` provides multi-language standards. Includes the `system-spec-kit` skill for spec folder workflows and the Spec Kit Memory system for context preservation across sessions.

**Supported Languages:**

| Language   | Target                        | Key Patterns                                |
| ---------- | ----------------------------- | ------------------------------------------- |
| JavaScript | MCP servers, CommonJS modules | `require`/`module.exports`, strict mode     |
| TypeScript | Type-safe modules, configs    | Interfaces, strict tsconfig, type guards    |
| Python     | Validators, advisors, tests   | snake_case, argparse, pytest, docstrings    |
| Shell      | Automation, deployment        | `set -euo pipefail`, shebang, quoting       |
| JSON/JSONC | Manifests, schemas, configs   | Schema validation, commented config         |

**Key Systems:**
- **system-spec-kit**: Spec folder lifecycle (Levels 1-3+), validation, template architecture
- **Spec Kit Memory**: Context preservation, semantic search, session continuity (`/memory:save`, `/spec_kit:resume`)

**Invocation:** Automatic via Gate 2 routing when OpenCode system code tasks detected.

### Git Workflow Skill: sk-git

For ALL git workflows, `sk-git` orchestrates workspace setup, commit hygiene, and work completion.

**Sub-workflows:**
- **Worktree**: Branch creation via `git worktree`, workspace isolation, parallel development
- **Commit**: Conventional commit format, staged change analysis, clean commit messages
- **Finish**: PR creation, branch cleanup, integration workflows

**Trigger Keywords:** worktree, branch, commit, merge, pr, pull request, git workflow, conventional commits, finish work, integrate changes

**Invocation:** Automatic via Gate 2 routing when git tasks detected, or manually via `Read(".opencode/skill/sk-git/SKILL.md")`.