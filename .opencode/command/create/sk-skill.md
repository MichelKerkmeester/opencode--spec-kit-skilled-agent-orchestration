---
description: Create or update OpenCode skills through one unified command with explicit operation routing and mode support (:auto | :confirm)
argument-hint: "<skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL - READ FIRST**
>
> This command is the canonical entrypoint for skill command workflows.
> Do not split behavior across legacy command definitions.
>
> Mandatory execution order:
> 1. Run Phase 0 verification (`@write` or valid chained handoff)
> 2. Run unified setup (single consolidated prompt)
> 3. Verify required phase outputs are present
> 4. Route by mode (`:auto` or `:confirm`)
> 5. Route by operation (`full-create`, `full-update`, `reference-only`, `asset-only`)
> 6. Load and execute the selected unified YAML workflow

---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

Before reading any other section, execute Phase 0 and setup validation.
Do not infer missing command arguments from prior conversation context.

---

# 🚨 PHASE 0: @WRITE AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```text
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as @write OR under a valid chained parent handoff?
|
|- CASE A: Valid chained handoff detected (--chained)
|  |- Required parent fields present?
|  |  - skill_name
|  |  - operation
|  |  - execution_mode
|  |  - parent_write_verified=true
|  |  - type (required only for reference-only or asset-only)
|  |- IF all present:
|  |  - write_agent_verified = skipped-chained
|  |  - chained_handoff_valid = true
|  |  - phase_0_status = PASSED
|  |- IF missing required parent fields:
|     - chained_handoff_valid = false
|     - fall through to CASE B
|
|- CASE B: Standalone invocation
|  |- Verify @write indicators:
|  |  - Invoked with @write
|  |  - Template-first generation behavior available
|  |  - sk-doc quality validation behavior available
|  |- IF yes:
|  |  - write_agent_verified = true
|  |  - phase_0_status = PASSED
|  |- IF no/uncertain:
|     - HARD BLOCK and stop

HARD BLOCK MESSAGE:
"This command requires @write for template-first generation and sk-doc validation.
Restart with: @write /create:sk-skill <skill-name> [operation] [type]"
```

Phase outputs:
- `write_agent_verified`
- `chained_handoff_valid`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

This command uses one consolidated setup prompt. Do not split setup questions.
**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**
```text
SETUP EXECUTION LOGIC:

1) Parse invocation shape
   - /create:sk-skill <skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm]

2) Parse mode suffix
   - :auto detected    -> execution_mode = AUTONOMOUS (omit mode question)
   - :confirm detected -> execution_mode = INTERACTIVE (omit mode question)
   - no suffix         -> execution_mode = ASK

3) Parse positional tokens
   - token 1: skill_name (if present)
   - token 2: operation (if present)
   - token 3: type (if present)

4) Parse flags
   - --path <dir>
   - --chained

5) Chained setup bypass logic
   - If chained_handoff_valid=true and all required fields for selected operation exist:
     - Skip setup prompt
     - Use parent values
   - If chained_handoff_valid=false or required chained fields missing:
     - Fall back to normal setup prompt

6) Determine which setup questions are required
   - Ask operation only when missing
   - Ask type only when operation requires it and type is missing/invalid
   - Ask execution mode only when no suffix is present
   - Ask spec folder choice only for full-create and full-update
   - Ask memory loading only when existing spec is selected and memory files exist

7) Ask ONE consolidated setup prompt with only missing items

   Q0. Skill Name (if missing)
       - Required format: hyphen-case (lowercase, digits, hyphens)

   Q1. Operation (if missing)
       A) full-create (new skill end-to-end)
       B) full-update (update existing skill and resources)
       C) reference-only (create/update one reference document)
       D) asset-only (create/update one asset document)

   Q2. Type (required only for reference-only or asset-only)
       - For reference-only: workflow | patterns | debugging | tools | quick_ref
       - For asset-only: template | lookup | example | guide

   Q3. Spec Folder (required for full-create/full-update)
       A) Existing
       B) New (recommended)
       C) Update related
       D) Skip
       E) Phase folder

       Optional for reference-only/asset-only:
       A) Attach existing spec path for memory tracking
       B) Skip spec linkage

   Q4. Memory Context (if existing spec has memory files)
       A) Load latest memory
       B) Load up to 3 recent memories
       C) Skip

   Q5. Execution Mode (if no suffix)
       A) Interactive (:confirm)
       B) Autonomous (:auto)

8) Wait for user response and parse fields

9) Normalize setup outputs
   - skill_name
   - operation
   - type
   - skill_path (from --path or default .opencode/skill/)
   - execution_mode
   - spec_choice
   - spec_path
   - memory_choice

