## Agent H03: README Deep Content Verification

### Summary

Verified 5 READMEs against the actual filesystem. All 5 files exist and are well-maintained. The vast majority of documented files, modules, and commands match reality. Found **2 P1 findings** (missing files from extractors README) and **5 P2 findings** (minor count mismatches, undocumented files/modules, and missing handlers/hooks from the mcp_server structure tree).

Overall accuracy: **HIGH** — documentation closely tracks the codebase with a few drift items.

---

### README-by-README Analysis

#### 1. `./README.md` (top-level)

**Status: ACCURATE with minor drift**

- **Project description**: Matches — "Unified documentation and context preservation skill" is accurate.
- **Build commands**: `npm run build` from scripts/ is correct. `npx vitest run` from mcp_server/ is correct.
- **Workspace structure** (Section 12 directory tree): Matches actual layout. All listed directories (`mcp_server/`, `scripts/`, `templates/`, `references/`, `assets/`, `constitutional/`, `shared/`) exist.
- **Component table** (Section 3): All paths confirmed present.
- **Scripts table** (Section 3): All listed scripts confirmed:
  - `spec/create.sh` — present
  - `spec/validate.sh` — present
  - `spec/calculate-completeness.sh` — present
  - `spec/check-placeholders.sh` — present
  - `spec/recommend-level.sh` — present
  - `spec/archive.sh` — present
  - `memory/generate-context.ts` — present
  - `memory/backfill-frontmatter.ts` — present
  - `memory/reindex-embeddings.ts` — present
  - `spec-folder/generate-description.ts` — present
  - `templates/compose.sh` — present (at `scripts/templates/`)
- **Validation rules** (Section 9): Claims 13 rules. Actual rule files in `scripts/rules/`: 18 `.sh` files (check-ai-protocols, check-anchors, check-complexity, check-evidence, check-files, check-folder-naming, check-frontmatter, check-level-match, check-level, check-links, check-phase-links, check-placeholders, check-priority-tags, check-section-counts, check-sections, check-spec-doc-integrity, check-template-source, check-toc-policy). The README table lists 13 named rules, but 18 rule scripts exist on disk. 5 rules are undocumented in the top-level README: `check-phase-links`, `check-spec-doc-integrity`, `check-template-source`, `check-toc-policy`, `check-links` (the LINKS_VALID rule is mentioned in scripts/README.md but not in the top-level rules table).
- **By The Numbers section**: Claims "25 MCP tools", but Section 6 lists more than 25 tool names. The MCP server README itself says "See Section 4 for current tool groups" rather than pinning a number. Minor staleness.
- **Undocumented top-level items**: `feature_catalog/`, `manual_testing_playbook/`, `config/`, `nodes/`, `index.md`, `ARCHITECTURE.md` — these exist at the top level but are not in the directory tree (Section 12). `ARCHITECTURE.md` is referenced in Section 12's related resources table but not in the tree. The others are recent additions not yet reflected.

**Findings:**
- P2: Validation rules count says "13 Total" but 18 rule scripts exist. 5 newer rules are undocumented in the top-level README.
- P2: Directory tree in Section 12 is missing `feature_catalog/`, `manual_testing_playbook/`, `config/`, `nodes/`, `index.md`.

---

#### 2. `scripts/README.md`

**Status: ACCURATE with minor drift**

