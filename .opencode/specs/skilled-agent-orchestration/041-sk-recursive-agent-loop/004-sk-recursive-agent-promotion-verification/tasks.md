---
title: "Tasks: Recursive Agent Promotion Verification [template:level_2/tasks.md]"
description: "Task tracking for phase 004 under packet 041."
trigger_phrases:
  - "041 phase 004 tasks"
  - "recursive agent promotion verification tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: Recursive Agent Promotion Verification

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

- [x] T001 Create the new `004-sk-improve-agent-promotion-verification/` phase packet
- [x] T002 Create a phase-local `improvement/` runtime for verification artifacts
- [x] T003 Copy forward the bounded manifest, charter, strategy, and reusable baseline benchmark outputs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Calibrate the handover scorer narrowly so a structurally stronger candidate can win
- [x] T005 Create the phase-local handover candidate used for promotion verification
- [x] T006 Generate handover repeatability artifacts in the new phase
- [x] T007 Generate context-prime repeatability artifacts in the new phase
- [x] T008 Run the guarded promotion path against `.opencode/agent/handover.md`
- [x] T009 Validate the promoted canonical handover file
- [x] T010 Roll back the canonical handover file to the archived backup
- [x] T011 Record direct backup-match proof after rollback
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Update root packet `041` to record phase `004`
- [x] T013 Update `.opencode/specs/descriptions.json` with the new phase
- [x] T014 Run package and document validators for touched agent-improver surfaces
- [x] T015 Run strict validation for root `041`
- [x] T016 Run strict validation for phase `004`
- [x] T017 Update the implementation summary with the final evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase `004` exists and is documented
- [x] Guarded promotion success and rollback evidence exist for handover
- [x] Repeatability evidence exists for both `handover` and `context-prime`
- [x] Root packet `041` records phase `004` as completed work
- [x] Validators pass for the touched docs and packet hierarchy
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent Packet**: See [../](../)
- **Previous Phase**: See [../003-sk-improve-agent-doc-alignment/](../003-sk-improve-agent-doc-alignment/)
- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->

---
