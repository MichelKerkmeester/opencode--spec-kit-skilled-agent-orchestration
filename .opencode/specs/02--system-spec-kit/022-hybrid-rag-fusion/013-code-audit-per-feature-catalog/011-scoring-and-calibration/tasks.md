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

- [ ] T004 Restore default convergence bonus in multi-source RRF fusion (`shared/algorithms/rrf-fusion.ts`)
- [ ] T005 Reinstate and fully document scoring/fusion correction coverage (`feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`)
- [ ] T006 Align local reranker memory thresholds and error handling (`mcp_server/lib/search/local-reranker.ts`)
- [ ] T007 Fix access-tracker flush semantics, API surface, and column consistency (`mcp_server/lib/storage/access-tracker.ts`)
- [ ] T008 Implement temporal/relational coherence checks or update feature contract (`mcp_server/handlers/quality-loop.ts`)
- [ ] T009 Add missing RRF normalization path to feature inventory (`feature_catalog/11--scoring-and-calibration/01-score-normalization.md`)
- [ ] T010 Align folder-relevance module header with graduated-on behavior (`mcp_server/lib/search/folder-relevance.ts`)
- [ ] T011 Add full pipeline trace and regression for double-intent investigation (`feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md`)
- [ ] T012 Add Stage 2 integration and logged handling for negative feedback signal (`mcp_server/lib/scoring/confidence-tracker.ts`)
- [ ] T013 Add handler-path coverage and accurate tests for auto-promotion entry (`feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md`)
- [ ] T014 Add missing source/test files for scoring and ranking corrections (`feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md`)
- [ ] T015 Replace silent catches and add mutation-hook integration coverage (`mcp_server/handlers/mutation-hooks.ts`)
- [ ] T016 Add effectiveScore fallback regression and replace missing retry reference (`mcp_server/lib/search/pipeline/stage3-rerank.ts`)
- [ ] T017 Add end-to-end normalized ranking regression (`mcp_server/tests/score-normalization.vitest.ts`)
- [ ] T018 Add access-tracker integration tests for composite scoring and archival (`mcp_server/tests/access-tracker-extended.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Verify all 5 FAIL findings are resolved or explicitly deferred with approval (`checklist.md`)
- [ ] T020 Verify WARN findings have source/test traceability and playbook mapping status (`checklist.md`)
- [ ] T021 Synchronize final status across spec, plan, tasks, and checklist (`spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
