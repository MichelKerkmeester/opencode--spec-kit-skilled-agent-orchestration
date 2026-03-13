---
title: "Tasks: 004-adaptive-retrieval-loops"
description: "Phase 4 adaptive-learning task breakdown."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "phase 4 tasks"
  - "adaptive tasks"
importance_tier: "critical"
contextType: "general"
---
<!-- ANCHOR:document -->
# Tasks: 004-adaptive-retrieval-loops

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

## Track A: Contract and Policy Design

- [x] T401 Create the Phase 4 Level 3+ documentation package
- [x] T402 Define signal contract and thresholds
- [x] T403 Define bounded-update rules
- [x] T404 Define promotion and rollback criteria

---

## Track B: Shadow Evaluation Implementation

- [x] T410 Capture access, outcome, and correction signals
- [x] T411 Implement shadow-mode adaptive scoring
- [x] T412 Record adaptive decision traces
- [x] T413 Add kill switches and cache reset path

---

## Track C: Validation and Rollout Readiness

- [x] T420 Add regression comparisons against the Phase 3 baseline
- [x] T421 Add bounded-update tests
- [x] T422 Add rollback drills
- [x] T423 Add manual adaptive-validation procedures to the playbook

---

## Coordination Checkpoints

- [x] T430 Confirm Phase 3 handoff is approved
- [x] T431 Confirm Phase 5 governance rules do not conflict with promotion policy
- [x] T432 Update `implementation-summary.md` with execution evidence when work begins

---

## Completion Criteria

- [x] Adaptive evaluation runs in shadow mode only
- [x] Promotion requires explicit evidence
- [x] Rollback disables adaptive effects safely
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
