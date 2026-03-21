---
title: "Feature Specification: 002-versioned-memory-state"
description: "Level 3+ phase spec for append-first lineage, active projection, and temporal query semantics."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 2"
  - "versioned memory state"
  - "lineage"
  - "asOf query"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: 002-versioned-memory-state

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 2 is the first true Hydra data-plane phase. It introduces append-first memory lineage, active projection, temporal resolution semantics, and the migration/backfill contracts required to ask what was true at any point in time.

**Key Decisions**: preserve the current MCP storage architecture and extend it with lineage tables and transition contracts; separate immutable lineage history from active projection reads.

**Critical Dependencies**: Phase 1 baseline controls, parent ADR-001, existing history/conflict tracking, and reversible migration tooling.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-13 |
| **Branch** | `022-hybrid-rag-fusion` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | `../plan.md` |
| **Phase** | 2 of 6 |
| **Predecessor** | ../001-baseline-and-safety-rails/spec.md |
| **Successor** | ../003-unified-graph-retrieval/spec.md |
| **Handoff Criteria** | Append-first lineage, active projection, `asOf` semantics, backfill coverage, and rollback drills verified |

### Phase Context

This phase turns the roadmap from capability metadata into actual memory-state behavior. The work must preserve the current MCP server while introducing durable lineage semantics that later graph, adaptive, and governance phases can rely on.

**Scope Boundary**: lineage storage, write-path transitions, temporal query behavior, and migration safety. No graph fusion or adaptive ranking logic ships here.

**Dependencies**:
- Phase 1 build and checkpoint controls
- Existing `memory_index`, history, and conflict logs
- Parent ADR-001 incremental-schema decision

**Deliverables**:
- Lineage tables or equivalent append-first state model
- Active projection for current-state reads
- `asOf` temporal query semantics
- Backfill and rollback procedure with verification coverage

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current Memory MCP server stores valuable history and conflict information, but it does not expose a first-class lineage model that guarantees immutable state transitions and deterministic temporal reads. Without that, later Hydra features cannot reason safely about truth over time.

### Purpose
Introduce a durable lineage contract that makes temporal state resolution explicit, testable, and reversible.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append-first lineage schema or equivalent version-transition model.
- Active projection rules for current-state reads.
- `asOf` query contract and deterministic version resolution.
- Backfill, migration, and rollback safety for lineage rollout.
- Verification for integrity, temporal correctness, and recovery.

### Out of Scope
- Unified graph-aware retrieval scoring.
- Adaptive ranking loops.
- Shared-memory collaboration surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add lineage and active-projection schema extensions |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts` | Modify | Bridge historical events into lineage transitions |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Emit append-first version transitions |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/` | Create/Modify | Add lineage-state helpers and integrity validators |
| `.opencode/skill/system-spec-kit/mcp_server/tests/` | Create/Modify | Add lineage, temporal-query, migration, and rollback coverage |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add lineage and temporal-query validation procedures |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-201 | Introduce append-first lineage state | Every supersede action writes a new immutable version and preserves predecessor linkage |
| REQ-202 | Provide active projection semantics | Current-state queries resolve through an explicit active projection rather than implicit mutation |
| REQ-203 | Support temporal `asOf` reads | **Given** a timestamp or version boundary, queries resolve the correct historical state deterministically |
| REQ-204 | Support lineage backfill and rollback | Migration harness can backfill existing data and reverse safely through checkpoints |
| REQ-205 | Verify integrity constraints | Automated tests catch orphan transitions, invalid predecessors, and duplicate active versions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-206 | Expose lineage inspection tooling | Maintainers can inspect version chains during debugging and validation |
| REQ-207 | Capture lineage metrics | Telemetry reports lineage write counts, backfill progress, and temporal-read usage |
| REQ-208 | Update docs and playbooks | Catalog, playbook, and phase docs reflect actual lineage rollout behavior |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-201**: A write that supersedes prior state leaves both the old and new versions queryable.
- **SC-202**: An `asOf` query returns the same deterministic result across repeated runs.
- **SC-203**: Backfill can be run against existing data and rolled back cleanly.
- **SC-204**: Integrity tests fail on malformed lineage chains and pass on valid ones.
- **SC-205**: Later phases can depend on lineage identifiers without reworking the storage model.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 checkpoint and build controls | Without them, migration rollback is unsafe | Keep Phase 1 handoff mandatory |
| Dependency | Existing history and conflict logs | Provide migration anchors for lineage state | Reuse rather than replace existing primitives |
| Risk | Backfill corrupts active state | High | Dry-run mode, checkpoints, and integrity validation |
| Risk | `asOf` semantics are underspecified | High | Define contract before implementation and test edge cases |
| Risk | Write-path overhead becomes too high | Medium | Benchmark transitions and optimize projection reads |

<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P21**: Current-state reads remain within acceptable latency by using active projection rather than full lineage scans.
- **NFR-P22**: Lineage writes remain bounded and measurable under representative ingest load.

