---
title: "Deduplicate Graph Metadata Entities - Tasks"
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
