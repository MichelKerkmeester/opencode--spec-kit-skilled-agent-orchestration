---
title: "Tasks: manual-testing-per-playbook analysis phase"
description: "7 manual test scenarios for analysis category. One task per scenario ID."
trigger_phrases:
  - "analysis tasks"
  - "analysis test tasks"
  - "causal graph tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook analysis phase

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

**Task Format**: `T### [P?] Description (scenario ID)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify MCP server health (memory_health)
- [ ] T002 Confirm test memories exist for causal operations
- [ ] T003 Create named checkpoint for EX-021 sandbox
- [ ] T004 Agree on specFolder and taskId for EX-023/EX-024
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute EX-019: Causal edge creation (memory_causal_link)
- [ ] T006 Execute EX-020: Causal graph statistics (memory_causal_stats)
- [ ] T007 Execute EX-022: Causal chain tracing (memory_drift_why)
- [ ] T008 Execute EX-023: Epistemic baseline capture (task_preflight)
- [ ] T009 Execute EX-024: Post-task learning measurement (task_postflight)
- [ ] T010 Execute EX-025: Learning history (memory_get_learning_history)
- [ ] T011 Confirm sandbox isolation and checkpoint before EX-021
- [ ] T012 Execute EX-021: Causal edge deletion (memory_causal_unlink)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Record all verdicts in checklist.md with evidence
- [ ] T014 Complete implementation-summary.md with findings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 7 scenario tasks (T005-T012) marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verdicts and evidence recorded in checklist.md
- [ ] implementation-summary.md completed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
