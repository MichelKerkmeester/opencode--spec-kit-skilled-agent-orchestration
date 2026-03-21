---
title: "Verification Checklist: Architecture Remediation Deep Dive [template:level_3/checklist.md]"
description: "Quality gates for the 15-agent architecture audit and Wave 3 synthesis of the perfect-session-capturing subsystem. 90 items: 15 P0, 31 P1, 44 P2."
trigger_phrases:
  - "019 checklist"
  - "architecture remediation verification"
  - "wave 3 quality gates"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Architecture Remediation Deep Dive

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Level 3 skeleton files created (tasks.md, checklist.md, decision-record.md)
- [x] CHK-002 [P0] All 15 agent workstreams defined with PDR (Prompt, Deliverable, Reference)
- [x] CHK-003 [P1] Prior findings (135) loaded and accessible for Wave 3 verification
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

*Analysis Quality — verifies Wave 1 agent output fidelity.*

- [x] CHK-010 [P0] All 10 Wave 1 agents completed without errors
- [x] CHK-011 [P0] Finding format consistent — FINDING-NNN | SEVERITY | CATEGORY | file:line
- [x] CHK-012 [P1] No analysis gaps — all 8 subsystems (core, extractors, lib, utils, memory, renderers, spec-folder, tests) covered
- [x] CHK-013 [P1] Cross-agent finding deduplication performed by OPUS-B1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

*Synthesis Verification — validates Wave 3 output completeness.*

- [x] CHK-020 [P0] All prior findings verified (each marked: persist / fixed / superseded / new) — 109 persist, 7 fixed, 53 new
- [x] CHK-021 [P0] Priority matrix covers all non-LOW findings with sprint assignment (S1-S8)
- [x] CHK-022 [P1] Sprint groupings have effort estimates
- [x] CHK-023 [P1] Decision records have alternatives + rationale for each ADR (8 ADRs complete)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

*Analysis-only phase — no source modifications, minimal security surface.*

- [ ] CHK-025 [P2] No secrets or credentials referenced in scratch outputs
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P0] spec.md updated with final scope and risk matrix
- [x] CHK-031 [P0] plan.md updated with Wave 3 synthesis and remediation sprint plan (S1-S8)
- [x] CHK-032 [P1] tasks.md reflects actual completion state
- [x] CHK-033 [P1] decision-record.md has 8 ADRs with status and alternatives
- [ ] CHK-034 [P2] research.md compiled from OPUS-B5 output (optional)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All Wave 1 raw findings in scratch/ only — not in spec docs
- [x] CHK-051 [P1] scratch/ Wave 3 synthesis files clearly named (wave3-*.md)
- [ ] CHK-052 [P2] Findings saved to memory/ after Wave 3 completes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:sprint-s1 -->
## Sprint S1 Verification: Critical Build & Import Failures

- [ ] CHK-P0-001 [P0] Verify `ast-parser.ts` no longer imports deleted `structure-aware-chunker` -- `grep 'structure-aware-chunker' scripts/memory/ast-parser.ts` returns empty or import is replaced with valid module path [Finding: OPUS-A2-001]
- [ ] CHK-P0-002 [P0] Verify stale dist artifacts for deleted `run-quality-legacy-remediation.ts` are removed -- `ls scripts/dist/evals/run-quality-legacy-remediation.*` returns no files [Finding: OPUS-A4-001]
- [ ] CHK-P0-003 [P0] Verify stale dist map files for deleted `run-chk210-quality-backfill.ts` are removed -- `ls scripts/dist/evals/run-chk210-quality-backfill.*` returns no files [Finding: OPUS-A4-002]
- [ ] CHK-P0-004 [P0] Verify stale dist map files for deleted `run-phase1-5-shadow-eval.ts` are removed -- `ls scripts/dist/evals/run-phase1-5-shadow-eval.*` returns no files [Finding: OPUS-A4-003]
- [ ] CHK-P0-005 [P0] Verify stale dist map files for deleted `run-phase3-telemetry-dashboard.ts` are removed -- `ls scripts/dist/evals/run-phase3-telemetry-dashboard.*` returns no files [Finding: OPUS-A4-004]
- [ ] CHK-P0-006 [P0] Verify stale dist artifacts for relocated `structure-aware-chunker` are removed from `scripts/dist/lib/` -- `ls scripts/dist/lib/structure-aware-chunker.*` returns no files [Finding: OPUS-A4-005]
<!-- /ANCHOR:sprint-s1 -->

