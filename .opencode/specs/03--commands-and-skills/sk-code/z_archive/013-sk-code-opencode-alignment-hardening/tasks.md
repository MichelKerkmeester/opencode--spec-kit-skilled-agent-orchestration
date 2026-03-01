---
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
title: "Tasks: sk-code--opencode Alignment Hardening [040-sk-code-opencode-alignment-hardening/tasks]"
description: "This document preserves the existing technical decisions and adds validator-required readme structure."
trigger_phrases:
  - "tasks"
  - "code"
  - "opencode"
  - "alignment"
  - "hardening"
  - "040"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-code--opencode Alignment Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---
## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


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
## Phase 1: Setup

- [x] T001 Capture baseline command/output artifact (pre: `853` scanned, `354` violations; post baseline: `854` scanned, `180` findings) (`implementation-summary.md`) [Evidence: baseline metrics documented in `implementation-summary.md`]
- [x] T002 Define regression coverage matrix for known defects (`.opencode/skill/sk-code--opencode/scripts/test_verify_alignment_drift.py`) [Evidence: 9 targeted tests covering `.mts`, dedupe, `tsconfig` comments, JSONC line mapping, warning/strict exit behavior]
- [x] T003 [P] Cover contextual/noise trees through advisory severity policy (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `CONTEXT_ADVISORY_SEGMENTS` + `classify_severity` + `test_context_paths_downgrade_integrity_findings_to_warning`]
- [x] T004 [P] Add overlapping/repeated root dedupe coverage (`.opencode/skill/sk-code--opencode/scripts/test_verify_alignment_drift.py`) [Evidence: `test_deduplicates_overlapping_roots`]
- [x] T005 [P] Add TS production vs test/asset applicability coverage (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `should_skip_ts_module_header`, `is_test_heavy_path`, `is_ts_pattern_asset`, `test_vitest_files_skip_ts_module_header_enforcement`]
- [x] T006 [P] Add `.mts` coverage (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `.mts` in `SUPPORTED_EXTENSIONS` + `test_discovers_mts_files`]
- [x] T007 [P] Add JSONC line-mapping and `tsconfig` comment coverage (`.opencode/skill/sk-code--opencode/scripts/test_verify_alignment_drift.py`) [Evidence: `test_jsonc_block_comment_preserves_line_numbers`, `test_tsconfig_comments_are_accepted`]
- [x] T008 Author regression tests mapped to REQ-002..REQ-007 (`.opencode/skill/sk-code--opencode/scripts/test_verify_alignment_drift.py`) [Evidence: all listed defect classes have direct tests]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 Implement normalized root deduplication (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `os.path.realpath(root)` normalization in `iter_code_files`]
- [x] T010 Implement file-level dedupe for overlap roots (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `seen_paths: Set[str]` and candidate dedupe in `iter_code_files`]
- [x] T011 Implement contextual advisory handling for noisy trees (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `CONTEXT_ADVISORY_SEGMENTS` + `is_context_advisory_path`]
- [x] T012 Add `.mts` to extension map and routing (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `.mts` in `SUPPORTED_EXTENSIONS` and TS branch in `check_file`]
- [x] T013 Implement TS module-header applicability policy (exclude tests/assets, keep production modules) (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `should_skip_ts_module_header` guard in `check_typescript`]
- [x] T014 Make JSONC block-comment stripping line-preserving (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: newline-preserving block comment logic in `strip_jsonc_comments`]
- [x] T015 Resolve `tsconfig` comment false-positive behavior (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: `TSCONFIG_JSON_RE` + comment-aware fallback in `check_json`; `JSON-PARSE` reduced `2 -> 1`]
- [x] T016 [P] Refactor helpers for policy and dedupe readability (`.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`) [Evidence: helper extraction for path normalization/classification + severity model]
- [x] T017 [P] Update tests for pass expectations and line assertions (`.opencode/skill/sk-code--opencode/scripts/test_verify_alignment_drift.py`) [Evidence: `test_warning_only_exit_code_is_zero_by_default`, `test_fail_on_warn_exit_code_is_one`, JSONC line test]
- [x] T018 [P] Update verifier documentation with refined policy/usage (`.opencode/skill/sk-code--opencode/references/shared/alignment_verification_automation.md`, `.opencode/skill/sk-code--opencode/SKILL.md`) [Evidence: `--fail-on-warn`, severity model, context advisory rules documented]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run verifier test suite (`python3 .opencode/skill/sk-code--opencode/scripts/test_verify_alignment_drift.py`) [Evidence: `Ran 9 tests ... OK`, exit `0`]
- [x] T020 Run baseline and strict verifier commands on `.opencode` roots [Evidence: baseline `PASS` exit `0`; strict `FAIL` exit `1` with `--fail-on-warn`; both `854` scanned, `180` findings]
- [x] T021 Validate success criteria SC-001..SC-005 with captured evidence (`spec.md`, `checklist.md`, `implementation-summary.md`) [Evidence: SC metrics and rule distribution documented]
- [x] T022 Update checklist evidence and mark completed items (`checklist.md`) [Evidence: all completed items include concrete evidence references]
- [x] T023 Finalize implementation summary for completed state (`implementation-summary.md`) [Evidence: status now complete with before/after and command outcomes]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [Evidence: T001-T023 completed]
- [x] No `[B]` blocked tasks remaining [Evidence: no blocked markers present]
- [x] Baseline delta and rule distribution evidence captured [Evidence: `implementation-summary.md` verification and behavior sections]
- [x] All P0 checklist items verified [Evidence: `checklist.md` P0 section marked complete]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
