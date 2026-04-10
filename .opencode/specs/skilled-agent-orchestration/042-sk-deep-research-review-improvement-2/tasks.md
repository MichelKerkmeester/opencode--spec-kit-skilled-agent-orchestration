---
title: "Tasks: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Parent task index for child phases 001-004."
trigger_phrases:
  - "042"
  - "tasks"
  - "phase index"
  - "parent packet"
importance_tier: "important"
contextType: "planning"
---
# Tasks: Deep Research and Deep Review Runtime Improvement Bundle

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

**Task Format**: `T### or phase-specific ID [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the child phase before editing.
- Confirm the task still belongs in the linked child folder rather than the parent packet.
- Confirm the verification path listed in the child phase packet.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| `CHILD-OWNED` | Detailed implementation tasks belong in child phase `tasks.md` files. |
| `PARENT-INDEX-ONLY` | This root file tracks phase-level progress only. |
| `STATUS-TRACEABLE` | Parent status summaries must match the child task files. |
| `DEFERRED-EXPLICIT` | Phase 4b work stays marked deferred/blocked until prerequisites exist. |

### Status Reporting Format

- `pending`: no implementation has started in the child phase.
- `in-progress`: active work is happening in the child phase.
- `blocked`: the child phase has explicit prerequisite or verification blockers.
- `completed`: the child phase implementation and validation gates are complete.

### Blocked Task Protocol

- If a blocker belongs to one child phase, record it in that child phase rather than widening the parent packet.
- If a later phase is blocked by an earlier phase, preserve the dependency in both the child phase and the parent index.

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Parent Phase Index

| Phase | Child Tasks | Requirement Scope | Status Summary | Notes |
|-------|-------------|-------------------|----------------|-------|
| **Phase 1** | [./001-runtime-truth-foundation/tasks.md](./001-runtime-truth-foundation/tasks.md) | Runtime truth foundation | 39 tasks total; all Pending | Includes split IDs such as `T003a`/`T003b` and early agent-contract cleanup tasks |
| **Phase 2** | [./002-semantic-coverage-graph/tasks.md](./002-semantic-coverage-graph/tasks.md) | Coverage graph + MCP reuse | 25 tasks total; all Pending | Includes `T-CG-NEW-*` reducer/MCP integration tasks |
| **Phase 3** | [./003-wave-executor/tasks.md](./003-wave-executor/tasks.md) | Wave executor | 17 tasks total; all Pending | Includes `T-WE-NEW-*` prerequisite, prepass, and merge-contract tasks |
| **Phase 4** | [./004-offline-loop-optimizer/tasks.md](./004-offline-loop-optimizer/tasks.md) | Offline optimizer | 10 tasks total; 7 Pending in `4a`, 3 Blocked in `4b` | `4b` stays deferred until replay fixtures, behavioral suites, and corpus prerequisites exist |

- [ ] T-PARENT-001 Keep the root packet synchronized with Phase 1 child docs.
- [ ] T-PARENT-002 Keep the root packet synchronized with Phase 2 child docs.
- [ ] T-PARENT-003 Keep the root packet synchronized with Phase 3 child docs.
- [ ] T-PARENT-004 Keep the root packet synchronized with Phase 4 child docs.
- [ ] T-PARENT-005 Preserve deferred `4b` status until its prerequisites become real.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Aggregate Status

| Category | Count |
|----------|-------|
| Total child tasks | 91 |
| Pending | 88 |
| Blocked | 3 |
| Completed | 0 |

**Parent packet status**: planning only. All active implementation detail lives in the child task files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- Verify child task counts against the linked `tasks.md` files before updating this parent index.
- Verify deferred Phase 4b blockers still match the child phase prerequisites.
- Verify the root cross-references still point to the intended child packet sources.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Parent task summaries match the child task files.
- [ ] Deferred work remains explicitly marked and scoped.
- [ ] Root packet links route to the correct child sources of truth.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [./spec.md](./spec.md)
- **Implementation Plan**: See [./plan.md](./plan.md)
- **Verification Index**: See [./checklist.md](./checklist.md)
- **Decision Index**: See [./decision-record.md](./decision-record.md)
<!-- /ANCHOR:cross-refs -->
