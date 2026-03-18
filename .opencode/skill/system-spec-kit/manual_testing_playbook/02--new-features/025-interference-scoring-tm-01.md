---
title: "NEW-025 -- Interference scoring (TM-01)"
description: "This scenario validates Interference scoring (TM-01) for `NEW-025`. It focuses on Confirm cluster penalty."
---

# NEW-025 -- Interference scoring (TM-01)

## 1. OVERVIEW

This scenario validates Interference scoring (TM-01) for `NEW-025`. It focuses on Confirm cluster penalty.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-025` and confirm the expected signals without contradicting evidence.

- Objective: Confirm cluster penalty
- Prompt: `Validate interference scoring (TM-01).`
- Expected signals: Near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected
- Pass/fail: PASS: Duplicates penalized with lower effective score; non-duplicates retain original scores; FAIL: No penalty applied or false positive penalties

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-025 | Interference scoring (TM-01) | Confirm cluster penalty | `Validate interference scoring (TM-01).` | 1) Save near-duplicates 2) Query 3) Verify penalty impact | Near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected | Query output showing penalized vs unpenalized scores + cluster membership verification | PASS: Duplicates penalized with lower effective score; non-duplicates retain original scores; FAIL: No penalty applied or false positive penalties | Verify similarity threshold for clustering → Check penalty formula → Inspect near-duplicate detection algorithm |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/03-interference-scoring.md](../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/025-interference-scoring-tm-01.md`
