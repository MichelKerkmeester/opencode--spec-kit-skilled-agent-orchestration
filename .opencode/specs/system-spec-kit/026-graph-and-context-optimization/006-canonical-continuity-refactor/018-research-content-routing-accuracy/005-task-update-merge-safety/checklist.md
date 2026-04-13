<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | level2-verify | compact -->
---
title: "Add Task Update Merge Safety Guard - Checklist"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/005-task-update-merge-safety"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured verification checklist for task-update merge safety"
    next_safe_action: "Implement the guard and mark evidence-backed checks complete"
---
# Verification Checklist
## Protocol <!-- ANCHOR:protocol -->Prioritize pre-mutation safety, explicit rejection messaging, and targeted regression coverage.<!-- /ANCHOR:protocol -->
## Pre-Impl <!-- ANCHOR:pre-impl -->- [ ] Confirm the current save path extracts `targetId` before merge execution.<!-- /ANCHOR:pre-impl -->
## Code Quality <!-- ANCHOR:code-quality -->- [ ] Keep the guard limited to `task_update` and structured checklist/task lines.<!-- /ANCHOR:code-quality -->
## Testing <!-- ANCHOR:testing -->- [ ] `npx tsc --noEmit` and the targeted handler/merge Vitest run pass.<!-- /ANCHOR:testing -->
## Security <!-- ANCHOR:security -->- [ ] Rejected task updates never mutate packet docs before the error returns.<!-- /ANCHOR:security -->
## Docs <!-- ANCHOR:docs -->- [ ] The refusal message tells the operator whether the match was missing or ambiguous.<!-- /ANCHOR:docs -->
## File Org <!-- ANCHOR:file-org -->- [ ] Changes stay within the save/merge runtime and focused tests named in `spec.md`.<!-- /ANCHOR:file-org -->
## Summary <!-- ANCHOR:summary -->- [ ] Closure evidence proves the single-match success path and both refusal paths.<!-- /ANCHOR:summary -->
