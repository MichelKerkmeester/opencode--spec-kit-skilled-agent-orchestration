---
title: "Feature Specification: ESM Module Compliance"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Feature Specification: ESM Module Compliance"
trigger_phrases:
  - "esm module compliance"
  - "mcp_server esm refactor"
  - "system-spec-kit esm migration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement"
    last_updated_at: "2026-04-29T11:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Backfill _memory.continuity per Tier 4 sk-doc template alignment"
    next_safe_action: "Refresh on next packet edit"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase manifest: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: ESM Module Compliance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + phase-parent trio stay current while child packets remain the detailed execution surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature Specification: ESM Module Compliance

### Purpose
The finished 20-iteration research in `research/research.md` locked the migration strategy that this packet now records as shipped. The delivered implementation migrated `@spec-kit/shared` and `@spec-kit/mcp-server` to native ESM, kept `@spec-kit/scripts` as CommonJS, and used explicit package-boundary async loading plus scripts-owned bridge code where CommonJS had to cross into ESM. Dual-build or conditional exports remained a fallback option only and were not needed for the shipped path.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Child packet `001-shared-esm-migration/` remains the authoritative implementation surface for its phase.
- Child packet `002-mcp-server-esm-migration/` remains the authoritative implementation surface for its phase.
- Child packet `003-scripts-interop-refactor/` remains the authoritative implementation surface for its phase.
- Child packet `004-verification-and-standards/` remains the authoritative implementation surface for its phase.
- Maintain the parent-level phase manifest, navigation pointers, and status surface only.

### Out of Scope
- Rewriting child-phase plans, tasks, or checklists from this parent packet.
- Using the parent spec as a changelog or migration-history ledger.
- Treating parent heavy docs as the source of implementation truth.

### Files to Change
| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md` | Modify/Create | parent | Lean phase-parent specification and child manifest |
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/description.json` | Modify | parent | Refresh save metadata for the migration pass |
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json` | Modify | parent | Refresh derived child pointers and save timestamp |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-shared-esm-migration/` | Shared Esm Migration | complete |
| 002 | `002-mcp-server-esm-migration/` | Mcp Server Esm Migration | complete |
| 003 | `003-scripts-interop-refactor/` | Scripts Interop Refactor | complete |
| 004 | `004-verification-and-standards/` | Verification And Standards: Verification and Standards Sync | complete |
| 005 | `005-test-and-scenario-remediation/` | Test And Scenario Remediation | complete |
| 006 | `006-review-remediation/` | Review Remediation: Deep Review Remediation | complete |
| 007 | `007-hybrid-search-null-db-fix/` | Hybrid Search Null Db Fix: Hybrid Search Pipeline Null DB Fix | complete |
| 008 | `008-spec-memory-compliance-audit/` | Spec Memory Compliance Audit: Spec & Memory Compliance Audit | complete |
| 009 | `009-reindex-validator-false-positives/` | Reindex Validator False Positives | complete |
| 010 | `010-search-retrieval-quality-fixes/` | Search Retrieval Quality Fixes | complete |
| 011 | `011-indexing-and-adaptive-fusion/` | Indexing And Adaptive Fusion: Indexing and Adaptive Fusion Enablement | complete |
| 012 | `012-memory-save-quality-pipeline/` | Memory Save Quality Pipeline | complete |
| 013 | `013-fts5-fix-and-search-dashboard/` | Fts5 Fix And Search Dashboard: FTS5 Fix, Search Dashboard, and DB Path Drift Fix | complete |
| 014 | `014-feedback-signal-pipeline/` | Feedback Signal Pipeline | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume system-spec-kit/023-hybrid-rag-fusion-refinement/NNN-phase/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 001-shared-esm-migration is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `001-shared-esm-migration/` |
| 002 | 003 | 002-mcp-server-esm-migration is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `002-mcp-server-esm-migration/` |
| 003 | 004 | 003-scripts-interop-refactor is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `003-scripts-interop-refactor/` |
| 004 | 005 | 004-verification-and-standards is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `004-verification-and-standards/` |
| 005 | 006 | 005-test-and-scenario-remediation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `005-test-and-scenario-remediation/` |
| 006 | 007 | 006-review-remediation is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `006-review-remediation/` |
| 007 | 008 | 007-hybrid-search-null-db-fix is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `007-hybrid-search-null-db-fix/` |
| 008 | 009 | 008-spec-memory-compliance-audit is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `008-spec-memory-compliance-audit/` |
| 009 | 010 | 009-reindex-validator-false-positives is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `009-reindex-validator-false-positives/` |
| 010 | 011 | 010-search-retrieval-quality-fixes is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `010-search-retrieval-quality-fixes/` |
| 011 | 012 | 011-indexing-and-adaptive-fusion is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `011-indexing-and-adaptive-fusion/` |
| 012 | 013 | 012-memory-save-quality-pipeline is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `012-memory-save-quality-pipeline/` |
| 013 | 014 | 013-fts5-fix-and-search-dashboard is validated and its child packet state is recorded. | `validate.sh --strict --no-recursive` on `013-fts5-fix-and-search-dashboard/` |
| 014 | Complete | Child packet validates and records implementation state. | `validate.sh --strict --no-recursive` on `014-feedback-signal-pipeline/` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should any child packet status in the phase map be reclassified beyond the implementation-summary heuristic?
- Does this parent packet need additional navigation references outside the lean trio for future resume flows?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase `spec.md`, `plan.md`, and `tasks.md`.
- **Parent packet metadata**: See `description.json` and `graph-metadata.json` for save lineage and active-child pointers.
