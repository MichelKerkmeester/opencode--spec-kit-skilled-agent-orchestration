---
title: "Phase 009: Code Graph Storage + Query [02--system-spec-kit/024-compact-code-graph/009-code-graph-storage-query/spec]"
description: "Implement SQLite-based persistent storage for the structural code graph and expose MCP query tools (code_graph_scan, code_graph_query, code_graph_status) for deterministic struc..."
trigger_phrases:
  - "phase"
  - "009"
  - "code"
  - "graph"
  - "storage"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
# Phase 009: Code Graph Storage + Query

## Summary

Implement SQLite-based persistent storage for the structural code graph and expose MCP query tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`) for deterministic structural lookups. Integrated into the existing Spec Kit Memory MCP server as a separate storage subsystem.

## What Exists

- Spec Kit Memory MCP server with SQLite-backed memory storage (`speckit-memory.sqlite`)
- Existing tool-schema patterns in `tool-schemas.ts` (strict JSON schema, `additionalProperties: false`)
- Phase 008 indexer produces `CodeNode[]` and `CodeEdge[]` arrays
- No code graph storage or query tools exist in the repo today (confirmed iteration 055)

## Design Decisions

- **Separate SQLite file**: `code-graph.sqlite` alongside `speckit-memory.sqlite`, not merged into memory DB
- **Same MCP server process**: Integrated into existing Spec Kit Memory MCP server, not a separate server
- **Directional indexes**: Optimized for hot queries (callers-of, callees-of, imports-of)
- **Edge vocabulary matches Phase 008**: CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS

## Schema

```sql
-- Files tracked by the code graph
CREATE TABLE code_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_path TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  parser_health TEXT NOT NULL DEFAULT 'unknown',
  last_indexed_at TEXT NOT NULL,
  file_size_bytes INTEGER
);

-- Structural symbols (functions, classes, methods, modules)
CREATE TABLE code_nodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol_id TEXT NOT NULL UNIQUE,
  fq_name TEXT NOT NULL,
  file_id INTEGER NOT NULL REFERENCES code_files(id) ON DELETE CASCADE,
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  kind TEXT NOT NULL,
  language TEXT NOT NULL,
  UNIQUE(file_id, kind, fq_name)
);

-- Relationships between symbols
CREATE TABLE code_edges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  edge_type TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 1.0,
  UNIQUE(source_id, target_id, edge_type)
);

-- Indexes for hot queries
CREATE INDEX idx_nodes_file ON code_nodes(file_id);
CREATE INDEX idx_nodes_kind ON code_nodes(kind);
CREATE INDEX idx_nodes_fqname ON code_nodes(fq_name);
CREATE INDEX idx_edges_source ON code_edges(source_id, edge_type);
CREATE INDEX idx_edges_target ON code_edges(target_id, edge_type);
CREATE INDEX idx_edges_type ON code_edges(edge_type);
CREATE INDEX idx_files_path ON code_files(file_path);
CREATE INDEX idx_files_hash ON code_files(content_hash);
```

## MCP Tools

### `code_graph_scan`

Build or refresh the structural index.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceRoot` | string | No | Root directory to scan (defaults to project root) |
| `pathGlobs` | string[] | No | File patterns to include (default: `["**/*.js","**/*.ts","**/*.py","**/*.sh"]`) |
| `languages` | string[] | No | Filter by language |
| `incremental` | boolean | No | Skip unchanged files (default: true) |
| `force` | boolean | No | Re-index all files regardless of hash |

Returns: scan summary with file count, node count, edge count, parse errors, duration.

### `code_graph_query`

Deterministic structural queries against the graph.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `operation` | string | Yes | One of: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to` |
| `subject` | object | Yes | Target: `{ filePath?, symbolId?, fqName? }` |
| `maxResults` | number | No | Limit results (default: 50) |
| `includeTransitive` | boolean | No | Follow edges transitively (default: false) |

Returns: array of nodes with their edge relationships.

### `code_graph_status`

Report index health and freshness.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspaceRoot` | string | No | Root directory |

Returns: total files, indexed files, stale files, node/edge counts, last scan time, parser health summary, DB size.

## Architecture

```
Phase 008 Indexer
    |
    v
code-graph.sqlite  ←→  code_graph_scan (build/refresh)
    |
    ├──→  code_graph_query (outline, calls, imports)
    |
    └──→  code_graph_status (health, freshness)

Integrated into Spec Kit Memory MCP server:
  context-server.ts
    ├── speckit-memory.sqlite  (existing memory DB)
    └── code-graph.sqlite      (new graph DB)
```

## What to Build

### 1. `code-graph-db.ts`

SQLite database management:
- Initialize `code-graph.sqlite` with schema
- CRUD operations for files, nodes, edges
- Batch insert/update for scan results
- Transaction wrapping for atomic file updates
- Delete cascade when files are removed

### 2. `code-graph-tools.ts`

MCP tool implementations:
- `handleCodeGraphScan()` — orchestrate Phase 008 indexer + store results
- `handleCodeGraphQuery()` — execute structural queries with directional edge traversal
- `handleCodeGraphStatus()` — aggregate health metrics from DB

### 3. Tool schema registration

Add to `tool-schemas.ts`:
- `code_graph_scan` schema
- `code_graph_query` schema
- `code_graph_status` schema

### 4. Server integration

Wire into `context-server.ts`:
- Initialize code-graph DB on server start
- Register 3 new tool handlers
- Share project root context with graph module

## Acceptance Criteria

- [ ] `code-graph.sqlite` created on first scan with correct schema
- [ ] `code_graph_scan` populates DB with nodes and edges from Phase 008 indexer
- [ ] `code_graph_scan` incremental mode skips unchanged files
- [ ] `code_graph_query` `outline` returns file-level symbol list
- [ ] `code_graph_query` `calls_from` returns callees of a function
- [ ] `code_graph_query` `calls_to` returns callers of a function
- [ ] `code_graph_query` `imports_from` returns what a file imports
- [ ] `code_graph_query` `imports_to` returns files that import a given module
- [ ] `code_graph_status` reports accurate freshness and health metrics
- [ ] Tools registered in MCP server and visible to clients
- [ ] DB handles concurrent reads without corruption

## Files Modified

- NEW: `mcp_server/lib/code-graph/code-graph-db.ts`
- NEW: `mcp_server/lib/code-graph/code-graph-tools.ts`
- EDIT: `mcp_server/tool-schemas.ts` (add 3 tool schemas)
- EDIT: `mcp_server/context-server.ts` (register tools, init DB)

## LOC Estimate

220-320 lines (DB module + tool handlers + schema registration)
