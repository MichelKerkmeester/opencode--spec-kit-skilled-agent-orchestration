# Wave 3 - OPUS-B4: Generated Checklist Items
Date: 2026-03-21

## P0 Items (HARD BLOCKERS)

### Sprint 1: Critical Build & Import Failures

- [ ] CHK-P0-001 [Finding: OPUS-A2-001] Verify `ast-parser.ts` no longer imports deleted `structure-aware-chunker` -- `grep 'structure-aware-chunker' scripts/memory/ast-parser.ts` returns empty or import is replaced with valid module path
- [ ] CHK-P0-002 [Finding: OPUS-A4-001] Verify stale dist artifacts for deleted `run-quality-legacy-remediation.ts` are removed -- `ls scripts/dist/evals/run-quality-legacy-remediation.*` returns no files
- [ ] CHK-P0-003 [Finding: OPUS-A4-002] Verify stale dist map files for deleted `run-chk210-quality-backfill.ts` are removed -- `ls scripts/dist/evals/run-chk210-quality-backfill.*` returns no files
- [ ] CHK-P0-004 [Finding: OPUS-A4-003] Verify stale dist map files for deleted `run-phase1-5-shadow-eval.ts` are removed -- `ls scripts/dist/evals/run-phase1-5-shadow-eval.*` returns no files
- [ ] CHK-P0-005 [Finding: OPUS-A4-004] Verify stale dist map files for deleted `run-phase3-telemetry-dashboard.ts` are removed -- `ls scripts/dist/evals/run-phase3-telemetry-dashboard.*` returns no files
- [ ] CHK-P0-006 [Finding: OPUS-A4-005] Verify stale dist artifacts for relocated `structure-aware-chunker` are removed from `scripts/dist/lib/` -- `ls scripts/dist/lib/structure-aware-chunker.*` returns no files
- [ ] CHK-P0-007 [Finding: OPUS-A5-001] Verify `--stdin`/`--json` mode runs payloads through `validateInputData()` and `normalizeInputData()` before entering workflow -- inspect `generate-context.ts` structured-mode path for validation calls; snake_case fields like `user_prompts` must be normalized to camelCase before `runWorkflow()`
- [ ] CHK-P0-008 [Finding: OPUS-A5-002] Verify V-rule bridge fails closed on load failure -- when `loadModule()` throws, `memory_save` handler must return an error (not a warning) and refuse the write; test by temporarily renaming the dist artifact and calling `memory_save`
- [ ] CHK-P0-009 [Finding: OPUS-A5-003] Verify `atomicSaveMemory()` uses unique pending paths per request -- inspect `memory-save.ts` `getPendingPath()` for `randomUUID()` or `requestId` inclusion; confirm two concurrent saves to the same file path produce distinct `_pending` filenames
- [ ] CHK-P0-010 [Finding: OPUS-A5-004] Verify normal save path uses atomic temp-file + rename (not plain `writeFile`) for post-commit disk writes -- inspect `memory-save.ts` lines 565-572 and 723-727 for `renameSync` or `atomicWriteFile` pattern; confirm no raw `fs.promises.writeFile()` on the final path after DB commit

### Sprint 2: Circular Dependencies Breaking Build

- [ ] CHK-P0-011 [Findings: OPUS-A1-001, OPUS-A1-002, OPUS-A1-003] Verify three structural circular dependencies are broken -- `lib/semantic-summarizer.ts`, `renderers/template-renderer.ts`, and `spec-folder/folder-detector.ts` + `spec-folder/directory-setup.ts` all import CONFIG from `../config` (not `../core`); run `grep "from '../core'" scripts/lib/semantic-summarizer.ts scripts/renderers/template-renderer.ts scripts/spec-folder/folder-detector.ts scripts/spec-folder/directory-setup.ts` returns empty

### Sprint 3: Critical Data Loss & Logic Errors

