---
title: "DR-032 -- Review scope discovery resolves target to file list"
description: "Verify that review mode resolves the target type (spec folder / skill / agent / track / files) to a concrete file list."
---

# DR-032 -- Review scope discovery resolves target to file list

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-032`.

---

## 1. OVERVIEW

This scenario validates review scope discovery for `DR-032`. The objective is to verify that review mode resolves the target type (spec folder / skill / agent / track / files) to a concrete file list.

### WHY THIS MATTERS

A review is only as good as its scope. If the target resolution silently misses files or includes irrelevant ones, findings will be incomplete or noisy — undermining operator trust in the review verdict.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that review mode resolves the target type (spec folder / skill / agent / track / files) to a concrete file list.
- Real user request: Review this skill folder — make sure all the right files are included in scope.
- Orchestrator prompt: Validate review scope discovery for sk-deep-research. Confirm that `phase_init` resolves a given target type to a concrete, verifiable file list, and return the resolved file list alongside the target type classification.
- Expected execution process: Inspect the review YAML `phase_init` for target resolution logic, then the `deep_review_strategy.md` for target type taxonomy, then verify a sample target resolves to the expected file list.
- Desired user-facing outcome: The user sees the resolved file list and target type classification so they can confirm scope before the review begins.
- Expected signals: Target type is classified (spec folder / skill / agent / track / files), file list is concrete and complete, and no files outside scope are included.
- Pass/fail posture: PASS if the target resolves to a correct, complete file list matching the target type; FAIL if files are missing, scope leaks, or target type is misclassified.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-032 | Review scope discovery resolves target to file list | Verify that review mode resolves the target type (spec folder / skill / agent / track / files) to a concrete file list. | Validate review scope discovery. Confirm that `phase_init` in the review YAML resolves a target type to a concrete file list, and check `deep_review_strategy.md` for the target type taxonomy. | 1. `bash: rg -n 'phase_init|target|scope|file.list' .opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` -> 2. `bash: rg -n 'target type|scope|file list|resolution' .opencode/skill/sk-deep-research/references/deep_review_strategy.md` -> 3. `bash: rg -n 'spec folder|skill|agent|track|files' .opencode/skill/sk-deep-research/references/deep_review_strategy.md` | Target type is classified correctly, file list is concrete and complete, and scope boundaries are respected. | Capture the `phase_init` target resolution logic and `deep_review_strategy.md` target type taxonomy together. | PASS if target resolves to correct file list matching target type; FAIL if files are missing, scope leaks, or target type is misclassified. | Start with `phase_init` target resolution, confirm target types match `deep_review_strategy.md` taxonomy, then inspect a sample resolution if unclear. |

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
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `phase_init` for target resolution logic |
| `.opencode/skill/sk-deep-research/references/deep_review_strategy.md` | Review strategy reference; use target type taxonomy and scope resolution rules |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-032
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--review-mode/032-review-scope-discovery-resolves-target-to-file-list.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
