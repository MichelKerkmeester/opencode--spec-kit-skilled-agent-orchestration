# Audit B-06: Shell Script Quality

## Summary
| Metric | Result |
|--------|--------|
| .sh files found | 52 |
| Missing shebang | 0 |
| Missing set -euo pipefail | 5 |
| Unquoted variables | 0 |
| Naming violations | 1 |

## Per-File Findings
### .opencode/skill/system-spec-kit/scripts/check-api-boundary.sh
- [ISS-B06-001] [P1] stderr: Line 19: error message appears to write to stdout: `echo "ERROR: $MCP_DIR/lib/ not found"`
- [ISS-B06-002] [P1] stderr: Line 28: error message appears to write to stdout: `echo "ERROR: lib/ -> api/ import boundary violation(s) found:"`
- [ISS-B06-003] [P1] Exit codes: Line 20: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.

### .opencode/skill/system-spec-kit/scripts/check-links.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/common.sh
- [ISS-B06-004] [P2] Function docs: Line 70: function `has_git` lacks a preceding purpose comment.
- [ISS-B06-005] [P2] Function docs: Line 102: function `find_feature_dir_by_prefix` lacks a preceding purpose comment.
- [ISS-B06-006] [P2] Function docs: Line 158: function `check_dir` lacks a preceding purpose comment.

### .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/lib/git-branch.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/lib/template-utils.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/download.sh
- [ISS-B06-007] [P0] Strict mode: Missing `set -euo pipefail` near the top of the script.
- [ISS-B06-008] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh
- [ISS-B06-009] [P2] Function docs: Line 20: function `show_help` lacks a preceding purpose comment.
- [ISS-B06-010] [P2] Function docs: Line 42: function `parse_args` lacks a preceding purpose comment.
- [ISS-B06-011] [P2] Function docs: Line 72: function `apply_scenario` lacks a preceding purpose comment.
- [ISS-B06-012] [P2] Function docs: Line 88: function `validate` lacks a preceding purpose comment.
- [ISS-B06-013] [P2] Function docs: Line 95: function `main` lacks a preceding purpose comment.
- [ISS-B06-014] [P1] Exit codes: Line 47: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-015] [P1] Exit codes: Line 50: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-016] [P1] Exit codes: Line 53: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-017] [P1] Exit codes: Line 56: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-018] [P1] Exit codes: Line 59: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-019] [P1] Exit codes: Line 62: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-020] [P1] Exit codes: Line 66: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-021] [P1] Exit codes: Line 83: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-022] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh
- [ISS-B06-023] [P2] Function docs: Line 19: function `show_help` lacks a preceding purpose comment.
- [ISS-B06-024] [P2] Function docs: Line 37: function `parse_args` lacks a preceding purpose comment.
- [ISS-B06-025] [P2] Function docs: Line 67: function `apply_scenario` lacks a preceding purpose comment.
- [ISS-B06-026] [P2] Function docs: Line 83: function `validate` lacks a preceding purpose comment.
- [ISS-B06-027] [P2] Function docs: Line 90: function `main` lacks a preceding purpose comment.
- [ISS-B06-028] [P1] Exit codes: Line 42: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-029] [P1] Exit codes: Line 45: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-030] [P1] Exit codes: Line 48: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-031] [P1] Exit codes: Line 51: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-032] [P1] Exit codes: Line 54: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-033] [P1] Exit codes: Line 57: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-034] [P1] Exit codes: Line 61: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-035] [P1] Exit codes: Line 78: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-036] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh
- [ISS-B06-037] [P2] Function docs: Line 20: function `show_help` lacks a preceding purpose comment.
- [ISS-B06-038] [P2] Function docs: Line 38: function `parse_args` lacks a preceding purpose comment.
- [ISS-B06-039] [P2] Function docs: Line 68: function `apply_scenario` lacks a preceding purpose comment.
- [ISS-B06-040] [P2] Function docs: Line 84: function `validate` lacks a preceding purpose comment.
- [ISS-B06-041] [P2] Function docs: Line 91: function `main` lacks a preceding purpose comment.
- [ISS-B06-042] [P1] Exit codes: Line 43: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-043] [P1] Exit codes: Line 46: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-044] [P1] Exit codes: Line 49: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-045] [P1] Exit codes: Line 52: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-046] [P1] Exit codes: Line 55: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-047] [P1] Exit codes: Line 58: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-048] [P1] Exit codes: Line 62: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-049] [P1] Exit codes: Line 79: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-050] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh
- [ISS-B06-051] [P2] Function docs: Line 20: function `show_help` lacks a preceding purpose comment.
- [ISS-B06-052] [P2] Function docs: Line 38: function `parse_args` lacks a preceding purpose comment.
- [ISS-B06-053] [P2] Function docs: Line 68: function `apply_scenario` lacks a preceding purpose comment.
- [ISS-B06-054] [P2] Function docs: Line 84: function `validate` lacks a preceding purpose comment.
- [ISS-B06-055] [P2] Function docs: Line 91: function `main` lacks a preceding purpose comment.
- [ISS-B06-056] [P1] Exit codes: Line 43: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-057] [P1] Exit codes: Line 46: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-058] [P1] Exit codes: Line 49: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-059] [P1] Exit codes: Line 52: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-060] [P1] Exit codes: Line 55: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-061] [P1] Exit codes: Line 58: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-062] [P1] Exit codes: Line 62: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-063] [P1] Exit codes: Line 79: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-064] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh
- [ISS-B06-065] [P2] Function docs: Line 10: function `ops_now_utc` lacks a preceding purpose comment.
- [ISS-B06-066] [P2] Function docs: Line 14: function `ops_is_uint` lacks a preceding purpose comment.
- [ISS-B06-067] [P2] Function docs: Line 18: function `ops_require_uint` lacks a preceding purpose comment.
- [ISS-B06-068] [P2] Function docs: Line 27: function `ops_json_escape` lacks a preceding purpose comment.
- [ISS-B06-069] [P2] Function docs: Line 37: function `ops_log` lacks a preceding purpose comment.
- [ISS-B06-070] [P2] Function docs: Line 43: function `ops_emit_escalation` lacks a preceding purpose comment.
- [ISS-B06-071] [P2] Function docs: Line 70: function `ops_emit_success` lacks a preceding purpose comment.
- [ISS-B06-072] [P2] Function docs: Line 85: function `ops_run_step` lacks a preceding purpose comment.
- [ISS-B06-073] [P2] Function docs: Line 126: function `ops_validate_common_options` lacks a preceding purpose comment.
- [ISS-B06-074] [P1] Exit codes: Line 23: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-075] [P1] Exit codes: Line 131: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-076] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/ops/runbook.sh
- [ISS-B06-077] [P2] Function docs: Line 10: function `show_help` lacks a preceding purpose comment.
- [ISS-B06-078] [P2] Function docs: Line 35: function `class_script` lacks a preceding purpose comment.
- [ISS-B06-079] [P2] Function docs: Line 45: function `show_class` lacks a preceding purpose comment.
- [ISS-B06-080] [P2] Function docs: Line 90: function `run_drill_one` lacks a preceding purpose comment.
- [ISS-B06-081] [P2] Function docs: Line 101: function `run_drill` lacks a preceding purpose comment.
- [ISS-B06-082] [P2] Function docs: Line 120: function `main` lacks a preceding purpose comment.
- [ISS-B06-083] [P1] Exit codes: Line 123: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-084] [P1] Exit codes: Line 144: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-085] [P1] Exit codes: Line 151: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-086] [P1] Exit codes: Line 160: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-087] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/registry-loader.sh
- [ISS-B06-088] [P1] Naming: Line 177: variable `calledBy` is not snake_case/UPPER_SNAKE.
- [ISS-B06-089] [P2] Function docs: Line 63: function `check_jq` lacks a preceding purpose comment.
- [ISS-B06-090] [P2] Function docs: Line 71: function `check_registry` lacks a preceding purpose comment.
- [ISS-B06-091] [P2] Function docs: Line 106: function `list_essential_scripts` lacks a preceding purpose comment.
- [ISS-B06-092] [P2] Function docs: Line 123: function `list_optional_scripts` lacks a preceding purpose comment.
- [ISS-B06-093] [P2] Function docs: Line 140: function `get_script_info` lacks a preceding purpose comment.
- [ISS-B06-094] [P2] Function docs: Line 184: function `find_by_trigger` lacks a preceding purpose comment.
- [ISS-B06-095] [P2] Function docs: Line 213: function `find_by_gate` lacks a preceding purpose comment.
- [ISS-B06-096] [P2] Function docs: Line 242: function `find_by_type` lacks a preceding purpose comment.
- [ISS-B06-097] [P2] Function docs: Line 275: function `list_rules` lacks a preceding purpose comment.
- [ISS-B06-098] [P1] stderr: Line 65: error message appears to write to stdout: `echo -e "${RED}Error: jq is required but not installed.${NC}"`
- [ISS-B06-099] [P1] stderr: Line 73: error message appears to write to stdout: `echo -e "${RED}Error: Registry file not found: $REGISTRY_FILE${NC}"`
- [ISS-B06-100] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/rules/check-ai-protocols.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-complexity.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-files.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-level.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-links.sh
- [ISS-B06-101] [P2] Function docs: Line 25: function `scan_wikilinks` lacks a preceding purpose comment.
- [ISS-B06-102] [P2] Function docs: Line 76: function `run_check` lacks a preceding purpose comment.
- [ISS-B06-103] [P2] Function docs: Line 121: function `main` lacks a preceding purpose comment.
- [ISS-B06-104] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-placeholders.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-sections.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh
- [ISS-B06-105] [P2] Function docs: Line 8: function `resolve_repo_root` lacks a preceding purpose comment.
- [ISS-B06-106] [P2] Function docs: Line 12: function `resolve_target_path` lacks a preceding purpose comment.
- [ISS-B06-107] [P2] Function docs: Line 27: function `resolve_markdown_reference_path` lacks a preceding purpose comment.
- [ISS-B06-108] [P2] Function docs: Line 58: function `run_check` lacks a preceding purpose comment.

