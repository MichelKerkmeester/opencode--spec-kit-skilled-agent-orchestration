---
title: "Feature Specification: Phase 001 — Rename legacy workflow-prefixed skill to [001-sk-code--opencode/spec]"
description: "This is Phase 1 of the Skill Rename (038) specification."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "001"
  - "rename"
  - "spec"
  - "code"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 001 — Rename legacy workflow-prefixed skill to `sk-code--opencode`

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-02-21 |
| **Completed** | 2026-02-21 |
| **Verified** | 2026-02-21 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 1 of 7 |
| **Predecessor** | 003-sk-code--full-stack (dependency satisfied; not blocking this phase) |
| **Successor** | 002-sk-code--web |
| **Handoff Criteria** | Legacy-token scan returns 0 matches in active files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 1** of the Skill Rename (038) specification.

**Scope Boundary**: ALL changes required to finalize rename of the legacy workflow-prefixed skill to `sk-code--opencode`, including filesystem transition, internal file updates, external reference updates, and verification.

**Dependencies**:
- Phase 3 (sk-code--full-stack) is satisfied for this phase and is not a blocker

**Deliverables**:
- Canonical skill folder path: `.opencode/skill/sk-code--opencode/`
- All internal references updated (35 files)
- All active-path external references updated (12 files)
- skill_advisor.py entries updated (19 lines)
- Legacy-token verification: 0 matches for the legacy workflow-prefixed token
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phase addresses a legacy workflow-prefixed naming artifact. The workflow prefix is verbose, does not distinguish skill categories well, and is inconsistent with the target `sk-*` convention for standard skills.

### Purpose
Rename the legacy workflow-prefixed skill identifier to `sk-code--opencode` across all references, maintaining full functionality while adopting the cleaner naming convention.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename from the legacy workflow-prefixed folder name to `.opencode/skill/sk-code--opencode/`
- Update all 35 internal files within the skill folder
- Update active-path external files that reference this skill (12 files)
- Update 19 lines in skill_advisor.py
- Rename changelog directory from legacy workflow-prefixed form to `07--sk-code--opencode`
- Update cross-references to this skill within other skill folders

### Out of Scope
- Renaming any other skill (handled by other phases)
- Functional changes to the skill itself
- Memory files in specs/ (auto-generated)
- Changelog file content (historical record)

### Files to Change

| Category | File Path | Change Type | Description |
|----------|-----------|-------------|-------------|
| Folder rename | `.opencode/skill/sk-code--opencode/` | Rename | Move legacy workflow-prefixed folder to canonical `sk-*` path |
| Internal | `.opencode/skill/sk-code--opencode/SKILL.md` | Modify | Update name, title, self-references |
| Internal | `.opencode/skill/sk-code--opencode/index.md` | Modify | Update name, description |
| Internal | `.opencode/skill/sk-code--opencode/nodes/*.md` (~6 files) | Modify | Update cross-references, self-references |
| Internal | `.opencode/skill/sk-code--opencode/references/*.md` (~5 files) | Modify | Update paths, cross-refs |
| Internal | `.opencode/skill/sk-code--opencode/assets/*.md` (~15 files) | Modify | Update template paths, examples |
| Internal | `.opencode/skill/sk-code--opencode/scripts/*.sh` (~3 files) | Modify | Update hard-coded paths |
| skill_advisor | `.opencode/skill/scripts/skill_advisor.py` | Modify | Update 19 lines in INTENT_BOOSTERS/MULTI_SKILL_BOOSTERS |
| Skill Registry | `.opencode/skill/README.md` | Modify | Update skill listing and links |
| Skill Cross-Ref | `.opencode/skill/sk-code--full-stack/README.md` | Modify | Update cross-skill reference |
| Skill Cross-Ref | `.opencode/skill/sk-doc/README.md` | Modify | Update cross-skill reference |
| Skill Cross-Ref | `.opencode/skill/sk-git/README.md` | Modify | Update cross-skill reference |
| Skill Cross-Ref | `.opencode/skill/system-spec-kit/README.md` | Modify | Update cross-skill reference and relative link |
| Skill Cross-Ref | `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Update routing and downstream skill references |
| Skill Cross-Ref | `.opencode/skill/system-spec-kit/nodes/rules.md` | Modify | Update routing rule reference |
| Skill Config | `.opencode/skill/system-spec-kit/config/config.jsonc` | Modify | Update indexed skill reference |
| Skill Test | `.opencode/skill/system-spec-kit/mcp_server/tests/skill-ref-config.vitest.ts` | Modify | Update indexed skill fixtures/assertions |
| Install | `.opencode/install_guides/README.md` | Modify | Update skill registry |
| Install | `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Update skill references |
| Changelog | `.opencode/changelog/07--sk-code--opencode/` | Rename | Rename directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename skill folder on disk | `ls .opencode/skill/sk-code--opencode/` exists |
| REQ-002 | Update all internal references | Legacy-token scan in `.opencode/skill/sk-code--opencode/` returns 0 matches |
| REQ-003 | Update skill_advisor.py | `python3 skill_advisor.py "opencode standards"` returns `sk-code--opencode` |
| REQ-004 | Update active-path external references | All listed active-path files use `sk-code--opencode` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Rename changelog directory | `ls .opencode/changelog/07--sk-code--opencode/` exists and legacy workflow-prefixed alias is absent |
| REQ-006 | Update cross-refs in active-path skills | sk-code--full-stack/sk-doc/sk-git/system-spec-kit references use new name |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Legacy-token scan across the active-path target set returns 0 matches
- **SC-002**: `python3 .opencode/skill/scripts/skill_advisor.py "opencode standards"` returns `sk-code--opencode`
- **SC-003**: Folder `.opencode/skill/sk-code--opencode/` exists with all files intact and changelog directory is `07--sk-code--opencode`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 predecessor alignment | Satisfied for this phase; no current blocker | Keep predecessor recorded in metadata for traceability |
| Risk | Internal file count (35) moderate volume | Med | Batch find-replace operations |
| Risk | skill_advisor.py line changes (19) | Low | Mechanical string replacement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Folder name must match skill_advisor.py entries exactly
- **NFR-C02**: All active-path external references listed in Scope must resolve to `sk-code--opencode`

### Completeness
- **NFR-CP01**: Every file referencing the legacy workflow-prefixed token must be updated; no partial renames
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Naming Patterns
- Path segments: legacy workflow-prefixed folder path -> `.opencode/skill/sk-code--opencode/`
- Bare mention in prose: legacy workflow-prefixed token -> `sk-code--opencode`
- Backtick-quoted: legacy workflow-prefixed token in backticks -> `` `sk-code--opencode` ``

### Cross-References
- Other skills may reference the legacy workflow-prefixed token in their `nodes/` files
- These should be updated by this phase (owns the reference target)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 35 internal + 12 active-path external files |
| Risk | 10/25 | Mechanical but must be exhaustive |
| Research | 18/20 | All references cataloged |
| **Total** | **43/70** | **Level 2 — Medium complexity** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — rename mapping and file inventory complete
<!-- /ANCHOR:questions -->
