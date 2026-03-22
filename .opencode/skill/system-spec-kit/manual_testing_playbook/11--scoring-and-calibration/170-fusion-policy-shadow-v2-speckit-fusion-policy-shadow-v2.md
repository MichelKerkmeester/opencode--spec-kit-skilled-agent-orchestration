---
title: "170 -- Fusion policy shadow v2 (SPECKIT_FUSION_POLICY_SHADOW_V2)"
description: "This scenario validates fusion policy shadow v2 (SPECKIT_FUSION_POLICY_SHADOW_V2) for `170`. It focuses on the default-on rollout and verifying shadow telemetry across the RRF, minmax-linear, and zscore-linear policies."
---

# 170 -- Fusion policy shadow v2 (SPECKIT_FUSION_POLICY_SHADOW_V2)

## 1. OVERVIEW

This scenario validates fusion policy shadow v2 (SPECKIT_FUSION_POLICY_SHADOW_V2) for `170`. It focuses on the default-on rollout and verifying shadow telemetry across the RRF, minmax-linear, and zscore-linear policies.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `170` and confirm the expected signals without contradicting evidence.

- Objective: Verify Fusion Lab runs all three policies in shadow while returning the active policy result
- Prompt: `Test the default-on SPECKIT_FUSION_POLICY_SHADOW_V2 behavior. Run Fusion Lab on a judged query set and verify telemetry is produced for rrf, minmax_linear, and zscore_linear while the active policy result remains the only live result. Capture the evidence needed to prove compareFusionStrategies() and runShadowFusion() emit per-policy telemetry without mutating live ranking behavior. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: telemetry exists for `rrf`, `minmax_linear`, and `zscore_linear`; the active policy result is returned unchanged; shadow alternatives are telemetry-only; disabling the flag suppresses the shadow comparison path
- Pass/fail: PASS if all three policy telemetry records are produced and live ranking behavior remains unchanged; FAIL if telemetry is missing or a shadow policy mutates the live result

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 170 | Fusion policy shadow v2 (SPECKIT_FUSION_POLICY_SHADOW_V2) | Verify Fusion Lab telemetry across all policies | `Test the default-on SPECKIT_FUSION_POLICY_SHADOW_V2 behavior. Run Fusion Lab, verify telemetry for rrf, minmax_linear, and zscore_linear, and confirm the active policy result is the only live result. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_FUSION_POLICY_SHADOW_V2` is unset or `true` 2) Execute Fusion Lab on representative judged inputs 3) Inspect per-policy telemetry from `compareFusionStrategies()` / `runShadowFusion()` 4) Verify the active policy output remains unchanged 5) `npx vitest run tests/fusion-lab.vitest.ts` | Telemetry for all three policies; active policy result returned; shadow alternatives telemetry-only; flag-off path disables shadow comparison | Fusion Lab telemetry output + active policy result + test transcript | PASS if telemetry exists for all three policies and live result remains unchanged; FAIL if telemetry is missing or a shadow policy mutates the live result | Confirm the flag is not forced off → Inspect `selectOptimalStrategy()` output → Verify per-policy NDCG/MRR telemetry → Check active-policy passthrough contract |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `shared/algorithms/fusion-lab.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 170
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/170-fusion-policy-shadow-v2-speckit-fusion-policy-shadow-v2.md`
