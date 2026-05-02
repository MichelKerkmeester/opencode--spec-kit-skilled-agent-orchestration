# Wave 3 - OPUS-B2: Remediation Priority Matrix
Date: 2026-03-21

## Executive Summary

**Total raw findings across all waves:** 270 (Wave 1 prior: 135, Wave 1 new: 49, Wave 2 new: 86)
**After deduplication:** 197 unique findings
**Duplicates removed:** 73 (cross-agent overlap on the same root cause)

**Sprint count:** 8
**Estimated total effort:** 45-65 hours
**Estimated total LOC change:** +1,200 / -2,800 (net -1,600 lines)

### Severity Distribution (Deduplicated)

| Severity | Count | Percentage |
|----------|-------|------------|
| CRITICAL | 12 | 6% |
| HIGH | 48 | 24% |
| MEDIUM | 86 | 44% |
| LOW | 51 | 26% |
| **Total** | **197** | **100%** |

### Sprint Effort Overview

| Sprint | Title | Priority | Findings | Est. Hours | Risk |
|--------|-------|----------|----------|------------|------|
| S1 | Critical/Blocking Fixes | CRITICAL | 22 | 4-6h | H |
| S2 | Data Integrity & Race Conditions | HIGH | 18 | 8-12h | H |
| S3 | Type System Cleanup | HIGH | 24 | 6-8h | M |
| S4 | Architecture Remediation | HIGH | 23 | 8-12h | M |
| S5 | Spec/Metadata Alignment | MEDIUM | 30 | 4-6h | L |
| S6 | Dead Code Deletion & Consolidation | MEDIUM | 28 | 6-8h | M |
| S7 | Test Coverage Gaps | LOW | 26 | 6-8h | L |
| S8 | Extractor Parity & Quality Gates | LOW | 26 | 6-8h | M |

---

## Sprint Plan

---

### Sprint S1: Critical/Blocking Fixes — Priority: CRITICAL
**Theme:** Unblock CI, remove stale artifacts causing runtime failures, fix test breakage

**Findings:** OPUS4-001..005, CODEX1-001, CODEX1-005, OPUS-A4-001..005, OPUS-A4-006..010, OPUS-A2-001, CODEX-A1-010, OPUS3-009, OPUS3-012/013, CODEX5-001
**Files affected:** ~25
**Estimated LOC:** +50 / -400 (net -350)
**Risk:** H — These are blocking issues; tests and ops scripts fail without this sprint.

**Tasks:**

1. **Delete ALL stale dist/ artifacts for deleted source files** (OPUS-A4-001..005, CODEX1-005, OPUS3-012/013)
   - Delete `scripts/dist/evals/run-quality-legacy-remediation.{js,d.ts,js.map,d.ts.map}`
   - Delete `scripts/dist/evals/run-chk210-quality-backfill.{js.map,d.ts.map}`
   - Delete `scripts/dist/evals/run-phase1-5-shadow-eval.{js.map,d.ts.map}`
   - Delete `scripts/dist/evals/run-phase3-telemetry-dashboard.{js.map,d.ts.map}`
   - Delete `scripts/dist/lib/structure-aware-chunker.{js,d.ts,js.map,d.ts.map}`
   - Delete `scripts/core/tree-thinning.{js,js.map,d.ts.map}` (source-tree stale artifacts — the TS source is modified and canonical; these JS files ship `memoryThinThreshold: 300` vs correct `150`)
   - Delete `scripts/evals/check-architecture-boundaries.{js,d.ts,js.map,d.ts.map}` (source-tree stale artifacts)

2. **Update test-scripts-modules.js for removed exports** (OPUS4-001..005)
   - Remove/update assertions for: `updateMetadataWithEmbedding`, `generateSemanticSlug`, `generateShortHash`, `extractKeywords`, `getCurrentDate`, `STOP_WORDS`, `ACTION_VERBS`, `createFullSimulation`, `formatTimestamp`, `generateSessionId`, `addSimulationWarning`, `markAsSimulated`, `filterContent`, `getFilterStats`, `resetStats`, `generateContentHash`, `calculateSimilarity`, `stripNoiseWrappers`, `meetsMinimumRequirements`, `calculateQualityScore`, `requireInteractiveMode`, `logAnchorValidation`
   - Update assertions for: `ensureArrayOfObjects`, `hasArrayContent`, `ARRAY_FLAG_MAPPINGS` (CODEX-A4-001), `slugify` (CODEX-A4-002), `createSimulationFlowchart` (CODEX-A4-003), `BOX` constant (CODEX-A4-004), `extract_trigger_phrases` alias (CODEX-A4-005)

3. **Fix stale mocks in vitest files** (OPUS4-007/008)
   - `task-enrichment.vitest.ts` — remove mock of deleted `updateMetadataWithEmbedding`
   - `memory-render-fixture.vitest.ts` — remove mock of deleted `updateMetadataWithEmbedding`

4. **Fix or remove broken ops scripts** (OPUS-A4-008..010, OPUS3-009, CODEX5-001)
   - `heal-session-ambiguity.sh` — DELETE entirely (unconditionally exits with deprecation error; the underlying eval script was removed)
   - `heal-telemetry-drift.sh` — DELETE entirely (same: unconditionally exits with deprecation error)
   - `heal-ledger-mismatch.sh` — Remove the dead `run-quality-legacy-remediation.js` reference at line 104; wire a replacement check or delete the script if no replacement exists

5. **Fix broken import in ast-parser.ts** (OPUS-A2-001, CODEX3-001)
   - `memory/ast-parser.ts:8` imports deleted `@spec-kit/shared/lib/structure-aware-chunker`
   - Repoint to the current shared chunker implementation or inline the needed functions

6. **Rebuild dist/ to sync with all source changes** (OPUS-A4-013, OPUS-A4-014)
   - Run full TypeScript build to regenerate `dist/` from current source
   - Verify `dist/core/tree-thinning.d.ts` reflects `ThinFileInput` rename and threshold `150`
   - Verify `dist/core/index.js` reflects narrowed barrel

7. **Update tree-thinning test threshold** (CODEX1-001, CODEX-A1-010)
   - `tests/tree-thinning.vitest.ts:393` — change assertion from `300` to `150`

**Quality Gate G-01:** All test suites pass. `npx vitest run` exits 0.

---

### Sprint S2: Data Integrity & Race Conditions — Priority: HIGH
**Theme:** Fix race conditions, data loss, silent failures, and validation bypasses

