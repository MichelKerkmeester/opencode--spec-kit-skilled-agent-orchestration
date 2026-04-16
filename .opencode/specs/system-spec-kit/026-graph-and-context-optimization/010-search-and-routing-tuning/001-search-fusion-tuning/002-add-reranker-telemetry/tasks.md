---
title: "Add Reranker Cache Telemetry - Tasks"
status: complete
---
# Tasks
- [x] T-01: Add process-wide cache counter state near `mcp_server/lib/search/cross-encoder.ts:100-128` for `hits`, `misses`, `staleHits`, and `evictions`, following `../research/research.md:104-133`.
- [x] T-02: Increment the new counters in the cache lookup and eviction flow at `mcp_server/lib/search/cross-encoder.ts:424-466` using the fresh-hit, miss, stale-hit, and eviction semantics defined in `../research/research.md:97-103`.
- [x] T-03: Extend `getRerankerStatus()` in `mcp_server/lib/search/cross-encoder.ts:499-525` with a `cache` block that exposes `entries`, `maxEntries`, and `ttlMs`.
- [x] T-04: Reset the cache counters alongside latency and circuit-breaker state in `mcp_server/lib/search/cross-encoder.ts:525-582`.
- [x] T-05: Update `mcp_server/tests/cross-encoder.vitest.ts:150-177` and `mcp_server/tests/cross-encoder-extended.vitest.ts:500` to cover the new status shape and reset semantics.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts`
