---
title: "DR-009 -- Strategy “Next Focus” and exhausted-approach discipline"
description: "Verify that the loop honors the strategy file’s Next Focus and avoids approaches marked exhausted or blocked."
---

# DR-009 -- Strategy “Next Focus” and exhausted-approach discipline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-009`.

---

## 1. OVERVIEW

This scenario validates strategy “next focus” and exhausted-approach discipline for `DR-009`. The objective is to verify that the loop honors the strategy file’s Next Focus and avoids approaches marked exhausted or blocked.

### WHY THIS MATTERS

The strategy file is the persistent brain of the workflow; if the agent ignores it, the loop wastes iterations and repeats stale approaches.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the loop honors the strategy file’s Next Focus and avoids approaches marked exhausted or blocked.
- Real user request: Make sure the next iteration actually follows the strategy file and does not retry blocked approaches.
- Prompt: `As a manual-testing orchestrator, validate the strategy-discipline contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify iteration focus comes from Next Focus and that exhausted or blocked approaches are not retried. Return a concise user-facing verdict.`
- Expected execution process: Inspect the strategy-file update rules, the loop protocol focus logic, and the runtime agent’s mandatory pre-check for exhausted approaches.
- Desired user-facing outcome: The user is told that the next iteration follows the strategy file rather than picking an arbitrary direction.
- Expected signals: Next Focus is read explicitly, exhausted approaches are treated as do-not-retry, and recovery mode consults deferred ideas instead of repeating blocked tactics.
- Pass/fail posture: PASS if the workflow and runtime both treat `Next Focus` as primary and exhausted approaches as non-retriable; FAIL if focus selection is unconstrained or blocked tactics can be reused.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the strategy-discipline contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify iteration focus comes from Next Focus and that exhausted or blocked approaches are not retried. Return a concise user-facing verdict.
### Commands
1. `bash: rg -n 'Next Focus|Exhausted Approaches|What Worked|What Failed' .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/loop_protocol.md`
2. `bash: rg -n 'Exhausted Approaches|MANDATORY PRE-CHECK|RECOVERY' .codex/agents/deep-research.toml`
3. `bash: rg -n 'least_explored|next_focus|remaining_questions_list' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
### Expected
Next Focus is read explicitly, exhausted approaches are treated as do-not-retry, and recovery mode consults deferred ideas instead of repeating blocked tactics.
### Evidence
Capture the strategy-file sections, the runtime pre-check, and the loop’s extracted focus fields.
### Pass/Fail
PASS if the workflow and runtime both treat `Next Focus` as primary and exhausted approaches as non-retriable; FAIL if focus selection is unconstrained or blocked tactics can be reused.
### Failure Triage
If wording differs between docs, privilege the runtime pre-check plus the state-format required sections.
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
| `.opencode/skill/sk-deep-research/references/state_format.md` | Strategy file requirements; use `ANCHOR:strategy-file` |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Ideas backlog and recovery focus; use `ANCHOR:phase-iteration-loop` |
| `.codex/agents/deep-research.toml` | Exhausted-approach discipline and focus selection; inspect `Step 2: Determine Focus` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Loop focus extraction |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Loop focus extraction |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/009-strategy-next-focus-and-exhausted-approach-discipline.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