### Security
- **NFR-S21**: Lineage transitions do not bypass future scope/governance controls.
- **NFR-S22**: Rollback tooling does not silently destroy irrecoverable state.

### Reliability
- **NFR-R21**: Version chains remain append-first and recoverable after interruption.
- **NFR-R22**: Backfill is resumable and idempotent.

### Operability
- **NFR-O21**: Maintainers can inspect lineage state during debugging.
- **NFR-O22**: Migration checkpoints exist before any irreversible lineage move.

---

## 8. EDGE CASES

### Data Boundaries
- Two superseding writes arrive close together for the same conceptual fact.
- A late-arriving correction should become historically valid before a previously written value.
- Existing records lack a clean predecessor mapping during backfill.

### Error Scenarios
- Backfill stops midway through active-projection generation.
- A version chain contains a missing predecessor or cycle.
- `asOf` query is requested for a time before the entity existed.

### Behavioral Cases
- Query asks for current truth and historical truth in the same workflow.
- Restore from checkpoint occurs after partial lineage migration.
- Conflict logs disagree with the proposed canonical predecessor chain.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Core storage, write path, query semantics, migrations |
| Risk | 24/25 | Data correctness and rollback risk are central |
| Research | 16/20 | Temporal-state semantics need careful internal alignment |
| Multi-Agent | 11/15 | Later phases depend heavily on the lineage contract |
| Coordination | 14/15 | Strong dependency on Phase 1 and blocker for Phases 3, 5, and 6 |
| **Total** | **87/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-201 | Backfill corrupts active reads | High | Medium | Checkpoints, dry runs, integrity verification |
| R-202 | Temporal contract remains ambiguous | High | Medium | Define `asOf` rules before coding and test boundaries |
| R-203 | Lineage write amplification hurts ingest | Medium | Medium | Benchmark write path and optimize projection updates |
| R-204 | Downstream phases depend on unstable identifiers | Medium | Medium | Lock the lineage contract before Phase 3 starts |

---

## 11. USER STORIES

### US-201: Temporal Truth (Priority: P0)

**As a** maintainer, **I want** to ask what was true at a specific point in time, **so that** long-running agent workflows can reason over historical state correctly.

**Acceptance Criteria**:
1. ****Given**** an `asOf` timestamp, when retrieval resolves an entity, then the correct version is returned deterministically.
2. ****Given**** repeated runs against the same lineage chain, when `asOf` is evaluated, then the same version is selected every time.

### US-202: Lineage Inspection (Priority: P0)

**As a** platform operator, **I want** each superseding write to preserve its predecessor chain, **so that** I can debug and roll back lineage transitions safely.

**Acceptance Criteria**:
1. ****Given**** a superseding update, when lineage is inspected, then both previous and new versions remain visible.
2. ****Given**** a malformed transition, when integrity checks run, then the migration fails fast with actionable diagnostics.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | System-spec-kit maintainer | Approved | 2026-03-14 |
| Migration Design Review | Memory MCP maintainer | Approved | 2026-03-14 |
| Implementation Review | Runtime and data reviewers | Approved | 2026-03-14 |
| Rollout Approval | Roadmap owner | Approved | 2026-03-14 |

---

## 13. COMPLIANCE CHECKPOINTS

### Data Integrity
- [x] Lineage integrity rules documented and reviewed
- [x] Checkpoint rollback drill defined before migration
- [x] Historical state queries reviewed for determinism

### Code and Process
- [x] `sk-code--opencode` alignment verified during implementation
- [x] Migration and rollback test plan approved
- [x] Operator-facing lineage procedures added to playbook

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| System-spec-kit maintainer | Phase owner | High | Spec, task, and checklist review |
| Memory MCP maintainer | Data-plane reviewer | High | Migration design and test review |
| QA or release reviewer | Verification partner | Medium | Backfill and rollback evidence review |

---

## 15. CHANGE LOG

### v0.1 (2026-03-13)
- Created the Phase 2 Level 3+ execution package.
- Defined lineage, active-projection, and temporal-query scope without claiming implementation.

---

### Acceptance Scenarios

1. **Supersede without mutation**
   **Given** an existing fact, when a newer fact replaces it, then the old version remains intact and the new version becomes active through projection logic.
2. **Historical resolution**
   **Given** multiple valid versions over time, when a client passes `asOf`, then the system resolves the version valid at that time and no newer one.
3. **Rollback safety**
   **Given** a failed lineage migration, when rollback begins, then checkpoint restore returns the dataset to its pre-lineage shape.

---

## 16. OPEN QUESTIONS

- Should active projection live in dedicated tables, materialized views, or cached query helpers?
- How much lineage inspection tooling needs to ship in Phase 2 versus later admin/debug surfaces?

---

## RELATED DOCUMENTS

- **Parent Roadmap**: `../spec.md`
- **Phase 1 Handoff**: `../001-baseline-and-safety-rails/spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
