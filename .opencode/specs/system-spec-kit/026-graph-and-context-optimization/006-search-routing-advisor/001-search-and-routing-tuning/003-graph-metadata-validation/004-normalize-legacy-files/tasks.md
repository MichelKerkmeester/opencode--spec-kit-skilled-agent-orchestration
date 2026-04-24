---
title: "...-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files/tasks]"
description: 'title: "Normalize Legacy Graph Metadata Files - Tasks"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "tasks"
  - "004"
  - "normalize"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
status: complete
---
# Tasks
- [x] T-01: Add an active-only traversal mode to `scripts/graph/backfill-graph-metadata.ts` so archive and future folders are skipped by default during graph-metadata backfills.
- [x] T-02: Expose explicit CLI controls with `--active-only` and `--include-archive` so operators can opt into the wider traversal only when they mean to.
- [x] T-03: Add regression coverage in `scripts/tests/graph-metadata-backfill.vitest.ts` proving the default traversal skips archived packets and the include-archive path restores full coverage.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit && NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts`
- [x] T-V3: `node scripts/dist/graph/backfill-graph-metadata.js --active-only`
