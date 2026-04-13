---
title: "Deduplicate Graph Metadata Entities - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Add `canonicalDocPaths` and a shared `upsertEntityByName(...)` helper inside `mcp_server/lib/graph/graph-metadata-parser.ts:418-446`, following `../research/research.md:282-287`.
- [ ] T-02: Replace the direct key-file `entities.set(...)` write in `mcp_server/lib/graph/graph-metadata-parser.ts:422-428` with the helper.
- [ ] T-03: Replace the extracted-entity `entities.set(...)` write in `mcp_server/lib/graph/graph-metadata-parser.ts:437-442` with the same helper so both write paths share the same collision policy.
- [ ] T-04: Make canonical packet-doc paths win over basename-only or non-canonical collisions, as required by `../research/research.md:279-289`.
- [ ] T-05: Add integration coverage for `spec.md` and `plan.md` collision cases, then confirm the phase reduces duplicate slots without changing the 16-entry cap semantics.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts`
