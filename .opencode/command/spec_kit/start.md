---
description: Canonical spec-folder intake interview for create, repair, and placeholder-upgrade flows. Supports :auto and :confirm modes
argument-hint: "[feature-description] [:auto|:confirm] [--spec-folder=PATH] [--level=1|2|3|3+] [--start-state=empty|partial|repair|populated] [--repair-mode=MODE] [--record-relationships=yes|no]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, memory_context, memory_search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve:
>    - `feature_description`
>    - `spec_path`
>    - `execution_mode`
>    - `start_state`
>    - `repair_mode`
>    - `level_recommendation`
>    - `selected_level`
>    - `manual_relationships`
>    - `resume_question_id`
>    - `reentry_reason`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `spec_kit_start_auto.yaml`
>    - Confirm: `spec_kit_start_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** state transitions and approval gates are handled by the YAML workflow steps
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `spec_path`, `start_state`, `repair_mode`, `execution_mode`
  - `feature_description`, `level_recommendation`, `selected_level`
  - `manual_relationships`, `resume_question_id`, `reentry_reason`
- **CANONICAL SUCCESS CONDITION**: `spec.md`, `description.json`, and `graph-metadata.json` publish successfully before any optional memory-save branch runs
- **FAIL CLOSED** on ambiguous folder state, tracked seed-marker conflicts, or staged-write rename failures

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all unresolved intake inputs in one prompt. Confirm mode still includes multiple approval gates after setup; only the setup round-trip is consolidated here.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response unless all required flags already bind the full contract in `:auto`. Read-only discovery to classify folder state or suggest an existing spec folder is allowed, then ask only the unresolved questions immediately and wait.

**STATUS: BLOCKED**

```text
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   |-- ":auto"         -> execution_mode = "AUTONOMOUS"
   |-- ":confirm"      -> execution_mode = "INTERACTIVE"
   +-- No suffix       -> execution_mode = "ASK"

2. CHECK $ARGUMENTS for feature description:
   |-- Has content (ignoring suffixes and flags):
   |     -> feature_description = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. PARSE optional flags from $ARGUMENTS:
   |-- --spec-folder=PATH -> spec_path = PATH, omit folder-path follow-up
   |-- --level=N -> selected_level = N
   |-- --start-state=STATE -> requested_start_state = STATE
   |-- --repair-mode=MODE -> repair_mode = MODE
   |-- --record-relationships=yes|no -> collect_relationships = [true|false]
   |-- --depends-on=PACKET_ID[,PACKET_ID...] -> seed manual_relationships.depends_on[]
   |-- --related-to=PACKET_ID[,PACKET_ID...] -> seed manual_relationships.related_to[]
   |-- --supersedes=PACKET_ID[,PACKET_ID...] -> seed manual_relationships.supersedes[]

4. Inspect candidate target folders across alias roots and classify current folder state:
   - Prefer explicit --spec-folder when present
   - Else search recent packet folders under `specs/` and `.opencode/specs/`
   - Inspect for `spec.md`, `description.json`, `graph-metadata.json`, and tracked seed markers
   - Normalize to:
     * `empty-folder`
     * `partial-folder`
     * `repair-mode`
     * `placeholder-upgrade`
     * `populated-folder`

5. Derive defaults before prompting:
   - `repair_mode = create` for empty-folder
   - `repair_mode = repair-metadata` for partial-folder or repair-mode
   - `repair_mode = resolve-placeholders` for placeholder-upgrade
   - `repair_mode = abort` for populated-folder unless the user explicitly selects repair/overwrite
   - Run `recommend-level.sh` before Q2 and store the helper result as `level_recommendation`

6. ASK with ONE consolidated prompt (include only unresolved questions):

   Q0. Feature Description (if not already supplied):
     What should this spec folder capture?

   Q1. Target Folder State:
     A) Empty / create canonical trio
     B) Partial / resume unfinished folder
     C) Repair existing folder metadata
     D) Populated / review before overwrite or metadata-only repair
     Note: tracked seed markers force `placeholder-upgrade` even if the folder otherwise looks populated.

   Q2. Documentation Level:
     Recommendation: [show `level_recommendation` and brief rationale]
     Keep it, or override to Level 1 / 2 / 3 / 3+?

   Q3. Record relationships now?
     A) No
     B) Yes

   Q4+. Relationship entries (only if Q3 = yes):
     Provide grouped `depends_on`, `related_to`, and/or `supersedes` entries using `packet_id` as the key.

   Reply format examples:
   - "Feature intake refactor, A, keep, A"
   - "B, override to Level 3, B, depends_on=026-009 reason: build on prior graph audit"

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - feature_description = [from Q0 or $ARGUMENTS]
   - spec_path = [explicit path or derived target]
   - start_state = [classified state]
   - repair_mode = [derived or user-confirmed mode]
   - execution_mode = [AUTONOMOUS or INTERACTIVE]
   - level_recommendation = [helper output]
   - selected_level = [kept or overridden level]
   - manual_relationships.depends_on = [...]
   - manual_relationships.related_to = [...]
   - manual_relationships.supersedes = [...]
   - resume_question_id = [first unresolved question id or null]
   - reentry_reason = [none | incomplete-interview | placeholder-upgrade | metadata-repair]

