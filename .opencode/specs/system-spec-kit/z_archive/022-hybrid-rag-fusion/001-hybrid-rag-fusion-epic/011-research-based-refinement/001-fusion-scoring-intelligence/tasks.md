---
title: "...022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/001-fusion-scoring-intelligence/tasks]"
description: "Detailed task breakdown across 4 phases: calibration foundations, shadow infrastructure, query-aware fusion, and learned weights."
trigger_phrases:
  - "d1 tasks"
  - "fusion scoring tasks"
  - "calibration tasks"
  - "shadow lab tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/001-fusion-scoring-intelligence"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Fusion & Scoring Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) — effort`

**Dependency Notation**: `depends: T###` or `depends: external (D3.A)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-a -->
## Phase A: Calibration Foundations (REQ-D1-001, REQ-D1-003)

**Goal**: Replace flat heuristic constants with calibrated values, establish eval baseline.
**Effort**: ~1.5 weeks | **Wave**: 1 (parallel with D3.A, D4.A, D5.A)

### REQ-D1-001: Calibrated Overlap Bonus

- [ ] T001 Read and analyze current overlap bonus logic in `rrf-fusion.ts` — identify flat +0.10 constant, understand `channelsHit` and `totalChannels` variables, document current score accumulation flow (`shared/algorithms/rrf-fusion.ts`) — 2h
  - **Acceptance**: Current logic documented with line numbers, variable names, and data flow
  - **Hint**: Look for the convergence/overlap bonus section — it should be a flat additive constant applied when a candidate appears in multiple channels

- [ ] T002 Implement calibrated overlap bonus with channel-aware scaling (`shared/algorithms/rrf-fusion.ts`) — 4h
  - depends: T001
  - **Acceptance**: `overlapRatio` computed as `(channelsHit - 1) / Math.max(1, totalChannels - 1)`, scaled by `beta * meanTopNormScore(id)`, clamped to [0, 0.06]
  - **Hint**: Implementation sketch:
    ```typescript
    const overlapRatio = (channelsHit - 1) / Math.max(1, totalChannels - 1);
    const overlapScore = beta * overlapRatio * meanTopNormScore(id);
    score += clamp(overlapScore, 0, 0.06);
    ```
  - **Hint**: `beta` should be a configurable constant (default 0.15); `meanTopNormScore` averages the normalized scores from channels that hit this candidate

- [ ] T003 Add `SPECKIT_CALIBRATED_OVERLAP_BONUS` feature flag with fallback to flat +0.10 (`shared/algorithms/rrf-fusion.ts`) — 1h
  - depends: T002
  - **Acceptance**: Flag defaults to OFF; when OFF, existing flat +0.10 logic unchanged; when ON, calibrated overlap active

- [ ] T004 [P] Write unit tests for calibrated overlap bonus (`shared/algorithms/__tests__/rrf-fusion.test.ts`) — 3h
  - depends: T002
  - **Acceptance**: Tests cover: 0 channels hit (bonus = 0), 1 channel hit (bonus = 0), 2 of 4 channels (partial scaling), all channels (max scaling), clamp at 0.06, feature flag OFF returns flat +0.10
  - **Hint**: Test both the mathematical correctness of `overlapRatio` and the clamp boundary; use exact numeric assertions

### REQ-D1-003: K-Optimization with Judged Relevance

- [ ] T005 Read and analyze current `k-value-analysis.ts` — understand existing K testing infrastructure, data structures, and output format (`shared/algorithms/k-value-analysis.ts`) — 2h
  - **Acceptance**: Current module capabilities documented, identify extension points for judged relevance evaluation

- [ ] T006 Extend K analysis module with judged relevance evaluation framework (`shared/algorithms/k-value-analysis.ts`) — 4h
  - depends: T005
  - **Acceptance**: Module accepts judged query set with relevance labels, computes NDCG@10 and MRR@5 per K value
  - **Hint**: The judged query set should be a typed array: `{ query: string, intent: IntentClass, relevantIds: string[], labels: Map<string, number> }`

- [ ] T007 Implement per-intent K sweep over {10, 20, 40, 60, 80, 100, 120} (`shared/algorithms/k-value-analysis.ts`) — 4h
  - depends: T006
  - **Acceptance**: For each intent class, runs RRF fusion with each K value, selects `argmax(ndcg10)`, stores results with eval metadata
  - **Hint**: Implementation sketch:
    ```typescript
    for (const k of [10, 20, 40, 60, 80, 100, 120]) {
      metrics[k] = evalQueries(qset, q => fuseRrf(q.channels, { k }));
    }
    bestK[intent] = argmax(metrics, 'ndcg10');
    ```

