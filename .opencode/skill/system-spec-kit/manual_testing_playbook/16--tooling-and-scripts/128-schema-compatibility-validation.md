---
title: "128 -- Schema compatibility validation"
description: "This scenario validates Schema compatibility validation for `128`. It focuses on Verify backward-compatibility validation flags required schema gaps without throwing on partial databases."
---

# 128 -- Schema compatibility validation

## 1. OVERVIEW

This scenario validates Schema compatibility validation for `128`. It focuses on Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `128` and confirm the expected signals without contradicting evidence.

- Objective: Verify backward-compatibility validation flags required schema gaps without throwing on partial databases
- Prompt: `Run the schema compatibility validation suite. Capture the evidence needed to prove Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage
- Pass/fail: PASS if `vector-index-schema-compatibility.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 128 | Schema compatibility validation | Verify backward-compatibility validation flags required schema gaps without throwing on partial databases | `Run the schema compatibility validation suite. Capture the evidence needed to prove Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npm test -- --run tests/vector-index-schema-compatibility.vitest.ts` | Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage | Test transcript + suite summary | PASS if `vector-index-schema-compatibility.vitest.ts` completes with all tests passing and no failures | Re-run `npm test -- --run tests/vector-index-schema-compatibility.vitest.ts -t compatible`; inspect `vector-index-schema.ts` required-table/column lists if assertions drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/10-schema-compatibility-validation.md](../../feature_catalog/16--tooling-and-scripts/10-schema-compatibility-validation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 128
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/128-schema-compatibility-validation.md`
