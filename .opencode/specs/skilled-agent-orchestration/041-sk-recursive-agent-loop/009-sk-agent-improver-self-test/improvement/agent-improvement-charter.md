---
title: Recursive Agent Charter
description: Fixed policy charter for a agent-improver run.
---

# Recursive Agent Charter

Fixed policy template for a agent-improver run. Use it as the non-negotiable control layer that tells the mutator, scorer, reducer, and operator what kind of improvement workflow is allowed.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the fixed policy boundary for a agent-improver run.

### Usage

Copy this file into the packet-local runtime area and treat it as the stable policy layer for that run. Do not let the mutator rewrite the charter during proposal generation.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:mission -->
## 2. MISSION

Build a trustworthy improvement loop for agent surfaces by proving evaluation discipline before allowing self-editing. Evaluate agents holistically across their full integration surface — not just the prompt file, but the complete system of mirrors, commands, YAML workflows, skills, and gate routing that together define agent behavior.

---

<!-- /ANCHOR:mission -->
<!-- ANCHOR:targets -->
## 3. TARGETS

### Canonical Benchmark Seed

- canonical source under test: `.opencode/agent/handover.md`
- reason: structured prompt surface, narrow scope, clear downstream artifact contract

### Additional Bounded Target

- candidate-only source under test: `.opencode/agent/context-prime.md`
- reason: structured, read-only Prime Package contract with a smaller and safer output surface than broad orchestration agents

---

<!-- /ANCHOR:targets -->
<!-- ANCHOR:policy -->
## 4. POLICY

- proposal-only mode is mandatory
- the mutator and scorer are separate roles
- benchmark evidence is required for target profiles that declare fixtures
- all attempts are logged append-only
- runtime mirrors are downstream packaging surfaces, not benchmark truth
- human approval is required before any canonical promotion
- only the handover target is promotion-eligible in this packet
- evaluation uses 5 deterministic dimensions (structural integrity, rule coherence, integration consistency, output quality, system fitness) — each scored independently, weighted, and tracked per iteration

---

<!-- /ANCHOR:policy -->
<!-- ANCHOR:keep-discard -->
## 5. KEEP OR DISCARD RULE

- keep the baseline when the candidate is weaker, noisier, or broader
- keep the candidate only when it scores higher without violating policy
- prefer the simpler option on ties

---

<!-- /ANCHOR:keep-discard -->
<!-- ANCHOR:out-of-scope -->
## 6. OUT OF SCOPE

- multi-canonical promotion
- runtime-mirror mutation as experiment evidence
- open-ended multi-target rollout
- self-grading mutators

---

<!-- /ANCHOR:out-of-scope -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- `../references/promotion_rules.md`
- `../references/no_go_conditions.md`
- `target_manifest.jsonc`

<!-- /ANCHOR:related-resources -->
