---
title: "Deep Dive - Gemini: Feature Flag Audit"
source: "cli-gemini (gemini-3.1-pro-preview)"
date: 2026-03-02
---

# Deep Dive: Feature Flag Audit (search-flags.ts)

## All 20 Exported Functions in search-flags.ts

All use `isFeatureEnabled()` which returns `true` when env var is absent/empty/"true".

| Function | Flag | Default | Deprecated? | Reads Env? |
|----------|------|---------|-------------|------------|
| isMMREnabled() | SPECKIT_MMR | true | No | Yes |
| isTRMEnabled() | SPECKIT_TRM | true | No | Yes |
| isMultiQueryEnabled() | SPECKIT_MULTI_QUERY | true | No | Yes |
| isCrossEncoderEnabled() | SPECKIT_CROSS_ENCODER | true | No | Yes |
| isSearchFallbackEnabled() | SPECKIT_SEARCH_FALLBACK | true | No | Yes |
| isFolderDiscoveryEnabled() | SPECKIT_FOLDER_DISCOVERY | true | No | Yes |
| isDocscoreAggregationEnabled() | SPECKIT_DOCSCORE_AGGREGATION | true | No | Yes |
| isSaveQualityGateEnabled() | SPECKIT_SAVE_QUALITY_GATE | true | No | Yes |
| isReconsolidationEnabled() | SPECKIT_RECONSOLIDATION | true | No | Yes |
| isNegativeFeedbackEnabled() | SPECKIT_NEGATIVE_FEEDBACK | true | No | Yes |
| isPipelineV2Enabled() | _(SPECKIT_PIPELINE_V2)_ | true | **YES** | **No (hardcoded)** |
| isEmbeddingExpansionEnabled() | SPECKIT_EMBEDDING_EXPANSION | true | No | Yes |
| isConsolidationEnabled() | SPECKIT_CONSOLIDATION | true | No | Yes |
| isEncodingIntentEnabled() | SPECKIT_ENCODING_INTENT | true | No | Yes |
| isGraphSignalsEnabled() | SPECKIT_GRAPH_SIGNALS | true | No | Yes |
| isCommunityDetectionEnabled() | SPECKIT_COMMUNITY_DETECTION | true | No | Yes |
| isMemorySummariesEnabled() | SPECKIT_MEMORY_SUMMARIES | true | No | Yes |
| isAutoEntitiesEnabled() | SPECKIT_AUTO_ENTITIES | true | No | Yes |
| isEntityLinkingEnabled() | SPECKIT_ENTITY_LINKING | true | No | Yes |
| isDegreeBoostEnabled() | SPECKIT_DEGREE_BOOST | true | No | Yes |

## Discrepancies Found

### 1. Flag in code but NOT in doc (P1)
**SPECKIT_ADAPTIVE_FUSION** — evaluated in `lib/search/adaptive-fusion.ts` but completely missing from the documentation Feature Flag Reference table.

### 2. Deprecated in code but active in doc (P0 — already known as C-3)
**SPECKIT_PIPELINE_V2** — hardcoded true, marked @deprecated in code. Doc says it's an active toggle.

### 3. All other flags: defaults match between code and doc
No other discrepancies in default values or existence.
