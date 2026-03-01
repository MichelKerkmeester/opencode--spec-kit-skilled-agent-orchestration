---
title: "Implementation Summary: Full Spec Folder Document Indexing [126-full-spec-doc-indexing/implementation-summary]"
description: "Status: Implemented -- Fully Verified"
trigger_phrases:
  - "implementation"
  - "summary"
  - "full"
  - "spec"
  - "folder"
  - "implementation summary"
  - "126"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Implementation Summary: Full Spec Folder Document Indexing

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## IMPLEMENTATION STATUS

**Status**: Implemented -- Fully Verified
**Task Completion**: 75/75 (Phases 1-10 complete) + post-implementation hardening applied
**Completion Date**: 2026-02-16 (implementation, verification, and regression hardening complete)
**Next Phase**: None required; monitor in normal usage
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## CHANGES MADE

### Phase 1: Schema Migration (v12 -> v13)

**File**: `mcp_server/lib/search/vector-index-impl.ts`
- Bumped `SCHEMA_VERSION` from 12 to 13
- Added migration 13: `ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'`
- Added migration 13: `ALTER TABLE memory_index ADD COLUMN spec_level INTEGER`
- Created indexes: `idx_document_type` (single), `idx_doc_type_folder` (composite)
- Backfill: constitutional files -> `'constitutional'`, readme files -> `'readme'`
- Updated `create_schema()` DDL to include `document_type`, `spec_level` for fresh databases
- Updated `index_memory()` and `index_memory_deferred()` INSERT statements with new columns

**File**: `shared/normalization.ts`
- Added `document_type: string` and `spec_level: number | null` to `MemoryDbRow` interface
- Added `documentType: string` and `specLevel: number | null` to `Memory` interface
- Updated `dbRowToMemory()`, `memoryToDbRow()`, `partialDbRowToMemory()` conversion functions

### Phase 2: Type Configuration

**File**: `mcp_server/lib/config/memory-types.ts`
- Added `DocumentType` union type with 11 values
- Added `SpecDocumentConfig` interface
- Added `SPEC_DOCUMENT_CONFIGS` array (8 entries for spec folder document types)
- Added `SPEC_DOCUMENT_FILENAMES` set (8 filenames)
- Added `inferDocumentTypeFromPath()` function with `/specs/` path check
- Added `getSpecDocumentConfig()` helper function

### Phase 3: Discovery (Crawler)

**File**: `mcp_server/handlers/memory-index.ts`
- Added `SPEC_DOCUMENT_FILENAMES` set for file matching
- Added `SPEC_DOC_EXCLUDE_DIRS` set (`z_archive`, `scratch`, `memory`, `node_modules`)
- Added `findSpecDocuments()` walker function for `.opencode/specs/` and `specs/` directories
- Added `detectSpecLevel()` with `SPECKIT_LEVEL` marker reading + sibling file heuristic
- Extended `ScanArgs` with `includeSpecDocs?: boolean` (default: true)
- Integrated spec doc files into `handleMemoryIndexScan()` file array
- Added `SPECKIT_INDEX_SPEC_DOCS` environment variable feature flag check
- Added `specDocFiles` count to `_debug_fileCounts` in scan results

### Phase 4: Parser Enhancements

**File**: `mcp_server/lib/parsing/memory-parser.ts`
- Extended `isMemoryFile()` to recognize spec documents (in `/specs/`, not in `/memory/` or `/scratch/`)
- Added `SPEC_DOCUMENT_FILENAMES_SET` (8 entries, lowercase)
- Added `extractDocumentType()` function mapping filenames to document types
- Extended `extractSpecFolder()` with regex for non-memory spec doc paths
- Added `documentType` field to `ParsedMemory` interface
- Integrated `extractDocumentType()` into `parseMemoryFile()`

### Phase 5: Indexing Pipeline Updates

**File**: `mcp_server/handlers/memory-save.ts`
- Added `calculateDocumentWeight()` with `DOC_TYPE_WEIGHTS` map:
  - spec/decision_record -> 0.8, plan -> 0.7, tasks/impl_summary/research -> 0.6
  - checklist/handover -> 0.5, constitutional -> 1.0, memory -> 0.5
  - skill readme -> 0.3, project readme -> 0.4, scratch -> 0.25
- Added `calculateReadmeWeight()` deprecated wrapper
- Added `detectSpecLevelFromParsed()` helper
- Updated `indexMemoryFile()` CREATE path: passes `documentType`, `specLevel` to `vectorIndex.indexMemory()`
- Updated deferred indexing path similarly

### Phase 6: Scoring & Priority

