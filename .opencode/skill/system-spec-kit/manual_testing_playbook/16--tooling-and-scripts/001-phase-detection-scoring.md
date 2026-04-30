---
title: "PHASE-001 -- Phase detection scoring"
description: "This scenario validates Phase detection scoring for `PHASE-001`. It focuses on Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output."
---

# PHASE-001 -- Phase detection scoring

## 1. OVERVIEW

This scenario validates Phase detection scoring for `PHASE-001`. It focuses on Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output.

---

## 2. SCENARIO CONTRACT


- Objective: Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output.
- Real user request: `` Please validate Phase detection scoring against bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<target-spec> and tell me whether the expected signals are present: JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low. ``
- RCAF Prompt: `As a tooling validation operator, validate Phase detection scoring against bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<target-spec>. Verify run recommend-level.sh --recommend-phases --json on a high-complexity spec and verify scoring output. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all three top-level fields are present and correctly typed, 4 dimensions are scored, and simple vs complex specs produce differentiated results

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, run recommend-level.sh --recommend-phases --json on a high-complexity spec and verify scoring output against bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<target-spec>. Verify jSON output contains recommended_phases (boolean), phase_score (number), suggested_phase_count (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create or identify a high-complexity spec folder (>500 LOC, multiple concerns)
2. `bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<target-spec>`
3. Inspect JSON output for `recommended_phases`, `phase_score`, and `suggested_phase_count` fields
4. Verify all 4 scoring dimensions are present in output: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%)
5. Run on a simple spec folder and confirm `recommended_phases` is false

### Expected

JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low

### Evidence

Command transcript + JSON output snapshot

### Pass / Fail

- **Pass**: all three top-level fields are present and correctly typed, 4 dimensions are scored, and simple vs complex specs produce differentiated results
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify spec folder path exists and contains spec.md; check script has execute permission; inspect scoring dimension weights for miscalibration

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/001-phase-detection-scoring.md`
