---
title: "DRV-014 -- Severity classification in JSONL"
description: "Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record."
---

# DRV-014 -- Severity classification in JSONL

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-014`.

---

## 1. OVERVIEW

This scenario validates severity classification in JSONL for `DRV-014`. The objective is to verify that `findingsSummary` and `findingsNew` fields in JSONL include P0/P1/P2 counts for every iteration record.

### WHY THIS MATTERS

The convergence algorithm uses `newFindingsRatio` derived from severity-weighted findings (P0: 10.0, P1: 5.0, P2: 1.0). If the JSONL records do not include accurate P0/P1/P2 counts, convergence decisions are based on incorrect data. Additionally, any new P0 finding forces `newFindingsRatio >= 0.50`, blocking premature convergence.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record.
- Real user request: How does the review track the severity of findings across iterations? Are P0/P1/P2 counts stored somewhere machine-readable?
- Orchestrator prompt: Validate the severity classification JSONL contract for sk-deep-review. Confirm that Rule 11 mandates findingsSummary (cumulative) and findingsNew (this iteration) fields with P0/P1/P2 counts in every JSONL iteration record, that the YAML dispatch prompt constrains this, and that the convergence algorithm uses severity weights, then return a concise user-facing pass/fail verdict.
- Expected execution process: Inspect the SKILL.md rules for Rule 11, then the YAML dispatch constraints for the required JSONL fields, then the convergence algorithm for severity weight usage, then the state format reference for the JSONL schema.
- Desired user-facing outcome: The user is told that every iteration writes machine-readable P0/P1/P2 counts (cumulative and per-iteration) and that these drive the convergence decision.
- Expected signals: Rule 11 mandates the fields; the YAML dispatch prompt constrains them; the convergence algorithm references severity_weights with P0=10.0, P1=5.0, P2=1.0; the P0 override sets newFindingsRatio >= 0.50.
- Pass/fail posture: PASS if findingsSummary and findingsNew with P0/P1/P2 are mandated, constrained, and consumed by convergence; FAIL if either field is missing from the contract or not used in convergence.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-014 | Severity classification in JSONL | Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record. | Validate the severity classification JSONL contract for sk-deep-review. Confirm that `findingsSummary` (cumulative) and `findingsNew` (per-iteration) with P0/P1/P2 counts are mandated in every JSONL iteration record and consumed by the convergence algorithm, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'findingsSummary|findingsNew|Rule 11|severity counts' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'findingsSummary|findingsNew|severity_weights|p0_override|newFindingsRatio' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'findingsSummary|findingsNew|P0.*10|P1.*5|P2.*1|severity.*weight' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-research/references/state_format.md` | Rule 11 mandates the fields; the YAML dispatch constrains them; the convergence algorithm references severity_weights with P0=10.0, P1=5.0, P2=1.0; the P0 override sets newFindingsRatio >= 0.50. | Capture Rule 11, the dispatch JSONL constraint, the severity_weights block, and the P0 override rule. | PASS if findingsSummary and findingsNew with P0/P1/P2 are mandated, constrained, and consumed by convergence; FAIL if either field is missing from the contract or not used in convergence. | Check the on_missing_outputs fallback JSONL template to verify it also includes findingsSummary and findingsNew with zeroed P0/P1/P2 counts. |

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
| `.opencode/skill/sk-deep-review/SKILL.md` | Rule 11: severity counts mandate; use `ANCHOR:rules` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Dispatch constraints, severity_weights, and P0 override; inspect `step_dispatch_review_agent`, `severity_weights`, and `on_missing_outputs` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Dispatch constraints; inspect `step_dispatch_review_agent` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence signals; use `ANCHOR:convergence` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Shared JSONL schema; inspect iteration record fields |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-014
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
