---
title: "DRV-021 -- Pause sentinel halts between review iterations"
description: "Verify that the review/.deep-review-pause sentinel halts the review loop between iterations and logs a pause event."
---

# DRV-021 -- Pause sentinel halts between review iterations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-021`.

---

## 1. OVERVIEW

This scenario validates pause sentinel halts between review iterations for `DRV-021`. The objective is to verify that the `review/.deep-review-pause` sentinel halts the review loop between iterations and logs a pause event.

### WHY THIS MATTERS

Autonomous review mode needs one safe, documented intervention mechanism short of killing the whole process. The pause sentinel lets an operator halt a running review to inspect intermediate findings, adjust strategy, or add context before allowing the loop to continue.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the `review/.deep-review-pause` sentinel halts the loop between iterations and logs a pause event.
- Real user request: If I need to interrupt an autonomous review safely, tell me how the pause file works.
- Prompt: `As a manual-testing orchestrator, validate the pause sentinel contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify {spec_folder}/review/.deep-review-pause is checked between review iterations, that a paused event is emitted to the JSONL state log, and that the loop halts without entering synthesis. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the loop protocol pause section, then the review YAML pause checks, then the quick reference and SKILL.md for user-facing explanation.
- Desired user-facing outcome: The user is told exactly how to pause a review run safely and what the loop does when the sentinel is present.
- Expected signals: The sentinel is checked before dispatch, a paused event is logged to JSONL, the loop halts rather than flowing into synthesis, and the sentinel location is `review/.deep-review-pause`.
- Pass/fail posture: PASS if the sentinel pauses between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the pause sentinel contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify {spec_folder}/review/.deep-review-pause is checked between review iterations, that a paused event is emitted to the JSONL state log, and that the loop halts without entering synthesis. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n '.deep-review-pause|paused|Delete.*pause|review/.deep-review-pause' .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md`
2. `bash: rg -n 'step_check_pause_sentinel|paused|halt.*true|review/.deep-review-pause|pause.*sentinel' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'pause|sentinel|review/.deep-review-pause|Pause' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/deep-review.md`
### Expected
The sentinel is checked before dispatch, a paused event is logged to JSONL, the loop halts rather than flowing into synthesis, and the sentinel location is `review/.deep-review-pause`.
### Evidence
Capture the sentinel location, the paused-event contract, and the halt behavior from both YAML workflows and user-facing docs.
### Pass/Fail
PASS if the pause sentinel halts between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion.
### Failure Triage
Use the loop protocol pause subsection as the canonical flow and verify both review YAML workflows mirror it.
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
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Pause sentinel contract; use the pause-handling subsection |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Pause check step; inspect `step_check_pause_sentinel` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Pause check step; inspect `step_check_pause_sentinel` |
| `.opencode/command/spec_kit/deep-review.md` | Command entrypoint; review-specific pause documentation |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | State files showing pause sentinel location; use `ANCHOR:state-files` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Rule-level context; use `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/README.md` | User-facing pause FAQ |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DRV-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
