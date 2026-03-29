---
description: Autonomous deep review loop - iterative code audit with convergence detection. Supports :auto and :confirm modes
argument-hint: "<target> [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search
---

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve:
>    - `review_target`
>    - `review_target_type`
>    - `review_dimensions`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `spec_kit_deep-review_auto.yaml`
>    - Confirm: `spec_kit_deep-review_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"    -> execution_mode = "AUTONOMOUS"
   |-- ":confirm" -> execution_mode = "INTERACTIVE"
   +-- No suffix  -> execution_mode = "ASK" (include Q2)

2. CHECK $ARGUMENTS for target (review_target):
   |-- Has content (ignoring suffixes and flags):
   |     -> review_target = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   +-- Defaults: maxIterations=7, convergenceThreshold=0.10

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: review_target OR "deep-review", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):

   Q0. Review Target (if not in command): What to review?
     Examples: spec folder path, `skill:sk-name`, `agent:name`, `track:NN--name`, or file paths/globs

   Q1_type. Review Target Type (auto-detect from Q0, confirm):
     A) spec-folder -- Review spec artifacts + implementation files
     B) skill -- SKILL.md + references/ + assets/ + agents + commands
     C) agent -- Agent family across all runtimes
     D) track -- All child spec folders in a feature track
     E) files -- Arbitrary file paths or globs

   Q_dims. Which review dimensions? (default: all 7)
     All: correctness, security, traceability, maintainability, performance, reliability, completeness
     Or specify a subset (e.g., "correctness, security")

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 7 for review. Change? [Enter number or press enter for default]

   Reply format: "skill:sk-deep-research, B, all, A, A" or "A, correctness security, B, B, 5"

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - review_target = [from Q0 or $ARGUMENTS]
   - review_target_type = [from Q1_type, auto-detected]
   - review_dimensions = [from Q_dims or default "all"]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 7]
   - convergenceThreshold = [from flag or default 0.10]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**

- `review_target` | `review_target_type` | `review_dimensions`
- `spec_choice` | `spec_path` | `execution_mode` | `maxIterations` | `convergenceThreshold`

---

# Deep Review

Conduct autonomous iterative code review with convergence detection. Each iteration dispatches a fresh LEAF agent (`@deep-review`) that reads externalized state, performs focused review work across configured dimensions, and writes findings to files.

```yaml
role: Deep Review Loop Manager
purpose: Run iterative review cycles until convergence or max iterations
action: Execute YAML workflow managing init, loop, synthesis, and save phases
operating_mode:
  workflow: iterative_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: convergence_detection
