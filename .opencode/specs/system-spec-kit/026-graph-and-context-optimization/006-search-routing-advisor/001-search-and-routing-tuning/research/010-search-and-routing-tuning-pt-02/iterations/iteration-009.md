# Iteration 9: Threshold Sweeps And Override Semantics

## Focus
Test whether threshold changes materially improve the measured corpus and then compare that with what `routeAs` override actually does in the live writer path.

## Findings
1. `routeAs` is applied after the natural decision is computed: it forces the category and target, raises the reported confidence to at least `0.50`, preserves the natural decision in `naturalDecision`, and emits a warning when the natural class was `drop`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:428] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:395]
2. The save handler accepts the routed override category, but it still rejects the write if the caller supplies a conflicting `mergeModeHint`. In other words, override bypasses natural classification, not the downstream merge contract. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1206]
3. On the 132-sample corpus, the current `0.70/0.70/0.50` thresholds produced `87.88%` accuracy with 8 refusals. The best grid point tested (`0.75/0.65/0.45`) improved accuracy to `90.15%` but increased refusals to 9 and shifted one `narrative_progress` case into refusal while strongly improving `narrative_delivery`. [INFERENCE: threshold sweep over live router Tier1/Tier2 outputs from dist/lib/routing/content-router.js] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470]
4. Across the tested grid, Tier1 was the dominant lever: `0.65` and `0.70` behaved identically on this corpus, while `0.75` or `0.80` improved mean accuracy but also increased mean refusals. Tier2 and Tier3 floor changes mainly changed refusal counts, not classification accuracy. [INFERENCE: threshold sweep over live router Tier1/Tier2 outputs from dist/lib/routing/content-router.js] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:475]
5. Because Tier3 is currently unwired in production, the practical role of the `0.50` Tier3 threshold today is mostly the penalized Tier2 fallback/refusal cutoff, not an LLM acceptance threshold. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:518]

## Ruled Out
- Recommending a blanket threshold increase as an unqualified improvement.

## Dead Ends
- Assuming `routeAs` makes any classified chunk merge-safe regardless of target and merge-mode validity.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:428`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:395`

## Assessment
- New information ratio: 0.62
- Questions addressed: RQ-4, RQ-6
- Questions answered: RQ-4, RQ-6

## Reflection
- What worked and why: Simulating threshold changes on recorded Tier1/Tier2 outputs made the tradeoff visible without pretending Tier3 is live when it is not.
- What did not work and why: A single "best" threshold point is misleading because the accuracy gain is category-specific and comes with extra refusals.
- What I would do differently: Resolve the final recommendation by combining the threshold sweep with the earlier confusion-pair and merge-risk findings.

## Recommended Next Focus
Synthesize the measured tradeoffs into a final recommendation that separates threshold tuning from cue/prototype tuning and runtime Tier3 wiring.
