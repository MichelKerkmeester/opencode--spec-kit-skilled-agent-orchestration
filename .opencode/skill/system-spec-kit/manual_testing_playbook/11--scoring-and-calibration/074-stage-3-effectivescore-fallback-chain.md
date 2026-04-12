---
title: "074 -- Stage 3 effectiveScore fallback chain"
description: "This scenario validates Stage 3 effectiveScore fallback chain for `074`. It focuses on Confirm fallback order correctness."
audited_post_018: true
---

# 074 -- Stage 3 effectiveScore fallback chain

## 1. OVERVIEW

This scenario validates Stage 3 effectiveScore fallback chain for `074`. It focuses on Confirm fallback order correctness.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `074` and confirm the expected signals without contradicting evidence.

- Objective: Confirm fallback order correctness
- Prompt: `As a scoring validation operator, validate Stage 3 effectiveScore fallback chain against the documented validation surface. Verify fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score
- Pass/fail: PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 074 | Stage 3 effectiveScore fallback chain | Confirm fallback order correctness | `As a scoring validation operator, confirm fallback order correctness against the documented validation surface. Verify fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) craft rows missing score fields 2) run stage 3 3) verify fallback order | Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score | Stage 3 output with score field trace showing fallback path taken for each test row | PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations | Inspect resolveEffectiveScore implementation; verify fallback priority constants; test all combinations of missing fields |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md](../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 074
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md`
