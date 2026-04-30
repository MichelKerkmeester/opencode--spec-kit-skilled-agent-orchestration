---
title: "029 -- Double intent weighting investigation (G2)"
description: "This scenario validates Double intent weighting investigation (G2) for `029`. It focuses on Confirm no hybrid double-weight."
audited_post_018: true
---

# 029 -- Double intent weighting investigation (G2)

## 1. OVERVIEW

This scenario validates Double intent weighting investigation (G2) for `029`. It focuses on Confirm no hybrid double-weight.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm no hybrid double-weight.
- Real user request: `Please validate Double intent weighting investigation (G2) against the documented validation surface and tell me whether the expected signals are present: Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally.`
- RCAF Prompt: `As a scoring validation operator, validate Double intent weighting investigation (G2) against the documented validation surface. Verify stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case; FAIL: Double intent weighting detected in hybrid path

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm no hybrid double-weight against the documented validation surface. Verify stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run hybrid query
2. Inspect stage trace
3. Confirm stage-2 intent skip

### Expected

Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally

### Evidence

Stage trace output for hybrid vs non-hybrid queries + intent weight comparison

### Pass / Fail

- **Pass**: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case
- **Fail**: Double intent weighting detected in hybrid path

### Failure Triage

Check hybrid detection logic → Verify stage-2 guard condition → Inspect intent weight application point

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/07-double-intent-weighting-investigation.md](../../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/029-double-intent-weighting-investigation-g2.md`
