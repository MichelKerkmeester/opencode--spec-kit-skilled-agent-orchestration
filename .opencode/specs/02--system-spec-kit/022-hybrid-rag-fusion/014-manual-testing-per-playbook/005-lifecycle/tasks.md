---
title: "Tasks: manual-testing-per-playbook lifecycle phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "lifecycle tasks"
  - "phase 005 tasks"
  - "checkpoint testing tasks"
  - "ingest lifecycle tasks"
  - "tasks core"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook lifecycle phase

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Extract lifecycle prompts, commands, and pass criteria from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature links for EX-015, EX-016, EX-017, EX-018, NEW-097, NEW-114, NEW-124, NEW-134, and NEW-144 in `../../feature_catalog/05--lifecycle/`
- [ ] T003 [P] Prepare sandbox prerequisites: disposable spec folder, seed markdown files, test database, and checkpoint naming convention `pre-[test-id]-[action]`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft `spec.md` with metadata, scope table, and nine playbook-derived requirements
- [x] T005 Draft `plan.md` with readiness gates, execution phases, and testing strategy table
- [x] T006 Draft `tasks.md` with phase-separated task list covering setup, execution, and verification
- [x] T007 Draft `checklist.md` with P0/P1/P2 items for scenario documentation quality, sandbox safety, and execution evidence
- [ ] T008 [P] Resolve open questions: sandbox spec folder path, restart procedure for NEW-097 requeue, and DB parity evidence format for NEW-124
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run EX-015 and EX-016 (non-destructive checkpoint creation and listing) and capture evidence
- [ ] T010 Run NEW-097 (async ingest job lifecycle) and capture all five state-transition and cancellation evidence
- [ ] T011 [P] Run NEW-114 (path traversal validation) and capture rejection and acceptance evidence
- [ ] T012 [P] Run NEW-134 (startup pending-file recovery) and capture committed-vs-stale divergence evidence
- [ ] T013 [P] Run NEW-144 (advisory ingest lifecycle forecast) and capture forecast field polling evidence
- [ ] T014 Run EX-017 (checkpoint restore) inside sandbox, capturing restore and health evidence; roll back sandbox afterward
- [ ] T015 Run EX-018 (checkpoint deletion — DESTRUCTIVE) inside sandbox only, capturing before/after list evidence; roll back sandbox afterward
- [ ] T016 Run NEW-124 (automatic archival lifecycle — DESTRUCTIVE) inside sandbox only, capturing archive/unarchive parity and protected-tier evidence; roll back sandbox afterward
- [x] T017 Validate documentation structure and required anchors across all four phase documents
- [ ] T018 Record PASS, PARTIAL, or FAIL verdict per test ID with review-protocol rationale
- [ ] T019 Update `implementation-summary.md` when execution and verification are complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All nine lifecycle scenarios executed with captured evidence
- [ ] PASS/PARTIAL/FAIL verdict recorded for each of the nine test IDs
- [ ] Destructive tests (EX-018, NEW-124, and the restore step of EX-017) were run sandbox-only only
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
