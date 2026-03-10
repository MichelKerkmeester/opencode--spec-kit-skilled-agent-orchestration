# Tasks — 011 Scoring and Calibration

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 5     | FAIL-status correctness bugs and behavior mismatches |
| P1       | 7     | WARN-status behavior mismatches and significant code issues |
| P2       | 3     | WARN-status documentation/test gaps only |
| **Total**| **15**|  |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Restore default convergence bonus in fuseResultsMulti
- **Priority:** P0
- **Feature:** F-08 RRF K-value sensitivity analysis
- **Status:** TODO
- **Source:** `shared/algorithms/rrf-fusion.ts:22, 182-185, 225-229`
- **Issue:** `fuseResultsMulti()` defaults `convergenceBonus` to `0` instead of `CONVERGENCE_BONUS`, so shared results lose the default overlap bonus. This breaks `T030` which expects a positive bonus for multi-source overlap. The K-value analysis depends on a fusion routine that currently fails its own regression. Feature table also omits K-analysis assertions from `score-normalization.vitest.ts:279-406`.
- **Fix:** Fall back to `CONVERGENCE_BONUS` constant when `options.convergenceBonus` is unset. Add K-analysis suite to this feature's test table.

### T-02: Reinstate convergence bonus and cover omitted fusion corrections
- **Priority:** P0
- **Feature:** F-13 Scoring and fusion corrections
- **Status:** TODO
- **Source:** `shared/algorithms/rrf-fusion.ts:22, 182-185, 225-229`, `mcp_server/tests/rrf-fusion.vitest.ts:167-191`
- **Issue:** Same root cause as T-01 — `fuseResultsMulti()` lost the default convergence bonus. Additionally, catalog does not cover all claimed corrections: BM25 `specFolder` filtering fix and post-signal `intentAdjustedScore` synchronization are described in current reality but live outside the listed source table.
- **Fix:** Reinstate the default convergence bonus behavior. Add the BM25 and pipeline files/tests that implement the other claimed fixes to this feature entry.

### T-03: Align local reranker memory thresholds with documented contract
- **Priority:** P0
- **Feature:** F-14 Local GGUF reranker via node-llama-cpp
- **Status:** TODO
- **Source:** `mcp_server/lib/search/local-reranker.ts:28-35, 185-190, 286-289, 307-308, 314-317`
- **Issue:** Availability gating uses total-system-memory thresholds (8GB default, 2GB custom models), not the documented 4GB free-memory and 512MB custom-model thresholds. This changes which hosts can use the reranker. Cleanup/dispose paths also swallow errors silently. Listed `retry.vitest.ts` is missing from repo.
- **Fix:** Align runtime thresholds with the documented contract or update the feature description. Replace silent catches with logged best-effort handling. Add guardrail tests for memory thresholds, model existence, timeout fallback, and flag-gated availability.

### T-04: Fix access-tracker flush semantics and missing API
- **Priority:** P0
- **Feature:** F-16 Access-driven popularity scoring
- **Status:** TODO
- **Source:** `mcp_server/lib/storage/access-tracker.ts:72-83, 118-127, 266-282`
- **Issue:** Accumulator increments in 0.1 steps but `flushAccessCounts()` always persists `+1`, not the accumulated count. Module does not expose the documented `getAccessStats()` API. Column name mismatch: code writes `last_accessed` but docs say `last_access_at`. Tests only prove each flush adds `1`; they never verify the 0.1 accumulator semantics.
- **Fix:** Either persist the true accumulated delta or rewrite the feature description to match the thresholded "+1 per flush" model. Implement and export `getAccessStats()` or remove the claim. Align column naming between code and docs.

### T-05: Implement temporal/relational coherence checks or correct description
- **Priority:** P0
- **Feature:** F-17 Temporal-structural coherence scoring
- **Status:** TODO
- **Source:** `mcp_server/handlers/quality-loop.ts:198-226`
- **Issue:** `scoreCoherence()` only checks non-empty content, length, Markdown headings, and "substance." It does not inspect future references, predecessor existence, spec-folder associations, or causal-link chronology, despite the feature describing a temporal/relational coherence signal.
- **Fix:** Either implement real temporal/relational checks or rewrite the feature description to match the current structural text heuristic. Add tests for future-reference, nonexistent-predecessor, and bad-link scenarios.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-06: Add RRF normalization path to score normalization feature catalog
- **Priority:** P1
- **Feature:** F-01 Score normalization
- **Status:** TODO
- **Source:** `shared/algorithms/rrf-fusion.ts:175-240, 435-468`, `mcp_server/lib/scoring/composite-scoring.ts:796-820`
- **Issue:** Current reality says both RRF and composite outputs are normalized, but the feature's implementation table omits the active RRF normalization path in `rrf-fusion.ts`. No listed test asserts an end-to-end hybrid ranking where normalized RRF and composite scores compete.
- **Fix:** Add `shared/algorithms/rrf-fusion.ts` to the feature's implementation table. Add one end-to-end ranking regression exercising normalized RRF plus composite scoring together.

### T-07: Align folder-relevance module header with graduated-on behavior
- **Priority:** P1
- **Feature:** F-05 Folder-level relevance scoring
- **Status:** TODO
- **Source:** `mcp_server/lib/search/folder-relevance.ts:7, 23-29`
- **Issue:** Module header says folder scoring is "default: disabled", but `isFolderScoringEnabled()` is graduated-on by default. Documentation contradicts implementation.
- **Fix:** Align the module header comment with the actual graduated-on runtime behavior.

