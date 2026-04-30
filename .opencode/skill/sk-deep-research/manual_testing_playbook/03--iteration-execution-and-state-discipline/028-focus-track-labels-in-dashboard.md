---
title: "DR-028 -- Focus track labels in dashboard"
description: "Verify optional focusTrack labels appear in JSONL and dashboard iteration table."
---

# DR-028 -- Focus track labels in dashboard

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-028`.

---

## 1. OVERVIEW

This scenario validates focus track label propagation for `DR-028`. The objective is to verify that optional focusTrack labels appear in JSONL iteration records and surface correctly in the dashboard Progress table.

### WHY THIS MATTERS

Focus track labels let operators group iterations by research direction, making it possible to evaluate which topic threads were most productive across a long-running deep-research session.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify optional focusTrack labels appear in JSONL and dashboard iteration table.
- Real user request: Can I group iterations by topic to see which research direction was most productive?
- RCAF Prompt: `As a manual-testing orchestrator, validate the focusTrack label contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL state format defines focusTrack as an optional field on iteration records, and that the dashboard Progress table surfaces a Track column. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the state format reference for the focusTrack field definition, then check the dashboard asset for the Progress table schema including the Track column.
- Desired user-visible outcome: The user understands that focusTrack is an optional post-hoc grouping label that flows from JSONL records into the dashboard Progress table for analysis.
- Expected signals: JSONL iteration records with an optional focusTrack field, dashboard Progress table with a Track column.
- Pass/fail posture: PASS if focusTrack is defined in state_format.md as optional on iteration records AND the dashboard Progress table includes a Track column; FAIL if the field is missing from either location or the two definitions contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the focusTrack label contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify the JSONL state format defines focusTrack as an optional field on iteration records, and that the dashboard Progress table surfaces a Track column. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'focusTrack' .opencode/skill/sk-deep-research/references/state_format.md`
2. `bash: rg -n 'Track\|focusTrack' .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
3. `bash: rg -n 'focusTrack' .opencode/skill/sk-deep-research/README.md`
### Expected
JSONL iteration records with an optional focusTrack field, dashboard Progress table with a Track column.
### Evidence
Capture the state_format.md focusTrack field definition, the dashboard Progress table header row, and any README mention of focus track grouping.
### Pass/Fail
PASS if focusTrack is defined in state_format.md as optional on iteration records AND the dashboard Progress table includes a Track column; FAIL if the field is missing from either location or the two definitions contradict.
### Failure Triage
Privilege state_format.md as the canonical schema; use the dashboard asset and README only as secondary confirmation of propagation.
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
| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical JSONL schema; focusTrack field definition on iteration records |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Dashboard template; Progress table with Track column |
| `.opencode/skill/sk-deep-research/README.md` | Feature summary; focusTrack mention under observability or iteration fields |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
