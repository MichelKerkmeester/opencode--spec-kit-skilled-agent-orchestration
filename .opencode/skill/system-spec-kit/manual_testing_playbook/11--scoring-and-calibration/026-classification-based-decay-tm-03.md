---
title: "026 -- Classification-based decay (TM-03)"
description: "This scenario validates Classification-based decay (TM-03) for `026`. It focuses on Confirm class+tier decay matrix."
audited_post_018: true
---

# 026 -- Classification-based decay (TM-03)

## 1. OVERVIEW

This scenario validates Classification-based decay (TM-03) for `026`. It focuses on Confirm class+tier decay matrix.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `026` and confirm the expected signals without contradicting evidence.

- Objective: Confirm class+tier decay matrix and zero-half-life rejection
- Prompt: `As a scoring validation operator, validate Classification-based decay (TM-03) against halfLifeDays: 0. Verify decay multipliers differ by classification and tier; matrix values match documented configuration; zero half-life config is rejected with the positive-number-or-null error. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Decay multipliers differ by classification and tier; matrix values match documented configuration; zero half-life config is rejected with the positive-number-or-null error
- Pass/fail: PASS: Each class+tier combination produces distinct documented multiplier, and zero half-life config is rejected up front; FAIL: Multipliers missing, mismatch the matrix, or halfLifeDays:0 passes validation

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 026 | Classification-based decay (TM-03) | Confirm class+tier decay matrix and zero-half-life rejection | `As a scoring validation operator, confirm class+tier decay matrix and zero-half-life rejection against halfLifeDays: 0. Verify decay multipliers differ by classification and tier; matrix values match documented configuration; zero half-life config is rejected with the positive-number-or-null error. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Load the documented class/tier decay matrix 2) Validate representative class+tier outputs against the matrix 3) Submit a config with `halfLifeDays: 0` 4) Confirm validation rejects it with the positive-number-or-null error | Decay multipliers differ by classification and tier; matrix values match documented configuration; zero half-life config is rejected with the positive-number-or-null error | Scoring path output with per-class/tier decay multipliers + config-validation output for `halfLifeDays: 0` | PASS: Each class+tier combination produces the documented multiplier, and zero half-life config is rejected up front; FAIL: Multipliers missing, mismatch the matrix, or `halfLifeDays: 0` passes validation | Verify decay matrix configuration → Check classification assignment → Inspect `validateHalfLifeConfig()` in `memory-types.ts` → Confirm the positive-number-or-null guard |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/04-classification-based-decay.md](../../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 026
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/026-classification-based-decay-tm-03.md`
