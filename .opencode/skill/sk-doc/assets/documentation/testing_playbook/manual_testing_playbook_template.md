---
title: Manual Testing Playbook Creation - Templates and Standards
description: Templates for creating feature-catalog-style manual testing playbooks with an integrated root playbook, root-level per-feature files, current frontmatter conventions, and orchestration guidance.
---

# Manual Testing Playbook Creation - Templates and Standards

Templates for creating manual testing playbooks with deterministic scenarios, structured evidence collection, integrated root-level review/orchestration guidance, root-level per-feature files, and current frontmatter conventions.

---

## 1. OVERVIEW

**Purpose**: Manual testing playbooks provide operator-facing validation matrices for skills. They define deterministic scenarios with realistic user requests, orchestrator execution guidance, exact prompts, command sequences, expected signals, and pass/fail criteria so any operator can execute and grade tests consistently.

**Key Characteristics**:
- **Deterministic**: Every scenario has an exact prompt and exact command sequence.
- **9-column contract**: Standardized table covering Feature ID through Failure Triage.
- **Feature-catalog rooted**: The root playbook acts as the directory, review surface, and cross-reference index.
- **Per-feature files**: Each scenario gets its own file in a numbered category folder at the playbook root.
- **Orchestrator-led**: Scenarios should mimic real user testing, including coordinator prompts, delegation decisions, and user-visible outcomes.
- **Integrated root guidance**: Review protocol and orchestration rules live inside the root playbook, not in separate canonical sidecar docs.
- **Feature-catalog shaped files**: Per-feature playbook files should mirror feature-catalog snippet structure by leading with prose, then current reality, then structured source references.
- **Evidence-driven**: Every scenario requires captured evidence with explicit verdicts.
- **Validator-limited**: The current validator checks the root playbook for markdown structure, but it does not recurse into category folders or verify cross-file references yet.

**Location Convention**: `{SKILL_PATH}/manual_testing_playbook/`

Canonical layout:

```text
manual_testing_playbook/
├── MANUAL_TESTING_PLAYBOOK.md          # Root directory page, review rules, and orchestration guidance
├── 01--category-name/                  # Required per-feature files for category 1
│   ├── 001-feature-name.md
│   └── 002-feature-name.md
└── 02--another-category/               # Required per-feature files for category 2
    └── 001-feature-name.md
```

**Existing Examples**:
- `.opencode/skill/system-spec-kit/manual_testing_playbook/` (integrated root playbook + 195 per-feature files)
- `.opencode/skill/mcp-coco-index/manual_testing_playbook/` (older package shape; migrate toward integrated root guidance)

---

## 2. WHEN TO CREATE PLAYBOOKS

**Create a playbook when**:
- A skill has 5+ distinct features that need manual validation.
- Automated tests do not cover integration-level or end-to-end behavior.
- Multiple operators (human or AI) will execute the same test suite.
- Release readiness requires structured evidence collection.
- Realistic orchestration behavior matters, including sub-agent or alternate-CLI usage.

**Keep simple when**:
- Skill has fewer than 5 features.
- All behavior is covered by automated tests.
- A single operator will run tests once.

Decision tree:

```text
Skill has 5+ manually testable features?
  YES -> Does it need structured evidence for release?
    YES -> Create root playbook + root-level per-feature files
    NO  -> Create lightweight checklist in spec folder
  NO -> Document test steps inline in spec folder tasks.md
```

---

## 3. CATEGORY AND ID DESIGN

Each category groups related features under a short prefix.

| Category Purpose | Example Prefix | Example IDs |
|---|---|---|
| Existing features | `EX` | EX-001, EX-002 |
| New features | `NEW` | NEW-001, NEW-002 |
| Phase features | `PHASE` | PHASE-001, PHASE-002 |
| Memory/spec-kit workflows | `M` | M-001, M-002 |

ID format:

```text
{PREFIX}-{NNN}
```

- `PREFIX`: 1-5 uppercase letters identifying the category.
- `NNN`: zero-padded 3-digit sequence number starting at 001.
- IDs are unique across the entire playbook.
- Gaps are allowed; do not renumber published IDs.

Per-feature file path:

```text
manual_testing_playbook/{CATEGORY_DIR}/{NNN}-{feature-name}.md
```

Per-feature file shape:
1. `## 1. OVERVIEW`
2. `## 2. CURRENT REALITY`
3. `## 3. TEST EXECUTION`
4. `## 4. SOURCE FILES`
5. `## 5. SOURCE METADATA`

---

## 4. THE 9-COLUMN SCENARIO CONTRACT

Every scenario row uses exactly 9 columns:

