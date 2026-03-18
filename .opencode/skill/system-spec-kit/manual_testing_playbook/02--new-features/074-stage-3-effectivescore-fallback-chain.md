---
title: "NEW-074 -- Stage 3 effectiveScore fallback chain"
description: "This scenario validates Stage 3 effectiveScore fallback chain for `NEW-074`. It focuses on Confirm fallback order correctness."
---

# NEW-074 -- Stage 3 effectiveScore fallback chain

## 1. OVERVIEW

This scenario validates Stage 3 effectiveScore fallback chain for `NEW-074`. It focuses on Confirm fallback order correctness.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-074` and confirm the expected signals without contradicting evidence.

- Objective: Confirm fallback order correctness
- Prompt: `Validate Stage 3 effectiveScore fallback chain.`
- Expected signals: Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score
- Pass/fail: PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-074 | Stage 3 effectiveScore fallback chain | Confirm fallback order correctness | `Validate Stage 3 effectiveScore fallback chain.` | 1) craft rows missing score fields 2) run stage 3 3) verify fallback order | Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score | Stage 3 output with score field trace showing fallback path taken for each test row | PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations | Inspect resolveEffectiveScore implementation; verify fallback priority constants; test all combinations of missing fields |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md](../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-074
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/074-stage-3-effectivescore-fallback-chain.md`
