---
description: Implementation workflow (9 steps) - execute pre-planned work. Requires existing plan.md. Supports :auto and :confirm modes
argument-hint: "<spec-folder> [:auto|:confirm] [--phase-folder=<path>]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `spec_kit_implement_auto.yaml`
>    - Confirm mode → `spec_kit_implement_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow. Do not treat reference sections, routing tables, or dispatch templates as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent (`@review`, `@debug`, `@handover`, `@speckit`) from this document
- **DO NOT** dispatch `@review` to review this workflow or command prompt
- **DO NOT** dispatch `@handover` unless the user explicitly requests it at the final step (Step 9)
- **DO NOT** dispatch `@debug` unless `failure_count >= 3` during the Development step (Step 6)
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file, then execute it step by step

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   - ":auto" -> execution_mode = "AUTONOMOUS" (omit Q2)
   - ":confirm" -> execution_mode = "INTERACTIVE" (omit Q2)
   - No suffix -> execution_mode = "ASK" (include Q2)

2. CHECK $ARGUMENTS for spec folder path:
   - IF has path -> spec_folder_input = $ARGUMENTS
   - IF empty -> include Q0 with available folders

2b. CHECK --phase-folder flag OR auto-detect phase child:
   - IF --phase-folder=<path> provided → auto-resolve spec_path to that child folder
     Set spec_path = <path>, omit Q0/Q1
     Validate path matches pattern: specs/[###]-*/[0-9][0-9][0-9]-*/
   - IF spec_folder_input path contains /[0-9][0-9][0-9]-*/ → auto-detect as phase child
     Show parent context: "Phase child detected: <path> (parent: <parent-folder>)"
     Load parent spec.md for cross-reference context
   - ELSE → continue normally

3. Search for available spec folders with plan.md:
   $ ls -d specs/*/ 2>/dev/null | tail -10
   Check each for: spec.md, plan.md (required), checklist.md (optional)

4. IF spec_folder_input provided, validate prerequisites:
   - spec.md (REQUIRED), plan.md (REQUIRED)
   - tasks.md (create if missing), checklist.md (REQUIRED Level 2+)

5. CHECK for prior incomplete sessions:
   - Search memory/ for incomplete markers, unchecked tasks in tasks.md
   - IF found -> Show warning with options:
     A) Resume from where left off  B) Restart (archives prior)  C) Cancel

6. Check if memory/ exists with files for spec folder

7. ASK user (include only applicable questions):

   Q0. Spec Folder (if not provided):
      Available folders with plan.md: [list with status]
      Enter folder path or number
      E) Phase folder — target a specific phase child (e.g., specs/NNN-name/001-phase/)

   Q1. Confirm Spec Folder (if path provided):
      Folder: [path] | spec.md [Y/N] | plan.md [Y/N] | checklist.md [Y/N/optional]
      A) Yes, implement  B) Different folder  C) Cancel (plan first)

   Q2. Execution Mode (if no suffix):
      A) Autonomous - all 9 steps without approval
      B) Interactive - pause at each step

   Q3. Dispatch Mode (required):
      A) Single Agent (Recommended)
      B) Multi-Agent (1+2)
      C) Multi-Agent (1+3)

   Q4. Memory Context (if memory/ has files):
      A) Load most recent  B) Load up to 3 recent  C) Skip (fresh start)

   Reply with answers, e.g.: "A, A, A, B" or "specs/007-auth/, A, A, B"

8. WAIT for user response (DO NOT PROCEED)

9. Parse and store:
   - spec_path, confirm_choice, execution_mode, dispatch_mode, memory_choice

10. Handle redirects:
    - confirm_choice == B -> Re-prompt folder selection
    - confirm_choice == C -> Redirect to /spec_kit:plan

11. Execute background operations:
    - memory_choice A: load most recent | B: load up to 3 | multi_*: note parallel dispatch

12. SET STATUS: PASSED

HARD STOP: DO NOT proceed until user answers
NEVER assume spec folder without confirmation
NEVER auto-select execution mode without suffix or explicit choice
NEVER split into multiple prompts
```

**Phase Output:**
- `spec_path` | `prerequisites_valid` | `execution_mode` | `dispatch_mode` | `memory_loaded`

> **Cross-reference**: Implements AGENTS.md Section 2 "Gate 3: Spec Folder Question" and "First Message Protocol".

---

# SpecKit Implement

Execute implementation of a pre-planned feature. Requires existing spec.md and plan.md from a prior `/spec_kit:plan` workflow.

