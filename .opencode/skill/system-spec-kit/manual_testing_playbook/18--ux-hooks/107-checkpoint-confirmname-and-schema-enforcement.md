---
title: "107 -- Checkpoint confirmName and schema enforcement"
description: "This scenario validates Checkpoint confirmName and schema enforcement for `107`. It focuses on Confirm delete safety is required across handler and validation layers."
---

# 107 -- Checkpoint confirmName and schema enforcement

## 1. OVERVIEW

This scenario validates Checkpoint confirmName and schema enforcement for `107`. It focuses on Confirm delete safety is required across handler and validation layers.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm delete safety is required across handler and validation layers.
- Real user request: `` Please validate Checkpoint confirmName and schema enforcement against npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts and tell me whether the expected signals are present: Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. Additionally, `tests/context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement. ``
- RCAF Prompt: `As a runtime-hook validation operator, validate Checkpoint confirmName and schema enforcement against npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts. Verify delete safety is required across handler and validation layers. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. Additionally, `tests/context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm delete safety is required across handler and validation layers against npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts. Verify validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting. context-server.vitest.ts Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts`
2. `npx vitest run tests/context-server.vitest.ts` (Group 13b: T103–T106 structural source-code pattern verification)
3. inspect rejection assertions for missing `confirmName`
4. inspect success assertions for `safetyConfirmationUsed=true`

### Expected

Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. `context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement

### Evidence

Test transcript + assertion snippets

### Pass / Fail

- **Pass**: the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect checkpoint handler, schemas, tool typing alignment, and context-server structural test expectations

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/03-checkpoint-delete-confirmname-safety.md](../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 107
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/107-checkpoint-confirmname-and-schema-enforcement.md`
- audited_post_018: true
