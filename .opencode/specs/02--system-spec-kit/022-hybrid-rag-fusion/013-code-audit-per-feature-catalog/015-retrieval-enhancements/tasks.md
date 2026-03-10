# Tasks — 015 Retrieval Enhancements

## Summary

| Priority | Count |
|----------|-------|
| P0       | 3     |
| P1       | 7     |
| P2       | 7     |
| **Total** | **17** |

---

## P0 — FAIL (Immediate Fix)

### T-01: Correct feature catalog source mapping for tier-2 fallback channel forcing
- **Priority:** P0
- **Feature:** F-07 Tier-2 fallback channel forcing
- **Status:** TODO
- **Source:** `feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md:15-17`; `mcp_server/lib/search/hybrid-search.ts:544-546,1433-1441`
- **Issue:** Feature doc maps implementation to `channel-enforcement.ts`/`channel-representation.ts`, but `forceAllChannels` behavior is actually in `hybrid-search.ts`. Regression test `C138-P0-FB-T2` exists in `hybrid-search.vitest.ts`, not in the listed test set.
- **Fix:** Update feature catalog implementation and test mappings to reference `hybrid-search.ts` and `hybrid-search.vitest.ts` as the authoritative sources.

### T-02: Replace placeholder channel tests with executable assertions
- **Priority:** P0
- **Feature:** F-07 Tier-2 fallback channel forcing
- **Status:** TODO
- **Source:** `mcp_server/tests/channel.vitest.ts:6-39`
- **Issue:** `channel.vitest.ts` is placeholder/deferred and does not assert feature behavior. Listed channel test files contain no `forceAllChannels`/`C138-P0-FB-T2` assertions.
- **Fix:** Replace placeholder assertions in `channel.vitest.ts` with executable behavior-specific tests, or move ownership fully to hybrid-search tests with clear traceability.

### T-03: Correct provenance envelope source mapping and add trace tests
- **Priority:** P0
- **Feature:** F-08 Provenance-rich response envelopes
- **Status:** TODO
- **Source:** `feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:5,13-17`; `mcp_server/handlers/memory-search.ts:617-620,873-882`; `mcp_server/formatters/search-results.ts:80-112,366-387`
- **Issue:** Provenance payload (`scores`, `source`, `trace`, `includeTrace`) is implemented in `formatters/search-results.ts` and `handlers/memory-search.ts`, but feature lists `lib/response/envelope.ts` (a generic wrapper) as the owner. Listed tests do not assert trace/provenance fields when `includeTrace` is enabled.
- **Fix:** Update source mapping to include provenance owner files. Add tests validating `includeTrace` gating and required `scores/source/trace` keys at formatter/handler integration level.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-04: Add token-estimate enforcement at hook output boundaries
- **Priority:** P1
- **Feature:** F-01 Dual-scope memory auto-surface
- **Status:** TODO
- **Source:** `mcp_server/hooks/memory-surface.ts:52-53,216-219,257-259`
- **Issue:** 4,000-token budgets are constants but enforcement is heuristic (result caps) rather than measured token accounting, causing drift from actual token usage.
- **Fix:** Add explicit token-estimate enforcement or truncation at hook output boundaries for both dispatch and compaction lifecycle paths.

### T-05: Replace wildcard barrel re-exports with explicit named exports
- **Priority:** P1
- **Feature:** F-01 Dual-scope memory auto-surface / F-09 Contextual tree injection
- **Status:** TODO
- **Source:** `mcp_server/lib/providers/embeddings.ts:9`; `mcp_server/lib/search/vector-index.ts:6-10`; `mcp_server/lib/utils/path-security.ts:7`
- **Issue:** Wildcard barrel re-exports violate the explicit-named-exports standard, affecting both F-01 and F-09 implementation surfaces.
- **Fix:** Replace `export *` with explicit named exports in all three files.

### T-06: Replace empty catch blocks with typed logged handling
- **Priority:** P1
- **Feature:** F-01 Dual-scope memory auto-surface
- **Status:** TODO
- **Source:** `mcp_server/lib/search/vector-index-queries.ts:552-553`; `mcp_server/lib/search/vector-index-schema.ts:790-791`
- **Issue:** Empty catch blocks silently swallow errors, hiding failures during production debugging.
- **Fix:** Replace empty catch blocks with typed error handling that logs minimal context (operation, error type).

### T-07: Add context-server dispatch branch to feature source table
- **Priority:** P1
- **Feature:** F-01 Dual-scope memory auto-surface
- **Status:** TODO
- **Source:** `feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:7`; `mcp_server/context-server.ts:279-302`
- **Issue:** Feature describes memory-aware tools handled by a context-server pre-dispatch branch, but that implementation surface is not included in the source table.
- **Fix:** Add `context-server.ts:279-302` to the feature catalog source table.

### T-08: Align summary search channel docs with implementation contract
- **Priority:** P1
- **Feature:** F-05 Memory summary search channel
- **Status:** TODO
- **Source:** `feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md:9,23-27`; `mcp_server/lib/search/memory-summaries.ts:14-18,160-164`; `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:515-556`
- **Issue:** Feature says `querySummaryEmbeddings()` returns `PipelineRow` but implementation returns `SummarySearchResult[]` with conversion happening later in Stage 1. Stage-1 merge/filter behavior is omitted from the feature source table.
- **Fix:** Align docs with implementation contract (`SummarySearchResult[]` + Stage-1 adaptation). Update feature source table to include pipeline integration files.

