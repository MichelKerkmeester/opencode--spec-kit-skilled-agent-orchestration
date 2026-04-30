---
title: "032 -- Auto-promotion on validation (T002a)"
description: "This scenario validates Auto-promotion on validation (T002a) for `032`. It focuses on Confirm promotion thresholds/throttle."
audited_post_018: true
---

# 032 -- Auto-promotion on validation (T002a)

## 1. OVERVIEW

This scenario validates Auto-promotion on validation (T002a) for `032`. It focuses on Confirm promotion thresholds/throttle.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm promotion thresholds/throttle.
- Real user request: `Please validate Auto-promotion on validation (T002a) against the documented validation surface and tell me whether the expected signals are present: Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged.`
- RCAF Prompt: `As a scoring validation operator, validate Auto-promotion on validation (T002a) against the documented validation surface. Verify positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Promotion occurs at threshold count; throttle blocks re-promotion within window; audit row created; FAIL: Promotion at wrong threshold or throttle bypassed

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm promotion thresholds/throttle against the documented validation surface. Verify positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Submit positive validations
2. Check tier changes
3. Verify throttle/audit

### Expected

Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged

### Evidence

Tier change log + throttle enforcement evidence + promotion audit trail

### Pass / Fail

- **Pass**: Promotion occurs at threshold count; throttle blocks re-promotion within window; audit row created
- **Fail**: Promotion at wrong threshold or throttle bypassed

### Failure Triage

Verify promotion threshold configuration → Check throttle window duration → Inspect audit logging

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/10-auto-promotion-on-validation.md](../../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/032-auto-promotion-on-validation-t002a.md`
