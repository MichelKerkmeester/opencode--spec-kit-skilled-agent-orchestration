# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

### Multi-Repository Architecture

**Universal Framework:** This AGENTS.md is the public template for code work across stacks.
Stack-specific behavior is handled automatically by the `sk-code` skill (sibling: `sk-code-opencode` for OpenCode harness code).

**Supported Stacks:**

| Stack             | Detection Marker                                                                          | Key Patterns                                                       |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Webflow**       | `src/2_javascript/`, `*.webflow.js`, motion.dev / GSAP / Lenis / HLS / Swiper / FilePond, `wrangler.toml` | snake_case JS, BEM CSS, IntersectionObserver gates, CDN versioning |
| **OpenCode**      | `.opencode/skill/`, `.opencode/agent/`, MCP server folders                                | NodeNext ESM, CommonJS, Python advisors, shell automation          |
| **Go**            | `go.mod`                                                                                  | Domain layers, repositories, table-driven tests                    |
| **Swift**         | `Package.swift`, `*.xcodeproj`                                                            | MVVM, SwiftUI composition, async handling                          |
| **React Native**  | `app.json` + expo / `package.json` + react-native                                         | Hooks, navigation, native modules                                  |
| **React/Next.js** | `next.config.*` / `package.json` + react/next                                             | Component architecture, state boundaries                           |
| **Node.js**       | `package.json` (fallback)                                                                 | Service layering, async flow, middleware                           |

**How It Works:** `sk-code` detects stack via marker files, loads patterns from `.opencode/skill/sk-code/references/{repo}/`, and selects stack-appropriate verification (see Quick Reference).

**The Iron Law:** NO completion claims without running stack-appropriate verification.

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
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §4 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

---

### Request Analysis & Execution

**Flow:** Parse request → Read files first → Analyze → Design simplest solution → Validate → Execute

#### Execution Behavior

- **Plan before acting** on multi-step work. Decide which files to read first, which tools to use, and how the result will be verified before making changes.
- **Use a research-first approach.** Read the actual code, docs, and local instructions first. Never use an edit-first approach, and prefer surgical edits over broad rewrites.
- **Apply project-specific conventions from `AGENTS.md`** before acting.
- **Take responsibility for issues encountered during execution.** Do not dodge ownership with phrases like `not caused by my changes` or `pre-existing issue`; work toward the fix.
- **Do not stop early when the requested solution is still incomplete.** Do not frame partial progress as a `good stopping point`, `natural checkpoint`, or `future work` when a safe path forward exists.
- **Do not ask for permission to continue when the next safe step is already clear and in scope.** Avoid `should I continue?` or `want me to keep going?` when you can proceed safely under the existing rules.
- **Use frequent self-checks and reasoning loops** to catch and fix your own mistakes before asking for help.
- **Reason from actual data, not assumptions.** Verify against the real files, outputs, and behavior in front of you.


---

### Required Tools & Search Routing

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** - research, context recovery, saves. See Memory Save Rule below for save mechanics.
- **Skill Advisor Hook** - primary advisor invocation path. Hook-capable runtimes surface a compact skill recommendation on prompt entry when wired; explicit `skill_advisor.py` invocation remains the fallback for scripted checks, unsupported runtimes and hook diagnostics. Reference: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.
- **CocoIndex Code MCP** - semantic code search. MUST use when exploring unfamiliar code, finding implementations by concept/intent, or when Grep/Glob exact matching is insufficient. Skill: `.opencode/skill/mcp-coco-index/`
- **Git (sk-git)** - worktree setup, conventional commits, PR creation. Full details: `.opencode/skill/sk-git/`. Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

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

### Startup & Resume Recovery

Hook-capable runtimes (Claude, Codex, Copilot, Gemini, OpenCode) may inject startup context when wired. Per-runtime triggers: `.opencode/skill/system-spec-kit/references/config/hook_system.md`. Feature-flag defaults: `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` ("Feature flags reference table").

**Recovery flow when hooks are unavailable or fail:**

1. `/spec_kit:resume` is the canonical surface; rebuild context in order: `handover.md` → `_memory.continuity` → canonical spec docs (`implementation-summary.md` → `tasks.md` → `plan.md` → `spec.md`).
2. **Phase parent** (target has `[0-9]{3}-name/` children with their own spec/description): honor `graph-metadata.json.derived.last_active_child_id`, else list children with statuses. Lean trio policy — only `spec.md`, `description.json`, `graph-metadata.json` live at parent; read the chosen child's continuity ladder, NOT the parent's plan/tasks/implementation-summary.
3. Stale or missing structural context: run `session_bootstrap()`, then `code_graph_scan` if needed. Graph unavailable: use CocoIndex + direct reads, but keep the packet-local continuity ladder as source-of-truth.
4. Re-anchor on spec folder, current task, blockers, and next steps before making changes.

