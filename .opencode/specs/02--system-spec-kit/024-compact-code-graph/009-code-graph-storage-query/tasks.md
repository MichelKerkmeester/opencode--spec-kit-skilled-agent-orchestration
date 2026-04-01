---
title: "Tasks: Code Graph Storage + Query [024/009]"
description: "Task tracking for SQLite-based code graph storage and MCP query tools (code_graph_scan, code_graph_query, code_graph_status)."
---
# Tasks: Phase 009 — Code Graph Storage + Query

## Completed

- [x] Create `code-graph-db.ts` with SQLite schema (code_files, code_nodes, code_edges tables) — `lib/code-graph/code-graph-db.ts`
- [x] Create all directional indexes for hot queries (idx_nodes_file, idx_nodes_kind, idx_nodes_fqname, idx_edges_source, idx_edges_target, idx_edges_type, idx_files_path, idx_files_hash) — code-graph-db.ts schema init
- [x] Implement batch insert with transaction wrapping for atomic per-file updates — code-graph-db.ts
- [x] Implement delete cascade for nodes/edges when files removed from index — code-graph-db.ts
- [x] Implement `code_graph_scan` handler — `handlers/code-graph/scan.ts`; accepts rootDir, includeGlobs, excludeGlobs, incremental params
- [x] Implement incremental mode: skip unchanged files via file_mtime_ms match — scan.ts
- [x] Return scan summary with file count, node count, edge count, parse errors, duration — scan.ts
- [x] Implement `code_graph_query` handler — `handlers/code-graph/query.ts`; supports outline, calls_from, calls_to, imports_from, imports_to operations
- [x] Subject resolution fallback chain: symbolId -> fqName -> name — query.ts
- [x] Implement `includeTransitive` BFS traversal for multi-hop queries — query.ts transitiveTraversal
- [x] Implement `code_graph_status` handler — `handlers/code-graph/status.ts`; reports file/node/edge counts, last scan timestamp, DB file size, parser health
- [x] Add tool schemas for code_graph_scan, code_graph_query, code_graph_status to `tool-schemas.ts` — strict JSON schema, additionalProperties: false
- [x] Register all 3 tool handlers in `context-server.ts` — code-graph DB initialized on server startup
- [x] Enable WAL journal mode for concurrent read support — initDb() in code-graph-db.ts
- [x] Implement schema versioning (SCHEMA_VERSION=3) for future migrations — code-graph-db.ts
- [x] Implement orphaned node cleanup on re-scan — cleanupOrphans() in code-graph-db.ts
- [x] Implement getStats() returning lastScanTimestamp and dbFileSize — code-graph-db.ts

## Deferred

None. All planned items completed.
