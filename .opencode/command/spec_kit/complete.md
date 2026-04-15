---
description: Full end-to-end SpecKit workflow (14+ steps) - supports :auto, :confirm, :with-research, and :with-phases modes
argument-hint: "<feature-description> [:auto|:confirm] [:with-research] [:with-phases] [--phases N] [--phase-names list] [--phase-folder=<path>]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **Ownership:** Markdown owns setup (resolves all inputs). YAML owns execution (dispatches steps). Setup values resolved here are passed to the YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
>    Note: :with-research and :with-phases are feature flags, not execution modes. They modify the :auto or :confirm workflow but do not change the base execution mode.
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `spec_kit_complete_auto.yaml`
>    - Confirm mode → `spec_kit_complete_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow. Do not treat reference sections, routing tables, or dispatch templates as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@review`, `@debug`, `@context`, `@deep-research`) from this document
- **DO NOT** dispatch `@review` to review this workflow or command prompt
- **DO NOT** dispatch `@debug` unless `failure_count >= 3` during the Development step (Step 10) and the workflow has already prepared a diagnostic summary for the Task-tool handoff
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file, then execute it step by step

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. Round-trip: 1 user interaction.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No analysis, no tool calls — ask ALL questions immediately, then wait.

Read-only discovery to classify folder state is allowed when `spec_path` is explicit or can be inferred from the setup answers. Healthy folders keep the existing prompt shape; non-healthy folders run the intake contract (`.opencode/skill/system-spec-kit/references/intake-contract.md`) inline inside the same consolidated prompt and MUST NOT open a second visible command flow.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   ├─ ":auto"    → execution_mode = "AUTONOMOUS" (omit Q2)
   ├─ ":confirm" → execution_mode = "INTERACTIVE" (omit Q2)
   └─ No suffix  → execution_mode = "ASK" (include Q2)

1a. CHECK feature flags:
   ├─ ":with-research" present → research_integration = TRUE
   ├─ ":with-phases" present → phase_decomposition = TRUE (omit Q6)
   │   Parse additional flags: --phases N (default 3), --phase-names "a,b,c" (optional)
   │   Include Q7 (Phase Count) and Q8 (Phase Names) if not provided via flags
   └─ None of above → respective flag = FALSE; phase_decomposition = "ASK" (include Q6)

1b. CHECK --phase-folder flag:
   ├─ --phase-folder=<path> provided → auto-resolve spec_path to that child folder path
   │   Set spec_choice = "E", spec_path = <path>, omit Q1
   │   Validate path matches pattern: specs/[###]-*/[0-9][0-9][0-9]-*/
   │   Show parent context: "Phase folder: <path> (parent: <parent-folder>)"
   └─ Not provided → continue normally

2. CHECK $ARGUMENTS for feature description:
   ├─ Has content (ignoring flags/suffix) → feature_description = $ARGUMENTS, omit Q0
   └─ Empty → include Q0

3. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

4. Search for prior work (background):
   - memory_context({ input: feature_description OR "complete", mode: "focused", includeContent: true })
   > Gate 1 trigger matching handled at agent level (AGENTS.md).
   - Store: prior_work_found = [yes/no], prior_work_count = [N]

5. Memory loading question needed ONLY if user selects A or C for spec folder AND memory/ has files.

5a. CHECK intake contract requirement when `spec_path` is explicit or can be derived from Q1 / `--phase-folder`:
   ├─ Inspect `{spec_path}` for `spec.md`, `description.json`, `graph-metadata.json`, persisted intake resume markers, and tracked placeholder markers per intake-contract.md §3 Folder State Classification
   ├─ Normalize `folder_state` to one of: `empty-folder` | `partial-folder` | `repair-mode` | `placeholder-upgrade` | `populated-folder`
   ├─ Treat `resume_question_id` / `reentry_reason` or tracked placeholder markers as intake-required resume/upgrade state, not as a healthy folder
   ├─ `folder_state == populated-folder` → `intake_required = FALSE` and preserve the current prompt unchanged
   └─ Otherwise → `intake_required = TRUE`, inherit the parent `execution_mode`, and run the intake contract inline before Step 1 continues

6. ASK with SINGLE prompt (include only applicable questions):

   Q0. Feature Description (if not in command): What feature to build?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]  B) Create new: specs/[###]-[slug]/
     C) Update related [if match found]  D) Skip documentation
     E) Phase folder — target a specific phase child (e.g., specs/NNN-name/001-phase/)

   Q2. Execution Mode (if no suffix):
     A) Autonomous - all 14 steps without approval
     B) Interactive - pause at each step

   Q3. Dispatch Mode (required):
     A) Single Agent (Recommended)  B) Multi-Agent (1+2)  C) Multi-Agent (1+3)

   Q4. Memory Context (if existing spec with memory/):
     A) Load most recent  B) Load all recent (up to 3)  C) Skip

   Q5. Research Intent (required):
     A) add_feature  B) fix_bug  C) refactor  D) understand

   Q6. Phase Decomposition (if :with-phases not in command):
     Create phased spec structure (parent + N child folders)?
     A) No — single spec folder (default)
     B) Yes — decompose into phases before building

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
   - phase_decomposition = [TRUE/FALSE]
   - phase_count = [from Q6 or --phases, default 3]
   - phase_names = [from Q7 or --phase-names, or null for auto-generate]
   - IF `intake_required = TRUE`: bind `selected_level`, `start_state`, `repair_mode`, and `manual_relationships` from the inline intake-contract block (see intake-contract.md §6 for trio-publication semantics)
   - IF intake contract adjusts the target: update `feature_description` and `spec_path` from the returned contract before Step 1

