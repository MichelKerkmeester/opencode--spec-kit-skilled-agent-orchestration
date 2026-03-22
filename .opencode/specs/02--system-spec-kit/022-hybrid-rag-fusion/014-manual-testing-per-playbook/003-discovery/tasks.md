---
title: "Tasks: manual-testing-per-playbook discovery phase"
description: "Task tracker for Phase 003 discovery scenarios. One task per scenario (EX-011, EX-012, EX-013), all pending."
trigger_phrases:
  - "discovery phase tasks"
  - "phase 003 tasks"
  - "EX-011 EX-012 EX-013 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook discovery phase

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

- [ ] T001 Read playbook context for 03--discovery (`../scratch/context-playbook.md` §03--discovery)
- [ ] T002 Read feature catalog context for 03--discovery (`../scratch/context-feature-catalog.md` §03--discovery)
- [ ] T003 Verify MCP server is running and accepting tool calls
- [ ] T004 Confirm at least one memory is indexed (quick sanity check)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute EX-011 — Memory browser (memory_list): invoke with specFolder, limit, offset; capture output
- [ ] T006 Record EX-011 verdict: PASS / PARTIAL / FAIL
- [ ] T007 Execute EX-012 — System statistics (memory_stats): invoke with folderRanking: "composite", includeScores: true; capture output
- [ ] T008 Record EX-012 verdict: PASS / PARTIAL / FAIL
- [ ] T009 Execute EX-013a — Health diagnostics full mode: invoke memory_health(reportMode: "full"); capture output
- [ ] T010 Execute EX-013b — Health diagnostics divergent_aliases mode: invoke memory_health(reportMode: "divergent_aliases"); capture output
- [ ] T011 Record EX-013 verdict: PASS / PARTIAL / FAIL
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Fill implementation-summary.md with all three verdicts and captured evidence
- [ ] T013 Check all P0 items in checklist.md
- [ ] T014 Check P1 items in checklist.md (evidence captured, verdicts recorded)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T014 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All three scenarios have recorded verdicts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `../scratch/context-playbook.md` §03--discovery
<!-- /ANCHOR:cross-refs -->
