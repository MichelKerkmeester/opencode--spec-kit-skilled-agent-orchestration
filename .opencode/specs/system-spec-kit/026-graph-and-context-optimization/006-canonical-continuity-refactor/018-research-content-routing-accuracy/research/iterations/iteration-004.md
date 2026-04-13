# Iteration 4: Escalation Path And Trigger Reasons

## Focus
Trace the exact decision path from Tier1 through Tier2 and refusal so later measurement can bucket escalation causes correctly.

## Findings
1. Natural routing follows a strict ladder: accept Tier1 only if confidence clears the floor and the trigger reason is neither `mixed_signals` nor `margin_too_narrow`; otherwise try Tier2; if Tier2 misses its floor, attempt Tier3; if Tier3 is absent or weak, try penalized Tier2 fallback; then refuse. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:452] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:518]
2. There are exactly four escalation reasons: `top1_below_0_70`, `margin_too_narrow`, `mixed_signals`, and `manual_retry`. `manual_retry` is also the default "no blocker" state after a confident Tier1 result, so it is not itself evidence of escalation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:888] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:904]
3. Because Tier3 is unwired in the save handler, ambiguous content in the live path either routes via Tier2 or lands in the penalized Tier2 fallback band before refusal. A direct runtime check showed an ambiguous sample refusing at `0.4965` with `tier3: null`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [INFERENCE: live execution of dist/lib/routing/content-router.js against an ambiguous sample derived from the Tier3 refusal test]
4. Tests confirm the intended behaviors at the edges: injected Tier3 can win with `0.83`, cache hits can bypass recomputation, and a weak Tier3 result below `0.50` forces refusal. Those cases are contract-valid but not currently production-wired. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:212] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:310]

## Ruled Out
- Searching for a fifth hidden escalation reason.

## Dead Ends
- Assuming `manual_retry` means a forced escalation. In code it is the neutral/default reason after a non-blocked Tier1 result.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:452`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:518`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:888`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:310`

## Assessment
- New information ratio: 0.78
- Questions addressed: RQ-2, RQ-6
- Questions answered: RQ-2

## Reflection
- What worked and why: The decision function and trigger helper are compact enough that static inspection plus one runtime probe gave a full escalation model.
- What did not work and why: It is easy to overread `manual_retry`; the name sounds like escalation even when the flow never leaves Tier1.
- What I would do differently: Move from logic tracing into measured corpus behavior now that the decision buckets are known.

## Recommended Next Focus
Run a synthetic corpus through the live router and quantify accuracy, escalation rate, and hard-rule fire counts.
