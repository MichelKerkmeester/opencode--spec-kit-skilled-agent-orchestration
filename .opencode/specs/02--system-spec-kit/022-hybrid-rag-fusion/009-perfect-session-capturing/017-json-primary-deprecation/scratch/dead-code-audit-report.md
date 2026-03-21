# Dead Code & Legacy Deprecation Audit Report

**Date**: 2026-03-20
**Scope**: system-spec-kit scripts + MCP server, informed by Phase 016 + 017
**Agents**: 10 Opus + 5 Copilot GPT-5.4 (15 parallel auditors)
**Files audited**: 97 TypeScript source files across 10 directories

---

## Executive Summary

The Phase 017 `--recovery` gate is **rock-solid** with triple enforcement (generate-context.ts, data-loader.ts, workflow.ts) and no bypass path. `enrichFileSourceData` (the unshipped hybrid enrichment) is **fully removed** -- zero references remain.

However, the deprecation is **incomplete at the annotation level**: recovery-only modules lack `@deprecated` markings, ~60+ dead barrel exports bloat the public API, 3 files can be deleted entirely, and operator docs still use pre-017 syntax.

| Severity | Count | Key Theme |
|----------|-------|-----------|
| **HIGH** | 9 | Dead files, unmarked recovery-only modules, stale one-time scripts |
| **MEDIUM** | ~40 | Dead exports, deprecated-not-marked, legacy paths, docs drift |
| **LOW** | ~65 | Unnecessary public exports, stale comments, minor type issues |

---

## HIGH Severity Findings (9)

### H1. `session-activity-signal.ts` -- Entirely recovery-only but unmarked
- **File**: `extractors/session-activity-signal.ts` (314 lines)
- **Category**: DEPRECATED_NOT_MARKED
- **Evidence**: The entire module exists to auto-detect spec-folder affinity from session data -- a problem JSON-primary eliminates (the AI provides `specFolder` directly). Contains the heuristic `textMentionsCandidate` matching that was historically the source of wrong-session contamination bugs. Zero deprecation annotations.
- **Action**: Add module-level `@deprecated` header: "RECOVERY-ONLY. In JSON-primary mode, the AI provides specFolder directly."

### H2. `countToolsByType` -- Reconstructs data JSON-mode already provides
- **File**: `extractors/session-extractor.ts:358-383`
- **Category**: DEPRECATED_NOT_MARKED
- **Evidence**: Parses tool usage counts from observation text via regex. In JSON-primary mode, the AI composes structured `toolCalls` arrays directly. This is a lossy round-trip: structured data -> observation text -> regex extraction. Actively called but operates on data that was already synthesized from the structured input.
- **Action**: Mark `@deprecated`. Tool counts should derive from `toolCalls` array directly.

### H3. Dual quality scorer -- Confusing naming + legacy gates abort
- **Files**: `core/quality-scorer.ts` + `extractors/quality-scorer.ts`
- **Category**: DUPLICATE / LEGACY_PATH
- **Evidence**: Both export `scoreMemoryQuality` (V1 and V2). V2 feeds frontmatter metadata. V1 gates abort threshold and console logging. Called in sequence in workflow.ts:2080-2167. The `scoreMemoryQualityV2` alias is confusing; V1's `score` and `qualityScore` properties duplicate `score100` and `score01` without deprecation markers.
- **Action**: Rename V2 to `scoreValidationRuleQuality`. Mark V1's `score`/`qualityScore` as `@deprecated`. Plan migration of abort gating to V2.

### H4. `lib/structure-aware-chunker.ts` -- Dead duplicate
- **File**: `lib/structure-aware-chunker.ts` (222 lines)
- **Category**: DEAD_CODE
- **Evidence**: Zero imports. The canonical source is `@spec-kit/shared/lib/structure-aware-chunker`. Identical code.
- **Action**: **Delete file.**

### H5. `RELEVANCE_CONTENT_STOPWORDS` -- Dead 80+ word set
- **File**: `utils/input-normalizer.ts:715-732`
- **Category**: DEAD_CODE
- **Evidence**: Large `Set` with 80+ stopwords, never referenced anywhere. Only `RELEVANCE_PATH_STOPWORDS` is used.
- **Action**: **Delete constant.**

