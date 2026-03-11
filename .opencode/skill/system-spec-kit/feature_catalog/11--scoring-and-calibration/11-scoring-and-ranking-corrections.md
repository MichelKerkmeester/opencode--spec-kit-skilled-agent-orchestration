# Scoring and ranking corrections

## Current Reality

Four scoring-layer bugs were fixed:

**C1 — Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.

**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.

**C3 — Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.

**C4 — Ablation binomial overflow:** `ablation-framework.ts` computed binomial coefficients using naive multiplication that overflowed for n>50 in the sign test. Replaced with `logBinomial(n, k)` using log-space summation.

## Source Files

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

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Scoring and ranking corrections
- Current reality source: feature_catalog.md