---

<!-- ANCHOR:sprint-s2 -->
## Sprint S2 Verification: Data Integrity & Race Conditions

- [ ] CHK-P0-007 [P0] Verify `--stdin`/`--json` mode runs payloads through `validateInputData()` and `normalizeInputData()` before entering workflow -- inspect `generate-context.ts` structured-mode path for validation calls; snake_case fields like `user_prompts` must be normalized to camelCase before `runWorkflow()` [Finding: OPUS-A5-001]
- [ ] CHK-P0-008 [P0] Verify V-rule bridge fails closed on load failure -- when `loadModule()` throws, `memory_save` handler must return an error (not a warning) and refuse the write; test by temporarily renaming the dist artifact and calling `memory_save` [Finding: OPUS-A5-002]
- [ ] CHK-P0-009 [P0] Verify `atomicSaveMemory()` uses unique pending paths per request -- inspect `memory-save.ts` `getPendingPath()` for `randomUUID()` or `requestId` inclusion; confirm two concurrent saves to the same file path produce distinct `_pending` filenames [Finding: OPUS-A5-003]
- [ ] CHK-P0-010 [P0] Verify normal save path uses atomic temp-file + rename (not plain `writeFile`) for post-commit disk writes -- inspect `memory-save.ts` lines 565-572 and 723-727 for `renameSync` or `atomicWriteFile` pattern; confirm no raw `fs.promises.writeFile()` on the final path after DB commit [Finding: OPUS-A5-004]
<!-- /ANCHOR:sprint-s2 -->

---

<!-- ANCHOR:sprint-s3 -->
## Sprint S3 Verification: Type System Cleanup

- [ ] CHK-P0-011 [P0] Verify three structural circular dependencies are broken -- `lib/semantic-summarizer.ts`, `renderers/template-renderer.ts`, and `spec-folder/folder-detector.ts` + `spec-folder/directory-setup.ts` all import CONFIG from `../config` (not `../core`); run `grep "from '../core'" scripts/lib/semantic-summarizer.ts scripts/renderers/template-renderer.ts scripts/spec-folder/folder-detector.ts scripts/spec-folder/directory-setup.ts` returns empty [Findings: OPUS-A1-001, OPUS-A1-002, OPUS-A1-003]
- [ ] CHK-P0-012 [P0] Verify `normalizeInputData()` preserves canonical `sessionSummary`, `keyDecisions`, and `nextSteps` fields from JSON-primary input -- unit test: pass a JSON payload with `sessionSummary` set; confirm `collectSessionData()` can read `collectedData.sessionSummary` downstream [Finding: CODEX-A2-001]
- [ ] CHK-P0-013 [P0] Verify tree-thinning receives actual file token counts (not truncated 500-char excerpts) -- inspect `resolveTreeThinningContent()` in `workflow.ts:679`; confirm full content or a separate `fullTokenCount` field is passed to `applyTreeThinning()` [Finding: CODEX-A1-001]
- [ ] CHK-P0-014 [P0] Verify dead-code CLI capture shared module is either wired in or deleted -- `grep -r "cli-capture-shared" scripts/extractors/` returns import statements in all 4 CLI capture files, OR `ls scripts/lib/cli-capture-shared.ts` returns "No such file" (deleted) [Finding: CODEX-A5-001]
- [ ] CHK-P0-015 [P0] Verify per-spec-folder metadata updates use a filesystem lock or CAS (not just in-memory promise queue) -- inspect `workflow.ts` around `savePFD()` for lockfile acquisition or atomic compare-and-swap on `description.json` [Finding: CODEX-A1-005]
<!-- /ANCHOR:sprint-s3 -->

---

<!-- ANCHOR:sprint-s4 -->
## Sprint S4 Verification: Architecture Remediation

