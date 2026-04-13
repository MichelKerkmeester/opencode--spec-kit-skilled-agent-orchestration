---
title: "Wire Tier3 LLM Classifier into Save Handler - Tasks"
status: completed
---
# Tasks
- [x] T-01: Add a production Tier3 adapter that uses the prompt contract in `mcp_server/lib/routing/content-router.ts:1128-1172` and the OpenAI-compatible fetch pattern in `mcp_server/lib/search/llm-reformulation.ts:185-274`, following `../research/research.md:59-71,151-156`.
- [x] T-02: Implement a concrete `RouterCache` and inject both `classifyWithTier3` and `cache` into `createContentRouter()` at `mcp_server/handlers/memory-save.ts:1008`.
- [x] T-03: Keep the save path fail-open so null responses, timeouts, and invalid payloads fall back to Tier2 rather than rejecting the save operation.
- [x] T-04: Add natural-routing coverage in `mcp_server/tests/handler-memory-save.vitest.ts:1076` so the save handler proves Tier3 can run without an explicit `routeAs`.
- [x] T-05: Extend `mcp_server/tests/content-router.vitest.ts:48-107` with cache-reuse, timeout, and null-response cases for the Tier3 dependency path.
- [x] T-06: Correct Tier 3 prompt context in `mcp_server/handlers/memory-save.ts` so `packet_kind` comes from spec metadata/structure, natural saves emit `save_mode='natural'`, explicit overrides emit `save_mode='route-as'`, and `mcp_server/tests/handler-memory-save.vitest.ts` inspects the outgoing prompt body directly.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts tests/handler-memory-save.vitest.ts`
