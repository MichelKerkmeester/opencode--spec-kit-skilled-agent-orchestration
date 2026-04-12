---
title: "171 -- Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS)"
description: "This scenario validates calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) for `171`. It focuses on the default-on graduated rollout and verifying the calibrated bonus replaces the flat convergence bonus in RRF fusion."
audited_post_018: true
---

# 171 -- Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS)

## 1. OVERVIEW

This scenario validates calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) for `171`. It focuses on the default-on graduated rollout and verifying the calibrated bonus replaces the flat convergence bonus in RRF fusion.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `171` and confirm the expected signals without contradicting evidence.

- Objective: Verify calibrated overlap bonus replaces flat convergence bonus in RRF fusion
- Prompt: `As a scoring validation operator, validate Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) against SPECKIT_CALIBRATED_OVERLAP_BONUS. Verify calibrated overlap bonus replaces flat convergence bonus in RRF fusion. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: calibrated bonus computed using CALIBRATED_OVERLAP_BETA=0.15 and mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; flat CONVERGENCE_BONUS=0.10 not applied when flag ON; isCalibratedOverlapBonusEnabled() returns true by default
- Pass/fail: PASS if calibrated overlap bonus is applied with correct beta and cap values for multi-channel overlapping results; FAIL if flat 0.10 bonus is applied instead, bonus exceeds 0.06 cap, or flag defaults to OFF

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 171 | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | Verify calibrated bonus replaces flat convergence bonus in RRF fusion | `As a scoring validation operator, verify calibrated bonus replaces flat convergence bonus in RRF fusion against SPECKIT_CALIBRATED_OVERLAP_BONUS. Verify isCalibratedOverlapBonusEnabled() returns true; bonus uses beta=0.15 scaling with mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; falls back to CONVERGENCE_BONUS=0.10 when OFF. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Confirm `SPECKIT_CALIBRATED_OVERLAP_BONUS` is unset or `true` 2) `memory_search({ query: "query producing multi-channel overlap" })` 3) Inspect fuseResultsMulti() output for calibrated bonus values 4) Verify bonus <= 0.06 5) Set flag to `false`, re-run, verify flat 0.10 bonus applied | isCalibratedOverlapBonusEnabled() returns true; bonus uses beta=0.15 scaling with mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; falls back to CONVERGENCE_BONUS=0.10 when OFF | fuseResultsMulti() output scores + bonus breakdown + test transcript | PASS if calibrated bonus applied with correct beta=0.15 and cap=0.06 for overlapping results; FAIL if flat 0.10 bonus applied, bonus exceeds cap, or flag defaults OFF | Verify isCalibratedOverlapBonusEnabled() → Confirm flag is not forced off → Check CALIBRATED_OVERLAP_BETA=0.15 constant → Verify CALIBRATED_OVERLAP_MAX=0.06 cap → Inspect fuseResultsMulti() overlap detection logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/21-calibrated-overlap-bonus.md](../../feature_catalog/11--scoring-and-calibration/21-calibrated-overlap-bonus.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `shared/algorithms/rrf-fusion.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and calibration
- Playbook ID: 171
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md`
