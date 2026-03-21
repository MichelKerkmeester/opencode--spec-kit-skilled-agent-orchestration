# Wave 2 - OPUS-A4: Git Diff Impact Analysis
Date: 2026-03-21

## Change Summary

| Metric | Count |
|--------|-------|
| Files modified | 293 |
| Files deleted (source) | 15 |
| Files added (untracked) | 22 |
| Lines inserted | +3,551 |
| Lines deleted | -7,647 |
| Net delta | -4,096 lines |

**Key pattern:** Large-scale internal refactoring that moves canonical implementations from `extractors/` and `utils/` into `lib/`, replaces originals with re-export shims, removes 4 dead eval scripts, removes stale source-tree build artifacts, narrows barrel exports, and moves quality types to `types/session-types.ts`.

---

## Deleted Files Inventory

### Category 1: Stale Source-Tree Build Artifacts (Safe Deletions)

These are `.js`, `.d.ts`, and `.map` files that existed alongside their `.ts` source in the source tree (NOT in `dist/`). The `.ts` source files remain intact.

| Deleted File | Source (.ts) Status |
|---|---|
| `scripts/core/tree-thinning.js` | Source exists, modified |
| `scripts/core/tree-thinning.d.ts` | Source exists, modified |
| `scripts/core/tree-thinning.js.map` | Source exists, modified |
| `scripts/core/tree-thinning.d.ts.map` | Source exists, modified |
| `scripts/evals/check-architecture-boundaries.js` | Source exists, unmodified |
| `scripts/evals/check-architecture-boundaries.d.ts` | Source exists, unmodified |
| `scripts/evals/check-architecture-boundaries.js.map` | Source exists, unmodified |
| `scripts/evals/check-architecture-boundaries.d.ts.map` | Source exists, unmodified |

**Verdict:** No impact. These were committed build artifacts that should have been in `dist/` or `.gitignore`. Removal is correct.

### Category 2: Deleted Eval Scripts (Intentional Removal)

| Deleted File | Purpose | References Updated? |
|---|---|---|
| `scripts/evals/run-chk210-quality-backfill.ts` | Quality metadata backfill | Yes -- allowlist entry removed from `import-policy-allowlist.json` |
| `scripts/evals/run-phase1-5-shadow-eval.ts` | Phase 1-5 shadow evaluation | Yes -- `heal-session-ambiguity.sh` now exits with deprecation error |
| `scripts/evals/run-phase3-telemetry-dashboard.ts` | Telemetry drift detection | Yes -- `heal-telemetry-drift.sh` now exits with deprecation error |
| `scripts/evals/run-quality-legacy-remediation.ts` | Legacy quality remediation | Yes -- `heal-ledger-mismatch.sh` step commented out with TODO |

### Category 3: Moved / Replaced Source Files

| Deleted File | Moved To | Re-export Shim? |
|---|---|---|
| `scripts/lib/structure-aware-chunker.ts` | `shared/lib/structure-aware-chunker.ts` | No shim in scripts/lib; importers use `@spec-kit/shared/lib/` |
| `scripts/memory/historical-memory-remediation.ts` | Fully removed (no replacement) | N/A |
| `scripts/tests/historical-memory-remediation.vitest.ts` | Fully removed (test for deleted module) | N/A |

---

## Deleted Exports Tracking

### Barrel Export Removals (from index.ts files)

#### `core/index.ts` -- 3 exports removed

| Export | Type | Still Available Via |
|---|---|---|
| `WorkflowConfig` (type) | type re-export | `config/index.ts` (new barrel) or direct `core/config.ts` |
| `SpecKitConfig` (type) | type re-export | `config/index.ts` (new barrel) or direct `core/config.ts` |
| `writeFilesAtomically` | function re-export | Direct import from `core/file-writer.ts` |
| `FindChildOptions` (type) | type re-export | Direct import from `core/subfolder-utils.ts` |

#### `extractors/index.ts` -- 8 exports removed

