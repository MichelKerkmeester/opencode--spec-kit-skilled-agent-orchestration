---
title: "DR-031 -- Graph convergence signals act as STOP-blocking guards"
description: "Verify that low sourceDiversity blocks a STOP vote and records blocked-stop evidence for deep research."
---

# DR-031 -- Graph convergence signals act as STOP-blocking guards

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-031`.

---

## 1. OVERVIEW

This scenario validates graph-aware stop blocking for `DR-031`. The objective is to verify that when deep research convergence math votes STOP but `sourceDiversity` remains below the `0.4` guard threshold, STOP is blocked and blocked-stop evidence is recorded.

### WHY THIS MATTERS

Novelty or coverage math can look complete before the evidence graph is structurally healthy. The graph-aware stop guards protect against shallow research by requiring diverse sources and sufficient evidence depth before a stop vote can become legal.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: Graph convergence signals act as STOP-blocking guards.
- Given: A deep research session with `sourceDiversity` below the `0.4` threshold.
- When: Convergence math votes STOP.
- Then: STOP is blocked because the `sourceDiversity` gate failed, and blocked-stop evidence is recorded.
- Real user request: If the research math says stop but the evidence still comes from too few sources, what actually prevents the loop from ending?
- Prompt: `As a manual-testing orchestrator, validate the graph stop-blocking guard contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify SOURCE_DIVERSITY_THRESHOLD = 0.4 blocks STOP when unmet, and that the research convergence reference records blocked-stop persistence with stopReason: "blockedStop" when legal-stop gates fail. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the graph convergence helper for the threshold and gate logic first, then the deep-research convergence reference for blocked-stop persistence and graph-aware legal-stop behavior.
- Desired user-facing outcome: The user gets a precise explanation that graph guards veto premature STOP decisions and that blocked-stop state is persisted for recovery.
- Expected signals: `SOURCE_DIVERSITY_THRESHOLD = 0.4`; `evaluateGraphGates()` fails `sourceDiversity` when below threshold; research convergence docs map failed legal-stop gates to `stopReason: "blockedStop"` and `blocked_stop` persistence.
- Pass/fail posture: PASS if the graph helper enforces the `sourceDiversity` threshold and the research convergence reference shows failed legal-stop gates persisting blocked-stop state; FAIL if STOP can still be finalized with low source diversity or blocked-stop persistence is undocumented.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level implementation helpers.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the graph stop-blocking guard contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify SOURCE_DIVERSITY_THRESHOLD = 0.4 blocks STOP when unmet, and that the research convergence reference records blocked-stop persistence with stopReason: "blockedStop" when legal-stop gates fail. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'SOURCE_DIVERSITY_THRESHOLD|evaluateGraphGates|sourceDiversityGate|allPass' .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`
2. `bash: rg -n 'blockedStop|blocked_stop|graph-aware convergence|graphEvents|sourceDiversity' .opencode/skill/sk-deep-research/references/convergence.md`
3. `bash: rg -n 'sourceDiversity|threshold: 0.4|blocking' .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts`
### Expected
`SOURCE_DIVERSITY_THRESHOLD = 0.4`; low `sourceDiversity` fails the guard; deep-research convergence persists blocked-stop state when legal-stop gates fail.
### Evidence
Capture the helper threshold definition, the `evaluateGraphGates()` pass/fail logic, the convergence reference blocked-stop persistence lines, and one test assertion showing the `0.4` threshold.
### Pass/Fail
PASS if low `sourceDiversity` fails the graph stop gate and blocked-stop persistence is documented for failed legal-stop evaluation; FAIL if either the threshold enforcement or blocked-stop persistence is missing or contradictory.
### Failure Triage
Privilege `coverage-graph-convergence.cjs` for the enforcement contract and `references/convergence.md` for the deep-research stop-state behavior. If wording differs between `blocked_stop` event name and `blockedStop` stop reason, treat both as the same blocked-stop pathway and note the distinction in the operator verdict.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` | Canonical graph stop-guard helper; threshold constants and `evaluateGraphGates()` |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Deep-research legal-stop and blocked-stop contract, including graph-aware convergence |
| `.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts` | Cross-layer threshold assertions for graph stop-guard behavior |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-and-recovery/031-graph-convergence-signals.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-10.
