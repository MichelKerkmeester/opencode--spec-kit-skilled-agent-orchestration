---
title: Second Target Evaluation
description: Why context-prime is the current second structured target after handover.
---

# Second Target Evaluation

Decision note for why `context-prime` became the second bounded agent-improver target instead of a broader orchestration surface. Use it when explaining why the package expands cautiously rather than by raw ambition.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Explains why `context-prime` was selected as the second structured target in the fuller agent-improver phase.

### When to Use

Use this reference when:
- explaining target-profile reuse
- justifying why broader orchestration agents were deferred
- deciding whether a future target is safer or riskier than `context-prime`

### Core Principle

Target growth should move from narrow and structured to broader and riskier, not the other way around.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:selected-target -->
## 2. SELECTED TARGET

- `.opencode/agent/context-prime.md`

---

<!-- /ANCHOR:selected-target -->
<!-- ANCHOR:why-selected -->
## 3. WHY THIS TARGET WON

- it has a compact, structured output contract
- it is read-only, which makes safety expectations clearer
- it is narrower and easier to score than orchestration or deep-research surfaces
- it follows the repo's `session_bootstrap()`-first recovery contract instead of teaching a stale path

---

<!-- /ANCHOR:why-selected -->
<!-- ANCHOR:why-not-first -->
## 4. WHY IT WAS NOT THE FIRST TARGET

- handover already had a stronger spec-folder document contract
- handover was easier to tie to exact required source files and template usage
- context-prime made more sense once the scorer had already proven stable on one target

---

<!-- /ANCHOR:why-not-first -->
<!-- ANCHOR:current-policy -->
## 5. CURRENT POLICY

- `context-prime` is onboarded and benchmarked in the current program
- `context-prime` remains candidate-only
- `handover` remains the only promotion-eligible canonical target

### Note on Dynamic Profiling

With Phase 008's `generate-profile.cjs`, evaluating new target candidates no longer requires manually writing profiles. Any agent in `.opencode/agent/` can be scored dynamically using `score-candidate.cjs --dynamic`. This lowers the barrier for initial assessment while preserving the rigor of static profiles for promotion-eligible targets.

---

<!-- /ANCHOR:current-policy -->
<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

- `target_onboarding.md`
- `no_go_conditions.md`
- `../assets/target-profiles/context-prime.json`

<!-- /ANCHOR:related-resources -->
