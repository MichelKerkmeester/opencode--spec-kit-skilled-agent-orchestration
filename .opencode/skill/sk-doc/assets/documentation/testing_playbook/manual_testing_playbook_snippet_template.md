---
title: Manual Testing Playbook Snippet Template
description: Template for per-feature scenario files stored directly under manual_testing_playbook category directories.
---

# Manual Testing Playbook Snippet Template

Per-feature scenario files for split manual testing playbooks. Use this template for the one-file-per-feature contract described in the main playbook template.

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

---

## 1. OVERVIEW

Each feature file is the canonical home for full scenario execution detail. The root `manual_testing_playbook.md` stays readable by summarizing the feature and linking here, while the feature file carries the realistic user-testing context, orchestration process, 9-column test row, structured source references, and concise metadata. The file shape should intentionally mirror the Feature Catalog snippet pattern so operators can move between the catalog and the playbook without relearning the document structure.

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

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `{FEATURE_ID}` and confirm the expected signals without contradictory evidence.

- Objective: {OBJECTIVE}
- Real user request: `{REAL_USER_REQUEST}`
- Prompt: `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.`
- Expected execution process: {EXPECTED_PROCESS}
- Expected signals: {EXPECTED_SIGNALS}
- Desired user-visible outcome: {DESIRED_USER_OUTCOME}
- Pass/fail: PASS if {PASS_CONDITION}; FAIL if {FAIL_CONDITION}

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return {OUTPUT_FORMAT}.`

### Commands

1. `{COMMAND_1}`
2. `{COMMAND_2}`

### Expected

{EXPECTED_SIGNALS}

### Evidence

{EVIDENCE_DESCRIPTION}

### Pass / Fail

- **Pass**: {PASS_CONDITION}
- **Fail**: {FAIL_CONDITION}

### Failure Triage

{TRIAGE_STEPS}

### Optional Supplemental Checks

Use this subsection only when the feature needs a tightly scoped follow-up variant, compatibility check, or artifact note.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
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
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `{CATEGORY_DIR}/{NNN}-{feature-name}.md`
```

### Authoring Notes

- Keep the feature file aligned with the matching root summary block and feature-catalog entry.
- Preserve stable feature IDs and file paths once published.
- When a feature needs extra checks, add them beneath the main row instead of creating a second primary scenario row by default.
- Put feature-specific review caveats, routing notes, and isolation constraints here instead of inventing separate sidecar docs.