**Findings:** CODEX-A5-003, CODEX-A5-004, CODEX-A1-005, CODEX-A2-001, CODEX-A2-002, CODEX-A5-001, CODEX-A5-002, CODEX4-001, CODEX4-002, CODEX4-004, CODEX-A1-001, CODEX-A1-002, CODEX-A1-004, CODEX3-004, CODEX3-008, CODEX4-003, CODEX4-006, CODEX4-005
**Files affected:** ~18
**Estimated LOC:** +300 / -100 (net +200)
**Risk:** H — Race conditions and data loss are high-severity runtime risks.

**Tasks:**

1. **Fix V-rule bridge fail-open bypass** (CODEX-A5-002)
   - `mcp_server/handlers/v-rule-bridge.ts:44` — Change from fail-open to fail-closed: surface a handler error when the bridge cannot load, or eagerly verify bridge availability at startup
   - Reject `memory_save` when validation rules are unavailable

2. **Fix concurrent save race condition** (CODEX-A5-003)
   - `mcp_server/handlers/memory-save.ts:1120` — Use unique pending filename per request (include `randomUUID()`) instead of shared deterministic `_pending` path
   - Add OS-visible file lock keyed by final path

3. **Fix non-atomic post-commit file rewrites** (CODEX-A5-004)
   - `memory-save.ts:565-572` and `memory-save.ts:723-727` — Replace `writeFile` with pending-file + rename flow
   - Take file-path lock instead of process-local spec-folder lock

4. **Add filesystem lock for workflow metadata** (CODEX-A1-005)
   - `core/workflow.ts:976` — Replace in-process promise queue with lockfile or atomic CAS for `description.json` updates

5. **Fix JSON-mode validation bypass** (CODEX-A5-001)
   - `memory/generate-context.ts:372` — Run `--stdin`/`--json` payloads through `validateInputData()` and `normalizeInputData()` before setting `collectedData`
   - Reject payloads that fail normalization

6. **Fix tree-thinning file size miscounting** (CODEX-A1-001)
   - `core/workflow.ts:679` — Pass full file content or separate full-token-count into thinning; only truncate when rendering merge notes

7. **Fix hardcoded specRelevant=true** (CODEX-A1-002)
   - `core/workflow.ts:1137` — Preserve real relevance/provenance on `FileChange` and propagate `_specRelevant` instead of forcing `true`

8. **Fix silent alignment degradation** (CODEX-A1-004)
   - `core/workflow.ts:418` — Log degraded alignment mode; fail closed for stateless saves when spec context cannot be loaded

9. **Fix TOCTOU in orphan cleanup** (CODEX4-001)
   - `cleanup-orphaned-vectors.ts:84` — Move orphan predicate into `DELETE` statements inside a single `BEGIN IMMEDIATE` transaction

10. **Fix quarantine overwrite** (CODEX4-002)
    - `historical-memory-remediation.ts:706` — NOTE: This file is deleted in current changes. If it remains deleted, this finding is resolved. If restored, use unique quarantine names.

11. **Guard transformKeyDecision against string alternatives** (CODEX3-004)
    - `input-normalizer.ts:199` — Add `Array.isArray(decisionItem.alternatives)` guard

12. **Fix formatTimestamp UTC misrepresentation** (CODEX3-008)
    - `message-utils.ts:90` — Only apply timezone offsets to human-readable formats; emit offset or local string instead of `Z`

13. **Validate rank-memories JSON input** (CODEX4-003)
    - `rank-memories.ts:386` — Require either array or object with `results` array; throw schema error otherwise

14. **Fix backfill-frontmatter silent skip** (CODEX4-006)
    - `backfill-frontmatter.ts:240` — Record skipped directories in report; fail non-zero unless opt-in for partial

15. **Fix reindex-embeddings silent success** (CODEX4-005)
    - `reindex-embeddings.ts:76` — Assert `result.content?.[0]?.text` exists; throw on empty response

**Quality Gate G-02:** No silent data loss in concurrent save scenarios. Validation-rule bridge fails closed.

---

### Sprint S3: Type System Cleanup — Priority: HIGH
**Theme:** Resolve naming collisions, unsafe casts, and index signature overuse

**Findings:** CODEX-A3-001..014, OPUS5-001..005, OPUS5-009, OPUS5-016, OPUS5-004, OPUS5-006..008, OPUS5-010, OPUS5-020, CODEX-A1-006, CODEX-A2-003
**Files affected:** ~20
**Estimated LOC:** +250 / -150 (net +100)
**Risk:** M — Type renames are mechanical but touch many files.

**Tasks:**

1. **Resolve `ConversationPhase` naming collision** (CODEX-A3-001)
   - Stop exporting the label alias as `ConversationPhase` from `utils/tool-detection.ts`
   - Keep `ConversationPhase` reserved for the canonical object shape in `types/session-types.ts`
   - Export distinct `ConversationPhaseLabel` instead

2. **Resolve `FileEntry` triple definition** (CODEX-A3-002, OPUS5-003)
   - Retire deprecated `FileEntry` aliases in `input-normalizer.ts` and `tree-thinning.ts`
   - Export only `NormalizedFileEntry` and `ThinFileInput` as distinct names
   - Update all consumers

3. **Resolve `UserPrompt` shadowing** (CODEX-A3-003, OPUS5-016)
   - Stop exporting deprecated `UserPrompt` alias from `input-normalizer.ts`
   - Force callers onto `NormalizedUserPrompt`

4. **Resolve `ExchangeSummary` collision** (CODEX-A3-004, OPUS5-004)
   - Export only `ExchangeArtifactSummary` from `message-utils.ts`
   - Remove the deprecated `ExchangeSummary` alias

5. **Resolve `Observation` naming collision** (OPUS5-002)
   - Rename `input-normalizer.ts` version to `NormalizedObservation`
   - Keep `session-types.ts` `Observation` as canonical

6. **Fix duplicate interfaces in implementation-guide-extractor** (OPUS5-001)
   - Remove 4 locally-defined interfaces; import from `types/session-types.ts` instead

7. **Tighten `ToolCounts` index signature** (CODEX-A3-005)
   - Define `ToolName` union with all supported keys
   - Use `Record<ToolName, number>` instead of open `[key: string]: number`

8. **Replace open-bag `LoadedData`/`RawInputData`/`NormalizedData`** (CODEX-A3-006)
   - Replace with discriminated unions keyed by `_source` and `_isSimulation`

9. **Fix unsafe JSON parsing casts** (CODEX-A3-008, CODEX-A3-009, CODEX-A3-010, CODEX-A3-013)
   - `opencode-capture.ts` — Make `readJsonSafe`/`readJsonlTail` return `unknown`, add validators
   - `codex-cli-capture.ts` — Add discriminant guards for session entries
   - `input-normalizer.ts:822` — Remove `as unknown as Record<string, unknown>` double-cast; add raw-field optionals to capture type
   - `data-loader.ts:520` — Keep parsed values as `unknown` until a guard validates shape

