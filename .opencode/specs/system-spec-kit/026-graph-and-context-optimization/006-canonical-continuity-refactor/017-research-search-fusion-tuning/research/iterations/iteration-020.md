# Iteration 20: Cross-Phase Implementation Synthesis

## Focus
Consolidate the implementation-focused passes into one safe execution map for sub-phases `001`-`004` plus the continuity-specific K-sweep follow-up.

## Findings
1. Phase `001-remove-length-penalty` should be implemented as "behavior removal plus compatibility no-op", not "contract deletion". Production scoring can be deleted from `cross-encoder.ts` immediately, but `applyLengthPenalty` should remain accepted for one compatibility cycle because it still flows through schemas, handler defaults, cache keys, and shadow replay configs. [SOURCE: research/iterations/iteration-011.md] [SOURCE: research/iterations/iteration-012.md]
2. Phase `002-add-reranker-telemetry` has a clean bounded scope if it extends `RerankerStatus` with a nested `cache` block and resets those counters in `resetSession()`. Operator-visible exposure can be a separate follow-on that mirrors the status snapshot into retrieval telemetry. [SOURCE: research/iterations/iteration-013.md] [SOURCE: research/iterations/iteration-014.md]
3. Phase `003-continuity-search-profile` has two valid scopes, and choosing between them matters:
   - narrow scope: add `continuity` only to `INTENT_WEIGHT_PROFILES` and internal callers
   - broad scope: add a public continuity intent across classifier, routing, artifact mapping, auto-profile, lambda map, and tests
   The packet should explicitly choose one before implementation starts. [SOURCE: research/iterations/iteration-015.md] [SOURCE: research/iterations/iteration-016.md]
4. Phase `004-raise-rerank-minimum` should start at `MIN_RESULTS_FOR_RERANK = 4`, not `5`, and its required test work is tightly localized to `stage3-rerank-regression.vitest.ts` plus new boundary assertions. [SOURCE: research/iterations/iteration-017.md] [SOURCE: research/iterations/iteration-018.md]
5. The continuity-specific K-sweep can proceed now without waiting for public continuity intent if it uses the string-typed `IntentKOptimizationQuery` harness first. That makes it a good supporting benchmark task rather than a blocker for phases `001`-`004`. [SOURCE: research/iterations/iteration-019.md]

## Ruled Out
- Treating all four implementation sub-phases as symmetric. Their safe scopes are meaningfully different.

## Dead Ends
- None this iteration.

## Sources Consulted
- `research/iterations/iteration-011.md`
- `research/iterations/iteration-012.md`
- `research/iterations/iteration-013.md`
- `research/iterations/iteration-014.md`
- `research/iterations/iteration-015.md`
- `research/iterations/iteration-016.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `research/iterations/iteration-019.md`

## Assessment
- New information ratio: 0.34
- Questions addressed: `RQ-6`, `RQ-7`, `RQ-8`, `RQ-9`, `RQ-10`
- Questions answered: `RQ-6`, `RQ-7`, `RQ-8`, `RQ-9`, `RQ-10`

## Reflection
- What worked and why: Splitting the resumed loop by implementation phase turned a broad tuning topic into concrete change packets with clear boundaries.
- What did not work and why: The phase specs sometimes understated contract/test fallout, especially for length-penalty removal and public continuity intent.
- What I would do differently: Demand an explicit "public contract impact" subsection in future implementation sub-phases.

## Recommended Next Focus
Hand off to implementation with this order: `002` telemetry source-of-truth, `001` length-penalty behavior removal, `004` rerank minimum = 4, then `003` continuity profile at the chosen scope, with the K-sweep extension running as supporting validation rather than as a prerequisite.
