---
title: "Tasks: manual-testing-per-playbook evaluation phase"
description: "2 manual test scenarios for evaluation category. One task per scenario ID."
trigger_phrases:
  - "evaluation tasks"
  - "evaluation test tasks"
  - "ablation dashboard tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook evaluation phase

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
- [ ] T002 Confirm SPECKIT_ABLATION=true is set in environment
- [ ] T003 Confirm ground truth queries exist for ablation
- [ ] T004 Check eval database for prior run data
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Execute EX-026: Ablation studies (eval_run_ablation)
- [ ] T006 Execute EX-027: Reporting dashboard format:text (eval_reporting_dashboard)
- [ ] T007 Execute EX-027: Reporting dashboard format:json (eval_reporting_dashboard)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Record all verdicts in checklist.md with evidence
- [ ] T009 Complete implementation-summary.md with findings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Both scenario tasks (T005-T007) marked `[x]`
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
