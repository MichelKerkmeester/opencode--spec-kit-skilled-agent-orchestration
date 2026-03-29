---
title: "Adaptive-fusion mode flag"
description: "`SPECKIT_ADAPTIVE_FUSION` remains a live runtime flag that selects between fixed and adaptive fusion modes in hybrid search."
---

# Adaptive-fusion mode flag

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This entry records the current runtime behavior of the adaptive-fusion flag surface.

`SPECKIT_ADAPTIVE_FUSION` is still a live operator-controlled runtime flag. The shared adaptive-fusion module still decides whether live hybrid search uses fixed or adaptive weight inputs, even though the hot path now precomputes those weights directly instead of always routing through `hybridAdaptiveFuse(...)`.

---

## 2. CURRENT REALITY

`mcp_server/lib/search/hybrid-search.ts` still runs a live fusion stage for semantic and lexical evidence, but it now builds the weighted `fusionLists` directly in the hot path instead of always routing those channels through `hybridAdaptiveFuse(semanticResults, keywordResults, intent)`.

`shared/algorithms/adaptive-fusion.ts` still defines `FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION'`, exposes `isAdaptiveFusionEnabled()`, and checks the flag before choosing the fusion mode. When the flag is enabled, `hybridAdaptiveFuse(...)` computes intent-aware weights with `getAdaptiveWeights(intent, documentType)` and returns adaptive results. When the flag is disabled, it returns `standardFuse(...)` results with fixed weights instead. Partial rollout still applies through `SPECKIT_ROLLOUT_PERCENT`.

The shared helper surface is now also used more directly by the live hybrid pipeline. `getAdaptiveWeights(intent, documentType)` remains exported from `shared/algorithms/adaptive-fusion.ts`, and `mcp_server/lib/search/hybrid-search.ts` now precomputes those weights once to build its weighted `fusionLists` payload before calling `fuseResultsMulti(...)`. `hybridAdaptiveFuse(...)` remains the flag-gated wrapper that preserves the full adaptive-vs-standard contract, but the hot path no longer needs to run a standard fuse first just to recover weights for the live merge.

The current shipped reality is therefore a live runtime mode selector, not a deprecated or removed toggle. `SPECKIT_ADAPTIVE_FUSION` controls whether hybrid search uses fixed fusion or adaptive fusion, and the adaptive branch selects weights according to query intent such as `understand`, `fix_bug`, or `find_spec`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/hybrid-search.ts` | Search | Precomputes the live weighted `fusionLists` once and still honors `SPECKIT_ADAPTIVE_FUSION` when choosing adaptive vs fixed weight inputs |
| `shared/algorithms/adaptive-fusion.ts` | Shared algorithm | Reads `SPECKIT_ADAPTIVE_FUSION`, exposes `getAdaptiveWeights(intent, documentType)`, and chooses between adaptive fusion and standard fixed fusion |
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Tests | Verifies that flag-off returns standard fusion and flag-on returns intent-aware adaptive weights, including rollout behavior |

---

## 4. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Source feature title: Adaptive-fusion mode flag
- Source spec: Deep research remediation 2026-03-26