9. Execute background operations:
   - IF memory_choice == A: Load the most recent indexed canonical spec document
   - IF memory_choice == B: Load up to 3 recent indexed canonical spec documents or MCP context results
   - IF dispatch_mode is multi_*: Note parallel dispatch will be used
   - IF `intake_required = TRUE`: continue the existing 14-step workflow using the bound `feature_description`, `spec_path`, `selected_level`, `start_state`, `repair_mode`, and `manual_relationships`

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
- `research_integration` | `auto_debug`
- `selected_level` | `start_state` | `repair_mode` | `manual_relationships` (when intake contract runs)

> **Cross-reference**: Implements AGENTS.md Section 2 "Gate 3: Spec Folder Question" and "First Message Protocol".

---

# SpecKit Complete

Execute the complete SpecKit lifecycle from specification through implementation with context preservation.

```yaml
role: Expert Developer using Smart SpecKit with Full Lifecycle Management
purpose: Spec-driven development with mandatory compliance and comprehensive documentation
action: Run full 14-step SpecKit from specification to implementation
operating_mode:
  workflow: sequential_14_step
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: checkpoint_based_with_checklist_verification
```

---

## 1. PURPOSE

Run the full 14-step SpecKit workflow: specification, clarification, planning, task breakdown, implementation, and context saving.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Feature description with optional parameters (branch, scope, context)
**Outputs:** Complete spec folder with all artifacts, refreshed `graph-metadata.json`, and `STATUS=<OK|FAIL|CANCELLED>`

```text
$ARGUMENTS
```

### Phase Folder Support

When `--phase-folder=<path>` is provided or spec folder selection includes a phase child:
- **Option E) Phase folder** — complete a specific phase child (e.g., `specs/NNN-name/001-phase/`)
- Auto-resolve `spec_path` to the phase child folder; validate path matches `specs/[###]-*/[0-9][0-9][0-9]-*/`
- Show parent context: "Phase folder: `<path>` (parent: `<parent-folder>`)"
- **Phase lifecycle validation:** If spec folder is a phase child, verify predecessor phase is complete before proceeding. For the first phase (`001-*`), skip predecessor validation (no predecessor exists). For subsequent phases, check that the previous numbered phase folder (e.g., `001-*` before `002-*`) satisfies **either** condition (OR logic): (a) `implementation-summary.md` exists, OR (b) all tasks marked `[x]` in `tasks.md`. Either condition alone is sufficient to consider the predecessor complete.

