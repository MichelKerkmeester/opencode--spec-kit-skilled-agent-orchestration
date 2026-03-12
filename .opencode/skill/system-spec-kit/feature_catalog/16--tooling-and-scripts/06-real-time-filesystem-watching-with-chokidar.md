# Real-time filesystem watching with chokidar

## Current Reality

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication, and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). `getWatcherMetrics()` is exported and returns `{ filesReindexed, avgReindexTimeMs }`, with per-reindex timing logs emitted to stderr (CHK-087). Gated by `SPECKIT_FILE_WATCHER` (default `false`).

Test scenarios are present in `mcp_server/tests/file-watcher.vitest.ts`, but reliability/green status is currently dependent on Agent R2 watcher-fix work; treat coverage as implemented-but-not-yet-verified in CI until those fixes land.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | Declared coverage for path filtering, debounce/retry/delete behavior, rename integration (unlink+add lifecycle, old-entry removal), burst/concurrent rename handling, and watcher metrics (`filesReindexed`, `avgReindexTimeMs`) — pending reliable green runs after Agent R2 fixes |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Real-time filesystem watching with chokidar
- Current reality source: feature_catalog.md
