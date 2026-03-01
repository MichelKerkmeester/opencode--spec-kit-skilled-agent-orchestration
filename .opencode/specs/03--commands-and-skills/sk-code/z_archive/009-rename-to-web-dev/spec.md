---
title: "Feature Specification: Rename workflows-code to workflows-code--web-dev [009-rename-to-web-dev/spec]"
description: "The skill directory .opencode/skill/workflows-code has a generic name that implies it handles all code workflows universally. In reality, this skill is specifically tailored for..."
trigger_phrases:
  - "feature"
  - "specification"
  - "rename"
  - "workflows"
  - "code"
  - "spec"
  - "028"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Rename workflows-code to workflows-code--web-dev

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-05 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill directory `.opencode/skill/workflows-code` has a generic name that implies it handles all code workflows universally. In reality, this skill is specifically tailored for the anobel.com Webflow web development project -- it contains Webflow-specific patterns, CDN deployment guides, minification workflows, and browser verification steps that are not applicable to general-purpose code workflows. The sibling skill `sk-code--opencode` already follows the `--suffix` naming convention for its specialization.

### Purpose
Rename the skill directory from `workflows-code` to `workflows-code--web-dev` so the name accurately reflects its web development specialization, aligning with the existing `--suffix` naming convention used by `sk-code--opencode`.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the skill directory from `workflows-code` to `workflows-code--web-dev`
- Update all active (non-archived) file references to the old directory name
- Update internal self-references within the skill's own files (SKILL.md, references, assets)

### Out of Scope
- Archived spec folders (`z_archive/`) - Historical records should not be rewritten
- Completed spec memory files - These are historical snapshots
- Functional changes to the skill itself - This is a rename only, no behavior changes
- Renaming `sk-code--opencode` - Already correctly named

### Files to Change

**Category 1: Skill directory (the rename itself)**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/workflows-code/` | Rename | Rename directory to `workflows-code--web-dev` |

**Category 2: Active configuration and system files**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Update all `workflows-code` references to `workflows-code--web-dev` |
| `AGENTS.md` | Modify | Update skill references in agent routing tables |
| `.opencode/scripts/skill_advisor.py` | Modify | Update skill name in advisor mappings |
| `.opencode/agent/orchestrate.md` | Modify | Update skill references in orchestration agent |
| `.opencode/agent/review.md` | Modify | Update skill references in review agent |
| `.opencode/command/create/assets/create_agent.yaml` | Modify | Update skill references |
| `.opencode/command/create/skill_reference.md` | Modify | Update skill references |
| `.opencode/scripts/README.md` | Modify | Update skill references |

**Category 3: Skill internal files**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/workflows-code/SKILL.md` | Modify | Update self-references (becomes `workflows-code--web-dev/SKILL.md`) |
| `.opencode/skill/workflows-code/assets/checklists/code_quality_checklist.md` | Modify | Update internal references |
| `.opencode/skill/workflows-code/references/implementation/bundling_patterns.md` | Modify | Update internal references |
| `.opencode/skill/workflows-code/references/implementation/performance_patterns.md` | Modify | Update internal references |
| `.opencode/skill/workflows-code/references/deployment/cdn_deployment.md` | Modify | Update internal references |
| `.opencode/skill/workflows-code/references/deployment/minification_guide.md` | Modify | Update internal references |
| `.opencode/skill/workflows-code/references/debugging/debugging_workflows.md` | Modify | Update internal references |

**Category 4: Other skills referencing workflows-code**

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code--opencode/SKILL.md` | Modify | Update references to sibling skill |
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | Modify | Update references to workflows-code |
| `.opencode/skill/mcp-chrome-devtools/examples/README.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md` | Modify | Update references |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` | Modify | Update references |
| `.opencode/skill/sk-doc/assets/opencode/skill_md_template.md` | Modify | Update references |

**Category 5: NOT changing (archived / historical)**

Archived specs in `z_archive/` folders and completed spec memory files will NOT be updated. These are historical records.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename `.opencode/skill/workflows-code/` to `.opencode/skill/workflows-code--web-dev/` | Directory exists at new path, old path does not exist |
| REQ-002 | Update AGENTS.md references | All `workflows-code` references (excluding `sk-code--opencode`) point to `workflows-code--web-dev` |
| REQ-003 | Update AGENTS.md references | All skill routing references updated |
| REQ-004 | Update skill_advisor.py | Skill advisor returns correct new name |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update all active skill internal references | No broken self-references within the renamed skill |
| REQ-006 | Update all cross-skill references | Other skills reference the new name correctly |
| REQ-007 | Update agent and command files | Agent routing files use the new name |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "workflows-code" .opencode/skill/ .opencode/agent/ .opencode/scripts/ .opencode/command/ AGENTS.md AGENTS.md` returns zero matches for the bare `workflows-code` name (excluding `sk-code--opencode` and `workflows-code--web-dev`)
- **SC-002**: `skill_advisor.py` correctly maps web development tasks to `workflows-code--web-dev`

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed reference in an obscure file | Broken skill routing until discovered | Run comprehensive grep before and after rename |
| Risk | `sk-code--opencode` references to sibling | Could break if references are path-based | Check all references in `sk-code--opencode/SKILL.md` |
| Dependency | No active branches using `workflows-code` path | Merge conflicts if other work in progress | Coordinate timing of rename |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should active (non-archived) spec folders under `004-workflows-code/` also have their references updated, or are those considered historical?

<!-- /ANCHOR:questions -->

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`plan.md`](./plan.md) | Implementation approach and phases |
| [`tasks.md`](./tasks.md) | Detailed task breakdown |
| [`implementation-summary.md`](./implementation-summary.md) | Post-implementation record |

---