- [ ] CHK-P0-012 [Finding: CODEX-A2-001] Verify `normalizeInputData()` preserves canonical `sessionSummary`, `keyDecisions`, and `nextSteps` fields from JSON-primary input -- unit test: pass a JSON payload with `sessionSummary` set; confirm `collectSessionData()` can read `collectedData.sessionSummary` downstream
- [ ] CHK-P0-013 [Finding: CODEX-A1-001] Verify tree-thinning receives actual file token counts (not truncated 500-char excerpts) -- inspect `resolveTreeThinningContent()` in `workflow.ts:679`; confirm full content or a separate `fullTokenCount` field is passed to `applyTreeThinning()`
- [ ] CHK-P0-014 [Finding: CODEX-A5-001] Verify dead-code CLI capture shared module is either wired in or deleted -- `grep -r "cli-capture-shared" scripts/extractors/` returns import statements in all 4 CLI capture files, OR `ls scripts/lib/cli-capture-shared.ts` returns "No such file" (deleted)
- [ ] CHK-P0-015 [Finding: CODEX-A1-005] Verify per-spec-folder metadata updates use a filesystem lock or CAS (not just in-memory promise queue) -- inspect `workflow.ts` around `savePFD()` for lockfile acquisition or atomic compare-and-swap on `description.json`

## P1 Items (Required)

### Architecture & Layer Violations

- [ ] CHK-P1-001 [Finding: OPUS-A1-004] Verify `loaders/data-loader.ts` imports CONFIG from `../config` instead of `../core` -- `grep "from '../core'" scripts/loaders/data-loader.ts` returns empty
- [ ] CHK-P1-002 [Finding: OPUS-A1-005, OPUS-A1-006] Verify utils/ re-export shims for `phase-classifier` and `memory-frontmatter` are removed and importers updated to `lib/` paths -- `ls scripts/utils/phase-classifier.ts scripts/utils/memory-frontmatter.ts` returns "No such file" (both deleted); `grep "utils/phase-classifier" scripts/extractors/conversation-extractor.ts` returns empty; `grep "utils/memory-frontmatter" scripts/core/workflow.ts` returns empty
- [ ] CHK-P1-003 [Finding: OPUS-A1-007] Verify `core/workflow.ts` God-module risk is documented or partially mitigated -- at minimum, all barrel-bypass imports consolidated (per OPUS-A1-008/009) so that direct file imports from extractors/ are replaced with barrel imports from `../extractors`
- [ ] CHK-P1-004 [Finding: OPUS-A1-008] Verify `core/workflow.ts` uses barrel-only imports from extractors/ -- `grep "from '../extractors/" scripts/core/workflow.ts` returns empty (no direct file imports); all extractor imports come from `from '../extractors'`
- [ ] CHK-P1-005 [Finding: OPUS-A1-009] Verify `core/memory-indexer.ts` imports `CollectedDataFull` from the extractors barrel -- `grep "from '../extractors/collect-session-data'" scripts/core/memory-indexer.ts` returns empty; import uses `from '../extractors'`

### Type Safety & Data Integrity

- [ ] CHK-P1-006 [Finding: CODEX-A3-001] Verify `ConversationPhase` naming collision is resolved -- `utils/tool-detection.ts` no longer exports a type called `ConversationPhase`; only `types/session-types.ts` owns the canonical `ConversationPhase` object type; run `grep "export.*ConversationPhase" scripts/utils/tool-detection.ts` returns empty
- [ ] CHK-P1-007 [Finding: CODEX-A3-005] Verify `ToolCounts` uses a closed key set instead of open `[key: string]: number` indexer -- inspect `types/session-types.ts` around line 215; the indexer is either replaced with `Record<ToolName, number>` or has declared fields for all known tool names
- [ ] CHK-P1-008 [Finding: CODEX-A3-006] Verify `LoadedData`/`RawInputData`/`NormalizedData` use discriminated unions keyed by `_source` -- inspect `loaders/data-loader.ts` and `utils/input-normalizer.ts` for union discriminant patterns replacing open bags
- [ ] CHK-P1-009 [Finding: CODEX-A3-008] Verify OpenCode recovery path validates JSON shape before narrowing -- `readJsonSafe`/`readJsonlTail` in `extractors/opencode-capture.ts` return `unknown` with type guards applied before accessing fields
- [ ] CHK-P1-010 [Finding: CODEX-A2-003] Verify `nextSteps` type contract is consistent end-to-end -- either `session-types.ts` declares `nextSteps?: string[]` or normalization explicitly converts `Record<string, unknown>` items to strings before rendering; confirm `narrative: nextSteps.join(' ')` cannot produce `[object Object]`
- [ ] CHK-P1-011 [Finding: CODEX-A1-002] Verify snapshot builder preserves real spec-relevance provenance on files -- `specRelevant` field in sufficiency gate input is computed from actual file analysis (not hardcoded `true`); inspect `workflow.ts:1137` area

