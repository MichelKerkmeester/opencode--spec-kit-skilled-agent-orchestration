---
title: "Feature Specification: OpenCode Documentation Quality Upgrade [005-upgrade-speckit-docs/spec]"
description: "OpenCode system documentation across 85 files contained superlatives, marketing language, unnecessary verbiage, and style inconsistencies that reduced professional clarity. Docu..."
trigger_phrases:
  - "feature"
  - "specification"
  - "opencode"
  - "documentation"
  - "quality"
  - "spec"
  - "005"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: OpenCode Documentation Quality Upgrade

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implementation Complete — Awaiting Commit |
| **Created** | 2025-02-15 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode system documentation across 85 files contained superlatives, marketing language, unnecessary verbiage, and style inconsistencies that reduced professional clarity. Documentation needed systematic tightening to improve readability and maintainability while preserving all technical content.

### Purpose
Systematically improve documentation quality across the OpenCode system through prose tightening, conciseness improvements, and style consistency, resulting in more professional and maintainable documentation with reduced line count but preserved technical accuracy.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prose tightening: Remove superlatives, marketing language, unnecessary words
- Conciseness: Reduce verbosity while preserving technical content
- Style consistency: Apply uniform patterns (Oxford comma removal, em dash reduction, terminology standardization)
- Version management: Bump sk-doc SKILL.md version to 1.0.6.0
- Template improvement: Restructure readme_template.md for better documentation patterns
- Config cleanup: Remove unused Antigravity plugin/provider configuration

### Out of Scope
- Functional changes to code - documentation only
- New features or capabilities - quality improvements only
- Documentation structure changes - preserve existing organization
- Translation or localization - English text improvements only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/` (61 README files) | Modify | Prose tightening across mcp_server/, scripts/, shared/, templates/, config/, constitutional/ |
| `.opencode/skill/*/README.md` (9 files) | Modify | Quality improvements in mcp-code-mode, mcp-figma, workflows-* skills |
| `.opencode/README.md` | Modify | Main OpenCode documentation tightening |
| `.opencode/install_guides/README.md` | Modify | Installation guide clarity improvements |
| `.opencode/scripts/README.md` | Modify | Scripts documentation quality |
| Root `README.md` | Modify | Project-level documentation tightening |
| `AGENTS.md` | Modify | Framework documentation quality improvements |
| `system-spec-kit/SKILL.md` | Modify | Version bump to 1.0.6.0 + quality improvements |
| `sub_folder_versioning.md` | Modify | Versioning documentation tightening |
| `code_organization.md` | Modify | Organization documentation quality |
| `readme_template.md` | Modify | Template restructure (+191 lines) |
| `opencode.json` | Modify | Remove Antigravity config (-78 lines) |
| `package.json`, `bun.lock` | Modify | Dependency updates from config changes |

**Total: 85 files, ~4,864 LOC changed (+2,649/−2,215, net +434)**

**Documentation Level Justification**: This is Level 3 because total LOC changed (~4,864) far exceeds the L3 threshold (≥500 LOC), requiring formal architecture documentation and decision records for systematic documentation quality improvements across the entire OpenCode system.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 85 files modified with quality improvements | Each file contains tightened prose with no superlatives or marketing language |
| REQ-002 | Technical content preserved in all modifications | No loss of technical accuracy, instructions, or critical information |
| REQ-003 | Version bump applied to sk-doc | SKILL.md version changed from 1.0.5.0 to 1.0.6.0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Style consistency applied across all files | Oxford commas removed, "deep dive" → "detailed reference", em dashes reduced |
| REQ-005 | Total LOC changes tracked accurately | ~4,864 total LOC changed (+2,649/−2,215, net +434) documented |
| REQ-006 | Unused config removed | Antigravity plugin/provider configuration deleted from opencode.json |
| REQ-007 | Template improvements applied | readme_template.md restructured with improved patterns |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 85 files contain improved prose quality with no superlatives or marketing language
- **SC-002**: Total LOC changes accurately tracked (~4,864 total, +2,649/−2,215, net +434) while preserving 100% of technical content
- **SC-003**: Style patterns applied consistently across all modified files
- **SC-004**: Version 1.0.6.0 applied to sk-doc SKILL.md
- **SC-005**: All modified files pass validation checks (no broken links, proper formatting)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unintended content removal | High | Careful review of each change, preserve all technical content |
| Risk | Style changes break references | Medium | Verify cross-references remain valid after terminology changes |
| Risk | Template changes affect new docs | Medium | Test template with sample documentation creation |
| Dependency | Git working tree state | Low | Changes already applied, documentation is retroactive |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None (implementation complete, documentation retroactive)

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
