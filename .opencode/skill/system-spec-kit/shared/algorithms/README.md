---
title: "Algorithms"
description: "Retrieval fusion and diversity algorithms for hybrid RAG search, including Reciprocal Rank Fusion, adaptive weighted fusion and Maximal Marginal Relevance reranking."
trigger_phrases:
  - "RRF fusion"
  - "reciprocal rank fusion"
  - "adaptive fusion"
  - "MMR reranker"
  - "maximal marginal relevance"
  - "hybrid search fusion"
  - "result fusion"
---

# Algorithms

> Retrieval fusion and diversity algorithms for the hybrid RAG pipeline. Combines ranked lists from multiple search channels (vector, keyword, BM25, graph) into a single scored result set with configurable weighting, convergence bonuses and diversity pruning.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. KEY EXPORTS](#3--key-exports)
- [4. RELATED DOCUMENTS](#4--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder contains three core algorithms that power the retrieval fusion pipeline:

1. **RRF Fusion** (`rrf-fusion.ts`) -- Reciprocal Rank Fusion for combining ranked lists from different search channels. Supports two-list, multi-list and cross-variant fusion modes with optional score normalization and convergence bonuses for items that appear across multiple sources.

2. **Adaptive Fusion** (`adaptive-fusion.ts`) -- Intent-aware weighted RRF fusion. Selects weight profiles (semantic, keyword, recency, graph) based on classified query intent (e.g., `fix_bug`, `find_decision`, `refactor`). Includes feature-flag gating, rollout targeting, document-type weight adjustments, degraded-mode fallback and dark-run comparison mode.

3. **MMR Reranker** (`mmr-reranker.ts`) -- Maximal Marginal Relevance post-fusion diversity pass. Balances relevance against redundancy using cosine similarity on dense embeddings. Configurable lambda trade-off and candidate pool cap.

The barrel file (`index.ts`) re-exports all public APIs from the three modules.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```text
algorithms/
├── README.md              # This file
├── index.ts               # Barrel re-exports for all algorithm modules
├── adaptive-fusion.ts     # Intent-weighted adaptive RRF with feature flags
├── mmr-reranker.ts        # Maximal Marginal Relevance diversity reranker
└── rrf-fusion.ts          # Core Reciprocal Rank Fusion (two-list, multi, cross-variant)
```

| File                   | LOC  | Description                                                                 |
| ---------------------- | ---- | --------------------------------------------------------------------------- |
| `index.ts`             | 8    | Barrel file re-exporting `rrf-fusion`, `adaptive-fusion` and `mmr-reranker` |
| `adaptive-fusion.ts`   | 426  | Weighted fusion with intent profiles, recency boost, dark-run diff mode     |
| `mmr-reranker.ts`      | 153  | Cosine similarity computation and greedy MMR selection loop                 |
| `rrf-fusion.ts`        | 491  | Two-list and multi-list RRF, cross-variant fusion, score normalization      |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:key-exports -->
## 3. KEY EXPORTS

### rrf-fusion.ts

| Export                       | Kind       | Description                                                    |
| ---------------------------- | ---------- | -------------------------------------------------------------- |
| `fuseResults`                | Function   | Two-list RRF fusion with configurable k constant               |
| `fuseResultsMulti`           | Function   | Multi-list weighted RRF with convergence bonus                 |
| `fuseResultsCrossVariant`    | Function   | Cross-variant RRF for multi-query RAG pipelines                |
| `fuseScoresAdvanced`         | Function   | Post-fusion term-match bonus augmentation                      |
| `unifiedSearch`              | Function   | Async orchestrator running multiple search functions then fusing |
| `normalizeRrfScores`         | Function   | Min-max normalization of RRF scores to [0,1]                   |
| `isRrfEnabled`               | Function   | Feature-flag check (`SPECKIT_RRF` env var)                     |
| `SOURCE_TYPES`               | Constant   | Canonical source labels (vector, fts, bm25, graph, keyword)    |
| `DEFAULT_K`                  | Constant   | RRF smoothing constant (60)                                    |
| `RrfItem`, `FusionResult`    | Type       | Core input/output types for the fusion pipeline                |
| `RankedList`, `SearchFunction` | Type     | Multi-list and async search descriptors                        |

### adaptive-fusion.ts

| Export                       | Kind       | Description                                                    |
| ---------------------------- | ---------- | -------------------------------------------------------------- |
| `hybridAdaptiveFuse`         | Function   | Main entry point: flag-gated adaptive or standard fusion       |
| `adaptiveFuse`               | Function   | Weighted RRF fusion with recency boost                         |
| `standardFuse`               | Function   | Equal-weight deterministic RRF fallback                        |
| `getAdaptiveWeights`         | Function   | Compute weights from intent and document type                  |
| `isAdaptiveFusionEnabled`    | Function   | Feature-flag + rollout check                                   |
| `INTENT_WEIGHT_PROFILES`     | Constant   | Per-intent weight profiles (understand, fix_bug, refactor etc) |
| `FusionWeights`              | Interface  | Weight shape: semantic, keyword, recency, graph, causal bias   |
| `AdaptiveFusionResult`       | Interface  | Fusion output with optional degraded-mode and dark-run data    |

### mmr-reranker.ts

| Export                       | Kind       | Description                                                    |
| ---------------------------- | ---------- | -------------------------------------------------------------- |
| `applyMMR`                   | Function   | Greedy MMR selection balancing relevance vs diversity           |
| `computeCosine`              | Function   | Cosine similarity between two embedding vectors                |
| `MMRCandidate`               | Interface  | Input candidate with id, score and dense embedding             |
| `MMRConfig`                  | Interface  | Config: lambda trade-off, result limit, max candidates         |
| `DEFAULT_MAX_CANDIDATES`     | Constant   | Hard cap on input pool size (20)                               |

<!-- /ANCHOR:key-exports -->

---

<!-- ANCHOR:related -->
## 4. RELATED DOCUMENTS

- **Contracts**: `../contracts/retrieval-trace.ts` defines pipeline trace types and degraded-mode contracts
- **Scoring**: `../scoring/` computes composite folder relevance scores
- **Embeddings**: `../embeddings/` generates dense vectors consumed by MMR
- **Consumers**: MCP server retrieval pipeline, `memory_search` and `memory_match_triggers` endpoints

<!-- /ANCHOR:related -->

---
