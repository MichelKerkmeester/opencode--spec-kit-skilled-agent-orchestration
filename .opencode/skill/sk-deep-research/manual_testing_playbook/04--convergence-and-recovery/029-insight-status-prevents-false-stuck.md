---
title: "DR-029 -- Insight status prevents false stuck detection"
description: "Verify that an iteration with status insight does not increment stuck count despite low newInfoRatio."
---

# DR-029 -- Insight status prevents false stuck detection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-029`.

---

## 1. OVERVIEW

This scenario validates insight status handling for `DR-029`. The objective is to verify that an iteration with status "insight" (low newInfoRatio but containing an important conceptual breakthrough) does NOT increment the stuck counter.

### WHY THIS MATTERS

Without insight-status protection, a eureka moment that reshapes the research direction but yields little raw data would be misclassified as stuck, potentially triggering premature recovery or convergence exit.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that an iteration with status "insight" and low newInfoRatio does NOT increment stuck count.
- Real user request: If the agent has a eureka moment but finds little new raw data, does the loop treat it as stuck?
- RCAF Prompt: `As a manual-testing orchestrator, validate the insight-status contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify state_format.md defines "insight" as a valid iteration status, that convergence.md documents how stuckCount is computed, and that insight iterations are excluded from stuck counting. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the state format reference for the insight status definition, then the convergence reference for stuckCount computation rules, then the SKILL.md for the iteration status summary.
- Desired user-visible outcome: The user understands that an insight iteration is not counted as stuck because the conceptual breakthrough is recognized as progress even when raw data yield is low.
- Expected signals: Iteration with status="insight" and low newInfoRatio, stuck_count NOT incremented.
- Pass/fail posture: PASS if state_format.md defines "insight" status as preventing stuck counting AND convergence.md confirms stuckCount excludes insight iterations; FAIL if insight iterations are counted toward stuck or the documentation is contradictory.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the insight-status contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify state_format.md defines "insight" as a valid iteration status, that convergence.md documents how stuckCount is computed, and that insight iterations are excluded from stuck counting. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'insight' .opencode/skill/sk-deep-research/references/state_format.md`
2. `bash: rg -n 'stuckCount\|stuck_count\|insight' .opencode/skill/sk-deep-research/references/convergence.md`
3. `bash: rg -n 'insight\|thought\|stuck' .opencode/skill/sk-deep-research/SKILL.md`
4. `bash: rg -n 'stuck_count.*insight\|insight.*stuck' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
### Expected
Iteration with status="insight" and low newInfoRatio, stuck_count NOT incremented.
### Evidence
Capture the state_format.md insight status definition, the convergence.md stuckCount computation rule, and the SKILL.md iteration status summary showing insight as a recognized status.
### Pass/Fail
PASS if state_format.md defines "insight" status as preventing stuck counting AND convergence.md confirms stuckCount excludes insight iterations; FAIL if insight iterations are counted toward stuck or the documentation is contradictory.
### Failure Triage
Privilege state_format.md for the status taxonomy and convergence.md for the stuckCount algorithm; use SKILL.md only as secondary confirmation.
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
| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical JSONL schema; insight status definition and its relationship to stuck counting |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence math; stuckCount computation and which statuses increment it |
| `.opencode/skill/sk-deep-research/SKILL.md` | Skill overview; iteration status taxonomy including insight |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; stuck_count update logic in step_update_state |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
