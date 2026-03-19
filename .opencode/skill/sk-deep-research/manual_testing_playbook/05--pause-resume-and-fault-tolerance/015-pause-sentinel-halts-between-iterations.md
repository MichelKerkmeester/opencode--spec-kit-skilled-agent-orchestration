---
title: "DR-015 -- Pause sentinel halts between iterations"
description: "Verify that the pause sentinel halts the loop between iterations and logs a pause event."
---

# DR-015 -- Pause sentinel halts between iterations

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-015`.

---

## 1. OVERVIEW

This scenario validates pause sentinel halts between iterations for `DR-015`. The objective is to verify that the pause sentinel halts the loop between iterations and logs a pause event.

### WHY THIS MATTERS

Autonomous mode needs one safe, documented intervention mechanism short of killing the whole process.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the pause sentinel halts the loop between iterations and logs a pause event.
- Real user request: If I need to interrupt an autonomous run safely, tell me how the pause file works.
- Orchestrator prompt: Validate the pause-sentinel contract for sk-deep-research. Confirm that scratch/.deep-research-pause is checked between iterations, emits a paused event, and halts the loop without entering synthesis, then return a concise operator-facing verdict.
- Expected execution process: Inspect the loop protocol pause section, then the YAML pause checks, then the FAQ and troubleshooting wording for user-facing explanation.
- Desired user-facing outcome: The user is told exactly how to pause a run safely and what the loop does when the sentinel is present.
- Expected signals: The sentinel is checked before dispatch, a paused event is logged, and the loop halts rather than flowing into synthesis.
- Pass/fail posture: PASS if the sentinel pauses between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-015 | Pause sentinel halts between iterations | Verify that the pause sentinel halts the loop between iterations and logs a pause event. | Validate the pause-sentinel contract for sk-deep-research. Confirm that `scratch/.deep-research-pause` is checked between iterations, emits a paused event, and halts the loop without entering synthesis, then return a concise operator-facing verdict. | 1. `bash: rg -n '.deep-research-pause|paused|Delete scratch/.deep-research-pause' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/README.md` -> 2. `bash: rg -n 'step_check_pause_sentinel|paused|halt: true' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'pause|sentinel' .opencode/skill/sk-deep-research/references/quick_reference.md .opencode/skill/sk-deep-research/SKILL.md` | The sentinel is checked before dispatch, a paused event is logged, and the loop halts rather than flowing into synthesis. | Capture the sentinel filename, the paused-event contract, and the halt behavior. | PASS if the sentinel pauses between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion. | Use the loop protocol pause subsection as the canonical flow and verify YAML mirrors it exactly. |

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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Pause sentinel contract; use `ANCHOR:phase-iteration-loop` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Pause check step; inspect `step_check_pause_sentinel` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Pause check step; inspect `step_check_pause_sentinel` |
| `.opencode/skill/sk-deep-research/README.md` | User-facing pause FAQ; use `ANCHOR:faq` |
| `.opencode/skill/sk-deep-research/SKILL.md` | Rule-level context; use `ANCHOR:rules` |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DR-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