---

## 3. WORKFLOW OVERVIEW

| Step | Name | Purpose | Outputs |
|------|------|---------|---------|
| 1 | Request Analysis | Analyze inputs, define scope | requirement_summary |
| 2 | Pre-Work Review | Review AGENTS.md, standards | coding_standards_summary |
| 3 | Specification | Create spec.md | spec.md, feature branch |
| 4 | Clarification | Resolve ambiguities | updated spec.md |
| 5 | Quality Checklist | Generate validation checklist (ACTIVELY USED at completion) | checklist.md |
| 6 | Planning | Create technical plan | plan.md, research/research.md |
| 7 | Task Breakdown | Break into tasks | tasks.md |
| 8 | Analysis | Verify consistency | consistency_report |
| 9 | Implementation Check | Verify prerequisites | greenlight |
| 9.5 | **PREFLIGHT Capture** | Capture epistemic baseline | preflight_baseline |
| 10 | Development | Execute implementation | code changes |
| 11 | Checklist Verify | Verify P0/P1 items (Level 2+) | All P0/P1 verified |
| 11.5 | **POSTFLIGHT Capture** | Capture learning delta | postflight_delta |
| 12 | Completion | Generate summary (MANDATORY L2+) | implementation-summary.md |
| 13 | Save Context | Refresh continuity update in canonical spec docs | canonical spec doc updated via `generate-context.js` |
| 14 | Workflow Finish | Close the workflow after the final continuity check | workflow_closed |

### Packet Graph Metadata

