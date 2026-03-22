---
title: "Feature Specification: Code Audit — Memory Quality and Indexing"
description: "Systematic code audit of 24 Memory Quality and Indexing features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "memory quality and indexing"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Memory Quality and Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 24 Memory Quality and Indexing features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/13--memory-quality-and-indexing/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

**Key Decisions**: Audit against current feature catalog as source of truth, document findings per feature

**Critical Dependencies**: Feature catalog must be current and accurate

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Memory Quality and Indexing has evolved significantly. Existing audit documentation was stale and no longer reflected the current 24-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 24 Memory Quality and Indexing features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Verify-fix-verify memory quality loop
- Signal vocabulary expansion
- Pre-flight token budget validation
- Spec folder description discovery
- Pre-storage quality gate
- Reconsolidation-on-save
- Smarter memory content generation
- Anchor-aware chunk thinning
- Encoding-intent capture at index time
- Auto entity extraction
- Content-aware memory filename generation
- Duplicate and empty content prevention
- Entity normalization consolidation
- Quality gate timer persistence
- Deferred lexical-only indexing
- Dry-run preflight for memory_save
- Outsourced agent handback protocol
- Session enrichment and alignment guards
- Post-save quality review
- Weekly batch feedback learning
- Assistive reconsolidation
- Implicit feedback log
- Hybrid decay policy
- Save quality gate exceptions

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/13--memory-quality-and-indexing/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/` | Create | Audit documentation |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each feature verified against source code | Every feature file cross-referenced with implementation |
| REQ-002 | Discrepancies documented | Any catalog-vs-code mismatches recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Source file references validated | All listed source files confirmed to exist |
| REQ-004 | Feature interactions mapped | Cross-feature dependencies documented |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 24 features audited with findings documented
- **SC-002**: Zero unverified features remaining in this category

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | Audit based on stale catalog | Verify catalog currency first |
| Risk | Source code changed since catalog update | Med | Cross-reference git history |
| Risk | Some features span multiple source files | Low | Follow import chains |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit completable by AI agent in single session

### Reliability
- **NFR-R01**: Findings must be reproducible by re-reading same sources

---

## 8. EDGE CASES

### Data Boundaries
- Feature with no source files listed: Flag as catalog gap
- Feature spanning 10+ source files: Prioritize primary implementation file

### Error Scenarios
- Source file referenced in catalog no longer exists: Document as finding
- Feature partially implemented: Document completion percentage

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Features: 24 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 16/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **54/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Memory Quality and Indexing feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. AUDIT FINDINGS

Audit completed 2026-03-22. 24 features verified. Overall result: **20 MATCH, 4 PARTIAL**.

### Feature Results

| ID | Feature | Result | Notes |
|----|---------|--------|-------|
| F01 | Verify-fix-verify memory quality loop | MATCH | |
| F02 | Signal vocabulary expansion | MATCH | |
| F03 | Pre-flight token budget validation | MATCH | |
| F04 | Spec folder description discovery | MATCH | |
| F05 | Pre-storage quality gate | MATCH | |
| F06 | Reconsolidation-on-save | MATCH | |
| F07 | Smarter memory content generation | MATCH | |
| F08 | Anchor-aware chunk thinning | MATCH | |
| F09 | Encoding-intent capture at index time | MATCH | |
| F10 | Auto entity extraction | MATCH | |
| F11 | Content-aware memory filename generation | PARTIAL | `slugToTitle` lives in `scripts/core/title-builder.ts` but that file is missing from catalog source list |
| F12 | Duplicate and empty content prevention | PARTIAL | Primary file `scripts/core/file-writer.ts` missing from catalog; source list bloated with 55+ unrelated files |
| F13 | Entity normalization consolidation | PARTIAL | `entity-linker.ts` missing from source list in catalog |
| F14 | Quality gate timer persistence | PARTIAL | Source list massively inflated; many listed files are unrelated |
| F15 | Deferred lexical-only indexing | MATCH | |
| F16 | Dry-run preflight for memory_save | MATCH | |
| F17 | Outsourced agent handback protocol | MATCH | |
| F18 | Session enrichment and alignment guards | MATCH | |
| F19 | Post-save quality review | MATCH | |
| F20 | Weekly batch feedback learning | MATCH | |
| F21 | Assistive reconsolidation | MATCH | |
| F22 | Implicit feedback log | MATCH | |
| F23 | Hybrid decay policy | MATCH | `applyHybridDecayPolicy` IS a named export in `fsrs-scheduler.ts` (line 478); catalog is accurate |
| F24 | Save quality gate exceptions | MATCH | |

### PARTIAL Finding Details

**F11 — title-builder.ts missing from catalog**: The catalog describes `slugToTitle()` in the feature overview but does not list its actual location (`scripts/core/title-builder.ts`) in the source files table. The function does not exist in `slug-utils.ts` (the only slug-related file listed). Catalog source list needs `title-builder.ts` added.

**F12 — Duplicate gate source list bloated**: The primary implementation file (`scripts/core/file-writer.ts` containing `validateContentSubstance` and `checkForDuplicateContent`) is not listed in the catalog. Meanwhile the catalog lists 55+ files (spanning embedding providers, scoring, vector index, etc.) whose relationship to duplicate/empty prevention is indirect or absent.

**F13 — entity-linker.ts missing**: The entity normalization consolidation feature relies on `entity-linker.ts` as a primary implementation file, but that file is absent from the catalog's source list.

**F14 — Quality gate timer persistence source list inflated**: The catalog lists significantly more source files than actually implement the timer persistence logic. Many listed files touch the quality gate tangentially or not at all.

**F23 — CORRECTED (now MATCH)**: Original audit claimed `applyHybridDecayPolicy` was not a named export. Verification shows it IS explicitly exported at line 478 of `fsrs-scheduler.ts` via `export { ... applyHybridDecayPolicy ... }`. The catalog description is accurate. This finding was a hallucinated audit error.

---

## 13. OPEN QUESTIONS

- Should `entity-linker.ts` (F13) be added to the catalog source list, or is it intentionally omitted?
- Should the bloated source lists for F12 and F14 be trimmed in a follow-on catalog-cleanup pass?
- F12: Should `scripts/core/file-writer.ts` be added as the primary source file in the catalog?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
