<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Entity Quality - Checklist"
status: planned
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured verification checklist for entity quality improvements"
    next_safe_action: "Implement deriveEntities fixes and mark evidence-backed checks complete"
---
# Verification Checklist
## Protocol <!-- ANCHOR:protocol -->Treat leak closure, focused tests, and cap behavior as the blocking closure signals.<!-- /ANCHOR:protocol -->
## Pre-Impl <!-- ANCHOR:pre-impl -->- [ ] Confirm the current entity leak count and cap behavior before changing `deriveEntities()`.<!-- /ANCHOR:pre-impl -->
## Code Quality <!-- ANCHOR:code-quality -->- [ ] Keep the fix limited to `deriveEntities()` helpers and focused tests.<!-- /ANCHOR:code-quality -->
## Testing <!-- ANCHOR:testing -->- [ ] `npx tsc --noEmit` and focused graph-metadata Vitest suites pass.<!-- /ANCHOR:testing -->
## Security <!-- ANCHOR:security -->- [ ] The scope guard rejects out-of-scope paths without breaking valid canonical local docs.<!-- /ANCHOR:security -->
## Docs <!-- ANCHOR:docs -->- [ ] Verification notes capture the before/after leak counts and cap behavior.<!-- /ANCHOR:docs -->
## File Org <!-- ANCHOR:file-org -->- [ ] Runtime and test edits stay within the parser and named graph-metadata suites.<!-- /ANCHOR:file-org -->
## Summary <!-- ANCHOR:summary -->- [ ] Closure evidence proves the new cap, scope guard, and runtime-name rejection all landed.<!-- /ANCHOR:summary -->
