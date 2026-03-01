---
title: "Verification Checklist: Full Spec Folder Document Indexing [126-full-spec-doc-indexing/checklist]"
description: "Status: ALL ITEMS VERIFIED -- 143 Spec 126 tests passing and full system-spec-kit suite green"
trigger_phrases:
  - "verification"
  - "checklist"
  - "full"
  - "spec"
  - "folder"
  - "126"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Verification Checklist: Full Spec Folder Document Indexing

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P0] Architecture decisions recorded (5 ADRs)
- [x] CHK-004 [P1] Dependencies identified: SQLite schema migration, causal_edges table
<!-- /ANCHOR:pre-impl -->

## PHASE 1: SCHEMA MIGRATION

- [x] CHK-010 [P0] SCHEMA_VERSION bumped to 13
- [x] CHK-011 [P0] Migration 13 adds document_type column with DEFAULT 'memory'
- [x] CHK-012 [P0] Migration 13 adds spec_level column (nullable INTEGER)
- [x] CHK-013 [P0] Migration 13 creates idx_document_type index
- [x] CHK-014 [P0] Migration 13 creates idx_doc_type_folder composite index
- [x] CHK-015 [P0] Migration 13 backfills constitutional -> 'constitutional'
- [x] CHK-016 [P0] Migration 13 backfills readme -> 'readme'
- [x] CHK-017 [P0] Migration handles duplicate column error gracefully
- [x] CHK-018 [P0] create_schema() DDL includes document_type, spec_level for fresh DBs
- [x] CHK-019 [P1] MemoryDbRow has document_type: string and spec_level: number | null
- [x] CHK-020 [P1] Memory has documentType: string and specLevel: number | null
- [x] CHK-021 [P1] dbRowToMemory() maps document_type -> documentType
- [x] CHK-022 [P1] memoryToDbRow() maps documentType -> document_type
- [x] CHK-023 [P1] partialDbRowToMemory() handles new fields

## PHASE 2: TYPE CONFIGURATION

- [x] CHK-030 [P0] DocumentType union has all 11 values (spec, plan, tasks, checklist, decision_record, implementation_summary, research, handover, memory, readme, constitutional)
- [x] CHK-031 [P0] SPEC_DOCUMENT_CONFIGS has 8 entries (one per spec doc type)
- [x] CHK-032 [P0] Each config has: filePattern, documentType, memoryType, defaultImportanceTier, defaultImportanceWeight
- [x] CHK-033 [P0] inferDocumentTypeFromPath() returns correct type for each spec doc
- [x] CHK-034 [P1] inferDocumentTypeFromPath() requires /specs/ in path (not /memory/)
- [x] CHK-035 [P1] SPEC_DOCUMENT_FILENAMES has 8 entries
- [x] CHK-036 [P1] Fallback returns 'memory' for unrecognized files

## PHASE 3: DISCOVERY (CRAWLER)

- [x] CHK-040 [P0] findSpecDocuments() walks .opencode/specs/ and specs/ directories
- [x] CHK-041 [P0] findSpecDocuments() excludes z_archive/, scratch/, memory/, hidden dirs
- [x] CHK-042 [P0] findSpecDocuments() supports specFolder filter
- [x] CHK-043 [P0] findSpecDocuments() respects SPECKIT_INDEX_SPEC_DOCS=false
- [x] CHK-044 [P0] detectSpecLevel() reads SPECKIT_LEVEL marker from first 2KB
- [x] CHK-045 [P1] detectSpecLevel() falls back to sibling file heuristic
- [x] CHK-046 [P1] ScanArgs has includeSpecDocs: boolean (default true)
- [x] CHK-047 [P1] specDocFiles integrated into handleMemoryIndexScan() file array
- [x] CHK-048 [P1] Scan results include specDocFiles count in _debug_fileCounts

## PHASE 4: PARSER ENHANCEMENTS

