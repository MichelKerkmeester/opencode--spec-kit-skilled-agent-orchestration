---
title: "DR-011 -- Stop on max iterations"
description: "Verify that max iterations is a hard stop checked before softer convergence signals."
---

# DR-011 -- Stop on max iterations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-011`.

---

## 1. OVERVIEW

This scenario validates stop on max iterations for `DR-011`. The objective is to verify that max iterations is a hard stop checked before softer convergence signals.

### WHY THIS MATTERS

The hard cap is the deterministic backstop that prevents runaway sessions even when the other signals remain inconclusive.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that max iterations is a hard stop checked before softer convergence signals.
- Real user request: If I set a maximum number of iterations, I want to know the loop will stop there no matter what.
- Orchestrator prompt: Validate the max-iterations stop contract for sk-deep-research. Confirm that the hard cap is checked before softer convergence logic and that the stop reason is surfaced as max_iterations_reached, then return a concise operator verdict.
- Expected execution process: Inspect convergence pseudocode first, then the YAML decision algorithm, then the README parameter table and examples.
- Desired user-facing outcome: The user is told that `--max-iterations` is a hard cap that overrides further looping.
- Expected signals: Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs.
- Pass/fail posture: PASS if max iterations is consistently treated as a first-priority hard stop; FAIL if it is demoted below softer signals or described inconsistently.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-011 | Stop on max iterations | Verify that max iterations is a hard stop checked before softer convergence signals. | Validate the max-iterations stop contract for sk-deep-research. Confirm that the hard cap is checked before softer convergence logic and that the stop reason is surfaced as `max_iterations_reached`, then return a concise operator verdict. | 1. `bash: rg -n 'max iterations|Hard stop|max_iterations_reached' .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'iteration_count >= max_iterations|max_iterations_reached' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n -- '--max-iterations|Maximum loop iterations' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/quick_reference.md` | Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs. | Capture the convergence pseudocode, the YAML decision branch, and the user-facing parameter description. | PASS if max iterations is consistently treated as a first-priority hard stop; FAIL if it is demoted below softer signals or described inconsistently. | Resolve any ambiguity by privileging the convergence pseudocode and YAML algorithm order. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Hard-stop ordering; use `ANCHOR:shouldcontinue-algorithm` |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop decision order; use `ANCHOR:phase-iteration-loop` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Decision algorithm; inspect `step_check_convergence` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Decision algorithm; inspect `step_check_convergence` |
| `.opencode/skill/sk-deep-research/README.md` | Parameter table and examples; use `ANCHOR:configuration` and `ANCHOR:usage-examples` |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Parameter defaults; use `ANCHOR:commands` |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/011-stop-on-max-iterations.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
