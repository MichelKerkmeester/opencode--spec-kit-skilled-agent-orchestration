---
title: "DR-007 -- Iteration reads state before research"
description: "Verify that each dispatched iteration reads JSONL and strategy state before performing research actions."
---

# DR-007 -- Iteration reads state before research

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-007`.

---

## 1. OVERVIEW

This scenario validates iteration reads state before research for `DR-007`. The objective is to verify that each dispatched iteration reads JSONL and strategy state before performing research actions.

### WHY THIS MATTERS

Fresh-context iterations only stay coherent if the agent rehydrates itself from the persisted state at the start of every cycle.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.
- Real user request: Make sure each deep-research iteration actually reads prior state before it starts searching again.
- Prompt: `As a manual-testing orchestrator, validate the read-state-first iteration contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-research agent both require reading JSONL and strategy state before any research actions. Return a concise operator verdict.`
- Expected execution process: Inspect the workflow loop steps, then the quick reference iteration checklist, then the Codex runtime agent instructions for the single-iteration sequence.
- Desired user-facing outcome: The user is told that each iteration starts by reading persisted state instead of relying on memory from prior runs.
- Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
- Pass/fail posture: PASS if all sources agree that state is read before research actions; FAIL if any source allows research before rehydrating state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the read-state-first iteration contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-research agent both require reading JSONL and strategy state before any research actions. Return a concise operator verdict.
### Commands
1. `bash: rg -n 'Step 1: Read State|Read current state|read state first' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/SKILL.md`
2. `bash: rg -n 'step_read_state|current_iteration|next_focus' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/references/quick_reference.md && sed -n '1,220p' .codex/agents/deep-research.toml`
### Expected
Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
### Evidence
Capture the loop step order, the quick-reference checklist, and the runtime agent step sequence.
### Pass/Fail
PASS if all sources agree that state is read before research actions; FAIL if any source allows research before rehydrating state.
### Failure Triage
Check the agent sequence under `Single Iteration Protocol` if the higher-level docs look ambiguous.
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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Iteration loop order; use `ANCHOR:phase-iteration-loop` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Loop state extraction; inspect `step_read_state` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Loop state extraction; inspect `step_read_state` |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Iteration checklist; use `ANCHOR:agent-iteration-checklist` |
| `.codex/agents/deep-research.toml` | Canonical runtime agent sequence; inspect `## 1. CORE WORKFLOW` |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
