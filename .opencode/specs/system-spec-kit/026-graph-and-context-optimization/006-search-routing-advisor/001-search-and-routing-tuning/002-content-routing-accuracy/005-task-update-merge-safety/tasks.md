<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | compact -->
---
title: "Add Task Update Merge Safety Guard - Tasks"
status: completed
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Added document-wide task-match prevalidation and covered the success and refusal paths"
    next_safe_action: "No further phase-local work required beyond packet-level follow-through"
---
# Tasks
## Notation <!-- ANCHOR:notation -->`[ ]` pending, `[x]` complete, `T9##` verification-only.<!-- /ANCHOR:notation -->
## Phase 1 <!-- ANCHOR:phase-1 -->
- [x] T001: Add a helper that resolves eligible structured checklist/task lines for a `targetId`.
- [x] T002: Enforce the exactly-one-match rule before `update-in-place` mutates a document.
<!-- /ANCHOR:phase-1 -->
## Phase 2 <!-- ANCHOR:phase-2 -->
- [x] T003: Surface zero-match and multi-match failures from `mcp_server/handlers/memory-save.ts`.
- [x] T004: Preserve the successful single-match task-update path.
<!-- /ANCHOR:phase-2 -->
## Phase 3 <!-- ANCHOR:phase-3 -->
- [x] T005: Add focused success and refusal tests in handler and merge-operation coverage.
- [x] T901: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T902: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/anchor-merge-operation.vitest.ts && npx vitest run tests/handler-memory-save.vitest.ts -t "task updates"`
<!-- /ANCHOR:phase-3 -->
## Completion <!-- ANCHOR:completion -->Close when ambiguous `task_update` writes fail before mutation and the message is operator-readable.<!-- /ANCHOR:completion -->
## Cross-Refs <!-- ANCHOR:cross-refs -->See `spec.md` for safety requirements and `plan.md` for the two-phase implementation order.<!-- /ANCHOR:cross-refs -->
