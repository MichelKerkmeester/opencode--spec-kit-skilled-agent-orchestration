# Code Graph Library

Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.

For Gate E continuity, this library supports retrieval after `/spec_kit:resume` restores packet context through `handover.md` -> `_memory.continuity` -> spec docs. Generated memory artifacts remain supporting only.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                  CODE GRAPH LIB ARCHITECTURE                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                     EXTERNAL SOURCES                            ││
│  │  ┌────────────────────┐  ┌────────────────────────────────────┐ ││
│  │  │ CocoIndex (semantic)│  │ Memory MCP (session/continuity)  │ ││
│  │  │ finds code by concept│  │ preserves decisions + context    │ ││
│  │  │ external MCP tool   │  │                                   │ ││
│  │  └──────────┬─────────┘  └───────────────┬───────────────────┘ ││
│  └─────────────┼────────────────────────────┼──────────────────────┘│
│                │                            │                        │
│  ┌─────────────▼────────────────────────────▼──────────────────────┐│
│  │                      CORE LIBRARY                               ││
│  │  ┌──────────────────────┐  ┌──────────────────────────────────┐││
│  │  │ INDEXER LAYER        │  │ QUERY LAYER                      │││
│  │  │ structural-indexer.ts│  │ code-graph-context.ts            │││
│  │  │ tree-sitter WASM +   │  │ neighborhood / outline / impact  │││
│  │  │ regex fallback       │  │ modes with token budgeting       │││
│  │  └──────────────────────┘  └──────────────────────────────────┘││
│  │  ┌──────────────────────┐  ┌──────────────────────────────────┐││
│  │  │ STORAGE LAYER        │  │ INTEGRATION LAYER                │││
│  │  │ code-graph-db.ts     │  │ seed-resolver.ts                 │││
│  │  │ code_files / nodes / │  │ CocoIndex file:line → graph node │││
│  │  │ edges (SQLite)       │  │ compact-merger.ts                │││
│  │  └──────────────────────┘  │ 3-source merge (Memory + CG + CC)│││
│  │  ┌──────────────────────┐  └──────────────────────────────────┘││
│  │  │ INFRASTRUCTURE       │                                       ││
│  │  │ ensure-ready.ts      │                                       ││
│  │  │ budget-allocator.ts  │                                       ││
│  │  │ working-set-tracker  │                                       ││
│  │  │ readiness-contract   │                                       ││
│  │  │ runtime-detection.ts │                                       ││
│  │  └──────────────────────┘                                       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Trust states: live | stale | absent | unavailable                  │
│  Compaction budget: 4000 tokens (3-source merge)                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Directory Tree

```
mcp_server/code_graph/lib/
├── structural-indexer.ts           # AST parsing: Tree-sitter WASM + regex fallback
├── code-graph-db.ts                # SQLite schema + CRUD: code_files, nodes, edges
├── code-graph-context.ts           # LLM-oriented graph neighborhoods (neighborhood/outline/impact)
├── seed-resolver.ts                # CocoIndex file:line → graph node resolution
├── compact-merger.ts               # 3-source merge: Memory + Code Graph + CocoIndex
├── ensure-ready.ts                 # Readiness guard + auto-scan trigger
├── readiness-contract.ts           # Trust state definitions (live|stale|absent|unavailable)
├── budget-allocator.ts             # Token budget distribution with floor + overflow pool
├── working-set-tracker.ts          # Recency-weighted file/symbol access tracking
├── runtime-detection.ts            # Runtime identification + hook policy classification
├── indexer-types.ts                # Type definitions: CodeNode, CodeEdge, ParseResult, SymbolKind
├── query-result-adapter.ts         # Converts results → stable handler payload shapes
├── utils/workspace-path.ts         # Workspace path normalization helpers
├── index.ts                        # Barrel re-export
└── README.md
```
