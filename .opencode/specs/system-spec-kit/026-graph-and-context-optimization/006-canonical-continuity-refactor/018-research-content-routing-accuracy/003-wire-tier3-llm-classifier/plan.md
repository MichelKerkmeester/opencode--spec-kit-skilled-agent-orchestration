---
title: "Wire Tier3 LLM Classifier into Save Handler - Execution Plan"
status: planned
parent_spec: 003-wire-tier3-llm-classifier/spec.md
---
# Execution Plan
## Approach
This phase turns the existing Tier3 contract into a live save-path dependency. `createContentRouter()` already supports `classifyWithTier3` and `cache`, but `memory-save.ts` currently instantiates the router without either dependency, so Tier3 can never fire in production.

The safest implementation is a fail-open adapter that reuses the repo's existing OpenAI-compatible fetch pattern from `llm-reformulation.ts`. The phase should add a concrete classifier helper, inject it with a real `RouterCache` implementation at the save-handler seam, and prove both the natural-routing path and the fallback path with tests.

## Steps
1. Add a production Tier3 classifier adapter that builds the existing prompt from `mcp_server/lib/routing/content-router.ts:1128-1172` and reuses the timeout, abort, and env-handling pattern from `mcp_server/lib/search/llm-reformulation.ts:185-274`, per `../research/research.md:55-71,143-156`.
2. Inject `classifyWithTier3` and a real `RouterCache` into `createContentRouter()` at `mcp_server/handlers/memory-save.ts:1008`, using the router dependency seam documented in `../research/research.md:59-66`.
3. Keep the integration fail-open so missing credentials, slow endpoints, or invalid responses fall back to the existing Tier2 path instead of failing saves.
4. Add natural-routing and fallback coverage in `mcp_server/tests/handler-memory-save.vitest.ts:1076` and extend `mcp_server/tests/content-router.vitest.ts:48-107` with timeout, null-response, and cache-reuse cases.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts tests/handler-memory-save.vitest.ts`.
- Verify the natural save path can reach Tier3 when the first two tiers stay ambiguous and still falls back cleanly when the classifier is unavailable.

## Risks
- Introducing a new env contract instead of reusing the OpenAI-compatible pattern would create unnecessary config drift.
- Wiring Tier3 without a real cache would reclassify the same ambiguous chunk repeatedly.
- Letting classifier failures bubble up would turn a routing enhancement into a save-path outage.
