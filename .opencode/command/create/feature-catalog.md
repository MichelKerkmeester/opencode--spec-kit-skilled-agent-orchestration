---
description: Create or update feature catalog packages through one unified command with explicit operation routing and mode support (:auto | :confirm)
argument-hint: "<skill-name> [create|update] [--path <dir>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL - READ FIRST**
>
> This command is the canonical entrypoint for feature catalog creation workflows.
> Do not split behavior across legacy or ad-hoc catalog commands.
>
> Mandatory execution order:
> 1. Run Phase 0 verification (`@write`)
> 2. Run unified setup (single consolidated prompt)
> 3. Verify required phase outputs are present
> 4. Route by mode (`:auto` or `:confirm`)
> 5. Route by operation (`create` or `update`)
> 6. Load and execute the selected YAML workflow

---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

Before reading any other section, execute Phase 0 and setup validation.
Do not infer missing command arguments from prior conversation context.

---

# 🚨 PHASE 0: @WRITE AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```text
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as @write?
|
|- Verify @write indicators:
|  - Invoked with @write
|  - Template-first generation behavior available
|  - sk-doc quality validation behavior available
|- IF yes:
|  - write_agent_verified = true
|  - phase_0_status = PASSED
|- IF no/uncertain:
|  - HARD BLOCK and stop

HARD BLOCK MESSAGE:
"This command requires @write for template-first generation and sk-doc validation.
Restart with: @write /create:feature-catalog <skill-name> [create|update]"
```

Phase outputs:
- `write_agent_verified`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

This command uses one consolidated setup prompt. Do not split setup questions.

```text
SETUP EXECUTION LOGIC:

1) Parse invocation shape
   - /create:feature-catalog <skill-name> [create|update] [--path <dir>] [:auto|:confirm]

2) Parse mode suffix
   - :auto detected    -> execution_mode = AUTONOMOUS (omit mode question)
   - :confirm detected -> execution_mode = INTERACTIVE (omit mode question)
   - no suffix         -> execution_mode = ASK

3) Parse positional tokens
   - token 1: skill_name (if present)
   - token 2: operation (if present)

4) Parse flags
   - --path <dir>

5) Determine which setup questions are required
   - Ask skill name only when missing
   - Ask operation only when missing or invalid
   - Ask source strategy always
   - Ask spec folder choice always
   - Ask memory loading only when existing spec is selected and memory files exist
   - Ask execution mode only when no suffix is present

6) Ask ONE consolidated setup prompt with only missing items

   Q0. Skill Name (if missing)
       - Required format: hyphen-case folder name

   Q1. Operation (if missing)
       A) create
       B) update

   Q2. Source Strategy (required)
       A) Derive from existing manual testing playbook when present
       B) Build from a manual feature list or operator-provided inventory
       C) Hybrid: derive what exists, then patch gaps manually

   Q3. Spec Folder (required)
       A) Existing
       B) New
       C) Update related
       D) Skip
       E) Phase folder

   Q4. Memory Context (if existing spec has memory files)
       A) Load latest memory
       B) Load up to 3 recent memories
       C) Skip

   Q5. Execution Mode (if no suffix)
       A) Interactive (:confirm)
       B) Autonomous (:auto)

7) Wait for user response and parse fields

8) Normalize setup outputs
   - skill_name
   - operation
   - source_strategy
   - skill_path (from --path or default .opencode/skill/)
   - catalog_root = [skill_path]/[skill_name]/feature_catalog
   - execution_mode
   - spec_choice
   - spec_path
   - memory_choice

