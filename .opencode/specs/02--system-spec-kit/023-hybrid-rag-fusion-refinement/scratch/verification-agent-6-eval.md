---
title: Verification Agent 6 — Evaluation & Measurement (Features 5-15)
description: Code review of eval infrastructure for Hybrid RAG Fusion Refinement (Spec 140). Features 5-15.
reviewed_by: reviewer-agent
reviewed_at: 2026-03-01
confidence: HIGH
---

# Verification Agent 6 — Evaluation & Measurement (Features 5-15)

## Review Summary

**Recommendation:** APPROVE with notes
**Score:** 88/100
**Confidence:** HIGH

All 15 files read directly. All 15 features verified against specifications. No P0 blockers found. Two P1 issues identified (runtime observer effect alert not implemented in production code; `getShadowStats` reads from a table that is never written). Four P2 suggestions.

---

## Score Breakdown

| Dimension       | Score | Max | Notes |
|-----------------|-------|-----|-------|
| Correctness     | 26/30 | 30  | 9 metrics correct, bootstrap CI correct, 2 edge case gaps |
| Security        | 24/25 | 25  | Fail-safe everywhere, no swallowed exceptions exposed to callers |
| Patterns        | 18/20 | 20  | Consistent module structure, minor inconsistency in error handling style |
| Maintainability | 13/15 | 15  | Well-documented, clear section headers; map-ground-truth-ids.ts is complex |
| Performance     | 7/10  | 10  | Bootstrap 10k iterations is intentional; no blocking issues |

---

## Feature Verdicts

| Feature | Ref | File | Verdict | Notes |
|---------|-----|------|---------|-------|
| F5: Eval DB schema | R13-S1 | eval-db.ts | PASS | 5 tables, WAL, idempotent |
| F6: 9 metric computation | R13-S1 | eval-metrics.ts | PASS | All 9 verified |
| F7: Observer effect mitigation | D4 | eval-logger.ts + tests | PARTIAL | Test validates threshold; no runtime alert function |
| F8: Ceiling evaluation | A2 | eval-ceiling.ts | PASS | Ground-truth and scorer paths both implemented |
| F9: Quality proxy formula | B7 | eval-quality-proxy.ts | PASS | Weights sum to 1.0, edge cases handled |
| F10: Synthetic ground truth | G-NEW-1 | ground-truth-data.ts + generator | PASS | 110 queries, 7 diversity gates |
| F11: BM25-only baseline | G-NEW-1 | bm25-baseline.ts | PASS | Contingency matrix + bootstrap CI correct |
| F12: Agent consumption instrumentation | G-NEW-2 | eval-logger.ts | PASS | Fail-safe, feature-flagged |
| F13: Scoring observability | T010 | shadow-scoring.ts + channel-attribution.ts | PASS | Attribution preserved |
| F14: Reporting + ablation framework | R13-S3 | reporting-dashboard.ts + ablation-framework.ts | PASS | Sign-test, storeAblationResults, formatAblationReport |
| F15: Shadow scoring removal | R13-S2 | shadow-scoring.ts | PASS | runShadowScoring and logShadowComparison permanently disabled |

---

## Blockers (P0)

None.

---

## Required Fixes (P1)

### P1-1: Observer Effect 10% Alert is Test-Only — No Runtime Alert Path

**File:** `lib/eval/eval-logger.ts` (entire file)
**Spec ref:** D4 — "fires an alert when overhead exceeds 10%"

The spec states the system should fire an alert when logging overhead exceeds 10% of search baseline. The 10% threshold is validated correctly in `tests/eval-logger.vitest.ts` (lines 423-446, test `T004b-3`), but that is a static benchmark test run during CI — it does not implement a runtime check that fires during production operation.

The production `eval-logger.ts` has no function that measures p95 overhead at runtime and emits a warning/alert when the 10% boundary is crossed. The feature summary describes this as: "A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%."

