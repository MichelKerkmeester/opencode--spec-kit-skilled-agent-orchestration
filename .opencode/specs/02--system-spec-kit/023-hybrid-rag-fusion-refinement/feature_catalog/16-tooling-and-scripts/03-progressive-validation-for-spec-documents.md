# Progressive validation for spec documents

## Current Reality

The `progressive-validate.sh` script (748 LOC) wraps `validate.sh` with four progressive levels. Level 1 (Detect) identifies all violations. Level 2 (Auto-fix) applies safe mechanical corrections like missing dates, heading levels and whitespace with before/after diff logging. Level 3 (Suggest) presents non-automatable issues with guided remediation options. Level 4 (Report) produces structured output in JSON or human-readable format.

Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit codes maintain compatibility with `validate.sh`: 0 for pass, 1 for warnings, 2 for errors. The dry-run mode previews all changes before applying them.

---

## Source Metadata

- Group: Tooling and scripts
- Source feature title: Progressive validation for spec documents
- Summary match found: Yes
- Summary source feature title: Progressive validation for spec documents
- Current reality source: feature_catalog.md
