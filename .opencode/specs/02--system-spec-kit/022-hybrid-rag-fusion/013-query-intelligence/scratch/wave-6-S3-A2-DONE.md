# Wave 6 — Sprint 3, Task T002a: RSF Single-Pair Variant (Foundation)

**Status:** COMPLETE
**Date:** 2026-02-27
**Test result:** 40/40 passed (vitest v4.0.18, 6ms test execution)

---

## Files Created

1. **`mcp_server/lib/search/rsf-fusion.ts`** — RSF fusion module (single-pair variant)
2. **`mcp_server/tests/t023-rsf-fusion.vitest.ts`** — Comprehensive test suite (40 tests)

## Implementation Summary

### rsf-fusion.ts

**Exports:**
- `fuseResultsRsf(listA: RankedList, listB: RankedList): RsfResult[]` — Core single-pair RSF fusion
- `isRsfEnabled(): boolean` — Feature flag check (`SPECKIT_RSF_FUSION` env var, opt-in, defaults to `false`)
- `extractScore(item, rank, total): number` — Score extraction helper (score > similarity > rank-based fallback)
- `minMaxNormalize(value, min, max): number` — Min-max normalization (returns 1.0 when max === min)
- `clamp01(value): number` — Clamp to [0, 1]

**Types:**
- `RsfResult` — Extends `RrfItem` with `rsfScore`, `sources`, `sourceScores`

**Imports from rrf-fusion.ts:** `RrfItem`, `RankedList` (types only, no code modification)

### RSF Algorithm (as implemented)

1. Extract raw scores from each item (checking `score`, then `similarity`, then rank-based fallback)
2. Compute min/max per source list
3. Min-max normalize each item's score within its source
4. Items in both lists: `fusedScore = (normalizedA + normalizedB) / 2`
5. Items in one list only: `fusedScore = normalizedScore * 0.5` (single-source penalty)
6. Sort descending by `rsfScore`
7. All scores clamped to [0, 1]

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| Score extraction order: `score` > `similarity` > rank-based | Matches existing field names in the codebase; rank-based fallback ensures graceful degradation |
| Single item in list normalizes to 1.0 | When max === min, the item is the "best" in its source |
| Feature flag defaults to `false` (opt-in) | RSF is new and runs in shadow mode initially; explicit opt-in via `SPECKIT_RSF_FUSION=true` |
| Property merge: A takes precedence over B | Consistent with list ordering (A is typically the primary source) |
| Rank-based fallback: `1 - rank/total` | Simple linear decay; top item gets ~1.0, last item gets ~0.0 |

### Test Coverage (40 tests across 15 describe blocks)

| Test Group | Count | Coverage |
|------------|-------|----------|
| T023.1: Basic 2-list fusion | 3 | Non-empty, includes both, shape validation |
| T023.2: Overlapping items | 4 | Both sources listed, averaged scores, mid-range, sourceScores |
| T023.3: Single-source penalty | 3 | A-only penalty, B-only penalty, overlap beats single |
| T023.4: Score clamping | 2 | Normal range, extreme values |
| T023.5: Sort order | 1 | Descending by rsfScore |
| T023.6: Empty lists | 3 | Both empty, A empty, B empty |
| T023.7: Single-item lists | 3 | No overlap, overlap, one empty |
| T023.8: All-same-scores | 3 | A same, both same no overlap, both same with overlap |
| T023.9: Feature flag | 5 | Not set, true, false, empty, function works regardless |
| T023.10: Rank-based fallback | 5 | No score fields, prefers score, similarity fallback, rank calc, single item |
| T023.11: Helper functions | 3 | minMaxNormalize, max===min, clamp01 |
| T023.12: String IDs | 1 | String ID handling |
| T023.13: Large lists | 1 | 100 items per list (150 total) |
| T023.14: Properties preserved | 2 | Extra props, merge precedence |
| T023.15: Detailed computation | 1 | Full hand-computed verification |

### Acceptance Criteria Verification

- [x] Single-pair RSF produces valid fused ranking — verified by T023.1, T023.5, T023.15
- [x] Output clamped to [0, 1] — verified by T023.4
- [x] Feature flag `SPECKIT_RSF_FUSION` — verified by T023.9
- [x] Imports types from rrf-fusion.ts without modifying it — verified by file inspection
- [x] New file rsf-fusion.ts created — verified
- [x] All 40 tests pass — verified