9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers or the full `:auto` contract is already bound
NEVER auto-overwrite a populated folder without an explicit approval path
NEVER split setup questions into multiple prompts
```

**Phase Output:**
- `feature_description` | `spec_path` | `start_state` | `repair_mode`
- `execution_mode` | `level_recommendation` | `selected_level`
- `manual_relationships` | `resume_question_id` | `reentry_reason`

---

# Spec Kit Start

Create or repair the canonical spec-folder trio through a thin intake workflow. This command owns folder-state classification, level recommendation versus override, optional manual relationship capture, staged canonical publication, and the decision to branch into memory save only after trio success.

```yaml
role: Spec Kit Intake Manager
purpose: Resolve start-intake inputs, publish the canonical trio, and return a stable contract for direct or delegated use
action: Execute YAML workflow managing preflight, interview, staged canonical trio publication, optional save branching, and final reporting
operating_mode:
  workflow: intake_interview
  compliance: MANDATORY
  execution: autonomous_or_interactive
  validation: canonical_trio_first
```

---

## 1. PURPOSE

Run the canonical `/spec_kit:start` intake flow: classify folder state, collect only the minimal missing interview fields, recommend and confirm documentation level, optionally capture manual packet relationships, publish `spec.md`, `description.json`, and `graph-metadata.json` through staged commit semantics, then optionally branch into memory save if structured context exists.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Optional feature description plus mode suffixes and pre-binding flags
**Outputs:** `feature_description`, `spec_path`, `selected_level`, `level_recommendation`, `start_state`, `repair_mode`, `manual_relationships`, `resume_question_id`, `reentry_reason`, plus `STATUS=<OK|FAIL|CANCELLED>`

---

## 3. WORKFLOW OVERVIEW

| Phase | Name | Purpose | Outputs |
|-------|------|---------|---------|
| Preflight | Inspect + classify | Resolve target folder, advisory intake lock, current state, and re-entry conditions | `spec_path`, `start_state`, `repair_mode`, `resume_question_id`, `reentry_reason` |
| Interview | Collect minimal intake | Bind missing description, level, and relationship choices | `feature_description`, `level_recommendation`, `selected_level`, `manual_relationships` |
| Emit | Canonical trio | Stage and commit `spec.md`, `description.json`, `graph-metadata.json` | Canonical trio committed or fail-closed recovery output |
| Save | Optional memory branch | Run context save only when structured context exists and branch conditions pass | Independent memory-save result |
| Report | Return stable contract | Summarize outputs for direct use or parent-command delegation | `STATUS=OK|FAIL|CANCELLED` with returned fields |

### Execution Modes

| Mode | Invocation | Behavior |
|------|-----------|----------|
| `:auto` | `/spec_kit:start:auto "feature"` | Uses inferred defaults and pre-bound flags; zero prompts when the contract is fully supplied |
| `:confirm` | `/spec_kit:start:confirm "feature"` | Uses the same state graph with approval gates around folder-state review, interview summary, canonical emission, and optional save branching |
| (default) | `/spec_kit:start "feature"` | Ask the operator to choose a mode during setup when unresolved |

---

## 4. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on `execution_mode`:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`

The YAML contains the full intake workflow: preflight classification, consolidated interview, staged canonical trio publication, optional memory-save branching, and final reporting.

Direct `/spec_kit:start` runs own the full intake. Delegated parent runs (`/spec_kit:plan`, `/spec_kit:complete`) must inherit the parent execution mode and consume the returned contract inline rather than opening a second visible command flow.

---

## 5. OUTPUT FORMATS

**Success:**
```text
Spec Kit start complete.
State: [start_state] | Repair mode: [repair_mode]
Level: [selected_level] (recommended: [level_recommendation])
Canonical trio: spec.md, description.json, graph-metadata.json
Optional memory save: [skipped|success|failed]

Returned contract:
  feature_description=[...]
  spec_path=[...]
  selected_level=[...]
  level_recommendation=[...]
  start_state=[...]
  repair_mode=[...]
  manual_relationships=[JSON]
  resume_question_id=[...]
  reentry_reason=[...]

STATUS=OK PATH=[spec-path]
```

