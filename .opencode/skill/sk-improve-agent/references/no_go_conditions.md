---
title: No-Go Conditions
description: Explicit blockers that prevent safe expansion of the improve-agent workflow.
---

# No-Go Conditions

Safety-brake reference for deciding when improve-agent must stop or refuse broader rollout. Use it when a packet is accumulating weak evidence, unstable repeatability, or blurred boundaries.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the conditions that force the loop to stop or refuse broader rollout.

### When to Use

Use this reference when:
- checking reducer stop rules
- deciding whether another target can be onboarded
- reviewing whether evaluator confidence is strong enough to continue

### Core Principle

The loop should stop before evaluator quality becomes weaker than the autonomy being requested.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:blocking-conditions -->
## 2. BLOCKING CONDITIONS

Do not expand the loop beyond the current boundary when any of the following are true:

- the scorer cannot reliably separate a weak candidate from the baseline
- the benchmark runner cannot produce stable scores across repeat runs
- promotion cannot be rolled back quickly
- runtime mirror drift is undocumented
- a second target lacks a deterministic or policy-stable evaluator
- the mutator and scorer boundaries blur
- canonical mutation happens without explicit approval
- benchmark evidence and mirror-sync evidence are being mixed together
- a profile exceeds the configured infra-failure or weak-benchmark limits
- All 5 evaluation dimensions have plateaued (3+ consecutive identical scores per dimension) — indicates the improvement loop has exhausted its current approach. Stop and reassess the hypothesis or target.

The reducer consumes these configured stop rules and marks the runtime `shouldStop` when the packet crosses them.

---

<!-- /ANCHOR:blocking-conditions -->
<!-- ANCHOR:related-resources -->
## 3. RELATED RESOURCES

- `evaluator_contract.md`
- `promotion_rules.md`
- `target_onboarding.md`
- `../scripts/reduce-state.cjs`

<!-- /ANCHOR:related-resources -->
