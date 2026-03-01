---
title: "Feature Specification: sk-doc Template Folder Reorganization"
description: "The sk-doc skill stores all OpenCode component templates (skill, agent, command) in a single assets/opencode/ directory, making it hard to find templates by type. Reorganize into assets/skill/ and assets/agents/ for clarity."
trigger_phrases:
  - "sk-doc template folders"
  - "template reorganization"
  - "assets opencode"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: sk-doc Template Folder Reorganization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-28 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc skill stores all OpenCode component templates (skill, agent, command) in a single `assets/opencode/` directory. This flat structure makes it difficult to locate templates by component type and doesn't reflect the logical grouping of skill templates vs. agent/command templates.

### Purpose
Reorganize templates into `assets/skill/` (skill templates) and `assets/agents/` (agent + command templates) for better discoverability, then update all path references across the codebase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move 3 skill templates from `assets/opencode/` to `assets/skill/`
- Move 2 agent/command templates from `assets/opencode/` to `assets/agents/`
- Delete empty `assets/opencode/` directory
- Update all path references in sk-doc references/, SKILL.md
- Update all path references in .opencode/command/ files
- Update self-references within moved template files

### Out of Scope
- Template content changes - only paths change
- Adding new templates
- Restructuring other asset directories (documentation/, flowcharts/)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-doc/assets/opencode/*` | Move/Delete | Move 5 files, delete empty dir |
| `sk-doc/SKILL.md` | Modify | Update 10+ path references |
| `sk-doc/references/quick_reference.md` | Modify | Update 2 path references |
| `sk-doc/references/core_standards.md` | Modify | Update 4 path references |
| `sk-doc/references/optimization.md` | Modify | Update 3 path references |
| `sk-doc/references/validation.md` | Modify | Update 3 path references |
| `sk-doc/references/workflows.md` | Modify | Update 2 path references |
| `sk-doc/references/skill_creation.md` | Modify | Update 6 path references |
| `.opencode/command/create/assets/*.yaml` | Modify | Update 8 YAML files |
| `.opencode/command/create/*.md` | Modify | Update 4 markdown files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 template files moved to correct new locations | Files exist in `assets/skill/` and `assets/agents/` |
| REQ-002 | All path references updated across 21 files | `grep -r "assets/opencode" .opencode/` returns 0 matches |
| REQ-003 | Empty `assets/opencode/` directory deleted | Directory no longer exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Self-references within templates updated | Templates reference their new locations correctly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero occurrences of `assets/opencode` in the codebase after completion
- **SC-002**: All template links resolve correctly from their referencing files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed path reference | Broken template loading | Grep-verified comprehensive scan |
| Risk | Relative path miscalculation | Broken links | Verify each unique relative path pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- N/A - file reorganization only

### Security
- N/A - no security implications

### Reliability
- **NFR-R01**: All template references must resolve correctly after move
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Path Patterns
- Relative paths (`../assets/opencode/`) vs absolute paths (`.opencode/skill/sk-doc/assets/opencode/`)
- Generic directory references (`assets/opencode/`) vs specific file references
- Self-references within templates that describe their own location
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 21 files, mechanical changes |
| Risk | 8/25 | Low risk - path changes only |
| Research | 5/20 | Already fully explored |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None - all requirements clear
<!-- /ANCHOR:questions -->
