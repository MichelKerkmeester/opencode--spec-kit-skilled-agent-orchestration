---
title: "Feature Specification: Code Audit — Analysis"
description: "Systematic code audit of 7 Analysis features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "analysis"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Analysis

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 7 Analysis features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/06--analysis/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../005-lifecycle/spec.md |
| **Successor** | ../007-evaluation/spec.md |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Analysis has evolved significantly. Existing audit documentation was stale and no longer reflected the current 7-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 7 Analysis features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Causal edge creation (memory_causal_link)
- Causal graph statistics (memory_causal_stats)
- Causal edge deletion (memory_causal_unlink)
- Causal chain tracing (memory_drift_why)
- Epistemic baseline capture (task_preflight)
- Post-task learning measurement (task_postflight)
- Learning history (memory_get_learning_history)

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/06--analysis/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/006-analysis/` | Create | Audit documentation |

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

- **SC-001**: All 7 features audited with findings documented
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
| Scope | 12/25 | Features: 7 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 10/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Analysis feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. AUDIT FINDINGS

Audit completed 2026-03-22. Results per feature:

| ID | Feature | Tool | Result | Notes |
|----|---------|------|--------|-------|
| F01 | Causal edge creation | `memory_causal_link` | MATCH | 6 relation types, upsert, strength clamping, weight history all confirmed. Missing: `graph-signals.ts`, `causal-boost.ts`, 2 test files not listed in catalog source file list. |
| F02 | Causal graph statistics | `memory_causal_stats` | MATCH | 60% coverage target, orphan detection, health status confirmed. Same missing files as F01. |
| F03 | Causal edge deletion | `memory_causal_unlink` | MATCH | Delete by ID, cascade cleanup, cache invalidation confirmed. Same missing files as F01. |
| F04 | Causal chain tracing | `memory_drift_why` | MATCH | Direction mapping, cycle detection, relation weights, depth limits all confirmed. Same missing files as F01. |
| F05 | Epistemic baseline capture | `task_preflight` | PARTIAL | Behavioral claims verified. Source file list massively bloated: 43 files listed for ~8 relevant files. All 3 analysis features (F05–F07) share identical bloated file lists. |
| F06 | Post-task learning measurement | `task_postflight` | MATCH | LI formula, interpretation bands, gap tracking all verified. Minor: re-correction capability undocumented. Same bloat as F05. |
| F07 | Learning history | `memory_get_learning_history` | PARTIAL | Filtering, summary stats, trends confirmed. Layer classification mismatch (catalog says L7, implementation uses L6). `includeSummary` param omitted from catalog. Same bloat as F05. |

**Overall**: 5 MATCH, 2 PARTIAL.

**Cross-cutting findings:**
- **CF-01 (Missing source files, F01–F04)**: `graph-signals.ts`, `causal-boost.ts`, and 2 test files are absent from all causal-feature source file lists.
- **CF-02 (Bloated source lists, F05–F07)**: All three task-analysis features share an identical source file list of ~43 files; only ~8 are relevant. Catalog should be trimmed to primary implementation files.
- **CF-03 (Layer classification, F07)**: `memory_get_learning_history` catalog claims layer L7; implementation uses L6. Catalog needs correction.
- **CF-04 (Undocumented param, F07)**: `includeSummary` parameter present in implementation but absent from catalog documentation.
- **CF-05 (Undocumented behaviour, F06)**: Re-correction capability (adjusting a prior postflight measurement) is functional but not mentioned in catalog.

---

## 13. OPEN QUESTIONS

- CF-01: Should `graph-signals.ts` and `causal-boost.ts` be added to the source file lists for F01–F04, or are they intentionally excluded?
- CF-02: What is the authoritative minimal source file list for F05–F07?
- CF-03: Is layer L6 or L7 correct for `memory_get_learning_history`?
- CF-04/CF-05: Should `includeSummary` and re-correction capability be added to catalog entries for F06–F07?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
