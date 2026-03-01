# Agent-2 Phase 1: MMR Diversity + TRM Confidence — Gap Analysis

## Status: ALL 4 TASKS ALREADY IMPLEMENTED

### Task 1: MMR Algorithm — DONE
- **File:** `lib/search/mmr-reranker.ts` lines 155-234
- `applyMMR(candidates, config)` with pairwise cosine similarity matrix
- Core formula: `mmrScore = lambda * relevance - (1 - lambda) * maxSim`
- `DEFAULT_MAX_CANDIDATES = 20` hardcap (line 18)
- Also has Graph-Guided MMR (Phase 2 feature from Workstream 003) behind `isGraphMMREnabled()` flag
- **Tests:** `tests/mmr-reranker.vitest.ts` — 11 tests (T1-T11): dedup, lambda=0.5 diversity, lambda=0.85 relevance, N=20 cap, <10ms perf, limit respect, empty/single input, cosine correctness, zero vectors, determinism

### Task 2: Intent-Mapped Lambdas — DONE (definition only)
- **File:** `lib/search/intent-classifier.ts` lines 349-357
- `INTENT_LAMBDA_MAP`: understand=0.5, fix_bug=0.85, find_spec=0.5, find_decision=0.5, add_feature=0.7, refactor=0.6, security_audit=0.75
- **Tests:** `tests/intent-classifier.vitest.ts` lines 619-625: validates map existence and value ordering
- **INTEGRATION GAP:** `hybrid-search.ts:477` hardcodes `lambda: 0.7` instead of consuming `INTENT_LAMBDA_MAP`. This file is OUTSIDE my ownership scope (`DO NOT modify: hybrid-search.ts`). The map is exported but not wired.

### Task 3: TRM Confidence Check — DONE
- **File:** `lib/search/evidence-gap-detector.ts` lines 147-175
- `detectEvidenceGap(rrfScores)` computes mean, variance, stdDev, Z-score
- Gap detected when `zScore < 1.5` OR `topScore < 0.015`
- Returns `{ gapDetected, zScore, mean, stdDev }`
- Edge cases: empty array, single score, identical scores (stdDev=0)
- **Tests:** `tests/evidence-gap-detector.vitest.ts` — 12 tests (T1-T12): well-separated, flat distribution, identical, empty, single high/low, boundary, absolute min, math correctness, warning format, perf, negatives

### Task 4: Warning Injection — DONE
- **File:** `handlers/memory-search.ts` lines 579-658
- Lines 580-588: Extracts rrfScores from finalResults, calls `detectEvidenceGap()`
- Lines 589: Calls `formatEvidenceGapWarning(trm)` when gap detected
- Lines 592-596: Adds warning to `extraData.evidenceGapWarning` and `extraData.evidenceGapTRM`
- Lines 648-658: Prepends warning to `parsed.summary` in the JSON response
- Warning format: `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=X.XX). Consider first principles.**`
- **Tests:** `tests/handler-memory-search.vitest.ts` lines 71-82: C138-T1 and C138-T2 validate markdown format (static string tests, not integration)

## No Implementation Needed

All four Phase 1 tasks are fully implemented with comprehensive test coverage. Zero remaining work within my file ownership scope.

## Known Non-Blocking Gap (Outside Scope)
- `hybrid-search.ts:477` uses hardcoded `lambda: 0.7` instead of dynamically looking up `INTENT_LAMBDA_MAP[detectedIntent]`. The intent is classified in `memory-search.ts` but the lambda value is not passed through to the `searchWithFallback()` call chain. This would require modifying `hybrid-search.ts` (outside ownership scope).
