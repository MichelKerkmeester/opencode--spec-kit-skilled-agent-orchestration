---
title: "Feature Specification: Code Audit — Discovery"
description: "Systematic code audit of 3 Discovery features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "discovery"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Discovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

### Executive Summary

Systematic code audit of 3 Discovery features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/03--discovery/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

**Key Decisions**: Audit against current feature catalog as source of truth, document findings per feature

**Critical Dependencies**: Feature catalog must be current and accurate

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../002-mutation/spec.md |
| **Successor** | ../004-maintenance/spec.md |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Discovery has evolved significantly. Existing audit documentation was stale and no longer reflected the current 3-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 3 Discovery features are accurately documented in the feature catalog and correctly implemented in source code.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Memory browser (memory_list)
- System statistics (memory_stats)
- Health diagnostics (memory_health)

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/03--discovery/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/003-discovery/` | Create | Audit documentation |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
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
| REQ-005 | Audit results reusable for release-control follow-up | Summary stats and companion-doc cross-references recorded in this packet |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 features audited with findings documented
- **SC-002**: Zero unverified features remaining in this category

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog accuracy | Audit based on stale catalog | Verify catalog currency first |
| Risk | Source code changed since catalog update | Med | Cross-reference git history |
| Risk | Some features span multiple source files | Low | Follow import chains |

<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit completable by AI agent in single session

### Reliability
- **NFR-R01**: Findings must be reproducible by re-reading same sources

---

## L2: EDGE CASES

### Data Boundaries
- Feature with no source files listed: Flag as catalog gap
- Feature spanning 10+ source files: Prioritize primary implementation file

### Error Scenarios
- Source file referenced in catalog no longer exists: Document as finding
- Feature partially implemented: Document completion percentage

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Features: 3 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 9/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **35/100** | **Level 3** |

---

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

### User Stories

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Discovery feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

### Audit Findings

Audit completed 2026-03-22. Results per feature:

| Feature ID | Feature | Result | Notes |
|------------|---------|--------|-------|
| F01 | memory_list (Memory browser) | MATCH | All 5 impl + 3 test files exist. Sort fallback, pagination clamping, validation error codes, response payload all verified. No discrepancies. |
| F02 | memory_stats (System statistics) | MATCH | All 6 impl + 3 test files exist. Folder ranking modes (count/recency/importance/composite), scoring fallback, totalSpecFolders, graph channel metrics all verified. No discrepancies. |
| F03 | memory_health (Health diagnostics) | PARTIAL | All 7 impl + 4 test files exist. Two report modes, status derivation, autoRepair confirmation gate, path redaction all verified. Discrepancies: (1) summarizeAliasConflicts attributed to memory-index.ts but actually in memory-index-alias.ts; (2) Full-mode response includes undocumented fields: embeddingRetry stats, repair.partialSuccess, orphan cleanup, integrity verification. |

**Overall: 2 MATCH, 1 PARTIAL.**

### F03 Discrepancy Detail

- **D1 — Wrong source attribution**: `summarizeAliasConflicts` is documented as residing in `memory-index.ts` but is actually defined in `mcp_server/handlers/memory-index-alias.ts` (line 153, verified on disk). `memory-index.ts` re-exports it (line 34). Catalog source file list should be corrected to reference the defining module.
- **D2 — Undocumented response fields**: Full-mode health response includes fields not mentioned in the catalog: `embeddingRetry` stats, `repair.partialSuccess`, orphan cleanup counts, and integrity verification results. Catalog description should be extended to cover these.

---

<!-- ANCHOR:questions -->
### Acceptance Scenarios

- **Given** a feature catalog entry in this phase, **when** the packet is reviewed, **then** the primary implementation or discrepancy is explicitly documented.
- **Given** the listed source files for a feature, **when** maintainers spot-check them against the repo, **then** the packet either confirms them or records the drift.
- **Given** a release-control follow-up session, **when** the packet is reopened, **then** the category verdict and summary statistics remain easy to find.
- **Given** the companion packet documents, **when** a validator checks cross-references, **then** the phase remains reusable inside the recursive `007` validation run.

## 10. OPEN QUESTIONS

- Are there undocumented features in this category not yet in the catalog?
- Have any features been deprecated since the last catalog update?
- **[From audit]** Should the F03 catalog entry be updated to list `memory-index-alias.ts` as a primary source file?
- **[From audit]** Should the F03 catalog entry document all undocumented full-mode response fields (embeddingRetry, repair.partialSuccess, orphan cleanup, integrity verification)?

---

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:questions -->
