---
title: "Tasks: Research-Based Refinement"
description: "Cross-phase coordination tasks for 5 sub-phases implementing 29 research recommendations."
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "research refinement tasks"
  - "cross-phase tasks"
importance_tier: "important"
contextType: "implementation"
---

# Tasks: Research-Based Refinement

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-0 -->
## Phase 0: Setup & Baseline

- [ ] T001 Record eval baseline (MRR@5, NDCG@10, Recall@20, HitRate@1) per intent class
- [ ] T002 Verify all 28 feature flag names are unique (no collision with existing ~15 flags)
- [ ] T003 Create feature flag documentation entry in environment_variables.md
<!-- /ANCHOR:phase-0 -->

<!-- ANCHOR:wave-1 -->
## Wave 1: Foundations (Parallel)

- [x] T004 [P] Execute D4 Phase A — Event ledger, FSRS hybrid, quality gate exception (#2, #3, #7)
  - See: `004-feedback-quality-learning/tasks.md`
  - Evidence: feedback-ledger.ts created, fsrs-scheduler.ts extended, save-quality-gate.ts extended, 3 feature flags, 101 tests
- [x] T005 [P] Execute D3 Phase A — Sparse-first policy, intent-aware traversal (#4, #5)
  - See: `003-graph-augmented-retrieval/tasks.md`
  - Evidence: causal-boost.ts extended with sparse-first + intent-aware traversal, 113 tests passing
- [x] T006 [P] Execute D1 Phase A — Calibrated overlap, K-optimization (#1, #9)
  - See: `001-fusion-scoring-intelligence/tasks.md`
  - Evidence: rrf-fusion.ts modified, k-value-analysis.ts created, 128 tests passing
- [x] T007 [P] Execute D5 Phase A — Recovery UX, per-result confidence (#6, #18)
  - See: `005-retrieval-ux-presentation/tasks.md`
  - Evidence: recovery-payload.ts + confidence-scoring.ts created, formatters + handlers extended, 74 tests
- [ ] T008 Run eval after Wave 1 — compare MRR@5/NDCG@10 vs baseline
- [ ] T009 Run latency regression — verify simple-query p95 < 1s
<!-- /ANCHOR:wave-1 -->

<!-- ANCHOR:wave-2 -->
## Wave 2: Core Improvements (After Wave 1)

- [x] T010 [P] Execute D2 Phase A — Query decomposition, graph concept routing (#10, #11)
  - See: `002-query-intelligence-reformulation/tasks.md`
  - Evidence: query-decomposer.ts created, entity-linker.ts + stage1-candidate-gen.ts extended, 65 tests
- [x] T011 [P] Execute D3 Phase B — Graph refresh, save-time enrichment (#13, #14)
  - See: `003-graph-augmented-retrieval/tasks.md`
  - Evidence: graph-lifecycle.ts (814 lines), post-insert.ts wired, search-flags.ts extended, 69 tests
- [x] T012 [P] Execute D4 Phase B — Batch learning, reconsolidation (#19, #20)
  - See: `004-feedback-quality-learning/tasks.md`
  - Evidence: batch-learning.ts (528 lines), reconsolidation-bridge.ts +179 lines, 53+15 tests
- [ ] T013 Run eval after Wave 2
<!-- /ANCHOR:wave-2 -->

<!-- ANCHOR:wave-3 -->
## Wave 3: Advanced Features (After Wave 2)

- [x] T014 [P] Execute D1 Phases B+C — Shadow fusion lab, query-aware graph, fusion router (#8, #22, #23)
  - See: `001-fusion-scoring-intelligence/tasks.md`
  - Evidence: fusion-lab.ts (496 lines), shared/algorithms/index.ts extended, fusion-lab.vitest.ts 704 lines
- [x] T015 [P] Execute D5 Phase B — Explainability, mode-aware response (#16, #17)
  - See: `005-retrieval-ux-presentation/tasks.md`
  - Evidence: result-explainability.ts (364 lines), profile-formatters.ts (493 lines), formatters + handlers extended
- [x] T016 [P] Execute D2 Phase B — LLM reformulation, HyDE shadow (#12, #24)
  - See: `002-query-intelligence-reformulation/tasks.md`
  - Evidence: llm-reformulation.ts (451 lines), hyde.ts (459 lines), llm-cache.ts (199 lines), stage1 wired
- [ ] T017 Run eval after Wave 3
<!-- /ANCHOR:wave-3 -->

<!-- ANCHOR:wave-4 -->
## Wave 4: Final Items (After Wave 3)

- [x] T018 [P] Execute D1 Phase D — Learned Stage 2 weights (#28)
  - Evidence: learned-combiner.ts (380 lines), ridge regression + LOOCV + SHAP, 51 tests
- [x] T019 [P] Execute D4 Phase C — Shadow scoring with holdout (#21)
  - Evidence: shadow-scoring.ts (430 lines), holdout selection + rank comparison + promotion gate, 87 tests
- [x] T020 [P] Execute D3 Phase C — Graph calibration, communities (#15, #29)
  - Evidence: graph-calibration.ts (370 lines), ablation harness + Louvain thresholds + community capping, 80 tests
- [x] T021 [P] Execute D2 Phase C — Index-time surrogates (#25)
  - Evidence: query-surrogates.ts (400 lines), heuristic extraction + SQLite storage + query-time matching, 80 tests
- [x] T022 [P] Execute D5 Phase C — Progressive disclosure, session state (#26, #27)
  - Evidence: progressive-disclosure.ts (310 lines) + session-state.ts (320 lines), cursor pagination + cross-turn dedup, 94 tests
- [ ] T023 Run final eval — compare all metrics vs baseline
- [ ] T024 Run full test suite (4876+ tests) — verify no regressions
<!-- /ANCHOR:wave-4 -->

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

1. All 29 recommendations have corresponding code changes
2. All 28 feature flags created and documented
3. All existing tests pass
4. Eval metrics recorded per wave
5. Simple-query p95 latency unchanged
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- [Spec](spec.md)
- [Plan](plan.md)
- [Checklist](checklist.md)
- [D1 Tasks](001-fusion-scoring-intelligence/tasks.md)
- [D2 Tasks](002-query-intelligence-reformulation/tasks.md)
- [D3 Tasks](003-graph-augmented-retrieval/tasks.md)
- [D4 Tasks](004-feedback-quality-learning/tasks.md)
- [D5 Tasks](005-retrieval-ux-presentation/tasks.md)
<!-- /ANCHOR:cross-refs -->