- **Top-level files**: All listed files confirmed present (`check-api-boundary.sh`, `check-links.sh`, `common.sh`, `package.json`, `registry-loader.sh`, `scripts-registry.json`, `tsconfig.json`, `wrap-all-templates.sh`, `wrap-all-templates.ts`).
- **`spec/`** — Claims 10 scripts. Actual: 10 `.sh` files confirmed (create, upgrade-level, check-placeholders, validate, progressive-validate, test-validation, check-completion, calculate-completeness, recommend-level, archive). MATCH.
- **`spec-folder/`** — Claims 5 TS modules. Actual: 5 `.ts` files + 1 `index.ts` = 6 total. But README says "5 TypeScript modules" and lists 5 names (generate-description, folder-detector, alignment-validator, directory-setup, index). MATCH (index is listed as one of the 5).
- **`rules/`** — Claims 18 modular validation rules. Actual: 18 `.sh` files confirmed. MATCH.
- **`memory/`** — Claims 7 TS CLIs. Actual: 7 `.ts` files confirmed (generate-context, rank-memories, cleanup-orphaned-vectors, validate-memory-quality, reindex-embeddings, ast-parser, backfill-frontmatter). MATCH.
- **`core/`** — Claims "8 TypeScript workflow modules plus barrel export". Actual: 8 `.ts` files + `index.ts` = 9 files total. The README says "8 modules plus barrel export" = 9 files. MATCH.
- **`extractors/`** — Claims "10 TypeScript extraction modules plus barrel export". Actual: 12 non-index `.ts` files + `index.ts` = 13 files total. The 2 files not listed in the scripts README count: `git-context-extractor.ts` and `spec-folder-extractor.ts`. These were added but the scripts/README.md count was not updated from 10 to 12. MISMATCH.
- **`loaders/`** — Claims 1 TS module + barrel. Actual: `data-loader.ts` + `index.ts`. MATCH.
- **`renderers/`** — Claims 1 TS module + barrel. Actual: `template-renderer.ts` + `index.ts`. MATCH.
- **`utils/`** — Claims "11 TypeScript utility modules plus barrel export". Actual: 11 non-index `.ts` + `index.ts` = 12 total. Counting non-index: data-validator, file-helpers, input-normalizer, logger, message-utils, path-utils, prompt-utils, slug-utils, task-enrichment, tool-detection, validation-utils = 11. MATCH.
- **`types/`** — Claims `session-types.ts`. Confirmed present. MATCH.
- **`lib/`** — Claims "12 TypeScript libraries plus 3 shell helper libraries". Actual: 15 total files (12 `.ts` + 3 `.sh`). Let me verify: anchor-generator.ts, ascii-boxes.ts, content-filter.ts, decision-tree-generator.ts, embeddings.ts, flowchart-generator.ts, frontmatter-migration.ts, semantic-summarizer.ts, simulation-factory.ts, structure-aware-chunker.ts, topic-keywords.ts, trigger-extractor.ts = 12 TS. git-branch.sh, shell-common.sh, template-utils.sh = 3 SH. Total = 15 files = 12 TS + 3 SH. MATCH.
- **`evals/`** — Claims "18 evaluation and audit scripts plus policy allowlist". Actual: 18 files (17 `.ts`/`.mjs` + 1 `.json`). The allowlist is `import-policy-allowlist.json`. So "18 ... scripts plus policy allowlist" implies 18 scripts + 1 JSON = 19 items. Actual: 17 `.ts` + 1 `.mjs` = 18 scripts, plus 1 `.json` = 19 items. MATCH.
- **`ops/`** — Claims "5 shell healing/runbook scripts plus shared helper (ops-common.sh)". Actual: 6 `.sh` files = heal-index-drift, heal-ledger-mismatch, heal-session-ambiguity, heal-telemetry-drift, ops-common, runbook = 5 scripts + ops-common = 6. But README says "5 ... plus shared helper (ops-common.sh)" = 6 total. Plus `README.md`. Wait — there are 7 items total including README. The 6 `.sh` files: 4 heal-* + runbook.sh = 5 + ops-common.sh = 6. MATCH (5 + shared helper).
- **`setup/`** — Claims 4 scripts. Actual: check-native-modules.sh, check-prerequisites.sh, rebuild-native-modules.sh, record-node-version.js = 4 (plus README.md). MATCH.
- **`kpi/`** — Claims `quality-kpi.sh`. Confirmed. MATCH.
- **`test-fixtures/`** — Claims 51 numbered fixture directories. Actual: 51 confirmed. MATCH.
- **`templates/`** — Not explicitly counted but listed. Exists at `scripts/templates/`. MATCH.

