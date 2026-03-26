---
title: "062 -- Progressive validation for spec documents (PI-B2)"
description: "This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior."
---

# 062 -- Progressive validation for spec documents (PI-B2)

## 1. OVERVIEW

This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `062` and confirm the expected signals without contradicting evidence.

- Objective: Confirm level 1-4 behavior
- Prompt: `Run progressive validation (PI-B2). Capture the evidence needed to prove Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels
- Pass/fail: PASS if levels 1-4 produce progressively stricter validation and exit codes match severity

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 062 | Progressive validation for spec documents (PI-B2) | Confirm level 1-4 behavior | `Run progressive validation (PI-B2). Capture the evidence needed to prove Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run level1..4 2) inspect fixes/diffs 3) verify exit/report behavior | Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels | Validation output per level + exit codes + applied fix diffs | PASS if levels 1-4 produce progressively stricter validation and exit codes match severity | Verify validation level definitions; check exit code mapping; inspect auto-fix application logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 062
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/062-progressive-validation-for-spec-documents-pi-b2.md`
