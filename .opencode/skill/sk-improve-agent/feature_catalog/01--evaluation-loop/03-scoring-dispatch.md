---
title: "Scoring dispatch"
description: "Dispatches a candidate through scoring, evidence capture, and reducer refresh steps."
---

# Scoring dispatch

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Dispatches a candidate through scoring, evidence capture, and reducer refresh steps.

This feature covers the handoff from proposal output into the scorer, evidence helpers, and reducer that turn raw iteration results into a reviewable state snapshot.

---

## 2. CURRENT REALITY

Both improve-agent YAML workflows call `score-candidate.cjs` after a candidate is written, then emit `candidate_scored`, record mutation coverage and dimension trajectory, run replay-stability and trade-off helpers, append packet evidence, and refresh the runtime state with `reduce-state.cjs`. Those steps are explicit shell commands in the YAML files, so the scoring path is not inferred from prose alone.

The benchmark runner exists as a real helper, but the YAML workflows currently describe benchmark execution as an action instead of a concrete `run-benchmark.cjs` command. In practice that means scoring dispatch is fully wired, while benchmark execution still depends on the surrounding operator or wrapper flow to provide the exact benchmark invocation and output set.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Workflow | Sequences score, mutation coverage, stability, trade-off, ledger, and reduction steps in autonomous mode. |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Workflow | Mirrors the dispatch sequence in interactive mode and pauses at review gates. |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Scorer | Produces the dynamic 5-dimension score output for a candidate. |
| `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` | Benchmark helper | Scores fixture outputs and optional integration-report inputs when a profile-specific benchmark set exists. |
| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Stability helper | Measures replay stability and emits `insufficientSample` until enough replays exist. |
| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Analysis helper | Detects cross-dimension regressions before the reducer refresh. |
| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Reducer | Rebuilds the registry and dashboard after each scored iteration. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` | Automated test | Verifies replay-stability thresholds, warnings, and insufficient-sample handling. |
| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` | Automated test | Verifies trade-off detection thresholds and score-history extraction from journal events. |
| `.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md` | Operator reference | Documents the benchmark command shape and evidence expectations that sit beside the scorer output. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/03-scoring-dispatch.md`