### H6. `extractKeyArtifacts` -- Dead function
- **File**: `utils/message-utils.ts:191`
- **Category**: DEAD_CODE
- **Evidence**: Exported, re-exported from barrel, zero production importers. Parses deprecated raw-message shape. Only consumer is legacy test compatibility suite.
- **Action**: Mark `@deprecated`, remove barrel re-export.

### H7. `run-quality-legacy-remediation.ts` -- Would fail at runtime
- **File**: `evals/run-quality-legacy-remediation.ts`
- **Category**: ONE_TIME_SCRIPT
- **Evidence**: References `136-mcp-working-memory-hybrid-rag` which is archived to `z_archive/`. Would fail with path-not-found.
- **Action**: **Delete script.**

### H8. `deleted-chk210-quality-backfill-script` -- Stale one-time script
- **File**: `evals/deleted-chk210-quality-backfill-script`
- **Category**: ONE_TIME_SCRIPT
- **Evidence**: Uses `.ts` extension in `require()` (only works under tsx), mixes CommonJS with TypeScript types. Has import-policy allowlist entry expiring 2026-06-04.
- **Action**: Mark deprecated or delete. Remove allowlist entry.

### H9. ~200 LOC telemetry drift validation misplaced
- **File**: `spec-folder/alignment-validator.ts:88-308`
- **Category**: STALE_REFERENCE
- **Evidence**: Validates drift between `mcp_server/lib/telemetry/retrieval-telemetry.ts` and its README. Unrelated to spec-folder alignment. Runs on every alignment check as side effect. ~200 lines of misplaced concern.
- **Action**: Extract to `telemetry-schema-validator.ts` or remove if no longer needed.

---

## MEDIUM Severity Findings (~40, grouped by theme)

### Theme A: Recovery-Only Modules Not Marked (7 modules)

| Module | Lines | Evidence |
|--------|-------|----------|
| `extractors/claude-code-capture.ts` | 730 | Header says "stateless enrichment", no recovery-only annotation |
| `extractors/codex-cli-capture.ts` | 470 | Same pattern |
| `extractors/copilot-cli-capture.ts` | 413 | Same pattern |
| `extractors/gemini-cli-capture.ts` | 393 | Same pattern |
| `extractors/opencode-capture.ts` | 860 | No mention of recovery-only |
| `extractors/git-context-extractor.ts` | Full | "stateless enrichment" in header, recovery-only but unmarked |
| `extractors/spec-folder-extractor.ts` | Full | "stateless enrichment" in header, recovery-only but unmarked |

**Action**: Add `@deprecated` / `// RECOVERY-ONLY` banners to all 7 modules.

### Theme B: Dead Barrel Re-exports (~35 entries)

The `utils/index.ts` barrel has **17+ dead re-exports** that no consumer imports through the barrel. The `extractors/index.ts` barrel re-exports all 5 capture modules unnecessarily (data-loader uses direct dynamic imports). The `core/index.ts` barrel has 5+ dead re-exports.

**Key dead barrel entries in utils/index.ts**:
- Lines 18, 26-31: workspace-identity and spec-affinity helpers (7 entries)
- Lines 107-116: message-utils types (8 entries)
- Lines 133-139: memory-frontmatter helpers (7 entries)

**Action**: Remove all dead barrel re-exports. Consumers already import directly from source modules.

### Theme C: Dead Exports Within Modules (~25 exports)

| Module | Dead Exports |
|--------|-------------|
| CLI captures (5 files) | Path constants (`CLAUDE_HISTORY`, `CODEX_HOME`, etc.) |
| `opencode-capture.ts` | 11 helper functions beyond `captureConversation` |
| `decision-extractor.ts` | `extractDecisions_alias` |
| `diagram-extractor.ts` | `extractDiagrams_alias`, `extractPhasesFromData_alias` |
| `implementation-guide-extractor.ts` | 3 snake_case aliases |
| `content-filter.ts` | 6 standalone functions (consumers use pipeline) |
| `anchor-generator.ts` | 7 internal helpers |
| `simulation-factory.ts` | 4 internal helpers |
| `source-capabilities.ts` | `SOURCE_CAPABILITIES`, `isKnownDataSource` |
| `data-validator.ts` | `ARRAY_FLAG_MAPPINGS`, `PRESENCE_FLAG_MAPPINGS`, `ensureArrayOfObjects`, `hasArrayContent` |
| `validation-utils.ts` | `logAnchorValidation` |

