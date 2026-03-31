---
title: "Implementation [02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/plan]"
description: "Cross-phase coordination plan for 5 sub-phases implementing 29 research recommendations across fusion, query, graph, feedback, and UX dimensions."
trigger_phrases:
  - "research refinement plan"
  - "implementation waves"
  - "cross-phase coordination"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Research-Based Refinement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
- **Language:** TypeScript (strict mode)
- **Framework:** MCP Server (Model Context Protocol)
- **Storage:** SQLite (better-sqlite3 + sqlite-vec + FTS5)
- **Testing:** Vitest (4876+ existing tests)
- **Feature Flags:** ~15 existing + 28 new

### Overview

Implements 29 research recommendations across 5 parallel sub-phases. The key architectural principle: **calibrate before learning, log before changing, shadow before live**. All new features are gated behind feature flags. The simple-query fast path must remain sub-second p95.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Research report reviewed for each dimension
- [ ] TypeScript sketches validated against current codebase
- [ ] Feature flag names confirmed unique (no collisions)
- [ ] Eval baseline recorded (MRR@5, NDCG@10, Recall@20, HitRate@1)

### Definition of Done
- [ ] All 29 recommendations implemented
- [ ] All 28 feature flags created and documented
- [ ] All existing tests pass
- [ ] New tests written for each feature flag
- [ ] Eval metrics recorded post-implementation
- [ ] Simple-query p95 latency unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Cross-Phase Dependency Graph

```
D4.A (Event Ledger) ─────────────────────┐
D3.A (Typed Traversal) ──┐               │
D1.A (Calibration) ──────┤               │
D5.A (Recovery UX) ──────┤               │
                          ▼               ▼
                     D2.A (Query) ── D4.B (Batch Learning)
                     D3.B (Lifecycle)     │
                          │               │
                          ▼               ▼
                     D1.B (Shadow Lab)    D4.C (Shadow Scoring)
                     D1.C (Fusion Router) D3.C (Calibration)
                     D5.B (Explain)       D2.B (LLM Integration)
                          │
                          ▼
                     D1.D (Learned Weights)
                     D2.C (Index-Time)
                     D5.C (Progressive)
```

### Key Components
- **Stage 1 (Candidate Gen):** Modified by D2 (decomposition, concept routing, HyDE)
- **Stage 2 (Fusion & Scoring):** Modified by D1 (calibration, learned weights), D4 (feedback signals)
- **Stage 3 (Reranking):** Mostly unchanged
- **Stage 4 (Filtering):** Modified by D5 (progressive disclosure, confidence)
- **Graph Channel:** Modified by D3 (typed traversal, lifecycle, enrichment)
- **Save Pipeline:** Modified by D4 (quality gates, reconsolidation), D3 (enrichment)
- **Response Envelope:** Modified by D5 (explainability, profiles, recovery)
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Foundations (parallel, no inter-dependencies)
All sub-phases can start their Phase A simultaneously:

| Child | Phase | Items | Effort | Focus |
|-------|-------|-------|--------|-------|
| D4 | A | #2, #3, #7 | 3S | Event ledger, FSRS hybrid, quality gate exception |
| D3 | A | #4, #5 | 2S | Sparse-first policy, intent-aware edge traversal |
| D1 | A | #1, #9 | 1S+1M | Calibrated overlap, K-optimization |
| D5 | A | #6, #18 | 1S+1M | Recovery UX, per-result confidence |

### Phase 2 — Core Improvements (after Phase 1)

| Child | Phase | Items | Effort | Focus |
|-------|-------|-------|--------|-------|
| D2 | A | #10, #11 | 1M+1S/M | Query decomposition, graph concept routing |
| D3 | B | #13, #14 | 2M | Graph refresh on write, save-time enrichment |
| D4 | B | #19, #20 | 2M | Batch learning, assistive reconsolidation |

### Phase 3 — Advanced Features (after Phase 2)

| Child | Phase | Items | Effort | Focus |
|-------|-------|-------|--------|-------|
| D1 | B | #8 | 1M | Shadow fusion lab |
| D1 | C | #22, #23 | 2M | Query-aware graph weight, fusion router |
| D5 | B | #16, #17 | 2M | Explainability, mode-aware response |
| D2 | B | #12, #24 | 2M | LLM reformulation, HyDE shadow |

### Phase 4 — Final Items (after Phase 3)

| Child | Phase | Items | Effort | Focus |
|-------|-------|-------|--------|-------|
| D1 | D | #28 | 1M→L | Learned Stage 2 weights |
| D4 | C | #21 | 1M | Shadow scoring with holdout |
| D3 | C | #15, #29 | 2M | Graph calibration, communities |
| D2 | C | #25 | 1M/L | Index-time query surrogates |
| D5 | C | #26, #27 | 2L | Progressive disclosure, session state |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Per Child |
|-----------|-------|-------|-----------|
| Unit | Each feature flag toggle, each new module | Vitest | ~10-15 tests |
| Integration | Pipeline end-to-end with flags on/off | Vitest | ~5-8 tests |
| Eval | MRR@5, NDCG@10, Recall@20 per intent class | run-ablation.ts | 1 eval run |
| Shadow | Compare live vs new scoring on holdout | shadow-scoring.ts | D1, D4 |
| Latency | p95 regression for simple queries | benchmark | 1 per wave |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Child | S Items | M Items | L Items | Estimated Total |
|-------|---------|---------|---------|-----------------|
| D1 (Fusion) | 1 | 4 | 1 | ~6 weeks |
| D2 (Query) | 1 | 3 | 1 | ~5 weeks |
| D3 (Graph) | 2 | 4 | 0 | ~5 weeks |
| D4 (Feedback) | 3 | 3 | 0 | ~4 weeks |
| D5 (UX) | 1 | 3 | 2 | ~6 weeks |
| **Total** | **8** | **17** | **4** | **~26 weeks** |

With Wave parallelization (4 waves, 2-3 children per wave), critical path is ~14-16 weeks.
<!-- /ANCHOR:effort -->

### Related Documents

- [Spec](spec.md) — Phase coordination spec
- [Tasks](tasks.md) — Cross-phase tracking
- [Checklist](checklist.md) — Parent verification
- [Parent Plan](../plan.md) — Epic plan
- Research source preserved in the Phase 19 scratch artifacts

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

See §3 Architecture for cross-phase dependency graph.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger:** Eval regression > 5% on any core metric
- **Procedure:** Disable feature flags for affected wave, revert to previous flag state
- **Difficulty:** Low (all features gated behind flags)
<!-- /ANCHOR:rollback -->
