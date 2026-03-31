# Code Graph Library

Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.

## Modules

| File | Purpose |
|------|---------|
| `indexer-types.ts` | Type definitions: CodeNode, CodeEdge, ParseResult, SymbolKind, EdgeType |
| `structural-indexer.ts` | Regex-based parser for JS/TS/Python/Bash (tree-sitter planned) |
| `code-graph-db.ts` | SQLite schema and CRUD for code_files, code_nodes, code_edges |
| `seed-resolver.ts` | Resolves CocoIndex file:line results to graph nodes |
| `code-graph-context.ts` | LLM-oriented graph neighborhoods (neighborhood/outline/impact modes) |
| `budget-allocator.ts` | Token budget distribution with floor allocations + overflow pool |
| `working-set-tracker.ts` | Recency-weighted file/symbol access tracking |
| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
| `runtime-detection.ts` | Runtime identification and hook policy classification |
| `index.ts` | Barrel re-export of all modules |

## Architecture

- **CocoIndex** (semantic, external MCP): finds relevant code by concept
- **Code Graph** (structural, this library): maps imports, calls, hierarchy
- **Memory** (session, existing MCP): preserves decisions and context

The compact-merger combines all three under a 4000-token budget for compaction injection.

## Database

`code-graph.sqlite` stored alongside the memory index DB. Schema: `code_files`, `code_nodes` (indexes on symbol_id, kind, name), `code_edges` (directional indexes on source_id, target_id).
