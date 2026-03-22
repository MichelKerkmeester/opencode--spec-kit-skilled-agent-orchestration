---
title: "Fusion policy shadow evaluation V2"
description: "Fusion policy shadow evaluation V2 runs RRF, minmax-linear, and zscore-linear fusion policies in parallel on each query, returning the active policy result while capturing shadow telemetry for the alternatives, gated by the SPECKIT_FUSION_POLICY_SHADOW_V2 flag."
---

# Fusion policy shadow evaluation V2

## 1. OVERVIEW

Fusion policy shadow evaluation V2 runs RRF, minmax-linear, and zscore-linear fusion policies in parallel on each query, returning the active policy result while capturing shadow telemetry for the alternatives, gated by the `SPECKIT_FUSION_POLICY_SHADOW_V2` flag.

Different ways of combining search results from multiple channels (vector, BM25, graph) can produce different rankings. Rather than guessing which fusion method works best, this feature runs all three methods side-by-side on every query. The production result comes from the active policy, but the other two policies produce telemetry data (NDCG@10, MRR@5, latency) that can be compared offline. This shadow approach lets the system gather evidence for policy graduation without affecting live rankings.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_FUSION_POLICY_SHADOW_V2=false` to disable shadow evaluation.

The fusion lab module (`shared/algorithms/fusion-lab.ts`) implements three fusion policies:
- **rrf**: Standard Reciprocal Rank Fusion via `fuseResultsMulti()`.
- **minmax_linear**: Min-max normalized scores fused with weighted linear combination.
- **zscore_linear**: Z-score normalized scores fused with weighted linear combination (with `ZSCORE_EPSILON = 1e-9` for near-zero stddev protection).

Each policy run produces a `PolicyTelemetry` record with NDCG@10, MRR@5, and wall-clock latency. Shadow results are telemetry-only and have no ranking side effects.

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
- Current reality source: shared/algorithms/fusion-lab.ts module header and implementation
