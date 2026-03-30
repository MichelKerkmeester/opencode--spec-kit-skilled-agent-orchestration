# Checklist: Phase 009 — Code Graph Storage + Query

## P0
- [ ] `code-graph.sqlite` created with correct schema on first scan
- [ ] `code_graph_scan` populates all three tables from indexer output
- [ ] `code_graph_scan` incremental mode skips unchanged files (content-hash match)
- [ ] `code_graph_query` `outline` returns symbols for a given file
- [ ] `code_graph_query` `calls_from` returns correct callees
- [ ] `code_graph_query` `calls_to` returns correct callers
- [ ] `code_graph_query` `imports_from` returns correct imports
- [ ] `code_graph_query` `imports_to` returns correct reverse imports
- [ ] All 3 tools registered and callable via MCP
- [ ] `code_graph_status` reports accurate file/node/edge counts

## P1
- [ ] Batch insert uses transactions (atomic per-file updates)
- [ ] Delete cascade removes nodes/edges when file is removed from index
- [ ] Subject resolution works via symbolId, fqName, or filePath
- [ ] Directional indexes improve query performance
- [ ] Scan summary includes parse error count and duration
- [ ] Status includes last scan timestamp and DB file size

## P2
- [ ] `code_graph_query` supports `includeTransitive` for multi-hop traversal
- [ ] DB handles concurrent reads without corruption or locks
- [ ] Schema versioning supports future migrations
- [ ] Orphaned node cleanup on re-scan