- Completion relies on canonical save to refresh the packet's root `graph-metadata.json`.
- `/spec_kit:complete` is responsible for final packet-facing derived state such as `status` and `last_save_at`.
- Manual packet relationships remain untouched during completion; only the derived section is refreshed.

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/spec_kit:complete :auto "feature"` | Execute all steps without approval gates |
| `:confirm` | `/spec_kit:complete :confirm "feature"` | Pause at each step for approval |
| `:with-research` | `/spec_kit:complete :with-research "feature"` | Insert research phase after Step 2 (before specification) |
| `:with-phases` | `/spec_kit:complete :with-phases "feature"` | Insert phase decomposition before Step 1, then complete first child |
| (default) | `/spec_kit:complete "feature"` | Ask user to choose mode during setup |

---

## 4. PHASE A: PLANNING (Steps 1-7)

| STEP | NAME | REQUIRED OUTPUT | VERIFICATION |
|------|------|----------------|--------------|
| 1 | Request Analysis | requirement_summary | Scope defined |
| 2 | Pre-Work Review | coding_standards_summary | AGENTS.md reviewed |
| 3 | Specification | `spec.md` created | File exists, no [NEEDS CLARIFICATION] |
| 4 | Clarification | updated `spec.md` | Ambiguities resolved |
| 5 | Quality Checklist | `checklist.md` (Level 2+) | Checklist items defined |
| 6 | Planning | `plan.md` (+ research/research.md if Phase 3 ran) | Technical approach documented |
| 7 | Task Breakdown | `tasks.md` created | All tasks listed with IDs |

### Planning Gate (HARD BLOCK between Step 7 and Step 8)

All planning artifacts must exist before implementation begins. Score >= 70 to pass:
- spec.md exists with NO [NEEDS CLARIFICATION] markers (25 pts)
- plan.md exists with technical approach defined (25 pts)
- tasks.md exists with all tasks listed as T### IDs (25 pts)
- checklist.md verified - Level 2+ (15 pts)
- the review agent's approval (10 pts)

IF any artifact missing -> STOP -> Return to appropriate step -> Complete -> Re-attempt gate

### Optional Research Phase

When `:with-research` flag present or research_triggered == TRUE:
- Execute research workflow after Step 2, before Step 3 (Specification), using same spec_path and execution_mode
- Display checkpoint with key findings summary
- User responds: Y (continue) / n (pause) / review (see research/research.md first)
- If research_triggered == FALSE, continue directly to Step 3 (Specification)

### Optional Phase Decomposition

When `:with-phases` flag present:
- Execute phase decomposition pre-workflow before Step 1 (after setup):
  1. Analyze scope via `recommend-level.sh --recommend-phases`
  2. Define decomposition (names, boundaries, dependencies)
  3. Create folders via `create.sh --phase --phases N --phase-names "a,b,c"`
  4. Populate parent Phase Documentation Map + child back-references
- Display checkpoint: "Phase decomposition complete. Continue with first child? [Y/n/review]"
- After creation, `spec_path` updates to first child phase folder
- Normal 14-step workflow executes targeting that first child
- Subsequent children: invoke `/spec_kit:complete --phase-folder=<child-path>` per child
- Arguments: `--phases N` (default 3), `--phase-names "a,b,c"` (optional, auto-generated if omitted)

---

## 5. PHASE B: IMPLEMENTATION (Steps 8-14)

| STEP | NAME | REQUIRED OUTPUT | VERIFICATION |
|------|------|----------------|--------------|
| 8 | Analysis | consistency_report | Artifacts cross-checked |
| 9 | Implementation Check | prerequisites_verified | Ready to implement |
| 9.5 | **PREFLIGHT Capture** | preflight_baseline | Epistemic baseline recorded |
| 10 | Development | code changes + tasks marked `[x]` | **ALL tasks in tasks.md marked complete** |
| 11 | Checklist Verify | All P0/P1 verified | **Level 2+ ONLY - BLOCKING** |
| 11.5 | **POSTFLIGHT Capture** | postflight_delta | Learning delta calculated |
| 12 | Completion | `implementation-summary.md` + nested changelog when applicable | **Summary file created (MANDATORY Level 1+)** |
| 13 | Save Context | canonical spec doc refreshed | Context preserved without changing the canonical resume path |
| 14 | Workflow Finish | workflow_closed | Final continuity state confirmed |

### Step Requirements

**Step 9.5 (PREFLIGHT):** Execute after Step 9, before Step 10. Skip if: quick fix (<10 LOC) or continuation with existing PREFLIGHT. Call `task_preflight()` with: specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, knowledgeGaps. User can say "skip preflight".

**Step 10 (Development):** Load tasks.md, execute in order. Mark each task `[x]` when completed. MUST NOT claim "development complete" until ALL tasks marked `[x]`. Test code changes before marking complete.

**Step 10 - Scope Growth / Level Upgrade:** If scope grows during Step 10, run `upgrade-level.sh` to add higher-level templates. After the script completes, the AI agent **must** auto-populate all injected `[placeholder]` text:
1. Read all existing spec files (spec.md, plan.md, tasks.md, implementation-summary.md) for context
2. Identify all `[placeholder]` patterns in newly injected template sections
3. Replace each placeholder with content derived from existing spec context
4. Run `check-placeholders.sh` on the spec folder to verify zero placeholders remain
If source context is insufficient for a section, write "N/A - insufficient source context" rather than leaving placeholders or fabricating content.

**Step 11 (Checklist Verification - Level 2+ BLOCKING):** Load checklist.md. Verify ALL P0 items marked `[x]` with evidence. P1: marked `[x]` with evidence OR documented user approval to defer. P2: may defer without approval. Evidence format: `[EVIDENCE: file.js:45-67 - implementation verified]`. HARD BLOCK: Cannot proceed to Step 12 if any P0 items unchecked.

**Step 11.5 (POSTFLIGHT):** Execute after Step 11, before Step 12. Skip if: quick fix (<10 LOC) or no PREFLIGHT at Step 9.5. Call `task_postflight()` with: specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore, gapsClosed, newGapsDiscovered. Learning Index = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25).

**Step 12 (Completion - MANDATORY Level 1+):** Validation runs automatically (exit 0=pass, 1=warnings, 2=errors must fix). Verify all tasks show `[x]`. Create implementation-summary.md with: files modified/created, verification steps, deviations from plan, testing results. When the target is a spec root or phase child, also generate the packet-local changelog with `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js [spec-folder-path] --write`.

**Step 13 (Save Context):** Use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder-path]`. DO NOT use Write/Edit tools to author continuity update in canonical spec docss directly; the script refreshes the indexed canonical spec document and the packet's `graph-metadata.json` while the canonical resume path stays in `handover.md`, `_memory.continuity`, and the packet spec docs.

