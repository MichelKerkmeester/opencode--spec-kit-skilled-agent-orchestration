---
title: "EX-007 -- Memory metadata update (memory_update)"
description: "This scenario validates Memory metadata update (memory_update) for `EX-007`. It focuses on Metadata + re-embed update."
---

# EX-007 -- Memory metadata update (memory_update)

## 1. OVERVIEW

This scenario validates Memory metadata update (memory_update) for `EX-007`. It focuses on Metadata + re-embed update.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-007` and confirm the expected signals without contradicting evidence.

- Objective: Metadata + re-embed update
- Prompt: `Update memory title and triggers. Capture the evidence needed to prove Updated metadata reflected in retrieval. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Updated metadata reflected in retrieval
- Pass/fail: PASS if updated title retrievable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-007 | Memory metadata update (memory_update) | Metadata + re-embed update | `Update memory title and triggers. Capture the evidence needed to prove Updated metadata reflected in retrieval. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_update(id,title,triggers)` -> `memory_search(new title)` | Updated metadata reflected in retrieval | Update output + search | PASS if updated title retrievable | Retry with allowPartialUpdate if embedding fails |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/02-memory-metadata-update-memoryupdate.md](../../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md)

---

## 5. SOURCE METADATA

- Group: Mutation
- Playbook ID: EX-007
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--mutation/007-memory-metadata-update-memory-update.md`
