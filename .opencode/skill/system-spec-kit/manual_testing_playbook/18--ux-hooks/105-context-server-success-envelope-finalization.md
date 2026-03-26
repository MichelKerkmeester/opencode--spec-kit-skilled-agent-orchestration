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
- Prompt: `Validate the finalized context-server success-envelope path, including token metadata recomputation. Capture the evidence needed to prove Context-server suite passes with end-to-end assertions for appended hints, preserved autoSurfacedContext, and finalized token metadata. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata
- Pass/fail: PASS if `tests/context-server.vitest.ts` passes and the assertions cover the final success-envelope path end to end

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 105 | Context-server success-envelope finalization | Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract | `Validate the finalized context-server success-envelope path, including token metadata recomputation. Capture the evidence needed to prove Context-server suite passes with end-to-end assertions for appended hints, preserved autoSurfacedContext, and finalized token metadata. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx vitest run tests/context-server.vitest.ts` 2) inspect assertions covering appended success hints 3) inspect assertions covering preserved `autoSurfacedContext` 4) inspect assertions covering final token metadata after hint append and before budget enforcement | Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata | Test transcript + key assertion output | PASS if `tests/context-server.vitest.ts` passes and the assertions cover the final success-envelope path end to end | Inspect `context-server.ts` success-path assembly and expected envelope fields |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/08-context-server-success-hint-append.md](../../feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 105
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/105-context-server-success-envelope-finalization.md`
