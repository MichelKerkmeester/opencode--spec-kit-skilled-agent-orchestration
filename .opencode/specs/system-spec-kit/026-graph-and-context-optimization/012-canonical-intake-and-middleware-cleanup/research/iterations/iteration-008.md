# Iteration 008 — Focus: `/spec_kit:start` Draft Surfaces and Parent Delegation Branches

## Focus
Extend iteration-007's delta style to the missing `/spec_kit:start` command surface and the still-undrafted plan/complete asset branches. The goal for this pass is not new product direction; it is to turn the remaining `/start` gap into line-anchored draft content for the new command card, the new auto/confirm YAML assets, and the exact Step 1 insertion seams in `spec_kit_plan_*` and `spec_kit_complete_*`.

## Findings
1. The safest `/spec_kit:start` command card is a thin clone of the existing command pattern: markdown owns setup, YAML owns execution, and the setup round-trip stays consolidated. `deep-research.md` already uses the exact "resolve setup in markdown, then load the correct YAML" contract, while `plan.md` and `complete.md` prove that the repo expects one front-loaded question block instead of scattered follow-up prompts. That means `/start` should expose only start-owned packet-creation inputs at setup time and should not invent a different command shape. [SOURCE: .opencode/command/spec_kit/deep-research.md:1-36] [SOURCE: .opencode/command/spec_kit/plan.md:1-55] [SOURCE: .opencode/command/spec_kit/complete.md:1-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md:7-13]

2. The minimum viable `spec_kit_start_auto.yaml` can stay intentionally small: preflight, folder scan, create-dirs, start interview normalization, artifact emission, and save. The deep-research auto asset shows the repo's preferred YAML layout for role metadata, user inputs, and a single ordered workflow section, while iterations 005-007 already narrowed `/start` to packet-creation state rather than a full planning state machine. A quick step-id sweep returned no existing `step_start_*`, `step_scan_folder_state`, `step_emit_artifacts`, or `step_save_context` collisions in the current command assets, so those names are safe to propose. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:1-99] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:12-46] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-007.md:6-25] [SOURCE: rg sweep over `.opencode/command/spec_kit/assets/*.yaml` in this iteration]

3. `spec_kit_start_confirm.yaml` should preserve the same state/output contract as auto mode and add approval gates only around the places where the user might want to stop: detected folder state, summarized interview inputs, artifact emission, and save. That matches the existing confirm-mode style in `spec_kit_plan_confirm.yaml` and `spec_kit_complete_confirm.yaml`, where the workflow stays structurally parallel to auto mode but pauses at key checkpoints instead of changing the underlying outputs. The result is stronger parity for `REQ-009`: different gate density, same emitted artifacts and returned fields. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:351-430] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:512-610] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:12-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md:129-135]

4. The empty-folder delegation branch for `plan` belongs inside `step_1_request_analysis`, between the existing "verify/create spec folder" activity list and the first confidence checkpoint, not in `step_3_specification` and not in a new optional pre-workflow. The live auto and confirm plan YAMLs both treat Step 1 as the place where folder state, artifact existence, and scope are normalized before any document authoring. Iterations 004-005 already established that delegated `/start` is inline absorption, not a visible chained workflow, so Step 1 is the only place that preserves the current setup contract without forcing a second pre-step system. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:338-357] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:352-371] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md:7-13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md:28-59]

5. The same delegation branch for `complete` must sit inside `step_1_request_analysis` after phase-predecessor validation but before the confidence checkpoint, so it does not interfere with the existing optional research or phase workflows. The auto and confirm complete YAMLs already reserve Step 1 for folder-state normalization and phase-child gating, while optional `:with-research` and `:with-phases` are wired elsewhere in the workflow. The clean contract is therefore: validate predecessor first when relevant, then run the embedded `/start` branch only if the canonical artifacts are missing or incomplete, then continue with the normal complete lifecycle. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:468-495] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:513-538] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md:7-13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-007.md:92-124]

