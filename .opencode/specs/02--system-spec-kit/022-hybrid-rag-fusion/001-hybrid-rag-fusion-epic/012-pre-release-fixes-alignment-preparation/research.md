# Research: Pre-Release Audit Findings

> 10-agent deep investigation of 022-hybrid-rag-fusion pre-release readiness.
> Date: 2026-03-24 | Agents: 10x GPT-5.4 (codex exec, high reasoning, read-only)

---

## P0 — BLOCKERS (Must fix before release)

### P0-1: MCP Server Startup Abort on Transient Network Failure
- **Agent**: 1 (MCP Server Health)
- **File**: `mcp_server/context-server.ts#L755`
- **Issue**: Default startup can abort before serving if API-key validation reports any transient network failure. Running `node dist/context-server.js` exits with `FATAL: Cannot start MCP server with invalid API key` after `Network error during validation: fetch failed`.
- **Evidence**: `if (!validation.valid) { ... process.exit(1); }` — no distinction between "bad key" and "unreachable provider".
- **Impact**: Server won't start if network is temporarily unavailable at boot.

### P0-2: validate.sh Fails on Current Spec Tree (Exit 2)
- **Agent**: 7 (Validators & Templates)
- **File**: Across all 022-hybrid-rag-fusion spec folders
- **Issue**: `validate.sh` exits 2 with **43 errors and 40 warnings** across the root packet plus 19 direct child phases. Of 10 sampled folders: 5 failed, 4 passed with warnings, 1 passed cleanly.
- **Dominant failures**: `TEMPLATE_HEADERS`, `SPEC_DOC_INTEGRITY`, `ANCHORS_VALID`, `FILE_EXISTS`, `PHASE_LINKS`.
- **Impact**: Release gate (validation) is red.

### P0-3: 5 Failing workflow-e2e Tests (Description Tracking)
- **Agent**: 6 (Session Capturing)
- **File**: `scripts/core/workflow.ts#L1506`, `scripts/tests/workflow-e2e.vitest.ts`
- **Issue**: `memorySequence` and `memoryNameHistory` are not updating reliably. The workflow updates description tracking only after a dynamic import of `@spec-kit/mcp-server/api`, then swallows failures as warnings. 5/39 workflow-e2e tests fail on `memorySequence` expectations.
- **Root cause**: Broken module resolution (see P0-4).

