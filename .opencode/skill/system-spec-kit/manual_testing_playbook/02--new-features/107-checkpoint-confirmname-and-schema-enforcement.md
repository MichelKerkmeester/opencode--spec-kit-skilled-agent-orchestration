---
title: "NEW-107 -- Checkpoint confirmName and schema enforcement"
description: "This scenario validates Checkpoint confirmName and schema enforcement for `NEW-107`. It focuses on Confirm delete safety is required across handler and validation layers."
---

# NEW-107 -- Checkpoint confirmName and schema enforcement

## 1. OVERVIEW

This scenario validates Checkpoint confirmName and schema enforcement for `NEW-107`. It focuses on Confirm delete safety is required across handler and validation layers.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-107` and confirm the expected signals without contradicting evidence.

- Objective: Confirm delete safety is required across handler and validation layers
- Prompt: `Validate checkpoint delete confirmName enforcement across handler and schema layers.`
- Expected signals: Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting
- Pass/fail: PASS if the three suites pass and prove required `confirmName` enforcement end to end

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-107 | Checkpoint confirmName and schema enforcement | Confirm delete safety is required across handler and validation layers | `Validate checkpoint delete confirmName enforcement across handler and schema layers.` | 1) `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts` 2) inspect rejection assertions for missing `confirmName` 3) inspect success assertions for `safetyConfirmationUsed=true` | Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting | Test transcript + assertion snippets | PASS if the three suites pass and prove required `confirmName` enforcement end to end | Inspect checkpoint handler, schemas, and tool typing alignment |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/03-checkpoint-delete-confirmname-safety.md](../../feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-107
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/107-checkpoint-confirmname-and-schema-enforcement.md`
