# README Audit A20 — scripts/spec, scripts/spec-folder, scripts/rules

**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6
**Base path:** `.opencode/skill/system-spec-kit`

---

## 1. scripts/spec/ — UPDATED

**Files on disk (10 .sh + README.md):**
`archive.sh`, `calculate-completeness.sh`, `check-completion.sh`, `check-placeholders.sh`, `create.sh`, `progressive-validate.sh`, `recommend-level.sh`, `test-validation.sh`, `upgrade-level.sh`, `validate.sh`

**Issues found:**
- MISSING ENTRY: `progressive-validate.sh` not listed in Current Inventory section (README listed 9 scripts, disk has 10)

**Format checks:**
- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW, 2. CURRENT INVENTORY, 3. UPGRADE FLOW, 4. COMPLETION GATE, 5. NOTES)
- HVR-banned words: PASS (none found)
- File descriptions accurate: PASS (all 9 existing entries match their scripts)

**Action taken:**
- Added `progressive-validate.sh` entry: "progressive 4-level validation pipeline (detect, auto-fix, suggest, report)"

---

## 2. scripts/spec-folder/ — PASS

**Files on disk (5 .ts + README.md):**
`alignment-validator.ts`, `directory-setup.ts`, `folder-detector.ts`, `generate-description.ts`, `index.ts`

**Evidence of alignment:**
- README Structure section lists all 5 .ts files -- matches disk exactly
- Key Files table covers all 5 files with accurate descriptions
- Compiled output section correctly documents `dist/spec-folder/` counterparts

**Format checks:**
- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW, 2. QUICK START, 3. STRUCTURE, 4. TROUBLESHOOTING, 5. RELATED DOCUMENTS)
- HVR-banned words: PASS (none found)
- File descriptions accurate: PASS

**Action taken:** None required.

---

## 3. scripts/rules/ — UPDATED

**Files on disk (18 .sh + README.md):**
`check-ai-protocols.sh`, `check-anchors.sh`, `check-complexity.sh`, `check-evidence.sh`, `check-files.sh`, `check-folder-naming.sh`, `check-frontmatter.sh`, `check-level-match.sh`, `check-level.sh`, `check-links.sh`, `check-phase-links.sh`, `check-placeholders.sh`, `check-priority-tags.sh`, `check-section-counts.sh`, `check-sections.sh`, `check-spec-doc-integrity.sh`, `check-template-source.sh`, `check-toc-policy.sh`

**Issues found:**
- MISSING ENTRY: `check-spec-doc-integrity.sh` (SPEC_DOC_INTEGRITY rule) not listed in Structure tree, Key Files table, or Rule Catalog
- WRONG COUNT: Key Statistics table said "17" rules, actual count is 18
- WRONG COUNT: Quick Start comment said "Expected: 17 .sh files", should be 18

**Format checks:**
- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW through 7. RELATED DOCUMENTS)
- HVR-banned words: PASS (none found)
- File descriptions accurate: PASS (all 17 existing entries match their scripts)

**Actions taken:**
- Updated rule count from 17 to 18 in Key Statistics table
- Updated "Expected: 17" comment to "Expected: 18" in Quick Start
- Added `check-spec-doc-integrity.sh` to Structure tree with label: "SPEC_DOC_INTEGRITY - Markdown cross-reference validation"
- Added `check-spec-doc-integrity.sh` to Key Files table: "Reference validation: verifies inline markdown file references resolve"
- Added SPEC_DOC_INTEGRITY Rule Catalog entry with purpose, checks, and severity

---

## Summary

| Folder              | Status  | Issues | Actions |
| ------------------- | ------- | ------ | ------- |
| `scripts/spec/`     | UPDATED | 1      | Added missing `progressive-validate.sh` entry |
| `scripts/spec-folder/` | PASS | 0      | None |
| `scripts/rules/`    | UPDATED | 3      | Added missing rule, fixed counts (17 -> 18) |
