---
title: "Verification Checklist: Phase 009 - Rename workflows-git to sk-git (Barter Repo) [009-sk-git-from-barter-repo/checklist]"
description: "P0 blocker checks are distributed across sections below and must all be complete."
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase"
  - "009"
  - "rename"
  - "git"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Phase 009 - Rename workflows-git to sk-git (Barter Repo)

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` [Evidence: spec.md created 2026-02-21]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [Evidence: plan.md created 2026-02-21]
- [x] CHK-003 [P1] Dependencies: Phase 005 (Public sk-git) completed [Evidence: Phase 005 status=Completed]
- [ ] CHK-004 [P1] Dependencies: Phase 008 (Barter sk-code) completed [Note: Phase 008 pending — not a blocker for this phase]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [x] CHK-010 [P0] `workflows-git/` renamed to `sk-git/` in Barter repo [Evidence: EV-01 git mv confirmed]
- [x] CHK-011 [P0] No old folder `workflows-git/` remains [Evidence: EV-01 test confirms absent]
- [x] CHK-012 [P0] All 8 files present in `sk-git/` [Evidence: EV-02 find count=8]
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:skill-md -->
## SKILL.md Updates

- [x] CHK-020 [P0] Line 2: `name: sk-git` (was `name: workflows-git`) [Evidence: git diff confirmed]
- [x] CHK-021 [P0] Line 314: `sk-code--opencode` (was `workflows-code`) [Evidence: git diff confirmed]
<!-- /ANCHOR:skill-md -->

---

<!-- ANCHOR:workflow-guide -->
## git_workflow_guide.md Updates

- [x] CHK-030 [P0] Line 9: `sk-git skill` (was `workflows-git skill`) [Evidence: git diff confirmed]
- [x] CHK-031 [P1] Line 347: `sk-git for history` (was `workflows-git for history`) [Evidence: git diff confirmed]
- [x] CHK-032 [P1] Line 358: `sk-git for pre-impl` (was `workflows-git for pre-impl`) [Evidence: git diff confirmed]
- [x] CHK-033 [P1] Line 370: `sk-git to inform` (was `workflows-git to inform`) [Evidence: git diff confirmed]
<!-- /ANCHOR:workflow-guide -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] CHK-040 [P0] `rg "workflows[-]git" .opencode/skill/sk-git/` → 0 matches [Evidence: EV-03 verified]
- [x] CHK-041 [P0] `rg "workflows[-]code" .opencode/skill/sk-git/` → 0 matches [Evidence: EV-03 verified — 2 bonus refs at lines 356, 363 also updated]
- [x] CHK-042 [P0] `find .opencode/skill/sk-git -type f | wc -l` → 8 [Evidence: EV-02 verified]
- [x] CHK-043 [P1] Old folder absent: `test ! -d .opencode/skill/workflows-git` [Evidence: EV-01 verified]
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec/plan/tasks synchronized [Evidence: all docs updated to completed state 2026-02-21]
- [ ] CHK-051 [P2] Memory saved
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 7 | 6/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-02-21
**Note**: CHK-004 (Phase 008 dependency) is pending but non-blocking. CHK-051 (memory) deferred.
<!-- /ANCHOR:summary -->
