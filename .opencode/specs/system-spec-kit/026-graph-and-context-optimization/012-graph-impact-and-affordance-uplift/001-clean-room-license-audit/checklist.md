---
title: "Checklist: Clean-Room License Audit (012/001)"
description: "P0 verification items for license-audit gate."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: Clean-Room License Audit (012/001)

<!-- SPECKIT_LEVEL: 2 -->

## P0 — License Posture
- [ ] `external/gitnexus/LICENSE` read in full
- [ ] LICENSE text quoted verbatim in `012/001/decision-record.md`
- [ ] Each in-scope adaptation pattern classified ALLOWED / BLOCKED
- [ ] Fail-closed rule articulated: PRs copying GitNexus source/schema/logic auto-rejected
- [ ] User sign-off recorded in `implementation-summary.md` _before_ any code sub-phase begins
- [ ] If LICENSE blocks clean-room path: phase halted + escalation logged

## Phase Hand-off
- [ ] 012/decision-record.md ADR-012-001 cross-references this sub-phase
- [ ] `validate.sh --strict` passes
- [ ] Sub-phase status flipped to `complete` in implementation-summary.md

## References
- spec.md §5 (verification), §3 (scope)
- 012/checklist.md (phase-level P0 section)
