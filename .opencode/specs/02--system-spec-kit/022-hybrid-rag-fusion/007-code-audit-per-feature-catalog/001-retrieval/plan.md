---
title: "Implementation Plan: Code Audit — Retrieval"
description: "Technical plan for auditing 10 Retrieval features against source code"
trigger_phrases:
  - "audit plan"
  - "retrieval"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Retrieval

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (Node.js) |
| **Framework** | MCP server (Model Context Protocol) |
| **Storage** | better-sqlite3 |
| **Testing** | Manual code review + cross-reference |

### Overview
Audit each of the 10 Retrieval features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 10 features audited
- [x] Findings documented per feature
- [x] Summary report completed

---

## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/01--retrieval/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Retrieval
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Unified context retrieval (memory_context)
- [x] Audit: Semantic and lexical search (memory_search)
- [x] Audit: Trigger phrase matching (memory_match_triggers)
- [x] Audit: Hybrid search pipeline
- [x] Audit: 4-stage pipeline architecture
- [x] Audit: BM25 trigger phrase re-index gate
- [x] Audit: AST-level section retrieval tool
- [x] Audit: Quality-aware 3-tier search fallback
- [x] Audit: Tool-result extraction to working memory
- [x] Audit: Fast delegated search (memory_quick_search)

### Phase 3: Synthesis
- [x] Cross-reference findings across features
- [x] Identify systemic patterns
- [x] Compile summary report

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | All 10 features covered | Checklist verification |
| Accuracy | Catalog matches implementation | Manual review |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot audit without reference |
| Source code access | Internal | Green | Cannot verify implementation |

---

## 7. ROLLBACK PLAN

- **Trigger**: Audit methodology proves inadequate
- **Procedure**: Revise approach and restart from Phase 1

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Prep) ──► Phase 2 (Audit 10 features) ──► Phase 3 (Synthesis)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | Medium | 10 features |
| Synthesis | Medium | 1 session |

---

## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 10/10 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

## FINDINGS SUMMARY

Audit completed 2026-03-22. 10/10 features audited.

### Results at a Glance

| # | Feature | Verdict |
|---|---------|---------|
| 01 | Unified context retrieval (memory_context) | MATCH |
| 02 | Semantic and lexical search (memory_search) | MATCH with GAPS |
| 03 | Trigger phrase matching (memory_match_triggers) | MATCH |
| 04 | Hybrid search pipeline | MATCH |
| 05 | 4-stage pipeline architecture | MATCH |
| 06 | BM25 trigger phrase re-index gate | MATCH |
| 07 | AST-level section retrieval tool | MATCH (DEFERRED) |
| 08 | Quality-aware 3-tier search fallback | PARTIAL |
| 09 | Tool-result extraction to working memory | MATCH |
| 10 | Fast delegated search (memory_quick_search) | MATCH |

**Overall**: 8 MATCH, 1 MATCH with GAPS, 1 PARTIAL

### Key Issues Found

1. **Feature 02 catalog gap** — 15+ source files absent from the catalog entry (`adaptive-ranking.ts`, `scope-governance.ts`, `profile-formatters.ts`, `progressive-disclosure.ts`, `session-state.ts`, `chunk-reassembly.ts`, `search-utils.ts`, `eval-channel-tracking.ts`, `feedback-ledger.ts`, `shared-spaces.ts`, `query-decomposer.ts`, `entity-linker.ts`, `llm-reformulation.ts`, `hyde.ts`, `stage2b-enrichment.ts`).
2. **Feature 08 incorrect source file** — `stage4-filter.ts` listed for quality fallback but handles memory-state filtering; wrong reference.
3. **Feature 05 missing files** — `stage2b-enrichment.ts` and `ranking-contract.ts` absent from catalog.

### Undocumented Implementation Details Surfaced

- `TURN_DECAY_RATE=0.98` (Feature 03)
- `MENTION_BOOST_FACTOR=0.05` (Feature 09)
- Stage 4 per-tier limits: HOT=50, WARM=30, COLD=20, DORMANT=10, ARCHIVED=5 (Feature 05)
- RSF shadow fusion inactive at runtime despite being labeled an operational stage (Feature 04)

### Recommended Follow-Up Actions

- Update Feature 02 catalog entry to add 15 missing source files.
- Correct Feature 08 catalog entry: replace `stage4-filter.ts` with the correct quality-fallback file.
- Update Feature 05 catalog entry to include `stage2b-enrichment.ts` and `ranking-contract.ts`.
- Optionally document the three undocumented constants above in their respective catalog entries.
