---
title: "031 -- Negative feedback confidence signal (A4)"
description: "This scenario validates Negative feedback confidence signal (A4) for `031`. It focuses on Confirm demotion floor+recovery."
audited_post_018: true
---

# 031 -- Negative feedback confidence signal (A4)

## 1. OVERVIEW

This scenario validates Negative feedback confidence signal (A4) for `031`. It focuses on Confirm demotion floor+recovery.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm demotion floor+recovery.
- Real user request: `Please validate Negative feedback confidence signal (A4) against the documented validation surface and tell me whether the expected signals are present: Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time.`
- RCAF Prompt: `As a scoring validation operator, validate Negative feedback confidence signal (A4) against the documented validation surface. Verify negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Multiplier decreases with negatives, never below floor; recovery toward 1.0 over half-life; FAIL: Multiplier reaches 0 or no recovery observed

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm demotion floor+recovery against the documented validation surface. Verify negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Submit negatives
2. Query multiplier
3. Verify floor/half-life recovery

### Expected

Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time

### Evidence

Confidence multiplier values after negatives + floor verification + recovery curve data

### Pass / Fail

- **Pass**: Multiplier decreases with negatives, never below floor; recovery toward 1.0 over half-life
- **Fail**: Multiplier reaches 0 or no recovery observed

### Failure Triage

Verify demotion formula → Check floor configuration → Inspect half-life recovery timer

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/09-negative-feedback-confidence-signal.md](../../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/031-negative-feedback-confidence-signal-a4.md`
