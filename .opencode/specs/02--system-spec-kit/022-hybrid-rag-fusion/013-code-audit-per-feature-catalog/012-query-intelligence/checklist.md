## F-01: Query complexity router
- **Status:** FAIL
- **Code Issues:** 1) Tier classification currently ignores `charCount` and `stopWordRatio`; routing decisions are based only on trigger match and term count (`mcp_server/lib/search/query-classifier.ts:173-179`), which conflicts with the feature claim (`feature_catalog/12--query-intelligence/01-query-complexity-router.md:7`). 2) Classifier docs state the disabled path is the default (`query-classifier.ts:132-134`), but the flag helper defaults to enabled unless explicitly `false` (`query-classifier.ts:43-46`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** The CHK-038 trace propagation described in the feature (`01-query-complexity-router.md:11`) is implemented in `hybrid-search.ts`/formatter flow, but that implementation surface is not represented in this feature's listed source files.
- **Test Gaps:** Listed tests do not exercise `traceMetadata.queryComplexity` propagation or response-envelope fallback (`query-classifier.vitest.ts`, `query-router.vitest.ts`, `query-router-channel-interaction.vitest.ts` have no `traceMetadata`/`queryComplexity` assertions).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Either incorporate `charCount` and `stopWordRatio` into tier routing, or update Current Reality text to match actual logic. 2) Add integration tests that assert `routeResult.tier -> traceMetadata.queryComplexity -> formatter output`.

## F-02: Relative score fusion in shadow mode
- **Status:** WARN
- **Code Issues:** 1) RSF fusion algorithms exist (`mcp_server/lib/search/rsf-fusion.ts:87-391`), but runtime integration is not active in the primary hybrid search path (only `rsfShadow` metadata type remains in `mcp_server/lib/search/hybrid-search.ts:123-124`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Feature text says RSF runs alongside RRF in shadow mode (`02-relative-score-fusion-in-shadow-mode.md:5-9`), but the same feature also states the RSF branch was removed (`02-relative-score-fusion-in-shadow-mode.md:11`). Current code reflects the removed-branch state.
- **Test Gaps:** Listed tests validate RSF/RRF math (`rrf-fusion.vitest.ts`, `rsf-fusion.vitest.ts`, `rsf-fusion-edge-cases.vitest.ts`, `unit-rrf-fusion.vitest.ts`) but do not verify pipeline-level shadow logging/comparison output.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Clarify feature status (dormant utility vs active shadow mode). 2) If shadow mode is intended, add explicit pipeline invocation + trace assertions.

## F-03: Channel min-representation
- **Status:** FAIL
- **Code Issues:** 1) `analyzeChannelRepresentation` appends promoted items but does not re-sort (`mcp_server/lib/search/channel-representation.ts:173-182`), while feature reality says full set is re-sorted (`03-channel-min-representation.md:9`). 2) Re-sort is currently done by a different wrapper (`mcp_server/lib/search/channel-enforcement.ts:110-114`) that is not listed in the feature implementation table (`03-channel-min-representation.md:17`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** The documented "append + re-sort" behavior is not guaranteed by the listed implementation file alone.
- **Test Gaps:** 1) `channel-representation.vitest.ts` has no ordering assertions after promotions. 2) `channel.vitest.ts` is placeholder-only (`expect(true)` stubs at lines 10-40) and does not validate real channel behavior.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Re-sort inside `analyzeChannelRepresentation` or explicitly document/require wrapper usage. 2) Replace placeholder channel tests with behavioral assertions.

## F-04: Confidence-based result truncation
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** NONE

## F-05: Dynamic token budget allocation
- **Status:** WARN
- **Code Issues:** 1) CHK-060 header-overhead logic is implemented in `mcp_server/lib/search/hybrid-search.ts:958-961`, but `hybrid-search.ts` is not listed in this feature's implementation table (`05-dynamic-token-budget-allocation.md:17-19`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Runtime behavior matches the narrative, but feature source mapping is incomplete for the documented budget-adjustment path.
- **Test Gaps:** 1) `dynamic-token-budget.vitest.ts` validates tier budgets/flag behavior but not `SPECKIT_CONTEXT_HEADERS` overhead subtraction and 200-token floor. 2) `token-budget.vitest.ts` validates generic truncation/env-budget behavior, not the CHK-060 adjusted-budget path.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Add `hybrid-search.ts` to the feature implementation list. 2) Add explicit tests for `adjustedBudget = max(dynamicBudget - (resultCount * 12), 200)`.

## F-06: Query expansion
- **Status:** FAIL
- **Code Issues:** 1) Listed test file `mcp_server/tests/retry.vitest.ts` is missing (declared in `06-query-expansion.md:72`; path does not exist in repo). 2) Stage-1 baseline+expanded parallel execution and baseline-first dedup are implemented in `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:316-349`, but this file is not listed in the feature implementation table (`06-query-expansion.md:17-52`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** The documented Stage-1 orchestration behavior (`06-query-expansion.md:7`) relies on implementation outside the listed source table, so cataloged implementation scope is incomplete.
- **Test Gaps:** 1) Missing listed test file (`mcp_server/tests/retry.vitest.ts`). 2) Listed tests (`embedding-expansion.vitest.ts`, `query-expander.vitest.ts`, etc.) do not assert Stage-1 parallel baseline-first dedup behavior.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1) Replace stale test references with existing relevant tests. 2) Add Stage-1 orchestration tests and include `stage1-candidate-gen.ts` in implementation sources.
