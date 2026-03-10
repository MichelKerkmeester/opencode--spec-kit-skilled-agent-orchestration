## F-01: Dual-scope memory auto-surface
- **Status:** WARN
- **Code Issues:**
  1. The 4,000-token budgets are constants/documented targets, but enforcement is heuristic (result caps) rather than measured token accounting; this can drift from actual token usage (`mcp_server/hooks/memory-surface.ts:52-53`, `mcp_server/hooks/memory-surface.ts:216-219`, `mcp_server/hooks/memory-surface.ts:257-259`).
- **Standards Violations:**
  1. Wildcard barrel re-exports are used instead of explicit named exports (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/search/vector-index.ts:6-10`, `mcp_server/lib/utils/path-security.ts:7`).
  2. Empty catch blocks swallow errors silently (`mcp_server/lib/search/vector-index-queries.ts:552-553`, `mcp_server/lib/search/vector-index-schema.ts:790-791`).
- **Behavior Mismatch:**
  1. The feature text describes memory-aware tools being handled by a context-server pre-dispatch branch, but that implementation surface is not included in the listed source table (`feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:7`, `mcp_server/context-server.ts:279-302`).
- **Test Gaps:**
  1. No listed test directly exercises `autoSurfaceAtToolDispatch` / `autoSurfaceAtCompaction` behavior (skip rules, context extraction, and lifecycle-point differences) despite those being core behavior (`mcp_server/hooks/memory-surface.ts:196-260`, listed tests in `feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:54-79`).
  2. A listed test file is missing: `mcp_server/tests/retry.vitest.ts` (`feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md:66`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Add explicit token-estimate enforcement (or truncation) at hook output boundaries for both lifecycle paths.
  2. Replace wildcard re-exports with explicit named exports in the listed implementation surfaces.
  3. Replace empty catch blocks with typed, logged handling.
  4. Add dedicated hook-level tests for dispatch/compaction paths and remove or restore stale test references.

## F-02: Constitutional memory as expert-knowledge injection
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. File-read failures are silently swallowed in enrichment without telemetry (`mcp_server/lib/search/retrieval-directives.ts:329-332`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Tests are strong for extraction/enrichment logic, but there is no integration assertion that the memory-surface hook path actually emits enriched constitutional entries during auto-surface (`mcp_server/tests/retrieval-directives.vitest.ts:1-10`, `mcp_server/hooks/memory-surface.ts:151-157`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Add integration tests from `autoSurfaceMemories` output through `retrieval_directive` population.
  2. Log non-fatal read failures with minimal context (path/id) for diagnosability.

## F-03: Spec folder hierarchy as retrieval structure
- **Status:** WARN
- **Code Issues:**
  1. Cache invalidation is implemented but appears unhooked (definition-only match), so hierarchy updates can remain stale until TTL expiry (`mcp_server/lib/search/spec-folder-hierarchy.ts:20-38`; repo search only finds definition at `mcp_server/lib/search/spec-folder-hierarchy.ts:36`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Tests cover traversal/relevance behavior but do not cover cache TTL behavior or explicit invalidation path (`mcp_server/tests/spec-folder-hierarchy.vitest.ts:8-16`, `mcp_server/tests/spec-folder-hierarchy.vitest.ts:120-220`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Invoke `invalidateHierarchyCache()` on save/index operations that introduce new `spec_folder` values.
  2. Add tests for cache hit, cache expiry, and explicit invalidation.

## F-04: Lightweight consolidation
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** NONE

## F-05: Memory summary search channel
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. The feature description says `querySummaryEmbeddings()` returns `PipelineRow` objects, but implementation returns `SummarySearchResult[]`; conversion to `PipelineRow` happens later in Stage 1 (`feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md:9`, `mcp_server/lib/search/memory-summaries.ts:14-18`, `mcp_server/lib/search/memory-summaries.ts:160-164`, `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:531-545`).
  2. Core Stage-1 merge/filter behavior described in “Current Reality” is implemented in `stage1-candidate-gen.ts` but omitted from the feature source table (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:515-556`, `feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md:23-27`).
