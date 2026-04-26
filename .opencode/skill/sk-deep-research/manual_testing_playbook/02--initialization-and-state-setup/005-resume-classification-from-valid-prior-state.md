---
title: "DR-005 -- Resume classification from valid prior state"
description: "Verify that the workflow classifies an existing valid scratch state as resumable before writing new files."
---

# DR-005 -- Resume classification from valid prior state

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-005`.

---

## 1. OVERVIEW

This scenario validates resume classification from valid prior state for `DR-005`. The objective is to verify that the workflow classifies an existing valid scratch state as resumable before writing new files.

### WHY THIS MATTERS

Resume behavior protects prior research from accidental overwrite and determines whether the loop should continue or synthesize.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the workflow classifies an existing valid scratch state as resumable before writing new files.
- Real user request: I already have a deep-research scratch folder. Tell me whether the workflow will resume it or start over.
- Prompt: `As a manual-testing orchestrator, validate the resume-classification contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify config, JSONL, and strategy are inspected before new files are written and that a valid prior state skips re-initialization. Return a concise pass/fail verdict.`
- Expected execution process: Inspect the loop protocol resume rules, then the YAML session-classification branches, then the README auto-resume wording.
- Desired user-facing outcome: The user gets a trustworthy explanation of when a session resumes instead of restarting.
- Expected signals: A four-state classification model exists, resume skips init writes, and completed sessions route differently from active resumes.
- Pass/fail posture: PASS if protocol, YAML, and README align on classification and resume semantics; FAIL if resume behavior is underdefined or contradictory.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the resume-classification contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify config, JSONL, and strategy are inspected before new files are written and that a valid prior state skips re-initialization. Return a concise pass/fail verdict.
### Commands
1. `bash: rg -n 'Auto-Resume Protocol|resume|completed-session|invalid-state' .opencode/skill/sk-deep-research/references/loop_protocol.md`
2. `bash: rg -n 'step_classify_session|on_resume|on_completed_session|on_invalid_state' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: rg -n 'Auto-resume|resume' .opencode/skill/sk-deep-research/README.md`
### Expected
A four-state classification model exists, resume skips init writes, and completed sessions route differently from active resumes.
### Evidence
Capture the classification states, the YAML branch names, and the user-facing auto-resume wording.
### Pass/Fail
PASS if protocol, YAML, and README align on classification and resume semantics; FAIL if resume behavior is underdefined or contradictory.
### Failure Triage
Verify completed sessions route differently from active resumes and that both YAML files use the same classification model.
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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Resume contract; use `ANCHOR:phase-initialization` and `Auto-Resume Protocol` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Session classification; inspect `step_classify_session` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Session classification; inspect `step_classify_session` |
| `.opencode/skill/sk-deep-research/README.md` | User-facing auto-resume claim; use `ANCHOR:features` and `ANCHOR:faq` |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DR-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
