---
title: Verification Agent 3 — Query Intelligence (Features 33-38)
reviewer: The Reviewer (read-only)
date: 2026-03-01
scope: Features 33, 34, 35, 36, 37, 38
confidence: HIGH
---

# Focused File Review: Query Intelligence (Features 33-38)

## Review Scope

| File | Lines | Focus |
|------|-------|-------|
| `lib/search/query-classifier.ts` | 220 | Feature 33 — complexity thresholds |
| `lib/search/query-router.ts` | 164 | Feature 33 — channel routing |
| `lib/search/rsf-fusion.ts` | 397 | Feature 34 — RSF variant |
| `lib/search/channel-representation.ts` | 198 | Feature 35 — min-rep guarantee |
| `lib/search/channel-enforcement.ts` | 138 | Feature 35 — pipeline wrapper |
| `lib/search/confidence-truncation.ts` | 230 | Feature 36 — 2x median gap logic |
| `lib/search/dynamic-token-budget.ts` | 107 | Feature 37 — budget allocation |
| `lib/search/hybrid-search.ts` | ~900 | All — routing integration |
| `lib/search/intent-classifier.ts` | 597 | Supporting — intent routing |
| `lib/search/embedding-expansion.ts` | 296 | Feature 38 — query expansion |
| `lib/search/query-expander.ts` | 89 | Feature 38 — synonym expansion |

---

## Feature Summary

### Feature 33: PASS

Router thresholds are correctly implemented. Classification boundaries match the spec:
- Simple: ≤ 3 terms OR trigger phrase match (`query-classifier.ts:173`)
- Complex: > 8 terms AND no trigger match (`query-classifier.ts:175`)
- Moderate: everything in between (`query-classifier.ts:177`)

Channel mapping is correct per spec (`query-router.ts:54-58`):
- `simple` → `['vector', 'fts']`
- `moderate` → `['vector', 'fts', 'bm25']`
- `complex` → `['vector', 'fts', 'bm25', 'graph', 'degree']`

The minimum 2-channel invariant is enforced (`query-router.ts:39,69-83`).

Feature flag disabled path returns "complex" as safe fallback with full pipeline (`query-classifier.ts:152-155`, `query-router.ts:124-130`).

One Important issue noted (see issues section).

### Feature 34: PASS

RSF fusion is correctly implemented across three variants:
- Single-pair `fuseResultsRsf`: per-source min-max normalisation, average for dual-hit, 0.5x penalty for single-source (`rsf-fusion.ts:85-172`)
- Multi-list `fuseResultsRsfMulti`: proportional `countPresent / totalSources` penalty (`rsf-fusion.ts:190-273`)
- Cross-variant `fuseResultsRsfCrossVariant`: +0.10 bonus per additional variant (`rsf-fusion.ts:290-382`)

All three variants clamp output to [0, 1]. Empty list edge cases handled. The `extractScore` fallback chain (score → similarity → rank-based) is correct. Per Sprint 8 update, the dead RSF branch in `hybrid-search.ts` was removed; module exists for future activation.

One Minor issue noted (see issues section).

### Feature 35: PASS

Channel min-representation guarantee is correctly implemented:
- `analyzeChannelRepresentation` counts both `source` and `sources[]` fields (`channel-representation.ts:116-124`)
- Only channels that actually returned results are checked — no phantom penalties (`channel-representation.ts:128-133`)
- `QUALITY_FLOOR = 0.005` correctly accounts for raw RRF score ranges (`channel-representation.ts:9`)
- Promoted items are appended then globally re-sorted (`channel-enforcement.ts:109-110`)
- Feature flag disabled path passes through unchanged (`channel-enforcement.ts:88-98`)

One Minor issue noted (see issues section).

### Feature 36: PASS

Confidence-based truncation implements the 2x median gap specification correctly:
- Gaps computed as consecutive descending differences (`confidence-truncation.ts:66-69`)
- Median computed correctly including even/odd length handling (`confidence-truncation.ts:80-87`)
- `GAP_THRESHOLD_MULTIPLIER = 2` matches spec (`confidence-truncation.ts:35`)
- Search starts at `minResults - 1` index, guaranteeing minimum results (`confidence-truncation.ts:175`)
- NaN/Infinity scores filtered before gap computation (`confidence-truncation.ts:63`, `118`)
- Zero-median guard (all equal scores) passes through unchanged (`confidence-truncation.ts:157-167`)
- Feature flag disabled path correctly passes through (`confidence-truncation.ts:126-136`)

No issues found. Implementation is complete and correct.

### Feature 37: PASS

Dynamic token budget allocation is correctly implemented:
- Budget tiers match spec: simple 1500, moderate 2500, complex 4000 (`dynamic-token-budget.ts:33-37`)
- Feature flag disabled path returns `DEFAULT_BUDGET = 4000` with `applied: false` (`dynamic-token-budget.ts:74-79`)
- Budget is computed early in the `hybridSearchEnhanced` pipeline before channel execution (`hybrid-search.ts:539`)
- Custom config support via optional parameter (`dynamic-token-budget.ts:69-90`)

