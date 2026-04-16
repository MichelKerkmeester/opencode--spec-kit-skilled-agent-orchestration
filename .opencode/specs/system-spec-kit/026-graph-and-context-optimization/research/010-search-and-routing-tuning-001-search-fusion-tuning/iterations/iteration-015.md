# Iteration 15: Continuity Profile Insertion Point in Adaptive Fusion

## Focus
Determine the minimum code change needed to add a dedicated continuity fusion profile and verify whether `adaptive-fusion.ts` alone can support it.

## Findings
1. `adaptive-fusion.ts` is already the canonical home for intent-weight profiles, and `getAdaptiveWeights(intent: string)` accepts arbitrary strings. That means a new `continuity` profile can be added without changing the function signature or the core fusion algorithm. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:137]
2. `hybrid-search.ts` also treats the active intent as a string before passing it into `getAdaptiveWeights()`, so lower-level callers that can already set `options.intent = 'continuity'` will pick up the new profile immediately. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1223]
3. This means phase `003` can stay narrowly scoped if its goal is "add a continuity weight profile and wire it from internal callers." It does not inherently require classifier, schema, or query-router changes. [INFERENCE: adaptive fusion itself is string-keyed rather than hard-unioned]
4. The required test updates at this minimal scope are centered in `adaptive-fusion.vitest.ts` and `integration-138-pipeline.vitest.ts`, where the repo currently assumes exactly 7 intent profiles. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:321]

## Ruled Out
- Treating the new profile as a change to `DEFAULT_WEIGHTS`; continuity needs to be explicit, not a silent default drift.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts`
- `017-research-search-fusion-tuning/003-continuity-search-profile/spec.md`

## Assessment
- New information ratio: 0.64
- Questions addressed: `RQ-8`
- Questions answered: partially; the minimal insertion seam is resolved.

## Reflection
- What worked and why: Checking the function signatures first showed that adaptive fusion is more decoupled from the typed intent system than the packet wording implies.
- What did not work and why: The packet sub-phase title makes the work sound bigger than the code-path minimum actually is.
- What I would do differently: Start profile-addition research by asking whether the weight map is keyed by strict union or open string.

## Recommended Next Focus
Trace the rest of the intent system to see what changes are required only if continuity must become a public/search-tool intent rather than an internal profile label.
