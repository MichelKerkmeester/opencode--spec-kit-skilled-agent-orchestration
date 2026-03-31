---
title: "Implementation Plan: [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/005-speckit-consolidation/plan]"
description: "Implementation plan for consolidating .opencode/speckit/ into .opencode/skills/workflows-spec-kit/."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "skill"
  - "consolidation"
  - "005"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: SpecKit Skill Consolidation - Technical Approach & Migration Strategy

Implementation plan for consolidating `.opencode/speckit/` into `.opencode/skills/workflows-spec-kit/`.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: speckit, migration, consolidation
- **Priority**: P1-High
- **Branch**: `005-speckit-consolidation`
- **Date**: 2025-06-17
- **Spec**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/005-speckit-consolidation/spec.md`

### Summary
Migrate all templates, scripts, and supporting files from the standalone `.opencode/speckit/` folder into the `.opencode/skills/workflows-spec-kit/` skill folder, then update all 280+ path references across the codebase to point to the new locations.

### Technical Context
- **Language/Version**: Bash scripts, Markdown documentation, YAML configs
- **Primary Dependencies**: No external dependencies
- **Target Platform**: Cross-platform (macOS/Linux)
- **Project Type**: Single project refactoring

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:architecture -->
## 2. MIGRATION ARCHITECTURE

### Directory Depth Analysis

**Current Structure:**
```
.opencode/speckit/scripts/              # Depth: 3 levels from repo root
    └── $SCRIPT_DIR/../../.. = repo root
```

**New Structure:**
```
.opencode/skills/workflows-spec-kit/scripts/  # Depth: 4 levels from repo root
    └── $SCRIPT_DIR/../../../.. = repo root
