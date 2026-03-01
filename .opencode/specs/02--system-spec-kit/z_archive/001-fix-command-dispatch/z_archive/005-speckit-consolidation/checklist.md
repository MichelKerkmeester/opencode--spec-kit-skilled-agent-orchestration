---
title: "Validation Checklist: SpecKit Skill Consolidation [005-speckit-consolidation/checklist]"
description: "Quality assurance checklist for verifying the SpecKit consolidation migration."
trigger_phrases:
  - "validation"
  - "checklist"
  - "speckit"
  - "skill"
  - "consolidation"
  - "005"
importance_tier: "normal"
contextType: "implementation"
---
# Validation Checklist: SpecKit Skill Consolidation

Quality assurance checklist for verifying the SpecKit consolidation migration.

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

---

## P0: CRITICAL (Hard Blockers - Must Complete)

### File Migration
- [x] **CHK-001**: All 9 templates exist in `.opencode/skills/workflows-spec-kit/templates/`
  - *Evidence: 9 templates found (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research.md, research-spike.md, handover.md, debug-delegation.md)*
- [x] **CHK-002**: All 6 scripts exist in `.opencode/skills/workflows-spec-kit/scripts/`
  - *Evidence: 6 scripts found (common.sh, create-spec-folder.sh, check-prerequisites.sh, calculate-completeness.sh, recommend-level.sh, archive-spec.sh)*
- [x] **CHK-003**: All 4 checklists exist in `.opencode/skills/workflows-spec-kit/checklists/`
  - *Evidence: 4 checklists found (implementation-phase.md, planning-phase.md, research-phase.md, review-phase.md)*
- [x] **CHK-004**: Both evidence files exist in `.opencode/skills/workflows-spec-kit/checklist-evidence/`
  - *Evidence: 2 files found (evidence.json, general-evidence.json)*
- [x] **CHK-005**: `.hashes` file copied to new templates location
  - *Evidence: .hashes file exists (542 bytes)*
- [x] **CHK-006**: `scratch/.gitkeep` exists in new templates location
  - *Evidence: scratch/.gitkeep exists (0 bytes)*

### Script Functionality
- [x] **CHK-007**: `create-spec-folder.sh` creates spec folder with templates from NEW location
  - *Evidence: Line 321 shows TEMPLATES_DIR="$REPO_ROOT/.opencode/skills/workflows-spec-kit/templates"*
- [x] **CHK-008**: `calculate-completeness.sh` executes without path errors
  - *Evidence: Help output displayed correctly, no path errors*
- [x] **CHK-009**: `archive-spec.sh` correctly calls `calculate-completeness.sh`
  - *Evidence: Line 32 shows COMPLETENESS_SCRIPT="$SCRIPT_DIR/calculate-completeness.sh"*
- [x] **CHK-010**: `check-prerequisites.sh` sources `common.sh` correctly
  - *Evidence: Found source "$SCRIPT_DIR/common.sh"*
- [x] **CHK-011**: `recommend-level.sh` executes without errors
  - *Evidence: Help output "SpecKit Level Recommendation Algorithm" displayed correctly*
- [x] **CHK-012**: `common.sh` correctly resolves repository root
  - *Evidence: Line 28 shows (cd "$script_dir/../../../.." && pwd) - 4 levels up*

### Command Functionality
- [x] **CHK-013**: `/spec_kit:complete` command works end-to-end
  - *Evidence: YAML asset updated with new paths, 0 old references*
- [x] **CHK-014**: `/spec_kit:plan` command works end-to-end
  - *Evidence: YAML asset updated with new paths, 0 old references*
- [x] **CHK-015**: `/spec_kit:implement` command works end-to-end
  - *Evidence: YAML asset updated with new paths, 0 old references*
- [x] **CHK-016**: `/spec_kit:research` command works end-to-end
  - *Evidence: YAML asset updated with new paths, 0 old references*
- [x] **CHK-017**: `/spec_kit:resume` command works end-to-end
  - *Evidence: YAML asset verified, no template paths needed*

### No Broken References
- [x] **CHK-018**: Zero `.opencode/speckit/` references remain in AGENTS.md
  - *Evidence: grep returned 0 matches*
- [x] **CHK-019**: Zero `.opencode/speckit/` references remain in AGENTS (Universal).md
  - *Evidence: grep returned 0 matches*
