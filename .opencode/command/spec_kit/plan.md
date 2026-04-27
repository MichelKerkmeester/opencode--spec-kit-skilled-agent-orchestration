---
description: Planning workflow (8 steps) - spec through plan only, no implementation. Supports :auto, :confirm, and :with-phases modes
argument-hint: "<feature-description> [:auto|:confirm] [:with-phases] [--intake-only] [--phases N] [--phase-names list] [--phase-folder=<path>] [--spec-folder=PATH] [--level=1|2|3|3+] [--start-state=STATE] [--repair-mode=MODE] [--record-relationships=yes|no] [--depends-on=IDs] [--related-to=IDs] [--supersedes=IDs]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **Ownership:** Markdown owns setup (resolves all inputs). YAML owns execution (dispatches steps). Setup values resolved here are passed to the YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
>    Note: `:with-phases` is a feature flag, not an execution mode. It modifies the workflow but does not change the base execution mode.
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `spec_kit_plan_auto.yaml`
>    - Confirm mode → `spec_kit_plan_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow. Do not treat reference sections, routing tables, or dispatch templates as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@deep-research`, `@context`) from this document
- **DO NOT** dispatch `@deep-research` unless confidence < 60% during planning (Step 5)
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file, then execute it step by step

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. Round-trip: 1 user interaction.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No analysis, no tool calls — ask ALL questions immediately, then wait.

Read-only discovery to classify folder state is allowed when `spec_path` is explicit or can be inferred from the setup answers. Healthy folders keep the existing prompt shape; non-healthy folders run the intake contract (`.opencode/skill/system-spec-kit/references/intake-contract.md`) inline inside the same consolidated prompt and MUST NOT open a second visible command flow. When `--intake-only` is present, execution halts after the Emit phase without proceeding to planning Steps 2–8.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   ├─ ":auto"    → execution_mode = "AUTONOMOUS" (omit Q2)
   ├─ ":confirm" → execution_mode = "INTERACTIVE" (omit Q2)
   └─ No suffix  → execution_mode = "ASK" (include Q2)

1a. CHECK :with-phases flag:
   ├─ ":with-phases" present → phase_decomposition = TRUE (omit Q6)
   │   Parse additional flags: --phases N (default 3), --phase-names "a,b,c" (optional)
   │   Include Q7 (Phase Count) and Q8 (Phase Names) if not provided via flags
   └─ Not present → phase_decomposition = "ASK" (include Q6)

1a-b. CHECK --intake-only flag:
   ├─ present → intake_only = TRUE; workflow halts after Emit phase, does not proceed to planning Steps 2–8
   └─ absent → intake_only = FALSE

1a-c. PARSE intake contract flags (see .opencode/skill/system-spec-kit/references/intake-contract.md §1):
   ├─ --spec-folder=PATH → spec_path = PATH (bypass auto-discovery)
   ├─ --level=N → selected_level = N
   ├─ --start-state=STATE → requested_start_state = STATE
   ├─ --repair-mode=MODE → repair_mode = MODE
   ├─ --record-relationships=yes|no → collect_relationships = [true|false]
   ├─ --depends-on=PACKET_ID[,...] → seed manual_relationships.depends_on[]
   ├─ --related-to=PACKET_ID[,...] → seed manual_relationships.related_to[]
   └─ --supersedes=PACKET_ID[,...] → seed manual_relationships.supersedes[]

