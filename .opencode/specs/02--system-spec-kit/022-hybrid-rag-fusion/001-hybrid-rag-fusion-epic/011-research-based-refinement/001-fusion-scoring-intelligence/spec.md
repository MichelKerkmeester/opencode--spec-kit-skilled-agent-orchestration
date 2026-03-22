---
title: "Feature Specification: Fusion & Scoring Intelligence"
description: "Calibrate fusion heuristics, build shadow fusion lab, implement query-aware graph weight, per-query fusion routing, and learned Stage 2 weights."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "fusion scoring"
  - "RRF calibration"
  - "shadow fusion lab"
  - "learned weights"
  - "overlap bonus"
  - "k-optimization"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

# Feature Specification: Fusion & Scoring Intelligence

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-21 |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 1 of 5 |
| **Predecessor** | None (first child) |
| **Successor** | `../002-query-intelligence-reformulation/spec.md` |
| **Handoff Criteria** | All 6 feature flags operational, MRR@5 and NDCG@10 baselines recorded, shadow scoring infrastructure validated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 1** of the Research-Based Refinement specification.

**Scope Boundary**: Fusion calibration, shadow fusion lab, query-aware graph weight, per-query fusion routing, and learned Stage 2 weights. All changes target the Stage 2 (Fusion & Scoring) layer with controlled additions to Stage 1 candidate generation for graph weight gating.

**Dependencies**:
- None for Phase A/B (independent calibration and shadow infrastructure)
- D3 Phase A (typed traversal) for Phase C graph quality signals
- D4 Phase A (event ledger) for Phase D training data

**Deliverables**:
- Calibrated overlap bonus replacing flat +0.10 constant
- Per-intent optimal RRF K values from judged relevance data
- Shadow fusion comparison infrastructure (RRF vs minmax_linear vs zscore_linear)
- Query-aware graph weight gating
- Intent-based fusion policy router
- Learned Stage 2 linear ranker (shadow-only initially)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current fusion pipeline relies on flat heuristic constants: a fixed RRF K=60, a flat convergence bonus of +0.10, a static graph boost of 1.5x, and hard-coded Stage 2 signal weights. Deep research (5 GPT 5.4 agents, 1.35M tokens) identified these as the primary gap -- the code is mature but the calibration is not data-driven. Without query-aware tuning, literal ID lookups receive the same fusion treatment as multi-hop causal queries, leaving measurable retrieval quality on the table.

### Purpose

Replace flat fusion heuristics with data-driven, query-aware scoring across the Stage 2 pipeline, achieving measurable MRR@5 and NDCG@10 improvement while preserving simple-query latency and providing shadow infrastructure for safe experimentation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Calibrated overlap bonus scaling with channel count (REQ-D1-001)
- Shadow fusion lab comparing 3 fusion policies (REQ-D1-002)
- Per-intent K-optimization with judged relevance (REQ-D1-003)
- Query-aware graph weight gating by intent class (REQ-D1-004)
- Intent-driven fusion policy router (REQ-D1-005)
- Learned Stage 2 linear ranker with regularization (REQ-D1-006)

### Out of Scope

