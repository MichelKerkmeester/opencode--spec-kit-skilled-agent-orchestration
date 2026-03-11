---
title: "Tasks: scoring-and-calibration [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "scoring"
  - "calibration"
  - "rrf"
  - "reranker"
  - "access tracker"
  - "coherence"
importance_tier: "normal"
contextType: "general"
---
# Tasks: scoring-and-calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Consolidate 17 feature findings into a single phase backlog (`checklist.md`)
- [x] T002 Normalize findings into P0/P1/P2 remediation tiers (`tasks.md`)
- [x] T003 [P] Capture primary source/test references per remediation theme (`feature_catalog/11--scoring-and-calibration/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restore default convergence bonus in multi-source RRF fusion (`shared/algorithms/rrf-fusion.ts`) — JSDoc for DEFAULT_K + SPECKIT_RRF_K env override
- [x] T005 Reinstate and fully document scoring/fusion correction coverage (`feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`) — full fix traceability matrix (#5-#12)
- [x] T006 Align local reranker memory thresholds and error handling (`mcp_server/lib/search/local-reranker.ts`) — JSDoc for canUseLocalReranker/rerankLocal + CHK-069 ref
- [x] T007 Fix access-tracker flush semantics, API surface, and column consistency (`mcp_server/lib/storage/access-tracker.ts`) — SPECKIT_RECENCY_DECAY_DAYS env + MAX_USAGE_BOOST clamp + JSDoc
- [x] T008 Implement temporal/relational coherence checks or update feature contract (`mcp_server/handlers/quality-loop.ts`) — documented immediate-retry as by-design in code + feature catalog
- [x] T009 Add missing RRF normalization path to feature inventory (`feature_catalog/11--scoring-and-calibration/01-score-normalization.md`) — aligned wording + SPECKIT_SCORE_NORMALIZATION ref + traceability
- [x] T010 Align folder-relevance module header with graduated-on behavior (`mcp_server/lib/search/folder-relevance.ts`) — corrected header JSDoc default from disabled to enabled
- [x] T011 Add full pipeline trace and regression for double-intent investigation (`feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md`) — isHybrid gate trace + regression refs
- [x] T012 Add Stage 2 integration and logged handling for negative feedback signal (`mcp_server/lib/scoring/confidence-tracker.ts`) — structured console.warn + Stage 2 integration JSDoc
- [x] T013 Add handler-path coverage and accurate tests for auto-promotion entry (`feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md`) — behavior matrix + accurate test refs
- [x] T014 Add missing source/test files for scoring and ranking corrections (`feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md`) — C1-C4 source/test mapping complete
- [x] T015 Replace silent catches and add mutation-hook integration coverage (`mcp_server/handlers/mutation-hooks.ts`) — 5 logged catches + mutation-hooks.vitest.ts
- [x] T016 Add effectiveScore fallback regression and replace missing retry reference (`mcp_server/lib/search/pipeline/stage3-rerank.ts`) — Math.max(0,...) score-floor guards + regression test
- [x] T017 Add end-to-end normalized ranking regression (`mcp_server/tests/score-normalization.vitest.ts`) — negative, >1.0, precision, NaN/Infinity tests
- [x] T018 Add access-tracker integration tests for composite scoring and archival (`mcp_server/tests/access-tracker-extended.vitest.ts`) — decay-rate boundaries, old timestamps, tier edges
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Verify all 5 FAIL findings are resolved or explicitly deferred with approval (`checklist.md`) — F-08, F-13, F-14, F-16, F-17 all resolved
- [x] T020 Verify WARN findings have source/test traceability and playbook mapping status (`checklist.md`) — traceability added to all feature catalog docs
- [x] T021 Synchronize final status across spec, plan, tasks, and checklist (`spec.md`) — tasks/checklist/implementation-summary aligned
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — TSC clean, 320/320 tests pass across 12 suites
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
