---
title: "Atomic-save parity and partial-indexing hints"
description: "Atomic-save parity ensures `atomicSaveMemory()` returns the same `postMutationHooks` envelope and UX hint payloads as the primary save path."
---

# Atomic-save parity and partial-indexing hints

## 1. OVERVIEW

Atomic-save parity ensures `atomicSaveMemory()` returns the same `postMutationHooks` envelope and UX hint payloads as the primary save path.

The system has two ways to save memories: a standard path and a faster "atomic" path. This feature made them return the same kind of feedback so you do not get different information depending on which path ran. It is like making sure both the express and regular checkout lanes at a store give you the same receipt format.

---

## 2. CURRENT REALITY

`atomicSaveMemory()` now returns the same `postMutationHooks` envelope shape and UX hint payloads as the primary save path. The finalized follow-up pass also preserved structured partial-indexing guidance so callers can handle atomic-save outcomes with the same parsing and recovery flow used for standard saves.

The atomic path now applies `applyPostInsertMetadata(database, id, {})` for genuinely new saves, guarded by an unchanged/duplicate status check to avoid resetting FSRS spaced-repetition data. Both paths identically filter `unchanged` and `duplicate` statuses for hook suppression. After-tool callbacks in the atomic path receive a `structuredClone` snapshot of the result to prevent mutation before hint injection completes.

Failure semantics are tighter on the primary governed-save path too. After a new row is inserted, governance metadata application and governance-audit recording run inside a transaction, and any failure deletes the orphaned row instead of returning a half-governed success. That keeps standard-save outcomes aligned with the all-or-nothing expectations callers already rely on from the atomic flow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Atomic save path: returns `postMutationHooks` envelope, applies `applyPostInsertMetadata` with FSRS guard, `structuredClone` callback isolation |
| `mcp_server/handlers/save/response-builder.ts` | Handler | Standard save path: emits matching `postMutationHooks` envelope and UX hints |
| `mcp_server/handlers/save/post-insert.ts` | Handler | `applyPostInsertMetadata` for new saves, guarded by unchanged/duplicate status |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch producing the shared hook result contract |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | `MutationHookResult` contract shape shared by both save paths |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook consuming the shared contract |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Atomic save parity: `postMutationHooks` contract fields, duplicate no-op suppression |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Save integration covering both standard and atomic paths |
| `mcp_server/tests/memory-save-extended.vitest.ts` | Extended save scenarios including partial-indexing guidance |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Atomic-save parity and partial-indexing hints
- Current reality source: FEATURE_CATALOG.md
