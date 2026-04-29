---
title: "Handlers"
description: "MCP tool handlers and save/index orchestration helpers."
trigger_phrases:
  - "MCP handlers"
  - "memory handlers"
---

# Handlers

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. IMPLEMENTED STATE](#2-implemented-state)
- [3. HARDENING NOTES](#3-hardening-notes)
- [4. RELATED](#4-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`handlers/` is the MCP-facing handler layer. `handlers/index.ts` lazily loads these modules via async `import()` resolution and re-exports the public handler functions used by the tool dispatch layer.

These handlers can support indexed retrieval and generated artifacts, but canonical packet continuity still belongs to `/spec_kit:resume` and packet docs. Recovery order remains `handover.md`, then `_memory.continuity`, then the remaining spec docs.

Primary MCP handler modules:

- `memory-context.ts` - L1 orchestration entry point for intent-aware context assembly.
- `memory-search.ts` - L2 hybrid search handler with telemetry and profile support.
- `memory-triggers.ts` - Trigger phrase matching, tiered content injection, and session-aware matching.
- `memory-save.ts` - Save pipeline entry point delegating to `handlers/save/`.
- `memory-ingest.ts` - Async ingestion job start, status, and cancel handlers.
- `memory-crud.ts` - Stable CRUD facade backed by focused CRUD submodules.
- `memory-bulk-delete.ts` - Bulk deletion by importance tier with checkpoint guardrails.
- `memory-retention-sweep.ts` - Manual and startup-triggered retention enforcement for governed rows whose `delete_after` has expired.
- `memory-index.ts` - Scan, re-index, alias discovery, and spec-doc indexing entry point.
- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
- `session-learning.ts` - Task preflight, postflight, and learning history handlers.
- `causal-graph.ts` - Causal link, unlink, stats, and drift-why handlers.
- `eval-reporting.ts` - Ablation, k-sensitivity, and dashboard handlers.

Code graph handlers (`code_graph/` subdirectory):

- `code_graph/scan.ts` - `code_graph_scan`: index workspace files, build structural graph.
- `code_graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
- `code_graph/status.ts` - `code_graph_status`: report graph health and statistics.
- `code_graph/context.ts` - `code_graph_context`: LLM-oriented compact graph neighborhoods.
- `code_graph/verify.ts` - `code_graph_verify`: run graph verification checks.
- `code_graph/detect-changes.ts` - `detect_changes`: stale-safe unified-diff preflight.

Internal helpers in this folder:

- `memory-crud-delete.ts`, `memory-crud-update.ts`, `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts` - Focused CRUD implementations behind `memory-crud.ts`.
- `memory-crud-types.ts`, `memory-crud-utils.ts` - Shared CRUD types and helpers.
- `memory-index-alias.ts`, `memory-index-discovery.ts` - Alias conflict discovery, spec-doc discovery, and constitutional file detection.
- `handler-utils.ts`, `types.ts` - Shared handler helpers and domain typing.
- `mutation-hooks.ts` - Post-mutation cache invalidation and feedback wiring.
- `pe-gating.ts` - Prediction-error save arbitration helpers, document weighting, and lineage-aware update paths.
- `quality-loop.ts` - Verify-fix-verify scoring and auto-fix loop used by `memory-save.ts`.
- `v-rule-bridge.ts` - Runtime bridge to validation scripts for memory quality checks.
- `causal-links-processor.ts`, `chunking-orchestrator.ts` - Save/index support helpers.
- `save/` - Decomposed save pipeline modules.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE

- Public handlers expose camelCase functions plus snake_case compatibility aliases where the MCP surface still needs them.
- `quality-loop.ts` supports `emitEvalMetrics` so callers can suppress eval-side writes while still using the quality loop itself.
- `pe-gating.ts` now leans on `lib/storage/document-helpers.ts` for document-aware weights and keeps content-hash-aware update paths aligned with lineage and incremental-index state.
- `memory-index.ts` and `mutation-hooks.ts` work together so index, update, and stale-delete flows clear trigger, constitutional, graph, co-activation, and degree caches.
- `memory-crud-health.ts` surfaces embedding retry stats and FTS/index sync diagnostics as part of the health response.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES

- `handlers/index.ts` is intentionally lazy so startup stays lighter and optional modules do not load until the tool surface needs them.
- Save-time fixes persist accepted metadata changes and carry rewritten body content in memory until later hard-reject gates finish under the spec-folder lock.
- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.

<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../tools/README.md`
- `../core/README.md`
- `../hooks/README.md`

<!-- /ANCHOR:related -->
