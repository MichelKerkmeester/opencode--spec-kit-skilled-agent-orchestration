# Agent 2: Shell Standards Verification Report

**Reviewer:** @review (Claude Opus 4.6, read-only)
**Date:** 2026-03-08
**Standard Reference:** `sk-code-opencode` SKILL.md + `references/shell/style_guide.md` + `references/shell/quality_standards.md`
**Mode:** Focused File Review (Mode 3)
**Confidence:** HIGH — all three files fully read; all findings cite verified file:line locations

---

## Summary

| File | Score | Verdict |
|------|-------|---------|
| `create.sh` (phase sections) | 82/100 | ACCEPTABLE |
| `validate.sh` (phase sections) | 78/100 | ACCEPTABLE |
| `check-phase-links.sh` (full) | 85/100 | ACCEPTABLE |

**Overall Recommendation:** PASS with notes. All three scripts follow the shell standards to an acceptable degree. No P0 blockers found. Several P1/P2 items documented below.

---

## Score Breakdown

| Dimension | create.sh | validate.sh | check-phase-links.sh |
|-----------|-----------|-------------|---------------------|
| Correctness (30) | 26 | 24 | 27 |
| Security (25) | 22 | 22 | 22 |
| Patterns (20) | 17 | 15 | 18 |
| Maintainability (15) | 10 | 10 | 12 |
| Performance (10) | 7 | 7 | 6 |

---

## Per-File Analysis: 7-Check Matrix

### File 1: `create.sh`

**Path:** `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
**Total LOC:** 1179
**Phase-related sections reviewed:** Lines 40-44, 110-156, 270-280, 558-985

#### Check 1: Box-drawing header — PASS

**Evidence (lines 2-4):**
```bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Create Spec Folder
# ───────────────────────────────────────────────────────────────
```
Uses `───` box-drawing characters in the standard `COMPONENT:` format. Matches the template defined in `style_guide.md` section 2 ("Alternative" detailed header format). The header also includes a multi-line description block (lines 5-20) which is the correct pattern for major scripts.

#### Check 2: Shebang + strict mode — PASS

**Evidence (lines 1, 22):**
```bash
#!/usr/bin/env bash   # line 1
set -euo pipefail     # line 22
```
Correct portable shebang. Strict mode appears after the header block and source statements. The standard requires it "immediately after the shebang/header," and the intervening lines 2-21 are all header comments. Sourced libraries appear at lines 25-28 before strict mode, but this is acceptable since `set -euo pipefail` at line 22 precedes the library sourcing. PASS.

#### Check 3: Numbered ALL-CAPS sections — PASS

**Evidence:** Sections found at:
- Line 282: `# 1. HELPER FUNCTIONS`
- Line 398: `# 2. REPOSITORY DETECTION`
- Line 421: `# 3. SUBFOLDER MODE`
- Line 493: `# 3b. SHARED: Branch Name Generation & Git Branch Creation`
- Line 558: `# 3c. PHASE MODE`
- Line 987: `# 4. BRANCH NAME GENERATION`
- Line 994: `# 5. CREATE SPEC FOLDER STRUCTURE`
- Line 1022: `# 6. COPY TEMPLATES BASED ON DOCUMENTATION LEVEL`
- Line 1034: `# 6.5. GENERATE PER-FOLDER description.json`
- Line 1048: `# 7. SHARDED SPEC SECTIONS`
- Line 1089: `# 10. OUTPUT`

All use numbered ALL-CAPS format with box-drawing dividers. Minor note: section numbering jumps from 7 to 10 (skipping 8-9). The use of `3b` and `3c` sub-sections is a minor deviation from pure numbered format but is reasonable for code flow organization.

**Verdict:** PASS (P2 note: section numbering gap 7-to-10)

#### Check 4: snake_case naming — PASS

