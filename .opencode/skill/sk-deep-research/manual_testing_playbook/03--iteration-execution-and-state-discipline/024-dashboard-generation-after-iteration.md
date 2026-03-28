---
title: "DR-024 -- Dashboard generation after iteration"
description: "Verify dashboard.md is auto-generated after iteration evaluation with correct content."
---

# DR-024 -- Dashboard generation after iteration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-024`.

---

## 1. OVERVIEW

This scenario validates dashboard generation after iteration evaluation for `DR-024`. The objective is to verify that `research/deep-research-dashboard.md` is auto-generated after each iteration with the correct content sections.

### WHY THIS MATTERS

The dashboard is the primary observability surface for long-running research sessions. If it is missing, stale, or incomplete, operators and users lose visibility into progress, convergence trends, and dead ends.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify dashboard.md is auto-generated after iteration evaluation with correct content.
- Real user request: After an iteration completes, can I see a summary of where the research stands?
- Orchestrator prompt: Validate the dashboard generation contract for sk-deep-research. Confirm the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict.
- Expected execution process: Inspect the loop protocol for Step 4a, then the state format dashboard section, then the dashboard template asset, then the YAML workflow step.
- Desired user-facing outcome: The user can open `research/deep-research-dashboard.md` after any iteration and see an up-to-date summary of the research session.
- Expected signals: `research/deep-research-dashboard.md` exists after at least one iteration completes, contains an iteration table, question status with X/Y answered, trend with last 3 newInfoRatio values, dead ends consolidated from ruledOut data, next focus from strategy.md, and active risks.
- Pass/fail posture: PASS if the dashboard file exists after iteration evaluation, contains all required sections, and is regenerated (not appended) each iteration; FAIL if the file is missing, sections are absent, or stale data persists from a prior iteration.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-024 | Dashboard generation after iteration | Verify dashboard.md is auto-generated after iteration evaluation with correct content. | Validate the dashboard generation contract for sk-deep-research. Confirm the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Step 4a\|Generate Dashboard\|dashboard_generated' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: sed -n '/ANCHOR:dashboard/,/\/ANCHOR:dashboard/p' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: cat .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` -> 4. `bash: rg -n 'step_generate_dashboard' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | `research/deep-research-dashboard.md` exists after iteration evaluation; contains iteration table, question status (X/Y answered), trend (last 3 ratios with direction), dead ends (from ruledOut), next focus (from strategy.md), and active risks; file is overwritten (not appended) each iteration; dashboard generation is non-blocking. | Capture the loop protocol Step 4a excerpt, the state format dashboard section, the template content, and the YAML step definition. | PASS if the dashboard file exists after iteration evaluation, contains all required sections, and is regenerated (not appended) each iteration; FAIL if the file is missing, sections are absent, or stale data persists from a prior iteration. | Privilege the loop protocol Step 4a for the generation contract and the state format dashboard section for content requirements; use the template asset as the structural reference. |

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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop protocol; inspect Step 4a (Generate Dashboard) under `ANCHOR:phase-iteration-loop` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | State format; inspect `ANCHOR:dashboard` for content sections, lifecycle, and file protection rules |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Dashboard template; structural reference for all required sections (Status, Progress, Questions, Trend, Dead Ends, Next Focus, Active Risks) |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_generate_dashboard` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow algorithm; inspect `step_generate_dashboard` |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-024
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
