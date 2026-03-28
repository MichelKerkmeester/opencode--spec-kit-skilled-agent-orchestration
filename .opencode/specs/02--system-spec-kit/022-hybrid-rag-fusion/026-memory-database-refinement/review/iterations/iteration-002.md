# Iteration 002: Transaction Safety

## Findings

### [P1] Active projection failures are downgraded to best-effort, so committed rows can disappear from all normal reads
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`

**Issue**
The mutation layer treats `active_memory_projection` updates as optional in both the insert/update path and the deferred-indexing path. If the base `memory_index` row is written successfully but projection maintenance fails, the function still returns success. Most read paths in the store only surface rows that join through `active_memory_projection`, so this creates a silent "committed but unreadable" state.

**Evidence**
`index_memory()` updates an existing row via `update_memory()` and then performs `upsert_active_projection()` outside that transaction, swallowing any error at lines 173-193. The insert path also catches and ignores projection failures inside the transaction at lines 217-221. `index_memory_deferred()` is not transactional at all and likewise ignores projection failures after both `UPDATE` and `INSERT` at lines 276-323. On the read side, the store’s prepared statements and counts all join `active_memory_projection` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:395-438`, so a missing projection row makes the memory effectively vanish from normal list/count/search surfaces.

**Fix**
Make projection maintenance part of the required mutation contract. Run the base row write and `upsert_active_projection()` in the same transaction, and let any projection failure abort the mutation. If legacy databases must be supported, detect missing lineage tables once during initialization and gate the feature there instead of swallowing per-write failures.

### [P1] `SQLiteVectorStore` can switch another store instance onto the wrong database under concurrent use
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`

**Issue**
The module keeps the active database handle in process-global variables (`db`, `db_path`, `sqlite_vec_available_flag`). A `SQLiteVectorStore` instance only pins its custom path during `_ensureInitialized()`. After that, its methods delegate to helpers that reopen the "current" global connection instead of the instance’s configured path. Two store instances using different database paths can therefore interleave and read/write the wrong database.

**Evidence**
The active connection is global at lines 308-321. `initialize_db()` immediately returns the global `db` when one is already active and no explicit `custom_path` is supplied at lines 598-610. The store instance only calls `initialize_db(this.dbPath)` once in `_ensureInitialized()` at lines 742-745, but later `upsert()` calls `index_memory()` at lines 800-844 and `delete()` calls `delete_memory()` at lines 856-859; those mutation helpers in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` reopen the database with plain `initialize_db()` at lines 131, 248, 340, 472, 542, and 584. That means whichever store most recently changed the global active connection wins.

**Fix**
Stop routing mutations and queries through a mutable global connection. Thread an explicit `Database.Database` handle or explicit resolved database path through the store methods and helper APIs, or make each `SQLiteVectorStore` own an immutable connection object for its lifetime.

### [P1] Startup recovery can replay multiple pending files for the same target in arbitrary order and overwrite newer content
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`

**Issue**
The recovery path accepts unique-suffixed pending files for the same logical target, but recovery processes them one-by-one in filesystem enumeration order with no grouping or winner selection. If two failed saves exist for the same original path, startup recovery can rename one into place and then rename an older sibling over it.

**Evidence**
The parser explicitly supports `_pending.<unique-suffix>` variants at lines 17 and 118-133. `recoverAllPendingFiles()` simply maps every discovered pending file to `recoverPendingFile()` at lines 424-430. Inside `recoverPendingFile()`, an existing original file only protects the pending file from overwrite when `originalStats.mtimeMs > pendingStats.mtimeMs`; otherwise the pending file is renamed over the original at lines 391-409. Because the pending set is not grouped or sorted first, the final on-disk winner is determined by scan order rather than by a deterministic "newest committed candidate wins" rule.

**Fix**
Group pending files by `originalPath` before recovery, sort each group by a deterministic freshness rule, promote only the newest committed candidate, and delete or quarantine the older siblings instead of replaying them all.

### [P2] `executeAtomicSave()` still exposes a split-brain window where the DB commits but the file never reaches its final path
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`

**Issue**
The helper is documented as an atomic file-plus-database save, but it cannot roll back the database once the callback succeeds. If the rename fails after the DB mutation commits, the caller gets `success: false` plus `dbCommitted: true`, but the system is left in a partial state until a later recovery pass repairs it.

**Evidence**
The function documentation explicitly states that `dbOperation()` is not rolled back if the rename fails at lines 236-240. The implementation sets `dbCommitted = true` immediately after the DB callback returns at lines 257-268, then returns a failure while leaving the pending file in place when `renameSync()` fails at lines 277-294. There is no immediate compensating action beyond the advisory flag and later startup recovery.

**Fix**
Either narrow the contract so the helper is clearly "best-effort with recovery" rather than atomic, or redesign the caller protocol so post-commit rename failure triggers immediate reconciliation before success is reported upstream. At minimum, force callers to handle the `dbCommitted` branch explicitly instead of treating it as an ordinary save failure.

### [P2] Delete paths intentionally commit even when secondary vector cleanup fails
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`

**Issue**
The delete flows treat failures in `vec_memories` cleanup as warnings, then continue deleting the primary `memory_index` row and return success. That creates an avoidable partial delete inside the same SQLite database: the metadata row is gone, but orphaned vector rows remain behind.

**Evidence**
`delete_memory_from_database()` catches `DELETE FROM vec_memories` failures and continues with the primary delete at lines 494-512. `delete_memories()` does the same thing inside the bulk transaction at lines 610-619, and only rolls back when the later `memory_index` delete fails. Since vector search joins `memory_index` to `vec_memories`, these orphan rows become integrity debris rather than a hard failure, which is why the bug can stay silent.

**Fix**
Treat non-legacy vector deletion failures as fatal inside the transaction so the whole delete rolls back cleanly. If there is a strong reason to degrade gracefully, return an explicit partial-delete status and enqueue deterministic cleanup instead of returning an unqualified success.

## Summary
P0: 0, P1: 3, P2: 2
