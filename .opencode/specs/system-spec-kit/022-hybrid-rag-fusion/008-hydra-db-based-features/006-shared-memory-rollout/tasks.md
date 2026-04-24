---
title: "Tasks: 006-share [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/tasks]"
description: "Phase 6 collaboration and staged-rollout task breakdown."
trigger_phrases:
  - "phase 6 tasks"
  - "shared memory tasks"
importance_tier: "critical"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
---
# Tasks: 006-shared-memory-rollout

<!-- SPECKIT_LEVEL: 3+ -->
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

Context: space and membership model.

- [x] T601 Create the Phase 6 Level 3+ documentation package
- [x] T602 Define shared-space schema and role model
- [x] T603 Reuse Phase 5 governance checks for collaboration
- [x] T604 Define rollout cohorts and gating rules
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Context: collaboration logic.

- [x] T610 Implement shared-space handlers
- [x] T611 Implement deny-by-default membership checks
- [x] T612 Implement conflict strategy and audit traces
- [x] T613 Add collaboration telemetry
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Context: staged rollout and validation.

- [x] T620 Add shared-memory test coverage
- [x] T621 Add kill-switch and rollback drills
- [x] T622 Add operator runbooks to the playbook
- [x] T623 Update feature catalog and README surfaces after implementation

### Coordination Checkpoints

- [x] T630 Confirm Phase 5 governance technical gate is verified
- [x] T631 Confirm earlier retrieval phases are stable enough for rollout
- [x] T632 Update `implementation-summary.md` with execution evidence when work begins
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Shared-memory spaces are opt-in and deny-by-default
- [x] Conflict handling is auditable and understandable
- [x] Kill switches and rollback drills pass
- [x] No `[B]` blocked tasks remain
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm predecessor phase gates are satisfied before implementation starts.
- Re-read `spec.md`, `plan.md`, and `decision-record.md` before touching code.
- Keep the phase boundary explicit; do not pull work forward from later phases.
- Record whether the task changes docs only or runtime behavior.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| TASK-SEQ | Finish prerequisite tasks before dependent tasks |
| TASK-SCOPE | Stay within the files and outcomes listed for this phase |
| TASK-VERIFY | Do not mark execution complete without recorded evidence |
| TASK-DOCS | Update `implementation-summary.md` and `checklist.md` whenever evidence changes |

### Status Reporting Format

- `STARTED:` task id, owner, and target files
- `IN PROGRESS:` current checkpoint and remaining blocker-free work
- `BLOCKED:` blocker, evidence, and next decision needed
- `DONE:` evidence reference and handoff state

### Blocked Task Protocol

1. Stop work as soon as a predecessor gate, safety rule, or rollout assumption is violated.
2. Record the blocker in `tasks.md` with `[B]` and explain the impacted downstream work.
3. Update `implementation-summary.md` before handing the phase back for review.
