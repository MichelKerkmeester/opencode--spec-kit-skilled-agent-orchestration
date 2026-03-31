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
- [ ] Status includes last scan timestamp and DB file size

## P2
- [ ] `code_graph_query` supports `includeTransitive` for multi-hop traversal
- [ ] DB handles concurrent reads without corruption or locks
- [ ] Schema versioning supports future migrations
- [ ] Orphaned node cleanup on re-scan
