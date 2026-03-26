---
title: "End-to-end success-envelope verification"
description: "End-to-end success-envelope verification asserts that the finalized response envelope preserves hint append, auto-surface context and token metadata correctness."
---

# End-to-end success-envelope verification

## 1. OVERVIEW

End-to-end success-envelope verification asserts that the finalized response envelope preserves hint append, auto-surface context and token metadata correctness.

This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.

---

## 2. CURRENT REALITY

Phase 014 verification includes end-to-end success-envelope assertions in `tests/context-server.vitest.ts`. This coverage verifies the finalized success-path hint append flow, preserved `autoSurfacedContext` and final token metadata behavior together so response-envelope regressions fail fast.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Server | End-to-end success path and envelope mutation ordering |
| `mcp_server/hooks/response-hints.ts` | Hook | Hint append + token-count resync on finalized envelope |
| `mcp_server/hooks/index.ts` | Hook Barrel | Exposes response-hint hooks to server runtime |

### Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp_server/tests/context-server.vitest.ts` | `T000i: successful responses append auto-surface hints and preserve autoSurfacedContext` | Verifies end-to-end success envelopes append auto-surface hints while preserving `autoSurfacedContext` in the response object. |
| `mcp_server/tests/context-server.vitest.ts` | `T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection` | Verifies finalized success envelopes recompute `meta.tokenCount` from the fully serialized payload after hint/token-budget mutations. |
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | `appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON` | Unit-level contract coverage for envelope hint injection and final token metadata synchronization used by the end-to-end success path. |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: End-to-end success-envelope verification
- Current reality source: FEATURE_CATALOG.md
