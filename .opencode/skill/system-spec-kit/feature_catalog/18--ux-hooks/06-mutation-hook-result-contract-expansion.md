---
title: "Mutation hook result contract expansion"
description: "Mutation hook result contract expansion adds `latencyMs` and cache-clear booleans to post-mutation hook results."
---

# Mutation hook result contract expansion

## 1. OVERVIEW

Mutation hook result contract expansion adds `latencyMs` and cache-clear booleans to post-mutation hook results.

After the system finishes its follow-up tasks on a save, it now reports how long those tasks took and whether any caches were cleared. This gives you a clearer picture of what happened behind the scenes, like a shipping notification that tells you not just "delivered" but also the delivery time and which steps were completed.

---

## 2. CURRENT REALITY

The shared mutation hook result contract was expanded to include `latencyMs` and cache-clear booleans. Callers now receive explicit timing and cache invalidation signals from post-mutation hook execution.

The result contract also includes an `errors: string[]` field that captures actual error messages from failed hook executions. When errors are present, they are surfaced in the response hints array as `'Post-mutation hook errors: ...'`, giving callers diagnostic visibility into hook failures alongside the timing and cache-clear metadata.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-types.ts` | Handler | `MutationHookResult` contract with `latencyMs`, cache-clear booleans, and `errors` array |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch producing contract-aligned result fields |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Consumes expanded hook-result contract for UX payload shaping |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Cache invalidation signaled via cache-clear booleans |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Cache invalidation signaled via cache-clear booleans |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/mutation-hooks.vitest.ts` | Mutation-hook result behavior, latencyMs, cache-clear booleans, error surfacing |
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Cross-handler wiring against shared mutation-hook contract |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Mutation response payload contract verification |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Mutation hook result contract expansion
- Current reality source: FEATURE_CATALOG.md
