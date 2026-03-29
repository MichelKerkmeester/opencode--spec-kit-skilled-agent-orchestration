---
title: "080 -- Pipeline and mutation hardening"
description: "This scenario validates Pipeline and mutation hardening for `080`. It focuses on Confirm mutation hardening bundle, including chunked-save finalize rollback safety."
---

# 080 -- Pipeline and mutation hardening

## 1. OVERVIEW

This scenario validates Pipeline and mutation hardening for `080`. It focuses on Confirm mutation hardening bundle, including chunked-save finalize rollback safety.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `080` and confirm the expected signals without contradicting evidence.

- Objective: Confirm mutation hardening bundle including chunked-save finalization rollback safety
- Prompt: `Validate pipeline and mutation hardening. Capture the evidence needed to prove CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save PE finalize runs in one transaction; safe-swap old-child unlink/delete is rollback-safe; parent BM25 stays unchanged when all chunks fail. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save finalize failures remove staged chunk trees; safe-swap rollback keeps old children linked; parent BM25 is preserved on all-chunks-failed rollback
- Pass/fail: PASS if all mutation paths are atomic, error handling leaves no partial state, and chunked-save rollback paths preserve old children/BM25 while cleaning staged replacements
- Additional focus: checkpoint restore maintenance blocks `memory_save`, `memory_index_scan`, and `memory_bulk_delete` with `E_RESTORE_IN_PROGRESS` until the restore lifecycle exits

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 080 | Pipeline and mutation hardening | Confirm mutation hardening bundle | `Validate pipeline and mutation hardening. Capture the evidence needed to prove CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save PE finalize runs in one transaction; safe-swap old-child unlink/delete is rollback-safe; parent BM25 stays unchanged when all chunks fail. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Execute CRUD/mutation paths 2) Force a chunked PE finalize failure and verify compensating cleanup removes the staged chunk tree 3) Force safe-swap finalize failure and verify old children keep their original parent link 4) Force all chunk inserts to fail and verify the parent BM25 document remains unchanged 5) Inspect DB/error traces for orphaned rows or partial supersede state | CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save finalize failures remove staged chunk trees; safe-swap rollback keeps old children linked; parent BM25 is preserved on all-chunks-failed rollback | Mutation output + finalize failure trace + chunk-tree cleanup evidence + old-child linkage snapshot + BM25 parent verification after forced rollback | PASS if all mutation paths are atomic, error handling leaves no partial state, and the chunked-save rollback paths preserve old state while cleaning staged replacements | Inspect transaction wrappers on CRUD handlers plus chunked finalize paths; verify cleanup logic on error paths; check for orphaned chunk rows, unsuperseded predecessors, or parent BM25 drift after failures |
| 080 | Pipeline and mutation hardening | Checkpoint restore barrier blocks mutation traffic | `Validate the T300 checkpoint restore barrier by holding checkpoint_restore open and proving memory_save, memory_index_scan, and memory_bulk_delete fail fast with E_RESTORE_IN_PROGRESS. Capture the evidence and return a concise user-facing pass/fail verdict with the main reason.` | `1) Session A: start checkpoint_restore(name,clearExisting:false) and hold it in the active restore window using the restore test harness or barrier hook` -> `2) Session B: memory_save(filePath)` -> `3) Session B: memory_index_scan(specFolder)` -> `4) Session B: memory_bulk_delete(tier:\"temporary\",confirm:true,specFolder)` -> `5) capture the barrier errors from all three mutation calls` | All guarded mutation paths return `E_RESTORE_IN_PROGRESS` while restore maintenance is active | Restore-in-progress evidence + three mutation error envelopes | PASS if each guarded mutation path fails fast with `E_RESTORE_IN_PROGRESS` before restore exit | If any call slips through, inspect restore barrier reads in `memory-save`, `memory-index`, and `memory-bulk-delete` handlers |
| 080 | Pipeline and mutation hardening | Checkpoint restore barrier clears after restore exit | `Validate that the checkpoint restore barrier clears after restore success or failure. Capture one blocked mutation during restore, let the restore exit, retry the mutation, and prove E_RESTORE_IN_PROGRESS no longer appears. Return a concise user-facing pass/fail verdict with the main reason.` | `1) Start checkpoint_restore(name,clearExisting:false) and keep it active long enough to observe a blocked mutation` -> `2) Attempt memory_save(filePath) or memory_index_scan(specFolder) and capture E_RESTORE_IN_PROGRESS` -> `3) Let checkpoint_restore complete successfully or fail` -> `4) Retry the same mutation call` -> `5) confirm the retry no longer returns E_RESTORE_IN_PROGRESS` | Mutation is blocked only during restore maintenance and becomes available again after restore exit | Before/after mutation responses + restore completion or failure output | PASS if the post-restore retry no longer returns `E_RESTORE_IN_PROGRESS` | If the retry still reports restore-in-progress, inspect the `restoreCheckpoint()` barrier release in the storage layer `finally` path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/11-pipeline-and-mutation-hardening.md](../../feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 080
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/080-pipeline-and-mutation-hardening.md`
