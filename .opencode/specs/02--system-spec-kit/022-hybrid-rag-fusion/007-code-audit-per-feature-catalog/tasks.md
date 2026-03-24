---
title: "Tasks: Code Audit per Feature Catalog"
description: "Master task list for the full code audit across 21 phase folders"
trigger_phrases:
  - "tasks"
  - "code audit"
importance_tier: "high"
contextType: "general"
---
# Tasks: Code Audit per Feature Catalog

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create Level 3 spec folders for all 22 folders
- [x] T002 Verify feature catalog currency — 19 categories, 220+ features confirmed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Audit 001-retrieval (10 features) — 8 MATCH, 2 PARTIAL
- [x] T004 Audit 002-mutation (10 features) — 8 MATCH, 2 PARTIAL
- [x] T005 Audit 003-discovery (3 features) — 2 MATCH, 1 PARTIAL
- [x] T006 Audit 004-maintenance (2 features) — 1 MATCH, 1 PARTIAL
- [x] T007 Audit 005-lifecycle (7 features) — 4 MATCH, 3 PARTIAL
- [x] T008 Audit 006-analysis (7 features) — 5 MATCH, 2 PARTIAL
- [x] T009 Audit 007-evaluation (2 features) — 1 MATCH, 1 PARTIAL
- [x] T010 Audit 008-bug-fixes-and-data-integrity (11 features) — 9 MATCH, 2 PARTIAL
- [x] T011 Audit 009-evaluation-and-measurement (16 features) — 12 MATCH, 4 PARTIAL
- [x] T012 Audit 010-graph-signal-activation (16 features) — 12 MATCH, 4 PARTIAL
- [x] T013 Audit 011-scoring-and-calibration (23 features) — 20 MATCH, 3 PARTIAL
- [x] T014 Audit 012-query-intelligence (11 features) — 8 MATCH, 3 PARTIAL
- [x] T015 Audit 013-memory-quality-and-indexing (24 features) — 20 MATCH, 4 PARTIAL
- [x] T016 Audit 014-pipeline-architecture (22 features) — 19 MATCH, 3 PARTIAL
- [x] T017 Audit 015-retrieval-enhancements (9 features) — 8 MATCH, 1 PARTIAL
- [x] T018 Audit 016-tooling-and-scripts (17 features) — 16 MATCH, 1 PARTIAL
- [x] T019 Audit 017-governance (4 features) — 3 MATCH, 1 PARTIAL
- [x] T020 Audit 018-ux-hooks (19 features) — 17 MATCH, 2 PARTIAL
- [x] T021 Audit 020-feature-flag-reference (7 features) — 6 MATCH, 1 PARTIAL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Complete 019-decisions-and-deferrals analysis — 4 decisions, 4 deferrals, 4 deprecated modules
- [x] T023 Complete 021-remediation-revalidation tracking — prioritized backlog documented

---

## Phase 4: Synthesis

- [x] T024 Cross-phase dependency analysis — shared patterns identified across all phases
- [x] T025 Master audit findings report — implementation-summary.md in all 22 folders
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 21 phase audits complete
- [x] Cross-cutting analysis done
- [x] Master report delivered
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
