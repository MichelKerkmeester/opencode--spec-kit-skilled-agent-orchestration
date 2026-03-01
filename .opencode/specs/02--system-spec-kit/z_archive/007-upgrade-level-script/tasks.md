---
title: "Tasks: Spec Folder Level Upgrade Script [124-upgrade-level-script/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "spec"
  - "folder"
  - "level"
  - "upgrade"
  - "124"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Spec Folder Level Upgrade Script

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Core Infrastructure

- [x] T001 Create upgrade-level.sh script structure (.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh)
- [x] T002 Implement argument parsing (--dry-run, --verbose, --json, spec folder path, target level)
- [x] T003 Add bash version compatibility (bash 3.2+ for macOS, no associative arrays or ${var^^})
- [x] T004 Implement level detection function (reads SPECKIT_LEVEL markers, metadata table, heading patterns)
- [x] T005 Implement upgrade path validation (only upward, L1->L2/L3/L3+, L2->L3/L3+, L3->L3+)
- [x] T006 Implement skip-level resolver (L1->L3 = chain L1->L2 then L2->L3)
- [x] T007 Implement backup creation function (keeps 3 most recent .bak files, auto-cleanup)
- [x] T008 [P] Implement logging framework (verbose mode writes to stderr, JSON mode outputs structured data)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Template Integration

- [x] T009 Integrate template content for target level generation
- [x] T010 Parse templates to extract addendum sections for injection
- [x] T011 Implement new file creation logic (checklist.md from L2 template, decision-record.md from L3 template)
- [x] T012 Build file modification orchestrator (loop through spec.md, plan.md, checklist.md if exists)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Section Injection Logic

- [x] T013 Implement spec.md section insertion with position detection (insert L2 sections after section 6)
- [x] T014 Implement heading renumbering for spec.md (shift existing sections down if needed)
- [x] T015 Implement plan.md section appending (add L2 sections at end before comment)
- [x] T016 Implement checklist.md section appending for L2->L3 upgrades
- [x] T017 Implement SPECKIT_LEVEL marker updates in all modified files (comments + metadata table)
- [x] T018 Implement idempotency detection (dual-pattern grep check for both L2-prefixed and numbered heading variants)
- [x] T019 Add atomic file write (write to .tmp file, then mv to original)
- [x] T020 Handle edge case: missing SPECKIT_LEVEL markers (assume L1 with warning)
- [x] T021 Handle edge case: inconsistent markers across files (exit with error)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification & Testing

- [x] T022 Create test spec folder at L1 with sample user content
- [x] T023 Create test spec folder at L2 with sample user content
- [x] T024 Create test spec folder at L3 with sample user content
- [x] T025 Test L1->L2 upgrade (verify sections added, user content preserved)
- [x] T026 Test L2->L3 upgrade (verify decision-record.md created, plan.md sections appended)
- [x] T027 Test L1->L3 skip-level upgrade (verify chained operation works)
- [x] T028 Test L3->L3+ upgrade (verify extended sections added)
- [x] T029 Test idempotent operation (run upgrade twice, verify no duplicates or errors)
- [x] T030 Test dry-run mode (verify preview output, no file changes)
- [x] T031 Test verbose mode (verify detailed logging)
- [x] T032 Test JSON output mode (verify parseable structure)
- [x] T033 Test backup creation and manual restore process
- [x] T034 Test edge case: missing markers (verify warning and L1 assumption)
- [x] T035 Test edge case: modified headings (verify fallback to end-of-file insertion)
- [x] T036 Test edge case: insufficient disk space (verify graceful exit)
- [x] T037 [P] Update documentation (spec.md, plan.md, tasks.md synchronized)

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Bug Fixes

- [x] T038 BUG 1 (Critical): Fix level detection priority - SPECKIT_LEVEL marker now checked first before metadata table or heading patterns
- [x] T039 BUG 2+3: Fix comment block injection - new shared find_insert_point() function for trailing comment block detection (scans backward for opening `<!--`, not just `-->`)
- [x] T040 BUG 4: Fix idempotency after L2->L3 rename - dual-pattern grep check handles both `## L2:` and `## 7.` heading variants
- [x] T041 BUG 5: Fix metadata table level field not updated - added sed substitutions for metadata table level value
- [x] T042 P1-01: Add trap handler for temp file cleanup on script exit
- [x] T043 P1-02: Fix variable quoting in tail/head commands
- [x] T044 P1-03: Remove duplicate case patterns in argument parsing
- [x] T045 P1-04: Standardize JSON escaping consistency across all output functions

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Code Review

- [x] T046 Code review completed (score: 88/100, no P0 blockers)
- [x] T047 All P1 review issues addressed (P1-01 through P1-04)

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (6/6 test scenarios green)
- [x] checklist.md verified with evidence

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
