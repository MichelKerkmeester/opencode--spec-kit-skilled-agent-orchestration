---
title: "Tasks: Clean-Room License Audit (012/001)"
description: "Task list for the P0 license-audit gate."
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Clean-Room License Audit (012/001)

<!-- SPECKIT_LEVEL: 2 -->

| ID | Task | Status |
|----|------|--------|
| T-012-001-1 | Read `external/gitnexus/LICENSE` in full | pending |
| T-012-001-2 | Read license-relevant sections of `external/ARCHITECTURE.md` | pending |
| T-012-001-3 | Classify each adaptation pattern (002-005) as ALLOWED or BLOCKED | pending |
| T-012-001-4 | Draft `012/001/decision-record.md` with verbatim LICENSE quote + allow-list | pending |
| T-012-001-5 | Cross-link from `012/decision-record.md` ADR-012-001 | pending |
| T-012-001-6 | Capture user sign-off in `implementation-summary.md` | pending |
| T-012-001-7 | Run `validate.sh --strict` on `012/001/` | pending |

## Halt Criteria
- T-012-001-1 reveals license forbids clean-room path needed by 012/002-005 → halt entire 012 phase, escalate to user

## References
- spec.md, plan.md, checklist.md (this folder)
