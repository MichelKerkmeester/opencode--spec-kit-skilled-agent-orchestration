Scope note

- `.opencode/skill/system-spec-kit/mcp_server/database/` contains database artifacts and no `.ts` source files.
- The effective storage-layer TypeScript implementation lives under `.opencode/skill/system-spec-kit/mcp_server/lib/storage/`; 13 `.ts` files were reviewed there.
- No confirmed SQL injection vector was identified in the reviewed TypeScript. The dynamic SQL sites in scope either use bound parameters or interpolate only internal constant identifiers / numerically coerced pagination values.

### C2-001: Schema Downgrade Utility Has Drifted Behind the Live Schema
Severity: MEDIUM
Category: architecture
Location: .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:34
Description
The downgrade helper is frozen at `v16 -> v15`, but the authoritative schema has advanced to `v23` and now includes newer columns and tables. The CLI still exposes the downgrade command, so the recovery path is operationally stale even though current databases are migrated beyond the version the utility accepts.

Evidence
```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
const TARGET_FROM_VERSION = 16;
const TARGET_TO_VERSION = 15;
const REMOVED_COLUMNS = ['parent_id', 'chunk_index', 'chunk_label'] as const;

if (currentVersion !== TARGET_FROM_VERSION) {
  throw new Error(`Downgrade supports only v${TARGET_FROM_VERSION} -> v${TARGET_TO_VERSION}. Current schema is v${currentVersion}.`);
}
```

```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
// V21: Add learned_triggers column (R11 learned feedback)
// V22: Step 2 memory lineage tables + active projection support
// V23: One-time spec_folder re-canonicalization + session_state migration
export const SCHEMA_VERSION = 23;
```

```ts
// .opencode/skill/system-spec-kit/mcp_server/cli.ts
const result = downgradeSchemaV16ToV15(db, { specFolder: specFolder || undefined });
```

Impact
The documented downgrade/recovery path cannot operate on current production-format databases without manual schema surgery. That weakens rollback readiness and makes the CLI surface misleading during incident response.

Recommended Fix
Either remove/guard the CLI command until a current downgrade plan exists, or extend the downgrade logic to handle the real live schema lineage and current `memory_index` shape.

### C2-002: Conflict Deprecation Can Commit Without Creating the Supersedes Edge
Severity: HIGH
Category: bug
Location: .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:336
Description
`executeConflict()` claims the deprecation update and `supersedes` edge insertion are atomic, but it never validates that `causalEdges.insertEdge()` succeeded. Because `insertEdge()` returns `null` for several failure modes instead of throwing, the transaction can commit a deprecated memory with no causal link to its replacement.