10. **Replace non-null assertions with proper checks** (CODEX-A3-011, OPUS5-006..008)
    - `file-extractor.ts:285`, `implementation-guide-extractor.ts:204`, `diagram-extractor.ts:83` — Store lookup result and branch on `undefined`
    - `collect-session-data.ts:245-247`, `generate-context.ts:499/507`, `rank-memories.ts:394` — Add explicit null checks

11. **Fix lossy generic helpers** (CODEX-A3-012)
    - `cloneInputData<T>` — Constrain to real domain types or encode lossy behavior
    - `dedupe<T>` — Fix `filter(Boolean)` returning `T[]`

12. **Reduce `[key: string]: unknown` overuse in 8 interfaces** (CODEX-A3-007)
    - `PromptItem`, `SemanticMessage`, `SemanticObservation`, `ToolCallRecord`, `LogEntry` — Model as explicit unions or typed metadata wrappers

13. **Remove or unify legacy quality scorer** (CODEX-A1-006, OPUS5-009, CODEX-A1-008 partial)
    - Delete `core/quality-scorer.ts` or make it a thin adapter over `extractors/quality-scorer.ts`
    - Migrate 2 test files to use the V2 scorer

14. **Fix `nextSteps` type mismatch** (CODEX-A2-003)
    - Narrow `session-types.ts` contract to `string[]` end-to-end or add explicit object-to-string normalization

15. **Replace test `as any` / `as unknown as` with typed builders** (CODEX-A3-014)
    - Create typed test fixture builders with `Partial<>` helpers

**Quality Gate G-03:** `tsc --noEmit --strict` exits 0. Zero `as any` in production code maintained.

---

### Sprint S4: Architecture Remediation — Priority: HIGH
**Theme:** Break circular dependencies, restore layer rules, decompose God module

**Findings:** OPUS-A1-001..015, OPUS3-001..008, OPUS3-014, CODEX1-002, CODEX1-004, OPUS-A5-001..006, OPUS-A5-007
**Files affected:** ~30
**Estimated LOC:** +350 / -500 (net -150)
**Risk:** M — Import path changes are mechanical but require careful barrel management.

**Tasks:**

1. **Break lib/ -> core/ circular deps** (OPUS-A1-001, OPUS-A1-002)
   - `lib/semantic-summarizer.ts:14` — Change `import { CONFIG } from '../core'` to `from '../config'`
   - `renderers/template-renderer.ts:15` — Change `import { CONFIG } from '../core'` to `from '../config'`

2. **Break spec-folder/ -> core/ circular dep** (OPUS-A1-003)
   - `spec-folder/folder-detector.ts:22` and `spec-folder/directory-setup.ts:16` — Import from `../config` instead of `../core`
   - Add `SPEC_FOLDER_PATTERN`, `findChildFolderAsync`, `findChildFolderSync` re-exports to `config/index.ts`

3. **Break loaders/ -> core/ circular dep** (OPUS-A1-004)
   - `loaders/data-loader.ts:17` — Change `import { CONFIG } from '../core'` to `from '../config'`

4. **Fix extractors/ -> core/ upward dependency** (OPUS3-004, OPUS3-006)
   - Move `QualityDimensionScore`, `QualityFlag`, `QualityScoreResult` types to `types/session-types.ts`
   - Update 7 extractor files to import CONFIG from `../config` instead of `../core`

5. **Break extractors/ <-> spec-folder/ circular** (OPUS3-005)
   - Move `buildSessionActivitySignal` import in `folder-detector.ts` to use `../lib/session-activity-signal` (canonical location)
   - Verify no spec-folder/ file imports from extractors/

6. **Consolidate barrel imports in core/workflow.ts** (OPUS-A1-007, OPUS-A1-008)
   - Replace 6 direct extractor file imports with barrel-only `from '../extractors'`
   - Replace direct `loaders/data-loader` import with barrel `from '../loaders'`

7. **Fix barrel import in core/memory-indexer.ts** (OPUS-A1-009)
   - Change direct `from '../extractors/collect-session-data'` to `from '../extractors'`

8. **Remove re-export shims** (OPUS-A1-005, OPUS-A1-006, OPUS-A5-003..005)
   - Delete `utils/memory-frontmatter.ts` shim — update `core/workflow.ts` to import from `../lib/memory-frontmatter`
   - Delete `utils/phase-classifier.ts` shim — update `extractors/conversation-extractor.ts` and test to import from `../lib/phase-classifier`
   - Delete `extractors/session-activity-signal.ts` shim — update `tests/auto-detection-fixes.vitest.ts` to import from `../lib/session-activity-signal`
   - Remove cross-subsystem re-export from `extractors/index.ts:14`

9. **Wire or delete `lib/cli-capture-shared.ts`** (OPUS-A5-001)
   - Wire `transcriptTimestamp`, `readJsonl`, `normalizeToolName`, `extractTextContent`, `buildSessionTitle` imports from `lib/cli-capture-shared.ts` into all 4 CLI capture modules
   - Delete ~20 duplicate local function definitions across the 4 capture files

10. **Add `lib/index.ts` barrel** (OPUS-A1-015)
    - Create barrel file re-exporting public API surface from the 17 lib/ files

11. **Add missing utils barrel re-exports** (OPUS-A1-013, OPUS3-014)
    - Add `toCanonicalRelativePath` to `utils/index.ts` re-exports

12. **Reduce memory/ -> mcp_server coupling** (OPUS-A1-010)
    - Already tracked in import-policy-allowlist.json (expires 2026-06-15)
    - Expose `rebuildAutoEntities` via `@spec-kit/mcp-server/api/` surface

13. **Rename `slugify` in anchor-generator** (OPUS-A5-007)
    - Rename internal `slugify(keywords: string[])` to `slugifyKeywords` to prevent collision with `slug-utils.ts:slugify`

14. **Reduce validate-memory-quality shim to CLI entry only** (OPUS-A5-006)
    - `memory/validate-memory-quality.ts` — Keep CLI entry point, migrate 3 test importers to `lib/validate-memory-quality`

**Quality Gate G-04:** Architecture boundary eval passes (`check-architecture-boundaries.ts`). Zero circular dependencies. utils/ imports only from types/.

---

### Sprint S5: Spec/Metadata Alignment — Priority: MEDIUM
**Theme:** Fix phase numbering, status fields, description.json consistency, checklist accuracy