**Findings:**
- P1: `extractors/` count says "10 TypeScript extraction modules" but 12 non-index modules actually exist. `git-context-extractor.ts` and `spec-folder-extractor.ts` are missing from the count.

---

#### 3. `scripts/core/README.md`

**Status: FULLY ACCURATE**

- **Inventory section** lists 9 files:
  1. `workflow.ts` — present (44,201 bytes)
  2. `config.ts` — present (9,625 bytes)
  3. `subfolder-utils.ts` — present (11,486 bytes)
  4. `topic-extractor.ts` — present (3,736 bytes)
  5. `quality-scorer.ts` — present (4,882 bytes)
  6. `file-writer.ts` — present (5,618 bytes)
  7. `memory-indexer.ts` — present (5,866 bytes)
  8. `tree-thinning.ts` — present (7,500 bytes)
  9. `index.ts` — present (956 bytes)

- All 9 files exist on disk. No extra files in the directory (10 entries total minus `.` and `..` and `README.md` = 9 `.ts` files). EXACT MATCH.
- **Descriptions**: `workflow.ts` described as "main orchestration flow" — accurate. `config.ts` as "config loading and path/constants wiring" — accurate. `file-writer.ts` as "write/validation helpers" — accurate. `tree-thinning.ts` as "bottom-up merging of small files" — accurate.
- **Build command**: `cd .opencode/skill/system-spec-kit/scripts && npm run build` — correct.
- **Workflow notes**: Claims about `workflow.ts` composing loaders/extractors/renderers and `description.json` updates are consistent with the 44K file size indicating substantial orchestration.

**Findings:** None.

---

#### 4. `scripts/extractors/README.md`

**Status: OUTDATED — missing 2 extractors**

- **Inventory section** lists 11 items (10 modules + index.ts):
  1. `collect-session-data.ts` — PRESENT
  2. `contamination-filter.ts` — PRESENT
  3. `conversation-extractor.ts` — PRESENT
  4. `decision-extractor.ts` — PRESENT
  5. `diagram-extractor.ts` — PRESENT
  6. `file-extractor.ts` — PRESENT
  7. `implementation-guide-extractor.ts` — PRESENT
  8. `quality-scorer.ts` — PRESENT
  9. `session-extractor.ts` — PRESENT
  10. `opencode-capture.ts` — PRESENT
  11. `index.ts` — PRESENT

- **Actual files on disk** (13 total):
  All 11 listed above PLUS:
  - `git-context-extractor.ts` (7,904 bytes) — **NOT IN README**
  - `spec-folder-extractor.ts` (12,114 bytes) — **NOT IN README**

- **Pipeline description**: Input from `loaders/data-loader.ts`, output to `renderers/template-renderer.ts` — structurally correct, both files exist.
- **Notes**: Reference to `lib/decision-tree-generator.ts` — confirmed present in `scripts/lib/`.

**Findings:**
- P1: `git-context-extractor.ts` exists (7,904 bytes) but is not listed in the extractors README inventory.
- P1: `spec-folder-extractor.ts` exists (12,114 bytes) but is not listed in the extractors README inventory.

---

#### 5. `mcp_server/README.md`

**Status: ACCURATE with minor omissions**