### Logic & Behavior Correctness

- [ ] CHK-P1-012 [Finding: CODEX-A1-003] Verify `KEY_FILES` is built from `effectiveFiles` (post-thinning) not `enhancedFiles` (pre-thinning) -- inspect `workflow.ts:1937` area; `buildKeyFiles()` call uses the thinning-applied file list
- [ ] CHK-P1-013 [Finding: CODEX-A1-004] Verify stateless alignment degradation is logged or fails closed -- when `extractSpecFolderContext()` fails, the fallback is at minimum logged at WARN level; for stateless saves, the workflow aborts rather than silently accepting keyword-only alignment
- [ ] CHK-P1-014 [Finding: CODEX-A2-002] Verify `toolCalls`/`exchanges` structured fields are threaded through normalization and consumed by session-extractor -- structured `toolCalls` array is preferred over regex counting of observations when present; inspect `session-extractor.ts:352` area
- [ ] CHK-P1-015 [Finding: CODEX-A2-006] Verify contamination filter catches current normalized tool-path title forms like `Read src/file.ts` and `Edit src/file.ts` -- add test case with normalized titles to contamination-filter test suite; `grep "Read src/" scripts/extractors/contamination-filter.ts` shows expanded pattern or test explicitly exercises the path
- [ ] CHK-P1-016 [Finding: CODEX-A5-002] Verify legacy `core/quality-scorer.ts` is removed or renamed -- `ls scripts/core/quality-scorer.ts` returns "No such file" (deleted), OR the function is renamed to `legacyScoreMemoryQuality` with explicit `@deprecated` annotation and tests migrated to `extractors/quality-scorer.ts`
- [ ] CHK-P1-017 [Finding: CODEX-A1-007] Verify memory-indexer recency factor is derived from real timestamp or renamed -- inspect `core/memory-indexer.ts:143`; `recencyFactor` is computed from document creation/modification date, OR the variable is renamed to `staticBoostFactor` to reflect its true behavior
- [ ] CHK-P1-018 [Finding: CODEX-A5-005] Verify `extractors/session-activity-signal.ts` re-export shim is removed -- `ls scripts/extractors/session-activity-signal.ts` returns "No such file" (deleted); importers use `../lib/session-activity-signal` directly
- [ ] CHK-P1-019 [Finding: CODEX-A5-007] Verify `anchor-generator.ts` internal `slugify` is renamed to avoid collision -- `grep "function slugify" scripts/lib/anchor-generator.ts` returns `slugifyKeywords` (or similar disambiguated name), not bare `slugify`

### Ops & Deployment

- [ ] CHK-P1-020 [Finding: OPUS-A4-008] Verify `heal-session-ambiguity.sh` has a replacement verification command or is removed from ops runbook -- script either calls a working verifier or is deleted/documented as deprecated
- [ ] CHK-P1-021 [Finding: OPUS-A4-009] Verify `heal-telemetry-drift.sh` has a replacement verification command or is removed from ops runbook -- script either calls a working verifier or is deleted/documented as deprecated
- [ ] CHK-P1-022 [Finding: OPUS-A4-010] Verify `heal-ledger-mismatch.sh` ledger-consistency verification step is restored or replaced -- the commented-out `run-quality-legacy-remediation.js --check ledger-consistency` invocation has a working replacement
- [ ] CHK-P1-023 [Finding: OPUS-A5-005] Verify quality-loop threshold rejects memories with zero trigger phrases AND missing anchors -- test case: submit a document with 0 triggers and no anchors to `runQualityLoop()`; confirm it is rejected (score < 0.6) or per-dimension floor fails it
- [ ] CHK-P1-024 [Finding: CODEX-A2-004] Verify Codex session targeting passes `sessionId` through the loader boundary -- `CodexCliCaptureMod` interface includes `sessionId` parameter; `attemptNativeCapture()` passes `options.sessionId` to `captureCodexConversation()`

