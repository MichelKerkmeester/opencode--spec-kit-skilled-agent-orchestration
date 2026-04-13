# Iteration 28: Tier 3 Always-On Runtime Trace

## Focus
Trace the post-implementation always-on Tier 3 path through `memory-save.ts` and `content-router.ts`, with emphasis on where the handler attempts Tier 3 and how it falls back when the classifier is unavailable.

## Findings
1. Canonical routing is now unconditional in the save handler. `shouldUseCanonicalRouting()` returns `true` for every atomic save, so the live path no longer depends on a feature flag or explicit opt-in. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:711] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2440]
2. The handler now constructs the router through `buildCanonicalRouter()`, which injects both `classifyWithTier3Llm` and the shared `tier3RoutingCache`. That closes the exact runtime gap identified in iterations 15 and 23. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1208]
3. `classifyWithTier3Llm()` fail-opens at every external boundary. Missing endpoint, non-OK HTTP response, invalid JSON payload, and thrown fetch or abort all return `null` rather than surfacing an error into the save path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:951] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:986] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:999]
4. Inside `resolveNaturalDecision()`, Tier 3 only wins if it clears the configured thresholds. Otherwise the router falls back to penalized Tier 2 when `similarity - 0.15 >= 0.50`, and refuses when even that fallback stays below the floor. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:553] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:579]
5. "Always on" therefore means "always attempted on ambiguous routes," not "always authoritative." The shipped runtime still prefers safe fallback or refusal over forcing an unreliable model answer into a merge. [INFERENCE: trace across memory-save.ts and content-router.ts]

## Ruled Out
- Assuming that always-on Tier 3 makes every canonical save network-dependent.

## Dead Ends
- Treating the handler change as proof that Tier 3 necessarily decides every routed save.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:711`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:951`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:553`

## Assessment
- New information ratio: 0.35
- Questions addressed: RQ-13
- Questions answered: none

## Reflection
- What worked and why: Reading the handler seam and the router fallback logic together made the new runtime contract obvious without any code edits.
- What did not work and why: Looking at the router alone would have missed the now-unconditional handler entrypoint.
- What I would do differently: Pair the code trace with the targeted routing tests immediately, because the runtime contract is now split between handler wiring and router semantics.

## Recommended Next Focus
Use the routing-only tests to prove the natural Tier 3 prompt body, packet-kind derivation, and fail-open behavior all hold in the live save handler.
