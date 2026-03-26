---
title: "EX-033 -- 6. Debug and Telemetry"
description: "This scenario validates 6. Debug and Telemetry for `EX-033`. It focuses on Observability toggle check."
---

# EX-033 -- 6. Debug and Telemetry

## 1. OVERVIEW

This scenario validates 6. Debug and Telemetry for `EX-033`. It focuses on Observability toggle check.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-033` and confirm the expected signals without contradicting evidence.

- Objective: Observability toggle check
- Prompt: `List telemetry/debug vars and separate opt-in flags from inert flags. Capture the evidence needed to prove Debug/telemetry controls identified. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Debug/telemetry controls identified
- Pass/fail: PASS if opt-in vs inert controls are clearly separated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-033 | 6. Debug and Telemetry | Observability toggle check | `List telemetry/debug vars and separate opt-in flags from inert flags. Capture the evidence needed to prove Debug/telemetry controls identified. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 })` | Debug/telemetry controls identified | Search output | PASS if opt-in vs inert controls are clearly separated | Check feature flag governance section |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [19--feature-flag-reference/06-6-debug-and-telemetry.md](../../feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md)

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: EX-033
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/033-6-debug-and-telemetry.md`