**Evidence:**
- Functions: `slugify_token` (line 286), `create_versioned_subfolder` (line 291), `resolve_existing_dir` (line 329), `is_path_within` (line 339), `validate_spec_folder_basename` (line 345), `resolve_and_validate_spec_path` (line 354), `resolve_branch_name` (line 500), `create_git_branch` (line 543) — all snake_case.
- Global variables: `JSON_MODE`, `SHORT_NAME`, `BRANCH_NUMBER`, `DOC_LEVEL`, `SKIP_BRANCH`, `PHASE_MODE`, `PHASE_COUNT` — all UPPER_SNAKE_CASE for globals.
- Local variables inside functions: `local file_path`, `local output_dir`, `local max_version`, `local base_folder` — all snake_case.
- Phase-section variables using underscore-prefix convention for loop temps: `_raw_names`, `_trimmed`, `_slugified`, `_child_folder`, `_child_path`, `_phase_number` — snake_case with underscore prefix (consistent internal helper convention).

No camelCase or PascalCase violations found.

#### Check 5: AI-intent comments — PARTIAL

**Evidence of good practice:**
- Line 460: `# P1-03 FIX: Escape JSON values to prevent injection` (AI-TRACE pattern)
- Line 46: `# Initialize variables used in JSON output (prevents "unbound variable" errors with set -u)` (explains WHY)
- Line 270: `# Mutual exclusivity check: --phase and --subfolder cannot be combined` (explains WHY)

**Evidence of violations:**
- Line 24: `# Source shared libraries` — describes WHAT, not WHY
- Line 585: `# ── Parse PHASE_NAMES into array ──` — describes WHAT
- Line 658: `# ── Build child folder name list ──` — describes WHAT
- Line 690: `# ── Inject or append Phase Documentation Map into parent spec.md ──` — describes WHAT
- Line 820: `# ── Create child phase folders ──` — describes WHAT
- Line 852: `# Inject parent back-reference into child spec.md` — describes WHAT

However, the `──` prefixed comments serve as sub-section dividers within the phase block, which is a legitimate organizational pattern analogous to numbered section headers. The comment density is within limits (well under 3 per 10 LOC across the phase sections).

**Verdict:** PARTIAL — Sub-section dividers are acceptable, but several comments narrate implementation steps rather than using AI-intent tags. No formal `AI-WHY`, `AI-GUARD`, `AI-INVARIANT`, or `AI-TRACE` prefixes on most comments.

#### Check 6: Guard clauses — PASS

**Evidence:**
- Lines 60-74: `--level` validation uses early-return `exit 1` pattern
- Lines 85-95: `--subfolder` validation uses early-return
- Lines 270-280: Mutual exclusivity checks with early `exit 1`
- Lines 296-299: `create_versioned_subfolder` validates base folder exists
- Lines 364-368: `resolve_and_validate_spec_path` validates path exists
- Lines 575-583: Phase addendum template validation with early `exit 1`
- Lines 593-596: Empty slugified name validation with early `exit 1`
- Lines 615-619: `--parent` spec.md existence check with early `exit 1`

Consistent guard-clause pattern throughout.

#### Check 7: Readonly constants — PARTIAL

**Evidence of good practice:**
- Line 568: `readonly PHASE_ADDENDUM_DIR="$TEMPLATES_BASE/addendum/phase"` — correctly uses `readonly`

**Evidence of missing `readonly`:**
- Line 19: `VERSION` is not declared anywhere in create.sh (sourced from library)
- Lines 30-44: `JSON_MODE`, `SHORT_NAME`, `BRANCH_NUMBER`, etc. — these are mutable flags, so `readonly` is not appropriate. PASS for these.
- Line 567: `TEMPLATES_BASE` is not `readonly` even though it's set once and never modified in phase mode.

**Verdict:** PARTIAL — The one true constant (`PHASE_ADDENDUM_DIR`) is correctly `readonly`. `TEMPLATES_BASE` could benefit from `readonly` but is set conditionally in multiple code paths, making it harder to apply consistently.

---

### File 2: `validate.sh`

**Path:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
**Total LOC:** 553
**Phase-related sections reviewed:** Lines 27, 108-116, 312 (PHASE_LINKS rule mapping), 447-525, 527-551

#### Check 1: Box-drawing header — PASS

**Evidence (lines 2-4):**
```bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Validate Spec
# ───────────────────────────────────────────────────────────────
```
Standard format with `───` box-drawing characters.

#### Check 2: Shebang + strict mode — PASS

**Evidence (lines 1, 8):**
```bash
#!/usr/bin/env bash   # line 1
set -euo pipefail     # line 8
```
Strict mode appears after the header comments and one descriptive comment. Correct.