**Findings:** OPUS-A2-002..018, OPUS-A3-001..009, OPUS1-001..020, OPUS2-001..012
**Files affected:** ~35 (mostly .md and .json files)
**Estimated LOC:** +200 / -100 (net +100)
**Risk:** L — Documentation-only changes with no runtime impact.

**Tasks:**

1. **Add 019-architecture-remediation to descriptions.json** (OPUS-A3-004, OPUS2-007)
   - Add entry to the `folders` array in `.opencode/specs/descriptions.json`
   - Normalize `specId` to `"019"` and `folderSlug` to `"architecture-remediation"` (OPUS-A3-005)

2. **Backfill `status` field in 20 description.json files** (OPUS-A3-001, OPUS2-011)
   - Set `"status": "complete"` for phases 002-006, 008-014, 016-017, 000/001-004
   - Set `"status": "in-progress"` for phases 019, 000/005

3. **Fix phase numbering in spec.md Phase Context text** (OPUS-A2-002..005, OPUS-A3-002)
   - 011-template-compliance: Change "Phase 12" to "Phase 11"
   - 012-auto-detection-fixes: Change "Phase 13" to "Phase 12"
   - 013-spec-descriptions: Change "Phase 14" to "Phase 13"
   - 014-stateless-quality-gates: Change "Phase 17" to "Phase 14"

4. **Fix sub-child denominators** (OPUS-A3-003)
   - 000/001-003 spec.md: Change "of 3" to "of 5"

5. **Fix phase chain denominators** (OPUS1-002..008)
   - Update "of 16" and "of 20" references across phases 001-013 to "of 19" (or remove denominators)

6. **Fix parent spec phase map** (OPUS-A2-009, OPUS2-001)
   - Add row for phase 019 to the phase documentation map table in parent spec.md

7. **Fix parent spec phase references** (OPUS1-015, OPUS2-003, OPUS2-004)
   - Remove or correct references to non-existent phases 019/020 (old numbering) in parent spec body, checklist, and frontmatter
   - Note: the current 019-architecture-remediation IS the real 019

8. **Fix parent checklist counts** (OPUS-A2-006, OPUS2-010)
   - Update Verification Summary from P0:11/P1:19/P2:6 to actual P0:12/P1:20/P2:7

9. **Fix 000 description.json stale references** (OPUS-A2-008, OPUS-A2-011, OPUS-A2-012, OPUS2-005, OPUS2-006)
   - Update `reviewTargets` to use current child folder names (004, 005)
   - Remove or rephrase `supersedes` field (children are not superseded)
   - Fix `exitCriteria.phaseConsolidation` references to 011, 015, 016
   - Fix status contradiction: ensure spec.md and description.json agree

10. **Fix stale cross-phase references** (OPUS-A2-013, OPUS-A2-015..018)
    - 014-stateless-quality-gates: Rewrite Phase Context dependencies to current folder numbers
    - Update or annotate R-Item historical references in 011-014

11. **Fix parent spec.md lastUpdated date** (OPUS-A3-009)
    - Update `Updated` field from `2026-03-18` to current date

12. **Fix 000 predecessor chain** (OPUS1-003)
    - Phase 001 should reference 000 as predecessor

13. **Harmonize R-Item format** (OPUS-A2-014)
    - Choose `R-01` or `R-001` format consistently

14. **Add domain-specific keywords** (OPUS-A3-008)
    - Low priority: add discriminating keywords to 15 description.json files

**Quality Gate G-05:** All 20 description.json files have `status` field. Phase numbers in spec.md match folder IDs. Checklist counts are accurate.

---

### Sprint S6: Dead Code Deletion & Consolidation — Priority: MEDIUM
**Theme:** Delete deprecated modules, unwired shared code, stale artifacts, broken ops scripts

**Findings:** CODEX-A2-009, CODEX-A2-010, CODEX1-006, CODEX3-009, CODEX3-010, OPUS-A4-006/007, OPUS-A4-011, OPUS-A4-015..018, OPUS4-009..011, OPUS4-012..018, OPUS3-010/011, CODEX-A4-001..005, CODEX5-002..004
**Files affected:** ~25
**Estimated LOC:** +20 / -600 (net -580)
**Risk:** M — Deletions require verifying zero consumers first.

**Tasks:**

1. **DELETE deprecated eval scripts (already deleted from source, clean up refs)** (CODEX5-002..004)
   - `run-chk210-quality-backfill.ts` — already deleted; remove from `evals/README.md` inventory
   - `run-phase1-5-shadow-eval.ts` — already deleted; remove from `evals/README.md` inventory
   - `run-phase3-telemetry-dashboard.ts` — already deleted; remove from `evals/README.md` inventory
   - `run-quality-legacy-remediation.ts` — already deleted; remove from `evals/README.md` inventory
   - These scripts were untested and are not actively used. COMPLETE DELETION is the correct remediation.

2. **DELETE deprecated ops scripts** (OPUS-A4-008..010 — from S1)
   - `heal-session-ambiguity.sh` — DELETE (unconditionally exits with deprecation error)
   - `heal-telemetry-drift.sh` — DELETE (unconditionally exits with deprecation error)
   - (heal-ledger-mismatch.sh addressed in S1 — either fix or delete)

3. **DELETE `historical-memory-remediation.ts` and its test** (already deleted in diff)
   - Verify no remaining references to `historical-memory-remediation`
   - Confirm `tests/historical-memory-remediation.vitest.ts` is also deleted

4. **DELETE null-data simulation fallback** (CODEX-A2-009)
   - `collect-session-data.ts:732` — Remove the dead `getSimFactory().createSessionData(...)` branch or guard it behind explicit simulation mode flag

5. **DELETE dead `toolCallIndexById` map** (CODEX-A2-010)
   - `gemini-cli-capture.ts:286` — Remove write-only map and its `.set()` call

6. **DELETE unused exports** (CODEX1-006, CODEX3-009)
   - `core/quality-scorer.ts` — Remove unused `QualityScore` export
   - `core/tree-thinning.ts` — Remove unused `generateMergedDescription` export
   - `message-utils.ts` — Remove `extractKeyArtifacts()` (explicitly marked dead code but still exported)

7. **DELETE or fix dead `isChosen` parameter** (CODEX3-010)
   - `ascii-boxes.ts:134` — Either use `isChosen` to alter rendering or remove the parameter

8. **Complete snake_case alias cleanup** (OPUS4-009)
   - `folder-detector.ts` — Remove source exports for `detect_spec_folder`, `filter_archive_folders` (barrel already removed)
   - Verify no consumers depend on snake_case aliases

