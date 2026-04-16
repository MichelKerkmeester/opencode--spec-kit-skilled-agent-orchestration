# Iteration 22: Prioritizing the Four Implementation Phases

## Focus
Rank phases `001`-`004` by combined expected impact, implementation risk, and sequencing value rather than by novelty alone.

## Findings
1. Phase `002-add-reranker-telemetry` is the highest-priority execution step because it has bounded scope, low behavior risk, and creates the measurement surface needed to judge later changes responsibly. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:525]
2. Phase `001-remove-length-penalty` is the second priority because it delivers the clearest direct continuity win: the current long-doc penalty demotes many of the exact canonical spec documents continuity search wants. The risk is moderate, not low, because the flag still spans request-contract and test surfaces. [SOURCE: research/iterations/iteration-021.md] [SOURCE: research/iterations/iteration-012.md]
3. Phase `004-raise-rerank-minimum` is third. Its expected impact is narrower than phase `001`, but its code and test blast radius is smaller and well-localized to Stage 3 threshold behavior plus a single regression suite. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:42]
4. Phase `003-continuity-search-profile` is fourth in sequence even though it may eventually produce the largest upside, because its implementation risk depends entirely on scope selection. Narrow adaptive-fusion-only work is cheap; broad public-intent work is not. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:613] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641]

## Ruled Out
- Ranking the follow-on phases by algorithmic novelty instead of combined impact and implementation risk.

## Dead Ends
- None this iteration.

## Sources Consulted
- `research/iterations/iteration-012.md`
- `research/iterations/iteration-020.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`

## Assessment
- New information ratio: 0.19
- Questions addressed: `RQ-6`, `RQ-7`, `RQ-8`, `RQ-9`
- Questions answered: none newly answered; this was a prioritization pass

## Reflection
- What worked and why: Comparing behavior change, contract blast radius, and observability value produced a more actionable phase order than "finish the most interesting tuning first."
- What did not work and why: The packet’s original wording made phase `003` look deceptively adjacent to the other changes even though its risk profile is qualitatively different.
- What I would do differently: Require a simple impact-versus-risk table inside each follow-on phase packet before implementation begins.

## Recommended Next Focus
Translate the priority ranking into a concrete risk register so the implementation handoff captures the important edge cases instead of only the headline recommendations.
