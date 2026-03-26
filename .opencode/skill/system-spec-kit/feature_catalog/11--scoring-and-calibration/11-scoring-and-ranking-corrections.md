---
title: "Scoring and ranking corrections"
description: "Covers four scoring-layer bug fixes: composite score overflow clamping, citation fallback chain removal, causal-boost cycle deduplication and ablation binomial overflow prevention."
---

# Scoring and ranking corrections

## 1. OVERVIEW

Covers four scoring-layer bug fixes: composite score overflow clamping, citation fallback chain removal, causal-boost cycle deduplication and ablation binomial overflow prevention.

These are four bug fixes for the scoring math. Scores could climb above their allowed maximum, a fallback was using the wrong data to guess relevance, circular relationships in the graph could multiply scores endlessly, and a statistics calculation could break with large numbers. Each fix is small on its own, but together they keep the ranking numbers honest and reliable.

---

## 2. CURRENT REALITY

Four scoring-layer bugs were fixed:

**C1: Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.

**C2: Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed. The function returns 0 when no citation data exists.

**C3: Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.

**C4: Ablation binomial overflow:** `ablation-framework.ts` computed binomial coefficients using naive multiplication that overflowed for n>50 in the sign test. Replaced with `logBinomial(n, k)` using log-space summation.

**Follow-up hardening:** the same ablation metrics path now filters token-usage samples to finite values greater than zero before averaging. Because `runAblation()` does not currently populate `tokenUsage`, this prevents synthetic zeroes from appearing in `token_usage` metrics.

---

## 3. SOURCE FILES

### Implementation

| Correction | File | Layer | Role |
|------------|------|-------|------|
| C1 | `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Clamp post-processed composite score to [0,1] |
| C2 | `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Remove citation fallback chain; uncited returns 0 |
| C3 | `mcp_server/lib/search/causal-boost.ts` | Lib | Recursive CTE cycle-safe traversal (`UNION` dedupe) |
| C4 | `mcp_server/lib/eval/ablation-framework.ts` | Lib | Log-space binomial summation for stable sign test |

### Tests

| Correction | File | Focus |
|------------|------|-------|
| C1 | `mcp_server/tests/composite-scoring.vitest.ts` | Composite clamp regression ([0,1] ceiling) |
| C2 | `mcp_server/tests/composite-scoring.vitest.ts` | Citation score behavior without fallback timestamps |
| C3 | `mcp_server/tests/causal-boost.vitest.ts` | Cycle/dedup behavior in recursive graph boost |
| C4 | `mcp_server/tests/ablation-framework.vitest.ts` | Large-n sign test stability and p-value computation |

---

## 4. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Scoring and ranking corrections
- Current reality source: FEATURE_CATALOG.md