### .opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh
- [ISS-B06-109] [P1] stderr: Line 14: error message appears to write to stdout: `echo "ERROR: node is required but was not found in PATH"`
- [ISS-B06-110] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh
- [ISS-B06-111] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/spec/archive.sh
- [ISS-B06-112] [P2] Function docs: Line 77: function `log_info` lacks a preceding purpose comment.
- [ISS-B06-113] [P2] Function docs: Line 78: function `log_success` lacks a preceding purpose comment.
- [ISS-B06-114] [P2] Function docs: Line 79: function `log_warning` lacks a preceding purpose comment.
- [ISS-B06-115] [P2] Function docs: Line 80: function `log_error` lacks a preceding purpose comment.
- [ISS-B06-116] [P2] Function docs: Line 133: function `archive_spec` lacks a preceding purpose comment.
- [ISS-B06-117] [P2] Function docs: Line 220: function `list_archived` lacks a preceding purpose comment.
- [ISS-B06-118] [P2] Function docs: Line 251: function `restore_spec` lacks a preceding purpose comment.
- [ISS-B06-119] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh
- [ISS-B06-120] [P2] Function docs: Line 109: function `get_min_words_for_file` lacks a preceding purpose comment.
- [ISS-B06-121] [P2] Function docs: Line 124: function `validate_word_count` lacks a preceding purpose comment.
- [ISS-B06-122] [P2] Function docs: Line 143: function `check_required_sections` lacks a preceding purpose comment.
- [ISS-B06-123] [P2] Function docs: Line 177: function `run_quality_checks` lacks a preceding purpose comment.
- [ISS-B06-124] [P2] Function docs: Line 205: function `count_total_lines` lacks a preceding purpose comment.
- [ISS-B06-125] [P2] Function docs: Line 211: function `calculate_file_completeness` lacks a preceding purpose comment.
- [ISS-B06-126] [P2] Function docs: Line 252: function `calculate_spec_completeness` lacks a preceding purpose comment.
- [ISS-B06-127] [P2] Function docs: Line 414: function `output_json` lacks a preceding purpose comment.
- [ISS-B06-128] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh
- [ISS-B06-129] [P2] Function docs: Line 204: function `calculate_status` lacks a preceding purpose comment.
- [ISS-B06-130] [P2] Function docs: Line 273: function `output_text` lacks a preceding purpose comment.
- [ISS-B06-131] [P1] stderr: Line 375: error message appears to write to stdout: `echo '{"error": "checklist.md not found", "folder": "'"$FOLDER_PATH"'"}'`
- [ISS-B06-132] [P1] Exit codes: Line 92: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-133] [P1] Exit codes: Line 99: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-134] [P1] Exit codes: Line 109: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-135] [P1] Exit codes: Line 116: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-136] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh
- [ISS-B06-137] [P1] Exit codes: Line 57: non-standard explicit exit code `-*)         echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;`; checklist expects success=0 and error=1.
- [ISS-B06-138] [P1] Exit codes: Line 64: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-139] [P1] Exit codes: Line 74: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-140] [P1] Exit codes: Line 82: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-141] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/create.sh
- [ISS-B06-142] [P2] Function docs: Line 291: function `create_versioned_subfolder` lacks a preceding purpose comment.
- [ISS-B06-143] [P2] Function docs: Line 345: function `validate_spec_folder_basename` lacks a preceding purpose comment.
- [ISS-B06-144] [P2] Function docs: Line 543: function `create_git_branch` lacks a preceding purpose comment.
- [ISS-B06-145] [P2] Function docs: Line 572: function `_phase_cleanup` lacks a preceding purpose comment.
- [ISS-B06-146] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh
- [ISS-B06-147] [P0] Strict mode: Missing `set -euo pipefail` near the top of the script.
- [ISS-B06-148] [P2] Function docs: Line 159: function `log_fix` lacks a preceding purpose comment.
- [ISS-B06-149] [P2] Function docs: Line 170: function `log_suggest` lacks a preceding purpose comment.
- [ISS-B06-150] [P2] Function docs: Line 177: function `log_verbose` lacks a preceding purpose comment.
- [ISS-B06-151] [P2] Function docs: Line 594: function `generate_human_report` lacks a preceding purpose comment.
- [ISS-B06-152] [P2] Function docs: Line 627: function `generate_json_report` lacks a preceding purpose comment.
- [ISS-B06-153] [P1] Exit codes: Line 123: non-standard explicit exit code `echo "ERROR: --level requires a value between 1 and 4" >&2; exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-154] [P1] Exit codes: Line 131: non-standard explicit exit code `-*)           echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;`; checklist expects success=0 and error=1.
- [ISS-B06-155] [P1] Exit codes: Line 136: non-standard explicit exit code `echo "ERROR: Multiple paths provided" >&2; exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-156] [P1] Exit codes: Line 142: non-standard explicit exit code `[[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-157] [P1] Exit codes: Line 144: non-standard explicit exit code `[[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-158] [P1] Exit codes: Line 257: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-159] [P1] Exit codes: Line 732: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-160] [P1] Exit codes: Line 735: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-161] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh
- [ISS-B06-162] [P0] Strict mode: Missing `set -euo pipefail` near the top of the script.
- [ISS-B06-163] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/test-validation.sh
- No checklist violations found.

