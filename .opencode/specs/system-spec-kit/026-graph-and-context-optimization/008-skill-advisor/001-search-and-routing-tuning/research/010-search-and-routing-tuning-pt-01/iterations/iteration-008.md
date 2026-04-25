# Iteration 8: Length Penalty Fit and Cache Observability

## Focus
Test the length-penalty thresholds against the actual system-spec-kit markdown corpus and determine whether the 5-minute reranker TTL can be evaluated from current telemetry.

## Findings
1. A packet-local probe over `.opencode/specs/system-spec-kit/**/*.md` found `5966` markdown files, `0` under 50 characters, and `4690` over 2000 characters (`78.6%`), with median length `5666`. [INFERENCE: packet-local corpus probe] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62]
2. Because the short threshold catches none of the actual corpus and the long threshold catches most of it, the current length penalty behaves like a blanket long-doc demotion rather than a targeted relevance correction for spec-doc continuity search. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62] [INFERENCE: derived from the packet-local corpus probe]
3. The reranker cache exposes TTL checks, insertions, and latency sample counts, but there are no hit/miss counters in the exported status object, so current code cannot answer "what is the hit rate at 5 minutes?" [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]

## Ruled Out
- Changing the TTL based on a derived hit rate from current exports.

## Dead Ends
- None beyond the cache observability gap.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499`

## Assessment
- New information ratio: 0.30
- Questions addressed: `RQ-4`, `RQ-5`
- Questions answered: `RQ-4`

## Reflection
- What worked and why: Sampling the actual markdown corpus answered the threshold-fit question much better than debating the penalty constants abstractly.
- What did not work and why: Cache observability is fundamentally blocked by missing counters, not by lack of code access.
- What I would do differently: Consolidate the recommendations next so the implementation follow-on is crisp.

## Recommended Next Focus
Turn the evidence into concrete threshold recommendations for rerank minimums, long-doc penalties, and cache instrumentation.