```

---

## 1. PURPOSE

Run an iterative loop for code review: Initialize the review packet under `{spec_folder}/review/`, dispatch `@deep-review` agent per iteration, evaluate convergence across review dimensions, and synthesize findings into `{spec_folder}/review/review-report.md`. Use when auditing code, specs, skills, agents, or tracks for quality and release readiness.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Review target with optional flags and mode suffix
**Outputs:** Spec folder with `{spec_folder}/review/` packet + state files + `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Scope discovery, resolve files, create config + strategy with review dimensions | Review packet in `{spec_folder}/review/` |
| Loop | Iterate | Dispatch @deep-review agent per dimension, evaluate review convergence + quality guards | `review/iterations/iteration-NNN.md` files, `review/deep-review-dashboard.md` |
| Synth | Synthesize | Build finding registry, deduplicate, compile `review/review-report.md` | `review/review-report.md` (9 sections) |
| Save | Preserve | Save memory context | memory/*.md |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/spec_kit:deep-review:auto "target"` | All iterations without approval |
| `:confirm` | `/spec_kit:deep-review:confirm "target"` | Multi-gate review at setup, iteration, and synthesis |
| (default) | `/spec_kit:deep-review "target"` | Ask user to choose mode during setup |

---

## 4. KEY BEHAVIORS

### Autonomous Mode (`:auto`)

- Executes all iterations without user approval gates
- Self-validates at each convergence checkpoint
- Makes informed decisions on dimension ordering and iteration focus
- Documents all significant decisions in `review/deep-review-dashboard.md`
- Stops when convergence threshold is met or max iterations reached

### Interactive Mode (`:confirm`)

- Pauses after each iteration for user approval
- Presents iteration findings summary with dimension coverage
- Options at each gate: Approve, Review Details, Modify Scope, Skip Dimension, Abort
- Documents user decisions at each checkpoint
- Allows course correction of dimensions, depth, or scope throughout

---

## 5. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on execution_mode:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`

The YAML contains the full loop workflow: initialization, iteration dispatch, convergence detection, synthesis, and memory save.

---

## 6. OUTPUT FORMATS

**Review Success:**
```
Deep review complete.
Iterations: [N] | Stop reason: [converged|max_iterations|all_dimensions_clean]
Findings: P0=[N] P1=[N] P2=[N] | Verdict: [PASS|CONDITIONAL|FAIL] [PASS may include hasAdvisories=true]
Artifacts: review/review-report.md, [N] iteration files in review/, memory/*.md
Ready for: /spec_kit:plan [remediation] (if FAIL/CONDITIONAL)
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**
```
Error: [error description]  Phase: [phase name]
STATUS=FAIL ERROR="[message]"
```

---

## 7. MEMORY INTEGRATION

### Before Starting
- `memory_context({ input: review_target, intent: "understand" })` -- Load prior review context
- Inject results into strategy.md "Known Context" section

### Code Context Bootstrap
- Use CocoIndex (`mcp__cocoindex_code__search`) to find relevant code examples before starting review
- Query: 2-5 word concept descriptions related to the review target
- Inject discovered code patterns into strategy.md "Known Context" section alongside memory findings

### After Completing
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]`
- Verify that `{spec_folder}/memory/` contains the generated memory artifact

### Anchor Tags (Automatic)
`ANCHOR:deep-review-[target]`, `ANCHOR:findings`, `ANCHOR:convergence-report`

---

## 8. SKILL REFERENCE

Full protocol documentation: `.opencode/skill/sk-deep-review/SKILL.md`

Key references:
- Review contract: `sk-deep-review/assets/review_mode_contract.yaml`
- Review strategy template: `sk-deep-review/assets/deep_review_strategy.md`
- Review dashboard template: `sk-deep-review/assets/deep_review_dashboard.md`
- Review config template: `sk-deep-review/assets/deep_review_config.json`

---

## 9. EXAMPLES

```
/spec_kit:deep-review "skill:sk-deep-research"
/spec_kit:deep-review:auto "specs/03--commands-and-skills/030-sk-deep-research-review-mode/"
/spec_kit:deep-review:confirm "agent:deep-research" --max-iterations=5
/spec_kit:deep-review "track:03--commands-and-skills"
/spec_kit:deep-review:auto ".opencode/skill/sk-git/**/*.md" --convergence=0.15
/spec_kit:deep-review:confirm "skill:sk-code--opencode" --spec-folder=specs/04--quality/041-review-opencode/
```

---

## 10. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Review FAIL/CONDITIONAL, need fixes | `/spec_kit:plan [remediation]` | Plan remediation from review findings |
| Review PASS, ready for release | `/create:changelog` | Generate changelog entry |
| Need to fix specific findings | `/spec_kit:implement [spec-folder]` | Implement fixes from existing plan |
| Need more investigation | `/spec_kit:deep-research [topic]` | Deep research session for unclear areas |
| Want to save context | `/memory:save [spec-folder]` | Manual memory save |
| Need to pause | `/spec_kit:handover [spec-folder]` | Save context for later |

---

## 11. ERROR HANDLING

| Error | Action |
|-------|--------|
| Agent dispatch timeout | Retry once with reduced scope, then mark timeout |
| State file missing | Reconstruct from iteration files |
| 3+ consecutive failures | Halt loop, enter synthesis with partial findings |
| Memory save failure | Preserve the `review/` packet as backup |

---

## 12. KEY FEATURES

### Review Dimensions
- Iterative (multi-pass) code/spec audit across configurable dimensions
- Dimension ordering follows risk priority (correctness and security first)
- Each dimension can be individually included or excluded

### Severity and Verdicts
- Three severity levels: P0 (Blocker), P1 (Required), P2 (Suggestion)
- Three verdicts: PASS, CONDITIONAL, FAIL
- PASS may include `hasAdvisories=true` when P2 findings exist
- P0 override: new P0 findings block convergence regardless of threshold

### Convergence Detection
- Severity-weighted `newFindingsRatio` with rolling average
- MAD noise-floor test for robust churn detection
- Dimension coverage as convergence signal (all required dimensions must be reviewed)
- Three binary quality gates (evidence, scope, coverage) must pass before STOP

### Adversarial Self-Check
- Runs on all P0 findings to validate evidence quality
- Cross-reference verification across spec/code/test boundaries
- Finding deduplication and progressive synthesis

### Agent Model
- Dispatches `@deep-review` LEAF agent per iteration (fresh context each time)
- Externalized state via JSONL + strategy files (no context degradation)
- Review target is READ-ONLY (agent never modifies reviewed code)
- Does NOT proceed to implementation (outputs remediation plan for `/spec_kit:plan`)

---

## 13. COMMAND CHAIN

**Review path (findings):** `/spec_kit:deep-review` -> (if FAIL/CONDITIONAL) `/spec_kit:plan` -> `/spec_kit:implement`
**Review path (clean):** `/spec_kit:deep-review` -> (if PASS) `/create:changelog`
