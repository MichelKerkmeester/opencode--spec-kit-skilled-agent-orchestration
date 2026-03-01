---
title: "Implementation Plan: OpenCode Documentation Quality Upgrade [122-upgrade-speckit-docs/plan]"
description: "Systematic documentation quality improvement across the OpenCode system. Applied prose tightening, conciseness improvements, and style consistency patterns to ~4,864 total LOC c..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "opencode"
  - "documentation"
  - "quality"
  - "122"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: OpenCode Documentation Quality Upgrade

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | OpenCode system documentation |
| **Storage** | File system (.opencode/ directory) |
| **Testing** | Manual review, validation scripts |

### Overview
Systematic documentation quality improvement across the OpenCode system. Applied prose tightening, conciseness improvements, and style consistency patterns to ~4,864 total LOC changed (+2,649/−2,215, net +434) while preserving all technical content. Updated sk-doc to version 1.0.6.0, restructured readme_template.md, and removed unused Antigravity configuration.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Documentation quality issues identified across OpenCode system
- [x] Style patterns and improvement criteria defined
- [x] Target files identified (~85 modified + 13 untracked across .opencode/ directory)

### Definition of Done
- [x] ~85 modified + 13 untracked files completed with quality improvements
- [x] Technical content preserved in all changes
- [x] Version bumped to 1.0.6.0 in sk-doc
- [x] ~4,864 total LOC changed (+2,649/−2,215, net +434) — implementation complete, awaiting commit
- [x] All files pass validation (proper formatting, no broken structure)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation as Code - systematic quality improvements applied to markdown and config files

### Key Components
- **Documentation Files (~81 modified docs + 10 new changelogs)**: README.md files across skills, guides, scripts, templates
- **Skill Definitions (1)**: sk-doc SKILL.md with version management
- **Templates (1)**: readme_template.md providing documentation patterns
- **Configuration (3)**: opencode.json, package.json, bun.lock for system config

### Data Flow
File-by-file editing workflow: Read original → Apply quality patterns → Verify technical content preserved → Write improved version

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pattern Definition
- [x] Identify quality improvement patterns (remove superlatives, tighten prose, style consistency)
- [x] Define scope (~85 modified + 13 untracked across .opencode/ directory)
- [x] Establish preservation criteria (100% technical content retained)

### Phase 2: Core Implementation
- [x] Apply prose tightening to system-spec-kit/ README files
- [x] Apply quality improvements to 9 non-spec-kit skill READMEs
- [x] Improve other documentation files (main docs, guides, scripts)
- [x] Create 10 new CHANGELOG.md files for versioned skills
- [x] Bump sk-doc version to 1.0.6.0
- [x] Restructure readme_template.md (+191 lines of improvements)
- [x] Remove Antigravity config from opencode.json (-78 lines)
- [x] Update package.json and bun.lock for config changes

### Phase 3: Verification
- [x] Review each file for technical content preservation
- [x] Verify style consistency across all changes
- [x] Validate markdown formatting and structure
- [x] Confirm total change metrics (~4,864 LOC: +2,649/−2,215, net +434)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual Review | ~85 modified + 13 untracked files | Visual inspection, content comparison |
| Validation | Markdown structure, formatting | Markdown linters, manual checks |
| Content Verification | Technical accuracy preservation | Diff review, content audits |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git working tree | Internal | Complete | Changes already applied |
| Markdown tooling | Internal | Available | Validation and review capabilities |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Discovery of lost technical content or broken documentation structure
- **Procedure**: Git revert of specific file changes, selective restoration from commit history

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
