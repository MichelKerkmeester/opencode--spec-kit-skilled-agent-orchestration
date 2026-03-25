---
title: "Feature Specification: Code Audit — Query Intelligence"
description: "Systematic code audit of 11 Query Intelligence features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "query intelligence"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Query Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 11 Query Intelligence features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/12--query-intelligence/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

**Key Decisions**: Audit against current feature catalog as source of truth, document findings per feature

**Critical Dependencies**: Feature catalog must be current and accurate

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |

Parent: 007-code-audit-per-feature-catalog

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Query Intelligence has evolved significantly. Existing audit documentation was stale and no longer reflected the current 11-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 11 Query Intelligence features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Query complexity router
- Relative score fusion in shadow mode
- Channel min-representation
- Confidence-based result truncation
- Dynamic token budget allocation
- Query expansion
- LLM query reformulation
- HyDE (Hypothetical Document Embeddings)
- Index-time query surrogates
- Query decomposition
- Graph concept routing

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/12--query-intelligence/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/012-query-intelligence/` | Create | Audit documentation |

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

- **SC-001**: All 11 features audited with findings documented
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
| Scope | 16/25 | Features: 11 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 11/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **45/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Query Intelligence feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. OPEN QUESTIONS

- Are there undocumented features in this category not yet in the catalog?
- Have any features been deprecated since the last catalog update?

**Resolved by audit (2026-03-22; refreshed 2026-03-25):**
- No undocumented features found; all 11 catalog entries still map conceptually to the codebase.
- F02: RSF has been removed from the live implementation, but stale references still remain in the catalog and packet cross-references.
- F07: `llm-reformulation.ts` runtime default is TRUE and now aligns with the catalog.
- F08: `hyde.ts` runtime default is TRUE and now aligns with the catalog.
- F09: Query surrogate matching is wired into Stage 1; the prior dead-code finding is stale.
- F10: Deep-mode candidate generation bypasses the faceted decomposition helper, so the feature is only PARTIAL in production.

---

## 13. AUDIT FINDINGS

**Audit Date**: 2026-03-22
**Overall Result**: 9 MATCH, 2 PARTIAL — audit complete.

**Deep Review Update (2026-03-25)**: F07-F09 are restored to MATCH because runtime defaults now align with the catalog and surrogate matching is wired into Stage 1. F02 is downgraded to PARTIAL because RSF was removed while stale catalog references remain. F10 is downgraded to PARTIAL because deep-mode search bypasses faceted decomposition.

| # | Feature | Result | Notes |
|---|---------|--------|-------|
| F01 | Query complexity router | MATCH | Implementation aligns with catalog |
| F02 | Relative score fusion (shadow mode) | PARTIAL | RSF implementation was removed; stale references remain in the catalog and audit cross-references |
| F03 | Channel min-representation | MATCH | Min-rep guard verified |
| F04 | Confidence-based result truncation | MATCH | Truncation threshold logic confirmed |
| F05 | Dynamic token budget allocation | MATCH | Budget allocation confirmed |
| F06 | Query expansion | MATCH | Expansion paths verified |
| F07 | LLM query reformulation | MATCH | Runtime default TRUE now matches the catalog |
| F08 | HyDE (Hypothetical Document Embeddings) | MATCH | Runtime default TRUE now matches the catalog |
| F09 | Index-time query surrogates | MATCH | Surrogate matching is wired into Stage 1 and now matches the catalog |
| F10 | Query decomposition | PARTIAL | Deep-mode bypasses faceted decomposition |
| F11 | Graph concept routing | MATCH | Graph routing wiring verified |

### Systemic Findings

1. **Deep Review Update (2026-03-25)**: F07-F09 were stale audit verdicts rather than current implementation gaps. Runtime defaults for F07 and F08 are TRUE, and F09 surrogate matching is now wired into Stage 1, so all three features return to MATCH.
2. **RSF traceability drift (F02)**: Relative score fusion was removed from the live implementation, but stale catalog references still describe it as a live shadow-mode feature. The audit packet now reflects that drift as PARTIAL rather than MATCH.
3. **Deep-mode decomposition gap (F10)**: Production deep-mode search bypasses the faceted decomposition helper and falls back to the basic split path, so the catalog currently overstates live behavior.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
