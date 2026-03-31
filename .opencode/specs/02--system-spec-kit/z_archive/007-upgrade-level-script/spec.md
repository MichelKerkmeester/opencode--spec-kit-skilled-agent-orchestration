---
title: "Feature Specification: Spec Folder Level Upgrade Script [02--system-spec-kit/z_archive/007-upgrade-level-script/spec]"
description: "Currently, create.sh only creates new spec folders at a specific level from scratch, and compose.sh builds clean templates. No tooling exists to upgrade an existing, user-popula..."
trigger_phrases:
  - "feature"
  - "specification"
  - "spec"
  - "folder"
  - "level"
  - "007"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Spec Folder Level Upgrade Script

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-15 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Currently, `create.sh` only creates new spec folders at a specific level from scratch, and `compose.sh` builds clean templates. No tooling exists to upgrade an existing, user-populated spec folder from one level to a higher one (L1→L2, L2→L3, L3→L3+). Users who start with Level 1 and realize they need higher-level documentation must manually copy sections from templates and renumber headings—error-prone and time-consuming.

### Purpose
Provide a bash script that safely upgrades existing spec folders to higher documentation levels while preserving all user-written content, injecting new template sections, and maintaining structural integrity.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Level detection of existing spec folders (reuse validate.sh logic)
- Upgrade path validation (only upward: L1→L2, L2→L3, L3→L3+)
- Skip-level upgrades via chaining (L1→L3 = L1→L2 then L2→L3)
- Backup creation before any modifications
- New file creation from addendum templates (checklist.md for L2, decision-record.md for L3)
- Section appending to plan.md and checklist.md from addendum fragments
- Section insertion into spec.md with heading renumbering
- Idempotent operation (detect and skip already-present sections)
- SPECKIT_LEVEL marker updates in all modified files
- Dry-run mode (--dry-run) for preview without changes
- Verbose mode (--verbose) for debugging
- JSON output mode (--json) for machine consumption

### Out of Scope
- Downgrading from higher to lower levels - not supported (destructive)
- Modifying implementation-summary.md - created post-implementation
- Cross-spec folder batch upgrades - single folder only
- Content migration or reformatting - only template injection
- Level detection for non-standard spec folders - requires SPECKIT_LEVEL markers

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` | Create | Main upgrade script |
| Existing spec folder files (spec.md, plan.md, checklist.md) | Modify | Add new sections, update markers |
| Backup files in spec folder | Create | Timestamped backups before modification |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detect current spec folder level | Script reads SPECKIT_LEVEL markers and validates consistency across files |
| REQ-002 | Validate upgrade path | Only allows upward upgrades; rejects invalid paths with clear error messages |
| REQ-003 | Create backups before modification | All modified files backed up to `.backup-YYYYMMDD-HHMMSS/` directory |
| REQ-004 | Add new files from templates | checklist.md created for L1→L2, decision-record.md for L2→L3, extended sections for L3→L3+ |
| REQ-005 | Update SPECKIT_LEVEL markers | All modified files reflect new level in markers |
| REQ-006 | Preserve user content | No user-written content lost or corrupted during upgrade |
| REQ-007 | Dry-run mode functional | --dry-run flag shows planned changes without modifying files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Append sections to plan.md | L2 addendum sections (Phase Dependencies, Effort Estimation, Enhanced Rollback) inserted at end |
| REQ-009 | Insert sections into spec.md | L2 sections (Non-Functional Requirements, Edge Cases, Complexity Assessment) inserted at correct positions with heading renumbering |
| REQ-010 | Idempotent operation | Running script twice produces no duplicate sections; detects existing content |
| REQ-011 | Skip-level upgrade support | L1→L3 implemented as chained L1→L2 then L2→L3 |
| REQ-012 | Verbose logging | --verbose flag outputs detailed operation logs for debugging |
| REQ-013 | JSON output mode | --json flag returns machine-parseable output with operation results |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Script successfully upgrades L1→L2, L2→L3, L3→L3+ with all template sections added and user content preserved
- **SC-002**: Dry-run mode accurately previews changes without file modifications
- **SC-003**: Idempotent operation confirmed—running twice produces identical results with no errors

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | spec.md heading renumbering complexity | High - incorrect renumbering breaks document structure | Implement robust parsing with sed/awk; test with multiple spec folder variations |
| Risk | User-modified headings break detection | Medium - script can't find insertion points | Use fuzzy matching and fallback to end-of-file insertion with warning |
| Dependency | compose.sh for template generation | High - needed to get clean addendum fragments | Verify compose.sh works for all levels before implementation |
| Dependency | validate.sh for level detection | Medium - reuse existing logic | Extract level detection function from validate.sh |
| Risk | Data corruption during section insertion | High - could destroy user content | Always create backups first; use atomic file operations |

<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Script executes in <5 seconds for typical spec folder (3-5 files)
- **NFR-P02**: Memory usage <50MB for spec folders with <100KB total size

### Security
- **NFR-S01**: No sensitive data logged (paths only, no file content in logs)
- **NFR-S02**: Backup files created with same permissions as originals

### Reliability
- **NFR-R01**: Script validates all operations before modifying files (dry-run first internally)
- **NFR-R02**: Exit codes: 0=success, 1=validation error, 2=upgrade error, 3=backup error

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty spec folder (no .md files): Script exits with error "No spec files found"
- Missing SPECKIT_LEVEL markers: Script assumes Level 1 with warning
- Mixed level markers across files: Script exits with error "Inconsistent levels detected"

### Error Scenarios
- compose.sh fails to generate templates: Script exits with error "Template generation failed"
- Insufficient disk space for backups: Script checks before backup, exits if <10MB free
- File permissions prevent modification: Script exits with error listing unwritable files

### State Transitions
- Partial upgrade (script interrupted mid-operation): Restore from backup on next run with --restore flag
- Already upgraded folder (idempotent check): Script detects existing sections, skips with message "Already at target level"

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 1 new script file, modifies 3-4 existing files per upgrade, ~1,510 LOC (initial estimate: 300-400) |
| Risk | 20/25 | High risk of content corruption, complex spec.md insertion logic, user data preservation critical |
| Research | 12/20 | Requires understanding compose.sh output format, validate.sh level detection, template structure analysis |
| **Total** | **50/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the script support custom insertion markers in user spec files (e.g., `<!-- UPGRADE_INSERT_HERE -->`)?
- What is the desired behavior if a user has modified standard heading names (e.g., "REQUIREMENTS" → "Requirements Specification")?
- Should backups be auto-cleaned after successful upgrade, or persist indefinitely?
- Do we need a --restore flag to revert from backups, or manual restore only?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
