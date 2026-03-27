---
title: "Progressive validation for spec documents"
description: "Progressive validation runs a 4-level pipeline (detect, auto-fix, suggest, report) on top of `validate.sh` for spec documents."
---

# Progressive validation for spec documents

## 1. OVERVIEW

Progressive validation runs a 4-level pipeline (detect, auto-fix, suggest, report) on top of `validate.sh` for spec documents.

This tool checks your project documents for problems in four steps: find issues, fix the easy ones automatically, suggest fixes for the harder ones and write up a report. It works like a spell-checker that also auto-corrects obvious typos and highlights the rest for you to review.

---

## 2. CURRENT REALITY

The `progressive-validate.sh` wrapper in `scripts/spec/` runs a 4-level pipeline on top of `validate.sh`:

1. **Detect (Level 1)** delegates validation to `validate.sh` and captures the compatible detect exit status.
2. **Auto-fix (Level 2)** applies safe mechanical fixes (date placeholders, heading normalization, whitespace/line-ending normalization) with logged before/after diffs.
3. **Suggest (Level 3)** derives remediation guidance for non-automatable failures from JSON validation output.
4. **Report (Level 4)** emits a consolidated human or JSON summary including detect outcome, auto-fixes and suggestions.

Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit code behavior matches `validate.sh`: **0 = pass, 1 = warnings, 2 = errors** (with `--strict`, warnings are promoted to exit 2).

**Cross-reference**: The structural contracts validated by `validate.sh` are now codified in `references/validation/template_compliance_contract.md` and embedded as compact anchor-to-H2 mapping tables in all @speckit agent definitions. See `18-template-compliance-contract-enforcement.md` for the 3-layer enforcement architecture that ensures agents produce compliant documents at generation time.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/spec/progressive-validate.sh` | Script | Progressive 4-level validation wrapper around validate.sh |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/progressive-validation.vitest.ts` | Pipeline prerequisites, detect behavior, auto-fix transforms/diff logging, suggest guidance, report output modes, exit code contract, dry-run semantics, edge-case handling and level progression |

### Feature Test Coverage

| Test Group | Coverage Area |
|------------|---------------|
| `CHK-PI-B2-001` | Level 1 detect execution, missing-file detection, JSON detect output, non-mutation at detect-only |
| `CHK-PI-B2-002` | Level 2 date auto-fix (`YYYY-MM-DD`, `[DATE]`, `date: TBD`) |
| `CHK-PI-B2-003` | Level 2 heading-level normalization and relative heading preservation |
| `CHK-PI-B2-004` | Level 2 whitespace normalization (trim trailing spaces, CRLF→LF, terminal newline) |
| `CHK-PI-B2-005` | Auto-fix audit logging with typed entries and diff output in JSON/human reports |
| `CHK-PI-B2-006` | Level 3 suggestion generation and remediation guidance presence |
| `CHK-PI-B2-007` | Level 4 report shape (JSON keys, human summary, quiet output, dry-run reflection) |
| `CHK-PI-B2-008` | Exit code compatibility (0/1/2), strict-mode escalation and cross-level consistency |
| `CHK-PI-B2-009` | Dry-run no-write guarantee with proposed-fix reporting |
| `CHK-PI-B2-010` | Backward-compatibility of direct `validate.sh` callers |
| `Pipeline Level Progression` | Level sequencing checks for level 2/3 behavior and level 4 defaulting |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Progressive validation for spec documents
- Current reality source: direct script audit of `scripts/spec/progressive-validate.sh` and `mcp_server/tests/progressive-validation.vitest.ts`
