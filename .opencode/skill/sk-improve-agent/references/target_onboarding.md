---
title: Target Onboarding Guide
description: How to add a new bounded target to sk-improve-agent without weakening guardrails.
---

# Target Onboarding Guide

Workflow for onboarding new agent-improver targets while keeping evaluator discipline, manifest clarity, and promotion safety intact. Use it when a new target is genuinely needed rather than just interesting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Explains how to add a bounded target to `sk-improve-agent` without weakening the existing manifest and benchmark rules.

### When to Use

Use this reference when:
- adding a new target profile
- deciding whether a target should be canonical, derived, or candidate-only
- checking whether target growth is still safe

### Core Principle

Target growth should be explicit, repeatable, and evaluator-backed. If the target cannot be classified or benchmarked cleanly, it is not ready.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:preconditions -->
## 2. PRECONDITIONS

Only add a target when all of the following are true:

- the target has a structured output contract
- the target can be benchmarked deterministically or with policy-stable rules
- the target can be classified clearly as canonical, derived, or candidate-only
- the target does not require mirror sync to prove the experiment result

---

<!-- /ANCHOR:preconditions -->
<!-- ANCHOR:required-steps -->
## 3. REQUIRED STEPS

1. Add a target profile under `assets/target-profiles/`
2. Add fixture definitions under `assets/fixtures/{profile-id}/`
3. Add the manifest entry in `assets/target_manifest.jsonc`
4. Extend `score-candidate.cjs` prompt checks for the new profile if needed
5. Run `run-benchmark.cjs` against packet-local outputs for the new profile
6. Confirm reducer output still separates target families cleanly

### Dynamic Profile Alternative

For quick evaluation without creating a static profile, use `generate-profile.cjs`:

```text
node scripts/generate-profile.cjs --agent=.opencode/agent/{name}.md
```

This derives a scoring profile from the agent's own structure, rules, and permissions. Dynamic profiles are suitable for initial assessment but not for promotion-eligible targets (which require static profiles with hardcoded fixture sets).

---

<!-- /ANCHOR:required-steps -->
<!-- ANCHOR:classification-rules -->
## 4. CLASSIFICATION RULES

- `canonical`: may become promotion-eligible only with explicit guardrails
- `derived`: downstream packaging surface only
- `candidate-only`: benchmarkable and scoreable, but not promotable in the current packet

---

<!-- /ANCHOR:classification-rules -->
<!-- ANCHOR:current-recommendation -->
## 5. CURRENT RECOMMENDATION

- keep `handover` as the only promotion-eligible target
- keep `context-prime` as candidate-only until a later packet proves the rollout path

---

<!-- /ANCHOR:current-recommendation -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

- `second_target_evaluation.md`
- `evaluator_contract.md`
- `../assets/target_manifest.jsonc`

<!-- /ANCHOR:related-resources -->
