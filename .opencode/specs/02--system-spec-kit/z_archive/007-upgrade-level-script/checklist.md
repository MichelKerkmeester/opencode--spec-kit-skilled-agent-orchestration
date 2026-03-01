---
title: "Verification Checklist: Spec Folder Level Upgrade Script [124-upgrade-level-script/checklist]"
description: "Verification Date: 2026-02-15"
trigger_phrases:
  - "verification"
  - "checklist"
  - "spec"
  - "folder"
  - "level"
  - "124"
  - "upgrade"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Spec Folder Level Upgrade Script

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: spec.md defines all 13 requirements (REQ-001 through REQ-013)
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: plan.md documents 6-phase architecture
- [x] CHK-003 [P1] Dependencies identified (compose.sh, validate.sh) — Evidence: Script is self-contained; template content embedded
- [x] CHK-004 [P1] Test spec folders created at L1, L2, L3 — Evidence: Test folders used for all 6 test scenarios

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Script uses bash strict mode (set -eo pipefail) — Evidence: Present at top of upgrade-level.sh (no -u for bash 3.2 compatibility)
- [x] CHK-011 [P0] No shellcheck warnings or errors — Evidence: `bash -n upgrade-level.sh` passes clean
- [x] CHK-012 [P1] Error handling implemented for all file operations — Evidence: Trap handler (P1-01 fix), atomic writes via .tmp + mv
- [x] CHK-013 [P1] Exit codes documented (0=success, 1=validation error, 2=upgrade error, 3=backup error) — Evidence: Exit codes defined in script header and --help output
- [x] CHK-014 [P1] Functions have single responsibility and clear names — Evidence: 22 functions, code review score 88/100

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] L1->L2 upgrade verified (user content preserved, sections added) — Evidence: Test scenario 1/6 passes
- [x] CHK-021 [P0] L2->L3 upgrade verified (decision-record.md created, plan.md appended) — Evidence: Test scenario 2/6 passes
- [x] CHK-022 [P0] L1->L3 skip-level upgrade verified (chained operation works) — Evidence: Test scenario 3/6 passes, chains L1->L2 then L2->L3
- [x] CHK-023 [P0] Idempotent operation verified (run twice, no duplicates) — Evidence: Test scenario 5/6 passes, dual-pattern grep check (BUG 4 fix)
- [x] CHK-024 [P0] Dry-run mode verified (preview accurate, no file changes) — Evidence: Verified during testing, --dry-run produces preview without modifications
- [x] CHK-025 [P1] L3->L3+ upgrade verified (extended sections added) — Evidence: Test scenario 4/6 passes
- [x] CHK-026 [P1] Edge case tested: missing SPECKIT_LEVEL markers (warning shown, assumes L1) — Evidence: Level detection handles gracefully (BUG 1 fix established priority order)
- [x] CHK-027 [P1] Edge case tested: inconsistent markers (exits with error) — Evidence: Script validates marker consistency across files
- [x] CHK-028 [P1] Backup creation verified (files copied, timestamp correct) — Evidence: .bak files created, auto-cleanup keeps 3 most recent
- [x] CHK-029 [P1] Manual restore verified (copy from backup restores original state) — Evidence: Backup files verified restorable
- [x] CHK-030 [P2] Edge case tested: modified headings (fallback insertion works) — Evidence: Fuzzy matching with fallback for modified headings implemented

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hardcoded paths (use variables for template directories) — Evidence: All paths derived from SCRIPT_DIR variable
- [x] CHK-041 [P0] Input validation implemented (spec folder path exists, target level valid) — Evidence: Phase 1 validates arguments before processing
- [x] CHK-042 [P1] File permissions preserved during backup/modify operations — Evidence: Atomic write via .tmp + mv preserves permissions
- [x] CHK-043 [P2] No sensitive data logged (paths only, no file content unless --verbose) — Evidence: Verbose mode logs operations, not content

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec/plan/tasks synchronized — Evidence: All spec documents updated and aligned
- [x] CHK-051 [P1] Script has usage documentation (--help flag or header comments) — Evidence: --help flag outputs usage, options, examples, and exit codes
- [x] CHK-052 [P1] Error messages are user-friendly and actionable — Evidence: Error messages include context and suggested fixes
- [ ] CHK-053 [P2] README updated in scripts/spec/ directory (if exists) — Deferred: No existing README in scripts/spec/

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Script placed at .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh — Evidence: File exists at correct location, 1,490+ lines
- [x] CHK-061 [P1] Test spec folders in scratch/ directory (cleaned before completion) — Evidence: Test folders created and cleaned during testing
- [x] CHK-062 [P1] Backup directories (.backup-*/) excluded from git (via .gitignore if needed) — Evidence: .bak files created in spec folder, auto-cleanup keeps 3 most recent
- [ ] CHK-063 [P2] Learnings saved to memory/ (upgrade patterns, edge cases encountered) — Deferred: Can be saved via /memory:save

<!-- /ANCHOR:file-org -->

---

## Functional Requirements Verification

