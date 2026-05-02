# README Audit A24 -- scripts/ and mcp_server/scripts/

Base path: `.opencode/skill/system-spec-kit`

---

## 1. scripts/README.md

**Status:** UPDATED

### Issues Found

1. **Missing top-level files (3):** `check-api-boundary.sh`, `wrap-all-templates.sh`, `wrap-all-templates.ts` were not listed.
2. **Missing directories (5):** `utils/`, `types/`, `ops/`, `setup/`, `test-fixtures/` were omitted from the inventory.
3. **Wrong file count -- spec/ directory:** Listed 8 scripts, actual is 10 (`progressive-validate.sh` and `test-validation.sh` were missing).
4. **Wrong module count -- extractors/:** Listed "11 modules plus barrel", actual is 10 modules plus barrel.
5. **Wrong module count -- loaders/:** Listed "2 modules plus barrel", actual is 1 module (`data-loader.ts`) plus barrel.
6. **Wrong module count -- renderers/:** Listed "2 modules plus barrel", actual is 1 module (`template-renderer.ts`) plus barrel.
7. **Missing related READMEs (7):** `utils/README.md`, `types/README.md`, `evals/README.md`, `ops/README.md`, `setup/README.md`, `kpi/README.md`, `test-fixtures/README.md` were not listed.

### Format Checks

- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS
- HVR-banned words: PASS (none found)

### Actions Taken

- Updated top-level file list to include all 9 files (alphabetical order).
- Added 5 missing directories (`utils/`, `types/`, `ops/`, `setup/`, `test-fixtures/`) with accurate descriptions.
- Corrected spec/ count from 8 to 10 scripts.
- Corrected extractors/ count from 11 to 10 modules.
- Corrected loaders/ count from 2 to 1 module.
- Corrected renderers/ count from 2 to 1 module.
- Added 7 missing entries to the Related READMEs section.

---

## 2. mcp_server/scripts/README.md

**Status:** PASS

### Evidence

- Folder contains exactly 2 files: `reindex-embeddings.ts` and `README.md`. The README accurately documents this single-wrapper structure.
- YAML frontmatter: present with title, description, trigger_phrases.
- Numbered ALL CAPS H2 sections: `## 1. OVERVIEW` through `## 5. RELATED`. Correct format.
- File inventory table matches actual contents (1 file: `reindex-embeddings.ts`).
- Canonical location cross-references are accurate.
- HVR-banned words: none found.
- No issues detected.