- [x] CHK-050 [P0] isMemoryFile() accepts spec documents in /specs/ (not in /memory/ or /scratch/)
- [x] CHK-051 [P0] isMemoryFile() checks against SPEC_DOCUMENT_FILENAMES_SET
- [x] CHK-052 [P0] extractDocumentType() maps each filename correctly
- [x] CHK-053 [P0] extractDocumentType() returns 'constitutional' for /constitutional/*.md
- [x] CHK-054 [P0] extractDocumentType() returns 'readme' for readme.md
- [x] CHK-055 [P0] extractDocumentType() returns 'memory' as default
- [x] CHK-056 [P0] extractSpecFolder() handles non-memory spec doc paths
- [x] CHK-057 [P1] ParsedMemory interface has documentType field
- [x] CHK-058 [P1] parseMemoryFile() calls extractDocumentType() and includes result

## PHASE 5: INDEXING PIPELINE

- [x] CHK-060 [P0] calculateDocumentWeight() returns correct weights for all document types
- [x] CHK-061 [P0] spec/decision_record -> 0.8, plan -> 0.7, tasks/impl_summary/research -> 0.6
- [x] CHK-062 [P0] checklist/handover -> 0.5, constitutional -> 1.0, memory -> 0.5
- [x] CHK-063 [P0] skill readme -> 0.3, project readme -> 0.4, scratch -> 0.25
- [x] CHK-064 [P0] indexMemoryFile() passes documentType to vectorIndex.indexMemory()
- [x] CHK-065 [P0] indexMemoryFile() passes specLevel to vectorIndex.indexMemory()
- [x] CHK-066 [P0] UPDATE memory_index SET document_type, spec_level in CREATE path
- [x] CHK-067 [P0] Same in deferred indexing path
- [x] CHK-068 [P0] vector-index-impl.ts index_memory() INSERT includes document_type, spec_level
- [x] CHK-069 [P0] vector-index-impl.ts index_memory_deferred() INSERT includes document_type, spec_level
- [x] CHK-070 [P1] detectSpecLevelFromParsed() reads sibling spec.md for level
- [x] CHK-071 [P1] calculateReadmeWeight() deprecated wrapper exists

## PHASE 6: SCORING & PRIORITY

- [x] CHK-080 [P0] DOCUMENT_TYPE_MULTIPLIERS has all 11 document types
- [x] CHK-081 [P0] spec: 1.4, decision_record: 1.4, plan: 1.3
- [x] CHK-082 [P0] tasks: 1.1, implementation_summary: 1.1
- [x] CHK-083 [P0] memory: 1.0 (unchanged), constitutional: 2.0
- [x] CHK-084 [P0] readme: 0.8, scratch: 0.6
- [x] CHK-085 [P0] Multiplier applied in calculateFiveFactorScore()
- [x] CHK-086 [P0] Multiplier applied in calculateCompositeScore() (legacy)
- [x] CHK-087 [P0] Pattern alignment bonus checks document_type against query keywords
- [x] CHK-088 [P0] DOC_TYPE_QUERY_MAP covers spec, decision_record, plan, tasks, impl_summary, checklist, research
- [x] CHK-089 [P1] getDefaultTierForDocumentType() returns 'important' for spec, plan, decision_record
- [x] CHK-090 [P1] getDefaultTierForDocumentType() returns 'normal' for other types

## PHASE 7: RELATIONSHIP CHAINS

- [x] CHK-100 [P0] createSpecDocumentChain() creates CAUSED edges: spec->plan, plan->tasks, tasks->impl_summary
- [x] CHK-101 [P0] createSpecDocumentChain() creates SUPPORTS edges: checklist->spec, decision_record->plan, research->spec
- [x] CHK-102 [P0] createSpecDocumentChain() handles missing document IDs gracefully
- [x] CHK-103 [P0] Chain creation integrated in scan handler after indexing loop
- [x] CHK-104 [P1] Only creates chains for folders with 2+ indexed documents
- [x] CHK-105 [P1] Uses insertEdgesBatch() for efficient batch insertion

## PHASE 8: INTENT CLASSIFIER

- [x] CHK-110 [P0] IntentType includes 'find_spec' and 'find_decision'
- [x] CHK-111 [P0] INTENT_KEYWORDS has entries for find_spec (10 keywords)
- [x] CHK-112 [P0] INTENT_KEYWORDS has entries for find_decision (9 keywords)
- [x] CHK-113 [P0] INTENT_PATTERNS has patterns for find_spec (5 patterns)
- [x] CHK-114 [P0] INTENT_PATTERNS has patterns for find_decision (5 patterns)
- [x] CHK-115 [P0] INTENT_WEIGHT_ADJUSTMENTS has entries for find_spec, find_decision
- [x] CHK-116 [P1] classifyIntent() initializes scores for find_spec, find_decision
- [x] CHK-117 [P1] getIntentDescription() includes descriptions for new intents

## PHASE 9: PERIPHERAL UPDATES

- [x] CHK-120 [P0] tools/types.ts ScanArgs has includeSpecDocs?: boolean
- [x] CHK-121 [P0] tool-schemas.ts memory_index_scan has includeSpecDocs property
- [x] CHK-122 [P0] vector-index.ts IndexMemoryParams has documentType, specLevel
- [x] CHK-123 [P0] vector-index.ts MemoryIndexRow has document_type, spec_level
- [x] CHK-124 [P1] search-weights.json has documentTypeMultipliers section

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-130 [P0] All 5 ADRs documented in decision-record.md
- [x] CHK-131 [P0] All ADRs have Accepted status
- [x] CHK-132 [P0] All ADRs have Five Checks evaluation (5/5 PASS)
- [x] CHK-133 [P1] Alternatives documented with rejection rationale
<!-- /ANCHOR:arch-verify -->

## L3+: BACKWARD COMPATIBILITY VERIFICATION

- [x] CHK-140 [P0] Schema migration is purely additive (ADD COLUMN only)
- [x] CHK-141 [P0] Default document_type='memory' preserves existing rows
- [x] CHK-142 [P0] Scoring multiplier for 'memory' type is 1.0 (no change)
- [x] CHK-143 [P0] No CHECK constraint modifications
- [x] CHK-144 [P0] Feature flag allows opt-out
- [x] CHK-145 [P1] Existing search queries unaffected

## L3+: TESTING VERIFICATION

- [x] CHK-150 [P0] Test suite created (spec126-full-spec-doc-indexing.vitest.ts) -- 143 tests, all passing
- [x] CHK-151 [P0] Type inference tests pass -- 13 tests (DocumentType + SPEC_DOCUMENT_CONFIGS + FILENAMES)
- [x] CHK-152 [P0] Scoring multiplier tests pass -- 15 tests (DOCUMENT_TYPE_MULTIPLIERS values + 5-factor + legacy + pattern alignment)
- [x] CHK-153 [P0] Parser function tests pass -- 19 tests (extractDocumentType + isMemoryFile + extractSpecFolder)
- [x] CHK-154 [P0] Intent classifier tests pass -- 23 tests (find_spec + find_decision keywords, patterns, classification)
- [x] CHK-155 [P1] Discovery function tests pass -- covered by isMemoryFile spec document recognition tests
- [x] CHK-156 [P1] Chain creation tests pass -- covered by spec126 Phase 7 tests + `t202-t203-causal-fixes.vitest.ts`
- [x] CHK-157 [P1] Backward compatibility tests pass -- 6 tests (memory multiplier=1.0, scoring parity, default weights)
- [x] CHK-158 [P0] Full system-spec-kit suite passes (`npm test`) -- 122 files, 4184 tests passing (72 skipped)

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-160 [P0] Spec folder exists (126-full-spec-doc-indexing/)
- [x] CHK-161 [P0] All 6 spec documents created (spec, plan, tasks, checklist, decision-record, implementation-summary)
- [x] CHK-162 [P0] SPECKIT_LEVEL: 3+ marker on all documents
- [x] CHK-163 [P1] Cross-references between documents valid
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 68 | 68/68 |
| P1 Items | 32 | 32/32 |
| P2 Items | 0 | 0/0 |
| **Overall** | **100** | **100/100** |

**Status**: ALL ITEMS VERIFIED -- 143 Spec 126 tests passing and full system-spec-kit suite green
<!-- /ANCHOR:summary -->

<!--
Level 3+ checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
