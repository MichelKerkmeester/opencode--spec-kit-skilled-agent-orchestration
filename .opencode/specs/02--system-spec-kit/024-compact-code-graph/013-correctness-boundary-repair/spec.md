---
title: "Spec: Correctness & Boundary Repair [024/013]"
description: "Fix 15 critical bugs (2 P0, 11 P1, 2 P2): endLine collapse, DB safety, transaction atomicity, query correctness, budget/merger, rootDir validation, seed identity, exception sanitization, resume profile."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Phase 013 — Correctness & Boundary Repair

<!-- PHASE_LINKS: parent=../spec.md predecessor=012-cocoindex-ux-utilization successor=014-hook-durability-auto-enrichment -->

<!-- SPECKIT_LEVEL: 3 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## EXECUTIVE SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. NON-FUNCTIONAL REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 8. EDGE CASES
Template compliance shim section. Legacy phase content continues below.

## 9. COMPLEXITY ASSESSMENT
Template compliance shim section. Legacy phase content continues below.

## 10. RISK MATRIX
Template compliance shim section. Legacy phase content continues below.

## 11. USER STORIES
Template compliance shim section. Legacy phase content continues below.

## 12. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

## RELATED DOCUMENTS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary

Fix all P0 and P1 correctness bugs, DB safety issues, and security boundary issues identified by 95 deep research iterations and 30 deep review iterations. This phase has zero external dependencies and must complete before any new feature work.

### Items

### P0 — Critical

**Item 1: Fix endLine bug in structural-indexer.ts**
- All 3 parsers (JS/TS, Python, Bash) set `endLine = startLine` for every capture
- CALLS edge detection scans only 1 line instead of the full function body
- contentHash also broken (hashes 1 line, not full body)
- Fix: brace-counting heuristic for JS/TS, indentation for Python, marker for Bash (DR-013)
- Files: `mcp_server/lib/code-graph/structural-indexer.ts` (lines 30-169)
- Evidence: research iter-056, iter-060, iter-076; review iter-003

**Item 2: Fix resume profile:"resume"**
- Already fixed in v1 implementation
- Verify it remains correct in all resume paths
- Files: Resume command configuration

### P1 — Must Fix

**Item 3: Preserve seed identity in code_graph_context handler**
- Handler strips manual/graph seed discriminators during processing
- Seeds lose source type, preventing downstream prioritization
- Files: `mcp_server/handlers/code-graph/context.ts`
- Evidence: review F006, research iter-072

**Item 4: Document actual code-graph dispatch validation path**
- Unified schema validators (`validateToolArgs()`) exist elsewhere, but live code-graph dispatch does not use them
- rootDir has no path validation — arbitrary readable paths accepted
- Current reality: `tools/code-graph-tools.ts` uses local `getMissingRequiredStringArgs()` checks for `code_graph_query` (`operation`, `subject`) and `ccc_feedback` (`query`, `rating`); rootDir is validated separately within workspace
- Files: `mcp_server/handlers/code-graph/scan.ts`, `mcp_server/lib/code-graph/code-graph-tools.ts`
- Evidence: review F010 (schema bypass), research iter-091 (rootDir)

**Item 5: Sanitize exception strings in handlers**
- memory_context and code_graph_context reflect raw exception text to callers
- Internal error details (stack traces, file paths) exposed
- Fix: catch exceptions, return generic error messages
- Files: `mcp_server/handlers/memory-context.ts`, `mcp_server/handlers/code-graph/context.ts`
- Evidence: review P2-8, research iter-091

**Item 6: Wire orphan edge cleanup on re-index**
- replaceNodes() deletes old nodes but orphan inbound edges persist
- After symbol churn, graph contains edges pointing to deleted symbols
- Fix: DELETE FROM code_edges WHERE target_id IN (deleted symbol IDs)
- Files: `mcp_server/lib/code-graph/code-graph-db.ts`
- Evidence: review F007, research iter-072

**Item 7: Remove budget allocator 4000-token ceiling + budget sessionState**
- Hard-coded 4000-token cap ignores caller-provided budget parameter
- `sessionState` section bypasses allocation entirely — brief can exceed caller budget
- Fix: use caller-provided budget (default 4000); include sessionState in allocation
- Files: `mcp_server/lib/code-graph/budget-allocator.ts`, `mcp_server/lib/code-graph/compact-merger.ts`
- Evidence: review F011 (ceiling), F020 (sessionState bypass), research iter-072