HARD STOPS:
- Do not infer missing operation or type from context
- Do not split setup across multiple prompts
- Do not continue with missing required fields for selected operation
```

Phase outputs:
- `skill_name`
- `operation`
- `type`
- `skill_path`
- `execution_mode`
- `spec_choice`
- `spec_path`
- `memory_choice`

---

# PHASE STATUS VERIFICATION (BLOCKING)

Verify all required values are set before YAML execution:

| Field | Required | Rule |
| --- | --- | --- |
| write_agent_verified | Yes | `true` or `skipped-chained` |
| skill_name | Yes | explicit, hyphen-case |
| operation | Yes | one of 4 operation values |
| type | Conditional | required for reference-only and asset-only |
| skill_path | Yes | default `.opencode/skill/` if omitted |
| execution_mode | Yes | `:auto` or `:confirm` |
| spec_choice | Conditional | required for full-create and full-update |
| spec_path | Conditional | required for spec choices A/B/C/E |

Proceed only when all required fields validate.

---

## 1. PURPOSE

Provide one canonical command entrypoint for skill lifecycle operations,
eliminating split logic across deprecated command definitions while preserving
strict @write + sk-doc + system-spec-kit behavior contracts.

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` using canonical argument shape.

**Outputs:**
- Command execution through unified mode workflow and operation branch.
- Deterministic completion summary with status and path.

**Status patterns:**
- Success: `STATUS=OK PATH=<skill-root-or-target-file>`
- Failure: `STATUS=FAIL ERROR="<reason>"`
- Cancelled (confirm mode): `STATUS=CANCELLED ACTION=cancelled`

## 3. USER INPUT

```text
$ARGUMENTS
```

Accepted operation values:
- `full-create`
- `full-update`
- `reference-only`
- `asset-only`

Accepted mode suffix values:
- `:auto`
- `:confirm`

Accepted type values:
- reference-only: `workflow`, `patterns`, `debugging`, `tools`, `quick_ref`
- asset-only: `template`, `lookup`, `example`, `guide`

## 4. WORKFLOW OVERVIEW

| Step | Name | Purpose | Output |
| --- | --- | --- | --- |
| 1 | Phase 0 Verification | Ensure @write or valid chained handoff | `write_agent_verified` |
| 2 | Unified Setup | Capture all required parameters once | normalized setup fields |
| 3 | Phase Validation | Enforce required-field contract | phase pass/fail |
| 4 | Mode Routing | Route to auto or confirm unified YAML | target YAML path |
| 5 | Operation Routing | Select operation branch | operation-specific execution |
| 6 | Validation + Completion | Enforce quality gates and produce status | `STATUS=OK|FAIL|CANCELLED` |

## 5. INSTRUCTIONS

### Step 1: Run Phase 0
- Execute @write/chained verification.
- Hard block on failure.

### Step 2: Run Unified Setup
- Ask one consolidated prompt for missing values.
- Normalize and store outputs.

### Step 3: Run Phase Verification
- Validate required fields by operation.
- Re-prompt missing values only.

### Step 4: Route by Mode
- `:auto` -> load `create_sk_skill_auto.yaml`.
- `:confirm` -> load `create_sk_skill_confirm.yaml`.

### Step 5: Route by Operation
- Route to one branch: full-create/full-update/reference-only/asset-only.

### Step 6: Execute YAML + Report Completion
- Enforce gate model and validation loop.
- Return deterministic completion status.

---

## 6. MODE ROUTING

Mode route targets:
- `:auto` -> `.opencode/command/create/assets/create_sk_skill_auto.yaml`
- `:confirm` -> `.opencode/command/create/assets/create_sk_skill_confirm.yaml`

Default mode if omitted: `:confirm`.

Behavior summary:
- `:auto`: no approval checkpoints, stops for hard failures.
- `:confirm`: checkpointed execution with review/modify/abort options.

---

## 7. ARGUMENT ROUTING

```text
$ARGUMENTS
   |
   |- Parse mode suffix (:auto | :confirm)
   |
   |- Parse positional args:
   |   - skill_name
   |   - operation
   |   - type
   |
   |- Parse flags:
   |   - --path
   |   - --chained
   |
   |- If operation missing -> setup prompt Q1
   |
   |- If operation in {reference-only, asset-only} and type missing -> setup prompt Q2
   |
   |- If operation in {full-create, full-update} -> enforce spec folder setup Q3
   |
   '- Route execution to selected mode YAML and operation branch
```

---

## 8. OPERATION ROUTING CONTRACT

| Operation | Purpose | Type Required | Skill Must Exist |
| --- | --- | --- | --- |
| `full-create` | New skill end-to-end | No | No (hard block if exists) |
| `full-update` | Update existing skill and resources | No | Yes |
| `reference-only` | Create/update one reference doc | Yes | Yes |
| `asset-only` | Create/update one asset doc | Yes | Yes |

Branch guarantees:
- `full-create`: initializes and populates skill structure.
- `full-update`: modifies existing skill docs/resources without full re-init.
- `reference-only`: targets `references/` plus routing sync updates.
- `asset-only`: targets `assets/` plus routing sync updates.

---

## 9. VALIDATION AND QUALITY GATES

Hard gates:
- H0: write verification / valid chained handoff
- H1: required setup fields captured
- H2: operation/type compatibility
- H3: existence semantics (create vs update/doc-only)
- H4: sk-doc validation + DQI threshold

