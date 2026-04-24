---
title: "...6-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files/plan]"
description: 'title: "Retired Phase Plan: Normalize Legacy Graph Metadata Files"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "plan"
  - "004"
  - "normalize"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
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