## Exact Insertion Points
1. `S1` — new `.opencode/command/spec_kit/start.md`, lines 1-18: frontmatter plus the same "markdown owns setup, YAML owns execution" protocol used by the existing `spec_kit` command cards.
2. `S2` — new `.opencode/command/spec_kit/start.md`, lines 19-73: the unified setup phase with the minimum `/start` interview (`feature_description`, target folder state, execution mode when not pre-bound, level confirm/override, optional manual relationships).
3. `S3` — new `.opencode/command/spec_kit/start.md`, lines 74-118: the `/start` purpose, contract, workflow overview, and YAML handoff instructions.
4. `A1` — new `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`, lines 1-30: metadata, operating mode, and start-specific user input contract.
5. `A2` — new `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`, lines 31-92: the core autonomous workflow skeleton (`step_preflight_contract` through `step_start_complete`).
6. `C1` — new `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`, lines 1-31: metadata, operating mode, and the same user input contract as auto mode.
7. `C2` — new `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`, lines 32-114: the confirm skeleton with approval gates added around folder-state review, interview summary, artifact emission, and save.
8. `P-A1` — `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`, insert after line 340 and before line 341 inside `step_1_request_analysis`.
9. `P-C1` — `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`, insert after line 354 and before line 355 inside `step_1_request_analysis`.
10. `C-A1` — `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`, insert after line 487 and before line 488 inside `step_1_request_analysis`.
11. `C-C1` — `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`, insert after line 526 and before line 527 inside `step_1_request_analysis`.

## Draft: `.opencode/command/spec_kit/start.md`
### `S1` — lines 1-18
```md
---
description: Spec intake workflow - create or repair canonical spec artifacts. Supports :auto and :confirm modes
argument-hint: "<feature-description> [:auto|:confirm] [--spec-folder=<path>] [--level=<1|2|3|3+>] [--repair] [--depends-on=<paths>] [--related-to=<paths>] [--supersedes=<paths>]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, memory_context, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan
---

> **EXECUTION PROTOCOL -- READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Resolve `feature_description`, `spec_folder`, `execution_mode`, `selected_level`, `repair_mode`, and `manual_relationships`
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto: `spec_kit_start_auto.yaml`
>    - Confirm: `spec_kit_start_confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.
```

### `S2` — lines 19-73
```md
## CONSTRAINTS

- **DO NOT** ask dispatch mode, phase decomposition, or research-intent questions from `/start`; those remain parent-command-owned.
- **DO NOT** overwrite populated artifacts silently; repair and placeholder-upgrade paths require explicit selection.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound: `feature_description`, `spec_folder`, `execution_mode`, `selected_level`, and `repair_mode`.

# SINGLE CONSOLIDATED SETUP PROMPT

This workflow gathers all `/start` inputs in one prompt. Parent commands may pre-bind some values when delegation runs inline.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response when `/start` is invoked directly. Lightweight read-only discovery to suggest a target folder or recommended level is allowed; file creation waits until the user answers.

**STATUS: BLOCKED**

1. CHECK mode suffix:
   - `:auto` -> `execution_mode = "AUTONOMOUS"` (omit execution-mode question)
   - `:confirm` -> `execution_mode = "INTERACTIVE"` (omit execution-mode question)
   - no suffix -> `execution_mode = "ASK"`

2. PARSE optional flags:
   - `--spec-folder=<path>` -> pre-bind `spec_folder`
   - `--level=<1|2|3|3+>` -> pre-bind `selected_level`
   - `--repair` -> pre-bind `repair_mode = "repair"`
   - `--depends-on`, `--related-to`, `--supersedes` -> seed `manual_relationships`

3. CHECK `$ARGUMENTS` for feature description:
   - has content -> `feature_description = $ARGUMENTS`, omit the feature-description question
   - empty -> include the feature-description question

4. ASK with SINGLE prompt (include only applicable questions):
   - `Q0.` Feature Description (if not already bound): What feature or packet should this spec folder describe?
   - `Q1.` Target Folder State:
     `A)` Create new folder under `specs/[###]-[slug]/`
     `B)` Repair existing folder `[path]`
     `C)` Resume partial intake `[path]`
     `D)` Upgrade deep-research placeholders `[path]`
   - `Q2.` Execution Mode (if no suffix):
     `A)` Autonomous
     `B)` Interactive
   - `Q3.` Documentation Level:
     `A)` Accept recommendation
     `B)` Override to Level 1
     `C)` Override to Level 2
     `D)` Override to Level 3
     `E)` Override to Level 3+
   - `Q4.` Record packet relationships now?
     `A)` No
     `B)` Yes - collect `depends_on`, `related_to`, and/or `supersedes`

5. WAIT for the user response. Do NOT create artifacts before the setup values are resolved.
```

### `S3` — lines 74-118
```md
# SpecKit Start