### T-09: Add logging for exception fallback paths in entity linker
- **Priority:** P1
- **Feature:** F-06 Cross-document entity linking
- **Status:** TODO
- **Source:** `mcp_server/lib/search/entity-linker.ts:166-167,180-181`
- **Issue:** Two DB helper paths swallow exceptions without logging, hiding failure causes.
- **Fix:** Add lightweight logging for exception fallback paths in `getEdgeCount`/`getSpecFolder`.

### T-10: Calibrate header-overhead reservation to actual header length
- **Priority:** P1
- **Feature:** F-09 Contextual tree injection
- **Status:** TODO
- **Source:** `mcp_server/lib/search/hybrid-search.ts:958-960,1280-1283`
- **Issue:** Header-overhead reservation assumes ~12 tokens/result, but header strings can reach 100 chars, underestimating budget overhead in tight limits.
- **Fix:** Calibrate header-overhead reservation using the actual injected header length or measured token estimate rather than a fixed 12-token constant.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-11: Add hook-level tests for dispatch and compaction paths
- **Priority:** P2
- **Feature:** F-01 Dual-scope memory auto-surface
- **Status:** TODO
- **Source:** `mcp_server/hooks/memory-surface.ts:196-260`; `feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:54-79`
- **Issue:** No listed test directly exercises `autoSurfaceAtToolDispatch`/`autoSurfaceAtCompaction` behavior (skip rules, context extraction, lifecycle-point differences). A listed test file `retry.vitest.ts` is missing.
- **Fix:** Add dedicated hook-level tests for dispatch and compaction paths. Remove or restore stale `retry.vitest.ts` reference.

### T-12: Add integration test for constitutional memory enrichment in auto-surface
- **Priority:** P2
- **Feature:** F-02 Constitutional memory as expert-knowledge injection
- **Status:** TODO
- **Source:** `mcp_server/tests/retrieval-directives.vitest.ts:1-10`; `mcp_server/hooks/memory-surface.ts:151-157`; `mcp_server/lib/search/retrieval-directives.ts:329-332`
- **Issue:** No integration assertion that the memory-surface hook path emits enriched constitutional entries during auto-surface. File-read failures silently swallowed without telemetry.
- **Fix:** Add integration tests from `autoSurfaceMemories` output through `retrieval_directive` population. Log non-fatal read failures with minimal context.

### T-13: Hook cache invalidation and add cache behavior tests
- **Priority:** P2
- **Feature:** F-03 Spec folder hierarchy as retrieval structure
- **Status:** TODO
- **Source:** `mcp_server/lib/search/spec-folder-hierarchy.ts:20-38`
- **Issue:** `invalidateHierarchyCache()` is defined but appears unhooked; hierarchy updates can remain stale until TTL expiry. No tests cover cache TTL or explicit invalidation.
- **Fix:** Invoke `invalidateHierarchyCache()` on save/index operations. Add tests for cache hit, cache expiry, and explicit invalidation.

### T-14: Add Stage-1 summary-channel integration tests
- **Priority:** P2
- **Feature:** F-05 Memory summary search channel
- **Status:** TODO
- **Source:** `mcp_server/tests/memory-summaries.vitest.ts:441-527`; `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:515-556`
- **Issue:** Listed tests validate summarization primitives but do not validate Stage-1 channel merge, dedupe priority, and quality-threshold filtering behavior.
- **Fix:** Add integration tests for Stage-1 summary-channel merge, dedupe priority, and quality-threshold filtering.

### T-15: Add batched edge-count retrieval test
- **Priority:** P2
- **Feature:** F-06 Cross-document entity linking
- **Status:** TODO
- **Source:** `mcp_server/lib/search/entity-linker.ts:250-282,306-319`; `mcp_server/tests/entity-linker.vitest.ts:264-300`
- **Issue:** No direct assertion of the batch edge-count path used to avoid per-pair query amplification.
- **Fix:** Add a targeted test to verify batched edge-count retrieval behavior remains in use.

### T-16: Add post-truncation ordering and budget interaction tests
- **Priority:** P2
- **Feature:** F-09 Contextual tree injection
- **Status:** TODO
- **Source:** `mcp_server/tests/hybrid-search-context-headers.vitest.ts:16-60`; `mcp_server/lib/search/hybrid-search.ts:957-965,1001-1005`
- **Issue:** Dedicated context-header tests validate format and null-content skip but do not assert post-truncation ordering and budget interaction. A listed test file `retry.vitest.ts` is missing.
- **Fix:** Add integration tests proving "truncate first, inject second" under constrained budgets and flag toggles. Remove stale `retry.vitest.ts` reference.

### T-17: Replace deferred envelope test assertions with real validation
- **Priority:** P2
- **Feature:** F-08 Provenance-rich response envelopes
- **Status:** TODO
- **Source:** `mcp_server/tests/mcp-response-envelope.vitest.ts:135-147`
- **Issue:** `mcp-response-envelope.vitest.ts` contains deferred/pass-through branches that allow success without validating real envelope payload fields.
- **Fix:** Replace deferred branches with assertions that validate actual envelope payload fields.
