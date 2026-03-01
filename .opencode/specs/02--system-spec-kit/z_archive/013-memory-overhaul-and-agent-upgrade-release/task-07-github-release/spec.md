---
title: "Task 07 — Tagged Release [task-07-github-release/spec]"
description: "Specify the GitHub tagged release for spec 130, following PUBLIC_RELEASE.md conventions. This is the final task in the dependency chain — all documentation alignment work must b..."
trigger_phrases:
  - "task"
  - "tagged"
  - "release"
  - "spec"
  - "github"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Task 07 — Tagged Release

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Parent Spec** | 130 — Memory Overhaul & Agent Upgrade Release |
| **Task** | 07 of 07 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress (release notes prepared; publication blocked) |
| **Created** | 2026-02-16 |
| **Depends On** | Task 06 (Global README Update) |
| **Blocks** | None (final task) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## Purpose

Specify the GitHub tagged release for spec 130, following `PUBLIC_RELEASE.md` conventions. This is the final task in the dependency chain — all documentation alignment work must be committed before tagging.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## Scope

### Release Details

| Field | Value |
|-------|-------|
| **Version** | v2.1.0.0 |
| **Tag** | `v2.1.0.0` |
| **Title** | v2.1.0 — Memory Overhaul & Agent Upgrade Release |
| **Type** | Minor bump (significant non-breaking cross-system alignment) |

### Version Rationale

Minor version bump (2.0.x → 2.1.0) because:
- Cross-system documentation alignment spanning 3 tracks
- 11 source specs consolidated
- No breaking changes, but significant documentation surface area updated
- Represents a milestone in post-implementation documentation maturity

### Release Notes Structure

```
## v2.1.0 — Memory Overhaul & Agent Upgrade Release

Cross-system documentation alignment following 11 source specs (014–016 agent system, 122–129 spec-kit system) across 3 tracks.

### Agent Updates
- Handover agent verified as Haiku across all 3 platforms
- Review agent verified as model-agnostic across all 3 platforms
- Codex agent frontmatter verified in Codex-native format
- AGENTS.md routing rules verified for all spec 014 additions

### Spec-Kit Updates
- All READMEs updated to reflect 5-source pipeline, 7 intents, schema v13
- SKILL.md version and feature descriptions aligned with specs 122–129
- Reference files (memory_system.md, readme_indexing.md, etc.) verified current
- Script references updated (upgrade-level.sh, check-placeholders.sh)

### Documentation Updates
- Command configs verified for agent routing (spec 014) and script references
- Memory commands updated for 5-source pipeline and spec doc indexing
- Root README statistics and feature descriptions verified
- 3 changelog entries created (environment v2.1.0.0, spec-kit v2.2.19.0, agents v2.0.4.0)

### Breaking Changes
None. All changes are documentation alignment — no functional behavior modified.
```

### Release Command Template

```bash
gh release create v2.1.0.0 \
  --title "v2.1.0 — Memory Overhaul & Agent Upgrade Release" \
  --notes-file RELEASE_NOTES.md \
  --target main
```

### Pre-Release Checklist (from PUBLIC_RELEASE.md)

1. **Phase 1 (PLAN)**: Spec 130 spec.md approved
2. **Phase 2 (IMPLEMENT)**: Tasks 01–06 completed
3. **Phase 3 (VERIFY)**: All checklists passed
4. **Phase 4 (STAGE)**: All changes committed to main
5. **Phase 5 (PUBLISH)**: Tag created, release published
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Criteria

1. All changes from Tasks 01–06 committed to main branch
2. Git tag `v2.1.0.0` created on correct commit
3. GitHub release published with title and release notes
4. Release notes cover all 3 update categories (Agent, Spec-Kit, Documentation)
5. No breaking changes section confirms no functional changes
6. changes.md has no placeholder text
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:approval-workflow -->
## Approval Workflow

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Release Plan Review | Spec Owner | Approved | 2026-02-16 |
| All Tasks Complete | Tech Lead | Pending | Pending publication |
| Pre-Release Checklist | QA | Pending | Pending publication |
| Tag Creation Approval | Release Manager | Pending | Pending publication |
| Publication Approval | Spec Owner | Pending | Pending publication |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## Compliance Checkpoints

### Release Standards
- [ ] All changes from Tasks 01-06 committed to main branch
- [ ] All task checklists passed with evidence
- [ ] Version number follows semantic versioning
- [ ] Release notes follow PUBLIC_RELEASE.md conventions

### Quality Gates
- [ ] No placeholder text in changes.md or release notes
- [ ] Breaking changes section accurate (confirms no functional changes)
- [ ] Git tag points to correct commit
- [ ] GitHub release published successfully
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## Stakeholder Matrix

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Spec Owner | Documentation Lead | High | Release coordination |
| Release Manager | Version Control | High | Tag creation and publication |
| Tech Lead | System Architect | High | Technical accuracy of release notes |
| End Users | Developers/AI Assistants | High | Release consumption and upgrade path |
| External Contributors | Open Source Community | Medium | Public release visibility |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## Change Log

### v1.0 (2026-02-16)
**Initial task specification** — Defined GitHub release process for v2.1.0.0 following PUBLIC_RELEASE.md conventions.
<!-- /ANCHOR:changelog -->

---

## Related Documents

- **Parent**: [../spec.md](../spec.md)
- **Checklist**: [checklist.md](checklist.md)
- **Changes**: [changes.md](changes.md)
- **Dependency**: [../task-06-global-readme-update/changes.md](../task-06-global-readme-update/changes.md)
