---
title: "032 -- Auto-promotion on validation (T002a)"
description: "This scenario validates Auto-promotion on validation (T002a) for `032`. It focuses on Confirm promotion thresholds/throttle."
---

# 032 -- Auto-promotion on validation (T002a)

## 1. OVERVIEW

This scenario validates Auto-promotion on validation (T002a) for `032`. It focuses on Confirm promotion thresholds/throttle.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `032` and confirm the expected signals without contradicting evidence.

- Objective: Confirm promotion thresholds/throttle
- Prompt: `Validate auto-promotion on validation (T002a). Capture the evidence needed to prove Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged
- Pass/fail: PASS: Promotion occurs at threshold count; throttle blocks re-promotion within window; audit row created; FAIL: Promotion at wrong threshold or throttle bypassed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 032 | Auto-promotion on validation (T002a) | Confirm promotion thresholds/throttle | `Validate auto-promotion on validation (T002a). Capture the evidence needed to prove Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Submit positive validations 2) Check tier changes 3) Verify throttle/audit | Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged | Tier change log + throttle enforcement evidence + promotion audit trail | PASS: Promotion occurs at threshold count; throttle blocks re-promotion within window; audit row created; FAIL: Promotion at wrong threshold or throttle bypassed | Verify promotion threshold configuration → Check throttle window duration → Inspect audit logging |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/10-auto-promotion-on-validation.md](../../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 032
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/032-auto-promotion-on-validation-t002a.md`
