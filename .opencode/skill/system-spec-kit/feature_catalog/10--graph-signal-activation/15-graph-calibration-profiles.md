---
title: "Graph calibration profiles and community thresholds"
description: "Graph calibration profiles define weight caps, RRF fusion overflow limits, and Louvain community detection threshold configuration as an active graduated feature in the live Stage 2 pipeline. Weight cap enforcement is wired end-to-end; Louvain activation thresholds are implemented and tested but not consumed by the community detection pipeline."
---

# Graph calibration profiles and community thresholds

## 1. OVERVIEW

Graph calibration profiles enforce weight caps, RRF fusion overflow limits, and define Louvain community detection activation thresholds, with named presets controlled by the `SPECKIT_GRAPH_CALIBRATION_PROFILE` flag.

When graph signals contribute to search scoring, they need guardrails to prevent any single graph feature from dominating results. This feature provides named calibration profiles that set caps on graph weights, fusion scores, and community boost values. It also defines Louvain community detection activation thresholds (density and size gates), though the community detection pipeline does not currently consume these thresholds — `shouldActivateLouvain()` is exported and tested but not called from the production pipeline. Two built-in profiles exist: a conservative default and a tighter aggressive variant.

---

## 2. CURRENT REALITY

The calibration module defines two profiles. The default profile sets `GRAPH_WEIGHT_CAP = 0.05`, `n2aCap = 0.10`, `n2bCap = 0.10`, `louvainMinDensity = 0.3`, and `louvainMinSize = 10`. The aggressive profile tightens these to `graphWeightCap = 0.03`, `n2aCap = 0.07`, `n2bCap = 0.07`, `louvainMinDensity = 0.5`, and `louvainMinSize = 20`. Community score boost is capped at `COMMUNITY_SCORE_CAP = 0.03` (secondary signal only).

The live Stage 2 pipeline applies `applyCalibrationProfile()` after graph signals at `stage2-fusion.ts:882`, so `SPECKIT_GRAPH_CALIBRATION_PROFILE` actively controls runtime weight cap enforcement.

The Louvain activation threshold logic (`shouldActivateLouvain()`) is fully implemented and tested but is not wired into the community detection pipeline end-to-end. The community detection module (`community-detection.ts`) is gated by its own `SPECKIT_COMMUNITY_DETECTION` flag independently.

The module also includes an ablation harness with MRR and NDCG computation for per-intent evaluation of graph features.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/graph-calibration.ts` | Lib | Calibration profiles, Louvain thresholds, weight cap enforcement, ablation harness |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isGraphCalibrationProfileEnabled()` unified flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/graph-calibration.vitest.ts` | Profile selection, Louvain activation gates, weight cap enforcement, ablation metrics |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Graph calibration profiles and community thresholds
- Current reality source: graph-calibration.ts module header and implementation
