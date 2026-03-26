---
title: "031 -- Negative feedback confidence signal (A4)"
description: "This scenario validates Negative feedback confidence signal (A4) for `031`. It focuses on Confirm demotion floor+recovery."
---

# 031 -- Negative feedback confidence signal (A4)

## 1. OVERVIEW

This scenario validates Negative feedback confidence signal (A4) for `031`. It focuses on Confirm demotion floor+recovery.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `031` and confirm the expected signals without contradicting evidence.

- Objective: Confirm demotion floor+recovery
- Prompt: `Verify negative feedback confidence (A4). Capture the evidence needed to prove Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time
- Pass/fail: PASS: Multiplier decreases with negatives, never below floor; recovery toward 1.0 over half-life; FAIL: Multiplier reaches 0 or no recovery observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 031 | Negative feedback confidence signal (A4) | Confirm demotion floor+recovery | `Verify negative feedback confidence (A4). Capture the evidence needed to prove Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Submit negatives 2) Query multiplier 3) Verify floor/half-life recovery | Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time | Confidence multiplier values after negatives + floor verification + recovery curve data | PASS: Multiplier decreases with negatives, never below floor; recovery toward 1.0 over half-life; FAIL: Multiplier reaches 0 or no recovery observed | Verify demotion formula → Check floor configuration → Inspect half-life recovery timer |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/09-negative-feedback-confidence-signal.md](../../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 031
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/031-negative-feedback-confidence-signal-a4.md`