- [ ] CHK-P1-001 [P1] Verify `loaders/data-loader.ts` imports CONFIG from `../config` instead of `../core` -- `grep "from '../core'" scripts/loaders/data-loader.ts` returns empty [Finding: OPUS-A1-004]
- [ ] CHK-P1-002 [P1] Verify utils/ re-export shims for `phase-classifier` and `memory-frontmatter` are removed and importers updated to `lib/` paths -- `ls scripts/utils/phase-classifier.ts scripts/utils/memory-frontmatter.ts` returns "No such file" (both deleted) [Findings: OPUS-A1-005, OPUS-A1-006]
- [ ] CHK-P1-003 [P1] Verify `core/workflow.ts` God-module risk is documented or partially mitigated -- at minimum, all barrel-bypass imports consolidated so that direct file imports from extractors/ are replaced with barrel imports from `../extractors` [Finding: OPUS-A1-007]
- [ ] CHK-P1-004 [P1] Verify `core/workflow.ts` uses barrel-only imports from extractors/ -- `grep "from '../extractors/" scripts/core/workflow.ts` returns empty (no direct file imports); all extractor imports come from `from '../extractors'` [Finding: OPUS-A1-008]
- [ ] CHK-P1-005 [P1] Verify `core/memory-indexer.ts` imports `CollectedDataFull` from the extractors barrel -- `grep "from '../extractors/collect-session-data'" scripts/core/memory-indexer.ts` returns empty; import uses `from '../extractors'` [Finding: OPUS-A1-009]
<!-- /ANCHOR:sprint-s4 -->

---

<!-- ANCHOR:type-safety -->
## Type Safety & Data Integrity

- [ ] CHK-P1-006 [P1] Verify `ConversationPhase` naming collision is resolved -- `utils/tool-detection.ts` no longer exports a type called `ConversationPhase`; only `types/session-types.ts` owns the canonical `ConversationPhase` object type; run `grep "export.*ConversationPhase" scripts/utils/tool-detection.ts` returns empty [Finding: CODEX-A3-001]
- [ ] CHK-P1-007 [P1] Verify `ToolCounts` uses a closed key set instead of open `[key: string]: number` indexer -- inspect `types/session-types.ts` around line 215; the indexer is either replaced with `Record<ToolName, number>` or has declared fields for all known tool names [Finding: CODEX-A3-005]
- [ ] CHK-P1-008 [P1] Verify `LoadedData`/`RawInputData`/`NormalizedData` use discriminated unions keyed by `_source` -- inspect `loaders/data-loader.ts` and `utils/input-normalizer.ts` for union discriminant patterns replacing open bags [Finding: CODEX-A3-006]
- [ ] CHK-P1-009 [P1] Verify OpenCode recovery path validates JSON shape before narrowing -- `readJsonSafe`/`readJsonlTail` in `extractors/opencode-capture.ts` return `unknown` with type guards applied before accessing fields [Finding: CODEX-A3-008]
- [ ] CHK-P1-010 [P1] Verify `nextSteps` type contract is consistent end-to-end -- either `session-types.ts` declares `nextSteps?: string[]` or normalization explicitly converts `Record<string, unknown>` items to strings before rendering; confirm `narrative: nextSteps.join(' ')` cannot produce `[object Object]` [Finding: CODEX-A2-003]
- [ ] CHK-P1-011 [P1] Verify snapshot builder preserves real spec-relevance provenance on files -- `specRelevant` field in sufficiency gate input is computed from actual file analysis (not hardcoded `true`); inspect `workflow.ts:1137` area [Finding: CODEX-A1-002]
<!-- /ANCHOR:type-safety -->

---

<!-- ANCHOR:logic-behavior -->
## Logic & Behavior Correctness

