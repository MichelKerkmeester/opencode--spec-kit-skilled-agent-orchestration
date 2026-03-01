---
title: "Implementation Plan: workflows-spec-kit → system-spec-kit Rename [007-system-spec-kit-rename/plan]"
description: "Phase 1: Directory Rename (BLOCKING)"
trigger_phrases:
  - "implementation"
  - "plan"
  - "workflows"
  - "spec"
  - "kit"
  - "007"
  - "system"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: workflows-spec-kit → system-spec-kit Rename

## Overview

| Field | Value |
|-------|-------|
| **Spec Reference** | [spec.md](./spec.md) |
| **Estimated Effort** | 215+ replacements across 55+ files |
| **Phases** | 5 |
| **Parallelization** | Phases 2-3 fully parallelizable |

## Phase Architecture

```
Phase 1: Directory Rename (BLOCKING)
    │
    ├─► Single operation: Rename folder
    │
    ▼
Phase 2: Internal Skill Updates (PARALLEL - 6 agents)
    │
    ├─► Agent 1: SKILL.md (~14 refs)
    ├─► Agent 2: references/template_guide.md (~18 refs)
    ├─► Agent 3: references/level_specifications.md + quick_reference.md (~26 refs)
    ├─► Agent 4: assets/template_mapping.md (~17 refs)
    ├─► Agent 5: templates/*.md (~10 refs)
    └─► Agent 6: scripts/create-spec-folder.sh + references/path_scoped_rules.md (~4 refs)
    │
    ▼
Phase 3: External References (PARALLEL - 8 agents)
    │
    ├─► Agent 1: AGENTS.md (~13 refs)
    ├─► Agent 2: AGENTS (Universal).md (~17 refs)
    ├─► Agent 3: spec_kit_complete_*.yaml (~28 refs)
    ├─► Agent 4: spec_kit_plan_*.yaml (~24 refs)
    ├─► Agent 5: spec_kit_research_*.yaml (~20 refs)
    ├─► Agent 6: spec_kit_implement_*.yaml + resume_*.yaml (~12 refs)
    ├─► Agent 7: create_*.yaml + install guide (~4 refs)
    └─► Agent 8: Other skills (workflows-memory, sk-doc, cli-*) (~17 refs)
    │
    ▼
Phase 4: Verification (PARALLEL - 8 agents)
    │
    ├─► Agent 1-5: Grep verification (5 scopes)
    └─► Agent 6-8: Functional testing (3 test types)
    │
    ▼
Phase 5: Cleanup & Documentation
    │
    └─► Save context, update .spec-active marker
```

---

## Phase 1: Directory Rename

**Type**: BLOCKING (must complete before Phase 2)
**Agent**: Single orchestrator

### Step 1.1: Rename Skill Folder

```bash
mv .opencode/skills/workflows-spec-kit .opencode/skills/system-spec-kit
```

### Step 1.2: Verify Rename

```bash
ls -la .opencode/skills/ | grep spec-kit
# Should show: system-spec-kit (not workflows-spec-kit)
```

**Exit Criteria**: Directory exists at new location, old location does not exist.

---

## Phase 2: Internal Skill Updates

**Type**: PARALLEL (6 agents)
**Dependency**: Phase 1 complete

### Agent 2.1: SKILL.md

**File**: `.opencode/skills/system-spec-kit/SKILL.md`
**References**: ~14

| Line | Current | Replacement |
|------|---------|-------------|
| 2 | `name: workflows-spec-kit` | `name: system-spec-kit` |
| 52 | `.opencode/skills/workflows-spec-kit/templates/*.md` | `.opencode/skills/system-spec-kit/templates/*.md` |
| 217-268 | Template path references | Update all paths |
| 286 | assets path | Update path |
| 358 | templates location | Update path |
| 636, 685, 756 | copy instructions | Update paths |

### Agent 2.2: references/template_guide.md

**File**: `.opencode/skills/system-spec-kit/references/template_guide.md`
**References**: ~18

All references follow pattern: `.opencode/skills/workflows-spec-kit/templates/`
Replace with: `.opencode/skills/system-spec-kit/templates/`

### Agent 2.3: references/level_specifications.md + quick_reference.md

**Files**: 
- `.opencode/skills/system-spec-kit/references/level_specifications.md` (~14 refs)
- `.opencode/skills/system-spec-kit/references/quick_reference.md` (~12 refs)

**Total**: ~26 references

### Agent 2.4: assets/template_mapping.md

**File**: `.opencode/skills/system-spec-kit/assets/template_mapping.md`
**References**: ~17

Replace all: `.opencode/skills/workflows-spec-kit/templates/` → `.opencode/skills/system-spec-kit/templates/`

### Agent 2.5: templates/*.md

**Files**: All template files in `.opencode/skills/system-spec-kit/templates/`
**References**: ~10

Update copy command examples and cross-references.

### Agent 2.6: scripts + path_scoped_rules.md

**Files**:
- `.opencode/skills/system-spec-kit/scripts/create-spec-folder.sh` (line 321)
- `.opencode/skills/system-spec-kit/references/path_scoped_rules.md` (2 refs)

**Total**: ~4 references

---

## Phase 3: External References

**Type**: PARALLEL (8 agents)
**Dependency**: Phase 2 complete (to ensure paths exist)

### Agent 3.1: AGENTS.md

