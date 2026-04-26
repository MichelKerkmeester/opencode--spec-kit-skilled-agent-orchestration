---
title: "DR-002 -- Confirm mode checkpointed execution"
description: "Verify that confirm mode adds approval checkpoints without changing the core loop phases or artifact contract."
---

# DR-002 -- Confirm mode checkpointed execution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-002`.

---

## 1. OVERVIEW

This scenario validates confirm mode checkpointed execution for `DR-002`. The objective is to verify that confirm mode adds approval checkpoints without changing the core loop phases or artifact contract.

### WHY THIS MATTERS

Confirm mode is the safety valve for operators who want to inspect setup, iterations, and synthesis before the loop continues.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that confirm mode adds approval checkpoints without changing the core loop phases or artifact contract.
- Real user request: Run deep research, but stop so I can review the strategy and each iteration before you continue.
- Prompt: `As a manual-testing orchestrator, validate the confirm-mode contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-research:confirm is documented as interactive, approval-gated, and still uses the same core loop and output artifacts as auto mode. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the command entrypoint for mode descriptions, then the confirm YAML for approval gates, then the README to ensure the user-facing explanation still describes the same loop outputs.
- Desired user-facing outcome: The user is told that confirm mode pauses for review at defined checkpoints while still producing the same scratch state and synthesis artifacts.
- Expected signals: Confirm mode is interactive, approval-gated, and still routes through initialization, loop, synthesis, and save rather than a separate workflow.
- Pass/fail posture: PASS if confirm mode is approval-gated and still preserves the same loop/artifact contract as auto mode; FAIL if the docs or YAML describe a materially different behavior.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the confirm-mode contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-research:confirm is documented as interactive, approval-gated, and still uses the same core loop and output artifacts as auto mode. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n ':confirm|approval|interactive' .opencode/command/spec_kit/deep-research.md .opencode/skill/sk-deep-research/README.md`
2. `bash: sed -n '1,300p' .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: rg -n 'gate_init_approval|phase_loop|phase_synthesis|research_output|research/iterations' .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
### Expected
Confirm mode is interactive, approval-gated, and still routes through initialization, loop, synthesis, and save rather than a separate workflow.
### Evidence
Capture the confirm-mode description, the explicit approval gate names, and the shared artifact paths.
### Pass/Fail
PASS if confirm mode is approval-gated and still preserves the same loop/artifact contract as auto mode; FAIL if the docs or YAML describe a materially different behavior.
### Failure Triage
Inspect `gate_init_approval` first, then compare `phase_loop` and `state_paths` to the auto workflow and README wording.
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
| `.opencode/command/spec_kit/deep-research.md` | Mode routing and workflow overview; use `## 0. UNIFIED SETUP PHASE` and `## 3. WORKFLOW OVERVIEW` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Interactive workflow contract; inspect `gate_init_approval`, iteration approval steps, and `state_paths` |
| `.opencode/skill/sk-deep-research/README.md` | User-facing execution modes; use `ANCHOR:features` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--entry-points-and-modes/002-confirm-mode-checkpointed-execution.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