| # | Column | Content |
|---|---|---|
| 1 | Feature ID | `PREFIX-NNN` |
| 2 | Feature Name | Short human-readable name |
| 3 | Scenario Name / Objective | What the scenario proves |
| 4 | Exact Prompt | Copy-paste-ready natural-language prompt |
| 5 | Exact Command Sequence | Deterministic steps with `->` separators |
| 6 | Expected Signals | Observable outputs per step |
| 7 | Evidence | What to capture as proof |
| 8 | Pass/Fail Criteria | Binary grading rule |
| 9 | Failure Triage | Ordered debugging checks |

Copy-paste header:

```markdown
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
```

---

## 5. ROOT PLAYBOOK SCAFFOLD

Copy this scaffold to create `{SKILL_PATH}/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`:

```markdown
---
title: "{SKILL_NAME}: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the {SKILL_NAME} skill."
---

# {SKILL_NAME}: Manual Testing Playbook

This document combines the full manual-validation contract for the `{SKILL_SLUG}` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `{SKILL_SLUG}` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `MANUAL_TESTING_PLAYBOOK.md`
- `{CAT1_DIR}/`
- `{CAT2_DIR}/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. {CAT1_HEADING} (`{CAT1}-001..{CAT1}-NNN`)](#7--{CAT1_ANCHOR})
- [8. {CAT2_HEADING} (`{CAT2}-001..{CAT2}-NNN`)](#8--{CAT2_ANCHOR})
- [9. AUTOMATED TEST CROSS-REFERENCE](#9--automated-test-cross-reference)
- [10. FEATURE CATALOG CROSS-REFERENCE INDEX](#10--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides {SCENARIO_COUNT} deterministic scenarios across {CATEGORY_COUNT} categories validating the `{SKILL_SLUG}` skill surface. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note ({PLAYBOOK_DATE}): {COVERAGE_NOTE}.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS
1. Working directory is project root.
2. {PRECONDITION_2}
3. {PRECONDITION_3}
4. {PRECONDITION_4}
5. Destructive scenario {DESTRUCTIVE_IDS} MUST verify recovery is possible.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS
- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets
- Final user-facing response or outcome summary
- Artifact path or output reference
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION
- CLI commands shown as `{CLI_TOOL} <subcommand> [args]`.
- MCP tool calls shown as `{MCP_TOOL_PREFIX}({ key: value })`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `MANUAL_TESTING_PLAYBOOK.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, or critical check failed

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenarios in a dedicated sandbox-only wave.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Orchestrator prompt
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. {CAT1_HEADING} (`{CAT1}-001..{CAT1}-NNN`)

### {CAT1}-001 | {FEATURE_NAME}

#### Description
Verify {OBJECTIVE}.

#### Current Reality
Prompt: `{EXACT_PROMPT}`

{CURRENT_REALITY_SUMMARY}

Desired user-visible outcome: {DESIRED_USER_OUTCOME}

#### Test Execution
> **Feature File:** [{CAT1}-001]({CAT1_DIR}/001-{FEATURE_SLUG}.md)
> **Catalog:** [{CATALOG_PATH_1}](../feature_catalog/{CATALOG_PATH_1})

---

## 8. {CAT2_HEADING} (`{CAT2}-001..{CAT2}-NNN`)

### {CAT2}-001 | {FEATURE_NAME_2}

#### Description
Verify {OBJECTIVE_2}.

#### Current Reality
Prompt: `{EXACT_PROMPT_2}`

{CURRENT_REALITY_SUMMARY_2}

Desired user-visible outcome: {DESIRED_USER_OUTCOME_2}

#### Test Execution
> **Feature File:** [{CAT2}-001]({CAT2_DIR}/001-{FEATURE_SLUG_2}.md)
> **Catalog:** [{CATALOG_PATH_2}](../feature_catalog/{CATALOG_PATH_2})

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `{TEST_FILE}` | {TEST_COVERAGE} | {OVERLAP_IDS} |

---

## 10. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| {CAT1}-001 | {FEATURE_NAME} | {CAT1_HEADING} | [{CAT1}-001]({CAT1_DIR}/001-{FEATURE_SLUG}.md) |
| {CAT2}-001 | {FEATURE_NAME_2} | {CAT2_HEADING} | [{CAT2}-001]({CAT2_DIR}/001-{FEATURE_SLUG_2}.md) |
```

---

## 6. PER-FEATURE FILE SCAFFOLD

Copy this scaffold to create `manual_testing_playbook/{CATEGORY_DIR}/{NNN}-{feature-name}.md`:

```markdown
---
title: "{FEATURE_ID} -- {FEATURE_NAME}"
description: "This scenario validates {FEATURE_NAME} for `{FEATURE_ID}`. It focuses on {OBJECTIVE}."
---

# {FEATURE_ID} -- {FEATURE_NAME}

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `{FEATURE_ID}`.

---

## 1. OVERVIEW

This scenario validates {FEATURE_NAME} for `{FEATURE_ID}`. It focuses on {OBJECTIVE}.

### Why This Matters

{WHY_THIS_MATTERS}

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `{FEATURE_ID}` and confirm the expected signals without contradictory evidence.

- Objective: {OBJECTIVE}
- Real user request: `{REAL_USER_REQUEST}`
- Orchestrator prompt: `{EXACT_PROMPT}`
- Expected process: {EXPECTED_PROCESS}
- Expected signals: {EXPECTED_SIGNALS}
- Desired user-visible outcome: {DESIRED_USER_OUTCOME}
- Pass/fail: PASS if {PASS_CONDITION}; FAIL if {FAIL_CONDITION}

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local, delegate to sub-agents, or invoke another CLI/runtime.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| {FEATURE_ID} | {FEATURE_NAME} | Verify {OBJECTIVE} | `{EXACT_PROMPT}` | 1. `{COMMAND_1}` -> 2. `{COMMAND_2}` | Step 1: {SIGNAL_1}; Step 2: {SIGNAL_2} | {EVIDENCE_DESCRIPTION} | PASS if {PASS_CONDITION}; FAIL if {FAIL_CONDITION} | {TRIAGE_STEPS} |

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../feature_catalog/{CATALOG_PATH}` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `{IMPLEMENTATION_FILE}` | Primary implementation anchor |
| `{TEST_FILE}` | Regression or validation anchor |

---

## 5. SOURCE METADATA

- Group: {CATEGORY_NAME}
- Playbook ID: {FEATURE_ID}
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `{CATEGORY_DIR}/{NNN}-{feature-name}.md`
```

Validator note: the current validator does not recurse into the numbered category folders, so per-feature file completeness must be checked manually until tooling catches up.

---

## 7. INTEGRATED REVIEW BLOCK

If you need to document the review logic separately inside the template, embed it into the root playbook rather than creating a second canonical file.

Use the root-playbook section title:

```markdown
## 5. REVIEW PROTOCOL AND RELEASE READINESS
```

Keep:
- Inputs required
- Scenario acceptance rules
- Feature verdict rules
- Release-readiness rule
- Root-vs-feature rule

---

## 8. INTEGRATED ORCHESTRATION BLOCK

If you need to document orchestration planning separately inside the template, embed it into the root playbook rather than creating a second canonical file.

Use the root-playbook section title:

```markdown
## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING
```

Keep:
- Purpose
- Operational rules
- What belongs in per-feature files

---

## 9. PLAYBOOK CHECKLIST

Before publishing a playbook, verify:

```markdown
Structure:
- [ ] Canonical playbook package exists in `manual_testing_playbook/`
- [ ] Root-level category directories exist and use Feature Catalog-style names
- [ ] Main playbook has frontmatter, H1 intro, and TOC
- [ ] Main playbook has Global Preconditions, Evidence Requirements, and Deterministic Command Notation
- [ ] Main playbook has integrated review and release-readiness guidance
- [ ] Main playbook has integrated orchestration and wave-planning guidance
- [ ] Main playbook has Automated Test Cross-Reference and Feature Catalog Cross-Reference Index
- [ ] Every feature listed in the root playbook links to exactly one per-feature file
- [ ] Every per-feature file includes frontmatter with `title` and `description`

Content:
- [ ] Every root summary block has Description, Current Reality, and Test Execution
- [ ] All per-feature scenario tables use the 9-column format
- [ ] Every Feature ID is unique across the playbook
- [ ] Every per-feature file has an Exact Prompt
- [ ] Every Expected Signals entry references step numbers
- [ ] Every Failure Triage has 2+ ordered debugging steps
- [ ] Destructive scenarios are identified in the root review guidance

Validation:
- [ ] Count of IDs in the root cross-reference index matches the count of per-feature files
- [ ] All per-feature file links resolve locally
- [ ] Validator limitations are documented honestly
```

---

## 10. RELATED RESOURCES

- [manual_testing_playbook_snippet_template.md](./manual_testing_playbook_snippet_template.md) - Per-feature file template
- [template_rules.json](../../template_rules.json) - Machine-readable validation rules
- [core_standards.md](../../../references/global/core_standards.md) - Document formatting standards
- [sk-doc SKILL.md](../../../SKILL.md) - Mode 5: Playbook Creation
