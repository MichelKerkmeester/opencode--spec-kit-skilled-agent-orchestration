---
title: "Embedding cache"
description: "Describes the SQLite-backed embedding cache keyed by SHA-256 content hash and model ID that avoids redundant embedding API calls on re-index, plus the request-scoped embedding reuse path for MMR reranking."
---

# Embedding cache

## 1. OVERVIEW

Describes the SQLite-backed embedding cache keyed by SHA-256 content hash and model ID that avoids redundant embedding API calls on re-index, plus the request-scoped embedding reuse path for MMR reranking.

Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.

---

## 2. CURRENT REALITY

Embedding API calls are the most expensive operation in the indexing pipeline. The embedding cache stores generated embeddings in a SQLite table keyed by SHA-256 content hash and model ID. On re-index, the system checks the cache first.

A hit returns the stored embedding in microseconds instead of making a network round-trip that costs money and takes hundreds of milliseconds. LRU eviction via `last_used_at` prevents unbounded cache growth, and the `INSERT OR REPLACE` strategy handles model upgrades cleanly.

T316 adds a second cache layer in the live search path. During hybrid retrieval, the vector channel now requests embeddings for its top-K hits and stores them in a request-scoped `vectorEmbeddingCache`. When MMR reranking runs, it seeds a local `embeddingMap` from that cache first and only queries `vec_memories` for numeric IDs that are still missing, avoiding redundant DB fetches for rows that already came back from the vector channel.

The reranking merge path was also tightened to avoid repeated linear lookups. After MMR returns diversified candidates, `hybrid-search.ts` now rehydrates the original result rows through a `rerankedById` map keyed by canonical result ID rather than using repeated `reranked.find(...)` scans.

The cache has no feature flag because cache misses fall through to normal embedding generation with zero behavioral change.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Request-scoped `vectorEmbeddingCache` reuse for MMR reranking and map-based rehydration of diversified rows |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search regression coverage around fusion/rerank pipeline behavior |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Embedding cache
- Current reality source: FEATURE_CATALOG.md
