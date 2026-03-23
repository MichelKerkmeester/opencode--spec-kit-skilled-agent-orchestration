---
title: "Tool-level TTL cache"
description: "Describes the per-tool TTL-based in-memory cache that reduces expensive embedding and database operations by SHA-256 keyed deduplication with configurable TTL and oldest-entry eviction."
---

# Tool-level TTL cache

## 1. OVERVIEW

Describes the per-tool TTL-based in-memory cache that reduces expensive embedding and database operations by SHA-256 keyed deduplication with configurable TTL and oldest-entry eviction.

When you ask the same question twice within a short time, the system should not redo all the expensive work. This feature remembers recent results for up to 60 seconds so repeat requests get instant answers from the cache. When you save, update or delete a memory, the cache for affected searches is cleared automatically so you never see stale results.

---

## 2. CURRENT REALITY

The tool cache (`lib/cache/tool-cache.ts`) provides a per-tool, TTL-based in-memory cache that sits in front of expensive operations like embedding generation and database queries. Each cache entry is keyed by a SHA-256 hash of the tool name plus input parameters and expires after a configurable TTL (default 60 seconds via `TOOL_CACHE_TTL_MS`). Maximum cache size is governed by `TOOL_CACHE_MAX_ENTRIES` (default 1000) with oldest-entry eviction on overflow.

Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cache/tool-cache.ts` | Lib | TTL-based tool cache with eviction |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Cache invalidation on mutations |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/tool-cache.vitest.ts` | Tool cache tests |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Tool-level TTL cache
- Current reality source: audit-D04 gap backfill
