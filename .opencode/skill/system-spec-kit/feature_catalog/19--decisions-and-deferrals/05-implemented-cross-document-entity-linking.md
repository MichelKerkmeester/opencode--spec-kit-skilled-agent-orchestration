# Implemented: cross-document entity linking

## Current Reality

Originally skipped at Sprint 7 because zero entities existed in the system. R10 had not been built, so there was no entity catalog to link against.

**Now implemented.** With R10 providing extracted entities, S5 scans the `entity_catalog` for entities appearing in two or more spec folders and creates `supports` causal edges with `strength=0.7` and `created_by='entity_linker'`. A density guard prevents runaway edge creation by running both a current-global-density precheck (`total_edges / total_memories`) and a projected post-insert global density check against `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`, invalid or negative values fall back to `1.0`). Runs behind `SPECKIT_ENTITY_LINKING` (default ON) and depends on a populated `entity_catalog` (typically produced by R10 auto-entities). See [Cross-document entity linking](#cross-document-entity-linking) for the full description.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/entity-linker.vitest.ts` | Entity linking tests |
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
| `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
| `mcp_server/tests/search-flags.vitest.ts` | Feature flag behavior |

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: Implemented: cross-document entity linking
- Current reality source: feature_catalog.md
