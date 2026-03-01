---
title: "Implementation Plan: Full Spec Folder Document Indexing [126-full-spec-doc-indexing/plan]"
description: "Add full spec folder document indexing to the MCP server's memory system. This involves an 8-phase implementation: schema migration, type configuration, document discovery, pars..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "full"
  - "spec"
  - "folder"
  - "126"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Implementation Plan: Full Spec Folder Document Indexing

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-deps + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript (Node.js) |
| Framework | MCP Server (Model Context Protocol) |
| Storage | SQLite via better-sqlite3 + sqlite-vec |
| Testing | Vitest 4.0.18 |

### Overview

Add full spec folder document indexing to the MCP server's memory system. This involves an 8-phase implementation: schema migration, type configuration, document discovery, parser enhancements, indexing pipeline updates, scoring/priority, relationship chains, and intent classifier enhancement. The approach is purely additive -- existing functionality is preserved while new document types gain higher search priority through scoring multipliers.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec approved and ADRs accepted
- [x] Schema migration approach validated (ADD COLUMN is safe)
- [x] Test plan covers all 8 phases
- [x] No breaking changes to existing API

### Definition of Done

- [x] All 14 files modified per spec
- [x] Schema v13 migration works (fresh + upgrade)
- [x] Spec documents appear in scan results
- [x] Spec documents rank higher in search
- [ ] Test suite passes
- [x] Backward compatibility verified

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Layered architecture: Discovery -> Parsing -> Indexing -> Scoring -> Search

### Key Components

- **Discovery** (`memory-index.ts`): `findSpecDocuments()` walks `.opencode/specs/` tree
- **Classification** (`memory-types.ts`): `DocumentType` enum and `SPEC_DOCUMENT_CONFIGS`
- **Parsing** (`memory-parser.ts`): `extractDocumentType()` maps filename -> type
- **Indexing** (`memory-save.ts`): `calculateDocumentWeight()` assigns type-based weights
- **Scoring** (`composite-scoring.ts`): `DOCUMENT_TYPE_MULTIPLIERS` boost spec doc scores
- **Chains** (`causal-edges.ts`): `createSpecDocumentChain()` links spec -> plan -> tasks
- **Intent** (`intent-classifier.ts`): `find_spec`, `find_decision` route queries to spec docs

### Data Flow

```
Scan Request
  -> findSpecDocuments() discovers spec.md, plan.md, etc.
  -> parseMemoryFile() extracts metadata + documentType
  -> indexMemoryFile() stores with document_type, spec_level columns
  -> calculateDocumentWeight() assigns type-based importance weight
  -> DOCUMENT_TYPE_MULTIPLIERS applied at search time
  -> createSpecDocumentChain() links related documents
```

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema Migration (v12 -> v13)

- [x] T001 Bump SCHEMA_VERSION to 13 (`vector-index-impl.ts:175`)
- [x] T002 Add migration 13: ALTER TABLE ADD COLUMN document_type, spec_level
- [x] T003 Add indexes: idx_document_type, idx_doc_type_folder
- [x] T004 Backfill: constitutional -> 'constitutional', readme -> 'readme'
- [x] T005 Update create_schema() DDL for fresh databases
- [x] T006 Update normalization.ts: MemoryDbRow, Memory, converters

### Phase 2: Type Configuration

- [x] T007 Add DocumentType union type (`memory-types.ts`)
- [x] T008 Add SPEC_DOCUMENT_CONFIGS array
- [x] T009 Add inferDocumentTypeFromPath() function
- [x] T010 Add SPEC_DOCUMENT_FILENAMES set
- [x] T011 Add getSpecDocumentConfig() helper

### Phase 3: Discovery (Crawler)

- [x] T012 Add findSpecDocuments() walker (`memory-index.ts`)
- [x] T013 Add detectSpecLevel() with SPECKIT_LEVEL marker
- [x] T014 Add includeSpecDocs to ScanArgs
- [x] T015 Integrate spec docs into handleMemoryIndexScan()
- [x] T016 Add feature flag: SPECKIT_INDEX_SPEC_DOCS

### Phase 4: Parser Enhancements

- [x] T017 Extend isMemoryFile() for spec documents (`memory-parser.ts`)
- [x] T018 Extend extractSpecFolder() for non-memory paths
- [x] T019 Add extractDocumentType() function
- [x] T020 Add documentType to ParsedMemory interface
- [x] T021 Add SPEC_DOCUMENT_FILENAMES_SET

### Phase 5: Indexing Pipeline Updates

