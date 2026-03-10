# Code Audit: 013 — Memory Quality and Indexing

**Auditor:** Claude Opus 4.6 (automated)
**Date:** 2026-03-10
**Phase:** 013-memory-quality-and-indexing
**Features audited:** 16 / 16
**Methodology:** Feature-centric read-only code review

---

## F-01: Verify-Fix-Verify Memory Quality Loop
- **Status:** WARN
- **Code Issues:**
  1. `scoreTokenBudget` (quality-loop.ts:174) hardcodes `DEFAULT_TOKEN_BUDGET` in the issue message instead of deriving from the `charBudget` parameter. If a custom `charBudget` is passed, the message will report the wrong budget value.
  2. `runQualityLoop` (quality-loop.ts:407-489) feature description says "third try runs with stricter trimming" but the code uses the same `attemptAutoFix` logic on every retry without any stricter trimming behavior. The auto-fix strategy is identical across all retries.
  3. `logQualityMetrics` (quality-loop.ts:505) uses `eval_run_id = 0` as a sentinel, but the `eval_metric_snapshots` table has no special handling for zero — this works but could conflict if eval runs start from 0.
  4. The feature description says "rejection rates are logged per spec folder" but `logQualityMetrics` does not include spec folder information in the metadata.
- **Standards Violations:**
  1. `isQualityLoopEnabled` function (line 43) reads `process.env` directly instead of using the centralized `search-flags.ts` feature flag registry.
- **Behavior Mismatch:** Feature says "third try runs with stricter trimming" but the code applies identical fixes on each retry. The auto-fix loop will break early if no fixes were applied (line 469), but there is no escalation to stricter trimming.
- **Test Gaps:** No test for the early-break when no fixes are applied. No test for per-spec-folder rejection rate logging (because the code does not implement it).
- **Playbook Coverage:** NEW-073+
- **Recommended Fixes:**
  1. Fix the token budget message to use the actual `charBudget` parameter.
  2. Add spec folder to the quality metrics log metadata.
  3. Route the feature flag through `search-flags.ts` for consistency.

---

## F-02: Signal Vocabulary Expansion
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — The code in `trigger-matcher.ts` (lines 316-408) correctly implements CORRECTION and PREFERENCE signal categories with the documented keywords and boost values (0.2 and 0.1 respectively). Signal detection is default-ON (line 490: only disabled when `SPECKIT_SIGNAL_VOCAB=false`), which matches "graduated" status.
- **Test Gaps:** NONE — The feature catalog lists 24 test files covering the broad set of shared modules. Trigger-matcher-specific tests exist.
- **Playbook Coverage:** NEW-074+
- **Recommended Fixes:** NONE

---

## F-03: Pre-flight Token Budget Validation
- **Status:** WARN
- **Code Issues:**
  1. `estimateTokens` (preflight.ts:457) accepts `unknown` type but only handles `string` — non-string, non-null objects get JSON.stringify'd which could be expensive for large nested structures. No size guard.
  2. `PREFLIGHT_CONFIG.charsPerToken` (line 187) uses 3.5 while quality-loop.ts uses 4.0 (`CHARS_PER_TOKEN`). Two different token estimation ratios exist in the codebase for the same purpose. This inconsistency could produce conflicting results.
- **Standards Violations:** NONE
- **Behavior Mismatch:** Feature description mentions "contextual tree headers" reducing usable budget by ~12 tokens per result (CHK-060), but `preflight.ts` has no header overhead deduction — the description may refer to the response-assembly layer, not preflight itself. Feature says "first 400 characters summary" for oversized single results, but preflight.ts does not implement summary fallback — this behavior likely lives in the response-assembly layer.
- **Test Gaps:** No test exercising `estimateTokens` with non-string input. No test for the `isChunkEligible` downgrade from error to warning.
- **Playbook Coverage:** NEW-075+
- **Recommended Fixes:**
  1. Harmonize token estimation ratios between preflight.ts (3.5) and quality-loop.ts (4.0), or document the intentional difference.
  2. Add a size guard on `estimateTokens` for non-string inputs.

---

