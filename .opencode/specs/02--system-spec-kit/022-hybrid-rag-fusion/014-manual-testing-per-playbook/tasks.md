---
title: "Tasks: manual-testing-per-playbook [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual testing tasks"
  - "playbook phase tasks"
  - "umbrella test tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook

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

- [x] T001 Create 19 phase directories (`001-retrieval/` through `019-feature-flag-reference/`)
- [x] T002 Write parent `spec.md` with Phase Documentation Map
- [x] T003 Write parent `plan.md` with agent delegation strategy
- [x] T004 Write parent `tasks.md` (this file)
- [x] T005 Write parent `checklist.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Phase Folder Generation (19 phases)

### Wave 1 — High-count phases (12 phases, 7+ tests each)
- [x] T010 [P] Generate `014-pipeline-architecture/` spec.md + plan.md (18 tests)
- [x] T011 [P] Generate `013-memory-quality-and-indexing/` spec.md + plan.md (25 tests)
- [x] T012 [P] Generate `011-scoring-and-calibration/` spec.md + plan.md (16 tests)
- [x] T013 [P] Generate `009-evaluation-and-measurement/` spec.md + plan.md (16 tests)
- [x] T014 [P] Generate `016-tooling-and-scripts/` spec.md + plan.md (20 tests)
- [x] T015 [P] Generate `008-bug-fixes-and-data-integrity/` spec.md + plan.md (11 tests)
- [x] T016 [P] Generate `001-retrieval/` spec.md + plan.md (9 tests)
- [x] T017 [P] Generate `005-lifecycle/` spec.md + plan.md (9 tests)
- [x] T018 [P] Generate `010-graph-signal-activation/` spec.md + plan.md (9 tests)
- [x] T019 [P] Generate `015-retrieval-enhancements/` spec.md + plan.md (9 tests)
- [x] T020 [P] Generate `019-feature-flag-reference/` spec.md + plan.md (8 tests)
- [x] T021 [P] Generate `006-analysis/` spec.md + plan.md (7 tests)

### Wave 2 — Low-count phases (7 phases, <7 tests each)
- [x] T030 [P] Generate `002-mutation/` spec.md + plan.md (7 tests)
- [x] T031 [P] Generate `012-query-intelligence/` spec.md + plan.md (6 tests)
- [x] T032 [P] Generate `018-ux-hooks/` spec.md + plan.md (5 tests)
- [x] T033 [P] Generate `017-governance/` spec.md + plan.md (5 tests)
- [x] T034 [P] Generate `003-discovery/` spec.md + plan.md (3 tests)
- [x] T035 [P] Generate `007-evaluation/` spec.md + plan.md (2 tests)
- [x] T036 [P] Generate `004-maintenance/` spec.md + plan.md (2 tests)

### Level 2 additions (tasks.md + checklist.md per phase)
- [x] T040 [P] Generate tasks.md for all 19 phases
- [x] T041 [P] Generate checklist.md for all 19 phases
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Template Alignment

- [x] T050 Fix spec.md `## 2. PROBLEM` → `## 2. PROBLEM & PURPOSE` (16 files)
- [x] T051 Fix spec.md Parent link format to `[\`../spec.md\`](../spec.md)` (5 files)
- [x] T052 [P] Restructure all 19 checklist.md files to template standard (8 anchors, unnumbered headers, no overview, no standalone P0/P1 headers)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Validation

- [x] T060 Verify 19/19 spec.md files have `## 2. PROBLEM & PURPOSE`
- [x] T061 Verify 19/19 spec.md files have correct Parent link format
- [x] T062 Verify 0 checklist.md files have `ANCHOR:overview`
- [x] T063 Verify 0 checklist.md files have standalone `## P0`/`## P1` headers
- [x] T064 Verify all 19 checklist.md files have exactly 8 anchor blocks each
- [ ] T065 Coverage audit: all ~199 test IDs mapped to exactly one phase
- [ ] T066 Run `validate.sh --recursive` on full tree
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 19 phase folders contain spec.md, plan.md, tasks.md, checklist.md (76 files)
- [x] Parent root contains spec.md, plan.md, tasks.md, checklist.md
- [x] Template alignment verified across all 38 files (19 spec.md + 19 checklist.md)
- [ ] No `[B]` blocked tasks remaining
- [ ] Coverage audit passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: See `../../manual_testing_playbook/manual_testing_playbook.md`
- **Review Protocol**: See `../../manual_testing_playbook/review_protocol.md`
- **Feature Catalog**: See `../../feature_catalog/`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 2 tasks - Umbrella phase tracking
Task numbering uses gaps for future insertion
Phases 1-4 map to plan.md phases 0-5
-->
