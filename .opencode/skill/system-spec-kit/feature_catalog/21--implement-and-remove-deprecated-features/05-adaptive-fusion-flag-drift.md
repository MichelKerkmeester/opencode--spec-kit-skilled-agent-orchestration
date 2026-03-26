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

`SPECKIT_ADAPTIVE_FUSION` is still a live operator-controlled runtime flag. The hybrid search pipeline always routes semantic plus lexical fusion through `hybridAdaptiveFuse(...)`, and that helper decides whether to apply fixed or adaptive fusion based on the flag state and rollout policy.

---

## 2. CURRENT REALITY

`mcp_server/lib/search/hybrid-search.ts` always routes the semantic and lexical channel sets through `hybridAdaptiveFuse(semanticResults, keywordResults, intent)`. That means the fusion stage is always present in the live path, but the mode used inside that stage is delegated to the shared adaptive-fusion helper.

`shared/algorithms/adaptive-fusion.ts` still defines `FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION'`, exposes `isAdaptiveFusionEnabled()`, and checks the flag before choosing the fusion mode. When the flag is enabled, `hybridAdaptiveFuse(...)` computes intent-aware weights with `getAdaptiveWeights(intent, documentType)` and returns adaptive results. When the flag is disabled, it returns `standardFuse(...)` results with fixed weights instead. Partial rollout still applies through `SPECKIT_ROLLOUT_PERCENT`.

The current shipped reality is therefore a live runtime mode selector, not a deprecated or removed toggle. `SPECKIT_ADAPTIVE_FUSION` controls whether hybrid search uses fixed fusion or adaptive fusion, and the adaptive branch selects weights according to query intent such as `understand`, `fix_bug`, or `find_spec`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/hybrid-search.ts` | Search | Always routes semantic + lexical fusion through `hybridAdaptiveFuse(...)`, then applies the returned weights back onto the live channel lists |
| `shared/algorithms/adaptive-fusion.ts` | Shared algorithm | Reads `SPECKIT_ADAPTIVE_FUSION`, computes intent-aware weights, and chooses between adaptive fusion and standard fixed fusion |
| `mcp_server/tests/adaptive-fusion.vitest.ts` | Tests | Verifies that flag-off returns standard fusion and flag-on returns intent-aware adaptive weights, including rollout behavior |

---

## 4. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Source feature title: Adaptive-fusion mode flag
- Source spec: Deep research remediation 2026-03-26