1b. CHECK --phase-folder flag:
   ├─ --phase-folder=<path> provided → auto-resolve spec_path to that child folder path
   │   Set spec_choice = "E", spec_path = <path>, omit Q1
   │   Validate path matches pattern: specs/[###]-*/[0-9][0-9][0-9]-*/
   │   Show parent context: "Phase folder: <path> (parent: <parent-folder>)"
   └─ Not provided → continue normally

2. CHECK $ARGUMENTS for feature description:
   ├─ Has content (ignoring :auto/:confirm) → feature_description = $ARGUMENTS, omit Q0
   └─ Empty → include Q0

3. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

4. Search for prior work (background):
   - memory_context({ input: feature_description OR "planning", mode: "focused", includeContent: true })
   > Gate 1 trigger matching handled at agent level (AGENTS.md).
   > Gate 3 spec-folder trigger classification is typed: `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` (`classifyPrompt()`). Invocations of `/spec_kit:plan` are already inside a write flow, so Gate 3 is pre-answered by command dispatch — no extra inference needed here.
   - Store: prior_work_found = [yes/no], prior_work_count = [N]

5. Prior-work loading question needed ONLY if user selects A or C for spec folder AND prior continuity records exist for this spec.

5a. CHECK intake contract requirement when `spec_path` is explicit or can be derived from Q1 / `--phase-folder`:
   ├─ Inspect `{spec_path}` for `spec.md`, `description.json`, `graph-metadata.json`, and tracked placeholder markers per intake-contract.md §3 Folder State Classification
   ├─ Normalize `folder_state` to one of: `empty-folder` | `partial-folder` | `repair-mode` | `placeholder-upgrade` | `populated-folder`
   ├─ `folder_state == populated-folder` AND `intake_only == FALSE` → `intake_required = FALSE` and preserve the current prompt unchanged
   ├─ `folder_state == populated-folder` AND `intake_only == TRUE` → no-op exit with informational message
   └─ Otherwise → `intake_required = TRUE`, inherit the parent `execution_mode`, and run the intake contract inline before Step 1 continues (or halt after Emit phase if `intake_only == TRUE`)

6. ASK with SINGLE prompt (include only applicable questions):

   Q0. Feature Description (if not in command): What feature to plan?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]  B) Create new: specs/[###]-[slug]/
     C) Update related [if match found]  D) Skip documentation
     E) Phase folder — target a specific phase child (e.g., specs/NNN-name/001-phase/)

   Q2. Execution Mode (if no suffix):
     A) Autonomous - all 8 steps without approval
     B) Interactive - pause at each step

   Q3. Dispatch Mode (required):
     A) Single Agent (Recommended)  B) Multi-Agent (1+2)  C) Multi-Agent (1+3)

   Q4. Prior Work Context (when prior continuity records exist for this spec):
     A) Load most recent spec-doc record  B) Load up to 3 most recent spec-doc records  C) Skip

   Q5. Research Intent (required):
     A) add_feature  B) fix_bug  C) refactor  D) understand

   Q6. Phase Decomposition (if :with-phases not in command):
     Create phased spec structure (parent + N child folders)?
     A) No — single spec folder (default)
     B) Yes — decompose into phases before planning

   Q7. Phase Count (if phase_decomposition == TRUE and --phases not provided):
     How many phases? (Default: 3)

   Q8. Phase Names (if phase_decomposition == TRUE and --phase-names not provided):
     Provide phase names? (Optional — auto-generated if skipped)
     Example: "data-model, api-layer, ui-components"

   **Intake contract block** (ONLY if `intake_required = TRUE`; keep this inside the SAME prompt, not a second command flow):

   Execute the Q0–Q4+ consolidated intake interview per `.opencode/skill/system-spec-kit/references/intake-contract.md §5`. Questions cover: feature description, target folder state, documentation level, relationship capture, and relationship entries (grouped `depends_on` / `related_to` / `supersedes` by `packet_id`).

   Reply format: "B, A, A, C, A" or "Add auth, B, A, C, A"

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - feature_description = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D/E from Q1]
   - spec_path = [derived path or null if D]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - dispatch_mode = [single/multi_small/multi_large from Q3]
   - memory_choice = [A/B/C from Q4, or N/A]
   - research_intent = [add_feature/fix_bug/refactor/understand from Q5]
   - IF `intake_required = TRUE`: bind `selected_level`, `start_state`, `repair_mode`, and `manual_relationships` from the inline intake-contract block (see intake-contract.md §6 for trio-publication semantics)
   - IF intake contract adjusts the target: update `feature_description` and `spec_path` from the returned contract before Step 1
   - IF `intake_only = TRUE`: halt here with STATUS=OK after intake Emit phase completes; do not proceed to Step 1

9. Execute background operations:
   - IF memory_choice == A: Load the most recent indexed canonical spec document
   - IF memory_choice == B: Load up to 3 recent indexed canonical spec documents or MCP context results
   - IF dispatch_mode is multi_*: Note parallel dispatch will be used
   - IF `intake_required = TRUE` AND `intake_only = FALSE`: continue the existing 8-step workflow using the bound `feature_description`, `spec_path`, `selected_level`, `start_state`, `repair_mode`, and `manual_relationships`
   - IF `intake_only = TRUE`: skip Steps 2–8; workflow terminates after intake Emit phase

10. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

