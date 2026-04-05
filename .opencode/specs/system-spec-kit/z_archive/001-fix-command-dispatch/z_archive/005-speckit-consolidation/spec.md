---
title: "Feature Specification [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/005-speckit-consolidation/spec]"
description: "Consolidate the standalone .opencode/speckit/ folder into the .opencode/skills/workflows-spec-kit/ skill folder, following the self-contained architecture pattern established by..."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "skill"
  - "consolidation"
  - "spec"
  - "005"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: SpecKit Skill Consolidation - Requirements & Migration Strategy

Consolidate the standalone `.opencode/speckit/` folder into the `.opencode/skills/workflows-spec-kit/` skill folder, following the self-contained architecture pattern established by `workflows-memory`.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Tags**: speckit, skills, consolidation, migration
- **Priority**: P1-High
- **Feature Branch**: `005-speckit-consolidation`
- **Created**: 2025-06-17
- **Status**: In Progress
- **Input**: User request to consolidate speckit folder into skill folder for easier updates

### Stakeholders
- Developer (primary user)
- AI agents using SpecKit skill

### Purpose
Enable users to update the SpecKit functionality by updating a single skill folder, eliminating the need to manage two separate directories (`.opencode/speckit/` and `.opencode/skills/workflows-spec-kit/`).

### Assumptions
- All templates and scripts from `.opencode/speckit/` will be moved into the skill folder
- The `workflows-memory` skill structure serves as the reference architecture pattern
- All cross-references in AGENTS.md, other skills, and commands must be updated
- Existing spec folders in `specs/` will NOT be affected (they contain copies, not references)

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Move 9 templates from `.opencode/speckit/templates/` to `.opencode/skills/workflows-spec-kit/templates/`
- Move 6 scripts from `.opencode/speckit/scripts/` to `.opencode/skills/workflows-spec-kit/scripts/`
- Move 4 phase checklists from `.opencode/speckit/checklists/`
- Move 2 evidence JSON files from `.opencode/speckit/checklist-evidence/`
- Update all path references in 16+ files across the codebase
- Update AGENTS.md and AGENTS (Universal).md
- Update all skill references (workflows-spec-kit, workflows-memory, sk-doc, cli-codex, cli-gemini)
- Update command YAML assets (8 files)
- Update script internal paths (4 scripts with hardcoded paths)

### Out of Scope
- Modifying existing spec folders in `specs/` (these are working copies)
- Changing template content (only paths)
- Removing the old `.opencode/speckit/` folder (user decision after verification)

<!-- /ANCHOR:scope -->
---

## 3. CURRENT STATE ANALYSIS

### Source Analysis (8 Parallel Agent Outputs)

#### Agent 1: Memory Skill Structure (Reference Model)
**Key Patterns Identified:**
- Self-contained architecture with bundled MCP server, database, and scripts
- Directory structure: `/mcp_server/`, `/database/`, `/scripts/`, `/references/`, `/templates/`
- Configuration files at skill root: SKILL.md, config.jsonc, filters.jsonc
- Modular library pattern in `lib/` folders
- Templates with anchor-based retrieval

#### Agent 2: Current SpecKit Skill Structure
**Current Contents:**
```
.opencode/skills/workflows-spec-kit/
├── SKILL.md (771 lines)
├── README.md (1279 lines)
├── assets/
│   ├── level_decision_matrix.md
│   └── template_mapping.md
└── references/
    ├── level_specifications.md
    ├── path_scoped_rules.md
    ├── quick_reference.md
    └── template_guide.md
```

**External Dependencies:**
- 53+ references to `.opencode/speckit/templates/`
- Templates NOT bundled (external path)
- Scripts NOT bundled (external path)

#### Agent 3: Standalone SpecKit Folder (to be consolidated)
**Contents to Move:**
```
.opencode/speckit/
├── README.md (44,723 bytes)
├── templates/ (9 templates + .hashes + scratch/)
│   ├── spec.md, plan.md, tasks.md
│   ├── checklist.md, decision-record.md
│   ├── research/research.md, research-spike.md
│   ├── handover.md, debug-delegation.md
│   └── .hashes (integrity verification)
├── scripts/ (6 scripts)
│   ├── common.sh, create-spec-folder.sh
│   ├── check-prerequisites.sh, calculate-completeness.sh
│   ├── recommend-level.sh, archive-spec.sh
├── checklists/ (4 phase checklists)
└── checklist-evidence/ (2 JSON files)
```

**Total: 24 files to migrate**

#### Agent 4: AGENTS.md References
**Path References Found:**
- AGENTS.md: 39 template/script references
- AGENTS (Universal).md: 37 template/script references
- Key paths: `.opencode/speckit/templates/` (lines 341, 352, 370)
- Inconsistency: Universal.md line 339 missing `.opencode/` prefix

