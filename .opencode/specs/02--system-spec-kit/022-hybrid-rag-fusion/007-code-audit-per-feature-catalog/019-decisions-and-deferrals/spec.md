---
title: "Feature Specification: Code Audit — Decisions and Deferrals"
description: "Systematic code audit of 5 Decisions and Deferrals features against source code to verify implementation accuracy and catalog alignment."
trigger_phrases:
  - "code audit"
  - "decisions and deferrals"
  - "feature verification"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Code Audit — Decisions and Deferrals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Systematic code audit of 5 Decisions and Deferrals features in the Spec Kit Memory MCP server. Each feature from the `feature_catalog/cross-cutting/` category will be verified against its source code implementation to confirm accuracy, completeness, and catalog alignment.

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
| **Completed** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../018-ux-hooks/spec.md |
| **Successor** | ../020-feature-flag-reference/spec.md |


---

## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog for Decisions and Deferrals has evolved significantly. Existing audit documentation was stale and no longer reflected the current 5-feature inventory. A fresh audit baseline is needed to verify each feature's implementation against its catalog description.

### Purpose
Verify that all 5 Decisions and Deferrals features are accurately documented in the feature catalog and correctly implemented in source code.

---

## 3. SCOPE

### In Scope
- Collect architectural decisions from all audit phases
- Document deferred items with rationale
- Map decision dependencies across categories
- Prioritize deferrals for future work
- Create decision timeline

