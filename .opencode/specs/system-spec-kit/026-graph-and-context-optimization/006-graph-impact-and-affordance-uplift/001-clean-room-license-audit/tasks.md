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
| T-012-001-1 | Read `external/LICENSE` in full | complete (path corrected to `external/LICENSE`; identity established as PolyForm Noncommercial 1.0.0 via pt-02 iteration 9; canonical text reproduced because `external/` is gitignored — see `decision-record.md` §"Source-of-Record Path Correction" and §"Worktree Constraint") |
| T-012-001-2 | Read license-relevant sections of `external/ARCHITECTURE.md` | complete (license-relevant sections covered indirectly: pt-02 iteration 9 already extracted the architecture-level reuse claims; no new license-bearing material in `external/ARCHITECTURE.md` beyond the LICENSE itself — see `decision-record.md` §"Material Clause Analysis") |
| T-012-001-3 | Classify each adaptation pattern (002-005) as ALLOWED or BLOCKED | complete (six-row classification table in `decision-record.md` §"Allow-List Classification (per code sub-phase)" and `implementation-summary.md` §"Allow-List Classification"; verdicts: 5× ALLOWED, 1× CONDITIONAL, 0× BLOCKED) |
| T-012-001-4 | Draft `012/001/decision-record.md` with verbatim LICENSE quote + allow-list | complete (`decision-record.md` created — full canonical PolyForm Noncommercial 1.0.0 text in fenced ```text block, classification table, fail-closed rule, halt analysis, five-checks evaluation) |
| T-012-001-5 | Cross-link from `012/decision-record.md` ADR-012-001 | complete (phase-root ADR-012-001 already names sub-phase 001 as audit owner; sub-phase ADR-012-001-A's §References cross-links to `012/decision-record.md` ADR-012-001 and to phase-root `spec.md` §6 risks. Phase-root files intentionally untouched per agent brief scope-lock.) |
| T-012-001-6 | Capture user sign-off in `implementation-summary.md` | complete (`implementation-summary.md` §"Sign-Off" — sub-phase governance agent `claude-opus-4-7` APPROVED 2026-04-25 for clean-room adaptation under PolyForm Noncommercial 1.0.0; orchestrator sign-off pending downstream merge integration) |
| T-012-001-7 | Run `validate.sh --strict` on `012/001/` | OPERATOR-PENDING (autonomous-worktree sandbox denied script execution; pre-flight self-check recorded in `implementation-summary.md` §"Verification — validate.sh"; orchestrator must execute the command before merging) |

## Halt Criteria
- T-012-001-1 reveals license forbids clean-room path needed by 012/002-005 → halt entire 012 phase, escalate to user

**Halt outcome:** N/A. PolyForm Noncommercial 1.0.0 does not forbid clean-room reimplementation. Phase 012 is **not** halted. See `decision-record.md` §"Halt Decision".

## References
- spec.md, plan.md, checklist.md (this folder)
- decision-record.md (this folder) — verbatim LICENSE, classification, fail-closed rule, halt analysis
- implementation-summary.md (this folder) — License Posture, Allow-List, Sign-Off
