# README Audit A15 — mcp_server/{api,core,database}

**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6
**Scope:** 3 folders under `mcp_server/`

---

## 1. `mcp_server/api/`

**Status:** UPDATED

**Actual files:**
- `index.ts`, `eval.ts`, `indexing.ts`, `search.ts`, `providers.ts`, `storage.ts`, `README.md`

**Issues found:**
1. **No YAML frontmatter** — missing `title`, `description`, `trigger_phrases` block
2. **Non-standard H2 sections** — used plain names ("Purpose", "Available Modules") instead of numbered ALL CAPS ("1. OVERVIEW", "2. AVAILABLE MODULES")
3. **No ANCHOR comments** — missing `<!-- ANCHOR:... -->` wrappers
4. **HVR-banned word** — "curated" on line 7
5. **Module descriptions shallow** — `eval.ts` said "Evaluation metrics and reporting" but actually exports ablation framework, BM25 baseline, ground-truth loader, and eval DB init; `search.ts` said "Search operations" but exports hybrid search, FTS5/BM25, and vector index; `providers.ts` said "Embedding providers and retry-queue access" but exports generation, query embedding, profile access, and retry manager

**Actions taken:**
- Added YAML frontmatter with trigger phrases
- Restructured to numbered ALL CAPS H2 sections (1. OVERVIEW through 5. RELATED)
- Added ANCHOR comment wrappers
- Removed banned word "curated" (replaced with "stable, well-bounded")
- Enriched module descriptions to reflect actual exports
- Added cross-references to core/ and handlers/ READMEs

---

## 2. `mcp_server/core/`

**Status:** PASS

**Actual files:**
- `config.ts`, `db-state.ts`, `index.ts`, `README.md`

**Evidence:**
- YAML frontmatter present with title, description, trigger_phrases
- Numbered ALL CAPS H2 sections (1. OVERVIEW through 4. RELATED)
- ANCHOR comment wrappers present
- All 3 source files listed and accurately described
- `config.ts` description matches: path constants, input limits, batch config, cooldown, allowed base paths (verified against actual exports: `INPUT_LIMITS`, `MAX_QUERY_LENGTH`, `ALLOWED_BASE_PATHS`, `INDEX_SCAN_COOLDOWN`, `BATCH_SIZE`, `BATCH_DELAY_MS`, `CONSTITUTIONAL_CACHE_TTL`, `COGNITIVE_CONFIG`)
- `db-state.ts` description matches: external DB update detection, reinit lifecycle, readiness state, cache accessors (verified: `checkDatabaseUpdated()`, `reinitializeDatabase()`, `isEmbeddingModelReady()`, `getConstitutionalCache()`, etc.)
- `init()` dependency list matches actual `DbStateDeps` interface: `vectorIndex`, `checkpoints`, `accessTracker`, `hybridSearch`, `sessionManager`, `incrementalIndex`
- Hardening notes (BUG-001, HIGH-002, BUG-005, P4-12/P4-19, P4-13) all correspond to actual code patterns
- No HVR-banned words found

---

## 3. `mcp_server/database/`

**Status:** UPDATED

**Actual files:**
- `.gitkeep`, `.db-updated`, `README.md`
- `context-index.sqlite` (symlink to `../dist/database/context-index.sqlite`)
- `context-index__voyage__voyage-4__1024.sqlite` (+ `-wal`, `-shm`)
- `speckit-eval.db` (+ `-wal`, `-shm`)

**Issues found:**
1. **Missing database files in listing** — README mentioned only `context-index.sqlite` symlink and `dist/database/` canonical path, but did not document:
   - `context-index__voyage__voyage-4__1024.sqlite` (embedding-profile-specific vector store)
   - `speckit-eval.db` (evaluation results database from `scripts/evals/`)
2. **Operational notes outdated** — "Single-database policy" statement was inaccurate; there are now 3 database files serving distinct purposes

**No structural issues:**
- YAML frontmatter present
- Numbered ALL CAPS H2 sections
- ANCHOR wrappers present
- No HVR-banned words found

**Actions taken:**
- Added embedding-profile database and evaluation database to the OVERVIEW file listing
- Updated OPERATIONAL NOTES section: replaced "single-database policy" with accurate descriptions of all three databases and their roles
- Documented the naming convention for profile databases (`context-index__<provider>__<model>__<dims>.sqlite`)

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `mcp_server/api/` | UPDATED | 5 (no frontmatter, wrong H2 style, no anchors, banned word, shallow descriptions) | Full rewrite to standard format |
| `mcp_server/core/` | PASS | 0 | None |
| `mcp_server/database/` | UPDATED | 2 (missing database files, outdated single-DB policy) | Added file listings and updated operational notes |
