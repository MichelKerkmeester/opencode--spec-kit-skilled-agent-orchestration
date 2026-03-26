---
title: "Real-time filesystem watching with chokidar"
description: "Real-time filesystem watching uses chokidar to push-index changed memory files with debounce, content-hash deduplication and retry logic."
---

# Real-time filesystem watching with chokidar

## 1. OVERVIEW

Real-time filesystem watching uses chokidar to push-index changed memory files with debounce, content-hash deduplication and retry logic.

Instead of waiting for you to ask the system to re-scan your files, this feature watches your project folder in real time. When you save, rename or delete a memory file, the system notices and updates its index automatically. It works like how your email app shows new messages as they arrive rather than making you hit refresh.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). `getWatcherMetrics()` is exported and returns `{ filesReindexed, avgReindexTimeMs }`, with per-reindex timing logs emitted to stderr (CHK-087). Watcher startup/shutdown lifecycle wiring lives in `context-server.ts`, and rollout gating is centralized in `lib/search/search-flags.ts` via `isFileWatcherEnabled()` / `SPECKIT_FILE_WATCHER` (default `false`).

`mcp_server/tests/file-watcher.vitest.ts` now covers the watcher runtime behavior and is green in the current verification run, including debounce, rename, burst/concurrent rename, retry and metrics scenarios.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher |
| `mcp_server/context-server.ts` | Server | Starts and stops the watcher during MCP server lifecycle |
| `mcp_server/lib/search/search-flags.ts` | Lib | Exposes the `SPECKIT_FILE_WATCHER` gate via `isFileWatcherEnabled()` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | Coverage for path filtering, debounce/retry/delete behavior, rename integration (unlink+add lifecycle, old-entry removal), burst/concurrent rename handling and watcher metrics (`filesReindexed`, `avgReindexTimeMs`) |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Real-time filesystem watching with chokidar
- Current reality source: FEATURE_CATALOG.md
