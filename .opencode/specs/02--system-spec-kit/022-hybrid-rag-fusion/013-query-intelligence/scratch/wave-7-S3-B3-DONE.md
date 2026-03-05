# Wave 7 — Sprint 3 T003b + T003c DONE

**Date:** 2026-02-27
**Tasks:** T003b (Quality Floor Enforcement & Flag Wiring) + T003c (Precision Verification)
**Status:** COMPLETE — all 19 tests pass, 0 regressions

---

## What Was Built

### T003b: `channel-enforcement.ts`

**File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts`

Pipeline-ready wrapper around `analyzeChannelRepresentation()` from `channel-representation.ts`.

Key decisions:

1. **`enforceChannelRepresentation(fusedResults, channelResultSets, topK?)`**
   - When the feature flag (`SPECKIT_CHANNEL_MIN_REP`) is disabled: passes results through with `enforcement.applied = false`, zero overhead.
   - When enabled: slices the top `topK` (default = all results) as the inspection window, delegates to `analyzeChannelRepresentation()`, re-sorts the window+promotions by score descending, then reassembles with the tail.
   - Returns `EnforcementResult` with `results` (full list, sorted) and `enforcement` metadata: `{ applied, promotedCount, underRepresentedChannels, channelCounts }`.

2. **Window / tail split:** Only the inspection window is passed to `analyzeChannelRepresentation`. Items beyond the window are appended untouched after re-sort. This prevents the tail from triggering false under-representation flags.

3. **Re-sort after promotion:** Promoted items are inserted into the window, then the window is sorted by score descending before the tail is concatenated. This preserves score ordering across the full result list.

4. **`channelCounts` in metadata:** Counts are computed over the full `finalResults` list (window + tail), not just the analysis window, so callers get an accurate picture of the returned set.

### T003c: `t028-channel-enforcement.vitest.ts`

**File:** `.opencode/skill/system-spec-kit/mcp_server/tests/t028-channel-enforcement.vitest.ts`

19 tests across three groups:

**T003b wrapper tests (T1–T5):**
- T1: enforcement applies when flag enabled and channel missing
- T2: enforcement does not apply when flag disabled
- T3: topK parameter limits inspection window
- T4: promoted results appear in results list with correct metadata
- T5: results remain sorted by score after enforcement

**T003c precision verification (T6–T11):**
- T6: all channels represented → top-3 identical before and after (0% precision loss)
- T7: one channel missing → original high-scoring items remain in top-3 (appended, not displaced)
- T8: promotions with lower scores are appended after top-3, not inserted (position verified)
- T9: quality floor (0.2) blocks low-score promotions from polluting results
- T10: multiple missing channels → each gets exactly 1 promotion
- T11: R15+R2 interaction — when router guarantees ≥2 channels and both appear in top-k, no enforcement triggered

**Edge cases (T12–T18 + sanity):**
- T12: empty fusedResults → no crash
- T13: single result → no crash
- T14: all channel result sets empty → no promotions
- T15: topK=0 → empty window, full tail returned intact (0 promotions)
- T16: topK > results.length → no out-of-bounds, full list inspected
- T17: promoted items carry original extra fields from channel result
- T18: channelCounts sums to results.length (accounting consistency)
- SANITY: QUALITY_FLOOR === 0.2 (re-export from channel-representation)

---

## Test Results

```
t028-channel-enforcement.vitest.ts  — 19/19 passed  (4ms)
t024-channel-representation.vitest.ts — 15/15 passed  (3ms)
```

No regressions in t024. `channel-representation.ts` and `hybrid-search.ts` were not modified.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Window/tail split | Prevents items beyond the window from skewing channel-count analysis |
| Re-sort after promotion | Callers receive a consistently ordered list; no sorting burden on callers |
| `channelCounts` over full list | Accurate picture for callers; consistent with t024 behaviour |
| `topK` defaults to `fusedResults.length` | Safe default: analyse the entire list when no window specified |
| `topK=0` returns 0 promotions | `analyzeChannelRepresentation` returns empty for empty topK; tail is returned intact |

---

## Precision Guarantee (R2)

The precision tests (T6–T8) confirm:
- When all channels are already represented, enforcement is a no-op (0% precision impact).
- When a channel is missing and its best result scores below the top-3, it is appended — the original top-3 positions are never displaced.
- The quality floor (0.2) is a hard gate; results below it cannot enter the result set via promotion regardless of channel representation.
- Multiple missing channels each get at most 1 promotion (1 per channel, not N items).
