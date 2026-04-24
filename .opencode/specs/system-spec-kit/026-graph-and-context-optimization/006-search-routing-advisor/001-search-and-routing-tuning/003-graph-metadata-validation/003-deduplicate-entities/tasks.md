---
title: "...06-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities/tasks]"
description: 'title: "Deduplicate Graph Metadata Entities - Tasks"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "tasks"
  - "003"
  - "deduplicate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
status: complete
---
# Tasks
- [x] T-01: Add a shared `upsertEntityByName(...)` helper and canonical-path preference inside `mcp_server/lib/graph/graph-metadata-parser.ts`.
- [x] T-02: Replace the direct key-file `entities.set(...)` write with the helper so basename seeding no longer reserves duplicate slots.
- [x] T-03: Replace the extracted-entity `entities.set(...)` write with the same helper so both write paths share the collision policy.
- [x] T-04: Make canonical packet-doc paths beat basename-only duplicates and path-like canonical references beat plain basenames when names normalize to the same key.
- [x] T-05: Add coverage for `spec.md` and `plan.md` collision cases in `mcp_server/tests/graph-metadata-schema.vitest.ts` while preserving the 16-entity cap behavior.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