#### Check 3: Numbered ALL-CAPS sections — FAIL

**Evidence:** The script does NOT use numbered ALL-CAPS section dividers. There are no lines matching the pattern `# N. SECTION_NAME` anywhere in the file. The code is organized by function definitions (`show_help`, `parse_args`, `apply_env_overrides`, `load_config`, `detect_level`, `log_pass`, `run_all_rules`, etc.) without numbered section headers between them.

The style guide (section 2, "Section Organization") requires: "Organize code into numbered sections" with the box-drawing divider format:
```bash
# ───────────────────────────────────────────────────────────────
# 1. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────
```

The `validate.sh` script omits this organizational structure entirely.

**Verdict:** FAIL — No numbered ALL-CAPS section headers found. The script uses function grouping but does not apply the required section divider pattern.

#### Check 4: snake_case naming — PASS

**Evidence:**
- Functions: `get_time_ms` (line 33), `show_help` (line 64), `parse_args` (line 87), `has_phase_children` (line 108), `apply_env_overrides` (line 118), `load_config` (line 127), `validate_template_hashes` (line 168), `detect_level` (line 196), `log_pass` (line 239), `log_warn` (line 244), `log_error` (line 249), `log_info` (line 254), `log_detail` (line 259), `get_rule_severity` (line 261), `should_run_rule` (line 270), `canonicalize_rule_name` (line 273), `rule_name_to_script` (line 300), `get_rule_scripts` (line 325), `run_all_rules` (line 342), `print_header` (line 399), `print_summary` (line 410), `generate_json` (line 435), `run_recursive_validation` (line 454), `main` (line 527) — all snake_case.
- Globals: `FOLDER_PATH`, `DETECTED_LEVEL`, `JSON_MODE`, `STRICT_MODE`, `ERRORS`, `WARNINGS`, `PHASE_RESULTS`, `PHASE_COUNT` — all UPPER_SNAKE_CASE.
- Locals: `local parent_folder`, `local child_errors`, `local phase_results`, `local phase_name` — all snake_case.

No naming violations.

#### Check 5: AI-intent comments — PARTIAL

**Evidence of good practice:**
- Lines 35-36: `# P1-01 FIX: macOS date +%s%N outputs literal "N" ...` — AI-TRACE pattern with explanation of WHY
- Line 7: `# Strict mode with guarded dynamic expansions.` — explains WHY
- Lines 344-346: `# T501 FIX: Normalize level for numeric comparisons (strip "+" suffix)` — AI-TRACE pattern
- Line 353: `# P1-14 FIX: Validate rule script before sourcing` — AI-TRACE pattern

**Evidence of violations:**
- Line 23: `# State` — narrates WHAT, not WHY
- Line 29: `# Rule execution order (empty = alphabetical)` — describes WHAT
- Line 48: `# Colors (disabled for non-TTY)` — describes WHAT
- Line 166: `# Template hash validation - checks if spec files match original templates` — describes WHAT

Comment density is well within limits. The "WHAT" comments are mild and serve as organizational aids.

**Verdict:** PARTIAL — Good use of `P1-xx FIX` and `T501 FIX` trace comments. Some WHAT-level comments remain, but they serve a readability purpose and density is low.

#### Check 6: Guard clauses — PASS

**Evidence:**
- Lines 11-14: Feature flag skip validation (early exit)
- Lines 98-99: Unknown option validation with early `exit 2`
- Lines 102-104: Missing folder path validation with early `exit 2`
- Lines 110-115: `has_phase_children` uses early-return pattern
- Lines 119-124: `apply_env_overrides` uses early-exit for disabled validation
- Lines 354-360: Rule script path traversal validation with continue (guard pattern)

Consistent guard-clause usage throughout.

#### Check 7: Readonly constants — FAIL

**Evidence:** No `readonly` or `declare -r` declarations found anywhere in the file.

Constants that should be `readonly`:
- Line 18: `VERSION="2.0.0"` — never modified, should be `readonly`
- Line 17: `RULES_DIR="$SCRIPT_DIR/../rules"` — never modified, should be `readonly`

**Verdict:** FAIL — `VERSION` and `RULES_DIR` are effectively constants but lack `readonly` declaration.

---

### File 3: `check-phase-links.sh`

**Path:** `.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh`
**Total LOC:** 125

