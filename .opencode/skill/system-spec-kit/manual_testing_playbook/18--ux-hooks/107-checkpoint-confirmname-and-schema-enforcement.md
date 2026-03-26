---
title: "107 -- Checkpoint confirmName and schema enforcement"
description: "This scenario validates Checkpoint confirmName and schema enforcement for `107`. It focuses on Confirm delete safety is required across handler and validation layers."
---

# 107 -- Checkpoint confirmName and schema enforcement

## 1. OVERVIEW

This scenario validates Checkpoint confirmName and schema enforcement for `107`. It focuses on Confirm delete safety is required across handler and validation layers.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `107` and confirm the expected signals without contradicting evidence.

- Objective: Confirm delete safety is required across handler and validation layers
- Prompt: `Validate checkpoint delete confirmName enforcement across handler and schema layers. Capture the evidence needed to prove Validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. Additionally, `tests/context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement
- Pass/fail: PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 107 | Checkpoint confirmName and schema enforcement | Confirm delete safety is required across handler and validation layers | `Validate checkpoint delete confirmName enforcement across handler and schema layers. Capture the evidence needed to prove Validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting, and context-server Group 13b structural tests pass. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts` 2) `npx vitest run tests/context-server.vitest.ts` (Group 13b: T103–T106 structural source-code pattern verification) 3) inspect rejection assertions for missing `confirmName` 4) inspect success assertions for `safetyConfirmationUsed=true` | Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. `context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement | Test transcript + assertion snippets | PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end | Inspect checkpoint handler, schemas, tool typing alignment, and context-server structural test expectations |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/03-checkpoint-delete-confirmname-safety.md](../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 107
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/107-checkpoint-confirmname-and-schema-enforcement.md`
