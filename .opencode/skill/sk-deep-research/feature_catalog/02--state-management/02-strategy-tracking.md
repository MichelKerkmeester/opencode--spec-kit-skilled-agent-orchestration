---
title: "Strategy tracking"
description: "Keeps the strategy file, findings registry, and dashboard aligned with the latest deep-research iteration data."
---

# Strategy tracking

## 1. OVERVIEW

Keeps the strategy file, findings registry, and dashboard aligned with the latest deep-research iteration data.

Strategy tracking is the human-readable state layer for the packet. It turns raw iteration lines and event records into a current picture of answered questions, dead ends, next focus, and stop blockers.

---

## 2. CURRENT REALITY

`deep-research-strategy.md` has a split ownership model. Initialization fills the stable context sections, while the reducer rewrites the machine-owned anchors after each iteration. Those anchors include remaining questions, answered questions, worked and failed approaches, exhausted approaches, ruled-out directions, and next focus. If the latest event is `blocked_stop`, the reducer can override next focus directly from the recovery hint instead of repeating stale iteration advice.

This same reducer pass also refreshes `findings-registry.json` and `deep-research-dashboard.md`. The findings registry carries open and resolved questions, key findings, blocked-stop history, graph convergence status, lineage metadata, and convergence metrics. The dashboard re-renders those reducer outputs into an operator-facing summary, so the strategy file is not a lone state surface.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Asset | Defines the strategy anchors and machine-owned section boundaries. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Reference | Defines the update protocol for strategy, dashboard, and reducer-owned state. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Reducer | Rebuilds the findings registry, updates strategy anchors, and regenerates the dashboard. |
| `.opencode/agent/deep-research.md` | Agent | Defines how iteration files feed next-focus guidance and reducer-owned state refresh. |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Asset | Defines the dashboard sections the reducer fills from strategy and registry data. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-strategy-next-focus-and-exhausted-approach-discipline.md` | Manual playbook | Verifies next-focus selection and exhausted-approach handling. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md` | Manual playbook | Verifies blocked-stop history and recovery guidance appear in reducer-owned outputs. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Vitest | Verifies reducer output is idempotent and keeps strategy, registry, and dashboard aligned. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/02-strategy-tracking.md`
