---
title: "Wire Tier3 LLM Classifier into Save Handler - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Add a production Tier3 adapter that uses the prompt contract in `mcp_server/lib/routing/content-router.ts:1128-1172` and the OpenAI-compatible fetch pattern in `mcp_server/lib/search/llm-reformulation.ts:185-274`, following `../research/research.md:59-71,151-156`.
- [ ] T-02: Implement a concrete `RouterCache` and inject both `classifyWithTier3` and `cache` into `createContentRouter()` at `mcp_server/handlers/memory-save.ts:1008`.
- [ ] T-03: Keep the save path fail-open so null responses, timeouts, and invalid payloads fall back to Tier2 rather than rejecting the save operation.
- [ ] T-04: Add natural-routing coverage in `mcp_server/tests/handler-memory-save.vitest.ts:1076` so the save handler proves Tier3 can run without an explicit `routeAs`.
- [ ] T-05: Extend `mcp_server/tests/content-router.vitest.ts:48-107` with cache-reuse, timeout, and null-response cases for the Tier3 dependency path.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts tests/handler-memory-save.vitest.ts`