## F-04: Spec Folder Description Discovery
- **Status:** PASS
- **Code Issues:**
  1. `loadPerFolderDescription` (folder-discovery.ts:654-696) performs extensive validation but uses `parsed.specId !== undefined` checks that allow `specId: null` to pass the type guard (since `null !== undefined`), though the subsequent `typeof parsed.specId !== 'string'` correctly catches `null`. This is correct but potentially confusing.
  2. `savePerFolderDescription` (folder-discovery.ts:709-732) uses `try/finally` but the `finally` block always tries to `unlinkSync` the temp file, even when `renameSync` succeeded. The `catch` on `unlinkSync` handles this gracefully but it is unnecessary work on the success path.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — Code correctly implements per-folder description.json with schema validation, path containment via `realpathSync`, atomic writes via temp files, and staleness detection.
- **Test Gaps:** NONE — 5 test files cover schema validation, CRUD, staleness, integration, slug uniqueness, and memory tracking.
- **Playbook Coverage:** NEW-076+
- **Recommended Fixes:** NONE — Issues are cosmetic.

---

## F-05: Pre-Storage Quality Gate
- **Status:** WARN
- **Code Issues:**
  1. `scoreContentQuality` (save-quality-gate.ts:463-513) computes `signalDensity` as a weighted average, but `totalWeight` is computed by summing weights that already sum to 1.0 (line 484: `0.25+0.20+0.20+0.15+0.20=1.0`). The division by `totalWeight` is correct but the guard `totalWeight > 0` is unnecessary given hardcoded non-zero weights. Not a bug, just dead code path.
  2. Feature description says "default ON" but the code comment on line 13 says "default OFF", and `isQualityGateEnabled` (line 221-223) checks `!== 'false'` which means it IS default ON (undefined !== 'false' is true). The code comment is stale/wrong; the actual behavior matches the feature description.
- **Standards Violations:**
  1. Stale comment on line 13 (`// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)`) contradicts actual default-ON behavior.
- **Behavior Mismatch:** NONE — The three-layer gate (structural, content quality, semantic dedup) matches the feature description. Thresholds (0.4 signal density, 0.92 dedup) match. Warn-only mode for 14 days matches.
- **Test Gaps:** No dedicated test for the `ensureActivationTimestampInitialized` lazy-load DB path (though the overall timestamp persistence is tested via `save-quality-gate.vitest.ts`).
- **Playbook Coverage:** NEW-077+
- **Recommended Fixes:**
  1. Fix stale comment on line 13 to say "default ON" to match actual behavior.

---

## F-06: Reconsolidation-on-Save
- **Status:** WARN
- **Code Issues:**
  1. `mergeContent` (reconsolidation.ts:274-296) uses line-level dedup via `Set` of trimmed lines. This means if existing content has `  const x = 1;` and new content has `const x = 1;` (different indentation), they are treated as different lines. This is intentional for code preservation but could cause content bloat for reformatted content.
  2. `reconsolidate` (reconsolidation.ts:441-551) in the `complement` case at line 536-541 does NOT call `storeMemory`, which is correct (caller handles persistence), but the feature description says "stores as a new complement" which could be misleading — the function returns a routing decision, not a persisted record.
  3. Feature description says "default ON" but `isReconsolidationEnabled` (line 125-127) requires explicit `SPECKIT_RECONSOLIDATION=true`. The code comment correctly says "defaults to OFF (opt-in)". The feature description is wrong.
- **Standards Violations:** NONE
- **Behavior Mismatch:** Feature description says "default ON" but the code defaults to OFF (requires explicit `true`). This is a documentation error, not a code bug.
- **Test Gaps:** No test for the `embeddingToBuffer` helper with a regular `number[]` input (only `Float32Array` tested indirectly). No test for the orphan cleanup in the conflict failure path (lines 506-529).
- **Playbook Coverage:** NEW-078+
- **Recommended Fixes:**
  1. Fix feature description: reconsolidation defaults to OFF, not ON.
  2. Add a test for the orphan cleanup transaction in the conflict error path.

---

## F-07: Smarter Memory Content Generation
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — The content normalizer implements exactly the 7 described primitives in sequence: strip YAML frontmatter, strip anchors, strip HTML comments, strip code fence markers, normalize tables, normalize lists, normalize headings. Both `normalizeContentForEmbedding()` and `normalizeContentForBM25()` are provided, with BM25 currently delegating to the same pipeline. Always active with no feature flag as described.
- **Test Gaps:** NONE — Dedicated `content-normalizer.vitest.ts` exists. Memory parser and quality extractor tests provide additional coverage.
- **Playbook Coverage:** NEW-079+
- **Recommended Fixes:** NONE

