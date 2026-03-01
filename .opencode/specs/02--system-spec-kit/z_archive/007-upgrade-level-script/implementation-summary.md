---
title: "Implementation Summary [124-upgrade-level-script/implementation-summary]"
description: "A bash script (upgrade-level.sh) that upgrades existing spec folders between documentation levels (L1->L2, L2->L3, L3->L3+, and skip-level L1->L3). The script is 1,490+ lines wi..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "implementation summary"
  - "124"
  - "upgrade"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 124-upgrade-level-script |
| **Completed** | 2026-02-15 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bash script (`upgrade-level.sh`) that upgrades existing spec folders between documentation levels (L1->L2, L2->L3, L3->L3+, and skip-level L1->L3). The script is 1,490+ lines with 22 functions organized into a 6-phase architecture: input validation, level detection, backup creation, file upgrade (section injection and new file creation), marker updates, and output generation. It is fully compatible with bash 3.2+ (macOS) and supports dry-run, verbose, and JSON output modes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` | Created | Main upgrade script (1,490+ lines, 22 functions) |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bash 3.2+ compatibility (no associative arrays, no `${var^^}`) | macOS ships with bash 3.2; broad compatibility without requiring brew-installed bash 5 |
| `_sed_inplace()` wrapper function | macOS `sed -i` requires `''` argument, GNU does not; wrapper abstracts the difference |
| L2->L3 renames headings in-place (Option A) | Simpler than removing and reinserting; avoids content displacement and ordering issues |
| Shared `find_insert_point()` for comment block detection | BUG 2+3 fix; backward scan finds opening `<!--` not just `-->`, used by all injection functions |
| Dual-pattern idempotency check | BUG 4 fix; checks both `## L2:` prefixed and `## 7.` numbered heading variants after L2->L3 rename |
| SPECKIT_LEVEL marker checked before metadata table | BUG 1 fix; machine-generated markers are more reliable than human-editable metadata fields |
| Auto-cleanup of backups (keep 3 most recent) | Prevents unbounded .bak file accumulation while preserving recent rollback options |
| Skip-level as chained single-level upgrades | L1->L3 runs L1->L2 then L2->L3 sequentially; ensures intermediate state is valid and each step is independently testable |
| Fuzzy matching with fallback for modified headings | Users may edit heading text; fuzzy match finds approximate positions, falls back to end-of-file if no match |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Syntax | Pass | `bash -n upgrade-level.sh` clean |
| L1->L2 upgrade | Pass | Sections added, user content preserved |
| L2->L3 upgrade | Pass | decision-record.md created, plan.md appended |
| L1->L3 skip-level | Pass | Chained L1->L2 then L2->L3, intermediate state valid |
| L3->L3+ upgrade | Pass | Extended sections added correctly |
| Idempotency | Pass | Re-run produces no duplicate sections |
| JSON output | Pass | Valid JSON with all required fields |
| Code review | Pass | Score: 88/100, no P0 blockers, all P1 issues resolved |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No automated test suite; verification relies on manual test scenarios
- `--dry-run` shows planned operations but does not simulate the full file diff
- Skip-level L1->L3+ is not supported (must upgrade L1->L3 then L3->L3+)
- Backup uses .bak files in the spec folder rather than a centralized backup location

<!-- /ANCHOR:limitations -->

---

## Bugs Fixed

| Bug | Severity | Root Cause | Fix |
|-----|----------|------------|-----|
| BUG 1 | Critical | Level detection read metadata table before SPECKIT_LEVEL marker | Reordered detection: marker > metadata > headings |
| BUG 2+3 | Major | Comment block injection scanned for `-->` instead of `<!--` | New `find_insert_point()` scans backward for opening tag |
| BUG 4 | Major | Idempotency check missed renamed headings after L2->L3 | Dual-pattern grep checks both L2-prefixed and numbered variants |
| BUG 5 | Minor | Metadata table level field not updated on upgrade | Added sed substitutions for metadata table level value |
| P1-01 | Review | No cleanup of temp files on unexpected exit | Added trap handler for temp file cleanup |
| P1-02 | Review | Unquoted variables in tail/head commands | Added proper variable quoting |
| P1-03 | Review | Duplicate case patterns in argument parsing | Removed redundant case branches |
| P1-04 | Review | Inconsistent JSON escaping across functions | Standardized escaping in all JSON output paths |

---

## Lessons Learned

- Template composition model (core + addendum) requires careful understanding of heading numbering across levels; headings shift when sections are injected mid-document
- Backward scanning for trailing HTML comments needs to find the opening `<!--`, not just `-->`; a `-->` could appear in content
- Idempotency checks must account for heading transformations between levels (e.g., `## L2:` becomes `## 7.` after L2->L3 rename)
- Level detection must prioritize machine-generated markers over human-editable metadata tables, as users may modify metadata without understanding the implications

---

<!--
CORE TEMPLATE (~40 lines)
- Post-implementation documentation
- Created AFTER implementation completes
-->
