# Phase 015 Review: Retrieval Enhancements

## Summary

| Metric | Value |
|--------|-------|
| Features Reviewed | 9 |
| MATCH | 7 |
| PARTIAL | 2 |
| MISMATCH | 0 |
| Agreement rate | 44% (4/9) |
| Prior audit | 8 MATCH, 1 PARTIAL |
| Changes from prior | 1 downgrade (Feature 04 MATCH->PARTIAL) |

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence | Notes |
|---|---------|---------|----------|-------|------------|-------|
| 01 | Dual-scope memory auto-surface | MATCH | MATCH | **MATCH** | 95% | No discrepancies |
| 02 | Constitutional memory injection | MATCH | PARTIAL | **MATCH** | 85% | Verifier overruled — integration in prose |
| 03 | Spec folder hierarchy | MATCH | PARTIAL | **MATCH** | 82% | Verifier overruled — integration in prose |
| 04 | Lightweight consolidation | PARTIAL | PARTIAL | **PARTIAL** | 90% | Catalog says every-save, code is weekly cadence |
| 05 | Memory summary search | MATCH | PARTIAL | **MATCH** | 80% | Verifier overruled — pipeline wiring |
| 06 | Cross-document entity linking | MATCH | PARTIAL | **MATCH** | 80% | Verifier overruled — upstream dependency |
| 07 | Tier-2 fallback channel forcing | MATCH | MATCH | **MATCH** | 95% | Clean |
| 08 | Provenance-rich response envelopes | MATCH | MATCH | **MATCH** | 95% | Clean |
| 09 | Contextual tree injection | PARTIAL | PARTIAL | **PARTIAL** | 92% | Overinclusive source list persists |

## Disagreements

Features 02, 03, 05, 06: Verifier flagged unreferenced call-site files. Resolved as MATCH — catalog prose documents the integration points, source tables list canonical modules. Consumer/caller files are not required at feature level.

Feature 04: Both agree PARTIAL — catalog claims every-save execution but code enforces 7-day cadence guard.

## Changes from Prior Audit

| # | Feature | Prior | Current | Change |
|---|---------|-------|---------|--------|
| 04 | Lightweight consolidation | MATCH | **PARTIAL** | Cadence gap newly identified |
| All others | Same | Same | — |

## Recommendations

1. **Feature 04 (P1)**: Fix "fires after every save" to "invoked after every save but rate-limited to weekly cadence"
2. **Feature 09 (P1)**: Prune source list from ~55 files to ~5 relevant files
3. **Features 02,03,05,06 (P2)**: Add pipeline integration call sites to source tables
4. **Verifier calibration**: PARTIAL requires behavioral inaccuracy, not just missing downstream consumers

*Review by Opus 4.6. Confidence: HIGH.*
