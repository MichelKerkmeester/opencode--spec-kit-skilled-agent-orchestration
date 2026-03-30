# Review 001: Stage 4 State Filtering
## Dimension: Correctness & Observability

Scope reviewed:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts`
- `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js`

Verification run:
- `npx vitest run tests/pipeline-v2.vitest.ts tests/evidence-gap-detector.vitest.ts tests/integration-138-pipeline.vitest.ts`

## Findings (P0/P1/P2 with file:line citations)

### P0 - Unknown or missing state is treated as below every non-empty `minState`, so upstream state loss can collapse valid results to zero

`UNKNOWN_STATE_PRIORITY` is `0`, `resolveStateForFiltering()` maps absent or invalid `memoryState` values to `UNKNOWN`, and `filterByMemoryState()` then keeps only rows whose priority is `>= minPriority`. That means any configured `minState` above the unknown fallback drops those rows outright, even when the row itself is otherwise valid and highly ranked. There is no "state unavailable" bypass or guard in Stage 4. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:76-77`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:87-94`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:143-158`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:67-68`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:76-82`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:99-113`.

That is especially risky because `memoryState` is optional in the pipeline types, so Stage 4 is knowingly operating on metadata that may be absent. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:28`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:89`.

There is also no defensive guard for a missing `memory_state` column or failed upstream hydration path. The only explicit hydration path visible here is the Stage 2 community backfill, and that path downgrades failures to a warning instead of changing Stage 4 behavior. If schema drift or a degraded query path leaves `memoryState` unset, Stage 4 still turns those rows into `UNKNOWN` and filters them away. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:846-865`.

The current test suite intentionally locks this behavior in: missing, invalid, and even all-missing state rows are expected to disappear when `minState` is `WARM`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:209-260`.

Impact: valid retrieval hits can vanish entirely because state metadata was unavailable, not because the hits were actually below the requested threshold.

### P1 - Filter removals are mostly silent; operators get counts, but not actionable reasons for why results vanished

`filterByMemoryState()` only returns `statsBefore`, `statsAfter`, and `removedCount`. It does not record which rows were dropped because they were `UNKNOWN`, which were below `minState`, or which were discarded by per-tier caps. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:146-191`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:102-141`.

The per-tier limit branch explicitly notes that rows above the cap are "silently dropped". Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:160-178`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:114-129`.

`executeStage4()` does surface aggregate counts in `annotations.stateStats` and a coarse trace entry, but there is no dedicated warning when all rows are removed, when `UNKNOWN` rows were present, or when the filter likely ran without trustworthy state metadata. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:281-297`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:318-329`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:214-252`.

Impact: operators can tell filtering happened, but they cannot quickly tell whether the result loss came from actual state policy, a missing column, invalid state values, or per-tier caps.

### P1 - `verifyScoreInvariant()` is a useful narrow guard, but it does not enforce the full invariant described by the Stage 4 module contract

The module header says Stage 4 must preserve ordering and only filter rows without mutating scores. The runtime invariant check, however, builds a map by `id` and compares only the captured score fields for rows that still exist after filtering. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:6-19`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:243-249`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:308-314`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:387-431`.

That means it will catch direct score-field mutation on surviving rows, but it will not catch survivor reordering, row substitution that reuses the same `id` and score fields, or removal/reinsertion patterns that leave the compared score values unchanged. The existing tests only cover the narrow cases of unchanged scores, filtered-out rows, and direct field mutation. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:108-158`.

Impact: the runtime assertion is helpful, but the name and surrounding comments overstate its coverage. It does not fully prove the Stage 4 contract.

### P1 - TRM evidence-gap reporting on an empty post-filter result set is mathematically consistent but operationally misleading

`detectEvidenceGap([])` hard-codes `gapDetected: true` with `zScore: 0`, and the formatter turns that into the same low-confidence warning used for real flat-score distributions. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:137-145`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:190-191`.

Stage 4 runs TRM after filtering, so if the state filter removes everything, operators get an evidence-gap warning with `Z=0.00` even though the more important cause is that Stage 4 produced an empty set. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:261-276`, `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js:198-213`.

The tests confirm this empty-array behavior is deliberate today. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:52-60`, `.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:397-401`.

Impact: in the failure mode above, TRM points operators at "low mathematical confidence" instead of the more actionable "all results were removed by state filtering".

## Recommendations

1. Separate "unknown or unavailable state" from "known low-priority state". If `memoryState` is absent for all or most rows, bypass state filtering, degrade to a safe fallback such as `ARCHIVED`, or emit a hard warning that state-based filtering is unsafe for this batch.
2. Add explicit observability for removal reasons: counts for `unknownState`, `belowMinState`, and `stateLimit`, plus a dedicated warning when `removedCount === results.length`.
3. Strengthen the invariant check to snapshot survivor order and retained-id sequence, not just score fields, and add tests for reorder and same-id substitution cases.
4. Skip TRM when `workingResults.length === 0`, or replace the generic `Z=0.00` warning with a specific "no results remained after Stage 4 filtering" annotation.
5. If `dist/` is a checked-in runtime artifact, rebuild and keep `.opencode/skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage4-filter.js` aligned with any source-side remediation.
