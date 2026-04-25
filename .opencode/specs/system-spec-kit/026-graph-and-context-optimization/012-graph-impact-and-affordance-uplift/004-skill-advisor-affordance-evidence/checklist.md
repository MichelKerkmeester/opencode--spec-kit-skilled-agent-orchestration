---
title: "Checklist: 012/004"
description: "Affordance evidence verification."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/004

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Hard Rules (pt-02 §12 RISK-05)
- [ ] No new scoring lane added (existing `derived` + `graph-causal` only)
- [ ] No new entity_kinds in `skill_graph_compiler.py:43` (`ALLOWED_ENTITY_KINDS` unchanged)
- [ ] No new relation types (no new keys in `EDGE_MULTIPLIER`)
- [ ] Affordance-normalizer allowlist enforced before evidence reaches scorer
- [ ] Sanitization mandatory — no bypass paths
- [ ] Recommendation payload preserves existing privacy guarantees (no raw phrases leaked)

## P1 — Output contract
- [ ] `affordance-normalizer.ts` exposes typed `normalize()` API
- [ ] Lane attribution: routing decision traces to derived/graph-causal (not new)
- [ ] Routing fixtures show recall improvement without precision regression

## P2 — Documentation
- [ ] feature_catalog entry in `11--scoring-and-calibration/`
- [ ] manual_testing_playbook entry in `11--scoring-and-calibration/`
- [ ] sk-doc DQI ≥85

## Phase Hand-off
- [ ] `validate.sh --strict` passes
- [ ] Skill Advisor vitest suite passes
- [ ] `implementation-summary.md` populated

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 Packet 3, §12 RISK-05