Create or repair the canonical packet entry artifacts: `spec.md`, `description.json`, and `graph-metadata.json`.

## 1. PURPOSE

Run the start workflow when a packet folder is empty, partially initialized, or needs a placeholder-upgrade pass after deep research seeded a skeletal `spec.md`.

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` plus setup-derived `spec_folder`, `execution_mode`, `selected_level`, `repair_mode`, and `manual_relationships`
**Outputs:** Target folder with `spec.md`, `description.json`, `graph-metadata.json`, and `STATUS=<OK|FAIL|CANCELLED>`

## 3. WORKFLOW OVERVIEW

| Step | Name | Purpose | Outputs |
|------|------|---------|---------|
| 1 | Preflight | Validate bindings and classify folder state | `folder_state`, `repair_mode` |
| 2 | Prepare | Create any missing directories needed for canonical artifacts | target directories |
| 3 | Interview | Resolve level, repair intent, and optional relationships | normalized setup fields |
| 4 | Emit Artifacts | Create or repair `spec.md`, `description.json`, and `graph-metadata.json` transactionally | canonical packet artifacts |
| 5 | Save | Refresh the canonical support artifact/indexed context | support artifact refreshed |

## 4. INSTRUCTIONS

After setup phase passes, load and execute the appropriate YAML prompt based on `execution_mode`:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`

The YAML owns folder-state branching, artifact emission, repair-mode handling, placeholder-upgrade handling, and the final save step.
```

## Draft: `.opencode/command/spec_kit/assets/spec_kit_start_auto.yaml`
### `A1` — lines 1-30
```yaml
# ─────────────────────────────────────────────────────────────────
# SMART SPECKIT: START WORKFLOW (AUTONOMOUS MODE)
# ─────────────────────────────────────────────────────────────────
role: Spec Intake Manager
purpose: Create or repair canonical packet artifacts with minimal prompting
action: Run `/spec_kit:start` from folder scan through artifact emission

operating_mode:
  workflow: sequential
  workflow_compliance: MANDATORY
  workflow_execution: autonomous
  approvals: none
  tracking: packet_creation_state
  validation: transaction_and_template_checks

user_inputs:
  feature_description: "[FEATURE_DESCRIPTION] - Required unless resuming a prior intake."
  spec_folder: "[SPEC_FOLDER] - Target packet folder. REQUIRED."
  execution_mode: "[EXECUTION_MODE] - Bound during markdown setup."
  selected_level: "[SELECTED_LEVEL] - Level 1, 2, 3, or 3+."
  repair_mode: "[REPAIR_MODE] - create | repair | resume_partial | upgrade_placeholders | abort"
  manual_relationships: "[MANUAL_RELATIONSHIPS] - depends_on / related_to / supersedes arrays or empty arrays."
```

### `A2` — lines 31-92
```yaml
workflow:
  step_preflight_contract:
    action: "Validate setup bindings and packet-root contract"
    verify:
      - required_values_present: [spec_folder, execution_mode, selected_level, repair_mode]
      - spec_folder_is_within: "specs/ or .opencode/specs/ (canonicalize alias roots before validation)"
      - selected_level_valid: "1 | 2 | 3 | 3+"
      - manual_relationships_shape: "depends_on / related_to / supersedes arrays only"

  step_scan_folder_state:
    action: "Classify folder before any writes"
    inspect:
      - "{spec_folder}/spec.md"
      - "{spec_folder}/description.json"
      - "{spec_folder}/graph-metadata.json"
    classify:
      empty-folder: "No canonical artifacts present"
      partial-folder: "Some but not all canonical artifacts exist"
      repair-mode: "spec.md exists but metadata is incomplete"
      placeholder-upgrade: "spec.md exists with deep-research seed markers or unresolved TODO placeholders"
      populated-folder: "All canonical artifacts exist and no unresolved placeholders remain"

  step_create_directories:
    action: "Create any missing packet support directories needed for canonical artifacts"
    condition: "folder_state != 'populated-folder'"
    command: "mkdir -p {spec_folder}/scratch"

  step_start_interview:
    action: "Normalize start-owned inputs for artifact emission"
    collect:
      - feature_description
      - selected_level
      - repair_mode
      - manual_relationships
    defaults:
      manual_relationships: { depends_on: [], related_to: [], supersedes: [] }

  step_emit_artifacts:
    action: "Create or repair `spec.md`, `description.json`, and `graph-metadata.json` transactionally"
    create_or_update:
      - spec.md
      - description.json
      - graph-metadata.json
    rules:
      - "Use create.sh + canonical templates for new packets."
      - "When repair_mode == upgrade_placeholders, replace unresolved deep-research TODO placeholders before reporting success."
      - "Fail closed if any one artifact write fails; surface recovery guidance and leave `start_state = partial-folder`."

  step_save_context:
    action: "Refresh indexed support context after artifact emission"
    command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json {spec_folder}"

  step_start_complete:
    log: "Start workflow complete. Canonical packet artifacts ready for `/spec_kit:plan` or `/spec_kit:complete`."
    set: { start_state: "populated-folder" }
