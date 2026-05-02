# Iteration 011 — C1: Search-quality W3-W13 latency and accuracy

## Focus
Audited the search-quality stress harness and the live search/rerank/calibration code it exercises for W3-W13. The focus was concrete tuning levers that could improve precision@K or NDCG while preserving recall, especially channel fusion, rerank gating, CocoIndex overfetch, and shadow learned weights.

## Actions Taken
- Enumerated `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/` with `rg --files`.
- Searched W3-W13 files and live search modules for weight, threshold, fusion, rerank, precision, recall, latency, and NDCG knobs.
- Read `harness.ts`, `metrics.ts`, `corpus.ts`, and `measurement-fixtures.ts` for baseline measurement behavior.
- Read W4, W5, W6, and W11 stress tests for expected quality deltas.
- Traced live code in `rerank-gate.ts`, `pipeline/stage3-rerank.ts`, `cross-encoder.ts`, `cocoindex-calibration.ts`, `adaptive-fusion.ts`, `rrf-fusion.ts`, and advisor scorer fusion/weights.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-011-C1-01 | P2 | .opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts:10 | The W3-W13 harness summary tracks precision@3, recall@3, latency, refusal survival, and citation quality, but no NDCG/MRR. That means ranking-quality tuning can only prove "is relevant in top 3", not "did the better item move upward"; W4/W6 variants are exactly rank-order improvements. | Add `ndcgAt3` and preferably `ndcgAt10` to `SearchQualityMetricSummary`, reusing the existing NDCG implementation pattern in `computeNDCG`. Expected impact: no production behavior change, but enables measurable rank-sensitive tuning and prevents false positives where recall is unchanged but ordering regresses. |
| F-011-C1-02 | P1 | .opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:42 | `decideConditionalRerank()` blocks rerank whenever `candidateCount < 4`, even if ambiguity/disagreement triggers fired. The W4 fixture models the risky case with only three baseline candidates, and the expected variant improves precision by moving the canonical candidate to rank 1. | Lower the floor to 3 for `multi-channel-weak-margin`, `weak-evidence`, or `disagreement:*` triggers, or overfetch to at least 4 before Stage 3. Expected impact: improves precision@3/NDCG for small ambiguous result sets with negligible latency cost and no recall regression because rerank reorders existing candidates. |
| F-011-C1-03 | P1 | .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31 | Provider configs declare `maxDocuments`, but `rerankResults()` passes every candidate document to providers instead of slicing to that cap. This can inflate p95 latency or hit provider limits before accuracy gains appear. | Apply a candidate window before provider calls, e.g. `min(config.maxDocuments, tunedTopN)` with top-N defaults of 20-50, then merge untouched tail after rerank. Expected impact: lower W4/W13 rerank latency with stable recall@K when the top window is at least the requested output depth plus a safety margin. |
| F-011-C1-04 | P2 | .opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:47 | `calibrateCocoIndexOverfetch()` already detects duplicate density >= 0.35 and recommends 4x overfetch, but W11 explicitly records telemetry "without applying adaptive overfetch". W6 shows the duplicate-heavy variant improves precision@3 while preserving recall@3. | Graduate adaptive overfetch for duplicate-heavy queries behind a bounded rollout: 2x for density 0.35-0.50, 4x above 0.50, capped by request limit and latency budget. Expected impact: improves duplicate-heavy precision@3/NDCG by exposing canonical paths earlier, with recall preserved by overfetch rather than filtering. |
| F-011-C1-05 | P2 | .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1270 | Learned Stage 2 scoring is shadow-only even though W5 demonstrates the shadow-weight variant improves advisor diagnostic citation quality. Live ranking still ignores the learned score and only logs manual-vs-learned deltas. | Promote the learned combiner as a bounded blend when shadow deltas are stable, e.g. `0.85 * manual + 0.15 * learned` under canary plus recall guardrails. Expected impact: small precision/citation-quality lift for ambiguous advisor/search routing while preserving recall through rollback and minimum-recall checks. |

## Questions Answered
- Yes, there are measurable tuning levers in W3-W13: rerank floor, provider candidate windowing, CocoIndex overfetch, and learned-score blending.
- The strongest no-recall-regression opportunities are reranking existing small ambiguous sets and overfetching duplicate-heavy CocoIndex results before canonical path selection.
- Current harness metrics cannot fully validate NDCG gains, even though rank-sensitive behavior is the central W4/W6 improvement mechanism.

## Questions Remaining
- What live corpus size and provider latency distribution should set the default cross-encoder top-N window?
- Should CocoIndex overfetch be keyed only by duplicate density, or by duplicate density plus `pathClassCounts` such as spec/runtime dominance?
- What shadow-delta stability threshold should graduate learned Stage 2 scoring from diagnostic logging into a bounded live blend?

## Next Focus
Follow-on work should run an ablation sweep across W4/W6/W11/W13 with NDCG@3 added, testing rerank floor 3 vs 4, cross-encoder top-N windows, and CocoIndex 2x/4x overfetch thresholds against p95 latency.
