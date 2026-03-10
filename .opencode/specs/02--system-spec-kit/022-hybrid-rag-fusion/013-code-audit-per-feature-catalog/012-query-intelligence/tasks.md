# Tasks: 012 — Query Intelligence

**Source:** checklist.md (code audit findings)
**Created:** 2026-03-10
**Features audited:** 6 (F-01 through F-06)

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 6     | FAIL status — correctness bugs, behavior mismatches |
| P1       | 1     | WARN with behavior mismatch |
| P2       | 1     | WARN with documentation/test gaps only |
| —        | 1     | PASS (F-04) — no tasks needed |

**Total tasks:** 8

---

## P0 — Immediate Fixes (FAIL)

### T-01: Fix tier classification ignoring charCount and stopWordRatio
- **Priority:** P0
- **Feature:** F-01 Query complexity router
- **Status:** TODO
- **Source:** mcp_server/lib/search/query-classifier.ts:173-179
- **Issue:** Tier classification ignores `charCount` and `stopWordRatio`; routing decisions are based only on trigger match and term count, conflicting with the feature claim in `01-query-complexity-router.md:7`.
- **Fix:** Either incorporate `charCount` and `stopWordRatio` into tier routing logic, or update the feature catalog Current Reality text to match the actual logic.

### T-02: Resolve classifier default-state flag contradiction
- **Priority:** P0
- **Feature:** F-01 Query complexity router
- **Status:** TODO
- **Source:** mcp_server/lib/search/query-classifier.ts:132-134 vs :43-46
- **Issue:** Classifier docs state the disabled path is the default, but the flag helper defaults to enabled unless explicitly `false`. The two locations contradict each other.
- **Fix:** Align the classifier documentation comment with the actual flag helper default behavior.

### T-03: Add traceMetadata.queryComplexity propagation tests
- **Priority:** P0
- **Feature:** F-01 Query complexity router
- **Status:** TODO
- **Source:** mcp_server/tests/query-classifier.vitest.ts, query-router.vitest.ts
- **Issue:** Listed tests do not exercise `traceMetadata.queryComplexity` propagation or response-envelope fallback. CHK-038 trace propagation is implemented in `hybrid-search.ts`/formatter flow but not represented in the feature's listed source files.
- **Fix:** Add integration tests asserting `routeResult.tier -> traceMetadata.queryComplexity -> formatter output`. Add `hybrid-search.ts` to the feature's source file listing.

### T-04: Fix channel-representation append-without-re-sort behavior
- **Priority:** P0
- **Feature:** F-03 Channel min-representation
- **Status:** TODO
- **Source:** mcp_server/lib/search/channel-representation.ts:173-182
- **Issue:** `analyzeChannelRepresentation` appends promoted items but does not re-sort. The feature says the full set is re-sorted, but that re-sort happens in `channel-enforcement.ts:110-114` which is not listed in the feature implementation table.
- **Fix:** Either re-sort inside `analyzeChannelRepresentation` directly, or add `channel-enforcement.ts` to the feature implementation table and document the wrapper dependency.

### T-05: Replace placeholder channel tests with behavioral assertions
- **Priority:** P0
- **Feature:** F-03 Channel min-representation
- **Status:** TODO
- **Source:** mcp_server/tests/channel.vitest.ts:10-40
- **Issue:** `channel.vitest.ts` is placeholder-only (`expect(true)` stubs) and does not validate real channel behavior. `channel-representation.vitest.ts` has no ordering assertions after promotions.
- **Fix:** Replace placeholder stubs with behavioral assertions covering post-promotion ordering and actual channel behavior.

### T-06: Fix query expansion missing test file and incomplete implementation table
- **Priority:** P0
- **Feature:** F-06 Query expansion
- **Status:** TODO
- **Source:** feature_catalog/12--query-intelligence/06-query-expansion.md:72
- **Issue:** Listed test file `mcp_server/tests/retry.vitest.ts` does not exist. Stage-1 orchestration file `stage1-candidate-gen.ts:316-349` is not listed in the feature implementation table despite containing the baseline+expanded parallel execution and baseline-first dedup logic.
- **Fix:** Replace stale test reference with existing relevant tests. Add `stage1-candidate-gen.ts` to the implementation sources. Add Stage-1 orchestration tests for parallel baseline-first dedup behavior.

---

## P1 — Significant Issues (WARN with behavior mismatch)

### T-07: Clarify RSF shadow mode feature status and add pipeline integration
- **Priority:** P1
- **Feature:** F-02 Relative score fusion in shadow mode
- **Status:** TODO
- **Source:** mcp_server/lib/search/rsf-fusion.ts:87-391, hybrid-search.ts:123-124
- **Issue:** Feature text says RSF runs alongside RRF in shadow mode, but also states the RSF branch was removed. RSF algorithms exist but runtime integration is not active in the primary hybrid search path — only `rsfShadow` metadata type remains. Tests validate RSF/RRF math but not pipeline-level shadow logging.
- **Fix:** Clarify feature status as dormant utility vs active shadow mode. If shadow mode is intended, add explicit pipeline invocation and trace assertions. If dormant, update feature description accordingly.

---

## P2 — Documentation/Test Gaps

### T-08: Add hybrid-search.ts to token budget feature and test CHK-060 path
- **Priority:** P2
- **Feature:** F-05 Dynamic token budget allocation
- **Status:** TODO
- **Source:** mcp_server/lib/search/hybrid-search.ts:958-961, 05-dynamic-token-budget-allocation.md:17-19
- **Issue:** CHK-060 header-overhead logic is implemented in `hybrid-search.ts` but this file is not listed in the feature's implementation table. Tests validate tier budgets but not the `SPECKIT_CONTEXT_HEADERS` overhead subtraction and 200-token floor.
- **Fix:** Add `hybrid-search.ts` to the feature implementation list. Add explicit tests for `adjustedBudget = max(dynamicBudget - (resultCount * 12), 200)`.
