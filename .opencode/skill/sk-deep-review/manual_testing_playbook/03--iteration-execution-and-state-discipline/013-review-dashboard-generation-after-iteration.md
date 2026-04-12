---
title: "DRV-013 -- Review dashboard generation after iteration"
description: "Verify that the review dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration."
---

# DRV-013 -- Review dashboard generation after iteration

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-013`.

---

## 1. OVERVIEW

This scenario validates review dashboard generation after iteration for `DRV-013`. The objective is to verify that the review dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated or refreshed after each iteration.

### WHY THIS MATTERS

The dashboard is the operator's primary status view during a multi-iteration review. Without a reliable dashboard, operators must manually parse JSONL records to understand progress, which defeats the purpose of the automated loop.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration.
- Real user request: Where do I look to see how the review is progressing? Is there a dashboard?
- Prompt: `As a manual-testing orchestrator, validate the dashboard generation contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_generate_dashboard runs after each iteration, reads from JSONL and strategy, and writes deep-review-dashboard.md with Findings Summary, Progress Table, Coverage, and Trend sections. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the YAML step_generate_dashboard for its position in the loop, then its read sources and output format, then the dashboard template in the assets for the expected sections.
- Desired user-facing outcome: The user is told that a dashboard file is auto-generated after each iteration showing current findings, progress, coverage, and trend at a glance.
- Expected signals: The step_generate_dashboard runs after step_validate_iteration; it reads JSONL and strategy; it writes to deep-review-dashboard.md; the output includes Findings Summary, Progress Table, Coverage, and Next Focus sections.
- Pass/fail posture: PASS if the dashboard step runs after each iteration and produces all expected sections; FAIL if the step is missing from the loop or the output template is incomplete.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the dashboard generation contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_generate_dashboard runs after each iteration, reads from JSONL and strategy, and writes deep-review-dashboard.md with Findings Summary, Progress Table, Coverage, and Trend sections. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n 'step_generate_dashboard|dashboard' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
2. `bash: sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
3. `bash: rg -n 'dashboard|deep-review-dashboard' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
### Expected
The step_generate_dashboard runs after validation; it reads JSONL and strategy; it writes deep-review-dashboard.md; the output includes Findings Summary, Progress Table, Coverage, and Next Focus sections.
### Evidence
Capture the dashboard step position in the loop, the output template format, and the state_paths dashboard entry.
### Pass/Fail
PASS if the dashboard step runs after each iteration and produces all expected sections; FAIL if the step is missing from the loop or the output template is incomplete.
### Failure Triage
Compare the dashboard template in assets/ with the YAML step_generate_dashboard format block to verify they agree on section structure.
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
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Dashboard generation step; inspect `step_generate_dashboard` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Dashboard generation step; inspect `step_generate_dashboard` |
| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Dashboard template |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | State files table; use `ANCHOR:state-files` |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-013
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