### Metadata & Index Integrity

- [ ] CHK-P1-025 [Finding: OPUS-A3-004] Verify `019-architecture-remediation` entry exists in `descriptions.json` -- `grep "019-architecture-remediation" .opencode/specs/descriptions.json` returns a match
- [ ] CHK-P1-026 [Finding: OPUS-A3-001] Verify all 20 description.json files under 010-perfect-session-capturing have an explicit `status` field -- `find .../010-perfect-session-capturing -name "description.json" -exec grep -L '"status"' {} \;` returns empty (all have status)
- [ ] CHK-P1-027 [Finding: OPUS-A2-006] Verify parent checklist summary counts are correct -- re-count all `[P0]`, `[P1]`, `[P2]` markers in the parent `010-perfect-session-capturing/checklist.md` and confirm the summary table matches

### Test Integrity

- [ ] CHK-P1-028 [Finding: CODEX-A4-001] Verify `test-scripts-modules.js` no longer asserts private `data-validator` helpers (`ensureArrayOfObjects`, `hasArrayContent`, `ARRAY_FLAG_MAPPINGS`) -- `grep "ensureArrayOfObjects\|hasArrayContent\|ARRAY_FLAG_MAPPINGS" scripts/tests/test-scripts-modules.js` returns empty or assertions are updated to match current exports
- [ ] CHK-P1-029 [Finding: CODEX-A4-006] Verify `SessionData` test fixture includes `TECHNICAL_CONTEXT` and `HAS_TECHNICAL_CONTEXT` fields -- inspect `tests/fixtures/session-data-factory.ts:14` for these required fields
- [ ] CHK-P1-030 [Finding: CODEX-A4-007] Verify architecture-boundary test covers package-prefix and absolute-path import violations -- `grep "spec-kit/mcp-server\|spec-kit/scripts\|shared/" scripts/tests/architecture-boundary-enforcement.vitest.ts` returns test cases for these patterns

### Build Consistency

- [ ] CHK-P1-031 [Findings: OPUS-A4-013, OPUS-A4-014] Verify `dist/` artifacts are rebuilt after source changes -- run `npx tsc --noEmit` with zero errors; `dist/core/tree-thinning.d.ts` exports `ThinFileInput` (not just old `FileEntry`); `dist/core/index.d.ts` does NOT export `WorkflowConfig`, `SpecKitConfig`, `writeFilesAtomically`, `FindChildOptions`

## P2 Items (Optional)

### Spec Metadata Cleanup

- [ ] CHK-P2-001 [Finding: OPUS-A3-002, OPUS-A2-002, OPUS-A2-003, OPUS-A2-004, OPUS-A2-005] Verify phase number labels in specs 011-014 match folder IDs -- `011-template-compliance/spec.md` says "Phase 11" (not "Phase 12"); `012-auto-detection-fixes/spec.md` says "Phase 12" (not "Phase 13"); `013-spec-descriptions/spec.md` says "Phase 13" (not "Phase 14"); `014-stateless-quality-gates/spec.md` says "Phase 14" (not "Phase 17")
- [ ] CHK-P2-002 [Finding: OPUS-A3-003] Verify sub-children 000/001-003 spec.md denominator says "of 5" (not "of 3") -- `grep "of 3" .../000-dynamic-capture-deprecation/001-*/spec.md .../000-dynamic-capture-deprecation/002-*/spec.md .../000-dynamic-capture-deprecation/003-*/spec.md` returns empty
- [ ] CHK-P2-003 [Finding: OPUS-A2-009] Verify parent spec.md Phase Documentation Map table includes a row for Phase 019 -- inspect `010-perfect-session-capturing/spec.md` Section 4 table for a 019 entry
- [ ] CHK-P2-004 [Finding: OPUS-A3-005] Verify `019-architecture-remediation/description.json` uses `specId: "019"` and `folderSlug: "architecture-remediation"` (not full folder name)
- [ ] CHK-P2-005 [Finding: OPUS-A2-008] Verify `000-dynamic-capture-deprecation/description.json` `reviewTargets` uses current child names (004, 005) not old root-level numbers (019, 020)
- [ ] CHK-P2-006 [Finding: OPUS-A2-011] Verify `000-dynamic-capture-deprecation/description.json` `supersedes` field is rephrased or replaced with `children`/`contains`
- [ ] CHK-P2-007 [Finding: OPUS-A2-012] Verify `exitCriteria.phaseConsolidation` no longer claims 011, 015, 016 are "superseded"
- [ ] CHK-P2-008 [Finding: OPUS-A2-013] Verify `014-stateless-quality-gates/spec.md` Phase Context text uses current folder numbers (not old "Phase 017"/"Phase 016" references)
- [ ] CHK-P2-009 [Finding: OPUS-A3-009] Verify parent `spec.md` Updated date reflects actual last modification (not stale `2026-03-18`)

