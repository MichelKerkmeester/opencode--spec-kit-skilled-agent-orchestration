# Iteration 008 - Content-Hash Predicate Integration

## Summary

The current stale predicate is still mtime-only even though `code_files.content_hash` and `code_nodes.content_hash` are first-class schema columns. The content hash is produced from file content during parse and persisted through `ParseResult.contentHash`, so the database already has the stored side of the comparison. The missing piece is a DB-layer predicate that reads `content_hash` with `file_mtime_ms`, keeps the mtime fast path, and hashes live content only when mtime appears unchanged. The safe fallback for legacy or incomplete rows is to mark the file stale so a normal scan can backfill the hash through the existing persistence path.

## Current Stale Predicate

Current `isFileStale()` body:

```ts
/** Check if a file needs re-indexing based on stored mtime */
export function isFileStale(filePath: string): boolean {
  const d = getDb();
  const row = d.prepare('SELECT file_mtime_ms FROM code_files WHERE file_path = ?').get(filePath) as { file_mtime_ms: number } | undefined;
  if (!row) return true;
  const currentMtimeMs = getCurrentFileMtimeMs(filePath);
  if (currentMtimeMs === null) return true;
  return row.file_mtime_ms !== currentMtimeMs;
}
```

The implementation reads only `file_mtime_ms`, treats missing DB rows as stale, treats unreadable/missing files as stale, and otherwise compares stored mtime against `statSync(filePath).mtimeMs` truncated to an integer. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:117-123`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-388`]

There is no `getStaleFiles()` export in the inspected DB layer; the batch equivalent is `ensureFreshFiles()`. It performs one SQL lookup for `file_path, file_mtime_ms`, then stats every candidate path and partitions into `{ stale, fresh }` using the same mtime-only test. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:390-424`]

Production callers:

- `structural-indexer.ts` imports `isFileStale()` and uses it before reading/parsing candidates when `skipFreshFiles` is true. The comment explicitly says the optimization avoids read+parse when mtime matches the DB record. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:16-18`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1453-1459`]
- `handlers/scan.ts` calls `indexFiles(config, { skipFreshFiles: effectiveIncremental })`, then has a second incremental guard that skips a parsed result when `graphDb.isFileStale(result.filePath)` returns false. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:186-190`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217`]
- `ensure-ready.ts` does not call `isFileStale()` directly; it calls `ensureFreshFiles(existingFiles)` inside `detectState()`, then maps a non-empty stale set to either `selective_reindex` or `full_scan` based on the 50-file threshold. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:127-135`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:161-186`]

## Content-Hash Production Path

The schema already stores content hashes on both files and nodes: `code_files.content_hash TEXT NOT NULL`, `code_nodes.content_hash TEXT NOT NULL`, plus an index on `code_files(content_hash)`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:53-65`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:68-84`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:105-115`]

Hash production is centralized in `generateContentHash(content)`, which uses SHA-256 over the string content and truncates the hex digest to 12 characters. `ParseResult` carries this as `contentHash`, and every `CodeNode` carries a `contentHash` too. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:60-70`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:90-93`]

The regex parser computes the file hash before extracting captures and returns it in both success and error results. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:690-727`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:728-739`]

The tree-sitter parser also computes `contentHash` from full file content before parsing, returns it on grammar errors, and returns it on successful parses. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:607-623`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:626-673`]

The indexer reads live file content only after stale gating passes, then calls `parseFile(file, content, language)`. `parseFile()` computes a content hash for its error path and otherwise returns the parser result with the file path attached. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1461-1465`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1075-1095`]

Persistence already writes the hash. `persistIndexedFileResult()` passes `result.contentHash` to `upsertFile()` both for the staged `file_mtime_ms=0` write and the final fresh write. `upsertFile()` updates or inserts `content_hash`, while `replaceNodes()` writes each node's `contentHash`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:289-321`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:324-355`]

## Proposed Predicate

Pseudocode:

```ts
type StaleCheckOptions = {
  currentContentHash?: string;
};

function getCurrentContentHash(filePath: string): string | null {
  try {
    return generateContentHash(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export function isFileStale(filePath: string, options: StaleCheckOptions = {}): boolean {
  const row = db.prepare(`
    SELECT file_mtime_ms, content_hash
    FROM code_files
    WHERE file_path = ?
  `).get(filePath) as { file_mtime_ms: number; content_hash: string | null } | undefined;

  if (!row) return true;

  const currentMtimeMs = getCurrentFileMtimeMs(filePath);
  if (currentMtimeMs === null) return true;

  // Fast path: mtime drift is enough evidence; do not hash.
  if (row.file_mtime_ms !== currentMtimeMs) return true;

  // Legacy/incomplete rows should be refreshed once and backfilled.
  if (!row.content_hash) return true;

  // Hash only when mtime says "fresh".
  const currentHash = options.currentContentHash ?? getCurrentContentHash(filePath);
  if (currentHash === null) return true;

  return row.content_hash !== currentHash;
}
```

Batch helper pseudocode:

```ts
export function ensureFreshFiles(filePaths: string[]): FreshFilesResult {
  rows = SELECT file_path, file_mtime_ms, content_hash ...
  for each unique filePath:
    row missing -> stale
    stat missing -> stale
    stored mtime differs -> stale
    content_hash missing -> stale
    liveHash = read+generateContentHash(file)
    liveHash missing or liveHash !== stored hash -> stale
    else fresh
}
```

The scan handler should pass `result.contentHash` into the post-parse guard so the second `isFileStale()` call does not re-read the file after parsing already produced the current hash. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:60-70`]

## Patch Surface

1. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:7-10`
   Add `readFileSync` beside `statSync`, and import `generateContentHash` from `indexer-types.js`. This is needed because the DB predicate currently has mtime access only. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:7-10`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:90-93`]

2. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:117-123`
   Add `getCurrentFileContentHash(filePath)` next to `getCurrentFileMtimeMs(filePath)`, using `readFileSync(filePath, 'utf-8')` plus `generateContentHash()`, returning `null` on read failure. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:117-123`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1461-1465`]

3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-388`
   Change `isFileStale(filePath)` to select `file_mtime_ms, content_hash`, perform the mtime fast path, treat missing hash as stale, and compare `options.currentContentHash ?? getCurrentFileContentHash(filePath)` when mtime matches. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-388`]

4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:396-424`
   Change `ensureFreshFiles()` to select `content_hash` with `file_mtime_ms` and apply the same mtime-then-hash predicate in batch form. This keeps readiness and direct stale checks behaviorally aligned. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:396-424`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:127-135`]

5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217`
   Replace `graphDb.isFileStale(result.filePath)` with `graphDb.isFileStale(result.filePath, { currentContentHash: result.contentHash })` so post-parse gating reuses the hash already in `ParseResult`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:60-70`]

6. `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:905-940`
   Extend the existing mtime stale test or add adjacent DB-level tests for same-mtime/different-content detection, missing-hash fallback, and unchanged-content freshness. This is the nearest real DB test for `isFileStale()` and `ensureFreshFiles()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:905-940`]

7. `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:163-199`
   Add/update readiness tests so stale sets produced by hash mismatch still map to `selective_reindex`, inline-disabled paths still report stale without indexing, and post-refresh hash-aligned rows become fresh. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:163-199`]

8. `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:154-217`
   Update scan-handler mocks to expect the optional `{ currentContentHash }` argument where the post-parse stale guard is exercised, and preserve the pre-parse skip count behavior for no-op incremental scans. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:154-217`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:210-240`]

## Performance Analysis

Before this patch, the stale check cost is one SQLite point lookup plus one `statSync()` per checked file. The pre-parse indexer path relies on that cheap mtime check to skip read+parse for fresh files. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-388`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1453-1459`]

An eager hash-on-every-check design would add a full file read and SHA-256 computation for every candidate, including files whose mtime already proves staleness. That is dominated by total bytes read and would duplicate work for files that will immediately be parsed afterward. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1461-1465`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:90-93`]

The better default is mtime-first lazy hashing: missing row, missing file, and mtime mismatch remain cheap stale exits; live content is read and hashed only when mtime matches. This catches same-mtime content drift while avoiding hash cost for files already known stale by mtime. The trade-off is real: unchanged files now pay read+hash during freshness checks, so the optimization becomes "skip parse" rather than "skip read+parse." That is still cheaper than parsing, especially for tree-sitter, but it is no longer metadata-only. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:626-673`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1453-1465`]

The scan post-parse guard should not read the file again because `ParseResult.contentHash` already holds the current hash. Passing it through `isFileStale()` keeps the second guard O(1) after stat and DB lookup. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:60-70`]

## Migration Path

No schema migration is required for current databases that already have `content_hash`; the column is part of the create-table schema for `code_files` and `code_nodes`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:53-84`]

Fallback for legacy or incomplete rows should be `stale` when `content_hash` is null or empty. The next selective or full scan will parse the file, compute `ParseResult.contentHash`, and persist it through the existing staged/final `upsertFile()` path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:289-321`]

If a truly old SQLite file lacks the `content_hash` column, the existing migration helper will not add it because it currently only backfills `file_mtime_ms`, metadata table, and `idx_file_line`. A defensive implementation should either keep assuming the schema is current via `SCHEMA_VERSION` or add a separate migration before this predicate ships. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:130-143`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:145-162`]

## Test Plan

Unit / DB tests:

- `isFileStale()` returns false when stored mtime and stored content hash match current file content.
- `isFileStale()` returns true when mtime differs without reading/hash comparison being needed.
- `isFileStale()` returns true when mtime matches but file content hash differs.
- `isFileStale()` returns true when the DB row has a missing or empty `content_hash`, proving legacy rows are backfilled by reindex.
- `ensureFreshFiles()` partitions the same four cases correctly in a mixed batch.

Integration / caller tests:

- `indexFiles(..., { skipFreshFiles: true })` skips a file only when both mtime and hash match, and includes a same-mtime/hash-different file in results.
- `ensureCodeGraphReady()` maps a hash-only stale file to `selective_reindex` for small stale sets and respects `allowInlineIndex: false`.
- `handleCodeGraphScan()` passes `result.contentHash` into the post-parse stale guard and still preserves `preParseSkippedCount` for no-op incremental scans.
- Existing staged persistence behavior remains intact: a failed persistence path leaves `file_mtime_ms=0`, so the file stays stale independent of hash state. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248`; `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:905-940`]

## Files Reviewed

- `research/research.md:1-78`
- `assets/staleness-model.md:1-27`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1-190`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:281-424`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:700-753`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:1-390`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1-55`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:680-740`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:800-855`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1075-1095`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1400-1555`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:1-105`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:600-690`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:1-25`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:127-285`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:900-945`
- `.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:150-275`
- `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:250-310`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:120-245`

## Convergence Signals

- Q11A answered: the current predicate, batch equivalent, and callers are identified with line citations.
- Q11B answered: eager hashing is rejected; mtime-first lazy hashing is the recommended cost boundary.
- Q11C answered: content hashes are produced by parser/indexer code and persisted by the existing staged/final file write path.
- Q11D answered: the minimum patch surface is DB imports/helper, `isFileStale()`, `ensureFreshFiles()`, scan post-parse guard, and tests.
- Q11E answered: missing hashes should be stale so normal reindex backfills them.
