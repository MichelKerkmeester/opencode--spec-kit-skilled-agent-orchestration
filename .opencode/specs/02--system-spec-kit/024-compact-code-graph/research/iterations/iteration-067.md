# Iteration 67: Auto-Indexing and Staleness Detection Design

## Focus
Design a concrete "stale-on-read" mechanism for the code graph system. Building on iterations 59 (auto-reindex triggers) and 63 (stale detection), this iteration performs deep source code analysis of the existing content_hash and freshness mechanisms to design a file-watcher-free, on-demand staleness detection and auto-reindex system that integrates with both code_graph_query and code_graph_context call paths, plus CocoIndex coordination.

## Findings

### 1. Current content_hash mechanism is SHA-256 truncated to 12 hex chars
The `generateContentHash()` in `indexer-types.ts:76` uses `createHash('sha256').update(content).digest('hex').slice(0, 12)`. This is a **file-level** hash -- the entire file content is hashed. Per-node content hashes are computed from line slices (`structural-indexer.ts:190`). The file-level hash is stored in `code_files.content_hash` and compared by `isFileStale()`. This means staleness detection requires reading the file from disk to recompute the hash, making it an I/O-bound operation.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:76-78]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:171-177]

### 2. Current `isFileStale()` is a simple hash comparison with no mtime fast-path
`code-graph-db.ts:172-177` shows that `isFileStale(filePath, currentHash)` performs a single DB lookup (`SELECT content_hash WHERE file_path = ?`) and compares strings. However, it requires the **caller to already have the currentHash**, which means the caller must have already read and hashed the file. There is no mtime-based fast path to skip the file read -- contrast with the memory system's `incremental-index.ts:20` which uses `MTIME_FAST_PATH_MS = 1000` to skip files whose mtime is within 1 second. This is a critical missing optimization: mtime comparison (one `statSync`) is ~100x cheaper than file read + SHA-256.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:171-177]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:20-28]

### 3. `computeFreshness()` is coarse-grained -- only checks MAX(indexed_at) across all files
`code-graph-context.ts:164-177` shows the current freshness computation: it queries `SELECT MAX(indexed_at) FROM code_files` and classifies the entire graph as `fresh` (<5min), `recent` (<1hr), or `stale` (>1hr). This is a **global** metric -- it cannot detect that specific files are stale while others are fresh. The freshness is computed every time `buildContext()` or the empty-result fallback runs (lines 101 and 129), returning it as metadata but taking **no action** on staleness. This is the key gap: staleness is reported but never triggers auto-reindex.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:164-177]