```

**Impact:** Scripts using relative paths need one additional `../` level.

### Path Transformation Rules

| Pattern | Old | New |
|---------|-----|-----|
| Templates | `.opencode/speckit/templates/` | `.opencode/skills/workflows-spec-kit/templates/` |
| Scripts | `.opencode/speckit/scripts/` | `.opencode/skills/workflows-spec-kit/scripts/` |
| Checklists | `.opencode/speckit/checklists/` | `.opencode/skills/workflows-spec-kit/checklists/` |
| Evidence | `.opencode/speckit/checklist-evidence/` | `.opencode/skills/workflows-spec-kit/checklist-evidence/` |
| Relative depth | `../../..` (3 up) | `../../../..` (4 up) |

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION PHASES

### Phase 1: File Migration (No Breaking Changes Yet)

**Goal**: Copy all files to new location without removing originals.

**Tasks:**
1. Create new directories in skill folder:
   ```bash
   mkdir -p .opencode/skills/workflows-spec-kit/templates/scratch
   mkdir -p .opencode/skills/workflows-spec-kit/scripts
   mkdir -p .opencode/skills/workflows-spec-kit/checklists
   mkdir -p .opencode/skills/workflows-spec-kit/checklist-evidence
   ```

2. Copy templates (9 files + 1 hash file):
   ```bash
   cp .opencode/speckit/templates/*.md .opencode/skills/workflows-spec-kit/templates/
   cp .opencode/speckit/templates/.hashes .opencode/skills/workflows-spec-kit/templates/
   ```

3. Copy scripts (6 files):
   ```bash
   cp .opencode/speckit/scripts/*.sh .opencode/skills/workflows-spec-kit/scripts/
   ```

4. Copy checklists (4 files):
   ```bash
   cp .opencode/speckit/checklists/*.md .opencode/skills/workflows-spec-kit/checklists/
   ```

5. Copy evidence files (2 files):
   ```bash
   cp .opencode/speckit/checklist-evidence/*.json .opencode/skills/workflows-spec-kit/checklist-evidence/
   ```

**Deliverables:**
- All files exist in both locations
- File counts verified: 24 files copied
- Content integrity verified via checksums

**Duration:** 15 minutes

---

### Phase 2: Script Path Updates

**Goal**: Update hardcoded paths in scripts to work from new location.

**Tasks:**

#### 2.1 common.sh (Line 28)
**Current:**
```bash
local repo_root="$script_dir/../../.."
```
**New:**
```bash
local repo_root="$script_dir/../../../.."
```

#### 2.2 create-spec-folder.sh (Line 321)
**Current:**
```bash
TEMPLATES_DIR="$REPO_ROOT/.opencode/speckit/templates"
```
**New:**
```bash
TEMPLATES_DIR="$REPO_ROOT/.opencode/skills/workflows-spec-kit/templates"
```

#### 2.3 check-prerequisites.sh (Line 84)
Path is relative using `$SCRIPT_DIR`, no change needed if common.sh is in same relative location.

#### 2.4 archive-spec.sh (Lines 30, 32)
**Current:**
```bash
PROJECT_ROOT="$SCRIPT_DIR/../../.."
COMPLETENESS_SCRIPT="$SCRIPT_DIR/calculate-completeness.sh"
```
**New:**
```bash
PROJECT_ROOT="$SCRIPT_DIR/../../../.."
COMPLETENESS_SCRIPT="$SCRIPT_DIR/calculate-completeness.sh"
```
(Note: COMPLETENESS_SCRIPT path unchanged as it's relative to SCRIPT_DIR)

**Deliverables:**
- 4 scripts updated with correct paths
- Each script tested in isolation

**Duration:** 30 minutes

---

### Phase 3: Documentation Reference Updates

**Goal**: Update all path references in documentation files.

#### 3.1 AGENTS.md Updates

**Search Pattern:** `.opencode/speckit/`
**Replace With:** `.opencode/skills/workflows-spec-kit/`

**Key Lines:**
- Line 341: Templates path
- Line 352: Scripts path  
- Line 370: Templates config path

**Also update any script name references with full paths.**

#### 3.2 AGENTS (Universal).md Updates

Same patterns as AGENTS.md, plus fix inconsistency at line 339 (missing `.opencode/` prefix).

**Deliverables:**
- Both AGENTS files updated
- 76 references updated across both files

**Duration:** 30 minutes

---

### Phase 4: Skill Reference Updates

**Goal**: Update all skill files with speckit references.

#### 4.1 workflows-spec-kit (Primary - 6 files, ~175 refs)

| File | Action |
|------|--------|
| SKILL.md | Find/replace `.opencode/speckit/` → `.opencode/skills/workflows-spec-kit/` |
| references/quick_reference.md | Update all `cp` commands and path refs |
| references/template_guide.md | Update all template path refs |
| references/level_specifications.md | Update template paths per level |
| references/path_scoped_rules.md | Update skip path pattern |
| assets/template_mapping.md | Update all copy commands |

#### 4.2 workflows-memory (6 refs)

| File | Action |
|------|--------|
| SKILL.md | Update Related Skills table (skill name, no path change) |
| references/*.md | Update Related Skills references |

#### 4.3 sk-doc (3 refs)

| File | Action |
|------|--------|
| SKILL.md | Update Integration table |
| assets/command_template.md | Update template path |

#### 4.4 cli-codex & cli-gemini (4 refs total)

| Skill | File | Action |
|-------|------|--------|
| cli-codex | SKILL.md | Verify command refs (no path changes needed) |
| cli-gemini | SKILL.md | Verify command refs (no path changes needed) |

**Deliverables:**
- All 10 skill files updated
- ~150+ references updated

**Duration:** 1 hour

---

### Phase 5: Command YAML Updates

**Goal**: Update all spec_kit command YAML assets.

**Files (8 total):**
```
.opencode/command/spec_kit/assets/
├── spec_kit_complete_auto.yaml
├── spec_kit_complete_confirm.yaml
├── spec_kit_plan_auto.yaml
├── spec_kit_plan_confirm.yaml
├── spec_kit_implement_auto.yaml
├── spec_kit_implement_confirm.yaml
├── spec_kit_research_auto.yaml
└── spec_kit_research_confirm.yaml
```

**Search Pattern:** `.opencode/speckit/templates/`
**Replace With:** `.opencode/skills/workflows-spec-kit/templates/`

**Deliverables:**
- All 8 YAML files updated
- ~89 references updated

**Duration:** 30 minutes

---

### Phase 6: Verification & Testing

**Goal**: Verify all changes work correctly.

#### 6.1 File Verification
```bash
# Verify all files exist in new location
ls -la .opencode/skills/workflows-spec-kit/templates/
ls -la .opencode/skills/workflows-spec-kit/scripts/
ls -la .opencode/skills/workflows-spec-kit/checklists/
ls -la .opencode/skills/workflows-spec-kit/checklist-evidence/

# Count: Should be 24 files total
find .opencode/skills/workflows-spec-kit -type f | wc -l
```

#### 6.2 Script Testing
```bash
# Test each script
.opencode/skills/workflows-spec-kit/scripts/recommend-level.sh --help
.opencode/skills/workflows-spec-kit/scripts/calculate-completeness.sh .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/005-speckit-consolidation/
.opencode/skills/workflows-spec-kit/scripts/check-prerequisites.sh 005
```

#### 6.3 Reference Verification
```bash
# Verify no old paths remain
grep -r "\.opencode/speckit/" --include="*.md" --include="*.yaml" --include="*.sh" .

# Should return 0 results (only in old folder)
```

#### 6.4 Command Testing
Test each /spec_kit command:
- `/spec_kit:complete` - Should reference new template paths
- `/spec_kit:plan` - Should reference new template paths
- `/spec_kit:implement` - Should reference new template paths
- `/spec_kit:research` - Should reference new template paths
- `/spec_kit:resume` - Should work (no template refs)

**Deliverables:**
- All scripts execute without error
- All commands function correctly
- Zero orphaned old path references

**Duration:** 1 hour

---

### Phase 7: Cleanup (Optional - User Decision)

**Goal**: Remove old `.opencode/speckit/` folder after verification.

**Prerequisites:**
- All Phase 6 verification passed
- User explicitly confirms cleanup

**Tasks:**
```bash
# Archive old folder first (safety)
mv .opencode/speckit .opencode/speckit-deprecated

# After 1 week of successful operation, delete
rm -rf .opencode/speckit-deprecated
```

**Deliverables:**
- Old folder archived or removed
- Single source of truth established

**Duration:** 5 minutes

<!-- /ANCHOR:phases -->
---

## 4. EXECUTION ORDER

```
Phase 1: File Migration
    │
    ├── Copy templates (9 files)
    ├── Copy scripts (6 files)
    ├── Copy checklists (4 files)
    └── Copy evidence (2 files)
    │
    ▼
Phase 2: Script Path Updates [CRITICAL]
    │
    ├── common.sh (line 28)
    ├── create-spec-folder.sh (line 321)
    └── archive-spec.sh (lines 30, 32)
    │
    ▼
Phase 3: Documentation Updates
    │
    ├── AGENTS.md (39 refs)
    └── AGENTS (Universal).md (37 refs)
    │
    ├─────────────────┬─────────────────┐
    ▼                 ▼                 ▼
Phase 4:          Phase 5:          [Parallel]
Skill Updates     Command Updates
(10 files)        (8 YAML files)
    │                 │
    └────────┬────────┘
             ▼
Phase 6: Verification & Testing
    │
    ├── File counts verified
    ├── Scripts tested
    ├── Commands tested
    └── No orphaned refs
    │
    ▼
Phase 7: Cleanup [USER DECISION]
```

---

## 5. FIND/REPLACE COMMANDS

### Global Path Replacement
```bash
# Primary template path
find . -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.sh" \) \
  -not -path "./specs/*" \
  -not -path "./.opencode/speckit/*" \
  -exec sed -i '' 's|\.opencode/speckit/templates/|.opencode/skills/workflows-spec-kit/templates/|g' {} \;

# Primary script path
find . -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.sh" \) \
  -not -path "./specs/*" \
  -not -path "./.opencode/speckit/*" \
  -exec sed -i '' 's|\.opencode/speckit/scripts/|.opencode/skills/workflows-spec-kit/scripts/|g' {} \;

# Generic speckit path (for any remaining)
find . -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.sh" \) \
  -not -path "./specs/*" \
  -not -path "./.opencode/speckit/*" \
  -exec sed -i '' 's|\.opencode/speckit/|.opencode/skills/workflows-spec-kit/|g' {} \;
```

### Script Depth Fix
```bash
# Update relative depth in scripts (new location is 1 level deeper)
sed -i '' 's|\$script_dir/\.\./\.\./\.\.|\$script_dir/../../../..|g' \
  .opencode/skills/workflows-spec-kit/scripts/common.sh

sed -i '' 's|\$SCRIPT_DIR/\.\./\.\./\.\.|\$SCRIPT_DIR/../../../..|g' \
  .opencode/skills/workflows-spec-kit/scripts/archive-spec.sh
```

---

## 6. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Files migrated | 24 | `find ... | wc -l` |
| Path refs updated | 280+ | `grep -r` count |
| Scripts working | 6/6 | Manual test |
| Commands working | 5/5 | Manual test |
| Orphaned refs | 0 | `grep -r ".opencode/speckit/"` |

---

## 7. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Script path depth wrong | High | Test each script after update |
| Missing file in copy | Medium | Verify counts before/after |
| YAML syntax break | High | Validate YAML after changes |
| Partial update | High | Use atomic find/replace |

### Rollback Plan
1. Keep old `.opencode/speckit/` folder until verification
2. Git provides full history for all changes
3. If issues found: `git checkout -- .` to revert all changes

---

## 8. DELIVERABLES CHECKLIST

- [ ] Phase 1: 24 files copied to new location
- [ ] Phase 2: 4 scripts updated with correct paths
- [ ] Phase 3: 2 AGENTS files updated (76 refs)
- [ ] Phase 4: 10 skill files updated (~150 refs)
- [ ] Phase 5: 8 YAML files updated (~89 refs)
- [ ] Phase 6: All verification tests pass
- [ ] Phase 7: Old folder archived (user decision)

---

## 9. ESTIMATED TIMELINE

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: File Migration | 15 min | 15 min |
| Phase 2: Script Updates | 30 min | 45 min |
| Phase 3: Doc Updates | 30 min | 1h 15min |
| Phase 4: Skill Updates | 1 hour | 2h 15min |
| Phase 5: YAML Updates | 30 min | 2h 45min |
| Phase 6: Verification | 1 hour | 3h 45min |
| Phase 7: Cleanup | 5 min | 3h 50min |

**Total Estimated Time:** ~4 hours

---

## 10. RELATED DOCUMENTS

- **Specification**: See `spec.md` for requirements and analysis
- **Task Breakdown**: See `tasks.md` for implementation checklist
- **Reference Model**: `.opencode/skills/workflows-memory/` structure
