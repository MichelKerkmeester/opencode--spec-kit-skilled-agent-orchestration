---
title: "...006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities/spec]"
description: 'title: "Deduplicate Graph Metadata Entities"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "003"
  - "deduplicate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities"
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
# Deduplicate Graph Metadata Entities

## Scope

Add a basename-match check against existing canonical-path entries before inserting new entities into graph metadata. Currently 2,020 basename-only duplicates exist across 270 spec folders, inflating entity counts and degrading graph query precision.

## Key Files

- `mcp_server/lib/graph/graph-metadata-parser.ts` (lines 418-446)

## Out of Scope

- Merging metadata from duplicate entries (drop the duplicate, keep the canonical).
- Cross-folder entity deduplication.
