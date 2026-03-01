# Build Agent 06 Verification - Validation/Quality Scripts (C06)

Date: 2026-02-15  
Mode: Read-only validation (no source edits)  
Scope: Validate C06 findings against current shell scripts in `Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/{spec,rules}`.  
Constraint: Excluded node_modules-move-only issues.

## Verdict Summary

- Findings validated: 9/9
- Confirmed as reported: 2 (`C06-02`, `C06-04`)
- Confirmed with changed behavior/risk shape: 1 (`C06-01`)
- Not confirmed (stale, inaccurate, or policy choice): 6 (`C06-03`, `C06-05`, `C06-06`, `C06-07`, `C06-08`, `C06-09`)

## Confirmed Findings (Highest Priority)

### C06-02 - Zero-file anchor validation false pass (CONFIRMED)
- Evidence: `check-anchors.sh` validates only `memory/*.md` and returns pass when no memory files exist.
- Citations:
  - `.../scripts/rules/check-anchors.sh:28` (`memory_dir="$folder/memory"`)
  - `.../scripts/rules/check-anchors.sh:45-48` (empty memory files => `RULE_STATUS="pass"`)
- Risk type: False pass/blind spot.
- Impact: Anchor issues in non-memory markdown files are outside this rule's enforcement, so anchor quality can appear green while broader docs may be invalid.

### C06-04 - Case-insensitive section match allows false pass (CONFIRMED)
- Evidence: section checks use case-insensitive grep and non-exact match.
- Citation: `.../scripts/rules/check-sections.sh:60` (`grep -qi "$section"`).
- Risk type: False pass + brittle matching.
- Impact:
  - Wrong case (`problem statement`) still passes.
  - Substring matches can pass unintended headers.

### C06-01 - Backtick placeholder risk exists, but reported bypass shape changed (PARTIALLY CONFIRMED)
- Report claim (false pass due spaced backticks) does not match current implementation.
- Current behavior: script excludes some inline-code placeholder forms using literal filters:
  - `.../scripts/rules/check-placeholders.sh:89-91` (`grep -v '`{{'` and `grep -v '}}`'`).
- Risk type: brittle check with false-fail potential.
- Why: exclusion patterns are literal and spacing-sensitive; inline code placeholders with spacing variants may be flagged inconsistently.
- Conclusion: brittle placeholder handling is real, but current risk is primarily inconsistency/false-fail rather than the originally documented false-pass bypass pattern.

## Not Confirmed / Drifted Findings

### C06-03 - Severity/status misalignment allows fail->warn pass (NOT CONFIRMED as reported)
- Current orchestrator does not use per-rule shell exit code as the primary status channel; it uses `RULE_STATUS` set by each rule and mapped severity by rule name.
- Citations:
  - `.../scripts/spec/validate.sh:317-323` (`RULE_STATUS` drives log outcome)
  - `.../scripts/spec/validate.sh:371-374` (final exit determined by aggregated errors/warnings)
- Interpretation: the specific fail-exit/warn-severity mismatch model in C06 is stale for current code.
- Remaining governance risk: warnings are intentionally non-hard-fail unless strict mode is enabled.

### C06-05 - Level-1 fallback without spec.md validation (NOT CONFIRMED as release-pass risk)
- `detect_level` can infer Level 1, but missing `spec.md` is hard-failed by file existence rule.
- Citations:
  - `.../scripts/spec/validate.sh:207` (fallback inferred level)
  - `.../scripts/rules/check-files.sh:41` (missing `spec.md` => fail)
- Conclusion: standalone inference exists, but full validation path has hard-fail protection.

### C06-06 - Leading whitespace acceptance in checklist items (NOT CONFIRMED as defect)
- Behavior is permissive by design for markdown indentation; no clear hard-fail requirement violated.
- Citation: `.../scripts/rules/check-priority-tags.sh:63`.

### C06-07 - BSD/GNU awk portability issue (NOT CONFIRMED)
- Current awk usage is simple toggle logic and generally portable for this pattern.
- Citation: `.../scripts/rules/check-placeholders.sh:57-61`.

### C06-08 - realpath fallback on SPEC_PATH (NOT CONFIRMED)
- Current script does not normalize spec path with that pattern; `realpath` usage is for rule-script safety checks.
- Citation: `.../scripts/spec/validate.sh:287-289`.

### C06-09 - check-files likely regex mismatch (DISPROVEN)
- `check-files.sh` uses direct `-f` existence checks, not fragile filename regex matching.
- Citations:
  - `.../scripts/rules/check-files.sh:41-43`, `:68`, `:73`.

## Hard-Fail Behavior Assessment

- Hard-fail present:
  - Required file absence (`FILE_EXISTS`) is error severity and contributes to exit 2.
  - Anchor mismatches in memory files are fail/error.
- Hard-fail missing (policy-level):
  - `SECTIONS_PRESENT` is warning severity by design (`check-sections.sh:74`, `validate.sh:235`).
  - `PRIORITY_TAGS` is warning severity by design (`check-priority-tags.sh:95`, `validate.sh:235`).
- Practical risk:
  - In default mode, quality regressions can ship with exit 1 (warnings) rather than fail-stop exit 2.
  - This is not a bug by itself; it is a governance/strictness choice.

## False-Pass / False-Fail Risk Matrix

- False pass (confirmed):
  - `C06-02` (scope-limited anchor validation to memory files)
  - `C06-04` (case-insensitive + non-exact section matching)
- False fail / inconsistent detection (confirmed):
  - `C06-01` pattern brittleness around inline-code placeholder exclusions
- Not substantiated in current code:
  - `C06-03`, `C06-05`, `C06-07`, `C06-08`, `C06-09`

## Top Confirmed IDs

1. `C06-02`
2. `C06-04`
3. `C06-01` (risk-shape adjusted)
