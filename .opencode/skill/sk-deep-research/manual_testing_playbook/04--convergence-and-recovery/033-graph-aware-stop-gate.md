---
title: "DR-033 -- Research graph-aware stop gate surfaces convergence verdict and workflow hooks"
description: "Verify that graph_convergence reducer fields render in registry and dashboard, and that the research auto workflow calls graph upsert plus convergence before the inline stop vote."
---

# DR-033 -- Research graph-aware stop gate surfaces convergence verdict and workflow hooks

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-033`.

---

## 1. OVERVIEW

This scenario validates graph-aware stop-gate surfacing for `DR-033`. The objective is to verify that `graph_convergence` events become reducer-owned `graphConvergenceScore`, `graphDecision`, and `graphBlockers`, that the dashboard renders those graph signals, and that the live auto workflow invokes the graph tools before the inline 3-signal vote.

### WHY THIS MATTERS

Graph-aware stop logic only protects the loop if two things stay true at the same time: the reducer must surface the graph decision into operator-facing artifacts, and the live workflow must actually call the graph tools before evaluating the inline STOP candidate. If either side drifts, operators can no longer trust the graph-aware stop gate.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Research graph-aware stop gate surfaces convergence verdict and workflow hooks.
- Given: A research packet with one or more `graph_convergence` events in its JSONL state.
- When: The operator runs the reducer and inspects the live auto workflow definition.
- Then: `findings-registry.json` exposes `graphConvergenceScore`, `graphDecision`, and `graphBlockers`; `deep-research-dashboard.md` renders a `GRAPH CONVERGENCE` section; and `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` calls `deep_loop_graph_upsert` and `deep_loop_graph_convergence` before the inline 3-signal vote.
- Real user request: How do I know the research reducer is surfacing graph convergence output and that the autonomous workflow actually consults the graph before it decides to stop?
- Orchestrator prompt: Validate graph-aware stop-gate integration for sk-deep-research. Confirm that `graph_convergence` reducer output populates `graphConvergenceScore`, `graphDecision`, and `graphBlockers`, that the dashboard renders `GRAPH CONVERGENCE`, and that the research auto workflow calls `deep_loop_graph_upsert` plus `deep_loop_graph_convergence` before the inline 3-signal vote, then return a concise operator-facing verdict.
- Expected execution process: Run the reducer first to refresh generated artifacts, inspect the reducer-owned registry and dashboard second, then inspect the workflow YAML to verify the live graph-tool call order.
- Desired user-facing outcome: The user gets a plain-language explanation that graph signals are visible in reducer outputs and that the autonomous workflow consults graph convergence before allowing inline STOP to become legal.
- Expected signals: `graphConvergenceScore`, `graphDecision`, and `graphBlockers` appear in the registry; `GRAPH CONVERGENCE` appears in the dashboard; YAML includes `deep_loop_graph_upsert` and `deep_loop_graph_convergence` before the inline 3-signal vote.
- Pass/fail posture: PASS if graph signals appear in the registry and dashboard and the YAML shows the graph-tool calls in the pre-inline-vote path; FAIL if graph data is missing from any reducer surface or the workflow no longer calls the graph tools before the inline vote.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Run the reducer first so generated artifacts are fresh before validating graph surfacing.
3. Inspect registry, dashboard, and workflow YAML in that order so reducer outputs are verified before orchestration wiring.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-033 | Research graph-aware stop gate surfaces convergence verdict and workflow hooks | Verify `graph_convergence` output appears in reducer artifacts and the auto workflow calls graph tools before the inline stop vote. | Validate graph-aware stop-gate integration for sk-deep-research. Confirm that `graph_convergence` reducer output populates `graphConvergenceScore`, `graphDecision`, and `graphBlockers`, that the dashboard renders `GRAPH CONVERGENCE`, and that the research auto workflow calls `deep_loop_graph_upsert` plus `deep_loop_graph_convergence` before the inline 3-signal vote, then return a concise operator-facing verdict. | 1. `bash: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}` -> 2. `bash: cat {spec_folder}/research/findings-registry.json | jq '.graphConvergenceScore, .graphDecision, .graphBlockers'` -> 3. `bash: grep -A 3 "GRAPH CONVERGENCE" {spec_folder}/research/deep-research-dashboard.md` -> 4. `bash: grep -n "deep_loop_graph_upsert\\|deep_loop_graph_convergence" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Registry surfaces `graphConvergenceScore`, `graphDecision`, and `graphBlockers`; dashboard renders `GRAPH CONVERGENCE`; workflow YAML calls both graph tools before the inline 3-signal vote. | Capture the registry graph fields, the dashboard `GRAPH CONVERGENCE` excerpt, and the YAML lines that show `deep_loop_graph_upsert` and `deep_loop_graph_convergence`. | PASS if graph signals appear in the registry and dashboard and the workflow YAML still calls the graph tools in the graph-aware stop path; FAIL if graph data is missing from any reducer surface or the YAML no longer shows the graph-tool hooks. | Privilege reducer-owned registry output for surfaced state and the workflow YAML for live orchestration order. If reducer fields exist but the YAML lacks graph-tool calls, treat that as graph-aware stop-gate wiring drift rather than a reducer regression. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Canonical reducer implementation; surfaces `graphConvergenceScore`, `graphDecision`, `graphBlockers`, and dashboard `GRAPH CONVERGENCE` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Research state contract; defines reducer-owned graph convergence fields and dashboard rendering expectations |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Live research auto workflow; invokes `deep_loop_graph_upsert` and `deep_loop_graph_convergence` before the inline 3-signal vote |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-033
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/033-graph-aware-stop-gate.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-11.
