---
title: "DRV-010 -- Strategy next focus and dimension rotation"
description: "Verify that the strategy rotates through dimensions and respects exhausted approaches."
---

# DRV-010 -- Strategy next focus and dimension rotation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-010`.

---

## 1. OVERVIEW

This scenario validates strategy next focus and dimension rotation for `DRV-010`. The objective is to verify that the strategy rotates through dimensions and respects exhausted approaches.

### WHY THIS MATTERS

If the loop manager does not rotate dimensions, the review gets stuck on a single dimension while others remain uncovered. Dimension coverage is a weighted convergence signal (0.45), so failure to rotate blocks convergence and wastes iterations.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the strategy rotates through dimensions and respects exhausted approaches.
- Real user request: How does the review know which dimension to focus on next? Does it cycle through all of them?
- Prompt: `As a manual-testing orchestrator, validate the dimension rotation contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop manager rotates through dimensions based on the strategy "Next Focus" and that exhausted dimensions are skipped. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the YAML read-state step for dimension extraction, then the dispatch step for next_dimension injection, then the strategy template for the "Next Focus" section, then the convergence docs for dimension coverage requirements.
- Desired user-facing outcome: The user is told that the review automatically cycles through dimensions in priority order and skips dimensions that are already fully covered.
- Expected signals: The read-state step extracts the next uncovered dimension; the dispatch step injects it as the focus; the strategy template has a "Next Focus" section; the convergence docs require all dimensions to be covered.
- Pass/fail posture: PASS if dimension rotation is explicit in the loop and the strategy tracks coverage; FAIL if the next dimension is not derived from state or if exhausted dimensions are re-checked unnecessarily.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-010 | Strategy next focus and dimension rotation | Verify that the strategy rotates through dimensions and respects exhausted approaches. | As a manual-testing orchestrator, validate the dimension rotation contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop manager rotates through dimensions based on the strategy "Next Focus" and that exhausted dimensions are skipped. Return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'next_dimension|next_focus|dimensions_covered|dimension_queue|Next Focus' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'Next Focus|dimension.*rotation|dimension.*coverage|exhausted' .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` -> 3. `bash: rg -n 'Dimension Coverage|dimensions.*covered|minStabilization' .opencode/skill/sk-deep-review/references/quick_reference.md` | The read-state step extracts the next uncovered dimension; the dispatch step injects it as the focus; the strategy template has a "Next Focus" section; convergence requires all dimensions covered. | Capture the next_dimension extraction logic, the dispatch focus injection, and the convergence dimension coverage signal. | PASS if dimension rotation is explicit in the loop and the strategy tracks coverage; FAIL if the next dimension is not derived from state or if exhausted dimensions are re-checked unnecessarily. | Check the strategy template for explicit dimension tracking sections and verify the convergence algorithm includes dimension coverage as a weighted signal. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Loop dimension extraction and dispatch; inspect `step_read_state` and `step_dispatch_review_agent` |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Strategy template; inspect "Next Focus" and dimension tracking sections |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence signals; use `ANCHOR:convergence` and `ANCHOR:review-dimensions` |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Shared convergence algorithm; inspect dimension coverage signal |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-010
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
