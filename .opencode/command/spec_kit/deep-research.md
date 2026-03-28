---
description: Autonomous deep research/review loop - iterative investigation or code audit with convergence detection. Supports :auto, :confirm, :review, :review:auto, :review:confirm modes
argument-hint: "<topic-or-target> [:auto|:confirm|:review|:review:auto|:review:confirm] [--max-iterations=N] [--convergence=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search, mcp__cocoindex_code__search
---

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve:
>    - `functional_mode` (RESEARCH or REVIEW)
>    - `research_topic` (for RESEARCH) or `review_target` + `review_target_type` + `review_dimensions` (for REVIEW)
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - RESEARCH + Auto: `spec_kit_deep-research_auto.yaml`
>    - RESEARCH + Confirm: `spec_kit_deep-research_confirm.yaml`
>    - REVIEW + Auto: `spec_kit_deep-research_review_auto.yaml`
>    - REVIEW + Confirm: `spec_kit_deep-research_review_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - RESEARCH mode: `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`
  - REVIEW mode: `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix (ORDER MATTERS — check :review variants FIRST):
   |-- ":review:auto"  -> functional_mode = "REVIEW",    execution_mode = "AUTONOMOUS"
   |-- ":review:confirm"-> functional_mode = "REVIEW",   execution_mode = "INTERACTIVE"
   |-- ":review"       -> functional_mode = "REVIEW",    execution_mode = "AUTONOMOUS"
   |-- ":auto"         -> functional_mode = "RESEARCH",  execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> functional_mode = "RESEARCH",  execution_mode = "INTERACTIVE"
   +-- No suffix       -> functional_mode = "ASK",       execution_mode = "ASK"

2. CHECK $ARGUMENTS for topic/target:
   |-- Has content (ignoring suffixes and flags):
   |     |-- functional_mode == "REVIEW"   -> review_target = $ARGUMENTS, omit Q0
   |     +-- functional_mode == "RESEARCH" -> research_topic = $ARGUMENTS, omit Q0
   |     +-- functional_mode == "ASK"      -> store as pending_topic (assigned after Q_mode)
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   +-- Defaults depend on functional_mode:
       RESEARCH: maxIterations=10, convergenceThreshold=0.05
       REVIEW:   maxIterations=7,  convergenceThreshold=0.10

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: research_topic OR review_target OR "deep-research", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):

   --- WHEN functional_mode == "ASK" ---

   Q_mode. What kind of deep analysis?
     A) Research — investigate an external topic iteratively
     B) Review — audit code/specs for quality and release readiness

   Q0. Topic/Target (if not in command):
     - If Research: What topic to research deeply?
     - If Review: What to review? (spec folder path, skill name, agent name, or file list)

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 10 (research) or 7 (review). Change? [Enter number or press enter for default]

   --- WHEN functional_mode == "REVIEW" ---

   Q0. Review Target (if not in command): What to review?
     Examples: spec folder path, `skill:sk-name`, `agent:name`, `track:NN--name`, or file paths/globs

   Q1_type. Review Target Type (auto-detect from Q0, confirm):
     A) spec-folder — Review spec artifacts + implementation files
     B) skill — SKILL.md + references/ + assets/ + agents + commands
     C) agent — Agent family across all runtimes
     D) track — All child spec folders in a feature track
     E) files — Arbitrary file paths or globs

   Q_dims. Which review dimensions? (default: all 4)
     All: correctness, security, traceability, maintainability
     Or specify a subset (e.g., "correctness, security, traceability")

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if not set via suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 7 for review. Change? [Enter number or press enter for default]

   --- WHEN functional_mode == "RESEARCH" ---

   Q0. Research Topic (if not in command): What topic to research deeply?

   Q1. Spec Folder (required):
     A) Use existing [suggest if found]
     B) Create new under `specs/[track]/[###]-[slug]/` (accept `.opencode/specs/` alias roots when already in use)
     C) Update related [if match found]
     D) Phase folder (e.g., `specs/NN-track/NNN-name/001-phase/` or matching `.opencode/specs/` alias)

   Q2. Execution Mode (if no suffix):
     A) Autonomous -- all iterations without approval
     B) Interactive -- pause at each iteration for review

   Q3. Max Iterations (if not set via flag):
     Default is 10. Change? [Enter number or press enter for default]

   Reply format: "A, A" or "WebSocket research, A, B, 15" or "B, skill:sk-deep-research, B, all, A, A"

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - functional_mode = [RESEARCH/REVIEW — from suffix, Q_mode, or default]
   - research_topic = [from Q0 or $ARGUMENTS — RESEARCH mode only]
   - review_target = [from Q0 or $ARGUMENTS — REVIEW mode only]
   - review_target_type = [from Q1_type — REVIEW mode only, auto-detected]
   - review_dimensions = [from Q_dims or default "all" — REVIEW mode only]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default (10 research / 7 review)]
   - convergenceThreshold = [from flag or default (0.05 research / 0.10 review)]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**

