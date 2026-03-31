---
title: "Feature Specification: Hybrid [02--system-spec-kit/023-esm-module-compliance/007-hybrid-search-null-db-fix/spec]"
description: "The hybrid search pipeline returns 0 results for all queries because search-time filters eliminate every candidate after ESM migration follow-on changes."
trigger_phrases:
  - "hybrid search null db"
  - "search returns 0 results"
  - "memory search broken"
  - "ftssearch db null"
  - "vector search null reference"
  - "esm module duplication search"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Hybrid Search Pipeline Null DB Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-review-remediation |
| **Successor** | 008-spec-memory-compliance-audit |
| **Handoff Criteria** | `memory_search` returns results for known matching queries and the search optimization follow-on tasks are captured with verification evidence |

This is **Phase 7** of the ESM Module Compliance specification. It restores hybrid search correctness first, then records the follow-on search quality improvements applied after the initial fix.
<!-- /ANCHOR:phase-context -->

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

**Phase 1 root cause (resolved):** Two bugs caused the 0-result failure — scope enforcement (opt-out instead of opt-in) and TRM state filter (minState='WARM' excluded all UNKNOWN-state memories).

**Phase 2 expanded scope (10 optimization areas from deep research):** Following 10 iterations of deep research after the null-DB fix, analysis of the live search pipeline revealed 10 additional correctness and performance gaps:

1. **RRF K-value mis-tuned** — k=60 (tuned for 10k+ document corpora) inflates scores for a 999-memory DB; k=40 better separates signal from noise
2. **Token budget under-provisioned** — 1500-token limit truncates long memories; 2500 tokens matches p95 memory length
3. **Deprecated tier filter asymmetry** — sqlite-fts.ts and bm25-index.ts filter `status != 'deprecated'` via different clauses, creating inconsistent recall
4. **R12 expansion gate too strict** — embedding-expansion.ts requires R12 relevance score ≥ 0.82 before expanding candidates, blocking useful expansions
5. **Cross-encoder metadata split + MMR skip** — stage3-rerank.ts applies cross-encoder to title+body concatenation; should split scoring; MMR diversity pass skipped when reranker is unavailable
6. **Compound-term FTS5 expansion missing** — multi-word queries (e.g. "spec kit") not expanded to FTS5 phrase variants in bm25-index.ts
7. **related_memories format mismatch + Stage 2 injection gap** — co-activation.ts returns IDs in wrong format; stage2-fusion.ts never injects co-activated memories into fusion candidates
8. **Quality score backfill gap** — 520 memories have quality_score=0.0 (never scored); save-quality-gate.ts does not backfill on read
9. **Lineage gap for chunk children** — chunking-orchestrator.ts does not write parent_id for chunk children, breaking lineage traversal
10. **Per-stage timing not persisted + cache counters absent** — hybrid-search.ts logs stage durations to console only; embedding-cache.ts has no hit/miss counters

### Purpose
Restore hybrid search functionality so that `memory_search` and `memory_context` return relevant results from the 999-memory database, enabling context retrieval across all workflows. Then apply 10 targeted optimizations to improve recall quality, result diversity, and operational observability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Original scope (complete):**
- Diagnose why `db` and/or `vectorSearchFn` are null in hybrid-search.js at search time
- Confirm or rule out ESM module duplication as root cause
- Fix the null reference issue (scope enforcement opt-in + TRM state filter removal)
- Verify search returns results after fix

**Expanded scope — 10 optimization areas (Phase 4):**
1. RRF K-value adjustment: k=60 → k=40 in `shared/algorithms/rrf-fusion.ts`
2. Token budget increase: 1500 → 2500 tokens in `handlers/memory-search.ts` and `architecture/layer-definitions.ts`
3. Deprecated tier filter symmetry fix in `sqlite-fts.ts` and `bm25-index.ts`
4. R12 expansion gate relaxation (threshold 0.82 → 0.72) in `embedding-expansion.ts` and `stage1-candidate-gen.ts`
5. Cross-encoder metadata split + MMR diversity pass in `stage3-rerank.ts`
6. Compound-term FTS5 phrase expansion in `bm25-index.ts`
7. related_memories format fix + Stage 2 co-activation injection in `stage2-fusion.ts` and `co-activation.ts`
8. Quality score backfill for 520 zero-score memories in `save-quality-gate.ts`
9. Lineage gap fix for chunk children in `chunking-orchestrator.ts`
10. Per-stage timing persistence + cache hit/miss counters in `hybrid-search.ts` and `embedding-cache.ts`

