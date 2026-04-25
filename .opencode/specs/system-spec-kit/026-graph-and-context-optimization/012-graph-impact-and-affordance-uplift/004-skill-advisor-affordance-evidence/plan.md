---
title: "Plan: Skill Advisor Affordance Evidence (012/004)"
description: "Implementation steps for affordance-normalizer + derived/graph-causal lane integration."
importance_tier: "important"
contextType: "implementation"
---
# Plan: 012/004

<!-- SPECKIT_LEVEL: 2 -->

## Steps

### A. Affordance-normalizer
1. Define `AffordanceInput` type (tool/resource description shape)
2. Define `NormalizedAffordance` output (allowlisted fields only)
3. Implement allowlist (e.g., `name`, `triggers[]`, `category`, `dependsOn[]` — NOT free-form `description`)
4. Implement privacy stripping (no raw matched phrases stored)
5. Unit tests for allowlist enforcement + privacy

### B. Compiler integration
6. Read `skill_graph_compiler.py:43` to confirm `ALLOWED_ENTITY_KINDS`
7. Add a derived-input pre-pass that calls normalizer, emits triggers/source-docs into existing kinds (NOT new ones)
8. Confirm whitelist unchanged

### C. Scorer integration
9. Read `scorer/lanes/derived.ts:9-43`
10. Add `affordances?: NormalizedAffordance[]` to the lane's input
11. When present, fold into derived triggers / keywords / source docs
12. Read `scorer/lanes/graph-causal.ts:12-81`
13. Allow affordance-derived edges to use existing `EDGE_MULTIPLIER` weights — no new keys

### D. Per-packet docs
14. `/create:feature-catalog` for `11--scoring-and-calibration/`
15. `/create:testing-playbook` for `11--scoring-and-calibration/`
16. sk-doc DQI ≥85

### E. Verification
17. Unit tests per requirement
18. Routing fixtures: assert affordance evidence improves recall without overpowering explicit triggers
19. Static check: `EDGE_MULTIPLIER` and `ALLOWED_ENTITY_KINDS` unchanged
20. `validate.sh --strict`
21. Populate `implementation-summary.md`

## Dependencies
- 012/001 license audit complete

## Effort
M (4-6h)

## References
- spec.md (this folder), tasks.md, checklist.md
