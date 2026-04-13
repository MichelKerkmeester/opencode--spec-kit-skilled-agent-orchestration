---
title: "Add Reranker Cache Telemetry - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `getRerankerStatus()` returns a `cache` block with `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`.
- [ ] Fresh hits, misses, stale hits, and evictions are counted from the real cache flow in `mcp_server/lib/search/cross-encoder.ts:424-466`.
- [ ] `resetSession()` clears the telemetry counters along with the rest of the reranker session state.
## P1 (Should Fix)
- [ ] The telemetry scope is explicitly process-wide, matching `../research/research.md:124-128,247-250`.
- [ ] `CACHE_TTL` and `MAX_CACHE_ENTRIES` remain unchanged in this observability-only phase.
- [ ] Status tests cover both the populated cache block and the reset boundary.
## P2 (Advisory)
- [ ] A follow-on note captures retrieval telemetry as an optional mirror surface rather than a competing source of truth.
- [ ] Future provider-specific telemetry remains possible without invalidating the process-wide counters shipped here.
