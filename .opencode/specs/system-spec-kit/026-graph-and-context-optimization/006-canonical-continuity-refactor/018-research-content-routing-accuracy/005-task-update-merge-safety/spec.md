<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "Add Task Update Merge Safety Guard"
status: planned
level: 2
type: implementation
parent: 018-research-content-routing-accuracy
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/005-task-update-merge-safety"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 planning docs for task update merge safety"
    next_safe_action: "Implement the exact-match guard and rejection messaging"
---
# Add Task Update Merge Safety Guard
## Metadata <!-- ANCHOR:metadata -->Parent `018-research-content-routing-accuracy`; Level 2; status planned; created 2026-04-13.<!-- /ANCHOR:metadata -->
## Problem <!-- ANCHOR:problem -->`task_update` routing can still risk ambiguous checklist matching, and the failure path is not explicit enough for operators.<!-- /ANCHOR:problem -->
## Scope <!-- ANCHOR:scope -->In scope: exact structured-line validation and loud user-facing rejections in `anchor-merge-operation.ts` and `memory-save.ts`. Out of scope: non-`task_update` merge modes and Tier 3 classifier redesign.<!-- /ANCHOR:scope -->
## Requirements <!-- ANCHOR:requirements -->
- REQ-001: Validate `task_update` targets before any document mutation occurs.
- REQ-002: Only one structured checklist/task line may match the requested id.
- REQ-003: Zero-match and multi-match cases must fail loudly with user-facing text.
- REQ-004: The success path must still update the intended checklist line.
- REQ-005: Non-`task_update` merge behavior must remain unchanged.
<!-- /ANCHOR:requirements -->
## Success Criteria <!-- ANCHOR:success-criteria -->
- SC-001: Ambiguous task updates are rejected before a write happens.
- **Given** a single valid checklist match, **when** the save runs, **then** the update succeeds.
- **Given** no checklist match, **when** the save runs, **then** the handler returns a clear refusal message.
- **Given** duplicate checklist matches, **when** the save runs, **then** the handler refuses before mutation.
- **Given** non-task routes, **when** this phase lands, **then** their merge behavior is unchanged.
<!-- /ANCHOR:success-criteria -->
## Risks <!-- ANCHOR:risks -->A loose regex or post-mutation check would preserve the ambiguity bug, and unclear rejection text would leave operators guessing how to repair the input.<!-- /ANCHOR:risks -->
## Questions <!-- ANCHOR:questions -->Open question: whether the pre-merge check should live in the merge module, the save handler, or a shared helper invoked by both.<!-- /ANCHOR:questions -->
