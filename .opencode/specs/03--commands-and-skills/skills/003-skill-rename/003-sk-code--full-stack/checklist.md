---
title: "Verification Checklist: Phase 003 — Rename legacy full-stack skill identifier to [003-sk-code--full-stack/checklist]"
description: "P0 blocker checks are distributed across sections below and must all be complete."
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase"
  - "003"
  - "rename"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 003 — Rename legacy full-stack skill identifier to sk-code--full-stack

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

<!-- ANCHOR:priority-map -->
## P0

P0 blocker checks are distributed across sections below and must all be complete.

## P1

P1 required checks are distributed across sections below and must all be complete for completion claims.
<!-- /ANCHOR:priority-map -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence: `spec.md` sections 2-5 updated with completion verification]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence: `plan.md` sections 1-5 updated with completed phases and EV references]
- [x] CHK-003 [P1] No predecessor dependencies (executes first) [Evidence: `spec.md` metadata predecessor=`None`; `plan.md` dependencies=`None`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [x] CHK-010 [P0] `legacy full-stack skill identifier` renamed to `sk-code--full-stack` [Evidence: EV-01]
- [x] CHK-011 [P0] No old folder remains [Evidence: EV-01]
- [x] CHK-012 [P0] All 88 internal files present in new folder [Evidence: EV-02]
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (88 files)

- [x] CHK-020 [P0] SKILL.md updated [Evidence: EV-11]
- [x] CHK-021 [P0] index.md updated [Evidence: EV-11]
- [x] CHK-022 [P0] nodes/*.md (~15 files) updated [Evidence: EV-03]
- [x] CHK-023 [P1] references/*.md (~20 files) updated [Evidence: EV-03]
- [x] CHK-024 [P1] assets/*.md (~40 files) updated [Evidence: EV-03]
- [x] CHK-025 [P1] scripts/*.{sh,ts} (~8 files) updated [Evidence: EV-03]
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (11 files)

- [x] CHK-030 [P0] skill_advisor.py updated (8 lines) [Evidence: EV-04, EV-05]
- [x] CHK-031 [P0] orchestrate.md updated (4 runtimes) [Evidence: EV-07]
- [x] CHK-032 [P1] Install guides updated (2 files) [Evidence: EV-06]
- [x] CHK-033 [P1] CLAUDE.md updated [Evidence: EV-12]
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [x] CHK-040 [P1] Cross-refs in other skills updated [Evidence: EV-08]
- [x] CHK-041 [P1] Changelog dir renamed: `09--sk-code--full-stack` [Evidence: EV-10]
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] CHK-050 [P0] grep: 0 matches for `legacy full-stack skill identifier` [Evidence: EV-09]
- [x] CHK-051 [P0] skill_advisor.py correct [Evidence: EV-04, EV-05]
- [x] CHK-052 [P0] Folder exists with all contents [Evidence: EV-01, EV-02]
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] Spec/plan/tasks synchronized [Evidence: all four phase docs + implementation-summary synchronized on 2026-02-21]
- [x] CHK-061 [P2] Memory saved [Evidence: phase 003 included in `generate-context.js` indexed batch `#87-#93`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-02-21
<!-- /ANCHOR:summary -->
