# Iteration 13: Reranker Telemetry Data Model and Status Surface

## Focus
Determine the best counter shape for reranker cache observability and the smallest production surface that can expose it for phase `002-add-reranker-telemetry`.

## Findings
1. The cache currently has exactly the state needed to support four counters: valid-hit, miss, stale-hit, and eviction. The cache lookup already distinguishes "found and fresh" from "found but expired", and `enforceCacheBound()` is the single eviction point. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:125] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:467]
2. The cleanest counter shape is a nested `cache` block on `RerankerStatus`, for example:
   `cache: { hits, misses, staleHits, evictions, entries, maxEntries, ttlMs }`.
   That keeps cache telemetry process-scoped like the existing latency snapshot and avoids mixing it into the provider-specific result rows. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:100] [INFERENCE: the current status object already represents module-level state]
3. `getRerankerStatus()` is currently only consumed by tests, not by production handlers, so phase `002` can safely extend the status shape without immediately changing user-facing MCP responses. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:150] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:500]
4. If operator-visible telemetry is needed after phase `002`, the best follow-on surface is the existing retrieval-telemetry payload, not a bespoke reranker endpoint: retrieval telemetry already owns rerank latency and per-request observability. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:57] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:162]

## Ruled Out
- Adding counters directly to per-result payload rows; cache behavior is module-level, not document-level.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts`

## Assessment
- New information ratio: 0.71
- Questions addressed: `RQ-7`
- Questions answered: partially; counter shape and primary status surface are resolved.

## Reflection
- What worked and why: Staying close to existing module boundaries made the status-shape decision much cleaner than inventing a new telemetry plane.
- What did not work and why: The existing "status surface" is not actually wired into operator-facing handlers, so visibility and storage remain separate questions.
- What I would do differently: Search consumers earlier whenever a spec says "existing status surface" but does not name a handler.

## Recommended Next Focus
Trace where rerank telemetry already lives so phase `002` can distinguish "core status patch" from "optional operator-visible exposure".
