---
title: "Tasks: Refinement Phase 6 — Opus Review Remediation"
description: "35 completed tasks across 5 sprints for P0+P1 remediation fixes."
trigger_phrases:
  - "refinement phase 6 tasks"
  - "opus remediation tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[~]` | Deferred |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Sprint 1: Legacy Pipeline Removal + P0 Critical Fixes

- [x] T001 [P0] Remove legacy `STATE_PRIORITY` map (`handlers/memory-search.ts`)
- [x] T002 [P0] Remove `MAX_DEEP_QUERY_VARIANTS=6` constant (`handlers/memory-search.ts`)
- [x] T003 [P0] Delete `buildDeepQueryVariants()` function (`handlers/memory-search.ts`)
- [x] T004 [P0] Delete `strengthenOnAccess()` function (`handlers/memory-search.ts`)
- [x] T005 [P0] Delete `applyTestingEffect()` function (`handlers/memory-search.ts`)
- [x] T006 [P0] Delete `filterByMemoryState()` function (`handlers/memory-search.ts`)
- [x] T007 [P0] Keep `applySessionDedup()` — still used by post-cache dedup
- [x] T008 [P0] Delete `applyCrossEncoderReranking()` function (`handlers/memory-search.ts`)
- [x] T009 [P0] Delete `applyIntentWeightsToResults()` function (`handlers/memory-search.ts`)
- [x] T010 [P0] Delete `shouldApplyPostSearchIntentWeighting()` function (`handlers/memory-search.ts`)
- [x] T011 [P0] Delete `postSearchPipeline()` function (`handlers/memory-search.ts`)
- [x] T012 [P0] Remove `if (isPipelineV2Enabled())` branch — V2 only path (`handlers/memory-search.ts`)
- [x] T013 Deprecate `isPipelineV2Enabled()` as always-true (`lib/search/search-flags.ts`)
- [x] T014 [P0] Add orphaned chunk detection to `verify_integrity()` (`lib/search/vector-index-impl.ts`)
- [x] T015 Update tests for deprecated `isPipelineV2Enabled()` behavior
- [x] T016 Verify and update tests depending on `SPECKIT_PIPELINE_V2=false`
- [x] T017 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Sprint 2: Scoring & Fusion Fixes

- [x] T018 #5 Add recency scoring to `applyIntentWeights` (`lib/search/intent-classifier.ts`)
- [x] T019 #6 Normalize five-factor weights to sum 1.0 (`lib/scoring/composite-scoring.ts`)
- [x] T020 #7 Replace spread-based min/max with loop (`lib/scoring/composite-scoring.ts`)
- [x] T021 #8 Fix BM25 specFolder filter with DB lookup (`lib/search/hybrid-search.ts`)
- [x] T022 #9 Fix convergence double-counting in RRF fusion (`lib/search/rrf-fusion.ts`)
- [x] T023 #10 Normalize adaptive fusion core weights (`lib/search/adaptive-fusion.ts`)
- [x] T024 #11 Create shared `resolveEffectiveScore()` in `types.ts`; replace Stage 2 + Stage 3
- [x] T025 #12 Add optional `threshold` param to interference batch (`lib/scoring/interference-scoring.ts`)
- [x] T026 Update intent-weighting test for recency inclusion
- [x] T027 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Sprint 3: Pipeline, Retrieval, and Mutation Fixes

- [x] T028 #13 Add hidden params to schema (`tool-schemas.ts`)
- [x] T029 #14 Remove dead `sessionDeduped` from Stage 4 (`pipeline/stage4-filter.ts`)
- [x] T030 #15 Pass constitutional count from Stage 1 to Stage 4 (`pipeline/stage4-filter.ts`, `orchestrator.ts`, `types.ts`)
- [x] T031 #16 Cache embedding for constitutional reuse (`pipeline/stage1-candidate-gen.ts`)
- [x] T032 #18 Fix `simpleStem` double-consonant handling (`lib/search/bm25-index.ts`)
- [x] T033 #19 Embed full content on update (`handlers/memory-crud-update.ts`)
- [x] T034 #20 Clean all ancillary records on delete (`lib/search/vector-index-impl.ts`)
- [x] T035 #21 Clean BM25 index on delete (`lib/search/vector-index-impl.ts`)
- [x] T036 #22 Add rename-failure state tracking to atomicSaveMemory (`lib/storage/transaction-manager.ts`)
- [x] T037 #23 Use dynamic error code in preflight (`handlers/memory-save.ts`)
- [x] T038 Update stemmer and pipeline tests for new behavior
- [x] T039 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Sprint 4: Graph/Causal + Cognitive Memory Fixes

- [x] T040 #24 Prevent self-loops in `insertEdge()` (`lib/storage/causal-edges.ts`)
- [x] T041 #25 Clamp maxDepth to [1,10] (`handlers/causal-graph.ts`)
- [~] T042 #26 FK/existence check on edges — DEFERRED (test fixtures use synthetic IDs)
- [x] T043 #27 Replace edge-count debounce with count:maxId (`lib/graph/community-detection.ts`)
- [x] T044 #28 Add `cleanupOrphanedEdges()` (`lib/storage/causal-edges.ts`)
- [x] T045 #29 Clamp WM scores to [0,1] (`lib/cognitive/working-memory.ts`)
- [x] T046 #30 Remove double-decay in triggers (`handlers/memory-triggers.ts`)
- [~] T047 #31 Off-by-one in `enforceEntryLimit` — DEFERRED (code already correct)
- [x] T048 #32 Clear co-activation cache after bulk ops (`handlers/memory-bulk-delete.ts`)
- [x] T049 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Sprint 5: Evaluation Framework + Housekeeping

- [x] T050 #33 Use `recallK` for ablation limit (`handlers/eval-reporting.ts`)
- [x] T051 #34 Initialize `_evalRunCounter` from DB (`lib/eval/eval-logger.ts`)
- [x] T052 #35 Allow postflight UPDATE (`handlers/session-learning.ts`)
- [x] T053 #36 Add input guard to `parseArgs<T>()` (`tools/types.ts`)
- [x] T054 #37 Extend dedup hash to 128-bit (`lib/session/session-manager.ts`)
- [x] T055 #38 Add `cleanupExitHandlers()` with handler removal (`lib/storage/access-tracker.ts`)
- [x] T056 Update session-manager tests for 32-char hash length
- [x] T057 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or `[~]` (deferred with reason)
- [x] No blocked tasks remaining
- [x] Full test suite passes: 7,085/7,085
- [x] `implementation-summary.md` written
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
