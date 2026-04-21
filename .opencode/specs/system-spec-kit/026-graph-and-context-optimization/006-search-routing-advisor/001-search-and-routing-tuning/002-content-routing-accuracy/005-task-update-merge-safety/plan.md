<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "Add Task Update Merge Safety Guard - Execution Plan"
status: complete
parent_spec: 005-task-update-merge-safety/spec.md
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the task-update merge-safety phase"
    next_safe_action: "Reuse this phase if task-update matching drifts again"
---
# Execution Plan
## Summary <!-- ANCHOR:summary -->Add an exact-match guard for `task_update` before canonical writes reach the merge transform.<!-- /ANCHOR:summary -->
## Quality Gates <!-- ANCHOR:quality-gates -->The phase only closes if no ambiguous task update can mutate a document and the refusal message is explicit.<!-- /ANCHOR:quality-gates -->
## Architecture <!-- ANCHOR:architecture -->Keep the fix local to the save/merge seam by resolving eligible structured lines before `update-in-place` mutates content.<!-- /ANCHOR:architecture -->
## Phases <!-- ANCHOR:phases -->This plan separates guard implementation from error-surfacing and regression coverage.<!-- /ANCHOR:phases -->
## Phase 1
Add a helper that resolves structured checklist/task lines for a target id and enforces the exactly-one-match rule.
## Phase 2
Surface zero-match and multi-match failures from `memory-save.ts`, then cover success and refusal paths with focused tests.
## Testing <!-- ANCHOR:testing -->Run `npx tsc --noEmit` plus `npx vitest run tests/handler-memory-save.vitest.ts tests/anchor-merge-operation.vitest.ts`.<!-- /ANCHOR:testing -->
## Dependencies <!-- ANCHOR:dependencies -->Depends on current `targetId` extraction, structured-line matching, and targeted Vitest coverage for save and merge behavior.<!-- /ANCHOR:dependencies -->
## Rollback <!-- ANCHOR:rollback -->If the guard causes false refusals, revert the helper and surfaced error path together to restore the prior save behavior.<!-- /ANCHOR:rollback -->
