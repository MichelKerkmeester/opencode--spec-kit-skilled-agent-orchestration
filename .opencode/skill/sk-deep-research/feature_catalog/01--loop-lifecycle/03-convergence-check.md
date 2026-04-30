---
title: "Convergence check"
description: "Applies the statistical stop vote, legal-stop gates, and blocked-stop handling before research can end."
---

# Convergence check

## 1. OVERVIEW

Applies the statistical stop vote, legal-stop gates, and blocked-stop handling before research can end.

Convergence checking is the control point between one finished iteration and the next decision. It decides whether the loop continues, enters recovery mode, or can move into synthesis.

---

## 2. CURRENT REALITY

The live loop applies convergence in layers. Hard stops for `maxIterations` and all-questions-answered run first. The workflow then evaluates the weighted `shouldContinue()` signals from `convergence.md`, and when those signals or full question coverage nominate STOP, it applies the legal-stop bundle rather than stopping on novelty math alone.

That legal-stop bundle is workflow-visible, not only prose guidance. The YAML workflows record graph convergence results when available, evaluate the gate bundle, and emit a first-class `blocked_stop` event if the stop is not yet legal. That event carries gate results, blockers, recovery guidance, session identifier, and generation so the reducer and dashboard can show why the loop had to continue.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/references/convergence.md` | Reference | Defines the hard stops, weighted signals, legal-stop bundle, and stop labels. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Reference | Defines the loop ordering, guard step, and blocked-stop persistence contract. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Runs convergence evaluation, graph convergence calls, and blocked-stop emission in autonomous mode. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Mirrors the same convergence and blocked-stop flow with confirm-mode approvals. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md` | Manual playbook | Verifies the composite convergence stop behavior. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md` | Manual playbook | Verifies that a nominated stop is overridden when the legal-stop guards fail. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/032-blocked-stop-reducer-surfacing.md` | Manual playbook | Verifies blocked-stop events surface through reducer-owned packet outputs. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/03-convergence-check.md`