**Evidence:** `lib/eval/eval-logger.ts` exports only `logSearchQuery`, `logChannelResult`, `logFinalResult`, `generateEvalRunId`, and `isEvalLoggingEnabled`. There is no exported health-check or overhead-monitor function.

**Impact:** The spec's runtime alerting behavior (D4) is not present in production code. The 10% guard only fires during test runs, not during live operation.

**Fix guidance:** Add an exported `checkObserverEffectOverhead(baselineMs: number, overheadMs: number): void` or equivalent that emits a `console.warn` (matching the module's fail-safe pattern) when `overheadMs / baselineMs > 0.10`. Wire it into the search path or expose it for callers to invoke.

---

### P1-2: `getShadowStats` Queries a Table That Is Never Written

**File:** `lib/eval/shadow-scoring.ts`, lines 352-431
**Pattern reference:** Same module — `logShadowComparison` (line 341) permanently returns `false` without writing.

`getShadowStats()` queries `eval_shadow_comparisons` via `ensureShadowSchema()` and aggregates `rank_correlation`, `mean_abs_score_delta`, `overlap_count`. However, `logShadowComparison` (the only write path) is permanently disabled and always returns `false` without writing anything.

The schema is created by `ensureShadowSchema()` (line 156), which means the table exists but will always be empty. `getShadowStats` will correctly return the zero-case object (lines 396-405), but this represents dead code with misleading behavior: callers could observe `totalComparisons: 0` and assume no shadow runs have occurred, when the actual state is that logging was permanently disabled.

**Evidence:**
```
// lib/eval/shadow-scoring.ts:341-344
export function logShadowComparison(_comparison: ShadowComparison): boolean {
  // Shadow scoring eval complete (Sprint 7 audit) — permanently disabled.
  return false;
}
```

**Impact:** `getShadowStats` is callable and returns a valid-looking object, but can never return non-zero data. Tests in `shadow-scoring.vitest.ts` lines 311-351 already document this behavior as "REMOVED flag — always disabled", confirming it is intentional. However, the function signature and schema creation create dead code that is misleading to future maintainers.

**Fix guidance:** Either: (a) mark `getShadowStats` as deprecated in its JSDoc and add a comment that it always returns zero, or (b) remove `getShadowStats` and the schema DDL since the write path is permanently disabled. Option (a) is lower risk.

---

## Suggestions (P2)

### P2-1: Bootstrap CI Upper Index Off-By-One — Potential Mild Bias

**File:** `lib/eval/bm25-baseline.ts`, lines 355-357

```typescript
const lowerIdx = Math.floor(iterations * 0.025);
const upperIdx = Math.floor(iterations * 0.975);
```

For `iterations = 10000`: `lowerIdx = 250`, `upperIdx = 9750`. The array is sorted 0-indexed (0..9999). Using `Math.floor` for both bounds means the 97.5th percentile uses index 9750, which is the 9751st value — this is correct. However, a common alternative is `Math.ceil(iterations * 0.975) - 1` for strict adherence to percentile definitions.

In practice for 10,000 iterations the difference is negligible (one sample). This is a minor statistical pedantry note, not a bug.

---

### P2-2: `map-ground-truth-ids.ts` Uses Regex State Machine to Parse TypeScript Source

**File:** `scripts/map-ground-truth-ids.ts`, lines 85-212

The script parses `ground-truth-data.ts` using a hand-written line-by-line state machine with regex. This is fragile: any reformatting of `ground-truth-data.ts` (e.g., trailing comma changes, quote style, template literals) could silently drop queries from the mapping output.

The script is a one-time migration tool (not production), so the risk is bounded. But a future re-run after a linter reformats the data file could produce incorrect results.

**Suggested improvement:** Import the ground-truth data via `tsx`/`ts-node` dynamic import rather than parsing the source text. The script already uses `npx tsx` shebang.

---

### P2-3: `reporting-dashboard.ts` Over-Fetches Rows for Limit Heuristic

**File:** `lib/eval/reporting-dashboard.ts`, lines 200-202

```typescript
sql += ` LIMIT ?`;
params.push(config.limit * 20); // Over-fetch to allow grouping
```

The `* 20` multiplier is a magic number with no documented basis. If `config.limit` is large, this could fetch substantial data. A comment explaining the rationale (e.g., "assume at most 20 metrics per sprint") would help maintainers.

---

### P2-4: `ground-truth-feedback.ts` — `_resetFeedbackSchemaFlag` Exported with Underscore Convention

**File:** `lib/eval/ground-truth-feedback.ts`, line 206

```typescript
export function _resetFeedbackSchemaFlag(): void {
```

The underscore-prefix convention for test-only exports is informal and not enforced by TypeScript. The codebase inconsistently applies it: `shadow-scoring.ts` uses the same `_resetSchemaFlag` pattern (line 170), while `eval-quality-proxy.ts` uses `WEIGHTS` and `DEFAULT_LATENCY_TARGET_MS` re-exports for test convenience.

A consistent `__testables` export object pattern (as noted in the review brief) or a dedicated `/testing` subpath would be cleaner, but this is a minor style issue.

---

## Positive Highlights

**Fail-safe logging architecture.** Every DB-writing function in `eval-logger.ts`, `ground-truth-feedback.ts`, `shadow-scoring.ts`, and `ablation-framework.ts` wraps DB operations in `try/catch` and degrades gracefully. The principle "logging must never break production search" is applied consistently and thoroughly.

**9 metrics fully and correctly implemented.** All four core metrics (MRR@K, NDCG@K, Recall@K, HitRate@K) and five diagnostic metrics (inversionRate, constitutionalSurfacingRate, importanceWeightedRecall, coldStartDetectionRate, intentWeightedNDCG) are implemented in `eval-metrics.ts` as pure functions with no DB access or side effects. Edge cases (empty inputs, zero IDCG, no relevant items) all return 0 rather than NaN or throwing.

**Bootstrap CI correctly implemented.** `computeBootstrapCI` in `bm25-baseline.ts` uses 10,000 iterations (default), log-space binomial computation to avoid overflow, and tests the nearest contingency threshold boundary — all matching the spec. The significance test logic (lines 364-376) correctly handles all three bands.

**Contingency decision matrix complete.** Both absolute (`evaluateContingency`) and relative (`evaluateContingencyRelative`) variants are present. Edge case of `hybridMRR <= 0` in relative mode defaults to PROCEED with a clear explanation (line 219-231).

**Shadow scoring cleanly removed.** `runShadowScoring` and `logShadowComparison` are permanently disabled with a clear audit comment ("Sprint 7 audit — permanently disabled"). Parameters are prefixed with `_` to signal intentional non-use. Channel attribution (`channel-attribution.ts`) is a separate module that is fully operational, correctly separating the two concerns.

**Ablation sign-test uses log-space binomial.** The `signTestPValue` function (lines 181-208 of `ablation-framework.ts`) uses log-space computation to avoid integer overflow for large n, with a documented minimum of 5 non-tied observations. This is careful statistical engineering.

**Quality proxy weights sum exactly to 1.0.** `WEIGHTS` in `eval-quality-proxy.ts` (0.40 + 0.25 + 0.20 + 0.15 = 1.00) is declared `as const` and exported for test verification. The clamp on the final score guards against floating-point rounding beyond [0,1].

**Diversity validation is comprehensive.** `validateGroundTruthDiversity` checks 7 gates including duplicate query detection, which prevents silent test-set contamination.

---

## Files Reviewed

| File | Lines | Issues |
|------|-------|--------|
| `lib/eval/eval-db.ts` | 189 | 0 |
| `lib/eval/eval-metrics.ts` | 496 | 0 |
| `lib/eval/eval-logger.ts` | 228 | P1-1 |
| `lib/eval/eval-ceiling.ts` | 412 | 0 |
| `lib/eval/eval-quality-proxy.ts` | 215 | 0 |
| `lib/eval/bm25-baseline.ts` | 587 | P2-1 |
| `lib/eval/ground-truth-data.ts` | ~1800 (large) | 0 |
| `lib/eval/ground-truth-generator.ts` | 328 | 0 |
| `lib/eval/ground-truth-feedback.ts` | 552 | P2-4 |
| `lib/eval/channel-attribution.ts` | 248 | 0 |
| `lib/eval/shadow-scoring.ts` | 432 | P1-2 |
| `lib/eval/ablation-framework.ts` | 536 | 0 |
| `lib/eval/reporting-dashboard.ts` | 646 | P2-3 |
| `lib/eval/k-value-analysis.ts` | 206 | 0 |
| `scripts/run-bm25-baseline.ts` | 186 | 0 |
| `scripts/map-ground-truth-ids.ts` | 609 | P2-2 |

---

## Verification Checklist

### 9 Metrics Verified

| # | Metric | Function | Default K | Edge Case (empty) | Verified |
|---|--------|----------|-----------|-------------------|---------|
| 1 | MRR | `computeMRR` | K=5 | returns 0 | YES |
| 2 | NDCG | `computeNDCG` | K=10 | returns 0, idcg=0 guard | YES |
| 3 | Recall | `computeRecall` | K=20 | returns 0 | YES |
| 4 | HitRate | `computeHitRate` | K=1 | returns 0 | YES |
| 5 | InversionRate | `computeInversionRate` | all | <2 results returns 0 | YES |
| 6 | ConstitutionalSurfacingRate | `computeConstitutionalSurfacingRate` | K=5 | empty ids returns 0 | YES |
| 7 | ImportanceWeightedRecall | `computeImportanceWeightedRecall` | K=20 | totalWeight=0 guard | YES |
| 8 | ColdStartDetectionRate | `computeColdStartDetectionRate` | K=10 | no cold-start candidates returns 0 | YES |
| 9 | IntentWeightedNDCG | `computeIntentWeightedNDCG` | K=10 | delegates to computeNDCG | YES |

### Bootstrap CI

- Iterations: 10,000 (default, matches spec) — VERIFIED (`bm25-baseline.ts:322`)
- Percentile method: `Math.floor(iterations * 0.025)` / `Math.floor(iterations * 0.975)` — VERIFIED
- Significance test: boundary-aware, three-band logic — VERIFIED
- Log-space overflow protection: NOT needed for bootstrap (only for sign-test); bootstrap uses simple array sort — CORRECT

### Contingency Decision Matrix

| Threshold | Action | Absolute | Relative |
|-----------|--------|----------|---------|
| >= 0.80 | PAUSE | `bm25MRR >= 0.80` | `ratio >= 0.80` |
| 0.50-0.79 | RATIONALIZE | `bm25MRR >= 0.50` | `ratio >= 0.50` |
| < 0.50 | PROCEED | else | else |

Both `evaluateContingency` and `evaluateContingencyRelative` implement this correctly. `hybridMRR <= 0` edge case handled (defaults to PROCEED). — VERIFIED

### Observer Effect 10% Alert

- Test validates the threshold: `tests/eval-logger.vitest.ts:423-446` — VERIFIED
- Runtime production alert: NOT IMPLEMENTED — P1-1 above

### Shadow Scoring Removal

- `runShadowScoring`: permanently disabled, returns `null` — VERIFIED (`shadow-scoring.ts:247-254`)
- `logShadowComparison`: permanently disabled, returns `false` — VERIFIED (`shadow-scoring.ts:341-344`)
- Channel attribution (`channel-attribution.ts`): fully operational, separate module — VERIFIED
- DB table `eval_shadow_comparisons`: schema created but never written to — NOTED as P1-2

