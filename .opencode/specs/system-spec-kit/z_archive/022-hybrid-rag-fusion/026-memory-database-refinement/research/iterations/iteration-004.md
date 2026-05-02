# Iteration 004: Error Recovery Gaps

## Scope

- Focus: Q4 error recovery gaps in partial-failure paths
- Target files:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`

## Summary

I found 4 remaining recovery gaps. The strongest issue is in the chunked save + PE supersede path: the code can return an error after the new chunked memory tree is already committed, which makes retries likely to create duplicate or conflicting state. The other three gaps are recovery weaknesses around safe-swap cleanup and BM25 drift after partial failure.

## Findings

### 1. High: chunked save can commit the new memory tree, then fail while superseding the predecessor

- Affected code:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:670-689`
- Evidence:
  - `indexChunkedMemoryFile()` completes first.
  - After that, `recordCrossPathPeSupersedes(...)` is called.
  - Then `markMemorySuperseded(peResult.supersededId)` runs outside the chunking transaction.
  - If `markMemorySuperseded(...)` fails, the handler returns `status: 'error'` even though the new chunked parent/children are already committed.
- Why this is a recovery gap:
  - The caller sees a failed save and may retry.
  - The new chunked record tree already exists.
  - The predecessor may remain active, while the new record may already have a `supersedes` causal edge.
  - That is a real partial-write state, not just a warning.
- Specific fix:
  - Move chunked post-create PE mutation into a single transactional finalize step.
  - Either:
    - extend `indexChunkedMemoryFile()` so it accepts a finalize callback that runs in the same final DB transaction, or
    - if post-create supersede fails, run compensating cleanup that deletes the newly created parent and child rows before returning an error.
  - Also reorder the current calls so `markMemorySuperseded(...)` succeeds before inserting the cross-path supersedes edge.

### 2. Medium: safe-swap re-chunk finalization archives old children in-transaction, but deletes them outside the transaction

- Affected code:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:481-549`
- Evidence:
  - `finalizeSwapTx(...)` updates the parent, attaches the new children, and marks old children `is_archived = 1`.
  - Only after that transaction commits does the code loop over `oldChildIds` and call `vectorIndex.deleteMemory(oldChildId)`.
  - If one delete fails mid-loop, the swap has already committed.
- Why this is a recovery gap:
  - The parent can end up with both generations still present in `memory_index`.
  - The old generation is archived, but it is still physically attached to the same parent until deletion succeeds.
  - A partial cleanup failure leaves mixed chunk generations behind.
- Specific fix:
  - In `finalizeSwapTx(...)`, detach old children from the live tree before commit by nulling or moving `parent_id`, not just setting `is_archived = 1`.
  - Replace the per-row post-commit delete loop with a single transactional bulk delete helper.
  - If physical deletion is intentionally best-effort, persist an explicit cleanup-needed marker so a later sweep can finish the removal deterministically.

### 3. Medium: all-chunks-failed rollback retains the old parent row but can leave BM25 indexed with the new parent summary

- Affected code:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:244-258`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:387-457`
- Evidence:
  - The parent BM25 document is updated before any chunk outcome is known.
  - In the `successCount === 0` rollback branch, parent BM25 is removed only when `parentRolledBack === true`.
  - When re-chunking an existing parent (`parentRolledBack === false`), the code deletes staged child docs but does not restore the old parent BM25 document.
- Why this is a recovery gap:
  - The DB keeps the original parent row, but BM25 can now index the failed replacement summary.
  - This is a persistent search-drift state after an error path.
- Specific fix:
  - Delay parent BM25 mutation until at least one chunk succeeds and, for safe-swap, until finalization succeeds.
  - Or capture the old parent BM25 payload and restore it explicitly in the `existing parent retained` rollback branch.

### 4. Medium: reconsolidation merge commits DB changes even if BM25 remove/add fails twice

- Affected code:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:265-374`
- Evidence:
  - Inside the merge transaction, the code archives the old memory, inserts the merged replacement, inserts the supersedes edge, and then tries `bm25.removeDocument(existing)` plus `bm25.addDocument(newId)`.
  - BM25 failures are caught and converted into `bm25RepairNeeded = true`.
  - After commit, `repairBm25Document(...)` is attempted once more.
  - If repair also fails, the function still returns success with only a warning.
- Why this is a recovery gap:
  - The primary DB state is committed, but BM25 can be missing both the old and new document, or retain stale content depending on where the failure occurred.
  - The handler has no persistent repair queue, so this can remain indefinitely.
- Specific fix:
  - Keep BM25 mutation outside the DB transaction and make the repair path durable.
  - At minimum, persist a repair-needed record or set a reconciliation flag on the merged row when BM25 repair fails.
  - Better: centralize post-commit index repair in a retryable background reconciler instead of warning-only completion.

## Non-findings

- I did not find a confirmed missing SQL rollback in `memory_index_scan` itself. Its stale-delete path delegates to `delete_memory_from_database(...)`, which is transactional per record.
- I did not find an unhandled promise rejection in the reviewed handlers. The more important remaining issue is side effects that are intentionally downgraded to warnings after the primary DB mutation already succeeded.

## Recommended next pass

1. Fix the chunked PE supersede path first. It is the only reviewed case that can return an error after the new logical save already committed.
2. Harden safe-swap cleanup so old chunk generations cannot remain attached to the parent after partial delete failure.
3. Add durable repair tracking for BM25 drift in chunking and reconsolidation paths.
