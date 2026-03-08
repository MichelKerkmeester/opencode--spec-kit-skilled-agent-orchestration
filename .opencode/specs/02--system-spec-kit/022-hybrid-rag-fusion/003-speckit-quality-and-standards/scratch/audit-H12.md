# Audit H-12: scripts/core/ + scripts/lib/

**Scope:** 21 files in scripts/core/ (9) and scripts/lib/ (12)
**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6 (leaf agent)

## Per-File Results

### scripts/core/

| File | P0 | P1 | Issues |
|------|----|----|--------|
| config.ts | PASS (header 4-line variant: has description line) | FAIL: missing TSDoc on `getSpecsDirectories`, `findActiveSpecsDir`, `getAllExistingSpecsDirs` | 3 |
| topic-extractor.ts | PASS (header 4-line variant: has description line) | FAIL: missing TSDoc on `extractKeyTopics` | 1 |
| quality-scorer.ts | PASS | PASS | 0 |
| tree-thinning.ts | PASS | PASS | 0 |
| index.ts | PASS | PASS (barrel file, no logic) | 0 |
| subfolder-utils.ts | P0-FAIL: header has 4th line "CORE: SUBFOLDER UTILS" breaking 3-line format | FAIL: missing TSDoc on `getPhaseFolderRejectionSync` | 2 |
| file-writer.ts | PASS | FAIL: missing TSDoc on `writeFilesAtomically` | 1 |
| workflow.ts | PASS (header 4-line variant) | FAIL: missing TSDoc on `runWorkflow`; `as` casts on extractor calls (lines 503-521); bare `catch` on line 348, 856 without `unknown` type annotation | 4 |
| memory-indexer.ts | PASS | FAIL: missing TSDoc on `indexMemory`, `updateMetadataWithEmbedding` | 2 |

### scripts/lib/

