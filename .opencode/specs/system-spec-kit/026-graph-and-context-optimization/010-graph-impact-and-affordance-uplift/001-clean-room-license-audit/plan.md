---
title: "Plan: Clean-Room License Audit (012/001)"
description: "Steps to read external/LICENSE and produce the clean-room allow-list ADR."
importance_tier: "important"
contextType: "implementation"
---
# Plan: Clean-Room License Audit (012/001)

<!-- SPECKIT_LEVEL: 2 -->

## Steps

1. Read `external/LICENSE` in full
2. Read license-relevant sections of `external/ARCHITECTURE.md` and `external/README.md`
3. Classify each in-scope adaptation pattern:
   - Phase-DAG runner (002)
   - Edge `reason`/`step` metadata (003)
   - Blast_radius enrichment (003)
   - Affordance evidence + sanitizer (004)
   - Memory trust display (005)
4. Draft `012/001/decision-record.md` with verbatim LICENSE quote, classification table, fail-closed rule
5. Cross-link from `012/decision-record.md` ADR-012-001
6. Populate `implementation-summary.md` with audit outcome + sign-off record
7. Run `validate.sh --strict`

## Halt Criterion
If LICENSE forbids the clean-room path needed by 012/002-005, halt the entire 012 phase and escalate to user.

## Effort
S (1-2h)

## References
- spec.md (this folder), checklist.md (this folder)
- 012/spec.md, 012/decision-record.md