| Export | Type | Still Available Via |
|---|---|---|
| `opencode-capture` (star re-export) | module | Direct import from `extractors/opencode-capture.ts` |
| `claude-code-capture` (star re-export) | module | Direct import from `extractors/claude-code-capture.ts` |
| `codex-cli-capture` (star re-export) | module | Direct import from `extractors/codex-cli-capture.ts` |
| `copilot-cli-capture` (star re-export) | module | Direct import from `extractors/copilot-cli-capture.ts` |
| `gemini-cli-capture` (star re-export) | module | Direct import from `extractors/gemini-cli-capture.ts` |
| `has_implementation_work` (alias) | snake_case alias | Use `hasImplementationWork` from `implementation-guide-extractor.ts` |
| `extract_main_topic` (alias) | snake_case alias | Use `extractMainTopic` from `implementation-guide-extractor.ts` |
| `extract_what_built` (alias) | snake_case alias | Use `extractWhatBuilt` from `implementation-guide-extractor.ts` |

#### `renderers/index.ts` -- 3 exports removed

| Export | Type | Still Available Via |
|---|---|---|
| `cleanupExcessiveNewlines` | function | Internal to `template-renderer.ts` (still exported from source, removed from barrel) |
| `stripTemplateConfigComments` | function | Internal to `template-renderer.ts` (still exported from source, removed from barrel) |
| `isFalsy` | function | Internal to `template-renderer.ts` (still exported from source, removed from barrel) |

#### `spec-folder/index.ts` -- 6 exports removed (all snake_case aliases)

| Export | Type | Still Available Via |
|---|---|---|
| `detect_spec_folder` | snake_case alias | Use `detectSpecFolder` |
| `filter_archive_folders` | snake_case alias | Use `filterArchiveFolders` |
| `setup_context_directory` | snake_case alias | Use `setupContextDirectory` |
| `extract_observation_keywords` | snake_case alias | Use `extractObservationKeywords` |
| `validate_content_alignment` | snake_case alias | Use `validateContentAlignment` |
| `validate_telemetry_schema_docs_drift` | snake_case alias | Use `validateTelemetrySchemaDocsDrift` |

#### `utils/index.ts` -- 16 exports removed

| Export | Type | Still Available Via |
|---|---|---|
| `findNearestOpencodeDirectory` | function | Still exported from `utils/workspace-identity.ts` directly |
| `evaluateSpecAffinityText` | function | Still exported from `utils/spec-affinity.ts` directly |
| `matchesSpecAffinityFilePath` | function | Still exported from `utils/spec-affinity.ts` directly |
| `matchesSpecAffinityText` | function | Still exported from `utils/spec-affinity.ts` directly |
| `extractSpecIds` | function | Still exported from `utils/spec-affinity.ts` directly |
| `normalizePathLike` | function | Still exported from `utils/spec-affinity.ts` directly |
| `normalizeText` | function | Still exported from `utils/spec-affinity.ts` directly |
| `ARRAY_FLAG_MAPPINGS` | constant | Still exported from `utils/data-validator.ts` directly |
| `PRESENCE_FLAG_MAPPINGS` | constant | Still exported from `utils/data-validator.ts` directly |
| `ensureArrayOfObjects` | function | Still exported from `utils/data-validator.ts` directly |
| `hasArrayContent` | function | Still exported from `utils/data-validator.ts` directly |
| `requireInteractiveMode` | function | Still in `utils/prompt-utils.ts` (demoted to private) |
| `extractKeyArtifacts` | function | Removed entirely (deprecated) |
| `logAnchorValidation` | function | Still in `utils/validation-utils.ts` (demoted to private) |
| `TimestampFormat`, `ToolCall`, `Message`, `ExchangeSummary`, `FileArtifact`, `CommandArtifact`, `ErrorArtifact`, `KeyArtifacts` | types | Removed from barrel; types still in source for internal use |
| `GENERIC_MEMORY_DESCRIPTION`, `LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES`, etc. | functions/constants | Moved to `lib/memory-frontmatter.ts`; shim at `utils/memory-frontmatter.ts` preserves backward compat |

#### New Exports Added to `utils/index.ts`

| Export | Source |
|---|---|
| `normalizeMemoryNameCandidate`, `slugify`, `isContaminatedMemoryName`, `isGenericContentTask`, `pickBestContentName`, `ensureUniqueMemoryFilename`, `generateContentSlug` | `utils/slug-utils.ts` |
| `getSourceCapabilities`, `SourceInputMode`, `KnownDataSource`, `SourceCapabilities` | `utils/source-capabilities.ts` |
| `NormalizedUserPrompt`, `NormalizedFileEntry` | `utils/input-normalizer.ts` (new type exports) |

---

## Findings

### CRITICAL

