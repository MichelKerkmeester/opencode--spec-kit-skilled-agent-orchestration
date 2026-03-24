---
title: "DR-036 -- Review quality guards block premature stop"
description: "Verify that 3 binary gates (evidence, scope, coverage) must pass before STOP."
---

# DR-036 -- Review quality guards block premature stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-036`.

---

## 1. OVERVIEW

This scenario validates review quality guards for `DR-036`. The objective is to verify that 3 binary gates (evidence, scope, coverage) must pass before the review loop issues a STOP signal.

### WHY THIS MATTERS

Convergence alone is not sufficient for a review — the loop could converge on an incomplete audit. Binary gates ensure that the review cannot declare completion unless findings are evidence-backed, review activity stays inside scope, and configured dimensions plus required traceability protocols are covered.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that 3 binary gates (evidence, scope, coverage) must pass before STOP.
- Real user request: What prevents the review from stopping too early — before it has actually checked everything?
- Orchestrator prompt: Validate review quality guards for sk-deep-research. Confirm that `convergence.md` and the review YAML define 3 binary gates (evidence, scope, coverage) that must all pass before STOP is issued.
- Expected execution process: Inspect `convergence.md` section 10.4 for the quality guard definitions, then the review YAML for guard implementation in the convergence check step.
- Desired user-facing outcome: The user understands that the review has 3 explicit binary gates that prevent premature termination even when convergence metrics suggest stopping.
- Expected signals: All 3 gates are named and defined, each has a clear pass/fail condition, and the YAML implements all 3 before allowing STOP.
- Pass/fail posture: PASS if all 3 binary gates are defined and implemented consistently; FAIL if any gate is missing, undefined, or not enforced.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-036 | Review quality guards block premature stop | Verify that 3 binary gates (evidence, scope, coverage) must pass before STOP. | Validate review quality guards. Confirm `convergence.md` defines the 3 binary gates and the review YAML enforces all 3 before issuing STOP. | 1. `bash: rg -n 'evidence|scope|coverage|gate|STOP' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'evidence|scope|coverage|gate|STOP' .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | All 3 gates are named, each has pass/fail condition, and YAML enforces all before STOP. | Capture gate definitions from `convergence.md` and YAML implementation and compare for completeness. | PASS if all 3 binary gates are defined and enforced consistently; FAIL if any gate is missing or not enforced. | Start with `convergence.md` for the canonical gate list, then verify each gate is implemented in the review YAML convergence check. |

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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence reference; use replay and review convergence sections for binary gate definitions and pass/fail conditions |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect convergence check step for guard enforcement |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-036
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--review-mode/036-review-quality-guards-block-premature-stop.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
