# Real-time filesystem watching with chokidar

## Current Reality

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication, SQLite WAL mode enforcement, and exponential backoff retries for `SQLITE_BUSY`. Gated by `SPECKIT_FILE_WATCHER` (default `false`).

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Real-time filesystem watching with chokidar
- Summary match found: Yes
- Summary source feature title: Real-time filesystem watching with chokidar
- Current reality source: feature_catalog.md