FINDING-OPUS-A4-001 | CRITICAL | BUILD_DRIFT | `scripts/dist/evals/run-quality-legacy-remediation.{js,d.ts,js.map,d.ts.map}` | Stale dist artifacts remain for deleted source `run-quality-legacy-remediation.ts` -- full .js and .d.ts still present in dist/ | `ls dist/evals/run-quality-legacy-remediation.*` returns 4 files | Delete stale dist artifacts or rebuild

FINDING-OPUS-A4-002 | CRITICAL | BUILD_DRIFT | `scripts/dist/evals/run-chk210-quality-backfill.{js.map,d.ts.map}` | Partial stale dist artifacts remain (map files only) for deleted source | `ls dist/evals/run-chk210-quality-backfill.*` returns 2 map files | Delete stale dist artifacts

FINDING-OPUS-A4-003 | CRITICAL | BUILD_DRIFT | `scripts/dist/evals/run-phase1-5-shadow-eval.{js.map,d.ts.map}` | Partial stale dist artifacts remain (map files only) for deleted source | `ls dist/evals/run-phase1-5-shadow-eval.*` returns 2 map files | Delete stale dist artifacts

FINDING-OPUS-A4-004 | CRITICAL | BUILD_DRIFT | `scripts/dist/evals/run-phase3-telemetry-dashboard.{js.map,d.ts.map}` | Partial stale dist artifacts remain (map files only) for deleted source | `ls dist/evals/run-phase3-telemetry-dashboard.*` returns 2 map files | Delete stale dist artifacts

FINDING-OPUS-A4-005 | CRITICAL | BUILD_DRIFT | `scripts/dist/lib/structure-aware-chunker.{js,d.ts,js.map,d.ts.map}` | Stale dist artifacts remain in `scripts/dist/lib/` after source moved to `shared/lib/` -- callers resolving `@spec-kit/scripts/lib/structure-aware-chunker` via dist/ would get an outdated version | `ls dist/lib/structure-aware-chunker.*` returns 4 files | Delete stale dist artifacts; shared/ has its own build pipeline

### HIGH

FINDING-OPUS-A4-006 | HIGH | ORPHANED_REF | `scripts/tests/test-scripts-modules.js:1120-1177` | Test file imports `cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy` directly from `lib/content-filter` module but these were also removed from the `renderers/index.ts` barrel | Lines 1120-1122 destructure from content-filter; the functions still exist there so tests pass, but the test is testing renderer helpers imported from the wrong module | Verify intent: should test import from `renderers/template-renderer` (canonical location) or `lib/content-filter` (which does not export these)?

FINDING-OPUS-A4-007 | HIGH | EXPORT_REMOVAL | `renderers/index.ts` | Three functions (`cleanupExcessiveNewlines`, `stripTemplateConfigComments`, `isFalsy`) removed from barrel but still exported from `template-renderer.ts` (lines 220-222) -- the source file's trailing export block still lists them | `template-renderer.ts:220-222` contains `export { cleanupExcessiveNewlines, stripTemplateConfigComments, isFalsy }` | Either remove the source exports too (make private) or keep in barrel for consistency

FINDING-OPUS-A4-008 | HIGH | OPS_BREAKAGE | `scripts/ops/heal-session-ambiguity.sh:103-104` | Script now unconditionally exits with error ("Deprecated session-quality verifier was removed") making the entire ops remediation script non-functional | The script emits an error and `exit 1` instead of completing the remediation flow | Wire a replacement verification command or remove the script from the ops runbook

FINDING-OPUS-A4-009 | HIGH | OPS_BREAKAGE | `scripts/ops/heal-telemetry-drift.sh:97-98` | Script now unconditionally exits with error ("Deprecated telemetry drift runner was removed") making the entire ops remediation script non-functional | The script emits an error and `exit 1` instead of completing the remediation flow | Wire a replacement verification command or remove the script from the ops runbook

FINDING-OPUS-A4-010 | HIGH | OPS_BREAKAGE | `scripts/ops/heal-ledger-mismatch.sh:104-105` | Ledger consistency verification step commented out with TODO, meaning the repair flow completes without verification | The commented-out step `run-quality-legacy-remediation.js --check ledger-consistency` has no replacement | Wire a replacement ledger-consistency check

### MEDIUM

