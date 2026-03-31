---
title: "Checklist: Phase 009 — Code Graph [02--system-spec-kit/024-compact-code-graph/009-code-graph-storage-query/checklist]"
description: "checklist document for 009-code-graph-storage-query."
trigger_phrases:
  - "checklist"
  - "phase"
  - "009"
  - "code"
  - "graph"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 009 — Code Graph Storage + Query

## P0
- [x] `code-graph.sqlite` created with correct schema on first scan
- [x] `code_graph_scan` populates all three tables from indexer output
- [x] `code_graph_scan` incremental mode skips unchanged files (content-hash match)
- [x] `code_graph_query` `outline` returns symbols for a given file
- [x] `code_graph_query` `calls_from` returns correct callees
- [x] `code_graph_query` `calls_to` returns correct callers
- [x] `code_graph_query` `imports_from` returns correct imports
- [x] `code_graph_query` `imports_to` returns correct reverse imports
- [x] All 4 tools registered and callable via MCP
- [x] `code_graph_status` reports accurate file/node/edge counts

## P1
- [x] Batch insert uses transactions (atomic per-file updates)
- [x] Delete cascade removes nodes/edges when file is removed from index
- [x] Subject resolution works via symbolId, fqName, or filePath
- [x] Directional indexes improve query performance
- [x] Scan summary includes parse error count and duration
- [x] Status includes last scan timestamp and DB file size — getStats() returns lastScanTimestamp, dbFileSize

## P2
- [x] `code_graph_query` supports `includeTransitive` for multi-hop traversal — BFS transitiveTraversal
- [x] DB handles concurrent reads without corruption or locks — WAL journal mode enabled at initDb(), supports concurrent readers natively
- [x] Schema versioning supports future migrations — SCHEMA_VERSION=1
- [x] Orphaned node cleanup on re-scan — cleanupOrphans()
