---
title: "DRV-022 -- Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus"
description: "Verify that blocked_stop events preserve the review gate bundle in blockedStopHistory, render in the dashboard, and rewrite the strategy next-focus anchor with recovery guidance."
---

# DRV-022 -- Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-022`.

---

## 1. OVERVIEW

This scenario validates blocked-stop reducer surfacing for `DRV-022`. The objective is to verify that a review packet with at least one `blocked_stop` event preserves the review-specific legal-stop bundle in `blockedStopHistory`, renders that blocked-stop evidence in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy.

### WHY THIS MATTERS

Review blocked-stop events are the operator-facing explanation for why convergence could not legally stop. If the reducer does not surface `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate` across the registry, dashboard, and strategy anchor, the operator loses both the veto reason and the next action.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Review reducer surfaces blocked-stop history across registry, dashboard, and next-focus.
- Given: A review packet with at least one `blocked_stop` event whose `blockedBy` and `gateResults` use the review-specific legal-stop names `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`.
- When: The operator runs `node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>`.
- Then: `deep-review-findings-registry.json` exposes `blockedStopHistory` entries that preserve the review gate names, `deep-review-dashboard.md` renders `BLOCKED STOPS`, and the `ANCHOR:next-focus` block in `deep-review-strategy.md` contains the blocked-stop recovery strategy.
- Real user request: If review convergence gets blocked, where do I see which review gate failed and what next-focus guidance the reducer surfaced for recovery?
- Prompt: `As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> on a review packet with at least one blocked_stop event preserves the review gate bundle in blockedStopHistory, renders BLOCKED STOPS in the dashboard, and rewrites the strategy next-focus anchor with the recovery strategy. Return a concise operator-facing verdict.`
- Expected execution process: Run the reducer first, then inspect the reducer-owned registry, dashboard, and strategy anchor so the operator can verify both the canonical JSON state and the rendered markdown surfaces.
- Desired user-facing outcome: The user can point to the exact review gate that blocked STOP and explain which recovery instruction the reducer surfaced next.
- Expected signals: `blockedStopHistory` is non-empty; review entries preserve `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`; `BLOCKED STOPS` renders the same blocked-stop data; the strategy `next-focus` anchor contains the blocked-stop recovery strategy.
- Pass/fail posture: PASS if all three reducer-owned review surfaces show the blocked-stop data and the review-specific gate names remain intact; FAIL if any surface is missing, stale, or drops the review gate bundle.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Run the reducer first so the playbook validates generated review artifacts rather than stale files.
3. Capture evidence from the registry, dashboard, and strategy anchor in that order so another operator can replay the reducer surfacing chain.
4. Return a short user-facing explanation, not just raw implementation notes.

### Prompt
As a manual-testing orchestrator, validate blocked-stop reducer surfacing for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify running node `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>` on a review packet with at least one `blocked_stop` event preserves the review gate bundle in `blockedStopHistory`, renders `BLOCKED STOPS` in the dashboard, and rewrites the strategy `next-focus` anchor with the recovery strategy. Return a concise operator-facing verdict.

### Commands
1. `bash: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs {spec_folder}`
2. `bash: cat {spec_folder}/review/deep-review-findings-registry.json | jq '.blockedStopHistory'`
3. `bash: grep -A 5 "BLOCKED STOPS" {spec_folder}/review/deep-review-dashboard.md`
4. `bash: sed -n '/ANCHOR:next-focus/,/\/ANCHOR:next-focus/p' {spec_folder}/review/deep-review-strategy.md`

### Expected
`blockedStopHistory` contains reducer-promoted blocked-stop entries with the review gate names; `BLOCKED STOPS` renders each blocked-stop event; `ANCHOR:next-focus` includes the recovery strategy from the latest blocked-stop record.

### Evidence
Capture the populated `blockedStopHistory` array, the dashboard `BLOCKED STOPS` excerpt, and the strategy `next-focus` anchor showing the recovery guidance.

### Pass/Fail
PASS if all three review surfaces show the same blocked-stop data and preserve the review gate names; FAIL if any surface is missing blocked-stop data or the gate bundle is incomplete after the reducer run.

### Failure Triage
Privilege `deep-review-findings-registry.json` as the reducer-owned source of truth. If the registry is correct but the dashboard or strategy anchor is stale, treat that as reducer surfacing drift rather than JSONL input failure.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Canonical reducer implementation; promotes `blocked_stop` into `blockedStopHistory`, renders `BLOCKED STOPS`, and rewrites `ANCHOR:next-focus` |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Review state contract; defines `blockedStopHistory`, dashboard `BLOCKED STOPS`, strategy next-focus override, and review-specific gate payload shape |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Review legal-stop workflow contract; defines the review-specific gate names used in `blocked_stop` events |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-04-11.
