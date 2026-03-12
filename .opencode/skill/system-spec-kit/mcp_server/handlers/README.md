---
title: "Handlers"
description: "MCP tool handlers for context, search, CRUD, indexing, ingest, checkpoints, learning, causal graph, PE gating, eval reporting, and quality loop operations."
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

`handlers/` is the business-logic layer behind the MCP tool surface.

Current modules:
- `memory-context.ts` — L1 orchestration handler (T061)
- `memory-search.ts` — hybrid search with retrieval telemetry
- `memory-triggers.ts` — trigger phrase matching
- `memory-save.ts` — save orchestrator (delegates to `save/` pipeline)
- `memory-ingest.ts` — batch ingest start/status/cancel handlers
- `memory-crud.ts` — stable CRUD facade + snake_case aliases
- `memory-crud-delete.ts` — single-memory delete
- `memory-crud-update.ts` — single-memory update
- `memory-crud-list.ts` — memory listing with filters
- `memory-crud-stats.ts` — database statistics
- `memory-crud-health.ts` — health check handler
- `memory-crud-types.ts` — shared CRUD type definitions
- `memory-crud-utils.ts` — mutation ledger and CRUD utilities
- `memory-bulk-delete.ts` — bulk delete handler
- `memory-index.ts` — index scan, single-file indexing, constitutional file discovery
- `memory-index-alias.ts` — index alias management
- `memory-index-discovery.ts` — spec-folder discovery for indexing
- `checkpoints.ts` — checkpoint create/list/restore/delete and memory validate
- `session-learning.ts` — task preflight/postflight and learning history
- `causal-graph.ts` — causal link/unlink, drift-why, causal stats (T043-T047)
- `causal-links-processor.ts` — causal link extraction and processing
- `chunking-orchestrator.ts` — document chunking orchestration
- `eval-reporting.ts` — ablation runs and reporting dashboard (R13-S3)
- `handler-utils.ts` — shared handler utility functions
- `mutation-hooks.ts` — post-mutation hook runner (cache invalidation)
- `pe-gating.ts` — prediction-error gate actions (findSimilarMemories, reinforce, etc.)
- `quality-loop.ts` — quality feedback loop handler
- `types.ts` — shared handler type definitions
- `index.ts` — barrel re-exports
- `save/` — decomposed save pipeline (see `save/README.md`)

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Handlers export camelCase primary APIs and snake_case compatibility aliases.
- CRUD handlers are split into focused modules while keeping `memory-crud.ts` as the stable entry point.
- Tool domains cover L1-L7 behavior through the dispatch layer in `tools/`.
- Core persistence uses `memory_index` (not `memories`) with FTS/vector/checkpoint support.
- Spec 126 alignment:
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


- `memory-search.ts` integrates retrieval telemetry: captures latency, mode (e.g., `hybrid`, `bm25`, `vector`), and quality signals via a `_telemetry` key on the response metadata.
- `memory-context.ts` captures mode selection, pressure override, and fallback detection in `extraMeta._telemetry`. This allows downstream consumers to observe how the context assembly path was chosen.


<!-- /ANCHOR:telemetry-notes -->
<!-- ANCHOR:related -->
## 5. RELATED


- `../tools/README.md`
- `../core/README.md`
- `../database/README.md`
- `../../references/memory/memory_system.md`
<!-- /ANCHOR:related -->
