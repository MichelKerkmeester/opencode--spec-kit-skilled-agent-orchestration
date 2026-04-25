# Iteration 7: Provider Behavior and Fixture Quality

## Focus
Bound the provider-quality discussion using the repo's existing reranker comparison fixtures and compare that against positional fallback behavior.

## Findings
1. Provider selection is ordered `Voyage -> Cohere -> Local`, and the cross-encoder returns fallback-sort results when no provider is available or the circuit breaker opens. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:195] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:411]
2. On the project fixture corpus, baseline ordering and reranked ordering have the same average `P@5=0.48`, but RR@5 rises from `0.5167` baseline to `0.8667` for Voyage and `0.9000` for Cohere. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21] [INFERENCE: packet-local computation over the fixture rank orders]
3. The local provider path is structurally different from the remote providers: it caps at 50 documents and allows a 30-second timeout, but the repo does not include comparable local-quality fixtures, so Local quality remains unmeasured here. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:52]

## Ruled Out
- Claiming real provider latency distributions from the fixture-only test corpus.

## Dead Ends
- Live benchmark runs against configured providers were not available within packet constraints.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:195`
- `.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21`

## Assessment
- New information ratio: 0.38
- Questions addressed: `RQ-3`
- Questions answered: `RQ-3`

## Reflection
- What worked and why: The fixture corpus was enough to compare first-hit quality uplift without needing networked reranker calls.
- What did not work and why: The tests do not capture wall-clock latency, so quality and latency remain split evidence streams.
- What I would do differently: Use actual spec-doc lengths next so the long-document penalty question is grounded in corpus data.

## Recommended Next Focus
Measure how often spec-doc content crosses the length-penalty thresholds and verify whether cache hit rate can be observed from current exports.
