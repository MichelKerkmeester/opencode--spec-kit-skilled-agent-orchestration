---
title: "DRV-017 -- P0 override blocks convergence"
description: "Verify that a new P0 finding sets newFindingsRatio >= 0.50, blocking convergence regardless of other signals."
---

# DRV-017 -- P0 override blocks convergence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-017`.

---

## 1. OVERVIEW

This scenario validates P0 override blocks convergence for `DRV-017`. The objective is to verify that any new P0 finding sets `newFindingsRatio >= 0.50`, which is high enough to block the composite convergence score from reaching the 0.60 stop threshold.

### WHY THIS MATTERS

P0 findings represent correctness failures, security vulnerabilities, or spec contradictions that must never be papered over by a premature convergence decision. This override is review-specific behavior not present in research mode, reflecting the higher consequences of shipping code with critical defects.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify new P0 finding sets newFindingsRatio >= 0.50, blocking convergence.
- Real user request: If the review finds a critical bug late in the loop, will it still stop early and miss it?
- Prompt: `As a manual-testing orchestrator, validate the P0 override contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify any new P0 finding forces newFindingsRatio >= 0.50, that this value is high enough to prevent the composite stop score from reaching the 0.60 threshold, and that this behavior is documented as review-specific. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the convergence reference for the P0 override rule, then the review YAML algorithm for enforcement, then the quick reference and SKILL.md for user-facing documentation of the override.
- Desired user-facing outcome: The user is told that a critical finding will always force the review to continue for at least one more iteration, preventing premature stop.
- Expected signals: P0 finding sets `newFindingsRatio >= 0.50`, this blocks the rolling average signal from contributing to convergence, the composite score cannot reach 0.60, and review continues.
- Pass/fail posture: PASS if the P0 override is enforced and documented as blocking convergence; FAIL if convergence can trigger despite an active new P0 finding.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the P0 override contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify any new P0 finding forces newFindingsRatio >= 0.50, that this value is high enough to prevent the composite stop score from reaching the 0.60 threshold, and that this behavior is documented as review-specific. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'P0.*override|P0.*block|P0.*convergence|newFindingsRatio.*0\.50|severity.*override|P0.*ratio' .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: rg -n 'P0|severity_override|newFindingsRatio|p0_override|p0_block' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'P0 override|P0.*block.*convergence|newFindingsRatio.*0\.50|severity.*override' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md`
### Expected
P0 finding sets `newFindingsRatio >= 0.50`, this blocks the rolling average signal, the composite score cannot reach 0.60, and the review continues.
### Evidence
Capture the P0 override rule from convergence.md, the YAML enforcement, and user-facing documentation of the override behavior.
### Pass/Fail
PASS if the P0 override is enforced and documented as blocking convergence; FAIL if convergence can trigger despite an active new P0 finding.
### Failure Triage
Privilege the convergence reference for the exact P0 override rule and verify it is mirrored in both YAML workflows and user-facing docs.
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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; P0 override rule in severity-weighted section |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect P0 override in `step_check_convergence` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect P0 override in `step_check_convergence` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | P0 override note; use `ANCHOR:convergence` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Severity classification and P0 blocking rules; use `ANCHOR:how-it-works` and `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/README.md` | Feature summary for P0 override behavior |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/017-p0-override-blocks-convergence.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
