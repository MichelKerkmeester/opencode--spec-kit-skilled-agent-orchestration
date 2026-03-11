# Real-time filesystem watching with chokidar

## Current Reality

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication, and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). `getWatcherMetrics()` is exported and returns `{ filesReindexed, avgReindexTimeMs }`, with per-reindex timing logs emitted to stderr (CHK-087). Gated by `SPECKIT_FILE_WATCHER` (default `false`).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | Path filtering, debounce/retry/delete behavior, rename integration (unlink+add lifecycle, old-entry removal), burst rename deduplication, concurrent renames, and exported watcher metrics (`filesReindexed`, `avgReindexTimeMs`) |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Real-time filesystem watching with chokidar
- Current reality source: feature_catalog.md
