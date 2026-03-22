---
title: "Tasks: manual-testing-per-playbook"
description: "Task tracking for manual test execution across 19 phase folders (226 scenario files, 265 exact IDs)."
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

- [ ] T000 Verify playbook and feature catalog are accessible
- [ ] T000a Verify MCP server is running and healthy
- [ ] T000b Document test environment baseline (database state, feature flags, server version)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each task executes all test scenarios for one playbook category. Tasks are parallelizable.

| Task | Phase | Folder | Category | Scenarios | Exact IDs | Status |
|------|-------|--------|----------|-----------|-----------|--------|
| T001 | 001 | `001-retrieval/` | Retrieval | 11 | 11 | PENDING |
| T002 | 002 | `002-mutation/` | Mutation | 9 | 9 | PENDING |
| T003 | 003 | `003-discovery/` | Discovery | 3 | 3 | PENDING |
| T004 | 004 | `004-maintenance/` | Maintenance | 2 | 2 | PENDING |
| T005 | 005 | `005-lifecycle/` | Lifecycle | 10 | 10 | PENDING |
| T006 | 006 | `006-analysis/` | Analysis | 7 | 7 | PENDING |
| T007 | 007 | `007-evaluation/` | Evaluation | 2 | 2 | PENDING |
| T008 | 008 | `008-bug-fixes-and-data-integrity/` | Bug Fixes and Data Integrity | 11 | 11 | PENDING |
| T009 | 009 | `009-evaluation-and-measurement/` | Evaluation and Measurement | 16 | 16 | PENDING |
| T010 | 010 | `010-graph-signal-activation/` | Graph Signal Activation | 15 | 15 | PENDING |
| T011 | 011 | `011-scoring-and-calibration/` | Scoring and Calibration | 22 | 22 | PENDING |
| T012 | 012 | `012-query-intelligence/` | Query Intelligence | 10 | 10 | PENDING |
| T013 | 013 | `013-memory-quality-and-indexing/` | Memory Quality and Indexing | 27 | 34 | PENDING |
| T014 | 014 | `014-pipeline-architecture/` | Pipeline Architecture | 18 | 18 | PENDING |
| T015 | 015 | `015-retrieval-enhancements/` | Retrieval Enhancements | 11 | 11 | PENDING |
| T016 | 016 | `016-tooling-and-scripts/` | Tooling and Scripts | 28 | 60 | PENDING |
| T017 | 017 | `017-governance/` | Governance | 5 | 5 | PENDING |
| T018 | 018 | `018-ux-hooks/` | UX Hooks | 11 | 11 | PENDING |
| T019 | 019 | `019-feature-flag-reference/` | Feature Flag Reference | 8 | 8 | PENDING |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Aggregate per-phase verdict summaries into coverage report
- [ ] T021 Run `validate.sh --recursive` on the spec folder tree and record results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T019 completed with per-phase verdict summaries
- [ ] T020 aggregate coverage report produced
- [ ] T021 validation results recorded
- [ ] No `[B]` blocked tasks remaining
- [ ] All 265 exact scenario IDs have recorded verdicts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: See `../../../../skill/system-spec-kit/manual_testing_playbook/`
- **Feature Catalog**: See `../../../../skill/system-spec-kit/feature_catalog/`
<!-- /ANCHOR:cross-refs -->

---