- [ ] T008 Add `SPECKIT_RRF_K_EXPERIMENTAL` feature flag with fallback to K=60 (`shared/algorithms/rrf-fusion.ts`) — 1h
  - depends: T007
  - **Acceptance**: Flag defaults to OFF; when ON, uses per-intent optimal K; when OFF, K=60 for all queries

- [ ] T009 [P] Record baseline eval metrics: MRR@5, NDCG@10 per intent class — 2h
  - **Acceptance**: Baseline metrics stored in eval data format, used as comparison point for all subsequent phases
  - **Hint**: Run the existing eval pipeline with current settings; record results before any Phase A changes are activated

- [ ] T010 [P] Write unit tests for K-optimization (`shared/algorithms/__tests__/k-value-analysis.test.ts`) — 3h
  - depends: T006, T007
  - **Acceptance**: Tests cover: metric computation correctness, intent segmentation, tie-breaking (lower K wins), empty query set handling, fallback when flag OFF
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Shadow Infrastructure (REQ-D1-002)

**Goal**: Build safe experimentation infrastructure for comparing 3 fusion policies.
**Effort**: ~1 week | **Wave**: 3 (after Phase A baseline)
**Prerequisites**: Phase A eval baseline (T009)

- [ ] T011 Design `FusionPolicy` type system and policy registry (`shared/algorithms/rrf-fusion.ts`, `shared/algorithms/fusion-lab.ts`) — 2h
  - depends: T009
  - **Acceptance**: `type FusionPolicy = 'rrf' | 'minmax_linear' | 'zscore_linear'` defined, policy registry maps name to implementation function
  - **Hint**: The registry pattern allows adding new policies later without modifying the router; each policy takes the same input (channel results) and returns scored candidates

- [ ] T012 Implement minmax_linear score normalizer (`shared/algorithms/fusion-lab.ts`) — 4h
  - depends: T011
  - **Acceptance**: Normalizes scores per channel to [0, 1] using min-max scaling, then fuses with linear combination; handles single-item channels (score = 1.0)
  - **Hint**: `normalizedScore = (score - channelMin) / (channelMax - channelMin)`; guard against division by zero when all scores are equal

- [ ] T013 Implement zscore_linear score normalizer (`shared/algorithms/fusion-lab.ts`) — 4h
  - depends: T011
  - **Acceptance**: Normalizes scores per channel using z-score (mean/stddev), then fuses with linear combination; handles low-variance channels gracefully
  - **Hint**: `zScore = (score - channelMean) / channelStdDev`; when stdDev < epsilon, fall back to uniform scores; final scores clamped to [0, 1]

- [ ] T014 Build shadow comparison runner — parallel execution with telemetry capture (`shared/algorithms/fusion-lab.ts`) — 4h
  - depends: T012, T013
  - **Acceptance**: Runs all 3 policies on each query, returns active policy result, captures per-policy NDCG@10, MRR@5, and latency as telemetry
  - **Hint**: Use `Promise.all` for parallel execution; telemetry should be fire-and-forget (non-blocking); shadow overhead target: <= 15ms p95
  - **Hint**: Implementation sketch:
    ```typescript
    shadow.compare(['rrf', 'minmax_linear', 'zscore_linear']);
    ```

- [ ] T015 Add `SPECKIT_FUSION_POLICY_SHADOW_V2` feature flag (`shared/algorithms/fusion-lab.ts`) — 1h
  - depends: T014
  - **Acceptance**: Flag defaults to OFF; when ON, shadow comparison runs on each query; when OFF, only active policy runs (no overhead)

- [ ] T016 [P] Write integration tests for shadow lab (`shared/algorithms/__tests__/fusion-lab.test.ts`) — 3h
  - depends: T014
  - **Acceptance**: Tests cover: all 3 policies produce valid ranked lists, telemetry recording captures all fields, shadow mode does not affect returned results, graceful handling when one policy throws

- [ ] T017 Validate shadow overhead stays within 15ms p95 budget — 2h
  - depends: T014
  - **Acceptance**: Benchmark shows shadow comparison adds <= 15ms at p95 over 100 queries; if exceeded, optimize parallel execution or reduce shadow frequency
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:phase-c -->
## Phase C: Query-Aware Fusion (REQ-D1-004, REQ-D1-005)

