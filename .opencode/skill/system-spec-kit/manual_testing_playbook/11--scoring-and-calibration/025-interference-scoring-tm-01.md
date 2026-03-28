---
title: "025 -- Interference scoring (TM-01)"
description: "This scenario validates Interference scoring (TM-01) for `025`. It focuses on Confirm cluster penalty."
---

# 025 -- Interference scoring (TM-01)

## 1. OVERVIEW

This scenario validates Interference scoring (TM-01) for `025`. It focuses on Confirm cluster penalty.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `025` and confirm the expected signals without contradicting evidence.

- Objective: Confirm cluster penalty
- Prompt: `Validate interference scoring (TM-01). Capture the evidence needed to prove an active near-duplicate cluster receives a penalty, that penalty reduces effective score, non-duplicates remain unaffected, and archived or deprecated siblings do not count toward the active interference score. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; archived or deprecated siblings do not increase the active interference count
- Pass/fail: PASS: Active duplicates are penalized with lower effective score while archived or deprecated copies stay ignored; FAIL: No penalty is applied, inactive rows still count, or false positive penalties appear

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 025 | Interference scoring (TM-01) | Confirm cluster penalty | `Validate interference scoring (TM-01). Capture the evidence needed to prove an active near-duplicate cluster receives a penalty, that penalty reduces effective score, non-duplicates remain unaffected, and archived or deprecated siblings do not count toward the active interference score. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save two or more active near-duplicate memories in the same spec folder plus one archived or deprecated near-duplicate sibling 2) Query the cluster topic 3) Verify the active duplicates receive the penalty while the archived or deprecated sibling does not inflate the active interference count 4) Compare against a non-duplicate control memory in the same folder | Active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; archived or deprecated siblings do not increase the active interference count | Query output showing penalized vs unpenalized scores + state/tier verification for the inactive sibling | PASS: Active duplicates are penalized while inactive siblings stay ignored and non-duplicates retain their scores; FAIL: No penalty applies, inactive rows still count, or false positives appear | Verify similarity threshold, retrievable-row predicates, and penalty formula in `interference-scoring.ts` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/03-interference-scoring.md](../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 025
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/025-interference-scoring-tm-01.md`
