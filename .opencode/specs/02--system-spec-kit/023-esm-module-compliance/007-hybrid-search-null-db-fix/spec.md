---
title: "Feature Specification: Hybrid Search Pipeline Null DB Fix"
description: "The hybrid search pipeline returns 0 results for ALL queries because module-level db/vectorSearchFn references in hybrid-search.js are null at search time, likely due to ESM module duplication."
trigger_phrases:
  - "hybrid search null db"
  - "search returns 0 results"
  - "memory search broken"
  - "ftsSearch db null"
  - "vector search null reference"
  - "ESM module duplication search"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | memory_search returns >0 results for queries matching existing memories |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 7** of the ESM Module Compliance specification — fixing a critical search pipeline failure caused by the ESM migration.

**Scope Boundary**: Only the hybrid search pipeline's null reference issue. No changes to search algorithms, ranking, or indexing.

**Dependencies**:
- Phases 001-006 (ESM migration completed)

**Deliverables**:
- Confirmed root cause (null db vs ESM duplication vs other)
- Fix applied and verified
<!-- /ANCHOR:phase-context -->

---

# Feature Specification: Hybrid Search Pipeline Null DB Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-30 |
| **Branch** | `main` (phase of 023-esm-module-compliance) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec Kit Memory MCP server's hybrid search pipeline returns **0 results for ALL queries**. The `memory_search` tool, `memory_context` tool, and all search-dependent operations produce empty results regardless of query content. The trigger system (phrase matching) and `memory_list` work correctly, confirming the database contains valid data (999 memories, 996 with embeddings, 999 in FTS5).

### Purpose
Restore hybrid search functionality so that `memory_search` and `memory_context` return relevant results from the 999-memory database, enabling context retrieval across all workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Diagnose why `db` and/or `vectorSearchFn` are null in hybrid-search.js at search time
- Confirm or rule out ESM module duplication as root cause
- Fix the null reference issue
- Verify search returns results after fix

### Out of Scope
- Search algorithm changes (ranking, fusion, reranking) - not broken
- Embedding provider changes - Voyage AI working correctly
- Database schema changes - schema is correct
- FTS5 index rebuild - index is populated and valid
- Trigger system changes - working correctly

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/dist/lib/search/hybrid-search.js` | Modify | Add diagnostic logging; fix null db/vectorSearchFn |
| `mcp_server/dist/core/db-state.js` | Possibly modify | Fix rebind if reinitializeDatabase is the cause |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | TS source (if dist changes need upstream) |

All paths relative to `.opencode/skill/system-spec-kit/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm root cause of null db/vectorSearchFn | Diagnostic logging shows module state at search time |
| REQ-002 | Fix hybrid search to access valid database connection | `memory_search("semantic search")` returns >0 results |
| REQ-003 | Both vector AND FTS5 channels produce candidates | Stage 1 trace shows candidateCount > 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Fix applied to TS source (not just dist) | Source and compiled output are in sync |
| REQ-005 | Remove diagnostic logging after fix confirmed | No debug console.error statements in production |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:investigation -->
## INVESTIGATION FINDINGS

### Evidence Summary

| Check | Result | Implication |
|-------|--------|-------------|
| memory_index count | 999 | Data exists |
| embedding_status = success | 996 | Embeddings generated |
| FTS5 (memory_fts) count | 999 | Full-text index populated |
| active_memory_projection count | 992 | Projection table populated |
| sqlite-vec loaded (lsof) | vec0.dylib loaded | Vector extension available |
| WAL checkpoint | 126/126 frames | Data committed |
| Direct FTS5 SQL | Returns 10+ results for "semantic" OR "search" | Data IS queryable |
| memory_search("CocoIndex") | 0 results | Pipeline broken |
| memory_search("SpecKit Phase System") | 0 results | ALL queries fail |
| memory_search("vector embeddings") | 0 results | Even expanded queries fail |
| memory_match_triggers("CocoIndex") | Finds memory #893 | Trigger path works |
| memory_list(specFolder: "022-mcp-coco") | Returns 6 memories | List path works |
| memory_health | "healthy", vectorSearchAvailable: true | Health check misleading |

### Pipeline Trace Analysis

All queries show identical failure pattern:
- Stage 1 (candidate generation): `candidateCount: 0`, duration 200-550ms
- Stage 2 (fusion): `inputCount: 0`
- Stage 3 (rerank): `inputCount: 0`
- Stage 4 (filter): `evidenceGapDetected: true`

The 200-550ms duration at Stage 1 = Voyage AI embedding API call (succeeds). After embedding returns, channel searches execute against null references, returning empty.

### Root Cause Hypothesis

**Primary**: Module-level `db` and `vectorSearchFn` in `hybrid-search.js` are `null` at search time.

- `ftsSearch()` line 229: `if (!db || !isFtsAvailable()) return [];` — silently returns empty
- Vector channel line 697-698: `if (activeChannels.has('vector') && embedding && vectorSearchFn)` — silently skips
- Both returning empty = 0 candidates = exact observed behavior

**Why null?**: Most likely ESM module duplication — `init()` sets state on one module instance while search functions execute on a different instance. This aligns with the parent spec (023-esm-module-compliance).
<!-- /ANCHOR:investigation -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_search("semantic search")` returns CocoIndex and search-related memories
- **SC-002**: `memory_search("SpecKit Phase System")` returns phase system memories
- **SC-003**: Stage 1 trace shows `candidateCount > 0` with both vector and FTS5 contributing
- **SC-004**: `memory_health` continues to report healthy
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing dist/ directly without TS source sync | Overwritten on next build | Apply fix to TS source first |
| Risk | ESM duplication affects other modules too | Broader system instability | Check module identity in vector-index-store too |
| Risk | Fix requires MCP server restart | Brief search downtime | Plan restart window |
| Dependency | TypeScript compiler | TS source must compile to matching dist | Verify build pipeline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the TS source exist under `mcp_server/lib/` or only compiled `dist/`?
- Was there a recent `reinitializeDatabase()` trigger that could have broken the reference chain?
- Are any other module-level singletons affected by ESM duplication?
<!-- /ANCHOR:questions -->
