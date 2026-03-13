---
title: "Tasks: 005-hierarchical-scope-governance"
description: "Phase 5 governance and scope-enforcement task breakdown."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "phase 5 tasks"
  - "governance tasks"
importance_tier: "critical"
contextType: "general"
---
<!-- ANCHOR:document -->
# Tasks: 005-hierarchical-scope-governance

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

## Track A: Policy Model and Shared Middleware

- [x] T501 Create the Phase 5 Level 3+ documentation package
- [x] T502 Define hierarchical scope model
- [x] T503 Build shared governance middleware
- [x] T504 Define audit event contract

---

## Track B: Governed Ingest and Retrieval

- [x] T510 Apply scope predicates to retrieval paths
- [x] T511 Apply provenance gates to ingest paths
- [x] T512 Extend schema for governance metadata
- [x] T513 Add allow/deny audit output

---

## Track C: Lifecycle Enforcement and Validation

- [x] T520 Implement retention jobs
- [x] T521 Implement cascade deletion graph
- [x] T522 Add isolation and deletion drills
- [x] T523 Add governance playbook procedures

---

## Coordination Checkpoints

- [x] T530 Confirm lineage contract is approved for governance use
- [x] T531 Confirm Phase 6 rollout remains blocked until governance checks pass
- [x] T532 Update `implementation-summary.md` with execution evidence when work begins

---

## Completion Criteria

- [x] Cross-scope leaks are blocked in the verification matrix
- [x] Governed ingest and lifecycle rules are auditable
- [x] Retention and deletion rollback paths are documented and tested
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
