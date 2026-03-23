# Phase 011 Review: Scoring and Calibration (HIGH RISK)

## Summary

| Metric | Value |
|--------|-------|
| Features audited | 23 |
| MATCH | 17 |
| PARTIAL | 5 |
| MISMATCH | 1 |
| Agreement rate | 78.3% (18/23) |
| Prior audit | 20M/3P/0X |
| Changes | 3 downgrades, 1 upgrade, F23 PARTIAL->MISMATCH |

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence |
|---|---------|---------|----------|-------|------------|
| 01 | Score normalization | PARTIAL | PARTIAL | **PARTIAL** | 95% |
| 02 | Cold-start novelty boost | MATCH | MATCH | **MATCH** | 95% |
| 03 | Interference scoring | MATCH | MATCH | **MATCH** | 95% |
| 04 | Classification-based decay | MATCH | MATCH | **MATCH** | 95% |
| 05 | Folder-level relevance | MATCH | MATCH | **MATCH** | 95% |
| 06 | Embedding cache | MATCH | MATCH | **MATCH** | 90% |
| 07 | Double intent weighting | MATCH | MATCH | **MATCH** | 95% |
| 08 | RRF K-value sensitivity | PARTIAL | PARTIAL | **PARTIAL** | 95% |
| 09 | Negative feedback confidence | MATCH | MATCH | **MATCH** | 95% |
| 10 | Auto-promotion on validation | MATCH | MATCH | **MATCH** | 95% |
| 11 | Scoring/ranking corrections | MATCH | MATCH | **MATCH** | 95% |
| 12 | Stage 3 effectiveScore fallback | MATCH | MATCH | **MATCH** | 90% |
| 13 | Scoring/fusion corrections | MATCH | PARTIAL | **PARTIAL** | 80% |
| 14 | Local GGUF reranker | MATCH | MATCH | **MATCH** | 95% |
| 15 | Tool-level TTL cache | MATCH | MATCH | **MATCH** | 95% |
| 16 | Access-driven popularity | MATCH | MATCH | **MATCH** | 95% |
| 17 | Temporal-structural coherence | MATCH | MATCH | **MATCH** | 95% |
| 18 | Adaptive shadow ranking | MATCH | MATCH | **MATCH** | 95% |
| 19 | Learned Stage 2 combiner | MATCH | PARTIAL | **PARTIAL** | 75% |
| 20 | Shadow feedback holdout | MATCH | MATCH | **MATCH** | 95% |
| 21 | Calibrated overlap bonus | MATCH | MATCH | **MATCH** | 95% |
| 22 | RRF K experimental tuning | PARTIAL | PARTIAL | **PARTIAL** | 95% |
| 23 | Fusion policy shadow V2 | MISMATCH | MISMATCH | **MISMATCH** | 95% |

## MISMATCH: Feature 23 — Fusion Policy Shadow Evaluation V2

**Severity: P0.** Module is `@deprecated` (line 10), commented out of barrel export (`index.ts:8-10`), not consumed by production. Flag `SPECKIT_FUSION_POLICY_SHADOW_V2` does not exist in `search-flags.ts`. Catalog claims "runs on each query" — factually false.

## Key Findings

- **F08**: K-value grid expanded from 5 to 7 values, catalog not updated
- **F13**: Catalog says `Math.max` preservation; code does flat overwrite
- **F19**: Shadow scoring structurally inert — model always `null`
- **F22**: Wrong function name persists from prior audit (`perIntentKSweep` → `runJudgedKSweep`)

## Changes from Prior Audit

| # | Prior | Current | Direction |
|---|-------|---------|-----------|
| 01 | MATCH | PARTIAL | Divergent edge-case behavior |
| 08 | MATCH | PARTIAL | K-grid expanded |
| 12 | PARTIAL | MATCH | Upgraded — fix landed |
| 19 | MATCH | PARTIAL | Null model makes shadow inert |
| 23 | PARTIAL | **MISMATCH** | Deprecated, not exported, not consumed |

## Recommendations

1. **F23 (P0)**: Mark catalog entry DEPRECATED or delete — module is dead
2. **F08 (P1)**: Update K-grid from `{20,40,60,80,100}` to `[10,20,40,60,80,100,120]`
3. **F13 (P1)**: Fix `Math.max` claim to describe actual overwrite behavior
4. **F22 (P1)**: Rename `perIntentKSweep()` to `runJudgedKSweep()`

*Review by Opus 4.6. Confidence: HIGH.*
