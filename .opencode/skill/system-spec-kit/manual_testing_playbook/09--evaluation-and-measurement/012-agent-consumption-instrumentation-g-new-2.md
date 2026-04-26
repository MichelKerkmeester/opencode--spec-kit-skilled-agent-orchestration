---
title: "012 -- Agent consumption instrumentation (G-NEW-2)"
description: "This scenario validates Agent consumption instrumentation (G-NEW-2) for `012`. It focuses on Confirm wiring with inert runtime."
---

# 012 -- Agent consumption instrumentation (G-NEW-2)

## 1. OVERVIEW

This scenario validates Agent consumption instrumentation (G-NEW-2) for `012`. It focuses on Confirm wiring with inert runtime.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `012` and confirm the expected signals without contradicting evidence.

- Objective: Confirm wiring with inert runtime
- Prompt: `As an evaluation validation operator, validate Agent consumption instrumentation (G-NEW-2) against the documented validation surface. Verify logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors
- Pass/fail: PASS: Handlers execute without error and produce no telemetry output (inert mode); FAIL: Telemetry output produced or handler errors

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm wiring with inert runtime against the documented validation surface. Verify logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Trigger retrieval handlers
2. Inspect logger gate
3. Confirm no-op telemetry

### Expected

Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors

### Evidence

Instrumentation trace showing handler wiring + logger gate state + empty telemetry output

### Pass / Fail

- **Pass**: Handlers execute without error and produce no telemetry output (inert mode)
- **Fail**: Telemetry output produced or handler errors

### Failure Triage

Verify logger gate configuration → Check handler registration → Inspect inert/active mode toggle

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/08-agent-consumption-instrumentation.md](../../feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/012-agent-consumption-instrumentation-g-new-2.md`
- audited_post_018: true
