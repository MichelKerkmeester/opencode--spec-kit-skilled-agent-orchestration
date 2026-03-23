---
title: "Feature Specification: Code Audit — Retrieval Enhancements"
description: "Systematic code audit of 9 Retrieval Enhancements features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "retrieval enhancements"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Retrieval Enhancements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 9 Retrieval Enhancements features in the Spec Kit Memory MCP server. Each feature from `feature_catalog/15--retrieval-enhancements/` was verified against source code implementation to confirm accuracy, completeness, and catalog alignment.

**Outcome**: 8 MATCH, 1 PARTIAL (F09 — bloated source list, primary file identified)

**Key Decisions**: Audit against current feature catalog as source of truth; all primary source files confirmed to exist.

**Critical Dependencies**: Feature catalog current as of 2026-03-22.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Completed** | 2026-03-22 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Retrieval Enhancements had evolved significantly. Existing audit documentation was stale and no longer reflected the current 9-feature inventory. A fresh audit baseline was needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 9 Retrieval Enhancements features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- F01: Dual-scope memory auto-surface
- F02: Constitutional memory as expert knowledge injection
- F03: Spec folder hierarchy as retrieval structure
- F04: Lightweight consolidation
- F05: Memory summary search channel
- F06: Cross-document entity linking
- F07: Tier-2 fallback channel forcing
- F08: Provenance-rich response envelopes
- F09: Contextual tree injection

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files Referenced

| File Path | Role |
|-----------|------|
| `feature_catalog/15--retrieval-enhancements/*.md` | Feature catalog source (9 files) |
| `mcp_server/hooks/memory-surface.ts` | F01 primary implementation |
| `mcp_server/lib/search/retrieval-directives.ts` | F02 primary implementation |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | F03 primary implementation |
| `mcp_server/lib/storage/consolidation.ts` | F04 primary implementation |
| `mcp_server/lib/search/tfidf-summarizer.ts` | F05 primary implementation |
| `mcp_server/lib/search/entity-linker.ts` | F06 primary implementation |
| `mcp_server/lib/search/hybrid-search.ts` | F07 + F09 primary implementation |
| `mcp_server/formatters/search-results.ts` | F08 primary implementation |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Status | Evidence |
|----|-------------|--------|----------|
| REQ-001 | Each feature verified against source code | DONE | All 9 features cross-referenced |
| REQ-002 | Discrepancies documented | DONE | F09 PARTIAL — see §12 Findings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Status | Evidence |
|----|-------------|--------|----------|
| REQ-003 | Source file references validated | DONE | All primary source files confirmed to exist |
| REQ-004 | Feature interactions mapped | DONE | F06 depends on R10 entity catalog; F07 wired into hybrid-search pipeline |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 9 features audited with findings documented — ACHIEVED
- **SC-002**: Zero unverified features remaining in this category — ACHIEVED

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Resolution |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | Audit based on stale catalog | Verified current as of 2026-03-22 |
| Risk | Source code changed since catalog update | Med | All primary source files confirmed to exist |
| Risk | Some features span multiple source files | Low | F01 and F09 are broad; primary files identified |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit completable by AI agent in single session — ACHIEVED

### Reliability
- **NFR-R01**: Findings reproducible by re-reading same sources — ACHIEVED (all sources are static catalog files)

---

## 8. EDGE CASES

### Data Boundaries
- Feature with no source files listed: None found — all 9 features have source file lists
- Feature spanning 10+ source files: F01 (35 impl files) and F09 (50+ impl files) — primary files identified

### Findings
- F09 source list contains incidental dependency files (vector index, embedding providers, etc.) that are not primary to contextual tree injection. Primary implementation is `hybrid-search.ts` with `SPECKIT_CONTEXT_HEADERS` gate; primary test is `hybrid-search-context-headers.vitest.ts`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Features: 9 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 11/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **43/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Resolution |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verified current as of 2026-03-22 |
| R-002 | Missing source files | L | M | All primary source files confirmed to exist |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Retrieval Enhancements feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description — SATISFIED for F01-F08 (MATCH), PARTIAL for F09 (source list bloated)

---

## 12. AUDIT FINDINGS

| ID | Feature | Result | Notes |
|----|---------|--------|-------|
| F01 | Dual-scope memory auto-surface | MATCH | `hooks/memory-surface.ts` + `context-server.ts` confirmed; 4 000-token budget, tool-dispatch + compaction hooks verified |
| F02 | Constitutional memory as expert knowledge injection | MATCH | `lib/search/retrieval-directives.ts` confirmed; imperative-verb extraction, 120-char cap, 2 000-char scan limit verified |
| F03 | Spec folder hierarchy as retrieval structure | MATCH | `lib/search/spec-folder-hierarchy.ts` confirmed; two-pass build, relevance scores (1.0/0.8/0.6/0.5/0.3 floor), WeakMap 60s TTL cache verified |
| F04 | Lightweight consolidation | MATCH | `lib/storage/consolidation.ts` confirmed; contradiction scan (0.85 cosine), Hebbian +0.05/30d decay, 90-day staleness, `SPECKIT_CONSOLIDATION` flag verified |
| F05 | Memory summary search channel | MATCH | `lib/search/tfidf-summarizer.ts` + `lib/search/memory-summaries.ts` confirmed; top-3 sentence extraction, `memory_summaries` table, 5 000-memory scale gate, `SPECKIT_MEMORY_SUMMARIES` flag verified |
| F06 | Cross-document entity linking | MATCH | `lib/search/entity-linker.ts` confirmed; `supports` relation, 0.7 strength, density guard, `SPECKIT_ENTITY_LINKING` flag, batch edge count query verified |
| F07 | Tier-2 fallback channel forcing | MATCH | `lib/search/hybrid-search.ts` confirmed; `forceAllChannels: true` on Tier-2 degradation, regression test `C138-P0-FB-T2` referenced |
| F08 | Provenance-rich response envelopes | MATCH | `formatters/search-results.ts` + `handlers/memory-search.ts` + `lib/response/envelope.ts` confirmed; `scores`, `source`, `trace` fields, `includeTrace` flag, `SPECKIT_RESPONSE_TRACE` env var verified |
| F09 | Contextual tree injection | PARTIAL | Catalog description accurate; source list contains 50+ incidental dependency files. Primary implementation: `hybrid-search.ts` (context header injection). Gate: `SPECKIT_CONTEXT_HEADERS` (default `true`). Primary test: `hybrid-search-context-headers.vitest.ts`. Catalog source list should be trimmed to primary files only. |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
