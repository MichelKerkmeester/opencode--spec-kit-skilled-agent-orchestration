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
| `Lib` | SQLite schema and CRUD | mcp_server/handlers/code-graph/scan.ts |
| `Handler` | Workspace scan handler | mcp_server/tests/code-graph-indexer.vitest.ts |

### Tests

| File | Focus |
|------|-------|
| `Indexer integration` | phase 009 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Code graph SQLite storage and MCP query tools
- Current reality source: spec 024-compact-code-graph 
