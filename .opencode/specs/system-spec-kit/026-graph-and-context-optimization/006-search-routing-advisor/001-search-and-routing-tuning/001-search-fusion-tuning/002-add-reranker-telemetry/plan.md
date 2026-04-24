---
title: "...on/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry/plan]"
description: 'title: "Add Reranker Cache Telemetry - Execution Plan"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "plan"
  - "002"
  - "add"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
parent_spec: 002-add-reranker-telemetry/spec.md
status: complete
---
# Execution Plan
## Approach
This phase adds cache observability to the reranker without changing cache behavior. The clean primary surface is `getRerankerStatus()`, so the implementation should add a `cache` block beside the existing latency metrics and keep the counters process-scoped at the module level.

The research recommends doing this work first because later tuning phases should use real hit, miss, stale-hit, and eviction data rather than guesses about the current 5-minute TTL. `resetSession()` already owns the cache reset boundary, so the new counters should share that lifecycle.

## Steps
1. Extend the module-level reranker state around `mcp_server/lib/search/cross-encoder.ts:100-128` with process-wide cache counters that match the contract in `../research/research.md:95-133`.
2. Increment `hits`, `misses`, `staleHits`, and `evictions` inside the cache lookup and bound-enforcement flow in `mcp_server/lib/search/cross-encoder.ts:424-466`, using the semantics called out in `../research/research.md:97-103,247-250`.
3. Add a `cache` block to `getRerankerStatus()` in `mcp_server/lib/search/cross-encoder.ts:499-525` with `entries`, `maxEntries`, and `ttlMs`, keeping that function as the canonical exposure point per `../research/research.md:104-133`.
4. Reset the new counters in `mcp_server/lib/search/cross-encoder.ts:525-582` and update `mcp_server/tests/cross-encoder.vitest.ts:150-177` plus the status coverage near `mcp_server/tests/cross-encoder-extended.vitest.ts:500` so the new status shape and reset behavior are enforced.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts`.
- Confirm `getRerankerStatus()` returns live cache counters while `CACHE_TTL` and `MAX_CACHE_ENTRIES` stay unchanged.

## Risks
- Mixing process-wide and provider-scoped semantics would make the counters misleading, so the scope choice must stay explicit.
- Forgetting to reset the counters in `resetSession()` would contaminate later measurements.
- Exposing the counters anywhere else first would create competing sources of truth before the core status surface is stable.
