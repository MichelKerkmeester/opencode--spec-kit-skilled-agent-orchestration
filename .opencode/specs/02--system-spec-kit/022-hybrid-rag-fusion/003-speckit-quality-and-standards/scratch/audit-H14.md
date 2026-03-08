# Audit H-14: Shell Scripts

**Auditor:** Claude Opus 4.6 (leaf agent)
**Date:** 2026-03-08
**Scope:** 51 shell scripts across `scripts/` subdirectories (excluding `node_modules/`)

---

## Standards Reference

### P0 (Critical)
1. Shebang: `#!/usr/bin/env bash`
2. Strict Mode: `set -euo pipefail` immediately after header comment block
3. Double-Quoted Variables: ALL `$variable` expansions must be double-quoted
4. COMPONENT Header: Box-drawing header block with COMPONENT name
5. No Commented-Out Code: No blocks of commented-out executable code

### P1 (Important)
1. Function Naming: `lowercase_with_underscores`
2. Local Variables: `local` keyword in function variables
3. Exit Codes Documented: Header documents exit codes
4. Error to stderr: Error messages go to `>&2`

---

## Per-File Results

| File | P0 | P1 | Issues |
|------|----|----|--------|
| `check-api-boundary.sh` | PASS | FAIL (errors not to stderr) | 1 |
| `check-links.sh` | PASS | FAIL (no exit code docs) | 1 |
| `common.sh` | PASS | FAIL (no exit code docs) | 1 |
| `kpi/quality-kpi.sh` | PASS | FAIL (no exit code docs) | 1 |
| `lib/git-branch.sh` | FAIL (conditional strict, unquoted for-in vars) | FAIL (no exit code docs) | 3 |
| `lib/shell-common.sh` | FAIL (conditional strict) | FAIL (no exit code docs) | 2 |
| `lib/template-utils.sh` | FAIL (conditional strict) | FAIL (no exit code docs) | 2 |
| `ops/heal-index-drift.sh` | FAIL (no COMPONENT label) | FAIL (no exit code docs) | 2 |
| `ops/heal-ledger-mismatch.sh` | FAIL (no COMPONENT label) | FAIL (no exit code docs) | 2 |
| `ops/heal-session-ambiguity.sh` | FAIL (no COMPONENT label) | FAIL (no exit code docs) | 2 |
| `ops/heal-telemetry-drift.sh` | FAIL (no COMPONENT label) | FAIL (no exit code docs) | 2 |
| `ops/ops-common.sh` | FAIL (no COMPONENT label) | FAIL (no exit code docs) | 2 |
| `ops/runbook.sh` | FAIL (no COMPONENT label) | FAIL (no exit code docs) | 2 |
| `registry-loader.sh` | PASS | FAIL (no exit code docs, errors not to stderr) | 2 |
| `rules/check-ai-protocols.sh` | PASS | PASS | 0 |
| `rules/check-anchors.sh` | FAIL (unquoted for-in var) | PASS | 1 |
| `rules/check-complexity.sh` | PASS | PASS | 0 |
| `rules/check-evidence.sh` | PASS | PASS | 0 |
| `rules/check-files.sh` | PASS | PASS | 0 |
| `rules/check-folder-naming.sh` | PASS | PASS | 0 |
| `rules/check-frontmatter.sh` | PASS | PASS | 0 |
| `rules/check-level-match.sh` | PASS | PASS | 0 |
| `rules/check-level.sh` | PASS | PASS | 0 |
| `rules/check-links.sh` | PASS | PASS | 0 |
| `rules/check-phase-links.sh` | PASS | PASS | 0 |
| `rules/check-placeholders.sh` | PASS | PASS | 0 |
| `rules/check-priority-tags.sh` | PASS | PASS | 0 |
| `rules/check-section-counts.sh` | PASS | PASS | 0 |
| `rules/check-sections.sh` | PASS | PASS | 0 |
| `rules/check-spec-doc-integrity.sh` | PASS | PASS | 0 |
| `rules/check-template-source.sh` | PASS | PASS | 0 |
| `rules/check-toc-policy.sh` | PASS | PASS | 0 |
| `setup/check-native-modules.sh` | PASS | FAIL (no exit code docs, errors not to stderr) | 2 |
| `setup/check-prerequisites.sh` | PASS | FAIL (no exit code docs) | 1 |
| `setup/rebuild-native-modules.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/archive.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/calculate-completeness.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/check-completion.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/check-placeholders.sh` | PASS | PASS | 0 |
| `spec/create.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/progressive-validate.sh` | PASS | PASS | 0 |
| `spec/recommend-level.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/test-validation.sh` | PASS | FAIL (no exit code docs) | 1 |
| `spec/upgrade-level.sh` | PASS | PASS | 0 |
| `spec/validate.sh` | PASS | FAIL (no exit code docs) | 1 |
| `templates/compose.sh` | PASS | FAIL (no exit code docs) | 1 |
| `tests/test-phase-system.sh` | PASS | FAIL (no exit code docs, errors not to stderr) | 2 |
| `tests/test-upgrade-level.sh` | PASS | FAIL (no exit code docs, errors not to stderr) | 2 |
| `tests/test-validation-extended.sh` | PASS | PASS | 0 |
| `tests/test-validation.sh` | PASS | FAIL (no exit code docs) | 1 |
| `wrap-all-templates.sh` | FAIL (no COMPONENT header, no box-drawing) | FAIL (no exit code docs) | 3 |

