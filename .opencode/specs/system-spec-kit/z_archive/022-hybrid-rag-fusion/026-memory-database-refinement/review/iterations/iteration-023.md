# Iteration 023: API surface and tool schema consistency

## Findings

### [P1] `memory_match_triggers` cannot accept the scope fields its handler depends on
**File** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`

**Issue** The published tool schema and dispatcher-local `TriggerArgs` type expose only `prompt`, `limit`, `session_id`, `turnNumber`, and `include_cognitive`, but the handler has a second contract that expects `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId` so it can post-filter trigger results by scope. Because the dispatcher validates against the narrower schema first, direct MCP callers can never reach that scope-filtering path.

**Evidence** `tool-schemas.ts:209-213` defines the public `memory_match_triggers` input schema without any scope fields. `tools/types.ts:96-103` mirrors that narrow shape. But `handlers/memory-triggers.ts:104-115` declares those scope fields as supported inputs, and `handlers/memory-triggers.ts:291-320` actively uses them to prevent cross-scope trigger leaks. The runtime validator is also aligned with the narrower surface, not the handler, in `schemas/tool-input-schemas.ts:177-183`.

**Fix** Make the public tool contract match the handler by adding `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId` to `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, and `tools/types.ts`. If those fields are intentionally unsupported for external callers, remove the dead handler path and document that trigger matching is always global.

### [P2] `memory_quick_search` returns envelopes labeled as `memory_search`
**File** `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`

**Issue** The dispatcher advertises a distinct `memory_quick_search` tool, but it forwards directly into `handleMemorySearch()` without overriding the response metadata. As a result, success and error envelopes identify the tool as `memory_search`, not the tool the caller actually invoked.

**Evidence** `tools/memory-tools.ts:47-64` validates `memory_quick_search` and then returns `handleMemorySearch(quickArgs)`. `handlers/memory-search.ts:444-457` hard-codes `tool: 'memory_search'` in the cursor path, and the handler uses the same hard-coded tool name throughout the rest of the response-building branches. That makes the response surface inconsistent for clients that inspect `tool`, telemetry, or audit logs.

**Fix** Add a lightweight wrapper for `memory_quick_search` that either passes a caller tool name into `handleMemorySearch()` or rewrites the response envelope before returning it. At minimum, success and error responses should preserve the original tool identity.

### [P2] Shared-memory admin tools publish a looser actor contract than the dispatcher enforces
**File** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`

**Issue** The published schemas for `shared_space_upsert` and `shared_space_membership_set` imply that callers may send both `actorUserId` and `actorAgentId` together, but the runtime validator and handlers reject that combination. That is required authorization behavior, but it is not represented in the public JSON schema surface.

**Evidence** `tool-schemas.ts:398-435` declares both actor fields as independently optional with no mutual-exclusion rule. The runtime validator adds that missing constraint in `schemas/tool-input-schemas.ts:437-475` with `superRefine(...)`, and both handlers immediately route through `resolveAdminActor(...)` in `handlers/shared-memory.ts:280-283` and `handlers/shared-memory.ts:440-443`. A caller generated from `tool-schemas.ts` can therefore construct requests that look valid and still fail at dispatch time.

**Fix** Encode the actor exclusivity rule in `tool-schemas.ts` too, either with `oneOf` branches or an extension such as `x-mutuallyExclusive`. The documented contract should match the dispatcher's real acceptance rules for admin mutations.

### [P2] The published JSON schemas under-document numeric and non-empty constraints that the dispatcher already enforces
**File** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

**Issue** Several tools describe bounded or non-empty inputs in prose, but the actual JSON schema omits the matching `minimum`, `maximum`, or `minLength` rules. Generated clients and human callers will accept values that the dispatcher's Zod layer rejects, especially around negative numbers, zero values, and empty strings.

**Evidence** `tool-schemas.ts:226-226` documents `memory_list.limit` as "max 100" but publishes no numeric bounds, while `schemas/tool-input-schemas.ts:253-259` enforces `limit >= 1`, `limit <= 100`, and `offset >= 0`. `tool-schemas.ts:248-251` says `memory_health.limit` maxes at 200 but omits `maximum`, while `schemas/tool-input-schemas.ts:269-275` enforces it. `tool-schemas.ts:330-336`, `366-392` publish checkpoint names and governed scope ids as plain strings, but `schemas/tool-input-schemas.ts:277-312` requires non-empty strings. `tool-schemas.ts:480-486` describes `memory_drift_why.maxDepth` and `memory_causal_link.strength` as bounded values, but the bounds only exist in `schemas/tool-input-schemas.ts:334-347`. `tool-schemas.ts:596-609` exposes `memory_ingest_status.jobId` and `memory_ingest_cancel.jobId` without `minLength`, while `schemas/tool-input-schemas.ts:395-401` rejects empty ids.

**Fix** Treat `tool-schemas.ts` as a real machine-readable contract, not a prose summary. Mirror the runtime bounds directly in the JSON schema for every field whose validator already has hard requirements, especially min/max integers, non-empty strings, and bounded percentages.

### [P2] Dispatcher-local `ContextArgs` already drifted from the public `memory_context` contract
**File** `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`

**Issue** The dispatcher's shared `ContextArgs` interface no longer includes `profile`, even though the public schema exposes it and the handler consumes it. Because `parseArgs<T>()` is just a cast, this drift will not fail loudly, which makes future parameter omissions easy to miss.

**Evidence** `tool-schemas.ts:43-43` includes `profile` in the published `memory_context` schema. `handlers/memory-context.ts:104-121` defines a handler-local `ContextArgs` interface that also includes `profile`. But `tools/types.ts:41-57` stops at `anchors` and omits `profile`, so the dispatcher layer's own typed contract is already stale.

**Fix** Remove duplicated arg interfaces where possible, or generate them from a single source. At minimum, add `profile?: 'quick' | 'research' | 'resume' | 'debug'` to `tools/types.ts` so the dispatcher typings stay aligned with the public tool surface.

## Summary

The most important API-surface issue is that `memory_match_triggers` has a scoped handler path that is impossible to reach through the published tool contract. After that, the main consistency problem is drift between the public JSON schema and the actual dispatcher behavior: `memory_quick_search` reports itself as the wrong tool, shared-memory admin mutations have undocumented exclusivity rules, and several numeric/string bounds exist only in the Zod layer. The dispatcher-local TypeScript arg definitions are also starting to diverge from the public schema, which increases the odds of more silent contract drift.
