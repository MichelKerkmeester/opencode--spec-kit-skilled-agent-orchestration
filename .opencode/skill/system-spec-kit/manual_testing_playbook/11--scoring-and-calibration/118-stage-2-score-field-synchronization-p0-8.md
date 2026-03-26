---
title: "118 -- Stage-2 score field synchronization (P0-8)"
description: "This scenario validates Stage-2 score field synchronization (P0-8) for `118`. It focuses on Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting."
---

# 118 -- Stage-2 score field synchronization (P0-8)

## 1. OVERVIEW

This scenario validates Stage-2 score field synchronization (P0-8) for `118`. It focuses on Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `118` and confirm the expected signals without contradicting evidence.

- Objective: Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting
- Prompt: `Run a non-hybrid search with intent weighting and verify score fields stay synchronized. Capture the evidence needed to prove intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value
- Pass/fail: PASS if intentAdjustedScore is synchronized with score via bounded clamping (equality sync with Math.max/Math.min bounds) and resolveEffectiveScore returns the correct final value

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 118 | Stage-2 score field synchronization (P0-8) | Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting | `Run a non-hybrid search with intent weighting and verify score fields stay synchronized. Capture the evidence needed to prove intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value. Return a concise user-facing pass/fail verdict with the main reason.` | **Precondition:** Memory database with varied content. 1) Call `memory_search({ query:"non hybrid intent weighting sync check", includeTrace:true })` targeting non-hybrid flow 2) Inspect trace: verify `intentAdjustedScore` is set at Step 4 3) Verify subsequent artifact routing and feedback signals modify `score` 4) Verify final `intentAdjustedScore >= score` (Math.max sync applied) 5) Verify `resolveEffectiveScore()` returns the synchronized value | intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value | Search trace output showing score field progression through pipeline stages | PASS if intentAdjustedScore is synchronized with score via Math.max and resolveEffectiveScore returns the correct final value | Inspect stage-2 intent weighting logic; verify Math.max sync placement; check resolveEffectiveScore fallback chain for non-hybrid flow |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/13-scoring-and-fusion-corrections.md](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 118
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md`
