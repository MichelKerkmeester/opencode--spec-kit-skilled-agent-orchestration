---
title: "DR-040 -- Review verdict determines post-review workflow"
description: "Verify that FAIL (P0 present) / CONDITIONAL (P1 only) / PASS WITH NOTES (P2 only) / PASS (clean) verdict is correct and next-command recommendation matches."
---

# DR-040 -- Review verdict determines post-review workflow

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-040`.

---

## 1. OVERVIEW

This scenario validates the review verdict and post-review workflow routing for `DR-040`. The objective is to verify that FAIL (P0 present) / CONDITIONAL (P1 only) / PASS WITH NOTES (P2 only) / PASS (clean) verdict is correct and next-command recommendation matches.

### WHY THIS MATTERS

The verdict is the decision point operators act on. If the verdict logic misclassifies findings — downgrading a P0-bearing review to CONDITIONAL instead of FAIL — operators may ship with critical issues. The next-command recommendation must match the verdict so operators know exactly what to do next without manual interpretation.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that FAIL (P0 present) / CONDITIONAL (P1 only) / PASS WITH NOTES (P2 only) / PASS (clean) verdict is correct and next-command recommendation matches.
- Real user request: After the review, what are the possible outcomes — and does it tell me what to do next?
- Orchestrator prompt: Validate review verdict logic for sk-deep-research. Confirm that `phase_synthesis` produces the correct verdict based on findings severity (FAIL for P0, CONDITIONAL for P1-only, PASS WITH NOTES for P2-only, PASS for clean) and that each verdict includes the correct next-command recommendation, per the review YAML and quick reference.
- Expected execution process: Inspect the review YAML `phase_synthesis` for verdict determination logic, then the quick reference for the verdict-to-next-command mapping, then verify all four verdict levels are defined.
- Desired user-facing outcome: The user sees a clear verdict with an actionable next step — no ambiguity about what to do after the review.
- Expected signals: Four verdict levels are defined with correct severity thresholds, each verdict maps to a specific next command, and the YAML and quick reference agree.
- Pass/fail posture: PASS if all four verdict levels are correctly defined with matching next-command recommendations; FAIL if any verdict level is missing, thresholds are wrong, or next-command is absent.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-040 | Review verdict determines post-review workflow | Verify that FAIL / CONDITIONAL / PASS WITH NOTES / PASS verdict is correct and next-command recommendation matches. | Validate review verdict logic. Confirm `phase_synthesis` produces correct verdict from findings severity and each verdict includes next-command, per the review YAML and quick reference. | 1. `bash: rg -n 'verdict|FAIL|CONDITIONAL|PASS WITH NOTES|PASS|next.command|P0|P1|P2' .opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` -> 2. `bash: rg -n 'verdict|FAIL|CONDITIONAL|PASS|next.command|review' .opencode/skill/sk-deep-research/references/quick_reference.md` | Four verdict levels defined with correct severity thresholds, each maps to next command, YAML and quick reference agree. | Capture verdict definitions from `phase_synthesis` and quick reference mapping and compare. | PASS if all four verdict levels correctly defined with matching next-command; FAIL if any level missing, thresholds wrong, or next-command absent. | Start with `phase_synthesis` for verdict determination, then verify quick reference maps each verdict to the right next command. |

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
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `phase_synthesis` for verdict determination logic |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Quick reference; use review section for verdict-to-next-command mapping |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-040
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--review-mode/040-review-verdict-determines-post-review-workflow.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