---

### Quality & Anti-Patterns

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

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
| **Resume prior work**     | `/spec_kit:resume` → Rebuild context from `handover.md` → `_memory.continuity` → canonical spec docs → Review → Continue    |
| **Save context**          | `/memory:save` OR compose JSON → `generate-context.js --json '<data>' [spec-folder]` → Auto-indexed                                 |
| **Claim completion**      | Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` → Load `checklist.md` → Verify ALL items → Mark with evidence |
| **End session**           | `/memory:save` → `handover_state` routing updates `handover.md` → Provide continuation prompt                                      |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → Populate → Plan first child                        |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                               |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate → DQI score → Verify                                                     |
| **Application code**      | sk-code skill → smart router (detects stack: Webflow → live web content; React/Node/Go/Swift/RN → placeholder stub, canonical content retired); Phase 1-3 (Implement → Quality Gate → Debug → Verify) |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Deep research**         | `/spec_kit:deep-research` → Init → Loop iterations → Convergence → Synthesize → Memory save                                        |
| **Deep review**           | `/spec_kit:deep-review` → Scope → Loop iterations → Convergence → review-report.md → Memory save                                   |

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

####  GATE 2: SKILL ROUTING [REQUIRED for non-trivial tasks]
1. A) Primary: use the automatic Skill Advisor Hook brief already surfaced by the runtime when present. See `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`.
2. B) Fallback: run `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "[request]" --threshold 0.8` when no hook brief is present, when scripting a check, or when diagnosing hook behavior.
3. C) Cite user's explicit direction: "User specified: [exact quote]"
- Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed
- Output: `SKILL ROUTING: [result]` or `SKILL ROUTING: User directed → [name]`
- Skip: trivial queries only (greetings, single-line questions)

#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK - PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Machine contract:** `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` (`classifyPrompt()`). The prose lists below are human-readable; the classifier module is authoritative for runtimes that call it.
- **Positive triggers (write actions):** create, add, remove, delete, rename, move, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure
- **Positive triggers (continuity writes):** `save context`, `save memory`, `/memory:save`, `/spec_kit:resume`, `resume iteration`, `resume deep research`, `resume deep review`, `continue iteration` (these produce `description.json` / `graph-metadata.json` / continuity frontmatter / `iteration-NNN.md` writes)
- **Read-only disqualifiers:** `review`, `audit`, `inspect`, `analyze`, `explain` — suppress Gate 3 when they appear ALONE (e.g. "review the decomposition phase"). Do NOT suppress when a continuity-write trigger is also present.
- **Note:** tokens `analyze`, `decompose`, `phase` are NOT positive triggers; they false-positive on read-only review prompts.
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **Ask first, then act.** No Read/Edit/Write/Bash (except Gate Actions) before answer. The answer applies for the ENTIRE session — re-ask ONLY when user says "new task" / "different feature" / names a different spec folder, or asks you to re-ask.

#### GATE 4: SKILL-OWNED WORKFLOW ENFORCEMENT [HARD] BLOCK
Trigger phrases: "deep-research", "deep-review", "iterations", ":auto" suffix, "convergence", "autoresearch", "research loop", "review loop", iterative investigation/audit at scale (>5 iterations).

**RULE:** Iterative investigation or review loops MUST use the canonical skill-owned command surface with attached mode suffixes:
- Deep research → `/spec_kit:deep-research:auto`
- Deep review → `/spec_kit:deep-review:auto`

**FORBIDDEN** (these lose skill-owned state, convergence detection, delta tracking, and auditability):
- Manually managing iteration state in `/tmp` or anywhere outside the skill's `research/` or `review/` folder
- Skipping the state machine: `deep-research-state.jsonl`, `deep-research-config.json`, `deltas/`, `prompts/`, `logs/`
- Using the `@deep-research` or `@deep-review` agent directly via Task tool for iteration loops — only the command-owned YAML workflow may dispatch these
**If the user specifies the executor CLI** (e.g. "use cli-copilot gpt-5.4 high"), that is the HOW — it still runs INSIDE the skill's workflow. Never let the executor name override the skill-owned route.
**Tiebreaker for skill advisor ambiguity:** When `command-spec-kit` matches alongside `cli-*` for iteration phrases, `command-spec-kit` wins. The CLI executor is a tool inside the command's workflow, not a replacement for it.

#### CONSOLIDATED QUESTION PROTOCOL
Consolidate multiple questions into a SINGLE prompt before any analysis or tool calls — never split across messages. **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading; Level 1 tasks skip completion verification.

---

### 🔒 POST-EXECUTION GATES

#### MEMORY SAVE RULE [HARD] BLOCK
Trigger: "save context", "save memory", `/memory:save`
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Full save (DB + embeddings + graph):** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - AI composes structured JSON with session context, writes to `/tmp/save-context-data.json`, passes as first arg. Alternatively use `--json '<inline-json>'` or `--stdin`.
  - Also refreshes `graph-metadata.json` and `description.json` for the spec folder.
- **Quick continuity update:** AI may directly edit `_memory.continuity` YAML frontmatter blocks in `implementation-summary.md` without running generate-context.js (per ADR-004). The resume ladder only reads continuity from `implementation-summary.md`.
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()
- **Post-Save Review:** After `generate-context.js` completes, check the POST-SAVE QUALITY REVIEW output.
  - **HIGH** issues: MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)
  - **MEDIUM** issues: patch when practical
  - **PASSED/SKIPPED**: no action needed

#### COMPLETION VERIFICATION RULE [HARD] BLOCK
Trigger: Claiming "done", "complete", "finished", "works"
1. Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` (Exit 0 = pass, 1 = warnings, 2 = errors).
2. Load `checklist.md` → verify ALL items → mark `[x]` with evidence.
- Skip: Level 1 tasks (no checklist.md required).

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT
- **Exception:** If the user already answered Gate 3 earlier in this conversation for the same task, do NOT re-ask. Reuse the existing answer and proceed.

