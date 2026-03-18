---
title: "NEW-085 -- Transaction wrappers on mutation handlers"
description: "This scenario validates Transaction wrappers on mutation handlers for `NEW-085`. It focuses on Confirm atomic wrapper behavior."
---

# NEW-085 -- Transaction wrappers on mutation handlers

## 1. OVERVIEW

This scenario validates Transaction wrappers on mutation handlers for `NEW-085`. It focuses on Confirm atomic wrapper behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-085` and confirm the expected signals without contradicting evidence.

- Objective: Confirm atomic wrapper behavior
- Prompt: `Validate mutation transaction wrappers.`
- Expected signals: Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist
- Pass/fail: PASS if injected faults trigger complete rollback and DB state is fully consistent after recovery

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-085 | Transaction wrappers on mutation handlers | Confirm atomic wrapper behavior | `Validate mutation transaction wrappers.` | 1) inject mid-step fault 2) verify rollback 3) confirm consistent state | Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist | Fault injection output + rollback trace + post-rollback DB state verification | PASS if injected faults trigger complete rollback and DB state is fully consistent after recovery | Inspect transaction wrapper implementation; verify rollback cleans up all partial writes; check for nested transaction handling |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [02--mutation/06-transaction-wrappers-on-mutation-handlers.md](../../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-085
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/085-transaction-wrappers-on-mutation-handlers.md`
