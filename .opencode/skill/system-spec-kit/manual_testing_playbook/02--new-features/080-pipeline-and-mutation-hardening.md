---
title: "NEW-080 -- Pipeline and mutation hardening"
description: "This scenario validates Pipeline and mutation hardening for `NEW-080`. It focuses on Confirm mutation hardening bundle."
---

# NEW-080 -- Pipeline and mutation hardening

## 1. OVERVIEW

This scenario validates Pipeline and mutation hardening for `NEW-080`. It focuses on Confirm mutation hardening bundle.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-080` and confirm the expected signals without contradicting evidence.

- Objective: Confirm mutation hardening bundle
- Prompt: `Validate phase-017 pipeline and mutation hardening.`
- Expected signals: CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure
- Pass/fail: PASS if all mutation paths are atomic, error handling leaves no partial state, and cleanup is complete

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-080 | Pipeline and mutation hardening | Confirm mutation hardening bundle | `Validate phase-017 pipeline and mutation hardening.` | 1) execute CRUD/mutation paths 2) inspect cleanup/error handling 3) verify atomicity behavior | CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure | Mutation output + error handling trace + DB state verification after induced failure | PASS if all mutation paths are atomic, error handling leaves no partial state, and cleanup is complete | Inspect transaction wrappers on CRUD handlers; verify cleanup logic on error paths; check for orphaned records after failures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/11-pipeline-and-mutation-hardening.md](../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-080
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/080-pipeline-and-mutation-hardening.md`
