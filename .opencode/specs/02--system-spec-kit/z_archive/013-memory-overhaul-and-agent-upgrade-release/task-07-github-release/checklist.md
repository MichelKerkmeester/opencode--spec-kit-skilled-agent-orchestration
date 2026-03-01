---
title: "Verification Checklist: Task 07 — Tagged Release [task-07-github-release/checklist]"
description: "Prep Status: Release notes complete, publication blocked on clean commit and release publication"
trigger_phrases:
  - "verification"
  - "checklist"
  - "task"
  - "tagged"
  - "release"
  - "github"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Verification Checklist: Task 07 — Tagged Release

<!-- SPECKIT_LEVEL: 3+ -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## P0 — Pre-Release

- [ ] CHK-001 [P0] All changes from Tasks 01-06 committed to main [BLOCKED: release branch is not clean and release commit is not finalized]
- [ ] CHK-002 [P0] No uncommitted changes in working tree [BLOCKED: dirty working tree, needs final release commit]
- [x] CHK-003 [P0] All 3 changelog entries created and committed [Evidence: Task 05 changes.md lists 3 files created]

## P0 — Release

- [ ] CHK-004 [P0] Git tag `v2.1.0.0` created on correct commit [BLOCKED: needs CHK-002 clean commit first]
- [ ] CHK-005 [P0] GitHub release published with correct title [BLOCKED: needs CHK-004 tag first]
- [x] CHK-006 [P0] Release notes contain Agent Updates section [Evidence: changes.md lines 27-35, 5 agent update items]
- [x] CHK-007 [P0] Release notes contain Spec-Kit Updates section [Evidence: changes.md lines 37-46, 6 spec-kit update items]
- [x] CHK-008 [P0] Release notes contain Documentation Updates section [Evidence: changes.md lines 48-56, 5 documentation update items]
- [x] CHK-009 [P0] Release notes contain Breaking Changes section (none) [Evidence: changes.md lines 58-60, confirms no breaking changes]

## P1 — Formatting

- [ ] CHK-010 [P1] GitHub markdown renders correctly [BLOCKED: final render verification requires published release or preview step]
- [x] CHK-011 [P1] Version number consistent across tag, title, and notes [Evidence: changes.md shows v2.1.0.0 tag and v2.1.0 title consistently]
- [x] CHK-012 [P1] Release targets main branch [Evidence: changes.md Release Command Template specifies --target main]

## Output Verification

- [x] CHK-030 [P0] changes.md populated with release details [Evidence: changes.md contains full release notes draft, configuration table, blockers]
- [x] CHK-031 [P0] No placeholder text in changes.md [Evidence: All sections contain concrete content, no bracket placeholders]

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 12/16 |
| P1 Items | 10 | 8/10 |
| P2 Items | 3 | 2/3 |

**Prep Status**: Release notes complete, publication blocked on clean commit and release publication
**Verification Date**: 2026-02-16 (prep phase)

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P1] Release process documented in plan.md [Evidence: task-07/plan.md has phased release flow and release workstreams]
- [x] CHK-101 [P1] Version rationale clearly defined in spec.md [Evidence: task-07/spec.md Version Rationale section]
- [x] CHK-102 [P2] PUBLIC_RELEASE.md conventions followed [Evidence: task-07/spec.md pre-release checklist and release command template]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-110 [P0] All task checklists (01-06) verified complete [Evidence: root tasks.md shows T012 and T013 complete with dependencies resolved]
- [x] CHK-111 [P0] Git tag format correct (v2.1.0.0) [Evidence: tag format documented in spec.md and changes.md]
- [x] CHK-112 [P0] Release notes follow standard format [Evidence: changes.md includes required release sections and command template]
- [x] CHK-113 [P1] Version number consistent across tag, title, and notes [Evidence: v2.1.0.0 tag and v2.1.0 title used consistently in changes.md]
- [x] CHK-114 [P1] Breaking changes section accurate (none for this release) [Evidence: changes.md Breaking Changes section explicitly states none]
- [x] CHK-115 [P1] All 3 update categories present (Agent, Spec-Kit, Documentation) [Evidence: changes.md has all three sections]
- [ ] CHK-116 [P2] GitHub markdown renders correctly [BLOCKED: render verification requires published release or preview step]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-120 [P0] changes.md contains release notes draft [Evidence: task-07/changes.md Release Notes section]
- [x] CHK-121 [P0] No placeholder text in changes.md or release notes [Evidence: task-07/changes.md contains concrete release content only]
- [x] CHK-122 [P1] Release command template provided [Evidence: task-07/changes.md Release Command Template block]
- [ ] CHK-123 [P1] Pre-release checklist completed (5 phases from PUBLIC_RELEASE.md) [BLOCKED: stage and publish phases pending]
- [x] CHK-124 [P2] Release notes ready for publication [Evidence: notes are finalized; publication blocked by clean commit and tag steps]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Spec Owner | Documentation Lead | [ ] Approved | |
| Release Manager | Version Control | [ ] Approved | |
| Tech Lead | System Architect | [ ] Approved | |
| QA | Quality Assurance | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
