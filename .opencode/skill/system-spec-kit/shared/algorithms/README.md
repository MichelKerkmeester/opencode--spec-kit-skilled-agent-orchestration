---
title: "Algorithms"
description: "Retrieval fusion and reranking algorithms for shared search pipelines."
trigger_phrases:
  - "RRF fusion"
  - "adaptive fusion"
  - "MMR reranker"
---

# Algorithms

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
- [3. KEY FILES](#3--key-files)
- [4. STABLE API](#4--stable-api)
- [5. BOUNDARIES](#5--boundaries)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`algorithms/` owns ranking logic used after retrieval candidates are available. The folder combines ranked lists, applies intent-aware weights and can rerank embedding-backed candidates for diversity.

Current state:

- `rrf-fusion.ts` provides Reciprocal Rank Fusion helpers for two-list, multi-list and cross-query fusion.
- `adaptive-fusion.ts` selects weighted fusion behavior from intent, document type and feature flags.
- `mmr-reranker.ts` applies Maximal Marginal Relevance to reduce duplicate candidate content.
- `index.ts` is the public barrel for algorithm consumers.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
algorithms/
+-- index.ts              # Public barrel exports
+-- rrf-fusion.ts         # Rank aggregation and score normalization
+-- adaptive-fusion.ts    # Intent-weighted fusion and fallback metadata
+-- mmr-reranker.ts       # Embedding similarity and diversity reranking
`-- README.md
```

Allowed dependency direction:

```text
callers -> algorithms/index.ts
algorithms/index.ts -> algorithm modules
adaptive-fusion.ts -> rrf-fusion.ts
algorithm modules -> shared types or local constants
```

Disallowed dependency direction:

```text
algorithm modules -> MCP tool handlers
algorithm modules -> database adapters
algorithm modules -> embedding providers
rrf-fusion.ts -> adaptive-fusion.ts
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Re-exports public algorithm modules for package consumers. |
| `rrf-fusion.ts` | Scores ranked retrieval lists with RRF, overlap bonuses and source tracking. |
| `adaptive-fusion.ts` | Builds weighted fusion from query intent and runtime flags, with standard fallback. |
| `mmr-reranker.ts` | Computes cosine similarity and selects diverse results from embedding candidates. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:stable-api -->
## 4. STABLE API

| Export | File | Contract |
|---|---|---|
| `fuseResults(vectorResults, keywordResults, k)` | `rrf-fusion.ts` | Returns fused results with `rrfScore`, `sources`, `sourceScores` and convergence data. |
| `fuseResultsMulti(rankedLists, options)` | `rrf-fusion.ts` | Fuses any number of ranked lists with optional source weights. |
| `fuseResultsCrossVariant(variants, options)` | `rrf-fusion.ts` | Combines results from expanded query variants. |
| `normalizeRrfScores(results)` | `rrf-fusion.ts` | Normalizes RRF scores to the `0` to `1` range. |
| `hybridAdaptiveFuse(lists, options)` | `adaptive-fusion.ts` | Uses adaptive fusion when enabled, otherwise standard fusion. |
| `adaptiveFuse(lists, options)` | `adaptive-fusion.ts` | Applies intent and document-type weights to ranked lists. |
| `standardFuse(lists, options)` | `adaptive-fusion.ts` | Provides equal-weight deterministic fusion. |
| `getAdaptiveWeights(intent, docType)` | `adaptive-fusion.ts` | Returns the active semantic, keyword, recency and graph weights. |
| `applyMMR(candidates, config)` | `mmr-reranker.ts` | Selects diverse candidates by relevance and vector similarity. |
| `computeCosine(a, b)` | `mmr-reranker.ts` | Computes cosine similarity and guards large vector length mismatches. |

Use `index.ts` for normal imports. Import a module directly only for tests or when a caller needs a module-specific type.

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Inputs | Accept candidate arrays, ranked lists, scores, embeddings and option objects only. |
| Outputs | Return scored result arrays and metadata. Do not perform response formatting here. |
| Feature flags | Read algorithm flags in the algorithm that owns the behavior. |
| Storage | Do not open SQLite, file handles or network clients from this folder. |
| Embeddings | Consume vectors supplied by callers. Do not generate embeddings here. |

Main flow:

```text
retrieval channels
  -> ranked lists
  -> RRF or adaptive fusion
  -> optional MMR rerank
  -> scored candidates for response assembly
```

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `index.ts` | Module | Public import surface for algorithm consumers. |
| `hybridAdaptiveFuse` | Function | Main adaptive fusion path for hybrid retrieval. |
| `fuseResultsMulti` | Function | Main RRF path when callers already have ranked lists. |
| `applyMMR` | Function | Optional diversity pass after fusion. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/algorithms/README.md
```

Expected result: the validator exits with code `0`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../README.md`](../README.md)
- [`../contracts/README.md`](../contracts/README.md)
- [`../embeddings/README.md`](../embeddings/README.md)

<!-- /ANCHOR:related -->
