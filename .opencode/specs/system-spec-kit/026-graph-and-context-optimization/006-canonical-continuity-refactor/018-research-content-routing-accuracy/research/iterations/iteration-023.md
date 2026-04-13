# Iteration 23: Tier3 Wiring Effort Estimate

## Focus
Turn the previously identified Tier 3 runtime gap into a realistic production line-count estimate and test plan.

## Findings
1. The production seam is still one unresolved constructor call. `createContentRouter()` already accepts `classifyWithTier3` and `cache`, and `resolveTier3Decision()` already consumes both, but `memory-save.ts` still creates the router with no dependencies at line `1008`. That leaves Tier 3 permanently stubbed to `null` in production. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:231] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:386] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008]
2. The missing work is larger than a classifier call because there is no concrete production `RouterCache` implementation anywhere in `mcp_server/` outside the interface and tests. Phase `003` therefore needs both a classifier adapter and a cache adapter. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:231] [INFERENCE: repo-wide search found `RouterCache` only in `content-router.ts` and test doubles]
3. The smallest realistic production diff is about `90-130` LOC. A thin OpenAI-compatible call helper modeled on `callLlmForReformulation()` is roughly `45-60` LOC, a small session/spec-folder cache wrapper is another `20-30` LOC, env/response plumbing is about `10-20` LOC, and the actual injection at `memory-save.ts:1008` is only `8-15` LOC. If the phase also introduces routing-specific env names instead of reusing an existing OpenAI-compatible endpoint contract, the diff moves toward the high end of that range. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:200] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [INFERENCE: line-count estimate based on the existing helper shape and the missing seams]
4. The test cost is separate and non-trivial: expect another `70-100` LOC across router and handler tests. `content-router.vitest.ts` already covers classifier injection, cache hits, below-floor refusals, and Tier 2 fallback, so phase `003` mostly needs adapter-path assertions. `handler-memory-save.vitest.ts` needs at least one natural-routing atomic-save case with no `routeAs`, one null/timeout fallback case, and one cache-reuse case that proves the real save path can reach Tier 3 without changing canonical outputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:212] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:338] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:556]
5. There is also a config-contract choice to make. The only existing OpenAI-compatible env pattern in this codebase is `LLM_REFORMULATION_ENDPOINT`, `LLM_REFORMULATION_API_KEY`, and `LLM_REFORMULATION_MODEL`; there is no routing-specific env surface yet. Reusing that pattern keeps the implementation small, while adding `ROUTING_TIER3_*` style envs improves clarity but adds more code and tests. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:185] [INFERENCE: repo-wide search found no routing-specific endpoint env contract]

## Ruled Out
- Assuming a reusable production `RouterCache` already exists and phase `003` only needs to pass it through.

## Dead Ends
- Treating the env contract choice as free. Reuse-versus-new-env naming is a real scope decision inside the wiring phase.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:231`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:200`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:556`

## Assessment
- New information ratio: 0.28
- Questions addressed: RQ-9
- Questions answered: RQ-9

## Reflection
- What worked and why: Treating the fetch helper and the router dependency interface as templates made the missing wiring work easy to size without touching production code.
- What did not work and why: Looking only at `memory-save.ts:1008` still underestimates the missing cache and env-contract work.
- What I would do differently: Capture explicit LOC bands during the first runtime-gap pass instead of leaving them to the final convergence wave.

## Recommended Next Focus
Check the category-level test floor directly and confirm whether any routing category is totally absent from `content-router.vitest.ts`.
