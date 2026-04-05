# Iteration 008 — Completeness: Test Coverage

## P0
None.

## P1

### 1. `validate-memory-quality` still lacks coverage for the new `filePath`-dependent regression paths
- **File/line:** `scripts/lib/validate-memory-quality.ts:624-638`, `scripts/lib/validate-memory-quality.ts:818-871`, `scripts/tests/validate-memory-quality.vitest.ts:5-43`, `scripts/tests/validation-v13-v14-v12.vitest.ts:207-249`
- **Evidence:** The production validator now derives `specFolder` from `options.filePath` when frontmatter omits `spec_folder` (`624-638`) and skips V12 topical-coherence checks for `*/memory/*` and spec-doc paths based on `filePath` (`818-871`). The dedicated validator tests only cover YAML parsing (`validate-memory-quality.vitest.ts:5-43`) or V12 path normalization via `spec_folder` values passed in content, with every call using `validateMemoryQualityContent(content)` and no `{ filePath }` argument (`validation-v13-v14-v12.vitest.ts:217`, `231`, `245`).
- **Impact:** The exact reindex/save path that motivated these fixes can regress without a failing test: bulk reindex of older files lacking `spec_folder`, and file-path-based V12 skip behavior for memory/spec docs.
- **Recommendation:** Add unit tests that call `validateMemoryQualityContent(content, { filePath })` for: (a) empty/missing `spec_folder` with path fallback, (b) `.../memory/...` path skipping V12, and (c) `spec.md`/`plan.md`/`decision-record.md` skip behavior.

### 2. `memory-parser` coverage is stale and still asserts the pre-migration context map
- **File/line:** `mcp_server/lib/parsing/memory-parser.ts:108-124`, `mcp_server/tests/memory-parser-extended.vitest.ts:213-234`
- **Evidence:** The implementation now migrates legacy context types so `decision -> planning` and `discovery -> general` (`108-124`). The extended parser tests still assert the old model: canonical values include `decision`/`discovery`, aliases expect `planning -> decision` and `bug -> discovery`, and the valid-type set excludes the new migrated outputs (`213-234`).
- **Impact:** The changed mapping is not protected by tests; worse, the current suite codifies the obsolete behavior, so it either already fails or pressures future changes back toward the legacy contract.
- **Recommendation:** Rewrite the `CONTEXT_TYPE_MAP` assertions to validate the migrated contract (`decision -> planning`, `discovery -> general`, `architecture -> planning`, `bug -> implementation/general as implemented`) and the updated canonical output set.

### 3. `frontmatter-migration` has no focused tests for the new defaults/alias override, and template parity is unchecked
- **File/line:** `scripts/lib/frontmatter-migration.ts:135-147`, `scripts/lib/frontmatter-migration.ts:824-845`, `scripts/lib/frontmatter-migration.ts:1026-1046`, `scripts/tests/backfill-frontmatter.vitest.ts:34-104`, `templates/level_2/plan.md:1-12`, `templates/level_3/decision-record.md:1-12`
- **Evidence:** The migration logic now defaults `plan` and `decision_record` to `planning` (`135-147`), normalizes legacy `decision` to `planning` (`824-845`), and explicitly overrides legacy `decision` frontmatter on spec docs with the document default (`1026-1046`). The checked-in frontmatter suite `backfill-frontmatter.vitest.ts` only exercises unreadable-directory traversal (`34-104`), not `buildManagedFrontmatter` / `inferContextType`. Meanwhile, the shipped templates for `plan.md` and `decision-record.md` still declare `contextType: "general"` (`templates/level_2/plan.md:1-12`, `templates/level_3/decision-record.md:1-12`).
- **Impact:** Drift between migration code and template defaults can survive unnoticed: backfilled docs may normalize to `planning` while newly created docs still start as `general`.
- **Recommendation:** Add table-driven tests for `buildManagedFrontmatter()` covering `plan.md`, `decision-record.md`, and legacy `contextType: decision` inputs, plus a template-parity test that verifies template frontmatter matches `DOC_DEFAULT_CONTEXT` for each spec-doc type.

### 4. There is still no end-to-end save→validate→index test for empty `spec_folder` with stored context-type verification
- **File/line:** `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:62-118`, `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:350-362`, `mcp_server/tests/integration-138-pipeline.vitest.ts:103-111`
- **Evidence:** The save-pipeline fixture builds a memory document without `spec_folder`, but hard-codes `contextType = 'implementation'` and never inspects the persisted DB row (`62-118`). Its golden-path test only asserts that indexing does not reject and returns an id/status (`350-362`). The other pipeline integration fixture that mentions `spec_folder: ''` is a search/MMR fallback test, not a save/validate/index flow (`integration-138-pipeline.vitest.ts:103-111`).
- **Impact:** The cross-component path called out in this review prompt — save a file with empty `spec_folder`, let validation recover via path, index it, and verify the stored `context_type` — is currently untested end-to-end.
- **Recommendation:** Add one integration test that writes a spec doc or memory file with empty/missing `spec_folder`, runs the real save/index path, and asserts both acceptance and the final `memory_index.context_type` value in SQLite.

## P2

### 1. `session-extractor` does not directly test auto-detection of `planning`
- **File/line:** `scripts/extractors/session-extractor.ts:120-135`, `scripts/extractors/session-extractor.ts:589-612`, `scripts/tests/project-phase-e2e.vitest.ts:193-219`
- **Evidence:** The implementation returns `planning` whenever `decisionCount > 0` before the zero-tool early return (`120-135`), and `detectSessionCharacteristics()` uses that branch when no explicit context type is supplied (`589-612`). The existing test only verifies explicit context-type passthrough, including `'planning'`, by passing `explicitContextType` directly (`project-phase-e2e.vitest.ts:193-219`).
- **Impact:** A regression in the auto-detection branch could slip through while explicit-override behavior remains green.
- **Recommendation:** Add a test that calls `detectSessionCharacteristics()` without an explicit context type, includes at least one `decision` observation, and asserts `contextType === 'planning'` and `importanceTier === 'important'`.

### 2. The schema-only test updates do not prove `planning` acceptance or invalid-value rejection
- **File/line:** `mcp_server/tests/incremental-index-v2.vitest.ts:22-80`, `mcp_server/tests/safety.vitest.ts:86-149`
- **Evidence:** Both test DB schemas were updated so `context_type` allows `planning` (`incremental-index-v2.vitest.ts:22-67`, `safety.vitest.ts:86-130`), but their row helpers do not even accept a `context_type` parameter (`incremental-index-v2.vitest.ts:69-89`, `safety.vitest.ts:133-149`). No subsequent assertions insert `planning`, reject an invalid context type, or exercise legacy-row compatibility.
- **Impact:** These suites only mirror the schema text; they do not verify that the intended accepted/rejected values behave correctly under test.
- **Recommendation:** Add one insert test proving `context_type='planning'` succeeds, one proving an invalid value fails the CHECK constraint, and one compatibility test documenting whether legacy `decision`/`discovery` rows are still accepted or must be migrated.