- Changes to embedding model or provider -- calibration only
- Stage 3 reranking modifications -- fusion layer only
- Database schema migrations -- all additive via feature flags
- LLM-based reformulation -- that is D2 scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/algorithms/rrf-fusion.ts` | Modify | Calibrated overlap bonus, K parameterization, fusion policy types |
| `shared/algorithms/fusion-lab.ts` | Create | Shadow fusion comparison infrastructure (minmax_linear, zscore_linear) |
| `shared/algorithms/k-value-analysis.ts` | Modify | Extend with judged relevance evaluation, per-intent K testing |
| `shared/search/hybrid-search.ts` | Modify | Query-aware graph weight gating |
| `shared/search/adaptive-fusion.ts` | Modify | Fusion policy router, QPP feature extraction |
| `shared/search/stage1-candidate-gen.ts` | Modify | Graph weight parameterization from router |
| `shared/ranking/stage2-fusion.ts` | Modify | Feature vector extraction for learned combiner |
| `shared/ranking/learned-combiner.ts` | Create | Regularized linear ranker, LOOCV, SHAP validation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Size | Feature Flag | Acceptance Criteria |
|----|-------------|------|-------------|---------------------|
| REQ-D1-001 | **Calibrated Overlap Bonus** — Replace flat +0.10 convergence bonus with query-aware bounded feature that scales with channel hit ratio and mean normalized score. | S | `SPECKIT_CALIBRATED_OVERLAP_BONUS` | Overlap bonus scales with channel count, capped at 0.06, eval shows no regression on existing test queries |
| REQ-D1-003 | **K-Optimization with Judged Relevance** — Test K values in {10, 20, 40, 60, 80, 100, 120} segmented by intent class using judged relevance data. | M | `SPECKIT_RRF_K_EXPERIMENTAL` | Per-intent optimal K determined, documented with eval data, fallback to K=60 preserved |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Size | Feature Flag | Acceptance Criteria |
|----|-------------|------|-------------|---------------------|
| REQ-D1-002 | **Shadow Fusion Lab** — Evaluate RRF vs minmax_linear vs zscore_linear on judged queries with telemetry recording. | M | `SPECKIT_FUSION_POLICY_SHADOW_V2` | Shadow comparison infrastructure operational, 3 policies evaluable, telemetry recorded per query |
| REQ-D1-004 | **Query-Aware Graph Weight** — Promote graph channel for multi-hop/causal queries (understand, find_decision), demote for literal lookups. Cross-dep: needs D3 Phase A typed traversal for graph quality signals. | M | `SPECKIT_GRAPH_QUERY_GATING_V1` | Graph weight varies by intent class (0.2 for literal, 0.6-1.6 for graph-eligible), eval shows +2-6 NDCG@10 on graph queries |
| REQ-D1-005 | **Intent Router Selects Fusion Family** — Route between RRF, score fusion, and graph-heavy fusion based on QPP features (score spread, channel agreement). Cross-dep: needs D1-002 shadow lab results. | M | `SPECKIT_FUSION_POLICY_ROUTER` | Fusion family selection active for all query types, fallback to RRF preserved, eval shows improvement over static RRF |
| REQ-D1-006 | **Learned Stage 2 Weights** — Train regularized linear ranker from judged relevance data using 8-feature vector. Cross-dep: needs D4 Phase A event ledger for training data. | M->L | `SPECKIT_LEARNED_STAGE2_COMBINER` | Linear ranker trained with LOOCV validation, SHAP feature importance documented, shadow-only deployment initially |

### Requirement Details

#### REQ-D1-001: Calibrated Overlap Bonus

**Research Source**: Recommendation #1
**File**: `shared/algorithms/rrf-fusion.ts`

```typescript
// Replace flat +0.10 convergence bonus
const overlapRatio = (channelsHit - 1) / Math.max(1, totalChannels - 1);
const overlapScore = beta * overlapRatio * meanTopNormScore(id);
score += clamp(overlapScore, 0, 0.06);
```

The `beta` parameter controls the strength of the overlap signal. The cap at 0.06 prevents any single convergence signal from dominating the fusion score. `meanTopNormScore(id)` anchors the bonus to the actual retrieval quality of the candidate across channels.

#### REQ-D1-002: Shadow Fusion Lab

**Research Source**: Recommendation #8
**Files**: `shared/algorithms/rrf-fusion.ts`, `shared/algorithms/fusion-lab.ts` (new)

```typescript
type FusionPolicy = 'rrf' | 'minmax_linear' | 'zscore_linear';

