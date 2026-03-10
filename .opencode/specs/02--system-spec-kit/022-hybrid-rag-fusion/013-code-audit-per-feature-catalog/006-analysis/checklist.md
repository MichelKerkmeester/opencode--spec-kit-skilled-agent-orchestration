---
title: "Verification Checklist: analysis [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-10"
trigger_phrases:
  - "verification"
  - "checklist"
  - "analysis"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: analysis

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

- [ ] CHK-001 [P0] Findings for F-01 through F-07 are documented in `spec.md`
- [ ] CHK-002 [P0] Analysis technical approach and phase flow are defined in `plan.md`
- [ ] CHK-003 [P1] Feature and code dependencies are identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] FAIL findings (F-02, F-04) are mapped to concrete fix tasks
- [ ] CHK-011 [P0] Wildcard export standards violations are tracked for remediation
- [ ] CHK-012 [P1] Behavior mismatches are explicitly linked to acceptance-impacting fixes
- [ ] CHK-013 [P1] Task backlog uses T### numbering with clear file-path targeting
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Test gaps are documented for all seven features
- [ ] CHK-021 [P0] P0 regression tests are defined for orphan coverage and depth truncation semantics
- [ ] CHK-022 [P1] P1 regression tests are defined for unlink, preflight, postflight, and history flows
- [ ] CHK-023 [P1] Deferred placeholder suites are tracked for replacement with DB-backed assertions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or unsafe command patterns appear in phase docs
- [ ] CHK-031 [P0] Validation/auth-sensitive findings are visible for F-05/F-06/F-07 follow-up
- [ ] CHK-032 [P1] Error-handling and export-pattern risks are documented for remediation
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized
- [ ] CHK-041 [P1] Stale `retry.vitest.ts` references are tracked across F-01..F-07
- [ ] CHK-042 [P2] Playbook mapping gaps (EX-028..EX-031, NEW-*) are documented
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Changes are limited to 006-analysis target documents
- [ ] CHK-051 [P1] `description.json`, `memory/`, and `scratch/` remain untouched
- [ ] CHK-052 [P2] Findings are ready for future memory save flow if requested
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/[8] |
| P1 Items | 10 | [ ]/[10] |
| P2 Items | 2 | [ ]/[2] |

**Verification Date**: 2026-03-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
