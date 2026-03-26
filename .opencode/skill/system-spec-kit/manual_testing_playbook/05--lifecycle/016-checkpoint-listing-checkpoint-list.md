---
title: "EX-016 -- Checkpoint listing (checkpoint_list)"
description: "This scenario validates Checkpoint listing (checkpoint_list) for `EX-016`. It focuses on Recovery asset discovery."
---

# EX-016 -- Checkpoint listing (checkpoint_list)

## 1. OVERVIEW

This scenario validates Checkpoint listing (checkpoint_list) for `EX-016`. It focuses on Recovery asset discovery.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-016` and confirm the expected signals without contradicting evidence.

- Objective: Recovery asset discovery
- Prompt: `List checkpoints newest first. Capture the evidence needed to prove Available restore points displayed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Available restore points displayed
- Pass/fail: PASS if checkpoints returned

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-016 | Checkpoint listing (checkpoint_list) | Recovery asset discovery | `List checkpoints newest first. Capture the evidence needed to prove Available restore points displayed. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_list(specFolder,limit)` | Available restore points displayed | List output | PASS if checkpoints returned | Remove spec filter if empty |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/02-checkpoint-listing-checkpointlist.md](../../feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-016
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/016-checkpoint-listing-checkpoint-list.md`