**Goal**: Make fusion policy and graph weight respond to query characteristics.
**Effort**: ~2 weeks | **Wave**: 3 (after D3.A and Phase B)
**Prerequisites**: D3 Phase A (graph quality signals), D1 Phase B (shadow validation data)

### REQ-D1-004: Query-Aware Graph Weight

- [ ] T018 Implement `looksLikeLiteralId()` query classifier (`shared/search/adaptive-fusion.ts`) — 3h
  - **Acceptance**: Detects patterns like `M-1234`, `get memory XYZ`, quoted IDs, hex hashes; returns boolean; false-positive rate < 5% on test queries
  - **Hint**: Use regex patterns for common ID formats; include unit tests with both positive and negative examples

- [ ] T019 Implement query-aware graph weight in `hybrid-search.ts` (`shared/search/hybrid-search.ts`) — 4h
  - depends: T018, external (D3.A)
  - **Acceptance**: Graph weight varies by intent — 0.2 for literal lookups, `lerp(0.6, 1.6, graphPrior)` for graph-eligible queries (understand, find_decision)
  - **Hint**: Implementation sketch:
    ```typescript
    const graphEligible = intent in ['understand', 'find_decision'] && !looksLikeLiteralId(query);
    stage1.graphWeight = graphEligible ? lerp(0.6, 1.6, graphPrior) : 0.2;
    ```
  - **Hint**: `graphPrior` comes from D3.A graph quality signals; if D3.A unavailable, use static 0.5 as fallback prior

- [ ] T020 Add `SPECKIT_GRAPH_QUERY_GATING_V1` feature flag with fallback to static weight (`shared/search/hybrid-search.ts`) — 1h
  - depends: T019
  - **Acceptance**: Flag defaults to OFF; when OFF, existing static graph weight unchanged; when ON, query-aware gating active

- [ ] T021 [P] Write integration tests for graph weight gating (`shared/search/__tests__/hybrid-search.test.ts`) — 3h
  - depends: T019
  - **Acceptance**: Tests cover: literal ID query gets weight 0.2, understand query gets elevated weight, find_decision query gets elevated weight, unknown intent gets default, flag OFF preserves static weight

### REQ-D1-005: Intent Router Selects Fusion Family

- [ ] T022 Implement QPP features: score spread and channel agreement (`shared/search/adaptive-fusion.ts`) — 4h
  - depends: T017 (shadow lab data for validation)
  - **Acceptance**: `scoreSpread` measures variance across channel top scores; `channelAgreement` measures overlap in top-10 candidates across channels; both normalized to [0, 1]
  - **Hint**: High score spread + low QPP = strong signal for score-based fusion; high agreement = channels converge on same candidates

- [ ] T023 Build fusion policy router based on QPP features and intent (`shared/search/adaptive-fusion.ts`) — 4h
  - depends: T018, T022
  - **Acceptance**: Router selects fusion family per query: `minmax_linear` when QPP low and spread high, `rrf` for literal IDs, `rrf+graph` for graph-eligible queries with high graph quality
  - **Hint**: Implementation sketch:
    ```typescript
    if (qpp.low && scoreSpread.high) policy = 'minmax_linear';
    else if (looksLikeLiteralId(query)) policy = 'rrf';
    else if (graphIntent && graphQuality.high) policy = 'rrf+graph';
    ```

- [ ] T024 Add `SPECKIT_FUSION_POLICY_ROUTER` feature flag with fallback to RRF (`shared/search/adaptive-fusion.ts`) — 1h
  - depends: T023
  - **Acceptance**: Flag defaults to OFF; when OFF, all queries use RRF; when ON, router selects policy per query

- [ ] T025 [P] Write integration tests for fusion routing (`shared/search/__tests__/adaptive-fusion.test.ts`) — 3h
  - depends: T023
  - **Acceptance**: Tests cover: each policy selected for its target condition, fallback to RRF when flag OFF, fallback to RRF when conditions unclear, QPP feature computation edge cases

- [ ] T026 Run eval comparing static vs query-aware fusion — 3h
  - depends: T020, T024
  - **Acceptance**: Eval results show NDCG@10 improvement on graph-eligible queries (target: +2-6 points); no regression on simple queries; results documented
<!-- /ANCHOR:phase-c -->

---

<!-- ANCHOR:phase-d -->
## Phase D: Learned Weights (REQ-D1-006)

**Goal**: Train regularized linear ranker from accumulated judged relevance data.
**Effort**: ~1.5 weeks | **Wave**: 4 (last phase)
**Prerequisites**: D4 Phase A (event ledger for training labels), sufficient judged queries (50+ per intent class)

