---
title: "DR-012 -- Stop when all key questions are answered"
description: "Verify that the loop stops when the tracked key questions are fully answered."
---

# DR-012 -- Stop when all key questions are answered

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-012`.

---

## 1. OVERVIEW

This scenario validates stop when all key questions are answered for `DR-012`. The objective is to verify that the loop stops when the tracked key questions are fully answered.

### WHY THIS MATTERS

Question completion is the user-facing definition of “enough research” even when additional sources still exist.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the loop stops when the tracked key questions are fully answered.
- Real user request: If all of my main questions are answered, the loop should stop instead of searching forever.
- Prompt: `As a manual-testing orchestrator, validate the all-questions-answered stop contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop stops when the tracked key questions are answered and that this condition is checked before softer convergence logic. Return a concise verdict.`
- Expected execution process: Inspect the convergence decision order, then the YAML logic, then the README and quick reference language that explains question coverage.
- Desired user-facing outcome: The user is told the loop can end cleanly once the tracked key questions are answered.
- Expected signals: Question completion is a named hard stop and is reflected in the convergence and usage docs.
- Pass/fail posture: PASS if all sources treat complete question coverage as a stop condition; FAIL if the loop could continue indefinitely despite full question coverage.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the all-questions-answered stop contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop stops when the tracked key questions are answered and that this condition is checked before softer convergence logic. Return a concise verdict.
### Commands
1. `bash: rg -n 'all questions answered|countUnanswered|coverage' .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/README.md`
2. `bash: rg -n 'remaining_questions == 0|all_questions_answered|answered_count|total_questions' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: rg -n 'Questions:|coverage|all questions answered' .opencode/skill/sk-deep-research/references/quick_reference.md`
### Expected
Question completion is a named hard stop and is reflected in the convergence and usage docs.
### Evidence
Capture the hard-stop wording, the YAML remaining-question check, and the question-coverage explanation.
### Pass/Fail
PASS if all sources treat complete question coverage as a stop condition; FAIL if the loop could continue indefinitely despite full question coverage.
### Failure Triage
Check the convergence pseudocode first, then verify the loop extracts `answered_count` and `total_questions` before the decision step.
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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Question-coverage hard stop; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Remaining-question stop check; inspect `step_read_state` and `step_check_convergence` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Remaining-question stop check; inspect `step_read_state` and `step_check_convergence` |
| `.opencode/skill/sk-deep-research/README.md` | Question-coverage framing; use `ANCHOR:usage-examples` |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Coverage visualization; use `ANCHOR:progress-visualization` |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-012
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
