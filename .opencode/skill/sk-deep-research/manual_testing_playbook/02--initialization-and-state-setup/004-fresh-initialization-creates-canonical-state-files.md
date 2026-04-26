---
title: "DR-004 -- Fresh initialization creates canonical state files"
description: "Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets."
---

# DR-004 -- Fresh initialization creates canonical state files

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-004`.

---

## 1. OVERVIEW

This scenario validates fresh initialization creates canonical state files for `DR-004`. The objective is to verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.

### WHY THIS MATTERS

Every later iteration depends on initialization creating the correct scratch artifacts in the correct places.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.
- Real user request: Before running research, show me exactly what a brand-new deep-research session creates in my spec folder.
- Prompt: `As a manual-testing orchestrator, validate the fresh-initialization contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates deep-research-config.json, deep-research-state.jsonl, and deep-research-strategy.md from the live templates. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the initialization reference first, then the YAML init steps, then the asset templates that seed the files.
- Desired user-facing outcome: The user can be told which scratch files appear immediately in a fresh session and why each exists.
- Expected signals: The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record.
- Pass/fail posture: PASS if protocol, YAML, and asset templates agree on the initial scratch artifacts and their roles; FAIL if the artifact list or template sources drift.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the fresh-initialization contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization creates deep-research-config.json, deep-research-state.jsonl, and deep-research-strategy.md from the live templates. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/references/loop_protocol.md`
2. `bash: rg -n 'step_create_directories|step_create_config|step_create_state_log|step_create_strategy' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/assets/deep_research_config.json && sed -n '1,220p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
### Expected
The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record.
### Evidence
Capture the initialization outputs, the explicit create steps, and the live template files in one evidence bundle.
### Pass/Fail
PASS if protocol, YAML, and asset templates agree on the initial scratch artifacts and their roles; FAIL if the artifact list or template sources drift.
### Failure Triage
Check both YAML variants, verify the JSONL init step writes a config record, and confirm the assets live under `assets/`.
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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Initialization lifecycle; use `ANCHOR:phase-initialization` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Autonomous init steps; inspect `phase_init` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Interactive init steps; inspect `phase_init` |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Config template |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Strategy template |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DR-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
