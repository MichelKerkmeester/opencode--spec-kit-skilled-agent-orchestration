---
title: "DRV-004 -- Fresh review initialization creates canonical state files"
description: "Verify that a fresh review session creates the canonical config, JSONL, strategy, and iteration directory from the shipped assets."
---

# DRV-004 -- Fresh review initialization creates canonical state files

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-004`.

---

## 1. OVERVIEW

This scenario validates fresh review initialization creates canonical state files for `DRV-004`. The objective is to verify that a fresh session creates the canonical `review/deep-review-config.json`, `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `review/deep-review-strategy.md`, and `review/iterations/` directory from the shipped assets.

### WHY THIS MATTERS

Every later review iteration depends on initialization creating the correct review artifacts in the correct places under the `review/` packet directory.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that a fresh session creates the canonical config, JSONL, strategy, and iteration directory from the shipped assets.
- Real user request: Before running a review, show me exactly what a brand-new deep-review session creates in my spec folder.
- Prompt: `As a manual-testing orchestrator, validate the fresh-initialization contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates review/deep-review-config.json, review/deep-review-state.jsonl, review/deep-review-findings-registry.json, review/deep-review-strategy.md, and review/iterations/ from the live templates. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the YAML init steps first, then the asset templates that seed the files, then the quick reference state files table.
- Desired user-facing outcome: The user can be told which review files appear immediately in a fresh session and why each exists.
- Expected signals: The review/ directory is created, config comes from the shared deep-review config template, the findings registry is created from the reducer contract, strategy comes from the sk-deep-review strategy template, and the JSONL begins with a config record.
- Pass/fail posture: PASS if protocol, YAML, and asset templates agree on the initial review artifacts and their roles; FAIL if the artifact list or template sources drift.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the fresh-initialization contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates review/deep-review-config.json, review/deep-review-state.jsonl, review/deep-review-findings-registry.json, review/deep-review-strategy.md, and review/iterations/ from the live templates. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n 'step_create_directories|step_create_config|step_create_state_log|step_create_findings_registry|step_create_strategy' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
2. `bash: sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_config.json && sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
3. `bash: rg -n 'state_paths|config:|state_log:|findings_registry:|strategy:|iteration_pattern' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
### Expected
The review/ directory is created, config comes from the shared config template, the findings registry comes from the reducer contract, strategy comes from the sk-deep-review strategy template, and the JSONL begins with a config record.
### Evidence
Capture the initialization step names, the live template files, and the state_paths contract in one evidence bundle.
### Pass/Fail
PASS if protocol, YAML, and asset templates agree on the initial review artifacts and their roles; FAIL if the artifact list or template sources drift.
### Failure Triage
Check both YAML variants, verify the JSONL init step writes a config record, confirm the reducer registry is created, and confirm the assets live under `assets/`.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Autonomous init steps; inspect `phase_init` and `state_paths` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Confirm init steps; inspect `phase_init` |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Config template |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Strategy template |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | State files table; use `ANCHOR:state-files` |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DRV-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
