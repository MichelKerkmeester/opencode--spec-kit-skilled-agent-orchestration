---
title: "Tasks: Deep Research and Deep Review [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks]"
description: "Parent task index for child phases 001-008 plus archived closing-audit remediation."
trigger_phrases:
  - "042"
  - "tasks"
  - "phase index"
  - "parent packet"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
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
| **Phase 1** | [./001-runtime-truth-foundation/](./001-runtime-truth-foundation/) | Runtime truth foundation | Implemented; all tasks completed | 44 files, +7K lines, stop contract, legal-stop gates, resume semantics, journals, dashboards, tests |
| **Phase 2** | [./002-semantic-coverage-graph/tasks.md](./002-semantic-coverage-graph/tasks.md) | Coverage graph + MCP reuse | Implemented; 23/23 tasks completed | 25 files (17 new), +5.2K lines, 4 CJS modules, SQLite DB, MCP handlers, 101 tests |
| **Phase 3** | [./003-wave-executor/tasks.md](./003-wave-executor/tasks.md) | Wave executor | Implemented; 13/13 tasks completed | 11 files (9 new), +3.3K lines, 5 CJS wave modules, 97 tests |
| **Phase 4** | [./004-offline-loop-optimizer/tasks.md](./004-offline-loop-optimizer/tasks.md) | Offline optimizer | Implemented (4a: 7/7); Deferred (4b: 3 Blocked) | 20 files (14 new), +3.8K lines, 6 optimizer modules, 91 tests |
| **Phase 5** | [./005-agent-improver-deep-loop-alignment/tasks.md](./005-agent-improver-deep-loop-alignment/tasks.md) | sk-improve-agent alignment with frozen stop-reason taxonomy | Implemented; all tasks completed | Journal wiring, advisory optimizer integration, SKILL bump to v1.1.0.0 |
| **Phase 6** | [./006-graph-testing-and-playbook-alignment/tasks.md](./006-graph-testing-and-playbook-alignment/tasks.md) | Graph testing + playbook coverage | Implemented; all tasks completed | Vitest coverage across coverage-graph layers + matching playbook scenarios |
| **Phase 7** | [./007-graph-aware-stop-gate/tasks.md](./007-graph-aware-stop-gate/tasks.md) | Graph-aware stop gate + runtime-truth reconciliation | Implemented; all tasks completed | Graph convergence MCP wiring in both loop workflows, fail-closed reducer reconciliation |
| **Phase 8** | [./008-further-deep-loop-improvements/tasks.md](./008-further-deep-loop-improvements/tasks.md) | 12 Codex research recommendations + 4 phase-008 closing-audit P1 fixes | Implemented; all tasks completed | 12 new vitest tests, 7 playbook scenarios, SKILL bumps to v1.6.0.0 / v1.3.0.0 / v1.2.0.0 |
| **Closing Audit + Remediation** | [./review/archive-rvw-2026-04-11/review-report.md](./review/archive-rvw-2026-04-11/review-report.md) | Post-phase-008 closing audit (10 iterations, CONDITIONAL) and Lane 1–5 remediation | Closed — 16 findings routed to 5 remediation lanes, all landed in this packet | See `implementation-summary.md` §How It Was Delivered for the Lane 1–5 mapping and REQ-026 through REQ-034 |

- [x] T-PARENT-001 Keep the root packet synchronized with Phase 1 child docs.
- [x] T-PARENT-002 Keep the root packet synchronized with Phase 2 child docs.
- [x] T-PARENT-003 Keep the root packet synchronized with Phase 3 child docs.
- [x] T-PARENT-004 Keep the root packet synchronized with Phase 4 child docs.
- [x] T-PARENT-005 Preserve deferred `4b` status until its prerequisites become real.
- [x] T-PARENT-006 Keep the root packet synchronized with Phase 5 child docs.
- [x] T-PARENT-007 Keep the root packet synchronized with Phase 6 child docs.
- [x] T-PARENT-008 Keep the root packet synchronized with Phase 7 child docs.
- [x] T-PARENT-009 Keep the root packet synchronized with Phase 8 child docs.
- [x] T-PARENT-010 Run the phase-008 closing deep-review session and treat its verdict as a release gate.
- [x] T-PARENT-011 Absorb the closing-audit remediation (Lanes 1–5) into the same packet rather than spinning up a new follow-up packet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Aggregate Status

| Category | Count |
|----------|-------|
| Child phases | 8 (`001`–`008`) plus closing-audit remediation (`review/` + Lanes 1–5) |
| Completed child tasks | 88 across phases 1–4 plus all phase 5–8 tasks plus the 12 Lane 1–5 remediation tasks (T001–T012 in `review/archive-rvw-2026-04-11/review-report.md`) |
| Blocked (Phase 4b deferred) | 3 |
| Pending | 0 |

**Parent packet status**: Implemented. Phases 1–8 complete, closing-audit Lane 1–5 remediation complete, only Phase 4b (prompt-pack generation + meta-learning) remains explicitly deferred against its prerequisites.
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

- [x] Parent task summaries match the child task files.
- [x] Deferred work remains explicitly marked and scoped.
- [x] Root packet links route to the correct child sources of truth.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [./spec.md](./spec.md)
- **Implementation Plan**: See [./plan.md](./plan.md)
- **Verification Index**: See [./checklist.md](./checklist.md)
- **Decision Index**: See [./decision-record.md](./decision-record.md)
<!-- /ANCHOR:cross-refs -->
