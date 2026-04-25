---
title: "Checklist: 012/005"
description: "Memory trust display verification."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/005

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Hard Rules (pt-02 §12 RISK-06)
- [x] NO schema change to `causal_edges` (verified by diff vs current `lib/storage/causal-edges.ts:82-94`) — protected-file static diff PASS; `causal-edges.ts` unchanged.
- [x] NO new relation types (six relations unchanged: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`) — relation-vocabulary review PASS.
- [x] NO Code Graph structural facts stored in Memory — formatter reads existing causal-edge columns only; no Code Graph fact ingestion path added.
- [x] No modification to `causal-boost.ts:327-338` (`computeTraversalFreshnessFactor`) decay logic — protected-file static diff PASS; `causal-boost.ts` unchanged.

## P1 — Output contract
- [x] `trustBadges` computed from existing columns only — `formatters/search-results.ts` derives from `strength`, `extracted_at`, `last_accessed`, and `weight_history`; orphan from inbound-edge absence.
- [x] Backward compat: shape additive — `MemoryTrustBadges` is additive on each `MemoryResultEnvelope`; explicit caller-supplied `trustBadges` preserved.
- [x] Display placement decision recorded in `implementation-summary.md` — see §"Display Placement Decision".

## P2 — Documentation
- [x] feature_catalog entry in `13--memory-quality-and-indexing/` — `28-memory-causal-trust-display.md` created.
- [x] manual_testing_playbook entry in same category — `203-memory-causal-trust-display.md` created.
- [ ] sk-doc DQI ≥85 — OPERATOR-PENDING. Original implementation reported feature catalog 87 and playbook 91 via `extract_structure.py`, but those scores were captured outside the canonical Wave-3 channel. Marked R-007-21 — premature PASS. Operator must re-run `python3 .opencode/skill/sk-doc/scripts/validate_document.py` for both entries to attest the numeric scores.

## Phase Hand-off
- [ ] `validate.sh --strict` passes — OPERATOR-PENDING-COSMETIC. Wave-3 canonical (010/007/T-B, 2026-04-25): FAILED on template-section conformance only (extra/non-canonical section headers from per-sub-phase scaffold). Cosmetic, NOT a contract violation: required Level-2 files present, anchors balanced, no `[TBD]` placeholders. Tracked as deferred P2 cleanup in 010/007. See `implementation-summary.md` §Verification for full canonical evidence.
- [ ] Memory vitest suite passes — PARTIAL. Wave-3 canonical (010/007/T-B, 2026-04-25): `tests/response-profile-formatters.vitest.ts` is inside the 9 PASSED test files (response-profile preservation verified). However `tests/memory/trust-badges.test.ts` SQL-mock describe block has 3 SKIPPED tests pending T-E remediation (R-007-13: rewrite mock-resolution via DI override or real-DB fixture, then unskip the describe block). The previous unchecked state remains until T-E lands; 005 cannot self-tick this item because the SQL-routed badge-derivation paths are the ones gated. See `implementation-summary.md` §Verification for full canonical evidence.
- [x] `implementation-summary.md` populated — Status reflects "Complete & partially verified" (010/007/T-B); §What Was Built, §Display Placement Decision, §Verification (with Wave-3 canonical evidence + 005-specific result mapping), §Known Limitations all populated.

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 Packet 4, §12 RISK-06
