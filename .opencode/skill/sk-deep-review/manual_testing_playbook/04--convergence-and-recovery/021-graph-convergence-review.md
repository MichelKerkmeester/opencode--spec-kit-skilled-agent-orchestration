---
title: "DRV-021 -- Graph convergence for review (dimensionCoverage, findingStability)"
description: "Verify that graph convergence signals for review mode use dimensionCoverage and findingStability to prevent premature convergence when dimensions are uncovered or findings are still changing."
---

# DRV-021 -- Graph convergence for review (dimensionCoverage, findingStability)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-021`.

---

## 1. OVERVIEW

This scenario validates the graph convergence signals specific to review mode for `DRV-021`. The objective is to verify that the review convergence algorithm uses graph-structural signals (dimensionCoverage across all 4 review dimensions, findingStability reflecting P0/P1/P2 changes between iterations) alongside the Phase 1 composite stop score, and that these signals act as guards preventing premature convergence.

### WHY THIS MATTERS

A code review loop could stop after only examining Correctness and Security, missing Traceability and Maintainability entirely. The graph convergence layer adds structural awareness: dimensionCoverage requires all 4 dimensions to have been explored in the coverage graph, and findingStability requires that findings have stabilized (no new P0 findings in recent iterations). Without these guards, the review could produce an incomplete release readiness verdict.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify graph convergence signals (dimensionCoverage, findingStability) prevent premature review convergence.
- Real user request: How does the review know it has covered all four dimensions? Can it stop before examining Maintainability?
- Orchestrator prompt: Validate the review graph convergence contract for sk-deep-review. Confirm that the coverage graph tracks nodes by review dimension, that dimensionCoverage requires all 4 dimensions (Correctness, Security, Traceability, Maintainability) to have graph nodes, that findingStability reflects P0/P1/P2 delta trends, and that these signals integrate with the Phase 1 composite stop score, then return a concise operator-facing verdict.
- Expected execution process: Inspect coverage-graph-convergence.cjs for review-specific convergence computation, then convergence.md for documentation, then the review YAML for enforcement, then the review strategy template for dimension tracking.
- Desired user-facing outcome: The user understands that the review loop tracks which dimensions have been explored through the coverage graph, and that convergence requires all 4 dimensions to be covered with stable findings.
- Expected signals: Graph nodes tagged by dimension; dimensionCoverage requires 4/4 dimensions in graph; findingStability checks P0/P1/P2 deltas; both integrate with compositeStop blending.
- Pass/fail posture: PASS if dimensionCoverage and findingStability are defined, enforced, and integrated with compositeStop; FAIL if either signal is missing or the review can converge without full dimension coverage.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-021 | Graph convergence for review | Verify dimensionCoverage and findingStability prevent premature review convergence. | Validate the review graph convergence contract for sk-deep-review. Confirm that dimensionCoverage requires all 4 dimensions in the coverage graph and findingStability checks P0/P1/P2 deltas, then return a concise operator-facing verdict. | 1. `bash: rg -n 'dimensionCoverage\|dimension_coverage\|findingStability\|finding_stability\|review.*convergence' .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` -> 2. `bash: rg -n 'dimensionCoverage\|findingStability\|graph.*convergence\|STOP.block' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: rg -n 'graph.*convergence\|coverage.*graph\|dimensionCoverage' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 4. `bash: rg -n 'COVERS\|EVIDENCE_FOR\|IN_DIMENSION\|dimension' .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | Graph nodes tagged by dimension (IN_DIMENSION edges); dimensionCoverage requires 4/4; findingStability checks severity deltas; both blend with compositeStop. | Capture dimension tracking mechanism, coverage requirement, stability computation, and blending formula. | PASS if dimensionCoverage and findingStability are defined and enforced; FAIL if review can converge without full dimension coverage or unstable findings. | Check whether dimensionCoverage is graph-structural or document-structural; if graph-only, verify IN_DIMENSION edges are emitted by the review agent. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` | Graph convergence computation; review-specific signal integration |
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | TS DB layer; VALID_RELATIONS.review includes IN_DIMENSION, EVIDENCE_FOR |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Shared convergence reference; graph guard documentation |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; graph convergence check in step_check_convergence |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Strategy template; dimension tracking in "Covered" list |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DRV-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/021-graph-convergence-review.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-04-10.
