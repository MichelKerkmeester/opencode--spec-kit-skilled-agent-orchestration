---
title: "Verification Checklist: maintenance [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-10"
trigger_phrases:
  - "verification"
  - "checklist"
  - "maintenance"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: maintenance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] F-01 and F-02 findings documented with status and evidence in `spec.md`
- [ ] CHK-002 [P0] Technical remediation approach for F-01 mismatch defined in `plan.md`
- [ ] CHK-003 [P1] Dependencies for maintenance remediation identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Incremental scan accounting fields (`skipped_hash`, `hash_checks`) reflect implemented semantics
- [ ] CHK-011 [P0] No incorrect metric naming remains in maintenance-facing outputs
- [ ] CHK-012 [P1] Startup guard functions preserve non-blocking warning behavior
- [ ] CHK-013 [P1] Updated code/tests follow existing TypeScript MCP server patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] F-01 acceptance criteria and behavior mismatch checks validated
- [ ] CHK-021 [P0] Startup marker creation/match/mismatch scenarios validated by tests
- [ ] CHK-022 [P1] SQLite version pass/warn/extraction-failure scenarios tested
- [ ] CHK-023 [P1] EX-021 and EX-022 playbook coverage mapped or gap-noted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in modified maintenance files
- [ ] CHK-031 [P0] Input/state validation remains explicit in startup and indexing paths
- [ ] CHK-032 [P1] Warning/error output does not expose sensitive runtime details
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` stay synchronized with F-01/F-02 findings
- [ ] CHK-041 [P1] Feature catalog Current Reality text matches implemented behavior
- [ ] CHK-042 [P2] Maintenance test inventory references updated (including stale retry test cleanup)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Maintenance artifacts remain in `004-maintenance/`
- [ ] CHK-051 [P1] Temporary files are kept in `scratch/` only
- [ ] CHK-052 [P2] Findings are saved to `memory/` when required
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
