# Agent-3: Phase 2+3 Implementation Report

## Gap Analysis

| Task | Status | Notes |
|------|--------|-------|
| P2-1: FTS5 BM25 Upgrade | IMPLEMENTED | Created `sqlite-fts.ts` with weighted `bm25()` ranker. Cannot modify `hybrid-search.ts` (excluded). New module ready for delegation. |
| P2-2: Graph Weights CTE | IMPLEMENTED | Updated `causal-boost.ts` CTE with relation-type multipliers (supersedes 1.5x, contradicts 0.8x) and edge strength column. |
| P3-3: Synonym Expansion | ALREADY DONE | `query-expander.ts` has `expandQuery()` + `DOMAIN_VOCABULARY_MAP` + semantic bridge discovery from 003. |
| P3-4: Scatter-Gather | ALREADY DONE | `memory-search.ts:869-918` implements mode="deep" with `Promise.all(variants.map(...))`. |
| P3-5: Cross-Variant RRF | IMPLEMENTED | Added `fuseResultsCrossVariant()` to `rrf-fusion.ts` with +0.10 convergence bonus per cross-variant match. |

## Implemented Files

| File | Lines | Change |
|------|-------|--------|
| `lib/search/sqlite-fts.ts` | 1-130 (NEW) | FTS5 bm25() weighted search with per-column weights [10, 5, 1, 2] |
| `lib/search/causal-boost.ts` | 8-20, 74-117, 119-131, 237 | Relation-weight multipliers + CTE walk_score accumulation |
| `lib/search/rrf-fusion.ts` | 246-312, 321 | `fuseResultsCrossVariant()` for multi-dimensional variant fusion |
| `tests/sqlite-fts.vitest.ts` | 1-143 (NEW) | 12 tests for FTS5 BM25 search |
| `tests/unit-rrf-fusion.vitest.ts` | 8, 154-260 | 6 new cross-variant RRF tests |

## Test Results

41 tests passed (4 files): sqlite-fts (12), unit-rrf-fusion (15), query-expander (11), causal-boost (3).

## Blocker: hybrid-search.ts Integration

The FTS5 BM25 upgrade in `sqlite-fts.ts` is standalone. To replace the legacy `rank`-based query in `hybrid-search.ts:197-206`, that file needs modification (currently excluded from ownership). The new module exposes `fts5Bm25Search()` which can be called from `hybrid-search.ftsSearch()` as a drop-in replacement.
