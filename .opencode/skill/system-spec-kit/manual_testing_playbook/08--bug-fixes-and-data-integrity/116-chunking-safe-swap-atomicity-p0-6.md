---
title: "116 -- Chunking safe swap atomicity (P0-6)"
description: "This scenario validates Chunking safe swap atomicity (P0-6) for `116`. It focuses on Verify re-chunking indexes new chunks before deleting old ones, finalization cleans staged replacements on failure, and old chunks survive if new indexing fails."
---

# 116 -- Chunking safe swap atomicity (P0-6)

## 1. OVERVIEW

This scenario validates Chunking safe swap atomicity (P0-6) for `116`. It focuses on Verify re-chunking indexes new chunks before deleting old ones, finalization cleans staged replacements on failure, and old chunks survive if new indexing fails.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `116` and confirm the expected signals without contradicting evidence.

- Objective: Verify re-chunking stages new chunks before deleting old ones, finalization cleans staged replacements on failure, and parent BM25 changes only after a viable chunk set exists
- Prompt: `"Re-chunk a parent memory and verify safe-swap finalization stays atomic." Capture the evidence needed to prove New chunks index in staged state before old deletion; finalization moves parent attach + old-child unlink/delete into one transaction; failed finalization cleans the staged chunk tree; all-chunks-failed rollback preserves old children and the old parent BM25 state. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: New chunks indexed in staged state before old deletion; old children keep their original `parent_id` if finalize fails; staged replacement chunks are cleaned on finalize failure; all-chunks-failed rollback preserves old parent BM25 state; handler returns error status on failure
- Pass/fail: PASS if staged replacements never replace old children until finalize commits, finalize failure removes staged chunks, and BM25 stays on the old parent state when no new chunk set succeeds

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 116 | Chunking safe swap atomicity (P0-6) | Verify re-chunking stages replacements before delete, cleans staged replacements on finalize failure, and preserves old state on rollback | `"Re-chunk a parent memory and verify safe-swap finalization stays atomic." Capture the evidence needed to prove New chunks index in staged state before old deletion; finalization moves parent attach + old-child unlink/delete into one transaction; failed finalization cleans the staged chunk tree; all-chunks-failed rollback preserves old children and the old parent BM25 state. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Create a parent memory with child chunks via `memory_save()`. 1) Trigger re-chunk on the parent 2) Verify new chunks are staged with `parent_id IS NULL` before finalize 3) Verify finalize links new chunks, updates the parent, nulls old-child `parent_id`, and deletes old children in one transaction 4) Inject finalize failure and verify staged replacement chunks are deleted while old children keep the original parent link 5) Simulate all-chunks-failed indexing and verify the old parent BM25 document remains in place | New chunks indexed in staged state before old deletion; old children keep original linkage on finalize failure; staged replacement chunks are cleaned on finalize failure; all-chunks-failed rollback preserves old parent BM25 state; handler returns error status on failure | Re-chunk output + staged chunk evidence + old-child linkage snapshot + staged chunk cleanup evidence + BM25 parent verification after forced failure | PASS if new chunks are staged before deletion, finalize failure leaves no staged residue, old children survive both finalize failure and all-chunks-failed rollback, and parent BM25 is unchanged until finalize completes | Inspect chunking orchestrator finalize transaction; verify `parent_id` unlink happens inside the transaction; check rollback/cleanup path for staged chunks; verify parent BM25 mutation happens after chunk success/finalize only |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md](../../feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 116
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--bug-fixes-and-data-integrity/116-chunking-safe-swap-atomicity-p0-6.md`
