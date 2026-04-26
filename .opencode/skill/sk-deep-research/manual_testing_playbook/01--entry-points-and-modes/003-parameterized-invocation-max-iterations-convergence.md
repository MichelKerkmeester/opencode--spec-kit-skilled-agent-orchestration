---
title: "DR-003 -- Parameterized invocation with --max-iterations and --convergence"
description: "Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts."
---

# DR-003 -- Parameterized invocation with --max-iterations and --convergence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-003`.

---

## 1. OVERVIEW

This scenario validates parameterized invocation with --max-iterations and --convergence for `DR-003`. The objective is to verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.

### WHY THIS MATTERS

If setup and workflow preflight drift apart, operators can launch the loop with missing or misleading configuration.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.
- Real user request: I want deep research on a topic, but make sure it goes into the right spec folder with the limits I picked.
- Prompt: `As a manual-testing orchestrator, validate the setup-binding contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the command entrypoint gathers required values before loading YAML and that the YAML preflight rejects missing bindings or invalid spec-folder scope. Return a concise pass/fail verdict.`
- Expected execution process: Inspect the unified setup prompt first, then both YAML preflight guards, then the state-format config schema to confirm the same values are represented end-to-end.
- Desired user-facing outcome: The user is told which inputs are required and why the workflow will not proceed until they are bound.
- Expected signals: The command explicitly names topic, spec folder, execution mode, max iterations, and convergence threshold; YAML preflight verifies them before file writes.
- Pass/fail posture: PASS if setup requirements and YAML preflight align on the required bindings and spec-folder scope; FAIL if one surface allows missing bindings the other forbids.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the setup-binding contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the command entrypoint gathers required values before loading YAML and that the YAML preflight rejects missing bindings or invalid spec-folder scope. Return a concise pass/fail verdict.
### Commands
1. `bash: sed -n '1,220p' .opencode/command/spec_kit/deep-research.md`
2. `bash: rg -n 'step_preflight_contract|required_values_present|spec_folder_is_within|max_iterations|convergence_threshold' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: sed -n '1,180p' .opencode/skill/sk-deep-research/references/state_format.md`
### Expected
The command explicitly names topic, spec folder, execution mode, max iterations, and convergence threshold; YAML preflight verifies them before file writes.
### Evidence
Capture the setup prompt, both preflight guards, and the config schema fields together.
### Pass/Fail
PASS if setup requirements and YAML preflight align on the required bindings and spec-folder scope; FAIL if one surface allows missing bindings the other forbids.
### Failure Triage
Compare both YAML files, not just one, and verify the config schema still names the same parameter fields.
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
| `.opencode/command/spec_kit/deep-research.md` | Setup-binding source of truth; use `SINGLE CONSOLIDATED SETUP PROMPT` and `## 0. UNIFIED SETUP PHASE` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Autonomous preflight guard; inspect `step_preflight_contract` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Interactive preflight guard; inspect `step_preflight_contract` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Config schema; use `ANCHOR:config-file` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
