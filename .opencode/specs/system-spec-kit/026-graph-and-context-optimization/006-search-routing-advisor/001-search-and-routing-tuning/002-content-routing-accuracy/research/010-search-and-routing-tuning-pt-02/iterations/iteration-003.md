# Iteration 3: Tier3 Contract Versus Runtime Wiring

## Focus
Verify whether Tier3 is only a designed contract or an actually wired runtime dependency in the canonical save path, because that changes how much the `0.50` threshold matters.

## Findings
1. The router exports a fully frozen Tier3 contract: prompt version `tier3-router-v1`, model `gpt-5.4`, reasoning effort `low`, temperature `0`, `200` max output tokens, and `2000ms` timeout. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:472]
2. The prompt contract is strict about the eight categories, a refusal path via `refuse-to-route`, and merge-mode constraints, so Tier3 is designed as a bounded classifier, not a free-form router. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:421]
3. The canonical save handler currently constructs `createContentRouter()` with no dependency injection, so `classifyWithTier3` defaults to `null` in the actual writer path. Tier3 exists in tests and the router contract, but not in the live save wiring studied here. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386]
4. The test suite proves Tier3 behavior only under injected classifiers or caches. That is valuable for contract safety, but it also means Tier3 threshold tuning alone cannot improve the current save path until the handler injects a real classifier. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:212] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:246]

## Ruled Out
- Treating the Tier3 prompt as active production behavior in the current canonical save path.

## Dead Ends
- Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:212`

## Assessment
- New information ratio: 0.82
- Questions addressed: RQ-4, RQ-6
- Questions answered: none yet

## Reflection
- What worked and why: Tracing the production callsite answered the runtime-versus-contract question much faster than speculating from prompt constants.
- What did not work and why: Reading tests first would have overstated Tier3 importance because the tests intentionally exercise injected behavior the live handler does not yet use.
- What I would do differently: Move into the actual decision path next so the escalation analysis distinguishes hard skips, Tier2 acceptance, penalized fallback, and manual refusal.

## Recommended Next Focus
Map the natural decision flow and the four Tier2 trigger reasons, then relate them to the current no-Tier3 runtime.
