# README Audit A11 — scoring, extraction, parsing

**Date**: 2026-03-08
**Auditor**: Claude Opus 4.6
**Base path**: `.opencode/skill/system-spec-kit/mcp_server/lib/`

---

## 1. scoring/

**Path**: `mcp_server/lib/scoring/`
**Status**: UPDATED
**Actual files (7 .ts)**: composite-scoring.ts, confidence-tracker.ts, folder-scoring.ts, importance-tiers.ts, interference-scoring.ts, mpab-aggregation.ts, negative-feedback.ts

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | README listed 5 modules; actual folder has 7 .ts files | High |
| 2 | `mpab-aggregation.ts` missing from STRUCTURE tree and Key Files table | High |
| 3 | `negative-feedback.ts` missing from STRUCTURE tree and Key Files table | High |
| 4 | TOC line 20 syntax error: `[2. KEY CONCEPTS]](#2--key-concepts)` — extra `]` before `(` | Low |
| 5 | YAML frontmatter: present, correct | Pass |
| 6 | Numbered ALL CAPS H2 sections: present, correct | Pass |
| 7 | HVR-banned words: none found | Pass |

### Actions Taken

1. Fixed TOC syntax error on line 20 (removed extra `]`)
2. Updated module count from 5 to 7 in Module Statistics table
3. Added `mpab-aggregation.ts` to STRUCTURE tree with description
4. Added `negative-feedback.ts` to STRUCTURE tree with description
5. Added both files to Key Files table with accurate purpose descriptions
6. Updated migration notes from "5 of 7" to "7 of 9"
7. Bumped version to 1.9.0, date to 2026-03-08

---

## 2. extraction/

**Path**: `mcp_server/lib/extraction/`
**Status**: PASS
**Actual files (4 .ts)**: entity-denylist.ts, entity-extractor.ts, extraction-adapter.ts, redaction-gate.ts

### Evidence

| Check | Result |
|-------|--------|
| All files listed in README | Yes — all 4 .ts files present in STRUCTURE tree and Key Files table |
| File descriptions accurate | Yes — descriptions match module headers and exported APIs |
| Module count correct | Yes — "Modules: 4" matches actual count |
| YAML frontmatter | Present with title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes (1. OVERVIEW, 2. STRUCTURE, 3. FEATURES, 4. USAGE EXAMPLES, 5. CONFIGURATION, 6. RELATED RESOURCES) |
| HVR-banned words | None found |

No changes needed.

---

## 3. parsing/

**Path**: `mcp_server/lib/parsing/`
**Status**: UPDATED
**Actual files (4 .ts)**: content-normalizer.ts, entity-scope.ts, memory-parser.ts, trigger-matcher.ts

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | README listed 3 modules; actual folder has 4 .ts files | High |
| 2 | `content-normalizer.ts` missing from STRUCTURE tree, Key Files table, and FEATURES section | High |
| 3 | YAML frontmatter: present, correct | Pass |
| 4 | Numbered ALL CAPS H2 sections: present, correct | Pass |
| 5 | HVR-banned words: none found | Pass |

### Actions Taken

1. Updated module count from 3 to 4 in Key Statistics table
2. Added `content-normalizer.ts` to STRUCTURE tree with description
3. Added `content-normalizer.ts` to Key Files table with accurate purpose
4. Added full FEATURES subsection for Content Normalizer with purpose, aspect table, and 9 exported functions
5. Bumped version to 1.8.0, date to 2026-03-08

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `scoring/` | UPDATED | 4 (3 High, 1 Low) | 7 edits |
| `extraction/` | PASS | 0 | None |
| `parsing/` | UPDATED | 2 (2 High) | 5 edits |
