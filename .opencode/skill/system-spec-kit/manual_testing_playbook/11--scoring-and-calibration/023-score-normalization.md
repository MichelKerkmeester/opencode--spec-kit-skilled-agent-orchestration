---
title: "023 -- Score normalization"
description: "This scenario validates Score normalization for `023`. It focuses on Confirm batch min-max behavior."
---

# 023 -- Score normalization

## 1. OVERVIEW

This scenario validates Score normalization for `023`. It focuses on Confirm batch min-max behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `023` and confirm the expected signals without contradicting evidence.

- Objective: Confirm batch min-max behavior
- Prompt: `Verify score normalization output ranges. Capture the evidence needed to prove Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled
- Pass/fail: PASS: All normalized scores in [0,1]; equal scores produce uniform output; single result = 0.0 (composite min-max with zero range returns 0); FAIL: Out-of-range values or division-by-zero on equal scores

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 023 | Score normalization | Confirm batch min-max behavior | `Verify score normalization output ranges. Capture the evidence needed to prove Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run varied-score query 2) Inspect normalized range 3) Check equal/single cases | Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled | Normalized output with range verification + edge case test results | PASS: All normalized scores in [0,1]; equal scores produce uniform output; single result = 1.0; FAIL: Out-of-range values or division-by-zero on equal scores | Verify min-max formula → Check edge case guards (single result, all-equal) → Inspect batch processing order |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/01-score-normalization.md](../../feature_catalog/11--scoring-and-calibration/01-score-normalization.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 023
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/023-score-normalization.md`
