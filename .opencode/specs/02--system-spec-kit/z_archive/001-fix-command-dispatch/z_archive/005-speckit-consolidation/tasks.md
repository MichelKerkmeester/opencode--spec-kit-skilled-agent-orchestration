---
title: "Task Breakdown: SpecKit Skill Consolidation [005-speckit-consolidation/tasks]"
description: "Detailed task breakdown for migrating .opencode/speckit/ into .opencode/skills/workflows-spec-kit/."
trigger_phrases:
  - "task"
  - "breakdown"
  - "speckit"
  - "skill"
  - "consolidation"
  - "tasks"
  - "005"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: SpecKit Skill Consolidation

Detailed task breakdown for migrating `.opencode/speckit/` into `.opencode/skills/workflows-spec-kit/`.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

<!-- ANCHOR:notation -->
## PHASE 1: FILE MIGRATION

### Task 1.1: Create Directory Structure
- [ ] Create `templates/` directory in skill folder
- [ ] Create `templates/scratch/` subdirectory
- [ ] Create `scripts/` directory in skill folder
- [ ] Create `checklists/` directory in skill folder
- [ ] Create `checklist-evidence/` directory in skill folder

**Command:**
```bash
mkdir -p .opencode/skills/workflows-spec-kit/templates/scratch
mkdir -p .opencode/skills/workflows-spec-kit/scripts
mkdir -p .opencode/skills/workflows-spec-kit/checklists
mkdir -p .opencode/skills/workflows-spec-kit/checklist-evidence
```

### Task 1.2: Copy Templates (11 items)
- [ ] Copy `spec.md`
- [ ] Copy `plan.md`
- [ ] Copy `tasks.md`
- [ ] Copy `checklist.md`
- [ ] Copy `decision-record.md`
- [ ] Copy `research/research.md`
- [ ] Copy `research-spike.md`
- [ ] Copy `handover.md`
- [ ] Copy `debug-delegation.md`
- [ ] Copy `.hashes`
- [ ] Copy `scratch/.gitkeep`

**Command:**
```bash
cp .opencode/speckit/templates/*.md .opencode/skills/workflows-spec-kit/templates/
cp .opencode/speckit/templates/.hashes .opencode/skills/workflows-spec-kit/templates/
cp .opencode/speckit/templates/scratch/.gitkeep .opencode/skills/workflows-spec-kit/templates/scratch/
```

### Task 1.3: Copy Scripts (6 items)
- [ ] Copy `common.sh`
- [ ] Copy `create-spec-folder.sh`
- [ ] Copy `check-prerequisites.sh`
- [ ] Copy `calculate-completeness.sh`
- [ ] Copy `recommend-level.sh`
- [ ] Copy `archive-spec.sh`

**Command:**
```bash
cp .opencode/speckit/scripts/*.sh .opencode/skills/workflows-spec-kit/scripts/
chmod +x .opencode/skills/workflows-spec-kit/scripts/*.sh
```

### Task 1.4: Copy Checklists (4 items)
- [ ] Copy `implementation-phase.md`
- [ ] Copy `planning-phase.md`
- [ ] Copy `research-phase.md`
- [ ] Copy `review-phase.md`

**Command:**
```bash
cp .opencode/speckit/checklists/*.md .opencode/skills/workflows-spec-kit/checklists/
```

### Task 1.5: Copy Evidence Files (2 items)
- [ ] Copy `evidence.json`
- [ ] Copy `general-evidence.json`

**Command:**
```bash
cp .opencode/speckit/checklist-evidence/*.json .opencode/skills/workflows-spec-kit/checklist-evidence/
```

### Task 1.6: Verify File Count
- [ ] Verify 24 files total in new location

**Command:**
```bash
find .opencode/skills/workflows-spec-kit -type f | wc -l
# Expected: 24 (plus existing skill files)
```

---

<!-- /ANCHOR:notation -->
## PHASE 2: SCRIPT PATH UPDATES

### Task 2.1: Update common.sh
- [ ] Line 28: Change `$script_dir/../../..` to `$script_dir/../../../..`

**File:** `.opencode/skills/workflows-spec-kit/scripts/common.sh`
**Change:**
```bash
# OLD (line 28)
local repo_root="$script_dir/../../.."

# NEW
local repo_root="$script_dir/../../../.."
```

### Task 2.2: Update create-spec-folder.sh
- [ ] Line 321: Update TEMPLATES_DIR path

**File:** `.opencode/skills/workflows-spec-kit/scripts/create-spec-folder.sh`
**Change:**
```bash
# OLD (line 321)
TEMPLATES_DIR="$REPO_ROOT/.opencode/speckit/templates"

# NEW
TEMPLATES_DIR="$REPO_ROOT/.opencode/skills/workflows-spec-kit/templates"
```

### Task 2.3: Update archive-spec.sh
- [ ] Line 30: Change `$SCRIPT_DIR/../../..` to `$SCRIPT_DIR/../../../..`

**File:** `.opencode/skills/workflows-spec-kit/scripts/archive-spec.sh`
**Change:**
```bash
# OLD (line 30)
PROJECT_ROOT="$SCRIPT_DIR/../../.."

# NEW
PROJECT_ROOT="$SCRIPT_DIR/../../../.."
```