| File | P0 | P1 | Issues |
|------|----|----|--------|
| trigger-extractor.ts | PASS | PASS (re-export shim, no logic) | 0 |
| embeddings.ts | PASS | PASS (re-export shim, no logic) | 0 |
| ascii-boxes.ts | PASS | FAIL: missing TSDoc on all 6 exported functions (`padText`, `formatDecisionHeader`, `formatOptionBox`, `formatChosenBox`, `formatCaveatsBox`, `formatFollowUpBox`); `[key: string]: unknown` on OptionRecord/CaveatRecord/FollowUpRecord/EvidenceRecord is P1-ok (index signatures are acceptable) | 6 |
| simulation-factory.ts | P0-FAIL: `[key: string]: unknown` on `SessionConfig`, `CollectedData`, `SimulationMetadata` uses index signatures (acceptable but noted); | FAIL: missing TSDoc on all 12 exported functions (`createSessionData`, `createConversationData`, `createDecisionData`, `createDiagramData`, `createSimulationPhases`, `createSimulationFlowchart`, `createFullSimulation`, `requiresSimulation`, `formatTimestamp`, `generateSessionId`, `addSimulationWarning`, `markAsSimulated`) | 12 |
| semantic-summarizer.ts | P0-PASS; `[key: string]: unknown` on `SemanticMessage` and `SemanticObservation` (index signatures) | FAIL: missing TSDoc on `classifyMessage`, `classifyMessages`, `extractFileChanges`, `extractDecisions`, `generateImplementationSummary`, `formatSummaryAsMarkdown`; `isDescriptionValid` not exported so exempt | 6 |
| decision-tree-generator.ts | P0-FAIL: uses `require()` for ascii-boxes (line 35) instead of import; `[key: string]: unknown` on DecisionNode; `...args: unknown[]` rest param on `generateDecisionTree` | FAIL: missing TSDoc on `generateDecisionTree`; `require()` usage bypasses module system | 3 |
| content-filter.ts | PASS | FAIL: missing TSDoc on `createFilterPipeline`, `filterContent`, `isNoiseContent`, `stripNoiseWrappers`, `meetsMinimumRequirements`, `generateContentHash`, `calculateSimilarity`, `calculateQualityScore`; bare `catch` without `unknown` on line 38 (in `checkForDuplicateContent` callback, but that's file-writer not here) | 8 |
| anchor-generator.ts | PASS | FAIL: missing TSDoc on `generateAnchorId`, `categorizeSection`, `validateAnchorUniqueness`, `extractKeywords`, `slugify`, `extractSpecNumber`, `getCurrentDate`, `wrapSectionsWithAnchors` (some internal functions have JSDoc, exported ones partially) | 5 |
| structure-aware-chunker.ts | PASS | PASS: TSDoc present on `splitIntoBlocks` and `chunkMarkdown` | 0 |
| flowchart-generator.ts | PASS | FAIL: missing TSDoc on `generateConversationFlowchart`, `generateWorkflowFlowchart`, `detectWorkflowPattern`, `classifyDiagramPattern`, `buildPhaseDetails`, `extractFlowchartFeatures`, `getPatternUseCases` | 7 |
| topic-keywords.ts | P0-FAIL: header uses `// --- MODULE: Topic Keywords ---` format instead of 3-line block | FAIL: missing TSDoc on all 3 exported functions (`tokenizeTopicWords`, `createValidShortTerms`, `shouldIncludeTopicWord`) | 4 |
| frontmatter-migration.ts | PASS | FAIL: missing TSDoc on `buildFrontmatterContent`, `classifyDocument`, `buildManagedFrontmatter`, `detectFrontmatter`, `parseFrontmatterSections`, `parseSectionValue`; many internal functions lack docs but are not exported | 6 |

## Detailed P0 Findings

### P0-1: File Header Format (3-line block required)

**Standard:** `// ---------------------------------------------------------------\n// MODULE: [Name]\n// ---------------------------------------------------------------`

| File | Status | Actual |
|------|--------|--------|
| subfolder-utils.ts | FAIL | Has 4th line "CORE: SUBFOLDER UTILS" |
| topic-keywords.ts | FAIL | Uses `// --- MODULE: Topic Keywords ---` single-line format |
| config.ts | WARN | 4 lines (has description line after MODULE) |
| topic-extractor.ts | WARN | 4 lines (has description line after MODULE) |
| tree-thinning.ts | WARN | 8 lines (multi-line description) |
| workflow.ts | WARN | 4 lines (has description line after MODULE) |
| memory-indexer.ts | WARN | 5 lines (has multi-line description) |
| file-writer.ts | WARN | 4 lines (has description line after MODULE) |
| All lib files except topic-keywords.ts | WARN | Have `@file`/`@description`/`@module` JSDoc block ABOVE the 3-line header (acceptable but not minimal) |

**Strict P0 violations:** 2 (subfolder-utils.ts, topic-keywords.ts)
**Warnings (extended headers):** Most files have 4+ line headers with descriptions; only `index.ts`, `quality-scorer.ts` are exact 3-line.

### P0-2: No `any` in Exported Functions/Interfaces/Types

All files: **PASS**. No `any` type found in any exported signature. Index signatures use `[key: string]: unknown` which is compliant.

### P0-3: PascalCase for Interfaces/Types/Enums

All files: **PASS**. All interfaces use PascalCase (e.g., `WorkflowConfig`, `SpecKitConfig`, `ThinningConfig`, `FilterConfig`, `ChunkOptions`). Type aliases use PascalCase (e.g., `MessageType`, `AnchorTag`, `WorkflowPattern`, `ContentType`, `DocumentKind`).

### P0-4: No Commented-Out Code Blocks

All files: **PASS**. No commented-out code blocks found. NOTE comments explain design decisions (legitimate).

### P0-5: WHY Comments Only with AI- Prefixes

| File | Status | Detail |
|------|--------|--------|
| workflow.ts | PASS | Line 791: `// AI: Fix F7` uses AI- prefix correctly |
| All other files | PASS | No WHY comments found; NOTE comments explain differences between similar functions (not WHY comments) |

## Detailed P1 Findings

### P1-1: Explicit Return Types on Exported Functions

All exported functions have explicit return types. **PASS** across all files.

### P1-2: Named Interfaces for Object Params Crossing Module Boundaries

All exported functions use named interfaces for complex object parameters. **PASS**.

### P1-3: Non-null Assertions (!) with Justification

No non-null assertions (`!`) found in any file. **PASS**.

### P1-4: TSDoc on Exported Functions/Classes/Interfaces

**This is the dominant P1 failure.** Summary of missing TSDoc:

| File | Missing TSDoc Count | Functions Missing TSDoc |
|------|--------------------:|------------------------|
| config.ts | 3 | `getSpecsDirectories`, `findActiveSpecsDir`, `getAllExistingSpecsDirs` |
| topic-extractor.ts | 1 | `extractKeyTopics` |
| subfolder-utils.ts | 1 | `getPhaseFolderRejectionSync` |
| file-writer.ts | 1 | `writeFilesAtomically` |
| workflow.ts | 1 | `runWorkflow` |
| memory-indexer.ts | 2 | `indexMemory`, `updateMetadataWithEmbedding` |
| ascii-boxes.ts | 6 | `padText`, `formatDecisionHeader`, `formatOptionBox`, `formatChosenBox`, `formatCaveatsBox`, `formatFollowUpBox` |
| simulation-factory.ts | 12 | All 12 exported functions |
| semantic-summarizer.ts | 6 | `classifyMessage`, `classifyMessages`, `extractFileChanges`, `extractDecisions`, `generateImplementationSummary`, `formatSummaryAsMarkdown` |
| decision-tree-generator.ts | 1 | `generateDecisionTree` |
| content-filter.ts | 8 | `createFilterPipeline`, `filterContent`, `isNoiseContent`, `stripNoiseWrappers`, `meetsMinimumRequirements`, `generateContentHash`, `calculateSimilarity`, `calculateQualityScore` |
| anchor-generator.ts | 5 | `generateAnchorId`, `categorizeSection`, `validateAnchorUniqueness`, `extractKeywords`, `slugify` (plus `extractSpecNumber`, `getCurrentDate`, `wrapSectionsWithAnchors`) |
| flowchart-generator.ts | 7 | All 7 primary exported functions |
| topic-keywords.ts | 3 | `tokenizeTopicWords`, `createValidShortTerms`, `shouldIncludeTopicWord` |
| frontmatter-migration.ts | 6 | `buildFrontmatterContent`, `classifyDocument`, `buildManagedFrontmatter`, `detectFrontmatter`, `parseFrontmatterSections`, `parseSectionValue` |

**Total exported functions missing TSDoc:** ~63

### P1-5: Catch Blocks Use `unknown` Type

| File | Status | Detail |
|------|--------|--------|
| config.ts | PASS | `catch (error: unknown)` on line 176 with `instanceof Error` narrowing |
| subfolder-utils.ts | PASS | All catch blocks use `(_error: unknown)` or `(err: unknown)` with narrowing |
| file-writer.ts | WARN | Line 38 bare `catch {}` (no variable), line 71 bare `catch {}` -- these lack unknown annotation but also have no variable |
| workflow.ts | WARN | Line 348 `catch {}`, line 856 `catch {}` -- bare catch without variable |
| memory-indexer.ts | PASS | All catch blocks properly typed with `unknown` and narrowed |
| decision-tree-generator.ts | PASS | `catch (err: unknown)` with narrowing |
| content-filter.ts | PASS | `catch (error: unknown)` with narrowing |

**Bare `catch {}` blocks (no variable captured):** 4 instances across workflow.ts (2) and file-writer.ts (2). These are technically compliant since no variable is declared, but adding `(_e: unknown)` would be more explicit.

## Summary

- **Files scanned:** 21
- **P0 issues:** 2 (strict header violations in subfolder-utils.ts, topic-keywords.ts)
- **P0 warnings:** ~15 files have extended headers (4+ lines) rather than exact 3-line format
- **P1 issues:** ~67 (63 missing TSDoc + 4 bare catch blocks)
- **Top 3 worst:** simulation-factory.ts (12 missing TSDoc), content-filter.ts (8 missing TSDoc), flowchart-generator.ts (7 missing TSDoc)
- **Clean files (0 issues):** quality-scorer.ts, tree-thinning.ts, index.ts, trigger-extractor.ts, embeddings.ts, structure-aware-chunker.ts (6 out of 21)
- **No `any` violations found** across all 21 files
- **No PascalCase violations found**
- **No commented-out code found**
- **No AI-prefix violations found**
- **All exported functions have explicit return types**
- **All module-boundary params use named interfaces**

### Risk Assessment

The P0 violations are cosmetic (header formatting). The dominant issue is **missing TSDoc on exported functions** (P1-4), affecting 15 of 21 files. The codebase is otherwise well-typed, properly structured, and follows naming conventions consistently. The `require()` in decision-tree-generator.ts has a documented rationale (sync constraint) but is still non-standard.
