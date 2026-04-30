# Iteration 002: Memory Search Fusion, Token Budgets, Weak Retrieval Policy

## Focus

Inspect the memory search and context-loading path for performance, ranking, citation, and weak-quality refusal behavior.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:217`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:560`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:999`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1248`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1446`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:463`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:273`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:64`

## Findings

- Current memory search is already a multi-channel hybrid path: vector, FTS, BM25, graph, and degree search are imported and fused (`hybrid-search.ts:1`, `:9`). Candidate merging preserves source/channel attribution and applies a small cross-channel bonus (`hybrid-search.ts:560`).
- The modern path has degradation thresholds for weak result quality and minimum result count (`hybrid-search.ts:217`). The formatter turns weak recovery into a response policy that can refuse citation rather than letting callers claim unsupported paths (`search-results.ts:273`).
- Token budget enforcement is now structured rather than a raw truncation slice. The enforcement path estimates serialized tokens, preserves survivors, and emits fallback structured payloads when nested JSON parsing fails (`memory-context.ts:463`, `:523`, `:845`).
- Performance remains bounded by sequential synchronous SQLite work. The source explicitly notes the enhanced path executes sequentially because better-sqlite3 is synchronous and `Promise.all` adds overhead without parallelism (`hybrid-search.ts:999`).
- Cross-encoder rerank is present but gated behind feature/provider flags, with local rerank also opt-in (`hybrid-search.ts:1446`). That is good for safety, but it means default quality depends mostly on deterministic fusion and channel routing.

## Insights

The memory path has many of the right contracts. The optimization gap is observability and calibration: there is no single query-quality harness that records pre-fusion candidates, channel contributions, final result quality, response policy, citation policy, and latency for the same query.

## Open Questions

- What is the p95 latency contribution by channel for typical simple, moderate, and complex queries?
- Should weak-retrieval thresholds be fixture-calibrated per query intent instead of global constants?

## Next Focus

Inspect code graph readiness, fallback decisions, and degraded context behavior.

## Convergence

newInfoRatio: 0.86. New information remains high because current source shows already-landed contracts not visible in the original baseline.

