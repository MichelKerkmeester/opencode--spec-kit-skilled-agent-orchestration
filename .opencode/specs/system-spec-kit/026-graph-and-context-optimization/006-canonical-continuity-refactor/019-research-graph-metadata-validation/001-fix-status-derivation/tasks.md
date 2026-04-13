---
title: "Fix Graph Metadata Status Derivation - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Preserve the override path in `mcp_server/lib/graph/graph-metadata-parser.ts:498-500` and the ranked frontmatter selection in `mcp_server/lib/graph/graph-metadata-parser.ts:503-509`.
- [ ] T-02: Add the checklist-aware fallback logic adjacent to `deriveStatus()` in `mcp_server/lib/graph/graph-metadata-parser.ts:498-510`, following the pseudocode in `../research/research.md:294-314`.
- [ ] T-03: Add or update parser coverage for `implementation-summary + COMPLETE checklist`, `implementation-summary + incomplete checklist`, and `implementation-summary + no checklist`.
- [ ] T-04: Re-run graph-metadata verification and confirm the phase fixes the `180 + 39` high-confidence subset without promoting the 63 incomplete-checklist folders identified in `../research/research.md:317-324`.
- [ ] T-05: Keep the phase scoped to status derivation only; do not fold in trigger-cap or other parser cleanups unless a test dependency forces it.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts`
