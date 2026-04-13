---
title: "Normalize Legacy Graph Metadata Files"
status: planned
level: 2
type: implementation
parent: 019-research-graph-metadata-validation
created: 2026-04-12
---

# Normalize Legacy Graph Metadata Files

## Scope

Convert the 35 remaining text-format `graph-metadata` files to canonical JSON format. These files still load via the parser's plaintext fallback path but produce weaker timestamps and incomplete entity coverage compared to JSON-format files.

## Key Files

- `scripts/graph/backfill-graph-metadata.ts`

## Out of Scope

- Removing the plaintext fallback from the parser (kept for forward compatibility).
- Modifying the JSON schema itself.
