---
title: "Ops - Background Operations"
description: "File watcher and job queue for background indexing and ingestion operations."
trigger_phrases:
  - "file watcher"
  - "job queue"
  - "ingest job"
  - "background indexing"
  - "auto reindex"
  - "SQLITE_BUSY retry"
---

# Ops - Background Operations

Background processing primitives for file-change detection and sequential job execution.

---

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY CONCEPTS](#3--key-concepts)
- [4. RELATED DOCUMENTS](#4--related-documents)

---

## 1. OVERVIEW

The `ops/` directory provides two background operation modules that keep the memory index current without blocking the main MCP request path:

- **File Watcher** monitors spec folders for Markdown file changes and triggers debounced re-indexing with content-hash deduplication.
- **Job Queue** manages multi-file ingestion as stateful jobs with a true sequential worker, crash recovery and continue-on-error behavior.

Both modules include SQLITE_BUSY retry logic to handle concurrent database access gracefully.

---

## 2. STRUCTURE

| File | Description |
|------|-------------|
| `file-watcher.ts` | Chokidar-based file watcher that detects add/change/unlink events on Markdown files, debounces them, compares content hashes to skip no-op writes and triggers re-indexing with bounded concurrency (max 2 parallel). Includes dotfile filtering, symlink-escape prevention and per-file AbortController cancellation. |
| `job-queue.ts` | SQLite-backed ingestion job queue with a finite state machine (`queued` > `parsing` > `embedding` > `indexing` > `complete`/`failed`/`cancelled`). Enforces valid state transitions, tracks per-file progress against the original submitted path list and caps stored errors at 50. Crash recovery resets incomplete jobs to `queued` on startup. |

---

## 3. KEY CONCEPTS

**File Watcher**
- Content-hash deduplication: SHA-256 hash comparison prevents re-indexing unchanged files.
- Bounded concurrency: A semaphore limits parallel re-index operations to 2.
- AbortController cancellation: A new change to the same file aborts any in-flight re-index for that path.
- Containment check: Resolved real paths are validated against configured watch roots to prevent symlink escapes.
- Reindex parity: watcher- and ingest-driven reindex paths use the normal synchronous embedding cache-miss path; they do not force deferred embeddings unless async mode was explicitly requested or provider generation fails.

**Job Queue**
- State machine: Six states with a strict transition map. Terminal states (`complete`, `failed`, `cancelled`) are immutable.
- Sequential worker: Only one job processes at a time. Multiple `enqueueIngestJob` calls add to a pending queue drained by a single async worker.
- Continue-on-error: Individual file failures are recorded but do not abort the entire job. A job is marked `failed` only when all files error.
- Crash recovery: On init, incomplete jobs are reset to `queued` and re-enqueued for processing.

**Exports**

| Module | Exported symbols |
|--------|-----------------|
| `file-watcher.ts` | `startFileWatcher()`, `WatcherConfig`, `FSWatcher`, `__testables` |
| `job-queue.ts` | `initIngestJobQueue()`, `createIngestJob()`, `getIngestJob()`, `cancelIngestJob()`, `enqueueIngestJob()`, `resetIncompleteJobsToQueued()`, `getIngestProgressPercent()`, `IngestJob`, `IngestJobState`, `IngestJobError` |

---

## 4. RELATED DOCUMENTS

- `mcp_server/lib/search/` - Search modules that consume the indexed data produced by these operations.
- `mcp_server/utils/db-helpers.ts` - `requireDb()` used by the job queue for SQLite access.
- `mcp_server/lib/ops/` tests - Unit tests covering watcher filters, state transitions and retry behavior.
