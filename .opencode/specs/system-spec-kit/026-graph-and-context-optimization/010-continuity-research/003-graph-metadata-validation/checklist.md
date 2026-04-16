---
title: "Research: Graph Metadata Quality & Relationship Validation - Checklist"
status: complete
---

# Verification Checklist: Graph Metadata Quality & Relationship Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## P1 (Should Fix)

- [x] Command-shaped `key_files` entries = 0 after tightened filter. [EVIDENCE: post-backfill corpus scan across `.opencode/specs/**/*.json` returned `0` command-shaped `derived.key_files` values]
- [x] Backfill test passes 3/3. [EVIDENCE: `NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts`]
- [x] Root 003 + sub-phases 001-007 status and closeout docs refreshed to match the repaired parser/runtime state. [EVIDENCE: root 003 closeout docs plus refreshed 001-007 packet statuses, completed checklist items, and the retired 004 closeout docs]

## P2 (Advisory)

- [x] Entity path matching scoped to prevent cross-packet attribution. [EVIDENCE: `deriveEntities()` now limits canonical packet-doc preference to the current spec folder chain and focused Vitest coverage keeps sibling packet paths from winning]
- [x] Status normalization catches all known variants (done, completed, active, in-progress). [EVIDENCE: post-backfill corpus scan returned `0` non-canonical derived statuses]
