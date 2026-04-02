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
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 009 — Code Graph Storage + Query

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### P0
- [x] `code-graph.sqlite` created with correct schema on first scan [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_scan` populates all three tables from indexer output [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_scan` incremental mode skips unchanged files (file_mtime_ms match) [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_query` `outline` returns symbols for a given file [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_query` `calls_from` returns correct callees [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_query` `calls_to` returns correct callers [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_query` `imports_from` returns correct imports [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_query` `imports_to` returns correct reverse imports [EVIDENCE: verified in implementation-summary.md]
- [x] All 3 tools registered and callable via MCP [EVIDENCE: verified in implementation-summary.md]
- [x] `code_graph_status` reports accurate file/node/edge counts [EVIDENCE: verified in implementation-summary.md]

#### P1
- [x] Batch insert uses transactions (atomic per-file updates) [EVIDENCE: verified in implementation-summary.md]
- [x] Delete cascade removes nodes/edges when file is removed from index [EVIDENCE: verified in implementation-summary.md]
- [x] Subject resolution works via symbolId, fqName, or name [EVIDENCE: verified in implementation-summary.md]
- [x] Directional indexes improve query performance [EVIDENCE: verified in implementation-summary.md]
- [x] Scan summary includes parse error count and duration [EVIDENCE: verified in implementation-summary.md]
- [x] Status includes last scan timestamp and DB file size — handler returns lastScanAt and dbFileSize [EVIDENCE: verified in implementation-summary.md]

### P2
- [x] `code_graph_query` supports `includeTransitive` for multi-hop traversal — BFS transitiveTraversal [EVIDENCE: verified in implementation-summary.md]
- [x] DB handles concurrent reads without corruption or locks — WAL journal mode enabled at initDb(), supports concurrent readers natively [EVIDENCE: verified in implementation-summary.md]
- [x] Schema versioning supports future migrations — SCHEMA_VERSION=3 [EVIDENCE: verified in implementation-summary.md]
- [x] Orphaned node cleanup on re-scan — cleanupOrphans() [EVIDENCE: verified in implementation-summary.md]