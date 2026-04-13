---
title: "Retired: Normalize Legacy Graph Metadata Files"
status: complete
level: 2
type: implementation
parent: 003-graph-metadata-validation
created: 2026-04-12
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
