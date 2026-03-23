# Phase 012 Review: Query Intelligence

## Summary

| Metric | Value |
|--------|-------|
| Features reviewed | 11 |
| MATCH | 5 |
| PARTIAL | 6 |
| MISMATCH | 0 |
| Agreement rate | 63.6% (7/11) |
| Prior audit | 8M/3P/0X |
| Changes | 3 downgrades (F05,F10,F11), 1 upgrade (F08) |

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence | Notes |
|---|---------|---------|----------|-------|------------|-------|
| 01 | Query complexity router | PARTIAL | MATCH | **MATCH** | 88% | charCount imprecision minor |
| 02 | Relative score fusion | MATCH | MATCH | **MATCH** | 95% | Clean |
| 03 | Channel min-representation | MATCH | MATCH | **MATCH** | 95% | Clean |
| 04 | Confidence-based truncation | MATCH | MATCH | **MATCH** | 95% | Clean |
| 05 | Dynamic token budget | PARTIAL | PARTIAL | **PARTIAL** | 92% | ~26 tokens/result in code, ~12 in catalog |
| 06 | Query expansion | MATCH | MATCH | **MATCH** | 95% | Clean |
| 07 | LLM query reformulation | PARTIAL | PARTIAL | **PARTIAL** | 90% | Stale header contradicts runtime default |
| 08 | HyDE | MATCH | MATCH | **MATCH** | 93% | Upgraded from prior PARTIAL |
| 09 | Index-time query surrogates | PARTIAL | PARTIAL | **PARTIAL** | 88% | Stale header, missing sources, wrong return type |
| 10 | Query decomposition | MATCH | PARTIAL | **PARTIAL** | 78% | Error fallback claim inaccurate |
| 11 | Graph concept routing | PARTIAL | PARTIAL | **PARTIAL** | 85% | Stage1 traces only, doesn't activate graph channel |

## Disagreements

- **F01**: Analyst PARTIAL overruled to MATCH — charCount wording imprecise but behavior correct
- **F10**: Verifier PARTIAL upheld — catalog says errors return original query, code falls through to expansion

## Changes from Prior Audit

| # | Feature | Prior | Current | Direction |
|---|---------|-------|---------|-----------|
| 05 | Dynamic token budget | MATCH | PARTIAL | Downgraded — token overhead ~26 not ~12 |
| 08 | HyDE | PARTIAL | MATCH | Upgraded — flag default contradiction resolved |
| 10 | Query decomposition | MATCH | PARTIAL | Downgraded — error fallback inaccurate |
| 11 | Graph concept routing | MATCH | PARTIAL | Downgraded — only traces, doesn't activate |

## Recommendations

1. **F05 (P0)**: Fix "~12 tokens/result" to "~26 tokens/result"
2. **F09 (P0)**: Add missing source files; fix `SurrogateMatchResult` return type description
3. **F10 (P0)**: Fix "returns only original query" to "falls through to expansion path"
4. **F11 (P0)**: Clarify Stage1 records trace metadata only, doesn't activate graph channel
5. **F07, F09 (P1)**: Fix stale module headers (default OFF → default ON)

*Review by Opus 4.6. Confidence: HIGH.*
