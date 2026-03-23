# Phase 013 Review: Memory Quality and Indexing

## Summary

| Metric | Value |
|--------|-------|
| Features audited | 24 |
| MATCH | 15 |
| PARTIAL | 8 |
| MISMATCH | 1 |
| Agreement rate | 54% (13/24) |
| Prior audit | 20M/4P/0X |
| Changes | 6 regressions, 0 improvements |

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence |
|---|---------|---------|----------|-------|------------|
| 01 | Verify-fix-verify quality loop | MATCH | PARTIAL | **MATCH** | 85% |
| 02 | Signal vocabulary expansion | MATCH | MATCH | **MATCH** | 95% |
| 03 | Pre-flight token budget validation | MATCH | PARTIAL | **MATCH** | 85% |
| 04 | Spec folder description discovery | MATCH | PARTIAL | **MATCH** | 80% |
| 05 | Pre-storage quality gate | MATCH | PARTIAL | **MATCH** | 80% |
| 06 | Reconsolidation-on-save | MATCH | PARTIAL | **MATCH** | 80% |
| 07 | Smarter memory content generation | MATCH | PARTIAL | **PARTIAL** | 75% |
| 08 | Anchor-aware chunk thinning | MATCH | PARTIAL | **MATCH** | 80% |
| 09 | Encoding-intent capture | MATCH | PARTIAL | **PARTIAL** | 75% |
| 10 | Auto entity extraction | PARTIAL | PARTIAL | **PARTIAL** | 85% |
| 11 | Content-aware filename generation | PARTIAL | MATCH | **PARTIAL** | 75% |
| 12 | Generation-time duplicate prevention | PARTIAL | PARTIAL | **PARTIAL** | 85% |
| 13 | Entity normalization consolidation | PARTIAL | PARTIAL | **PARTIAL** | 90% |
| 14 | Quality gate timer persistence | PARTIAL | MATCH | **PARTIAL** | 80% |
| 15 | Deferred lexical-only indexing | MATCH | PARTIAL | **MATCH** | 80% |
| 16 | Dry-run preflight | MATCH | MATCH | **MATCH** | 95% |
| 17 | Outsourced agent handback | PARTIAL | MATCH | **PARTIAL** | 80% |
| 18 | Session enrichment guards | MATCH | MATCH | **MATCH** | 90% |
| 19 | Post-save quality review | PARTIAL | MATCH | **PARTIAL** | 85% |
| 20 | Weekly batch feedback learning | MATCH | MATCH | **MATCH** | 95% |
| 21 | Assistive reconsolidation | MISMATCH | PARTIAL | **MISMATCH** | 90% |
| 22 | Implicit feedback log | MATCH | MATCH | **MATCH** | 95% |
| 23 | Hybrid decay policy | MATCH | MATCH | **MATCH** | 95% |
| 24 | Save quality gate exceptions | MATCH | MATCH | **MATCH** | 95% |

## MISMATCH: Feature 21 — Assistive Reconsolidation

**Severity: P0.** Catalog says "near-duplicates are automatically merged" — implying content combination. Code at `reconsolidation-bridge.ts:363-377` performs shadow-archive (`is_archived=1` on older record) while new record saves normally. No content merging occurs. "Merge" and "archive-then-replace" are fundamentally different operations. Also: flag accessor name wrong in catalog (`isReconsolidationEnabled()` vs actual `isAssistiveReconsolidationEnabled()`).

## Changes from Prior Audit

| # | Feature | Prior | Current | Direction |
|---|---------|-------|---------|-----------|
| 07 | Smarter memory content gen | MATCH | PARTIAL | Missing `bm25-index.ts` |
| 09 | Encoding-intent capture | MATCH | PARTIAL | Missing `vector-index-mutations.ts` |
| 10 | Auto entity extraction | MATCH | PARTIAL | Source list has wrong files |
| 17 | Agent handback protocol | MATCH | PARTIAL | QUALITY_GATE_ABORT skip claim is false |
| 19 | Post-save quality review | MATCH | PARTIAL | "Always active" contradicted by code |
| 21 | Assistive reconsolidation | MATCH | **MISMATCH** | "Merge" vs shadow-archive |

## Recommendations

1. **F21 (P0)**: Rewrite "automatically merged" to "shadow-archived"; fix flag accessor name
2. **F10 (P1)**: Replace source list with correct files
3. **F12 (P1)**: Replace 47-file list with actual `scripts/core/file-writer.ts`
4. **F13 (P1)**: Add `entity-linker.ts`; remove deprecated `entity-scope.ts`
5. **F14 (P1)**: Reduce 55+ file list to `save-quality-gate.ts`
6. **F17 (P1)**: Correct QUALITY_GATE_ABORT skip claim
7. **F19 (P1)**: Correct "always active" to exclude captured-mode

*Review by Opus 4.6. Confidence: HIGH (82%).*