```

## Draft: `.opencode/command/spec_kit/assets/spec_kit_start_confirm.yaml`
### `C1` — lines 1-31
```yaml
# ─────────────────────────────────────────────────────────────────
# SMART SPECKIT: START WORKFLOW (INTERACTIVE MODE)
# ─────────────────────────────────────────────────────────────────
role: Spec Intake Manager
purpose: Create or repair canonical packet artifacts with user approval at each mutation boundary
action: Run `/spec_kit:start` with review checkpoints around state selection, artifact writes, and save

operating_mode:
  workflow: sequential
  workflow_compliance: MANDATORY
  workflow_execution: interactive
  approvals: step_by_step
  tracking: packet_creation_state
  validation: checkpoint_and_template_checks

user_inputs:
  feature_description: "[FEATURE_DESCRIPTION] - Required unless resuming a prior intake."
  spec_folder: "[SPEC_FOLDER] - Target packet folder. REQUIRED."
  execution_mode: "[EXECUTION_MODE] - Bound during markdown setup."
  selected_level: "[SELECTED_LEVEL] - Level 1, 2, 3, or 3+."
  repair_mode: "[REPAIR_MODE] - create | repair | resume_partial | upgrade_placeholders | abort"
  manual_relationships: "[MANUAL_RELATIONSHIPS] - depends_on / related_to / supersedes arrays or empty arrays."
```

### `C2` — lines 32-114
```yaml
workflow:
  step_preflight_contract:
    action: "Validate setup bindings and packet-root contract"
    verify:
      - required_values_present: [spec_folder, execution_mode, selected_level, repair_mode]
      - spec_folder_is_within: "specs/ or .opencode/specs/"
      - selected_level_valid: "1 | 2 | 3 | 3+"
      - manual_relationships_shape: "depends_on / related_to / supersedes arrays only"

  step_scan_folder_state:
    action: "Classify folder before any writes"
    inspect:
      - "{spec_folder}/spec.md"
      - "{spec_folder}/description.json"
      - "{spec_folder}/graph-metadata.json"
    classify:
      empty-folder: "No canonical artifacts present"
      partial-folder: "Some but not all canonical artifacts exist"
      repair-mode: "spec.md exists but metadata is incomplete"
      placeholder-upgrade: "spec.md exists with deep-research seed markers or unresolved TODO placeholders"
      populated-folder: "All canonical artifacts exist and no unresolved placeholders remain"

  gate_folder_state_review:
    type: approval_gate
    purpose: "Show detected folder state and proposed repair path before any writes"

  step_create_directories:
    action: "Create any missing packet support directories needed for canonical artifacts"
    condition: "folder_state != 'populated-folder'"
    command: "mkdir -p {spec_folder}/scratch"

  step_start_interview:
    action: "Normalize start-owned inputs for artifact emission"
    collect:
      - feature_description
      - selected_level
      - repair_mode
      - manual_relationships
    defaults:
      manual_relationships: { depends_on: [], related_to: [], supersedes: [] }

  gate_interview_summary:
    type: approval_gate
    purpose: "Confirm resolved start-owned inputs before artifact creation"

  step_emit_artifacts:
    action: "Create or repair `spec.md`, `description.json`, and `graph-metadata.json` transactionally"
    create_or_update:
      - spec.md
      - description.json
      - graph-metadata.json
    rules:
      - "Use the same artifact contract as auto mode."
      - "Fail closed on any partial write or unresolved placeholder upgrade."

  gate_emit_artifacts_approval:
    type: approval_gate
    purpose: "Review emitted artifact summary before save/context refresh"

  step_save_context:
    action: "Refresh indexed support context after artifact emission"
    command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json {spec_folder}"

  gate_save_context_approval:
    type: approval_gate
    purpose: "Approve final save result before reporting success"

  step_start_complete:
    log: "Start workflow complete. Canonical packet artifacts ready for `/spec_kit:plan` or `/spec_kit:complete`."
    set: { start_state: "populated-folder" }