### Code Quality Cleanup

- [ ] CHK-P2-010 [Finding: CODEX-A1-006] Verify dual `scoreMemoryQuality` naming confusion is resolved -- either core scorer is deleted (per OPUS-A5-002/CHK-P1-016) or it is renamed to `legacyScoreMemoryQuality` and test imports are updated
- [ ] CHK-P2-011 [Finding: CODEX-A1-008] Verify `indexMemory()` guards against null/malformed trigger arrays -- `Array.isArray(preExtractedTriggers)` check exists before iteration in `core/memory-indexer.ts`
- [ ] CHK-P2-012 [Finding: CODEX-A1-009] Verify config validation enforces `Number.isInteger` for count/limit fields -- inspect `core/config.ts:125` area; fields labeled "Positive integer" reject fractional numbers
- [ ] CHK-P2-013 [Finding: CODEX-A1-010] Verify stale JS test artifacts for tree-thinning are regenerated or deleted -- `ls scripts/tests/tree-thinning.vitest.js` returns "No such file" or content matches current TS threshold of 150 (not 300)
- [ ] CHK-P2-014 [Finding: CODEX-A2-007] Verify contamination filter denylist does not delete legitimate content phrases from non-orchestration fields -- review `contamination-filter.ts:33-55` patterns; generic phrases like "Let me check" are restricted to orchestration-only metadata fields or require stronger anchoring context
- [ ] CHK-P2-015 [Finding: CODEX-A2-005] Verify session targeting is symmetric across providers -- Copilot, Gemini, and OpenCode captures support exact session ID targeting (not just "newest match"); alternatively, document the asymmetry as an accepted limitation
- [ ] CHK-P2-016 [Finding: CODEX-A2-009] Verify null-data simulation fallback in `collectSessionData()` is removed or guarded behind explicit simulation flag -- `grep "createSessionData" scripts/extractors/collect-session-data.ts` returns only simulation-mode-flagged invocations
- [ ] CHK-P2-017 [Finding: CODEX-A2-010] Verify `toolCallIndexById` map in Gemini capture is either used or removed -- `grep "toolCallIndexById" scripts/extractors/gemini-cli-capture.ts` returns both `.set()` and `.get()` calls, OR the map is deleted
- [ ] CHK-P2-018 [Finding: CODEX-A3-002] Verify `FileEntry` naming collision is resolved -- `grep "interface FileEntry\|type FileEntry" scripts/**/*.ts` returns at most 1 canonical definition; deprecated aliases are removed or renamed to `NormalizedFileEntry`/`ThinFileInput`
- [ ] CHK-P2-019 [Finding: CODEX-A3-003] Verify `UserPrompt` naming collision is resolved -- `utils/input-normalizer.ts` no longer exports deprecated `UserPrompt` alias; callers use `NormalizedUserPrompt`
- [ ] CHK-P2-020 [Finding: CODEX-A3-004] Verify `ExchangeSummary` naming collision is resolved -- `utils/message-utils.ts` exports `ExchangeArtifactSummary` (not bare `ExchangeSummary`); deprecated alias removed
- [ ] CHK-P2-021 [Finding: CODEX-A3-010] Verify `transformOpencodeCapture` no longer double-casts via `as unknown as Record<string, unknown>` -- inspect `utils/input-normalizer.ts:822`; explicit raw-field optionals added to capture type or `unknown` + guard pattern used
- [ ] CHK-P2-022 [Finding: CODEX-A3-011] Verify production non-null assertions replaced with undefined checks -- `file-extractor.ts:285`, `implementation-guide-extractor.ts:204`, `diagram-extractor.ts:83` use `if (result !== undefined)` pattern instead of `!` assertion
- [ ] CHK-P2-023 [Finding: CODEX-A3-012] Verify `cloneInputData<T>` and `dedupe<T>` generic helpers document lossy behavior in signatures -- JSDoc or type constraint narrows `T` to supported domain types

