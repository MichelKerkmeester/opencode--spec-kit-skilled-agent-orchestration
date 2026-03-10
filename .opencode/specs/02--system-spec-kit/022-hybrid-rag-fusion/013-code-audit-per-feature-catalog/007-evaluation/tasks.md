---
title: "Tasks: evaluation [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) | Date: 2026-03-10 | Status: Draft"
trigger_phrases:
  - "tasks"
  - "evaluation"
  - "phase"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: evaluation

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

- [ ] T001 Build Evaluation feature inventory (`feature_catalog/07--evaluation/`)
- [ ] T002 Confirm audit criteria and playbook mapping (`EX-032`, `EX-033`)
- [ ] T003 [P] Validate referenced source/test file availability (`mcp_server/**`, `feature_catalog/**`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Resolve P0 finding: `eval_final_results` source mismatch (`mcp_server/lib/eval/reporting-dashboard.ts`, `feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`)
- [ ] T005 Resolve P0 finding: add handler-level dashboard tests (`mcp_server/handlers/eval-reporting.ts`, `mcp_server/tests/*`)
- [ ] T006 [P] Resolve P2 finding: add ablation handler-level normalization/flag tests (`mcp_server/handlers/eval-reporting.ts`, `mcp_server/tests/*`)
- [ ] T007 [P] Resolve P2 finding: remove stale F-01 `retry.vitest.ts` reference (`feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md`)
- [ ] T008 [P] Resolve P2 finding: remove stale F-02 `retry.vitest.ts` reference (`feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Re-run targeted evaluation tests and verify expected behavior (`mcp_server/tests/*`)
- [ ] T010 Verify feature-catalog behavior parity after remediation (`feature_catalog/07--evaluation/*.md`)
- [ ] T011 Update and synchronize spec artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
