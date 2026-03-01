# Review 5: Remaining Files + Integration Tests

Files reviewed:
- `lib/search/context-budget.ts` (~147 LOC)
- `lib/search/fsrs.ts` (~85 LOC)
- `tests/integration-138-pipeline.vitest.ts` (~503 LOC)
- `tests/graph-regression-flag-off.vitest.ts` (~327 LOC)

---

## P0 Violations Found and Fixed

### 1. `// @ts-nocheck` in both test files (FIXED)

**Files:** `integration-138-pipeline.vitest.ts` line 1, `graph-regression-flag-off.vitest.ts` line 1

`@ts-nocheck` is equivalent to commented-out type safety — it suppresses all TS errors across the entire file. Running `tsc --noEmit --strict` confirmed:
- `integration-138-pipeline.vitest.ts` had 1 real hidden error
- `graph-regression-flag-off.vitest.ts` had 4 real hidden errors

**Fix:** Removed both `// @ts-nocheck` directives, then resolved the real errors exposed.

### 2. Real TS errors exposed after `@ts-nocheck` removal (FIXED)

**`integration-138-pipeline.vitest.ts` line 108:**
- `MMRCandidate.content` is `string | undefined`; `SearchResult.content` requires `string`
- Fix: added `content: sel.content ?? ''` in the fallback spread

**`graph-regression-flag-off.vitest.ts` lines 152, 162, 200, 211, 251:**
- `vi.fn()` returns `Mock<Procedure | Constructable>`, not assignable to `GraphSearchFn`
- Fix: imported `GraphSearchFn` type and cast via `graphFnSpy as unknown as GraphSearchFn`

---

## P1 Issues

### 3. T5 silent conditional assertion (FIXED)

**File:** `integration-138-pipeline.vitest.ts` lines 220-228

Original test only asserted `expect(payload).toContain(...)` inside `if (evidenceGapDetected)`. If gap is not detected, the test body does nothing and silently passes — a vacuous truth.

**Fix:** Added the `else` branch: `expect(response.payload).not.toContain('EVIDENCE GAP DETECTED')` so the test always makes a meaningful assertion regardless of which path is taken.

### 4. Missing T022-2 label in env-var suite (NOTE added, not a logic error)

**File:** `graph-regression-flag-off.vitest.ts` — the flag-reading `describe` group jumps from T022-1 to T022-3. T022-2 actually lives in the nested `describe('T022-2: hybridSearch ...')` group.

**Fix:** Added clarifying comment above T022-3 to explain the numbering gap.

---

## Test Quality Observations

**Isolation:** Both test files are well-isolated. `afterEach` cleans `process.env.SPECKIT_GRAPH_UNIFIED` in every group that sets it. `vi.restoreAllMocks()` called in afterEach. `resetGraphMetrics()` called in beforeEach for the metrics group. No shared mutable state across tests.

**Mock quality:** `buildStubDb()` is a clean, typed helper with full coverage of `prepare().get/all/run` contract. After the `GraphSearchFn` cast fix, all mocks are properly typed.

**No `.skip` or `.only`:** Confirmed absent in both files.

**Positive controls:** `graph-regression-flag-off.vitest.ts` includes deliberate positive controls (T022-2d, T022-2e-wired) that verify the graph path DOES fire when wired — prevents false positives from "spy never called" tests that would pass even if the feature was broken.

**Test descriptions:** Clear and specific. IDs (T022-1, T022-3, etc.) are self-documenting.

---

## Mathematical Safety (FSRS Bounds, Budget Calculations)

**`fsrs.ts` — `computeStructuralFreshness`:**
- Both `stability` and `centrality` inputs are clamped to [0, 1] via `Math.min(1, Math.max(0, x))`
- Output is `s * c` where both are in [0, 1] — output is guaranteed in [0, 1]
- No NaN risk: inputs are numbers (TypeScript enforces this), no division

**`fsrs.ts` — `computeGraphCentrality`:**
- Division-by-zero guarded at line 73: `if (totalNodes < 2) return 0`
- Result clamped to [0, 1] at line 84 to guard against edge-list duplication
- No NaN risk: `totalNodes` is always a positive integer from `Map.size`

**Note on TIER_MULTIPLIER:** The checklist item for `TIER_MULTIPLIER` does not apply — `fsrs.ts` does not implement tier multipliers. The module computes structural freshness from stability + centrality only. This is correct per the module's header comment.

**`context-budget.ts` — `estimateTokens`:**
- Returns 0 for empty/absent content — no division-by-zero
- `Math.ceil(content.length / 4)` — always a positive integer
- Budget accumulation stops before exceeding limit (line 138: `>` not `>=`), so a single zero-token result would still be included (correct — empty result costs nothing)

---

## Summary

| File | P0 Fixes | P1 Fixes | Status |
|------|----------|----------|--------|
| `context-budget.ts` | 0 | 0 | PASS |
| `fsrs.ts` | 0 | 0 | PASS |
| `integration-138-pipeline.vitest.ts` | 2 (ts-nocheck + hidden TS error + T5 assertion) | 1 | FIXED |
| `graph-regression-flag-off.vitest.ts` | 2 (ts-nocheck + 4 type errors) | 1 (label comment) | FIXED |
