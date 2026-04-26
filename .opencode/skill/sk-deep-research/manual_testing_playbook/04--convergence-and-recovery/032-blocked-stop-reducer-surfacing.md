---
title: "DR-032 -- Research reducer surfaces blocked-stop history across registry, dashboard, and next-focus"
description: "Verify that blocked_stop events become reducer-owned blockedStopHistory, render in the dashboard, and rewrite the strategy next-focus anchor with recovery guidance."
---

# DR-032 -- Research reducer surfaces blocked-stop history across registry, dashboard, and next-focus

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-032`.

---

## 1. OVERVIEW

This scenario validates blocked-stop reducer surfacing for `DR-032`. The objective is to verify that a research packet with at least one `blocked_stop` event surfaces that event into reducer-owned `blockedStopHistory`, the `BLOCKED STOPS` dashboard section, and the strategy `next-focus` anchor.

### WHY THIS MATTERS

Blocked-stop events are only useful if operators can see them in all reducer-owned surfaces that drive recovery. If the reducer records the event but fails to surface it into the registry, dashboard, or strategy anchor, operators lose the recovery hint that explains why STOP was denied and what to do next.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Research reducer surfaces blocked-stop history across registry, dashboard, and next-focus.
- Given: A research packet with at least one `blocked_stop` event, using `.opencode/skill/sk-deep-research/scripts/tests/fixtures/interrupted-session/` once T048 lands or a hand-constructed minimal example that includes `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp`.
- When: The operator runs `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>`.
- Then: `findings-registry.json` exposes `blockedStopHistory` entries, `deep-research-dashboard.md` renders a `BLOCKED STOPS` section for each entry, and the `ANCHOR:next-focus` block in `deep-research-strategy.md` contains the blocked-stop recovery strategy.
- Real user request: If research STOP gets vetoed, where can I see that decision afterward and what guidance does the reducer surface so I know how to recover?
- Prompt: `As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> on a research packet with at least one blocked_stop event populates blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.`
- Expected execution process: Run the reducer first, then inspect the reducer-owned registry, dashboard, and strategy anchor in that order so the source-of-truth state is checked before the rendered summaries.
- Desired user-facing outcome: The user can see that blocked-stop state is persisted in three operator-facing surfaces and can explain which recovery hint the reducer chose.
- Expected signals: `blockedStopHistory` is non-empty; each entry exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp`; `BLOCKED STOPS` renders the same blocked-stop data; the strategy `next-focus` anchor includes the recovery hint from the latest blocked-stop event.
- Pass/fail posture: PASS if all three reducer-owned surfaces show the blocked-stop data and the recovery strategy is visible in the strategy anchor; FAIL if any surface is missing, stale, or inconsistent with the reducer-owned registry.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Run the reducer first so the playbook checks generated artifacts rather than stale state.
3. Capture evidence from the registry, dashboard, and strategy anchor in that order so another operator can replay the exact reducer surfacing chain.
4. Return a short user-facing explanation, not just raw implementation notes.

### Prompt
As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>` on a research packet with at least one `blocked_stop` event populates `blockedStopHistory`, renders `BLOCKED STOPS` in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy. Return a concise operator-facing verdict.

### Commands
1. `bash: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`
2. `bash: cat {spec_folder}/research/findings-registry.json | jq '.blockedStopHistory'`
3. `bash: grep -A 5 "BLOCKED STOPS" {spec_folder}/research/deep-research-dashboard.md`
4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/research/deep-research-strategy.md`

### Expected
`blockedStopHistory` contains reducer-promoted blocked-stop entries; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record.

### Evidence
Capture the populated `blockedStopHistory` array, the dashboard `BLOCKED STOPS` excerpt, and the strategy `next-focus` anchor showing the recovery guidance.

### Pass/Fail
PASS if all three surfaces show the same blocked-stop data and recovery hint; FAIL if any surface is missing the blocked-stop data or shows stale content after the reducer run.

### Failure Triage
Privilege `findings-registry.json` as the reducer-owned source of truth. If the registry is correct but the dashboard or strategy anchor is stale, treat that as reducer surfacing drift. If no canonical interrupted-session fixture exists yet, use a hand-constructed minimal packet and note the fixture gap in the operator verdict.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Research state contract; defines `blockedStopHistory`, dashboard `BLOCKED STOPS`, and reducer-driven strategy next-focus override |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-11.
