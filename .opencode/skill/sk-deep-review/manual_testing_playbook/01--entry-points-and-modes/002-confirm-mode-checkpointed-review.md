---
title: "DRV-002 -- Confirm mode checkpointed review"
description: "Verify that confirm mode pauses at each phase for user approval before proceeding."
---

# DRV-002 -- Confirm mode checkpointed review

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-002`.

---

## 1. OVERVIEW

This scenario validates confirm mode checkpointed review for `DRV-002`. The objective is to verify that `/spec_kit:deep-review:confirm` pauses at each phase for user approval before proceeding.

### WHY THIS MATTERS

Operators running interactive reviews need approval gates between iterations so they can inspect findings, adjust scope, or abort early. Without these gates, the confirm mode contract is indistinguishable from auto mode.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that `/spec_kit:deep-review:confirm` pauses at each phase for user approval before proceeding.
- Real user request: Run a deep review but let me approve each iteration before it continues.
- Prompt: `As a manual-testing orchestrator, validate the against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify entrypoint for sk-deep-review. Confirm that /spec_kit:deep-review:confirm is documented consistently across the README, quick reference, command entrypoint, and confirm YAML workflow, and that approval gates are present at each phase transition. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the public docs first to confirm confirm mode is advertised, then the command entrypoint for mode routing, then the confirm YAML workflow for explicit approval gates.
- Desired user-facing outcome: The user is told that confirm mode pauses between iterations for approval, that they can inspect findings before continuing, and that the same `review/` artifacts are produced.
- Expected signals: The confirm YAML has `approvals: multi_gate`, pause/approval steps appear in the loop, and the command entrypoint routes `:confirm` to the confirm YAML.
- Pass/fail posture: PASS if confirm mode has explicit approval gates at phase transitions; FAIL if any phase transition runs without an approval gate.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify entrypoint for sk-deep-review. Confirm that /spec_kit:deep-review:confirm is documented consistently across the README, quick reference, command entrypoint, and confirm YAML workflow, and that approval gates are present at each phase transition. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n '/spec_kit:deep-review:confirm|approval|multi_gate' .opencode/skill/sk-deep-review/README.md .opencode/skill/sk-deep-review/references/quick_reference.md`
2. `bash: rg -n 'confirm|approval|gate|pause' .opencode/command/spec_kit/deep-review.md`
3. `bash: rg -n 'approvals|approval_gate|wait_for_approval|interactive' .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
### Expected
The confirm YAML has `approvals: multi_gate`, approval steps appear in the loop, and the command entrypoint routes `:confirm` to the confirm YAML.
### Evidence
Capture the mode-routing block, the confirm YAML operating_mode, and the approval gate steps together.
### Pass/Fail
PASS if confirm mode has explicit approval gates at phase transitions; FAIL if any phase transition runs without an approval gate.
### Failure Triage
Compare the auto and confirm YAMLs side by side to verify the confirm variant adds approval gates that the auto variant omits.
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
| `.opencode/skill/sk-deep-review/README.md` | User-facing examples; use `ANCHOR:quick-start` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Cheat-sheet command contract; use `ANCHOR:commands` |
| `.opencode/command/spec_kit/deep-review.md` | Markdown setup and mode routing; use `## 0. UNIFIED SETUP PHASE` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Confirm workflow contract; inspect `operating_mode`, `approvals`, and approval gate steps |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
