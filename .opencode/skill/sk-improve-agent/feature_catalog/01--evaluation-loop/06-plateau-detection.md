---
title: "Plateau detection"
description: "Stops further iterations when the loop has run out of meaningful movement or stable evidence."
---

# Plateau detection

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Stops further iterations when the loop has run out of meaningful movement or stable evidence.

This feature covers the stop logic spread across the reducer, mutation-coverage graph, replay-stability helper, and trade-off detector.

---

## 2. CURRENT REALITY

`reduce-state.cjs` computes the live stop status from the JSONL ledger and the runtime config. It can stop for trailing ties, repeated infra failures, repeated benchmark failures, mirror-drift ambiguity, and all-dimension plateau detection, where every tracked dimension has the same score across the configured plateau window.

That reducer stop check is not the only stability signal. `mutation-coverage.cjs` uses a looser convergence-eligibility rule based on three data points with all dimension deltas within `+/-2`, while `trade-off-detector.cjs` and `benchmark-stability.cjs` both return explicit `insufficientData` or `insufficientSample` states until they have at least three observations. The current loop therefore has both exact-score plateau detection and separate evidence-quality gates for convergence and repeatability.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | Reducer | Computes stop status from ties, infra failures, benchmark failures, drift ambiguity, and exact-score plateaus. |
| `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs` | Coverage tracker | Records per-dimension score history and checks convergence eligibility from stable trajectories. |
| `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs` | Analysis helper | Refuses to analyze trade-offs until enough trajectory points exist and flags meaningful regressions when they do. |
| `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs` | Stability helper | Measures replay variance and refuses verdicts until the minimum replay count is met. |
| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Runtime config | Supplies the plateau window and stop-rule thresholds consumed by the reducer. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts` | Automated test | Verifies the three-point convergence rule and unstable-dimension reporting. |
| `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts` | Automated test | Verifies insufficient-data handling and hard versus soft regression thresholds. |
| `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts` | Automated test | Verifies insufficient-sample handling, stability coefficients, and warning thresholds. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/06-plateau-detection.md`