⛔ DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without confirmation
⛔ NEVER auto-select execution mode without suffix or choice
⛔ NEVER split questions into multiple prompts
```

**Phase Output:**
- `feature_description` | `spec_choice` | `spec_path`
- `execution_mode` | `dispatch_mode` | `memory_loaded` | `research_intent`
- `phase_decomposition` | `phase_count` | `phase_names` (if `:with-phases`)
- `intake_only` (if `--intake-only`)
- `selected_level` | `start_state` | `repair_mode` | `manual_relationships` (when intake contract runs)

> **Cross-reference**: Implements AGENTS.md Section 2 "Gate 3: Spec Folder Question" and "First Message Protocol".

---

# SpecKit Plan

Execute the SpecKit planning lifecycle from specification through planning. Terminates after plan.md — use `/spec_kit:implement` for implementation.

> **ENFORCEMENT:** If the user requests implementation via free text (e.g., "implement this plan", "go ahead and build it") instead of `/spec_kit:implement`, you MUST route through the implement command. Do NOT begin implementing directly. Plan and implementation are **separate gate-checked phases** — gate answers from planning do NOT carry over.

```yaml
role: Expert Developer using Smart SpecKit for Planning Phase
purpose: Spec-driven planning with mandatory compliance and stakeholder review support
action: Run planning workflow from specification through technical plan creation

operating_mode:
  workflow: sequential
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: progressive_artifact_creation
  validation: consistency_check_before_handoff
```

---

## 1. PURPOSE

Run the planning workflow: specification, clarification, and technical planning. Creates spec.md, plan.md, tasks.md, and checklists without implementation. Use when planning needs review before coding.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Feature description with optional parameters (branch, scope, context)
**Outputs:** Spec folder with: spec.md, plan.md, tasks.md, checklist.md (Level 2+), a scaffolded root `graph-metadata.json` packet contract, plus a refreshed continuity update in canonical spec docs generated via structured `generate-context.js` input

> **Level 1 Note:** /spec_kit:plan creates spec.md, plan.md, and tasks.md. For complete Level 1 baseline implementation execution, run /spec_kit:implement after planning or use /spec_kit:complete instead.

```text
$ARGUMENTS
```

---

## 3. WORKFLOW OVERVIEW

| Step | Name             | Purpose                      | Outputs                  |
| ---- | ---------------- | ---------------------------- | ------------------------ |
| 1    | Intake           | Run intake contract (folder state, level, relationships) when required | intake_contract_output |
| 2    | Request Analysis | Analyze inputs, define scope | requirement_summary      |
| 3    | Pre-Work Review  | Review AGENTS.md, standards  | coding_standards_summary |
| 4    | Specification    | Create spec.md               | spec.md                  |
| 5    | Clarification    | Resolve ambiguities          | updated spec.md          |
| 6    | Planning         | Create technical plan        | plan.md, checklist.md    |
| 7    | Save Context     | Refresh continuity update in canonical spec docs | canonical spec doc updated via `generate-context.js` |
| 8    | Workflow Finish  | Close the planning pass after context refresh | planning_summary |

### Packet Graph Metadata

- Packet creation now scaffolds a root `graph-metadata.json` file alongside the canonical spec docs.
- The file starts with empty `manual.depends_on`, `manual.supersedes`, and `manual.related_to` arrays.
- Derived fields are intentionally minimal at creation time and are finalized by later canonical save or completion flows.

---

## 4. INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. OUTPUT FORMATS

**Success:**
```
✅ SpecKit Planning Complete — All 8 steps executed.
Artifacts: spec.md, plan.md, tasks.md, checklist.md (L2+), graph-metadata.json scaffolded, continuity update in canonical spec docs refreshed
Ready for: /spec_kit:implement [spec-folder-path]
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**
```
❌ SpecKit Planning Failed
Error: [description] | Step: [number]
STATUS=FAIL ERROR="[message]"
```

---

## 6. REFERENCE

**Full details in YAML prompts:** Workflow steps, field extraction, documentation levels (1/2/3), templates, completion report, mode behaviors, parallel dispatch config, checklist guidelines, failure recovery.

**See also:** AGENTS.md Sections 2-6 for memory loading, confidence framework, and request analysis.

---

## 7. PARALLEL DISPATCH

Supports smart parallel sub-agent dispatch using 5-dimension complexity scoring.

### Complexity Scoring (5 Dimensions)

