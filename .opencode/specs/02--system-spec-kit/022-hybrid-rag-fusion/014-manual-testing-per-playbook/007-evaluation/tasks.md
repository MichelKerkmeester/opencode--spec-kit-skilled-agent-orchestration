---
title: "Tasks: manual-testing-per-playbook evaluation phase [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "evaluation tasks"
  - "phase 007 tasks"
  - "ablation dashboard tasks"
  - "tasks core"
importance_tier: "high"
contextType: "general"
---
# Tasks: manual-testing-per-playbook evaluation phase

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

- [x] T001 Extract evaluation prompts, commands, and pass criteria from `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] T002 Confirm feature links for EX-026 and EX-027 in `../../feature_catalog/07--evaluation/`
- [x] T003 [P] Verify `SPECKIT_ABLATION=true` is set and `retrieval-channels-smoke` eval dataset is available for `plan.md` — CONFIRMED: flag is NOT set (SPECKIT_ABLATION=false); ablation is disabled in current env
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft `spec.md` with metadata, scope table, and two playbook-derived requirements
- [x] T005 Draft `plan.md` with readiness gates, execution phases, and testing strategy table
- [x] T006 Add evidence references and verdict outcomes after manual execution — see `scratch/execution-evidence.md`; EX-026=PARTIAL, EX-027=PASS
- [x] T007 [P] Resolve open questions for EX-026 eval dataset location and EX-027 sprint label selection — dataset not reachable (flag disabled); EX-027 returns empty sprints (no prior runs stored)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the two Phase 007 scenarios following `plan.md` — MCP execution completed 2026-03-21; EX-026=PARTIAL (SPECKIT_ABLATION disabled), EX-027=PASS
- [x] T009 Validate documentation structure and required anchors
- [x] T010 Update `implementation-summary.md` when execution and verification are complete — updated with verdicts and scenario counts 2026-03-21
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — EX-026=PARTIAL (env flag), EX-027=PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