```

## Delta Hunks: `plan_*` and `complete_*`
### `P-A1` — `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` after line 340 / before line 341
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml
@@
   step_1_request_analysis:
     purpose: Analyze inputs and define planning scope
     activities: [Analyze all user inputs, Define development scope, Verify/create spec folder, Check existing artifacts, Establish planning scope]
+    start_delegation:
+      trigger: "spec.md missing OR folder_state in ['partial-folder', 'repair-mode', 'unresolved-todo-reentry']"
+      workflow_reference: "spec_kit_start_auto.yaml"
+      insert_point: "within_step_1_before_confidence_checkpoint"
+      detect:
+        canonical_artifacts:
+          spec: "{spec_folder}/spec.md"
+          description: "{spec_folder}/description.json"
+          graph: "{spec_folder}/graph-metadata.json"
+        unresolved_todo_rule: "Treat deep-research seed markers or unresolved TODO placeholders as `unresolved-todo-reentry`."
+      if_triggered:
+        - execute_workflow: "spec_kit_start_auto.yaml"
+        - hydrate_fields: [feature_description, spec_path, selected_level, repair_mode, manual_relationships]
+        - continue_to: "step_1_request_analysis.deep_analysis"
+      if_skipped:
+        - log: "Canonical packet artifacts already present; continue planning without delegated intake."
     deep_analysis:
       focus: comprehensive_requirement_analysis
```

### `P-C1` — `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` after line 354 / before line 355
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml
@@
   step_1_request_analysis:
     purpose: Analyze inputs and define planning scope
     activities: [Analyze all user inputs, Define development scope, Verify/create spec folder, Check existing artifacts, Establish planning scope]
+    start_delegation:
+      trigger: "spec.md missing OR folder_state in ['partial-folder', 'repair-mode', 'unresolved-todo-reentry']"
+      workflow_reference: "spec_kit_start_confirm.yaml"
+      insert_point: "within_step_1_before_confidence_checkpoint"
+      detect:
+        canonical_artifacts:
+          spec: "{spec_folder}/spec.md"
+          description: "{spec_folder}/description.json"
+          graph: "{spec_folder}/graph-metadata.json"
+        unresolved_todo_rule: "Treat deep-research seed markers or unresolved TODO placeholders as `unresolved-todo-reentry`."
+      checkpoint:
+        question: "This spec folder is empty or incomplete. Run the embedded `/spec_kit:start` intake before planning?"
+        use: present_options_to_user
+        options:
+          - { label: "Continue Intake", description: "Collect start-owned inputs and create the canonical artifacts" }
+          - { label: "Review State", description: "Show detected folder state and required repairs" }
+          - { label: "Pause", description: "Stop without creating artifacts" }
+      if_triggered:
+        - execute_workflow: "spec_kit_start_confirm.yaml"
+        - hydrate_fields: [feature_description, spec_path, selected_level, repair_mode, manual_relationships]
+        - continue_to: "step_1_request_analysis.deep_analysis"
+      if_skipped:
+        - log: "Canonical packet artifacts already present; continue planning without delegated intake."
     deep_analysis:
       focus: comprehensive_requirement_analysis
```

### `C-A1` — `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` after line 487 / before line 488
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml
@@
     phase_predecessor_validation:
       trigger: "If [SPEC_FOLDER] path matches specs/{NNN-parent}/{NNN-phase}/ (phase child)"
       skip_if: "First phase (001-*) — no predecessor to check"
       check: "Find previous numbered phase folder (e.g., for 002-*, check 001-*). Predecessor is complete if: implementation-summary.md exists OR all tasks marked [x] in tasks.md"
       on_fail: "HARD BLOCK — predecessor phase not complete. Report status and halt."
       on_pass: "Continue with step_1 activities"
+    start_delegation:
+      trigger: "spec.md missing OR folder_state in ['partial-folder', 'repair-mode', 'unresolved-todo-reentry']"
+      workflow_reference: "spec_kit_start_auto.yaml"
+      insert_point: "within_step_1_after_phase_predecessor_validation"
+      detect:
+        canonical_artifacts:
+          spec: "{spec_folder}/spec.md"
+          description: "{spec_folder}/description.json"
+          graph: "{spec_folder}/graph-metadata.json"
+        unresolved_todo_rule: "Treat deep-research seed markers or unresolved TODO placeholders as `unresolved-todo-reentry`."
+      if_triggered:
+        - execute_workflow: "spec_kit_start_auto.yaml"
+        - hydrate_fields: [feature_description, spec_path, selected_level, repair_mode, manual_relationships]
+        - continue_to: "step_1_request_analysis.confidence_checkpoint"
+      if_skipped:
+        - log: "Canonical packet artifacts already present; continue complete workflow without delegated intake."
     confidence_checkpoint:
       evaluate_at: "After analyzing all inputs"
```

