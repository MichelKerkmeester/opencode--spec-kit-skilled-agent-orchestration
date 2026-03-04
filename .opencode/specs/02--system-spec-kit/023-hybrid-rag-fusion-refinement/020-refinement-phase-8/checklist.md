---
title: "Verification Checklist: Scripts vs mcp_server Architecture Refinement [template:level_3/checklist.md]"
description: "Verification checklist for concern separation, boundary clarity, dependency direction, and discoverability improvements."
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
trigger_phrases:
  - "phase 8 checklist"
  - "architecture verification"
  - "boundary checks"
importance_tier: "critical"
contextType: "architecture"
---
# Verification Checklist: Scripts vs mcp_server Architecture Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Verification Protocol
<!-- ANCHOR:protocol -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Full tree and source inventories captured in this spec folder `scratch/`. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-002 [P0] 6-criterion architecture evaluation completed with evidence paths. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-003 [P1] Recommendations documented with effort/risk/developer-impact fields. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Architecture Boundary Quality

- [ ] CHK-010 [P0] Runtime-vs-CLI boundary contract documented at canonical path.
- [ ] CHK-011 [P0] Public API consumer policy documented for `mcp_server/api/*`.
- [ ] CHK-012 [P0] Forbidden `scripts -> @spec-kit/mcp-server/lib/*` imports are guarded by automated check.
- [ ] CHK-013 [P0] Documented handler cycle no longer present.
- [ ] CHK-014 [P1] Compatibility wrapper scope is explicit in `mcp_server/scripts/README.md`.
- [ ] CHK-015 [P1] Reindex runbook has single canonical owner doc with pointer docs elsewhere.
- [ ] CHK-016 [P1] Duplicate helper concerns consolidated with shared ownership.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Import-policy check runs in default lint/check workflow.
- [ ] CHK-021 [P1] Helper consolidation parity tests pass.
- [ ] CHK-022 [P1] Reindex compatibility path remains operational.
- [ ] CHK-023 [P2] Lint/check runtime overhead increase remains within target.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Level 3 docs exist in this folder: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-041 [P1] Cross-links from READMEs to boundary contract and API policy complete.
- [ ] CHK-042 [P2] Deprecation/removal criteria documented for compatibility wrappers and allowlist entries.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADRs capture boundary, compatibility strategy, and helper consolidation. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-101 [P1] Alternatives and rejection rationale reflect current code evidence.
- [ ] CHK-102 [P1] Migration path includes rollback and exception governance.
- [ ] CHK-103 [P2] Architecture docs remain synchronized with enforcement scripts.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 4/8 |
| P1 Items | 8 | 2/8 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-03-04
<!-- /ANCHOR:summary -->

## P0
- [ ] [P0] No additional phase-specific blockers recorded for this checklist normalization pass.

## P1
- [ ] [P1] No additional required checks beyond documented checklist items for this phase.
