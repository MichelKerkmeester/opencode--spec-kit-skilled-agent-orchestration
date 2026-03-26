---
title: "Final token metadata recomputation"
description: "Final token metadata recomputation recalculates `meta.tokenCount` after hint append and before token-budget enforcement to keep the count aligned with the serialized envelope."
---

# Final token metadata recomputation

## 1. OVERVIEW

Final token metadata recomputation recalculates `meta.tokenCount` after hint append and before token-budget enforcement to keep the count aligned with the serialized envelope.

After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item.

---

## 2. CURRENT REALITY

Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`: auto-resume `systemPromptContext` items are injected before `enforceTokenBudget()` runs, so both `meta.tokenCount` and the delivered payload stay aligned with the final serialized envelope returned to callers.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/response-hints.ts` | Hook | Recomputes `meta.tokenCount` from finalized serialized envelope |
| `mcp_server/context-server.ts` | Server | Runs hint append before budget enforcement in success path |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility used for final token sync |

### Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | `appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON` | Verifies `appendAutoSurfaceHints` drives final token metadata recomputation by using `syncEnvelopeTokenCount` and `serializeEnvelopeWithTokenCount` on the final envelope payload. |
| `mcp_server/tests/context-server.vitest.ts` | `T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection` | Verifies end-to-end server flow preserves final token-count correctness after hint and metadata mutations. |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Final token metadata recomputation
- Current reality source: FEATURE_CATALOG.md
