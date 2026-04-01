# Iteration 6: Edge Case Quality Audit + Prioritized Refinement Backlog

## Focus
Close Q3 by performing an end-to-end edge case audit of the search pipeline (empty results, error degradation, scoring edge cases) and synthesize all 10+ improvement items from iterations 1-5 into a single prioritized refinement backlog with severity (P0/P1/P2) and effort (S/M/L) estimates.

## Findings

### Edge Case Audit: Error Handling and Graceful Degradation

1. **Empty result handling is comprehensive and well-layered.** The hybrid search pipeline has a multi-tier fallback chain: primary hybrid search (minSimilarity=30) -> retry at reduced threshold (minSimilarity=17) -> FTS-only fallback -> BM25-only fallback -> structural search (pure SQL, ordered by importance tier). Each tier checks `results.length === 0` before falling through. The final structural fallback at hybrid-search.ts:1789 returns memories ordered by importance_tier and weight without requiring embeddings at all -- a true last resort that ensures non-empty databases always return something. [SOURCE: hybrid-search.ts:1700-1800]

2. **Error isolation per search channel is robust.** Every individual channel (vector, FTS, BM25, structural) wraps its execution in try/catch. BM25 spec-folder scope lookup has three separate catch blocks (lines 351, 368, 378) all returning empty scoped results with console.warn. The pattern `} catch (_err: unknown) {` with fallback to empty array appears 20+ times across hybrid-search.ts. No channel failure can crash the pipeline -- it degrades to an empty array. [SOURCE: hybrid-search.ts Grep results showing 25+ catch blocks]

3. **The `_isTypedTraversalEnabled` import in causal-boost.ts is NOT stale -- correction to iteration 2.** It is imported as `_isTypedTraversalEnabled` and used at line 160: `return _isTypedTraversalEnabled()`. The underscore prefix was misleading -- it is a renaming alias, not an unused import marker. This was incorrectly flagged in iteration 2. [SOURCE: causal-boost.ts:16,160]

4. **Session boost null safety is solid.** The `normalizeSessionId()` function (session-boost.ts:44-48) handles null, undefined, empty string, and whitespace-only strings. `calculateSessionBoost()` checks `Number.isFinite(attentionScore)` before calculation. `capCombinedBoost()` uses `Math.max(0, ...)` to clamp inputs. The "potential null" concern from iteration 2 is addressed -- all paths are guarded. [SOURCE: session-boost.ts:44-79]

5. **Quality score backfill handles edge cases.** `filterByMinQualityScore()` in stage1-candidate-gen.ts:102-118 clamps threshold to [0,1], treats non-finite scores as 0, and returns the original array unchanged when threshold is missing. `backfillMissingQualityScores()` fills missing scores using `computeBackfillQualityScore()`. Both handle null/undefined/NaN inputs. [SOURCE: stage1-candidate-gen.ts:102-131]

6. **Reranker handles empty input correctly.** `rerankResults()` in reranker.ts:40 returns an empty array for null/undefined/empty input. Sort uses stable comparison `(a, b) => b.score - a.score` with limit slicing. However, if `score` is NaN on a result, the sort comparison returns NaN which may produce unstable sort order -- this is a minor edge case since scores are clamped upstream, but not defended within the reranker itself. [SOURCE: reranker.ts:36-53]

7. **Progressive disclosure handles empty/invalid input.** `paginate()` at progressive-disclosure.ts:248 returns early for non-array or empty input. Page results check at line 394 returns null cursor when page is empty. Summary generation at line 438 returns an empty summary for empty arrays. [SOURCE: progressive-disclosure.ts:248,394,438]

### Correction to Prior Iteration Findings

8. **Two items from iteration 2 are resolved/corrected:**
   - "Stale import in causal-boost.ts" -- NOT stale, alias `_isTypedTraversalEnabled` is used at line 160
   - "Potential null in session-boost.ts" -- NULL safety is comprehensive via `normalizeSessionId()`, `Number.isFinite()` guards, and `Math.max(0, ...)` clamping

### One Remaining Minor Edge Case

9. **Reranker NaN score edge case.** If any result reaches the reranker with a NaN score (theoretically impossible given upstream clamping in stage2/stage4, but not defended locally), the sort comparison `b.score - a.score` returns NaN, leading to undefined sort order per the ECMAScript spec. This is a defense-in-depth gap -- extremely low risk since all upstream paths enforce `Number.isFinite()` checks and clamp scores to [0,1]. [SOURCE: reranker.ts:45, INFERENCE: based on ECMAScript sort comparison semantics and upstream score clamping]

---

## Prioritized Refinement Backlog

All 10+ improvement items from iterations 1-5, consolidated and prioritized.

### P0 -- Critical (Should Fix)

None identified. The pipeline is functionally correct with no data-loss or crash bugs.

### P1 -- Important (Quality Improvements)

