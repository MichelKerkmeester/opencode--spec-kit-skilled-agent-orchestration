# AI Assistant Framework (Full-Stack Template)

> **Behavior framework** for multi-stack development ecosystems — enforcing guardrails, code standards, and decision protocols with automatic stack detection.

---

### Multi-Stack Architecture

**Universal Framework:** This AGENTS.md variant extends the base template with stack-aware development workflows. Stack-specific behavior is handled automatically by the `sk--code--full-stack` skill.

**Stack Detection:** Automatic via marker files (first match wins):

| Stack         | Detection Marker                   | Key Patterns                                    |
| ------------- | ---------------------------------- | ----------------------------------------------- |
| Go            | `go.mod`                           | Domain layers, repositories, table-driven tests |
| Swift         | `Package.swift`                    | MVVM, SwiftUI composition, async handling       |
| React Native  | `app.json` + expo / `package.json` | Hooks, navigation, native modules               |
| React/Next.js | `next.config.*` / `package.json`   | Component architecture, state boundaries        |
| Node.js       | `package.json` (fallback)          | Service layering, async flow, middleware        |

**How It Works:**
1. `sk--code--full-stack` detects stack via marker files at session start
2. Stack-specific patterns load from `.opencode/skill/sk--code--full-stack/references/{category}/{stack}/`
3. Verification commands auto-adjust per stack (see Quick Reference below)

**The Iron Law:** NO completion claims without running stack-appropriate verification.

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
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work.  **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`** - NEVER manually create memory files.
- **CocoIndex Code MCP** for semantic code search. **MUST use** when exploring unfamiliar code, finding implementations by concept/intent, or when Grep/Glob exact matching is insufficient. Skill: `.opencode/skill/mcp-cocoindex-code/`

**GIT WORKFLOW:** Full details: `.opencode/skill/sk-git/`
- Worktree setup, conventional commits, PR creation, branch management
- Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                               |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings              |
| **Code search**           | `CocoIndex search` for semantic/intent queries → `Grep()` for exact text → `Glob()` for file paths → `Read()` for contents         |
| **Resume prior work**     | `/memory:continue` OR `memory_search({ query, specFolder, anchors: ['state', 'next-steps'] })` → Review checklist → Continue       |
| **Save context**          | `/memory:save` OR `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]` → Auto-indexed |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                              |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                        |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                  |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                            |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify                  |
| **Code implementation**   | sk--code skill → Detect stack → Phase 1-3 (Implement → Test → Verify)                                                    |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                     |
| **Go verification**       | `go test ./...` → `golangci-lint run` → `go build ./...`                                                                 |
| **Node.js verification**  | `npm test` → `npx eslint .` → `npm run build`                                                                            |
| **React verification**    | `npm test` → `npx eslint .` → `npm run build`                                                                            |
| **React Native verify**   | `npm test` → `npx eslint .` → `npx expo export`                                                                          |
| **Swift verification**    | `swift test` → `swiftlint` → `swift build`                                                                               |
| **Phase workflow**        | `/spec_kit:phase` → Decompose → `create.sh --phase` → Populate parent/children → `validate.sh --recursive`               |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Analysis/evaluation**   | `/memory:analyze` → preflight, postflight, causal graph, ablation, dashboard, history                                            |
| **Shared memory**         | `/memory:shared` → create, member, status (deny-by-default governance)                                                             |

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
Trigger: "save context", "save memory", `/memory:save`, memory file creation
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Script:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`
  - Mode 1 (JSON): Write JSON to `/tmp/save-context-data.json`, pass as arg
  - Mode 2 (Direct): Pass spec folder path (e.g., `specs/005-memory`)
  - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents)
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()`
- **Violation:** Write tool on `memory/` path → DELETE and re-run via script

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
| **ChatGPT profile**                    | `.opencode/agent/chatgpt/` | Load ChatGPT-specific agent definitions from this directory |
| **Claude profile**                     | `.claude/agents/`          | Load Claude-specific agent definitions from this directory  |
| **Gemini CLI**                         | `.gemini/agents/`          | Load Gemini-specific agent definitions from this directory  |

**Resolution rule:** pick one directory by runtime and stay consistent for that workflow phase.

### Agent Definitions

- **`@general`** — Implementation, complex tasks
- **`@context`** — ALL codebase exploration, file search, pattern discovery, context loading. Dispatches sub-agents for fast search and deep investigation
- **`@orchestrate`** — Multi-agent coordination, complex workflows
- **`@write`** — Creating READMEs, Skills, Guides
- **`@review`** — Code review, PRs, quality gates (READ-ONLY)
- **`@speckit`** — Spec folder creation Level 1-3+. **EXCLUSIVE:** Only agent permitted to write `*.md` inside spec folders. Exceptions: `memory/` (generate-context.js), `scratch/` (any agent), `handover.md` (@handover), `research.md` (@deep-research), `debug-delegation.md` (@debug)
- **`@debug`** — Fresh perspective debugging, root cause analysis. May write `debug-delegation.md` inside spec folders
- **`@handover`** — Session continuation, context preservation. May write `handover.md` inside spec folders
- **`@deep-research`** — Autonomous deep research iterations. LEAF agent executing single research cycles with externalized JSONL + strategy.md state. Dispatched by `/spec_kit:deep-research` command
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

### Primary Skill: sk-code--full-stack

For ALL code implementation, `sk-code--full-stack` is the stack-agnostic development orchestrator.

**3-Phase Lifecycle (MANDATORY):**
1. **Phase 1 - Implementation**: Write code following stack-specific patterns from `references/{category}/{stack}/`
2. **Phase 2 - Testing/Debugging**: Run tests, fix failures, debug issues systematically
3. **Phase 3 - Verification**: Run full verification suite before completion

**Auto-Detection Flow:** Session Start → Check marker files → Detect stack → Load patterns

**Stack Verification Commands:**

| Stack         | Test            | Lint                | Build             |
| ------------- | --------------- | ------------------- | ----------------- |
| Go            | `go test ./...` | `golangci-lint run` | `go build ./...`  |
| Node.js       | `npm test`      | `npx eslint .`      | `npm run build`   |
| React/Next.js | `npm test`      | `npx eslint .`      | `npm run build`   |
| React Native  | `npm test`      | `npx eslint .`      | `npx expo export` |
| Swift         | `swift test`    | `swiftlint`         | `swift build`     |

**Invocation:** Automatic via Gate 2 routing when code tasks detected.

### Git Workflow Skill: sk-git

For ALL git workflows, `sk-git` orchestrates workspace setup, commit hygiene, and work completion.

**Sub-workflows:**
- **Worktree**: Branch creation via `git worktree`, workspace isolation, parallel development
- **Commit**: Conventional commit format, staged change analysis, clean commit messages
- **Finish**: PR creation, branch cleanup, integration workflows

**Trigger Keywords:** worktree, branch, commit, merge, pr, pull request, git workflow, conventional commits, finish work, integrate changes

**Invocation:** Automatic via Gate 2 routing when git tasks detected, or manually via `Read(".opencode/skill/sk-git/SKILL.md")`.