For RESEARCH mode:
- `functional_mode` = RESEARCH | `research_topic` | `spec_choice` | `spec_path`
- `execution_mode` | `maxIterations` | `convergenceThreshold`

For REVIEW mode:
- `functional_mode` = REVIEW | `review_target` | `review_target_type` | `review_dimensions`
- `spec_choice` | `spec_path` | `execution_mode` | `maxIterations` | `convergenceThreshold`

---

# Deep Research / Review

Conduct autonomous iterative deep research or code review with convergence detection. Each iteration dispatches a fresh LEAF agent (`@deep-research` for research, `@deep-review` for review) that reads externalized state, performs focused work, and writes findings to files.

```yaml
role: Deep Research/Review Loop Manager
purpose: Run iterative research or review cycles until convergence or max iterations
action: Execute YAML workflow managing init, loop, synthesis, and save phases
operating_mode:
  workflow: iterative_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: convergence_detection
  functional_modes: [RESEARCH, REVIEW]
```

---

## 1. PURPOSE

Run an iterative loop for deep research or code review:
- **Research mode:** Initialize state, dispatch `@deep-research` agent per iteration, evaluate convergence, and synthesize findings into research/research.md. Use when deep investigation requiring multiple rounds of discovery.
- **Review mode:** Initialize the review packet under `{spec_folder}/review/`, dispatch `@deep-review` agent per iteration, evaluate convergence across review dimensions, and synthesize findings into `{spec_folder}/review/review-report.md`. Use when auditing code/specs for quality and release readiness.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Research topic or review target with optional flags and mode suffix
**Outputs:**
- RESEARCH mode: Spec folder with research/research.md + state files + `STATUS=<OK|FAIL|CANCELLED>`
- REVIEW mode: Spec folder with `{spec_folder}/review/` packet + state files + `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

### Research Mode

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Create config, strategy (with research charter), state files | State files in `research/` |
| Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, dashboard.md |
| Synth | Synthesize | Compile final research/research.md | research/research.md (17 sections) |
| Save | Preserve | Save memory context | memory/*.md |

### Review Mode

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Scope discovery, resolve files, create config + strategy with review dimensions | Review packet in `{spec_folder}/review/` |
| Loop | Iterate | Dispatch @deep-review agent per dimension, evaluate review convergence + quality guards | `review/iterations/iteration-NNN.md` files, `review/deep-review-dashboard.md` |
| Synth | Synthesize | Build finding registry, deduplicate, compile `review/review-report.md` | `review/review-report.md` (9 sections) |
| Save | Preserve | Save memory context | memory/*.md |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/spec_kit:deep-research:auto "topic"` | All iterations without approval |
| `:confirm` | `/spec_kit:deep-research:confirm "topic"` | Multi-gate review at setup, iteration, and synthesis |
| `:review` | `/spec_kit:deep-research:review "target"` | Review mode, autonomous (default) |
| `:review:auto` | `/spec_kit:deep-research:review:auto "target"` | Review mode, autonomous |
| `:review:confirm` | `/spec_kit:deep-research:review:confirm "target"` | Review mode, interactive with approval gates |
| (default) | `/spec_kit:deep-research "topic"` | Ask user to choose mode during setup |

---

## 4. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on functional_mode and execution_mode:

