---
title: "Checklist: 012/005"
description: "Memory trust display verification."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/005

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Hard Rules (pt-02 §12 RISK-06)
- [ ] NO schema change to `causal_edges` (verified by diff vs current `lib/storage/causal-edges.ts:82-94`)
- [ ] NO new relation types (six relations unchanged: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`)
- [ ] NO Code Graph structural facts stored in Memory
- [ ] No modification to `causal-boost.ts:327-338` (`computeTraversalFreshnessFactor`) decay logic

## P1 — Output contract
- [ ] `trustBadges` computed from existing columns only
- [ ] Backward compat: shape additive
- [ ] Display placement decision recorded in `implementation-summary.md`

## P2 — Documentation
- [ ] feature_catalog entry in `13--memory-quality-and-indexing/`
- [ ] manual_testing_playbook entry in same category
- [ ] sk-doc DQI ≥85

## Phase Hand-off
- [ ] `validate.sh --strict` passes
- [ ] Memory vitest suite passes
- [ ] `implementation-summary.md` populated

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 Packet 4, §12 RISK-06
