---
title: "Retired Phase Plan: Normalize Legacy Graph Metadata Files"
status: complete
---

# Plan

## Approach

Retire this phase instead of extending it. The packet originally targeted the remaining plaintext `graph-metadata` corpus, but the final post-remediation verification for 019 now shows `legacyGraphMetadataFiles = 0`, so there is no remaining runtime migration work to schedule here.

## Retirement Criteria

1. Confirm the final corpus no longer contains plaintext `graph-metadata.json` files.
2. Preserve this phase as historical context only.
3. Keep the inclusive-default backfill regression coverage in place as historical verification of the earlier traversal change.

## Verification

- `cd .opencode/skill/system-spec-kit && node scripts/dist/graph/backfill-graph-metadata.js`
- Post-backfill corpus scan: `legacyGraphMetadataFiles = 0`
