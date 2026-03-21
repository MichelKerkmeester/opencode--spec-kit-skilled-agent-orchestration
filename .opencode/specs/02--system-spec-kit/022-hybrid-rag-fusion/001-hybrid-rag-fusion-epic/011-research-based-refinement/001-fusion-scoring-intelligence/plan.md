---
title: "Implementation Plan: Fusion & Scoring Intelligence"
description: "Four-phase implementation plan for D1 fusion calibration, shadow fusion lab, query-aware routing, and learned Stage 2 weights across the 4-stage retrieval pipeline."
# SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "D1 implementation plan"
  - "fusion calibration phases"
  - "shadow fusion lab plan"
  - "learned weights plan"
importance_tier: "important"
contextType: "implementation"
---

# Implementation Plan: Fusion & Scoring Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict mode) |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (better-sqlite3 + sqlite-vec + FTS5) |
| **Testing** | Vitest (4876+ existing tests) |
| **Feature Flags** | 6 new (`SPECKIT_CALIBRATED_OVERLAP_BONUS`, `SPECKIT_FUSION_POLICY_SHADOW_V2`, `SPECKIT_RRF_K_EXPERIMENTAL`, `SPECKIT_GRAPH_QUERY_GATING_V1`, `SPECKIT_FUSION_POLICY_ROUTER`, `SPECKIT_LEARNED_STAGE2_COMBINER`) |

### Overview