#### Self-Check (before ANY tool-using response):
- [ ] File modification? Asked spec folder question?
- [ ] Skill routing verified?
- [ ] Saving memory? Using `generate-context.js` (not Write tool)?
- [ ] Aligned with ORIGINAL request? No scope drift?
- [ ] Claiming completion? `checklist.md` verified?

---

## 3. 📝 SPEC FOLDER DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details:** system-spec-kit SKILL.md (§1 When to Use, §3 How it Works, §4 Rules)

### Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500           | Level 2 + decision-record.md (+ optional research.md, resource-map.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |
| **Phase Parent** | n/a (control file only) | spec.md, description.json, graph-metadata.json | Folder contains phase children (`[0-9]{3}-name/` subdirs with their own spec.md/description.json) |

**Optional cross-cutting docs (any level)**: `handover.md`, `debug-delegation.md`, `research.md`, and `resource-map.md` - copy from `.opencode/skill/system-spec-kit/templates/` as needed. For phase parents that have undergone reorganization (renames, gap renumbering, consolidation), `context-index.md` provides a migration bridge — optional, no required template.

> **Phase Parent Mode:** When a spec folder contains at least one direct child matching `^[0-9]{3}-[a-z0-9-]+$` AND that child has `spec.md` OR `description.json`, the validator treats the folder as a phase parent and ONLY requires `{spec.md, description.json, graph-metadata.json}` at the parent level. Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live in the phase children where they stay accurate to that phase's actual work. Detection rule: `is_phase_parent()` (shell, in `scripts/lib/shell-common.sh`) and `isPhaseParent()` (TS/JS, in `mcp_server/lib/spec/is-phase-parent.ts` + `scripts/dist/spec/is-phase-parent.js`) are the single source of truth — both must agree. **Content discipline:** the phase-parent `spec.md` must NOT narrate consolidation, merge, or migration history — it documents root purpose, sub-phase control file, and what needs done. Migration history goes in `context-index.md` if needed. Resume on a phase parent first follows a fresh `derived.last_active_child_id` pointer from `graph-metadata.json`; missing, null, stale, or `--no-redirect` cases list child phases with statuses (per `/spec_kit:resume` step 3b) so the user can pick which phase to continue. Tolerant policy: legacy phase parents that retain heavy docs continue to validate; soft-deprecation is a follow-on packet.

> **Note:** `implementation-summary.md` is REQUIRED for all levels but created **after implementation completes**, not at spec folder creation time. See SKILL.md §4 Rule 13.

