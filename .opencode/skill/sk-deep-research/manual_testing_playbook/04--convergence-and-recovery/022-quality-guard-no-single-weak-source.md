---
title: "DR-022 -- Quality Guard — No Single-Weak-Source"
description: "Verify that convergence STOP is blocked when an answered question relies solely on a tentative source."
---

# DR-022 -- Quality Guard — No Single-Weak-Source

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-022`.

---

## 1. OVERVIEW

This scenario validates the no-single-weak-source quality guard for `DR-022`. The objective is to verify that convergence STOP is blocked when an answered question relies solely on one source with `sourceStrength == "tentative"`.

### WHY THIS MATTERS

A tentative source is unverified and low-confidence by definition. Allowing the loop to stop when a question's only evidence is tentative means the final synthesis could contain unreliable claims presented as established findings. This guard ensures that tentative-only answers are never treated as sufficient for convergence.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked when an answered question relies solely on a tentative source.
- Real user request: What happens if the loop marks a question answered but the source is unreliable?
- Prompt: `As a manual-testing orchestrator, validate the no-single-weak-source quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question backed by exactly one source for sourceStrength == "tentative", and that a violation emits a guard_violation event with guard="single_weak_source" and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.`
- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the sourceStrength definitions in state_format.md, then the YAML algorithm guard check, then the loop protocol Step 2c.
- Desired user-facing outcome: The user gets an accurate explanation of how tentative-only answers are caught and why the loop continues to seek stronger evidence.
- Expected signals: guard_violation event logged with guard="single_weak_source", STOP decision overridden to CONTINUE, violated question targeted for stronger sourcing in next iteration.
- Pass/fail posture: PASS if the single_weak_source guard rule (no answered question can rely solely on one tentative source), the sourceStrength classification, its violation logging, and its STOP-override behavior are consistent across convergence.md, state_format.md, loop_protocol.md, and auto.yaml; FAIL if any of those elements drift or contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the no-single-weak-source quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question backed by exactly one source for sourceStrength == "tentative", and that a violation emits a guard_violation event with guard="single_weak_source" and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.
### Commands
1. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: rg -n 'single_weak_source\|tentative\|sourceStrength' .opencode/skill/sk-deep-research/references/convergence.md`
3. `bash: sed -n '183,195p' .opencode/skill/sk-deep-research/references/state_format.md`
4. `bash: rg -n 'guard_violation\|single_weak_source' .opencode/skill/sk-deep-research/references/state_format.md`
5. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md`
6. `bash: sed -n '236,243p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
### Expected
guard_violation event logged with guard="single_weak_source", STOP decision overridden to CONTINUE, violated question targeted for stronger sourcing in next iteration.
### Evidence
Capture the guard rule table row for No Single-Weak-Source, the pseudocode branch for len(sources) == 1 and sources[0].strength == "tentative", the sourceStrength classification table from state_format.md, and the YAML override logic.
### Pass/Fail
PASS if the single_weak_source guard rule (no answered question can rely solely on one tentative source), the sourceStrength classification, its violation logging, and its STOP-override behavior are consistent across convergence.md, state_format.md, loop_protocol.md, and auto.yaml; FAIL if any of those elements drift or contradict.
### Failure Triage
Privilege convergence.md §2.4 for the canonical guard definition and state_format.md for the sourceStrength classification; use loop_protocol.md Step 2c and auto.yaml as secondary confirmation.
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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition and sourceStrength field classification |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-022
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