- [ ] CHK-P1-012 [P1] Verify `KEY_FILES` is built from `effectiveFiles` (post-thinning) not `enhancedFiles` (pre-thinning) -- inspect `workflow.ts:1937` area; `buildKeyFiles()` call uses the thinning-applied file list [Finding: CODEX-A1-003]
- [ ] CHK-P1-013 [P1] Verify stateless alignment degradation is logged or fails closed -- when `extractSpecFolderContext()` fails, the fallback is at minimum logged at WARN level; for stateless saves, the workflow aborts rather than silently accepting keyword-only alignment [Finding: CODEX-A1-004]
- [ ] CHK-P1-014 [P1] Verify `toolCalls`/`exchanges` structured fields are threaded through normalization and consumed by session-extractor -- structured `toolCalls` array is preferred over regex counting of observations when present; inspect `session-extractor.ts:352` area [Finding: CODEX-A2-002]
- [ ] CHK-P1-015 [P1] Verify contamination filter catches current normalized tool-path title forms like `Read src/file.ts` and `Edit src/file.ts` -- add test case with normalized titles to contamination-filter test suite [Finding: CODEX-A2-006]
- [ ] CHK-P1-016 [P1] Verify legacy `core/quality-scorer.ts` is removed or renamed -- `ls scripts/core/quality-scorer.ts` returns "No such file" (deleted), OR the function is renamed to `legacyScoreMemoryQuality` with explicit `@deprecated` annotation and tests migrated to `extractors/quality-scorer.ts` [Finding: CODEX-A5-002]
- [ ] CHK-P1-017 [P1] Verify memory-indexer recency factor is derived from real timestamp or renamed -- inspect `core/memory-indexer.ts:143`; `recencyFactor` is computed from document creation/modification date, OR the variable is renamed to `staticBoostFactor` to reflect its true behavior [Finding: CODEX-A1-007]
- [ ] CHK-P1-018 [P1] Verify `extractors/session-activity-signal.ts` re-export shim is removed -- `ls scripts/extractors/session-activity-signal.ts` returns "No such file" (deleted); importers use `../lib/session-activity-signal` directly [Finding: CODEX-A5-005]
- [ ] CHK-P1-019 [P1] Verify `anchor-generator.ts` internal `slugify` is renamed to avoid collision -- `grep "function slugify" scripts/lib/anchor-generator.ts` returns `slugifyKeywords` (or similar disambiguated name), not bare `slugify` [Finding: CODEX-A5-007]
<!-- /ANCHOR:logic-behavior -->

---

<!-- ANCHOR:ops-deploy -->
## Ops & Deployment

- [ ] CHK-P1-020 [P1] Verify `heal-session-ambiguity.sh` has a replacement verification command or is removed from ops runbook -- script either calls a working verifier or is deleted/documented as deprecated [Finding: OPUS-A4-008]
- [ ] CHK-P1-021 [P1] Verify `heal-telemetry-drift.sh` has a replacement verification command or is removed from ops runbook -- script either calls a working verifier or is deleted/documented as deprecated [Finding: OPUS-A4-009]
- [ ] CHK-P1-022 [P1] Verify `heal-ledger-mismatch.sh` ledger-consistency verification step is restored or replaced -- the commented-out `run-quality-legacy-remediation.js --check ledger-consistency` invocation has a working replacement [Finding: OPUS-A4-010]
- [ ] CHK-P1-023 [P1] Verify quality-loop threshold rejects memories with zero trigger phrases AND missing anchors -- test case: submit a document with 0 triggers and no anchors to `runQualityLoop()`; confirm it is rejected (score < 0.6) or per-dimension floor fails it [Finding: OPUS-A5-005]
- [ ] CHK-P1-024 [P1] Verify Codex session targeting passes `sessionId` through the loader boundary -- `CodexCliCaptureMod` interface includes `sessionId` parameter; `attemptNativeCapture()` passes `options.sessionId` to `captureCodexConversation()` [Finding: CODEX-A2-004]
<!-- /ANCHOR:ops-deploy -->

---

<!-- ANCHOR:metadata-index -->
## Metadata & Index Integrity