### P0-4: @spec-kit/mcp-server/api Module Resolution Broken
- **Agent**: 2 (Scripts & generate-context)
- **File**: `mcp_server/package.json#L6`
- **Issue**: The `exports` field maps `./*` to `./dist/*.js`, but `api` resolves to `dist/api.js` (doesn't exist) instead of `dist/api/index.js`. Scripts importing `@spec-kit/mcp-server/api` fail with `Cannot find module`. This silently breaks `generate-description`, `rebuild-auto-entities`, and all `description.json` regeneration.
- **Evidence**: `node .../scripts/dist/spec-folder/generate-description.js --help` → `Error: Cannot find module '.../dist/api.js'`
- **Impact**: description.json tracking degrades silently on every save; description.json metadata goes stale.

---

## P1 — MUST-FIX (Wrong behavior, data loss, or broken features)

### P1-1: Quality Loop Best-State Never Used
- **Agent**: 1 (MCP Server Health)
- **File**: `mcp_server/handlers/quality-loop.ts#L597`
- **Issue**: `bestContent`/`bestAttempt` are tracked but never returned. The function returns `currentContent` on both success and rejection paths, so worse auto-fix mutations can overwrite better earlier attempts.

### P1-2: Transient Errors Conflated with Bad API Key
- **Agent**: 1 (MCP Server Health)
- **File**: `shared/embeddings/factory.ts#L434`
- **Issue**: Timeout/network errors return `{ valid: false }` same as invalid key. Callers cannot distinguish "bad key" from "validation unreachable", leading to P0-1 startup abort.

### P1-3: preflight/postflight JSON Fields Silently Dropped
- **Agent**: 2 (Scripts)
- **File**: `scripts/utils/input-normalizer.ts#L705`
- **Issue**: `KNOWN_RAW_INPUT_FIELDS` allowlist omits `preflight`/`postflight`, so they're warned as unknown and dropped despite being documented in `generate-context` help text and shared types.

### P1-4: --session-id Flag Parsed But Never Forwarded
- **Agent**: 2 (Scripts)
- **File**: `scripts/memory/generate-context.ts#L381`
- **Issue**: `--session-id` is parsed from argv but never passed into `runWorkflow`, `loadCollectedData`, or `collectSessionData`. The flag is effectively dead code — deterministic transcript selection cannot work from CLI.

### P1-5: scripts-registry.json References Dead opencode-capture Artifact
- **Agent**: 2 (Scripts)
- **File**: `scripts/scripts-registry.json#L425`
- **Issue**: Registry still advertises `opencode-capture` pointing to `scripts/dist/extractors/opencode-capture.js`, but the file no longer exists. Registry loaders get a dead path.

### P1-6: 3 Incomplete Session Capturing Sub-Phases
- **Agent**: 6 (Session Capturing)
- **Files**: `009-perfect-session-capturing/000/005`, `009/.../016`, `009/.../019`
- **Details**:
  - `000-dynamic-capture-deprecation/005-live-proof-and-parity-hardening`: Still in-progress, T002-T004 open, no retained live artifacts.
  - `016-json-mode-hybrid-enrichment`: Root phase container missing `plan.md`, `tasks.md`, `implementation-summary.md`. Fails strict recursive validation.
  - `019-architecture-remediation`: Analysis complete but remediation sprints T020-T027 planned but not implemented.

### P1-7: JSON-Mode Path-Fragment Trigger Phrases + Content Quality
- **Agent**: 6 (Session Capturing) + 013 deep research (3 agents)
- **Files**: `scripts/core/workflow.ts:1056-1128`, `scripts/core/topic-extractor.ts:29-36`, `scripts/core/frontmatter-editor.ts:96-136`, `scripts/utils/input-normalizer.ts:571-689`
- **Issue (trigger contamination)**: `specFolderName` gets fed into trigger extraction, AND the workflow re-injects the full folder phrase AFTER `filterTriggerPhrases()` runs at `:1101-1106`. Individual folder tokens not in `FOLDER_STOPWORDS` are appended at `:1107-1125`. `ensureMinTriggerPhrases()` can reintroduce blocked tokens. `extractKeyTopics()` also contaminated via separate path. `deriveMemoryTriggerPhrases()` is NOT the active JSON-mode writer path (latent only).
- **Issue (content thinness)**: Semantic summarizer consumes only `userPrompts` — JSON mode produces 1 synthetic entry from `sessionSummary`. `exchanges` (user/assistant dialogue) and `toolCalls` (implementation evidence) are retained raw but never promoted to messages. Summarizer falls back to "Development session" generic text.
- **Fix architecture (combined — migrated ADR notes)**: (1) Remove post-filter folder reinsertion, (2) Create shared semantic sanitizer, (3) Promote detection to pre-write prevention, (4) Enrich JSON normalization (promote exchanges/toolCalls), (5) Fix ensureMin fallback contamination.
- **Full investigation**: [Deleted — 013-memory-generation-quality was removed from the tree]. Contamination map, gap analysis table, and regression test plan must be sourced from surviving parent research artifacts.

### P1-8: Missing decision-record.md for Level 3 Spec (007)
- **Agent**: 7 (Validators)
- **File**: `007-code-audit-per-feature-catalog/`
- **Issue**: Declared Level 3 spec is missing required `decision-record.md`. Validator `FILE_EXISTS` and `LEVEL_MATCH` both fail. Also 64 `PHASE_LINKS` issues.

### P1-9: Multiple Broken Markdown References in Spec Docs
- **Agent**: 7 (Validators)
- **Files**: `011-research-based-refinement/spec.md#L69`, `010-template-compliance-enforcement/research.md`, `011-skill-alignment/checklist.md`, `016-rewrite-memory-mcp-readme/implementation-summary.md`
- **Issue**: Dead markdown references to non-existent paths: `019-deep-research-rag-improvement/research/research.md`, `addendum/phase/phase-parent-section.md`, `speckit.md`, `references/template-compliance-contract.md`. Validator reported 32+ integrity errors across these packs.

### P1-10: Stale Tool Count in tools/README.md
- **Agent**: 10 (Architecture)
- **File**: `mcp_server/tools/README.md`
- **Issue**: Documents "28 tools across 5 dispatch modules" but runtime registers 33 tools. Stale documentation.

### P1-11: Script-Side Indexing Bypasses MCP Pipeline
- **Agent**: 5 (Pipeline Architecture)
- **Files**: `scripts/core/memory-indexer.ts#L151`, `scripts/core/workflow.ts#L1667`
- **Issue**: Scripts call `vectorIndex.indexMemory(...)` directly instead of routing through `memory_save` / `memory_index_scan`. Script-driven ingestion bypasses governance validation, preflight checks, audit hooks, and post-insert enrichment.
- **Impact**: Memory files saved via `generate-context.js` skip quality gates that MCP tool calls enforce.

### P1-12: Retention Sweep Not Wired Into Runtime
- **Agent**: 5 (Pipeline Architecture)
- **File**: `lib/governance/retention.ts#L41`
- **Issue**: `runRetentionSweep()` is implemented and retention metadata is stored during saves, but the sweep mechanism has no runtime caller — not in startup, handlers, or scheduled jobs. Memory expiry is documented but never enforced.

### P1-13: Root 022 Packet Contradicts Itself on Counts
- **Agent**: 10 (Architecture)
- **File**: `022-hybrid-rag-fusion/spec.md#L20`
- **Issue**: Says "20 direct phases" and "119 directories" in executive summary, but requires "19 direct phases" and "118 directories" later. Also lists `020-hydra-review-and-fix` as a direct phase, but no such folder exists.

### P1-14: Server README Architecture Map Stale
- **Agent**: 10 (Architecture)
- **File**: `mcp_server/README.md#L186`
- **Issue**: Structure map omits live top-level surfaces (`api/`, `core/`, `formatters/`, `schemas/`) and still documents non-existent/renamed ones. Also documents search pipeline as directory-based (`stage1-candidates/`, etc.) but live code uses flat files (`stage1-candidate-gen.ts`).

### P1-16: Stage 1 Vector Fallback Regression (Commit 54ee622)
- **Agent**: 8 (Regression Check)
- **File**: `mcp_server/lib/search/hybrid-search.ts#L1344`
- **Issue**: The raw-candidate refactor weakened the Stage 1 fallback path. When `skipFusion` is set and hybrid search errors, `collectRawCandidates()` returns `[]` and only tries lexical fallbacks — the explicit vector fallback branch in `stage1-candidate-gen.ts#L622` is never reached. Before this commit, hybrid failure could degrade to vector; now it silently degrades to lexical-only or empty results.
- **Impact**: Search quality regression for queries that would have benefited from vector fallback.

### P1-15: DB Path Examples in README Stale
- **Agent**: 10 (Architecture)
- **File**: `mcp_server/README.md#L912`
- **Issue**: Documents `DB_PATH = shared/mcp_server/database/spec-kit.db` but live constants come from `core/index.ts` under `mcp_server/database/`.

---

## P2 — SHOULD-FIX (Code quality, hygiene, compliance)

### P2-1: Dead Code in MCP Server
- **Agent**: 1 (MCP Server Health)
- **Files**: `lib/cognitive/archival-manager.ts#L455` (`rebuildVectorOnUnarchive`), `lib/providers/retry-manager.ts#L46` (empty interface), `lib/storage/causal-edges.ts#L7` (unused import), `lib/storage/checkpoints.ts#L405` (unused helper)
- **Issue**: Dead/unused functions/interfaces that fail lint gate.

### P2-2: Lint Failures Block npm run check
- **Agent**: 1 (MCP Server Health)
- **File**: `lib/eval/k-value-analysis.ts#L692`, plus above dead code
- **Issue**: `prefer-const`, unused imports/interfaces block `npm run check`. Release gate is red.

### P2-3: TODO Marker in Production Code
- **Agent**: 1 (MCP Server Health)
- **File**: `lib/search/vector-index-mutations.ts#L104`
- **Issue**: `// TODO(vector-index): Keep these mutation-local extensions...` remains in production.

### P2-4: 6 Orphaned dist Files Without Source
- **Agent**: 2 (Scripts)
- **Files**: `dist/lib/eval/channel-attribution.js`, `dist/lib/eval/eval-ceiling.js`, `dist/lib/manage/pagerank.js`, `dist/lib/parsing/entity-scope.js`, `dist/lib/search/context-budget.js`, `dist/lib/storage/index-refresh.js`
- **Issue**: Built artifacts with no matching TypeScript source. Release hygiene debt.

### P2-5: Stale Catalog Entries Reference Deleted Code
- **Agent**: 3 (Feature Catalog vs Code Audit)
- **Files**: `feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md#L36`, `feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md#L216`
- **Issue**: Snippets reference `ceiling-quality.vitest.ts` and `test-integration.js` which no longer exist.

### P2-6: 3 Audit Categories Without Catalog Coverage
- **Agent**: 3 (Feature Catalog vs Code Audit)
- **Issue**: Code audit categories `020-feature-flag-reference`, `021-remediation-revalidation`, `022-implement-and-remove-deprecated-features` lack corresponding feature catalog snippets.

### P2-7: Catalog/Audit Category Numbering Brittle
- **Agent**: 3 (Feature Catalog vs Code Audit)
- **Issue**: Catalog uses `01--retrieval` naming, audit uses `001-retrieval`. After audit category `018`, number-based matching breaks. Slug-based matching works but isn't automated.

### P2-8: Python Scripts Use sys.argv Instead of argparse
- **Agent**: 9 (Code Compliance)
- **Files**: `validate_config.py`, `init_skill.py`, `package_skill.py`, `quick_validate.py`, `extract_structure.py`
- **Issue**: 5 CLI scripts manually parse `sys.argv` instead of using `argparse` per sk-code--opencode standards.

### P2-9: Shell Scripts with Deferred Strict Mode
- **Agent**: 9 (Code Compliance)
- **Files**: `recommend-level.sh`, `compose.sh`, `common.sh`
- **Issue**: `set -euo pipefail` is missing or deferred past line 50, contrary to shell script standards.

### P2-10: Underpopulated description.json Metadata
- **Agent**: 7 (Validators)
- **Files**: `015-manual-testing-per-playbook/description.json`, `016-rewrite-memory-mcp-readme/description.json`
- **Issue**: Description/keywords are slug-like and generic for large umbrella specs.

### P2-11: Playbook Coverage Only 75% — 54 Untested Features
- **Agent**: 4 (Playbook vs Catalog)
- **Issue**: Of 219 catalog features, only 165 have corresponding playbook scenarios (75.3%). 54 features lack test coverage. Worst gaps: `18--ux-hooks` (14 untested), `10--graph-signal-activation` (7), `11--scoring-and-calibration` (7), `13--memory-quality-and-indexing` (7).
- **Additional**: 31 orphan playbook scenarios with no catalog backlink. Root playbook count contract off-by-one (claims 231, actual 230 category files).

### P2-12-orig: Template/Frontmatter Violations Across Spec Tree
- **Agent**: 7 (Validators)
- **Files**: Multiple (see P1-9 for specifics)
- **Issue**: `TEMPLATE_HEADERS`, `TEMPLATE_SOURCE`, `ANCHORS_VALID` failures in `011-research-based-refinement`, `016-rewrite-memory-mcp-readme`, `007-code-audit-per-feature-catalog`.

### P2-12: Dormant Code Modules in MCP Server
- **Agent**: 5 (Pipeline Architecture)
- **Files**: `lib/search/rsf-fusion.ts`, `lib/governance/retention.ts`
- **Issue**: `rsf-fusion.ts` is preserved for offline evaluation but not part of live pipeline. `runRetentionSweep()` defined but uncalled. Unused exports: `parseValidatedArgs`, `getWatcherMetrics`, `resetWatcherMetrics`.

### P2-13: Legacy CommonJS Compatibility Block
- **Agent**: 5 (Pipeline Architecture)
- **File**: `lib/parsing/memory-parser.ts#L920`
- **Issue**: Only live source file with `module.exports` compatibility block. Not broken, but inconsistent with TypeScript module style.

### P2-14: Sprint Metadata Stale (Sprints 5, 6, 11)
- **Agent**: 10 (Architecture)
- **Issues**:
  - Sprint 5: Acceptance criteria reference dead `SPECKIT_PIPELINE_V2` flag (no longer in code)
  - Sprint 6: Still `Draft` status but features already implemented (community detection, entity linking)
  - Sprint 11: Still `Draft` but D2/D4/D5 modules exist (query-decomposer, feedback-ledger)

### P2-16: Incomplete Test Refactor (Stage 1 Mocks)
- **Agent**: 8 (Regression Check)
- **File**: `tests/stage1-expansion.vitest.ts#L52`, `tests/spec-folder-prefilter.vitest.ts#L44`
- **Issue**: Tests mock both `searchWithFallback` and `collectRawCandidates` with same function, assertions still reference old `searchWithFallback` name. Suite passes but no longer proves Stage 1 uses the new raw-collector path.

### P2-17: Stale Playbook Reference to Deleted Test File
- **Agent**: 8 (Regression Check)
- **File**: `manual_testing_playbook/manual_testing_playbook.md#L3330`
- **Issue**: Commit `dace1f87` removed `index-refresh.vitest.ts` but playbook still cites it as active coverage.

### P2-15: Architecture Components Gap (41 documented vs 51 in code)
- **Agent**: 10 (Architecture)
- **Issue**: 10 undocumented code components, 6 phantom documented components, 5 stale references. Main undocumented: `api/` boundary, `core/` surface, `formatters/` layer, shared-spaces package, `stage2b-enrichment.ts`.

---

## Agent Status

| # | Agent Focus | Status | P0 | P1 | P2 |
|---|-------------|--------|----|----|-----|
| 1 | MCP Server Health | Done | 1 | 2 | 6 |
| 2 | Scripts & generate-context | Done | 0 | 5 | 1 |
| 3 | Feature Catalog vs Code Audit | Done | 0 | 0 | 4 |
| 4 | Playbook vs Catalog Alignment | Done | 0 | 0 | 2 |
| 5 | Pipeline Architecture | Done | 0 | 2 | 3 |
| 6 | Session Capturing (009) | Done | 1 | 2 | 0 |
| 7 | Validators & Templates | Done | 1 | 3 | 2 |
| 8 | Recent Commits Regression | Done | 0 | 1 | 2 |
| 9 | sk-code--opencode Compliance | Done | 0 | 0 | 3 |
| 10 | Architecture vs Implementation | Done | 0 | 4 | 3 |

**Totals (10 of 10 agents)**: P0: 4, P1: 19, P2: 26

---

## Cross-Agent Correlations

1. **Module resolution cascade**: P0-4 (broken `@spec-kit/mcp-server/api` exports) is the root cause of P0-3 (5 failing workflow-e2e tests) and contributes to stale description.json metadata across the spec tree.

2. **Validation cascade**: P0-2 (validate.sh exit 2) aggregates findings from P1-8 (missing decision-record.md), P1-9 (broken markdown refs), and P2-11 (template violations). Fixing individual spec folders will reduce the 43-error count.

3. **Error handling pattern**: P0-1 (startup abort) and P1-2 (error conflation) share the same root in `factory.ts` — the validation result type lacks a `networkError` state.

4. **Session capturing completeness**: P1-6 (3 incomplete sub-phases) are documented honestly in their specs but represent real feature gaps. The `019-architecture-remediation` remediation sprints are the largest open workstream.

---

## Recommended Remediation Priority

### Immediate (before any release)
1. Fix `mcp_server/package.json` exports to resolve `api/index.ts` correctly → unblocks P0-3, P0-4
2. Add network-error handling to API key validation → fixes P0-1, P1-2
3. Fix lint failures → unblocks P2-2 (npm run check)
4. Add missing `decision-record.md` to 007 → fixes P1-8

### Short-term (release hardening)
5. Fix quality loop to actually use bestContent → P1-1
6. Add preflight/postflight to KNOWN_RAW_INPUT_FIELDS → P1-3
7. Forward --session-id into runWorkflow → P1-4
8. Remove dead opencode-capture + skill_advisor registry entries → P1-5
9. Fix broken markdown references in 5+ spec docs → P1-9
10. Complete 016-json-mode-hybrid-enrichment container files → P1-6

### Short-term continued — JSON mode quality (from 013 deep research + ultra-think review)

**PR1 — Stop contamination (~40 LOC, 3 files)**:
11. **Fix trigger/topic path contamination** → P1-7:
    - Delete post-filter folder reinsertion in workflow.ts:1101-1106
    - Expand `FOLDER_STOPWORDS` (add `generation`, `epic`, `audit`, `alignment`, `enforcement`, `remediation`)
    - Apply `FOLDER_STOPWORDS` inside `ensureMinTriggerPhrases()` (frontmatter-editor.ts:96-115) — **CRITICAL: omitted from original 5-step plan, caught by ultra-think review**
    - Apply `FOLDER_STOPWORDS` inside `ensureMinSemanticTopics()` (frontmatter-editor.ts:118-136)
    - Reduce/gate `specFolderName` weight in `extractKeyTopics()` (topic-extractor.ts:31-36)
    - Risk mitigation: let folder phrases survive naturally through extraction; remove only FORCED reinsertion

**PR2 — Enrich JSON normalization (~25 LOC, 1 file)**:
12. **Enrich JSON mode normalization** → P1-7 (content quality):
    - Promote `exchanges` to multi-message `userPrompts` (max 10, dedup vs sessionSummary)
    - Promote `toolCalls` to implementation messages (summarized, not verbatim)
    - Fast-path guard: skip if `userPrompts` already has 3+ entries
    - Fix slow-path `sessionSummary` observation truncation (200 char limit)

**Both PRs**:
13. **Extend regression tests** (~80 LOC, 4 test files) — see 013/research.md §4 + §7

**Deferred** (per ultra-think: premature architecture): shared semantic sanitizer module, pre-write prevention promotion

### Short-term continued — infrastructure
14. Unify script indexing to route through MCP pipeline → P1-11
15. Wire retention sweep into runtime or remove dead code → P1-12
16. Fix root 022 packet contradictory counts → P1-13
17. Update server README architecture map → P1-14, P1-15

### Deferred (post-release cleanup)
15. Remove dead code from MCP server → P2-1
16. Clean orphaned dist files → P2-4
17. Update stale catalog entries → P2-5
18. Migrate Python CLI scripts to argparse → P2-8
19. Update sprint metadata (5, 6, 11) → P2-14
20. Document 10 undocumented architecture components → P2-15

---

---

## Phase 2 — Deep Verification (3 targeted agents)

> Date: 2026-03-24 | Agents: 3x GPT-5.4 (codex exec, high reasoning, workspace-write)
> Purpose: Verify P0/P1 fix specifications at the code level with exact file:line traces.

### Iteration 1: Build System & Module Resolution (Q1) — newInfoRatio: 0.83

**Question**: Is the `./api → ./dist/api/index.js` fix sufficient, or are there other broken export paths?

**Key Findings**:
1. **The wildcard export `./* → ./dist/*.js` is structurally wrong for ALL directory barrels**, not just `api`. The tsconfig uses `rootDir: "."` and `outDir: "./dist"`, preserving directory structure. Any `<dir>/index.ts` compiles to `dist/<dir>/index.js`, not `dist/<dir>.js`. [SOURCE: mcp_server/package.json:6-9, mcp_server/tsconfig.json:5-6]

2. **Only `./api` is actively broken in practice.** The public API README explicitly recommends `@spec-kit/mcp-server/api` and import-policy tests prohibit `core`, `handlers`, etc. Real consumers: `rebuild-auto-entities.ts`, `generate-description.ts`, `run-performance-benchmarks.ts`. [SOURCE: mcp_server/api/README.md:46-49, scripts/tests/import-policy-rules.vitest.ts:8-33]

3. **Leaf imports work correctly.** `api/indexing`, `api/search`, `api/providers` resolve via the wildcard to `dist/api/indexing.js` etc., which exist. [SOURCE: scripts/core/memory-indexer.ts:15-18, mcp_server/dist/api/indexing.js:1-18]

4. **7 additional latent barrel mismatches**: `core`, `formatters`, `handlers`, `hooks`, `tools`, `utils`, `handlers/save` — all have `index.ts` barrels that would break under the wildcard, but are prohibited by import policy.

**Fix Recommendation**: Add explicit `"./api": "./dist/api/index.js"` entry BEFORE the wildcard in package.json exports. No other barrels need fixing since they're internal-only.

---

### Iteration 2: Runtime Error Handling & Code Paths (Q2) — newInfoRatio: 0.42

**Question**: What is the exact crash path for P0-1? Are there other `process.exit()` calls?

**Key Findings**:
1. **Exact P0-1 crash path**: `validateApiKey()` in `factory.ts` catches timeout/network errors and returns `{ valid: false, errorCode: 'E053' }` (resolved, not thrown). `context-server.ts` main() awaits this, sees `!validation.valid`, logs FATAL, calls `process.exit(1)`. The catch block that would continue startup only runs for thrown exceptions — it's never reached for timeout/network. [SOURCE: shared/embeddings/factory.ts:307,428-459; mcp_server/context-server.ts:738-775,757-786]

2. **`process.exit()` confined to `context-server.ts` only (3 sites)**: `fatalShutdown()` (SIGTERM/SIGINT/uncaught), validation failure branch, and `main().catch()`. No handler, lib, or shared runtime code calls `process.exit()`. [SOURCE: mcp_server/context-server.ts:663,774,1088]

3. **P1-1 confirmed**: `bestContent`/`bestAttempt` initialized and updated at `quality-loop.ts:597-619` but never read before return at `:621-660`. Function returns `currentContent` on both success and rejection. [SOURCE: mcp_server/handlers/quality-loop.ts:597-660]

4. **P1-16 confirmed**: `hybridSearchEnhanced()` catch returns `[]` when `skipFusion` is true at `:1344-1353`. `collectRawCandidates()` always passes `skipFusion: true`, so on failure, Stage 1 loses all vector/raw candidates — falls through to lexical-only FTS/BM25. No vector retry. [SOURCE: mcp_server/lib/search/hybrid-search.ts:817-842,931-942,1344-1353,1361-1431]

5. **Non-fatal handler patterns exist**: Watcher errors swallowed intentionally, eval logging failures warn-only, individual search channel failures non-critical inside pipeline.

---

### Iteration 3: Pipeline Governance & Script-MCP Parity (Q3) — newInfoRatio: 0.38

**Question**: Does the script-side indexing path bypass MCP governance?

**Key Findings — Hook-by-Hook Parity Table**:

| Hook / Check | MCP `memory_save` | Script path |
|---|---|---|
| Governance runtime + ingest validation | Yes | **No** |
| Shared-space access control + denial audit | Yes | **No** |
| Preflight + dry-run | Yes | **No** |
| Quality loop / sufficiency / template gate | Yes | Partial (workflow-local) |
| Spec-folder mutex + dedup transaction | Yes | **No** |
| Embedding cache + save quality gate | Yes | **No** |
| PE gating + reconsolidation | Yes | **No** |
| Post-insert metadata / lineage / history | Yes | **No** |
| Post-insert enrichment (causal/entity/graph) | Yes | **No** |
| Mutation ledger + hooks + consolidation | Yes | **No** |
| Governance metadata + allow-audit | Yes | **No** |

**Script path**: `generate-context.ts:530 → runWorkflow():1601 → indexMemory():1655 → vectorIndex.indexMemory()` — writes directly to SQLite (memory_index, vec_memories, active_memory_projection). [SOURCE: scripts/core/workflow.ts:1655-1675, scripts/core/memory-indexer.ts:72-171, mcp_server/lib/search/vector-index-mutations.ts:168-447]

**MCP path**: 9 enforcement stages before/after the same vector write. [SOURCE: mcp_server/handlers/memory-save.ts:542-868, handlers/save/create-record.ts:102-229, handlers/save/post-insert.ts:59-190, handlers/save/response-builder.ts:93-377]

**Shared parity exists only at the raw vector storage layer** — both paths hit the same `vector-index-mutations.ts` mutators, but script path skips all governance above that.

6. **Retention sweep confirmed test-only**: `runRetentionSweep()` exported from `lib/governance/retention.ts:41` but only referenced in `tests/memory-governance.vitest.ts` (lines 260, 329, 388, 432, 441, 491). No runtime caller.

7. **Additional dead registry entry**: `skill_advisor` at `scripts/scripts-registry.json:235` also missing from resolved path (beyond known `opencode-capture` at `:425`).

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration |
|---|---|---|---|
| api-only anomaly hypothesis | Wildcard mismatch is package-wide for all directory barrels | package.json:6-9, tsconfig.json:5-6 | 1 |
| src/-based barrel search | Package compiles from project root, not src/ | tsconfig.json:5-6 | 1 |
| shared/embeddings path assumption | Factory lives at `shared/embeddings/factory.ts`, not under `mcp_server/shared/` | factory.ts:307 | 2 |

---

## Phase 2 Summary

All 3 verification questions answered with file:line evidence:

| Q | Answer | Iteration | newInfoRatio |
|---|--------|-----------|-------------|
| Q1 (Module resolution) | Fix is sufficient for `api`; 7 other barrels latent-broken but internal | 1 | 0.83 |
| Q2 (Runtime crashes) | Crash confined to context-server.ts; factory.ts resolves instead of throwing | 2 | 0.42 |
| Q3 (Pipeline parity) | Script path bypasses 10/11 MCP governance hooks | 3 | 0.38 |

**New findings beyond Phase 1**: 7 latent barrel mismatches, exact crash control flow, process.exit() confinement proof, 11-row hook parity matrix, additional dead registry entry (`skill_advisor`), retention sweep test-only confirmation.

---

## Audit Complete

Phase 1: 10 agents, 49 findings (4 P0, 19 P1, 26 P2). Phase 2: 3 agents, deep verification of critical fixes. The auto-stash merge (HEAD commit `272703507`) is clean — no conflict markers found. 252 vitest tests pass. TypeScript compiles cleanly. The release blockers are in the P0 section above.