#### Agent 5: Cross-Skill References
**Skills with speckit references:**
| Skill | Reference Count | Type |
|-------|-----------------|------|
| workflows-spec-kit | 53+ | Primary owner |
| workflows-memory | 6 | Related skills |
| sk-doc | 3 | Related skills |
| cli-codex | 2 | Command refs |
| cli-gemini | 2 | Command refs |

**Skills with NO speckit references:**
- mcp-chrome-devtools, workflows-code, sk-git
- mcp-code-mode, mcp-semantic-search

#### Agent 6: Command References
**YAML Assets Requiring Updates (8 files):**
1. `spec_kit_complete_auto.yaml` - 16 template refs
2. `spec_kit_complete_confirm.yaml` - 14 template refs
3. `spec_kit_plan_auto.yaml` - 13 template refs
4. `spec_kit_plan_confirm.yaml` - 13 template refs
5. `spec_kit_implement_auto.yaml` - 6 template refs
6. `spec_kit_implement_confirm.yaml` - 5 template refs
7. `spec_kit_research_auto.yaml` - 11 template refs
8. `spec_kit_research_confirm.yaml` - 11 template refs

#### Agent 7: Script Dependencies
**Internal Script Dependencies:**
```
common.sh
  └── sourced by: check-prerequisites.sh (line 84)

calculate-completeness.sh
  └── called by: archive-spec.sh (line 32)

create-spec-folder.sh (standalone)
  └── references: .opencode/speckit/templates/ (line 321)
```

**Hardcoded Paths to Update:**
| Script | Line | Current Path |
|--------|------|--------------|
| common.sh | 28 | `$script_dir/../../..` |
| create-spec-folder.sh | 321 | `$REPO_ROOT/.opencode/speckit/templates` |
| archive-spec.sh | 30 | `$SCRIPT_DIR/../../..` |
| archive-spec.sh | 32 | `$SCRIPT_DIR/calculate-completeness.sh` |

#### Agent 8: Template Usage Patterns
**Total References to Update: ~280+**
- Configuration/Documentation: 2 files (44 refs)
- Skill Files: 10 files (150+ refs)
- Script Files: 4 files (56 refs)
- Command YAML: 8 files (89 refs)

---

## 4. TARGET STATE

### New Skill Structure (Post-Migration)
```
.opencode/skills/workflows-spec-kit/
├── SKILL.md                              # Main skill (updated paths)
├── README.md                             # Documentation (merged/updated)
├── assets/
│   ├── level_decision_matrix.md
│   └── template_mapping.md
├── references/
│   ├── level_specifications.md
│   ├── path_scoped_rules.md
│   ├── quick_reference.md
│   └── template_guide.md
├── templates/                            # MOVED FROM .opencode/speckit/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── checklist.md
│   ├── decision-record.md
│   ├── research/research.md
│   ├── research-spike.md
│   ├── handover.md
│   ├── debug-delegation.md
│   ├── .hashes
│   └── scratch/
├── scripts/                              # MOVED FROM .opencode/speckit/
│   ├── common.sh
│   ├── create-spec-folder.sh
│   ├── check-prerequisites.sh
│   ├── calculate-completeness.sh
│   ├── recommend-level.sh
│   └── archive-spec.sh
├── checklists/                           # MOVED FROM .opencode/speckit/
│   ├── implementation-phase.md
│   ├── planning-phase.md
│   ├── research-phase.md
│   └── review-phase.md
└── checklist-evidence/                   # MOVED FROM .opencode/speckit/
    ├── evidence.json
    └── general-evidence.json
```

### Path Mapping
| Old Path | New Path |
|----------|----------|
| `.opencode/speckit/templates/` | `.opencode/skills/workflows-spec-kit/templates/` |
| `.opencode/speckit/scripts/` | `.opencode/skills/workflows-spec-kit/scripts/` |
| `.opencode/speckit/checklists/` | `.opencode/skills/workflows-spec-kit/checklists/` |
| `.opencode/speckit/checklist-evidence/` | `.opencode/skills/workflows-spec-kit/checklist-evidence/` |

---

## 5. USER STORIES

### User Story 1 - Skill Folder Consolidation (Priority: P0)

As a developer, I want the SpecKit skill to be self-contained so that updating the skill automatically updates all templates and scripts without managing two folders.

**Why This Priority**: P0 because this is the core objective - without consolidation, the skill remains split.

**Independent Test**: After migration, `openskills read workflows-spec-kit` should load and all template/script paths should resolve correctly.

**Acceptance Scenarios**:
1. **Given** the migration is complete, **When** I run `/spec_kit:complete`, **Then** templates are copied from the new skill folder location
2. **Given** the old folder is removed, **When** any SpecKit command runs, **Then** it functions without errors

---

### User Story 2 - Reference Updates (Priority: P0)

