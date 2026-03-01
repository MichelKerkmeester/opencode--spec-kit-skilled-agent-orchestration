# Review 4 — Algorithm Files (mmr-reranker, evidence-gap-detector, query-expander)

Reviewer: leaf agent (depth 1)
Files reviewed:
- `lib/search/mmr-reranker.ts`
- `lib/search/evidence-gap-detector.ts`
- `lib/search/query-expander.ts`
- `tests/mmr-reranker.vitest.ts` (exists)
- `tests/evidence-gap-detector.vitest.ts` (exists)

---

## P0 Violations Found and Fixed

None. All three source files pass all P0 checks:
- Box headers present in all files
- No `any` in any public API signature
- All types/interfaces use PascalCase (`MMRCandidate`, `MMRConfig`, `SkillGraphLike`, `TRMResult`, `GraphCoverageResult`, `GraphNodeLike`, `GraphEdgeLike`)
- No commented-out code blocks
- WHY comments present for all complex algorithm sections:
  - MMR O(N²) inner loop: comment at line 175 "N-cap: only process top-N candidates to bound O(N²) complexity"
  - Graph-guided diversity blend formula: comment block lines 199-201
  - BFS distance: TSDoc explains traversal + MAX_DIST fallback (lines 77-86)
  - Z-score stdDev=0 guard: comment at line 169 of evidence-gap-detector.ts

---

## P1 Issues

### FIXED — mmr-reranker.ts: lambda parameter had no bounds enforcement

**Before:** `lambda` was destructured directly from config with no validation. A caller passing `lambda: 2.0` or `lambda: -0.5` would invert the MMR scoring formula, producing nonsensical results with no error.

**After:** Lambda is clamped to [0, 1] with a WHY comment before use:
```typescript
// Clamp lambda to [0, 1] to guard against caller mistakes.
// Values outside this range invert relevance or diversity weighting.
const lambda = Math.max(0, Math.min(1, rawLambda));
```
Applied to: `applyMMR()` body, lines 159-169 of mmr-reranker.ts.

### OK — query-expander.ts: getNodeName return type

`getNodeName` at line 168 already carries an explicit `: string | null` return type. No fix needed.

### OK — All exports have TSDoc

All exported functions and interfaces have TSDoc blocks with `@param` and `@returns` annotations.

### OK — Non-null assertion in applyMMR line 207

`graphDistanceFn!(pool[i].id, sel.id)` — the `!` is justified: the guard `useGraphMMR = isGraphMMREnabled() && typeof graphDistanceFn === 'function'` ensures the function is present when this branch is reached. Acceptable.

---

## Algorithm Correctness

### MMR (mmr-reranker.ts)
- N=20 hardcap: enforced via `candidates.slice(0, maxCandidates)` with `DEFAULT_MAX_CANDIDATES = 20`. Correct.
- Lambda [0,1]: now enforced via clamp (fix applied above).
- BFS distance: returns integer in [0, MAX_DIST]; unreachable nodes default to MAX_DIST (10). Correct.
- Graph-guided blend formula: `alpha * cosine + (1-alpha) * (1 - dist/MAX_DIST)`. Division `dist / MAX_DIST` where MAX_DIST=10 (never zero). Safe.

### Evidence Gap Detector (evidence-gap-detector.ts)
- Z-score threshold: `Z_SCORE_THRESHOLD = 1.5` is exported as a named constant; consumers can import and compare. Well-documented.
- Division by zero (stdDev=0): guarded at line 170: `stdDev === 0 ? 0 : (topScore - mean) / stdDev`. Correct.
- Single-score edge case: handled separately at lines 152-161, falls back to absolute threshold. Correct.
- Empty array: returns `{ gapDetected: true, zScore: 0, mean: 0, stdDev: 0 }`. Correct.

### Query Expander (query-expander.ts)
- Max 3 variants: `MAX_VARIANTS = 3` enforced in `expandQuery` (lines 74, 83) and `expandQueryWithBridges` (lines 153, 165). Correct.
- Regex safety in `expandQuery`/`expandQueryWithBridges`: uses `\\b${word}\\b` where `word` comes from `\b\w+\b` match (alphanumeric only) — no regex injection risk.

---

## Security / Safety

| Check | Status |
|---|---|
| Division by zero in cosine similarity | Handled: `denom === 0 ? 0` (line 139 mmr-reranker.ts) |
| Division by zero in Z-score | Handled: `stdDev === 0 ? 0` (line 170 evidence-gap-detector.ts) |
| Lambda bounds | Fixed: clamped to [0,1] |
| N=20 hardcap | Enforced via slice |
| Max 3 query variants | Enforced via Set size check + final slice |
| BFS depth bound | MAX_DIST=10 prevents infinite traversal |
| Regex injection in word replacement | Safe: words extracted via `\b\w+\b` (alphanumeric only) |

---

## Test Coverage Assessment

### mmr-reranker.vitest.ts — EXISTS, comprehensive
11 tests covering: dedup (T1), lambda diversity (T2), lambda relevance (T3), N-cap (T4), performance O(N²) (T5), limit enforcement (T6), empty input (T7), single candidate (T8), cosine correctness (T9), zero-vector (T10), determinism (T11). No test for out-of-bounds lambda (now safe due to clamp).

### evidence-gap-detector.vitest.ts — EXISTS, comprehensive
12 tests covering: high Z no-gap (T1), flat distribution gap (T2), identical scores (T3), empty array (T4), single high (T5), single low (T6), Z boundary (T7), absolute minimum (T8), math correctness (T9), warning format (T10), performance (T11), negative scores (T12).

No tests exist for `predictGraphCoverage` (graph coverage path), which is guarded by feature flag — low risk but worth noting.
