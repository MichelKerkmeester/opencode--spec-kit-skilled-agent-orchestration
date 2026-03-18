---
title: "Embedding cache"
description: "Describes the SQLite-backed embedding cache keyed by SHA-256 content hash and model ID that avoids redundant embedding API calls on re-index."
---

# Embedding cache

## 1. OVERVIEW

Describes the SQLite-backed embedding cache keyed by SHA-256 content hash and model ID that avoids redundant embedding API calls on re-index.

Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.

---

## 2. CURRENT REALITY

Embedding API calls are the most expensive operation in the indexing pipeline. The embedding cache stores generated embeddings in a SQLite table keyed by SHA-256 content hash and model ID. On re-index, the system checks the cache first.

A hit returns the stored embedding in microseconds instead of making a network round-trip that costs money and takes hundreds of milliseconds. LRU eviction via `last_used_at` prevents unbounded cache growth, and the `INSERT OR REPLACE` strategy handles model upgrades cleanly.

The cache has no feature flag because cache misses fall through to normal embedding generation with zero behavioral change.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/embedding-cache.vitest.ts` | Embedding cache tests |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Embedding cache
- Current reality source: feature_catalog.md
