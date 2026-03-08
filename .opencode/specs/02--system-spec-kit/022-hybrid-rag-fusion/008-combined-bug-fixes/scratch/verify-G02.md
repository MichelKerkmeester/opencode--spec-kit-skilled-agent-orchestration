## Agent G02: Import Consistency -- Core/Utils/Loaders Barrels

**Date:** 2026-03-08
**Scope:** `scripts/core/index.ts`, `scripts/utils/index.ts`, `scripts/loaders/index.ts`
**Base path:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit`
**Confidence:** HIGH -- all barrel files and source modules read, all consumers audited

---

### Summary

All three barrel files are consistent with their source modules and with downstream consumers. No "is not exported" errors will occur at compile time for any import through these barrels. One intentional exclusion (`workflow.ts` and `quality-scorer.ts` from the core barrel) is documented and all consumers already use direct imports for those modules. **Verdict: PASS**.

---

### Core Barrel Audit (`scripts/core/index.ts`)

**Barrel re-exports from 3 modules:**

| Source Module | Exported Values | Exported Types | Status |
|---|---|---|---|
| `config.ts` | `CONFIG`, `getSpecsDirectories`, `findActiveSpecsDir`, `getAllExistingSpecsDirs` | `WorkflowConfig`, `SpecKitConfig` | MATCH |
| `file-writer.ts` | `writeFilesAtomically` | (none) | MATCH |
| `subfolder-utils.ts` | `SPEC_FOLDER_PATTERN`, `SPEC_FOLDER_BASIC_PATTERN`, `CATEGORY_FOLDER_PATTERN`, `SEARCH_MAX_DEPTH`, `findChildFolderSync`, `findChildFolderAsync`, `getPhaseFolderRejectionSync` | `PhaseFolderRejection`, `FindChildOptions` | MATCH |

**Intentionally excluded:**

| Module | Reason | Comment in barrel |
|---|---|---|
| `workflow.ts` | Circular dependency avoidance | Line 7-8: "workflow.ts not exported here to avoid circular dependencies" |
| `quality-scorer.ts` | Not re-exported | Consumers import directly (`../core/quality-scorer`) |

**Consumer verification (all imports via `'../core'`):**

| Consumer | Symbols Imported | All in barrel? |
|---|---|---|
| `loaders/data-loader.ts:12` | `CONFIG` | YES |
| `extractors/collect-session-data.ts:10` | `CONFIG`, `findActiveSpecsDir`, `getSpecsDirectories` | YES |
| `extractors/file-extractor.ts:6` | `CONFIG` | YES |
| `extractors/spec-folder-extractor.ts:9` | `CONFIG` | YES |
| `extractors/conversation-extractor.ts:6` | `CONFIG` | YES |
| `extractors/opencode-capture.ts:10` | `CONFIG` | YES |
| `extractors/session-extractor.ts:13` | `CONFIG` | YES |
| `memory/generate-context.ts:11-20` | `CONFIG`, `findActiveSpecsDir`, `getSpecsDirectories`, `SPEC_FOLDER_PATTERN`, `SPEC_FOLDER_BASIC_PATTERN`, `CATEGORY_FOLDER_PATTERN`, `findChildFolderSync`, `getPhaseFolderRejectionSync` | YES |
| `spec-folder/folder-detector.ts:16` | `CONFIG`, `findActiveSpecsDir`, `getAllExistingSpecsDirs`, `SPEC_FOLDER_PATTERN`, `findChildFolderAsync` | YES |
| `spec-folder/index.ts:20` | `getPhaseFolderRejectionSync` | YES |
| `spec-folder/directory-setup.ts:12` | `CONFIG`, `findActiveSpecsDir`, `getSpecsDirectories`, `SPEC_FOLDER_PATTERN` | YES |
| `renderers/template-renderer.ts:10` | `CONFIG` | YES |
| `lib/semantic-summarizer.ts:11` | `CONFIG` | YES |
| `utils/message-utils.ts:8` | `CONFIG` | YES |

**Direct imports (bypassing barrel -- intentional):**

| Consumer | Direct import path | Symbol |
|---|---|---|
| `core/workflow.ts:12` | `'./config'` | `CONFIG`, `findActiveSpecsDir`, `getSpecsDirectories` |
| `core/workflow.ts:22` | `'./quality-scorer'` | `scoreMemoryQuality` |
| `core/workflow.ts:25` | `'./file-writer'` | `writeFilesAtomically` |
| `memory/generate-context.ts:21` | `'../core/workflow'` | `runWorkflow` |

These direct imports are correct: `workflow.ts` is intentionally excluded from the barrel, and sibling modules within `core/` use relative paths.

---

### Utils Barrel Audit (`scripts/utils/index.ts`)

**Barrel re-exports from 8 modules:**

| Source Module | Exported Values | Exported Types | Status |
|---|---|---|---|
| `logger.ts` | `structuredLog` | `LogLevel`, `LogEntry` | MATCH |
| `path-utils.ts` | `sanitizePath`, `getPathBasename` | (none) | MATCH |
| `data-validator.ts` | `ARRAY_FLAG_MAPPINGS`, `PRESENCE_FLAG_MAPPINGS`, `ensureArrayOfObjects`, `hasArrayContent`, `validateDataStructure` | `ValidatedData` | MATCH |
| `input-normalizer.ts` | `transformKeyDecision`, `buildSessionSummaryObservation`, `buildTechnicalContextObservation`, `normalizeInputData`, `validateInputData`, `transformOpencodeCapture`, `transformOpenCodeCapture` | `Observation`, `UserPrompt`, `RecentContext`, `FileEntry`, `RawInputData`, `DecisionItemObject`, `NormalizedData`, `CaptureExchange`, `CaptureToolCall`, `OpencodeCapture`, `TransformedCapture` | MATCH |
| `prompt-utils.ts` | `requireInteractiveMode`, `promptUser`, `promptUserChoice` | (none) | MATCH |
| `file-helpers.ts` | `toRelativePath`, `isDescriptionValid`, `cleanDescription` | (none) | MATCH |
| `tool-detection.ts` | `detectToolCall`, `isProseContext`, `classifyConversationPhase` | `ToolUsage`, `ToolConfidence`, `ToolCallRecord`, `ConversationPhase` | MATCH |
| `message-utils.ts` | `formatTimestamp`, `truncateToolOutput`, `summarizeExchange`, `extractKeyArtifacts` | `TimestampFormat`, `ToolCall`, `Message`, `ExchangeSummary`, `FileArtifact`, `CommandArtifact`, `ErrorArtifact`, `KeyArtifacts` | MATCH |
| `validation-utils.ts` | `validateNoLeakedPlaceholders`, `validateAnchors`, `logAnchorValidation` | (none) | MATCH |

**Consumer verification (imports via `'../utils'`):**

| Consumer | Symbols Imported | All in barrel? |
|---|---|---|
| `loaders/data-loader.ts:13` | `structuredLog`, `sanitizePath` | YES |
| `spec-folder/directory-setup.ts:11` | `structuredLog`, `sanitizePath` | YES |
| `core/memory-indexer.ts:11` | `structuredLog` | YES |

**Note:** `data-loader.ts` also imports directly from `'../utils/input-normalizer'` (lines 15-20) rather than through the barrel. This is valid since those symbols ARE available in the barrel, but the direct import is acceptable and avoids pulling the entire utils barrel.

**DataSource type note:** `input-normalizer.ts` exports `DataSource` as a type, which is re-exported by the utils barrel. However, `data-loader.ts` also re-exports `DataSource` independently via `export type { DataSource }` (line 27). The loaders barrel then re-exports it from data-loader. This creates two export paths for the same type (`'../utils'` and `'../loaders'`), which is harmless but worth noting.

---

### Loaders Barrel Audit (`scripts/loaders/index.ts`)

**Barrel re-exports from 1 module:**

| Source Module | Exported Values | Exported Types | Status |
|---|---|---|---|
| `data-loader.ts` | `loadCollectedData` | `DataSource`, `LoadedData` | MATCH |

**Consumer verification (imports via `'../loaders'`):**

| Consumer | Symbols Imported | All in barrel? |
|---|---|---|
| `memory/generate-context.ts:22` | `loadCollectedData` | YES |

---

### Findings [P0/P1/P2/P3]

**P0 (BLOCKER): None**

**P1 (REQUIRED): None**

**P2 (SUGGESTION):**

1. **[P2] `quality-scorer.ts` not in core barrel** -- `scripts/core/quality-scorer.ts` exports `scoreMemoryQuality` and `QualityScore`, but the core barrel does not re-export them. The sole consumer (`workflow.ts`) imports directly via `'./quality-scorer'`, which works. However, external consumers would need to know the direct path. This appears intentional (same pattern as `workflow.ts` exclusion) but is undocumented in the barrel comments.
   - File: `scripts/core/index.ts`
   - Impact: Low. No current consumer is broken.
   - Suggestion: Add a comment to `core/index.ts` noting that `quality-scorer.ts` is also intentionally excluded, similar to the `workflow.ts` comment.

2. **[P2] Dual `DataSource` re-export paths** -- `DataSource` type is available through both `'../utils'` (via `input-normalizer.ts`) and `'../loaders'` (via `data-loader.ts` re-export). This is not a bug but could confuse contributors about the canonical import path.
   - File: `scripts/loaders/data-loader.ts:27`, `scripts/utils/index.ts:42`
   - Impact: None (TypeScript resolves both to the same type).
   - Suggestion: Document that `DataSource` canonical source is `utils/input-normalizer`.

**P3 (NOTE):**

1. **[P3] `SEARCH_MAX_DEPTH` exported but unused externally** -- `SEARCH_MAX_DEPTH` is exported through the core barrel but no consumer imports it via the barrel. It is only used internally within `subfolder-utils.ts`. This is harmless public API surface.

---

### Verdict

**PASS** -- All three barrels are internally consistent and complete for their consumers.

- 0 P0 blockers
- 0 P1 required fixes
- 2 P2 suggestions (documentation improvements)
- 1 P3 note (unused barrel export)

Every symbol imported via `'../core'`, `'../utils'`, or `'../loaders'` by any consumer in the codebase is present in the corresponding barrel file. No "is not exported" compile errors will occur. The intentional `workflow.ts` exclusion from the core barrel (to avoid circular dependencies) is documented and all consumers correctly use direct imports for that module.
