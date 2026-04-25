---
title: "Checklist: 012/003"
description: "Verification items for edge explanation + impact uplift."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/003

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Display & Schema Discipline
- [ ] Edge metadata gains `reason` + `step` (JSON only, no SQLite migration)
- [ ] Existing `confidence`/`detectorProvenance`/`evidenceClass` unchanged
- [ ] `code_edges` table schema unchanged (verified by diff vs `code-graph-db.ts:92`)

## P1 — Output contracts
- [ ] `computeBlastRadius` returns `{ depthGroups, riskLevel, ambiguityCandidates, failureFallback? }`
- [ ] `minConfidence` parameter filters edges during traversal
- [ ] Risk classification rules documented + tested
- [ ] Ambiguous target returns candidates — no silent default pick (pt-02 §12 RISK-07)
- [ ] Failures return structured `failureFallback`, not bare strings
- [ ] Backward compat: old callers still get prior shape

## P2 — Documentation
- [ ] feature_catalog entry in `06--analysis/`
- [ ] manual_testing_playbook entry in `06--analysis/`
- [ ] sk-doc DQI ≥85

## Phase Hand-off
- [ ] `validate.sh --strict` passes
- [ ] code-graph vitest suite passes unchanged
- [ ] `implementation-summary.md` populated

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 Packet 2, §12 RISK-07