### T-08: Add pipeline files to double-intent investigation catalog
- **Priority:** P1
- **Feature:** F-07 Double intent weighting investigation
- **Status:** TODO
- **Source:** `.../07-double-intent-weighting-investigation.md:5-9, 15-17`
- **Issue:** Investigation traced `hybrid-search.ts`, `intent-classifier.ts`, and `adaptive-fusion.ts` plus the Stage 2 `isHybrid` gate, but the feature inventory only includes `intent-classifier.ts`. The "intentional by design" conclusion is not auditable from the listed source set alone.
- **Fix:** Add the traced pipeline files to the source table. Add a regression test exercising hybrid and non-hybrid paths asserting intent weights are not applied twice.

### T-09: Add handler integration to negative feedback catalog entry
- **Priority:** P1
- **Feature:** F-09 Negative feedback confidence signal
- **Status:** TODO
- **Source:** `mcp_server/lib/scoring/confidence-tracker.ts:45-59`, `mcp_server/lib/scoring/negative-feedback.ts:74-176`
- **Issue:** Listed implementation files only cover bookkeeping and multiplier primitives; no listed source contains the handler integration or flag gate. `getNegativeValidationCount()` swallows DB errors without logging. Listed tests do not directly assert multiplier decay, floor behavior, or event-table reads — that coverage lives in unlisted `learned-feedback.vitest.ts:866-938`.
- **Fix:** Add the Stage 2 integration source file(s) and `mcp_server/tests/learned-feedback.vitest.ts` to the catalog entry. Replace the silent fallback with logged best-effort handling.

### T-10: Add handler path to auto-promotion catalog entry
- **Priority:** P1
- **Feature:** F-10 Auto-promotion on validation
- **Status:** TODO
- **Source:** `mcp_server/lib/search/auto-promotion.ts:68-81, 127-336`
- **Issue:** Listed implementation inventory only includes the library module, not the handler path that shapes `memory_validate` tool responses. `getNegativeValidationCount()` swallows query failures without logging. None of the listed tests assert thresholds, throttling, or audit-table writes — actual coverage lives in unlisted test files.
- **Fix:** Add the `memory_validate` handler/response source files to the catalog entry. Replace the listed generic suites with the real auto-promotion tests (`promotion-positive-validation-semantics.vitest.ts`, `learned-feedback.vitest.ts`). Replace silent fallback with logged handling.

### T-11: Add missing source files to scoring corrections catalog
- **Priority:** P1
- **Feature:** F-11 Scoring and ranking corrections
- **Status:** TODO
- **Source:** `.../11-scoring-and-ranking-corrections.md:5-14, 19-30`
- **Issue:** Current reality enumerates fixes in `causal-boost.ts` and `ablation-framework.ts`, but neither file appears in the implementation table. Only C1/C2 are traceable from the listed source set (`composite-scoring.ts:338-349, 516-517`). No listed coverage for the C3 recursive-CTE fix or the C4 log-space binomial fix.
- **Fix:** Add `mcp_server/lib/search/causal-boost.ts` and `mcp_server/lib/eval/ablation-framework.ts` plus their tests, or split C1-C4 into separate catalog entries.

### T-12: Replace silent catches in mutation-hooks with logged handling
- **Priority:** P1
- **Feature:** F-15 Tool-level TTL cache
- **Status:** TODO
- **Source:** `mcp_server/handlers/mutation-hooks.ts:22-57`, `mcp_server/tests/tool-cache.vitest.ts:359-419`
- **Issue:** `runPostMutationHooks()` suppresses cache-clear and invalidation errors in multiple empty catches. Listed suite exercises cache internals and `invalidateOnWrite()` but does not call `runPostMutationHooks()`, so the documented mutation-hook wiring is unverified.
- **Fix:** Replace silent catches with logged best-effort handling. Add a mutation-hooks integration test that asserts tool-cache invalidation after save/delete/bulk-delete.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-13: Add effectiveScore fallback regression suite
- **Priority:** P2
- **Feature:** F-12 Stage 3 effectiveScore fallback chain
- **Status:** TODO
- **Source:** `mcp_server/lib/search/pipeline/types.ts:57-67`, `mcp_server/lib/search/pipeline/stage3-rerank.ts:510-512`
- **Issue:** Listed test `retry.vitest.ts` is missing from the repo. Cataloged suites are broad infrastructure tests; none directly assert the fallback order `intentAdjustedScore -> rrfScore -> score -> similarity/100` or the `stage2Score` audit field.
- **Fix:** Add a dedicated `resolveEffectiveScore` regression suite. Remove or replace the missing `retry.vitest.ts` reference.

### T-14: Add end-to-end normalized ranking test
- **Priority:** P2
- **Feature:** F-01 Score normalization
- **Status:** TODO
- **Source:** `mcp_server/tests/score-normalization.vitest.ts:72-214, 225-406`
- **Issue:** Tests cover direct normalization behavior, but no listed test asserts an end-to-end hybrid ranking where normalized RRF and composite scores compete in the same final ordering.
- **Fix:** Add one end-to-end ranking regression test exercising normalized RRF plus composite scoring together.

### T-15: Add access-tracker integration tests for composite scoring and archival
- **Priority:** P2
- **Feature:** F-16 Access-driven popularity scoring
- **Status:** TODO
- **Source:** `mcp_server/tests/access-tracker-extended.vitest.ts:80-100`
- **Issue:** Tests only prove each flush adds `1`; they never verify persistence of the 0.1 accumulator semantics. No listed test covers composite-scoring popularity integration or archival-manager dormancy behavior.
- **Fix:** Add integration tests for composite-scoring and archival-manager use of access data.
