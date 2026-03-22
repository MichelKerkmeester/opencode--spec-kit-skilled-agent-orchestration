---
title: "Feature Specification: Code Audit — Lifecycle"
description: "Systematic code audit of 7 Lifecycle features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "lifecycle"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Lifecycle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 7 Lifecycle features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/05--lifecycle/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
The feature catalog for Lifecycle has evolved significantly. Existing audit documentation was stale and no longer reflected the current 7-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 7 Lifecycle features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Checkpoint creation (checkpoint_create)
- Checkpoint listing (checkpoint_list)
- Checkpoint restore (checkpoint_restore)
- Checkpoint deletion (checkpoint_delete)
- Async ingestion job lifecycle
- Startup pending-file recovery
- Automatic archival subsystem

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/05--lifecycle/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/005-lifecycle/` | Create | Audit documentation |

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

**As a** system maintainer, **I want** each Lifecycle feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. AUDIT FINDINGS

Audit completed 2026-03-22. 7 features audited: 4 MATCH, 3 PARTIAL.

### F01 — checkpoint_create: PARTIAL

Behavioral descriptions accurate. Snapshot scope understated: catalog states 3 tables, but actual implementation captures 20 tables. Source file list is bloated and identical to F02–F04 (cross-cutting issue). 4 checkpoint test files missing from catalog.

### F02 — checkpoint_list: MATCH

Default limit 50, max 100, and specFolder filtering all confirmed against source. Source list bloat issue present (cross-cutting).

### F03 — checkpoint_restore: MATCH

clearExisting and merge modes, transaction wrapping, and post-restore rebuild all confirmed. Source list bloat present.

### F04 — checkpoint_delete: MATCH

confirmName safety guard and boolean return value confirmed. Source list bloat present.

### F05 — Async ingestion job lifecycle: MATCH

Job states, sequential worker, forecast calculation, and SQLITE_BUSY retry logic all confirmed. No discrepancies.

### F06 — Startup pending-file recovery: PARTIAL

Core recovery behavior confirmed. One test file missing from catalog: `transaction-manager-extended.vitest.ts`.

### F07 — Automatic archival subsystem: PARTIAL

Core archival behavior confirmed. **Behavioral mismatch on unarchive path**: catalog states vector re-embedding is "deferred to next scan," but code performs immediate async re-embedding. The call chain is: `unarchiveMemory()` (line 595) calls `syncVectorOnUnarchive()` (line 510), which fire-and-forgets `rebuildVectorOnUnarchive()` (line 455). That async function generates a fresh embedding via `generateDocumentEmbedding()` and inserts it into `vec_memories` in a DELETE+INSERT transaction (lines 498-501) — all within the same unarchive call, not deferred. Two source files missing from catalog: `bm25-index.ts`, `embeddings.ts`. Source: `archival-manager.ts` lines 455-515, 595-618.

---

## 13. OPEN QUESTIONS

- Are there undocumented features in this category not yet in the catalog?
- Have any features been deprecated since the last catalog update?
- **[From audit]** Should the bloated source file lists for F01–F04 be deduplicated to their actual per-feature files?
- **[From audit]** F07 catalog entry must be corrected: `rebuildVectorOnUnarchive()` (archival-manager.ts:455) performs immediate async re-embedding, not deferred to next scan.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
