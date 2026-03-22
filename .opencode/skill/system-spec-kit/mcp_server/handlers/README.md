---
title: "Handlers"
description: "MCP tool handler surface plus internal handler helpers for save/index orchestration."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
  - "request handlers"
---


# Handlers

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. TELEMETRY NOTES](#4--telemetry-notes)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the Handlers directory.

`handlers/` contains both the MCP tool handler surface and internal helper modules used by those handlers.

Tool handler surface (wired through `handlers/index.ts` and `tools/memory-tools.ts`):
- `memory-context.ts` — L1 orchestration handler (T061)
- `memory-search.ts` — hybrid search with retrieval telemetry
- `memory-triggers.ts` — trigger phrase matching
- `memory-save.ts` — save orchestrator (delegates to `save/` pipeline)
- `memory-ingest.ts` — batch ingest start/status/cancel handlers
- `memory-crud.ts` — stable CRUD facade + snake_case aliases
- `memory-bulk-delete.ts` — bulk delete handler
- `memory-index.ts` — index scan, single-file indexing, constitutional file discovery
- `checkpoints.ts` — checkpoint create/list/restore/delete and memory validate
- `session-learning.ts` — task preflight/postflight and learning history
- `causal-graph.ts` — causal link/unlink, drift-why, causal stats (T043-T047)
- `eval-reporting.ts` — ablation runs and reporting dashboard (R13-S3)
- `shared-memory.ts` — MCP handler for shared-space CRUD, membership, rollout status and `shared_memory_enable`
- `index.ts` — barrel re-exports

Internal helper modules (not direct MCP tool endpoints):
- `memory-crud-delete.ts`, `memory-crud-update.ts`, `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts` — split CRUD internals behind `memory-crud.ts`; `memory-crud-health.ts` also calls `getEmbeddingRetryStats()` and includes `embeddingRetry` in health responses
- `memory-crud-types.ts`, `memory-crud-utils.ts` — shared CRUD types and utilities
- `memory-index-alias.ts`, `memory-index-discovery.ts` — indexing support helpers
- `causal-links-processor.ts` — causal link extraction and processing
- `chunking-orchestrator.ts` — document chunking orchestration
- `handler-utils.ts`, `mutation-hooks.ts`, `types.ts` — shared handler helpers/types
- `pe-gating.ts` — prediction-error decision utilities consumed by save/index flows
- `v-rule-bridge.ts` — Runtime bridge to `validate-memory-quality` script (O2-5/O2-12)
- `quality-loop.ts` — quality scoring/fix helpers consumed by `memory-save.ts` (not a standalone MCP handler)
- `save/` — decomposed save pipeline (see `save/README.md`)

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Handlers export camelCase primary APIs and snake_case compatibility aliases.
- CRUD handlers are split into focused modules while keeping `memory-crud.ts` as the stable entry point.
- Tool domains cover L1-L7 behavior through the dispatch layer in `tools/`.
- Core persistence uses `memory_index` (not `memories`) with FTS/vector/checkpoint support.
- `quality-loop.ts` is an internal save helper module invoked inside `memory-save.ts`; MCP does not expose a separate `quality_loop` tool.
- Document-type indexing alignment:
  - `memory-index` supports `includeSpecDocs` and indexes spec docs plus memory files.
  - `memory-save` preserves `document_type` and `spec_level` across create/update/reinforce flows. Integrates with embedding cache for deduplication of unchanged content, persists accepted quality-loop metadata fixes, and carries rewritten body content in-memory until downstream hard-reject gates clear under lock.
  - scan flow can build spec-document causal chains after indexing.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Index mtime updates occur only after successful indexing (retry-safe behavior).
- Spec-folder filtering in scan logic is boundary-safe (no prefix bleed).
- File descriptor reads for spec-level detection are `finally`-closed.
- Deferred embedding paths preserve indexability via BM25/FTS and retry manager handoff.
- `memory-index` scan invalidation now uses the broader post-mutation hook behavior on indexed, updated, and stale-delete outcomes.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:telemetry-notes -->
## 4. TELEMETRY NOTES


- `memory-search.ts` records retrieval telemetry through consumption/eval logging and can include `retrievalTrace` in response data when trace output is requested.
- `memory-context.ts` captures mode selection, pressure override, and fallback detection in `extraMeta._telemetry`. This allows downstream consumers to observe how the context assembly path was chosen.


<!-- /ANCHOR:telemetry-notes -->
<!-- ANCHOR:related -->
## 5. RELATED


- `../tools/README.md`
- `../core/README.md`
- `../database/README.md`
- `../../references/memory/memory_system.md`
<!-- /ANCHOR:related -->
