# Iteration 28: Cache Telemetry Contract Audit

## Focus
Inspect the new reranker cache telemetry shape and verify what the runtime now exposes through `getRerankerStatus()`.

## Findings
1. The runtime now exposes a concrete cache block on `RerankerStatus`: `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`, alongside latency `avg`, `p95`, and `count`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:100] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516]
2. The write sites show the intended basic semantics: fresh reuse increments `hits`, missing keys increment `misses`, expired keys increment both `misses` and `staleHits`, and cache-size enforcement increments `evictions`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433]
3. The current test surface confirms the object shape and the happy-path accounting/reset behavior, but it mostly proves that the fields exist and move in simple cases rather than proving dashboard-grade interpretability. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:156] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:448]

## Ruled Out
- Treating the repo as if cache telemetry were still absent; the status surface now exists and is test-covered at the shape level.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Assessment
- New information ratio: 0.29
- Questions addressed: `RQ-12`
- Questions answered: none fully; this pass verified the current status surface but not whether that surface is sufficient for monitoring

## Reflection
- What worked and why: Auditing the counter write sites before thinking about dashboards separated real telemetry from wishful observability.
- What did not work and why: Looking only at the status type would have made the interface seem more complete than its runtime semantics actually are.
- What I would do differently: Pair every new status field with a semantic note about what increments it and what does not.

## Recommended Next Focus
Judge whether the current counters are enough for a dashboard or whether their semantics are still too ambiguous.
