---
title: "Feature Specification: Full Spec Folder Document Indexing [009-full-spec-doc-indexing/spec]"
description: "The MCP server's memory index currently only indexes 3 document types: memory files (specs/*/memory/*.md), READMEs, and constitutional files. This misses the most valuable proje..."
trigger_phrases:
  - "feature"
  - "specification"
  - "full"
  - "spec"
  - "folder"
  - "009"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Full Spec Folder Document Indexing

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The MCP server's memory index currently only indexes 3 document types: memory files (`specs/*/memory/*.md`), READMEs, and constitutional files. This misses the most valuable project knowledge: **spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and research.md** -- the actual spec folder documents that represent authoritative project knowledge. This spec adds full indexing of these documents with higher priority scoring than regular memories, enabling agents to find authoritative specifications when searching.

- **Key Decisions**: Add `document_type` and `spec_level` columns (not overload `context_type`); use scoring multipliers (not new importance tier); whole-document indexing (not section-level)
- **Critical Dependencies**: SQLite schema migration v12->v13, existing `causal_edges` table for relationship chains

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 -- Core capability gap |
| **Status** | Implemented |
| **Created** | 2026-02-16 |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When an agent searches for "how did we implement feature X?" or "what was the plan for Y?", it finds nothing -- or at best, a memory file that partially summarizes it. The spec folder documents (spec.md, plan.md, decision-record.md, etc.) contain the authoritative project knowledge but are completely invisible to the search system. This is the single biggest flaw in the memory system.

### Purpose

Index all spec folder documents with higher priority than regular memories, enabling agents to surface authoritative specifications, plans, and decision records in response to relevant queries.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Schema migration adding `document_type` and `spec_level` columns
- Discovery crawler for spec folder documents in `.opencode/specs/`
- Parser enhancements to classify spec documents by type
- Document-type-aware scoring multipliers (spec docs rank higher)
- Causal relationship chains between spec documents (spec -> plan -> tasks)
- Intent classifier enhancements for `find_spec` and `find_decision` intents
- Feature flag (`SPECKIT_INDEX_SPEC_DOCS`) and per-call `includeSpecDocs` parameter
- Backward compatibility: existing memories unaffected

### Out of Scope

