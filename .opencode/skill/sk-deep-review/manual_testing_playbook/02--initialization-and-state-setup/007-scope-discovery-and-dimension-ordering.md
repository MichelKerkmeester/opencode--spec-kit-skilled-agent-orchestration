---
title: "DRV-007 -- Scope discovery and dimension ordering"
description: "Verify that scope discovery resolves target type to a file list and dimensions are ordered by risk priority (Correctness > Security > Traceability > Maintainability)."
---

# DRV-007 -- Scope discovery and dimension ordering

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-007`.

---

## 1. OVERVIEW

This scenario validates scope discovery and dimension ordering for `DRV-007`. The objective is to verify that scope discovery resolves the review target type to a concrete file list and that dimensions are ordered by risk priority (Correctness > Security > Traceability > Maintainability).

### WHY THIS MATTERS

Review effectiveness depends on reviewing the right files in the right order. Incorrect scope means missed files; incorrect dimension ordering means lower-severity issues are checked before critical ones.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that scope discovery resolves target type to a file list and dimensions are ordered by risk priority (Correctness > Security > Traceability > Maintainability).
- Real user request: When I point a deep review at a skill, how does it figure out which files to check and in what order?
- Prompt: `As a manual-testing orchestrator, validate the scope discovery and dimension ordering contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_scope_discovery resolves different target types to file lists, and step_order_dimensions orders them as Correctness > Security > Traceability > Maintainability. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the YAML scope discovery step for target type resolution rules, then the dimension ordering step for priority ordering, then the quick reference for the documented dimension table.
- Desired user-facing outcome: The user can be told which files will be reviewed for their target type and that dimensions are reviewed in risk-priority order.
- Expected signals: The scope discovery step has resolution rules for each target type (spec-folder, skill, agent, track, files); the dimension ordering step enforces correctness > security > traceability > maintainability; the quick reference dimension table matches.
- Pass/fail posture: PASS if scope resolution covers all target types and dimension ordering matches the documented priority; FAIL if any target type lacks resolution rules or dimensions are misordered.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the scope discovery and dimension ordering contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_scope_discovery resolves different target types to file lists, and step_order_dimensions orders them as Correctness > Security > Traceability > Maintainability. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n 'step_scope_discovery|step_order_dimensions' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
2. `bash: sed -n '/step_scope_discovery/,/step_order_dimensions/p' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
3. `bash: rg -n 'correctness.*security.*traceability.*maintainability|priority.*1|priority.*2|priority.*3|priority.*4|D1|D2|D3|D4' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
### Expected
The scope discovery step has resolution rules for each target type; the dimension ordering step enforces correctness > security > traceability > maintainability; the quick reference dimension table matches.
### Evidence
Capture the scope resolution rules for each target type, the dimension ordering step, and the quick reference dimension table.
### Pass/Fail
PASS if scope resolution covers all target types and dimension ordering matches the documented priority; FAIL if any target type lacks resolution rules or dimensions are misordered.
### Failure Triage
Check the YAML step_scope_discovery resolve block for each target type (spec-folder, skill, agent, track, files) and verify step_order_dimensions has the correct priority sequence.
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
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Scope discovery and dimension ordering; inspect `step_scope_discovery` and `step_order_dimensions` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Scope discovery and dimension ordering; inspect `step_scope_discovery` and `step_order_dimensions` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Dimension table; use `ANCHOR:review-dimensions` |
| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Review mode contract with dimension definitions |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DRV-007
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