**REVIEW mode (functional_mode == "REVIEW"):**
- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`

**RESEARCH mode (functional_mode == "RESEARCH"):**
- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

The YAML contains the full loop workflow: initialization, iteration dispatch, convergence detection, synthesis, and memory save.

---

## 5. OUTPUT FORMATS

**Research Success:**
```
Deep research complete.
Iterations: [N] | Stop reason: [converged|max_iterations|all_answered]
Artifacts: research/research.md, [N] iteration files, memory/*.md
Ready for: /spec_kit:plan [feature-description]
STATUS=OK PATH=[spec-folder-path]
```

**Review Success:**
```
Deep review complete.
Iterations: [N] | Stop reason: [converged|max_iterations|all_dimensions_clean]
Findings: P0=[N] P1=[N] P2=[N] | Verdict: [PASS|CONDITIONAL|FAIL] [PASS may include hasAdvisories=true]
Artifacts: `review/review-report.md`, `[N]` iteration files in `review/`, memory/*.md
Ready for: /spec_kit:plan [remediation] (if FAIL/CONDITIONAL)
STATUS=OK PATH=[spec-folder-path]
```

**Failure:**
```
Error: [error description]  Phase: [phase name]
STATUS=FAIL ERROR="[message]"
```

---

## 6. MEMORY INTEGRATION

### Before Starting
- `memory_context({ input: topic, intent: "understand" })` -- Load prior research
- Inject results into strategy.md "Known Context" section

### Code Context Bootstrap
- Use CocoIndex (`mcp__cocoindex_code__search`) to find relevant code examples before starting research
- Query: 2-5 word concept descriptions related to the research topic
- Inject discovered code patterns into strategy.md "Known Context" section alongside memory findings

### After Completing
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]`
- Verify that `{spec_folder}/memory/` contains the generated memory artifact

### Anchor Tags (Automatic)
`ANCHOR:deep-research-[topic]`, `ANCHOR:findings`, `ANCHOR:convergence-report`

---

## 7. SKILL REFERENCE

Full protocol documentation: `.opencode/skill/sk-deep-research/SKILL.md`

Key references:
- Loop protocol: `sk-deep-research/references/loop_protocol.md`
- State formats: `sk-deep-research/references/state_format.md`
- Convergence: `sk-deep-research/references/convergence.md`
- Quick reference: `sk-deep-research/references/quick_reference.md`

---

## 8. EXAMPLES

### Research Mode
```
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"
/spec_kit:deep-research:confirm "distributed caching patterns for microservices"
/spec_kit:deep-research:auto "API rate limiting approaches" --max-iterations 5 --convergence 0.10
```

### Review Mode
```
/spec_kit:deep-research:review "skill:sk-deep-research"
/spec_kit:deep-research:review:auto "specs/03--commands-and-skills/030-sk-deep-research-review-mode/"
/spec_kit:deep-research:review:confirm "agent:deep-research" --max-iterations 5
/spec_kit:deep-research:review "track:03--commands-and-skills"
/spec_kit:deep-research:review ".opencode/skill/sk-git/**/*.md" --convergence 0.15
```

---

## 9. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Research complete, ready to plan | `/spec_kit:plan [feature]` | Use findings for spec/plan |
| Review FAIL/CONDITIONAL, need fixes | `/spec_kit:plan [remediation]` | Plan remediation from review findings |
| Review PASS, ready for release | `/create:changelog` | Generate changelog entry |
| Need more investigation | `/spec_kit:deep-research [new-topic]` | Another deep research session |
| Need code/spec audit | `/spec_kit:deep-research:review [target]` | Deep review session |
| Want to save context | `/memory:save [spec-folder]` | Manual memory save |
| Need to pause | `/spec_kit:handover [spec-folder]` | Save context for later |

---

## 10. ERROR HANDLING

| Error | Action |
|-------|--------|
| Agent dispatch timeout | Retry once with reduced scope, then mark timeout |
| State file missing | Reconstruct from iteration files |
| 3+ consecutive failures | Halt loop, enter synthesis with partial findings |
| Memory save failure | Research mode saves to `scratch/` as backup; review mode preserves the `review/` packet as backup |

---

## 11. KEY DIFFERENCES

### Research Mode
- Iterative (multi-pass) vs. single-pass research
- Dispatches `@deep-research` LEAF agent per iteration (fresh context each time)
- Externalized state via JSONL + strategy files
- Automatic convergence detection with quality guards (3 binary checks before STOP)
- Persistent dashboard auto-generated each iteration for progress tracking
- Negative knowledge (ruled-out directions) as first-class research output
- Research charter (non-goals, stop conditions) validated at init
- Does NOT proceed to implementation

### Review Mode
- Iterative (multi-pass) code/spec audit across 4 dimensions
- Dispatches `@deep-review` LEAF agent per iteration (fresh context each time)
- Severity-weighted `newFindingsRatio` with P0 override (blocks convergence on new P0)
- Dimension coverage as convergence signal (all dimensions must be reviewed)
- Cross-reference verification across spec/code/test boundaries
- Finding deduplication and progressive synthesis
- 9-section `review/review-report.md` with 3-verdict release readiness assessment
- Does NOT proceed to implementation (outputs remediation plan for `/spec_kit:plan`)

---

## 12. COMMAND CHAIN

**Research path:** `/spec_kit:deep-research` → `/spec_kit:plan` → `/spec_kit:implement`
**Review path:** `/spec_kit:deep-research:review` → (if FAIL/CONDITIONAL) `/spec_kit:plan` → `/spec_kit:implement`
**Review path:** `/spec_kit:deep-research:review` → (if PASS) `/create:changelog`