### Test Coverage Gaps

- [ ] CHK-P2-024 [Finding: CODEX-A4-002] Verify `slugify` assertion in test-scripts-modules.js matches anchor-generator exports -- test either drops the public assertion or `slugify` is re-exported intentionally
- [ ] CHK-P2-025 [Finding: CODEX-A4-003] Verify `createSimulationFlowchart` assertion in test-scripts-modules.js matches simulation-factory exports -- test validates public API only
- [ ] CHK-P2-026 [Finding: CODEX-A4-004] Verify `BOX` constant assertion in test-scripts-modules.js matches ascii-boxes exports -- test either drops the assertion or `BOX` is re-exported
- [ ] CHK-P2-027 [Finding: CODEX-A4-005] Verify trigger-extractor snake_case alias assertion tests the real alias (not `extractTriggerPhrases` twice)
- [ ] CHK-P2-028 [Finding: CODEX-A4-008] Verify memory-maintenance modules (`ast-parser.ts`, `cleanup-orphaned-vectors.ts`, `rebuild-auto-entities.ts`, `reindex-embeddings.ts`) have basic test coverage or are tracked for test addition
- [ ] CHK-P2-029 [Finding: CODEX-A4-009] Verify low-level helpers (`core/subfolder-utils.ts`, `lib/cli-capture-shared.ts`, `lib/frontmatter-migration.ts`, `lib/topic-keywords.ts`, `utils/fact-coercion.ts`) have basic test coverage or are tracked for test addition
- [ ] CHK-P2-030 [Finding: CODEX-A3-014] Verify test files reduce `as any` / `as unknown as` casts -- spot-check 3 test files (`runtime-memory-inputs`, `memory-indexer-weighting`, `tool-sanitizer`) for typed builders replacing casts

### Documentation & Barrel Cleanup

- [ ] CHK-P2-031 [Finding: OPUS-A4-011] Verify `ARCHITECTURE.md` references to deleted `.js/.d.ts` build artifacts are updated -- `npx tsx scripts/evals/check-architecture-boundaries.ts` invocation still works as documented
- [ ] CHK-P2-032 [Finding: OPUS-A4-015] Verify `scripts/evals/README.md` no longer references 4 deleted eval scripts
- [ ] CHK-P2-033 [Finding: OPUS-A1-013] Verify `toCanonicalRelativePath` is re-exported from `utils/index.ts` -- `grep "toCanonicalRelativePath" scripts/utils/index.ts` returns a re-export line
- [ ] CHK-P2-034 [Finding: OPUS-A1-014] Verify extractors barrel no longer re-exports from `lib/session-activity-signal` -- `grep "session-activity-signal" scripts/extractors/index.ts` returns empty
- [ ] CHK-P2-035 [Finding: OPUS-A1-015] Verify `lib/index.ts` barrel exists with public API surface -- `ls scripts/lib/index.ts` returns the file; it re-exports key modules
- [ ] CHK-P2-036 [Finding: OPUS-A1-010] Verify `memory/rebuild-auto-entities.ts` cross-boundary require of `mcp_server/lib/` is replaced with `@spec-kit/mcp-server/api/` import -- `grep "mcp_server/lib/" scripts/memory/rebuild-auto-entities.ts` returns empty; uses `@spec-kit/mcp-server/api/` or allowlist expiry is still valid
- [ ] CHK-P2-037 [Finding: OPUS-A5-006] Verify `memory/validate-memory-quality.ts` shim is reduced to CLI entry only -- test files import from `../lib/validate-memory-quality` (not `../memory/validate-memory-quality`); the `memory/` file contains only `main()` function and minimal re-exports
- [ ] CHK-P2-038 [Finding: OPUS-A5-011] Verify content-filter and contamination-filter have cross-reference documentation -- each file has a header comment or JSDoc explaining the complementary role of the other filter
- [ ] CHK-P2-039 [Finding: OPUS-A3-008] Verify description.json keywords are domain-specific (not generic "feature", "specification") -- spot-check 3 phases for discriminating keywords (e.g., "quality-scorer" for 001, "contamination-filter" for 002)
- [ ] CHK-P2-040 [Finding: CODEX-A3-007] Verify at least 2 open-bag interfaces (`PromptItem`, `SemanticMessage`, `ToolCallRecord`, `LogEntry`) are narrowed to explicit types or documented as intentional -- inspect `lib/content-filter.ts:88`, `lib/semantic-summarizer.ts:24`, `utils/tool-detection.ts:26`, `utils/logger.ts:16` for reduced use of `[key: string]: unknown`
- [ ] CHK-P2-041 [Finding: CODEX-A3-009] Verify Codex normalization uses discriminant guards instead of unchecked record assertions -- `grep "as Record" scripts/extractors/codex-cli-capture.ts` returns fewer instances; `isCodexSessionMetaEntry` type guard exists
- [ ] CHK-P2-042 [Finding: CODEX-A3-013] Verify `data-loader.ts` and `rank-memories.ts` keep parsed JSON as `unknown` until validated -- `grep "as.*\[\]" scripts/loaders/data-loader.ts` at line 519-527 returns reduced casts; values pass through schema guards first
- [ ] CHK-P2-043 [Finding: OPUS-A4-006] Verify `test-scripts-modules.js:1120-1177` imports renderer helpers from canonical location -- `cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy` are imported from `renderers/template-renderer` (not `lib/content-filter`)
- [ ] CHK-P2-044 [Finding: OPUS-A4-007] Verify renderer helper exports (`cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy`) are either private in `template-renderer.ts` or re-added to `renderers/index.ts` barrel -- export surface is consistent between source and barrel

