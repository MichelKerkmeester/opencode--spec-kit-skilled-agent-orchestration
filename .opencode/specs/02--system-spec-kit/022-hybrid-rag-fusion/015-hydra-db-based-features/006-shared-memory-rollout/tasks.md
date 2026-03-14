---
title: "Tasks: 006-shared-memory-rollout"
description: "Phase 6 collaboration and staged-rollout task breakdown."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "phase 6 tasks"
  - "shared memory tasks"
importance_tier: "critical"
contextType: "general"
---
<!-- ANCHOR:document -->
# Tasks: 006-shared-memory-rollout

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Track A: Space and Membership Model

- [x] T601 Create the Phase 6 Level 3+ documentation package
- [x] T602 Define shared-space schema and role model
- [x] T603 Reuse Phase 5 governance checks for collaboration
- [x] T604 Define rollout cohorts and gating rules

---

## Track B: Collaboration Logic

- [x] T610 Implement shared-space handlers
- [x] T611 Implement deny-by-default membership checks
- [x] T612 Implement conflict strategy and audit traces
- [x] T613 Add collaboration telemetry

---

## Track C: Staged Rollout and Validation

- [x] T620 Add shared-memory test coverage
- [x] T621 Add kill-switch and rollback drills
- [x] T622 Add operator runbooks to the playbook
- [x] T623 Update feature catalog and README surfaces after implementation

---

## Coordination Checkpoints

- [x] T630 Confirm Phase 5 governance technical gate is verified
- [x] T631 Confirm earlier retrieval phases are stable enough for rollout
- [x] T632 Update `implementation-summary.md` with execution evidence when work begins

---

## Completion Criteria

- [x] Shared-memory spaces are opt-in and deny-by-default
- [x] Conflict handling is auditable and understandable
- [x] Kill switches and rollback drills pass
- [x] No `[B]` blocked tasks remain

---

## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

<!-- /ANCHOR:document -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

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
<!-- /ANCHOR:ai-protocol -->
