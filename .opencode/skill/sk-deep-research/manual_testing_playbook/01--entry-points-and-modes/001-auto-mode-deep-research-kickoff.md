---
title: "DR-001 -- Auto mode deep-research kickoff"
description: "Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow."
---

# DR-001 -- Auto mode deep-research kickoff

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-001`.

---

## 1. OVERVIEW

This scenario validates auto mode deep-research kickoff for `DR-001`. The objective is to verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow.

### WHY THIS MATTERS

Operators need one coherent story for `/spec_kit:deep-research:auto` so they can launch unattended research with the right artifact and lifecycle expectations.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow.
- Real user request: Run a deep research session on a topic without stopping for approvals and tell me what it will create.
- Prompt: `As a manual-testing orchestrator, validate the autonomous entrypoint for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-research:auto is documented consistently across the README, quick reference, command entrypoint, and autonomous YAML workflow. Return a concise user-facing pass/fail verdict with the expected artifact summary.`
- Expected execution process: Inspect the public docs first, then the command entrypoint, then the autonomous YAML workflow so the operator explanation stays anchored in the user-facing contract before the internal workflow contract.
- Desired user-facing outcome: The user is told exactly how to invoke autonomous mode, that it runs without approval gates, and that it produces a `research/` packet plus `research/research.md`.
- Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `research/research.md`.
- Pass/fail posture: PASS if all inspected sources agree on command shape, autonomous behavior, and output artifacts; FAIL if any source materially contradicts the others.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the autonomous entrypoint for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify /spec_kit:deep-research:auto is documented consistently across the README, quick reference, command entrypoint, and autonomous YAML workflow. Return a concise user-facing pass/fail verdict with the expected artifact summary.
### Commands
1. `bash: rg -n '/spec_kit:deep-research:auto|research/research.md|research/iterations' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/quick_reference.md`
2. `bash: sed -n '1,220p' .opencode/command/spec_kit/deep-research.md`
3. `bash: sed -n '1,260p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
### Expected
The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `research/research.md`.
### Evidence
Capture the command examples, the mode-routing block, and the `state_paths` contract together.
### Pass/Fail
PASS if all inspected sources agree on command shape, autonomous behavior, and output artifacts; FAIL if any source materially contradicts the others.
### Failure Triage
Start with the README examples, confirm the Markdown command maps `:auto` to the autonomous YAML, then inspect YAML `state_paths` if the artifact contract is unclear.
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
| `.opencode/skill/sk-deep-research/README.md` | User-facing examples; use `ANCHOR:quick-start` and `ANCHOR:configuration` |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Cheat-sheet command contract; use `ANCHOR:commands` and `ANCHOR:state-files` |
| `.opencode/command/spec_kit/deep-research.md` | Markdown setup and mode routing; use `SINGLE CONSOLIDATED SETUP PROMPT` and `## 3. WORKFLOW OVERVIEW` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Autonomous workflow contract; inspect `state_paths`, `phase_init`, and `phase_loop` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DR-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--entry-points-and-modes/001-auto-mode-deep-research-kickoff.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
