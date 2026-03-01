---
title: "Handlers"
description: "MCP tool handlers for context, search, CRUD, indexing, checkpoints, learning, and causal graph operations."
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
- `memory-context.ts`
- `memory-search.ts`
- `memory-triggers.ts`
- `memory-save.ts`
- `memory-crud.ts` (stable facade + snake_case aliases)
- `memory-crud-delete.ts`
- `memory-crud-update.ts`
- `memory-crud-list.ts`
- `memory-crud-stats.ts`
- `memory-crud-health.ts`
- `memory-crud-types.ts`
- `memory-crud-utils.ts`
- `memory-bulk-delete.ts`
- `memory-index.ts`
- `memory-index-alias.ts`
- `memory-index-discovery.ts`
- `checkpoints.ts`
- `session-learning.ts`
- `causal-graph.ts`
- `types.ts`
- `index.ts`

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


- Handlers export camelCase primary APIs and snake_case compatibility aliases.
- CRUD handlers are split into focused modules while keeping `memory-crud.ts` as the stable entry point.
- Tool domains cover L1-L7 behavior through the dispatch layer in `tools/`.
- Core persistence uses `memory_index` (not `memories`) with FTS/vector/checkpoint support.
- Spec 126 alignment:
  - `memory-index` supports `includeSpecDocs` and indexes spec docs plus memory files.
  - `memory-save` preserves `document_type` and `spec_level` across create/update/reinforce flows. Integrates with embedding cache for deduplication of unchanged content.
  - scan flow can build spec-document causal chains after indexing.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Index mtime updates occur only after successful indexing (retry-safe behavior).
- Spec-folder filtering in scan logic is boundary-safe (no prefix bleed).
- File descriptor reads for spec-level detection are `finally`-closed.
- Deferred embedding paths preserve indexability via BM25/FTS and retry manager handoff.


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