- [ ] CHK-P1-025 [P1] Verify `019-architecture-remediation` entry exists in `descriptions.json` -- `grep "019-architecture-remediation" .opencode/specs/descriptions.json` returns a match [Finding: OPUS-A3-004]
- [ ] CHK-P1-026 [P1] Verify all 20 description.json files under 010-perfect-session-capturing have an explicit `status` field -- `find .../010-perfect-session-capturing -name "description.json" -exec grep -L '"status"' {} \;` returns empty (all have status) [Finding: OPUS-A3-001]
- [ ] CHK-P1-027 [P1] Verify parent checklist summary counts are correct -- re-count all `[P0]`, `[P1]`, `[P2]` markers in the parent checklist (`../checklist.md`) and confirm the summary table matches [Finding: OPUS-A2-006]
<!-- /ANCHOR:metadata-index -->

---

<!-- ANCHOR:test-integrity -->
## Test Integrity

- [ ] CHK-P1-028 [P1] Verify `test-scripts-modules.js` no longer asserts private `data-validator` helpers (`ensureArrayOfObjects`, `hasArrayContent`, `ARRAY_FLAG_MAPPINGS`) -- `grep "ensureArrayOfObjects\|hasArrayContent\|ARRAY_FLAG_MAPPINGS" scripts/tests/test-scripts-modules.js` returns empty or assertions are updated to match current exports [Finding: CODEX-A4-001]
- [ ] CHK-P1-029 [P1] Verify `SessionData` test fixture includes `TECHNICAL_CONTEXT` and `HAS_TECHNICAL_CONTEXT` fields -- inspect `tests/fixtures/session-data-factory.ts:14` for these required fields [Finding: CODEX-A4-006]
- [ ] CHK-P1-030 [P1] Verify architecture-boundary test covers package-prefix and absolute-path import violations -- `grep "spec-kit/mcp-server\|spec-kit/scripts\|shared/" scripts/tests/architecture-boundary-enforcement.vitest.ts` returns test cases for these patterns [Finding: CODEX-A4-007]
<!-- /ANCHOR:test-integrity -->

---

<!-- ANCHOR:build-consistency -->
## Build Consistency

- [ ] CHK-P1-031 [P1] Verify `dist/` artifacts are rebuilt after source changes -- run `npx tsc --noEmit` with zero errors; `dist/core/tree-thinning.d.ts` exports `ThinFileInput` (not just old `FileEntry`); `dist/core/index.d.ts` does NOT export `WorkflowConfig`, `SpecKitConfig`, `writeFilesAtomically`, `FindChildOptions` [Findings: OPUS-A4-013, OPUS-A4-014]
<!-- /ANCHOR:build-consistency -->

---

<!-- ANCHOR:spec-metadata -->
## P2: Spec Metadata Cleanup

- [ ] CHK-P2-001 [P2] Verify phase number labels in specs 011-014 match folder IDs -- `../011-template-compliance/` says "Phase 11" (not "Phase 12"); `../012-auto-detection-fixes/` says "Phase 12" (not "Phase 13"); `../013-spec-descriptions/` says "Phase 13" (not "Phase 14"); `../014-stateless-quality-gates/` says "Phase 14" (not "Phase 17") [Findings: OPUS-A3-002, OPUS-A2-002, OPUS-A2-003, OPUS-A2-004, OPUS-A2-005]
- [ ] CHK-P2-002 [P2] Verify sub-children 000/001-003 spec.md denominator says "of 5" (not "of 3") -- `grep "of 3" .../000-dynamic-capture-deprecation/001-*/spec.md .../000-dynamic-capture-deprecation/002-*/spec.md .../000-dynamic-capture-deprecation/003-*/spec.md` returns empty [Finding: OPUS-A3-003]
- [ ] CHK-P2-003 [P2] Verify parent spec.md Phase Documentation Map table includes a row for Phase 019 -- inspect parent `../spec.md` Section 4 table for a 019 entry [Finding: OPUS-A2-009]
- [ ] CHK-P2-004 [P2] Verify `019-architecture-remediation/description.json` uses `specId: "019"` and `folderSlug: "architecture-remediation"` (not full folder name) [Finding: OPUS-A3-005]
- [ ] CHK-P2-005 [P2] Verify `000-dynamic-capture-deprecation/description.json` `reviewTargets` uses current child names (004, 005) not old root-level numbers (019, 020) [Finding: OPUS-A2-008]
- [ ] CHK-P2-006 [P2] Verify `000-dynamic-capture-deprecation/description.json` `supersedes` field is rephrased or replaced with `children`/`contains` [Finding: OPUS-A2-011]
- [ ] CHK-P2-007 [P2] Verify `exitCriteria.phaseConsolidation` no longer claims 011, 015, 016 are "superseded" [Finding: OPUS-A2-012]
- [ ] CHK-P2-008 [P2] Verify `../014-stateless-quality-gates/` Phase Context text uses current folder numbers (not old "Phase 017"/"Phase 016" references) [Finding: OPUS-A2-013]
- [ ] CHK-P2-009 [P2] Verify parent `spec.md` Updated date reflects actual last modification (not stale `2026-03-18`) [Finding: OPUS-A3-009]
<!-- /ANCHOR:spec-metadata -->

