---
title: "DRV-019 -- Stuck recovery widens dimension focus"
description: "Verify that stuck recovery switches the review loop to the least-covered dimension when progress stalls."
---

# DRV-019 -- Stuck recovery widens dimension focus

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-019`.

---

## 1. OVERVIEW

This scenario validates stuck recovery widens dimension focus for `DRV-019`. The objective is to verify that when the review loop detects it is stuck (no meaningful new findings for consecutive iterations), the recovery mechanism switches focus to the least-covered dimension.

### WHY THIS MATTERS

A review loop that keeps re-examining the same dimension without finding new issues wastes iterations. Stuck recovery redirects effort to unexplored areas, maximizing dimension coverage within the iteration budget and preventing the review from burning all iterations on a single well-covered dimension.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify stuck recovery switches to least-covered dimension.
- Real user request: What happens if the review keeps looking at the same area and stops finding new things?
- Prompt: `As a manual-testing orchestrator, validate the stuck recovery contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when stuckThreshold consecutive iterations produce newFindingsRatio below noProgressThreshold, the loop switches focus to the least-covered review dimension, that this is reflected in strategy.md "Next Focus", and that the stuck event is logged to the JSONL state. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the convergence reference for stuck detection and recovery rules, then the review YAML algorithm for stuck handling, then the strategy template and quick reference for user-facing documentation.
- Desired user-facing outcome: The user is told that the review automatically pivots to underexplored dimensions when it gets stuck, and that this is visible in the strategy file.
- Expected signals: `stuckThreshold=2` consecutive low-progress iterations trigger recovery, `noProgressThreshold=0.05` defines low progress, recovery selects the dimension with the lowest coverage count, strategy.md "Next Focus" is updated, and a stuck event is logged to JSONL.
- Pass/fail posture: PASS if stuck detection and dimension-widening recovery are enforced and documented; FAIL if stuck iterations do not trigger a focus change or the recovery mechanism is missing.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-019 | Stuck recovery widens dimension focus | Verify stuck recovery switches to least-covered dimension when progress stalls. | As a manual-testing orchestrator, validate the stuck recovery contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when stuckThreshold consecutive iterations produce newFindingsRatio below noProgressThreshold, the loop switches focus to the least-covered review dimension, that this is reflected in strategy.md "Next Focus", and that the stuck event is logged to the JSONL state. Return a concise operator-facing verdict. | 1. `bash: rg -n 'stuck|STUCK|noProgress|no_progress|stuckThreshold|recovery|widen|least.covered' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'stuck|STUCK|recovery|widen|least_covered|no_progress|stuckThreshold|RECOVERY' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'stuck|recovery|dimension.*focus|noProgress|least.covered|Next Focus' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | `stuckThreshold=2`, `noProgressThreshold=0.05`, recovery selects least-covered dimension, strategy.md "Next Focus" is updated, and stuck event logged to JSONL. | Capture the stuck detection algorithm from convergence.md, the YAML recovery step, and the strategy template showing dimension-focus rotation. | PASS if stuck detection and dimension-widening recovery are enforced and documented; FAIL if stuck iterations do not trigger a focus change or the recovery mechanism is missing. | Privilege the convergence reference for stuck detection math and the YAML workflow for recovery enforcement; use strategy template as secondary evidence. |

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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; stuck detection and recovery rules |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect stuck recovery step |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect stuck recovery step |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence parameters including stuckThreshold; use `ANCHOR:convergence` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Rules for dimension focus and exhausted approaches; use `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Strategy template showing "Next Focus" and dimension coverage tracking |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
