---
title: "E2E-022 -- Mutation Coverage Graph Tracking"
description: "Manual validation scenario for E2E-022: Mutation Coverage Graph Tracking."
feature_id: "E2E-022"
category: "End-to-End Loop"
---

# E2E-022 -- Mutation Coverage Graph Tracking

This document captures the canonical manual-testing contract for `E2E-022`.

---

## 1. OVERVIEW

This scenario validates that the improvement loop maintains a mutation coverage graph with `loop_type: "improvement"` namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Mutation Coverage Graph Tracking for the full improvement-loop and candidate-tracking scenarios.
- Real user request: `` Validate that the improvement loop maintains a mutation coverage graph with `loop_type: "improvement"` namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the improvement loop maintains a mutation coverage graph with loop_type: "improvement" namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the documented command sequence exactly as written; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs); Graph nodes include dimension nodes (structural, ruleCoherence, integration, outputQuality, systemFitness); Graph edges track which mutations target which dimensions (COVERS, DERIVED_FROM); Exhausted mutation types are recorded and not re-attempted; Journal events reference graph node/edge IDs for traceability; Dashboard reflects mutation coverage state per dimension
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Mutation coverage graph is created in the improvement namespace, tracks explored dimensions and mutation types, and is isolated from research/review namespaces -- verified by inspecting the graph state file and confirming it contains improvement-specific nodes and edges with no cross-contamination.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| E2E-022 | Mutation Coverage Graph Tracking | Validate Mutation Coverage Graph Tracking | `` As a manual-testing orchestrator, validate that the improvement loop maintains a mutation coverage graph with loop_type: "improvement" namespace, tracking explored dimensions, tried mutation types, and exhausted mutation sets across iterations against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | /improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder=specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --iterations=3 | Coverage graph created with `loop_type: "improvement"` namespace (isolated from research/review graphs); Graph nodes include dimension nodes (structural, ruleCoherence, integration, outputQuality, systemFitness); Graph edges track which mutations target which dimensions (COVERS, DERIVED_FROM); Exhausted mutation types are recorded and not re-attempted; Journal events reference graph node/edge IDs for traceability; Dashboard reflects mutation coverage state per dimension | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Mutation coverage graph is created in the improvement namespace, tracks explored dimensions and mutation types, and is isolated from research/review namespaces -- verified by inspecting the graph state file and confirming it contains improvement-specific nodes and edges with no cross-contamination. | If no graph file is created: verify that mutation-coverage.cjs is invoked by the orchestrator and writes to the configured path<br>If namespace is wrong: check that the `loop_type: &quot;improvement&quot;` parameter is passed to graph creation functions<br>If graph contains research/review nodes: check namespace isolation in the graph writer (likely a bug where the namespace filter is missing)<br>If exhausted mutations are re-tried: verify the exhausted-mutations set is loaded from the graph before each iteration&#x27;s mutation proposal |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output showing graph namespace and node/edge types]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `06--end-to-end-loop/022-mutation-coverage-graph-tracking.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: End-to-End Loop
- Playbook ID: E2E-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`
