---
title: "012 -- Agent consumption instrumentation (G-NEW-2)"
description: "This scenario validates Agent consumption instrumentation (G-NEW-2) for `012`. It focuses on Confirm wiring with inert runtime."
---

# 012 -- Agent consumption instrumentation (G-NEW-2)

## 1. OVERVIEW

This scenario validates Agent consumption instrumentation (G-NEW-2) for `012`. It focuses on Confirm wiring with inert runtime.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `012` and confirm the expected signals without contradicting evidence.

- Objective: Confirm wiring with inert runtime
- Prompt: `Validate G-NEW-2 instrumentation behavior. Capture the evidence needed to prove Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors
- Pass/fail: PASS: Handlers execute without error and produce no telemetry output (inert mode); FAIL: Telemetry output produced or handler errors

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 012 | Agent consumption instrumentation (G-NEW-2) | Confirm wiring with inert runtime | `Validate G-NEW-2 instrumentation behavior. Capture the evidence needed to prove Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Trigger retrieval handlers 2) Inspect logger gate 3) Confirm no-op telemetry | Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors | Instrumentation trace showing handler wiring + logger gate state + empty telemetry output | PASS: Handlers execute without error and produce no telemetry output (inert mode); FAIL: Telemetry output produced or handler errors | Verify logger gate configuration → Check handler registration → Inspect inert/active mode toggle |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/08-agent-consumption-instrumentation.md](../../feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 012
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/012-agent-consumption-instrumentation-g-new-2.md`
