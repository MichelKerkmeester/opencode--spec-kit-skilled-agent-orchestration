# Iteration 16: Tier3 Latency And Cost Envelope

## Focus
Estimate the runtime and cost impact of wiring Tier3 into the canonical save path, using the current contract and surrounding code.

## Findings
1. The Tier3 contract is intentionally bounded: model `gpt-5.4`, `reasoningEffort: low`, `temperature: 0`, `maxOutputTokens: 200`, and `timeoutMs: 2000`. That is a small classification-style request, not an open-ended reasoning pass. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:12] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1209]
2. The call frequency is self-limiting. Tier3 is only reached after Tier1 fails its acceptance conditions and Tier2 misses the `0.70` threshold, so the additional model call only lands on the ambiguous tail of the save distribution. The router also caches successful Tier3 outcomes at both session and spec-folder scope using the content hash, which means repeated saves of the same ambiguous chunk can become zero-cost after the first decision. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:640]
3. The biggest operational risk is latency, not token volume. `memory-save.ts` feeds Tier3 the normalized routed chunk text after frontmatter/comment stripping, but it does not cap chunk length before routing. In typical prototype-sized content the prompt is modest, yet unusually long canonical save bodies could still push the request toward the 2-second deadline. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:806] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1009] [INFERENCE: prototype corpus averages roughly 45 words per chunk, but live save chunks are not hard-capped]
4. The best implementation guidance for phase `003` is fail-open plus explicit observability. Reuse the `llm-reformulation.ts` pattern of env-based endpoint configuration, `AbortController`, and warning logs, then surface the Tier3 latency and cache-hit state through existing routing audit entries. That keeps the atomic save path usable even when the classifier is unavailable or slow. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:203] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1175]

## Ruled Out
- Treating Tier3 cost as the main blocker before measuring the ambiguous-call rate.

## Dead Ends
- Assuming the current 2-second timeout is automatically safe for arbitrarily long routed save bodies.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:12`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:806`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:203`

## Assessment
- New information ratio: 0.57
- Questions addressed: RQ-9
- Questions answered: RQ-9

## Reflection
- What worked and why: The latency budget and caching behavior are explicit enough in code to make a bounded operational estimate without live provider calls.
- What did not work and why: The current code does not expose real ambiguous-call counts, so the exact production hit rate remains unmeasured.
- What I would do differently: Pair the implementation with a temporary audit counter for Tier3 invocation reasons before making any default-on rollout decision.

## Recommended Next Focus
Turn back to the prototype library as a whole and answer whether the categories are well distributed beyond the two confusion pairs, especially given that `negativeHints` are currently inert.