FINDING-OPUS-A4-011 | MEDIUM | ORPHANED_REF | `ARCHITECTURE.md:129,240,378` | Documentation still references `scripts/evals/check-architecture-boundaries.ts` in 3 locations including a runnable command example -- the .ts source still exists so this is accurate, but the deleted .js/.d.ts build artifacts are inconsistent with the documented `npx tsx` invocation pattern | `ARCHITECTURE.md` line 378: `npx tsx scripts/evals/check-architecture-boundaries.ts` | Verify the tsx invocation still works without source-tree .js artifacts; update if needed

FINDING-OPUS-A4-012 | MEDIUM | EXPORT_REMOVAL | `core/quality-scorer.ts:123-129` | `scoreMemoryQuality` in core is marked `@deprecated` but still exported and used by tests (`description-enrichment.vitest.ts`, `quality-scorer-calibration.vitest.ts`) | 20+ test calls to the deprecated function | Plan migration to extractors/quality-scorer.ts or accept the deprecated bridge

FINDING-OPUS-A4-013 | MEDIUM | BUILD_DRIFT | `scripts/dist/core/tree-thinning.{js,d.ts,js.map,d.ts.map}` | dist/ artifacts exist but source was modified (FileEntry -> ThinFileInput rename, type alias added) -- dist may be stale | `dist/core/tree-thinning.d.ts` may still reference old `FileEntry` without `ThinFileInput` | Rebuild dist/ to sync with source changes

FINDING-OPUS-A4-014 | MEDIUM | BUILD_DRIFT | `scripts/dist/core/index.{js,d.ts}` | dist/ barrel still exports the old set (including `WorkflowConfig`, `SpecKitConfig`, `writeFilesAtomically`, `FindChildOptions`) while source barrel was narrowed | dist/ was not rebuilt after source changes | Rebuild dist/ to sync with narrowed barrel

FINDING-OPUS-A4-015 | MEDIUM | ORPHANED_REF | `scripts/evals/README.md` | README references 5 deleted eval scripts in its file listing | README still documents `run-chk210-quality-backfill.ts`, `run-phase1-5-shadow-eval.ts`, `run-phase3-telemetry-dashboard.ts`, `run-quality-legacy-remediation.ts` | Update README to remove references to deleted scripts

### LOW

FINDING-OPUS-A4-016 | LOW | EXPORT_REMOVAL | `utils/index.ts` | `requireInteractiveMode` removed from barrel but still exported from `prompt-utils.ts` source | Function still defined and exported at `prompt-utils.ts:18` | Either remove the source export (make private with `function` only) or document why it was demoted

FINDING-OPUS-A4-017 | LOW | EXPORT_REMOVAL | `lib/anchor-generator.ts` | `generateSemanticSlug`, `generateShortHash`, `extractKeywords`, `STOP_WORDS`, `ACTION_VERBS` are used internally but test-scripts-modules.js previously tested them directly -- the test was updated to remove those assertions | Test diff shows removal of T-009b, T-009c, T-009f, T-009h, T-009i | Verify anchor-generator still exports these (it does) -- test coverage reduced but intentional

FINDING-OPUS-A4-018 | LOW | EXPORT_REMOVAL | `lib/content-filter.ts` | `getFilterStats`, `resetStats`, `generateContentHash`, `calculateSimilarity` still defined in source but removed from test coverage in test-scripts-modules.js | Functions at lines 327-391 of content-filter.ts | Reduced test coverage is intentional barrel-narrowing; functions remain available for internal use

---

## Summary of Risks

1. **Stale dist/ artifacts** (FINDING-001 through 005, 013-014) are the most widespread issue. A full `dist/` rebuild would resolve all of them. Until rebuilt, any runtime consumer loading from `dist/` could get stale code that references deleted modules or exports old type signatures.

2. **Ops scripts rendered non-functional** (FINDING-008 through 010) mean three operational remediation workflows (`heal-session-ambiguity`, `heal-telemetry-drift`, `heal-ledger-mismatch`) cannot complete successfully. These need replacement verification commands or should be removed from the ops runbook.

3. **Barrel narrowing** is consistent and well-executed -- all removed barrel exports remain available via direct imports. The test file (`test-scripts-modules.js`) was updated to match the narrowed surface. No breaking import-from-barrel references were found.

4. **Module relocations** (memory-frontmatter to lib/, session-activity-signal to lib/, validate-memory-quality to lib/, structure-aware-chunker to shared/lib/) all have proper re-export shims in the original locations, preventing breakage for existing importers.
