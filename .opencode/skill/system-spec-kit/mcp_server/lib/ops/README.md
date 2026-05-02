---
title: "Ops Background Operations"
description: "File watcher and ingestion job queue for background indexing and maintenance operations."
trigger_phrases:
  - "file watcher"
  - "job queue"
  - "ingest job"
  - "background indexing"
  - "auto reindex"
  - "SQLITE_BUSY retry"
---

# Ops Background Operations

`lib/ops/` contains background primitives for file-change indexing and queued ingestion. Runtime request handlers do not execute long-running work here directly. They start, inspect, or cancel jobs through handler surfaces.

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. TOPOLOGY](#2--topology)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

## 1. OVERVIEW

This folder keeps indexing work away from the main MCP request path. The watcher reacts to file changes. The queue processes explicit multi-file ingest jobs with a single worker.

Runtime role:

- Start and stop watcher-backed background indexing when configured.
- Enqueue, inspect, and cancel ingest jobs through handlers.
- Report progress without blocking normal tool calls.

Maintenance role:

- Recover incomplete jobs after process restart.
- Retry transient SQLite busy errors.
- Re-index changed spec docs with content-hash deduplication.

## 2. TOPOLOGY

```text
┌────────────────────┐       ┌────────────────────┐
│ Markdown changes   │       │ Ingest tool call   │
└─────────┬──────────┘       └─────────┬──────────┘
          ▼                            ▼
┌────────────────────┐       ┌────────────────────┐
│ file-watcher.ts    │       │ job-queue.ts       │
└─────────┬──────────┘       └─────────┬──────────┘
          ▼                            ▼
┌──────────────────────────────────────────────────┐
│ Indexing, embedding, progress, retry, recovery   │
└──────────────────────────────────────────────────┘
```

## 3. KEY FILES

| File | Role |
| --- | --- |
| `file-watcher.ts` | Watches Markdown files, filters unsafe paths, debounces changes, compares content hashes, and triggers bounded re-indexing. |
| `job-queue.ts` | SQLite-backed ingestion jobs with queued, parsing, embedding, indexing, complete, failed, and cancelled states. |

## 4. BOUNDARIES

Owns:

- Background job lifecycle state.
- File watcher filtering and debounce behavior.
- Sequential worker execution and crash recovery.
- Retry handling for transient SQLite busy errors.

Does not own:

- Search ranking.
- Memory search APIs.
- Embedding provider selection.
- Spec folder continuity rules.

## 5. ENTRYPOINTS

| Entrypoint | Caller | Notes |
| --- | --- | --- |
| `startFileWatcher()` | Server startup or maintenance setup | Returns a watcher handle for shutdown. |
| `initIngestJobQueue()` | Server startup | Resets incomplete jobs and starts queue state. |
| `createIngestJob()` | Ingest start handler | Persists the requested path list. |
| `enqueueIngestJob()` | Ingest start handler | Adds work to the single async worker. |
| `getIngestJob()` | Ingest status handler | Reads current state and progress. |
| `cancelIngestJob()` | Ingest cancel handler | Moves eligible jobs to cancelled. |
| `getIngestProgressPercent()` | Status surfaces | Computes progress from stored counts. |

## 6. VALIDATION

Run focused tests when changing this folder:

```bash
npm test -- mcp_server/tests/ops
npm test -- mcp_server/tests/handlers/memory-ingest
```

Run document validation after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md
```

## 7. RELATED

- `../search/README.md` documents the retrieval path that consumes indexed data.
- `../../utils/README.md` documents shared database helpers when present.
- `../../tests/README.md` documents watcher and queue test layout.