---

<!-- ANCHOR:code-quality-p2 -->
## P2: Code Quality Cleanup

- [ ] CHK-P2-010 [P2] Verify dual `scoreMemoryQuality` naming confusion is resolved -- either core scorer is deleted (per OPUS-A5-002/CHK-P1-016) or it is renamed to `legacyScoreMemoryQuality` and test imports are updated [Finding: CODEX-A1-006]
- [ ] CHK-P2-011 [P2] Verify `indexMemory()` guards against null/malformed trigger arrays -- `Array.isArray(preExtractedTriggers)` check exists before iteration in `core/memory-indexer.ts` [Finding: CODEX-A1-008]
- [ ] CHK-P2-012 [P2] Verify config validation enforces `Number.isInteger` for count/limit fields -- inspect `core/config.ts:125` area; fields labeled "Positive integer" reject fractional numbers [Finding: CODEX-A1-009]
- [ ] CHK-P2-013 [P2] Verify stale JS test artifacts for tree-thinning are regenerated or deleted -- `ls scripts/tests/tree-thinning.vitest.js` returns "No such file" or content matches current TS threshold of 150 (not 300) [Finding: CODEX-A1-010]
- [ ] CHK-P2-014 [P2] Verify contamination filter denylist does not delete legitimate content phrases from non-orchestration fields -- review `contamination-filter.ts:33-55` patterns; generic phrases like "Let me check" are restricted to orchestration-only metadata fields or require stronger anchoring context [Finding: CODEX-A2-007]
- [ ] CHK-P2-015 [P2] Verify session targeting is symmetric across providers -- Copilot, Gemini, and OpenCode captures support exact session ID targeting (not just "newest match"); alternatively, document the asymmetry as an accepted limitation [Finding: CODEX-A2-005]
- [ ] CHK-P2-016 [P2] Verify null-data simulation fallback in `collectSessionData()` is removed or guarded behind explicit simulation flag -- `grep "createSessionData" scripts/extractors/collect-session-data.ts` returns only simulation-mode-flagged invocations [Finding: CODEX-A2-009]
- [ ] CHK-P2-017 [P2] Verify `toolCallIndexById` map in Gemini capture is either used or removed -- `grep "toolCallIndexById" scripts/extractors/gemini-cli-capture.ts` returns both `.set()` and `.get()` calls, OR the map is deleted [Finding: CODEX-A2-010]
- [ ] CHK-P2-018 [P2] Verify `FileEntry` naming collision is resolved -- `grep "interface FileEntry\|type FileEntry" scripts/**/*.ts` returns at most 1 canonical definition; deprecated aliases are removed or renamed to `NormalizedFileEntry`/`ThinFileInput` [Finding: CODEX-A3-002]
- [ ] CHK-P2-019 [P2] Verify `UserPrompt` naming collision is resolved -- `utils/input-normalizer.ts` no longer exports deprecated `UserPrompt` alias; callers use `NormalizedUserPrompt` [Finding: CODEX-A3-003]
- [ ] CHK-P2-020 [P2] Verify `ExchangeSummary` naming collision is resolved -- `utils/message-utils.ts` exports `ExchangeArtifactSummary` (not bare `ExchangeSummary`); deprecated alias removed [Finding: CODEX-A3-004]
- [ ] CHK-P2-021 [P2] Verify `transformOpencodeCapture` no longer double-casts via `as unknown as Record<string, unknown>` -- inspect `utils/input-normalizer.ts:822`; explicit raw-field optionals added to capture type or `unknown` + guard pattern used [Finding: CODEX-A3-010]
- [ ] CHK-P2-022 [P2] Verify production non-null assertions replaced with undefined checks -- `file-extractor.ts:285`, `implementation-guide-extractor.ts:204`, `diagram-extractor.ts:83` use `if (result !== undefined)` pattern instead of `!` assertion [Finding: CODEX-A3-011]
- [ ] CHK-P2-023 [P2] Verify `cloneInputData<T>` and `dedupe<T>` generic helpers document lossy behavior in signatures -- JSDoc or type constraint narrows `T` to supported domain types [Finding: CODEX-A3-012]
<!-- /ANCHOR:code-quality-p2 -->