Evidence
```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
db.transaction(() => {
  const updateResult = db.prepare(`
    UPDATE memory_index
    SET importance_tier = 'deprecated',
        updated_at = datetime('now')
    WHERE id = ?
  `).run(existingMemory.id) as { changes: number };

  if (updateResult.changes === 0) {
    console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
    return;
  }

  edgeId = causalEdges.insertEdge(
    sourceId,
    targetId,
    'supersedes',
    1.0,
    `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
  );
})();
```

```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
if (!db) {
  console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
  return null;
}
...
if (edgeCount >= MAX_EDGES_PER_NODE) {
  console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
  return null;
}
...
return null;
```

Impact
Reconsolidation can silently strand deprecated memories without a `supersedes` relationship, breaking lineage reasoning, graph navigation, and any cleanup logic that expects the edge to exist.

Recommended Fix
Treat a `null` return from `insertEdge()` as a transaction-failing error. If the causal edge is required, throw and roll back the deprecation update.

### C2-003: "Atomic Save" Still Allows Cross-Resource Split-Brain State
Severity: HIGH
Category: architecture
Location: .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:203
Description
`executeAtomicSave()` writes the pending file, commits the database operation, and only then renames the file into place. If the rename fails, the function returns an error but leaves the database committed and the file stranded at the `_pending` path. The code documents this as a known limitation, so the inconsistency window is intentional and still present.

Evidence
```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
// This function provides file-system-level atomicity (write-to-pending + rename),
// NOT database transaction isolation.
...
dbOperation();
dbCommitted = true;
...
try {
  fs.renameSync(pendingPath, filePath);
} catch (renameError: unknown) {
  console.warn(`[transaction-manager] rename failed after DB commit; pending file kept for recovery: ${pendingPath} (${msg})`);
  return { success: false, filePath, error: `Rename failed after DB commit: ${msg}`, dbCommitted };
}
```

Impact
The database can point at state that is not yet present at the final filesystem path. A crash before recovery, or any caller that ignores `dbCommitted`, can leave the storage layer inconsistent across disk and SQLite.

Recommended Fix
Promote this to a real recovery protocol instead of a best-effort warning: either add caller-enforced compensation/replay on `dbCommitted`, or redesign the write flow so the final visible state is published only after both resources are known-good.

### C2-004: Checkpoint Restore Commits Base Tables Before Derived Rebuilds and Swallows Failures
Severity: MEDIUM
Category: architecture
Location: .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1414
Description
`restoreCheckpoint()` commits the restore transaction and only then rebuilds derived state such as lineage, FTS, degree snapshots, and community assignments. Those rebuild steps are explicitly best-effort and their failures are logged as non-fatal, so restore can report success while leaving search and lineage artifacts stale.

Evidence
```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
restoreTx();
runPostRestoreRebuilds(database, checkpointSpecFolder);
```

```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
// Each rebuild is best-effort — failures must not block restore success.
for (const [name, fn] of rebuildSteps) {
  try {
    fn();
  } catch (err: unknown) {
    console.warn(`[checkpoints] Post-restore rebuild "${name}" failed (non-fatal): ${toErrorMessage(err)}`);
  }
}
```

Impact
A "successful" restore can still leave `memory_fts`, lineage projections, graph analytics, or auto-entity state out of sync with the restored base tables. That undermines trust in checkpoint recovery and can surface stale query results immediately after restore.

Recommended Fix
Return a degraded restore status when any rebuild fails, and add an explicit follow-up repair workflow. If these derived tables are required for correctness, move their rebuild into a stricter post-restore validation gate.

### C2-005: Refresh Queue Loads the Entire Pending Embedding Backlog Without a Bound
Severity: MEDIUM
Category: performance
Location: .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:121
Description
`getUnindexedDocuments()` returns every row whose `embedding_status` is not `success` or `failed`, with no `LIMIT`, batching, or cursoring. Any caller that uses this as a work queue will materialize the full backlog into memory in one shot.

Evidence
```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
export function getUnindexedDocuments(): UnindexedDocument[] {
  assertDb();

  return db!.prepare(`
    SELECT id, spec_folder, file_path, embedding_status, retry_count
    FROM memory_index
    WHERE embedding_status NOT IN ('success', 'failed')
    ORDER BY
      CASE embedding_status
        WHEN 'retry' THEN 0
        WHEN 'partial' THEN 1
        WHEN 'pending' THEN 2
        ELSE 3
      END,
      id ASC
  `).all() as UnindexedDocument[];
}
```

Impact
Large retry or reindex backlogs can turn refresh checks into high-latency, high-memory operations and make startup or admin maintenance work scale with total queue size instead of batch size.

Recommended Fix
Expose bounded batch retrieval with `LIMIT`/cursor semantics and keep the current full-scan helper for diagnostics only.

### C2-006: Deleted-Path Cleanup Uses an N+1 Query Pattern Across SQLite and the Filesystem
Severity: LOW
Category: performance
Location: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:311
Description
`listIndexedRecordIdsForDeletedPaths()` iterates every candidate path, performs a database lookup per path, and then performs filesystem existence checks per returned row. The memory-index scan path calls this directly for stale-path cleanup, so scan cost grows linearly with deleted alias count instead of using a set-based lookup.

Evidence
```ts
// .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
for (const filePath of filePaths) {
  ...
  const rows = hasCanonicalPathColumn()
    ? db.prepare(`
        SELECT id, file_path, canonical_file_path
        FROM memory_index
        WHERE canonical_file_path = ? OR file_path = ?
      `).all(canonicalPath, filePath) as IndexedRecordRow[]
    : db.prepare(`
        SELECT id, file_path
        FROM memory_index
        WHERE file_path = ?
      `).all(filePath) as IndexedRecordRow[];

  for (const row of rows) {
    const rowFileExists = ... ? getFileMetadata(row.file_path).exists : false;
    const rowCanonicalExists = ... ? getFileMetadata(row.canonical_file_path).exists : false;
    ...
  }
}
```

Impact
Large delete waves or alias-heavy repositories turn stale-path detection into repeated DB round-trips plus repeated `stat` calls. This increases scan latency and makes cleanup disproportionately expensive when many paths disappear at once.

Recommended Fix
Batch deleted-path resolution into a single SQL lookup over all candidate paths, and cache filesystem existence checks per normalized path during the sweep.