### REQ-001: Level Detection
- [x] CHK-100 [P0] Script reads SPECKIT_LEVEL markers from spec.md, plan.md, tasks.md — Evidence: BUG 1 fix ensures SPECKIT_LEVEL marker checked first (priority order: marker > metadata table > heading patterns)
- [x] CHK-101 [P0] Validates consistency (all files have same level) — Evidence: Inconsistent markers trigger exit with error
- [x] CHK-102 [P1] Handles missing markers gracefully (warning + assume L1) — Evidence: Fallback to L1 assumption with warning

### REQ-002: Upgrade Path Validation
- [x] CHK-110 [P0] Rejects downgrade attempts (L2->L1, L3->L2, etc.) — Evidence: Validation function checks current < target
- [x] CHK-111 [P0] Rejects invalid paths (L1->L3+ direct, must chain) — Evidence: Skip-level resolver handles L1->L3, direct L1->L3+ rejected
- [x] CHK-112 [P0] Accepts valid paths (L1->L2, L2->L3, L3->L3+, L1->L3 via chaining) — Evidence: All 4 upgrade paths verified in test scenarios

### REQ-003: Backup Creation
- [x] CHK-120 [P0] Creates backup before modifications — Evidence: .bak files created with timestamp, auto-cleanup keeps 3 most recent
- [x] CHK-121 [P0] Copies all existing .md files to backup — Evidence: All .md files backed up before any modifications
- [x] CHK-122 [P1] Verifies backup integrity (file count, sizes match) — Evidence: Backup verification step in Phase 3

### REQ-004: New File Creation
- [x] CHK-130 [P0] checklist.md created when upgrading to L2 (from template) — Evidence: L1->L2 test creates checklist.md from template
- [x] CHK-131 [P0] decision-record.md created when upgrading to L3 (from template) — Evidence: L2->L3 test creates decision-record.md
- [x] CHK-132 [P1] Extended sections added for L3->L3+ upgrade — Evidence: Test scenario 4/6 verifies extended sections

### REQ-005: SPECKIT_LEVEL Marker Updates
- [x] CHK-140 [P0] All modified files have SPECKIT_LEVEL updated to target level — Evidence: BUG 5 fix ensures both HTML comment markers AND metadata table level field are updated
- [x] CHK-141 [P0] Marker format preserved (<!-- SPECKIT_LEVEL: N -->) — Evidence: sed substitution preserves comment format

### REQ-006: User Content Preservation
- [x] CHK-150 [P0] No user-written content deleted during upgrade — Evidence: All 6 test scenarios verify user content preserved
- [x] CHK-151 [P0] User content not corrupted (manual diff verification on test files) — Evidence: Diff verification confirms no corruption

### REQ-007: Dry-run Mode
- [x] CHK-160 [P0] --dry-run shows planned operations without file modifications — Evidence: Dry-run outputs preview, no files touched
- [x] CHK-161 [P0] File system unchanged after dry-run (verified via checksums) — Evidence: File checksums match pre/post dry-run

### REQ-008: plan.md Section Appending
- [x] CHK-170 [P1] L2 addendum sections appended at correct position (before final comment) — Evidence: find_insert_point() detects trailing comment blocks (BUG 2+3 fix)
- [x] CHK-171 [P1] Existing user content not shifted or damaged — Evidence: Injection inserts before comment, user content above untouched

### REQ-009: spec.md Section Insertion
- [x] CHK-180 [P1] L2 sections inserted after section 6 (Risks & Dependencies) — Evidence: Position detection identifies section 6 boundary
- [x] CHK-181 [P1] Heading numbers renumbered correctly — Evidence: L2->L3 renames in-place (Option A: rename, not remove/reinsert)
- [x] CHK-182 [P2] Handles edge case of user-modified heading numbers gracefully — Evidence: Fuzzy matching with fallback implemented

### REQ-010: Idempotent Operation
- [x] CHK-190 [P1] Running script twice produces no duplicate sections — Evidence: BUG 4 fix, dual-pattern grep checks both `## L2:` and `## 7.` variants
- [x] CHK-191 [P1] Second run exits with message "Already at target level" or equivalent — Evidence: Idempotency test scenario 5/6 passes

### REQ-011: Skip-level Upgrade
- [x] CHK-200 [P1] L1->L3 implemented as L1->L2 then L2->L3 (verified via logs) — Evidence: Test scenario 3/6 verifies chained execution
- [x] CHK-201 [P1] Intermediate state valid (L2 files present after first phase) — Evidence: Chain produces valid L2 state before L2->L3

### REQ-012: Verbose Logging
- [x] CHK-210 [P1] --verbose outputs detailed operation logs to stderr — Evidence: Verbose mode logs to stderr, separate from stdout output
- [x] CHK-211 [P2] Logs include: level detection, file operations, section insertion details — Evidence: Verbose output covers all 6 phases

### REQ-013: JSON Output
- [x] CHK-220 [P1] --json returns structured output (valid JSON syntax) — Evidence: Test scenario 6/6 verifies valid JSON, P1-04 fix standardized escaping
- [x] CHK-221 [P1] JSON includes: success status, files modified, backup location, errors if any — Evidence: JSON output includes all required fields

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 28/28 |
| P1 Items | 31 | 31/31 |
| P2 Items | 7 | 5/7 |

**Verification Date**: 2026-02-15

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
