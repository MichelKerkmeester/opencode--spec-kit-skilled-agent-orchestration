---
title: "Implementation Plan: Spec Folder Level Upgrade Script [124-upgrade-level-script/plan]"
description: "Implement upgrade-level.sh as a bash script that orchestrates spec folder upgrades using compose.sh-generated templates, validate.sh-derived level detection, and careful content..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "spec"
  - "folder"
  - "level"
  - "124"
  - "upgrade"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Spec Folder Level Upgrade Script

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ |
| **Framework** | N/A (shell script) |
| **Storage** | Filesystem (spec folder structure) |
| **Testing** | Manual validation with test spec folders |

### Overview
Implement `upgrade-level.sh` as a bash script that orchestrates spec folder upgrades using compose.sh-generated templates, validate.sh-derived level detection, and careful content injection with backup protection. Core operations: detect level → validate upgrade path → backup files → compose templates → inject sections → update markers → verify integrity.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (compose.sh, validate.sh, template structure)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-013)
- [x] Tests passing (manual validation on L1, L2, L3 spec folders)
- [x] Docs updated (spec/plan/tasks/checklist)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Procedural bash script with modular functions (detect_level, validate_upgrade_path, backup_files, inject_sections, update_markers)

### Key Components
- **Level Detector**: Reads SPECKIT_LEVEL markers, validates consistency
- **Backup Manager**: Creates timestamped backup directory, copies files
- **Template Composer**: Calls compose.sh to generate clean level templates
- **Section Injector**: Parses existing files, inserts new sections at correct positions
- **Marker Updater**: Updates SPECKIT_LEVEL markers in modified files
- **Validation Engine**: Checks idempotency, verifies no content loss

### Data Flow
```
User invokes script with spec folder path and target level
  ↓
Detect current level (read SPECKIT_LEVEL markers)
  ↓
Validate upgrade path (only upward, resolve skip-levels)
  ↓
Create backup directory with timestamp
  ↓
Call compose.sh to generate templates for target level
  ↓
For each file to modify:
  - Parse existing content
  - Identify insertion points
  - Inject new sections from template
  - Update SPECKIT_LEVEL marker
  - Write to temp file
  - Atomic rename
  ↓
Verify operation (check for duplicates, content preservation)
  ↓
Report results (verbose/JSON/standard output)
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure
- [x] Script argument parsing (--dry-run, --verbose, --json flags)
- [x] Level detection function (extract from validate.sh)
- [x] Upgrade path validation logic
- [x] Backup creation function
- [x] Logging framework (verbose mode, JSON mode)

### Phase 2: Template Integration
- [x] compose.sh integration for generating target level templates
- [x] Template parsing functions (extract addendum sections)
- [x] File modification orchestration (loop through spec.md, plan.md, etc.)
- [x] New file creation (checklist.md for L2, decision-record.md for L3)

### Phase 3: Section Injection Logic
- [x] spec.md section insertion with heading renumbering
- [x] plan.md section appending (end-of-file insertion)
- [x] checklist.md section appending (if L2→L3)
- [x] SPECKIT_LEVEL marker updates
- [x] Idempotency checks (detect existing sections)

### Phase 4: Verification & Testing
- [x] Create test spec folders at L1, L2, L3
- [x] Test L1→L2 upgrade path
- [x] Test L2→L3 upgrade path
- [x] Test L1→L3 skip-level upgrade
- [x] Test idempotent operation (run twice, verify no duplicates)
- [x] Test dry-run mode
- [x] Verify backup restore process
- [x] Edge case testing (missing markers, modified headings)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Individual functions (level detection, backup) | Manual bash function testing |
| Integration | Full upgrade workflow L1→L2→L3 | Test spec folders with known content |
| Manual | User scenarios (upgrade existing work) | Real spec folders from system-spec-kit |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| shell-common.sh | Internal | Green | Cannot use utility functions; implement inline fallbacks |
| Template files (level_1/, level_2/, level_3/, level_3plus/) | Internal | Green | Cannot inject sections; hard-code template content |
| Bash 3.2+ | External | Green | Script may fail on older bash; macOS default is 3.2 |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Upgrade corrupts spec files, user reports content loss
- **Procedure**: Restore from `.backup-YYYYMMDD-HHMMSS/` directory; future enhancement: add --restore flag

<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Core Infrastructure) ──┐
                                 ├──► Phase 2 (Templates) ──► Phase 3 (Injection) ──► Phase 4 (Verification)
                                 └──────────────────────────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Core Infrastructure | None | Templates, Injection, Verification |
| Template Integration | Core Infrastructure | Injection |
| Section Injection | Core Infrastructure, Templates | Verification |
| Verification | All previous | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Core Infrastructure | Medium | 2-3 hours |
| Template Integration | Low | 1-2 hours |
| Section Injection | High | 4-6 hours (spec.md heading renumbering is complex) |
| Verification | Medium | 2-3 hours |
| **Total** | | **9-14 hours** |

**Uncertainty factors:**
- spec.md insertion complexity may exceed estimate if edge cases emerge
- Idempotency detection may require additional iteration time
- Real-world spec folder variations may require extra handling

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup mechanism tested (create and restore verified)
- [ ] Dry-run mode produces accurate preview
- [ ] Test spec folders validated before live use

### Rollback Procedure
1. Immediate action: Stop using script if corruption detected
2. Restore from backup: `cp -R .backup-YYYYMMDD-HHMMSS/* .`
3. Verify rollback: Check SPECKIT_LEVEL markers and file content integrity
4. Notify user: Report issue, suggest manual upgrade or wait for fix

### Data Reversal
- **Has data migrations?** No (file-based only, no database)
- **Reversal procedure**: Direct file copy from backup directory

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
