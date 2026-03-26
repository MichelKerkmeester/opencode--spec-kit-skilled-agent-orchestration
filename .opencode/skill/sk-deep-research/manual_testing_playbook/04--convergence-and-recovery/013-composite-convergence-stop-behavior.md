---
title: "DR-013 -- Composite convergence stop behavior"
description: "Verify the three-signal weighted stop model and its graceful degradation rules."
---

# DR-013 -- Composite convergence stop behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-013`.

---

## 1. OVERVIEW

This scenario validates composite convergence stop behavior for `DR-013`. The objective is to verify the three-signal weighted stop model and its graceful degradation rules.

### WHY THIS MATTERS

Composite convergence is the nuanced stop condition that decides whether diminishing returns are real rather than just transient.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the three-signal weighted stop model and its graceful degradation rules.
- Real user request: Explain how the loop decides it has probably converged when it has not hit the hard cap yet.
- Orchestrator prompt: Validate the composite-convergence contract for sk-deep-research. Confirm the rolling average, MAD noise floor, and question-entropy signals, their weights, and the >0.60 weighted stop-score threshold, then return a concise operator-facing verdict.
- Expected execution process: Inspect the convergence reference first, then the YAML algorithm, then the quick reference visualization and README feature summary.
- Desired user-facing outcome: The user gets an accurate explanation of the weighted convergence model and when it applies.
- Expected signals: Three named signals, weights of 0.30/0.35/0.35, graceful degradation with fewer iterations, and a stop threshold above 0.60.
- Pass/fail posture: PASS if the signals, weights, and threshold align across reference, YAML, and user-facing docs; FAIL if any of those elements drift materially.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-013 | Composite convergence stop behavior | Verify the three-signal weighted stop model and its graceful degradation rules. | Validate the composite-convergence contract for sk-deep-research. Confirm the rolling average, MAD noise floor, and question-entropy signals, their weights, and the >0.60 weighted stop-score threshold, then return a concise operator-facing verdict. | 1. `bash: sed -n '1,260p' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'COMPOSITE CONVERGENCE|rolling average|MAD noise|entropy|0.60' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'Convergence Detection|Composite:|Signals:' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/quick_reference.md` | Three named signals, weights of 0.30/0.35/0.35, graceful degradation with fewer iterations, and a stop threshold above 0.60. | Capture the full signal table, YAML algorithm excerpt, and the user-facing explanation or visualization. | PASS if the signals, weights, and threshold align across reference, YAML, and user-facing docs; FAIL if any of those elements drift materially. | Privilege the convergence reference for exact math and use README or quick reference only as secondary confirmation. |

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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow algorithm; inspect `step_check_convergence` |
| `.opencode/skill/sk-deep-research/README.md` | Feature summary for convergence; use `ANCHOR:features` |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Progress visualization and decision tree; use `ANCHOR:convergence-decision-tree` and `ANCHOR:progress-visualization` |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-013
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/013-composite-convergence-stop-behavior.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
