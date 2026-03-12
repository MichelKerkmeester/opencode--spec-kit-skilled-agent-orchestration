# Tool-level TTL cache

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Tool-level TTL cache.

## 2. CURRENT REALITY

The tool cache (`lib/cache/tool-cache.ts`) provides a per-tool, TTL-based in-memory cache that sits in front of expensive operations like embedding generation and database queries. Each cache entry is keyed by a SHA-256 hash of the tool name plus input parameters and expires after a configurable TTL (default 60 seconds via `TOOL_CACHE_TTL_MS`). Maximum cache size is governed by `TOOL_CACHE_MAX_ENTRIES` (default 1000) with oldest-entry eviction on overflow.

Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_delete`, and `memory_bulk_delete` via the mutation hooks system.

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

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Tool-level TTL cache
- Current reality source: audit-D04 gap backfill
