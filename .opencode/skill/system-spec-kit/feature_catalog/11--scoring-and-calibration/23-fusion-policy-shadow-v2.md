---
title: "DEPRECATED: Fusion policy shadow evaluation V2"
description: "DEPRECATED: This module is @deprecated, commented out of the barrel export (index.ts:8-10), not consumed by production code, and the flag SPECKIT_FUSION_POLICY_SHADOW_V2 does not exist in search-flags.ts."
---

# DEPRECATED: Fusion policy shadow evaluation V2

> **DEPRECATED:** This module is `@deprecated`, commented out of the barrel export (`index.ts:8-10`), not consumed by production code, and the flag `SPECKIT_FUSION_POLICY_SHADOW_V2` does not exist in `search-flags.ts`. This feature does not run on queries.

## 1. OVERVIEW

DEPRECATED experimental fusion policy shadow module that compares RRF, minmax-linear, and zscore-linear fusion policies in isolation. It is retained for direct module-level evaluation and tests only, and is not part of the production query path.

Different ways of combining search results from multiple channels (vector, BM25, graph) can produce different rankings. This module was built to compare three fusion methods side-by-side and capture telemetry data (NDCG@10, MRR@5, latency) for offline analysis. That experiment infrastructure now lives only as a deprecated module for isolated evaluation, not as an active live-query shadow path.

---

## 2. CURRENT REALITY

Deprecated and not part of production execution.

The fusion lab module (`shared/algorithms/fusion-lab.ts`) still implements three fusion policies:
- **rrf**: Standard Reciprocal Rank Fusion via `fuseResultsMulti()`.
- **minmax_linear**: Min-max normalized scores fused with weighted linear combination.
- **zscore_linear**: Z-score normalized scores fused with weighted linear combination (with `ZSCORE_EPSILON = 1e-9` for near-zero stddev protection).

The file is marked `@deprecated`, commented out of the shared algorithms barrel export (`index.ts:8-10`), and not wired into the Stage 2 search pipeline. The `SPECKIT_FUSION_POLICY_SHADOW_V2` flag is referenced inside the module's isolated tests, but it does not exist in `search-flags.ts` and is not registered as a production flag. The module does not run on queries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/algorithms/fusion-lab.ts` | Shared | Multi-policy fusion comparison, minmax/zscore normalization, shadow telemetry |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion (active policy baseline) |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/fusion-lab.vitest.ts` | Fusion lab policy comparison, telemetry capture |
| `mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts` | RSF vs RRF ranking correlation |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Fusion policy shadow evaluation V2
- Current reality source: shared/algorithms/fusion-lab.ts deprecation header and `shared/algorithms/index.ts` barrel export removal