9. **Clean up renderer internal exports** (OPUS-A4-007)
   - `renderers/template-renderer.ts:220-222` — Make `cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy` private (barrel already removed)

10. **Remove `requireInteractiveMode` export** (OPUS-A4-016)
    - `utils/prompt-utils.ts:18` — Demote from `export function` to `function` (barrel already removed)

11. **Update stale README references** (OPUS-A4-011, OPUS-A4-015, OPUS3-010/011)
    - `evals/README.md` — Remove references to 4 deleted scripts
    - `lib/README.md` — Remove reference to `structure-aware-chunker.ts`
    - `ARCHITECTURE.md` — Verify `npx tsx scripts/evals/check-architecture-boundaries.ts` invocation still works
    - `extractors/README.md` — Update inventory to match barrel exports

**Quality Gate G-06:** Zero orphaned dist artifacts. All deleted source files have zero references. README file inventories match actual directory contents.

---

### Sprint S7: Test Coverage Gaps — Priority: LOW
**Theme:** Add missing tests, fix stale mocks, address fixture drift, improve assertion quality

**Findings:** CODEX-A4-006..009, CODEX5-005..009, OPUS4-007/008, CODEX-A4-007, CODEX-A3-014 (partial), CODEX-A1-008, CODEX-A1-009
**Files affected:** ~20
**Estimated LOC:** +500 / -100 (net +400)
**Risk:** L — New test code only; no production behavior changes.

**Tasks:**

1. **Add tests for untested memory modules** (CODEX-A4-008)
   - Add vitest coverage for `memory/ast-parser.ts`
   - Add vitest coverage for `memory/cleanup-orphaned-vectors.ts`
   - Add vitest coverage for `memory/rebuild-auto-entities.ts`
   - Add vitest coverage for `memory/reindex-embeddings.ts`

2. **Add tests for untested helpers** (CODEX-A4-009)
   - Add vitest coverage for `core/subfolder-utils.ts`
   - Add vitest coverage for `lib/cli-capture-shared.ts`
   - Add vitest coverage for `lib/frontmatter-migration.ts`
   - Add vitest coverage for `lib/memory-frontmatter.ts`
   - Add vitest coverage for `lib/topic-keywords.ts`
   - Add vitest coverage for `utils/fact-coercion.ts`
   - Add vitest coverage for `utils/memory-frontmatter.ts`

3. **Fix SessionData fixture drift** (CODEX-A4-006)
   - `tests/fixtures/session-data-factory.ts:14` — Add missing `TECHNICAL_CONTEXT` and `HAS_TECHNICAL_CONTEXT` fields

4. **Add architecture-boundary test cases** (CODEX-A4-007, CODEX5-009)
   - Add cases for package-prefix and absolute-path violations
   - Add parser cases for `export ... from`, `import type`, `require`
   - Add CLI smoke test for pass/fail exits

5. **Fix progressive-validation silent skips** (CODEX5-005)
   - Replace `if (!SCRIPT_EXISTS) return;` with explicit `test.skip()` or hard preconditions
   - Make JSON parse failure fail the contract test

6. **Fix progressive-validation timezone sensitivity** (CODEX5-006)
   - Inject fixed date env or derive expectation from same shell command

7. **Add `--session-id` test cases** (CODEX5-007)
   - Add recovery and JSON-mode cases with explicit `--session-id` and blank/whitespace normalization

8. **Add malformed transcript test cases** (CODEX5-008)
   - Add malformed JSON/JSONL fixtures for Codex and Gemini captures
   - Add orphaned prompt and `maxExchanges` trimming assertions

9. **Add memory-indexer runtime guards** (CODEX-A1-008)
   - `memory-indexer.ts:107` — Add `Array.isArray` normalization for trigger arrays
   - Add test cases for null/malformed trigger inputs

10. **Add config integer validation** (CODEX-A1-009)
    - `core/config.ts:125` — Enforce `Number.isInteger` for count/limit fields or round during load

**Quality Gate G-07:** Test coverage for previously-untested modules reaches at least smoke-test level. Zero silent test skips.

---

### Sprint S8: Extractor Parity & Quality Gates — Priority: LOW
**Theme:** Cross-provider consistency, quality-loop thresholds, contamination improvements

**Findings:** CODEX-A2-004..006, CODEX2-001..006, CODEX-A2-006, CODEX-A2-007, CODEX-A5-005, CODEX-A1-003, CODEX-A1-007, CODEX3-002, CODEX3-003, CODEX3-005, CODEX3-006, CODEX3-007, CODEX4-007, CODEX2-003, CODEX2-004
**Files affected:** ~20
**Estimated LOC:** +400 / -150 (net +250)
**Risk:** M — Behavioral changes to extraction and scoring affect memory quality.

**Tasks:**

1. **Standardize session targeting across providers** (CODEX-A2-004, CODEX-A2-005, CODEX2-001)
   - Add session-id parameter to Codex capture loader interface
   - Standardize provider-neutral session-target contract with exact id, optional time window, and explicit ambiguity errors
   - Add multi-session tests proving deterministic selection

2. **Thread structured JSON fields through pipeline** (CODEX-A2-001, CODEX-A2-002)
   - `input-normalizer.ts:433` — Persist canonical `sessionSummary`, `keyDecisions`, `nextSteps` on normalized data
   - Thread `toolCalls`/`exchanges` through normalization; prefer structured fields before text reconstruction

3. **Standardize transcript provenance metadata** (CODEX2-002)
   - Standardize all capture modules on `_sourceTranscriptPath` and `_sourceSession*`
   - Or broaden normalizer support for `eventsPath` and `sessionPath`

4. **Fix Copilot `view` tool classification** (CODEX2-003)
   - Add `View` to read-like tool aliases in `detectContextType()` and `detectProjectPhase()`

5. **Fix contamination filter regex gaps** (CODEX-A2-006)
   - Expand contamination patterns to cover `Read src/file.ts`, `Edit src/file.ts` forms

6. **Tighten overly-broad contamination denylist** (CODEX-A2-007)
   - Restrict "Let me check", "First, I'll", "Next, I'll" patterns to orchestration-only fields or add stronger anchors

7. **Add quality-loop minimum dimension floors** (CODEX-A5-005)
   - `quality-loop.ts:562` — Add per-dimension floors or hard-fail rules for zero trigger phrases and missing required anchors
   - Raise global threshold so structurally incomplete memories cannot pass

8. **Fix KEY_FILES built from wrong file list** (CODEX-A1-003)
   - `core/workflow.ts:1937` — Build key files from `effectiveFiles` (post-thinning) not `enhancedFiles` (pre-thinning)