### Out of Scope
- Embedding provider changes — Voyage AI working correctly
- Database schema changes — schema is correct
- FTS5 index rebuild — index is populated and valid
- Trigger system changes — working correctly
- Search algorithm wholesale replacement

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/dist/lib/search/hybrid-search.js` | Modify (complete) | Diagnostic logging; null db/vectorSearchFn fix |
| `mcp_server/dist/core/db-state.js` | Modify (complete) | Rebind fix |
| `mcp_server/lib/search/hybrid-search.ts` | Modify (complete) | TS source sync; Phase 4: per-stage timing persistence |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify (Phase 4) | Scope enforcement + R12 gate relaxation |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify (Phase 4) | Co-activation injection |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modify (Phase 4) | Cross-encoder metadata split + MMR diversity pass |
| `mcp_server/lib/search/sqlite-fts.ts` | Modify (Phase 4) | Deprecated tier filter symmetry |
| `mcp_server/lib/search/bm25-index.ts` | Modify (Phase 4) | Deprecated tier filter + compound-term FTS5 expansion |
| `mcp_server/lib/search/embedding-expansion.ts` | Modify (Phase 4) | R12 expansion gate threshold |
| `mcp_server/lib/search/embedding-cache.ts` | Modify (Phase 4) | Hit/miss counters |
| `mcp_server/lib/search/co-activation.ts` | Modify (Phase 4) | related_memories format fix |
| `mcp_server/lib/search/chunking-orchestrator.ts` | Modify (Phase 4) | Lineage parent_id for chunk children |
| `mcp_server/lib/quality/save-quality-gate.ts` | Modify (Phase 4) | Quality score backfill for zero-score memories |
| `mcp_server/lib/shared/algorithms/rrf-fusion.ts` | Modify (Phase 4) | RRF k-value 60 → 40 |
| `mcp_server/lib/handlers/memory-search.ts` | Modify (Phase 4) | Token budget 1500 → 2500 |
| `mcp_server/lib/architecture/layer-definitions.ts` | Modify (Phase 4) | Token budget constant update |

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

### P1 - Phase 4 Optimization Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | RRF k-value tuned for corpus size | `rrf-fusion.ts` uses k=40; score distribution improves for 999-memory DB |
| REQ-007 | Token budget supports long memories | `memory-search.ts` and `layer-definitions.ts` use 2500-token limit; no truncation at p95 |
| REQ-008 | Deprecated tier filter consistent across channels | `sqlite-fts.ts` and `bm25-index.ts` use identical exclusion clause |
| REQ-009 | R12 expansion gate permits more candidates | `embedding-expansion.ts` threshold ≤ 0.72; expansion activates for borderline relevance |
| REQ-010 | Cross-encoder scores title and body independently | `stage3-rerank.ts` splits metadata before scoring; MMR diversity applied when reranker absent |
| REQ-011 | Multi-word queries expanded to FTS5 phrase variants | `bm25-index.ts` generates phrase+token variants for compound terms |
| REQ-012 | Co-activated memories enter fusion candidates | `co-activation.ts` returns correct ID format; `stage2-fusion.ts` injects co-activated set |
| REQ-013 | Zero-score memories receive quality scores on read | `save-quality-gate.ts` backfills quality_score for 520 un-scored memories |
| REQ-014 | Chunk children record parent_id | `chunking-orchestrator.ts` writes parent_id on chunk creation |
| REQ-015 | Stage timing and cache metrics observable | `hybrid-search.ts` persists per-stage durations; `embedding-cache.ts` tracks hit/miss counts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:investigation -->
### Investigation Findings

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