| Dimension            | Weight | Scoring                                |
| -------------------- | ------ | -------------------------------------- |
| Domain Count         | 35%    | 1=0.0, 2=0.5, 3+=1.0                  |
| File Count           | 25%    | 1-2=0.0, 3-5=0.5, 6+=1.0             |
| LOC Estimate         | 15%    | <50=0.0, 50-200=0.5, >200=1.0         |
| Parallel Opportunity | 20%    | sequential=0.0, some=0.5, high=1.0    |
| Task Type            | 5%     | trivial=0.0, moderate=0.5, complex=1.0 |

**Thresholds:** <20% proceed directly | >=20% + 2 domains: ALWAYS ask user first

### Planning Step: 4-Agent Parallel Exploration (Automatic)

Step 5 dispatches 4 `@context` agents via Task tool (`subagent_type: "context"`):
1. **Architecture Explorer** — structure, entry points, connections
2. **Feature Explorer** — similar features, related patterns
3. **Dependency Explorer** — imports, modules, affected areas
4. **Test Explorer** — test patterns, testing infrastructure

After agents return, verify hypotheses by reading identified files.

**Eligible Phases:** Step 3 (Specification), Step 5 (Planning with 4-agent exploration)

**Override Phrases:**
- Direct: "proceed directly", "handle directly", "skip parallel"
- Parallel: "use parallel", "dispatch agents", "parallelize"
- Auto-decide: "auto-decide", "auto mode", "decide for me" (1hr preference)

**Workstream Prefix:** `[W:PLAN]` for all planning dispatch tracking.

### Code Search Routing

| Need | Tool | Example |
|------|------|---------|
| Exact text/token | Grep | `function authenticate(` |
| File name/path | Glob | `**/*auth*.ts` |
| Concept/intent | CocoIndex (`mcp__cocoindex_code__search`) | "authentication middleware" |
| Prior decisions | memory_search | `{ query: "auth decisions" }` |

**Rule**: When exact function name or text is unknown, use CocoIndex FIRST (2-5 word natural language queries), then verify with Grep/Read. Do NOT Grep to guess at patterns when semantic search can find the concept directly.

---

## 8. MEMORY INTEGRATION

### Unified Memory Retrieval

Use `/memory:search` with intent-aware retrieval:

| Intent        | Retrieval Focus                            | Typical Anchors                     |
| ------------- | ------------------------------------------ | ----------------------------------- |
| `add_feature` | Prior implementations, patterns, decisions | architecture, decisions, patterns   |
| `fix_bug`     | Error history, debugging sessions, fixes   | errors, debugging, fixes            |
| `refactor`    | Code structure, dependencies, tech debt    | architecture, dependencies, quality |
| `understand`  | Explanations, documentation, learning      | research, findings, explanations    |

### Memory Search by Phase

| Phase         | Query                                                   | Purpose                     |
| ------------- | ------------------------------------------------------- | --------------------------- |
| Before Step 1 | `/memory:search --intent:{intent} "topic"`            | Find prior related work     |
| During Step 3 | `memory_search({ query: "architecture patterns", anchors: ['architecture'] })`          | Existing patterns/decisions |
| During Step 5 | `memory_search({ query: "planning decisions rationale", anchors: ['decisions', 'rationale']})` | Prior planning decisions    |
| After Step 6  | `generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]` | Refresh the indexed canonical spec document   |

### After Planning

1. **Generate:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
2. **Anchors auto-extracted:** planning-[feature], decisions, architecture, next-steps
3. **Verify:** Confirm the routed canonical spec document (`decision-record.md`, `implementation-summary.md`, or `handover.md`) was updated and indexed; the canonical continuity path lives in those spec docs and the `_memory.continuity` YAML block inside `implementation-summary.md`

---

## 9. QUALITY GATES

| Gate Type      | Trigger Point          | Threshold | Validates                        |
| -------------- | ---------------------- | --------- | -------------------------------- |
| Pre-execution  | Before Step 1          | 70        | Inputs and prerequisites         |
| Mid-execution  | After Step 3 (Spec)    | 70        | spec.md quality                  |
| Post-execution | After Step 8 (Workflow Finish)| 70        | All artifacts complete           |

**Pre-execution:** Feature description clear, spec path valid, no blocking prerequisites
**Mid-execution:** spec.md has all sections, acceptance criteria measurable, no [NEEDS CLARIFICATION]
**Post-execution:** All artifacts exist (spec.md, plan.md), memory saved, handover checked

### Five Checks (Pre-execution, Level 3/3+ only)