---

## Detailed Findings

### P0 Issues (12 total across 10 files)

#### P0-1: Shebang -- ALL PASS
All 51 scripts use `#!/usr/bin/env bash` with correct encoding (no BOM, no trailing whitespace).

#### P0-2: Conditional Strict Mode in Library Files (3 files)

The three library files use conditional `set -euo pipefail` (only when executed directly, not when sourced). This is an intentional design pattern documented with AI-WHY comments.

**Files:**
- `lib/git-branch.sh` -- conditional on `BASH_SOURCE[0] == $0`
- `lib/shell-common.sh` -- conditional, with explicit AI-WHY comment explaining rationale
- `lib/template-utils.sh` -- conditional on `BASH_SOURCE[0] == $0`

**Mitigation:** These are sourced libraries. Unconditional strict mode would override the caller's shell options. The AI-WHY comment in `shell-common.sh` explicitly documents this design decision. Consider accepting as a documented exception.

#### P0-3: Unquoted Variable Expansions (2 files)

Word-splitting risk from unquoted variables in `for ... in` loops:

| File | Line | Code |
|------|------|------|
| `lib/git-branch.sh` | 72 | `for num in $remote_branches $local_branches $spec_dirs; do` |
| `lib/git-branch.sh` | 101 | `for word in $clean_name; do` |
| `rules/check-anchors.sh` | 124 | `for id in $all_ids; do` |

**Note:** These `for ... in $var` patterns rely on word-splitting to iterate over space-separated values. This is intentional behavior in Bash, but the P0 standard says ALL variable expansions must be double-quoted. If the intent is to split, the idiomatic safe alternative is to use arrays: `for id in "${all_ids[@]}"; do`.

#### P0-4: Missing COMPONENT Header (7 files)

The following files lack the standard `COMPONENT:` / `RULE:` / `LIBRARY:` / `SCRIPT:` label in the header block:

| File | Header Content | Has Box-Drawing |
|------|---------------|-----------------|
| `ops/heal-index-drift.sh` | `# Self-healing workflow: index drift.` | Yes |
| `ops/heal-ledger-mismatch.sh` | `# Self-healing workflow: ledger mismatch.` | Yes |
| `ops/heal-session-ambiguity.sh` | `# Self-healing workflow: session ambiguity.` | Yes |
| `ops/heal-telemetry-drift.sh` | `# Self-healing workflow: telemetry drift.` | Yes |
| `ops/ops-common.sh` | `# Shared deterministic retry + escalation helpers...` | Yes |
| `ops/runbook.sh` | `# Runbook helper for deterministic self-healing classes.` | Yes |
| `wrap-all-templates.sh` | `# Wraps all level_1-3+ template files...` | No |

The 6 `ops/` files have box-drawing borders but omit the `COMPONENT:` label. `wrap-all-templates.sh` has neither box-drawing nor a COMPONENT label.

#### P0-5: No Commented-Out Code -- ALL PASS
No blocks of commented-out executable code found in any script.

---

### P1 Issues (30 total across 25 files)

#### P1-1: Function Naming -- ALL PASS
All functions use `lowercase_with_underscores` convention. Functions prefixed with `_` (e.g., `_ai_get_declared_level`, `_json_escape`) follow the private function convention consistently.

#### P1-2: Local Variables in Functions -- ALL PASS
All function-scoped variable assignments use the `local` keyword. No missing `local` declarations found via automated scan.

#### P1-3: Exit Codes Not Documented (24 files)

The following scripts do not document their exit codes in the header comment block:

