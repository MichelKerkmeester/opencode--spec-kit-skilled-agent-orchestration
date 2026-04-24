---
title: "...6-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files/spec]"
description: 'title: "Retired: Normalize Legacy Graph Metadata Files"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "004"
  - "normalize"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files"
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
# Normalize Legacy Graph Metadata Files

## Scope

Convert the 35 remaining text-format `graph-metadata` files to canonical JSON format. These files still load via the parser's plaintext fallback path but produce weaker timestamps and incomplete entity coverage compared to JSON-format files.

## Retirement Note

This phase is now retired as active implementation work. The final post-remediation corpus scan in this packet returned `legacyGraphMetadataFiles = 0`, so no legacy plaintext graph-metadata files remain to migrate.

## Key Files

- `scripts/graph/backfill-graph-metadata.ts`

## Out of Scope

- Removing the plaintext fallback from the parser (kept for forward compatibility).
- Modifying the JSON schema itself.
