# README Audit A18 -- scripts/core, scripts/memory, scripts/evals

**Date:** 2026-03-08
**Auditor:** claude-opus-4-6
**Base path:** `.opencode/skill/system-spec-kit`

---

## 1. scripts/core/

**Status:** UPDATED

| Check | Result |
|-------|--------|
| All files listed | FAIL -- `tree-thinning.ts` was missing |
| Descriptions accurate | PASS |
| Module structure matches code | PASS |
| YAML frontmatter | PASS |
| Numbered ALL CAPS H2 sections | PASS (5 sections) |
| HVR-banned words | PASS -- none found |

**Issues found:**
- `tree-thinning.ts` (bottom-up merging of small files during context loading) was present in folder but absent from section 2 CURRENT INVENTORY.

**Actions taken:**
- Added `tree-thinning.ts` entry to inventory list between `memory-indexer.ts` and `index.ts`.

**Actual file count:** 9 `.ts` files + README.md. README now lists all 9.

---

## 2. scripts/memory/

**Status:** UPDATED

| Check | Result |
|-------|--------|
| All files listed | PASS -- all 7 `.ts` files present |
| Descriptions accurate | PASS |
| Module structure matches code | PASS |
| YAML frontmatter | PASS |
| Numbered ALL CAPS H2 sections | FAIL -- unnumbered `## Canonical Runbook` between sections 1 and 2 |
| HVR-banned words | PASS -- none found |

**Issues found:**
- `## Canonical Runbook` was a standalone H2 that broke the numbered ALL CAPS convention. It sat between `## 1. OVERVIEW` and `## 2. CURRENT INVENTORY`.

**Actions taken:**
- Folded the canonical-runbook content (2 lines) into section 1 OVERVIEW as trailing paragraphs. Removed the standalone H2.

**Actual file count:** 7 `.ts` files + README.md. README lists all 7.

---

## 3. scripts/evals/

**Status:** UPDATED

| Check | Result |
|-------|--------|
| All files listed | FAIL -- 5 scripts missing from inventory |
| Descriptions accurate | PASS (for listed scripts) |
| Module structure matches code | FAIL -- missing scripts |
| YAML frontmatter | FAIL -- absent |
| Numbered ALL CAPS H2 sections | FAIL -- used plain H2 headers |
| HVR-banned words | PASS -- none found |

**Issues found:**
1. No YAML frontmatter (title, description, trigger_phrases).
2. H2 sections used plain names (`## Purpose`, `## Import Policy`, `## Script Inventory`, `## Reference`) instead of numbered ALL CAPS format.
3. Five scripts missing from inventory table:
   - `check-allowlist-expiry.ts` -- warns on near-expiry / fails on expired allowlist exceptions
   - `check-handler-cycles-ast.ts` -- detects circular import/re-export dependencies in handlers via AST
   - `check-no-mcp-lib-imports.ts` -- scans scripts/ for prohibited internal runtime imports
   - `check-no-mcp-lib-imports-ast.ts` -- AST-based enforcement with transitive re-export traversal
   - `import-policy-rules.ts` -- shared detection rules for prohibited imports
4. `import-policy-allowlist.json` not mentioned as supporting data.

**Actions taken:**
- Added YAML frontmatter with title, description, and trigger_phrases.
- Converted all H2 sections to numbered ALL CAPS format (4 sections: OVERVIEW, IMPORT POLICY, SCRIPT INVENTORY, REFERENCE).
- Added ANCHOR comments around each section.
- Added TABLE OF CONTENTS section.
- Added all 5 missing scripts to inventory table with descriptions derived from source MODULE headers.
- Added `import-policy-allowlist.json` as supporting data below the table.
- Sorted inventory table alphabetically by script name.

**Actual file count:** 17 `.ts`/`.mjs` scripts + 1 `.json` data file + README.md. README now lists all 17 scripts + 1 data file.

---

## Summary

| Folder | Status | Issues | Fixes |
|--------|--------|--------|-------|
| `scripts/core/` | UPDATED | 1 missing file in inventory | Added `tree-thinning.ts` |
| `scripts/memory/` | UPDATED | 1 unnumbered H2 breaking convention | Folded into section 1 |
| `scripts/evals/` | UPDATED | 4 structural issues, 5 missing scripts | Full rewrite with frontmatter, numbered sections, complete inventory |
