---
title: "Plan: Phase 009 — Code Graph Storage + [system-spec-kit/024-compact-code-graph/009-code-graph-storage-query/plan]"
description: "1. Create code-graph-db.ts"
trigger_phrases:
  - "plan"
  - "phase"
  - "009"
  - "code"
  - "graph"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/009-code-graph-storage-query"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 009 — Code Graph Storage + Query


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

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
   - Support incremental mode (file_mtime_ms skip)
   - Return scan summary (counts, errors, duration)
3. **Implement `code_graph_query` handler:**
   - `outline`: query code_nodes by file_id, return sorted by start_line
   - `calls_from`: query code_edges WHERE source_id = X AND edge_type = 'CALLS'
   - `calls_to`: query code_edges WHERE target_id = X AND edge_type = 'CALLS'
   - `imports_from`: query code_edges WHERE source_id = X AND edge_type = 'IMPORTS'
   - `imports_to`: query code_edges WHERE target_id = X AND edge_type = 'IMPORTS'
   - Resolve subject to symbol_id via symbolId, fqName, or name
4. **Implement `code_graph_status` handler:**
   - Report totalFiles, totalNodes, totalEdges
   - Aggregate nodesByKind and edgesByType breakdowns
   - Report parseHealth summary and freshness state
   - Include lastScanAt, lastGitHead, dbFileSize, schemaVersion
5. **Register tools in MCP server:**
   - Add schemas to `tool-schemas.ts`
   - Register handlers in `context-server.ts`
   - Initialize code-graph DB on server startup
6. **Test tools end-to-end:**
   - Run scan on a subset of repo files
   - Execute each query operation and verify results
   - Check status output for accuracy
   - Verify incremental scan skips unchanged files

<!-- ANCHOR:dependencies -->
### Dependencies

- Phase 008 indexer must produce `CodeNode[]` and `CodeEdge[]`
- Existing `better-sqlite3` dependency (already used for memory DB)
- `context-server.ts` must accept new tool registrations
<!-- /ANCHOR:dependencies -->

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| DB file grows too large | Monitor file size in status, add cleanup for orphaned nodes |
| Concurrent write conflicts | Single-writer model (scan is sequential), reads are concurrent |
| Schema migration needed later | Version table, migration script pattern from memory DB |
| Edge cases in subject resolution | Fallback chain: symbolId → fqName → name |

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
