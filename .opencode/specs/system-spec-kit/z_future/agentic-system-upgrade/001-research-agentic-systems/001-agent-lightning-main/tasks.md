---
title: "Tasks: 001-agent-lightning-main Research Phase"
description: "Task Format: T### [P?] Description (phase artifact or evidence target)"
trigger_phrases:
  - "001-agent-lightning-main tasks"
  - "agent lightning research tasks"
  - "deep research task list"
importance_tier: "important"
contextType: "tasks"
---
# Tasks: 001-agent-lightning-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### [P?] Description (file path or evidence target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `phase-research-prompt.md` and governing repo instructions (`phase-research-prompt.md`, `AGENTS.md`, `external/AGENTS.md`)
- [x] T002 Create Level 3 phase docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
- [x] T003 Run strict validation and patch any phase-doc issues (`validate.sh --strict`)
- [x] T004 Initialize research output structure (`research/iterations/`, `research/deep-research-state.jsonl`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Map Agent Lightning top-level structure and identify key runtime modules (`external/README.md`, `agentlightning/*`)
- [x] T006 [P] Map Public comparison seams in `.opencode/skill/system-spec-kit/`, `.opencode/command/`, and `.opencode/agent/`
- [x] T007 Define the first three narrow research questions from real source inspection

- [x] T008 Execute iteration 001 and append JSONL state (`research/iterations/`)
- [x] T009 Execute iteration 002 and append JSONL state (`research/iterations/`)
- [x] T010 Execute iteration 003 and append JSONL state (`research/iterations/`)
- [x] T011 Execute iteration 004 and append JSONL state (`research/iterations/`)
- [x] T012 Execute iteration 005 and append JSONL state (`research/iterations/`)
- [x] T013 Execute iterations 006-010 unless convergence or insufficient evidence stops the loop early (`research/iterations/`)
- [x] T014 Review convergence after every iteration and record the stop reason in synthesis artifacts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Write the canonical synthesis report (`research/research.md`)
- [x] T016 Write the dashboard summary (`research/deep-research-dashboard.md`)
- [x] T017 Update `checklist.md` with evidence-backed completion marks
- [x] T018 Create `implementation-summary.md`
- [x] T019 Save memory using `generate-context.js`
- [x] T020 Run final strict validation and confirm phase-only write scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Iteration evidence and synthesis artifacts agree on counts and stop reason
- [x] Final validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
