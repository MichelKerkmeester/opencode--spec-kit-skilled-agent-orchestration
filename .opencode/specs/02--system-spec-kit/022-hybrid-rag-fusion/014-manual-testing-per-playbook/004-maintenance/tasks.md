---
title: "Tasks: manual-testing-per-playbook maintenance phase"
description: "Task tracker for Phase 004 maintenance scenarios. One task per scenario (EX-014, EX-035), all pending."
trigger_phrases:
  - "maintenance phase tasks"
  - "phase 004 tasks"
  - "EX-014 EX-035 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook maintenance phase

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

- [ ] T001 Read playbook context for 04--maintenance (`../scratch/context-playbook.md` §04--maintenance)
- [ ] T002 Read feature catalog context for 04--maintenance (`../scratch/context-feature-catalog.md` §04--maintenance)
- [ ] T003 Verify MCP server is running and accepting tool calls
- [ ] T004 Identify target spec folder with at least one markdown file (for EX-014)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute EX-014 — Workspace scanning and indexing (memory_index_scan): invoke with specFolder and incremental: true; capture output
- [ ] T006 Record EX-014 verdict: PASS / PARTIAL / FAIL
- [ ] T007 Execute EX-035 — Startup runtime compatibility guards: follow playbook to trigger or simulate guard; capture diagnostic output
- [ ] T008 Record EX-035 verdict: PASS / PARTIAL / FAIL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Fill implementation-summary.md with both verdicts and captured evidence
- [ ] T010 Check all P0 items in checklist.md
- [ ] T011 Check P1 items in checklist.md (evidence captured, verdicts recorded)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T011 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Both scenarios have recorded verdicts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `../scratch/context-playbook.md` §04--maintenance
<!-- /ANCHOR:cross-refs -->
