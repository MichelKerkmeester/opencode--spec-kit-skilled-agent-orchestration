# Phase 010 Review: Graph Signal Activation

## Summary

| Metric | Value |
|--------|-------|
| Features audited | 16 |
| MATCH | 10 |
| PARTIAL | 5 |
| MISMATCH | 1 |
| Agreement rate | 81.25% (13/16) |
| Prior audit | 12M/4P/0X |
| Changes | 3 downgrades (F02, F15, F16) |

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence |
|---|---------|---------|----------|-------|------------|
| 01 | Typed-weighted degree channel | MATCH | MATCH | **MATCH** | 95% |
| 02 | Co-activation boost strength | PARTIAL | MATCH | **PARTIAL** | 82% |
| 03 | Edge density measurement | MATCH | MATCH | **MATCH** | 95% |
| 04 | Weight history audit tracking | MATCH | MATCH | **MATCH** | 95% |
| 05 | Graph momentum scoring | MATCH | MATCH | **MATCH** | 95% |
| 06 | Causal depth signal | MATCH | MATCH | **MATCH** | 95% |
| 07 | Community detection | MATCH | MATCH | **MATCH** | 95% |
| 08 | Graph/cognitive memory fixes | MATCH | MATCH | **MATCH** | 92% |
| 09 | ANCHOR tags as graph nodes | MATCH | MATCH | **MATCH** | 95% |
| 10 | Causal neighbor boost/injection | MATCH | MATCH | **MATCH** | 95% |
| 11 | Temporal contiguity layer | PARTIAL | PARTIAL | **PARTIAL** | 95% |
| 12 | Unified graph retrieval | MATCH | MATCH | **MATCH** | 95% |
| 13 | Graph lifecycle refresh | PARTIAL | PARTIAL | **PARTIAL** | 95% |
| 14 | Async LLM graph backfill | PARTIAL | PARTIAL | **PARTIAL** | 95% |
| 15 | Graph calibration profiles | MISMATCH | PARTIAL | **MISMATCH** | 90% |
| 16 | Typed traversal | MATCH | PARTIAL | **PARTIAL** | 85% |

## MISMATCH: Feature 15 — Graph Calibration Profiles

**Severity: P0.** Module is `@deprecated` at `graph-calibration.ts:14` ("never wired into Stage 2 pipeline") but catalog says "Enabled by default (graduated)" and describes it as live functionality. The catalog represents dead code as active. Zero imports in the live pipeline. Flag accessor exists but is vestigial.

## Key Findings

- **F02**: Catalog says `0.25-0.3x` range, code has fixed `0.25`; unimplemented "dark-run" claim
- **F11**: `@deprecated`, never wired — catalog describes as active
- **F13/F14**: Internal contradiction between overview ("off") and Current Reality ("graduated, on")
- **F16**: Sparse-first mode unreachable — live pipeline doesn't pass `graphDensity` parameter

## Changes from Prior Audit

| # | Prior | Current | Direction |
|---|-------|---------|-----------|
| 02 | MATCH | PARTIAL | Range + dark-run claims inaccurate |
| 15 | PARTIAL | **MISMATCH** | Escalated — dead code presented as live |
| 16 | MATCH | PARTIAL | Sparse mode unreachable in production |

## Recommendations

1. **F15 (P0)**: Remove "graduated" claim or wire module into pipeline; add deprecation notice
2. **F11 (P1)**: Add deprecation notice to catalog
3. **F13/F14 (P1)**: Fix contradictory default statements
4. **F16 (P1)**: Document sparse-mode limitation or pass `graphDensity` in pipeline
5. **F02 (P2)**: Fix range to `0.25`; remove dark-run claim

*Review by Opus 4.6. Confidence: HIGH (91%).*
