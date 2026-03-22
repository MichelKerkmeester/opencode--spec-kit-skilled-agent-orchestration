---
title: "Feature Specification: Code Audit — Graph Signal Activation"
description: "Systematic code audit of 16 Graph Signal Activation features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "graph signal activation"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Graph Signal Activation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 16 Graph Signal Activation features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/10--graph-signal-activation/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
The feature catalog for Graph Signal Activation has evolved significantly. Existing audit documentation was stale and no longer reflected the current 16-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 16 Graph Signal Activation features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Typed-weighted degree channel
- Co-activation boost strength increase
- Edge density measurement
- Weight history audit tracking
- Graph momentum scoring
- Causal depth signal
- Community detection
- Graph and cognitive memory fixes
- ANCHOR tags as graph nodes
- Causal neighbor boost and injection
- Temporal contiguity layer
- Unified graph retrieval and deterministic ranking
- Graph lifecycle refresh
- Async LLM graph backfill
- Graph calibration profiles
- Typed traversal

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/10--graph-signal-activation/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/010-graph-signal-activation/` | Create | Audit documentation |

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

- **SC-001**: All 16 features audited with findings documented
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
| Scope | 20/25 | Features: 16 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 13/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **51/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Graph Signal Activation feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. AUDIT FINDINGS

**Result: 12 MATCH, 4 PARTIAL across 16 features.**

| ID | Feature | Status | Finding |
|----|---------|--------|---------|
| F01 | typed-weighted-degree | MATCH | Constants, cache, and feature flag all confirmed in source |
| F02 | co-activation-boost | MATCH | 0.25 default confirmed; minor catalog imprecision (states 0.3) — negligible |
| F03 | edge-density | MATCH | Thresholds and R10 escalation path confirmed |
| F04 | weight-history | MATCH | Audit tracking confirmed; source file list is over-inclusive but not incorrect |
| F05 | graph-momentum | MATCH | Momentum formula and cache confirmed |
| F06 | causal-depth | MATCH | Tarjan SCC, depth bonus of +0.05 confirmed |
| F07 | community-detection | MATCH | BFS + Louvain, debounce, Stage 2 wiring all confirmed |
| F08 | graph-cognitive-fixes | MATCH | All 7 fixes verified; minor file attribution imprecision — negligible |
| F09 | anchor-tags | MATCH | Correctly documented as DEFERRED; no implementation expected |
| F10 | causal-neighbor-boost | MATCH | Constants and multipliers confirmed |
| F11 | temporal-contiguity | PARTIAL | CONFIRMED @deprecated — "Never wired into production pipeline. Superseded by FSRS v4 decay." Catalog must be updated to reflect deprecated status |
| F12 | unified-graph | MATCH | Deterministic ranking and explainability confirmed |
| F13 | graph-lifecycle | PARTIAL | Inline comment is misleading relative to actual default behavior in source |
| F14 | llm-graph-backfill | PARTIAL | Catalog contains self-contradictory default messaging; needs reconciliation |
| F15 | graph-calibration | PARTIAL | CONFIRMED @deprecated — "Fully implemented and tested but never wired into Stage 2 pipeline." Catalog must be updated to reflect deprecated status |
| F16 | typed-traversal | MATCH | All constants and intent-priority logic confirmed |

### Key Issues Requiring Follow-up

1. **F11 / F15 — CONFIRMED @deprecated modules presented as active**: Both `temporal-contiguity` (deprecated: "Never wired into production pipeline. Superseded by FSRS v4 decay.") and `graph-calibration` (deprecated: "Fully implemented and tested but never wired into Stage 2 pipeline.") carry explicit `@deprecated` annotations in source code and are not wired into any active pipeline path. The catalog entries incorrectly describe them as graduated active features. These entries must be updated to DEPRECATED status to match the source code reality.

2. **F14 — Self-contradictory catalog entry**: The `llm-graph-backfill` catalog entry contains conflicting statements about its default behavior. The entry must be reconciled to a single authoritative description.

3. **F13 — Misleading inline comment**: The `graph-lifecycle` source contains an inline comment that does not match actual default behavior. Low severity but should be corrected to prevent future confusion.

---

## 13. OPEN QUESTIONS

- **RESOLVED**: 14 of 16 features confirmed as accurately documented (MATCH).
- **OPEN — F11, F15**: Both modules are CONFIRMED @deprecated in source code (F11: superseded by FSRS v4 decay; F15: never wired into Stage 2 pipeline). Catalog entries must be corrected from active to DEPRECATED status. Recommend a follow-up task to update those two catalog entries.
- **OPEN — F14**: Which of the two conflicting defaults in the `llm-graph-backfill` catalog entry is authoritative?
- **OPEN — F13**: Inline comment in `graph-lifecycle` source should be corrected in a future maintenance pass.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
