---
title: "DR-040 -- Review verdict determines post-review workflow"
description: "Verify that FAIL / CONDITIONAL / PASS verdict is correct and next-command recommendation matches, with PASS carrying `hasAdvisories` when only P2 findings remain."
---

# DR-040 -- Review verdict determines post-review workflow

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-040`.

---

## 1. OVERVIEW

This scenario validates the review verdict and post-review workflow routing for `DR-040`. The objective is to verify that FAIL / CONDITIONAL / PASS verdict is correct and next-command recommendation matches, with PASS carrying `hasAdvisories` metadata when only P2 findings remain.

### WHY THIS MATTERS

The verdict is the decision point operators act on. If the verdict logic misclassifies findings — downgrading a P0-bearing review to CONDITIONAL instead of FAIL, or incorrectly preserving a separate PASS WITH NOTES state instead of PASS plus metadata — operators may ship with critical issues or follow the wrong workflow. The next-command recommendation must match the verdict so operators know exactly what to do next without manual interpretation.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that FAIL / CONDITIONAL / PASS verdict is correct and next-command recommendation matches, with PASS carrying `hasAdvisories` when only P2 findings remain.
- Real user request: After the review, what are the possible outcomes — and does it tell me what to do next?
- Orchestrator prompt: Validate review verdict logic for sk-deep-research. Confirm that `phase_synthesis` produces the correct verdict based on findings severity and binary gates (FAIL for active P0 or any failed binary gate, CONDITIONAL for active P1 without P0, PASS for no active P0/P1) and that PASS sets `hasAdvisories=true` when only P2 findings remain, with each verdict including the correct next-command recommendation per the review YAML and quick reference.
- Expected execution process: Inspect the review YAML `phase_synthesis` for verdict determination logic, then the quick reference for the verdict-to-next-command mapping, then verify all three verdict levels are defined with PASS metadata behavior.
- Desired user-facing outcome: The user sees a clear verdict with an actionable next step — no ambiguity about what to do after the review.
- Expected signals: Three verdict levels are defined with correct severity and gate thresholds, PASS includes `hasAdvisories` metadata behavior for P2-only outcomes, each verdict maps to a specific next command, and the YAML and quick reference agree.
- Pass/fail posture: PASS if all three verdict levels are correctly defined with matching next-command recommendations and PASS metadata behavior; FAIL if any verdict level is missing, thresholds are wrong, or next-command is absent.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-040 | Review verdict determines post-review workflow | Verify that FAIL / CONDITIONAL / PASS verdict is correct and next-command recommendation matches, with PASS carrying `hasAdvisories` when only P2 remain. | Validate review verdict logic. Confirm `phase_synthesis` produces the correct verdict from findings severity and binary gates, and that each verdict includes the right next command per the review YAML and quick reference. | 1. `bash: rg -n 'verdict|FAIL|CONDITIONAL|PASS|hasAdvisories|P0|P1|P2|gate|next.command' .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` -> 2. `bash: rg -n 'verdict|FAIL|CONDITIONAL|PASS|hasAdvisories|Next Command|P0|P1|P2' .opencode/skill/sk-deep-research/references/quick_reference.md` | Three verdict levels are defined with correct severity and gate thresholds, PASS includes `hasAdvisories` metadata for P2-only outcomes, each maps to the correct next command, and YAML and quick reference agree. | Capture verdict definitions from `phase_synthesis` and quick reference mapping and compare. | PASS if all three verdict levels are correctly defined with matching next-command recommendations and PASS metadata behavior; FAIL if any level is missing, thresholds are wrong, or next-command is absent. | Start with `phase_synthesis` for verdict determination, then verify quick reference maps each verdict to the right next command. |

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
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | Review workflow contract; inspect `phase_synthesis` for verdict determination logic |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Quick reference; use review section for verdict-to-next-command mapping |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-040
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--review-mode/040-review-verdict-determines-post-review-workflow.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
