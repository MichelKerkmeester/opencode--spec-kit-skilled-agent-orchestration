---
title: "Convergence check"
description: "Determines whether the review loop continues, enters recovery, or stops legally."
---

# Convergence check

## 1. OVERVIEW

Determines whether the review loop continues, enters recovery, or stops legally.

This phase evaluates the review history after every iteration. It mixes hard stops, a weighted stop vote, legal-stop gates, graph-aware blockers, pause handling, and stuck recovery so the loop only exits when the review is actually saturated.

## 2. CURRENT REALITY

The live convergence model evaluates outcomes in priority order: max iterations, all dimensions covered with stabilization, stuck detection, composite convergence, legal-stop gate bundle, then default continue. The weighted vote uses rolling average, MAD noise floor, and dimension coverage as its three core signals. A new P0 finding forces `newFindingsRatio` up to at least `0.50`, which blocks premature stop.

Even when the weighted vote requests STOP, the loop still has to pass the review gate bundle. Failed gates persist a first-class `blocked_stop` event with `blockedBy`, `gateResults`, and `recoveryStrategy`, then continue the loop. The same stop path can be vetoed by graph convergence or by a failed claim adjudication packet, and stuck recovery pivots toward the least-covered dimension instead of repeating the same exhausted pass.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/convergence.md` | Protocol | Defines hard stops, stuck detection, composite vote, legal-stop gates, recovery strategies, and convergence reporting. |
| `references/loop_protocol.md` | Protocol | Wires convergence, pause sentinel checks, blocked-stop persistence, and loop-decision behavior into the lifecycle. |
| `references/state_format.md` | Schema | Defines blocked-stop, graph-convergence, pause, recovery, and synthesis event shapes in JSONL. |
| `assets/review_mode_contract.yaml` | Contract | Declares convergence defaults, severity math, quality gates, verdicts, and release-readiness states. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md` | Manual scenario | Verifies the hard iteration ceiling. |
| `manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md` | Manual scenario | Exercises the weighted stop vote. |
| `manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md` | Manual scenario | Verifies least-covered-dimension recovery behavior. |
| `manual_testing_playbook/04--convergence-and-recovery/021-graph-convergence-review.md` | Manual scenario | Verifies graph-assisted convergence and blockers. |
| `manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` | Manual scenario | Confirms blocked-stop events surface into reducer-owned state. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/03-convergence-check.md`
- Primary sources: `references/convergence.md`, `references/loop_protocol.md`, `references/state_format.md`, `assets/review_mode_contract.yaml`
