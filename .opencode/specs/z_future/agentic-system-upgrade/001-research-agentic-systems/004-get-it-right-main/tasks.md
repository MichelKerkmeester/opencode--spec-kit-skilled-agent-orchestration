---
title: "Tasks: 004-ge [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/tasks]"
description: "Completed task tracking for the Get It Right Phase 3 deep-research continuation"
trigger_phrases:
  - "004-get-it-right-main tasks"
  - "get it right phase 3 tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: 004-get-it-right-main Research Phase

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

- [x] T001 Read `research/research.md`, dashboard, state log, and representative iterations `001-020` (`research/`)
- [x] T002 Re-read `phase-research-prompt.md` and confirm current phase constraints (`phase-research-prompt.md`)
- [x] T003 Inspect command, template, agent, skill, and hook surfaces relevant to Phase 3 (`.opencode/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write `research/iterations/iteration-021.md` through `research/iterations/iteration-030.md` (`research/iterations/`)
- [x] T005 Append Phase 3 rows with `phase: 3` to the state log (`research/deep-research-state.jsonl`)
- [x] T006 Rewrite merged synthesis with combined totals and Phase 3 findings (`research/research.md`)
- [x] T007 Rewrite the dashboard for all 30 iterations (`research/deep-research-dashboard.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Repair stale prompt references to current `external/` paths (`phase-research-prompt.md`)
- [x] T009 Create the missing baseline phase docs required for strict validation (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
- [x] T010 Run strict validation and whitespace checks (`validate.sh`, `git diff --check`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Validation evidence captured in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research Output**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