- [x] T022 Add calculateDocumentWeight() with type-based weights (`memory-save.ts`)
- [x] T023 Deprecate calculateReadmeWeight() (wrapper)
- [x] T024 Update indexMemoryFile() SQL: INSERT document_type, spec_level
- [x] T025 Update deferred indexing path similarly
- [x] T026 Add detectSpecLevelFromParsed() helper
- [x] T027 Update isMemoryFile() guard error message
- [x] T028 Update vector-index-impl.ts: index_memory() INSERT
- [x] T029 Update vector-index-impl.ts: index_memory_deferred() INSERT

### Phase 6: Scoring & Priority

- [x] T030 Add DOCUMENT_TYPE_MULTIPLIERS constant (`composite-scoring.ts`)
- [x] T031 Apply multiplier in calculateFiveFactorScore()
- [x] T032 Apply multiplier in calculateCompositeScore() (legacy)
- [x] T033 Add document-type pattern alignment bonus in calculatePatternScore()
- [x] T034 Add getDefaultTierForDocumentType() (`importance-tiers.ts`)

### Phase 7: Relationship Chains

- [x] T035 Add createSpecDocumentChain() (`causal-edges.ts`)
- [x] T036 Integrate chain creation in memory-index.ts after indexing
- [x] T037 Group indexed files by spec folder for chain creation

### Phase 8: Intent Classifier Enhancement

- [x] T038 Add find_spec intent type with keywords/patterns (`intent-classifier.ts`)
- [x] T039 Add find_decision intent type with keywords/patterns
- [x] T040 Add weight adjustments for new intents
- [x] T041 Update classifyIntent() scores initialization

### Phase 9: Peripheral Updates

- [x] T042 Add includeSpecDocs to tools/types.ts ScanArgs
- [x] T043 Add includeSpecDocs to tool-schemas.ts
- [x] T044 Add documentTypeMultipliers to search-weights.json
- [x] T045 Add documentType, specLevel to vector-index.ts types

<!-- /ANCHOR:phases -->

<!-- ANCHOR:phase-deps -->
## 5. L2: PHASE DEPENDENCIES

```
Phase 1 (Schema) ─── MUST BE FIRST
    │
Phase 2 (Types) ─── Foundation for 3, 4, 5
    │
    ├── Phase 3 (Discovery) ─┐
    │                         ├── Phase 5 (Pipeline)
    └── Phase 4 (Parser) ────┘
                                    │
Phase 6 (Scoring) ── parallel with Phase 5
                                    │
    ├── Phase 7 (Chains) ───┐
    │                        ├── Phase 9 (Peripheral)
    └── Phase 8 (Intent) ──┘
```

| Phase | Depends On | Blocks |
|-------|-----------|--------|
| 1. Schema | None | All others |
| 2. Types | Phase 1 | 3, 4, 5 |
| 3. Discovery | Phase 2 | 5 |
| 4. Parser | Phase 2 | 5 |
| 5. Pipeline | Phases 3, 4 | 7 |
| 6. Scoring | Phase 2 | None |
| 7. Chains | Phase 5 | None |
| 8. Intent | Phase 2 | None |
| 9. Peripheral | None | None |

<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Type inference, scoring multipliers, parser functions | Vitest |
| Unit | Intent classifier, document type detection | Vitest |
| Integration | Discovery -> Parse -> Index pipeline | Vitest + in-memory SQLite |
| Integration | Search scoring with document types | Vitest + in-memory SQLite |
| Regression | Existing memory search quality | Vitest |

<!-- /ANCHOR:testing -->

---

## 7. L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs (5 decisions with Five Checks evaluation).

---

<!-- ANCHOR:ai-execution -->
## 8. L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation

| Step | Files | Agent |
|------|-------|-------|
| Schema migration | vector-index-impl.ts, normalization.ts | @write |
| Type configuration | memory-types.ts | @write |

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| @write-1 | Discovery + Parser | memory-index.ts, memory-parser.ts |
| @write-2 | Pipeline + Scoring | memory-save.ts, composite-scoring.ts, importance-tiers.ts |
| @write-3 | Chains + Intent | causal-edges.ts, intent-classifier.ts |

### Tier 3: Integration

| Step | Files | Agent |
|------|-------|-------|
| Peripheral updates | tools/types.ts, tool-schemas.ts, vector-index.ts, search-weights.json | @write |
| Test suite | tests/spec126-*.vitest.ts | @write |
| Review | All 14 files | @review |

<!-- /ANCHOR:ai-execution -->

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: Schema migration fails or causes data corruption
- **Procedure**: Schema migration is purely additive (ADD COLUMN). To rollback: set `SPECKIT_INDEX_SPEC_DOCS=false` to disable discovery. New columns are ignored by existing queries. No data loss possible.

<!-- /ANCHOR:rollback -->

<!--
LEVEL 3+ PLAN
- Core + L2 + L3 + L3+ addendums
- AI execution framework, phase dependencies
-->