- [ ] T027 [B] Design 8-feature vector extraction from Stage 2 signals (`shared/ranking/stage2-fusion.ts`) — 3h
  - depends: external (D4.A event ledger)
  - **Acceptance**: Feature vector extracts: `[rrf, overlap, graph, session, causal, feedback, validation, artifact]` from Stage 2 scoring context; all features normalized to [0, 1]
  - **Hint**: Implementation sketch:
    ```typescript
    features = [rrf, overlap, graph, session, causal, feedback, validation, artifact];
    ```
  - **Hint**: Each feature should have a clear provenance — `rrf` from RRF score, `overlap` from calibrated overlap bonus, `graph` from graph channel weight, etc.

- [ ] T028 Implement regularized linear ranker (L2 ridge regression) in `learned-combiner.ts` (`shared/ranking/learned-combiner.ts`) — 6h
  - depends: T027
  - **Acceptance**: Ridge regression with configurable lambda (default 0.1), fits weights from feature matrix and labels, prediction clamped to [0, 1]
  - **Hint**: Implementation sketch:
    ```typescript
    model = trainRegularizedLinearRanker(features, labels);
    score = clamp(model.predict(features), 0, 1);
    ```
  - **Hint**: Use closed-form solution `w = (X^T X + lambda I)^{-1} X^T y` for efficiency with small datasets; no need for gradient descent

- [ ] T029 Build LOOCV validation pipeline and SHAP feature importance (`shared/ranking/learned-combiner.ts`) — 4h
  - depends: T028
  - **Acceptance**: LOOCV reports R-squared (target > 0.5) and per-fold metrics; SHAP approximation (for linear models: coefficient magnitude * feature variance) reported per feature
  - **Hint**: For linear models, feature importance can be approximated as `|weight_i| * std(feature_i)` — true SHAP for linear is exact and equal to `weight_i * (x_i - mean(x_i))`

- [ ] T030 Add `SPECKIT_LEARNED_STAGE2_COMBINER` feature flag — shadow-only initially (`shared/ranking/stage2-fusion.ts`) — 2h
  - depends: T028
  - **Acceptance**: Flag defaults to OFF; when ON, learned combiner runs in shadow mode (scores computed but not used for ranking); telemetry captures learned vs manual comparison

- [ ] T031 [P] Write unit tests for learned combiner (`shared/ranking/__tests__/learned-combiner.test.ts`) — 3h
  - depends: T028, T029
  - **Acceptance**: Tests cover: feature extraction shape, ridge regression with known solution, LOOCV fold count, SHAP computation, clamp boundaries, model save/load, graceful degradation on missing model file

- [ ] T032 Shadow deploy: compare learned vs manual weights on holdout queries — 3h
  - depends: T030
  - **Acceptance**: Shadow comparison on 20% holdout shows learned weights match or exceed manual weights on MRR@5 and NDCG@10; results documented with confidence intervals

- [ ] T033 Document model coefficients and SHAP feature importance — 1h
  - depends: T032
  - **Acceptance**: Documentation includes: trained weights, SHAP importance ranking, LOOCV metrics, holdout comparison, recommendation for live activation threshold
<!-- /ANCHOR:phase-d -->

---

<!-- ANCHOR:phase-1 -->
<!-- Phase A content above -->
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
<!-- Phase B content above -->
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
<!-- Phase C content above -->
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 33 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 6 feature flags operational and independently toggleable
- [ ] Eval metrics recorded for each phase (A, B, C, D)
- [ ] MRR@5 improvement >= +1 point overall
- [ ] NDCG@10 improvement >= +1 point overall
- [ ] Simple-query p95 latency unchanged
- [ ] All existing tests pass (4876+ test suite)
- [ ] New tests written and passing (~30+ tests)
- [ ] Shadow comparison data captured for all 3 fusion policies
- [ ] Learned combiner LOOCV R-squared > 0.5
- [ ] SHAP feature importance documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Parent Tasks**: See `../tasks.md`
- **Sibling: D3 Graph Retrieval**: See `../003-graph-augmented-retrieval/` (Phase C dependency)
- **Sibling: D4 Feedback Learning**: See `../004-feedback-quality-learning/` (Phase D dependency)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 1 of 5 (Research-Based Refinement)
- D1: Fusion & Scoring Intelligence
- 33 tasks across 4 phases (A: 10, B: 7, C: 9, D: 7)
- ~6 weeks total effort
- TypeScript sketches included as implementation hints
-->
