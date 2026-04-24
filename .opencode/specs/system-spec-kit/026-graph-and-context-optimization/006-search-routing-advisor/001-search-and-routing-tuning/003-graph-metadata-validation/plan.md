---
title: "...and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/plan]"
description: 'title: "Research: Graph Metadata Quality & Relationship Validation - Plan"'
trigger_phrases:
  - "and"
  - "context"
  - "optimization"
  - "006"
  - "search"
  - "plan"
  - "003"
  - "graph"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
status: complete
---
# Plan

## Approach

Close the five review findings in the graph-metadata parser and backfill lane, then re-run the workspace typechecks, focused regression suites, full-corpus backfill, and packet-closeout updates for phases `001` through `007`.

## Steps

1. Patch `graph-metadata-parser.ts` so `key_files`, entity path scoping, and status normalization match the reviewed runtime contract.
2. Update the backfill regression suite to the inclusive-default traversal behavior.
3. Rebuild the `mcp_server` and `scripts` workspaces, then run the focused Vitest coverage and the full `node scripts/dist/graph/backfill-graph-metadata.js` regeneration pass.
4. Confirm the final corpus returns `command-shaped key_files = 0`, `status outliers = 0`, `duplicateEntityNameGroups = 0`, and `legacyGraphMetadataFiles = 0`.
5. Refresh root `003` and phases `001` through `007` so their packet status and completed-item evidence match the repaired runtime state.

## Verification

- `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit`
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-schema.vitest.ts`
- `cd .opencode/skill/system-spec-kit && NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts`
- `cd .opencode/skill/system-spec-kit && node scripts/dist/graph/backfill-graph-metadata.js`