**File**: `mcp_server/lib/scoring/composite-scoring.ts`
- Added `DOCUMENT_TYPE_MULTIPLIERS` constant:
  - spec: 1.4, decision_record: 1.4, plan: 1.3, tasks: 1.1, implementation_summary: 1.1
  - checklist: 1.0, handover: 1.0, memory: 1.0, constitutional: 2.0, readme: 0.8, scratch: 0.6
- Applied multiplier in `calculateFiveFactorScore()` (line 403)
- Applied multiplier in `calculateCompositeScore()` legacy path (line 444)
- Added `DOC_TYPE_QUERY_MAP` in `calculatePatternScore()` for document-type pattern alignment bonus

**File**: `mcp_server/lib/scoring/importance-tiers.ts`
- Added `getDefaultTierForDocumentType()` returning `'important'` for spec/plan/decision_record, `'normal'` for others

### Phase 7: Relationship Chains

**File**: `mcp_server/lib/storage/causal-edges.ts`
- Added `createSpecDocumentChain()` function creating:
  - CAUSED edges: spec->plan, plan->tasks, tasks->implementation_summary
  - SUPPORTS edges: checklist->spec, decision_record->plan, research->spec
- Used `insertEdgesBatch()` for efficient batch insertion

**File**: `mcp_server/handlers/memory-index.ts`
- Integrated chain creation in scan handler after indexing loop
- Groups indexed files by spec folder; creates chains for folders with 2+ indexed documents

### Phase 8: Intent Classifier Enhancement

**File**: `mcp_server/lib/search/intent-classifier.ts`
- Added `find_spec` and `find_decision` to `IntentType` union
- Added 10 keywords for `find_spec`: spec, specification, requirements, scope, feature, plan, tasks, checklist, implementation
- Added 9 keywords for `find_decision`: decision, why, chose, rationale, alternative, trade-off, tradeoff, adr, decision-record
- Added 5 regex patterns each for `find_spec` and `find_decision`
- Added weight adjustments: `{ recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'decision' }`
- Initialized scores for new intents in `classifyIntent()`
- Added descriptions in `getIntentDescription()`

### Phase 9: Peripheral Updates

**File**: `mcp_server/tools/types.ts`
- Added `includeSpecDocs?: boolean` to `ScanArgs` interface

**File**: `mcp_server/tool-schemas.ts`
- Added `includeSpecDocs` parameter to `memory_index_scan` tool schema

**File**: `mcp_server/lib/search/vector-index.ts`
- Added `documentType?: string` and `specLevel?: number | null` to `IndexMemoryParams`
- Added `document_type?: string` and `spec_level?: number | null` to `MemoryIndexRow`

**File**: `mcp_server/configs/search-weights.json`
- Added `documentTypeMultipliers` section with all 11 document type multipliers
- Bumped version from 1.7.2 to 1.8.0

### Phase 10: Testing and Verification

- Expanded `mcp_server/tests/spec126-full-spec-doc-indexing.vitest.ts` to 143 tests (all passing)
- Ran full suite: `npm test` in `.opencode/skill/system-spec-kit`
  - `Test Files: 122 passed | 4 skipped (126 total)`
  - `Tests: 4184 passed | 72 skipped (4256 total)`
- Full-suite regression fixes applied:
  - `mcp_server/context-server.ts`: corrected cognitive module imports from `./lib/cache/cognitive/*` to `./lib/cognitive/*`
  - `mcp_server/lib/cognitive/attention-decay.ts`: corrected composite scoring import path to `../scoring/composite-scoring`

### Post-Implementation Hardening (Review Follow-up)

- `mcp_server/handlers/memory-index.ts`
  - tightened `specFolder` boundary filtering (no prefix bleed)
  - improved chain creation coverage for incremental scans using DB-backed folder docs
  - ensured descriptor-safe `detectSpecLevel()` reads via `finally`
- `mcp_server/handlers/memory-save.ts`
  - preserved `document_type` and `spec_level` on update/reinforce paths
  - aligned document weighting in update/reinforce flows
  - ensured descriptor-safe `detectSpecLevelFromParsed()` reads via `finally`
- `mcp_server/lib/search/vector-index.ts` + `mcp_server/lib/search/vector-index-impl.ts`
  - added `documentType`/`specLevel` update plumbing to keep metadata consistent after updates
- `mcp_server/lib/storage/causal-edges.ts`
  - replaced edge upsert behavior with conflict-update semantics that keep edge IDs stable
- `mcp_server/tool-schemas.ts`
  - aligned `memory_save` path description with supported file scopes
<!-- /ANCHOR:what-built -->

---

## FILES MODIFIED (16 total)