### .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh
- [ISS-B06-164] [P2] Function docs: Line 74: function `info` lacks a preceding purpose comment.
- [ISS-B06-165] [P2] Function docs: Line 80: function `warn` lacks a preceding purpose comment.
- [ISS-B06-166] [P2] Function docs: Line 84: function `error_exit` lacks a preceding purpose comment.
- [ISS-B06-167] [P2] Function docs: Line 261: function `validate_upgrade_path` lacks a preceding purpose comment.
- [ISS-B06-168] [P1] Exit codes: Line 43: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-169] [P1] Exit codes: Line 1458: non-standard explicit exit code `exit 3`; checklist expects success=0 and error=1.
- [ISS-B06-170] [P1] Exit codes: Line 1553: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- [ISS-B06-171] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/spec/validate.sh
- [ISS-B06-172] [P2] Function docs: Line 64: function `show_help` lacks a preceding purpose comment.
- [ISS-B06-173] [P2] Function docs: Line 87: function `parse_args` lacks a preceding purpose comment.
- [ISS-B06-174] [P2] Function docs: Line 108: function `has_phase_children` lacks a preceding purpose comment.
- [ISS-B06-175] [P2] Function docs: Line 118: function `apply_env_overrides` lacks a preceding purpose comment.
- [ISS-B06-176] [P2] Function docs: Line 127: function `load_config` lacks a preceding purpose comment.
- [ISS-B06-177] [P2] Function docs: Line 196: function `detect_level` lacks a preceding purpose comment.
- [ISS-B06-178] [P2] Function docs: Line 239: function `log_pass` lacks a preceding purpose comment.
- [ISS-B06-179] [P2] Function docs: Line 244: function `log_warn` lacks a preceding purpose comment.
- [ISS-B06-180] [P2] Function docs: Line 249: function `log_error` lacks a preceding purpose comment.
- [ISS-B06-181] [P2] Function docs: Line 254: function `log_info` lacks a preceding purpose comment.
- [ISS-B06-182] [P2] Function docs: Line 259: function `log_detail` lacks a preceding purpose comment.
- [ISS-B06-183] [P2] Function docs: Line 261: function `get_rule_severity` lacks a preceding purpose comment.
- [ISS-B06-184] [P2] Function docs: Line 270: function `should_run_rule` lacks a preceding purpose comment.
- [ISS-B06-185] [P2] Function docs: Line 300: function `rule_name_to_script` lacks a preceding purpose comment.
- [ISS-B06-186] [P2] Function docs: Line 325: function `get_rule_scripts` lacks a preceding purpose comment.
- [ISS-B06-187] [P2] Function docs: Line 342: function `run_all_rules` lacks a preceding purpose comment.
- [ISS-B06-188] [P2] Function docs: Line 399: function `print_header` lacks a preceding purpose comment.
- [ISS-B06-189] [P2] Function docs: Line 410: function `print_summary` lacks a preceding purpose comment.
- [ISS-B06-190] [P2] Function docs: Line 435: function `generate_json` lacks a preceding purpose comment.
- [ISS-B06-191] [P2] Function docs: Line 527: function `main` lacks a preceding purpose comment.
- [ISS-B06-192] [P1] stderr: Line 263: error message appears to write to stdout: `FILE_EXISTS|FILES|PLACEHOLDER_FILLED|PLACEHOLDERS|ANCHORS_VALID|ANCHORS|TOC_POLICY) echo "error" ;;`
- [ISS-B06-193] [P1] stderr: Line 265: error message appears to write to stdout: `SPEC_DOC_INTEGRITY|DOC_INTEGRITY) echo "error" ;;`
- [ISS-B06-194] [P1] stderr: Line 267: error message appears to write to stdout: `*) echo "error" ;;`
- [ISS-B06-195] [P1] stderr: Line 421: error message appears to write to stdout: `echo "RESULT: $status (errors=$ERRORS warnings=$WARNINGS)"`
- [ISS-B06-196] [P1] stderr: Line 425: error message appears to write to stdout: `echo -e "  ${BOLD}Summary:${NC} ${RED}Errors:${NC} $ERRORS  ${YELLOW}Warnings:${NC} $WARNINGS"`
- [ISS-B06-197] [P1] stderr: Line 428: error message appears to write to stdout: `if [[ $ERRORS -gt 0 ]]; then echo -e "  ${RED}${BOLD}RESULT: FAILED${NC}"`
- [ISS-B06-198] [P1] stderr: Line 450: error message appears to write to stdout: `echo "{\"version\":\"$VERSION\",\"folder\":\"$folder_escaped\",\"level\":$json_level,\"levelMethod\":\"$LEVEL_METHOD\",\"config\":$cfg,\"results\":[$RESULTS]${phases_json},\"summary\":{\"errors\":$ERRORS,\"warnings\":$WARNINGS,\"info\":$INFOS},\"passed\":$passed,\"strict\":$STRICT_MODE}"`
- [ISS-B06-199] [P1] stderr: Line 524: error message appears to write to stdout: `! $JSON_MODE && ! $QUIET_MODE && echo -e "\n  ${BOLD}Phase Summary:${NC} ${#phase_dirs[@]} phases, $child_errors errors, $child_warnings warnings" || true`
- [ISS-B06-200] [P1] Exit codes: Line 98: non-standard explicit exit code `-*) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;`; checklist expects success=0 and error=1.
- [ISS-B06-201] [P1] Exit codes: Line 99: non-standard explicit exit code `*) [[ -z "$FOLDER_PATH" ]] && FOLDER_PATH="$1" || { echo "ERROR: Multiple paths" >&2; exit 2; }; shift ;;`; checklist expects success=0 and error=1.
- [ISS-B06-202] [P1] Exit codes: Line 102: non-standard explicit exit code `[[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-203] [P1] Exit codes: Line 104: non-standard explicit exit code `[[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }`; checklist expects success=0 and error=1.
- [ISS-B06-204] [P1] Exit codes: Line 547: non-standard explicit exit code `if [[ $ERRORS -gt 0 ]]; then exit 2; fi`; checklist expects success=0 and error=1.
- [ISS-B06-205] [P1] Exit codes: Line 548: non-standard explicit exit code `if [[ $WARNINGS -gt 0 ]] && $STRICT_MODE; then exit 2; fi`; checklist expects success=0 and error=1.
- [ISS-B06-206] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/templates/compose.sh
- [ISS-B06-207] [P0] Strict mode: Missing `set -euo pipefail` near the top of the script.
- [ISS-B06-208] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh
- [ISS-B06-209] [P2] Function docs: Line 19: function `pass` lacks a preceding purpose comment.
- [ISS-B06-210] [P2] Function docs: Line 25: function `fail` lacks a preceding purpose comment.
- [ISS-B06-211] [P2] Function docs: Line 31: function `cleanup_all` lacks a preceding purpose comment.
- [ISS-B06-212] [P2] Function docs: Line 41: function `make_temp_repo` lacks a preceding purpose comment.
- [ISS-B06-213] [P2] Function docs: Line 64: function `json_field` lacks a preceding purpose comment.
- [ISS-B06-214] [P1] stderr: Line 75: error message appears to write to stdout: `echo "ERROR: create.sh not found at $SOURCE_SCRIPTS_DIR/create.sh"`
- [ISS-B06-215] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh
- [ISS-B06-216] [P2] Function docs: Line 23: function `pass` lacks a preceding purpose comment.
- [ISS-B06-217] [P2] Function docs: Line 24: function `fail` lacks a preceding purpose comment.
- [ISS-B06-218] [P2] Function docs: Line 25: function `skip` lacks a preceding purpose comment.
- [ISS-B06-219] [P2] Function docs: Line 26: function `begin_category` lacks a preceding purpose comment.
- [ISS-B06-220] [P2] Function docs: Line 31: function `cleanup_all` lacks a preceding purpose comment.
- [ISS-B06-221] [P2] Function docs: Line 40: function `make_temp_dir` lacks a preceding purpose comment.
- [ISS-B06-222] [P1] stderr: Line 57: error message appears to write to stdout: `echo "ERROR: upgrade-level.sh not found at $UPGRADE_SCRIPT"`
- [ISS-B06-223] [P1] stderr: Line 62: error message appears to write to stdout: `echo "ERROR: shell-common.sh not found at $SHELL_COMMON"`
- [ISS-B06-224] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh
- [ISS-B06-225] [P0] Strict mode: Missing `set -euo pipefail` near the top of the script.
- [ISS-B06-226] [P2] Function docs: Line 111: function `format_time` lacks a preceding purpose comment.
- [ISS-B06-227] [P2] Function docs: Line 122: function `get_time_ms` lacks a preceding purpose comment.
- [ISS-B06-228] [P2] Function docs: Line 132: function `to_lower` lacks a preceding purpose comment.
- [ISS-B06-229] [P2] Function docs: Line 136: function `contains_ci` lacks a preceding purpose comment.
- [ISS-B06-230] [P2] Function docs: Line 148: function `save_category_summary` lacks a preceding purpose comment.
- [ISS-B06-231] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
- [ISS-B06-232] [P2] Function docs: Line 84: function `format_time` lacks a preceding purpose comment.
- [ISS-B06-233] [P2] Function docs: Line 95: function `get_time_ms` lacks a preceding purpose comment.
- [ISS-B06-234] [P2] Function docs: Line 108: function `to_lower` lacks a preceding purpose comment.
- [ISS-B06-235] [P2] Function docs: Line 112: function `contains_ci` lacks a preceding purpose comment.
- [ISS-B06-236] [P2] Function docs: Line 126: function `save_category_summary` lacks a preceding purpose comment.
- [ISS-B06-237] [P2] Function docs: Line 315: function `run_test_with_flags` lacks a preceding purpose comment.
- [ISS-B06-238] [P2] Function docs: Line 422: function `run_test_json_valid` lacks a preceding purpose comment.
- [ISS-B06-239] [P2] Function docs: Line 516: function `run_test_quiet` lacks a preceding purpose comment.
- [ISS-B06-240] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

### .opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh
- [ISS-B06-241] [P1] stderr: Line 75: error message appears to write to stdout: `echo "Failed: ${total_errors}"`
- [ISS-B06-242] [P1] Exit codes: Script has explicit exit codes but does not document them in a header comment.

## Issues
- **ISS-B06-001** (P1, .opencode/skill/system-spec-kit/scripts/check-api-boundary.sh) - Line 19: error message appears to write to stdout: `echo "ERROR: $MCP_DIR/lib/ not found"`
- **ISS-B06-002** (P1, .opencode/skill/system-spec-kit/scripts/check-api-boundary.sh) - Line 28: error message appears to write to stdout: `echo "ERROR: lib/ -> api/ import boundary violation(s) found:"`
- **ISS-B06-003** (P1, .opencode/skill/system-spec-kit/scripts/check-api-boundary.sh) - Line 20: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-004** (P2, .opencode/skill/system-spec-kit/scripts/common.sh) - Line 70: function `has_git` lacks a preceding purpose comment.
- **ISS-B06-005** (P2, .opencode/skill/system-spec-kit/scripts/common.sh) - Line 102: function `find_feature_dir_by_prefix` lacks a preceding purpose comment.
- **ISS-B06-006** (P2, .opencode/skill/system-spec-kit/scripts/common.sh) - Line 158: function `check_dir` lacks a preceding purpose comment.
- **ISS-B06-007** (P0, .opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/download.sh) - Missing `set -euo pipefail` near the top of the script.
- **ISS-B06-008** (P1, .opencode/skill/system-spec-kit/scripts/node_modules/better-sqlite3/deps/download.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-009** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 20: function `show_help` lacks a preceding purpose comment.
- **ISS-B06-010** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 42: function `parse_args` lacks a preceding purpose comment.
- **ISS-B06-011** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 72: function `apply_scenario` lacks a preceding purpose comment.
- **ISS-B06-012** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 88: function `validate` lacks a preceding purpose comment.
- **ISS-B06-013** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 95: function `main` lacks a preceding purpose comment.
- **ISS-B06-014** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 47: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-015** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 50: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-016** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 53: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-017** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 56: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-018** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 59: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-019** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 62: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-020** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 66: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-021** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Line 83: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-022** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-023** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 19: function `show_help` lacks a preceding purpose comment.
- **ISS-B06-024** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 37: function `parse_args` lacks a preceding purpose comment.
- **ISS-B06-025** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 67: function `apply_scenario` lacks a preceding purpose comment.
- **ISS-B06-026** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 83: function `validate` lacks a preceding purpose comment.
- **ISS-B06-027** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 90: function `main` lacks a preceding purpose comment.
- **ISS-B06-028** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 42: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-029** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 45: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-030** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 48: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-031** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 51: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-032** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 54: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-033** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 57: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-034** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 61: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-035** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Line 78: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-036** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-037** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 20: function `show_help` lacks a preceding purpose comment.
- **ISS-B06-038** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 38: function `parse_args` lacks a preceding purpose comment.
- **ISS-B06-039** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 68: function `apply_scenario` lacks a preceding purpose comment.
- **ISS-B06-040** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 84: function `validate` lacks a preceding purpose comment.
- **ISS-B06-041** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 91: function `main` lacks a preceding purpose comment.
- **ISS-B06-042** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 43: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-043** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 46: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-044** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 49: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-045** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 52: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-046** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 55: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-047** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 58: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-048** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 62: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-049** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Line 79: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-050** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-051** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 20: function `show_help` lacks a preceding purpose comment.
- **ISS-B06-052** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 38: function `parse_args` lacks a preceding purpose comment.
- **ISS-B06-053** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 68: function `apply_scenario` lacks a preceding purpose comment.
- **ISS-B06-054** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 84: function `validate` lacks a preceding purpose comment.
- **ISS-B06-055** (P2, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 91: function `main` lacks a preceding purpose comment.
- **ISS-B06-056** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 43: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --scenario requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-057** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 46: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --max-attempts requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-058** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 49: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --backoff-seconds requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-059** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 52: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --detect-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-060** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 55: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --repair-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-061** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 58: non-standard explicit exit code `[[ $# -lt 2 ]] && { echo "ERROR: --verify-failures requires a value" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-062** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 62: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-063** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Line 79: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-064** (P1, .opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-065** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 10: function `ops_now_utc` lacks a preceding purpose comment.
- **ISS-B06-066** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 14: function `ops_is_uint` lacks a preceding purpose comment.
- **ISS-B06-067** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 18: function `ops_require_uint` lacks a preceding purpose comment.
- **ISS-B06-068** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 27: function `ops_json_escape` lacks a preceding purpose comment.
- **ISS-B06-069** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 37: function `ops_log` lacks a preceding purpose comment.
- **ISS-B06-070** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 43: function `ops_emit_escalation` lacks a preceding purpose comment.
- **ISS-B06-071** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 70: function `ops_emit_success` lacks a preceding purpose comment.
- **ISS-B06-072** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 85: function `ops_run_step` lacks a preceding purpose comment.
- **ISS-B06-073** (P2, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 126: function `ops_validate_common_options` lacks a preceding purpose comment.
- **ISS-B06-074** (P1, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 23: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-075** (P1, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Line 131: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-076** (P1, .opencode/skill/system-spec-kit/scripts/ops/ops-common.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-077** (P2, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 10: function `show_help` lacks a preceding purpose comment.
- **ISS-B06-078** (P2, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 35: function `class_script` lacks a preceding purpose comment.
- **ISS-B06-079** (P2, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 45: function `show_class` lacks a preceding purpose comment.
- **ISS-B06-080** (P2, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 90: function `run_drill_one` lacks a preceding purpose comment.
- **ISS-B06-081** (P2, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 101: function `run_drill` lacks a preceding purpose comment.
- **ISS-B06-082** (P2, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 120: function `main` lacks a preceding purpose comment.
- **ISS-B06-083** (P1, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 123: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-084** (P1, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 144: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-085** (P1, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 151: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-086** (P1, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Line 160: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-087** (P1, .opencode/skill/system-spec-kit/scripts/ops/runbook.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-088** (P1, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 177: variable `calledBy` is not snake_case/UPPER_SNAKE.
- **ISS-B06-089** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 63: function `check_jq` lacks a preceding purpose comment.
- **ISS-B06-090** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 71: function `check_registry` lacks a preceding purpose comment.
- **ISS-B06-091** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 106: function `list_essential_scripts` lacks a preceding purpose comment.
- **ISS-B06-092** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 123: function `list_optional_scripts` lacks a preceding purpose comment.
- **ISS-B06-093** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 140: function `get_script_info` lacks a preceding purpose comment.
- **ISS-B06-094** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 184: function `find_by_trigger` lacks a preceding purpose comment.
- **ISS-B06-095** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 213: function `find_by_gate` lacks a preceding purpose comment.
- **ISS-B06-096** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 242: function `find_by_type` lacks a preceding purpose comment.
- **ISS-B06-097** (P2, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 275: function `list_rules` lacks a preceding purpose comment.
- **ISS-B06-098** (P1, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 65: error message appears to write to stdout: `echo -e "${RED}Error: jq is required but not installed.${NC}"`
- **ISS-B06-099** (P1, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Line 73: error message appears to write to stdout: `echo -e "${RED}Error: Registry file not found: $REGISTRY_FILE${NC}"`
- **ISS-B06-100** (P1, .opencode/skill/system-spec-kit/scripts/registry-loader.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-101** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-links.sh) - Line 25: function `scan_wikilinks` lacks a preceding purpose comment.
- **ISS-B06-102** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-links.sh) - Line 76: function `run_check` lacks a preceding purpose comment.
- **ISS-B06-103** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-links.sh) - Line 121: function `main` lacks a preceding purpose comment.
- **ISS-B06-104** (P1, .opencode/skill/system-spec-kit/scripts/rules/check-links.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-105** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh) - Line 8: function `resolve_repo_root` lacks a preceding purpose comment.
- **ISS-B06-106** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh) - Line 12: function `resolve_target_path` lacks a preceding purpose comment.
- **ISS-B06-107** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh) - Line 27: function `resolve_markdown_reference_path` lacks a preceding purpose comment.
- **ISS-B06-108** (P2, .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh) - Line 58: function `run_check` lacks a preceding purpose comment.
- **ISS-B06-109** (P1, .opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh) - Line 14: error message appears to write to stdout: `echo "ERROR: node is required but was not found in PATH"`
- **ISS-B06-110** (P1, .opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-111** (P1, .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-112** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 77: function `log_info` lacks a preceding purpose comment.
- **ISS-B06-113** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 78: function `log_success` lacks a preceding purpose comment.
- **ISS-B06-114** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 79: function `log_warning` lacks a preceding purpose comment.
- **ISS-B06-115** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 80: function `log_error` lacks a preceding purpose comment.
- **ISS-B06-116** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 133: function `archive_spec` lacks a preceding purpose comment.
- **ISS-B06-117** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 220: function `list_archived` lacks a preceding purpose comment.
- **ISS-B06-118** (P2, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Line 251: function `restore_spec` lacks a preceding purpose comment.
- **ISS-B06-119** (P1, .opencode/skill/system-spec-kit/scripts/spec/archive.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-120** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 109: function `get_min_words_for_file` lacks a preceding purpose comment.
- **ISS-B06-121** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 124: function `validate_word_count` lacks a preceding purpose comment.
- **ISS-B06-122** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 143: function `check_required_sections` lacks a preceding purpose comment.
- **ISS-B06-123** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 177: function `run_quality_checks` lacks a preceding purpose comment.
- **ISS-B06-124** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 205: function `count_total_lines` lacks a preceding purpose comment.
- **ISS-B06-125** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 211: function `calculate_file_completeness` lacks a preceding purpose comment.
- **ISS-B06-126** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 252: function `calculate_spec_completeness` lacks a preceding purpose comment.
- **ISS-B06-127** (P2, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Line 414: function `output_json` lacks a preceding purpose comment.
- **ISS-B06-128** (P1, .opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-129** (P2, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 204: function `calculate_status` lacks a preceding purpose comment.
- **ISS-B06-130** (P2, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 273: function `output_text` lacks a preceding purpose comment.
- **ISS-B06-131** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 375: error message appears to write to stdout: `echo '{"error": "checklist.md not found", "folder": "'"$FOLDER_PATH"'"}'`
- **ISS-B06-132** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 92: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-133** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 99: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-134** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 109: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-135** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Line 116: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-136** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-137** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh) - Line 57: non-standard explicit exit code `-*)         echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;`; checklist expects success=0 and error=1.
- **ISS-B06-138** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh) - Line 64: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-139** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh) - Line 74: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-140** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh) - Line 82: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-141** (P1, .opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-142** (P2, .opencode/skill/system-spec-kit/scripts/spec/create.sh) - Line 291: function `create_versioned_subfolder` lacks a preceding purpose comment.
- **ISS-B06-143** (P2, .opencode/skill/system-spec-kit/scripts/spec/create.sh) - Line 345: function `validate_spec_folder_basename` lacks a preceding purpose comment.
- **ISS-B06-144** (P2, .opencode/skill/system-spec-kit/scripts/spec/create.sh) - Line 543: function `create_git_branch` lacks a preceding purpose comment.
- **ISS-B06-145** (P2, .opencode/skill/system-spec-kit/scripts/spec/create.sh) - Line 572: function `_phase_cleanup` lacks a preceding purpose comment.
- **ISS-B06-146** (P1, .opencode/skill/system-spec-kit/scripts/spec/create.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-147** (P0, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Missing `set -euo pipefail` near the top of the script.
- **ISS-B06-148** (P2, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 159: function `log_fix` lacks a preceding purpose comment.
- **ISS-B06-149** (P2, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 170: function `log_suggest` lacks a preceding purpose comment.
- **ISS-B06-150** (P2, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 177: function `log_verbose` lacks a preceding purpose comment.
- **ISS-B06-151** (P2, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 594: function `generate_human_report` lacks a preceding purpose comment.
- **ISS-B06-152** (P2, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 627: function `generate_json_report` lacks a preceding purpose comment.
- **ISS-B06-153** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 123: non-standard explicit exit code `echo "ERROR: --level requires a value between 1 and 4" >&2; exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-154** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 131: non-standard explicit exit code `-*)           echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;`; checklist expects success=0 and error=1.
- **ISS-B06-155** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 136: non-standard explicit exit code `echo "ERROR: Multiple paths provided" >&2; exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-156** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 142: non-standard explicit exit code `[[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-157** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 144: non-standard explicit exit code `[[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-158** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 257: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-159** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 732: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-160** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Line 735: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-161** (P1, .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-162** (P0, .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh) - Missing `set -euo pipefail` near the top of the script.
- **ISS-B06-163** (P1, .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-164** (P2, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 74: function `info` lacks a preceding purpose comment.
- **ISS-B06-165** (P2, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 80: function `warn` lacks a preceding purpose comment.
- **ISS-B06-166** (P2, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 84: function `error_exit` lacks a preceding purpose comment.
- **ISS-B06-167** (P2, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 261: function `validate_upgrade_path` lacks a preceding purpose comment.
- **ISS-B06-168** (P1, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 43: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-169** (P1, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 1458: non-standard explicit exit code `exit 3`; checklist expects success=0 and error=1.
- **ISS-B06-170** (P1, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Line 1553: non-standard explicit exit code `exit 2`; checklist expects success=0 and error=1.
- **ISS-B06-171** (P1, .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-172** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 64: function `show_help` lacks a preceding purpose comment.
- **ISS-B06-173** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 87: function `parse_args` lacks a preceding purpose comment.
- **ISS-B06-174** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 108: function `has_phase_children` lacks a preceding purpose comment.
- **ISS-B06-175** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 118: function `apply_env_overrides` lacks a preceding purpose comment.
- **ISS-B06-176** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 127: function `load_config` lacks a preceding purpose comment.
- **ISS-B06-177** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 196: function `detect_level` lacks a preceding purpose comment.
- **ISS-B06-178** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 239: function `log_pass` lacks a preceding purpose comment.
- **ISS-B06-179** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 244: function `log_warn` lacks a preceding purpose comment.
- **ISS-B06-180** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 249: function `log_error` lacks a preceding purpose comment.
- **ISS-B06-181** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 254: function `log_info` lacks a preceding purpose comment.
- **ISS-B06-182** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 259: function `log_detail` lacks a preceding purpose comment.
- **ISS-B06-183** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 261: function `get_rule_severity` lacks a preceding purpose comment.
- **ISS-B06-184** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 270: function `should_run_rule` lacks a preceding purpose comment.
- **ISS-B06-185** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 300: function `rule_name_to_script` lacks a preceding purpose comment.
- **ISS-B06-186** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 325: function `get_rule_scripts` lacks a preceding purpose comment.
- **ISS-B06-187** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 342: function `run_all_rules` lacks a preceding purpose comment.
- **ISS-B06-188** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 399: function `print_header` lacks a preceding purpose comment.
- **ISS-B06-189** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 410: function `print_summary` lacks a preceding purpose comment.
- **ISS-B06-190** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 435: function `generate_json` lacks a preceding purpose comment.
- **ISS-B06-191** (P2, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 527: function `main` lacks a preceding purpose comment.
- **ISS-B06-192** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 263: error message appears to write to stdout: `FILE_EXISTS|FILES|PLACEHOLDER_FILLED|PLACEHOLDERS|ANCHORS_VALID|ANCHORS|TOC_POLICY) echo "error" ;;`
- **ISS-B06-193** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 265: error message appears to write to stdout: `SPEC_DOC_INTEGRITY|DOC_INTEGRITY) echo "error" ;;`
- **ISS-B06-194** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 267: error message appears to write to stdout: `*) echo "error" ;;`
- **ISS-B06-195** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 421: error message appears to write to stdout: `echo "RESULT: $status (errors=$ERRORS warnings=$WARNINGS)"`
- **ISS-B06-196** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 425: error message appears to write to stdout: `echo -e "  ${BOLD}Summary:${NC} ${RED}Errors:${NC} $ERRORS  ${YELLOW}Warnings:${NC} $WARNINGS"`
- **ISS-B06-197** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 428: error message appears to write to stdout: `if [[ $ERRORS -gt 0 ]]; then echo -e "  ${RED}${BOLD}RESULT: FAILED${NC}"`
- **ISS-B06-198** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 450: error message appears to write to stdout: `echo "{\"version\":\"$VERSION\",\"folder\":\"$folder_escaped\",\"level\":$json_level,\"levelMethod\":\"$LEVEL_METHOD\",\"config\":$cfg,\"results\":[$RESULTS]${phases_json},\"summary\":{\"errors\":$ERRORS,\"warnings\":$WARNINGS,\"info\":$INFOS},\"passed\":$passed,\"strict\":$STRICT_MODE}"`
- **ISS-B06-199** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 524: error message appears to write to stdout: `! $JSON_MODE && ! $QUIET_MODE && echo -e "\n  ${BOLD}Phase Summary:${NC} ${#phase_dirs[@]} phases, $child_errors errors, $child_warnings warnings" || true`
- **ISS-B06-200** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 98: non-standard explicit exit code `-*) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;`; checklist expects success=0 and error=1.
- **ISS-B06-201** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 99: non-standard explicit exit code `*) [[ -z "$FOLDER_PATH" ]] && FOLDER_PATH="$1" || { echo "ERROR: Multiple paths" >&2; exit 2; }; shift ;;`; checklist expects success=0 and error=1.
- **ISS-B06-202** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 102: non-standard explicit exit code `[[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-203** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 104: non-standard explicit exit code `[[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }`; checklist expects success=0 and error=1.
- **ISS-B06-204** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 547: non-standard explicit exit code `if [[ $ERRORS -gt 0 ]]; then exit 2; fi`; checklist expects success=0 and error=1.
- **ISS-B06-205** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Line 548: non-standard explicit exit code `if [[ $WARNINGS -gt 0 ]] && $STRICT_MODE; then exit 2; fi`; checklist expects success=0 and error=1.
- **ISS-B06-206** (P1, .opencode/skill/system-spec-kit/scripts/spec/validate.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-207** (P0, .opencode/skill/system-spec-kit/scripts/templates/compose.sh) - Missing `set -euo pipefail` near the top of the script.
- **ISS-B06-208** (P1, .opencode/skill/system-spec-kit/scripts/templates/compose.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-209** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Line 19: function `pass` lacks a preceding purpose comment.
- **ISS-B06-210** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Line 25: function `fail` lacks a preceding purpose comment.
- **ISS-B06-211** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Line 31: function `cleanup_all` lacks a preceding purpose comment.
- **ISS-B06-212** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Line 41: function `make_temp_repo` lacks a preceding purpose comment.
- **ISS-B06-213** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Line 64: function `json_field` lacks a preceding purpose comment.
- **ISS-B06-214** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Line 75: error message appears to write to stdout: `echo "ERROR: create.sh not found at $SOURCE_SCRIPTS_DIR/create.sh"`
- **ISS-B06-215** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-216** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 23: function `pass` lacks a preceding purpose comment.
- **ISS-B06-217** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 24: function `fail` lacks a preceding purpose comment.
- **ISS-B06-218** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 25: function `skip` lacks a preceding purpose comment.
- **ISS-B06-219** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 26: function `begin_category` lacks a preceding purpose comment.
- **ISS-B06-220** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 31: function `cleanup_all` lacks a preceding purpose comment.
- **ISS-B06-221** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 40: function `make_temp_dir` lacks a preceding purpose comment.
- **ISS-B06-222** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 57: error message appears to write to stdout: `echo "ERROR: upgrade-level.sh not found at $UPGRADE_SCRIPT"`
- **ISS-B06-223** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Line 62: error message appears to write to stdout: `echo "ERROR: shell-common.sh not found at $SHELL_COMMON"`
- **ISS-B06-224** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-225** (P0, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Missing `set -euo pipefail` near the top of the script.
- **ISS-B06-226** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Line 111: function `format_time` lacks a preceding purpose comment.
- **ISS-B06-227** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Line 122: function `get_time_ms` lacks a preceding purpose comment.
- **ISS-B06-228** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Line 132: function `to_lower` lacks a preceding purpose comment.
- **ISS-B06-229** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Line 136: function `contains_ci` lacks a preceding purpose comment.
- **ISS-B06-230** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Line 148: function `save_category_summary` lacks a preceding purpose comment.
- **ISS-B06-231** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-232** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 84: function `format_time` lacks a preceding purpose comment.
- **ISS-B06-233** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 95: function `get_time_ms` lacks a preceding purpose comment.
- **ISS-B06-234** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 108: function `to_lower` lacks a preceding purpose comment.
- **ISS-B06-235** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 112: function `contains_ci` lacks a preceding purpose comment.
- **ISS-B06-236** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 126: function `save_category_summary` lacks a preceding purpose comment.
- **ISS-B06-237** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 315: function `run_test_with_flags` lacks a preceding purpose comment.
- **ISS-B06-238** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 422: function `run_test_json_valid` lacks a preceding purpose comment.
- **ISS-B06-239** (P2, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Line 516: function `run_test_quiet` lacks a preceding purpose comment.
- **ISS-B06-240** (P1, .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh) - Script has explicit exit codes but does not document them in a header comment.
- **ISS-B06-241** (P1, .opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh) - Line 75: error message appears to write to stdout: `echo "Failed: ${total_errors}"`
- **ISS-B06-242** (P1, .opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh) - Script has explicit exit codes but does not document them in a header comment.

## Recommendations
1. Add `#!/usr/bin/env bash` (or `#!/bin/bash`) and `set -euo pipefail` to every shell script that lacks them.
2. Fix every SC2086-style unquoted expansion by wrapping variables in double quotes unless deliberate word splitting is documented inline.
3. Rename camelCase/PascalCase identifiers to snake_case while preserving the style-guide allowance for `_private_helper` and `_PRIVATE_SENTINEL` names.
4. Send error output to stderr with `>&2` and normalize non-zero exits to the requested `exit 1` convention unless a stronger contract is explicitly documented.
