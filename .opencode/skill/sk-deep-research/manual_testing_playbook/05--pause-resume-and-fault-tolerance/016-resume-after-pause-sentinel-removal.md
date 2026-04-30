---
title: "DR-016 -- Resume after pause sentinel removal"
description: "Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing."
---

# DR-016 -- Resume after pause sentinel removal

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-016`.

---

## 1. OVERVIEW

This scenario validates resume after pause sentinel removal for `DR-016`. The objective is to verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.

### WHY THIS MATTERS

A pause only helps if the workflow can resume cleanly from the current iteration boundary after the sentinel is cleared.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.
- Real user request: After I remove the pause file, tell me where the loop resumes from and what it logs.
- RCAF Prompt: `As a manual-testing orchestrator, validate the pause-resume contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify removing research/.deep-research-pause lets the research loop log a resumed event and continue from the read-state step, and removing {spec_folder}/review/.deep-research-pause lets the review loop do the same, instead of either mode starting from scratch. Return a concise verdict.`
- Expected execution process: Inspect the loop protocol resume-after-pause wording, then the event schema, then the YAML session behavior for resumed runs.
- Desired user-visible outcome: The user is told that resume continues from the persisted state after logging a resumed event.
- Expected signals: The loop logs `resumed`, continues from state read, and does not recreate config/strategy files during a valid resume.
- Pass/fail posture: PASS if resume continues from persisted state after logging a resumed event; FAIL if resume implies a fresh initialization path.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the pause-resume contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify removing research/.deep-research-pause lets the research loop log a resumed event and continue from the read-state step, and removing {spec_folder}/review/.deep-research-pause lets the review loop do the same, instead of either mode starting from scratch. Return a concise verdict.
### Commands
1. `bash: rg -n 'On resume|resumed|Continue from step_read_state|review/.deep-research-pause' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md`
2. `bash: rg -n 'resumed|on_resume|skip_to: phase_loop|skip_to: gate_init_approval|review/.deep-research-pause|research/.deep-research-pause' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`
3. `bash: rg -n 'Delete the file to resume|Auto-resume|review/.deep-research-pause' .opencode/skill/sk-deep-research/README.md`
### Expected
The loop logs `resumed`, continues from state read, and does not recreate config or strategy files during a valid resume in either research or review mode.
### Evidence
Capture the resumed-event wording, the resume branch behavior, and the user-facing pause or resume explanation for both packet locations.
### Pass/Fail
PASS if resume continues from persisted state after logging a resumed event in both modes; FAIL if either mode implies a fresh initialization path.
### Failure Triage
Check both the pause subsection and the broader auto-resume classification rules because research and review now use different sentinel locations.
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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Pause-resume flow; use `ANCHOR:phase-iteration-loop` and `ANCHOR:phase-initialization` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Resumed event schema; use `ANCHOR:state-log` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Resume branch behavior |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Resume branch behavior |
| `.opencode/skill/sk-deep-research/README.md` | User-facing pause and resume language; use `ANCHOR:faq` |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DR-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
