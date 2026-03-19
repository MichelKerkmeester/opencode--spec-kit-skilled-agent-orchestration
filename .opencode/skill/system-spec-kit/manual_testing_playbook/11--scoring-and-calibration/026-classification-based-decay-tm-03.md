---
title: "NEW-026 -- Classification-based decay (TM-03)"
description: "This scenario validates Classification-based decay (TM-03) for `NEW-026`. It focuses on Confirm class+tier decay matrix."
---

# NEW-026 -- Classification-based decay (TM-03)

## 1. OVERVIEW

This scenario validates Classification-based decay (TM-03) for `NEW-026`. It focuses on Confirm class+tier decay matrix.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-026` and confirm the expected signals without contradicting evidence.

- Objective: Confirm class+tier decay matrix
- Prompt: `Verify TM-03 classification-based decay. Capture the evidence needed to prove Decay multipliers differ by classification and tier; matrix values match documented configuration. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Decay multipliers differ by classification and tier; matrix values match documented configuration
- Pass/fail: PASS: Each class+tier combination produces distinct documented multiplier; scores decay accordingly; FAIL: Multipliers missing or do not match configuration matrix

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-026 | Classification-based decay (TM-03) | Confirm class+tier decay matrix | `Verify TM-03 classification-based decay. Capture the evidence needed to prove Decay multipliers differ by classification and tier; matrix values match documented configuration. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Save tier/class mix 2) Query scoring path 3) Validate multipliers | Decay multipliers differ by classification and tier; matrix values match documented configuration | Scoring path output with per-class/tier decay multipliers + configuration comparison | PASS: Each class+tier combination produces distinct documented multiplier; scores decay accordingly; FAIL: Multipliers missing or do not match configuration matrix | Verify decay matrix configuration → Check classification assignment → Inspect tier resolution logic |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/04-classification-based-decay.md](../../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: NEW-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/026-classification-based-decay-tm-03.md`
