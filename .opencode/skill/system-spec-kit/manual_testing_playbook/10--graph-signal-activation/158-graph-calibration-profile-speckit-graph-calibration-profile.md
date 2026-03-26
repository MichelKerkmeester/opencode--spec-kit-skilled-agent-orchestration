---
title: "158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE)"
description: "This scenario validates graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) for `158`. It focuses on enabling the flag and verifying graph weight cap at 0.05 and community scoring capped at 0.03."
---

# 158 -- Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE)

## 1. OVERVIEW

This scenario validates graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) for `158`. It focuses on enabling the flag and verifying graph weight cap at 0.05 and community scoring capped at 0.03.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `158` and confirm the expected signals without contradicting evidence.

- Objective: Verify graph weight cap enforcement and community score capping
- Prompt: `Test SPECKIT_GRAPH_CALIBRATION_PROFILE=true. Run a search with graph signals active and verify graph weight contribution is capped at 0.05 (GRAPH_WEIGHT_CAP) and community scoring boost is capped at 0.03 (COMMUNITY_SCORE_CAP). Capture the evidence needed to prove applyCalibrationProfile() enforces caps and shouldActivateLouvain() respects density/size thresholds. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: applyGraphWeightCap() clamps values to [0, 0.05]; applyCommunityScoring() caps boost at 0.03; shouldActivateLouvain() returns activate=false when density or size below thresholds; calibrateGraphWeight() enforces N2a/N2b caps
- Pass/fail: PASS if graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced; FAIL if any score exceeds its cap or Louvain activates below threshold

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | Verify graph weight cap and community score capping | `Test SPECKIT_GRAPH_CALIBRATION_PROFILE=true. Run a search with graph signals active and verify graph weight contribution is capped at 0.05 and community scoring boost is capped at 0.03. Capture the evidence needed to prove cap enforcement and Louvain threshold gating. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_GRAPH_CALIBRATION_PROFILE=true` 2) `memory_search({ query: "test calibration", mode: "deep" })` 3) Inspect Stage 2 graph weight contribution 4) `npx vitest run tests/graph-calibration.vitest.ts` | applyGraphWeightCap() clamps to [0, 0.05]; applyCommunityScoring() caps at 0.03; shouldActivateLouvain() respects thresholds; calibrateGraphWeight() enforces N2a/N2b caps | Test transcript with cap verification + scoring context before/after calibration | PASS if graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced; FAIL if any score exceeds its cap or Louvain activates below threshold | Verify isGraphCalibrationEnabled() → Check loadCalibrationProfile() env overrides → Inspect GRAPH_WEIGHT_CAP constant (0.05) → Verify COMMUNITY_SCORE_CAP constant (0.03) → Check Louvain minDensity (0.3) and minSize (10) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/15-graph-calibration-profiles.md](../../feature_catalog/10--graph-signal-activation/15-graph-calibration-profiles.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/graph-calibration.ts`

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 158
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/158-graph-calibration-profile-speckit-graph-calibration-profile.md`