---

<!-- ANCHOR:test-coverage-p2 -->
## P2: Test Coverage Gaps

- [ ] CHK-P2-024 [P2] Verify `slugify` assertion in test-scripts-modules.js matches anchor-generator exports -- test either drops the public assertion or `slugify` is re-exported intentionally [Finding: CODEX-A4-002]
- [ ] CHK-P2-025 [P2] Verify `createSimulationFlowchart` assertion in test-scripts-modules.js matches simulation-factory exports -- test validates public API only [Finding: CODEX-A4-003]
- [ ] CHK-P2-026 [P2] Verify `BOX` constant assertion in test-scripts-modules.js matches ascii-boxes exports -- test either drops the assertion or `BOX` is re-exported [Finding: CODEX-A4-004]
- [ ] CHK-P2-027 [P2] Verify trigger-extractor snake_case alias assertion tests the real alias (not `extractTriggerPhrases` twice) [Finding: CODEX-A4-005]
- [ ] CHK-P2-028 [P2] Verify memory-maintenance modules (`ast-parser.ts`, `cleanup-orphaned-vectors.ts`, `rebuild-auto-entities.ts`, `reindex-embeddings.ts`) have basic test coverage or are tracked for test addition [Finding: CODEX-A4-008]
- [ ] CHK-P2-029 [P2] Verify low-level helpers (`core/subfolder-utils.ts`, `lib/cli-capture-shared.ts`, `lib/frontmatter-migration.ts`, `lib/topic-keywords.ts`, `utils/fact-coercion.ts`) have basic test coverage or are tracked for test addition [Finding: CODEX-A4-009]
- [ ] CHK-P2-030 [P2] Verify test files reduce `as any` / `as unknown as` casts -- spot-check 3 test files (`runtime-memory-inputs`, `memory-indexer-weighting`, `tool-sanitizer`) for typed builders replacing casts [Finding: CODEX-A3-014]
<!-- /ANCHOR:test-coverage-p2 -->

---

<!-- ANCHOR:docs-barrel-p2 -->
## P2: Documentation & Barrel Cleanup

