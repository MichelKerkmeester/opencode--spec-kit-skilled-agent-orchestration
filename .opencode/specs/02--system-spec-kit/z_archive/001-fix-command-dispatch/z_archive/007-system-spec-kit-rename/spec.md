---
title: "Skill Rename: [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/007-system-spec-kit-rename/spec]"
description: "Rename the workflows-spec-kit skill to system-spec-kit across the entire codebase, ensuring all references are properly updated while preserving historical documentation."
trigger_phrases:
  - "skill"
  - "rename"
  - "workflows"
  - "spec"
  - "kit"
  - "007"
  - "system"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Skill Rename: workflows-spec-kit → system-spec-kit

<!-- ANCHOR:metadata -->
## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 008-system-spec-kit-rename |
| **Status** | Draft |
| **Level** | 2 (Verification Required) |
| **Created** | 2025-12-17 |

<!-- /ANCHOR:metadata -->
## Objective

Rename the `workflows-spec-kit` skill to `system-spec-kit` across the entire codebase, ensuring all references are properly updated while preserving historical documentation.

## Background

The skill currently named `workflows-spec-kit` provides mandatory spec folder workflow orchestration. The rename to `system-spec-kit` reflects the foundational/system-level nature of this functionality.

### Current State Analysis (from 10 parallel discovery agents)

| Category | Files | References | Action |
|----------|-------|------------|--------|
| **Skill folder (self-references)** | 30 | ~80+ | UPDATE |
| **AGENTS.md files** | 2 | 30 | UPDATE |
| **Command YAML files** | 12 | 87 | UPDATE |
| **Other skills** | 10 | 17 | UPDATE |
| **Install guides** | 1 | 1 | UPDATE |
| **Spec/memory (historical)** | 25+ | 100+ | PRESERVE |
| **Config files** | 0 | 0 | N/A |

**Total active references requiring update: ~215**
**Total historical references to preserve: ~100+**

<!-- ANCHOR:scope -->
## Scope

### In Scope

1. **Directory rename**: `.opencode/skills/workflows-spec-kit/` → `.opencode/skills/system-spec-kit/`
2. **Internal skill references**: SKILL.md, references/, assets/, scripts/, templates/
3. **External references**: AGENTS.md, AGENTS (Universal).md, command YAMLs, other skills
4. **Verification**: Comprehensive grep + functional testing

### Out of Scope

1. **Historical documentation**: All files in `specs/` directories are preserved unchanged
2. **Command namespace**: `/spec_kit:*` commands remain unchanged
3. **Brand name**: "SpecKit" in prose text remains unchanged
4. **Cache files**: `.codebase/cache.json` regenerates automatically
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Directory renamed from `workflows-spec-kit` to `system-spec-kit` | P0 |
| FR-2 | SKILL.md frontmatter `name:` field updated | P0 |
| FR-3 | All path references updated to new location | P0 |
| FR-4 | All skill name references updated | P0 |
| FR-5 | Commands continue to function after rename | P0 |
| FR-6 | Zero grep matches for old skill name in active files | P0 |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | Historical documentation preserved unchanged | P0 |
| NFR-2 | No breaking changes to command invocations | P0 |
| NFR-3 | Parallel agent verification confirms functionality | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

- [ ] Zero grep matches for `workflows-spec-kit` in `.opencode/` directory
- [ ] Zero grep matches for `workflows-spec-kit` in `AGENTS*.md` files
- [ ] All `/spec_kit:*` commands execute without errors
- [ ] Skill invocation `openskills read system-spec-kit` works
- [ ] Historical spec folders unchanged (verified by content hash)
<!-- /ANCHOR:success-criteria -->

## Reference: Previous Skill Rename

The `create-documentation` → `sk-doc` rename (documented in `.opencode/specs/03--commands-and-skills/z_archive/002-doc-skill-rename`) established these patterns:

1. **Preserve historical references** in specs/memory files
2. **Two-tier verification**: Reference grep + Functional testing
3. **Parallel verification agents** for comprehensive testing
4. **Order of operations**: Directory → Internal → External → Verify

## Files Requiring Updates

### Category 1: Skill Folder (30 files, ~80+ refs)

| File | Refs | Type |
|------|------|------|
| SKILL.md | 14 | Frontmatter + paths |
| references/template_guide.md | 18 | Path references |
| assets/template_mapping.md | 17 | Path references |
| references/level_specifications.md | 14 | Path references |
| references/quick_reference.md | 12 | Path references |
| references/path_scoped_rules.md | 2 | Path + skill name |
| templates/*.md | ~10 | Copy command examples |
| scripts/create-spec-folder.sh | 2 | Hardcoded path |

### Category 2: AGENTS Files (2 files, 30 refs)

| File | Refs | Lines |
|------|------|-------|
| AGENTS.md | 13 | 225, 268, 341, 352, 370, 809-812 |
| AGENTS (Universal).md | 17 | 240, 311, 322, 339, 712 |

### Category 3: Command YAML Files (12 files, 87 refs)

| File | Refs |
|------|------|
| spec_kit_complete_auto.yaml | 15 |
| spec_kit_complete_confirm.yaml | 13 |
| spec_kit_plan_auto.yaml | 12 |
| spec_kit_plan_confirm.yaml | 12 |
| spec_kit_research_auto.yaml | 10 |
| spec_kit_research_confirm.yaml | 10 |
| spec_kit_implement_auto.yaml | 5 |
| spec_kit_implement_confirm.yaml | 5 |
| spec_kit_resume_auto.yaml | 1 |
| spec_kit_resume_confirm.yaml | 1 |
| create_skill.yaml | 2 |
| create_folder_readme.yaml | 1 |

### Category 4: Other Skills (4 skills, 17 refs)

| Skill | Files | Refs |
|-------|-------|------|
| workflows-memory | 5 | 9 |
| sk-doc | 3 | 4 |
| cli-codex | 1 | 2 |
| cli-gemini | 1 | 2 |

### Category 5: Install Guides (1 file, 1 ref)

| File | Refs |
|------|------|
| z_install_guides/PLUGIN - Opencode Skills.md | 1 |

## Pattern Replacement Rules

| Pattern | Replace With | Scope |
|---------|--------------|-------|
| `workflows-spec-kit` | `system-spec-kit` | Skill name |
| `.opencode/skills/workflows-spec-kit/` | `.opencode/skills/system-spec-kit/` | Paths |
| `name: workflows-spec-kit` | `name: system-spec-kit` | YAML frontmatter |
| `<name>workflows-spec-kit</name>` | `<name>system-spec-kit</name>` | XML skills list |

**DO NOT replace:**
- `/spec_kit:*` command names
- `SpecKit` brand name in prose
- `spec_kit` in YAML filenames
- Historical references in `specs/` directories
