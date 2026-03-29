---
title: "Relative score fusion in shadow mode"
description: "Relative score fusion (RSF) runtime code was removed, while residual test references and Stage 2 comments remain for regression coverage. RRF is the sole live fusion method, now using precomputed adaptive weights for a single-pass live merge."
---

# Relative score fusion in shadow mode

## 1. OVERVIEW

Removed from live ranking in Sprint 8. RSF implementation code and the `rsfShadow` metadata field were deleted during the v3 remediation sweep, while residual test references and Stage 2 comments remain as regression/historical breadcrumbs (updated 2026-03-25 per deep review).

When multiple search methods return ranked lists, RSF was one alternative way to merge them. RRF won the evaluation and RSF was deprecated. The module was retained temporarily for offline comparison but was never reactivated — it was removed as dead code.

---

## 2. CURRENT REALITY

RRF remains the sole live fusion method. RSF runtime code has been removed, but residual test references and Stage 2 comments still remain in the codebase.

The standalone RSF implementation and dedicated RSF test files have been deleted. The `rsfShadow` metadata field in `Sprint3PipelineMeta` has been removed from `hybrid-search.ts`. Residual mentions still exist in mixed regression files such as `cross-feature-integration-eval.vitest.ts`, `feature-eval-query-intelligence.vitest.ts`, and `search-fallback-tiered.vitest.ts`, and Stage 2 comments in `pipeline/stage2-fusion.ts` still say `RRF / RSF` even though the runtime path is RRF-only.

As of T315, the live hybrid path also avoids the older standard-first adaptive wrapper when building the shipped RRF merge. `mcp_server/lib/search/hybrid-search.ts` now precomputes fusion weights once from the shared `getAdaptiveWeights(...)` helper (or fixed 1.0/1.0 weights when adaptive fusion is off), then builds a single `fusionLists` payload for `fuseResultsMulti(...)`. This keeps the production path RRF-only and does not reintroduce RSF.

`SPECKIT_RSF_FUSION` may still appear as an inert config surface in documentation but has no runtime effect.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm (sole live method) |
| `shared/algorithms/adaptive-fusion.ts` | Shared | Exposes `getAdaptiveWeights(...)`, which supplies the precomputed live RRF channel weights |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Builds a single-pass weighted `fusionLists` payload for `fuseResultsMulti(...)`; no RSF runtime branch remains |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Residual comments still mention `RRF / RSF`; runtime fusion flow is RRF-only |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Adaptive weight helper coverage for the live RRF weighting inputs |
| `mcp_server/tests/cross-feature-integration-eval.vitest.ts` | Residual `SPECKIT_RSF_FUSION` references kept in mixed regression coverage |
| `mcp_server/tests/feature-eval-query-intelligence.vitest.ts` | Residual `SPECKIT_RSF_FUSION` env backup for evaluation coverage |
| `mcp_server/tests/search-fallback-tiered.vitest.ts` | Residual `SPECKIT_RSF_FUSION` env backup for fallback regression coverage |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Relative score fusion in shadow mode
- Current reality source: FEATURE_CATALOG.md
- Retirement note updated 2026-03-25 per deep review
