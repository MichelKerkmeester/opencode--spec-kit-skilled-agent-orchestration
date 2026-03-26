---
title: "Shared post-mutation hook wiring"
description: "Shared post-mutation hook wiring runs the same hook automation after save, update, delete and bulk-delete flows so cache invalidation stays consistent across handlers."
---

# Shared post-mutation hook wiring

## 1. OVERVIEW

Shared post-mutation hook wiring runs the same hook automation after save, update, delete and bulk-delete flows so cache invalidation stays consistent across handlers.

After the system saves or changes any piece of knowledge, it runs a standard set of follow-up tasks automatically. Think of it like a checklist that runs every time you file a document: update the index, notify anyone watching and log the change. Before this feature, each type of save had its own checklist, so some steps could get missed.

---

## 2. CURRENT REALITY

Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.

All five post-mutation hook catch blocks (save atomic, save standard, update, delete, bulk-delete) now capture and surface actual error messages instead of silently swallowing them with `errors: []`. When a hook throws, the error message is collected into the `errors` array of the hook result and propagated as a hint in the response, giving callers visibility into hook failures.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch across save, update, delete and bulk-delete flows |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | `MutationHookResult` contract shared by all mutation handlers |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook consuming hook-result contract |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook triggered post-mutation |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Cache invalidated by post-mutation hooks |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Cache invalidated by post-mutation hooks |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Cross-handler wiring against shared mutation-hook contract |
| `mcp_server/tests/mutation-hooks.vitest.ts` | Mutation-hook result behavior and warning/error consistency |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Mutation response payload contract verification |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Shared post-mutation hook wiring
- Current reality source: FEATURE_CATALOG.md
