## F-01: Score normalization
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The current reality says both RRF and composite outputs are normalized, but the feature's implementation table omits the active RRF normalization path in `shared/algorithms/rrf-fusion.ts:175-240` and `shared/algorithms/rrf-fusion.ts:435-468`; only the composite-side normalization is listed in `mcp_server/lib/scoring/composite-scoring.ts:796-820`.
- **Test Gaps:** 1. `mcp_server/tests/score-normalization.vitest.ts:72-214` and `mcp_server/tests/score-normalization.vitest.ts:225-406` cover direct normalization behavior, but no listed test asserts an end-to-end hybrid ranking where normalized RRF and composite scores compete in the same final ordering.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add `shared/algorithms/rrf-fusion.ts` to the feature's implementation table. 2. Add one end-to-end ranking regression that exercises normalized RRF plus composite scoring together.

## F-02: Cold-start novelty boost
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** NONE

## F-03: Interference scoring
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** NONE

## F-04: Classification-based decay
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** NONE

## F-05: Folder-level relevance scoring
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. File-level flag documentation contradicts implementation: the module header says folder scoring is "default: disabled", but `isFolderScoringEnabled()` is graduated-on by default (`mcp_server/lib/search/folder-relevance.ts:7`, `mcp_server/lib/search/folder-relevance.ts:23-29`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Align the module header comment in `folder-relevance.ts` with the actual graduated-on runtime behavior.

## F-06: Embedding cache
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** NONE

## F-07: Double intent weighting investigation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Current reality says the investigation traced `hybrid-search.ts`, `intent-classifier.ts`, and `adaptive-fusion.ts`, plus the Stage 2 `isHybrid` gate, but the feature inventory only includes `mcp_server/lib/search/intent-classifier.ts` (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:5-9`, `specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:15-17`). The "intentional by design" conclusion is not auditable from the listed source set alone.
- **Test Gaps:** 1. The only listed test file validates classifier weights and intent detection (`mcp_server/tests/intent-classifier.vitest.ts:156-172`, `mcp_server/tests/intent-classifier.vitest.ts:436-464`); it does not run the multi-stage pipeline or prove that double-weighting is absent.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add the traced pipeline files to the source table. 2. Add a regression test that exercises hybrid and non-hybrid paths and asserts intent weights are not applied twice.

## F-08: RRF K-value sensitivity analysis
- **Status:** FAIL
- **Code Issues:** 1. `fuseResultsMulti()` defaults `convergenceBonus` to `0` instead of `CONVERGENCE_BONUS`, so shared results lose the default overlap bonus (`shared/algorithms/rrf-fusion.ts:22`, `shared/algorithms/rrf-fusion.ts:182-185`, `shared/algorithms/rrf-fusion.ts:225-229`). This currently breaks `T030`, which expects a positive bonus for multi-source overlap (`mcp_server/tests/rrf-fusion.vitest.ts:167-191`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. The feature says K selection is now empirically grounded, but the analysis depends on a fusion routine that currently fails its own shared-result regression, so the measured output is not a stable baseline.
- **Test Gaps:** 1. The feature table omits the dedicated K-analysis assertions that actually exist in `mcp_server/tests/score-normalization.vitest.ts:279-406`. 2. The listed RRF suites validate fusion primitives, but they do not directly validate `analyzeKValueSensitivity()` output shape and metrics end-to-end.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Restore the default multi-source convergence bonus by falling back to `CONVERGENCE_BONUS`. 2. Add `mcp_server/tests/score-normalization.vitest.ts` or a dedicated K-analysis suite to this feature's test table.

## F-09: Negative feedback confidence signal
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. `getNegativeValidationCount()` swallows DB errors without logging (`mcp_server/lib/scoring/confidence-tracker.ts:45-59`).
- **Behavior Mismatch:** 1. Current reality says the Stage 2 search handler reads `negative_feedback_events` and applies the multiplier behind `SPECKIT_NEGATIVE_FEEDBACK`, but the listed implementation files only cover bookkeeping and multiplier primitives; no listed source contains the handler integration or flag gate (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md:5-10`, `mcp_server/lib/scoring/confidence-tracker.ts:45-63`, `mcp_server/lib/scoring/negative-feedback.ts:74-176`).
- **Test Gaps:** 1. The listed tests do not directly assert multiplier decay, floor behavior, or event-table reads. That coverage lives in unlisted `mcp_server/tests/learned-feedback.vitest.ts:866-938`. 2. `mcp_server/tests/confidence-tracker.vitest.ts:135-148` only checks confidence decrement, not score demotion.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add the Stage 2 integration source file(s) and `mcp_server/tests/learned-feedback.vitest.ts` to the catalog entry. 2. Replace the silent fallback in `getNegativeValidationCount()` with logged best-effort handling.

## F-10: Auto-promotion on validation
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. `getNegativeValidationCount()` swallows query failures without logging (`mcp_server/lib/search/auto-promotion.ts:68-81`).
- **Behavior Mismatch:** 1. Current reality includes `memory_validate` response metadata (`autoPromotion` payload), but the listed implementation inventory only includes the library module, not the handler path that shapes tool responses (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md:5-8`, `mcp_server/lib/search/auto-promotion.ts:127-336`).
- **Test Gaps:** 1. None of the listed tests assert thresholds, throttling, or audit-table writes. Actual coverage lives in unlisted `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:94-128` and `mcp_server/tests/learned-feedback.vitest.ts:729-857`.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add the `memory_validate` handler/response source files to the catalog entry. 2. Replace the listed generic type/normalization suites with the real auto-promotion tests.

## F-11: Scoring and ranking corrections
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Current reality enumerates fixes in `causal-boost.ts` and `ablation-framework.ts`, but neither file appears in the implementation table (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md:5-14`, `specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md:19-30`). Only C1/C2 are traceable from the listed source set (`mcp_server/lib/scoring/composite-scoring.ts:338-349`, `mcp_server/lib/scoring/composite-scoring.ts:516-517`).
- **Test Gaps:** 1. The listed tests cover composite-scoring behavior, but there is no listed coverage for the C3 recursive-CTE fix or the C4 log-space binomial fix because those source files are omitted from the feature inventory.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add `mcp_server/lib/search/causal-boost.ts` and `mcp_server/lib/eval/ablation-framework.ts` plus their tests, or split C1-C4 into separate catalog entries.

## F-12: Stage 3 effectiveScore fallback chain
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The feature table lists `mcp_server/tests/retry.vitest.ts`, but that file is missing from the repo. 2. The cataloged suites are broad infrastructure tests; none of the listed files directly assert the fallback order `intentAdjustedScore -> rrfScore -> score -> similarity/100` from `mcp_server/lib/search/pipeline/types.ts:57-67`, the Stage 3 alias in `mcp_server/lib/search/pipeline/stage3-rerank.ts:510-512`, or the `stage2Score` audit field in `mcp_server/lib/search/pipeline/types.ts:43-45`.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add a dedicated `resolveEffectiveScore` regression suite or list the relevant existing suite explicitly. 2. Remove or replace the missing `mcp_server/tests/retry.vitest.ts` reference.

## F-13: Scoring and fusion corrections
- **Status:** FAIL
- **Code Issues:** 1. `fuseResultsMulti()` lost the default convergence bonus by falling back to `0` when `options.convergenceBonus` is unset (`shared/algorithms/rrf-fusion.ts:22`, `shared/algorithms/rrf-fusion.ts:182-185`, `shared/algorithms/rrf-fusion.ts:225-229`), which fails `mcp_server/tests/rrf-fusion.vitest.ts:167-191`.
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Current reality claims fixes for BM25 `specFolder` filtering and post-signal `intentAdjustedScore` synchronization, but those behaviors live outside the listed source table (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md:9-18`, `specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md:22-26`). The catalog does not actually cover all claimed corrections.
- **Test Gaps:** 1. The listed tests catch the RRF regression, but there is no listed coverage for the BM25 filter fix or the post-signal `intentAdjustedScore = max(intentAdjustedScore, score)` synchronization described in current reality.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Reinstate the default convergence bonus behavior. 2. Add the BM25 and pipeline files/tests that implement the other claimed fixes to this feature entry.

## F-14: Local GGUF reranker via node-llama-cpp
- **Status:** FAIL
- **Code Issues:** 1. Availability gating uses total-system-memory thresholds of 8GB default and 2GB for custom models (`mcp_server/lib/search/local-reranker.ts:28-35`, `mcp_server/lib/search/local-reranker.ts:185-190`), not the documented 4GB free-memory and 512MB custom-model thresholds. This changes which hosts can use the reranker relative to the feature contract.
- **Standards Violations:** 1. Cleanup/dispose paths swallow errors silently (`mcp_server/lib/search/local-reranker.ts:286-289`, `mcp_server/lib/search/local-reranker.ts:307-308`, `mcp_server/lib/search/local-reranker.ts:314-317`).
- **Behavior Mismatch:** 1. Current reality says "4GB free memory" and "512MB custom-model threshold," but implementation checks `os.totalmem()` with higher thresholds and never uses free-memory gating (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md:5`, `mcp_server/lib/search/local-reranker.ts:28-35`, `mcp_server/lib/search/local-reranker.ts:185-190`).
- **Test Gaps:** 1. `mcp_server/tests/local-reranker.vitest.ts:9-59` only covers score extraction, scoring-method resolution, and a latency micro-benchmark; it does not assert memory gating, model-path checks, timeout fallback, or `RERANKER_LOCAL` availability logic. 2. The listed `mcp_server/tests/retry.vitest.ts` file is missing.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Align the runtime thresholds with the documented contract or update the feature description. 2. Add guardrail tests for memory thresholds, model existence, timeout fallback, and flag-gated availability.

## F-15: Tool-level TTL cache
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** 1. `runPostMutationHooks()` suppresses cache-clear and invalidation errors in multiple empty catches (`mcp_server/handlers/mutation-hooks.ts:22-57`).
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. The listed suite exercises cache internals and `invalidateOnWrite()` (`mcp_server/tests/tool-cache.vitest.ts:359-419`) but does not call `runPostMutationHooks()` from `mcp_server/handlers/mutation-hooks.ts:15-68`, so the documented mutation-hook wiring is unverified.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Add a mutation-hooks integration test that asserts tool-cache invalidation after save/delete/bulk-delete. 2. Replace silent catches with logged best-effort handling.

## F-16: Access-driven popularity scoring
- **Status:** FAIL
- **Code Issues:** 1. The accumulator increments in 0.1 steps until threshold (`mcp_server/lib/storage/access-tracker.ts:72-83`), but `flushAccessCounts()` always persists `access_count = access_count + 1` (`mcp_server/lib/storage/access-tracker.ts:118-127`). That does not "flush the accumulated count" as described. 2. The module does not expose the documented `getAccessStats()` API; exports stop at `getAccumulatorState`/`reset`/`dispose` (`mcp_server/lib/storage/access-tracker.ts:266-282`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Current reality says the flush updates `last_access_at`, but implementation writes `last_accessed` (`mcp_server/lib/storage/access-tracker.ts:121-124`). 2. Current reality promises an observability method `getAccessStats()`, but no such function exists in the module exports (`mcp_server/lib/storage/access-tracker.ts:266-282`).
- **Test Gaps:** 1. `mcp_server/tests/access-tracker-extended.vitest.ts:80-100` only proves each flush adds `1`; it never verifies persistence of the 0.1 accumulator semantics described in the feature. 2. No listed test covers composite-scoring popularity integration or archival-manager dormancy behavior from the same feature entry.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Either persist the true accumulated delta or rewrite the feature description to match the thresholded "+1 per flush" model. 2. Implement and test `getAccessStats()` or remove the claim. 3. Add integration tests for composite-scoring and archival-manager use of access data.

## F-17: Temporal-structural coherence scoring
- **Status:** FAIL
- **Code Issues:** 1. `scoreCoherence()` only checks non-empty content, length, Markdown headings, and "substance" (`mcp_server/handlers/quality-loop.ts:198-226`). It does not inspect future references, predecessor existence, spec-folder associations, or causal-link chronology.
- **Standards Violations:** NONE
- **Behavior Mismatch:** 1. Current reality describes a temporal/relational coherence signal, but the implementation is purely structural text heuristics (`specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md:5-7`, `mcp_server/handlers/quality-loop.ts:178-226`).
- **Test Gaps:** 1. `mcp_server/tests/quality-loop.vitest.ts:211-235` only asserts empty/short/headings/substance heuristics; it has no scenarios for future-event references, nonexistent predecessors, invalid spec-folder relationships, or causal inconsistency.
- **Playbook Coverage:** MISSING (phase-level `NEW-050..065+` provided, no per-feature mapping).
- **Recommended Fixes:** 1. Either implement real temporal/relational checks or rewrite the feature description to match the current heuristic. 2. Add tests for future-reference, nonexistent-predecessor, and bad-link scenarios.
