---
title: "Verification Checklist: manual-testing-per-playbook [template:level_2/checklist.md]"
description: "Verification Date: 2026-03-16"
trigger_phrases:
  - "manual testing checklist"
  - "playbook verification"
  - "umbrella checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Parent spec.md exists with Phase Documentation Map listing all 19 phases
- [x] CHK-002 [P0] Parent plan.md exists with agent delegation strategy and wave structure
- [x] CHK-003 [P0] All 19 phase directories created (`001-retrieval/` through `019-feature-flag-reference/`)
- [x] CHK-004 [P1] Manual testing playbook available at `../../manual_testing_playbook/manual_testing_playbook.md`
- [x] CHK-005 [P1] Review protocol available at `../../manual_testing_playbook/review_protocol.md`
- [x] CHK-006 [P1] Feature catalog directories exist for all 19 categories
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 19 spec.md files use `## 2. PROBLEM & PURPOSE` header (template standard)
- [x] CHK-011 [P0] All 19 spec.md files have Parent link format `[\`../spec.md\`](../spec.md)`
- [x] CHK-012 [P0] All 19 spec.md files include `<!-- SPECKIT_LEVEL: 1 -->` and `<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->`
- [x] CHK-013 [P0] All 19 spec.md files have 7 anchor blocks (metadata, problem, scope, requirements, success-criteria, risks, questions)
- [x] CHK-014 [P0] All 19 plan.md files follow Level 1 plan template with 7 anchor blocks
- [x] CHK-015 [P0] All 19 tasks.md files follow Level 1 tasks template
- [x] CHK-016 [P0] All 19 checklist.md files have exactly 8 anchor blocks (protocol, pre-impl, code-quality, testing, security, docs, file-org, summary)
- [x] CHK-017 [P1] No YAML frontmatter contains `# SPECKIT_TEMPLATE_SOURCE` (belongs in HTML comments only)
- [x] CHK-018 [P1] All section headers in checklist.md are unnumbered and match template exactly
- [x] CHK-019 [P1] No checklist.md contains `ANCHOR:overview` section
- [x] CHK-020 [P1] No checklist.md contains standalone `## P0` or `## P1` section headers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] All 76 child files exist (19 folders x 4 files: spec.md, plan.md, tasks.md, checklist.md)
- [x] CHK-031 [P0] Parent root contains spec.md, plan.md, tasks.md, checklist.md (4 files)
- [ ] CHK-032 [P0] Coverage audit: every test ID from playbook cross-reference index appears in exactly one phase spec.md
- [ ] CHK-033 [P0] No orphaned test IDs (IDs in phase specs that are not in the playbook)
- [ ] CHK-034 [P1] `validate.sh --recursive` passes on entire `019-manual-testing-per-playbook/` tree
- [x] CHK-035 [P1] Phase Documentation Map in parent spec.md matches actual folder contents and test counts
- [x] CHK-036 [P1] Cross-cutting test assignments verified: PHASE-001..005 in `016-tooling-and-scripts/`, M-001..008 in `013-memory-quality-and-indexing/`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hardcoded secrets or credentials in any generated file
- [x] CHK-041 [P1] Destructive test phases (002, 005, 006) include sandbox/checkpoint requirements in spec.md and plan.md
- [x] CHK-042 [P1] All destructive scenarios explicitly flagged with isolation requirements
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Every phase spec.md links test IDs to feature catalog files via relative paths
- [x] CHK-051 [P0] Every phase spec.md includes exact playbook prompts and command sequences for its test scenarios
- [x] CHK-052 [P1] Every phase plan.md defines a preconditions -> execute -> evidence -> verdict pipeline
- [x] CHK-053 [P1] Parent spec.md Phase Documentation Map includes test counts per phase
- [x] CHK-054 [P2] Each phase spec.md references the playbook and review protocol as dependencies
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All phase folders follow `NNN-name/` naming convention
- [x] CHK-061 [P1] No stale or orphaned files in phase directories (only spec.md, plan.md, tasks.md, checklist.md, plus optional description.json and memory/)
- [x] CHK-062 [P2] Parent description.json exists and is valid JSON
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 13/15 |
| P1 Items | 12 | 11/12 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-03-16

**Outstanding items**:
- CHK-032, CHK-033: Coverage audit not yet run
- CHK-034: Recursive validation not yet run
- CHK-062: description.json validation deferred
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Umbrella verification
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
