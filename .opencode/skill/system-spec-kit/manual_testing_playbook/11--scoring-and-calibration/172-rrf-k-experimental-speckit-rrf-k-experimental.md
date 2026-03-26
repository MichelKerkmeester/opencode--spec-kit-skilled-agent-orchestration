---
title: "172 -- RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL)"
description: "This scenario validates RRF K experimental tuning (SPECKIT_RRF_K_EXPERIMENTAL) for `172`. It focuses on the default-on graduated rollout and verifying per-intent K optimization selects the best K from a sweep grid."
---

# 172 -- RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL)

## 1. OVERVIEW

This scenario validates RRF K experimental tuning (SPECKIT_RRF_K_EXPERIMENTAL) for `172`. It focuses on the default-on graduated rollout and verifying per-intent K optimization selects the best K from a sweep grid.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `172` and confirm the expected signals without contradicting evidence.

- Objective: Verify per-intent K optimization selects best K from sweep grid
- Prompt: `Test the default-on SPECKIT_RRF_K_EXPERIMENTAL behavior. Run a per-intent K sweep and verify the system evaluates candidate K values {10,20,40,60,80,100,120} using NDCG@10 and MRR@5, selecting the best K per intent. Confirm fallback to K=60 when the flag is OFF. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: perIntentKSweep() groups queries by intent and sweeps JUDGED_K_SWEEP_VALUES; argmaxNdcg10() selects K maximizing NDCG@10 with ties broken by lower K; evalQueriesAtK() computes aggregate NDCG@10 and MRR@5; falls back to DEFAULT_K=60 when OFF
- Pass/fail: PASS if per-intent K sweep runs with correct grid and selects best K by NDCG@10; FAIL if sweep does not execute, wrong grid values used, or K=60 applied when flag is ON

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 172 | RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL) | Verify per-intent K optimization selects best K from sweep grid | `Test the default-on SPECKIT_RRF_K_EXPERIMENTAL behavior. Run per-intent K sweep over {10,20,40,60,80,100,120} and verify NDCG@10-based selection. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_RRF_K_EXPERIMENTAL` is unset or `true` 2) Run perIntentKSweep() with judged query set 3) Verify sweep evaluates all K values in {10,20,40,60,80,100,120} 4) Confirm argmaxNdcg10() selects best K per intent 5) Set flag to `false`, verify DEFAULT_K=60 used | isKExperimentalEnabled() returns true; sweep grid = {10,20,40,60,80,100,120}; NDCG@10 and MRR@5 computed per K; ties broken by lower K; falls back to K=60 when OFF | perIntentKSweep() output + NDCG@10/MRR@5 metrics + selected K values + test transcript | PASS if per-intent sweep executes with correct grid and selects optimal K per intent; FAIL if sweep skipped, grid values wrong, or K=60 used when flag ON | Verify isKExperimentalEnabled() → Confirm flag is not forced off → Check JUDGED_K_SWEEP_VALUES constant → Inspect argmaxNdcg10() tie-breaking logic → Verify evalQueriesAtK() metric computation → Check resolveRrfK() override path |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/22-rrf-k-experimental.md](../../feature_catalog/11--scoring-and-calibration/22-rrf-k-experimental.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/eval/k-value-analysis.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and calibration
- Playbook ID: 172
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/172-rrf-k-experimental-speckit-rrf-k-experimental.md`
