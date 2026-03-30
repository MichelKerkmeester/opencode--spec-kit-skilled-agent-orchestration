# Plan: Phase 009 — Code Graph Storage + Query

## Steps

1. **Create `code-graph-db.ts`:**
   - Initialize SQLite database with schema (code_files, code_nodes, code_edges)
   - Create all indexes for hot queries
   - Implement batch insert for scan results (transaction-wrapped)
   - Implement delete cascade when files are removed from index
2. **Implement `code_graph_scan` handler:**
   - Accept workspace root and path globs
   - Discover files matching patterns
   - Call Phase 008 indexer per file
   - Store results in DB via batch insert
   - Support incremental mode (content-hash skip)
   - Return scan summary (counts, errors, duration)
3. **Implement `code_graph_query` handler:**
   - `outline`: query code_nodes by file_id, return sorted by start_line
   - `calls_from`: query code_edges WHERE source_id = X AND edge_type = 'CALLS'
   - `calls_to`: query code_edges WHERE target_id = X AND edge_type = 'CALLS'
   - `imports_from`: query code_edges WHERE source_id = X AND edge_type = 'IMPORTS'
   - `imports_to`: query code_edges WHERE target_id = X AND edge_type = 'IMPORTS'
   - Resolve subject to symbol_id via filePath, fqName, or symbolId
4. **Implement `code_graph_status` handler:**
   - Count total/indexed/stale files
   - Aggregate node/edge counts by type
   - Report parser health summary
   - Include last scan timestamp and DB file size
5. **Register tools in MCP server:**
   - Add schemas to `tool-schemas.ts`
   - Register handlers in `context-server.ts`
   - Initialize code-graph DB on server startup
6. **Test tools end-to-end:**
   - Run scan on a subset of repo files
   - Execute each query operation and verify results
   - Check status output for accuracy
   - Verify incremental scan skips unchanged files

## Dependencies

- Phase 008 indexer must produce `CodeNode[]` and `CodeEdge[]`
- Existing `better-sqlite3` dependency (already used for memory DB)
- `context-server.ts` must accept new tool registrations

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| DB file grows too large | Monitor file size in status, add cleanup for orphaned nodes |
| Concurrent write conflicts | Single-writer model (scan is sequential), reads are concurrent |
| Schema migration needed later | Version table, migration script pattern from memory DB |
| Edge cases in subject resolution | Fallback chain: symbolId → fqName → filePath |