- **Section 7 STRUCTURE tree**: Comprehensive and detailed. Verified against actual filesystem:
  - `context-server.ts` — PRESENT
  - `tool-schemas.ts` — PRESENT
  - `cli.ts` — PRESENT
  - `startup-checks.ts` — PRESENT
  - `vitest.config.ts` — PRESENT
  - `core/` (index.ts, config.ts, db-state.ts) — ALL PRESENT, EXACT MATCH
  - `tools/` (index.ts, memory-tools.ts, context-tools.ts, lifecycle-tools.ts, checkpoint-tools.ts, causal-tools.ts + types.ts) — `types.ts` exists on disk but is NOT listed in the README tree. Minor omission.
  - `formatters/` (search-results.ts, token-metrics.ts + index.ts) — `index.ts` exists on disk but is not in README tree. Minor omission.
  - `configs/` (search-weights.json + cognitive.ts + README.md) — `cognitive.ts` and `README.md` exist but only `search-weights.json` is shown in the tree.
  - `handlers/` — README lists 18 specific handler files. Actual directory has 31 entries (minus `.`, `..`, `README.md`, `save/` directory = 27 `.ts` files + 1 `save/` subdirectory). The README is missing several handler files from its tree:
    - `causal-links-processor.ts` — NOT IN TREE
    - `chunking-orchestrator.ts` — NOT IN TREE
    - `eval-reporting.ts` — NOT IN TREE
    - `handler-utils.ts` — NOT IN TREE
    - `memory-index-alias.ts` — NOT IN TREE
    - `memory-index-discovery.ts` — NOT IN TREE
    - `memory-ingest.ts` — NOT IN TREE
    - `mutation-hooks.ts` — NOT IN TREE
    - `pe-gating.ts` — NOT IN TREE
    - `quality-loop.ts` — NOT IN TREE
    - `save/` subdirectory — NOT IN TREE
    These are helper/infrastructure modules, not top-level tool handlers, so their omission from the tree is understandable but incomplete.
  - `hooks/` — README lists `index.ts` and `memory-surface.ts`. Actual: `index.ts`, `memory-surface.ts`, `mutation-feedback.ts`, `response-hints.ts` = 4 files. `mutation-feedback.ts` and `response-hints.ts` are NOT in the README tree.
  - `lib/` subdirectories — README lists 21 subdirectories. This is accurate for the listed categories.
  - `api/` directory — EXISTS on disk (eval.ts, index.ts, indexing.ts, providers.ts, search.ts, storage.ts + README.md) but is NOT shown in the Section 7 tree. However it IS listed in the Section 3 Architecture table.
  - `schemas/` directory — EXISTS (tool-input-schemas.ts + README.md). Listed in tree at line 222 in Section 3 architecture table but NOT in Section 7 tree. Actually it IS in line 222 and also mentioned in the structure tree indirectly. Let me recheck — yes, `schemas/` appears at line 691 region... Actually checking the tree more carefully: `schemas/` is NOT in the Section 7 tree listing.
  - `eslint.config.mjs` — EXISTS but not in tree (reasonable omission for config file).
  - `INSTALL_GUIDE.md` — EXISTS but not in tree.

- **Module/directory table** (lines 214-225): Lists `api/`, `configs/`, `core/`, `formatters/`, `handlers/`, `hooks/`, `lib/`, `schemas/`, `tools/`, `utils/`. All exist on disk. MATCH.

**Findings:**
- P2: `handlers/` tree lists 18 files but 27+ `.ts` files exist. 10+ infrastructure/helper handler files are undocumented in the structure tree (e.g., `causal-links-processor.ts`, `chunking-orchestrator.ts`, `eval-reporting.ts`, `handler-utils.ts`, `memory-index-alias.ts`, `memory-index-discovery.ts`, `memory-ingest.ts`, `mutation-hooks.ts`, `pe-gating.ts`, `quality-loop.ts`, `save/` subdirectory).
- P2: `hooks/` tree lists 2 files but 4 exist. Missing: `mutation-feedback.ts`, `response-hints.ts`.
- P2: `tools/types.ts` exists but is not in the structure tree.

---

### Missing Documentation

