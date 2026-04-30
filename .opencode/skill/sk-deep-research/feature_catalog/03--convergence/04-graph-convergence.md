---
title: "Graph convergence"
description: "Adds coverage-graph evidence and blockers to the deep-research legal-stop path when graph events exist."
---

# Graph convergence

## 1. OVERVIEW

Adds coverage-graph evidence and blockers to the deep-research legal-stop path when graph events exist.

Graph convergence extends the default stop logic with structural evidence from coverage-graph nodes and edges. It lets the loop ask not only whether novelty is low, but also whether the question graph looks connected enough to stop.

---

## 2. CURRENT REALITY

When iteration records carry `graphEvents`, the workflow calls the deep-loop graph convergence tool and writes a `graph_convergence` event into the JSONL log. The live graph signals include component count, isolated nodes, edge density, and answer coverage. Those signals become part of the legal-stop evaluation instead of living only in notes.

The reducer consumes the newest `graph_convergence` event and surfaces its verdict in the synchronized packet outputs. `findings-registry.json` stores graph score, decision, and blockers, and `deep-research-dashboard.md` renders those values for operators. If no graph events are present, the workflow omits graph checks and the reducer defaults those fields without breaking ordinary convergence.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Reference | Defines the graph-aware convergence model and graph-specific stop support signals. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Calls the graph convergence tool and appends `graph_convergence` events in autonomous mode. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Mirrors the same graph convergence call path in confirm mode. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Reducer | Reads the latest graph event and exposes graph score, decision, and blockers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts` | MCP handler | Produces the graph convergence verdict that the workflow records and the reducer consumes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` | Vitest | Verifies graph convergence events reach the reducer and dashboard correctly. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/031-graph-convergence-signals.md` | Manual playbook | Verifies graph convergence signals are derived and exposed correctly. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/033-graph-aware-stop-gate.md` | Manual playbook | Verifies graph-aware stop gates can block or allow synthesis. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--convergence/04-graph-convergence.md`
