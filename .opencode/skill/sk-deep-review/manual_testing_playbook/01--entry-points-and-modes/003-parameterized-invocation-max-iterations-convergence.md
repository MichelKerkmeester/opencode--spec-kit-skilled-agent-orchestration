---
title: "DRV-003 -- Parameterized invocation max-iterations and convergence"
description: "Verify that --max-iterations (default 7) and --convergence (default 0.10) parameters are documented and flow through to the review config."
---

# DRV-003 -- Parameterized invocation max-iterations and convergence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-003`.

---

## 1. OVERVIEW

This scenario validates parameterized invocation for `DRV-003`. The objective is to verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters are documented consistently and flow through to the review config.

### WHY THIS MATTERS

Operators tuning review depth need confidence that parameter defaults are consistent across the docs, command entrypoint, and YAML workflows, and that custom values actually propagate into the config that governs the loop.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters work and are documented consistently.
- Real user request: I want to run a longer review with 10 iterations and tighter convergence. Show me the defaults and how to override them.
- Orchestrator prompt: Validate the parameter contract for sk-deep-review. Confirm that --max-iterations (default 7) and --convergence (default 0.10) are documented consistently across the quick reference, command entrypoint, and both YAML workflows, then return a concise user-facing pass/fail verdict.
- Expected execution process: Inspect the quick reference parameter table first, then the command entrypoint argument-hint, then both YAML user_inputs sections to verify defaults agree.
- Desired user-facing outcome: The user can be told the exact defaults and how to override them, with confidence that the values propagate into the review config.
- Expected signals: Default values of 7 and 0.10 appear consistently across all sources; the YAML writes these into `deep-review-config.json` during init.
- Pass/fail posture: PASS if all sources agree on defaults and the config init step propagates overrides; FAIL if defaults drift or the override path is broken.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-003 | Parameterized invocation max-iterations and convergence | Verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters are documented consistently and flow through to the review config. | Validate the parameter contract for sk-deep-review. Confirm that `--max-iterations` (default 7) and `--convergence` (default 0.10) appear consistently across the quick reference, command entrypoint, and both YAML workflows, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'max.iterations|convergence.*0\.10|convergence_threshold|maxIterations' .opencode/skill/sk-deep-review/references/quick_reference.md` -> 2. `bash: rg -n 'max.iterations|convergence|argument-hint' .opencode/command/spec_kit/deep-review.md` -> 3. `bash: rg -n 'max_iterations|convergence_threshold|maxIterations|convergenceThreshold' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Default values of 7 and 0.10 appear consistently across all sources; the YAML writes these into `deep-review-config.json` during init. | Capture the parameter table from the quick reference, the argument-hint line, and the YAML user_inputs and config-creation steps. | PASS if all sources agree on defaults and the config init step propagates overrides; FAIL if defaults drift or the override path is broken. | Cross-reference the quick reference parameter table with the YAML `step_create_config` to verify the values flow through. |

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
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Parameter defaults table; use `ANCHOR:commands` |
| `.opencode/command/spec_kit/deep-review.md` | Command argument-hint and setup phase |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Auto workflow user_inputs and config creation; inspect `user_inputs` and `step_create_config` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Confirm workflow user_inputs; inspect `user_inputs` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Skill-level parameter documentation; use `ANCHOR:how-it-works` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