HARD STOPS:
- Do not infer missing operation from context
- Do not split setup across multiple prompts
- Do not continue with missing required fields
```

Phase outputs:
- `skill_name`
- `operation`
- `source_strategy`
- `skill_path`
- `catalog_root`
- `execution_mode`
- `spec_choice`
- `spec_path`
- `memory_choice`

---

# PHASE STATUS VERIFICATION (BLOCKING)

Verify all required values are set before YAML execution:

| Field | Required | Rule |
| --- | --- | --- |
| write_agent_verified | Yes | `true` |
| skill_name | Yes | explicit, hyphen-case |
| operation | Yes | `create` or `update` |
| source_strategy | Yes | one of A/B/C normalized choices |
| skill_path | Yes | default `.opencode/skill/` if omitted |
| catalog_root | Yes | derived from skill name and path |
| execution_mode | Yes | `:auto` or `:confirm` |
| spec_choice | Yes | one of A/B/C/D/E |
| spec_path | Conditional | required for spec choices A/B/C/E |

Proceed only when all required fields validate.

---

## 1. PURPOSE

Provide one canonical command entrypoint for feature catalog lifecycle operations while enforcing the shipped `sk-doc` contract for rooted catalogs, numbered category folders, per-feature files, and current-reality source references.

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` using the canonical argument shape.

**Outputs:**
- Command execution through unified mode workflow and operation branch.
- A feature catalog rooted at `<skill-root>/feature_catalog/`.
- Deterministic completion summary with status and path.

**Status patterns:**
- Success: `STATUS=OK PATH=<feature-catalog-root-or-root-file>`
- Failure: `STATUS=FAIL ERROR="<reason>"`
- Cancelled (confirm mode): `STATUS=CANCELLED ACTION=cancelled`

## 3. USER INPUT

```text
$ARGUMENTS
```

Accepted operation values:
- `create`
- `update`

Accepted mode suffix values:
- `:auto`
- `:confirm`

## 4. WORKFLOW OVERVIEW

| Step | Name | Purpose | Output |
| --- | --- | --- | --- |
| 1 | Phase 0 Verification | Ensure `@write` is active | `write_agent_verified` |
| 2 | Unified Setup | Capture all required parameters once | normalized setup fields |
| 3 | Phase Validation | Enforce required-field contract | phase pass/fail |
| 4 | Mode Routing | Route to auto or confirm YAML | target YAML path |
| 5 | Operation Routing | Select `create` or `update` branch | operation-specific execution |
| 6 | Validation + Completion | Enforce quality gates and produce status | `STATUS=OK|FAIL|CANCELLED` |

## 5. INSTRUCTIONS

### Step 1: Run Phase 0
- Execute `@write` verification.
- Hard block on failure.

### Step 2: Run Unified Setup
- Ask one consolidated prompt for missing values.
- Normalize and store outputs.

### Step 3: Run Phase Verification
- Validate required fields.
- Re-prompt missing values only.

### Step 4: Route by Mode
- `:auto` -> load `create_feature_catalog_auto.yaml`.
- `:confirm` -> load `create_feature_catalog_confirm.yaml`.

### Step 5: Route by Operation
- Route to one branch: `create` or `update`.

### Step 6: Execute YAML + Report Completion
- Enforce gate model and validation loop.
- Return deterministic completion status.

---

## 6. MODE ROUTING

Mode route targets:
- `:auto` -> `.opencode/command/create/assets/create_feature_catalog_auto.yaml`
- `:confirm` -> `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`

Default mode if omitted: `:confirm`.

Behavior summary:
- `:auto`: no approval checkpoints, stops for hard failures.
- `:confirm`: checkpointed execution with review/modify/cancel options.

---

## 7. OPERATION ROUTING CONTRACT

| Operation | Purpose | Target Must Exist | Output Scope |
| --- | --- | --- | --- |
| `create` | Create a new rooted feature catalog package | No (warn if it already exists) | `FEATURE_CATALOG.md` + category folders + per-feature files |
| `update` | Update an existing rooted feature catalog package | Yes | existing root catalog + existing/new per-feature files |

The command must always scaffold or preserve:
- `feature_catalog/FEATURE_CATALOG.md`
- numbered root-level category folders
- per-feature files using the feature catalog snippet template
- frontmatter on root and per-feature files
- numbered all-caps H2 sections

---

## 8. SOURCE STRATEGY CONTRACT

The setup phase must capture one explicit source strategy:

| Strategy | Meaning |
| --- | --- |
| Derive from playbook | Read an existing `manual_testing_playbook/` and use its scenarios as the starting inventory |
| Manual inventory | Build the catalog from operator-provided feature names and implementation anchors |
| Hybrid | Start from an existing playbook or root docs, then patch missing features manually |

