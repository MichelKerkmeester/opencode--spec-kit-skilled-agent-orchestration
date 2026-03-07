# Tasks

## Implementation

- [x] Build dependency graph from all 241 source files
- [x] Create feature-to-entry-point mapping for all 156 features
- [x] Compute transitive closures via BFS
- [x] Match test files by name pattern (244 test files)
- [x] Generate Source Files sections with Implementation + Tests tables
- [x] Patch all 156 per-feature snippet files
- [x] Patch monolithic feature_catalog.md (1,599 → 12,254 lines)
- [x] Fix monolith heading hierarchy (## → ####, ### → #####)

## Verification

- [x] Every snippet has exactly 3 `##` sections: Current Reality, Source Files, Source Metadata
- [x] 140 features have `### Implementation` and `### Tests` sub-sections
- [x] 16 special cases handled correctly (governance, decisions, flag refs, meta, deferred)
- [x] All file paths with `mcp_server/` or `shared/` prefix exist in source tree
- [x] Layer column values from allowed set (Handler, Lib, Core, Shared, Hook, Formatter, Schema, API, Util)
- [x] Section order preserved: Current Reality → Source Files → Source Metadata
- [x] Monolith heading hierarchy: #### Source Files → ##### Implementation/Tests
- [x] 3 features legitimately have no Tests section (no matching test files)
