---
title: "DR-008 -- Iteration writes iteration-NNN.md, JSONL record, and reducer refresh"
description: "Verify that each completed iteration writes the detailed iteration file, appends JSONL, and provides the reducer enough evidence to refresh synchronized packet state."
---

# DR-008 -- Iteration writes iteration-NNN.md, JSONL record, and reducer refresh

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-008`.

---

## 1. OVERVIEW

This scenario validates iteration writes iteration-nnn.md, jsonl record, and reducer refresh for `DR-008`. The objective is to verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables the reducer to refresh synchronized strategy, registry, and dashboard state.

### WHY THIS MATTERS

The loop only remains resumable and auditable if iteration artifacts are written consistently after every cycle.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization.
- Real user request: Show me what a successful iteration writes back to disk after it finishes researching.
- Prompt: `As a manual-testing orchestrator, validate the iteration write-back contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the loop protocol evaluation rules, the state-format schemas, and the runtime agent write sequence.
- Desired user-facing outcome: The user is told exactly which files are written at the end of a successful iteration and what each one represents.
- Expected signals: Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects.
- Pass/fail posture: PASS if all sources require the iteration file, JSONL append, and reducer refresh together; FAIL if any source treats one of them as optional.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the iteration write-back contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'iteration-{NNN}|Verify JSONL was appended|reducer refreshed' .opencode/skill/sk-deep-research/references/loop_protocol.md`
2. `bash: rg -n 'iteration-NNN|deep-research-state.jsonl|findings-registry.json|Reducer Contract' .opencode/skill/sk-deep-research/references/state_format.md .codex/agents/deep-research.toml`
3. `bash: rg -n 'step_reduce_state|reduce-state.cjs|findings-registry.json|deep-research-dashboard.md' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
### Expected
Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects.
### Evidence
Capture the iteration artifact, the JSONL append, and the reducer-owned refresh surfaces.
### Pass/Fail
PASS if all sources require the iteration file, JSONL append, and reducer refresh together; FAIL if any source treats one of them as optional.
### Failure Triage
Use the reducer script and runtime agent write contract as the lower-level source of truth when the overview docs are concise.
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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Evaluation and write-back checks; use `ANCHOR:phase-iteration-loop` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Schema expectations for JSONL and strategy; use `ANCHOR:state-log` and `ANCHOR:strategy-file` |
| `.codex/agents/deep-research.toml` | Iteration write sequence; inspect `Step 4`, `Step 5`, and `Step 6` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow verification after dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow verification after dispatch |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
