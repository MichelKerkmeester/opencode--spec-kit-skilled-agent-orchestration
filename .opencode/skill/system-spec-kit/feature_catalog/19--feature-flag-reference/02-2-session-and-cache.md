---
title: "2. Session and Cache"
description: "This document captures the implemented behavior, source references, and validation scope for 2. Session and Cache."
---

# 2. Session and Cache

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 2. Session and Cache.

These settings control short-term memory and caching behavior. They decide how long the system remembers what it already returned, how cache entries expire, and whether duplicate results are filtered across a session.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DISABLE_SESSION_DEDUP` | `false` | boolean | `lib/session/session-manager.ts` | When `'true'`, disables cross-turn session deduplication entirely. All memories are returned on every call regardless of whether they were already sent in this session. |
| `ENABLE_BM25` | `true` | boolean | `lib/search/bm25-index.ts` | Controls the in-memory BM25 search channel. When disabled (set to `'false'`), the BM25 channel is excluded from multi-channel retrieval. The FTS5 SQLite channel is unaffected. |
| `ENABLE_TOOL_CACHE` | `true` | boolean | `lib/cache/tool-cache.ts` | Master switch for the tool result cache. When disabled (set to `'false'`), all cache reads return `null` and writes are no-ops. Cache is always bypassed when this is off. |
| `SESSION_DEDUP_DB_UNAVAILABLE_MODE` | `'block'` | string | `lib/session/session-manager.ts` | Behavior when the session database is unavailable. `'allow'` permits all memories through (no dedup). `'block'` (default) rejects dedup attempts, returning an error rather than silently allowing duplicates. |
| `SESSION_MAX_ENTRIES` | `100` | number | `lib/session/session-manager.ts` | Maximum number of memory entries tracked per session for deduplication purposes. When entries exceed this cap, the oldest entries are evicted via LRU deletion (`enforceEntryLimit`). |
| `SESSION_TTL_MINUTES` | `30` | number | `lib/session/session-manager.ts` | How long session deduplication records are retained after last use, in minutes. Sessions older than this are cleaned up on the next periodic maintenance pass. |
| `STALE_CLEANUP_INTERVAL_MS` | `3600000` | number | `lib/session/session-manager.ts` | Interval in milliseconds between stale session cleanup sweeps. Default is 1 hour (3,600,000 ms). Stale sessions are those whose last activity exceeds `STALE_SESSION_THRESHOLD_MS`. |
| `STALE_SESSION_THRESHOLD_MS` | `86400000` | number | `lib/session/session-manager.ts` | Age in milliseconds at which a session is considered stale and eligible for cleanup. Default is 24 hours (86,400,000 ms). |
| `TOOL_CACHE_CLEANUP_INTERVAL_MS` | `30000` | number | `lib/cache/tool-cache.ts` | Interval in milliseconds between expired-entry eviction sweeps of the tool cache. Default is 30 seconds (30,000 ms). The interval timer is unrefed so it does not prevent process exit. |
| `TOOL_CACHE_MAX_ENTRIES` | `1000` | number | `lib/cache/tool-cache.ts` | Maximum number of entries the tool cache holds before evicting the oldest entry on insert. Eviction is O(1) using insertion-order iteration over the underlying Map. |
| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 2. Session and Cache
- Current reality source: FEATURE_CATALOG.md