**Step 14 (Workflow Finish):** Present the final closeout checkpoint. If the user wants to pause or refresh continuity again, use `/memory:save` before marking the workflow complete.

---

## 6. STEP 10 DEBUG INTEGRATION

Track failure_count per task during Step 10 (reset for each task in tasks.md):

IF failure_count >= 3:
- Escalate to the user with a diagnostic summary (error, affected files, attempted fixes, current_task_id)
- User may manually dispatch `@debug` via Task tool, continue manually, skip the task, or pause

---

## 7. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt:
- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 8. OUTPUT FORMATS

**Success:**
```
All 14 steps executed successfully.
Artifacts: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, nested changelog (when applicable), graph-metadata.json refreshed, continuity update in canonical spec docs refreshed
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**
```
Error: [error description]  Step: [step number]
STATUS=FAIL ERROR="[message]"
```

---

## 9. VALIDATION

Validation runs automatically on the spec folder before marking complete.

| Option | Description |
|--------|-------------|
| `--json` | JSON format output |
| `--strict` | Treat warnings as errors |
| `--quiet` | Suppress output except errors |
| `--verbose` | Detailed output with timing |

**7 Rules:** FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, LEVEL_DECLARED, PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID

**Exit codes:** 0 = pass, 1 = warnings, 2 = errors (must fix)

---

## 10. PARALLEL DISPATCH

### Complexity Scoring (5 Dimensions)

| Dimension | Weight | Scoring |
|-----------|--------|---------|
| Domain Count | 35% | 1=0.0, 2=0.5, 3+=1.0 |
| File Count | 25% | 1-2=0.0, 3-5=0.5, 6+=1.0 |
| LOC Estimate | 15% | <50=0.0, 50-200=0.5, >200=1.0 |
| Parallel Opportunity | 20% | sequential=0.0, some=0.5, high=1.0 |
| Task Type | 5% | trivial=0.0, moderate=0.5, complex=1.0 |

**Thresholds:** <20% proceed directly. >=20% + 2 domains: ALWAYS ask user.

### Step 6: 4-Agent Parallel Exploration (Automatic)

Dispatches 4 `@context` agents (`subagent_type: "context"`) via Task tool. Per AGENTS.md, `@context` is the **exclusive** agent for all codebase exploration.

1. **Architecture Explorer** - Structure, entry points, component connections
2. **Feature Explorer** - Similar features, related patterns
3. **Dependency Explorer** - Imports, modules, affected areas
4. **Test Explorer** - Test patterns, testing infrastructure

After agents return, hypotheses are verified by reading identified files.

### Eligible Phases

Steps 3 (Specification), 6 (Planning + auto 4-agent), 8 (Analysis), 10 (Development)

### Override Phrases

- **Direct**: "proceed directly", "handle directly", "skip parallel"
- **Parallel**: "use parallel", "dispatch agents", "parallelize"
- **Auto-decide**: "auto-decide", "auto mode" (1 hour session preference)

### Workstream Prefixes

`[W:ARCH]` Architecture | `[W:FEAT]` Feature | `[W:DEPS]` Dependency | `[W:TEST]` Test | `[W:IMPL-N]` Implementation workstream N

### Code Search Routing

| Need | Tool | Example |
|------|------|---------|
| Exact text/token | Grep | `function authenticate(` |
| File name/path | Glob | `**/*auth*.ts` |
| Concept/intent | CocoIndex (`mcp__cocoindex_code__search`) | "authentication middleware" |
| Prior decisions | memory_search | `{ query: "auth decisions" }` |

**Rule**: When exact function name or text is unknown, use CocoIndex FIRST (2-5 word natural language queries), then verify with Grep/Read. Do NOT Grep to guess at patterns when semantic search can find the concept directly.

---

## 11. QUALITY GATES

| Gate | Location | Purpose | Threshold | Blocking |
|------|----------|---------|-----------|----------|
| Pre-execution | Before Step 1 | Validate inputs/prerequisites | >= 70 | **HARD** |
| Planning Gate | Between Step 7-8 | Verify planning artifacts | >= 70 | **HARD** |
| Post-execution | After Step 12 | Verify all deliverables | >= 70 | Hard |

### Five Checks Framework (Level 3+ specs)

Required at Planning Gate for Level 3/3+ (optional Level 2). Record in decision-record.md.

| # | Check | Question | Pass Criteria |
|---|-------|----------|---------------|
| 1 | Necessary? | Solving ACTUAL need NOW? | Clear requirement, not speculative |
| 2 | Beyond Local Max? | Explored alternatives? | >=2 alternatives with trade-offs |
| 3 | Sufficient? | Simplest approach? | No simpler solution achieves goal |
| 4 | Fits Goal? | On critical path? | Directly advances stated objective |
| 5 | Open Horizons? | Long-term aligned? | No tech debt or lock-in |

### Gate Scoring

**Pre-execution (>= 70):** feature_description not empty (30), spec_path valid (30), execution_mode set (20), memory context loaded (20)

**Planning Gate (>= 70):** spec.md no [NEEDS CLARIFICATION] (25), plan.md with approach (25), tasks.md with T### IDs (25), checklist.md verified L2+ (15), the review agent's approval (10)

**Post-execution (>= 70):** All tasks marked [x] (30), implementation-summary.md exists (40), continuity update in canonical spec docs refreshed (20), validation passed (10)

---

## 12. ERROR HANDLING

| Error | Action |
|-------|--------|
| Missing feature description | Re-prompt user |
| Planning gate fails (<70) | Return to incomplete step, complete it |
| 3+ implementation failures | Escalate to the user with diagnostics; user may manually dispatch `@debug` via Task tool |
| Review agent P0 FAIL | BLOCK completion; user must fix |
| Agent unavailable | Fall back to `general` with warning |
| Validation errors (exit 2) | Fix before proceeding |
| Incomplete session detected | Offer: Resume / Restart / Cancel |

---

## 13. COMMAND CHAIN

- **Standard**: `/spec_kit:complete "feature"` -- 14 steps
- **With Research**: `/spec_kit:complete "feature" :with-research` -- Research + 14 steps
- **With Phases**: `/spec_kit:complete "feature" :with-phases --phases 3` -- Phase decomposition + 14 steps on first child
- **Full Options**: `/spec_kit:complete "feature" :auto :with-research :with-phases`
- **Split workflows**: `/spec_kit:deep-research` -> `/spec_kit:plan [:with-phases]` -> `/spec_kit:implement`

---

## 14. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Implementation complete | Verify in browser | Test functionality |
| Need to refresh search support | `/memory:save [spec-folder-path]` | Refresh the indexed canonical spec document while canonical continuity stays in spec docs |
| Ending session | `/memory:save [spec-folder-path]` | Refresh canonical continuity before pausing |
| Found bugs | `Task tool → @debug` | Dispatch a focused debugging pass after user escalation |
| Ready for next feature | `/spec_kit:complete [feature-description]` | Start new workflow |
| Need crash recovery | `/spec_kit:resume` | Session recovery and continuation |
| Record constitutional rule | `/memory:learn [rule]` | Save a durable repo-wide rule |

---

## 15. REFERENCE

**Full details in YAML prompts:** Workflow steps, field extraction, documentation levels (1/2/3), templates, completion report format, mode behaviors (auto/confirm), parallel dispatch, checklist verification, failure recovery.

**See also:** AGENTS.md Sections 2-6 for setup phase, memory loading, confidence framework, and request analysis.
