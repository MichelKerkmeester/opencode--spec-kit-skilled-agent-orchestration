---
title: "Verification Checklist: Manual Testing — Bug Fixes and Data Integrity"
description: "Verification Date: Not Started"
trigger_phrases:
  - "bug fixes and data integrity checklist"
  - "manual testing checklist"
  - "scenario verification checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Manual Testing — Bug Fixes and Data Integrity

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

- [ ] CHK-001 [P0] MCP server confirmed running before test start
- [ ] CHK-002 [P0] Pre-test checkpoint created
- [ ] CHK-003 [P1] DB has sufficient seed data for all scenarios
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Playbook scenario files reviewed before execution
- [ ] CHK-005 [P1] Spec/plan/tasks consistent across phase documents
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Scenario 001 — Graph channel ID fix (G1): PASS
- [ ] CHK-011 [P0] Scenario 002 — Chunk collapse deduplication (G3): PASS
- [ ] CHK-012 [P0] Scenario 003 — Co-activation fan-effect divisor (R17): PASS
- [ ] CHK-013 [P0] Scenario 004 — SHA-256 content-hash deduplication (TM-02): PASS
- [ ] CHK-014 [P0] Scenario 065 — Database and schema safety: PASS
- [ ] CHK-015 [P0] Scenario 068 — Guards and edge cases: PASS
- [ ] CHK-016 [P0] Scenario 075 — Canonical ID dedup hardening: PASS
- [ ] CHK-017 [P0] Scenario 083 — Math.max/min stack overflow elimination: PASS
- [ ] CHK-018 [P0] Scenario 084 — Session-manager transaction gap fixes: PASS
- [ ] CHK-019 [P0] Scenario 116 — Chunking safe swap atomicity (P0-6): PASS
- [ ] CHK-020 [P0] Scenario 117 — SQLite datetime session cleanup (P0-7): PASS
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials added to bug-fixes phase documents
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] All scenario results recorded in tasks.md
- [ ] CHK-041 [P0] implementation-summary.md filled in with results and date
- [ ] CHK-042 [P2] Any FAIL findings linked to a follow-up tracking item
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp notes in scratch/ only
- [ ] CHK-051 [P2] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 3 | 0/3 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not Started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — one P0 item per scenario
Mark checked with evidence when scenario passes, e.g.:
- [ ] CHK-010 [P0] Scenario 001 — Graph channel ID fix (G1): PASS [Run: YYYY-MM-DD, evidence here]
P0 must complete, P1 need approval to defer
-->
