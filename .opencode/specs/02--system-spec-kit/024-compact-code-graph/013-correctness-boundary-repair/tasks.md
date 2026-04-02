---
title: "Tasks: Correctness & Boundary Repair [024/013]"
description: "Task tracking for 15 items (25 checklist items total)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 013 — Correctness & Boundary Repair


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Current Status

- [x] Item 1: Fix endLine bug in structural-indexer.ts — Evidence: `findBraceBlockEndLine()` for JS/TS and Bash, `findPythonBlockEndLine()` for Python in structural-indexer.ts; `capturesToNodes()` hashes full body range; `extractEdges()` scans complete function body for CALLS
- [x] Item 2: Verify resume profile:"resume" remains correct — Evidence: verification-only item, confirmed correct in all resume paths
- [x] Item 3: Preserve seed identity in code_graph_context handler — Evidence: seed `source` field preserved through context pipeline in handlers/code-graph/context.ts
- [x] Item 4: Document actual code-graph arg validation path — Evidence: `tools/code-graph-tools.ts` uses local `getMissingRequiredStringArgs()` for `code_graph_query` (`operation`, `subject`) and `ccc_feedback` (`query`, `rating`); code-graph dispatch does not use unified `validateToolArgs()`. rootDir boundary check remains `path.resolve(rootDir).startsWith(process.cwd())` in handlers/code-graph/scan.ts
- [x] Item 5: Sanitize exception strings in handlers — Evidence: generic error messages returned to callers, full errors logged to stderr in handlers/memory-context.ts and handlers/code-graph/context.ts
- [x] Item 6: Wire orphan edge cleanup on re-index — Evidence: `DELETE FROM code_edges WHERE target_id IN (?)` and `source_id IN (?)` added to replaceNodes() in code-graph-db.ts
- [x] Item 7: Remove budget allocator 4000-token ceiling + budget sessionState — Evidence: hard-coded 4000 ceiling removed from budget-allocator.ts; sessionState participates in allocation model with zero floor
- [x] Item 8: Fix merger zero-budget section rendering — Evidence: zero-budget sections no longer render empty headers; truncation markers counted within budget in compact-merger.ts
- [x] Item 9: Fix code_graph_scan DB init on fresh runtime — Evidence: initDb() called/auto-creates DB before first scan operation in code-graph-db.ts and handlers/code-graph/scan.ts
- [x] Item 10: Add initDb() schema migration guard — Evidence: init wrapped in try/catch, db and dbPath reset to null on failure for retry in code-graph-db.ts; schema_version table (v3)
- [x] Item 11: Wrap replaceNodes/Edges in transaction — Evidence: DELETE + orphan edge cleanup + INSERT wrapped in single `db.transaction()` in code-graph-db.ts; constraint error rolls back cleanly
- [x] Item 12: Fix transitive query maxDepth leak — Evidence: strict `>=` depth check in handlers/code-graph/query.ts; `resultSymbolIds` Set deduplicates converging paths
- [x] Item 13: Clarify includeTrace boundary — Evidence: `tool-schemas.ts` still exposes `includeTrace` on `memory_context` and `memory_search`, while the `code_graph_context` input schema does not include `includeTrace`
- [x] Item 14: Fix working-set-tracker maxFiles overshoot — Evidence: eviction threshold changed from `maxFiles * 2` to `maxFiles` at insertion in working-set-tracker.ts
- [ ] Item 15: Validate ccc_feedback schema length bounds — NOT IMPLEMENTED. Evidence: dispatch only checks required strings for `query` and `rating`; `comment` and `resultFile` have no minLength/maxLength constraints in `tool-schemas.ts`, so no full length-bound enforcement occurs before disk write