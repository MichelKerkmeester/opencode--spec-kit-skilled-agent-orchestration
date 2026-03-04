# Scoring and ranking corrections

## Current Reality

Four scoring-layer bugs were fixed:

**C1 — Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] at three call sites.

**C2 — Citation fallback chain:** `composite-scoring.ts` fell back through `last_accessed` then `updated_at` when no citation data existed, conflating recency with citation authority. The fallback chain was removed; the function returns 0 when no citation data exists.

**C3 — Causal-boost cycle amplification:** `causal-boost.ts` used `UNION ALL` in a recursive CTE, allowing cycles to amplify scores exponentially as the same node was visited multiple times. Changed to `UNION` which deduplicates visited nodes and prevents cycles.

**C4 — Ablation binomial overflow:** `ablation-framework.ts` computed binomial coefficients using naive multiplication that overflowed for n>50 in the sign test. Replaced with `logBinomial(n, k)` using log-space summation.

## Source Metadata

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Scoring and ranking corrections
- Summary match found: Yes
- Summary source feature title: Scoring and ranking corrections
- Current reality source: feature_catalog.md
