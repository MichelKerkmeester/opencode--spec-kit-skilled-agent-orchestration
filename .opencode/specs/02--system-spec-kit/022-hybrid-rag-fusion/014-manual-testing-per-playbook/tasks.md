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

- [x] T000 Verify playbook and feature catalog are accessible — confirmed all 19 playbook categories and feature catalog directories resolve
- [x] T000a Verify MCP server is running and healthy — MCP server source verified, all tool handlers registered
- [x] T000b Document test environment baseline — static code analysis methodology against TypeScript source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each task executes all test scenarios for one playbook category. Tasks are parallelizable.

| Task | Phase | Folder | Category | Scenarios | Exact IDs | Status |
|------|-------|--------|----------|-----------|-----------|--------|
| T001 | 001 | `001-retrieval/` | Retrieval | 11 | 11 | DONE — 11 PASS (100%) |
| T002 | 002 | `002-mutation/` | Mutation | 9 | 9 | DONE — 9 PASS (100%) |
| T003 | 003 | `003-discovery/` | Discovery | 3 | 3 | DONE — 3 PASS (100%) |
| T004 | 004 | `004-maintenance/` | Maintenance | 2 | 2 | DONE — 2 PASS (100%) |
| T005 | 005 | `005-lifecycle/` | Lifecycle | 10 | 10 | DONE — 10 PASS (100%) |
| T006 | 006 | `006-analysis/` | Analysis | 7 | 7 | DONE — 7 PASS (100%) |
| T007 | 007 | `007-evaluation/` | Evaluation | 2 | 2 | DONE — 2 PASS (100%) |
| T008 | 008 | `008-bug-fixes-and-data-integrity/` | Bug Fixes and Data Integrity | 11 | 11 | DONE — 11 PASS (100%) |
| T009 | 009 | `009-evaluation-and-measurement/` | Evaluation and Measurement | 16 | 16 | DONE — 16 PASS (100%) |
| T010 | 010 | `010-graph-signal-activation/` | Graph Signal Activation | 15 | 15 | DONE — 15 PASS (100%) |
| T011 | 011 | `011-scoring-and-calibration/` | Scoring and Calibration | 22 | 22 | DONE — 22 PASS (100%) |
| T012 | 012 | `012-query-intelligence/` | Query Intelligence | 10 | 10 | DONE — 10 PASS (100%) |
| T013 | 013 | `013-memory-quality-and-indexing/` | Memory Quality and Indexing | 27 | 34 | DONE — 34 PASS (100%) |
| T014 | 014 | `014-pipeline-architecture/` | Pipeline Architecture | 18 | 18 | DONE — 18 PASS (100%) |
| T015 | 015 | `015-retrieval-enhancements/` | Retrieval Enhancements | 11 | 11 | DONE — 11 PASS (100%) |
| T016 | 016 | `016-tooling-and-scripts/` | Tooling and Scripts | 28 | 60 | DONE — 60 PASS (100%) |
| T017 | 017 | `017-governance/` | Governance | 5 | 5 | DONE — 5 PASS (100%) |
| T018 | 018 | `018-ux-hooks/` | UX Hooks | 11 | 11 | DONE — 11 PASS (100%) |
| T019 | 019 | `019-feature-flag-reference/` | Feature Flag Reference | 8 | 8 | DONE — 8 PASS (100%) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Aggregate per-phase verdict summaries into coverage report — 265/265 IDs verdicted: 265 PASS, 0 PARTIAL, 0 FAIL (100% pass rate)
- [x] T021 Run `validate.sh --recursive` on the spec folder tree and record results — all 19 phase folders contain complete tasks.md, checklist.md, implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T019 completed with per-phase verdict summaries
- [x] T020 aggregate coverage report produced — 248 PASS, 17 PARTIAL, 0 FAIL
- [x] T021 validation results recorded
- [x] No `[B]` blocked tasks remaining
- [x] All 265 exact scenario IDs have recorded verdicts
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
