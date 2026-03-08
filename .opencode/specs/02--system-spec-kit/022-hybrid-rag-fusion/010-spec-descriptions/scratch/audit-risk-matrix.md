# Risk & Bug Priority Matrix

## Top 10 Highest-Risk Items

| Rank | Issue ID | Category | Priority | Description | Affected |
|------|----------|----------|----------|-------------|----------|
| 1 | ISS-A07-ALL | Spec Compliance | P0 | 007-ux-hooks claims 100% but only 52% verifiable — 10 false completions with boilerplate evidence | 007-ux-hooks-automation |
| 2 | ISS-A05-P0E | Spec Compliance | P0 | 37/69 P0 items in 005-core-rag have WEAK evidence (generic "Done"/"Complete" without file refs) | 005-core-rag-sprints |
| 3 | ISS-C02-SRC | Feature Gaps | P0 | Only 7/20 sampled feature snippet source files exist (35% accuracy) — catalog references nonexistent paths | feature_catalog/ |
| 4 | ISS-C05-ALL | Spec Compliance | P0 | ALL 12 spec folders FAIL template compliance — frontmatter missing required fields, template source uses shorthand | All 001-012 folders |
| 5 | ISS-C01-LNK | Documentation | P0 | 147 broken source links in feature_catalog.md monolith; 0/167 features have usage examples | feature_catalog.md |
| 6 | ISS-D02-XREF | Cross-Reference | P0 | 14+ broken cross-references between spec folders — epic (001) references 8 folders that don't exist | 001-epic, 005-core-rag |
| 7 | ISS-A02-DEF | Spec Compliance | P1 | P0/P1 items in 002-indexing marked complete despite explicit "Deferred with scope approval" evidence | 002-indexing-normalization |
| 8 | ISS-C03-INC | Documentation | P1 | 115/155 playbook scenarios incomplete — missing Signals, Evidence, Pass/Fail, Triage fields | manual_testing_playbook |
| 9 | ISS-D09-UNX | Code Quality | P1 | 383 unused exports across mcp_server/ (243) and scripts/ (140) — dead code accumulation | mcp_server/, scripts/ |
| 10 | ISS-A09-STALE | Spec Compliance | P1 | 009-arch-audit: 2/9 sampled findings stale — ARCHITECTURE_BOUNDARIES.md cited but doesn't exist, allowlist mismatch | 009-architecture-audit |

## Full Issue Inventory

### P0 — Critical (6 issues)

| Issue ID | Source | Description |
|----------|--------|-------------|
| ISS-A07-ALL | A-07 | 007 claims 100% but only 52% has specific evidence; 10 items are false completions |
| ISS-A05-P0E | A-05 | 37/69 P0 items in 005 have weak evidence; sprint boundaries unclear |
| ISS-C02-SRC | C-02 | 13/20 sampled feature snippets reference source files that don't exist |
| ISS-C05-ALL | C-05 | 12/12 spec folders fail frontmatter validation (missing title/status/level/created/updated) |
| ISS-C01-LNK | C-01 | 147 broken source links in feature catalog; DQI score 3/5 |
| ISS-D02-XREF | D-02 | 14+ cross-references in epic/core-rag point to non-existent folders |

### P1 — High (12 issues)

| Issue ID | Source | Description |
|----------|--------|-------------|
| ISS-A01-DISC | A-01 | 001-epic: 78.9% actual vs 85% claimed (+6.1% discrepancy) |
| ISS-A02-DEF | A-02 | 002: P0/P1 items marked [x] with "Deferred" evidence (CHK-110/111/122/123/130/131) |
| ISS-A02-P0 | A-02 | 002: P0 item CHK-011 contradicts own evidence (claims no warnings, evidence shows warnings) |
| ISS-A08-TPL | A-08 | 008: Template source placement inconsistent across files |
| ISS-A09-STALE | A-09 | 009: ARCHITECTURE_BOUNDARIES.md cited but file doesn't exist; allowlist has 4 entries, doc says 2 |
| ISS-A10-TASK | A-10 | 010: 0/25 tasks done in tasks.md but checklist is partially complete — contradiction |
| ISS-B02-HDR | B-02 | 12/12 lib/ files missing JSDoc file headers |
| ISS-C03-INC | C-03 | 115/155 playbook scenarios missing required fields |
| ISS-D04-GAP | D-04 | 17/55 feature gaps still unaddressed |
| ISS-D08-CNT | D-08 | Tool count inconsistency: README says 25, package.json says 23, code has 28 |
| ISS-D09-UNX | D-09 | 383 unused exports (potential dead code) |
| ISS-D09-BRK | D-09 | 1 broken import: channel.vitest.ts → ../lib/session/channel (missing) |

### P2 — Medium (8 issues)

| Issue ID | Source | Description |
|----------|--------|-------------|
| ISS-B04-TXN | B-04 | 1 transaction handling issue in memory/ |
| ISS-B06-SET | B-06 | 5 shell scripts missing `set -euo pipefail` |
| ISS-B06-DOC | B-06 | Functions in common.sh lack purpose comments |
| ISS-B07-PKG | B-07 | package.json uses caret ranges instead of exact pins; missing test script |
| ISS-B07-ENG | B-07 | Missing Node engine requirement in scripts/package.json |
| ISS-C01-HVR | C-01 | 7 uses of "comprehensive" (HVR banned word) in feature catalog |
| ISS-C06-HVR | C-06 | 5 total HVR banned words across spec folders (2 "robust", 3 "comprehensive") |
| ISS-A04-TPL | A-04 | 004: Template compliance FAIL despite 100% checklist completion |

## Theme Analysis

| Theme | P0 | P1 | P2 | Total |
|-------|----|----|----|----|
| Spec Compliance | 3 | 4 | 1 | 8 |
| Code Quality | 0 | 3 | 4 | 7 |
| Documentation | 2 | 2 | 2 | 6 |
| Feature Gaps | 1 | 1 | 0 | 2 |
| Cross-Reference | 0 | 2 | 0 | 2 |
| **TOTAL** | **6** | **12** | **8** | **26** |

## Recommendations by Priority

### P0 — Immediate Action Required
1. **Fix false completion claims** in 007: Uncheck items with boilerplate evidence or add specific evidence
2. **Strengthen P0 evidence** in 005-core-rag: 37 items need file paths, test results, or commit refs
3. **Fix feature catalog source links**: 147 broken links need path corrections or removal
4. **Normalize frontmatter** across all 12 spec folders: Add required YAML fields per v2.2
5. **Update cross-references** in 001-epic: Remove or redirect 14+ references to non-existent folders

### P1 — Address This Sprint
1. Complete playbook scenarios (115 missing fields)
2. Add JSDoc headers to lib/ files
3. Reconcile tool counts across README/package.json/code
4. Clean up 383 unused exports
5. Fix tasks.md vs checklist.md contradictions in 010
