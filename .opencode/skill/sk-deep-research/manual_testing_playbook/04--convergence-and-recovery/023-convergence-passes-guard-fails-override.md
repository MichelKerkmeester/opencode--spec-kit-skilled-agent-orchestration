---
title: "DR-023 -- Composite Convergence Passes but Guard Fails → CONTINUE"
description: "Verify the full override path: composite score >0.60 → STOP → guards check → guard fails → override to CONTINUE."
---

# DR-023 -- Composite Convergence Passes but Guard Fails → CONTINUE

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-023`.

---

## 1. OVERVIEW

This scenario validates the full convergence-to-guard override path for `DR-023`. The objective is to verify that when composite convergence scores above 0.60 and votes STOP, the quality guards are still evaluated, and if any guard fails, the STOP is overridden to CONTINUE.

### WHY THIS MATTERS

This is the integration test for the entire quality guard system. Composite convergence and quality guards are separate subsystems that interact at a critical decision point. If the override path is broken, the loop will stop prematurely on mathematically converged but qualitatively deficient research. This scenario validates that the safety net works end-to-end.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the full override path: composite score >0.60 triggers STOP, quality guards check fires, guard fails, decision overridden to CONTINUE.
- Real user request: Can the loop stop even though the math says it should, if the quality checks fail?
- Prompt: `As a manual-testing orchestrator, validate the convergence-guard override path for sk-deep-research. Trace the full sequence: composite convergence votes STOP (score >0.60), then checkQualityGuards runs, then a guard violation is detected, then the STOP is overridden to CONTINUE and the loop resumes against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify this flow exists in convergence.md Decision Priority step 4.5, the YAML algorithm, and loop_protocol.md Step 2c. Return a concise operator-facing PASS/FAIL verdict with the key evidence.`
- Expected execution process: Inspect the Decision Priority list in convergence.md first, then the YAML algorithm step_check_convergence (especially the step 6 guard override block), then loop_protocol.md Step 2c for the orchestrator-level flow, then state_format.md for the guard_violation event that proves the override happened.
- Desired user-facing outcome: The user gets a clear explanation that convergence math alone does not stop the loop — quality guards have veto power.
- Expected signals: convergence_check with decision STOP and score >0.60, followed by guard_violation event, followed by decision override to CONTINUE and loop resumption.
- Pass/fail posture: PASS if the full override path (composite STOP → guard check → guard fail → override to CONTINUE) is documented consistently across convergence.md Decision Priority step 4.5, auto.yaml step_check_convergence step 6, and loop_protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt

As a manual-testing orchestrator, validate the convergence-guard override path for sk-deep-research. Trace the full sequence: composite convergence votes STOP (score >0.60), then checkQualityGuards runs, then a guard violation is detected, then the STOP is overridden to CONTINUE and the loop resumes against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify this flow exists in convergence.md Decision Priority step 4.5, the YAML algorithm, and loop_protocol.md Step 2c. Return a concise operator-facing PASS/FAIL verdict with the key evidence.

### Commands

1. `bash: sed -n '165,175p' .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md`
3. `bash: sed -n '218,247p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
4. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md`
5. `bash: rg -n 'guard_violation' .opencode/skill/sk-deep-research/references/state_format.md`

### Expected

convergence_check with decision STOP and score >0.60, followed by guard_violation event, followed by decision override to CONTINUE and loop resumption.

### Evidence

Capture the Decision Priority list showing step 4.5, the checkQualityGuards pseudocode, the YAML step 6 override block (guardResult = checkQualityGuards; if not passed, decision = CONTINUE), the loop_protocol Step 2c flow, and the guard_violation event schema.

### Pass/Fail

PASS if the full override path (composite STOP → guard check → guard fail → override to CONTINUE) is documented consistently across convergence.md Decision Priority step 4.5, auto.yaml step_check_convergence step 6, and loop_protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.

### Failure Triage

Trace the path from convergence.md Decision Priority (canonical order) through auto.yaml (runtime implementation) to loop_protocol.md (orchestrator instructions). Discrepancies in the override direction or guard evaluation order are critical failures.

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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math and quality guard definitions; use Decision Priority (step 4.5) and §2.4 Quality Guard Protocol |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check for the override flow |
| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition to confirm override logging |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` step 6 for the guardResult override block |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-023
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
