---
title: "DR-031 -- Graph convergence signals as STOP-blocking guards"
description: "Verify that graph convergence signals (sourceDiversity, evidenceDepth) act as STOP-blocking guards that must pass before the deep-research loop can terminate."
---

# DR-031 -- Graph convergence signals as STOP-blocking guards

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-031`.

---

## 1. OVERVIEW

This scenario validates that the graph convergence signals (sourceDiversity and evidenceDepth) function as STOP-blocking guards for `DR-031`. The objective is to verify that even when the Phase 1 compositeStop score reaches the convergence threshold, the loop cannot terminate if source diversity is below 0.4 or average evidence depth is below 1.5.

### WHY THIS MATTERS

Without structural guards, a research loop could converge prematurely when findings come from a single source or lack corroborating evidence chains. The graph convergence layer adds two mandatory pass/fail gates that prevent this: sourceDiversity (ratio of unique source nodes to total nodes, threshold 0.4) and evidenceDepth (average evidence chain depth, threshold 1.5). These gates block the STOP signal regardless of how high the Phase 1 composite score is.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that sourceDiversity and evidenceDepth act as STOP-blocking guards in the convergence algorithm.
- Real user request: Can the research stop early if all its findings come from the same source? What prevents shallow evidence chains from passing convergence?
- Orchestrator prompt: Validate the graph convergence STOP-blocking guard contract for sk-deep-research. Confirm that coverage-graph-convergence.cjs defines SOURCE_DIVERSITY_THRESHOLD (0.4) and EVIDENCE_DEPTH_THRESHOLD (1.5) as mandatory pass/fail gates, that computeGraphConvergence blends these with Phase 1 compositeStop, and that the convergence reference documents these as STOP-blocking guards, then return a concise operator-facing verdict.
- Expected execution process: Inspect coverage-graph-convergence.cjs for threshold constants and guard logic, then the convergence reference for documentation, then the YAML workflow for enforcement.
- Desired user-facing outcome: The user understands that the research loop has two structural safety guards (source diversity and evidence depth) that independently block convergence even when other signals say "stop".
- Expected signals: SOURCE_DIVERSITY_THRESHOLD = 0.4; EVIDENCE_DEPTH_THRESHOLD = 1.5; computeSourceDiversity returns ratio in [0.0, 1.0]; computeEvidenceDepth returns average chain depth; both are checked before STOP is allowed.
- Pass/fail posture: PASS if both thresholds are defined, enforced in the convergence computation, and documented as STOP-blocking guards; FAIL if either threshold is missing, not enforced, or not documented.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-031 | Graph convergence STOP-blocking guards | Verify sourceDiversity and evidenceDepth act as STOP-blocking guards. | Validate the graph convergence STOP-blocking guard contract for sk-deep-research. Confirm that SOURCE_DIVERSITY_THRESHOLD (0.4) and EVIDENCE_DEPTH_THRESHOLD (1.5) are defined and enforced as mandatory pass/fail gates in the convergence computation, then return a concise operator-facing verdict. | 1. `bash: rg -n 'SOURCE_DIVERSITY_THRESHOLD\|EVIDENCE_DEPTH_THRESHOLD\|STOP.block\|guard' .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` -> 2. `bash: rg -n 'sourceDiversity\|evidenceDepth\|STOP.block\|graph.guard' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: rg -n 'graph_convergence\|sourceDiversity\|evidenceDepth' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | SOURCE_DIVERSITY_THRESHOLD = 0.4; EVIDENCE_DEPTH_THRESHOLD = 1.5; both computed before STOP decision; documented as STOP-blocking guards. | Capture the threshold constants, the guard check logic in computeGraphConvergence, and the convergence reference documentation. | PASS if both thresholds are defined, enforced, and documented as STOP-blocking guards; FAIL if either is missing, not enforced, or only advisory. | Privilege coverage-graph-convergence.cjs for the authoritative implementation; use convergence.md for the documentation contract. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` | Canonical implementation; threshold constants, guard computation functions |
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs` | Signal computation primitives; computeAllDepths, computeClusterMetrics |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence reference; graph convergence guard documentation |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; graph convergence check in step_check_convergence |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-031
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/031-graph-convergence-signals.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-10.
