---
title: Manual Testing Playbook Snippet Template
description: Template for per-feature scenario files stored directly under manual_testing_playbook category directories.
---

# Manual Testing Playbook Snippet Template

Per-feature scenario files for split manual testing playbooks. Use this template for the one-file-per-feature contract described in the main playbook template.

---

## 1. OVERVIEW

Each feature file is the canonical home for full scenario execution detail. The root `MANUAL_TESTING_PLAYBOOK.md` stays readable by summarizing the feature and linking here, while the feature file carries the realistic user-testing context, orchestration process, 9-column test row, structured source references, and concise metadata. The file shape should intentionally mirror the Feature Catalog snippet pattern so operators can move between the catalog and the playbook without relearning the document structure.

**Required uses**:
- One file per feature ID
- One primary 9-column scenario row per file
- Frontmatter that mirrors the larger root docs (`title` + `description`)
- Root playbook summary plus per-feature file cross-link
- Realistic user request and orchestrator prompt
- Desired user-visible outcome and execution process notes

**Do not use this template for**:
- General reusable prose fragments
- Replacing root-level review/release-readiness or orchestration guidance
- Spreading one feature across multiple primary files without a clear reason

**Validator note**: The current validator checks markdown structure on the root playbook. It does not recurse into category folders or verify cross-file links.

---

## 2. TEMPLATE SCAFFOLD

Copy this into `manual_testing_playbook/{CATEGORY_DIR}/{NNN}-{feature-name}.md`:

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

### Authoring Notes

- Keep the feature file aligned with the matching root summary block and feature-catalog entry.
- Preserve stable feature IDs and file paths once published.
- When a feature needs extra checks, add them beneath the main row instead of creating a second primary scenario row by default.
- Put feature-specific review caveats, routing notes, and isolation constraints here instead of inventing separate sidecar docs.
