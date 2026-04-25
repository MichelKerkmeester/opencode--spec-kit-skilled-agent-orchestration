# Iteration 29: Monitoring Gaps in Cache Telemetry

## Focus
Evaluate the new cache counter interface from a dashboard/operator-monitoring perspective rather than a local-debugging perspective.

## Findings
1. `evictions` currently conflates two different behaviors: capacity-pressure removal in `enforceCacheBound()` and stale-entry cleanup on expired cache hits. A dashboard cannot tell whether cache churn came from saturation or from natural expiry. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442]
2. `entries` is just raw `cache.size`, and stale rows are only deleted when the same key is revisited or when the cache hits its bound. That means occupancy can overstate the number of truly live entries because the status surface does not expose expired-entry count or last cleanup time. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:124] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:539]
3. `resetSession()` zeroes cache counters, latency samples, and circuit-breaker state, but the status payload does not expose reset timestamp, provider-scoped counters, request volume, failure counts, or circuit-open state. Those omissions make it hard to interpret hit-rate changes or fallback behavior over time. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:171] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551]

## Ruled Out
- Building a meaningful monitoring dashboard from `hits` and `misses` alone.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`

## Assessment
- New information ratio: 0.23
- Questions addressed: `RQ-12`
- Questions answered: `RQ-12` — the current status block is good for local inspection but not yet sufficient for dashboard-grade monitoring

## Reflection
- What worked and why: Reading the mutation paths, not just the returned status object, exposed the semantic ambiguity immediately.
- What did not work and why: The counter names look straightforward until you see stale cleanup and bound pressure both flow into `evictions`.
- What I would do differently: Define a monitoring contract in terms of operator questions first, then map counters to those questions instead of starting from whatever is easy to expose.

## Recommended Next Focus
Cross-check the updated docs against the shipped code and separate genuinely accurate claims from wording that now overstates live behavior.