9. **Fix memory-indexer mislabeled recency term** (CODEX-A1-007)
   - `core/memory-indexer.ts:143` — Derive recency from real timestamp or remove/rename the factor

10. **Fix anchor generator collision handling** (CODEX3-002)
    - `anchor-generator.ts:241` — Use `generateAnchorId(headingText, category, specNumber, sectionContext)` instead of bare semantic slug

11. **Fix data-validator malformed array pass-through** (CODEX3-003)
    - `data-validator.ts:59` — Coerce `PROS`/`CONS` entries into `{ PRO/CON: string }` and recompute flags

12. **Add ReDoS protection to content-filter** (CODEX3-005)
    - `content-filter.ts:113` — Validate patterns with safe-regex gate; reject risky constructs; cap input length

13. **Improve calculateSimilarity algorithm** (CODEX3-006)
    - `content-filter.ts:376` — Replace position-based character agreement with token-shingle/Jaccard or normalized edit distance

14. **Fix generateContentSlug generic-name bypass** (CODEX3-007)
    - `slug-utils.ts:262` — Run fallback through generic/contamination checks

15. **Fix `--stdin` TTY hang** (CODEX4-007)
    - `generate-context.ts:322` — Reject `--stdin` when `stdin.isTTY` with clear usage error

16. **Fix extractor barrel/doc parity** (CODEX2-005)
    - Document capture modules as intentionally private or export from barrel

17. **Fix spec-folder resolution root switching** (CODEX2-004)
    - Preserve winning specs root from first resolution step

**Quality Gate G-08:** Cross-CLI capture parity test passes for codex, copilot, gemini. Quality-loop rejects memories with zero triggers.

---

## Impact x Effort Matrix

Scoring: Impact 1-5 (5=critical), Effort 1-5 inverse (1=hard/weeks, 5=easy/minutes). Score = Impact x Effort.

