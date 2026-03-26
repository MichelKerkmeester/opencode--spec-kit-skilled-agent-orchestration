---
title: "Duplicate-save no-op feedback hardening"
description: "Duplicate-save no-op feedback hardening prevents false mutation hook data and cache-clearing hints from appearing in no-op save responses."
---

# Duplicate-save no-op feedback hardening

## 1. OVERVIEW

Duplicate-save no-op feedback hardening prevents false mutation hook data and cache-clearing hints from appearing in no-op save responses.

When you try to save something that is already stored exactly as-is, the system now tells you honestly that nothing changed instead of pretending it did work. Previously it could report misleading cache-clearing activity even when nothing happened. It is like a vending machine that returns your coin and says "already dispensed" instead of making clunking sounds and giving you nothing.

---

## 2. CURRENT REALITY

Both `duplicate` and `unchanged` save statuses now suppress post-mutation hooks and no longer emit false `postMutationHooks`, cache-clear booleans, or misleading invalidation hints. They explain that the save was a no-op and that caches were left unchanged, so callers receive accurate mutation feedback without pretending a hook ran.

This suppression applies to both the standard save path (`response-builder.ts`) and the atomic save path (`memory-save.ts`). An FSRS corruption guard also prevents `applyPostInsertMetadata` from running on duplicate or unchanged saves, ensuring that spaced-repetition fields (`review_count`, `last_review`) are not reset to initial values when no actual mutation occurred.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/save/response-builder.ts` | Handler | Standard save path: suppresses `postMutationHooks` and cache-clear hints for `duplicate`/`unchanged` statuses |
| `mcp_server/handlers/memory-save.ts` | Handler | Atomic save path: suppresses hooks and FSRS corruption guard for duplicate/unchanged saves |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic producing `duplicate`/`unchanged` status |
| `mcp_server/handlers/save/post-insert.ts` | Handler | `applyPostInsertMetadata` guarded against running on no-op saves |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch (skipped on no-op statuses) |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook (not invoked on no-op saves) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Duplicate no-op omits `postMutationHooks`, reports no-op status |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Save integration including duplicate/unchanged scenarios |
| `mcp_server/tests/memory-save-extended.vitest.ts` | Extended save scenarios covering FSRS corruption guard |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Duplicate-save no-op feedback hardening
- Current reality source: FEATURE_CATALOG.md
