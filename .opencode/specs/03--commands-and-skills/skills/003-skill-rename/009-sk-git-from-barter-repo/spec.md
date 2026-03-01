---
title: "Feature Specification: Phase 009 - Rename workflows-git to sk-git (Barter Repo) [009-sk-git-from-barter-repo/spec]"
description: "This is Phase 9 of the Skill Rename (038) specification. It extends the rename to the Barter repository at /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/, ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "009"
  - "rename"
  - "spec"
  - "git"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Phase 009 - Rename workflows-git to sk-git (Barter Repo)

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
| **Phase** | 9 of 9 |
| **Predecessor** | 008-sk-code-from-barter-repo |
| **Successor** | None (last phase) |
| **Handoff Criteria** | Binary-safe `rg` check for `workflows[-]git` in Barter skill folder returns `0` output lines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 9** of the Skill Rename (038) specification. It extends the rename to the Barter repository at `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/`, renaming `.opencode/skill/workflows-git/` to `.opencode/skill/sk-git/` and updating 6 internal references across 2 files.

**Scope Boundary**: Barter repo `.opencode/skill/workflows-git/` folder rename + internal file reference updates only. No external references (agents, commands, install guides, skill_advisor.py).

**Dependencies**:
- Phase 005 (Public repo sk-git) completed
- Phase 008 (Barter sk-code) should complete first

**Deliverables**:
- Renamed skill folder: Barter `.opencode/skill/sk-git/`
- Updated 6 internal references across 2 files (SKILL.md, references/git_workflow_guide.md)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Barter repository still uses the legacy `workflows-git` folder name and contains 6 stale references to old skill names within 2 files.

### Purpose
Align the Barter repo git skill with the `sk-git` naming convention already completed in the Public repo (Phase 005).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename of Barter skill folder from `workflows-git` to `sk-git`
- Update 6 internal references across 2 files

### Out of Scope
- Barter agent files, commands, install guides, skill_advisor.py (duplicated from Public repo later)
- No changelog directory (none exists for this Barter skill)
- No smoke tests (no Barter skill_advisor.py routing)
- Public repo files (already complete via Phase 005)

### Files to Change

| Category | File Path | Change Type | Ref Count |
|----------|-----------|-------------|-----------|
| Folder | `Barter: .opencode/skill/workflows-git/` | Rename to `sk-git/` | - |
| Internal | `sk-git/SKILL.md` | Modify | 2 |
| Internal | `sk-git/references/git_workflow_guide.md` | Modify | 4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename Barter skill folder | Barter `.opencode/skill/sk-git/` exists and `workflows-git/` is absent |
| REQ-002 | Update SKILL.md name field | Line 2: `name: sk-git` (was `name: workflows-git`) |
| REQ-003 | Update SKILL.md integration ref | Line 314: `sk-code--opencode` (was `workflows-code`) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Update git_workflow_guide.md refs (4 lines) | Lines 9, 347, 358, 370: `sk-git` (was `workflows-git`) |
| REQ-005 | Zero remaining legacy references | `rg "workflows[-]git" Barter/.opencode/skill/sk-git/` returns 0 matches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Verification Status

| ID | Criterion | Status | Evidence |
|----|-----------|--------|----------|
| SC-001 | Old name has 0 matches in renamed Barter skill folder | Complete | EV-03 |
| SC-002 | Skill folder exists with expected file count (8 files) | Complete | EV-01, EV-02 |
| SC-003 | All 8 internal references updated (6 planned + 2 bonus) | Complete | EV-03 |

### Acceptance Scenarios

1. **Given** the renamed Barter skill folder, **when** running `rg "workflows[-]git" .opencode/skill/sk-git/` from Barter root, **then** 0 matches.
2. **Given** the filesystem state, **when** counting files in Barter `.opencode/skill/sk-git/`, **then** count is 8.
3. **Given** the updated files, **when** checking SKILL.md line 2, **then** value is `name: sk-git`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stale `workflows-code` ref in SKILL.md line 314 | L | Updated alongside name field since file is already being modified |
| Dependency | Phase 005 (Public repo sk-git) | Complete | Naming convention established |
| Dependency | Phase 008 (Barter sk-code) | Should complete first | Same Barter repo context |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Barter skill name matches Public repo convention (`sk-git`)
- **NFR-C02**: Integration-points table references use current skill names
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Integration Reference
- The `workflows-code` reference in SKILL.md line 314 is updated to `sk-code--opencode` even though it is technically a different skill's rename. This is justified because SKILL.md is already being modified and leaving a stale reference would be internally inconsistent.

### Verification Scope
- Verification is scoped to Barter `.opencode/skill/sk-git/` only — no external Barter files in scope.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 8 internal files, 6 text changes, 1 folder rename |
| Risk | 3/25 | Minimal — internal references only, no routing changes |
| Research | 12/20 | Reference set fully enumerated and verified |
| **Total** | **20/70** | **Level 2 - Low** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
