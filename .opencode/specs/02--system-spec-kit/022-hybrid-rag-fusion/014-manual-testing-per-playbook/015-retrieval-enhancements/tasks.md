---
title: "Tasks: Manual Testing — Retrieval Enhancements (Phase 015)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval enhancements tasks"
  - "phase 015 tasks"
  - "manual testing retrieval tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Manual Testing — Retrieval Enhancements (Phase 015)

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

- [ ] T001 Load playbook rows for all 11 retrieval enhancement scenario IDs from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T002 Load review protocol verdict rules from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T003 [P] Confirm feature catalog links for all 11 scenarios in `../../feature_catalog/15--retrieval-enhancements/`
- [ ] T004 Record baseline env var state (SPECKIT_RESPONSE_TRACE, SPECKIT_CONTEXT_HEADERS, SPECKIT_CONSOLIDATION, SPECKIT_ENTITY_LINKING, SPECKIT_MEMORY_SUMMARIES)
- [ ] T005 Capture corpus size count to determine whether 059 summary channel threshold (5,000 memories) is satisfied
- [ ] T006 Prepare disposable sandbox corpus for consolidation (058) and cross-document entity corpus for entity linking (060)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Execute scenario 055 — Dual-scope memory auto-surface (TM-05) and record verdict
- [ ] T008 Execute scenario 056 — Constitutional memory as expert knowledge injection (PI-A4) and record verdict
- [ ] T009 Execute scenario 057 — Spec folder hierarchy as retrieval structure (S4) and record verdict
- [ ] T010 Execute scenario 058 — Lightweight consolidation (N3-lite) in sandbox and record verdict
- [ ] T011 Execute scenario 059 — Memory summary search channel (R8) and record verdict
- [ ] T012 Execute scenario 060 — Cross-document entity linking (S5) in sandbox and record verdict
- [ ] T013 Execute scenario 077 — Tier-2 fallback channel forcing and record verdict
- [ ] T014 Execute scenario 093 — Implemented: memory summary generation (R8) and record verdict
- [ ] T015 Execute scenario 094 — Implemented: cross-document entity linking (S5) and record verdict
- [ ] T016 Execute scenario 096 — Provenance-rich response envelopes (P0-2) and record verdict
- [ ] T017 Execute scenario 145 — Contextual tree injection (P1-4) and record verdict
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Restore env var state to baseline after scenarios 096 and 145 complete
- [ ] T019 Confirm all 11 scenarios have a verdict (PASS / FAIL / SKIP — no "Not Started" remaining)
- [ ] T020 Confirm all FAIL verdicts have defect notes with observed vs expected behaviour
- [ ] T021 Mark all P0 checklist items in checklist.md with evidence
- [ ] T022 Update implementation-summary.md with final verdict summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 11 scenarios verdicted
- [ ] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
