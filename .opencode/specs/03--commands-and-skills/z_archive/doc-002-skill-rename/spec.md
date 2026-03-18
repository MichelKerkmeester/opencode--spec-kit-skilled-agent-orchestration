---
title: "Spec: sk-doc Skill Functional Testing [002-skill-rename/spec]"
description: "The create-documentation skill was renamed to sk-doc to align with the naming convention of other workflow skills. This spec documents the testing effort to verify all..."
trigger_phrases:
  - "spec"
  - "documentation"
  - "skill"
  - "functional"
  - "testing"
  - "016"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: sk-doc Skill Functional Testing

> Comprehensive functional testing of the renamed `sk-doc` skill (formerly `create-documentation`) to verify all features work correctly after the rename.

<!-- ANCHOR:metadata -->
## Context

The `create-documentation` skill was renamed to `sk-doc` to align with the naming convention of other workflow skills. This spec documents the testing effort to verify all features still function correctly.

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:user-stories -->
## User Stories

### US1: Script Functionality
As a developer, I want all Python/Bash scripts in the skill to execute correctly so that document quality analysis and skill creation workflows function properly.

**Acceptance Criteria:**
- [ ] `extract_structure.py` produces valid JSON output
- [ ] `quick_validate.py` validates skill directories correctly
- [ ] `init_skill.py` creates skill scaffolding
- [ ] `package_skill.py` packages skills correctly
- [ ] `validate_flowchart.sh` validates flowchart syntax

### US2: CLI Functionality
As a developer, I want the `markdown-document-specialist` CLI to work correctly so that I can analyze documents from the command line.

**Acceptance Criteria:**
- [ ] `extract` subcommand produces valid JSON
- [ ] `validate` subcommand validates skill directories

### US3: Resource Accessibility
As a developer, I want all templates and references to be accessible so that the skill can guide document creation.

**Acceptance Criteria:**
- [ ] All files in `assets/` are readable
- [ ] All files in `references/` are readable
- [ ] All flowchart templates exist

### US4: Skill Invocation
As a developer, I want the skill to be invocable via the skills system so that AI agents can use it.

**Acceptance Criteria:**
- [ ] Skill name in SKILL.md is "sk-doc"
- [ ] Keywords include "sk-doc"
- [ ] Skill loads via openskills system

<!-- /ANCHOR:user-stories -->

## Technical Requirements

| Requirement | Description |
|-------------|-------------|
| Skill Path | `.opencode/skills/sk-doc/` |
| Test Output | `.opencode/specs/03--commands-and-skills/sk-doc/002-skill-rename/scratch/` |
| Scripts | Python 3.x required |
| CLI | Executable permissions on markdown-document-specialist |

<!-- ANCHOR:success-criteria -->
## Success Criteria

- All 5 scripts execute without errors
- CLI produces expected output format
- All 26 resource files are accessible
- Skill metadata is correctly updated

<!-- /ANCHOR:success-criteria -->
