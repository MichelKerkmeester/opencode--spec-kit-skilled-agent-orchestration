---
title: "DRV-018 -- Review quality guards block premature stop"
description: "Verify that 3 binary gates (evidence, scope, coverage) must all pass before the review loop can issue STOP."
---

# DRV-018 -- Review quality guards block premature stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-018`.

---

## 1. OVERVIEW

This scenario validates review quality guards block premature stop for `DRV-018`. The objective is to verify that 3 binary gates (evidence, scope, coverage) must all pass before the review loop can transition to synthesis.

### WHY THIS MATTERS

Quality guards are the review-specific safety net that prevents the loop from stopping when convergence signals look good but the review output is incomplete or unreliable. Unlike research mode, review mode enforces evidence completeness on every finding, scope containment against the declared review target, and coverage of all configured dimensions including traceability protocols.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify 3 binary gates (evidence, scope, coverage) must all pass before STOP.
- Real user request: Can the review stop even if some findings lack file evidence or a dimension was never examined?
- Prompt: `As a manual-testing orchestrator, validate the quality guard contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify 3 binary gates are enforced before STOP: (1) Evidence gate -- every active finding has file:line evidence and is not inference-only, (2) Scope gate -- findings and reviewed files stay within declared review scope, (3) Coverage gate -- configured dimensions plus required traceability protocols are covered. Verify these gates are distinct from research mode guards. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the convergence reference for quality guard definitions, then the review YAML workflow for gate enforcement, then the quick reference and SKILL.md for user-facing guard documentation.
- Desired user-facing outcome: The user is told that even if the convergence score reaches the threshold, the review will not stop until all three quality gates pass, and is given a plain explanation of each gate.
- Expected signals: Three named binary gates (evidence, scope, coverage), each must return true, enforcement happens after convergence check but before STOP transition, and gates are review-specific.
- Pass/fail posture: PASS if all three gates are enforced before STOP and documented as review-specific; FAIL if any gate can be bypassed or is missing from the enforcement path.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-018 | Review quality guards block premature stop | Verify 3 binary gates (evidence, scope, coverage) must all pass before STOP. | As a manual-testing orchestrator, validate the quality guard contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify 3 binary gates are enforced before STOP: (1) Evidence gate -- every active finding has file:line evidence and is not inference-only, (2) Scope gate -- findings and reviewed files stay within declared review scope, (3) Coverage gate -- configured dimensions plus required traceability protocols are covered. Verify these gates are distinct from research mode guards. Return a concise operator-facing verdict. | 1. `bash: rg -n 'quality.guard|binary.gate|evidence.*gate|scope.*gate|coverage.*gate|QUALITY_GUARD|gate.*pass' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'quality_guard|binary_gate|evidence_gate|scope_gate|coverage_gate|guard.*check|gate.*pass' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Quality Guard|Evidence|Scope|Coverage|binary gate|gate.*pass|inference.only' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | Three named binary gates (evidence, scope, coverage), each must return true, enforcement happens after convergence check but before STOP, and gates are review-specific. | Capture the gate definitions from convergence.md, the YAML enforcement path, and the user-facing documentation of each gate. | PASS if all three gates are enforced before STOP and documented as review-specific; FAIL if any gate can be bypassed or is missing from the enforcement path. | Privilege the convergence reference for gate definitions and the YAML workflow for enforcement ordering; use quick reference for user-facing confirmation. |

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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use Section 10.4 for review-specific gates |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect quality guard enforcement in convergence step |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect quality guard enforcement in convergence step |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Quality guard summary; use `ANCHOR:quality-guards` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Quality guard rules; use `ANCHOR:rules` Rule 12 |
| `.opencode/skill/sk-deep-review/README.md` | Feature summary for quality guards |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