| # | Item | Source | Description | Effort | Impact |
|---|------|--------|-------------|--------|--------|
| P1-1 | Graph bonus cap/weight mismatch | Iter 5 (R2) | `STAGE2_GRAPH_BONUS_CAP=0.03` limits graph to 3% of score even when `find_decision` assigns graphWeight=0.50. Cap should scale with active intent's graphWeight. | S | High for graph-heavy intents |
| P1-2 | Recency boost is functionally decorative | Iter 5 (R1) | Max effective contribution ~0.02 (0.2 * 1.0 * 0.1). Increase `RECENCY_BOOST_SCALE` from 0.1 to ~0.3-0.5 or document as intentional tiebreaker. | S | Medium for time-sensitive queries |
| P1-3 | Goal persistence across session | Iter 4 (#1) | Goal resets to `effectiveQuery` on every search call. Should maintain a high-level session intent separate from per-query override. | M | Medium for multi-turn sessions |
| P1-4 | Doc-type weight shift proportionality | Iter 5 (R3) | Flat +/-0.1 shift is +50% on 0.2-base vs +12.5% on 0.4-base. Should be proportional (e.g., `base * shiftFactor`). | S | Medium for diverse doc types |

### P2 -- Nice to Have (Polish/Hardening)

| # | Item | Source | Description | Effort | Impact |
|---|------|--------|-------------|--------|--------|
| P2-1 | Snippet metadata enrichment | Iter 4 (#2) | Progressive disclosure snippets lack title/score/tier, forcing LLM to paginate for basic metadata. | S | Low-Medium (UX polish) |
| P2-2 | Constitutional limit configurability | Iter 4 (#3) | Hardcoded limit of 10 may be insufficient for large projects. No warning when limit is hit. | S | Low (edge case for large projects) |
| P2-3 | Unused session state fields | Iter 4 (#4) | `openQuestions` and `preferredAnchors` tracked in session state but not used in ranking. Either wire them or remove to reduce cognitive overhead. | M | Low (tech debt) |
| P2-4 | Auto-surface latency circuit-breaker | Iter 4 (#5) | Logs 250ms warning but no timeout/fallback. Should add a 500ms timeout with graceful skip. | S | Low (resilience hardening) |
| P2-5 | Trigger matching sophistication | Iter 4 (#1 from UX) | Auto-surface trigger matching uses exact substring only. Could benefit from fuzzy/stemmed matching. | L | Low-Medium (recall improvement) |
| P2-6 | Reranker NaN defense | Iter 6 (#9) | Sort comparison `b.score - a.score` produces undefined order if score is NaN. Add `Number.isFinite()` guard or default to 0. | S | Very Low (theoretical only) |

### Summary

| Priority | Count | Total Effort |
|----------|-------|-------------|
| P0 | 0 | -- |
| P1 | 4 | 1S + 1M + 2S = ~3 S-equivalents |
| P2 | 6 | 4S + 1M + 1L = ~7 S-equivalents |
| **Total** | **10** | **~10 S-equivalents** |

**Recommended implementation order:** P1-1 (graph cap), P1-2 (recency boost), P1-4 (doc-type shift), P1-3 (goal persistence), then P2 items by effort/impact ratio.

## Ruled Out
- Null pointer crashes in session-boost.ts -- all paths have comprehensive null/undefined/NaN guards
- Stale import in causal-boost.ts -- the aliased `_isTypedTraversalEnabled` IS used at line 160
- Empty result crash paths -- 5-tier fallback chain ensures graceful degradation to structural search

## Dead Ends
None -- this iteration successfully audited all remaining edge cases and synthesized the complete backlog.

## Sources Consulted
- hybrid-search.ts:1700-1800 (fallback chain and empty result handling)
- hybrid-search.ts (25+ catch blocks via Grep)
- causal-boost.ts:16,160 (import alias usage)
- session-boost.ts:44-79 (null safety pattern)
- stage1-candidate-gen.ts:102-131 (quality score edge cases)
- reranker.ts:36-53 (empty input and NaN edge case)
- progressive-disclosure.ts:248,394,438 (empty result handling)

## Assessment
- New information ratio: 0.56
- Questions addressed: [Q3]
- Questions answered: [Q3]

## Reflection
- What worked and why: Targeted Grep for error handling patterns (`catch|fallback|empty|length === 0`) gave a comprehensive map of all degradation paths across the search directory. Reading the specific edge case code (session-boost.ts, reranker.ts, stage1 quality filters) confirmed or corrected prior iteration findings with high confidence.
- What did not work and why: Nothing failed this iteration. The search pipeline code is well-documented with I/O contracts.
- What I would do differently: Could have used the Grep approach earlier in iteration 2 to avoid the false positive on causal-boost stale import.

## Recommended Next Focus
All 10 key questions are now answered. The research is complete. Recommend convergence -- the prioritized backlog provides a clear path for any future implementation work.