### `C-C1` — `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` after line 526 / before line 527
```diff
--- a/.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml
+++ b/.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml
@@
     phase_predecessor_validation:
       trigger: "If [SPEC_FOLDER] path matches specs/{NNN-parent}/{NNN-phase}/ (phase child)"
       skip_if: "First phase (001-*) — no predecessor to check"
       check: "Find previous numbered phase folder (e.g., for 002-*, check 001-*). Predecessor is complete if: implementation-summary.md exists OR all tasks marked [x] in tasks.md"
       on_fail: "HARD BLOCK — predecessor phase not complete. Report status and halt."
       on_pass: "Continue with step_1 activities"
+    start_delegation:
+      trigger: "spec.md missing OR folder_state in ['partial-folder', 'repair-mode', 'unresolved-todo-reentry']"
+      workflow_reference: "spec_kit_start_confirm.yaml"
+      insert_point: "within_step_1_after_phase_predecessor_validation"
+      detect:
+        canonical_artifacts:
+          spec: "{spec_folder}/spec.md"
+          description: "{spec_folder}/description.json"
+          graph: "{spec_folder}/graph-metadata.json"
+        unresolved_todo_rule: "Treat deep-research seed markers or unresolved TODO placeholders as `unresolved-todo-reentry`."
+      checkpoint:
+        question: "This spec folder is empty or incomplete. Run the embedded `/spec_kit:start` intake before continuing?"
+        use: present_options_to_user
+        options:
+          - { label: "Continue Intake", description: "Collect start-owned inputs and create the canonical artifacts" }
+          - { label: "Review State", description: "Show detected folder state and required repairs" }
+          - { label: "Pause", description: "Stop without creating artifacts" }
+      if_triggered:
+        - execute_workflow: "spec_kit_start_confirm.yaml"
+        - hydrate_fields: [feature_description, spec_path, selected_level, repair_mode, manual_relationships]
+        - continue_to: "step_1_request_analysis.confidence_checkpoint"
+      if_skipped:
+        - log: "Canonical packet artifacts already present; continue complete workflow without delegated intake."
     confidence_checkpoint:
       evaluate_at: "After analyzing all inputs"
```

## Assessment
- `findingsCount`: `5`
- `newInfoRatio`: `0.16`
- Questions addressed: `Q4`, `Q5`, `Q7`
- Questions answered: `[]`

### Ruled Out
- Placing empty-folder delegation in `step_3_specification` instead of the Step 1 request-analysis seam.
- Introducing a new visible pre-workflow `/start` phase ahead of phase decomposition or research integration in the parent YAMLs.
- Giving `/spec_kit:start` a different save/approval contract than the parity model already used by `plan` and `complete`.

### Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/deep-research-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-003.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-004.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-005.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/research/iterations/iteration-007.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`

### Reflection
- What worked: using the exact Step 1 line ranges from the live YAMLs made the parent-command deltas much tighter than iteration-007's reservation-level markdown patches.
- What failed: the repo still has no live `/spec_kit:start` implementation to mirror, so the new command and YAMLs remain contract drafts rather than implementation-confirmed behavior.
- What to do differently: the next pass should pressure-test the draft `/start` save step and placeholder-upgrade branch against any packet-local validation or graph-metadata invariants before implementation begins.

### Recommended Next Focus
Iteration 009 should validate the `/start` draft against schema/runtime constraints: artifact transaction boundaries, `graph-metadata.json.manual.*` object shape, placeholder-upgrade exit criteria, and whether the `generate-context.js` save step needs a lighter metadata-only repair path for start-only runs.
