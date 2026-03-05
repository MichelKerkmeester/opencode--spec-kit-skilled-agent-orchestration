# Wave 6 — Sprint 3, Activity 1 (T001a): Query Complexity Classifier

**Status:** COMPLETE
**Date:** 2026-02-27

## Files Created

1. **`mcp_server/lib/search/query-classifier.ts`** — Query complexity classifier module
2. **`mcp_server/tests/t022-query-classifier.vitest.ts`** — Comprehensive test suite (72 tests)

## Implementation Summary

### Classifier Design

3-tier heuristic classifier with the following boundaries:
- **Simple**: <=3 terms OR trigger phrase exact match
- **Moderate**: 4-8 terms, no trigger match (interior region)
- **Complex**: >8 terms AND no trigger match

### Features Extracted
- `termCount` — whitespace-split term count
- `charCount` — raw character length
- `hasTriggerMatch` — exact match against provided trigger phrases (case-insensitive)
- `stopWordRatio` — fraction of terms that are common English stop words (37 words)

### Exports
- `QueryComplexityTier` type (`'simple' | 'moderate' | 'complex'`)
- `ClassificationResult` interface (tier, features, confidence)
- `classifyQueryComplexity(query, triggerPhrases?)` — main classifier function
- `isComplexityRouterEnabled()` — checks `SPECKIT_COMPLEXITY_ROUTER` env var
- Config constants: `SIMPLE_TERM_THRESHOLD = 3`, `COMPLEX_TERM_THRESHOLD = 8`
- `STOP_WORDS` set (37 common English stop words)
- Helper functions: `extractTerms`, `calculateStopWordRatio`, `hasTriggerMatch`

### Feature Flag
- `SPECKIT_COMPLEXITY_ROUTER` env var — default: **disabled**
- Only enabled when explicitly set to `"true"` (case-insensitive)
- When disabled: all queries return tier="complex" with confidence="fallback"
- This is the opposite of `isFeatureEnabled()` which defaults to enabled

### Error Handling
- Any classifier error/exception returns tier="complex" (safe fallback per spec)
- Invalid inputs (null, undefined, empty, whitespace) return complex fallback
- Non-string inputs caught by try/catch and return complex fallback

### Confidence Labels
- `"high"` — trigger match, very short query, very long query, low stop-word ratio
- `"medium"` — standard classification within tier
- `"low"` — near boundary (4 terms or 8 terms = moderate near edges)
- `"fallback"` — feature flag disabled or error condition

## Test Results

```
72 tests passed (0 failed)
Duration: 136ms
```

### Test Coverage by Category
- T022-01: Feature flag tests (9 tests) — env var parsing, disabled fallback
- T022-02: Simple tier classification (7 tests) — 12 simple queries, all correct
- T022-03: Moderate tier classification (6 tests) — 12 moderate queries, all correct
- T022-04: Complex tier classification (5 tests) — 12 complex queries, all correct
- T022-05: Config thresholds (7 tests) — boundary values verified
- T022-06: Stop-word ratio (8 tests) — calculation accuracy, required words
- T022-07: Trigger phrase matching (6 tests) — exact match, case-insensitive, partial rejection
- T022-08: Edge cases and errors (7 tests) — null, undefined, numeric, whitespace
- T022-09: Result structure (5 tests) — interface shape, decimal precision
- T022-10: Term extraction (6 tests) — whitespace handling, edge cases
- T022-11: Tier mapping readiness (2 tests) — enum values for T001b
- T022-12: Comprehensive accuracy (4 tests) — 36 total queries, 100% per-tier accuracy

### Acceptance Criteria Met
- [x] Classifier correctly assigns 10+ test queries per tier (12 per tier = 36 total)
- [x] Config-driven thresholds (SIMPLE_TERM_THRESHOLD, COMPLEX_TERM_THRESHOLD)
- [x] Feature flag gating (SPECKIT_COMPLEXITY_ROUTER, default disabled)
- [x] Safe fallback on error and when feature flag disabled
- [x] No existing files modified

## Design Decisions

1. **Feature flag implementation**: Used direct `process.env` check instead of `isFeatureEnabled()` because the rollout-policy module defaults to enabled (true when undefined), but `SPECKIT_COMPLEXITY_ROUTER` must default to disabled.

2. **Trigger phrase matching**: Implemented as exact match (case-insensitive, whitespace-trimmed) per spec. Partial matches do not count.

3. **Stop-word ratio precision**: Rounded to 3 decimal places to avoid floating-point noise in downstream comparisons.

4. **Confidence as string**: Used descriptive labels ("high", "medium", "low", "fallback") instead of numeric values, matching the `confidence: string` type in the spec.
