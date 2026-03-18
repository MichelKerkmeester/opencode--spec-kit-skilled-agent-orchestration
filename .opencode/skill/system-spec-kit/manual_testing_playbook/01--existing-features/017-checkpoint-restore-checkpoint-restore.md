---
title: "EX-017 -- Checkpoint restore (checkpoint_restore)"
description: "This scenario validates Checkpoint restore (checkpoint_restore) for `EX-017`. It focuses on Rollback restore drill."
---

# EX-017 -- Checkpoint restore (checkpoint_restore)

## 1. OVERVIEW

This scenario validates Checkpoint restore (checkpoint_restore) for `EX-017`. It focuses on Rollback restore drill.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-017` and confirm the expected signals without contradicting evidence.

- Objective: Rollback restore drill
- Prompt: `Restore checkpoint with merge mode`
- Expected signals: Restored data + healthy state
- Pass/fail: PASS if known record restored

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-017 | Checkpoint restore (checkpoint_restore) | Rollback restore drill | `Restore checkpoint with merge mode` | `checkpoint_restore(name,clearExisting:false)` -> `memory_health()` | Restored data + healthy state | Restore output + search proof | PASS if known record restored | Retry with clearExisting based on conflict |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/03-checkpoint-restore-checkpointrestore.md](../../feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md)

---

## 5. SOURCE METADATA

- Group: Existing Features
- Playbook ID: EX-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--existing-features/017-checkpoint-restore-checkpoint-restore.md`
