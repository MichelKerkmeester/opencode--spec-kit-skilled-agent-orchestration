---
title: "...006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities/plan]"
description: 'title: "Deduplicate Graph Metadata Entities - Execution Plan"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "plan"
  - "003"
  - "deduplicate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
parent_spec: 003-deduplicate-entities/spec.md
status: complete
---
# Execution Plan
## Approach
This phase fixes duplicate entity slots inside `deriveEntities()` by replacing the current two direct `entities.set(...)` writes with a shared name-based upsert helper. The research showed the duplicate waste happens during key-file seeding first, so the canonical-path preference must exist before the extracted-entity loop runs.

The implementation should keep dedup local to a single packet's entity list. It should not attempt cross-folder entity merging, and it should prefer canonical packet-doc paths over non-canonical collisions when both names normalize to the same entity key.

## Steps
1. Add `canonicalDocPaths` and a local `upsertEntityByName(...)` helper inside `mcp_server/lib/graph/graph-metadata-parser.ts:418-446`, following the implementation-ready shape in `../research/research.md:272-289,360-363`.
2. Replace the direct key-file write at `mcp_server/lib/graph/graph-metadata-parser.ts:422-428` and the extracted-entity write at `mcp_server/lib/graph/graph-metadata-parser.ts:437-442` with the shared helper.
3. Make the helper prefer canonical packet-doc paths when a collision exists between a canonical path and a non-canonical or basename-only path, matching `../research/research.md:282-289`.
4. Add integration coverage for `spec.md` / canonical-path collisions and extracted-entity collisions, then confirm the phase reduces duplicate slots without changing the 16-entity cap behavior.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts`.
- Re-run graph-metadata verification and confirm canonical packet-doc paths win when duplicate entity names collide.

## Risks
- Adding the helper only to the extracted-entity loop would leave most duplicate slots untouched because the waste starts during key-file seeding.
- Keeping first-write-wins semantics would preserve basename noise instead of the canonical packet path the graph actually needs.
- Expanding the phase into cross-folder dedup would go beyond the research-backed scope and complicate the entity contract.
