---
title: "EX-035 -- Startup runtime compatibility guards"
description: "This scenario validates Startup runtime compatibility guards for `EX-035`. It focuses on Startup diagnostics verification."
---

# EX-035 -- Startup runtime compatibility guards

## 1. OVERVIEW

This scenario validates Startup runtime compatibility guards for `EX-035`. It focuses on Startup diagnostics verification.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-035` and confirm the expected signals without contradicting evidence.

- Objective: Startup diagnostics verification
- Prompt: `Run the dedicated startup guard validation suite. Capture the evidence needed to prove Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript
- Pass/fail: PASS if `startup-checks.vitest.ts` completes with all tests passing and no failures

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-035 | Startup runtime compatibility guards | Startup diagnostics verification | `Run the dedicated startup guard validation suite. Capture the evidence needed to prove Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript. Return a concise user-facing pass/fail verdict with the main reason.` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/startup-checks.vitest.ts` | Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript | Test transcript + suite summary | PASS if `startup-checks.vitest.ts` completes with all tests passing and no failures | Re-run `npm test -- --run tests/startup-checks.vitest.ts -t detectRuntimeMismatch`; inspect `startup-checks.ts` and test expectations if counts or assertions drift |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [04--maintenance/02-startup-runtime-compatibility-guards.md](../../feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md)

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: EX-035
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--maintenance/035-startup-runtime-compatibility-guards.md`
