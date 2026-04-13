# Iteration 16: Continuity Intent Blast Radius Beyond Adaptive Fusion

## Focus
Trace the broader search-intent stack to determine what changes are required if continuity must be exposed as a first-class public intent, not just a new adaptive-fusion profile.

## Findings
1. The typed intent universe is hard-coded in `intent-classifier.ts`: `IntentType`, `INTENT_TYPES`, keyword/pattern/centroid maps, `INTENT_WEIGHT_ADJUSTMENTS`, score initialization, descriptions, `INTENT_TO_PROFILE`, and `INTENT_LAMBDA_MAP` all assume the current 7-intent set. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:32] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:197] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:613] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641]
2. Downstream routing also assumes only `find_spec` and `find_decision` need special preservation behavior or artifact fallbacks. Adding public continuity intent would therefore require updates in `query-router.ts` and `artifact-routing.ts`, not just the classifier. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:209]
3. The test blast radius is substantial: `intent-classifier.vitest.ts` explicitly asserts there are 7 intent types, `integration-138-pipeline.vitest.ts` asserts "all 7 intent profiles", and `intent-weighting.vitest.ts` assumes parity between the two intent-weight systems. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:53] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:224] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:321] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:78]
4. Safe phase-003 guidance is therefore split:
   - Minimal scope: add `continuity` only to `INTENT_WEIGHT_PROFILES` and wire it from explicit internal callers.
   - Expanded public-intent scope: update classifier unions/maps, artifact routing, BM25 preservation rules, auto-profile mapping, lambda mapping, and the intent test suites together. [INFERENCE: the broader intent stack is tightly coupled]

## Ruled Out
- Sneaking `continuity` into `INTENT_WEIGHT_PROFILES` and pretending the MCP/tool surface automatically supports it; the handler currently validates explicit intents against `IntentType`.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts`

## Assessment
- New information ratio: 0.69
- Questions addressed: `RQ-8`
- Questions answered: `RQ-8`

## Reflection
- What worked and why: Walking outward from the typed union exposed the true boundary between "new profile" and "new public intent".
- What did not work and why: The packet sub-phase wording could easily tempt implementation into an unintended cross-cutting refactor.
- What I would do differently: Separate "profile addition" and "classifier vocabulary addition" in future packets from the start.

## Recommended Next Focus
Examine the Stage 3 rerank threshold guard and the exact test fixtures that assume reranking still runs on 2-document result sets.