| Finding ID | Category | Impact | Effort | Score | Sprint |
|------------|----------|--------|--------|-------|--------|
| OPUS4-001..005 | TEST_BREAKAGE | 5 | 4 | 20 | S1 |
| CODEX1-001 | BUILD_DRIFT | 5 | 5 | 25 | S1 |
| OPUS-A4-001..005 | BUILD_DRIFT | 5 | 5 | 25 | S1 |
| OPUS-A2-001 | STALE_REF | 5 | 4 | 20 | S1 |
| CODEX3-001 | DANGLING_IMPORT | 5 | 4 | 20 | S1 |
| OPUS-A4-008..010 | OPS_BREAKAGE | 5 | 4 | 20 | S1 |
| OPUS3-009 | DANGLING_REF | 5 | 5 | 25 | S1 |
| OPUS3-012/013 | STALE_ARTIFACT | 4 | 5 | 20 | S1 |
| CODEX-A1-010 | BUILD_DRIFT | 4 | 5 | 20 | S1 |
| CODEX-A5-002 | VALIDATION | 5 | 3 | 15 | S2 |
| CODEX-A5-003 | RACE_CONDITION | 5 | 2 | 10 | S2 |
| CODEX-A5-004 | DATA_LOSS | 5 | 2 | 10 | S2 |
| CODEX-A1-005 | RACE_CONDITION | 4 | 2 | 8 | S2 |
| CODEX-A5-001 | SILENT_FAILURE | 5 | 3 | 15 | S2 |
| CODEX-A1-001 | LOGIC_ERROR | 4 | 3 | 12 | S2 |
| CODEX-A1-002 | LOGIC_ERROR | 4 | 3 | 12 | S2 |
| CODEX-A1-004 | EDGE_CASE | 3 | 4 | 12 | S2 |
| CODEX4-001 | TOCTOU | 4 | 2 | 8 | S2 |
| CODEX4-002 | DATA_LOSS | 3 | 3 | 9 | S2 |
| CODEX3-004 | INPUT_EDGE | 3 | 4 | 12 | S2 |
| CODEX3-008 | TIME_HANDLING | 3 | 3 | 9 | S2 |
| CODEX4-003 | VALIDATION | 3 | 4 | 12 | S2 |
| CODEX4-006 | SILENT_FAIL | 3 | 3 | 9 | S2 |
| CODEX4-005 | SILENT_FAIL | 3 | 4 | 12 | S2 |
| CODEX-A3-001 | NAMING_COLLISION | 4 | 3 | 12 | S3 |
| CODEX-A3-002 | NAMING_COLLISION | 3 | 3 | 9 | S3 |
| CODEX-A3-003 | NAMING_COLLISION | 3 | 4 | 12 | S3 |
| CODEX-A3-004 | NAMING_COLLISION | 2 | 4 | 8 | S3 |
| OPUS5-002 | NAMING_COLLISION | 4 | 3 | 12 | S3 |
| OPUS5-003 | NAMING_COLLISION | 4 | 3 | 12 | S3 |
| OPUS5-001 | DUPLICATE | 4 | 4 | 16 | S3 |
| CODEX-A3-005 | INDEX_OVERUSE | 4 | 3 | 12 | S3 |
| CODEX-A3-006 | INDEX_OVERUSE | 4 | 2 | 8 | S3 |
| CODEX-A3-007 | INDEX_OVERUSE | 3 | 2 | 6 | S3 |
| CODEX-A3-008 | UNSAFE_CAST | 4 | 3 | 12 | S3 |
| CODEX-A3-009 | UNSAFE_CAST | 3 | 3 | 9 | S3 |
| CODEX-A3-010 | UNSAFE_CAST | 3 | 3 | 9 | S3 |
| CODEX-A3-011 | TYPE_SAFETY | 3 | 4 | 12 | S3 |
| CODEX-A3-012 | TYPE_SAFETY | 3 | 3 | 9 | S3 |
| CODEX-A3-013 | UNSAFE_CAST | 2 | 3 | 6 | S3 |
| CODEX-A1-006 | TYPE_SAFETY | 3 | 3 | 9 | S3 |
| OPUS5-009 | DUAL_SCORER | 4 | 3 | 12 | S3 |
| CODEX-A2-003 | TYPE_SAFETY | 3 | 4 | 12 | S3 |
| CODEX-A3-014 | TYPE_SAFETY | 2 | 3 | 6 | S3 |
| OPUS-A1-001 | CIRCULAR_DEP | 5 | 5 | 25 | S4 |
| OPUS-A1-002 | CIRCULAR_DEP | 5 | 5 | 25 | S4 |
| OPUS-A1-003 | CIRCULAR_DEP | 5 | 4 | 20 | S4 |
| OPUS-A1-004 | CIRCULAR_DEP | 4 | 5 | 20 | S4 |
| OPUS3-004 | LAYER_VIOLATION | 4 | 3 | 12 | S4 |
| OPUS3-005 | CIRCULAR_DEP | 4 | 3 | 12 | S4 |
| OPUS3-006 | LAYER_VIOLATION | 3 | 3 | 9 | S4 |
| OPUS-A1-007 | GOD_MODULE | 4 | 1 | 4 | S4 |
| OPUS-A1-008 | LAYER_VIOLATION | 3 | 4 | 12 | S4 |
| OPUS-A1-009 | LAYER_VIOLATION | 2 | 5 | 10 | S4 |
| OPUS-A1-005 | LAYER_VIOLATION | 3 | 4 | 12 | S4 |
| OPUS-A1-006 | LAYER_VIOLATION | 3 | 4 | 12 | S4 |
| OPUS-A5-001 | DUPLICATE | 5 | 2 | 10 | S4 |
| OPUS-A5-003 | DUPLICATE | 3 | 5 | 15 | S4 |
| OPUS-A5-004 | DUPLICATE | 3 | 5 | 15 | S4 |
| OPUS-A5-005 | DUPLICATE | 3 | 5 | 15 | S4 |
| OPUS-A5-006 | DUPLICATE | 2 | 3 | 6 | S4 |
| OPUS-A5-007 | NAMING_COLLISION | 3 | 5 | 15 | S4 |
| OPUS-A1-010 | COUPLING | 3 | 2 | 6 | S4 |
| OPUS-A1-013 | BARREL_GAP | 2 | 5 | 10 | S4 |
| OPUS-A1-015 | BARREL_GAP | 2 | 4 | 8 | S4 |
| OPUS3-014 | BARREL_GAP | 3 | 4 | 12 | S4 |
| OPUS-A3-004 | MISSING_FILE | 5 | 5 | 25 | S5 |
| OPUS-A3-001 | STATUS_MISMATCH | 4 | 4 | 16 | S5 |
| OPUS-A2-002..005 | ALIGNMENT | 4 | 5 | 20 | S5 |
| OPUS-A3-002 | DENOMINATOR | 3 | 5 | 15 | S5 |
| OPUS-A3-003 | DENOMINATOR | 3 | 5 | 15 | S5 |
| OPUS1-002..008 | DENOMINATOR | 3 | 4 | 12 | S5 |
| OPUS-A2-006 | COUNT_ERROR | 3 | 5 | 15 | S5 |
| OPUS-A2-009 | ALIGNMENT | 3 | 5 | 15 | S5 |
| OPUS2-001 | MISSING_ROW | 4 | 5 | 20 | S5 |
| OPUS1-015 | STALE_REF | 3 | 4 | 12 | S5 |
| OPUS2-003 | STALE_REF | 3 | 4 | 12 | S5 |
| OPUS-A2-008 | STALE_REF | 2 | 5 | 10 | S5 |
| OPUS-A2-011 | ALIGNMENT | 2 | 5 | 10 | S5 |
| OPUS-A2-012 | ALIGNMENT | 2 | 5 | 10 | S5 |
| OPUS-A2-013 | ALIGNMENT | 2 | 4 | 8 | S5 |
| OPUS-A2-014 | ALIGNMENT | 1 | 4 | 4 | S5 |
| OPUS-A2-015..018 | ALIGNMENT | 1 | 5 | 5 | S5 |
| OPUS-A3-005 | METADATA | 2 | 5 | 10 | S5 |
| OPUS-A3-006 | METADATA | 1 | 3 | 3 | S5 |
| OPUS-A3-008 | METADATA | 1 | 3 | 3 | S5 |
| OPUS-A3-009 | METADATA | 1 | 5 | 5 | S5 |
| OPUS1-001 | NUMBERING | 3 | 3 | 9 | S5 |
| OPUS1-003 | PREDECESSOR | 3 | 5 | 15 | S5 |
| OPUS1-020 | INCOMPLETE | 2 | 2 | 4 | S5 |
| OPUS2-005 | STATUS | 3 | 4 | 12 | S5 |
| OPUS2-006 | STALE_REF | 3 | 4 | 12 | S5 |
| OPUS2-008 | METADATA | 2 | 4 | 8 | S5 |
| OPUS2-009 | STALE_REF | 2 | 4 | 8 | S5 |
| OPUS2-012 | STALE_REF | 2 | 5 | 10 | S5 |
| CODEX-A2-009 | DEAD_CODE | 2 | 5 | 10 | S6 |
| CODEX-A2-010 | DEAD_CODE | 2 | 5 | 10 | S6 |
| CODEX1-006 | DEAD_CODE | 2 | 5 | 10 | S6 |
| CODEX3-009 | DEAD_CODE | 2 | 5 | 10 | S6 |
| CODEX3-010 | DEAD_PARAM | 2 | 4 | 8 | S6 |
| OPUS-A4-006 | ORPHANED_REF | 3 | 4 | 12 | S6 |
| OPUS-A4-007 | EXPORT_REMOVAL | 3 | 4 | 12 | S6 |
| OPUS-A4-011 | ORPHANED_REF | 2 | 4 | 8 | S6 |
| OPUS-A4-015 | ORPHANED_REF | 2 | 4 | 8 | S6 |
| OPUS-A4-016 | EXPORT_REMOVAL | 1 | 5 | 5 | S6 |
| OPUS4-009 | SNAKE_CASE | 2 | 4 | 8 | S6 |
| OPUS3-010/011 | STALE_README | 2 | 5 | 10 | S6 |
| CODEX5-002..004 | DEAD_SCRIPTS | 2 | 5 | 10 | S6 |
| CODEX-A4-001..005 | DEAD_REFERENCE | 3 | 4 | 12 | S7 |
| CODEX-A4-006 | FIXTURE_DRIFT | 3 | 3 | 9 | S7 |
| CODEX-A4-007 | COVERAGE_GAP | 3 | 3 | 9 | S7 |
| CODEX-A4-008 | MISSING_TEST | 3 | 2 | 6 | S7 |
| CODEX-A4-009 | MISSING_TEST | 2 | 2 | 4 | S7 |
| CODEX5-005 | SHALLOW_ASSERT | 3 | 3 | 9 | S7 |
| CODEX5-006 | STALE_FIXTURE | 2 | 4 | 8 | S7 |
| CODEX5-007 | MISSING_EDGE | 2 | 3 | 6 | S7 |
| CODEX5-008 | MISSING_EDGE | 2 | 2 | 4 | S7 |
| CODEX5-009 | MISSING_EDGE | 2 | 3 | 6 | S7 |
| CODEX-A1-008 | EDGE_CASE | 3 | 4 | 12 | S7 |
| CODEX-A1-009 | TYPE_SAFETY | 2 | 4 | 8 | S7 |
| CODEX-A2-004 | PARITY | 4 | 3 | 12 | S8 |
| CODEX-A2-005 | PARITY | 3 | 2 | 6 | S8 |
| CODEX-A2-006 | LOGIC_ERROR | 3 | 4 | 12 | S8 |
| CODEX-A2-007 | LOGIC_ERROR | 3 | 3 | 9 | S8 |
| CODEX-A5-005 | VALIDATION | 3 | 3 | 9 | S8 |
| CODEX-A1-003 | LOGIC_ERROR | 3 | 4 | 12 | S8 |
| CODEX-A1-007 | LOGIC_ERROR | 3 | 4 | 12 | S8 |
| CODEX3-002 | SLUG_COLLISION | 3 | 3 | 9 | S8 |
| CODEX3-003 | VALIDATION | 3 | 3 | 9 | S8 |
| CODEX3-005 | REDOS | 3 | 3 | 9 | S8 |
| CODEX3-006 | DEDUP_FALSE_POS | 3 | 2 | 6 | S8 |
| CODEX3-007 | SLUG_COLLISION | 2 | 4 | 8 | S8 |
| CODEX4-007 | UX | 2 | 4 | 8 | S8 |
| CODEX2-001 | PARITY | 4 | 2 | 8 | S8 |
| CODEX2-002 | PARITY | 3 | 3 | 9 | S8 |
| CODEX2-003 | PARITY | 3 | 4 | 12 | S8 |
| CODEX2-004 | EDGE_CASE | 3 | 3 | 9 | S8 |
| CODEX2-005 | BARREL | 2 | 4 | 8 | S8 |

