<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Entity Quality - Execution Plan"
status: planned
parent_spec: 007-entity-quality-improvements/spec.md
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the entity quality improvements"
    next_safe_action: "Implement local parser fixes in Phase 1, then verify leak closure in Phase 2"
---
# Execution Plan
## Summary <!-- ANCHOR:summary -->Refine `deriveEntities()` without changing the surrounding graph-metadata schema or key-file pipeline.<!-- /ANCHOR:summary -->
## Quality Gates <!-- ANCHOR:quality-gates -->The phase only closes if the cap, scope, and runtime-name fixes all land with focused verification evidence.<!-- /ANCHOR:quality-gates -->
## Architecture <!-- ANCHOR:architecture -->Keep the changes local to entity derivation by combining a larger cap with stronger scope and rejection filtering.<!-- /ANCHOR:architecture -->
## Phases <!-- ANCHOR:phases -->This plan separates parser remediation from leak verification.<!-- /ANCHOR:phases -->
## Phase 1
Raise the cap, add the folder-prefix scope guard, and extend the rejection list for bare runtime names.
## Phase 2
Add focused tests, re-run the entity quality check, and confirm the known cross-spec leaks are removed.
## Testing <!-- ANCHOR:testing -->Run `npx tsc --noEmit` plus `npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`.<!-- /ANCHOR:testing -->
## Dependencies <!-- ANCHOR:dependencies -->Depends on the current canonical-path preference logic, scoped folder helpers, and focused graph-metadata test coverage.<!-- /ANCHOR:dependencies -->
## Rollback <!-- ANCHOR:rollback -->If the scope guard removes valid local entities, revert the guard and cap changes together before re-tuning.<!-- /ANCHOR:rollback -->
