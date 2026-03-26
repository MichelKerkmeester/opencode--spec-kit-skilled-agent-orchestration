---
title: "PHASE-001 -- Phase detection scoring"
description: "This scenario validates Phase detection scoring for `PHASE-001`. It focuses on Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output."
---

# PHASE-001 -- Phase detection scoring

## 1. OVERVIEW

This scenario validates Phase detection scoring for `PHASE-001`. It focuses on Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `PHASE-001` and confirm the expected signals without contradicting evidence.

- Objective: Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output
- Prompt: `Verify phase detection scoring produces valid 4-dimension output for a complex spec folder. Capture the evidence needed to prove JSON output contains recommended_phases (boolean), phase_score (number), suggested_phase_count (number), and 4 dimension scores (LOC Factor 35%, File Count 20%, Risk Factors 25%, Complexity 20%); simple specs score low. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low
- Pass/fail: PASS if all three top-level fields are present and correctly typed, 4 dimensions are scored, and simple vs complex specs produce differentiated results

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PHASE-001 | Phase detection scoring | Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output | `Verify phase detection scoring produces valid 4-dimension output for a complex spec folder. Capture the evidence needed to prove JSON output contains recommended_phases (boolean), phase_score (number), suggested_phase_count (number), and 4 dimension scores (LOC Factor 35%, File Count 20%, Risk Factors 25%, Complexity 20%); simple specs score low. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create or identify a high-complexity spec folder (>500 LOC, multiple concerns) 2) `bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<target-spec>` 3) Inspect JSON output for `recommended_phases`, `phase_score`, and `suggested_phase_count` fields 4) Verify all 4 scoring dimensions are present in output: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%) 5) Run on a simple spec folder and confirm `recommended_phases` is false | JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low | Command transcript + JSON output snapshot | PASS if all three top-level fields are present and correctly typed, 4 dimensions are scored, and simple vs complex specs produce differentiated results | Verify spec folder path exists and contains spec.md; check script has execute permission; inspect scoring dimension weights for miscalibration |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/001-phase-detection-scoring.md`
