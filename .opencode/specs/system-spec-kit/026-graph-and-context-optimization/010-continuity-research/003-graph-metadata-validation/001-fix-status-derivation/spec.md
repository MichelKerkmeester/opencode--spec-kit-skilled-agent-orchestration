---
title: "Fix Graph Metadata Status Derivation"
status: complete
level: 2
type: implementation
parent: 003-graph-metadata-validation
created: 2026-04-12
---

# Fix Graph Metadata Status Derivation

## Scope

Update `deriveStatus()` to treat the presence of `implementation-summary.md` as a completion signal. Currently 259 spec folders show status "planned" despite being finished, because the derivation logic does not account for this artifact.

## Key Files

- `mcp_server/lib/graph/graph-metadata-parser.ts` (lines 346-353 and 498-510)

## Out of Scope

- Changing how status is persisted in `graph-metadata.json`.
- Retroactive backfill of existing metadata files (handled by 019/004).