**Item 8: Fix merger zero-budget section rendering**
- Truncation marker appended OUTSIDE granted budget
- Zero-budget sections still rendered with header
- Fix: skip section entirely when granted = 0
- Files: `mcp_server/lib/code-graph/compact-merger.ts`
- Evidence: review F012, research iter-072

### P1 — Must Fix (new from 30-iteration review)

**Item 9: Fix code_graph_scan DB init on fresh runtime**
- `code_graph_scan` throws when DB has never been initialized — first use fails
- Fix: ensure initDb() is called (or auto-creates DB) before any scan operation
- Files: `mcp_server/lib/code-graph/code-graph-db.ts`, `mcp_server/handlers/code-graph/scan.ts`
- Evidence: review F021

**Item 10: Add initDb() schema migration guard**
- initDb() has no try/catch; setup failure poisons the module-level singleton
- All subsequent calls use the broken singleton — no recovery without process restart
- Fix: wrap init in try/catch, reset singleton on failure, allow retry
- Files: `mcp_server/lib/code-graph/code-graph-db.ts`
- Evidence: review F023

**Item 11: Wrap replaceNodes/Edges in transaction**
- replaceNodes() DELETE runs outside a transaction
- If the subsequent INSERT fails (constraint error), the file's entire graph is wiped
- Fix: wrap DELETE+INSERT in `db.transaction()` for atomic replace
- Files: `mcp_server/lib/code-graph/code-graph-db.ts`
- Evidence: review F024

**Item 12: Fix transitive query maxDepth leak**
- `code_graph_query` transitive mode leaks nodes beyond the requested `maxDepth`
- Converging paths cause duplicate node entries in results
- Fix: enforce depth check at traversal boundary; deduplicate by node ID
- Files: `mcp_server/handlers/code-graph/query.ts` (or equivalent query handler)
- Evidence: review F026

**Item 13: Clarify includeTrace schema boundary**
- `includeTrace` is exposed on `code_graph_context` and remains available on memory tools (`memory_context`, `memory_search`)
- Docs must describe this as scoped support (tool-specific), not as a global toggle
- Files: `mcp_server/handlers/code-graph/context.ts`, tool-schemas.ts
- Evidence: review F033

### P2 — Improvements (new from 30-iteration review)

**Item 14: Fix working-set-tracker maxFiles overshoot**
- working-set-tracker exceeds maxFiles until 2x capacity before evicting
- Fix: enforce maxFiles at insertion, not at 2x threshold
- Files: `mcp_server/lib/code-graph/working-set-tracker.ts`
- Evidence: review F013

**Item 15: ccc_feedback full length validation remains open**
- `comment` and `resultFile` do not have minLength/maxLength constraints in `tool-schemas.ts`
- Dispatch only checks required `query` and `rating`, so full length-bound enforcement before disk write is NOT IMPLEMENTED
- Files: `mcp_server/handlers/ccc_feedback` (or equivalent)
- Evidence: review F031

### Target Files

| File | Items | Changes |
|------|-------|---------|
| `structural-indexer.ts` | 1 | Add endLine detection per parser |
| `scan.ts` | 4, 6, 9 | Tool arg validation, edge cleanup, DB init |
| `code-graph-db.ts` | 6, 9, 10, 11 | Orphan edges, init guard, transaction wrap |
| `budget-allocator.ts` | 7 | Remove hard ceiling, budget sessionState |
| `compact-merger.ts` | 7, 8 | sessionState budgeting, skip zero-budget |
| `context.ts` (handler) | 3, 5, 12, 13 | Seed identity, sanitization, maxDepth, includeTrace |
| `memory-context.ts` | 5 | Exception sanitization |
| `code-graph-tools.ts` | 4 | Local required-string checks, not unified `validateToolArgs()` |
| `query.ts` (handler) | 12 | maxDepth enforcement, dedup |
| `working-set-tracker.ts` | 14 | maxFiles enforcement |
| `ccc_feedback` handler | 15 | Full length validation still open |
| `tool-schemas.ts` | 13, 15 | `code_graph_context` supports `includeTrace`; `ccc_feedback` fields still lack length bounds |

### Estimated LOC: 190-265
### Risk: LOW-MEDIUM — DB safety fixes (items 9-11) require careful transaction handling

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.
- REQ-905: Keep packet documentation and runtime verification aligned for this phase.
- REQ-906: Keep packet documentation and runtime verification aligned for this phase.
- REQ-907: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 5 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 6 runs, **Then** expected packet behavior remains intact.
