---
title: "Cache Module"
description: "Tool output caching with TTL, LRU eviction, and spec-document-aware invalidation paths."
trigger_phrases:
  - "tool cache"
  - "cache TTL"
  - "LRU eviction"
---

# Cache Module

> Tool output caching with TTL, LRU eviction, and spec-document-aware invalidation paths.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE](#4--usage)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The cache module provides in-memory caching for MCP tool outputs to reduce redundant operations and improve response times. It uses SHA-256 hashed keys for deterministic cache lookups and supports automatic TTL-based expiration. Cache invalidation is especially important for spec document indexing and document-aware retrieval flows.

### Key Characteristics

| Aspect | Value |
|--------|-------|
| **Default TTL** | 60 seconds |
| **Max Entries** | 1000 |
| **Eviction Strategy** | LRU (Least Recently Used) |
| **Cleanup Interval** | 30 seconds |
| **Key Generation** | SHA-256 hash of tool + canonicalized args |

### Configuration (Environment Variables)

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_TOOL_CACHE` | `true` | Enable/disable caching |
| `TOOL_CACHE_TTL_MS` | `60000` | TTL in milliseconds |
| `TOOL_CACHE_MAX_ENTRIES` | `1000` | Maximum cache entries |
| `TOOL_CACHE_CLEANUP_INTERVAL_MS` | `30000` | Cleanup interval in ms |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
cache/
├── tool-cache.ts          # Core in-memory tool output cache
├── embedding-cache.ts     # Persistent SQLite embedding cache with LRU eviction
├── scoring/               # Scoring namespace re-export
│   └── README.md             # Scoring re-export documentation
└── README.md              # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `tool-cache.ts` | Cache implementation with TTL, LRU eviction, invalidation and statistics |
| `embedding-cache.ts` | Persistent SQLite embedding cache: avoids re-computing embeddings for identical content. Uses content-hash + model-ID keys with LRU eviction (Sprint 3) |
| `scoring/README.md` | Documentation for cache-scoped scoring re-exports |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Core Operations

| Function | Purpose |
|----------|---------|
| `get(key)` | Retrieve cached value (returns null if expired) |
| `set(key, value, options)` | Store value with TTL and tool tracking |
| `has(key)` | Check if key exists and is valid |
| `del(key)` | Delete specific cache entry |

### Cache Key Generation

| Function | Purpose |
|----------|---------|
| `generateCacheKey(toolName, args)` | SHA-256 hash from tool name + canonicalized args |

### Cache Invalidation

| Function | Purpose |
|----------|---------|
| `invalidateByTool(toolName)` | Clear all entries for a specific tool |
| `invalidateByPattern(pattern)` | Clear entries matching regex pattern |
| `invalidateOnWrite(operation, context)` | Auto-invalidate after write operations |
| `clear()` | Clear entire cache |

Write-driven invalidation is used for memory and spec document changes so search and ranking do not serve stale `documentType`/`specLevel` context.

### High-Level Wrapper

```typescript
// Execute with caching - returns cached result or executes function
await withCache(toolName, args, asyncFn, options);
```

### Statistics and Lifecycle

| Function | Purpose |
|----------|---------|
| `getStats()` | Get cache hit/miss/eviction statistics |
| `resetStats()` | Reset statistics counters |
| `getConfig()` | Get current cache configuration |
| `isEnabled()` | Check if caching is enabled |
| `init()` | Initialize cache and start cleanup interval |
| `shutdown()` | Stop cleanup, clear cache, reset stats |

### Statistics Metrics

| Metric | Description |
|--------|-------------|
| `hits` | Cache hit count |
| `misses` | Cache miss count |
| `evictions` | Entries removed (TTL or LRU) |
| `invalidations` | Entries explicitly invalidated |
| `hitRate` | Percentage of hits vs total requests |

**Exported constant:** `CONFIG` (aliased from `TOOL_CACHE_CONFIG`)

### Scoring Subdirectory (`scoring/`)

Import scoring directly from `lib/scoring/`.

### Embedding Cache (`embedding-cache.ts`)

**Purpose**: Persistent SQLite-backed embedding cache to avoid redundant API calls for identical content.

| Aspect | Value |
|--------|-------|
| **Key Strategy** | SHA-256 content hash + model ID |
| **Storage** | SQLite table `embedding_cache` |
| **Eviction** | LRU-based eviction when capacity exceeded |
| **LRU Tracking** | `lastUsedAt` timestamp updated on cache hits |

| Function | Purpose |
|----------|---------|
| `initEmbeddingCacheTable(db)` | Create `embedding_cache` table (idempotent) |
| `getEmbeddingFromCache(db, contentHash, modelId)` | Retrieve cached embedding (updates LRU timestamp) |
| `putEmbeddingInCache(db, contentHash, modelId, embedding, dimensions)` | Store embedding in cache |
| `getEmbeddingCacheStats(db)` | Get cache statistics (total entries, size, age range) |
| `evictOldestEmbeddings(db, keepCount)` | LRU eviction to trim cache to `keepCount` entries |

<!-- /ANCHOR:features -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

### Basic Import

```typescript
import { get, set, withCache, getStats } from './tool-cache';
```

### Simple Cache Operations

```typescript
import { generateCacheKey, set, get } from './tool-cache';

const key = generateCacheKey('memory_search', { query: 'test' });

// Store value
set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });

// Retrieve value
const cached = get(key);
```

### Execute with Caching

```typescript
import { withCache } from './tool-cache';

const result = await withCache(
  'memory_search',
  { query: 'test' },
  async () => await performSearch({ query: 'test' }),
  { ttlMs: 60000 }
);
```

### Invalidate on Write

```typescript
import { invalidateOnWrite } from './tool-cache';

// After memory_save operation
invalidateOnWrite('save', { specFolder: 'specs/<###-spec-name>' });
// Automatically clears memory_search, memory_match_triggers, etc.
```

### Monitor Cache Performance

```typescript
import { getStats } from './tool-cache';

const stats = getStats();
// { hits: 42, misses: 8, hitRate: '84.00%', currentSize: 15, ... }
```

<!-- /ANCHOR:usage -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../architecture/](../architecture/) | Layer definitions and token budgets |
| [../response/](../response/) | Response envelope formatting |

### Related Modules

| Module | Relationship |
|--------|--------------|
| `tool-cache.ts` | In-memory cache lifecycle, invalidation, and stats APIs |
| `embedding-cache.ts` | Persistent embedding cache keyed by content hash + model |
| `scoring/` | Re-export surface for composite scoring in cache namespace |

<!-- /ANCHOR:related -->

---

**Version**: 1.9.0
**Last Updated**: 2026-03-19
