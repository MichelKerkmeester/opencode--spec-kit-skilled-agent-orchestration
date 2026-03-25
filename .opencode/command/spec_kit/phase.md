---
description: Create and manage phase decomposition for complex spec folders
argument-hint: "[feature-description] [--phases N] [--phase-names list] [--parent specs/NNN-name/] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, memory_context, memory_search, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode -> `spec_kit_phase_auto.yaml`
>    - Confirm mode -> `spec_kit_phase_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow. Do not treat reference sections, routing tables, or dispatch templates as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document -- the YAML workflow handles all agent dispatching
- **FIRST ACTION** is always: load the YAML file, then execute it step by step
- **YAML steps** may dispatch `@speckit` for folder creation and `@general` for script execution -- this is controlled by the YAML, not this document

> **Format:** `/spec_kit:phase [feature-description] [--phases N] [--phase-names list] [--parent specs/NNN-name/] [:auto|:confirm]`
> Examples: `/spec_kit:phase:auto Build hybrid RAG search system --phases 3` | `/spec_kit:phase "Large analytics feature" --phase-names "data-layer,api,ui"`

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. Round-trip: 1 user interaction.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No analysis, no tool calls -- ask ALL questions immediately, then wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   |-- ":auto"    -> execution_mode = "AUTONOMOUS" (omit Q4)
   |-- ":confirm" -> execution_mode = "INTERACTIVE" (omit Q4)
   +-- No suffix  -> execution_mode = "ASK" (include Q4)

2. CHECK $ARGUMENTS for feature description:
   |-- Has content (ignoring flags/suffix) -> feature_description = $ARGUMENTS, omit Q0
   +-- Empty -> include Q0

3. CHECK $ARGUMENTS for flags:
   - --phases N -> phase_count = N (omit from Q1 default suggestion)
   - --phase-names "a,b,c" -> phase_names = list (omit Q2)
   - --parent specs/NNN-name/ -> parent_spec = path (omit Q1 creation)

4. Search for related spec folders:
   $ ls -d {.opencode/,}specs/*/ 2>/dev/null | tail -10

5. ASK with SINGLE prompt (include only applicable questions):

   Q0. Feature Description (if not in command):
     What feature needs phase decomposition?

   Q1. Phase Count (if --phases not provided):
     How many phases? (Default: 3, will refine based on scope analysis)
     Suggested: [suggest based on feature description if provided]

   Q2. Phase Names (if --phase-names not provided):
     Provide phase names? (Optional - auto-generated from scope analysis if skipped)
     Example: "data-model, api-layer, ui-components"

   Q3. Parent Documentation Level:
     A) Level 3+ (Recommended for phased work)
     B) Level 3
     C) Level 2

   Q4. Execution Mode (if no suffix):
     A) Autonomous - all 7 steps without approval
     B) Interactive - pause at each step

   Reply format: "Build RAG system, 3, skip, A, A" or "B, , , A, B"

6. WAIT for user response (DO NOT PROCEED)

7. Parse response and store ALL results:
   - feature_description = [from Q0 or $ARGUMENTS]
   - phase_count = [from Q1 or --phases, default 3]
   - phase_names = [from Q2 or --phase-names, or null for auto-generate]
   - parent_level = [from Q3, default "3+"]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q4]

8. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER auto-select execution mode without suffix or choice
NEVER split questions into multiple prompts
```

**Phase Output:**
- `feature_description` | `phase_count` | `phase_names`
- `parent_level` | `execution_mode`

> **Cross-reference**: Implements AGENTS.md Section 2 "Gate 3: Spec Folder Question".

---

# SpecKit Phase

Create phased spec folder structures for complex, multi-session tasks. Decomposes a large feature into structured parent + child phase folders with proper linkage, scope boundaries, and handoff criteria.

> **ENFORCEMENT:** Phase decomposition creates the folder structure only. Use `/spec_kit:plan` per child phase for detailed planning, then `/spec_kit:implement` for execution.

