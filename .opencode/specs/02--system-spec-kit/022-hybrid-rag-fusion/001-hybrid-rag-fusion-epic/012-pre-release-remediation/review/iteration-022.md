# Iteration 022 -- Wave 1 Indexing And Vector Storage

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** correctness, security
**Status:** complete
**Timestamp:** 2026-03-27T15:55:00+01:00

## Findings

- `HRF-DR-013 [P1]` Concurrent constitutional-cache warmup can transiently return empty constitutional results while the shared promise is still loading.
- `HRF-DR-014 [P1]` `initialize_db(custom_path)` bypasses embedding-dimension validation because the integrity check only runs on the default-path branch.
- `HRF-DR-015 [P2]` Folder-scoped constitutional cache invalidation deletes the wrong key shape and leaves suffixed cache entries behind.

## Evidence
- `lib/search/vector-index-store.ts:436-505,552-639,717-720`
- `lib/search/vector-index-queries.ts:214-280`
- `tests/vector-index-impl.vitest.ts:379-395,779-785`
- `tests/vector-index-schema-compatibility.vitest.ts`
- `tests/regression-010-index-large-files.vitest.ts`

## Next Adjustment
- Check whether session or shared-memory boundaries have a matching trust problem, or whether the vector-store issues stay localized to retrieval/indexing.