---

## F-08: Anchor-Aware Chunk Thinning
- **Status:** PASS
- **Code Issues:**
  1. `computeContentDensity` (chunk-thinning.ts:75) counts code blocks as `(content.match(/```/g) || []).length / 2` which will produce a fractional count for an odd number of backtick-triple occurrences. This is harmless since it only contributes to a bonus term.
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — Weights (anchor 0.6, density 0.4), threshold (0.3), content density scoring (HTML comment stripping, whitespace collapse, short chunk penalty, structure bonus), and the never-empty guarantee all match the feature description.
- **Test Gaps:** NONE — `chunk-thinning.vitest.ts` exists and covers scoring/thinning behavior.
- **Playbook Coverage:** NEW-080+
- **Recommended Fixes:** NONE

---

## F-09: Encoding-Intent Capture at Index Time
- **Status:** WARN
- **Code Issues:**
  1. Feature description says the flag is "default ON" but the code comment on line 14 says "opt-in, default off" (`SPECKIT_ENCODING_INTENT=true`). The actual flag check is in `search-flags.ts` (not in this file), so the default behavior depends on `search-flags.ts` implementation. The local comment is potentially stale.
- **Standards Violations:** NONE
- **Behavior Mismatch:** The code comment says "default off" while feature description says "default ON". The classification logic (threshold 0.4, code/structured_data/document) matches the description. The read-only metadata storage behavior matches.
- **Test Gaps:** NONE — `encoding-intent.vitest.ts` exists.
- **Playbook Coverage:** NEW-081+
- **Recommended Fixes:**
  1. Reconcile the default-on/off documentation between the feature description and the module comment.

---

## F-10: Auto Entity Extraction
- **Status:** WARN
- **Code Issues:**
  1. `entity-extractor.ts` imports from `'../search/entity-linker.js'` (line 9) using a `.js` extension. While this works with ESM-style TypeScript resolution, it diverges from the import style used in most other modules in the codebase which use extensionless imports.
  2. `filterEntities` (entity-extractor.ts:105-119) checks `entity.text.length <= 1` but the feature description says "single-character entities AND entities shorter than 2 characters" which is the same condition (length < 2 and length <= 1 are equivalent). Correct but redundant phrasing in the spec.
  3. Feature description says denylist has "64 combined stop words across three categories" with specific counts (29, 20, 15). Actual counts in `entity-denylist.ts`: COMMON_NOUNS has 29 entries, TECHNOLOGY_STOP_WORDS has 20, GENERIC_MODIFIERS has 15. Total = 64. Verified correct.
  4. `extraction-adapter.ts` imports `working-memory` from `'../cache/cognitive/working-memory'` (line 7) but the file exists at `../cognitive/working-memory.ts`. The import path includes `cache/cognitive/` which does not match the glob results. This could cause a runtime import error.
- **Standards Violations:**
  1. Mixed import extension styles (`.js` suffix in entity-extractor.ts, extensionless elsewhere).
- **Behavior Mismatch:** NONE — The 5 regex rules, denylist filtering, deduplication, `memory_entities` table storage with UNIQUE constraint, and `entity_catalog` with Unicode-aware normalization all match the description. The Sprint 8 consolidation (single `normalizeEntityName` in entity-linker.ts, imported by entity-extractor.ts) is correctly implemented.
- **Test Gaps:** No test verifying that `extraction-adapter.ts` correctly resolves the `working-memory` import at runtime. No test for `updateEntityCatalog` alias deduplication when the existing alias JSON is malformed.
- **Playbook Coverage:** NEW-082+
- **Recommended Fixes:**
  1. Verify the `extraction-adapter.ts` import path for `working-memory` is correct at build/runtime.
  2. Standardize import extension usage across entity extraction modules.

---

## F-11: Content-Aware Memory Filename Generation
- **Status:** WARN
- **Code Issues:**
  1. Feature description says the implementation file is `mcp_server/lib/parsing/slug-utils.ts` but no such file exists at that path. The actual file is at `scripts/utils/slug-utils.ts` (outside the mcp_server directory). The feature catalog has an incorrect source file path.
  2. The test file listed is `content-normalizer.vitest.ts` which tests content normalization, not slug generation. There is no dedicated `slug-utils.vitest.ts` in the `mcp_server/tests/` directory (the test files `slug-uniqueness.vitest.ts` and `slug-utils-boundary.vitest.ts` exist but are not listed in this feature's test table).
- **Standards Violations:** NONE in the actual code.
- **Behavior Mismatch:** The actual `slug-utils.ts` code matches the feature description: candidate precedence (task -> alternatives -> fallback -> hash), generic detection (`GENERIC_TASK_SLUGS` set with the listed terms), slug generation (lowercased, non-alphanum to hyphens, collapsed, truncated at word boundary to max 50 chars), minimum length 8 chars in `pickBestContentName`. The `ensureUniqueMemoryFilename` function appends `-1`, `-2`, etc. as described, with SHA1 hash fallback (not `crypto.randomBytes(6)` as the F-04 feature description says — this is a cross-feature documentation inconsistency; slug-utils uses SHA1 which is correct per the code).
- **Test Gaps:** The feature catalog lists the wrong test file (`content-normalizer.vitest.ts` instead of `slug-uniqueness.vitest.ts` and `slug-utils-boundary.vitest.ts`).
- **Playbook Coverage:** NEW-083+
- **Recommended Fixes:**
  1. Fix feature catalog source file path from `mcp_server/lib/parsing/slug-utils.ts` to `scripts/utils/slug-utils.ts`.
  2. Fix feature catalog test file reference to include `slug-uniqueness.vitest.ts` and `slug-utils-boundary.vitest.ts`.

---

## F-12: Generation-Time Duplicate and Empty Content Prevention
- **Status:** WARN
- **Code Issues:**
  1. Feature description says the implementation is in `scripts/core/file-writer.ts` with functions `validateContentSubstance` and `checkForDuplicateContent` running inside `writeFilesAtomically()`. The feature catalog lists `mcp_server/handlers/save/dedup.ts` as an implementation file but this file only contains index-time dedup (`checkExistingRow`, `checkContentHashDedup`), not generation-time file-writer validation. The actual generation-time gates are in the scripts layer, not in the MCP server.
  2. The `dedup.ts` handler-level dedup (lines 10-77) implements content hash dedup at index time, which complements but is distinct from the generation-time gates described in the feature. The feature description focuses on the `file-writer.ts` layer, not the index-time layer.
- **Standards Violations:** NONE in the code reviewed.
- **Behavior Mismatch:** The index-time dedup in `dedup.ts` works correctly (SHA-256 hash comparison, same spec folder scope). However, the feature-described generation-time gates (`validateContentSubstance`, `checkForDuplicateContent` in `file-writer.ts`) are in the scripts layer, not in the MCP server source tree listed in the feature catalog's Implementation table. The MCP-layer dedup works but is a different mechanism.
- **Test Gaps:** `content-hash-dedup.vitest.ts` exists for index-time dedup. No test visible for the generation-time `validateContentSubstance` in the MCP test directory (it likely lives in the scripts test suite).
- **Playbook Coverage:** NEW-084+
- **Recommended Fixes:**
  1. Update feature catalog to correctly distinguish index-time dedup (MCP server layer) from generation-time dedup (scripts/core/file-writer.ts layer) and list both.

---

## F-13: Entity Normalization Consolidation
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — `entity-extractor.ts` correctly imports `normalizeEntityName` and `computeEdgeDensity` from `entity-linker.ts` (line 9) and re-exports them (line 14). The canonical `normalizeEntityName` in `entity-linker.ts` (line 66-72) uses Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). The consolidation is complete.
- **Test Gaps:** NONE — `entity-extractor.vitest.ts` and `entity-scope.vitest.ts` exist.
- **Playbook Coverage:** NEW-085+
- **Recommended Fixes:** NONE

---

## F-14: Quality Gate Timer Persistence
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — `save-quality-gate.ts` implements SQLite persistence using the `config` table with key `quality_gate_activated_at`. `isWarnOnlyMode()` (lines 235-249) lazy-loads from DB when in-memory value is null. `setActivationTimestamp()` (lines 259-262) writes to both memory and DB. All DB operations are wrapped in try/catch for graceful fallback. `resetActivationTimestamp()` (lines 268-272) clears both memory and DB state. `ensureActivationTimestampInitialized()` (lines 280-289) avoids clobbering persisted state on restart.
- **Test Gaps:** NONE — `save-quality-gate.vitest.ts` exists with quality gate tests.
- **Playbook Coverage:** NEW-085+
- **Recommended Fixes:** NONE

---

## F-15: Deferred Lexical-Only Indexing
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — `index_memory_deferred` in `vector-index-mutations.ts` (lines 164-229) correctly inserts with `embedding_status='pending'` and `retry_count=0`. The function skips embedding dimension validation and `vec_memories` insertion. The record is searchable via BM25/FTS5 through the `memory_index` table (title, trigger_phrases, content_text columns). `embedding-pipeline.ts` (lines 20-71) implements the fallback: on embedding failure, the caller receives `status: 'pending'` with `failureReason`, enabling the deferred path. The `failure_reason` column is stored for diagnostics.
- **Test Gaps:** NONE — `vector-index-impl.vitest.ts`, `handler-memory-save.vitest.ts`, and `retry-manager.vitest.ts` exist.
- **Playbook Coverage:** NEW-111
- **Recommended Fixes:** NONE

---

## F-16: Dry-Run Preflight for Memory Save
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE — `memory-save.ts` (lines 287-382) implements the dry-run path: when `dryRun=true` is passed, the code runs the full preflight pipeline (`runPreflight` with `dry_run: true`), then returns immediately with a structured response including `would_pass`, validation errors/warnings, and details. The `runPreflight` function in `preflight.ts` (lines 722-725) sets `pass=true` in dry-run mode but populates `dry_run_would_pass` based on actual error count. The `dryRun` parameter is defined in `tool-input-schemas.ts` (referenced but not read) and `tool-schemas.ts`. The dry-run path shares the same validation code as the real save path, ensuring preview accuracy.
- **Test Gaps:** NONE — `preflight.vitest.ts` and `handler-memory-save.vitest.ts` exist.
- **Playbook Coverage:** NEW-085+
- **Recommended Fixes:** NONE

---

## Summary

| Feature | Status | Issues |
|---------|--------|--------|
| F-01: Verify-Fix-Verify Quality Loop | WARN | Stricter trimming not implemented; missing per-folder logging |
| F-02: Signal Vocabulary Expansion | PASS | Clean implementation |
| F-03: Pre-flight Token Budget Validation | WARN | Inconsistent chars-per-token ratios (3.5 vs 4.0) |
| F-04: Spec Folder Description Discovery | PASS | Robust implementation with full validation |
| F-05: Pre-Storage Quality Gate | WARN | Stale comment says default OFF, actual is default ON |
| F-06: Reconsolidation-on-Save | WARN | Feature description says default ON, code says OFF |
| F-07: Smarter Memory Content Generation | PASS | All 7 normalization primitives correct |
| F-08: Anchor-Aware Chunk Thinning | PASS | Weights, threshold, never-empty guarantee correct |
| F-09: Encoding-Intent Capture at Index Time | WARN | Stale comment about default-off vs feature says default-ON |
| F-10: Auto Entity Extraction | WARN | Import path concern in extraction-adapter.ts |
| F-11: Content-Aware Memory Filename Generation | WARN | Wrong source file path in feature catalog |
| F-12: Generation-Time Duplicate/Empty Prevention | WARN | Feature mixes scripts-layer and MCP-layer mechanisms |
| F-13: Entity Normalization Consolidation | PASS | Clean consolidation to single Unicode-aware function |
| F-14: Quality Gate Timer Persistence | PASS | Correct SQLite persistence with lazy-load |
| F-15: Deferred Lexical-Only Indexing | PASS | Clean deferred path with BM25 searchability |
| F-16: Dry-Run Preflight for Memory Save | PASS | Shares validation code with real save path |

**Totals:** 9 PASS, 7 WARN, 0 FAIL

### Cross-Cutting Observations

1. **Token estimation inconsistency:** `preflight.ts` uses 3.5 chars/token while `quality-loop.ts` uses 4.0 chars/token. Both estimate token counts but will produce different results for the same content.
2. **Feature flag routing:** Some modules check `process.env` directly (quality-loop.ts, encoding-intent.ts) while most use the centralized `search-flags.ts` registry. This creates maintenance risk.
3. **Feature description accuracy:** Three features (F-01, F-06, F-09) have documentation that does not match code defaults. These are documentation bugs, not code bugs.
4. **Feature catalog file path errors:** F-11 lists a non-existent source file path (`mcp_server/lib/parsing/slug-utils.ts` instead of `scripts/utils/slug-utils.ts`).
