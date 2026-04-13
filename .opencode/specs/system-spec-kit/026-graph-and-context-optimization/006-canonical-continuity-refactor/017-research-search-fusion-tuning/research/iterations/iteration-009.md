# Iteration 9: Recommendation Framing

## Focus
Convert the earlier evidence into concrete, bounded recommendations for continuity-first fusion and reranking without over-claiming what the current code can prove.

## Findings
1. The Stage 3 minimum rerank threshold of `2` is very permissive. For continuity queries, reranking only 2 results is unlikely to justify a network or local-model call, so a higher threshold such as `4-5` is the most plausible next experiment. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49] [INFERENCE: 2-item reranks have almost no ranking depth and no corpus evidence supports the current cutoff]
2. The 5-minute TTL should remain the default until hit/miss instrumentation exists; changing it now would be policy without measurement. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]
3. The best implementation path is to expose continuity-tuning controls in a dedicated fusion config surface, because `search-weights.json` does not own the dominant ranking behavior for this packet. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:28] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]

## Ruled Out
- None beyond previously ruled-out config assumptions.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221`

## Assessment
- New information ratio: 0.22
- Questions addressed: `RQ-4`, `RQ-5`
- Questions answered: `RQ-5`

## Reflection
- What worked and why: Holding recommendations until the code and corpus evidence were both in hand avoided speculative tuning.
- What did not work and why: Some recommendations still depend on inference because the live telemetry hooks are missing.
- What I would do differently: Use the final pass to tighten the wording around "answered with bounded unknown" versus "fully measured."

## Recommended Next Focus
Produce the final packet synthesis, making the bounded unknowns explicit and mapping each recommendation back to the research questions.
