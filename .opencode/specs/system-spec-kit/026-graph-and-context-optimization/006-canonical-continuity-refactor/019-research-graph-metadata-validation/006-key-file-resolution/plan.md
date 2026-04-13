<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Key File Resolution - Execution Plan"
status: planned
parent_spec: 006-key-file-resolution/spec.md
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/006-key-file-resolution"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the key-file resolution improvements"
    next_safe_action: "Implement parser fixes in Phase 1, then measure and verify in Phase 2"
---
# Execution Plan
## Summary <!-- ANCHOR:summary -->Improve `deriveKeyFiles()` without changing its external 20-slot contract.<!-- /ANCHOR:summary -->
## Quality Gates <!-- ANCHOR:quality-gates -->The phase only closes if all three fixes are covered by tests and the measured hit rate improves materially.<!-- /ANCHOR:quality-gates -->
## Architecture <!-- ANCHOR:architecture -->Resolve and prune candidates before `normalizeUnique(...).slice(0, 20)` so better paths win the limited slots.<!-- /ANCHOR:architecture -->
## Phases <!-- ANCHOR:phases -->This plan separates parser remediation from hit-rate verification.<!-- /ANCHOR:phases -->
## Phase 1
Add cross-track lookup, stale-deletion pruning, and explicit `memory/metadata.json` rejection inside `graph-metadata-parser.ts`.
## Phase 2
Add focused tests, re-run the key-file quality measurement, and confirm the resolved-hit rate moves toward the high-`90s` target.
## Testing <!-- ANCHOR:testing -->Run `npx tsc --noEmit` plus `npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`.<!-- /ANCHOR:testing -->
## Dependencies <!-- ANCHOR:dependencies -->Depends on current graph-metadata parsing, filesystem existence checks, and focused graph-metadata test coverage.<!-- /ANCHOR:dependencies -->
## Rollback <!-- ANCHOR:rollback -->If resolution heuristics regress output quality, revert the parser changes and measurement updates together.<!-- /ANCHOR:rollback -->