**Action**: Remove `export` keyword or remove from export blocks.

### Theme D: Docs Still Using Pre-017 Syntax (4 locations)

| File | Line | Issue |
|------|------|-------|
| `CLAUDE.md` | 37 | `generate-context.js [spec-folder-path]` -- old bare positional |
| `CLAUDE.md` | 53 | Same stale quick-reference |
| `CLAUDE.md` | 137-138 | "Pass bare spec folder path" |
| `.opencode/command/memory/save.md` | 75 | `generate-context.js [spec-folder]` |

Note: `SKILL.md` is already properly aligned with JSON-primary + `--recovery`.

**Action**: Update to `generate-context.js --recovery [spec-folder-path]` syntax.

### Theme E: One-Time / Phase-Specific Eval Scripts

| Script | Status | Action |
|--------|--------|--------|
| `deleted-phase1-5-shadow-eval-script` | Phase gate passed | Mark deprecated |
| `deleted-phase3-telemetry-dashboard-script` | Pre-rollout simulation | Mark deprecated |
| `check-no-mcp-lib-imports.ts` | Superseded by AST variant | Deprecate, promote AST |
| `map-ground-truth-ids.ts` | Fragile regex TypeScript parser | Retain with warning |
| `historical-memory-remediation.ts` | Hardcoded to sprint 022/010 | Mark as one-time |

### Theme F: Other Medium Findings

| Finding | File | Issue |
|---------|------|-------|
| `ast-parser.ts` unused outside test | `memory/ast-parser.ts` | Dead code, superseded by shared chunker |
| `reindex-embeddings.ts` missing guard | `memory/reindex-embeddings.ts:127` | No `require.main` guard, runs on import |
| Untyped JSON-mode field access | `conversation-extractor.ts:78`, `collect-session-data.ts:349` | `sessionSummary`, `keyDecisions`, `nextSteps` accessed via unsafe `Record<string, unknown>` casts |
| `filesModified` type mismatch | `types/session-types.ts:129` | Declares object array, normalizer accepts strings too |
| 17 unshipped V2.2 template placeholders | `renderers/template-renderer.ts:32-51` | Session Integrity, Memory Classification, Session Dedup sections never populated |
| 6 snake_case aliases in spec-folder | `spec-folder/index.ts:46-53` | Zero consumers |
| Duplicate `extractSpecIds` | `input-normalizer.ts:779` vs `spec-affinity.ts:149` | Identical regex |
| `tool-detection.ts` pass-through | `utils/tool-detection.ts:100-102` | `classifyConversationPhase` wraps `classifyPhaseViaSignals` with zero logic |

---

## LOW Severity Findings (~65, summarized)

- **Stale comments**: "Priority 7" numbering in data-loader (only 2 priorities remain), "V13.0" empty step in workflow.ts
- **Unreachable code**: `if (!sessionDataFn)` guard in workflow.ts can never be true
- **Type leaks**: `QualityBreakdown` non-exported but accessible through `QualityScoreResult`
- **Stale build artifacts**: `core/tree-thinning.d.ts` and `evals/check-architecture-boundaries.d.ts` in source tree
- **`BOX` constant** exported from ascii-boxes.ts but never imported
- **`QualityScore` type alias** in core/quality-scorer.ts never imported
- **Simulation fallback paths** unreachable in JSON-primary mode but not guarded
- **Module-level caches** in opencode-capture.ts serve no purpose for single-invocation recovery mode
- **`Skill` inconsistent** across regex patterns in tool-detection.ts
- **`simulation` source capability** has `prefersStructuredSave: false` -- contradicts JSON-primary contract
- **`CollectedDataFull`** extends `CollectedDataBase` adding zero fields

