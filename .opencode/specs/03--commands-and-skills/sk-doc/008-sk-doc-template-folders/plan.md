---
title: "Implementation Plan: sk-doc Template Folder Reorganization"
description: "Move sk-doc templates from assets/opencode/ into assets/skill/ and assets/agents/, then update all path references across 21 files."
trigger_phrases:
  - "sk-doc template plan"
  - "template folder plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: sk-doc Template Folder Reorganization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML |
| **Framework** | OpenCode skill system |
| **Storage** | File system |
| **Testing** | Grep verification |

### Overview
Move 5 template files from `assets/opencode/` to two new directories (`assets/skill/` and `assets/agents/`), then perform find-and-replace across 21 files to update all path references. Verify with grep that zero references to the old path remain.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Zero `assets/opencode` references remain
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File system reorganization with cross-reference updates

### Key Components
- **assets/skill/**: New home for skill_md_template.md, skill_asset_template.md, skill_reference_template.md
- **assets/agents/**: New home for agent_template.md, command_template.md

### Data Flow
Templates are referenced by: SKILL.md → references/*.md → command/*.yaml → command/*.md
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: File Moves
- [x] Move 3 skill templates to assets/skill/
- [x] Move 2 agent/command templates to assets/agents/
- [x] Delete empty assets/opencode/ directory

### Phase 2: Reference Updates
- [x] Update sk-doc/SKILL.md (10+ references)
- [x] Update 6 reference files in sk-doc/references/
- [x] Update 8 YAML files in command/create/assets/
- [x] Update 4 markdown files in command/create/
- [x] Update self-references in moved template files

### Phase 3: Verification
- [x] Grep verification: zero `assets/opencode` references
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All files in .opencode/ | grep -r "assets/opencode" |
| Link check | Template relative paths | Manual verification |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken template references discovered
- **Procedure**: `git checkout -- .opencode/skill/sk-doc/ .opencode/command/create/`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (File Moves) ──► Phase 2 (Reference Updates) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| File Moves | None | Reference Updates |
| Reference Updates | File Moves | Verification |
| Verification | Reference Updates | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| File Moves | Low | Minimal |
| Reference Updates | Medium | Moderate (21 files) |
| Verification | Low | Minimal |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Git status clean (can revert)

### Rollback Procedure
1. `git checkout -- .opencode/skill/sk-doc/ .opencode/command/create/`
2. Verify templates are back in assets/opencode/

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
