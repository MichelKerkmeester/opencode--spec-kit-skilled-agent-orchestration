---
title: "105 -- Context-server success-envelope finalization"
description: "This scenario validates Context-server success-envelope finalization for `105`. It focuses on Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract."
---

# 105 -- Context-server success-envelope finalization

## 1. OVERVIEW

This scenario validates Context-server success-envelope finalization for `105`. It focuses on Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `105` and confirm the expected signals without contradicting evidence.

- Objective: Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract
- Prompt: `As a runtime-hook validation operator, validate Context-server success-envelope finalization against npx vitest run tests/context-server.vitest.ts. Verify appendAutoSurfaceHints() runs before budget enforcement and preserves the finalized envelope contract. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata
- Pass/fail: PASS if `tests/context-server.vitest.ts` passes and the assertions cover the final success-envelope path end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm appendAutoSurfaceHints() runs before budget enforcement and preserves the finalized envelope contract against npx vitest run tests/context-server.vitest.ts. Verify context-server suite passes with end-to-end assertions for appended hints, preserved autoSurfacedContext, and finalized token metadata. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `npx vitest run tests/context-server.vitest.ts`
2. inspect assertions covering appended success hints
3. inspect assertions covering preserved `autoSurfacedContext`
4. inspect assertions covering final token metadata after hint append and before budget enforcement

### Expected

Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata

### Evidence

Test transcript + key assertion output

### Pass / Fail

- **Pass**: `tests/context-server.vitest.ts` passes and the assertions cover the final success-envelope path end to end
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `context-server.ts` success-path assembly and expected envelope fields

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/08-context-server-success-hint-append.md](../../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 105
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/105-context-server-success-envelope-finalization.md`
- audited_post_018: true