---

## Deduplication Log

The following findings were identified as duplicates (same root cause reported by different agents) and merged into the primary finding:

| Duplicate | Primary | Rationale |
|-----------|---------|-----------|
| CODEX1-001 (JS drift) | CODEX-A1-010 (stale JS threshold) | Same tree-thinning drift issue |
| CODEX1-002 (dual scorer) | OPUS5-009 (dual scorer) + CODEX-A1-006 (scorer APIs) | Same dual-quality-scorer root cause |
| CODEX1-005 (stale .d.ts.map) | OPUS3-012/013 (orphaned artifacts) | Same stale artifact class |
| CODEX2-001 (session targeting) | CODEX-A2-004 (Codex session targeting) | Same session-targeting gap |
| CODEX2-006 (cli-capture duplication) | OPUS-A5-001 (cli-capture-shared unwired) | Same dead shared module |
| OPUS3-001 (utils->lib mem-frontmatter) | OPUS-A1-005 (layer violation) + OPUS-A5-003 (shim) | Same shim remediation |
| OPUS3-002 (utils->lib phase-classifier) | OPUS-A1-006 (layer violation) + OPUS-A5-004 (shim) | Same shim remediation |
| OPUS3-005 (extractors<->spec-folder) | OPUS-A1-003 (circular dep spec-folder->core) | Related circular dep |
| OPUS3-009 (heal-ledger refs deleted script) | CODEX5-001 (same) + OPUS-A4-010 (same) | Identical finding x3 |
| OPUS3-010/011 (READMEs ref deleted) | OPUS-A4-011/015 (same) + OPUS4-012/013 (same) | Identical finding x3 |
| OPUS3-012/013 (orphaned build artifacts) | OPUS-A4-013/014 (same) + OPUS4-014/015 (same) | Same artifact class |
| OPUS2-001 (phase map missing 019) | OPUS-A2-009 (same) + OPUS-A3-004 (same) | Identical finding x3 |
| OPUS2-005 (000 status contradiction) | OPUS-A2-007 (same) + OPUS-A3-007 (same) | Same root cause |
| OPUS2-006 (000 stale phase numbers) | OPUS-A2-008 (same reviewTargets) + OPUS-A2-011 (supersedes) | Same description.json |
| OPUS2-007 (019 missing from descriptions.json) | OPUS-A3-004 (same) | Identical finding |
| OPUS2-009 (000/001 stale denominator) | OPUS-A3-003 (same "of 3") | Same denominator drift |
| OPUS2-011 (missing status fields) | OPUS-A3-001 (same 15 files) | Identical systemic finding |
| OPUS4-001..005 (test-scripts-modules breakage) | CODEX-A4-001..005 (dead ref assertions) | Same test file, same root cause |
| OPUS4-006 (heal-ledger) | OPUS-A4-010 + CODEX5-001 | Triple-reported |
| OPUS4-007/008 (stale mocks) | CODEX-A4-006 (fixture drift) | Related test maintenance |
| OPUS5-002 (Observation collision) | CODEX-A3-002 (FileEntry collision) | Same naming-collision class |
| OPUS5-004 (ExchangeSummary collision) | CODEX-A3-004 (same) | Identical finding |
| CODEX-A2-008 (dual scorer again) | CODEX-A1-006 + OPUS5-009 | Triple-reported |
| CODEX1-004 (God function) | OPUS-A1-007 (God module) | Same workflow.ts decomposition |
| OPUS1-015 (parent refs 019/020) | OPUS2-003 (same) + OPUS2-004 (same) | Same stale references |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| S1 changes break additional tests | Run full test suite after each task; atomic commits per task |
| S2 race condition fixes introduce deadlocks | Use file-level locks with timeouts; test under concurrent load |
| S3 type renames cause import resolution failures | Run `tsc --noEmit` after each rename; use replace-all tooling |
| S4 barrel changes break external consumers | Check all import paths via architecture boundary eval before merge |
| S4 cli-capture-shared wiring introduces behavioral drift | Run provider-specific capture tests before and after wiring |
| S5 metadata changes confuse tooling | Validate all description.json files against schema after changes |
| S6 dead code deletion removes something still needed | Grep every export name across entire repo before deletion |

---

## Dependency Chain

```
S1 (Critical Fixes) ──────┐
                           ├──→ S2 (Data Integrity) ──→ S8 (Extractor Parity)
                           ├──→ S3 (Type System) ──→ S4 (Architecture) ──→ S6 (Dead Code)
                           │                                               ↓
                           ├──→ S5 (Spec/Metadata) [independent]         S7 (Tests)
                           │
                           └──→ S7 (Tests) [partially independent, starts after S1+S3]
```

S1 MUST complete first. After S1: S2, S3, and S5 can run in parallel. S4 depends on S3. S6 depends on S4. S7 can start after S1 and S3. S8 depends on S2.
