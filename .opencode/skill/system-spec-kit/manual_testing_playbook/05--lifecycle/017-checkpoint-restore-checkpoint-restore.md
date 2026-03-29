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
- Prompt: `Restore checkpoint with merge mode. Capture the evidence needed to prove Restored data + healthy state. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Restored data + healthy state
- Pass/fail: PASS if known record restored
- Additional focus: active checkpoint restore maintenance blocks mutation traffic with `E_RESTORE_IN_PROGRESS`, then clears after restore success or failure

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-017 | Checkpoint restore (checkpoint_restore) | Rollback restore drill | `Restore checkpoint with merge mode. Capture the evidence needed to prove Restored data + healthy state. Return a concise user-facing pass/fail verdict with the main reason.` | `checkpoint_restore(name,clearExisting:false)` -> `memory_health()` | Restored data + healthy state | Restore output + search proof | PASS if known record restored | Retry with clearExisting based on conflict |
| EX-017 | Checkpoint restore (checkpoint_restore) | Maintenance barrier blocks mutation traffic | `Start a checkpoint restore and, while the restore maintenance window is still active, attempt memory_save, memory_index_scan, and memory_bulk_delete. Capture the evidence that each mutation fails fast with E_RESTORE_IN_PROGRESS and return a concise user-facing pass/fail verdict with the main reason.` | `1) Session A: start checkpoint_restore(name,clearExisting:false) and hold it in the active restore window using the restore test harness or barrier hook` -> `2) Session B: memory_save(filePath)` -> `3) Session B: memory_index_scan(specFolder)` -> `4) Session B: memory_bulk_delete(tier:\"temporary\",confirm:true,specFolder)` -> `5) capture the error envelopes from all three mutation calls` | All three mutation calls fail fast with `E_RESTORE_IN_PROGRESS` while restore maintenance is active | Restore-in-progress evidence + three mutation error envelopes | PASS if `memory_save`, `memory_index_scan`, and `memory_bulk_delete` each return `E_RESTORE_IN_PROGRESS` before the restore exits | If any mutation proceeds, inspect `getRestoreBarrierStatus()` wiring in the mutation handlers and confirm the restore is still inside the maintenance window |
| EX-017 | Checkpoint restore (checkpoint_restore) | Maintenance barrier clears after restore exit | `Prove the checkpoint restore maintenance barrier clears after restore exit. Trigger a blocked mutation during restore, let the restore complete or fail, then retry the same mutation and capture the evidence that E_RESTORE_IN_PROGRESS no longer appears. Return a concise user-facing pass/fail verdict with the main reason.` | `1) Start checkpoint_restore(name,clearExisting:false) and hold it long enough to observe a blocked mutation` -> `2) Attempt memory_index_scan(specFolder) and capture E_RESTORE_IN_PROGRESS` -> `3) Allow checkpoint_restore to complete successfully or fail` -> `4) Retry memory_index_scan(specFolder) or memory_save(filePath)` -> `5) confirm the retry no longer returns E_RESTORE_IN_PROGRESS` | Mutation is blocked during restore, then unblocked after restore exit even when the restore fails | Before/after mutation responses + restore completion or failure output | PASS if the retry after restore exit no longer returns `E_RESTORE_IN_PROGRESS` | If the barrier remains latched, inspect the `restoreCheckpoint()` `finally` path that releases restore maintenance |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [05--lifecycle/03-checkpoint-restore-checkpointrestore.md](../../feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: EX-017
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--lifecycle/017-checkpoint-restore-checkpoint-restore.md`
