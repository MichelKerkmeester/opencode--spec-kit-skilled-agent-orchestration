---
title: "Verification Checklist: lifecycle [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-10"
trigger_phrases:
  - "verification"
  - "checklist"
  - "lifecycle"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: lifecycle

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

- [ ] CHK-001 [P0] Requirements documented in spec.md for lifecycle features F-01..F-07
- [ ] CHK-002 [P0] Technical approach defined in plan.md for lifecycle audit remediation
- [ ] CHK-003 [P1] Feature findings mapped into checklist sections (F-01..F-07)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] F-05 ingest path limit uses one shared constant across schema and handler
- [ ] CHK-011 [P0] F-06 pending-file recovery performs stale/uncommitted detection before rename
- [ ] CHK-012 [P1] F-07 archival logic defines BM25 and vector embedding behavior explicitly
- [ ] CHK-013 [P1] Lifecycle fixes follow project TypeScript patterns and typed error handling
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All lifecycle acceptance criteria are met for F-01..F-07
- [ ] CHK-021 [P0] Boundary/concurrency/crash-recovery tests added for F-05 and F-06
- [ ] CHK-022 [P1] Checkpoint lifecycle integration gaps closed for F-01..F-04
- [ ] CHK-023 [P1] Archival regression coverage validates archive/unarchive vec/BM25 behavior (F-07)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in lifecycle remediation
- [ ] CHK-031 [P0] Input validation parity enforced for ingest path constraints (F-05)
- [ ] CHK-032 [P1] Startup recovery prevents unintended promotion of stale pending files (F-06)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized for lifecycle phase
- [ ] CHK-041 [P1] Stale `retry.vitest.ts` references removed from lifecycle feature docs
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
