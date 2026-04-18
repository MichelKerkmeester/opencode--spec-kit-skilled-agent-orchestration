---
description: Autonomous deep research loop - iterative investigation with convergence detection. Supports :auto and :confirm modes
argument-hint: "<topic> [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search, mcp__cocoindex_code__search, code_graph_query, code_graph_context
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

> **Note:** Late-INIT `spec.md` detection and bounded `spec.md` mutations follow
> `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`.
> Acquire `{spec_folder}/research/.deep-research.lock` before `folder_state` classification and keep `research/research.md` as the source of truth for any generated findings sync.

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
   |-- --executor=<kind> -> config.executor.kind (`native` | `cli-codex`)
   |-- --model=<id> -> config.executor.model (for example `gpt-5.4`)
   |-- --reasoning-effort=<level> -> config.executor.reasoningEffort (`none` | `minimal` | `low` | `medium` | `high` | `xhigh`)
   |-- --service-tier=<tier> -> config.executor.serviceTier (`priority` | `standard` | `fast`)
   |-- --executor-timeout=<seconds> -> config.executor.timeoutSeconds (positive integer, default `900`)
   +-- Defaults: maxIterations=10, convergenceThreshold=0.05, config.executor.kind=`native`, config.executor.timeoutSeconds=900

   Executor precedence for setup resolution:
   - CLI flag > config file > schema defaults
   - The generated `deep-research-config.json` stores executor settings under `config.executor.*`

   Parsing to config mapping:
   - `--executor` -> `config.executor.kind`
   - `--model` -> `config.executor.model`
   - `--reasoning-effort` -> `config.executor.reasoningEffort`
   - `--service-tier` -> `config.executor.serviceTier`
   - `--executor-timeout` -> `config.executor.timeoutSeconds`

   Validation hook:
   - `parseExecutorConfig` from `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` runs at config-write time
   - Invalid combinations fail fast with clear errors, including `cli-codex` without `--model` and reserved-but-unwired executor kinds

4. Search for related spec folders across alias roots:
   $ find specs .opencode/specs -mindepth 2 -maxdepth 2 -type d 2>/dev/null | sort | tail -10

5. Search for prior work (background):
   - memory_context({ input: research_topic OR "deep-research", mode: "focused", includeContent: true })
   - Store: prior_work_found = [yes/no]

6. ASK with SINGLE prompt (include only applicable questions):
   - Include Q-Exec only when `--executor` is NOT present and the topic text does NOT already mention executor hints such as `cli-codex`, `codex`, or `gpt-5.4`
   - If Q-Exec is omitted and no executor is otherwise resolved, default to `native`

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

   Q-Exec. Executor (optional, press enter for default):
     A) Native (default) — dispatch via @deep-research agent with Opus.
     B) cli-codex — dispatch via codex exec. Requires --model. Example: `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast`.

   Reply format examples:
   - `"A, A"`
   - `"WebSocket research, A, B, 15"`
   - `"WebSocket reconnection strategies, B, A, 10, 0.05, B, gpt-5.4, high, fast"`

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - research_topic = [from Q0 or $ARGUMENTS]
   - spec_choice = [A/B/C/D from Q1]
   - spec_path = [derived path]
   - execution_mode = [AUTONOMOUS/INTERACTIVE]
   - maxIterations = [from Q3 or flag or default 10]
   - convergenceThreshold = [from flag or default 0.05]
   - executor config = [CLI flags, compact reply, config file, or default `native`; map compact reply fields to `config.executor.kind/model/reasoningEffort/serviceTier`, and accept an optional volunteered convergence value before executor fields]

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
| Loop | Iterate | Dispatch @deep-research agent, evaluate convergence + quality guards, generate dashboard | iteration-NNN.md files, deep-research-dashboard.md |
| Synth | Synthesize | Compile final research/research.md | research/research.md (17 sections) |
| Save | Preserve | Refresh continuity update in canonical spec docs | canonical spec doc updated via `generate-context.js` |

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
Artifacts: research/research.md, [N] iteration files, continuity update in canonical spec docs refreshed
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
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
- Verify that `{spec_folder}/memory/` contains the generated memory artifact

### Anchor Tags (Automatic)
`ANCHOR:deep-research-[topic]`, `ANCHOR:findings`, `ANCHOR:convergence-report`

---

## 7. SKILL REFERENCE

Full protocol documentation: `.opencode/skill/sk-deep-research/SKILL.md`

Key references:
- Loop protocol: `sk-deep-research/references/loop_protocol.md`
- Spec check protocol: `sk-deep-research/references/spec_check_protocol.md`
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

> **Note:** Deep-research now anchors bounded findings back into `spec.md` through the generated findings fence while keeping `research/research.md` canonical.

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Research complete, ready to plan | `/spec_kit:plan [feature]` | Use findings for spec/plan |
| Need more investigation | `/spec_kit:deep-research [new-topic]` | Another deep research session |
| Need code/spec audit | `/spec_kit:deep-review [target]` | Iterative code review |
| Want to refresh search support | `/memory:save [spec-folder]` | Refresh the indexed canonical spec document while canonical continuity stays in spec docs |

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

---

## 15. OFFLINE OPTIMIZATION

Convergence thresholds and recovery settings used by this command are a governed maintenance surface managed by the offline loop optimizer (042.004). The optimizer tunes deterministic numeric thresholds offline against real run traces and emits advisory-only candidate patches.

**Key constraints:**
- Optimization is offline only -- it does not run during live research sessions
- Promotion is advisory-only until replay fixtures and behavioral suites exist
- Prompt optimization is deferred future work (Phase 4b) and will use generated prompt packs, never direct agent markdown mutation

**References:**
- Optimizer manifest: `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
- Tunable thresholds: `convergenceThreshold`, `stuckThreshold`, `maxIterations`
- Convergence reference: `.opencode/skill/sk-deep-research/references/convergence.md`
