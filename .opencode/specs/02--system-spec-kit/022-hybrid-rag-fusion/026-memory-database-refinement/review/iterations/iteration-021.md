# Iteration 021: Deep dive: memory-save.ts monolith

## Findings

### [P1] BEGIN IMMEDIATE holds the DB write lock across async reconsolidation and file rewrite
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

**Issue** `processPreparedMemory()` opens `BEGIN IMMEDIATE` before it awaits reconsolidation and file finalization. In the hot path, one save can hold both the in-process spec-folder mutex and the SQLite writer lock while it waits on embedding-backed reconsolidation or filesystem writes. That turns a per-folder serialization primitive into head-of-line blocking, and in multi-process callers it increases `SQLITE_BUSY` and lock inversion risk even when the actual row insert is short.

**Evidence** `memory-save.ts:372-410` acquires the spec-folder lock and enters the save pipeline. `memory-save.ts:505-507` opens `BEGIN IMMEDIATE`, then `memory-save.ts:521-528` awaits `runReconsolidationIfEnabled(...)`, and `memory-save.ts:587-589` awaits `finalizeMemoryFileContent(...)` before `memory-save.ts:591` commits. The awaited reconsolidation helper is not purely local bookkeeping: `save/reconsolidation-bridge.ts:161-169,265-267` awaits `reconsolidate()` and lets that path generate embeddings inside the transaction window.

**Fix** Split the pipeline into a planning phase and a mutation phase. Do similarity search, reconsolidation classification, and file-content preparation before `BEGIN IMMEDIATE`; then start the transaction only for the dedup recheck, recon mutation, record creation, and lineage updates. Keep file finalization either before the transaction starts or after commit with an explicit compensating rollback path.

### [P1] Governance cleanup can delete the DB row after the auto-fixed file has already been committed
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

**Issue** The handler persists quality-loop fixes to disk before the main save transaction commits, but governance metadata is applied afterward in a separate transaction. If governance post-processing fails, the code deletes the saved memory from the DB yet leaves the rewritten file in place. The file now contains the auto-fixed version while the database no longer has the corresponding row, so file content and indexed state diverge.

**Evidence** `memory-save.ts:585-589` calls `finalizeMemoryFileContent(filePath, finalizedFileContent)` before `memory-save.ts:591` commits. After `indexMemoryFile()` returns, `handleMemorySave()` applies governance metadata in a second transaction at `memory-save.ts:963-1001`. If that phase throws, `memory-save.ts:1002-1008` calls `delete_memory_from_database(database, result.id)` but never restores the pre-fix file from backup. The chunked branch has the same shape: `memory-save.ts:394-404` can finalize the file on a successful chunked save, and `memory-save.ts:963-1008` can still later delete the DB row.

**Fix** Fold governance fields into the primary insert/update transaction so the save is all-or-nothing. If governance must stay post-commit, keep the file backup until governance succeeds and restore the original file whenever cleanup deletes the DB row.

### [P1] Large-file chunking silently skips the quality gate and reconsolidation stages
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

**Issue** The pipeline order makes chunking a structural escape hatch. Once `needsChunking(parsed.content)` returns true, the handler exits through `indexChunkedMemoryFile()` before it runs the TM-04 quality gate, content-hash dedup, PE gating, or reconsolidation. Save semantics therefore change based solely on content length: small memories get similarity-based gating and reconsolidation, but large memories do not.

**Evidence** In `processPreparedMemory()`, the chunking branch at `memory-save.ts:391-406` returns early. The quality gate only starts at `memory-save.ts:418-476`, PE gating at `memory-save.ts:488-492`, and reconsolidation at `memory-save.ts:519-533`, so none of those stages run for chunked saves. The chunking helper also has no hooks for those stages: `chunking-orchestrator.ts:129-145` accepts only `force` and metadata injection, then immediately begins parent and child record creation.

**Fix** Move the quality gate and reconsolidation decision ahead of the chunking fork, or introduce chunk-aware equivalents that run before `indexChunkedMemoryFile()` mutates storage. At minimum, make the skip explicit in the result payload and logs so operators know large saves are taking a weaker validation path.

### [P2] Parsed state can go stale between preflight, quality-loop preparation, and the locked save
**File** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

**Issue** The handler parses and mutates a `PreparedParsedMemory` object before it acquires the spec-folder lock, then reuses that object later without reparsing or revalidating the file. Any change to the file or relevant DB state while the request is waiting on preflight or the folder mutex can leave the locked phase operating on stale content, stale references, and stale auto-fix output.

**Evidence** `handleMemorySave()` parses once for preflight at `memory-save.ts:841-857` and passes that object into `indexMemoryFile()` via `parsedOverride` at `memory-save.ts:952-956`. `indexMemoryFile()` then skips reparsing when `parsedOverride` exists (`memory-save.ts:660-663`). `prepareParsedMemoryForIndexing()` mutates `parsed` outside the lock by applying quality-loop fixes and recomputing `contentHash` at `memory-save.ts:190-203`, but the lock is only acquired later at `memory-save.ts:372`. The quality-loop metadata also closes over the early `database` handle at `memory-save.ts:119-133`, while the locked phase rebinds a fresh DB connection at `memory-save.ts:373`, so the prepared state and commit phase can observe different worlds.

**Fix** Treat the pre-lock parse as advisory only. Re-stat or reparse once the spec-folder lock is acquired, or carry the source file mtime and content hash forward and abort if either changed before commit. For DB-backed checks such as reference resolution, recompute them inside the locked phase instead of reusing the earlier snapshot.

## Summary

The highest-risk problems are transaction scope and phase ordering: the save path holds a write transaction across async work, and it can still delete the DB row after the auto-fixed file has already been rewritten. The other two issues are structural drift problems: chunked saves bypass the same gate and reconsolidation path as non-chunked saves, and prepared state is computed early enough to go stale before the locked commit phase starts.
