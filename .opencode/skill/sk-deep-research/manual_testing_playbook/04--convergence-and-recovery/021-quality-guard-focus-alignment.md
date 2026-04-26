---
title: "DR-021 -- Quality Guard — Focus Alignment"
description: "Verify that convergence STOP is blocked when answered questions don't map to original key questions."
---

# DR-021 -- Quality Guard — Focus Alignment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-021`.

---

## 1. OVERVIEW

This scenario validates the focus alignment quality guard for `DR-021`. The objective is to verify that convergence STOP is blocked when answered questions do not map to the original key questions established during initialization.

### WHY THIS MATTERS

A research loop can drift from its original purpose by answering tangential questions that were never part of the brief. The focus alignment guard ensures that marking questions as answered only counts when they correspond to the original key questions, preventing the loop from declaring success on work that was never requested.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked when answered questions don't map to original key questions.
- Real user request: What stops the loop from answering the wrong questions and calling it done?
- Prompt: `As a manual-testing orchestrator, validate the focus alignment quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard compares answered questions against the original key questions from initialization, and that a mismatch emits a guard_violation event with guard="focus_alignment" and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.`
- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the YAML algorithm guard check, then the loop protocol Step 2c, then the state format guard_violation event schema.
- Desired user-facing outcome: The user gets an accurate explanation of how the loop detects and blocks convergence on off-topic answers.
- Expected signals: guard_violation event logged with guard="focus_alignment", STOP decision overridden to CONTINUE, misaligned question flagged in violation detail.
- Pass/fail posture: PASS if the focus_alignment guard rule (answered questions must map to originalKeyQuestions), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the focus alignment quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard compares answered questions against the original key questions from initialization, and that a mismatch emits a guard_violation event with guard="focus_alignment" and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.
### Commands
1. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: rg -n 'focus_alignment\|originalKeyQuestions\|guard_violation' .opencode/skill/sk-deep-research/references/convergence.md`
3. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md`
4. `bash: rg -n 'guard_violation\|focus_alignment' .opencode/skill/sk-deep-research/references/state_format.md`
5. `bash: sed -n '236,243p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
### Expected
guard_violation event logged with guard="focus_alignment", STOP decision overridden to CONTINUE, misaligned question flagged in violation detail.
### Evidence
Capture the guard rule table row for Focus Alignment, the pseudocode branch for q not in strategy.originalKeyQuestions, the YAML override logic, and the state_format supported guard values list.
### Pass/Fail
PASS if the focus_alignment guard rule (answered questions must map to originalKeyQuestions), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.
### Failure Triage
Privilege convergence.md §2.4 for the canonical guard definition; use loop_protocol.md Step 2c and auto.yaml step_check_convergence as secondary confirmation of the override flow.
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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check |
| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition and supported guard values |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/021-quality-guard-focus-alignment.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