- Section-level indexing within spec documents (future via `anchor_id`)
- New importance tier (would require table recreation)
- Cross-spec-folder relationship linking
- Automatic spec document creation or updating

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-impl.ts` | Modified | Schema v13 migration, DDL, INSERT columns |
| `shared/normalization.ts` | Modified | Add document_type, spec_level to types/converters |
| `mcp_server/lib/config/memory-types.ts` | Modified | DocumentType, SPEC_DOCUMENT_CONFIGS, inferDocumentTypeFromPath() |
| `mcp_server/handlers/memory-index.ts` | Modified | findSpecDocuments(), detectSpecLevel(), scan integration, chain creation |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | isMemoryFile(), extractSpecFolder(), extractDocumentType() |
| `mcp_server/handlers/memory-save.ts` | Modified | calculateDocumentWeight(), indexMemoryFile() SQL |
| `mcp_server/lib/scoring/composite-scoring.ts` | Modified | DOCUMENT_TYPE_MULTIPLIERS, scoring functions |
| `mcp_server/lib/scoring/importance-tiers.ts` | Modified | getDefaultTierForDocumentType() |
| `mcp_server/lib/storage/causal-edges.ts` | Modified | createSpecDocumentChain() |
| `mcp_server/lib/search/intent-classifier.ts` | Modified | find_spec, find_decision intents |
| `mcp_server/tools/types.ts` | Modified | includeSpecDocs in ScanArgs |
| `mcp_server/tool-schemas.ts` | Modified | Tool schema with includeSpecDocs param |
| `mcp_server/lib/search/vector-index.ts` | Modified | IndexMemoryParams, MemoryIndexRow types |
| `mcp_server/configs/search-weights.json` | Modified | documentTypeMultipliers config |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Schema migration adds document_type column | `ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'` succeeds; existing rows default to 'memory' |
| REQ-002 | Schema migration adds spec_level column | `ALTER TABLE memory_index ADD COLUMN spec_level INTEGER` succeeds |
| REQ-003 | Spec documents discovered during scan | `findSpecDocuments()` returns paths to spec.md, plan.md, etc. in `.opencode/specs/` |
| REQ-004 | Spec documents classified by type | `extractDocumentType()` maps spec.md->'spec', plan.md->'plan', etc. |
| REQ-005 | Spec documents indexed in database | `indexMemoryFile()` stores document_type and spec_level in INSERT/UPDATE |
| REQ-006 | Spec documents score higher than memories | `DOCUMENT_TYPE_MULTIPLIERS.spec = 1.4` applied in scoring |
| REQ-007 | Backward compatibility | Existing memory files continue to work with document_type='memory', multiplier=1.0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Causal chains between spec documents | `createSpecDocumentChain()` creates CAUSED/SUPPORTS edges |
| REQ-009 | Intent classifier recognizes spec queries | `find_spec` and `find_decision` intents classified correctly |
| REQ-010 | Feature flag opt-out | `SPECKIT_INDEX_SPEC_DOCS=false` disables spec doc discovery |
| REQ-011 | Per-call control | `includeSpecDocs: false` on scan tool skips spec docs |
| REQ-012 | Migration backfill | Existing constitutional/readme rows get correct document_type |
| REQ-013 | Spec level detection | `detectSpecLevel()` reads SPECKIT_LEVEL marker or uses heuristic |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: `memory_index_scan` discovers and indexes spec folder documents
- SC-002: `memory_search "spec requirements"` returns spec.md ranked higher than memory files
- SC-003: `memory_search "why decision"` returns decision-record.md ranked high
- SC-004: Existing memory searches return same quality results (no regression)
- SC-005: `SELECT document_type, COUNT(*) FROM memory_index GROUP BY document_type` shows multiple types
- SC-006: Causal edges exist between spec folder documents

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Technical | SQLite ALTER TABLE limitations | Medium | Use ADD COLUMN (always works), not modify |
| Technical | Embedding cost for many spec docs | Low | Whole-document indexing limits entry count |
| Performance | Scan time increase | Low | Incremental indexing skips unchanged files |
| Compatibility | Existing queries return different results | Medium | Multiplier is 1.0 for 'memory' type -- no change |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- NFR-P01: Scan with spec docs completes within 2x normal scan time
- NFR-P02: Search latency unchanged for memory-only queries

### Reliability

- NFR-R01: Migration handles pre-existing columns gracefully (duplicate column guard)
- NFR-R02: Missing spec docs don't cause scan failures

<!-- /ANCHOR:nfr -->

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY ASSESSMENT

| Category | Score | Notes |
|----------|-------|-------|
| Scope | 20/25 | 14 files modified, schema migration, new indexing pipeline |
| Risk | 15/25 | Schema migration is additive-only; backward compatible |
| Research | 10/20 | Well-understood patterns; SQLite ALTER TABLE is safe |
| Multi-Agent | 15/15 | 8 implementation phases, parallel execution possible |
| Coordination | 12/15 | Cross-file type consistency critical |
| **Total** | **72/100** | Level 3 (borderline 3+) |

<!-- /ANCHOR:complexity -->

---

## 9. ARCHITECTURE DECISIONS

See `decision-record.md` for full ADRs:
- ADR-001: Add document_type column (not overload context_type)
- ADR-002: Use scoring multipliers (not new importance tier)
- ADR-003: Whole-document indexing (not section-level)
- ADR-004: Existing causal_edges table for relationship chains
- ADR-005: Feature flag for opt-out control

---

## 10. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Approved | 2026-02-16 |
| Design Review | User | Approved | 2026-02-16 |
| Implementation Review | Pending | -- | -- |
| Launch Approval | Pending | -- | -- |

---

<!-- ANCHOR:changelog -->
## 11. CHANGE LOG

### v1.0 (2026-02-16)
- Initial specification
- All 8 implementation phases defined
- 14 files identified for modification

<!-- /ANCHOR:changelog -->

---

## 12. RELATED DOCUMENTS

- Implementation Plan: See `plan.md`
- Task Breakdown: See `tasks.md`
- Verification Checklist: See `checklist.md`
- Decision Records: See `decision-record.md`
- Implementation Summary: See `implementation-summary.md`

<!--
LEVEL 3+ SPEC
- Core + L2 + L3 + L3+ addendums
- Full governance controls
-->
