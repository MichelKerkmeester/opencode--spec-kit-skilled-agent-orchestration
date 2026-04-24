---
title: "...06-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation/spec]"
description: 'title: "Fix Graph Metadata Status Derivation"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
created: 2026-04-12
level: 2
parent: 003-graph-metadata-validation
status: complete
type: implementation
---
# Fix Graph Metadata Status Derivation

## Scope

Update `deriveStatus()` to treat the presence of `implementation-summary.md` as a completion signal. Currently 259 spec folders show status "planned" despite being finished, because the derivation logic does not account for this artifact.

## Key Files

- `mcp_server/lib/graph/graph-metadata-parser.ts` (lines 346-353 and 498-510)

## Out of Scope

- Changing how status is persisted in `graph-metadata.json`.
- Retroactive backfill of existing metadata files (handled by 019/004).