#### Check 1: Box-drawing header — PASS

**Evidence (lines 2-4):**
```bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PHASE-LINKS
# ───────────────────────────────────────────────────────────────
```
Standard box-drawing format. Uses `RULE:` instead of `COMPONENT:` which is appropriate for rule scripts (differentiates from main components).

#### Check 2: Shebang + strict mode — PASS

**Evidence (lines 1, 7):**
```bash
#!/usr/bin/env bash   # line 1
set -euo pipefail     # line 7
```
Correct shebang and strict mode. The comment at line 6 ("Sourced by validate.sh and compatible with strict mode") explains WHY strict mode is declared even though this file is sourced rather than executed directly — good AI-intent comment.

#### Check 3: Numbered ALL-CAPS sections — PASS

**Evidence:**
- Lines 17-19: `# 1. INITIALIZATION`
- Lines 31-33: `# 2. VALIDATION LOGIC`
- Lines 111-113: `# 3. RESULTS`

All three sections use the numbered ALL-CAPS pattern with box-drawing dividers. Clean and complete.

#### Check 4: snake_case naming — PASS

**Evidence:**
- Function: `run_check` (line 21) — snake_case
- Local variables: `local folder`, `local level`, `local phase_dirs`, `local issues`, `local phase_name`, `local child_spec`, `local prev_name`, `local total_phases`, `local current_dir`, `local next_dir`, `local current_name`, `local next_name`, `local current_spec` — all snake_case
- Iterator variable: `_idx` (line 95) — underscore prefix for C-style loop variable, consistent with project convention

No naming violations.

#### Check 5: AI-intent comments — PASS

**Evidence:**
- Lines 9-15: Rule description block explaining WHAT the rule validates and WHEN it runs — appropriate for a rule script header
- Line 6: `# Sourced by validate.sh and compatible with strict mode.` — explains WHY strict mode is present
- Line 41: `# No phases = skip (pass with info message)` — explains WHY (behavior rationale)
- Line 50: `# Check 1: Parent spec.md has Phase Documentation Map` — acceptable as numbered check labels within validation logic
- Line 59: `# Check 2: Each child has spec.md with parent back-reference` — same pattern
- Line 77: `# Check 3: Predecessor references (each child except first should reference predecessor)` — same
- Line 93: `# Check 4: Successor references (each child except last should reference successor)` — same

Comment density: 14 comment lines across 125 LOC = approximately 1.1 comments per 10 LOC. Well within the 3/10 limit.

The "Check N:" pattern is a legitimate organizational device for validation rules — each describes WHY that particular validation exists by stating the invariant being checked.

**Verdict:** PASS

#### Check 6: Guard clauses — PASS

**Evidence:**
- Lines 42-46: No phase folders detected — early return with pass status
- Lines 51-57: Parent spec.md existence check with issue collection (instead of early exit, uses issue aggregation — appropriate for a validation rule that collects all issues)
- Lines 65-74: Child spec.md existence check with issue aggregation
- Lines 84-88: Predecessor check with conditional guard (`[[ -n "$prev_name" && -f "$child_spec" ]]`)
- Lines 104-108: Successor check with file existence guard

The pattern of collecting issues into an array rather than early-exiting is the correct approach for a validation rule — it reports all problems rather than stopping at the first.

#### Check 7: Readonly constants — PARTIAL

**Evidence:** No `readonly` declarations found. However, this script has no true constants — it's a single function (`run_check`) that uses only local variables. The `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS`, and `RULE_REMEDIATION` variables at lines 25-29 are part of the validate.sh rule contract (set by each rule and read by the caller). They are not constants; they are output variables.

**Verdict:** PARTIAL — No constants exist that require `readonly`, but also no demonstration of the pattern. Effectively N/A for this file.

---

## Consolidated Verdicts

| Check | create.sh | validate.sh | check-phase-links.sh |
|-------|-----------|-------------|---------------------|
| 1. Box-drawing header | **PASS** | **PASS** | **PASS** |
| 2. Shebang + strict mode | **PASS** | **PASS** | **PASS** |
| 3. Numbered ALL-CAPS sections | **PASS** (P2: numbering gap) | **FAIL** | **PASS** |
| 4. snake_case naming | **PASS** | **PASS** | **PASS** |
| 5. AI-intent comments | **PARTIAL** | **PARTIAL** | **PASS** |
| 6. Guard clauses | **PASS** | **PASS** | **PASS** |
| 7. Readonly constants | **PARTIAL** | **FAIL** | **PARTIAL** (N/A) |