```yaml
role: Expert Developer using Smart SpecKit for Phase Decomposition
purpose: Create phased spec folder structures for complex multi-session tasks
action: Analyze scope, create parent+child folders, populate templates with phase metadata

operating_mode:
  workflow: sequential_7_step
  compliance: MANDATORY
  execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: phase_creation
  validation: folder_structure_valid
```

---

## 1. PURPOSE

Create phased spec folder structures for complex, multi-session tasks. Detects when a task warrants decomposition, proposes a phase structure, creates parent + N child folders with proper cross-references, and saves context for subsequent `/spec_kit:plan` workflows per phase.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` -- Feature description with optional phase configuration flags
**Outputs:** Parent spec folder with Phase Documentation Map + N child phase folders with parent back-references

> **Level Note:** Parent folder defaults to L3+. Child phase folders default to L1 (escalated during `/spec_kit:plan` per phase).

```text
$ARGUMENTS
```

---

## 3. WORKFLOW OVERVIEW

| Step | Name                   | Purpose                                | Outputs                      |
| ---- | ---------------------- | -------------------------------------- | ---------------------------- |
| 1    | Analyze Scope          | Evaluate complexity, recommend phases  | phase_recommendation         |
| 2    | Decomposition Proposal | Define phase structure and boundaries  | phase_plan                   |
| 3    | Create Folders         | Create parent + child spec folders     | parent_folder, child_folders |
| 4    | Populate Parent        | Fill Phase Documentation Map           | parent spec.md updated       |
| 5    | Populate Children      | Fill child specs with scope boundaries | child specs updated          |
| 6    | Save Context           | Save conversation context              | memory/*.md                  |
| 7    | Next Steps             | Present continuation options           | next_steps_presented         |

---

## 4. INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_phase_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_phase_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. OUTPUT FORMATS

**Success:**
```
SpecKit Phase Decomposition Complete -- All 7 steps executed.
Parent: specs/[NNN]-[feature-name]/
Phases: [N] child folders created
  001-[phase-1-name]/ | 002-[phase-2-name]/ | ...
Next: /spec_kit:plan specs/[NNN]-[feature-name]/001-[phase-1-name]/
STATUS=OK PATH=[parent-spec-path] PHASES=[N]
```

**Failure:**
```
SpecKit Phase Decomposition Failed
Error: [description] | Step: [number]
STATUS=FAIL ERROR="[message]"
```

---

## 6. NEXT STEPS

| Condition                    | Suggested Command                               | Reason                           |
| ---------------------------- | ----------------------------------------------- | -------------------------------- |
| Plan first phase             | `/spec_kit:plan specs/NNN-name/001-phase/`      | Create detailed plan per phase   |
| Plan all phases sequentially | `/spec_kit:plan` for each child                 | Comprehensive planning           |
| Implement after planning     | `/spec_kit:implement specs/NNN-name/001-phase/` | Execute phase implementation     |
| Review decomposition         | Read parent `spec.md` Phase Documentation Map   | Verify phase boundaries          |
| Validate structure           | `validate.sh --recursive specs/NNN-name/`       | Verify folder integrity          |
| Save context                 | `/memory:save [parent-spec-path]`               | Preserve decomposition decisions |

**ALWAYS** end with: "What would you like to do next?"

---

## 7. COMMAND CHAIN

```
[/spec_kit:deep-research] -> /spec_kit:phase -> /spec_kit:plan (per child) -> /spec_kit:implement (per child)
```

---

## 8. KEY DIFFERENCES FROM OTHER COMMANDS

- **Creates structure only** -- no specification content, no technical planning
- **Parent + children** -- produces multiple folders in one workflow
- **Per-phase continuation** -- each child phase gets its own `/spec_kit:plan` + `/spec_kit:implement` lifecycle
- **Use case** -- large features (500+ LOC, 15+ files, multi-domain) that need decomposition before detailed planning
