# Iteration 011: Checkpoint lifecycle

## Findings

### [P0] Merge restore can wipe whole auxiliary tables before a "partial" restore succeeds
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`

**Issue** Merge restore (`clearExisting=false`) is not actually non-destructive for unscoped checkpoints. The restore loop pre-clears each non-`memory_index` table by calling `clearTableForRestoreScope(...)` without passing the active scope. When the checkpoint is not `specFolder`-scoped, that helper falls back to a full-table delete, so tables such as `working_memory`, `session_state`, `session_sent_memories`, `shared_spaces`, and similar snapshot tables can be emptied before reinsertion. If any later insert fails, merge mode keeps the partial result instead of rolling back.

**Evidence** `clearTableForRestoreScope()` clears the entire table whenever `checkpointSpecFolder` is null and `hasScope` is false (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:846-848`). The merge-mode restore path calls it without `scope: normalizedScope` (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1725-1732`). The same restore path explicitly accepts partial failure without rollback (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1760-1762`), and the handler still reports success/partial success for data-bearing restores (`.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:389-460`).

**Fix** Pass `scope: normalizedScope` into the merge-mode pre-clear call and constrain delete behavior to the actual restore boundary. If merge mode still needs replace semantics for selected tables, make those deletions explicit and fail the entire restore when any delete-plus-reinsert sequence cannot complete atomically.

### [P1] Checkpoint retention can evict another tenant or spec folder's rollback point
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`

**Issue** Checkpoint retention is enforced globally rather than per isolation boundary. A checkpoint stores `specFolder` and governed scope metadata, but the overflow cleanup ignores both and deletes the oldest checkpoint rows across the entire table. In a shared deployment, one actor can silently remove another actor's last usable rollback point simply by creating enough checkpoints.

**Evidence** `createCheckpoint()` persists scope metadata into the checkpoint row (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1358-1377`), then immediately counts every checkpoint and deletes the oldest rows with no `spec_folder` or scope filter (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1380-1390`).

**Fix** Apply `MAX_CHECKPOINTS` per isolation boundary, at minimum `spec_folder` plus governed scope keys. If a global cap is still needed, it should be enforced separately and must never auto-evict checkpoints outside the creator's scope.

### [P1] Lineage and derived state can disappear after a "successful" restore
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`

**Issue** `clearExisting=true` removes derived tables before restore, but lineage/entity/FTS rebuilds happen only after the transaction commits and are explicitly best-effort. If `runLineageBackfill()` or any dependent rebuild fails, the restored base state stays committed while lineage, projection, entity, or FTS state remains empty or stale. The handler does not surface those rebuild failures to the caller, so the restore can be reported as successful even though lineage preservation failed.

**Evidence** `clearDerivedTablesForRestore()` clears rebuild tables up front (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:950-969`). `restoreCheckpoint()` commits the restore transaction and only then runs `runPostRestoreRebuilds(...)` (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1766-1767`). `runPostRestoreRebuilds()` treats rebuild failures as non-fatal warnings (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1076-1141`), while the handler decides success solely from `result.errors`, which those warnings never populate (`.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:389-460`).

**Fix** Treat lineage/FTS/entity rebuild as restore-critical. Either run the required rebuilds inside the same restore critical section, or propagate rebuild failures into `result.errors` and downgrade or abort the restore whenever essential derived state cannot be reconstructed.

## Summary

I found one blocking restore-path bug and two high-severity lifecycle issues. The most serious problem is that merge restore can delete whole auxiliary tables while still advertising a non-destructive partial-success path; the other two issues are cross-scope checkpoint eviction and silently broken lineage/derived state after restore.
