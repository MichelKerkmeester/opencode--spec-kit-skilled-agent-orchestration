---
title: "Verification Checklist: System-Wide Remediation [125-codex-system-wide-audit/checklist]"
description: "All CHK-### [P0] items are hard blockers and must be closed with evidence before completion."
trigger_phrases:
  - "verification"
  - "checklist"
  - "system"
  - "wide"
  - "remediation"
  - "125"
  - "codex"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: System-Wide Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 (refactored) -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim completion while open |
| **[P1]** | Required | Complete or defer with explicit rationale |
| **[P2]** | Optional | Improve quality but does not block closeout |

<!-- /ANCHOR:protocol -->

---

- **Level**: 3+
- **Canonical exit codes**: `0=success`, `1=validation/dependency`, `2=upgrade failure`, `3=backup failure`

---

## P0

All `CHK-### [P0]` items are hard blockers and must be closed with evidence before completion.

## P1

All `CHK-### [P1]` items must be completed or explicitly deferred with rationale.

---

<!-- ANCHOR:docs -->
## Documentation Integrity

- [x] CHK-001 [P0] Spec reflects full confirmed issue inventory [Evidence: `spec.md` sections 4-5]
- [x] CHK-002 [P0] Plan commands are path-correct and runnable from declared cwd [Evidence: `plan.md` section 4]
- [x] CHK-003 [P0] Tasks use unique IDs and no contradictory status markers [Evidence: `tasks.md`]
- [x] CHK-004 [P0] Decision record no longer relies on stale spec-121 orphan assumption [Evidence: `decision-record.md` ADR-005]
- [x] CHK-005 [P0] Implementation summary no longer claims completion with open P0 items [Evidence: `implementation-summary.md` status]
- [x] CHK-006 [P1] Handover reflects remediation-first continuation [Evidence: `handover.md` sections 1-3]

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:code-quality -->
## Shell Runtime Safety

- [x] CHK-100 [P0] Undefined `error` call removed from upgrade failure path [Evidence: `scratch/verify-shell-runtime-remediation.md`]
- [x] CHK-101 [P0] Rollback removes files created during failed run [Evidence: `scratch/verify-shell-runtime-remediation.md`]
- [x] CHK-102 [P0] Rollback reports non-zero on copy/delete failure [Evidence: `scratch/verify-shell-runtime-remediation.md`]
- [x] CHK-103 [P0] `upgrade-level` is discoverable through registry [Evidence: `scratch/verify-registry-upgrade-level.md`]
- [x] CHK-104 [P0] `check-level-match.sh` parses marker/table declarations correctly [Evidence: `scratch/verify-level-parser-parity.md`]
- [x] CHK-105 [P0] `upgrade-level.sh` and `validate.sh` return same level for shared fixtures [Evidence: `scratch/verify-level-parser-parity.md`]
- [x] CHK-106 [P0] `test-upgrade-level.sh` no longer mutates shared `shell-common.sh` in place [Evidence: `scratch/verify-shell-runtime-remediation.md`]
- [x] CHK-107 [P0] Missing-helper test asserts exact exit code contract [Evidence: `scratch/verify-shell-runtime-remediation.md`]

<!-- /ANCHOR:code-quality -->

---

## MCP Runtime Correctness

- [x] CHK-200 [P1] DB marker write/read use same canonical path contract [Evidence: `scratch/verify-mcp-runtime-remediation.md`]
- [x] CHK-201 [P1] Dedup behavior under DB-unavailable state is explicit and test-covered [Evidence: `scratch/verify-mcp-runtime-remediation.md`]
- [x] CHK-202 [P1] Zero-row reinforcement does not return success-shaped response [Evidence: `scratch/verify-mcp-runtime-remediation.md`]
- [x] CHK-203 [P1] Memory index cooldown is set only after successful scan completion [Evidence: `scratch/verify-mcp-runtime-remediation.md`]

---

<!-- ANCHOR:testing -->
## Testing and Validation

- [x] CHK-300 [P0] Shell syntax checks pass for modified shell scripts [Evidence: `scratch/verification-evidence.md`]
- [x] CHK-301 [P0] Targeted upgrade tests pass [Evidence: `scratch/verify-shell-runtime-remediation.md`]
- [x] CHK-302 [P0] Spec validation passes for 121, 124, 125 without contract drift errors [Evidence: `scratch/verification-evidence.md`]
- [x] CHK-303 [P1] TypeScript checks/tests pass for touched MCP modules [Evidence: `scratch/verification-evidence.md`]
- [x] CHK-304 [P1] Verification evidence files updated and linked from this checklist [Evidence: `scratch/verification-evidence.md`]

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:sign-off -->
## Governance and Closure

- [x] CHK-400 [P0] All P0 checklist items marked `[x]` with evidence links
- [x] CHK-401 [P0] `tasks.md` and checklist completion states match [Evidence: `tasks.md`, `checklist.md`]
- [x] CHK-402 [P1] Final implementation summary reflects actual pass/fail state and remaining risks [Evidence: `implementation-summary.md`]
- [x] CHK-403 [P1] Final handover contains next actions and unresolved decisions [Evidence: `handover.md`]

<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-02-16

<!-- /ANCHOR:summary -->

---

## Evidence Manifest

Expected evidence artifacts:

- `scratch/verify-shell-runtime-remediation.md`
- `scratch/verify-level-parser-parity.md`
- `scratch/verify-registry-upgrade-level.md`
- `scratch/verify-mcp-runtime-remediation.md`
- `scratch/verification-evidence.md`
