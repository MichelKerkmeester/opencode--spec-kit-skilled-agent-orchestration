---
title: "065 -- Database and schema safety"
description: "This scenario validates Database and schema safety for `065`. It focuses on Confirm Sprint 8 DB safety bundle."
---

# 065 -- Database and schema safety

## 1. OVERVIEW

This scenario validates Database and schema safety for `065`. It focuses on Confirm Sprint 8 DB safety bundle.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `065` and confirm the expected signals without contradicting evidence.

- Objective: Confirm Sprint 8 DB safety bundle
- Prompt: `Validate database and schema safety bundle. Capture the evidence needed to prove Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure
- Pass/fail: PASS if all mutation paths complete atomically with no partial corruption and schema constraints hold

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 065 | Database and schema safety | Confirm Sprint 8 DB safety bundle | `Validate database and schema safety bundle. Capture the evidence needed to prove Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run affected mutation paths 2) inspect SQL outcomes 3) confirm no partial corruption | Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure | Mutation output + SQL inspection results + schema constraint verification | PASS if all mutation paths complete atomically with no partial corruption and schema constraints hold | Inspect transaction wrappers; verify schema migration state; check for incomplete writes in DB |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md](../../feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 065
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/065-database-and-schema-safety.md`
