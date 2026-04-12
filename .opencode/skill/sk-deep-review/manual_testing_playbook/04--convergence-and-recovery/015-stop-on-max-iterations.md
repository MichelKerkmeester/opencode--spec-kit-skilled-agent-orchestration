---
title: "DRV-015 -- Stop on max iterations"
description: "Verify review stops at maxIterations (default 7) even if dimensions remain uncovered."
---

# DRV-015 -- Stop on max iterations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-015`.

---

## 1. OVERVIEW

This scenario validates stop on max iterations for `DRV-015`. The objective is to verify that the review loop stops at `maxIterations` (default 7) even if review dimensions remain uncovered.

### WHY THIS MATTERS

The hard iteration cap is the ultimate safety net preventing runaway review loops. Without it, a review that keeps discovering new findings in a large codebase could run indefinitely, consuming context and operator time.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify review stops at maxIterations (default 7) even if dimensions remain uncovered.
- Real user request: If the review keeps finding new issues, does it ever stop on its own?
- Prompt: `As a manual-testing orchestrator, validate the hard iteration cap contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify maxIterations defaults to 7, that the loop exits unconditionally at that limit regardless of dimension coverage or convergence score, and that synthesis still runs after a hard stop. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the convergence reference for hard stop rules, then the YAML workflow step that enforces the cap, then the quick reference and SKILL.md for user-facing documentation.
- Desired user-facing outcome: The user is told that the review loop always terminates at maxIterations and still produces a review report even if not all dimensions were covered.
- Expected signals: `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced.
- Pass/fail posture: PASS if the hard cap is enforced unconditionally and synthesis still runs; FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-015 | Stop on max iterations | Verify review stops at maxIterations (default 7) even if dimensions remain uncovered. | As a manual-testing orchestrator, validate the hard iteration cap contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify maxIterations defaults to 7, that the loop exits unconditionally at that limit regardless of dimension coverage or convergence score, and that synthesis still runs after a hard stop. Return a concise operator-facing verdict. | 1. `bash: rg -n 'maxIterations|hard.stop|HARD_STOP|max_iterations|iteration.*cap' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'maxIterations|max_iterations|hard.stop|step_check_convergence|iteration_count' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'maxIterations|max-iterations|default.*7|hard stop' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced. | Capture the hard-stop condition from convergence.md, the YAML enforcement step, and the user-facing documentation of the default. | PASS if the hard cap is enforced unconditionally and synthesis still runs; FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop. | Privilege the convergence reference for exact algorithm and use YAML workflow steps as the enforcement authority. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math including hard stop rules |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` for hard stop enforcement |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect `step_check_convergence` for hard stop enforcement |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | User-facing parameter defaults; use `ANCHOR:commands` and `ANCHOR:convergence` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Skill rules and convergence documentation; use `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/README.md` | Feature summary and configuration defaults |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/015-stop-on-max-iterations.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
