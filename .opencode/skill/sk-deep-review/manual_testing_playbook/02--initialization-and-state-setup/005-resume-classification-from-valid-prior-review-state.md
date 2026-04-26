---
title: "DRV-005 -- Resume classification from valid prior review state"
description: "Verify that resume detects existing review state and continues from the last completed iteration."
---

# DRV-005 -- Resume classification from valid prior review state

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-005`.

---

## 1. OVERVIEW

This scenario validates resume classification from valid prior review state for `DRV-005`. The objective is to verify that the session classifier detects existing review state and continues from the last completed iteration.

### WHY THIS MATTERS

Long review sessions may be interrupted by context limits, crashes, or user pauses. The resume path must reliably pick up where the last iteration left off without re-running completed dimensions.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that resume detects existing review state and continues from the last completed iteration.
- Real user request: My deep review was interrupted. When I re-run the command, does it pick up where it left off?
- Prompt: `As a manual-testing orchestrator, validate the resume classification contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the step_classify_session logic detects existing config, JSONL, and strategy files in review/ and classifies the session as "resume", skipping to phase_loop. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the YAML classify step first for the resume classification logic, then the quick reference for resume behavior documentation, then the SKILL.md for phase detection guidance.
- Desired user-facing outcome: The user is told that re-running the command on a spec folder with existing review state will resume from the last iteration without re-initializing.
- Expected signals: The classify step checks for config, JSONL, and strategy presence; classifies as "resume" when all three exist and are consistent; and skips to phase_loop.
- Pass/fail posture: PASS if the classify step reliably detects valid prior state and routes to phase_loop; FAIL if resume classification is missing or routes to re-initialization.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the resume classification contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the step_classify_session logic detects existing config, JSONL, and strategy files in review/ and classifies the session as "resume", skipping to phase_loop. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n 'step_classify_session|classify:|fresh|resume|invalid.state|completed.session' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
2. `bash: rg -n 'step_classify_session|resume|skip_to' .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'resume|prior state|existing state|pick up' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md`
### Expected
The classify step checks for config, JSONL, and strategy presence; classifies as "resume" when all three exist and are consistent; and skips to phase_loop.
### Evidence
Capture the classify step logic, the resume skip_to target, and the user-facing resume documentation.
### Pass/Fail
PASS if the classify step reliably detects valid prior state and routes to phase_loop; FAIL if resume classification is missing or routes to re-initialization.
### Failure Triage
Verify the classify step inspects all three state files (config, JSONL, strategy) and that the on_resume action points to phase_loop.
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
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Session classification logic; inspect `step_classify_session` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Session classification logic; inspect `step_classify_session` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Resume behavior documentation; use `ANCHOR:troubleshooting` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Phase detection guidance; use `ANCHOR:smart-routing` |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DRV-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