**File**: `AGENTS.md`
**References**: ~13

| Line | Type | Change |
|------|------|--------|
| 225 | Skill reference | `workflows-spec-kit` → `system-spec-kit` |
| 268 | Full details ref | `workflows-spec-kit` → `system-spec-kit` |
| 341, 352, 370 | Path references | Update paths |
| 809-812 | Skills XML | Update name and description |

### Agent 3.2: AGENTS (Universal).md

**File**: `AGENTS (Universal).md`
**References**: ~17

| Line | Type | Change |
|------|------|--------|
| 240, 311, 322, 339 | Path references | Update paths |
| 712 | Skills XML name | `workflows-spec-kit` → `system-spec-kit` |

### Agent 3.3: spec_kit_complete_*.yaml

**Files**:
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` (~15 refs)
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` (~13 refs)

**Total**: ~28 references

Pattern: `.opencode/skills/workflows-spec-kit/templates/` → `.opencode/skills/system-spec-kit/templates/`

### Agent 3.4: spec_kit_plan_*.yaml

**Files**:
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` (~12 refs)
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml` (~12 refs)

**Total**: ~24 references

### Agent 3.5: spec_kit_research_*.yaml

**Files**:
- `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml` (~10 refs)
- `.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml` (~10 refs)

**Total**: ~20 references

### Agent 3.6: spec_kit_implement_*.yaml + resume_*.yaml

**Files**:
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` (~5 refs)
- `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` (~5 refs)
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` (~1 ref)
- `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` (~1 ref)

**Total**: ~12 references

### Agent 3.7: create_*.yaml + Install Guide

**Files**:
- `.opencode/command/create/assets/create_skill.yaml` (2 refs)
- `.opencode/command/create/assets/create_folder_readme.yaml` (1 ref)
- `z_install_guides/PLUGIN - Opencode Skills.md` (1 ref)

**Total**: ~4 references

### Agent 3.8: Other Skills

**Files**:
- `.opencode/skills/workflows-memory/SKILL.md` (1 ref)
- `.opencode/skills/workflows-memory/references/spec_folder_detection.md` (2 refs)
- `.opencode/skills/workflows-memory/references/semantic_memory.md` (1 ref)
- `.opencode/skills/workflows-memory/references/alignment_scoring.md` (1 ref)
- `.opencode/skills/workflows-memory/references/troubleshooting.md` (1 ref)
- `.opencode/skills/sk-doc/SKILL.md` (1 ref)
- `.opencode/skills/sk-doc/references/quick_reference.md` (1 ref)
- `.opencode/skills/sk-doc/assets/command_template.md` (1 ref)
- `.opencode/skills/cli-codex/SKILL.md` (2 refs)
- `.opencode/skills/cli-gemini/SKILL.md` (2 refs)

**Total**: ~17 references

---

## Phase 4: Verification

**Type**: PARALLEL (8 agents)
**Dependency**: Phase 3 complete

### Verification Agents 4.1-4.5: Grep Checks

| Agent | Scope | Command |
|-------|-------|---------|
| 4.1 | .opencode/skills/ | `grep -r "workflows-spec-kit" .opencode/skills/` |
| 4.2 | AGENTS files | `grep -r "workflows-spec-kit" AGENTS*.md` |
| 4.3 | Command YAMLs | `grep -r "workflows-spec-kit" .opencode/command/` |
| 4.4 | Install guides | `grep -r "workflows-spec-kit" z_install_guides/` |
| 4.5 | Root config | `grep -r "workflows-spec-kit" *.json` |

**Success Criteria**: Zero matches in active files.

### Verification Agents 4.6-4.8: Functional Tests

| Agent | Test | Method |
|-------|------|--------|
| 4.6 | Skill invocation | `openskills read system-spec-kit` |
| 4.7 | Template access | Read all 9 templates from new location |
| 4.8 | Script execution | Run `create-spec-folder.sh --help` |

**Success Criteria**: All tests pass without errors.

---

## Phase 5: Cleanup & Documentation

**Type**: SEQUENTIAL
**Dependency**: Phase 4 all pass

### Step 5.1: Update .spec-active Marker (if needed)

If any spec folder uses `workflows-spec-kit` references, update marker.

### Step 5.2: Save Context

Use `/memory:save` to preserve implementation context.

### Step 5.3: Final Summary

Document:
- Total files modified
- Total replacements made
- Any issues encountered
- Verification results

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Partial rename causes broken references | Phase 1 is atomic; Phases 2-3 are all-or-nothing |
| Historical docs accidentally modified | Explicit exclusion of `specs/` directories |
| Commands break after rename | Commands use `/spec_kit:*` namespace, unchanged |
| Grep misses edge cases | Multi-pattern search (spec-kit, speckit, SpecKit) |

## Rollback Plan

If issues discovered after Phase 3:
1. Revert directory: `mv .opencode/skills/system-spec-kit .opencode/skills/workflows-spec-kit`
2. Git checkout all modified files
3. Investigate and fix issue
4. Re-attempt rename

---

## Execution Checklist

- [ ] Phase 1: Directory renamed
- [ ] Phase 2: All 6 internal agents complete
- [ ] Phase 3: All 8 external agents complete
- [ ] Phase 4: All 8 verification agents pass
- [ ] Phase 5: Context saved and documented
