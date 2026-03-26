---
title: "216 -- End-to-end success-envelope verification"
description: "This scenario validates End-to-end success-envelope verification for `216`. It focuses on Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together."
---

# 216 -- End-to-end success-envelope verification

## 1. OVERVIEW

This scenario validates End-to-end success-envelope verification for `216`. It focuses on Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `216` and confirm the expected signals without contradicting evidence.

- Objective: Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together
- Prompt: `Validate end-to-end success-envelope behavior for the context server. Capture the evidence needed to prove successful responses append auto-surface hints, preserve autoSurfacedContext, and return a final tokenCount that matches the fully serialized envelope after all hint and budget mutations. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Context-server and hook suites pass, success envelopes append auto-surface hints, preserve `autoSurfacedContext`, and keep `meta.tokenCount` aligned with the finalized serialized payload
- Pass/fail: PASS if the targeted suites pass and the assertions prove the final success envelope preserves hints, context, and token metadata end to end

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 216 | End-to-end success-envelope verification | Confirm finalized success envelopes preserve appended hints, auto-surfaced context, and token metadata correctness together | `Validate end-to-end success-envelope behavior for the context server. Capture the evidence needed to prove successful responses append auto-surface hints, preserve autoSurfacedContext, and return a final tokenCount that matches the fully serialized envelope after all hint and budget mutations. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/hooks-ux-feedback.vitest.ts` 2) inspect assertions covering success-path hint append 3) inspect assertions covering preserved `autoSurfacedContext` 4) inspect assertions covering final serialized-envelope token-count alignment | Context-server and hook suites pass, success envelopes append auto-surface hints, preserve `autoSurfacedContext`, and keep `meta.tokenCount` aligned with the finalized serialized payload | Test transcript + key assertion output for success-envelope and token-alignment coverage | PASS if the targeted suites pass and the assertions prove the final success envelope preserves hints, context, and token metadata end to end | Inspect `context-server.ts`, `hooks/index.ts`, and `hooks/response-hints.ts` if any success-envelope field or final token count regresses |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/13-end-to-end-success-envelope-verification.md](../../feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 216
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/216-end-to-end-success-envelope-verification.md`
- Feature catalog back-ref: `18--ux-hooks/13-end-to-end-success-envelope-verification.md`
