<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Entity Quality"
status: planned
level: 2
type: implementation
parent: 019-research-graph-metadata-validation
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 planning docs for entity quality improvements"
    next_safe_action: "Implement the cap, scope, and rejection-list fixes"
---
# Improve Graph Metadata Entity Quality
## Metadata <!-- ANCHOR:metadata -->Parent `019-research-graph-metadata-validation`; Level 2; status planned; created 2026-04-13.<!-- /ANCHOR:metadata -->
## Problem <!-- ANCHOR:problem -->`deriveEntities()` still truncates too early, leaks a small set of cross-spec paths, and accepts bare runtime words that are not useful entities.<!-- /ANCHOR:problem -->
## Scope <!-- ANCHOR:scope -->In scope: raise the entity cap to `24`, require current-folder path scope, and reject `python`, `node`, `bash`, and `sh` in `mcp_server/lib/graph/graph-metadata-parser.ts`. Out of scope: key-file logic or schema changes.<!-- /ANCHOR:scope -->
## Requirements <!-- ANCHOR:requirements -->
- REQ-001: Raise the final entity cap from `16` to `24`.
- REQ-002: Reject entity paths outside the current packet scope unless they are valid canonical doc paths.
- REQ-003: Add `python`, `node`, `bash`, and `sh` to the bare-name rejection list.
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
## Questions <!-- ANCHOR:questions -->Open question: whether the scope guard should key off packet folder prefix alone or combine prefix and canonical-doc exceptions.<!-- /ANCHOR:questions -->