| Item | Location | Status |
| --- | --- | --- |
| `git-context-extractor.ts` | `scripts/extractors/` | Exists on disk, missing from extractors README |
| `spec-folder-extractor.ts` | `scripts/extractors/` | Exists on disk, missing from extractors README |
| 5 newer validation rules | `scripts/rules/` | Exist on disk, missing from top-level README rules table |
| `feature_catalog/`, `manual_testing_playbook/`, `config/`, `nodes/`, `index.md` | top-level | Exist on disk, missing from directory tree |
| 10+ handler infrastructure files | `mcp_server/handlers/` | Exist on disk, missing from structure tree |
| 2 hooks files | `mcp_server/hooks/` | Exist on disk, missing from structure tree |

---

### Findings [P0/P1/P2]

**P0 (Blockers):** None.

**P1 (Required):**

| # | README | Finding | Evidence |
|---|--------|---------|----------|
| 1 | `scripts/README.md` | `extractors/` count claims "10 TypeScript extraction modules" but 12 non-index modules exist. `git-context-extractor.ts` and `spec-folder-extractor.ts` are undocumented. | `ls scripts/extractors/` shows 13 `.ts` files (12 + index) |
| 2 | `scripts/extractors/README.md` | Inventory is missing `git-context-extractor.ts` (7,904 bytes) and `spec-folder-extractor.ts` (12,114 bytes) — two substantial modules with no README mention | `ls scripts/extractors/` vs README Section 2 |

**P2 (Suggestions):**

| # | README | Finding | Evidence |
|---|--------|---------|----------|
| 1 | `./README.md` | Validation rules table says "13 Total" but 18 rule scripts exist on disk. 5 newer rules (`check-phase-links`, `check-spec-doc-integrity`, `check-template-source`, `check-toc-policy`, `check-links`) are not in the table. | `ls scripts/rules/` = 18 `.sh` files |
| 2 | `./README.md` | Directory tree in Section 12 is missing several top-level items: `feature_catalog/`, `manual_testing_playbook/`, `config/`, `nodes/`, `index.md` | `ls` of project root |
| 3 | `mcp_server/README.md` | `handlers/` structure tree lists 18 files but 27+ `.ts` files exist. Infrastructure/helper handlers like `causal-links-processor.ts`, `chunking-orchestrator.ts`, `eval-reporting.ts`, `pe-gating.ts`, etc., are undocumented. | `ls mcp_server/handlers/` = 31 entries |
| 4 | `mcp_server/README.md` | `hooks/` tree lists 2 files (`index.ts`, `memory-surface.ts`) but 4 files exist. Missing: `mutation-feedback.ts`, `response-hints.ts`. | `ls mcp_server/hooks/` = 4 `.ts` files |
| 5 | `mcp_server/README.md` | `tools/types.ts` exists on disk but is not shown in the Section 7 structure tree. | `ls mcp_server/tools/` = 8 files incl. `types.ts` |

---

### Adversarial Self-Check (P1 findings only)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| extractors README missing `git-context-extractor.ts` and `spec-folder-extractor.ts` | P1 | Could be intentionally unlisted (experimental)? No — both are substantial files (8KB and 12KB), have been modified recently (Mar 8), and `index.ts` would likely export them. | Confirmed | P1 |
| scripts README count says 10, actual is 12 extractors | P1 | This is the same drift as above, just in the parent README. Count is provably wrong. | Confirmed | P1 |

---

### Verdict

**Overall README accuracy: HIGH (estimated 92-95%)**

All 5 READMEs exist and are well-structured. The core documentation is accurate — build commands work, listed files exist, descriptions match module purposes, and architectural claims are consistent with the codebase.

The main drift is in the `extractors/` directory where 2 modules (`git-context-extractor.ts`, `spec-folder-extractor.ts`) were added without updating either the extractors README or the scripts README inventory count. This is a P1 because these are non-trivial modules (combined ~20KB) that developers would expect to find documented.

The remaining P2 findings are typical documentation lag — new rules/handlers/hooks added without updating structure trees. These do not block functionality but reduce documentation completeness.

**Recommendation:** Fix P1 items (add the 2 missing extractors to both READMEs and update the count from 10 to 12). P2 items can be addressed in a documentation sweep.