Routing rule:
- If a manual testing playbook already exists, deriving from it is preferred because it preserves feature naming and traceability.
- If no playbook exists, fall back to manual inventory and implementation discovery.

---

## 9. SHIPPED CONTRACT REQUIREMENTS

The generated catalog must match the current shipped `sk-doc` contract:

- Root file: `feature_catalog/FEATURE_CATALOG.md`
- Category directories: `NN--category-name`
- Per-feature files: `NN-feature-name.md`
- Root structure:
  - frontmatter
  - H1 + short intro paragraph
  - unnumbered `TABLE OF CONTENTS`
  - `## 1. OVERVIEW`
  - numbered all-caps category sections
- Per-feature structure:
  - frontmatter
  - `## 1. OVERVIEW`
  - `## 2. CURRENT REALITY`
  - `## 3. SOURCE FILES`
  - `## 4. SOURCE METADATA`

---

## 10. REQUIRED REFERENCES AND TEMPLATES

The workflow must load both the standards reference and the templates:

**References**
- `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`
- `.opencode/skill/sk-doc/references/global/core_standards.md`
- `.opencode/skill/sk-doc/references/global/validation.md`

**Templates**
- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`
- `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md`

The workflow is incomplete if it uses only the root template and ignores the per-feature file template.

---

## 11. VALIDATION AND QUALITY GATES

Hard gates:
- H0: `@write` verification
- H1: required setup fields captured
- H2: create/update existence semantics
- H3: root catalog and per-feature structure match the shipped contract
- H4: root document validates and link checks pass

Required validation pipeline:
- `python3 .opencode/skill/sk-doc/scripts/validate_document.py <FEATURE_CATALOG.md>`
- local link/path checks for per-feature file references
- category-folder and per-feature count verification

Current limitation to document honestly:
- the validator is strongest on the root catalog
- per-feature file quality still needs manual review

---

## 12. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing `skill_name` | Re-prompt Q0 |
| Invalid `operation` | Re-prompt Q1 with `create` or `update` |
| `create` on an existing catalog | Offer reroute to `update` |
| `update` on a missing catalog | Offer reroute to `create` or corrected skill/path |
| Missing numbered category folders in update flow | Create only the required missing folders inside scope |
| Validation failure | Enter fix-and-revalidate loop |

Recovery loop pattern:
1. Stop
2. State exact failure
3. Return to last valid gate
4. Re-run checks
5. Resume

---

## 13. EXAMPLES

Create:
```text
/create:feature-catalog system-spec-kit create :confirm
```

Update:
```text
/create:feature-catalog system-spec-kit update :auto
```

Custom skill root:
```text
/create:feature-catalog my-skill update --path ./packages/skills :confirm
```

---

## 14. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/create:testing-playbook` | Creates the manual validation package that should cross-reference the catalog |
| `/create:sk-skill ... reference-only` | Creates companion standards/reference docs inside a skill |
| `/memory:save` | Saves implementation context to the active spec folder |

---

## 15. COMPLETION REPORT TEMPLATE

```text
Feature Catalog Command Complete

Skill: [skill_name]
Operation: [operation]
Mode: [:auto|:confirm]
Target: [catalog_root]

Validation:
- Root validation: PASSED
- Root/per-feature link checks: PASSED
- Category/per-feature count check: PASSED

Context:
- Spec path: [spec_path or none]
- Memory loaded: [yes/no]

STATUS=OK PATH=[catalog_root]
```

---

## 16. VIOLATION SELF-DETECTION (BLOCKING)

You are in violation if you:
- skip Phase 0 verification
- split setup prompts into multiple interactions
- proceed with missing required fields
- generate only `FEATURE_CATALOG.md` without the per-feature file contract
- use obsolete package shapes or sidecar folders that differ from the shipped `sk-doc` contract
- claim completion without validation

Violation recovery protocol:

```text
1. STOP immediately.
2. STATE: "Violation detected: [exact issue]."
3. RETURN to the failed gate.
4. COMPLETE required checks or inputs.
5. RESUME from next valid step only.
```

Always end user-facing execution with: "What would you like to do next?"

User request: {{args}}