### Task 2.4: Verify Script Execution
- [ ] Test `recommend-level.sh --help`
- [ ] Test `calculate-completeness.sh .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/005-speckit-consolidation/`
- [ ] Test `check-prerequisites.sh 005`
- [ ] Test `create-spec-folder.sh --help`
- [ ] Test `archive-spec.sh --help`

---

## PHASE 3: DOCUMENTATION UPDATES

### Task 3.1: Update AGENTS.md
- [ ] Line 341: Update templates path
- [ ] Line 352: Update scripts path
- [ ] Line 370: Update templates config path
- [ ] Search/replace all `.opencode/speckit/` occurrences

**Search:** `.opencode/speckit/`
**Replace:** `.opencode/skills/workflows-spec-kit/`

### Task 3.2: Update AGENTS (Universal).md
- [ ] Line 311: Update templates path
- [ ] Line 322: Update scripts path
- [ ] Line 339: Fix inconsistent path (add `.opencode/` prefix AND update)
- [ ] Search/replace all `.opencode/speckit/` occurrences

**Search:** `.opencode/speckit/`
**Replace:** `.opencode/skills/workflows-spec-kit/`

**Also fix:** Line 339 `speckit/templates/` → `.opencode/skills/workflows-spec-kit/templates/`

### Task 3.3: Verify Documentation Updates
- [ ] Grep for orphaned old paths in AGENTS.md
- [ ] Grep for orphaned old paths in AGENTS (Universal).md

---

## PHASE 4: SKILL REFERENCE UPDATES

### Task 4.1: Update workflows-spec-kit/SKILL.md
- [ ] Update all `.opencode/speckit/templates/` references (~65 occurrences)
- [ ] Update all `.opencode/speckit/scripts/` references

### Task 4.2: Update workflows-spec-kit/references/quick_reference.md
- [ ] Update all `cp .opencode/speckit/templates/` commands (~35 occurrences)

### Task 4.3: Update workflows-spec-kit/references/template_guide.md
- [ ] Update all template path references (~30 occurrences)

### Task 4.4: Update workflows-spec-kit/references/level_specifications.md
- [ ] Update all template paths per level (~14 occurrences)

### Task 4.5: Update workflows-spec-kit/references/path_scoped_rules.md
- [ ] Update skip path pattern (1 occurrence)

### Task 4.6: Update workflows-spec-kit/assets/template_mapping.md
- [ ] Update all copy commands (~30 occurrences)

### Task 4.7: Update workflows-memory references
- [ ] `references/alignment_scoring.md` - verify Related Skills (4 refs)
- [ ] `mcp_server/README.md` - verify any speckit refs (1 ref)

### Task 4.8: Update sk-doc references
- [ ] `assets/command_template.md` - update template path (1 ref)

### Task 4.9: Verify cli-codex and cli-gemini
- [ ] Verify command refs work (no path changes expected)

---

## PHASE 5: COMMAND YAML UPDATES

### Task 5.1: Update spec_kit_complete_auto.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (16 refs)

### Task 5.2: Update spec_kit_complete_confirm.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (14 refs)

### Task 5.3: Update spec_kit_plan_auto.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (13 refs)

### Task 5.4: Update spec_kit_plan_confirm.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (13 refs)

### Task 5.5: Update spec_kit_implement_auto.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (6 refs)

### Task 5.6: Update spec_kit_implement_confirm.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (5 refs)

### Task 5.7: Update spec_kit_research_auto.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (11 refs)

### Task 5.8: Update spec_kit_research_confirm.yaml
- [ ] Update all `.opencode/speckit/templates/` paths (11 refs)

---

## PHASE 6: VERIFICATION & TESTING

### Task 6.1: File Verification
- [ ] Count files in new location (expect 24+)
- [ ] Verify no missing files compared to source

### Task 6.2: Path Reference Verification
- [ ] Run: `grep -r "\.opencode/speckit/" --include="*.md" --include="*.yaml" --include="*.sh" . --exclude-dir=specs --exclude-dir=.opencode/speckit`
- [ ] Expect: 0 results (old paths should be gone)

### Task 6.3: Script Testing
- [ ] Run each script with `--help` or test mode
- [ ] Verify template paths resolve correctly

### Task 6.4: Command Testing
- [ ] Test `/spec_kit:complete` (create test spec folder)
- [ ] Test `/spec_kit:plan`
- [ ] Test `/spec_kit:implement`
- [ ] Test `/spec_kit:research`
- [ ] Test `/spec_kit:resume`

### Task 6.5: Skill Loading Test
- [ ] Run `openskills read workflows-spec-kit`
- [ ] Verify no file-not-found errors

---

## PHASE 7: CLEANUP (OPTIONAL)

### Task 7.1: Archive Old Folder
- [ ] Rename `.opencode/speckit/` to `.opencode/speckit-deprecated/`
- [ ] Wait for user confirmation before deletion

### Task 7.2: Delete Old Folder (User Decision)
- [ ] After verification period, delete `.opencode/speckit-deprecated/`

---

## SUMMARY

| Phase | Tasks | Files Affected |
|-------|-------|----------------|
| Phase 1 | 6 | 24 new files |
| Phase 2 | 4 | 4 scripts |
| Phase 3 | 3 | 2 AGENTS files |
| Phase 4 | 9 | 10 skill files |
| Phase 5 | 8 | 8 YAML files |
| Phase 6 | 5 | Verification only |
| Phase 7 | 2 | 1 folder |

**Total Tasks:** 37
**Total Files to Update:** 24 (new) + 24 (updates) = 48 file operations