---

## Issues Summary

### P1 — REQUIRED

| # | File | Line(s) | Finding | Recommendation |
|---|------|---------|---------|----------------|
| 1 | validate.sh | entire file | Missing numbered ALL-CAPS section headers. No `# N. SECTION_NAME` dividers found. | Add section dividers per `style_guide.md` section 2 (e.g., `# 1. CONFIGURATION`, `# 2. ARGUMENT PARSING`, `# 3. LEVEL DETECTION`, `# 4. RULE EXECUTION`, `# 5. OUTPUT`, `# 6. MAIN`). |
| 2 | validate.sh | 17-18 | `VERSION="2.0.0"` and `RULES_DIR` are never reassigned but lack `readonly` declaration. | Change to `readonly VERSION="2.0.0"` and `readonly RULES_DIR="$SCRIPT_DIR/../rules"`. |

### P2 — SUGGESTIONS

| # | File | Line(s) | Finding | Recommendation |
|---|------|---------|---------|----------------|
| 3 | create.sh | 1089 | Section numbering jumps from `7. SHARDED SPEC SECTIONS` to `10. OUTPUT` (gaps at 8, 9). | Renumber sections sequentially for clarity. |
| 4 | create.sh | 585, 658, 690, 820 | Sub-section dividers use `# ── Description ──` format which describes WHAT rather than WHY. | Consider adding brief AI-intent context (e.g., `# AI-WHY: phase names drive child folder naming below`). Low priority since these serve as structural dividers. |
| 5 | create.sh | 567 | `TEMPLATES_BASE` is set once in phase mode but not declared `readonly`. | Add `readonly` if guaranteed not to change in the phase code path. |
| 6 | validate.sh | 23, 29, 48 | Comments `# State`, `# Rule execution order`, `# Colors` describe WHAT not WHY. | Rephrase to explain intent (e.g., `# AI-WHY: separate counters enable per-phase rollup in recursive mode`). |
| 7 | create.sh | 24 | `# Source shared libraries` describes WHAT. | Rephrase or remove — the `source` statements are self-documenting. |

---

## Adversarial Self-Check (P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| validate.sh missing numbered section headers | P1 | "The script uses function grouping which provides implicit structure. At 553 LOC, numbered sections would help but are not strictly required for correctness." | Confirmed. The style guide explicitly requires numbered sections. At 553 LOC this is a real readability gap, not a nit. | **P1** |
| validate.sh missing `readonly` on VERSION/RULES_DIR | P1 | "These are used but never reassigned, so the risk is theoretical. Many shell scripts omit `readonly` without incident." | Confirmed but considered downgrading. The quality_standards.md section 3 (Naming Conventions) shows `readonly` for constants as the example pattern. VERSION is a textbook constant. | **P1** |

---

## Positive Highlights

1. **create.sh** — The phase mode implementation (lines 558-985) is well-structured with clear separation of concerns: template validation, name parsing, parent folder creation, child folder creation, and output. The temp file cleanup trap at line 572 is a good defensive pattern.

2. **validate.sh** — The recursive phase validation function (lines 454-525) correctly saves and restores parent state, preventing counter pollution between parent and child validations. The auto-recursive detection at line 529 is a thoughtful UX enhancement.

3. **check-phase-links.sh** — Cleanest of the three files. Excellent separation into 3 numbered sections. The 4-check validation sequence (parent map, child back-references, predecessors, successors) is comprehensive and well-organized. Issue aggregation pattern is correct for a validation rule.

4. **All files** — Consistent quoting of variables throughout (P0 quality standard). No unquoted variable expansions found.

5. **All files** — Guard clauses used consistently for input validation with early exits or returns.

---

## Gate Validation Result

| Metric | Value |
|--------|-------|
| Gate Type | post_execution |
| Result | **PASS** |
| Composite Score | 82/100 |
| P0 Blockers | 0 |
| P1 Required | 2 |
| P2 Suggestions | 5 |
| Confidence | HIGH |
