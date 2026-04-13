<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Key File Resolution - Checklist"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/006-key-file-resolution"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured verification checklist for key-file resolution"
    next_safe_action: "Implement parser fixes and mark evidence-backed checks complete"
---
# Verification Checklist
## Protocol <!-- ANCHOR:protocol -->Treat parser correctness, focused tests, and measured hit-rate improvement as the blocking closure signals.<!-- /ANCHOR:protocol -->
## Pre-Impl <!-- ANCHOR:pre-impl -->- [ ] Confirm the current key-file hit-rate baseline before changing the parser.<!-- /ANCHOR:pre-impl -->
## Code Quality <!-- ANCHOR:code-quality -->- [ ] Keep the fix confined to `deriveKeyFiles()` helpers and focused tests.<!-- /ANCHOR:code-quality -->
## Testing <!-- ANCHOR:testing -->- [ ] `npx tsc --noEmit` and focused graph-metadata Vitest suites pass.<!-- /ANCHOR:testing -->
## Security <!-- ANCHOR:security -->- [ ] File resolution logic does not expand into unsafe path traversal behavior.<!-- /ANCHOR:security -->
## Docs <!-- ANCHOR:docs -->- [ ] Verification notes capture the before/after hit-rate numbers used for closure.<!-- /ANCHOR:docs -->
## File Org <!-- ANCHOR:file-org -->- [ ] Runtime and test edits stay inside the parser and named graph-metadata tests.<!-- /ANCHOR:file-org -->
## Summary <!-- ANCHOR:summary -->- [ ] Closure evidence proves cross-track resolution, stale pruning, and metadata-json rejection all landed.<!-- /ANCHOR:summary -->
