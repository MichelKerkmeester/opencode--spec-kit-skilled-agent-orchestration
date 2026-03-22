---
title: "Feature Specification: Code Audit — Retrieval"
description: "Systematic code audit of 10 Retrieval features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "retrieval"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Retrieval

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 10 Retrieval features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/01--retrieval/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
The feature catalog for Retrieval has evolved significantly. Existing audit documentation was stale and no longer reflected the current 10-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 10 Retrieval features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Unified context retrieval (memory_context)
- Semantic and lexical search (memory_search)
- Trigger phrase matching (memory_match_triggers)
- Hybrid search pipeline
- 4-stage pipeline architecture
- BM25 trigger phrase re-index gate
- AST-level section retrieval tool
- Quality-aware 3-tier search fallback
- Tool-result extraction to working memory
- Fast delegated search (memory_quick_search)

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/01--retrieval/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/001-retrieval/` | Create | Audit documentation |

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

- **SC-001**: All 10 features audited with findings documented
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
| Scope | 15/25 | Features: 10 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 11/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **44/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Retrieval feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. OPEN QUESTIONS

- ~~Are there undocumented features in this category not yet in the catalog?~~ **Answered**: No new features found; 15+ source files are missing from the Feature 02 catalog entry (see AUDIT FINDINGS).
- ~~Have any features been deprecated since the last catalog update?~~ **Answered**: No deprecations found. Feature 07 (AST-level section retrieval) is correctly documented as DEFERRED, not deprecated.

---

## 13. AUDIT FINDINGS

Audit completed 2026-03-22. Overall result: **8 MATCH, 2 PARTIAL**.

### Feature 01 — Unified context retrieval (memory_context): MATCH
- All 164 source files confirmed to exist.
- 7 intent types, 5 modes, token budgets (800/2000/1500/1200) all verified.
- Pressure thresholds: 0.60→focused, 0.80→quick confirmed in source.
- `SPECKIT_PRESSURE_POLICY` and `SPECKIT_FOLDER_DISCOVERY` gating confirmed.
- Minor: ~15 indirect dependency files not listed in catalog (reasonable omission, no action required).

### Feature 02 — Semantic and lexical search (memory_search): PARTIAL
- 4-stage pipeline confirmed as the sole runtime path.
- Multi-concept queries, deep mode expansion, and cache all confirmed.
- **GAP**: 15+ source files missing from catalog entry: `adaptive-ranking.ts`, `scope-governance.ts`, `profile-formatters.ts`, `progressive-disclosure.ts`, `session-state.ts`, `chunk-reassembly.ts`, `search-utils.ts`, `eval-channel-tracking.ts`, `feedback-ledger.ts`, `shared-spaces.ts`, `query-decomposer.ts`, `entity-linker.ts`, `llm-reformulation.ts`, `hyde.ts`, `stage2b-enrichment.ts`.
- Reclassified per deep research: 15+ missing source files warrants PARTIAL, not MATCH.

### Feature 03 — Trigger phrase matching (memory_match_triggers): MATCH
- Most accurately documented feature in this category.
- `TURN_DECAY_RATE=0.98`, 2× candidate fetch, and tiered content (HOT=full, WARM=150 chars, COLD+=empty) all confirmed.

### Feature 04 — Hybrid search pipeline: MATCH
- 5 channels with correct weights confirmed: Vector=1.0, FTS=0.8, BM25=0.6, Graph=0.5, Degree=0.4.
- Minor: RSF shadow fusion is labeled as an "operational stage" in the catalog but is inactive at runtime (shadow/evaluation mode only).

### Feature 05 — 4-stage pipeline architecture: MATCH
- Pipeline orchestrator, 10 s stage timeout, and 12-step Stage 2 signal order all confirmed.
- **Missing from catalog**: `stage2b-enrichment.ts`, `ranking-contract.ts`.
- Undocumented detail: Stage 4 per-tier limits HOT=50, WARM=30, COLD=20, DORMANT=10, ARCHIVED=5.

### Feature 06 — BM25 trigger phrase re-index gate: MATCH
- No discrepancies found.

### Feature 07 — AST-level section retrieval tool: MATCH
- Correctly documented as DEFERRED. No discrepancies.

### Feature 08 — Quality-aware 3-tier search fallback: PARTIAL
- `stage4-filter.ts` is incorrectly listed as a source file; it handles memory-state filtering, not quality fallback logic.

### Feature 09 — Tool-result extraction to working memory: MATCH
- Minor: `MENTION_BOOST_FACTOR=0.05` is not documented in the catalog entry.

### Feature 10 — Fast delegated search (memory_quick_search): MATCH
- No discrepancies found.

### Cross-Cutting Observations
- Feature 02 catalog entry has the largest source-file gap (15+ files).
- Feature 08 contains the only incorrect source-file reference (`stage4-filter.ts`).
- Several undocumented constants surfaced: `MENTION_BOOST_FACTOR=0.05`, Stage 4 per-tier limits, `TURN_DECAY_RATE=0.98`.
- Features 06, 07, 10 are cleanly documented with no gaps.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