As an AI agent, I need all path references updated so that spec folder creation and template operations work with the new paths.

**Why This Priority**: P0 because broken references would break all SpecKit functionality.

**Acceptance Scenarios**:
1. **Given** AGENTS.md references are updated, **When** the agent follows documentation, **Then** paths resolve correctly
2. **Given** skill references are updated, **When** loading any skill, **Then** no 404/file-not-found errors occur

---

### User Story 3 - Script Path Updates (Priority: P1)

As a script user, I need internal script paths updated so that shell scripts work from the new location.

**Why This Priority**: P1 because scripts have hardcoded relative paths that must work from new depth.

**Acceptance Scenarios**:
1. **Given** scripts are moved, **When** running `create-spec-folder.sh`, **Then** it finds templates in new location
2. **Given** scripts are moved, **When** running `archive-spec.sh`, **Then** it correctly calls `calculate-completeness.sh`

---

<!-- ANCHOR:requirements -->
## 6. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** System MUST move all 9 templates to skill folder preserving content
- **REQ-FUNC-002:** System MUST move all 6 scripts to skill folder preserving content
- **REQ-FUNC-003:** System MUST update all path references from `.opencode/speckit/` to `.opencode/skills/workflows-spec-kit/`
- **REQ-FUNC-004:** Scripts MUST update relative path calculations for new directory depth
- **REQ-FUNC-005:** System MUST update 8 command YAML asset files
- **REQ-FUNC-006:** System MUST update AGENTS.md and AGENTS (Universal).md
- **REQ-FUNC-007:** System MUST update 5 skill folders with speckit references

### Traceability Mapping

| User Story | Related Requirements |
|------------|---------------------|
| Story 1 - Consolidation | REQ-FUNC-001, REQ-FUNC-002 |
| Story 2 - References | REQ-FUNC-003, REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007 |
| Story 3 - Scripts | REQ-FUNC-004 |

<!-- /ANCHOR:requirements -->
---

## 7. FILES REQUIRING UPDATES

### Documentation Files (2)
| File | References | Lines |
|------|------------|-------|
| AGENTS.md | 39 | 341, 352, 370 (key paths) |
| AGENTS (Universal).md | 37 | 311, 322, 339 (key paths) |

### Skill Files (10)
| Skill | File | References |
|-------|------|------------|
| workflows-spec-kit | SKILL.md | 65 |
| workflows-spec-kit | references/quick_reference.md | 35 |
| workflows-spec-kit | references/template_guide.md | 30 |
| workflows-spec-kit | references/level_specifications.md | 14 |
| workflows-spec-kit | references/path_scoped_rules.md | 1 |
| workflows-spec-kit | assets/template_mapping.md | 30 |
| workflows-memory | references/alignment_scoring.md | 4 |
| workflows-memory | mcp_server/README.md | 1 |
| sk-doc | assets/command_template.md | 1 |

### Command YAML Files (8)
| File | References |
|------|------------|
| spec_kit_complete_auto.yaml | 16 |
| spec_kit_complete_confirm.yaml | 14 |
| spec_kit_plan_auto.yaml | 13 |
| spec_kit_plan_confirm.yaml | 13 |
| spec_kit_implement_auto.yaml | 6 |
| spec_kit_implement_confirm.yaml | 5 |
| spec_kit_research_auto.yaml | 11 |
| spec_kit_research_confirm.yaml | 11 |

### Scripts (4 with hardcoded paths)
| Script | Updates Needed |
|--------|----------------|
| common.sh | Line 28 relative path |
| create-spec-folder.sh | Line 321 TEMPLATES_DIR |
| check-prerequisites.sh | Line 84 source path |
| archive-spec.sh | Lines 30, 32 paths |

---

## 8. RISKS & MITIGATIONS

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Broken references after migration | High | Medium | Comprehensive search/replace with verification |
| Script failures due to path depth | High | Medium | Test each script after migration |
| Missing file during move | Medium | Low | Verify file counts before/after |
| Command YAML breaks | High | Medium | Test each /spec_kit command |

### Rollback Plan
- Keep `.opencode/speckit/` until full verification
- Rollback: Revert all path changes and restore old folder
- Git provides full history for reversal

---

<!-- ANCHOR:success-criteria -->
## 9. SUCCESS CRITERIA

- [ ] All 24 files moved to skill folder
- [ ] All 280+ path references updated
- [ ] All 5 /spec_kit commands work
- [ ] All 6 scripts execute without error
- [ ] Zero file-not-found errors when loading skill
- [ ] AGENTS.md path references verified
- [ ] No broken links in skill documentation

<!-- /ANCHOR:success-criteria -->
---

## 10. RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` for migration steps
- **Reference Model**: `.opencode/skills/workflows-memory/` structure
- **Task Breakdown**: See `tasks.md` for detailed task list
