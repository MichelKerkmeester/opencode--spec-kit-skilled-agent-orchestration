# Phase 020 Review: Feature Flag Reference

## Summary

| Metric | Value |
|--------|-------|
| Features audited | 7 |
| MATCH | 3 |
| PARTIAL | 4 |
| MISMATCH | 0 |
| Agreement rate | 29% pre-resolution (5 disagreements) |
| Prior audit | 6M/1P |
| Changes | 3 downgrades (F01, F02, F03→PARTIAL) |

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence | Notes |
|---|---------|---------|----------|-------|------------|-------|
| 01 | Search Pipeline Features | MATCH | PARTIAL | **PARTIAL** | 88% | 26 unreferenced pipeline stage files |
| 02 | Session and Cache | PARTIAL | MATCH | **PARTIAL** | 90% | SESSION_MAX_ENTRIES: eviction, not "not tracked" |
| 03 | MCP Configuration | MATCH | PARTIAL | **PARTIAL** | 85% | Unreferenced consumers of MCP flags |
| 04 | Memory and Storage | MATCH | PARTIAL | **PARTIAL** | 82% | Unreferenced consumers (eval-db, context-server) |
| 05 | Embedding and API | PARTIAL | PARTIAL | **PARTIAL** | 92% | Test-file citations persist from prior audit |
| 06 | Debug and Telemetry | MATCH | PARTIAL | **MATCH** | 85% | Cross-category design is intentional |
| 07 | CI and Build | MATCH | MATCH | **MATCH** | 95% | Clean |

## Key Findings

- **F02**: Catalog says entries beyond cap are "not tracked" — code shows LRU eviction (oldest deleted)
- **F05**: API key source files point to test files instead of production `factory.ts` / `cross-encoder.ts` — **unfixed since prior audit**
- **F01**: 26 pipeline stage files consuming SPECKIT flags not listed in catalog

## Changes from Prior Audit

| # | Prior | Current | Direction |
|---|-------|---------|-----------|
| 01 | MATCH | PARTIAL | 26 unreferenced pipeline files |
| 02 | MATCH | PARTIAL | Behavioral description inaccurate |
| 03 | MATCH | PARTIAL | Unreferenced consumers |

## Recommendations

1. **F02 (P1)**: Fix "not tracked" to describe LRU eviction behavior
2. **F05 (P1)**: Replace test-file citations with production source files
3. **F03 (P1)**: Add `quality-loop.ts` and `memory-parser.ts` as secondary sources
4. **F04 (P1)**: Add `eval-db.ts` and `context-server.ts` as secondary sources

*Review by Opus 4.6. Confidence: HIGH.*