- **Test Gaps:**
  1. Listed tests validate summarization/storage/query primitives but do not validate Stage-1 channel merge + dedupe + quality filtering behavior (`mcp_server/tests/memory-summaries.vitest.ts:441-527` vs `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:515-556`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Align docs with implementation contract (`SummarySearchResult[]` + Stage-1 adaptation) or change function contract intentionally.
  2. Add integration tests for Stage-1 summary-channel merge, dedupe priority, and quality-threshold filtering.
  3. Update feature source table to include pipeline integration file(s).

## F-06: Cross-document entity linking
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:**
  1. Two DB helper paths swallow exceptions without logging (`mcp_server/lib/search/entity-linker.ts:166-167`, `mcp_server/lib/search/entity-linker.ts:180-181`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Tests cover linking semantics and density guard, but there is no direct assertion of the batch edge-count path used to avoid per-pair query amplification (`mcp_server/lib/search/entity-linker.ts:250-282`, `mcp_server/lib/search/entity-linker.ts:306-319`; coverage in `mcp_server/tests/entity-linker.vitest.ts:264-300` and related sections).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Add lightweight logging for exception fallback paths in `getEdgeCount`/`getSpecFolder`.
  2. Add a targeted test to verify batched edge-count retrieval behavior remains in use.

## F-07: Tier-2 fallback channel forcing
- **Status:** FAIL
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. The feature doc maps implementation to `channel-enforcement.ts`/`channel-representation.ts`, but `forceAllChannels` behavior is actually implemented in `hybrid-search.ts` (`feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md:15-17`, `mcp_server/lib/search/hybrid-search.ts:544-546`, `mcp_server/lib/search/hybrid-search.ts:1433-1441`).
  2. The doc cites regression `C138-P0-FB-T2`; that test exists in `hybrid-search.vitest.ts`, not in the listed test set (`mcp_server/tests/hybrid-search.vitest.ts:688-730`, `feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md:22-25`).
- **Test Gaps:**
  1. `channel.vitest.ts` is placeholder/deferred and does not assert feature behavior (`mcp_server/tests/channel.vitest.ts:6-39`).
  2. Listed channel test files contain no `forceAllChannels`/`C138-P0-FB-T2` assertions.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Correct the feature catalog implementation/test mappings to include `hybrid-search.ts` and `hybrid-search.vitest.ts`.
  2. Replace placeholder `channel.vitest.ts` assertions with executable, behavior-specific tests.
  3. Add explicit tests in channel-focused suites or move ownership fully to hybrid-search tests with clear traceability.

## F-08: Provenance-rich response envelopes
- **Status:** FAIL
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. The described provenance payload (`scores`, `source`, `trace`, `includeTrace`) is implemented primarily in `formatters/search-results.ts` and `handlers/memory-search.ts`, while listed implementation focus is `lib/response/envelope.ts`, which is a generic envelope wrapper (`feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:5`, `feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:13-17`, `mcp_server/handlers/memory-search.ts:617-620`, `mcp_server/handlers/memory-search.ts:873-882`, `mcp_server/formatters/search-results.ts:80-112`, `mcp_server/formatters/search-results.ts:366-387`, `mcp_server/lib/response/envelope.ts:124-157`).
- **Test Gaps:**
  1. Listed envelope tests do not assert the trace/provenance schema fields when `includeTrace` is enabled (`mcp_server/tests/envelope.vitest.ts:16-54`; no `includeTrace`/trace field assertions).
  2. `mcp-response-envelope.vitest.ts` contains deferred/pass-through branches that allow success without validating real envelope payload fields (`mcp_server/tests/mcp-response-envelope.vitest.ts:135-147`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Update source mapping so provenance owner files (`memory-search.ts`, `search-results.ts`) are explicitly included.
  2. Add tests that validate `includeTrace` gating and required `scores/source/trace` keys.
  3. Keep `envelope.ts` tests for wrapper structure, but separate provenance-contract tests at formatter/handler integration level.

## F-09: Contextual tree injection
- **Status:** WARN
- **Code Issues:**
  1. Header-overhead reservation assumes ~12 tokens/result, but header strings can reach 100 chars; this can underestimate budget overhead in tight limits (`mcp_server/lib/search/hybrid-search.ts:958-960`, `mcp_server/lib/search/hybrid-search.ts:1280-1283`).
- **Standards Violations:**
  1. Wildcard barrel re-exports remain in listed implementation surfaces (`mcp_server/lib/providers/embeddings.ts:9`, `mcp_server/lib/search/vector-index.ts:6-10`, `mcp_server/lib/utils/path-security.ts:7`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Dedicated context-header tests validate format and null-content skip but do not assert post-truncation ordering and budget interaction (`mcp_server/tests/hybrid-search-context-headers.vitest.ts:16-60`, truncation/injection order in `mcp_server/lib/search/hybrid-search.ts:957-965` and `mcp_server/lib/search/hybrid-search.ts:1001-1005`).
  2. A listed test file is missing: `mcp_server/tests/retry.vitest.ts` (`feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md:123`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:**
  1. Calibrate header-overhead reservation using the actual injected header length (or measured token estimate) rather than a fixed 12-token constant.
  2. Add integration tests proving “truncate first, inject second” under constrained budgets and flag toggles.
  3. Remove stale test references or restore missing files.
