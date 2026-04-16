<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "Improve Graph Metadata Key File Resolution"
status: complete
level: 2
type: implementation
parent: 003-graph-metadata-validation
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/006-key-file-resolution"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the phase after key-file resolution fixes and verification landed"
    next_safe_action: "Reuse this phase if cross-track key-file resolution drifts again"
---
# Improve Graph Metadata Key File Resolution
## Metadata <!-- ANCHOR:metadata -->Parent `003-graph-metadata-validation`; Level 2; status complete; created 2026-04-13.<!-- /ANCHOR:metadata -->
## Problem <!-- ANCHOR:problem -->`deriveKeyFiles()` still misses too many valid paths because cross-track references, stale deletions, and `memory/metadata.json` noise survive into the final capped list.<!-- /ANCHOR:problem -->
## Scope <!-- ANCHOR:scope -->In scope: cross-track resolution, pruning files deleted more than 30 days ago, and rejecting `memory/metadata.json` in `mcp_server/lib/graph/graph-metadata-parser.ts`. Out of scope: schema changes or entity derivation work.<!-- /ANCHOR:scope -->
## Requirements <!-- ANCHOR:requirements -->
- REQ-001: Resolve packet-relative key-file paths across `system-spec-kit/` and `skilled-agent-orchestration/`.
- REQ-002: Drop candidates for files deleted more than 30 days ago before truncation.
- REQ-003: Reject all `memory/metadata.json` references from derived `key_files`.
- REQ-004: Preserve the final `normalizeUnique(...).slice(0, 20)` contract.
- REQ-005: Add focused graph-metadata coverage for all three fixes.
<!-- /ANCHOR:requirements -->
## Success Criteria <!-- ANCHOR:success-criteria -->
- SC-001: Key-file resolution improves materially from the current roughly `82%` baseline.
- **Given** a cross-track packet reference, **when** `deriveKeyFiles()` runs, **then** it resolves to the correct track.
- **Given** a path deleted more than 30 days ago, **when** candidates are filtered, **then** it is pruned before the cap.
- **Given** `memory/metadata.json`, **when** key files are derived, **then** it never survives into output.
- **Given** the final candidate set, **when** truncation runs, **then** it still uses the existing 20-slot contract.
<!-- /ANCHOR:success-criteria -->
## Risks <!-- ANCHOR:risks -->Resolving after truncation or treating stale paths as neutral would keep known-bad candidates competing with valid packet files.<!-- /ANCHOR:risks -->
## Questions <!-- ANCHOR:questions -->No open questions remain. The phase closed with the focused graph-metadata suites and the post-refresh corpus evidence recorded in the implementation summary.<!-- /ANCHOR:questions -->