Soft gates:
- S1: similar skill discovery before full-create
- S2: optional resource expansion recommendations

DQI policy:
- hard minimum: 75
- target guidance:
  - full-create/full-update: 90
  - reference-only/asset-only: 80

Validation pipeline references:
- `.opencode/skill/sk-doc/scripts/quick_validate.py`
- `.opencode/skill/sk-doc/scripts/validate_document.py`
- `.opencode/skill/sk-doc/scripts/extract_structure.py`
- `.opencode/skill/sk-doc/scripts/package_skill.py`

Section boundary enforcement:
- `WHEN TO USE` = activation/use-case logic only
- `SMART ROUTING` = resource/file loading guidance only

---

## 10. MEMORY SAVE AND INDEXING

When spec tracking is active and context save is required:

1) Save context using system-spec-kit script:
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`

2) Index immediately for retrieval:
- `memory_index_scan({ specFolder })` OR
- `memory_save({ filePath })`

Hard rule:
- Do not manually write memory files in `memory/`.

---

## 11. RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on active profile:
- Default profile -> `.opencode/agent`
- Codex profile -> `.codex/agents`
- Claude profile -> `.claude/agents`
- Gemini profile -> `.gemini/agents`

---

## 12. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing `skill_name` | Re-prompt Q0 |
| Invalid `operation` | Re-prompt Q1 with valid options |
| Missing or invalid `type` for doc-only operations | Re-prompt Q2 with operation-specific values |
| `full-create` on existing skill | Offer reroute to `full-update` |
| Update/doc-only on missing skill | Offer reroute to `full-create` or corrected skill name |
| Validation failure (DQI/structure) | Enter fix-and-revalidate loop |
| Invalid chained handoff | Fall back to normal setup flow |

Recovery loop pattern:
1) Stop
2) State exact failure
3) Return to last valid gate
4) Re-run checks
5) Resume

---

## 13. EXAMPLES

Full create:
```text
/create:sk-skill pdf-editor full-create :confirm
```

Full update:
```text
/create:sk-skill pdf-editor full-update :auto
```

Reference only:
```text
/create:sk-skill sk-doc reference-only workflow :confirm
```

Asset only:
```text
/create:sk-skill sk-doc asset-only template :auto
```

Chained example:
```text
/create:sk-skill sk-doc reference-only debugging --chained :auto
```

---

## 14. MIGRATION MAP

Canonical command strategy is active.

Deprecated invocation mapping:
- `/create:skill <skill-name> [:auto|:confirm]`
  -> `/create:sk-skill <skill-name> full-create [:auto|:confirm]`

- `/create:skill_reference <skill-name> <reference-type> [--chained] [:auto|:confirm]`
  -> `/create:sk-skill <skill-name> reference-only <reference-type> [--chained] [:auto|:confirm]`

- `/create:skill_asset <skill-name> <asset-type> [--chained] [:auto|:confirm]`
  -> `/create:sk-skill <skill-name> asset-only <asset-type> [--chained] [:auto|:confirm]`

Canonical workflow files:
- `.opencode/command/create/assets/create_sk_skill_auto.yaml`
- `.opencode/command/create/assets/create_sk_skill_confirm.yaml`

---

## 15. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/create:prompt` | Builds prompt artifacts and may reference skill creation patterns |
| `/memory:save` | Manual context save trigger in active spec folders |

---

## 16. COMPLETION REPORT TEMPLATE

```text
Unified Skill Command Complete

Skill: [skill_name]
Operation: [operation]
Type: [type or N/A]
Mode: [:auto|:confirm]
Target: [skill_root_or_file]

Validation:
- Hard gates: PASSED
- DQI: [score] ([band])

Context:
- Spec path: [spec_path or none]
- Memory saved: [yes/no]
- Memory indexed: [yes/no]

STATUS=OK PATH=[target]
```

---

## 17. VIOLATION SELF-DETECTION (BLOCKING)

You are in violation if you:
- skip Phase 0 verification
- split setup prompts into multiple interactions
- proceed with missing required operation/type fields
- bypass create-vs-update existence checks
- claim completion without validation gate pass

Violation recovery protocol:
```text
1. STOP immediately.
2. STATE: "Violation detected: [exact issue]."
3. RETURN to the failed gate.
4. COMPLETE required checks or inputs.
5. RESUME from next valid step only.
```

---

Reference context files:
- `.opencode/skill/sk-doc/assets/skill/skill_md_template.md`
- `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md`
- `.opencode/skill/sk-doc/assets/skill/skill_asset_template.md`
- `.opencode/skill/sk-doc/scripts/quick_validate.py`
- `.opencode/skill/sk-doc/scripts/validate_document.py`
- `.opencode/skill/sk-doc/scripts/extract_structure.py`
- `.opencode/skill/sk-doc/scripts/package_skill.py`

Always end user-facing execution with: "What would you like to do next?"
