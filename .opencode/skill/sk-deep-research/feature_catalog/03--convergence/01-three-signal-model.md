---
title: "Three-signal model"
description: "Combines rolling novelty, MAD noise floor, and question coverage into the live deep-research stop vote."
---

# Three-signal model

## 1. OVERVIEW

Combines rolling novelty, MAD noise floor, and question coverage into the live deep-research stop vote.

The three-signal model is the statistical core of deep-research convergence. It gives the workflow a reusable way to judge diminishing returns without relying on a single novelty threshold.

---

## 2. CURRENT REALITY

The live algorithm starts with hard stops for `maxIterations` and all questions answered. If neither applies, it evaluates a weighted vote across rolling average of recent `newInfoRatio` values, MAD noise floor, and question entropy coverage. The weights are `0.30`, `0.35`, and `0.35`, and a normalized stop score above `0.60` nominates STOP.

The model is selective about which iterations count. `thought` iterations are ignored for signal math and stuck detection because they add no external evidence. `insight` iterations keep low-ratio conceptual breakthroughs from being treated as dead time. Signal values can also be written back into the iteration record under `convergenceSignals`, which gives the reducer and later analysis tools a stable machine-readable view of the vote.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Reference | Defines hard stops, weighted signals, stop-score threshold, and status handling. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Reference | Defines the `convergenceSignals` payload written into iteration records. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference | Places the statistical vote inside the live loop order before guard evaluation. |

### Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md` | Manual playbook | Verifies weighted convergence behavior. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md` | Manual playbook | Verifies `insight` status prevents false stuck classification. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md` | Manual playbook | Verifies `thought` iterations are excluded from convergence math. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--convergence/01-three-signal-model.md`