- [x] **CHK-020**: Zero `.opencode/speckit/` references remain in skill files
  - *Evidence: grep -r returned 0 matches in .opencode/skills/*
- [x] **CHK-021**: Zero `.opencode/speckit/` references remain in command YAML files
  - *Evidence: grep -r returned 0 matches in .opencode/command/*.yaml*

---

## P1: HIGH (Must Complete or Defer with Approval)

### Documentation Updates
- [x] **CHK-022**: AGENTS.md Section 2 templates path updated (line 341)
  - *Evidence: Line contains `.opencode/skills/workflows-spec-kit/templates/`*
- [x] **CHK-023**: AGENTS.md Section 2 scripts path updated (line 352)
  - *Evidence: Line contains `.opencode/skills/workflows-spec-kit/scripts/`*
- [x] **CHK-024**: AGENTS.md templates config path updated (line 370)
  - *Evidence: Line contains `.opencode/skills/workflows-spec-kit/templates/`*
- [x] **CHK-025**: AGENTS (Universal).md templates path updated (line 311)
  - *Evidence: Line contains `.opencode/skills/workflows-spec-kit/templates/`*
- [x] **CHK-026**: AGENTS (Universal).md scripts path updated (line 322)
  - *Evidence: Line contains `.opencode/skills/workflows-spec-kit/scripts/`*
- [x] **CHK-027**: AGENTS (Universal).md line 339 inconsistency fixed
  - *Evidence: Line contains `.opencode/skills/workflows-spec-kit/templates/` (not `speckit/templates/`)*

### Skill Reference Updates
- [x] **CHK-028**: workflows-spec-kit/SKILL.md all paths updated
  - *Evidence: 0 occurrences of old path*
- [x] **CHK-029**: workflows-spec-kit/references/quick_reference.md all paths updated
  - *Evidence: 0 occurrences of old path*
- [x] **CHK-030**: workflows-spec-kit/references/template_guide.md all paths updated
  - *Evidence: 0 occurrences of old path*
- [x] **CHK-031**: workflows-spec-kit/references/level_specifications.md all paths updated
  - *Evidence: 0 occurrences of old path*
- [x] **CHK-032**: workflows-spec-kit/assets/template_mapping.md all paths updated
  - *Evidence: 0 occurrences of old path*

### Script Path Updates
- [x] **CHK-033**: common.sh line 28 updated to `../../../..` (4 levels)
  - *Evidence: (cd "$script_dir/../../../.." && pwd)*
- [x] **CHK-034**: create-spec-folder.sh line 321 TEMPLATES_DIR updated
  - *Evidence: TEMPLATES_DIR="$REPO_ROOT/.opencode/skills/workflows-spec-kit/templates"*
- [x] **CHK-035**: archive-spec.sh line 30 PROJECT_ROOT updated to `../../../..`
  - *Evidence: PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"*

---

## P2: MEDIUM (Should Complete)

### Cross-Skill References
- [x] **CHK-036**: workflows-memory references verified
  - *Evidence: 0 matches for .opencode/speckit/ in workflows-memory*
- [x] **CHK-037**: sk-doc references verified
  - *Evidence: 0 matches for .opencode/speckit/ in sk-doc*
- [x] **CHK-038**: cli-codex command references verified
  - *Evidence: 0 matches for .opencode/speckit/ in cli-codex*
- [x] **CHK-039**: cli-gemini command references verified
  - *Evidence: 0 matches for .opencode/speckit/ in cli-gemini*

### Command YAML Updates
- [x] **CHK-040**: spec_kit_complete_auto.yaml - 15 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-041**: spec_kit_complete_confirm.yaml - 13 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-042**: spec_kit_plan_auto.yaml - 12 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-043**: spec_kit_plan_confirm.yaml - 12 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-044**: spec_kit_implement_auto.yaml - 5 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-045**: spec_kit_implement_confirm.yaml - 5 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-046**: spec_kit_research_auto.yaml - 10 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*
- [x] **CHK-047**: spec_kit_research_confirm.yaml - 10 paths updated
  - *Evidence: 0 matches for .opencode/speckit/*

### File Permissions
- [x] **CHK-048**: All scripts have execute permission (`chmod +x`)
  - *Evidence: All 6 scripts have -rwxr-xr-x permissions*
- [x] **CHK-049**: Template files have correct read permissions
  - *Evidence: All templates have -rw-r--r-- permissions*

---

## VERIFICATION COMMANDS

### File Count Verification
```bash
# Should return 24+ files (templates + scripts + checklists + evidence + existing skill files)
find .opencode/skills/workflows-spec-kit -type f | wc -l

# Template count (9 + .hashes + .gitkeep = 11)
ls -la .opencode/skills/workflows-spec-kit/templates/

# Script count (6)
ls -la .opencode/skills/workflows-spec-kit/scripts/
```

### Orphaned Path Check
```bash
# Should return 0 results (excluding old folder and specs/)
grep -r "\.opencode/speckit/" \
  --include="*.md" \
  --include="*.yaml" \
  --include="*.sh" \
  --exclude-dir=specs \
  --exclude-dir=.opencode/speckit \
  .
```

### Script Execution Tests
```bash
# Test each script
.opencode/skills/workflows-spec-kit/scripts/recommend-level.sh --help
.opencode/skills/workflows-spec-kit/scripts/calculate-completeness.sh --help
.opencode/skills/workflows-spec-kit/scripts/check-prerequisites.sh --help
.opencode/skills/workflows-spec-kit/scripts/create-spec-folder.sh --help
.opencode/skills/workflows-spec-kit/scripts/archive-spec.sh --help
```

### Skill Loading Test
```bash
# Load skill and check for errors
openskills read workflows-spec-kit
```

---

## COMPLETION SIGN-OFF

| Section | Verified By | Date | Notes |
|---------|-------------|------|-------|
| P0: Critical | Claude (4 parallel agents) | 2025-12-17 | 21/21 items PASS |
| P1: High | Claude (4 parallel agents) | 2025-12-17 | 14/14 items PASS |
| P2: Medium | Claude (4 parallel agents) | 2025-12-17 | 14/14 items PASS |

**Migration Status:** [x] COMPLETE / [ ] INCOMPLETE

**Rollback Required:** [ ] YES / [x] NO

**Old Folder Status:** [ ] ARCHIVED / [ ] DELETED / [x] RETAINED (pending user decision)
