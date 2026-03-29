# Iteration 001: Concurrency hazards in save, checkpoint, and shared-memory paths

## Scope
- Reviewed current code in:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- Cross-checked against prior packet findings to avoid repeating already-fixed issues from review iterations 012, 014, 021, 030, and 036.

## Findings

### [P1] Checkpoint restore has no maintenance barrier against live saves or scans
**Files**
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`

**Issue**
`restoreCheckpoint()` performs a large scoped restore transaction and then runs derived-table rebuilds afterward, but nothing blocks ordinary mutation traffic from entering during or immediately after that lifecycle step. `memory_save` and `memory_index_scan` only do `checkDatabaseUpdated()` at entry; they do not observe or honor a restore-in-progress flag. That leaves a window where one request can commit new rows while restore is still rebuilding auto-entities, lineage, degree snapshots, communities, and FTS from an older restore snapshot.

**Evidence**
- `handlers/checkpoints.ts:377-408` calls `checkDatabaseUpdated()` and immediately dispatches `checkpoints.restoreCheckpoint(...)`; there is no global restore mutex or maintenance-state guard.
- `lib/storage/checkpoints.ts:1654-1849` applies the scoped restore transaction, then `lib/storage/checkpoints.ts:1848-1849` calls `runPostRestoreRebuilds(...)` after the transaction finishes.
- `lib/storage/checkpoints.ts:1148-1201` shows those rebuilds mutate shared derived state (`rebuildAutoEntities`, `snapshotDegrees`, `storeCommunityAssignments`, `memory_fts` rebuild) as best-effort follow-up work.
- `handlers/memory-save.ts:921-924` and `handlers/memory-index.ts:167-172` show live save/scan requests only checking DB freshness, then continuing with normal mutation flow.

**Why this is new**
The prior audit covered restore atomicity, scoped restore authorization, and cache invalidation, but I did not find an existing finding on restore running without a global quiesce barrier against concurrent live mutations.

**Fix**
Introduce a process-visible maintenance barrier for checkpoint restore. At minimum:
- Set a `restore_in_progress` flag before entering restore and clear it only after post-restore rebuilds complete.
- Make mutation handlers (`memory_save`, `memory_index_scan`, bulk delete, ingest, CRUD update/delete) fail fast or wait while the barrier is held.
- If multi-process callers are supported, persist the barrier in SQLite/config and acquire it with a transaction so other processes see it too.

### [P1] Concurrent `shared_space_upsert` calls can bootstrap extra owners
**Files**
- `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts`

**Issue**
`handleSharedSpaceUpsert()` decides whether the operation is a create by doing a pre-upsert `SELECT`, then uses that stale boolean to decide whether to add the caller as owner. Because the actual write path uses `INSERT ... ON CONFLICT DO UPDATE`, two concurrent "create the same space" requests can both observe `existingSpace = undefined`, both report `created = true`, and both run the owner-bootstrap branch. The second caller is therefore upgraded to owner even if the first request already created the space.

**Evidence**
- `handlers/shared-memory.ts:433-442` reads `existingSpace` before the write.
- `handlers/shared-memory.ts:512-524` always calls `upsertSharedSpace(...)`, then derives `created` from `!existingSpace` and bootstraps owner membership when `created` is true.
- `lib/collab/shared-spaces.ts:399-420` uses `INSERT ... ON CONFLICT(space_id) DO UPDATE`, so a raced "create" quietly degrades into an update instead of failing.

**Why this is new**
Iteration 012 found missing caller authentication and lifecycle auth gaps, but I did not find an existing finding about concurrent create races corrupting the owner bootstrap contract.

**Fix**
Make creation detection depend on the write result, not on the pre-read snapshot. Safer options:
- Split create and update: do a true `INSERT ... DO NOTHING RETURNING space_id` for create, and bootstrap owner only when the insert actually inserted a row.
- Or enforce create-only semantics behind a unique insert and return a conflict when the row already exists.
- Keep audit metadata and `created` response fields tied to the actual insert outcome.

### [P1] Reconsolidation merge uses a stale predecessor snapshot across an async gap
**File**
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`

**Issue**
`reconsolidate()` chooses `topMatch` from a similarity search, and `executeMerge()` then reads the predecessor row plus vector row before awaiting embedding generation. After that await, it archives `existingMemory.id` and inserts the merged successor using the stale pre-await row contents. If another writer updates, supersedes, or deletes that same memory during the embedding gap, the merge path can overwrite fresher metadata, archive an already-changed predecessor, or fork from a stale content snapshot without noticing.

**Evidence**
- `lib/storage/reconsolidation.ts:591-616` picks `topMatch` from current search results and immediately routes to `executeMerge(topMatch, ...)`.
- `lib/storage/reconsolidation.ts:223-241` loads `existingRow` and then awaits `generateEmbedding(mergedContent)`.
- `lib/storage/reconsolidation.ts:266-333` later archives `existingMemory.id` and inserts the merged successor using fields derived from the earlier `existingRow`.
- There is no compare-and-swap guard on `updated_at`, `content_hash`, or archival state before applying the merge.

**Why this is new**
Earlier reconsolidation findings in this packet focused on wrong IDs, orphaned lineage, and BM25/projection correctness. I did not find one covering this stale-snapshot race in the merge path itself.

**Fix**
Revalidate the predecessor inside the write transaction before mutating it. For example:
- Carry `existingMemory.id` plus the predecessor's `content_hash` or `updated_at` from the planning phase.
- Inside the transaction, reload the row and abort/replan if the predecessor no longer matches the expected version or is already archived.
- If the row changed, rerun similarity selection against the fresh state instead of forcing the old merge decision through.

### [P2] `memory_index_scan` cooldown is a TOCTOU check, so overlapping scans still start
**Files**
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`

**Issue**
The scan cooldown is implemented as a read of `last_index_scan` near the start of the request and a write of the new timestamp only at the end. Two concurrent callers can both read the same old value, both pass the cooldown gate, and both launch a full scan. Because `processBatches()` fans out work in parallel, this can turn one intended scan window into duplicated indexing traffic and overlapping stale-delete decisions.

**Evidence**
- `handlers/memory-index.ts:169-172` reads `lastScanTime` and gates on it before any reservation is written.
- `handlers/memory-index.ts:376-378` then launches batch indexing work asynchronously.
- `handlers/memory-index.ts:601` writes the new cooldown timestamp only after the scan has completed.
- `core/db-state.ts:315-346` exposes `getLastScanTime()` and `setLastScanTime()` as separate operations with no atomic compare-and-set or lease token.

**Why this is new**
The prior audit covered batch-size safety and stale-cleanup behavior, but I did not find a finding for the cooldown check itself being non-atomic.

**Fix**
Turn the cooldown into an atomic lease:
- Reserve the scan slot up front inside a transaction, for example by storing `scan_started_at` and rejecting if the lease is still fresh.
- Clear or convert the lease to `last_index_scan` when the run finishes.
- Include an expiry so a crashed scan does not block future work forever.

## Summary
This pass found four new concurrency issues:
- P1: checkpoint restore can race with live mutation traffic because rebuilds run without a maintenance barrier
- P1: `shared_space_upsert` can bootstrap extra owners under concurrent create races
- P1: reconsolidation merge acts on a stale predecessor snapshot after an async embedding gap
- P2: `memory_index_scan` cooldown is non-atomic and allows overlapping scans

The highest-value follow-up is to add an explicit lifecycle barrier for restore/rebuild work and to convert shared-space creation and scan cooldowns from pre-read decisions into write-time leases or CAS-style checks.
