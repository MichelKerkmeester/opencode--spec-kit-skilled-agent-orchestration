---
title: "DRV-009 -- Review iteration writes findings, JSONL, and strategy update"
description: "Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy."
---

# DRV-009 -- Review iteration writes findings, JSONL, and strategy update

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-009`.

---

## 1. OVERVIEW

This scenario validates review iteration writes findings, JSONL, and strategy update for `DRV-009`. The objective is to verify that each iteration writes `iteration-NNN.md` with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.

### WHY THIS MATTERS

The three write outputs (iteration file, JSONL record, strategy update) form the persistence contract. If any output is missing, the loop manager cannot evaluate convergence and the next iteration cannot rehydrate properly.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.
- Real user request: After each review iteration, what files get created or updated? I want to verify the full write contract.
- Orchestrator prompt: Validate the per-iteration write contract for sk-deep-review. Confirm that each iteration writes iteration-NNN.md with P0/P1/P2 classified findings, appends a JSONL record with severity counts, and updates deep-review-strategy.md, then return a concise user-facing pass/fail verdict.
- Expected execution process: Inspect the YAML dispatch step for the agent prompt constraints, then the post-dispatch validation step for required outputs, then the quick reference iteration checklist for the documented write contract.
- Desired user-facing outcome: The user can be told exactly which files are created or updated after each iteration and what data each contains.
- Expected signals: The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same three outputs.
- Pass/fail posture: PASS if all sources agree on the three required outputs and their formats; FAIL if any output is undocumented or the validation step does not check for it.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-009 | Review iteration writes findings, JSONL, and strategy update | Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy. | Validate the per-iteration write contract for sk-deep-review. Confirm that each iteration writes `iteration-NNN.md`, appends a JSONL record with severity counts, and updates `deep-review-strategy.md`, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'iteration-NNN\|iteration-{NNN}\|iteration_pattern\|Write.*iteration' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'step_validate_iteration\|iteration_file_written\|jsonl_appended\|strategy_updated\|on_missing_outputs' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'iteration-NNN\|JSONL\|strategy\|Write.*findings\|P0.*P1.*P2' .opencode/skill/sk-deep-review/references/quick_reference.md` | The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same outputs. | Capture the dispatch constraints, the validation step required outputs, and the quick reference iteration checklist. | PASS if all sources agree on the three required outputs and their formats; FAIL if any output is undocumented or the validation step does not check for it. | Inspect the on_missing_outputs fallback to verify that error handling still appends a JSONL record even when the agent fails to complete its outputs. |

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
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Dispatch and validation; inspect `step_dispatch_review_agent` and `step_validate_iteration` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Dispatch and validation; inspect `step_dispatch_review_agent` and `step_validate_iteration` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Iteration checklist; use `ANCHOR:agent-iteration-checklist` |
| `.codex/agents/deep-review.toml` | Agent write contract; inspect iteration output requirements |
| `.claude/agents/deep-review.md` | Agent write contract; inspect iteration output requirements |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
