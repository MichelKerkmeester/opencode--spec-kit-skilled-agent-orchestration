---
title: "Tasks: Manual Testing — Pipeline Architecture (Phase 014)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pipeline architecture tasks"
  - "phase 014 tasks"
  - "manual testing pipeline tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Manual Testing — Pipeline Architecture (Phase 014)

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

- [ ] T001 Load playbook rows for all 18 pipeline architecture scenario IDs from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T002 Load review protocol verdict rules from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T003 [P] Confirm feature catalog links for all 18 scenarios in `../../feature_catalog/14--pipeline-architecture/`
- [ ] T004 Verify MCP runtime access and confirm sandbox availability for destructive scenarios (080, 112, 115, 130)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute scenario 049 — 4-stage pipeline refactor (R6) and record verdict
- [ ] T006 Execute scenario 050 — MPAB chunk-to-memory aggregation (R1) and record verdict
- [ ] T007 Execute scenario 051 — Chunk ordering preservation (B2) and record verdict
- [ ] T008 Execute scenario 052 — Template anchor optimization (S2) and record verdict
- [ ] T009 Execute scenario 053 — Validation signals as retrieval metadata (S3) and record verdict
- [ ] T010 Execute scenario 054 — Learned relevance feedback (R11) and record verdict
- [ ] T011 Execute scenario 067 — Search pipeline safety and record verdict
- [ ] T012 Execute scenario 071 — Performance improvements and record verdict
- [ ] T013 Execute scenario 076 — Activation window persistence and record verdict
- [ ] T014 Execute scenario 078 — Legacy V1 pipeline removal and record verdict
- [ ] T015 Execute scenario 087 — DB_PATH extraction and import standardisation and record verdict
- [ ] T016 Execute scenario 095 — Strict Zod schema validation (P0-1) and record verdict
- [ ] T017 Execute scenario 129 — Lineage state active projection and asOf resolution and record verdict
- [ ] T018 Execute scenario 146 — Dynamic server instructions (P1-6) and record verdict
- [ ] T019 Execute scenario 080 — Pipeline and mutation hardening in sandbox and record verdict
- [ ] T020 Execute scenario 112 — Cross-process DB hot rebinding in sandbox and record verdict
- [ ] T021 Execute scenario 115 — Transaction atomicity on rename failure in sandbox and record verdict
- [ ] T022 Execute scenario 130 — Lineage backfill rollback drill in sandbox and record verdict
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Confirm all 18 scenarios have a verdict (PASS / FAIL / SKIP — no "Not Started" remaining)
- [ ] T024 Confirm all FAIL verdicts have defect notes with observed vs expected behaviour
- [ ] T025 Mark all P0 checklist items in checklist.md with evidence
- [ ] T026 Update implementation-summary.md with final verdict summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 18 scenarios verdicted
- [ ] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