| # | Check              | Pass Criteria                              |
|---|--------------------|--------------------------------------------|
| 1 | Necessary?         | Clear requirement, not speculative         |
| 2 | Beyond Local Max?  | >=2 alternatives with trade-offs           |
| 3 | Sufficient?        | No simpler solution achieves the goal      |
| 4 | Fits Goal?         | Directly advances stated objective         |
| 5 | Open Horizons?     | No tech debt or lock-in created            |

Record results in decision-record.md for architectural changes.

---

## 10. ERROR HANDLING

| Error | Action |
|-------|--------|
| Spec folder not found | Verify path exists; offer to create via /spec_kit:plan |
| Memory context load failure | Proceed without prior context; note gap |
| YAML workflow dispatch error | Retry once; if persistent, report error and halt |

---

## 11. KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- **Terminates after planning** — no task breakdown, analysis, or implementation
- **Next step guidance** — recommends `/spec_kit:implement` when ready
- **Use case** — planning phase separation, stakeholder review, feasibility analysis

---

## 12. PHASE DECOMPOSITION (`:with-phases`)

### Overview

When `:with-phases` is present, a phase decomposition pre-workflow runs before the normal 8-step planning workflow. This creates a parent spec folder with N child phase folders, then continues planning on the first child phase.

### Trigger

- **Flag:** `:with-phases` in command invocation
- **Smart detect:** When `recommend-level.sh --recommend-phases` scores above threshold during Step 1, suggest `:with-phases` to user

### Phase Decomposition Pre-Workflow (4 steps)

Runs after setup, before Step 1:

| Pre-Step | Name | Purpose | Outputs |
|----------|------|---------|---------|
| P1 | Analyze Scope | Run `recommend-level.sh --recommend-phases` | phase_recommendation |
| P2 | Define Decomposition | Generate phase names, boundaries, dependencies | phase_plan |
| P3 | Create Folders | Run `create.sh --phase --phases N` | parent + child folders |
| P4 | Populate Templates | Fill parent Phase Documentation Map + child back-references | populated specs |

### After Phase Creation

- `spec_path` automatically updates to first child phase folder
- Normal Steps 1-8 execute targeting that first child
- Subsequent children: invoke `/spec_kit:plan --phase-folder=<child-path>` per child

> **Lean parent.** The parent created by `create.sh --phase` scaffolds from `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` (the lean phase-parent template) and contains ONLY the lean trio: `spec.md`, `description.json`, `graph-metadata.json`. Heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live exclusively in the phase children. Each child receives the appropriate Level-N templates as today. The validator's phase-parent branches in `check-files.sh`, `check-level-match.sh`, `check-anchors.sh`, `check-section-counts.sh`, and `check-template-headers.sh` skip Level-N expectations on the parent automatically. Tolerant policy preserves legacy phase parents that retain heavy docs.

### Checkpoint

```
WORKFLOW CHECKPOINT - Phase Decomposition Complete
Parent: specs/[NNN]-[name]/ | Phases: [N] children created
Continue planning first child (001-[name]/)? [Y/n/review]
```

### Arguments

| Flag | Description | Default |
|------|-------------|---------|
| `--phases N` | Number of child phases | 3 |
| `--phase-names "a,b,c"` | Comma-separated phase names | Auto-generated |

### Examples

```
/spec_kit:plan:auto "Build hybrid RAG system" :with-phases --phases 3
/spec_kit:plan:auto "Large platform migration" :with-phases --phase-names "data-layer,api,ui"
/spec_kit:plan:confirm "OAuth2 implementation" :with-phases
```

---

## 13. COMMAND CHAIN

```
[/spec_kit:deep-research] → /spec_kit:plan [:with-phases] → [/spec_kit:implement]
```

Next step: `/spec_kit:implement [spec-folder-path]`

---

## 14. NEXT STEPS

| Condition                    | Suggested Command                        | Reason                    |
| ---------------------------- | ---------------------------------------- | ------------------------- |
| Ready to implement           | `/spec_kit:implement [spec-folder-path]` | Continue to implementation|
| Need stakeholder review      | Share `plan.md` for review               | Get approval before coding|
| Technical uncertainty        | `/spec_kit:deep-research [topic]`        | Investigate first         |
| Need to pause                | `/memory:save [spec-folder-path]`        | Refresh the indexed canonical spec document before pausing |
| Refresh search support       | `/memory:save [spec-folder-path]`        | Refresh the indexed canonical spec document while canonical continuity stays in spec docs |

**ALWAYS** end with: "What would you like to do next?"
