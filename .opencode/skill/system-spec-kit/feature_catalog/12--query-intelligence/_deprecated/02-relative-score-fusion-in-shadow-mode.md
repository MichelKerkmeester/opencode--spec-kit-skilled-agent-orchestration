---
title: "Relative score fusion in shadow mode [deprecated]"
description: "RSF runtime code is retired. This tombstone preserves the historical record while the live path remains RRF-only with precomputed adaptive weights."
status: deprecated
deprecated_at: 2026-04-11
deprecated_by: phase-006-canonical-continuity-refactor
deprecation_reason: "RSF runtime code was removed; RRF remains the sole live fusion method."
phase_018_replaces: "RRF-only live path; RSF runtime code remains retired"
---

# Relative score fusion in shadow mode [deprecated]

## 1. TOMBSTONE

This entry is retained only as a deprecation record. RSF runtime code is no longer live, and operators should treat the RRF-only hybrid path as canonical.

Companion manual tombstone: [034 -- Relative score fusion in shadow mode (R14/N1) [deprecated]](../../manual_testing_playbook/12--query-intelligence/_deprecated/034-relative-score-fusion-in-shadow-mode-r14-n1.md)

## 2. CURRENT REALITY

The live hybrid path now precomputes adaptive weights and sends a single `fusionLists` payload into `fuseResultsMulti(...)`. The retired RSF path remains documented only for historical context and regression breadcrumbs.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm (sole live method) |
| `shared/algorithms/adaptive-fusion.ts` | Shared | Supplies the precomputed live RRF channel weights |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Builds the single-pass weighted `fusionLists` payload for `fuseResultsMulti(...)` |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Residual comments still mention `RRF / RSF`; runtime fusion flow is RRF-only |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive weight helper coverage |
| `mcp_server/tests/cross-feature-integration-eval.vitest.ts` | Residual `SPECKIT_RSF_FUSION` references in mixed regression coverage |
| `mcp_server/tests/feature-eval-query-intelligence.vitest.ts` | Residual `SPECKIT_RSF_FUSION` env backup for evaluation coverage |
| `mcp_server/tests/search-fallback-tiered.vitest.ts` | Residual `SPECKIT_RSF_FUSION` env backup for fallback regression coverage |

## 4. NOTES

This tombstone replaces the in-place RSF feature entry. Do not restore the retired runtime path.