- [ ] CHK-P2-031 [P2] Verify the skill ARCHITECTURE doc references to deleted `.js/.d.ts` build artifacts are updated -- `npx tsx scripts/evals/check-architecture-boundaries.ts` invocation still works as documented [Finding: OPUS-A4-011]
- [ ] CHK-P2-032 [P2] Verify the evals README no longer references 4 deleted eval scripts [Finding: OPUS-A4-015]
- [ ] CHK-P2-033 [P2] Verify `toCanonicalRelativePath` is re-exported from `utils/index.ts` -- `grep "toCanonicalRelativePath" scripts/utils/index.ts` returns a re-export line [Finding: OPUS-A1-013]
- [ ] CHK-P2-034 [P2] Verify extractors barrel no longer re-exports from `lib/session-activity-signal` -- `grep "session-activity-signal" scripts/extractors/index.ts` returns empty [Finding: OPUS-A1-014]
- [ ] CHK-P2-035 [P2] Verify `lib/index.ts` barrel exists with public API surface -- `ls scripts/lib/index.ts` returns the file; it re-exports key modules [Finding: OPUS-A1-015]
- [ ] CHK-P2-036 [P2] Verify `memory/rebuild-auto-entities.ts` cross-boundary require of `mcp_server/lib/` is replaced with `@spec-kit/mcp-server/api/` import -- `grep "mcp_server/lib/" scripts/memory/rebuild-auto-entities.ts` returns empty; uses `@spec-kit/mcp-server/api/` or allowlist expiry is still valid [Finding: OPUS-A1-010]
- [ ] CHK-P2-037 [P2] Verify `memory/validate-memory-quality.ts` shim is reduced to CLI entry only -- test files import from `../lib/validate-memory-quality` (not `../memory/validate-memory-quality`); the `memory/` file contains only `main()` function and minimal re-exports [Finding: OPUS-A5-006]
- [ ] CHK-P2-038 [P2] Verify content-filter and contamination-filter have cross-reference documentation -- each file has a header comment or JSDoc explaining the complementary role of the other filter [Finding: OPUS-A5-011]
- [ ] CHK-P2-039 [P2] Verify description.json keywords are domain-specific (not generic "feature", "specification") -- spot-check 3 phases for discriminating keywords (e.g., "quality-scorer" for 001, "contamination-filter" for 002) [Finding: OPUS-A3-008]
- [ ] CHK-P2-040 [P2] Verify at least 2 open-bag interfaces (`PromptItem`, `SemanticMessage`, `ToolCallRecord`, `LogEntry`) are narrowed to explicit types or documented as intentional -- inspect `lib/content-filter.ts:88`, `lib/semantic-summarizer.ts:24`, `utils/tool-detection.ts:26`, `utils/logger.ts:16` for reduced use of `[key: string]: unknown` [Finding: CODEX-A3-007]
- [ ] CHK-P2-041 [P2] Verify Codex normalization uses discriminant guards instead of unchecked record assertions -- `grep "as Record" scripts/extractors/codex-cli-capture.ts` returns fewer instances; `isCodexSessionMetaEntry` type guard exists [Finding: CODEX-A3-009]
- [ ] CHK-P2-042 [P2] Verify `data-loader.ts` and `rank-memories.ts` keep parsed JSON as `unknown` until validated -- `grep "as.*\[\]" scripts/loaders/data-loader.ts` at line 519-527 returns reduced casts; values pass through schema guards first [Finding: CODEX-A3-013]
- [ ] CHK-P2-043 [P2] Verify `test-scripts-modules.js:1120-1177` imports renderer helpers from canonical location -- `cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy` are imported from `renderers/template-renderer` (not `lib/content-filter`) [Finding: OPUS-A4-006]
- [ ] CHK-P2-044 [P2] Verify renderer helper exports (`cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy`) are either private in `template-renderer.ts` or re-added to `renderers/index.ts` barrel -- export surface is consistent between source and barrel [Finding: OPUS-A4-007]
<!-- /ANCHOR:docs-barrel-p2 -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 31 | 0/31 |
| P2 Items | 44 | 0/44 |

**Verification Date**: 2026-03-21 (Wave 3 synthesis complete; remediation pending)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (8 ADRs complete — ADR-001 through ADR-008)
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 Accepted; ADR-002 through ADR-008 Proposed
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — all 8 ADRs include scored alternatives table
- [ ] CHK-103 [P2] Migration path documented for type renames (ADR-002) — re-export shim lifespan defined as 1 sprint
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Sprint S1 test-breakage fix verified — CI passes after OPUS4-001-008 remediation
- [ ] CHK-111 [P1] Sprint S3 type renames do not introduce new type errors
- [ ] CHK-112 [P2] Build artifact cleanup (Sprint S1) verified by running tsc --noEmit
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented for each sprint (revert commit + restore exports) — documented in plan.md Section 7
- [ ] CHK-121 [P1] Sprint S1 fix does not break other consumers of removed exports
- [ ] CHK-122 [P1] Architecture boundary changes (Sprint S4) do not break existing barrel exports
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| — | Tech Lead | [ ] Approved | |
| — | Spec Kit Owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
