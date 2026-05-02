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

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    HANDLER LAYER ARCHITECTURE                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │   TOOLS/ DISPATCH LAYER ──▶ dispatchTool(name) ──▶ handlers/   ││
│  └───────────────────────────┬─────────────────────────────────────┘│
│                              │                                       │
│  ┌───────────────────────────▼─────────────────────────────────────┐│
│  │                       MEMORY HANDLERS                            ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            ││
│  │  │ L1: Context  │ │ L2: Search   │ │ L2: Triggers │            ││
│  │  │ memory-      │ │ memory-      │ │ memory-      │            ││
│  │  │ context.ts   │ │ search.ts    │ │ triggers.ts  │            ││
│  │  └──────────────┘ └──────────────┘ └──────────────┘            ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            ││
│  │  │ SAVE PIPELINE│ │ LIFECYCLE    │ │ CAUSAL GRAPH │            ││
│  │  │ memory-save  │ │ ingest       │ │ causal-graph │            ││
│  │  │ .ts → save/  │ │ bulk-delete  │ │ link/unlink  │            ││
│  │  │              │ │ retention    │ │ stats/why    │            ││
│  │  └──────────────┘ └──────────────┘ └──────────────┘            ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            ││
│  │  │ CRUD         │ │ CHECKPOINTS  │ │ INDEX        │            ││
│  │  │ list/delete  │ │ + validate   │ │ scan/alias   │            ││
│  │  │ update/stats │ │              │ │ discovery     │            ││
│  │  │ health       │ │              │ │              │            ││
│  │  └──────────────┘ └──────────────┘ └──────────────┘            ││
│  │  ┌──────────────┐ ┌──────────────┐                              ││
│  │  │ EVAL         │ │ SESSION      │                              ││
│  │  │ eval-reporting│ │ session-     │                              ││
│  │  │ ablation/    │ │ learning.ts  │                              ││
│  │  │ dashboard    │ │ pre/post-    │                              ││
│  │  └──────────────┘ │ flight       │                              ││
│  │                   └──────────────┘                              ││
│  └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                   INTERNAL HELPERS                               ││
│  │ ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  ││
│  │ │save/       │ │handler-  │ │mutation- │ │ pe-gating.ts    │  ││
│  │ │(decomposed)│ │ utils.ts │ │ hooks.ts │ │ quality-loop.ts │  ││
│  │ └────────────┘ └──────────┘ └──────────┘ └──────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Directory Tree

```
mcp_server/handlers/
├── memory-context.ts              # L1: intent-aware context assembly (auto, deep, focused, resume)
├── memory-search.ts               # L2: hybrid search with telemetry and profile support
├── memory-triggers.ts             # L2: trigger matching with tiered content injection
├── memory-save.ts                 # Save pipeline entry → decomposes to save/
├── memory-crud.ts                 # Stable CRUD facade → focused submodules
│   ├── memory-crud-delete.ts      #   Single-record delete
│   ├── memory-crud-update.ts      #   Metadata corrections
│   ├── memory-crud-list.ts        #   Browse stored records
│   ├── memory-crud-stats.ts       #   Indexed-continuity statistics
│   └── memory-crud-health.ts      #   System health diagnostics
├── memory-bulk-delete.ts          # Bulk delete by importance tier
├── memory-retention-sweep.ts      # Retention enforcement for expired records
├── memory-index.ts                # Scan, re-index, alias discovery
├── memory-ingest.ts               # Async ingestion lifecycle
├── checkpoints.ts                 # Checkpoint create/list/restore/delete + validate
├── session-learning.ts            # Preflight/postflight + learning history
├── causal-graph.ts                # Causal link/unlink/stats + drift-why
├── eval-reporting.ts              # Ablation analysis + dashboard reports
├── index.ts                       # Lazy-loading handler registry
├── types.ts                       # Shared handler types
├── handler-utils.ts               # Shared handler helpers
├── mutation-hooks.ts              # Post-mutation cache invalidation
├── pe-gating.ts                   # Prediction-error save arbitration
├── quality-loop.ts                # Verify-fix-verify scoring loop
├── v-rule-bridge.ts               # Bridge to validation scripts
├── causal-links-processor.ts      # Save-time causal edge processing
├── chunking-orchestrator.ts       # Save/index chunking orchestration
├── save/                          # Decomposed save pipeline modules
└── README.md
```

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
