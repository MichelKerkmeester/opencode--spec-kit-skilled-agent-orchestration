---
title: "Tasks: Command Alignment"
description: "Documentation reconciliation tasks for updating the 012 command-alignment spec pack to the live 33-tool, 6-command memory-command surface."
---
<!-- SPECKIT_LEVEL: 2 -->
# Tasks: 012-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T##: Description`
<!-- /ANCHOR:notation -->

---

### Task Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 10 |
| Phase 1 (Setup) | 3 tasks (T00-T02) |
| Phase 2 (Implementation) | 4 tasks (T03-T06) |
| Phase 3 (Verification) | 3 tasks (T07-T09) |
| Estimated LOC | ~250 |
| Parallelizable | Phase 1 checks can run in parallel; rewrites depend on Phase 1 |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T00: Recount live tool inventory
- **Priority:** P0
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **Action:** Count `TOOL_DEFINITIONS` and confirm the live total is 33.
- **Acceptance:** The reconciled 012 pack uses 33 as the only valid tool count.
- **Covers:** CA-001
- [x] Done

### T01: Verify live memory command surface
- **Priority:** P0
- **Files:** `.opencode/command/memory/`
- **Action:** Confirm the live suite contains `analyze`, `continue`, `learn`, `manage`, `save`, and `shared`, and confirm that no standalone `context` command file exists.
- **Acceptance:** The reconciled 012 pack uses a 6-command model and removes the standalone `context` command assumption.
- **Covers:** CA-002, CA-003
- [x] Done

### T02: Verify retrieval ownership
- **Priority:** P0
- **Files:** `.opencode/command/memory/analyze.md`, `.opencode/command/memory/README.txt`
- **Action:** Confirm `/memory:analyze` is the documented home for retrieval, `memory_quick_search`, analysis/eval tooling, and learning history.
- **Acceptance:** The reconciled 012 pack assigns retrieval ownership to `/memory:analyze`.
- **Covers:** CA-004, CA-006
- [x] Done
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T03: Rewrite `spec.md` counts and structure
- **Priority:** P0
- **File:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md`
- **Action:** Replace stale 32-tool, 7-command, and standalone `context` command planning language with live repo truth.
- **Acceptance:** `spec.md` describes a 33-tool surface, a 6-command suite, and retrieval merged into `.opencode/command/memory/analyze.md`.
- **Covers:** CA-001, CA-002, CA-003, CA-004
- [x] Done

### T04: Rewrite `spec.md` gap analysis around what is still real
- **Priority:** P1
- **File:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md`
- **Action:** Remove already-shipped items from the missing-work list and record only the directly observed runtime-doc drift cluster.
- **Acceptance:** The spec treats `.opencode/command/memory/shared.md`, `.opencode/command/memory/analyze.md`, `/memory:manage ingest`, and README coverage as existing, and records the analyze.md plus shared.md drift that this pass resolves.
- **Covers:** CA-005, CA-008
- [x] Done

### T05: Rebase `plan.md` to a reconciliation plan
- **Priority:** P0
- **File:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/plan.md`
- **Action:** Replace the old implementation roadmap with a documentation-only reconciliation plan grounded in live repo state.
- **Acceptance:** `plan.md` describes verification, rewrite, and validation steps instead of future command creation work.
- **Covers:** CA-005, CA-007, CA-010
- [x] Done

### T06: Rebase `tasks.md` to reconciliation tasks
- **Priority:** P0
- **File:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/tasks.md`
- **Action:** Replace stale implementation tasks with a compact task list covering live-state verification, pack rewrites, and validation.
- **Acceptance:** `tasks.md` is internally consistent with the reconciled `spec.md` and `plan.md`.
- **Covers:** CA-005, CA-007, CA-010
- [x] Done
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T07: Grep the 012 pack for stale assumptions
- **Priority:** P1
- **Files:** `spec.md`, `plan.md`, `tasks.md`
- **Action:** Search the reconciled pack for stale `32`, `7-command`, `7 commands`, and standalone `context` command assumptions.
- **Acceptance:** No stale live-state claims remain in the edited files.
- **Covers:** CA-001, CA-002, CA-003, CA-010
- [x] Done

### T08: Run spec validation
- **Priority:** P1
- **Files:** Spec folder
- **Action:** Run the spec validator after the rewrite.
- **Acceptance:** Validation completes successfully or any remaining issue is reported honestly as outside this edit scope.
- **Covers:** CA-007
- [x] Done

### T09: Record drift as resolved
- **Priority:** P1
- **Files:** `spec.md`, `plan.md`
- **Action:** Record that the `.opencode/command/memory/analyze.md` and `.opencode/command/memory/shared.md` mismatches were resolved during the 2026-03-21 reconciliation pass.
- **Acceptance:** The pack describes the drift cluster as resolved, not open.
- **Covers:** CA-008
- [x] Done
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All reconciliation tasks are marked complete
- [x] The pack preserves the live 33-tool / 6-command / `/memory:analyze` ownership story
- [x] Strict validation has been run and its result recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`

### Dependency Graph

```text
Phase 0:
  T00 ─┐
  T01 ─┼─> T02
  T02 ─┘

Phase 1:
  T03 -> T04
  T03 -> T05
  T03 -> T06

Phase 2:
  T04 ─┐
  T05 ─┼─> T07 -> T08
  T06 ─┘
  T04 -----> T09
```
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS: 012-command-alignment
10/10 tasks complete - truth-reconciled 2026-03-21
Current reality: 33 tools, 6 commands, retrieval merged into analyze
-->