**Failure:**
```text
Error: [error description]  Phase: [phase name]
Recovery: [exact next step]
STATUS=FAIL ERROR="[message]"
```

**Cancelled:**
```text
Start intake cancelled.
State preserved for re-entry at [resume_question_id]
STATUS=CANCELLED PATH=[spec-path]
```

---

## 6. MEMORY INTEGRATION

### Before Starting
- `memory_context({ input: feature_description OR spec_path, mode: "focused", intent: "understand" })` only when prior packet context is needed to suggest an existing folder or relationship target
- Skip memory lookup when the operator explicitly requests a fresh start

### After Canonical Trio Success
- Optional memory save is a branch, not the success condition
- Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]` only when structured context exists beyond the canonical trio
- Report save skip or failure independently from trio success

### Returned Memory Fields
- `resume_question_id` and `reentry_reason` preserve re-entry state across direct and delegated runs
- `manual_relationships.*` remain the authoritative manual relationship payload until metadata files are regenerated

---

## REFERENCE

| Category | Paths |
|----------|-------|
| Spec folder path | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/` |
| Related commands | `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/complete.md`, `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/resume.md` |
| Skill references | `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-research/references/spec_check_protocol.md` |
| YAML assets | `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml` |
| Helper scripts | `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh`, `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js` |

This command is the canonical intake surface for direct runs and delegated parent flows. `/spec_kit:plan` and `/spec_kit:complete` may reuse the returned contract inline, while `/spec_kit:deep-research` consumes the same spec folder through the bounded `spec.md` anchoring rules in `spec_check_protocol.md`.

---

## 7. SKILL REFERENCE

Full protocol documentation: `.opencode/skill/system-spec-kit/SKILL.md`

Key references:
- Spec-folder lifecycle and canonical trio contract: `.opencode/skill/system-spec-kit/SKILL.md`
- Spec-check protocol (seed markers, fence replacement, audit events): `.opencode/skill/sk-deep-research/references/spec_check_protocol.md`
- Level 1/2/3/3+ templates: `.opencode/skill/system-spec-kit/templates/`
- Recommend-level helper: `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh`
- Description generator: `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/generate-description.js`

For deep research integration, see `sk-deep-research` skill (`.opencode/skill/sk-deep-research/SKILL.md`). For planning and implementation chain, see `/spec_kit:plan` and `/spec_kit:complete`.

---

## 8. QUALITY GATES

- Folder state is normalized to exactly one of: `empty-folder`, `partial-folder`, `repair-mode`, `placeholder-upgrade`, `populated-folder`
- `level_recommendation` and `selected_level` are stored separately; operator override never erases the helper suggestion
- Manual relationship objects use `{ packet_id, reason, source, spec_folder?, title? }` and dedupe by `packet_id` within each relation type
- Canonical trio publication uses staged temp writes plus final rename; pre-existing files remain intact on failure
- Confirm mode pauses at the four required approval gates: folder-state review, interview summary, canonical trio emission, optional save branching
- Auto mode reaches zero prompts only when the full contract is already bound by args or inherited parent state

---

## 9. ERROR HANDLING

| Error | Action |
|-------|--------|
| Populated folder without explicit repair approval | Abort by default and show repair / overwrite choices |
| Stale or contended intake lock | Fail closed with exact cleanup or retry guidance |
| Missing template or helper failure | Halt trio publication, preserve pre-existing files, and report the failing helper |
| Tracked seed-marker conflict | Reclassify to `placeholder-upgrade` or halt on ambiguity |
| Memory save requested without structured context | Skip save branch and keep canonical trio as success |

---

## 10. NEXT STEPS

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Canonical trio ready, move into planning | `/spec_kit:plan [feature-description]` | Continue with plan authoring on a real spec folder |
| Canonical trio ready, research first | `/spec_kit:deep-research [topic]` | Anchor research to the new or repaired `spec.md` |
| Need completion workflow later | `/spec_kit:complete [spec-folder]` | Resume closeout on the stabilized packet |
| Need to pause | `/memory:save [spec-folder]` | Refresh canonical continuity before the next session |

---

## 11. COMMAND CHAIN

**Spec-first implementation path:** `/spec_kit:start` -> `/spec_kit:plan` -> `/spec_kit:implement`
**Spec-first research path:** `/spec_kit:start` -> `/spec_kit:deep-research` -> `/spec_kit:plan`
