<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "...rch-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements/spec]"
description: 'title: "Improve Graph Metadata Entity Quality"'
trigger_phrases:
  - "rch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "spec"
  - "007"
  - "entity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the phase after entity-cap, scope, and rejection-list fixes landed"
    next_safe_action: "Reuse this phase if cross-packet entity leakage returns"
created: 2026-04-13
level: 2
parent: 003-graph-metadata-validation
status: complete
type: implementation
---
# Improve Graph Metadata Entity Quality
## Metadata <!-- ANCHOR:metadata -->Parent `003-graph-metadata-validation`; Level 2; status complete; created 2026-04-13.<!-- /ANCHOR:metadata -->
## Problem <!-- ANCHOR:problem -->`deriveEntities()` still truncates too early, leaks a small set of cross-spec paths, and accepts bare runtime words that are not useful entities.<!-- /ANCHOR:problem -->
## Scope <!-- ANCHOR:scope -->In scope: raise the entity cap to `24`, require current-folder path scope, and reject bare runtime-name entities (`python`, `node`, `bash`, `sh`, `npm`, `npx`, `vitest`, `jest`, `tsc`) in `mcp_server/lib/graph/graph-metadata-parser.ts`. Out of scope: key-file logic or schema changes.<!-- /ANCHOR:scope -->
## Requirements <!-- ANCHOR:requirements -->
- REQ-001: Raise the final entity cap from `16` to `24`.
- REQ-002: Reject entity paths outside the current packet scope unless they are valid canonical doc paths.
- REQ-003: Reject bare runtime-name entities: `python`, `node`, `bash`, `sh`, `npm`, `npx`, `vitest`, `jest`, and `tsc`.
- REQ-004: Preserve current local deduplication semantics inside `deriveEntities()`.
- REQ-005: Add focused graph-metadata coverage for the cap, scope, and rejection fixes.
<!-- /ANCHOR:requirements -->
## Success Criteria <!-- ANCHOR:success-criteria -->
- SC-001: Useful in-scope entities survive up to the new cap while known leaks disappear.
- **Given** more than sixteen valid local entities, **when** derivation runs, **then** up to twenty-four can survive.
- **Given** a cross-spec entity path, **when** the scope guard runs, **then** it is rejected.
- **Given** bare runtime names, **when** entities are derived, **then** they do not appear in output.
- **Given** the known leak set, **when** verification runs, **then** the nine remaining cross-spec leaks are gone.
<!-- /ANCHOR:success-criteria -->
## Risks <!-- ANCHOR:risks -->Raising the cap without harder scoping would surface more noise, and an over-strict prefix guard could drop valid canonical packet docs.<!-- /ANCHOR:risks -->
## Questions <!-- ANCHOR:questions -->No open questions remain. The final scope guard combines current-folder path checks with canonical-doc exceptions, as recorded in the implementation summary.<!-- /ANCHOR:questions -->
