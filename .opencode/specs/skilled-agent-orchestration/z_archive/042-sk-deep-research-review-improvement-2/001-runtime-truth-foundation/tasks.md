---
title: "Tasks: Runtim [skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "042.001"
  - "tasks"
  - "runtime truth"
  - "legal stop"
  - "continuedfromrun"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Runtime Truth Foundation

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Normalize the shared stop contract across the deep-research and deep-review skill, reference, command, workflow, and agent surfaces. Evidence: `implementation-summary.md` "Stop Contract and Legal-Stop Gates"; `plan.md` "Phase 1: Runtime Foundation".
- [x] T002 Define the typed legal-stop bundle with `stopReason`, `legalStop`, blocked-stop persistence, and replay inputs before downstream observability or ledger work lands. Evidence: `implementation-summary.md` "Stop Contract and Legal-Stop Gates"; `checklist.md` CHK-001 through CHK-004.
- [x] T003 Normalize agent field names, reducer ownership boundaries, and `continuedFromRun` semantics so resume and completed-continue behavior share one contract. Evidence: `implementation-summary.md` "Resume and Continuation Lineage" and "Reducer Ownership and Agent Cleanup"; `plan.md` "Phase 1: Runtime Foundation".
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Extend runtime artifacts with append-only journals, richer observability surfaces, and dashboard contracts for both loop products. Evidence: `implementation-summary.md` "Journals and Observability"; `spec.md` Files to Change entries for the research and review dashboard assets.
- [x] T005 Add replay-safe durability requirements for snapshot/compaction, typed convergence traces, and semantic convergence inputs. Evidence: `implementation-summary.md` "Journals and Observability" and "Semantic Convergence"; `spec.md` REQ-015 through REQ-018.
- [x] T006 Move deep-review machine-owned strategy sections under reducer ownership and align behavior-first verification with the updated contracts. Evidence: `implementation-summary.md` "Reducer Ownership and Agent Cleanup" and "Behavior-First Tests"; `checklist.md` CHK-014 and CHK-020 through CHK-026.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify the runtime-truth foundation through contract parity coverage across commands, skills, agents, and shared runtime surfaces. Evidence: `checklist.md` CHK-005, CHK-012, CHK-040, and CHK-041.
- [x] T008 Verify lifecycle, blocked-stop, replay, resume, semantic convergence, and reducer-owned review sections with behavior-first suites. Evidence: `implementation-summary.md` "Behavior-First Tests"; `checklist.md` CHK-020 through CHK-032.
- [x] T009 Verify the phase packet itself passes strict Level 3 validation with synchronized spec, plan, tasks, checklist, decision record, and implementation summary artifacts. Evidence: `checklist.md` CHK-006, CHK-041, CHK-042, CHK-050, CHK-051, and CHK-052.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All runtime-foundation tasks are marked complete and tied to packet evidence.
- [x] No blocked setup, implementation, or verification tasks remain in this phase.
- [x] The phase documentation reflects post-implementation reality rather than planning placeholders.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
