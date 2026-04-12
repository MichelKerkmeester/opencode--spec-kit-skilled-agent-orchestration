---
title: "DRV-008 -- Review iteration reads state before review"
description: "Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions."
---

# DRV-008 -- Review iteration reads state before review

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-008`.

---

## 1. OVERVIEW

This scenario validates review iteration reads state before review for `DRV-008`. The objective is to verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions.

### WHY THIS MATTERS

Fresh-context iterations only stay coherent if the agent rehydrates itself from the persisted state at the start of every cycle. Without this, the agent cannot know which dimensions have been covered or what findings already exist.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions.
- Real user request: Make sure each deep-review iteration actually reads prior state before it starts reviewing again.
- Prompt: `As a manual-testing orchestrator, validate the read-state-first iteration contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-review agent both require reading JSONL and strategy state before any review actions. Return a concise operator verdict.`
- Expected execution process: Inspect the workflow loop steps, then the quick reference iteration checklist, then the runtime agent instructions for the single-iteration sequence.
- Desired user-facing outcome: The user is told that each iteration starts by reading persisted state instead of relying on memory from prior runs.
- Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
- Pass/fail posture: PASS if all sources agree that state is read before review actions; FAIL if any source allows review before rehydrating state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-008 | Review iteration reads state before review | Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions. | As a manual-testing orchestrator, validate the read-state-first iteration contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify the loop dispatch and the @deep-review agent both require reading JSONL and strategy state before any review actions. Return a concise operator verdict. | 1. `bash: rg -n 'step_read_state|current_iteration|next_focus|Read.*state' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 2. `bash: rg -n 'Read.*state\|Read.*strategy\|Read.*JSONL\|step 1\|1\. Read' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md` -> 3. `bash: sed -n '1,220p' .codex/agents/deep-review.toml && sed -n '1,220p' .claude/agents/deep-review.md` | Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads. | Capture the loop step order, the quick-reference checklist, and the runtime agent step sequence. | PASS if all sources agree that state is read before review actions; FAIL if any source allows review before rehydrating state. | Check the agent sequence under the iteration checklist if the higher-level docs look ambiguous. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Loop state extraction; inspect `step_read_state` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Loop state extraction; inspect `step_read_state` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Iteration checklist; use `ANCHOR:agent-iteration-checklist` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Skill-level iteration documentation |
| `.codex/agents/deep-review.toml` | Codex runtime agent sequence; inspect iteration protocol |
| `.claude/agents/deep-review.md` | Claude runtime agent sequence; inspect iteration protocol |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-008
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
