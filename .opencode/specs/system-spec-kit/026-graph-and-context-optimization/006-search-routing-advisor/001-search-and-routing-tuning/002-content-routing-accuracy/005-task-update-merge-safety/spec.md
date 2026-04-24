<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "...-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety/spec]"
description: 'title: "Add Task Update Merge Safety Guard"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "005"
  - "task"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the phase after the exact-match guard and refusal coverage landed"
    next_safe_action: "Reuse this phase if task-update ambiguity reappears in save routing"
created: 2026-04-13
level: 2
parent: 002-content-routing-accuracy
status: complete
type: implementation
---
# Add Task Update Merge Safety Guard
## Metadata <!-- ANCHOR:metadata -->Parent `002-content-routing-accuracy`; Level 2; status complete; created 2026-04-13.<!-- /ANCHOR:metadata -->
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
## Questions <!-- ANCHOR:questions -->No open questions remain. The shipped guard lives at the merge/save seam and is covered by the focused merge plus handler tests cited in the implementation summary.<!-- /ANCHOR:questions -->