// fusion-lab.ts — shadow comparison infrastructure
shadow.compare(['rrf', 'minmax_linear', 'zscore_linear']);
```

The shadow lab runs all three fusion policies in parallel on each query but only returns the active policy's results. Telemetry captures per-policy NDCG@10, MRR@5, and latency for later analysis.

#### REQ-D1-003: K-Optimization with Judged Relevance

**Research Source**: Recommendation #9
**Files**: `shared/algorithms/rrf-fusion.ts`, `shared/algorithms/k-value-analysis.ts`

```typescript
for (const k of [10, 20, 40, 60, 80, 100, 120]) {
  metrics[k] = evalQueries(qset, q => fuseRrf(q.channels, { k }));
}
bestK[intent] = argmax(metrics, 'ndcg10');
```

The current K=60 was chosen by convention. Judged relevance data enables empirical selection per intent class (e.g., factual lookups may prefer K=20 while exploratory queries may prefer K=80).

#### REQ-D1-004: Query-Aware Graph Weight

**Research Source**: Recommendation #22
**Files**: `shared/search/hybrid-search.ts`, `shared/search/adaptive-fusion.ts`

```typescript
const graphEligible = intent in ['understand', 'find_decision'] && !looksLikeLiteralId(query);
stage1.graphWeight = graphEligible ? lerp(0.6, 1.6, graphPrior) : 0.2;
```

Literal ID lookups (e.g., "get memory M-1234") gain nothing from graph traversal and pay latency cost. Multi-hop queries ("why was X decided?") benefit significantly from graph context.

**Cross-Dependency**: Needs D3 Phase A (typed traversal) for graph quality signals that inform `graphPrior`.

#### REQ-D1-005: Intent Router Selects Fusion Family

**Research Source**: Recommendation #23
**Files**: `shared/search/adaptive-fusion.ts`, `shared/search/stage1-candidate-gen.ts`

```typescript
if (qpp.low && scoreSpread.high) policy = 'minmax_linear';
else if (looksLikeLiteralId(query)) policy = 'rrf';
else if (graphIntent && graphQuality.high) policy = 'rrf+graph';
```

QPP (Query Performance Prediction) features — score spread across channels and channel agreement — indicate when RRF's rank-based fusion is suboptimal. High score spread with low QPP suggests score-based fusion (minmax_linear) will better separate relevant from irrelevant.

**Cross-Dependency**: Needs D1-002 shadow lab results to validate which policy wins under which conditions.

#### REQ-D1-006: Learned Stage 2 Weights

**Research Source**: Recommendation #28
**Files**: `shared/ranking/stage2-fusion.ts`, `shared/ranking/learned-combiner.ts` (new)

```typescript
features = [rrf, overlap, graph, session, causal, feedback, validation, artifact];
model = trainRegularizedLinearRanker(features, labels);
score = clamp(model.predict(features), 0, 1);
```

The 8-feature vector captures all Stage 2 signals. A regularized linear model (L2 ridge regression) is interpretable and robust against small-corpus overfitting. SHAP values provide feature importance for debugging. Initially deployed in shadow mode only.

**Cross-Dependency**: Needs D4 Phase A (event ledger) for training labels.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-D1-001**: MRR@5 improvement >= +1 point across the eval query set
- **SC-D1-002**: NDCG@10 improvement >= +1 point across the eval query set
- **SC-D1-003**: No p95 latency regression on simple queries (sub-second preserved)
- **SC-D1-004**: All 6 feature flags operational and independently toggleable
- **SC-D1-005**: Shadow fusion lab captures telemetry for all 3 policies per query
- **SC-D1-006**: Learned combiner LOOCV R-squared > 0.5, SHAP importance documented
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overfitting on small corpus — learned weights and K-optimization may overfit with limited judged queries | High | L2 regularization, LOOCV validation, shadow-only initial deployment, minimum 50 judged queries before training |
| Risk | Score-fusion miscalibration — minmax_linear or zscore_linear may distort scores when channel distributions differ | Medium | Shadow lab comparison validates against RRF baseline; automatic fallback to RRF if policy degrades MRR@5 |
| Risk | Opaque learned weights — linear ranker coefficients may be hard to interpret despite SHAP | Medium | Constrain to linear model only (no neural), document SHAP feature importance, maintain manual weight override path |
| Risk | Graph weight gating false negatives — intent classifier may incorrectly demote graph for queries that need it | Medium | Conservative threshold (default graph-eligible), A/B shadow comparison, per-query telemetry for debugging |
| Dependency | D3 Phase A (typed traversal) | D1 Phase C blocked without graph quality signals | Execute D3 Phase A in Wave 1; Phase A/B of D1 are independent |
| Dependency | D4 Phase A (event ledger) | D1 Phase D blocked without training data | Execute D4 Phase A in Wave 1; learned weights are last phase |
| Dependency | D1-002 (shadow lab) | D1-005 (fusion router) needs shadow lab validation data | Internal sequencing: Phase B before Phase C |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Simple-query p95 latency must not increase (sub-second preserved)
- **NFR-P02**: Shadow fusion overhead <= 15ms additional (runs in parallel, not serial)
- **NFR-P03**: Learned combiner inference <= 1ms (linear model, 8 features)

### Reliability
- **NFR-R01**: All new capabilities remain feature-flagged; rollout state may graduate to default-on after validation, but effective flag state must remain reproducible and logged per query
- **NFR-R02**: Fallback to existing RRF if any fusion policy throws or times out
- **NFR-R03**: Learned combiner gracefully degrades to manual weights on model load failure

### Observability
- **NFR-O01**: Shadow lab telemetry records per-policy NDCG@10, MRR@5, and latency per query
- **NFR-O02**: Feature flag state logged on each query for reproducibility
- **NFR-O03**: K-optimization results stored with eval metadata for auditability
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Zero channels hit: Overlap bonus is 0 (overlapRatio = 0 when channelsHit <= 1)
- Single channel only: Graph weight gating still applies; overlap bonus inactive
- Empty query: Intent classifier returns `unknown`; fusion defaults to RRF with K=60

### Error Scenarios
- Shadow lab policy throws: Log error, return primary policy result unaffected
- K-optimization produces tie: Select lower K value (faster convergence)
- Learned combiner model file missing: Fall back to manual Stage 2 weights

### State Transitions
- Feature flag toggled mid-session: Next query uses new policy; no session state to invalidate
- K-optimization rerun with new judged data: New K values overwrite previous; old data archived
- Fusion policy router confidence too low: Default to RRF (safe fallback)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 8 files (2 new, 6 modified), ~800-1200 LOC estimated |
| Risk | 14/25 | Overfitting risk on small corpus, cross-deps with D3/D4 |
| Research | 12/20 | Research complete; implementation requires eval infrastructure |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

- What is the minimum number of judged queries needed before K-optimization results are trustworthy? (Proposed: 50 per intent class)
- Should the fusion policy router use hard thresholds or a soft scoring approach for policy selection?
- What is the acceptable shadow lab overhead budget per query? (Proposed: 15ms p95)

---

## 8. RELATED DOCUMENTS

- [Parent Spec](../spec.md) -- Research-Based Refinement coordination
- [Parent Plan](../plan.md) -- Cross-phase implementation waves
- [Parent Tasks](../tasks.md) -- Cross-phase tracking
- [Plan](plan.md) -- D1 implementation phases
- [Tasks](tasks.md) -- D1 task breakdown
- [Sibling: D2 Query Intelligence](../002-query-intelligence-reformulation/spec.md) -- Successor phase
- [Sibling: D3 Graph Retrieval](../003-graph-augmented-retrieval/spec.md) -- Provides graph quality signals for Phase C
- [Sibling: D4 Feedback Learning](../004-feedback-quality-learning/spec.md) -- Provides training data for Phase D
- [Research Source](../../../019-deep-research-rag-improvement/research/research.md) -- Recommendations #1, #8, #9, #22, #23, #28

<!--
LEVEL 2 SPEC — Phase 1 of 5 (Research-Based Refinement)
- D1: Fusion & Scoring Intelligence
- 6 requirements from research recommendations
- Cross-dependencies with D3 (graph) and D4 (feedback)
- Shadow-first deployment strategy
-->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->
