---
title: "Code graph SQLite storage and MCP query tools"
description: "Code graph provides SQLite storage with code_files, code_nodes, code_edges tables and 4 MCP tools for structural queries."
---

# Code graph SQLite storage and MCP query tools

## 1. OVERVIEW

Code graph provides SQLite storage with code_files, code_nodes, code_edges tables and 4 MCP tools for structural queries.

SQLite database (code-graph.sqlite) stores indexed files, symbol nodes, and relationship edges. 4 MCP tools: code_graph_scan (workspace indexing), code_graph_query (outline/calls/imports), code_graph_status (health), code_graph_context (LLM neighborhoods). WAL mode, foreign keys, directional indexes.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/code-graph-db.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/code-graph/code-graph-db.ts` | Lib | SQLite schema, storage helpers, and graph CRUD operations |
| `mcp_server/handlers/code-graph/scan.ts` | Handler | Implements `code_graph_scan` for structural indexing |
| `mcp_server/handlers/code-graph/query.ts` | Handler | Implements `code_graph_query` for callers, imports, and outlines |
| `mcp_server/handlers/code-graph/status.ts` | Handler | Implements `code_graph_status` for readiness and health checks |
| `mcp_server/handlers/code-graph/context.ts` | Handler | Implements `code_graph_context` for compact structural neighborhoods |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/code-graph-scan.vitest.ts` | Scan flow, persistence, and incremental refresh behavior |
| `mcp_server/tests/code-graph-indexer.vitest.ts` | Indexer-to-storage integration and edge persistence coverage |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Code graph SQLite storage and MCP query tools
- Current reality source: spec 024-compact-code-graph phases 009, 019, and 020
