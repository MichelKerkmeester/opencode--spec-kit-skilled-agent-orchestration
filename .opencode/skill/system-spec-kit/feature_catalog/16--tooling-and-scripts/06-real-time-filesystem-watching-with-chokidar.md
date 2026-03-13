# Real-time filesystem watching with chokidar

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Real-time filesystem watching with chokidar.

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication, and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). `getWatcherMetrics()` is exported and returns `{ filesReindexed, avgReindexTimeMs }`, with per-reindex timing logs emitted to stderr (CHK-087). Gated by `SPECKIT_FILE_WATCHER` (default `false`).

`mcp_server/tests/file-watcher.vitest.ts` now covers the watcher runtime behavior and is green in the current verification run, including debounce, rename, burst/concurrent rename, retry, and metrics scenarios.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | Coverage for path filtering, debounce/retry/delete behavior, rename integration (unlink+add lifecycle, old-entry removal), burst/concurrent rename handling, and watcher metrics (`filesReindexed`, `avgReindexTimeMs`) |

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Real-time filesystem watching with chokidar
- Current reality source: feature_catalog.md
