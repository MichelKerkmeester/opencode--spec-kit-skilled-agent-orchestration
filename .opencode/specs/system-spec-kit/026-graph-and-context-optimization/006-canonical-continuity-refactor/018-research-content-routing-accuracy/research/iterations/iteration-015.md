# Iteration 15: Tier3 Wiring Gap In The Save Path

## Focus
Map the exact integration work required to connect the existing Tier3 contract to `memory-save.ts`.

## Findings
1. The router is already designed for dependency injection. `createContentRouter()` accepts `classifyWithTier3`, `cache`, `embedText`, and `now`, then threads those dependencies into `resolveNaturalDecision()` and `resolveTier3Decision()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:452]
2. The live save path never provides those Tier3 dependencies. `buildCanonicalAtomicPreparedSave()` simply calls `createContentRouter()` with no arguments, so the default dependency closes over `classifyWithTier3: async () => null`. That means the current runtime can only use Tier1, Tier2, and penalized Tier2 fallback. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:391]
3. There is no production classifier implementation elsewhere in the repo. A search for `buildTier3Prompt`, `classifyWithTier3`, and `gpt-5.4` only finds the router contract and its tests. The nearest reusable production pattern is the OpenAI-compatible helper in `lib/search/llm-reformulation.ts`, which already handles env-based endpoint configuration, timeout, `fetch()`, and JSON parsing behind a fail-open interface. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185]
4. Phase `003-wire-tier3-llm-classifier` therefore needs two concrete code changes, not one. First, add a real classifier adapter that calls the Tier3 prompt contract and returns `Tier3RawResponse | null`. Second, inject that adapter into the router constructor in `memory-save.ts` and, ideally, pass a cache implementation so repeated ambiguous saves can hit the existing session/spec-folder cache layer. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/003-wire-tier3-llm-classifier/spec.md:10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:630]

## Ruled Out
- Treating phase `003` as a one-line constructor tweak in `memory-save.ts`.

## Dead Ends
- Assuming there is already a hidden production caller for `buildTier3Prompt()`.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:630`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185`

## Assessment
- New information ratio: 0.66
- Questions addressed: RQ-9
- Questions answered: none

## Reflection
- What worked and why: Searching for production references to the Tier3 contract quickly separated test-only behavior from runtime reality.
- What did not work and why: The existing phase spec understates the amount of missing plumbing because it only names the call site and the router, not the absent client implementation.
- What I would do differently: Include a search for contract consumers earlier whenever a phase claims a feature "already exists".

## Recommended Next Focus
Estimate the practical latency and cost envelope of wiring Tier3 into atomic saves, including what caching and timeout behavior already reduce the operational risk.