---

## Positive Confirmations

| Check | Result |
|-------|--------|
| `--recovery` gate enforcement | Triple-layer, no bypass |
| `enrichFileSourceData` removal | Zero references remain |
| dist/ alignment | No orphaned compiled files |
| SKILL.md alignment | Already JSON-primary |
| contamination-filter.ts | Still needed for both paths |
| `rebuild-auto-entities.ts` | Still needed (checkpoint restore) |
| `frontmatter-migration.ts` | Not one-time, valid maintenance library |

---

## Recommended Action Plan

### Wave 1: Quick Wins (delete/remove dead code)
1. Delete `lib/structure-aware-chunker.ts`
2. Delete `evals/run-quality-legacy-remediation.ts`
3. Delete `RELEVANCE_CONTENT_STOPWORDS` from input-normalizer.ts
4. Delete 2 stale `.d.ts` files from source tree
5. Remove ~35 dead barrel re-exports from `utils/index.ts`, `extractors/index.ts`, `core/index.ts`
6. Remove all `_alias` and snake_case alias exports

### Wave 2: Deprecation Annotations
7. Add `@deprecated` / `// RECOVERY-ONLY` to all 7 capture/extractor modules
8. Add `@deprecated` to `session-activity-signal.ts` (module-level)
9. Mark `countToolsByType`, `extractKeyArtifacts`, `shouldAutoSave` as `@deprecated`
10. Mark one-time eval scripts as deprecated

### Wave 3: Docs Alignment
11. Update CLAUDE.md (3 locations) to use `--recovery` syntax
12. Update save.md (1 location)

### Wave 4: Structural Improvements
13. Extract telemetry drift validation from alignment-validator.ts
14. Rename V2 quality scorer to `scoreValidationRuleQuality`
15. Add `require.main` guard to reindex-embeddings.ts
16. Consolidate duplicate `extractSpecIds`
17. Add `sessionSummary`, `keyDecisions`, `nextSteps` to `CollectedDataBase` type

---

## Agent Attribution

| Agent | Scope | Findings | Key Discovery |
|-------|-------|----------|---------------|
| O1 | core/ | 12 | Dual quality scorer legacy path |
| O2 | Session extractors | 13 | session-activity-signal entirely recovery-only |
| O3 | CLI captures | 14 | All 5 capture modules unmarked recovery-only |
| O4 | Remaining extractors | 10 | Dual quality scorer naming collision |
| O5 | Loaders + memory | 12 | Recovery gate triple-enforced, ast-parser dead |
| O6 | Utils part 1 | 16 | RELEVANCE_CONTENT_STOPWORDS dead, bloated API |
| O7 | Utils part 2 | 23 | extractKeyArtifacts dead, 17 dead barrel entries |
| O8 | lib/ | 17 | structure-aware-chunker dead duplicate |
| O9 | Types/renderers/spec-folder | 12 | ~200 LOC misplaced telemetry validation |
| O10 | Evals | 10 | 2 scripts would fail at runtime |
| C4 | Docs | 5 | CLAUDE.md + save.md stale syntax |
| C5 | Dist alignment | 2 | 2 stale .d.ts artifacts |
| C1 | Cross-reference search | 15+ | Runtime aligned; docs/comments need recovery-only qualifier |
| C2 | MCP server | 3 | 33/33 tools clean, `minQualityScore` deprecated-still-live |
| C3 | Test files | 3 | JSON-primary coverage mostly adequate; preflight/postflight gap; stale test descriptions |

---

## Appendix A: MCP Server Audit (C2)

### MCP Server Status: CLEAN

- **Entry point**: `opencode.json` -> `mcp_server/dist/context-server.js`
- **Tool count**: 33 defined = 33 dispatched (zero dead registrations)
- **No stateless default**: `memory_save` only accepts explicit `filePath`; no dynamic-capture fallback exists in the MCP server layer

### MCP Findings