| Category | Files Missing Exit Code Docs |
|----------|------------------------------|
| **Top-level** | `check-links.sh`, `common.sh`, `registry-loader.sh`, `wrap-all-templates.sh` |
| **kpi/** | `quality-kpi.sh` |
| **ops/** | `heal-index-drift.sh`, `heal-ledger-mismatch.sh`, `heal-session-ambiguity.sh`, `heal-telemetry-drift.sh`, `ops-common.sh`, `runbook.sh` |
| **setup/** | `check-native-modules.sh`, `check-prerequisites.sh`, `rebuild-native-modules.sh` |
| **spec/** | `archive.sh`, `calculate-completeness.sh`, `check-completion.sh`, `create.sh`, `recommend-level.sh`, `test-validation.sh`, `validate.sh` |
| **templates/** | `compose.sh` |
| **tests/** | `test-phase-system.sh`, `test-upgrade-level.sh`, `test-validation.sh` |

**Exemptions applied:** The 18 `rules/check-*.sh` files all define `run_check()` and are sourced by `validate.sh`. They don't exit independently, so exit code documentation is not applicable. `rules/check-links.sh` is an exception that can run standalone and DOES document exit codes. `rules/check-spec-doc-integrity.sh` also uses `run_check()` and is correctly exempted (corrected from prior audit which listed it as FAIL).

**Scripts that DO document exit codes:** `check-api-boundary.sh`, `rules/check-links.sh`, `spec/check-placeholders.sh`, `spec/progressive-validate.sh`, `spec/upgrade-level.sh`, `tests/test-validation-extended.sh`.

#### P1-4: Error Messages Not to stderr (6 files)

| File | Lines | Error Messages Not Sent to `>&2` |
|------|-------|----------------------------------|
| `check-api-boundary.sh` | 19, 28 | `echo "ERROR: ..."` (boundary checker errors) |
| `registry-loader.sh` | 65, 73 | `echo -e "${RED}Error: jq is required...${NC}"`, `echo -e "${RED}Error: Registry file not found...${NC}"` |
| `setup/check-native-modules.sh` | 14 | `echo "ERROR: node is required but was not found in PATH"` |
| `tests/test-phase-system.sh` | 75 | `echo "ERROR: create.sh not found..."` |
| `tests/test-upgrade-level.sh` | 57, 62 | `echo "ERROR: upgrade-level.sh not found..."`, `echo "ERROR: shell-common.sh not found..."` |

**Note:** Test scripts use `FAIL:` / `PASS:` as test result reporting to stdout, which is valid test framework convention. Only the `ERROR:` messages for missing prerequisites are genuine stderr candidates. `spec/check-completion.sh` was removed from this list -- its JSON error output to stdout is intentional for `--json` mode consumers.

---

## Summary

- Files scanned: 51
- P0 issues: 12
- P1 issues: 30
- Top 3 worst: `wrap-all-templates.sh` (3), `lib/git-branch.sh` (3), `ops/heal-index-drift.sh` (2)

| Metric | Count |
|--------|-------|
| **Total files audited** | 51 |
| **P0 issues** | 12 (3 conditional strict mode + 3 unquoted vars + 7 missing COMPONENT header) |
| **P1 issues** | 30 (24 missing exit code docs + 6 errors not to stderr) |
| **Total issues** | 42 |
| **Files with 0 issues** | 19 (37%) |
| **Files with issues** | 32 (63%) |

### Top 3 Worst Files

| Rank | File | Issue Count | Issues |
|------|------|-------------|--------|
| 1 | `wrap-all-templates.sh` | 3 | P0: no COMPONENT header, no box-drawing; P1: no exit code docs |
| 1 | `lib/git-branch.sh` | 3 | P0: conditional strict mode, 2 unquoted for-in vars; P1: no exit code docs |
| 3 | `lib/shell-common.sh` | 2 | P0: conditional strict mode; P1: no exit code docs |
| 3 | `lib/template-utils.sh` | 2 | P0: conditional strict mode; P1: no exit code docs |
| 3 | `ops/heal-index-drift.sh` | 2 | P0: no COMPONENT label; P1: no exit code docs |
| 3 | `ops/heal-ledger-mismatch.sh` | 2 | P0: no COMPONENT label; P1: no exit code docs |
| 3 | `ops/heal-session-ambiguity.sh` | 2 | P0: no COMPONENT label; P1: no exit code docs |
| 3 | `ops/heal-telemetry-drift.sh` | 2 | P0: no COMPONENT label; P1: no exit code docs |
| 3 | `ops/ops-common.sh` | 2 | P0: no COMPONENT label; P1: no exit code docs |
| 3 | `ops/runbook.sh` | 2 | P0: no COMPONENT label; P1: no exit code docs |

### Observations

1. **The `rules/` directory is the cleanest** -- 17 of 18 rule scripts pass both P0 and P1. Only `check-anchors.sh` has a P0 issue (unquoted for-in variable). These scripts follow a consistent sourced-library pattern with `run_check()` and proper `local` variable usage.

2. **The `ops/` directory is the least compliant** -- all 6 files fail P0 (missing COMPONENT label) and P1 (no exit code docs). They have consistent box-drawing borders but use descriptive comments instead of the `COMPONENT:` label convention.

3. **The dominant P1 issue is missing exit code documentation** (24/51 files). This is a documentation gap, not a functional issue. Many scripts do use distinct exit codes (0/1/2) but don't document them.

4. **Unquoted for-in variables** (3 instances in 2 files) are intentional word-splitting patterns but technically violate P0-3. The safe alternative is to use Bash arrays.

5. **The 3 library files with conditional strict mode** have an intentional, documented rationale. These could be accepted as exceptions with a formal standards annotation.

6. **Error-to-stderr issues** are concentrated in setup scripts, test scripts, and utilities. Test scripts have valid reasons to report failures to stdout.

### Corrections from Prior Audit

This audit corrects the following issues found in the prior version:
- File count: 51 (was 50)
- Added 6 `ops/` files as P0-4 failures (missing COMPONENT label)
- Added 2 files with unquoted for-in variable expansions (P0-3)
- Corrected `rules/check-spec-doc-integrity.sh` from P1 FAIL to PASS (uses same `run_check()` pattern as other rules/)
- Removed `spec/check-completion.sh` from P1-4 stderr list (JSON error to stdout is intentional)
- Total issues revised from 36 to 42
