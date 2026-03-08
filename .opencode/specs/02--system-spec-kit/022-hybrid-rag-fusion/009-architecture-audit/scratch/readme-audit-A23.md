# README Audit A23 — mcp_server/README.md

| Field         | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| **Folder**    | `.opencode/skill/system-spec-kit/mcp_server/`                |
| **File**      | `README.md` (1205 lines, ~59KB)                              |
| **Status**    | **PASS** (minor drift noted, no critical structural misalignment) |
| **Auditor**   | Claude Opus 4.6                                              |
| **Date**      | 2026-03-08                                                   |

---

## Checks Performed

### 1. YAML Frontmatter
**PASS.** Lines 1-9 contain valid YAML frontmatter with `title`, `description`, and `trigger_phrases`.

### 2. Numbered ALL CAPS H2 Sections
**PASS.** All 12 H2 sections use the `## N. UPPERCASE TITLE` pattern:
- `## 1. OVERVIEW` through `## 12. RELATED RESOURCES`
- TABLE OF CONTENTS section also uses ALL CAPS.

### 3. HVR-Banned Words
**PASS.** Zero matches for any of the 18 banned words (leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable).

### 4. Top-Level Directory Structure Accuracy

**Actual top-level directories** (17 total, excluding `node_modules/`):
`.github/`, `api/`, `configs/`, `core/`, `database/`, `dist/`, `formatters/`, `handlers/`, `hooks/`, `lib/`, `schemas/`, `scripts/`, `specs/`, `tests/`, `tools/`, `utils/`

**Actual top-level files** (8):
`_pending` (file), `cli.ts`, `context-server.ts`, `eslint.config.mjs`, `INSTALL_GUIDE.md`, `package.json`, `startup-checks.ts`, `tool-schemas.ts`, `tsconfig.json`, `vitest.config.ts`, `README.md`

#### Section 3 Directory Map table (line 210-222)
Lists 8 directories: `handlers/`, `lib/`, `tools/`, `core/`, `formatters/`, `scripts/`, `tests/`, `dist/`

**Missing from Directory Map** (not critical, but noted):
- `api/` — API layer modules
- `configs/` — Configuration files (partially covered in tree diagram)
- `database/` — SQLite database storage (partially covered in tree diagram)
- `hooks/` — MCP lifecycle hooks (covered in tree diagram, not in table)
- `schemas/` — Tool input schemas
- `specs/` — Local spec descriptions
- `utils/` — Utility modules
- `.github/` — GitHub hooks/config

This is minor drift. The Directory Map table is described as a summary, and the full tree in Section 7 covers most of these. The table omits `hooks/` which is architecturally significant but documented in the tree.

#### Section 7 STRUCTURE tree (lines 602-686)
Lists directories: `core/`, `handlers/`, `hooks/`, `lib/`, `tools/`, `formatters/`, `tests/`, `dist/`, `database/`, `configs/`

**Missing from tree diagram:**
- `api/` — exists on disk with 5 module files (eval, indexing, providers, search, storage)
- `schemas/` — exists on disk with `tool-input-schemas.ts`
- `scripts/` — exists on disk with `reindex-embeddings.ts`
- `specs/` — exists on disk with `descriptions.json`
- `utils/` — exists on disk with 7 files (batch-processor, db-helpers, index, json-helpers, tool-input-schema, validators, + README)
- `.github/` — exists on disk with `hooks/` subdirectory
- `_pending` — exists as a file (empty, 0 bytes)
- `eslint.config.mjs` — top-level file not in tree

**Files in handlers/ not in tree** (12 additional files on disk):
`causal-links-processor.ts`, `chunking-orchestrator.ts`, `eval-reporting.ts`, `handler-utils.ts`, `memory-index-alias.ts`, `memory-index-discovery.ts`, `memory-ingest.ts`, `mutation-hooks.ts`, `pe-gating.ts`, `quality-loop.ts`, `save/` (directory), `README.md`

**Files in hooks/ not in tree** (2 additional):
`mutation-feedback.ts`, `response-hints.ts`

**Directories in lib/ not in tree** (2 additional):
`graph/`, `ops/`

**Files in tools/ not in tree** (1 additional):
`types.ts`

### 5. Major Module Descriptions
**PASS.** The descriptions of core modules, the search pipeline, cognitive memory, MCP tools, and architecture layers are structurally accurate and internally consistent.

### 6. Top-Level File Coverage in Tree
**Minor drift.** The tree lists `eslint.config.mjs` is missing. `_pending` file is missing. Both are non-critical.

---

## Summary

| Check                          | Result   | Notes                                                       |
| ------------------------------ | -------- | ----------------------------------------------------------- |
| YAML frontmatter               | PASS     | Valid, complete                                              |
| Numbered ALL CAPS H2           | PASS     | All 12 sections conform                                     |
| HVR-banned words               | PASS     | Zero matches                                                |
| Directory Map table (Sec 3)    | PASS (minor) | 8 of 16 dirs listed; acceptable as summary table        |
| Full tree diagram (Sec 7)      | PASS (minor) | 10 of 16 dirs listed; 6 dirs missing from tree          |
| Handler file listing (Sec 7)   | DRIFT    | 12 handler files on disk not reflected in tree              |
| hooks/ file listing (Sec 7)    | DRIFT    | 2 hook files on disk not reflected in tree                  |
| lib/ subdirs (Sec 7)           | DRIFT    | 2 lib subdirs (`graph/`, `ops/`) not in tree               |
| Module descriptions            | PASS     | Accurate and consistent                                     |
| Top-level files                | PASS (minor) | `eslint.config.mjs` and `_pending` not in tree          |

**Overall: PASS.** The README is structurally sound with correct formatting conventions. The drift in Section 7's tree diagram (missing directories and files added after the README was last updated) is cosmetic, not critical. The tree captures the architectural skeleton accurately; new handler decomposition files and utility directories have been added incrementally without tree updates. No critical misalignment requires immediate rewrite of this 59KB file.

**Recommendation:** If a future README refresh is planned, add `api/`, `schemas/`, `scripts/`, `specs/`, `utils/` to the Section 7 tree and update the handlers block with the 12 new files. This is a low-priority maintenance item.
