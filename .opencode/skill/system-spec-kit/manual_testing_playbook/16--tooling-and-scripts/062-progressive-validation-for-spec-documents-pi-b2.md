---
title: "062 -- Progressive validation for spec documents (PI-B2)"
description: "This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior."
---

# 062 -- Progressive validation for spec documents (PI-B2)

## 1. OVERVIEW

This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `062` and confirm the expected signals without contradicting evidence.

- Objective: Confirm level 1-4 behavior
- Prompt: `As a tooling validation operator, validate Progressive validation for spec documents (PI-B2) against the documented validation surface. Verify each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels
- Pass/fail: PASS if levels 1-4 produce progressively stricter validation and exit codes match severity

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm level 1-4 behavior against the documented validation surface. Verify each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. run level1..4
2. inspect fixes/diffs
3. verify exit/report behavior

### Expected

Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels

### Evidence

Validation output per level + exit codes + applied fix diffs

### Pass / Fail

- **Pass**: levels 1-4 produce progressively stricter validation and exit codes match severity
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify validation level definitions; check exit code mapping; inspect auto-fix application logic

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 062
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/062-progressive-validation-for-spec-documents-pi-b2.md`