This plan implements 6 research recommendations (#1, #8, #9, #22, #23, #28) that calibrate fusion heuristics and introduce data-driven scoring across the Stage 2 pipeline. The approach follows a strict progression: **calibrate first** (Phase A establishes baselines and replaces flat constants), **build shadow infrastructure** (Phase B enables safe experimentation), **wire query-awareness** (Phase C introduces intent-based routing), and **learn weights last** (Phase D trains on accumulated data). All features are gated behind independent feature flags with fallback to existing behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Current rrf-fusion.ts read and understood (overlap bonus, K parameter, score accumulation)
- [ ] k-value-analysis.ts read and understood (existing K testing infrastructure)
- [ ] Eval baseline recorded: MRR@5, NDCG@10, Recall@20, HitRate@1 per intent class
- [ ] Feature flag names confirmed unique against existing ~15 flags
- [ ] Judged relevance query set identified (minimum 50 queries)

### Definition of Done
- [ ] All 6 feature flags operational and independently toggleable
- [ ] All existing tests pass (4876+ test suite)
- [ ] New unit tests written for each requirement (target: 30+ tests)
- [ ] Eval metrics recorded post-implementation per phase
- [ ] Simple-query p95 latency unchanged
- [ ] Shadow comparison data captured for at least 100 queries
- [ ] SHAP feature importance documented for learned combiner
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline Extension -- modifications to existing 4-stage retrieval pipeline with new modules injected at Stage 1 (graph weight gating) and Stage 2 (fusion policy routing, learned combiner).

### Key Components

- **rrf-fusion.ts**: Core fusion algorithm -- receives calibrated overlap bonus (Phase A), parameterized K (Phase A), fusion policy type system (Phase B)
- **fusion-lab.ts** (new): Shadow comparison infrastructure -- runs multiple fusion policies in parallel, captures telemetry, returns active policy result only
- **k-value-analysis.ts**: Existing K analysis module -- extended with judged relevance evaluation and per-intent segmentation
- **hybrid-search.ts**: Search orchestrator -- receives query-aware graph weight gating (Phase C)
- **adaptive-fusion.ts**: Fusion configuration -- receives QPP feature extraction and fusion policy router (Phase C)
- **stage1-candidate-gen.ts**: Candidate generation -- receives parameterized graph weight from router
- **stage2-fusion.ts**: Stage 2 scoring -- receives feature vector extraction for learned combiner (Phase D)
- **learned-combiner.ts** (new): Regularized linear ranker with LOOCV validation and SHAP feature importance

### Pipeline Integration Points

```
Stage 1 (Candidate Gen)
  ├── Graph weight gating ← Phase C (REQ-D1-004)
  └── Channel dispatch (unchanged)
         ↓
Stage 2 (Fusion & Scoring)
  ├── RRF with calibrated overlap ← Phase A (REQ-D1-001)
  ├── K parameterization ← Phase A (REQ-D1-003)
  ├── Shadow fusion lab ← Phase B (REQ-D1-002)
  ├── Fusion policy router ← Phase C (REQ-D1-005)
  └── Learned combiner ← Phase D (REQ-D1-006)
         ↓
Stage 3 (Reranking) — unchanged
         ↓
Stage 4 (Filtering) — unchanged
```

### Data Flow

1. Query enters with intent classification (existing)
2. Phase C: Router selects fusion policy based on QPP features and intent
3. Phase C: Graph weight adjusted based on intent eligibility
4. Stage 1 dispatches channels with adjusted weights
5. Phase A: RRF fusion applies calibrated overlap bonus and optimized K
6. Phase B: Shadow lab runs alternative policies in parallel, captures telemetry
7. Phase D: Learned combiner produces final score from 8-feature vector (shadow-only initially)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Calibration Foundations (REQ-D1-001, REQ-D1-003)

**Goal**: Replace flat heuristic constants with calibrated, empirically-validated values. Establishes eval baseline for all subsequent phases.

**Prerequisites**: None (independent, first to execute)
**Wave**: 1 (parallel with D3.A, D4.A, D5.A)

- [ ] Read and understand current `rrf-fusion.ts` overlap bonus logic
- [ ] Implement calibrated overlap bonus with channel-aware scaling
- [ ] Add `SPECKIT_CALIBRATED_OVERLAP_BONUS` feature flag with fallback to flat +0.10
- [ ] Write unit tests for overlap bonus edge cases (0 channels, 1 channel, all channels)
- [ ] Read and understand current `k-value-analysis.ts` infrastructure
- [ ] Extend K analysis with judged relevance evaluation framework
- [ ] Implement per-intent K sweep over {10, 20, 40, 60, 80, 100, 120}
- [ ] Add `SPECKIT_RRF_K_EXPERIMENTAL` feature flag with fallback to K=60
- [ ] Record baseline eval metrics (MRR@5, NDCG@10 per intent class)
- [ ] Write unit tests for K-optimization (metric computation, intent segmentation)

### Phase B: Shadow Infrastructure (REQ-D1-002)

**Goal**: Build safe experimentation infrastructure for comparing fusion policies without affecting live results.

**Prerequisites**: Phase A eval data (baseline metrics needed for comparison)
**Wave**: 3 (after Wave 1 foundations)

- [ ] Design `FusionPolicy` type system and policy registry
- [ ] Implement minmax_linear score normalizer in `fusion-lab.ts`
- [ ] Implement zscore_linear score normalizer in `fusion-lab.ts`
- [ ] Build shadow comparison runner (parallel execution, telemetry capture)
- [ ] Add `SPECKIT_FUSION_POLICY_SHADOW_V2` feature flag
- [ ] Write integration tests for shadow lab (3 policies, telemetry recording)
- [ ] Validate shadow overhead stays within 15ms p95 budget

### Phase C: Query-Aware Fusion (REQ-D1-004, REQ-D1-005)

**Goal**: Make fusion policy and graph weight respond to query characteristics instead of using static values.

**Prerequisites**: D3 Phase A (typed traversal for graph quality signals), D1-002 (shadow lab validation data)
**Wave**: 3 (after Wave 1 D3.A completes)

- [ ] Implement `looksLikeLiteralId()` query classifier
- [ ] Implement query-aware graph weight in `hybrid-search.ts`
- [ ] Add `SPECKIT_GRAPH_QUERY_GATING_V1` feature flag with fallback to static weight
- [ ] Implement QPP features: score spread, channel agreement, graph quality prior
- [ ] Build fusion policy router in `adaptive-fusion.ts`
- [ ] Add `SPECKIT_FUSION_POLICY_ROUTER` feature flag with fallback to RRF
- [ ] Write integration tests for graph weight gating (literal vs multi-hop queries)
- [ ] Write integration tests for fusion routing (policy selection per intent class)
- [ ] Run eval comparing static vs query-aware fusion (target: +2-6 NDCG@10 on graph queries)

### Phase D: Learned Weights (REQ-D1-006)

**Goal**: Train a regularized linear ranker from accumulated judged relevance data, replacing manual Stage 2 weight tuning.

**Prerequisites**: D4 Phase A (event ledger for training data), sufficient judged queries (50+ per intent class)
**Wave**: 4 (last to implement)

- [ ] Design 8-feature vector extraction from Stage 2 signals
- [ ] Implement regularized linear ranker (L2 ridge regression) in `learned-combiner.ts`
- [ ] Build LOOCV validation pipeline
- [ ] Implement SHAP feature importance computation
- [ ] Add `SPECKIT_LEARNED_STAGE2_COMBINER` feature flag (shadow-only initially)
- [ ] Write unit tests for feature extraction, training, prediction, and validation
- [ ] Shadow deploy: compare learned vs manual weights on holdout queries
- [ ] Document model coefficients and SHAP feature importance
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Target Count |
|-----------|-------|-------|-------------|
| Unit | Overlap bonus math, K sweep, normalizers, feature extraction, linear ranker | Vitest | ~20-25 tests |
| Integration | Shadow lab end-to-end, fusion routing pipeline, graph weight gating | Vitest | ~8-10 tests |
| Eval | MRR@5, NDCG@10, Recall@20 per intent class per phase | run-ablation.ts | 4 eval runs (one per phase) |
| Shadow | Policy comparison on holdout queries, learned vs manual weights | shadow-scoring.ts | Continuous during Phase B-D |
| Latency | Simple-query p95 regression per phase | benchmark | 4 benchmark runs |

### Test Data Requirements

- Minimum 50 judged relevance queries with relevance labels per intent class
- Intent class distribution: factual (~40%), understand (~30%), find_decision (~20%), literal_id (~10%)
- Holdout set: 20% of judged queries reserved for validation (not used in K-optimization or model training)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| D3 Phase A (typed traversal) | Internal (sibling phase) | Yellow — Wave 1 | Phase C graph weight gating lacks quality signals; can proceed with static prior as fallback |
| D4 Phase A (event ledger) | Internal (sibling phase) | Yellow — Wave 1 | Phase D learned weights lacks training data; phase deferred until ledger operational |
| D1 Phase A (calibration) | Internal (own phase) | Green — first to execute | Phase B needs baseline metrics from Phase A for comparison |
| D1 Phase B (shadow lab) | Internal (own phase) | Green — Phase B | Phase C fusion router needs shadow lab validation data |
| Judged relevance query set | Data requirement | Yellow — needs curation | K-optimization and learned weights need labeled data; minimum 50 queries per intent |
| Vitest test suite (4876+ tests) | Test infrastructure | Green — existing | All existing tests must continue to pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any eval metric regresses by more than 1 point, or p95 latency increases by more than 50ms
- **Procedure**: Disable the specific feature flag causing regression; all 6 flags are independent and default to OFF
- **Granularity**: Per-flag rollback (no need to revert entire phase)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (Calibration) ────────┐
                               ├──► Phase B (Shadow Lab) ──► Phase C (Query-Aware)
                               │                                      │
D3.A (external) ──────────────┘                                      │
                                                                      ▼
D4.A (external) ──────────────────────────────────────────────► Phase D (Learned)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A (Calibration) | None | B, C |
| B (Shadow Lab) | A (baseline metrics) | C (validation data) |
| C (Query-Aware) | B (shadow data), D3.A (graph signals) | D (partial — routing informs feature design) |
| D (Learned Weights) | D4.A (training data), A+B+C (feature maturity) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Requirements | Complexity | Estimated Effort |
|-------|-------------|------------|------------------|
| A — Calibration Foundations | REQ-D1-001, REQ-D1-003 | Medium | ~1.5 weeks |
| B — Shadow Infrastructure | REQ-D1-002 | Medium | ~1 week |
| C — Query-Aware Fusion | REQ-D1-004, REQ-D1-005 | Medium-High | ~2 weeks |
| D — Learned Weights | REQ-D1-006 | High | ~1.5 weeks |
| **Total** | **6 requirements** | | **~6 weeks** |

**Note**: Phases A and B can overlap slightly (B starts as A nears completion). Phase C requires external dependency (D3.A). Phase D requires external dependency (D4.A) and sufficient judged data. Total elapsed time depends on Wave scheduling from the parent plan.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 6 feature flags default to OFF in configuration
- [ ] Eval baseline recorded before each phase activation
- [ ] Shadow scoring comparison data available for validation

### Rollback Procedure
1. Disable specific feature flag (immediate, no restart needed)
2. Verify eval metrics return to baseline within 1 query cycle
3. Review telemetry logs for root cause of regression
4. If flag-level rollback insufficient, redeploy previous version of modified file

### Data Reversal
- **Has data migrations?** No (all changes are in-memory scoring, no schema changes)
- **Reversal procedure**: N/A — feature flags control all behavior; disabling flag reverts to previous logic
- **Model artifacts**: Learned combiner model file can be deleted; system falls back to manual weights
<!-- /ANCHOR:enhanced-rollback -->

---

## 8. RELATED DOCUMENTS

- [Spec](spec.md) -- D1 feature specification
- [Tasks](tasks.md) -- D1 task breakdown
- [Parent Spec](../spec.md) -- Research-Based Refinement coordination
- [Parent Plan](../plan.md) -- Cross-phase implementation waves
- [Sibling: D3 Graph Retrieval](../003-graph-augmented-retrieval/spec.md) -- Provides graph quality signals for Phase C
- [Sibling: D4 Feedback Learning](../004-feedback-quality-learning/spec.md) -- Provides training data for Phase D
- [Research Source](../../../019-deep-research-rag-improvement/research/research.md) -- Recommendations #1, #8, #9, #22, #23, #28

<!--
LEVEL 2 PLAN — Phase 1 of 5 (Research-Based Refinement)
- D1: Fusion & Scoring Intelligence
- 4 implementation phases: Calibration → Shadow → Query-Aware → Learned
- ~6 weeks total effort
- Cross-dependencies with D3.A and D4.A
-->