### 4. Concrete "stale-on-read" design with per-file granularity
The design adds a `file_mtime_ms` column to `code_files` (parallel to the memory system's approach) and introduces a two-tier staleness check:

**Tier 1: mtime fast-path** (sync, ~1ms per file)
- On query, extract the set of file paths touched by the query results
- For each file, compare `statSync(filePath).mtimeMs` against stored `code_files.file_mtime_ms`
- If mtime matches: skip (file is fresh)
- If mtime differs: promote to Tier 2

**Tier 2: content hash verification** (sync for single file, ~5-20ms)
- Read the file, compute `generateContentHash(content)`
- Compare against stored `code_files.content_hash`
- If hash matches: update `file_mtime_ms` only (mtime changed but content didn't, e.g., after `git checkout`)
- If hash differs: file is truly stale -- trigger reindex

**Insertion points in existing code:**
- `handleCodeGraphQuery()` in `query.ts`: After getting results, collect unique file paths from result nodes, run staleness check, reindex stale files, then re-query
- `handleCodeGraphContext()` in `context.ts`: Before calling `buildContext()`, resolve seeds to file paths, check staleness, reindex if needed
- New function `ensureFreshFiles(filePaths: string[]): Promise<number>` in `code-graph-db.ts`

[INFERENCE: based on analysis of code-graph-db.ts isFileStale(), computeFreshness(), and memory system's incremental-index.ts mtime fast-path pattern]

### 5. Latency impact analysis: sync reindex adds 50-200ms per stale file, async-with-stale-results is better
File reindex cost per file (from `scan.ts` flow): `readFileSync` + `parseFile` + `upsertFile` + `replaceNodes` + `replaceEdges`. For a typical 200-line file, this is ~20-80ms. For large files (1000+ lines), up to 200ms. With 5 stale files, sync reindex could add 400-1000ms, violating the 400ms latency budget already set in `expandAnchor()` (line 182).

**Recommended approach: hybrid sync/async with configurable threshold**
```
staleCount <= 2 files: sync reindex, return fresh results (~50-160ms added)
staleCount 3-10 files: async reindex, return stale results with `freshness.reindexInProgress: true` flag
staleCount > 10 files: async reindex, return stale results, add nextAction: "Run code_graph_scan for full reindex"
```

The async path uses `setImmediate(() => reindexFiles(staleFiles))` in the MCP handler response -- the MCP server stays alive between calls (it's a long-running process, unlike hooks), so background work completes before the next tool call.

[INFERENCE: based on expandAnchor 400ms budget (context.ts:182), scan.ts flow analysis, and MCP server lifecycle vs hook process.exit constraint from iteration 061]

### 6. Schema extension for mtime tracking
```sql
ALTER TABLE code_files ADD COLUMN file_mtime_ms INTEGER;
CREATE INDEX IF NOT EXISTS idx_files_mtime ON code_files(file_mtime_ms);
```
The `upsertFile()` function needs an additional `mtimeMs` parameter. On initial scan, populate from `statSync(filePath).mtimeMs`. On staleness check, compare `statSync` result against DB value. This mirrors the memory system's `file_mtime_ms` column in `memory_index`.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:71 (memory system uses file_mtime_ms)]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:20-30 (code_files schema)]

### 7. CocoIndex freshness coordination design
CocoIndex has its own `ccc_reindex` tool and `refresh_index` management. The two systems can coordinate without coupling:

**Independent refresh, shared trigger**: When the code graph's stale-on-read detects stale files, it can fire a lightweight event/flag that the next CocoIndex query checks. Concretely:
- Code graph stores `lastStaleDetectedAt` timestamp in an in-memory singleton
- `ccc_status` handler checks this timestamp; if recent (<5min), it triggers `ccc_reindex({ full: false })`
- This avoids tight coupling: code graph triggers its own reindex synchronously; CocoIndex gets a hint to refresh incrementally

**Session-start batch**: On first MCP tool call of a session (detected via `resolveTrustedSession` from iteration 062), trigger both code graph scan and CocoIndex reindex in parallel. This is the "batch reindex on session start" from the dispatch brief:
```typescript
if (isFirstCall && !sessionState.graphScanned) {
  await Promise.all([
    handleCodeGraphScan({ incremental: true }),
    cccReindex({ full: false })
  ]);
  sessionState.graphScanned = true;
}
```

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts (handleCodeGraphScan)]
[INFERENCE: based on iteration 062's resolveTrustedSession session detection + iteration 059's auto-reindex triggers]

### 8. The `ensureFreshFiles()` function design
```typescript
export async function ensureFreshFiles(
  filePaths: string[],
  options?: { maxSyncReindex?: number; forceCheck?: boolean }
): Promise<{ reindexed: string[]; staleDeferred: string[]; freshCount: number }> {
  const maxSync = options?.maxSyncReindex ?? 2;
  const staleFiles: string[] = [];
  let freshCount = 0;

  for (const fp of filePaths) {
    try {
      const stat = statSync(fp);
      const row = db.prepare('SELECT content_hash, file_mtime_ms FROM code_files WHERE file_path = ?').get(fp);
      if (row && row.file_mtime_ms === Math.floor(stat.mtimeMs)) {
        freshCount++;
        continue; // mtime fast-path: definitely fresh
      }
      // mtime changed or missing -- check content hash
      const content = readFileSync(fp, 'utf8');
      const hash = generateContentHash(content);
      if (row && row.content_hash === hash) {
        // Content same, just mtime changed (e.g., git checkout)
        db.prepare('UPDATE code_files SET file_mtime_ms = ? WHERE file_path = ?')
          .run(Math.floor(stat.mtimeMs), fp);
        freshCount++;
        continue;
      }
      staleFiles.push(fp);
    } catch {
      // File deleted or unreadable -- skip
    }
  }

  // Sync reindex up to threshold
  const syncBatch = staleFiles.slice(0, maxSync);
  const deferred = staleFiles.slice(maxSync);
  for (const fp of syncBatch) {
    await reindexSingleFile(fp); // parseFile + upsertFile + replaceNodes + replaceEdges
  }
  if (deferred.length > 0) {
    setImmediate(() => { for (const fp of deferred) reindexSingleFile(fp); });
  }
  return { reindexed: syncBatch, staleDeferred: deferred, freshCount };
}
```

[INFERENCE: synthesized from code-graph-db.ts isFileStale(), scan.ts reindex flow, and incremental-index.ts mtime pattern]

## Ruled Out
- **File watchers (chokidar/fs.watch)**: Already ruled out in iterations 057 and 059. MCP servers don't control process lifecycle; watchers add complexity and memory overhead for marginal benefit vs on-demand checks.
- **Global freshness check only**: The current `computeFreshness()` MAX(indexed_at) approach is too coarse. Per-file granularity is necessary for the stale-on-read pattern to avoid unnecessary full rescans.
- **Synchronous reindex for all stale files**: Would violate the 400ms latency budget when many files are stale. The hybrid sync/async threshold approach avoids this.

## Dead Ends
None identified -- all approaches investigated are viable within their constraints.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (full file -- isFileStale, upsertFile, schema)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:164-177` (computeFreshness)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:76-78` (generateContentHash)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts` (full file -- incremental scan flow)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` (full file -- query handler insertion point)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` (full file -- context handler insertion point)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:20-28` (memory system mtime fast-path pattern)

## Assessment
- New information ratio: 0.72
- Questions addressed: Auto-indexing design, staleness detection, latency impact, CocoIndex coordination, session-start batch reindex
- Questions answered: Complete stale-on-read mechanism design with per-file granularity, concrete function signatures, schema extension, latency thresholds, and CocoIndex coordination strategy

## Reflection
- What worked and why: Sequential reading of code-graph-db.ts -> query.ts -> context.ts -> indexer-types.ts revealed the complete data flow from hash generation through storage through freshness reporting. The memory system's `incremental-index.ts` provided a proven mtime fast-path pattern to adapt. Reading the actual `expandAnchor` 400ms budget made the latency constraint concrete.
- What did not work and why: N/A -- all source files were available and contained the expected mechanisms.
- What I would do differently: Could have also read `code-graph-context.ts` fully to understand the seed resolution flow for more precise insertion point design, but the context handler read provided sufficient clarity.

## Recommended Next Focus
Consolidation iteration: Synthesize all Q13-Q16 findings (iterations 56-67) into a prioritized feature improvement roadmap with implementation phases ordered by impact, estimated LOC, and dependencies. This should produce the final research output for Segment 6.