## Summary

| Priority | Count |
|----------|-------|
| P0       | 15    |
| P1       | 31    |
| P2       | 44    |
| **Total**| **90**|

### Sprint Allocation Guide

| Sprint | Focus | P0 | P1 | P2 |
|--------|-------|----|----|-----|
| S1: Build & Import Fixes | Stale dist, broken imports, critical build | 6 | 1 | 2 |
| S2: Circular Dep & Architecture | Break cycles, fix layer violations, barrel cleanup | 1 | 5 | 5 |
| S3: Data Loss & Logic | JSON normalization, race conditions, tree-thinning | 4 | 6 | 3 |
| S4: Type Safety | Naming collisions, open bags, unsafe casts | 0 | 5 | 10 |
| S5: Ops & Quality Gates | Heal scripts, quality-loop thresholds, validation | 2 | 4 | 2 |
| S6: Metadata & Docs | Phase numbering, description.json backfill, READMEs | 0 | 3 | 12 |
| S7: Test Coverage | Fixture drift, missing tests, cast reduction | 0 | 3 | 6 |
| Deferred | Low-priority cleanup | 2 | 4 | 4 |

### Source Finding Cross-Reference

| Agent | File | Finding Count | P0 | P1 | P2 |
|-------|------|---------------|----|----|-----|
| CODEX-A1 | wave1-codex-A1.md | 10 | 3 | 4 | 3 |
| CODEX-A2 | wave1-codex-A2.md | 10 | 1 | 4 | 5 |
| CODEX-A3 | wave1-codex-A3.md | 14 | 0 | 5 | 9 |
| CODEX-A4 | wave1-codex-A4.md | 9 | 0 | 4 | 5 |
| CODEX-A5 | wave1-codex-A5.md | 5 | 4 | 1 | 0 |
| OPUS-A1 | wave2-opus-A1.md | 15 | 1 | 4 | 10 |
| OPUS-A2 | wave2-opus-A2.md | 18 | 1 | 3 | 14 |
| OPUS-A3 | wave2-opus-A3.md | 9 | 0 | 3 | 6 |
| OPUS-A4 | wave2-opus-A4.md | 18 | 5 | 7 | 6 |
| OPUS-A5 | wave2-opus-A5.md | 12 | 0 | 4 | 8 |
