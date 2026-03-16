# README Audit A19 — scripts/ Subfolders (extractors, lib, loaders, renderers)

**Date:** 2026-03-08
**Scope:** 4 folders under `.opencode/skill/system-spec-kit/scripts/`
**Checks:** file completeness, description accuracy, YAML frontmatter, numbered ALL CAPS H2 sections, HVR-banned words

---

## 1. scripts/extractors/

**Status:** PASS

- **Files on disk (11):** `collect-session-data.ts`, `contamination-filter.ts`, `conversation-extractor.ts`, `decision-extractor.ts`, `diagram-extractor.ts`, `file-extractor.ts`, `implementation-guide-extractor.ts`, `index.ts`, `opencode-capture.ts`, `quality-scorer.ts`, `session-extractor.ts`
- **Files in README (11):** All 11 listed. Complete match.
- **Descriptions:** Accurate for the two files that have inline descriptions (`contamination-filter.ts`, `quality-scorer.ts`).
- **YAML frontmatter:** Present (title, description, trigger_phrases).
- **Numbered ALL CAPS H2:** Yes (1. OVERVIEW through 5. QUICK IMPORT CHECK).
- **HVR-banned words:** None found.
- **Issues:** None.

---

## 2. scripts/lib/

**Status:** UPDATED

- **Files on disk (15):** `anchor-generator.ts`, `ascii-boxes.ts`, `content-filter.ts`, `decision-tree-generator.ts`, `embeddings.ts`, `flowchart-generator.ts`, `frontmatter-migration.ts`, `git-branch.sh`, `semantic-summarizer.ts`, `shell-common.sh`, `simulation-factory.ts`, `structure-aware-chunker.ts`, `template-utils.sh`, `topic-keywords.ts`, `trigger-extractor.ts`
- **Files in README before fix (13):** 11 TS (including struck-through `retry-manager.ts`) + 3 shell = 14 entries, but only 13 actual on-disk files covered.
- **Missing from README:** `topic-keywords.ts`, `frontmatter-migration.ts`
- **YAML frontmatter:** Present.
- **Numbered ALL CAPS H2:** Yes (1. OVERVIEW through 4. QUICK VALIDATION).
- **HVR-banned words:** None found.
- **Issues found:**
  1. `topic-keywords.ts` not listed (shared lexical helpers for topic extraction).
  2. `frontmatter-migration.ts` not listed (helpers for safe markdown frontmatter normalization).
- **Actions taken:** Added both files to the TypeScript modules list in section 2. CURRENT INVENTORY, in alphabetical order with brief descriptions.

---

## 3. scripts/loaders/

**Status:** PASS

- **Files on disk (2):** `data-loader.ts`, `index.ts`
- **Files in README (2):** Both listed. Complete match.
- **Descriptions:** Accurate (`data-loader.ts` described as source loading, path checks, normalization, fallback handling).
- **YAML frontmatter:** Present.
- **Numbered ALL CAPS H2:** Yes (1. OVERVIEW through 5. QUICK USAGE).
- **HVR-banned words:** None found.
- **Issues:** None.

---

## 4. scripts/renderers/

**Status:** PASS

- **Files on disk (2):** `template-renderer.ts`, `index.ts`
- **Files in README (2):** Both listed. Complete match.
- **Descriptions:** Accurate (`template-renderer.ts` described as variable substitution, sections, loops, and cleanup).
- **YAML frontmatter:** Present.
- **Numbered ALL CAPS H2:** Yes (1. OVERVIEW through 4. RUNTIME).
- **HVR-banned words:** None found.
- **Issues:** None.

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `scripts/extractors/` | PASS | 0 | None |
| `scripts/lib/` | UPDATED | 2 missing files | Added `topic-keywords.ts` and `frontmatter-migration.ts` to inventory |
| `scripts/loaders/` | PASS | 0 | None |
| `scripts/renderers/` | PASS | 0 | None |

**Total:** 3 PASS, 1 UPDATED. One README required modification.