| # | File | Lines Changed | Change Summary |
|---|------|--------------|----------------|
| 1 | `mcp_server/lib/search/vector-index-impl.ts` | ~80 | Schema v13, DDL, INSERT columns |
| 2 | `shared/normalization.ts` | ~30 | Types + converters |
| 3 | `mcp_server/lib/config/memory-types.ts` | ~90 | DocumentType, configs, inference |
| 4 | `mcp_server/handlers/memory-index.ts` | ~150 | Discovery, scan integration, chains |
| 5 | `mcp_server/lib/parsing/memory-parser.ts` | ~100 | Parser, isMemoryFile, extractors |
| 6 | `mcp_server/handlers/memory-save.ts` | ~60 | Document weights, indexing pipeline |
| 7 | `mcp_server/lib/scoring/composite-scoring.ts` | ~40 | Multipliers, scoring functions |
| 8 | `mcp_server/lib/scoring/importance-tiers.ts` | ~20 | getDefaultTierForDocumentType |
| 9 | `mcp_server/lib/storage/causal-edges.ts` | ~60 | createSpecDocumentChain |
| 10 | `mcp_server/lib/search/intent-classifier.ts` | ~50 | find_spec, find_decision intents |
| 11 | `mcp_server/tools/types.ts` | ~3 | includeSpecDocs in ScanArgs |
| 12 | `mcp_server/tool-schemas.ts` | ~8 | Tool schema property |
| 13 | `mcp_server/lib/search/vector-index.ts` | ~6 | IndexMemoryParams, MemoryIndexRow |
| 14 | `mcp_server/configs/search-weights.json` | ~15 | documentTypeMultipliers config |
| 15 | `mcp_server/context-server.ts` | ~4 | Correct cognitive module import paths |
| 16 | `mcp_server/lib/cognitive/attention-decay.ts` | ~2 | Correct composite scoring import path |

---

## BACKWARD COMPATIBILITY

All changes are backward compatible:
- Schema migration is purely additive (ADD COLUMN only, no table recreation)
- Default `document_type = 'memory'` preserves all existing rows
- `DOCUMENT_TYPE_MULTIPLIERS.memory = 1.0` means no change to existing memory scoring
- No CHECK constraint modifications (avoids SQLite table recreation)
- Feature flag `SPECKIT_INDEX_SPEC_DOCS=false` allows opt-out
- Per-call `includeSpecDocs: false` parameter for scan tool
- Existing search queries return identical results for memory-type documents

---

<!-- ANCHOR:decisions -->
## ARCHITECTURE DECISIONS

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | New `document_type` column | Orthogonal to `context_type`; clean separation |
| ADR-002 | Scoring multipliers | No schema risk; works with both scoring models |
| ADR-003 | Whole-document indexing | Adequate for 2-10KB docs; low cost |
| ADR-004 | Existing `causal_edges` table | Reuses infrastructure; no new tables |
| ADR-005 | Feature flag opt-out | Dual control (env var + param) |

See `decision-record.md` for full ADRs with Five Checks evaluation.
<!-- /ANCHOR:decisions -->

---

## METRICS

| Metric | Value |
|--------|-------|
| **Files Modified** | 16 |
| **Implementation Tasks** | 60/60 complete |
| **Test Tasks** | 15/15 complete |
| **Spec 126 Test Suite** | 143 tests passing |
| **Full system-spec-kit Suite** | 122 files / 4184 tests passing (72 skipped) |
| **Document Types Added** | 11 (including existing memory, readme, constitutional) |
| **New Indexes** | 2 (idx_document_type, idx_doc_type_folder) |
| **Schema Version** | 12 -> 13 |
| **Scoring Multipliers** | 11 types configured |
| **Intent Types Added** | 2 (find_spec, find_decision) |
| **Causal Edge Types** | 2 used (CAUSED, SUPPORTS) |

---

## LESSONS LEARNED

### What Worked Well

1. **Purely additive schema migration**: ADD COLUMN with DEFAULT preserved backward compatibility perfectly
2. **Scoring multiplier approach**: Avoided table recreation while achieving the same ranking effect
3. **Existing causal_edges infrastructure**: Reusing the table with CAUSED/SUPPORTS relations saved significant effort
4. **Path-based document type inference**: Using `/specs/` path check prevents false positives from memory files with same filenames

### What Could Be Improved

1. **Spec folder documentation**: Implementation was completed before spec folder was created; retroactive documentation is harder
2. **Full-suite runs catch integration regressions quickly**: import-path drift was surfaced immediately by `npm test`

---

## NEXT STEPS

1. **Monitor large-workspace indexing behavior**: validate chain consistency under incremental scans and deferred embeddings
2. **Optionally close remaining hardening gaps**: add dedicated filesystem/migration tests listed in `handover.md`

---

<!-- ANCHOR:limitations -->
## BLOCKERS

**Current**: None -- implementation and verification are complete.
<!-- /ANCHOR:limitations -->

---

<!--
Implementation summary for Spec 126: Full Spec Folder Document Indexing
All 10 phases complete; full suite passing after regression hardening
-->
