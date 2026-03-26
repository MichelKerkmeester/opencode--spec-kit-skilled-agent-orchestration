---
title: "Schema and type contract synchronization"
description: "Schema and type contract synchronization aligns runtime validation with TypeScript contracts for mutation-safety behavior across handler, schema and tool boundaries."
---

# Schema and type contract synchronization

## 1. OVERVIEW

Schema and type contract synchronization aligns runtime validation with TypeScript contracts for mutation-safety behavior across handler, schema and tool boundaries.

This feature makes sure every layer of the system agrees on the shape of data being passed around. When one layer expects a certain field to be required, every other layer enforces the same rule. Without this alignment, a change in one place could silently break another, like two departments using different versions of the same form.

---

## 2. CURRENT REALITY

Phase 014 aligned runtime validation and TypeScript contracts for mutation-safety behavior. The finalized state keeps `checkpoint_delete.confirmName` required across handler, schema and tool-boundary typing, and keeps the shared mutation-hook result contract synchronized for all mutation handlers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/checkpoints.ts` | Handler | Enforces required `confirmName` and delete safety semantics |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod schemas requiring `confirmName` |
| `mcp_server/tool-schemas.ts` | Tool Definition | Published tool schema shape for checkpoint inputs |
| `mcp_server/tools/types.ts` | Tool Boundary | `validateToolArgs(...)` + typed parse boundary |
| `mcp_server/handlers/memory-crud-types.ts` | Handler Type | Shared `MutationHookResult` contract |
| `mcp_server/handlers/mutation-hooks.ts` | Handler Runtime | Produces contract-aligned hook result fields |
| `mcp_server/hooks/mutation-feedback.ts` | Hook Consumer | Consumes hook-result contract for UX payload shaping |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-checkpoints.vitest.ts` | `confirmName` validation and checkpoint-delete contract coverage |
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Cross-handler wiring against shared mutation-hook contract |
| `mcp_server/tests/mutation-hooks.vitest.ts` | Mutation-hook result behavior and warning/error consistency |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Mutation response payload contract verification (`postMutationHooks`) |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Schema and type contract synchronization
- Current reality source: FEATURE_CATALOG.md