> **Mandatory metadata:** Every spec folder (Level 1+) MUST contain `description.json` and `graph-metadata.json`. Both are auto-generated/refreshed by `generate-context.js` during canonical saves. `graph-metadata.json` stores lowercase derived status and falls back to `implementation-summary.md` presence plus checklist completion when explicit status is absent. If creating a spec folder manually or via template, run `generate-description.js` and the graph-metadata backfill to ensure both files exist. The backfill is inclusive by default; add `--active-only` only when you intentionally want to skip `z_archive/` and `z_future/`. Spec folders without these files are invisible to memory search and graph traversal.

**Rules:** When in doubt → higher level. LOC is soft guidance (risk/complexity can override). Single typo/whitespace fixes (<5 characters in one file) are exempt.

**Spec folder path:** `specs/[###-short-name]/` | **Templates:** `.opencode/skill/system-spec-kit/templates/`

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

| Confidence   | Action                                       |
| ------------ | -------------------------------------------- |
| **≥80%**     | Proceed with citable source                  |
| **40-79%**   | Proceed with caveats                         |
| **<40%**     | Ask for clarification or mark "UNKNOWN"      |
| **Override** | Blockers/conflicts → ask regardless of score |

**Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?"

**Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step.

---

## 5. 🤖 AGENT ROUTING

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

- **`@context`** - LEAF-only retrieval agent for codebase search, pattern discovery, and context loading. Uses memory triggers/context, memory search, CocoIndex, and direct code evidence. LEAF constraint: `@context` MUST NOT dispatch sub-agents, use the Task tool, or write files. All results are returned to the caller; never held in nested context
- **`@orchestrate`** - Multi-agent coordination, complex workflows
- **`@code`** - Application-code implementation specialist (LEAF, write-capable). Stack-aware via `sk-code` skill delegation; fail-closed verification. Dispatched ONLY by `@orchestrate` (orchestrator-only convention; `Depth: 1` marker required per §0 dispatch gate; not harness-enforced).
- **`@review`** - Code review, PRs, quality gates (READ-ONLY)
- **`@debug`** - Fresh perspective debugging (5-phase root-cause). Dispatched via Task tool; retains exclusive write access for `debug-delegation.md`
- **`@deep-research`** - Autonomous deep research iterations (LEAF). Dispatched by `/spec_kit:deep-research`
- **`@deep-review`** - Autonomous deep review iterations (LEAF, P0/P1/P2). Dispatched by `/spec_kit:deep-review`
- **`@multi-ai-council`** - Multi-strategy planning architect (planning-only)
- **`@improve-agent`** - Bounded agent improvement via `sk-improve-agent`. Dispatched by `/improve:agent`
- **`@improve-prompt`** - Prompt engineering via `sk-improve-prompt`. Dispatched by `/improve:prompt`

#### Distributed Governance Rule

- Any agent writing authored spec folder docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `review-report.md`, `debug-delegation.md`, `resource-map.md`) MUST use templates from .opencode/skill/system-spec-kit/Level template contract for level-owned docs and the root cross-cutting templates where applicable. This is a workflow-required gate, not a runtime hook: run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after authored spec-doc writes and before completion claims, then route continuity updates through /memory:save. Deep-research workflow-owned packet markdown (`research/iterations/*.md`, `research/deep-research-*.md`, and progressive `research/research.md` loop updates) is exempt from that generic per-write rule; `/spec_kit:deep-research` must instead run targeted strict validation after every `spec.md` mutation it performs. @deep-research retains exclusive write access for `research/research.md`; @debug retains exclusive write access for `debug-delegation.md`. `resource-map.md` is optional at any level — copy it from `level_contract_optional_resource-map.md` when a packet wants a lean path ledger alongside `implementation-summary.md`.

---

## 6. ⚙️  MCP TOOL ROUTING

**Two systems:**

1. **Native MCP** (`opencode.json`) - Direct tools, called natively
   - Sequential Thinking, Spec Kit Memory, Code Mode, CocoIndex Code

2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()`
   - Figma, Github, ClickUp, Chrome DevTools, etc.
   - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `clickup.clickup_get_teams({})`)
   - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json`
  
---

## 7. 🧩 SKILL ROUTING REFERENCE

Skills are specialized, on-demand support that provide domain expertise. Unlike knowledge files (passive references), skills are explicitly invoked to handle complex, multi-step workflows.

### How Skills Work

```
Task Received → Gate 2: Read hook brief, or run skill_advisor.py fallback
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

1. Gate 2 provides skill recommendation via the Skill Advisor Hook, or via `skill_advisor.py` when the hook is unavailable.
2. Invoke using appropriate method for your environment
3. Read bundled resources from `references/`, `scripts/`, `assets/` paths
4. Follow skill instructions to completion
5. Do NOT re-invoke a skill already in context