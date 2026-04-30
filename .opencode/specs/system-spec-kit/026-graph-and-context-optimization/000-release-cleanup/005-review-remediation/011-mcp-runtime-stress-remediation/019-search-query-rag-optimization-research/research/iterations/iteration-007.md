# Iteration 007: Rerank Cost-of-Correctness

## Focus

Decide where rerank layers make sense and where deterministic fusion remains the better default.

## Sources

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:6`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:126`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:161`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:215`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:42`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:206`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1446`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1455`

## Findings

- The cross-encoder layer supports Voyage, Cohere, and local providers, and the fallback positional scoring is explicitly labeled as fallback (`cross-encoder.ts:6`).
- Provider defaults are expensive enough to gate: Voyage/Cohere max 100 docs with 15s timeout, local max 50 docs with 30s timeout (`cross-encoder.ts:35`).
- The reranker has operational guardrails: 5-minute cache TTL with max 200 entries, circuit breaker after 3 failures, and 60s cooldown (`cross-encoder.ts:126`, `:161`).
- Provider resolution is opt-in by feature flags and environment keys (`cross-encoder.ts:215`). Local rerank is also strict opt-in and checks memory/model prerequisites (`local-reranker.ts:206`).
- Hybrid search runs rerank after fusion and before MMR; non-embedded rows can be preserved through the MMR path (`hybrid-search.ts:1446`, `:1455`).

## Insights

The right cost-of-correctness posture is conditional rerank: run it only for high-value ambiguous, weak-retrieval, multi-channel-disagreement, or top-N planning queries. Always-on rerank would fight the existing fast-fail and weak-retrieval refusal contracts by adding latency without guaranteeing better evidence.

## Open Questions

- What is the minimum top-K rerank set that improves precision without erasing p95 budget?
- Should rerank be disabled when responsePolicy says `ask_user` or `refuse_without_evidence`, or used only to confirm that refusal?

## Next Focus

Synthesize cross-system trust trees, contradiction detection, and citation policy.

## Convergence

newInfoRatio: 0.39. Fewer new defects, but the rerank gating details materially inform Phase D.

