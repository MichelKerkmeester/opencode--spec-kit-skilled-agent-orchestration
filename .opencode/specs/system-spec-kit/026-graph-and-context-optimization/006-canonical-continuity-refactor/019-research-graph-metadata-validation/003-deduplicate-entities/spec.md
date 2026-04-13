---
title: "Deduplicate Graph Metadata Entities"
status: complete
level: 2
type: implementation
parent: 019-research-graph-metadata-validation
created: 2026-04-12
---

# Deduplicate Graph Metadata Entities

## Scope

Add a basename-match check against existing canonical-path entries before inserting new entities into graph metadata. Currently 2,020 basename-only duplicates exist across 270 spec folders, inflating entity counts and degrading graph query precision.

## Key Files

- `mcp_server/lib/graph/graph-metadata-parser.ts` (lines 418-446)

## Out of Scope

- Merging metadata from duplicate entries (drop the duplicate, keep the canonical).
- Cross-folder entity deduplication.