One Minor issue noted (see issues section).

### Feature 38: PASS with Reservations

Embedding-based query expansion is correctly implemented with proper guard conditions:
- Feature flag guard checked first (`embedding-expansion.ts:183`)
- R15 mutual exclusion: "simple" tier suppresses expansion (`embedding-expansion.ts:192-195`)
- Empty embedding guard (`embedding-expansion.ts:197-200`)
- No candidate guard (`embedding-expansion.ts:217-219`)
- Stop-word filter and minimum token length enforced in `extractTermsFromContents` (`embedding-expansion.ts:131-133`)
- Duplicates prevented by `queryTokens` set exclusion (`embedding-expansion.ts:243-247`)
- All errors caught; identity result returned on failure (`embedding-expansion.ts:266-269`)

The rule-based `expandQuery` (Feature 38 companion, `query-expander.ts`) correctly limits to `MAX_VARIANTS = 3`, includes original as first variant, and uses word-boundary replacement to avoid partial matches.

One Important issue noted regarding documentation inconsistency (see issues section).

---

## Score Breakdown

| Dimension | Score | Max | Notes |
|-----------|-------|-----|-------|
| Correctness | 29 | 30 | Feature 36 truncation logic fully correct; minor concern in Feature 33 classification boundary overlap |
| Security | 25 | 25 | No injection risks, no hardcoded credentials, all user input treated as opaque strings |
| Patterns | 18 | 20 | Consistent guard-clause style, discriminated unions, const assertions used; minor deviations noted |
| Maintainability | 14 | 15 | Well-documented, clear single-purpose functions; one stale comment |
| Performance | 9 | 10 | Efficient implementations; one minor Set-usage inefficiency |

**Total Score: 95/100 — EXCELLENT**

**Recommendation: PASS**

---

## Issues Found

### P1 — Required

#### P1-1: `determineConfidence` return type is `string` instead of a discriminated union or literal type
**File:** `lib/search/query-classifier.ts:101`
**Evidence:**
```typescript
function determineConfidence(
  tier: QueryComplexityTier,
  termCount: number,
  hasTrigger: boolean,
  stopWordRatio: number,
): string {   // <-- should be 'high' | 'medium' | 'low' | 'fallback'
```
**Impact:** The `ClassificationResult.confidence` field (`query-classifier.ts:15`) is typed as `string`, allowing any string value to pass type checking. The function returns only `'high'`, `'medium'`, or `'low'`, and `classifyQueryComplexity` can also return `'fallback'` in the `FALLBACK` constant — but these four valid values have no compile-time enforcement. A future change introducing a typo like `'hight'` would not be caught.

**Fix:** Change return type to `'high' | 'medium' | 'low' | 'fallback'` and update `ClassificationResult.confidence` accordingly.

---

### P2 — Suggestions

#### P2-1: Stale documentation comment in `embedding-expansion.ts`
**File:** `lib/search/embedding-expansion.ts:12`
**Evidence:**
```
// Controlled by SPECKIT_EMBEDDING_EXPANSION=true (opt-in, default off).
```
This contradicts `search-flags.ts:107` which states `"Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable."` The `isFeatureEnabled()` implementation in `rollout-policy.ts:36-41` confirms that when the env var is undefined, the feature is ON. The comment is a leftover from when the feature was still opt-in.

**Fix:** Update line 12 to: `// Controlled by SPECKIT_EMBEDDING_EXPANSION (default ON). Set to 'false' to disable.`

---

#### P2-2: `fuseResultsRsfCrossVariant` — O(n) list membership check in hot path
**File:** `lib/search/rsf-fusion.ts:330-333`
**Evidence:**
```typescript
for (const src of result.sources) {
  if (!existing.result.sources.includes(src)) {  // O(n) includes() on growing list
    existing.result.sources.push(src);
  }
}
```
The `sources` array deduplication uses `Array.includes()` inside a nested loop over all variant results. For large result sets with many sources, this becomes O(sources * variants * results). Since sources is bounded (≤ 5 channel names), this is low-impact in practice but is an avoidable pattern.

**Fix:** Convert `existing.result.sources` to a `Set<string>` for deduplication, then spread to array at the end.

---

#### P2-3: `enforceChannelRepresentation` — `topK` default behavior is implicit
**File:** `lib/search/channel-enforcement.ts:85`
**Evidence:**
```typescript
const windowSize = topK !== undefined ? Math.max(0, topK) : fusedResults.length;
```
When `topK` is omitted, the function inspects the entire result set. This is documented in the JSDoc, but callers in `hybrid-search.ts:757-761` always pass `limit` as `topK`. However, the default-to-full-set behavior means that if `limit` is somehow not passed (e.g., in tests), all results are inspected rather than the intended window. This is acceptable but the function signature could make the intent more explicit with a required parameter.

