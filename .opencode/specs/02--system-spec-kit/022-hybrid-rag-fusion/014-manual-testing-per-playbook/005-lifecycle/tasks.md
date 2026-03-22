---
title: "Tasks: manual-testing-per-playbook lifecycle phase"
description: "Task tracker for Phase 005 lifecycle scenarios. One task per scenario (EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144), all pending."
trigger_phrases:
  - "lifecycle phase tasks"
  - "phase 005 tasks"
  - "checkpoint lifecycle tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook lifecycle phase

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read playbook context for 05--lifecycle (`../scratch/context-playbook.md` §05--lifecycle)
- [ ] T002 Read feature catalog context for 05--lifecycle (`../scratch/context-feature-catalog.md` §05--lifecycle)
- [ ] T003 Verify MCP server is running and accepting tool calls
- [ ] T004 Run baseline `checkpoint_list` to note existing checkpoints
- [ ] T005 Run baseline `memory_list` to note current memory count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Checkpoint Group (run in order)

- [ ] T006 Execute EX-015 — Checkpoint creation: invoke checkpoint_create with unique name; capture output
- [ ] T007 Record EX-015 verdict: PASS / PARTIAL / FAIL
- [ ] T008 Execute EX-016 — Checkpoint listing: invoke checkpoint_list; verify EX-015 checkpoint present; capture output
- [ ] T009 Record EX-016 verdict: PASS / PARTIAL / FAIL
- [ ] T010 Execute EX-017 — Checkpoint restore: invoke checkpoint_restore with EX-015 checkpoint name; capture output
- [ ] T011 Record EX-017 verdict: PASS / PARTIAL / FAIL
- [ ] T012 Execute EX-018 — Checkpoint deletion: invoke checkpoint_delete with EX-015 name and confirmName; verify absent from list; capture output
- [ ] T013 Record EX-018 verdict: PASS / PARTIAL / FAIL

### Async and Server Lifecycle Scenarios

- [ ] T014 Execute 097 — Async ingestion job lifecycle: start job, poll status, confirm completion; capture output at each step
- [ ] T015 Record 097 verdict: PASS / PARTIAL / FAIL
- [ ] T016 Execute 114 — Path traversal validation: submit traversal payload; capture rejection response
- [ ] T017 Record 114 verdict: PASS / PARTIAL / FAIL
- [ ] T018 Execute 124 — Automatic archival lifecycle coverage: follow setup, trigger archival, capture output
- [ ] T019 Record 124 verdict: PASS / PARTIAL / FAIL
- [ ] T020 Execute 134 — Startup pending-file recovery: place pending file, restart server, capture recovery output
- [ ] T021 Record 134 verdict: PASS / PARTIAL / FAIL
- [ ] T022 Execute 144 — Advisory ingest lifecycle forecast: invoke forecast tool; capture output
- [ ] T023 Record 144 verdict: PASS / PARTIAL / FAIL
- [ ] T024 Execute 100 — Async shutdown with deadline: trigger shutdown, capture output, restart server after
- [ ] T025 Record 100 verdict: PASS / PARTIAL / FAIL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T026 Fill implementation-summary.md with all 10 verdicts and captured evidence
- [ ] T027 Check all P0 items in checklist.md
- [ ] T028 Check P1 items in checklist.md (evidence captured, verdicts recorded)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T028 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 10 scenarios have recorded verdicts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `../scratch/context-playbook.md` §05--lifecycle
<!-- /ANCHOR:cross-refs -->
