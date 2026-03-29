---
description: Autonomous deep research loop - iterative investigation with convergence detection. Supports :auto and :confirm modes
argument-hint: "<topic> [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search, mcp__cocoindex_code__search
---

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve:
>    - `research_topic`
>    - `spec_folder`
>    - `execution_mode`
>    - `maxIterations`
>    - `convergenceThreshold`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `spec_kit_deep-research_auto.yaml`
>    - Confirm: `spec_kit_deep-research_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `research_topic`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all setup inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery to suggest a spec folder or load prior context is allowed, then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"         -> execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> execution_mode = "INTERACTIVE"
   +-- No suffix       -> execution_mode = "ASK"

2. CHECK $ARGUMENTS for topic:
   |-- Has content (ignoring suffixes and flags):
   |     -> research_topic = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --max-iterations=N -> maxIterations = N
   |-- --convergence=N -> convergenceThreshold = N
   |-- --spec-folder=PATH -> spec_path = PATH, omit Q1
   +-- Defaults: maxIterations=10, convergenceThreshold=0.05

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: research_topic OR "deep-research", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):

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

   Reply format: "A, A" or "WebSocket research, A, B, 15"

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - research_topic = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 10]
   - convergenceThreshold = [from flag or default 0.05]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

**Phase Output:**
- `research_topic` | `spec_choice` | `spec_path`
- `execution_mode` | `maxIterations` | `convergenceThreshold`

---

# Deep Research

Conduct autonomous iterative deep research with convergence detection. Each iteration dispatches a fresh LEAF agent (`@deep-research`) that reads externalized state, performs focused investigation, and writes findings to files.

For code review and quality auditing, see `/spec_kit:deep-review`.

```yaml
role: Deep Research Loop Manager
purpose: Run iterative research cycles until convergence or max iterations
action: Execute YAML workflow managing init, loop, synthesis, and save phases
operating_mode:
  workflow: iterative_loop
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: convergence_detection
```

---

## 1. PURPOSE

Run an iterative loop for deep research: Initialize state, dispatch `@deep-research` agent per iteration, evaluate convergence, and synthesize findings into research/research.md. Use when deep investigation requiring multiple rounds of discovery.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Research topic with optional flags and mode suffix
**Outputs:** Spec folder with research/research.md + state files + `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Init | Initialize | Create config, strategy (with research charter), state files | State files in `research/` |
| Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, dashboard.md |
| Synth | Synthesize | Compile final research/research.md | research/research.md (17 sections) |
| Save | Preserve | Save memory context | memory/*.md |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/spec_kit:deep-research:auto "topic"` | All iterations without approval |
| `:confirm` | `/spec_kit:deep-research:confirm "topic"` | Multi-gate review at setup, iteration, and synthesis |
| (default) | `/spec_kit:deep-research "topic"` | Ask user to choose mode during setup |

---

## 4. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on execution_mode:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

The YAML contains the full loop workflow: initialization, iteration dispatch, convergence detection, synthesis, and memory save.

---

## 5. OUTPUT FORMATS

**Success:**
```
Deep research complete.
Iterations: [N] | Stop reason: [converged|max_iterations|all_answered]
Artifacts: research/research.md, [N] iteration files, memory/*.md
Ready for: /spec_kit:plan [feature-description]
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

For code review, see `sk-deep-review` skill (`.opencode/skill/sk-deep-review/SKILL.md`).

---

## 8. EXAMPLES

```
/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"
/spec_kit:deep-research:confirm "distributed caching patterns for microservices"
/spec_kit:deep-research:auto "API rate limiting approaches" --max-iterations 5 --convergence 0.10
```

---

## 9. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Research complete, ready to plan | `/spec_kit:plan [feature]` | Use findings for spec/plan |
| Need more investigation | `/spec_kit:deep-research [new-topic]` | Another deep research session |
| Need code/spec audit | `/spec_kit:deep-review [target]` | Iterative code review |
| Want to save context | `/memory:save [spec-folder]` | Manual memory save |
| Need to pause | `/spec_kit:handover [spec-folder]` | Save context for later |

---

## 10. ERROR HANDLING

| Error | Action |
|-------|--------|
| Agent dispatch timeout | Retry once with reduced scope, then mark timeout |
| State file missing | Reconstruct from iteration files |
| 3+ consecutive failures | Halt loop, enter synthesis with partial findings |
| Memory save failure | Save to `scratch/` as backup |

---

## 11. KEY DIFFERENCES (vs. single-pass research)

- Iterative (multi-pass) vs. single-pass research
- Dispatches `@deep-research` LEAF agent per iteration (fresh context each time)
- Externalized state via JSONL + strategy files
- Automatic convergence detection with quality guards (3 binary checks before STOP)
- Persistent dashboard auto-generated each iteration for progress tracking
- Negative knowledge (ruled-out directions) as first-class research output
- Research charter (non-goals, stop conditions) validated at init
- Does NOT proceed to implementation

---

## 12. COMMAND CHAIN

**Research path:** `/spec_kit:deep-research` → `/spec_kit:plan` → `/spec_kit:implement`
**Review:** `/spec_kit:deep-review` → (if issues) `/spec_kit:plan` → `/spec_kit:implement`
