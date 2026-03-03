# ARCH-1 Implementation Report: Stable Indexing API

**Status:** COMPLETE
**Date:** 2026-03-03

## Files Created (4)

| File | LOC | Purpose |
|------|-----|---------|
| `mcp_server/api/eval.ts` | 32 | Re-exports ablation, BM25 baseline, ground-truth, eval-db |
| `mcp_server/api/search.ts` | 22 | Re-exports hybrid search, FTS5, vectorIndex namespace |
| `mcp_server/api/providers.ts` | 8 | Re-exports generateQueryEmbedding |
| `mcp_server/api/index.ts` | 10 | Barrel: combines eval + search + providers |

## Consumer Scripts Migrated (2)

| Script | Before | After |
|--------|--------|-------|
| `scripts/evals/run-ablation.ts` | 5 deep `lib/` imports | 1 import from `../../mcp_server/api` |
| `scripts/evals/run-bm25-baseline.ts` | 4 deep `lib/` imports | 1 import from `../../mcp_server/api` |

## Verification

- **tsc --noEmit**: 0 non-TS6305 errors (TS6305 = stale dist/, pre-existing)
- **vitest --run**: 230/230 test files passed, 7079/7079 tests passed, 6 skipped
- No existing `lib/` files were modified (scope boundary respected)

## Design Notes

- `api/search.ts` uses `export * as vectorIndex` for namespace re-export, matching the consumer's `import * as vectorIndex` pattern
- `api/search.ts` re-exports `init as initHybridSearch` so consumers get the renamed import without local aliasing
- All API modules include JSDoc `@public` tags documenting their purpose as stable surfaces