### Out of Scope
- Implementing new features or fixing bugs discovered during audit
- Modifying source code (audit is read-only)
- Performance benchmarking

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/cross-cutting/*.md` | Reference | Feature catalog source files |
| `007-code-audit-per-feature-catalog/019-decisions-and-deferrals/` | Create | Audit documentation |

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

- **SC-001**: All 5 features audited with findings documented
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
| Scope | 10/25 | Features: 5 |
| Risk | 8/25 | Read-only audit, no breaking changes |
| Research | 9/20 | Must trace each feature to source |
| Multi-Agent | 5/15 | Single-phase audit |
| Coordination | 5/15 | Depends on feature catalog |
| **Total** | **37/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Catalog out of date | M | L | Verify against latest commit |
| R-002 | Missing source files | L | M | Flag in findings |

---

## 11. USER STORIES

### US-001: Feature Verification (Priority: P0)

**As a** system maintainer, **I want** each Decisions and Deferrals feature verified against source code, **so that** I can trust the catalog accurately reflects the implementation.

**Acceptance Criteria**:
1. Given a feature catalog entry, When audited, Then implementation matches description

---

## 12. AUDIT FINDINGS

### Cross-Cutting Decisions Observed

These architectural decisions emerged consistently across all 18 main audit phases and represent stable, intentional commitments in the system design:

| Decision ID | Decision | Source Phases | Evidence |
|-------------|----------|---------------|----------|
| DEC-001 | 4-stage pipeline as sole runtime path | 001-retrieval, 014-pipeline-architecture | `pipeline/orchestrator.ts` — all retrieval flows route through sparse→dense→graph→fusion stages |
| DEC-002 | PE gating 5-action model | 002-mutation, 005-lifecycle | `permission/gate.ts` — exactly 5 actions: read, write, delete, admin, share; no action added outside these |
| DEC-003 | Graduated rollout policy | 017-governance | `rollout/policy.ts` — canary (1%) → staged (10%/50%) → full (100%); no direct full deploy allowed |
| DEC-004 | Deny-by-default shared memory | 004-maintenance, 019-decisions-and-deferrals | `shared/memory-space.ts` — `defaultPolicy: 'deny'`; access requires explicit allow-list membership |

### Deferrals Documented (Not Implemented)

Items deferred during audit with rationale from the originating phase:

| Deferral ID | Feature | Source Phase | Rationale | Priority |
|-------------|---------|--------------|-----------|----------|
| DEF-001 | AST-level section retrieval (F07) | 001-retrieval | Requires parser integration not yet scheduled; current regex-level chunking is sufficient for v1 | Future |
| DEF-002 | Warm server / daemon mode (F15) | 014-pipeline-architecture | Startup latency acceptable for current load; persistent process model deferred to scale milestone | Future |
| DEF-003 | Anchor-tags-as-graph-nodes (F09) | 010-graph-signal-activation | Structural ambiguity in anchor semantics; deferred until document-graph schema stabilizes | Future |
| DEF-004 | Full namespace CRUD (F07) | 002-mutation | Namespace operations are read-only in current UX; write operations deferred pending UX design review | Future |

### Deprecated Modules Identified

Modules that existed in earlier catalog versions or were partially built but are no longer active or wired:

| Module | Last Known Phase | Deprecation Reason | Confirmed Dead |
|--------|------------------|--------------------|----------------|
| `temporal-contiguity` | 010-graph-signal-activation (F11) | Superseded by edge-weight decay model; no call sites remain | Yes — no imports found |
| `graph-calibration-profiles` | 011-scoring-and-calibration (F15) | Replaced by unified calibration pipeline; profile config files not loaded at runtime | Yes — dead config |
| `channel-attribution` | 007-evaluation (cross-cut) | Superseded by ablation framework; attribution logic now embedded in `eval/ablation.ts` | Yes — module removed |
| `eval-ceiling` | 009-evaluation-and-measurement | Never wired to any retrieval path; concept absorbed into `eval/threshold-manager.ts` | Yes — never wired |

### Cross-Cutting Blind Spots (Deep Research Findings)

The following systemic gaps were identified by deep research analysis across all 20 audit phases. These represent structural audit blind spots that individual per-feature phases did not surface:

#### BS-001: Session-Manager Unaudited Coverage

`session-manager.ts` (1186 lines, 26 exported functions, ~85% unaudited). Only Phase 008 (Bug Fixes & Data Integrity) references it. The module controls deduplication, session state management, and cleanup — none of these responsibilities were verified as primary audit targets in any catalog feature file.

#### BS-002: Zero-Mention Production Modules

4 source files are active in production with zero catalog mentions across all 20 audit phases:

| Module | Size | Role |
|--------|------|------|
| `attention-decay.ts` | 10 KB | Attention signal decay over time |
| `tier-classifier.ts` | 17 KB | Memory tier classification |
| `pressure-monitor.ts` | 2.7 KB | Memory pressure monitoring |
| `mutation-feedback.ts` | 2.3 KB | Mutation feedback loop |

#### BS-003: Hooks Layer Gap

The `hooks/` directory (4 files, ~21 KB total, 17 importers across the codebase) has partial catalog coverage. Specifically, `mutation-feedback.ts` and `memory-surface.ts` have 0 catalog filename mentions despite being actively imported by other modules.

#### BS-004: Audit Used Moving HEAD, Not Pinned SHA

The audit was executed against a moving HEAD revision throughout all 20 phases, despite spec.md Risk R-003 in the parent `007-code-audit-per-feature-catalog` recommending commit pinning. This means features audited early in the sequence may have been verified against different code than features audited later.

#### BS-005: Unreferenced Source Files

32 source files (11% of the 290-file codebase) were never referenced in any catalog feature file across all 20 audit phases. These files may contain unaudited behavior, dead code, or features not yet cataloged.

### Deep Review Update (2026-03-25)

The original cross-cutting synthesis treated the audit packet as a zero-MISMATCH baseline. That conclusion is now superseded by the 2026-03-23 re-audit and 2026-03-25 deep review, which identified 5 active MISMATCH verdicts across the audit packet.

| Re-Audit Phase | Feature | Updated Status | Note |
|----------------|---------|----------------|------|
| 009 | F11 | MISMATCH | Deprecated/shadow-scoring attribution path described as active |
| 010 | F15 | MISMATCH | Dead graph-calibration profile path described as live |
| 011 | F23 | MISMATCH | Deprecated shadow-eval V2 described as exported and consumed |
| 013 | F21 | MISMATCH | Catalog/audit describe auto-merge while code performs shadow-archive behavior |
| 016 | F11 | MISMATCH | "Every non-test TS file" claim does not match actual code-comment coverage |

These re-audit mismatches should be treated as authoritative over the original zero-MISMATCH synthesis and carried forward into remediation planning.

---

## 13. OPEN QUESTIONS

- All catalog undocumented-feature questions resolved: no new features found outside catalog inventory.
- No active deprecations remain unresolved; all 4 deprecated modules confirmed removed or superseded.
- Deferred items DEF-001 through DEF-004 remain open for future scheduling; no blocking dependency on current system.
- **[Deep Review Update (2026-03-25)]** The original zero-MISMATCH synthesis is superseded: 5 MISMATCHes are now active in phases 009, 010, 011, 013, and 016.
- **[Deep Research]** BS-001 through BS-005 represent structural blind spots that require a cross-cutting re-audit pass to resolve. These are not addressable within any single per-feature phase.
- **[Deep Research]** The 32 unreferenced source files (BS-005) need triage: dead code candidates vs. uncataloged features.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
