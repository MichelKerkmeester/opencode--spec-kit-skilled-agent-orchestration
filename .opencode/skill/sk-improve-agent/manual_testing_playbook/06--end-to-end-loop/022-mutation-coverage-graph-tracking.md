---
title: "Mutation Coverage Graph Tracking"
feature_id: "E2E-022"
category: "End-to-End Loop"
---

# Mutation Coverage Graph Tracking

Validates that the improvement loop maintains a mutation coverage graph with `loop_type: "improvement"` namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that the improvement loop maintains a mutation coverage graph with loop_type: "improvement" namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```text
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder=specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --iterations=3
```

## Expected

- Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs)
- Graph nodes include dimension nodes (structural, ruleCoherence, integration, outputQuality, systemFitness)
- Graph edges track which mutations target which dimensions (COVERS, DERIVED_FROM)
- Exhausted mutation types are recorded and not re-attempted
- Journal events reference graph node/edge IDs for traceability
- Dashboard reflects mutation coverage state per dimension

## Pass Criteria

Mutation coverage graph is created in the improvement namespace, tracks explored dimensions and mutation types, and is isolated from research/review namespaces -- verified by inspecting the graph state file and confirming it contains improvement-specific nodes and edges with no cross-contamination.

## Failure Triage

- If no graph file is created: verify that mutation-coverage.cjs is invoked by the orchestrator and writes to the configured path
- If namespace is wrong: check that the `loop_type: "improvement"` parameter is passed to graph creation functions
- If graph contains research/review nodes: check namespace isolation in the graph writer (likely a bug where the namespace filter is missing)
- If exhausted mutations are re-tried: verify the exhausted-mutations set is loaded from the graph before each iteration's mutation proposal

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output showing graph namespace and node/edge types]
```
