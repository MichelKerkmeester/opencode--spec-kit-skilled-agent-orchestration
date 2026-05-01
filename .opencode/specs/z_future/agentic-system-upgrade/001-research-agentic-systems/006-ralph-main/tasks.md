---
title: "Tasks: 006-ralph-mai [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "006-ralph-main tasks"
  - "ralph phase closeout tasks"
  - "research packet task list"
importance_tier: "important"
contextType: "general"
---
# Tasks: 006-ralph-main Research Phase Closeout

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

- [x] T001 Review existing iterations `001-020` and prior synthesis (`research/`)
- [x] T002 Read Phase 3 comparison surfaces in `external/`, `.opencode/command/`, `.opencode/agent/`, and `.opencode/skill/`
- [x] T003 Confirm packet scope and preserve `external/` as read-only (`006-ralph-main/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write `research/iterations/iteration-021.md` through `research/iterations/iteration-030.md`
- [x] T005 Append Phase 3 rows to `research/deep-research-state.jsonl`
- [x] T006 Refresh `research/deep-research-dashboard.md` with 30-iteration totals
- [x] T007 Rewrite `research/research.md` as the Phase 1 + 2 + 3 canonical synthesis
- [x] T008 Repair `phase-research-prompt.md` packet-local markdown paths
- [x] T009 Restore `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run consistency checks on the updated report, dashboard, and JSONL
- [x] T011 Run strict packet validation on `006-ralph-main`
- [x] T012 Record validation evidence in `checklist.md` and `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Report**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