> Standalone workflow (9 steps) that assumes spec.md and plan.md exist. Run `/spec_kit:plan` first if needed.

```yaml
role: Expert Developer using Smart SpecKit for Implementation Phase
purpose: Execute pre-planned feature implementation with mandatory checklist verification
action: Run 9-step implementation workflow from plan review through completion summary

operating_mode:
  workflow: sequential_9_step
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: progressive_task_completion
  validation: checklist_verification_with_evidence
```

---

## 1. PURPOSE

Run the 9-step implementation workflow: plan review, task breakdown, quality validation, development, completion summary, and handover check. Picks up where `/spec_kit:plan` left off.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Spec folder path (REQUIRED) with optional parameters
**Outputs:** Completed implementation + implementation-summary.md + nested changelog when applicable + optional handover.md + `STATUS=<OK|FAIL|CANCELLED>`

### Prerequisites

**REQUIRED (all levels):** spec.md, plan.md, tasks.md (created if missing)
**REQUIRED Level 2+:** checklist.md

Missing prerequisites -> guide user to `/spec_kit:plan` first.

---

## 3. WORKFLOW OVERVIEW

| Step | Name                   | Purpose                                       | Outputs                   |
| ---- | ---------------------- | --------------------------------------------- | ------------------------- |
| 1    | Review Plan & Spec     | Understand requirements                       | requirements_summary      |
| 2    | Task Breakdown         | Create/validate tasks.md (via @speckit)        | tasks.md                  |
| 3    | Analysis               | Verify consistency                            | consistency_report        |
| 4    | Quality Checklist      | Validate checklists (used at completion)      | checklist_status          |
| 5    | Implementation Check   | Verify prerequisites                          | greenlight                |
| 5.5  | PREFLIGHT Capture      | Epistemic baseline for learning measurement   | preflight_baseline        |
| 6    | Development            | Execute implementation                        | code changes              |
| 7    | Completion             | Generate summary (via @speckit)               | implementation-summary.md + nested changelog when applicable |
| 7.5  | POSTFLIGHT Capture     | Learning delta and improvement calculation    | postflight_delta          |
| 8    | Save Context           | Preserve conversation                         | memory/*.md               |
| 9    | Session Handover Check | Prompt for handover document                  | handover.md (optional)    |

> **Note:** This step validates checklist structure and item presence. Evidence verification occurs after implementation in the completion phase.

### Code Search During Plan Review (Step 1)

When reviewing plan.md references to codebase patterns, use CocoIndex semantic search (`mcp__cocoindex_code__search`) to verify that referenced code still exists and find related patterns. Use 2-5 word concept queries. Reserve Grep for exact token verification.

**Execute steps IN ORDER. Mark each ONLY after completing ALL activities. DO NOT SKIP.**

### Step 8: Save Context Protocol

**MANDATORY** via generate-context.js (per AGENTS.md Memory Save Rule):
```
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]
```
DO NOT use Write/Edit for memory files directly. After script, call `memory_save({ filePath })` for MCP availability.

### Memory Context Loading

Use `memory_context()` (L1 unified entry) as primary retrieval. Use `memory_search()` (L2) only as fallback for direct parameter control.

---

## 4. INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. OUTPUT FORMATS

### Success
```
SpecKit Implementation Complete - All 9 steps executed.
Artifacts: tasks.md, implementation-summary.md, nested changelog (when applicable), memory/*.md
STATUS=OK PATH=[spec-folder-path]
```

### Failure
```
SpecKit Implementation Failed
Error: [description] | Step: [number]
STATUS=FAIL ERROR="[message]"
```

---

## 6. REFERENCE

**Full details in YAML prompts:** Workflow steps, field extraction, doc levels (1/2/3), templates, completion report, mode behaviors, parallel dispatch, checklist verification, failure recovery.

**See also:** AGENTS.md Sections 2-6 for memory loading, confidence framework, request analysis.

---

## 7. PARALLEL DISPATCH

Supports parallel agent dispatch for complex phases (configured in YAML prompts).

### Complexity Scoring (5 dimensions)

| Dimension            | Weight | Scoring                              |
| -------------------- | ------ | ------------------------------------ |
| Domain Count         | 35%    | 1=0.0, 2=0.5, 3+=1.0                |
| File Count           | 25%    | 1-2=0.0, 3-5=0.5, 6+=1.0           |
| LOC Estimate         | 15%    | <50=0.0, 50-200=0.5, >200=1.0       |
| Parallel Opportunity | 20%    | sequential=0.0, some=0.5, high=1.0  |
| Task Type            | 5%     | trivial=0.0, moderate=0.5, complex=1.0|

### Thresholds

- **<20%**: Proceed directly | **>=20% + 2 domains**: ALWAYS ask user
- Eligible phase: `step_6_development`
- Override: `"proceed directly"` / `"use parallel"` / `"auto-decide"` (1hr session mode)

### Workstream Prefixes

`[W:IMPL-N]` implementation | `[W:TEST]` tests | `[W:DOCS]` documentation

---

## 8. QUALITY GATES

| Gate                | Location        | Threshold | Blocking          |
| ------------------- | --------------- | --------- | ----------------- |
| Pre-Implementation  | Before Step 6   | 70        | Yes               |
| Mid-Implementation  | After Step 6.5  | 70        | No (warning only) |
| Post-Implementation | Before Step 7   | 70        | Yes               |

**Pre-Implementation:** spec.md complete, plan.md clear, tasks.md actionable, checklist.md exists (L2+), no P0 blockers.
**Post-Implementation:** All tasks [x], all P0 verified with evidence, P1 complete/deferred, tests pass, summary created.

### Evidence Log Pattern

`[E:filename]` for artifacts in `evidence/` (permanent) or `scratch/` (temporary).
Example: `[E:evidence/test-output.log]` or `[EVIDENCE: hero.js:45-67 verified]`

---

## 9. PREFLIGHT BASELINE (Step 5.5)

Capture epistemic baseline before implementation. Execute after Step 5, before Step 6. Skip for quick fixes (<10 LOC) or continuation with existing PREFLIGHT.

```
task_preflight(): specFolder, taskId, knowledgeScore[0-10], uncertaintyScore[0-10],
                  contextScore[0-10], knowledgeGaps[optional]
```

Skip: `"skip preflight"`, `"quick fix"` (auto if LOC<10), `"continuation"` (auto if prior exists)

---

## 10. POSTFLIGHT LEARNING (Step 7.5)

Capture learning delta after implementation. Execute after Step 7, before Step 8. Skip if no PREFLIGHT captured.

```
task_postflight(): specFolder, taskId (must match), knowledgeScore[0-10],
                   uncertaintyScore[0-10], contextScore[0-10],
                   gapsClosed[list], newGapsDiscovered[list]
```

**Learning Index** = (Knowledge Delta + Uncertainty Reduction + Context Improvement) / 3
Interpretation: 4+ significant, 1.5-4 moderate, 0.5-1.5 incremental, <0.5 execution-focused, negative = regression.

Reference: `.opencode/skill/system-spec-kit/references/memory/epistemic_vectors.md`

---

## 11. KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- Requires existing plan (won't create spec.md/plan.md)
- Starts at implementation (skips specification/planning)
- Use case: separated planning/implementation, team handoffs, phased delivery

---

## 12. VALIDATION DURING IMPLEMENTATION

Runs automatically: **PLACEHOLDER_FILLED** (replace `[PLACEHOLDER]`), **PRIORITY_TAGS** (P0/P1/P2), **EVIDENCE_CITED** (`[SOURCE:]` citations).

---

## 13. EXAMPLES

```
/spec_kit:implement:auto specs/042-user-auth/       # Autonomous mode
/spec_kit:implement:confirm specs/042-user-auth/    # Interactive mode
```

---

## 14. COMMAND CHAIN

```
[/spec_kit:plan] -> /spec_kit:implement -> [/spec_kit:handover]
```

Prerequisite: `/spec_kit:plan [feature-description]` (creates spec.md, plan.md)

---

## 15. NEXT STEPS

| Condition                 | Suggested Command                          | Reason                          |
| ------------------------- | ------------------------------------------ | ------------------------------- |
| Implementation complete   | Verify in browser                          | Test functionality              |
| Need to save progress     | `/memory:save [spec-folder-path]`          | Preserve context                |
| Ending session            | `/spec_kit:handover [spec-folder-path]`    | Create continuation document    |
| Found bugs during testing | `/spec_kit:debug [spec-folder-path]`       | Delegate to fresh agent         |
| Ready for next feature    | `/spec_kit:complete [feature-description]` | Start new workflow              |
| Need crash recovery       | `/spec_kit:resume`                         | Session recovery and continuation |

**ALWAYS** end with: "What would you like to do next?"
