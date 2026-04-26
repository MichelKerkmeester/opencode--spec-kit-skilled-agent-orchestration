---
title: "116 -- Chunking safe swap atomicity (P0-6)"
description: "This scenario validates Chunking safe swap atomicity (P0-6) for `116`. It focuses on Verify re-chunking indexes new chunks before deleting old ones, finalization cleans staged replacements on failure, and old chunks survive if new indexing fails."
audited_post_018: true
---

# 116 -- Chunking safe swap atomicity (P0-6)

## 1. OVERVIEW

This scenario validates Chunking safe swap atomicity (P0-6) for `116`. It focuses on Verify re-chunking indexes new chunks before deleting old ones, finalization cleans staged replacements on failure, and old chunks survive if new indexing fails.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `116` and confirm the expected signals without contradicting evidence.

- Objective: Verify re-chunking stages new chunks before deleting old ones, finalization cleans staged replacements on failure, and parent BM25 changes only after a viable chunk set exists
- Prompt: `As a data-integrity validation operator, validate Chunking safe swap atomicity (P0-6) against memory_save(). Verify re-chunking stages new chunks before deleting old ones, finalization cleans staged replacements on failure, and parent BM25 changes only after a viable chunk set exists. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: New chunks indexed in staged state before old deletion; old children keep their original `parent_id` if finalize fails; staged replacement chunks are cleaned on finalize failure; all-chunks-failed rollback preserves old parent BM25 state; handler returns error status on failure
- Pass/fail: PASS if staged replacements never replace old children until finalize commits, finalize failure removes staged chunks, and BM25 stays on the old parent state when no new chunk set succeeds

---

## 3. TEST EXECUTION

### Prompt

```
As a data-integrity validation operator, verify re-chunking stages replacements before delete, cleans staged replacements on finalize failure, and preserves old state on rollback against memory_save(). Verify new chunks indexed in staged state before old deletion; old children keep original linkage on finalize failure; staged replacement chunks are cleaned on finalize failure; all-chunks-failed rollback preserves old parent BM25 state; handler returns error status on failure. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. **Precondition:** Create a parent memory with child chunks via `memory_save()`.
2. Trigger re-chunk on the parent
3. Verify new chunks are staged with `parent_id IS NULL` before finalize
4. Verify finalize links new chunks, updates the parent, nulls old-child `parent_id`, and deletes old children in one transaction
5. Inject finalize failure and verify staged replacement chunks are deleted while old children keep the original parent link
6. Simulate all-chunks-failed indexing and verify the old parent BM25 document remains in place

### Expected

New chunks indexed in staged state before old deletion; old children keep original linkage on finalize failure; staged replacement chunks are cleaned on finalize failure; all-chunks-failed rollback preserves old parent BM25 state; handler returns error status on failure

### Evidence

Re-chunk output + staged chunk evidence + old-child linkage snapshot + staged chunk cleanup evidence + BM25 parent verification after forced failure

### Pass / Fail

- **Pass**: new chunks are staged before deletion, finalize failure leaves no staged residue, old children survive both finalize failure and all-chunks-failed rollback, and parent BM25 is unchanged until finalize completes
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect chunking orchestrator finalize transaction; verify `parent_id` unlink happens inside the transaction; check rollback/cleanup path for staged chunks; verify parent BM25 mutation happens after chunk success/finalize only

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md](../../feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md)

---

## 5. SOURCE METADATA

- Group: Bug Fixes and Data Integrity
- Playbook ID: 116
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--bug-fixes-and-data-integrity/116-chunking-safe-swap-atomicity-p0-6.md`
