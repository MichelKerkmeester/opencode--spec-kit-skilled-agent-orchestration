---
title: "DR-035 -- Review convergence uses severity-weighted newFindingsRatio"
description: "Verify that convergence uses adapted signals (rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45) with P0 override rule."
---

# DR-035 -- Review convergence uses severity-weighted newFindingsRatio

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-035`.

---

## 1. OVERVIEW

This scenario validates review convergence detection for `DR-035`. The objective is to verify that convergence uses adapted signals (rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45) with P0 override rule.

### WHY THIS MATTERS

Standard research convergence uses novelty ratio, but review mode must weight severity — a single new P0 finding should prevent early stop even if the novelty ratio is low. If convergence parameters are not adapted for review, the loop may stop before critical issues are found.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence uses adapted signals (rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45) with P0 override rule.
- Real user request: How does the review know when to stop iterating — and will it stop early if it finds something critical?
- Orchestrator prompt: Validate review convergence for sk-deep-research. Confirm that `step_check_convergence` uses severity-weighted newFindingsRatio with rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45, and that a P0 finding overrides convergence to force continued iteration.
- Expected execution process: Inspect `convergence.md` section 10 for the review-adapted convergence formula, then the review YAML `step_check_convergence` for implementation of adapted parameters, then verify the P0 override rule is documented.
- Desired user-facing outcome: The user understands that the review will not stop early if critical findings are present, and that convergence weights severity and dimension coverage rather than raw novelty.
- Expected signals: Rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45, P0 override prevents convergence, and both sources agree on the adapted formula.
- Pass/fail posture: PASS if convergence parameters match the documented adapted formula and P0 override is present; FAIL if parameters differ or P0 override is missing.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-035 | Review convergence uses severity-weighted newFindingsRatio | Verify convergence uses adapted signals (rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45) with P0 override rule. | Validate review convergence parameters. Confirm `convergence.md` §10 and review YAML `step_check_convergence` use rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45, and P0 override rule. | 1. `bash: rg -n 'window|MAD|weight|coverage|P0|override|severity|newFindingsRatio' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'convergence|window|MAD|weight|coverage|P0|override' .opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Rolling avg window=2, MAD weight=0.25, dimension coverage weight=0.45, P0 override prevents convergence, and sources agree. | Capture the convergence formula from `convergence.md` §10 and YAML `step_check_convergence` and compare parameters. | PASS if parameters match adapted formula and P0 override is present; FAIL if parameters differ or P0 override is missing. | Start with `convergence.md` §10 for canonical formula, then cross-check YAML `step_check_convergence` for implementation alignment. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence reference; use §10 for review-adapted convergence formula and P0 override rule |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `step_check_convergence` for adapted parameter implementation |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-035
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--review-mode/035-review-convergence-uses-severity-weighted-ratio.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
