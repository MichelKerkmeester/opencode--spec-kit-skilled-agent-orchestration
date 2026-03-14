---
title: "Tasks: 002-versioned-memory-state"
description: "Phase 2 lineage and temporal-state task breakdown."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "phase 2 tasks"
  - "lineage tasks"
importance_tier: "critical"
contextType: "general"
---
<!-- ANCHOR:document -->
# Tasks: 002-versioned-memory-state

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

## Track A: Contract and Design

- [x] T201 Create the Phase 2 Level 3+ documentation package
- [x] T202 Finalize lineage entity model and predecessor rules
- [x] T203 Finalize active-projection strategy
- [x] T204 Finalize `asOf` query contract and edge behavior

---

## Track B: Schema and Write Path

- [x] T210 Extend schema for lineage and active projection
- [x] T211 Implement append-first version transitions in save/update flows
- [x] T212 Add lineage integrity validators
- [x] T213 Add operator-facing lineage inspection helpers

---

## Track C: Migration and Rollback

- [x] T220 Build backfill path for existing data
- [x] T221 Add dry-run mode for migration rehearsal
- [x] T222 Add rollback and checkpoint restore drill coverage

---

## Track D: Query Resolution and Verification

- [x] T230 Implement current-state projection reads
- [x] T231 Implement `asOf` temporal reads
- [x] T232 Add lineage integrity and temporal correctness tests
- [x] T233 Add manual lineage and rollback procedures to the playbook

---

## Coordination Checkpoints

- [x] T240 Confirm Phase 1 technical gate is verified
- [x] T241 Confirm Phase 3 can consume lineage identifiers and query semantics without redefining them
- [x] T242 Update `implementation-summary.md` with shipped evidence when execution begins

---

## Completion Criteria

- [x] All P0 lineage acceptance criteria are met
- [x] Backfill and rollback drills pass
- [x] `asOf` behavior is deterministic and documented
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