**M1. `memory_search.minQualityScore` -- Deprecated param still live**
- **Severity**: MEDIUM
- **Evidence**: Parameter is explicitly deprecated in schema description but still accepted in: `tool-schemas.ts:111-116`, `schemas/tool-input-schemas.ts:137-138,480`, `handlers/memory-search.ts:155-156,379-385,762-771`, and tests.
- **Action**: Track removal. Consider adding runtime deprecation warning when param is used.

**M2. Snake_case handler aliases -- Compatibility layer**
- **Severity**: LOW
- **Evidence**: Snake_case exports kept in handlers/README.md for backward compat but are NOT active MCP registrations. Tests verify they exist.
- **Action**: Monitor. Not blocking.

**M3. Reference docs stale -- Multiple files still advertise old syntax**
- **Severity**: MEDIUM
- **Evidence**: `README.md:483`, `references/validation/phase_checklists.md:125,158`, `references/templates/level_specifications.md:766`, `references/templates/template_guide.md:595`, `references/workflows/execution_methods.md:83-87` still show positional `generate-context.js [folder]` without `--recovery`.
- **Action**: Update to `--recovery` syntax. (`mcp_server/README.md` is already aligned.)

---

## Appendix B: Cross-Reference Search (C1)

### Runtime: ALIGNED
No live code path treats stateless mode as the primary path. The `--recovery` gate is properly enforced across generate-context.ts, data-loader.ts, and workflow.ts.

### Docs/Comments Needing Recovery-Only Qualifier (15 locations)

| File | Line | Issue |
|------|------|-------|
| `references/structure/folder_routing.md` | 609 | Footer says "Stateless CLI-First" — contradicts its own "Structured-first" wording |
| `references/templates/template_guide.md` | 917 | "stateless - no marker file" should be "explicit CLI target / structured-first" |
| `feature_catalog/.../18-stateless-enrichment-and-alignment-guards.md` | 2-29 | Never says "recovery-mode" |
| `feature_catalog/feature_catalog.md` | 2533-2554 | "stateless saves" should be qualified as recovery-mode |
| `feature_catalog/feature_catalog_in_simple_terms.md` | 578-580 | Same omission |
| `manual_testing_playbook/.../007-session-capturing-pipeline-quality.md` | 22 | Should say "recovery-mode stateless enrichment" |
| `manual_testing_playbook/.../139-session-capturing-pipeline-quality.md` | 20-21, 30 | Same omission |
| `extractors/spec-folder-extractor.ts` | 8 | Comment says "stateless enrichment" without recovery-only qualifier |
| `extractors/git-context-extractor.ts` | 8 | Same |
| `extractors/claude-code-capture.ts` | 8-9 | Same |
| `extractors/codex-cli-capture.ts` | 8-9 | Same |
| `extractors/copilot-cli-capture.ts` | 8-9 | Same |
| `extractors/gemini-cli-capture.ts` | 8-9 | Same |
| `utils/spec-affinity.ts` | 8-10 | "captured stateless content" without recovery-only context |

### Confirmed Clean
- Zero `enrichFileSourceData` references anywhere
- All dist/ JS mirrors match source TS findings
- No dist-only contradictions

---

## Appendix C: Test Files Audit (C3)

### JSON-Primary Coverage: Mostly Adequate
- `generate-context-cli-authority.vitest.ts`: covers `--json`, `--stdin`, `--recovery` gating
- `runtime-memory-inputs.vitest.ts`: covers explicit JSON file loading, snake_case payloads, recovery-only fallback
- `workflow-e2e.vitest.ts`: exercises real save pipeline with structured JSON

### Coverage Gap: `preflight`/`postflight` structured payloads
Modern Vitest suites do not directly cover `preflight`/`postflight` fields, even though the contract is documented in `generate-context.ts` and consumed in `collect-session-data.ts`. Only legacy `test-extractors-loaders.js` has traces.

### Stale Test Descriptions (still describe deprecated path as current)
- `task-enrichment.vitest.ts`: Multiple `it()` blocks say "stateless mode" without "recovery" qualifier
- `memory-render-fixture.vitest.ts`: "promotes stateless native tool evidence"
- `stateless-enrichment.vitest.ts`: Suite name "stateless enrichment guardrails" — appropriate as internal helper coverage but naming implies normal path