**Fix:** Minor — consider making `topK` required or documenting the "all results" default more prominently.

---

#### P2-4: `getDynamicTokenBudget` — budget is computed but not enforced downstream
**File:** `lib/search/hybrid-search.ts:539-546`
**Evidence:**
```typescript
const budgetResult = getDynamicTokenBudget(routeResult.tier);
if (budgetResult.applied) {
  s3meta.tokenBudget = { ... };
}
```
The budget is computed and stored in `s3meta` (pipeline metadata) but there is no evidence in `hybridSearchEnhanced` that the budget value is used to constrain the number of returned results or token count in this code path. The pre-flight token budget validation (PI-A3) applies globally, but the `budgetResult.budget` value computed here flows only into the metadata struct. If the intent is for the dynamic budget to constrain result count in `hybridSearchEnhanced`, a connection to result limiting (e.g., `limit` adjustment based on `budget`) is missing.

**Fix:** Clarify in a comment whether `budget` at this level is advisory (metadata only for callers) or whether it should be enforced. If advisory, document that PI-A3 handles enforcement; if it should enforce, add result limiting logic.

---

## Pattern Compliance

| Pattern | Status | Notes |
|---------|--------|-------|
| No `any` types | PASS | All generic constraints use `unknown` or specific types |
| Guard clauses (early return) | PASS | Consistently used throughout all modules |
| Discriminated unions | PARTIAL | `QueryComplexityTier` is a correct union; `confidence` field is plain `string` (P1-1) |
| Const assertions for thresholds | PASS | `GAP_THRESHOLD_MULTIPLIER`, `DEFAULT_MIN_RESULTS`, `DEFAULT_BUDGET`, `QUALITY_FLOOR` all exported constants |
| Feature flag pattern | PASS | Consistent `isXEnabled()` / `env !== 'false'` pattern across all modules |
| Error handling | PASS | All channel failures silently caught and pipeline continues |
| Export hygiene | PASS | Internal helpers exported for testing are clearly labeled |

---

## Positive Highlights

- Feature 36 (confidence truncation) is an exemplary implementation. The median-gap algorithm is implemented exactly as specified, with correct handling of all documented edge cases (NaN/Infinity, zero-median, insufficient results). The audit metadata (`TruncationResult`) makes the decision transparent.

- Feature 35 (channel min-representation) correctly distinguishes between channels that returned results vs. channels that returned nothing. The `QUALITY_FLOOR` comment explains the 0.005 value and its Sprint 8 change history — this is the kind of reasoning that prevents future regressions.

- Feature 33 (complexity router) has clean separation between classification (`query-classifier.ts`) and routing (`query-router.ts`). The invariant enforcement function (`enforceMinimumChannels`) handles the edge case where a caller-provided config has fewer than 2 channels without silently failing.

- The RSF cross-variant bonus (Feature 34) correctly uses `variantSetSize - 1` rather than `variantSetSize` for the bonus multiplier — items in one variant get no bonus, items in two variants get one bonus, which matches the "+0.10 per additional variant" specification exactly.

- `embedding-expansion.ts` correctly suppresses expansion for "simple" queries via the R15 mutual exclusion even when `SPECKIT_COMPLEXITY_ROUTER` is disabled (because `classifyQueryComplexity` returns "complex" in that case, so expansion proceeds — the exclusion only fires when R15 is active and genuinely classifies "simple"). This is a subtle but correct interaction.

- All feature flag functions use a consistent, readable pattern: check env var, default to enabled if not set to `'false'`.

---

## Files Reviewed

| File | Status | P0 | P1 | P2 |
|------|--------|----|----|-----|
| `query-classifier.ts` | Reviewed | 0 | 1 | 0 |
| `query-router.ts` | Reviewed | 0 | 0 | 0 |
| `rsf-fusion.ts` | Reviewed | 0 | 0 | 1 |
| `channel-representation.ts` | Reviewed | 0 | 0 | 1 |
| `channel-enforcement.ts` | Reviewed | 0 | 0 | 1 |
| `confidence-truncation.ts` | Reviewed | 0 | 0 | 0 |
| `dynamic-token-budget.ts` | Reviewed | 0 | 0 | 1 |
| `hybrid-search.ts` (routing sections) | Reviewed | 0 | 0 | 0 |
| `intent-classifier.ts` | Reviewed | 0 | 0 | 0 |
| `embedding-expansion.ts` | Reviewed | 0 | 0 | 1 |
| `query-expander.ts` | Reviewed | 0 | 0 | 0 |

**Totals: 0 P0 blockers, 1 P1 required, 5 P2 suggestions**

