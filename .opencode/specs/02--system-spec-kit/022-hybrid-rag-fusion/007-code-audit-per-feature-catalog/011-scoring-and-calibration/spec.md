---
title: "Feature Specification: Code Audit — Scoring and Calibration"
description: "Systematic code audit of 23 Scoring and Calibration features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "scoring and calibration"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Scoring and Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 23 Scoring and Calibration features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/11--scoring-and-calibration/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
The feature catalog for Scoring and Calibration has evolved significantly. Existing audit documentation was stale and no longer reflected the current 23-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 23 Scoring and Calibration features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Score normalization
- Cold-start novelty boost
- Interference scoring
- Classification-based decay
- Folder-level relevance scoring
- Embedding cache
- Double intent weighting investigation
- RRF K-value sensitivity analysis
- Negative feedback confidence signal
- Auto-promotion on validation
- Scoring and ranking corrections
- Stage 3 effectiveScore fallback chain
- Scoring and fusion corrections
- Local GGUF reranker via node-llama-cpp
- Tool-level TTL cache
- Access-driven popularity scoring
- Temporal-structural coherence scoring
- Adaptive shadow ranking
- Learned Stage 2 weight combiner
- Shadow feedback holdout evaluation
- Calibrated overlap bonus
- RRF K experimental tuning
- Fusion policy shadow evaluation V2

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/11--scoring-and-calibration/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/011-scoring-and-calibration/` | Create | Audit documentation |

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

- **SC-001**: All 23 features audited with findings documented
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
| Scope | 20/25 | Features: 23 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 15/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **53/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Scoring and Calibration feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. AUDIT FINDINGS

Audit completed 2026-03-22. 23 features verified. Result: **20 MATCH, 3 PARTIAL**.

### MATCH (20/23)

| ID | Feature | Finding |
|----|---------|---------|
| F01 | Score normalization | Confirmed in source |
| F02 | Cold-start novelty boost | Confirmed in source |
| F03 | Interference scoring | Confirmed in source |
| F04 | Classification-based decay | Confirmed in source |
| F05 | Folder-level relevance scoring | Confirmed in source |
| F06 | Embedding cache | Confirmed in source |
| F07 | Double intent weighting investigation | Confirmed in source |
| F08 | RRF K-value sensitivity analysis | Confirmed in source |
| F09 | Negative feedback confidence signal | Confirmed in source |
| F10 | Auto-promotion on validation | Confirmed in source |
| F11 | Scoring and ranking corrections | Confirmed in source |
| F12 | Stage 3 effectiveScore fallback chain | Confirmed in source |
| F14 | Local GGUF reranker via node-llama-cpp | Confirmed in source |
| F15 | Tool-level TTL cache | Confirmed in source |
| F16 | Access-driven popularity scoring | Confirmed in source |
| F17 | Temporal-structural coherence scoring | Confirmed in source |
| F18 | Adaptive shadow ranking | Confirmed in source |
| F19 | Learned Stage 2 weight combiner | Confirmed in source |
| F20 | Shadow feedback holdout evaluation | Confirmed in source |
| F21 | Calibrated overlap bonus | Confirmed in source |

### PARTIAL (3/23)

| ID | Feature | Issue |
|----|---------|-------|
| F13 | Scoring and fusion corrections | Catalog lists file paths without `pipeline/` prefix — paths should be `pipeline/<file>` |
| F22 | RRF K experimental tuning | Function name mismatch: catalog says `perIntentKSweep`, implementation uses `runJudgedKSweep` |
| F23 | Fusion policy shadow evaluation V2 | Flag accessor `isShadowFeedbackEnabled()` confirmed in `search-flags.ts:397`. Corrected per deep research iteration 3+9 verification. |

### Systemic Patterns
All behavioral descriptions are accurate. The three PARTIAL findings are limited to file path and naming precision (no functional discrepancies). No deprecated features detected. No undocumented features identified.

---

## 13. OPEN QUESTIONS

- F13: Confirm canonical path prefix for scoring/fusion correction files (`pipeline/` vs root).
- F22: Determine whether `perIntentKSweep` is an alias or whether the catalog should be updated to `runJudgedKSweep`.
- F23: Resolved — flag accessor `isShadowFeedbackEnabled()` is in `search-flags.ts:397`. Corrected per deep research iteration 3+9 verification.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
