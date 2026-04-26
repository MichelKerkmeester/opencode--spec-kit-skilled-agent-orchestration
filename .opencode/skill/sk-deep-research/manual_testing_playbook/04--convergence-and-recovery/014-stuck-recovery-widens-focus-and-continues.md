---
title: "DR-014 -- Stuck recovery widens focus and continues"
description: "Verify that stuck detection triggers a recovery path that widens focus before giving up."
---

# DR-014 -- Stuck recovery widens focus and continues

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-014`.

---

## 1. OVERVIEW

This scenario validates stuck recovery widens focus and continues for `DR-014`. The objective is to verify that stuck detection triggers a recovery path that widens focus before giving up.

### WHY THIS MATTERS

Recovery is what makes the loop adaptive instead of brittle when a run stops making progress on the current track.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that stuck detection triggers a recovery path that widens focus before giving up.
- Real user request: If the loop gets stuck, I want it to try a different angle before it quits.
- Prompt: `As a manual-testing orchestrator, validate the stuck-recovery contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify consecutive no-progress iterations trigger recovery, widen focus to a less-explored question, consult deferred ideas, and continue before final synthesis. Return a concise verdict.`
- Expected execution process: Inspect the convergence recovery protocol, then the loop protocol stuck-recovery ladder, then the YAML recovery logic and ideas-backlog hooks.
- Desired user-facing outcome: The user is told that the loop tries a different research angle before giving up on the session.
- Expected signals: Stuck threshold is enforced, recovery resets the counter, the next focus widens scope, and the ideas backlog can be consulted during recovery.
- Pass/fail posture: PASS if recovery widens focus and continues before exiting to synthesis; FAIL if the contract jumps straight from stuck to termination without a recovery attempt.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the stuck-recovery contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify consecutive no-progress iterations trigger recovery, widen focus to a less-explored question, consult deferred ideas, and continue before final synthesis. Return a concise verdict.
### Commands
1. `bash: rg -n 'stuckThreshold|STUCK_RECOVERY|least-explored|recovery' .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/loop_protocol.md`
2. `bash: rg -n 'stuck_count|least_explored|RECOVERY: Widen scope|research-ideas' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: rg -n 'RECOVERY MODE|research-ideas|Exhausted Approaches' .codex/agents/deep-research.toml`
### Expected
Stuck threshold is enforced, recovery resets the counter, the next focus widens scope, and the ideas backlog can be consulted during recovery.
### Evidence
Capture the stuck threshold, the widened-focus rule, and the runtime recovery mode behavior together.
### Pass/Fail
PASS if recovery widens focus and continues before exiting to synthesis; FAIL if the contract jumps straight from stuck to termination without a recovery attempt.
### Failure Triage
Check the convergence reference and loop protocol together because one defines the trigger and the other defines the recovery ladder.
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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Stuck recovery protocol; use `ANCHOR:stuck-recovery-protocol` |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Ideas backlog and stuck recovery; use `ANCHOR:phase-iteration-loop` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Recovery logic; inspect `step_handle_convergence` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Recovery logic; inspect `step_handle_convergence` |
| `.codex/agents/deep-research.toml` | Runtime recovery behavior; inspect `Recovery Mode` |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
