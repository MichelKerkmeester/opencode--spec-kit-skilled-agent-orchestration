# Audit H-05: mcp_server/lib/search/ (S-Z) + pipeline/

**Agent:** Codex GPT-5.4 xhigh (read-only)
**Scope:** 22 files in `mcp_server/lib/search/` (search-flags through vector-index) + `pipeline/`
**Date:** 2026-03-08

## Per-File Results

| File | P0 | P1 | Issues |
|------|----|----|--------|
| search-flags.ts | FAIL (header) | PASS | 1 |
| search-types.ts | PASS | FAIL (Record param instead of named interface) | 1 |
| session-boost.ts | PASS | PASS | 0 |
| spec-folder-hierarchy.ts | PASS | FAIL (missing TSDoc; non-null assertions @90,116) | 4 |
| sqlite-fts.ts | FAIL (header) | FAIL (bare catch @132) | 2 |
| tfidf-summarizer.ts | FAIL (header) | PASS | 1 |
| validation-metadata.ts | FAIL (header) | PASS | 1 |
| vector-index-aliases.ts | PASS | FAIL (missing return types 8x; missing TSDoc 9x; Record params @174,181,346; catch lacks instanceof @234,276,317,336) | 24 |
| vector-index-impl.ts | FAIL (header) | PASS | 1 |
| vector-index-mutations.ts | PASS | FAIL (missing return types 8x; missing TSDoc 8x; type alias params @64,154,221; catch lacks unknown @353,357,374; catch lacks instanceof @340,418,430,448,472,493) | 28 |
| vector-index-queries.ts | PASS | FAIL (missing TSDoc 25x; missing return types 10x; type alias params 10x; catch lacks instanceof 8x) | 53 |
| vector-index-schema.ts | PASS | FAIL (missing return types 8x; missing TSDoc 7x; inline object param @1097; 66 catch blocks lack instanceof) | 82 |
| vector-index-store.ts | PASS | FAIL (missing return types 11x; missing TSDoc 17x; inline obj param @571; catch lacks instanceof 8x) | 37 |
| vector-index-types.ts | PASS | FAIL (missing TSDoc on 5 interfaces + 4 functions) | 9 |
| vector-index.ts | FAIL (header) | PASS | 1 |
| pipeline/index.ts | FAIL (header) | PASS | 1 |
| pipeline/orchestrator.ts | FAIL (header) | PASS | 1 |
| pipeline/stage1-candidate-gen.ts | FAIL (header) | PASS | 1 |
| pipeline/stage2-fusion.ts | FAIL (header) | FAIL (bare catch @343) | 2 |
| pipeline/stage3-rerank.ts | FAIL (header) | FAIL (catch lacks instanceof @196,311,361,571) | 5 |
| pipeline/stage4-filter.ts | FAIL (header) | PASS | 1 |
| pipeline/types.ts | FAIL (header) | FAIL (missing TSDoc on 9 interfaces) | 10 |

## Summary

- **Files scanned:** 22
- **P0 issues:** 13 (all missing/invalid file headers)
- **P1 issues:** 253 (vector-index-* files account for ~80% due to large export surface)
- **Top 3 worst:** vector-index-schema.ts (82), vector-index-queries.ts (53), vector-index-store.ts (37)

## Key Pattern

The `vector-index-*.ts` files use `snake_case` function names (legacy SQLite naming convention) which is a stylistic deviation but not flagged under the provided P0/P1 checklists. These files also have the highest P1 issue density due to their large public API surface with minimal TSDoc.
