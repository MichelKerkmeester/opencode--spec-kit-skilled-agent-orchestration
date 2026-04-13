---
title: "Add Reranker Cache Telemetry - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [x] `getRerankerStatus()` returns a `cache` block with `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`. Evidence: `cross-encoder.ts` now exposes all seven fields in `getRerankerStatus()`.
- [x] Fresh hits, misses, stale hits, and evictions are counted from the real cache flow in `mcp_server/lib/search/cross-encoder.ts:424-466`. Evidence: the live cache lookup path increments `hits`, `misses`, `staleHits`, and `evictions` directly around cache hit, stale-hit, and delete flow.
- [x] `resetSession()` clears the telemetry counters along with the rest of the reranker session state. Evidence: `resetSession()` zeroes all cache counters, clears cache entries, and resets latency/circuit state.
## P1 (Should Fix)
- [x] The telemetry scope is explicitly process-wide, matching `../research/research.md:124-128,247-250`. Evidence: the cache telemetry object is module-level state next to the shared cache map in `cross-encoder.ts`.
- [x] `CACHE_TTL` and `MAX_CACHE_ENTRIES` remain unchanged in this observability-only phase. Evidence: `cross-encoder.ts` still uses `CACHE_TTL = 300000` and `MAX_CACHE_ENTRIES = 200`.
- [x] Status tests cover both the populated cache block and the reset boundary. Evidence: `cross-encoder.vitest.ts` and `cross-encoder-extended.vitest.ts` assert the populated cache fields and the reset-to-zero boundary.
## P2 (Advisory)
- [ ] A follow-on note captures retrieval telemetry as an optional mirror surface rather than a competing source of truth.
- [ ] Future provider-specific telemetry remains possible without invalidating the process-wide counters shipped here.
