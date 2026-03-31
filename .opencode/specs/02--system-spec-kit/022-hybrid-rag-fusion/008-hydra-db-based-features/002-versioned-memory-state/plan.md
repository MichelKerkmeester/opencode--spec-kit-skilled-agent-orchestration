---
title: "Implementation [02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/plan]"
description: "Execution plan for Hydra Phase 2 lineage and temporal-state rollout."
trigger_phrases:
  - "phase 2 plan"
  - "lineage plan"
  - "versioned memory plan"
importance_tier: "critical"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch + level3plus-govern | v2.2"
---
# Implementation Plan: 002-versioned-memory-state

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP server handlers plus storage/retrieval modules |
| **Storage** | SQLite, vector index, history/conflict tables, planned lineage extensions |
| **Testing** | Vitest, migration harnesses, checkpoint drills, manual query validation |

### Overview
Phase 2 extends the current server with first-class lineage state. The plan adds append-first transitions, active projection for current reads, temporal `asOf` resolution, and rollback-safe backfill so later phases can reason over versioned truth rather than implicit mutation.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Dependencies on Phase 1 and parent ADRs documented
- [x] Success criteria and migration risks documented
- [x] Phase 1 handoff criteria approved

### Definition of Done
- [x] Append-first lineage writes implemented
- [x] Active projection and `asOf` semantics validated
- [x] Backfill and rollback drills pass
- [x] Lineage integrity test suite passes
- [x] Docs and playbook reflect the shipped behavior

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Incremental schema extension over the current MCP storage model. Immutable lineage tracks historical truth; active projection serves current reads.

### Key Components
- **Lineage Storage Layer**: Version tables or equivalent transition structures.
- **Active Projection Layer**: Fast current-state resolution.
- **Write Transition Layer**: Save path logic that emits immutable versions.
- **Temporal Query Resolver**: `asOf` semantics for historical reads.
- **Migration Harness**: Backfill, integrity validation, checkpoint, and rollback support.

### Data Flow
1. Save handler receives a state mutation.
2. Lineage writer appends a new version linked to its predecessor.
3. Active projection is updated to point to the new current version.
4. Historical reads use `asOf` and lineage boundaries to resolve the right version.
5. Backfill and rollback paths use checkpoints and integrity validators.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Contract and Schema Design
- [x] Finalize lineage entity model and predecessor rules
- [x] Define active projection strategy
- [x] Specify `asOf` contract and edge behavior

### Phase B: Write Path and Migration
- [x] Implement lineage writes in save/update flows
- [x] Add migration/backfill path for existing data
- [x] Add checkpoint-backed rollback procedure

### Phase C: Query Resolution and Verification
- [x] Add current-state and `asOf` read resolution
- [x] Add integrity and temporal correctness tests
- [x] Update playbook and docs for lineage operations

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lineage transition rules, active projection, `asOf` resolver | Vitest |
| Integration | Save -> lineage -> current read -> historical read | Vitest with SQLite fixtures |
| Migration | Backfill, rollback, and checkpoint restore | Migration harness scripts |
| Integrity | Orphan chains, duplicate active versions, invalid predecessors | Vitest |
| Manual | Historical query walkthroughs and rollback drills | CLI or Node smoke scripts |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 controls | Internal | Yellow | Rollout and rollback stay unsafe |
| Existing history/conflict logs | Internal | Green | Backfill loses guidance |
| Current schema/migration framework | Internal | Green | Lineage rollout cannot proceed incrementally |
| Parent ADR-001 | Architecture | Green | Scope and storage direction become ambiguous |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Corrupted lineage chain, bad `asOf` resolution, failed backfill, or unacceptable write/read regressions.
- **Procedure**:
1. Disable lineage rollout flags.
2. Restore the pre-lineage checkpoint.
3. Revert active-projection changes.
4. Re-run integrity and current-read smoke checks.
5. Log root cause before another migration attempt.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 baseline -> Lineage schema and contract -> Backfill/write path -> Temporal reads -> Phase 3 graph fusion
```

| Phase Step | Depends On | Blocks |
|------------|------------|--------|
| Contract and schema design | Phase 1 | All later Phase 2 steps |
| Backfill and write path | Contract design | Query resolution and Phase 3 |
| Temporal reads and verification | Write path | Phase 3 and Phase 5 |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Schema and contract design | High | 2-3 days |
| Write path and backfill | High | 4-6 days |
| Query resolution and verification | High | 3-5 days |
| **Total** | | **9-14 days** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Checkpoint captured
- [x] Dry-run backfill available
- [x] Integrity validator implemented
- [x] Current-read fallback path identified

### Rollback Procedure
1. Stop lineage rollout traffic.
2. Restore the last known-good checkpoint.
3. Re-enable the legacy current-state path if needed.
4. Run integrity and retrieval smoke tests.

### Data Reversal
- **Has data migrations?** Yes
- **Reversal procedure**: Checkpoint restore, down migration if available, then replay-safe validation

<!-- /ANCHOR:enhanced-rollback -->
---

## L3: DEPENDENCY GRAPH

```text
+----------------------+
| Contract + Schema    |
+----------+-----------+
           v
+----------+-----------+
| Write Path + Backfill|
+----------+-----------+
           v
+----------+-----------+
| Active Projection    |
+----------+-----------+
           v
+----------+-----------+
| asOf Query Resolver  |
+----------+-----------+
           v
+----------------------+
| Phase 3 Handoff      |
+----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract and schema | Phase 1 | Stable lineage model | Write path, queries |
| Write path | Contract and schema | Immutable versions | Temporal reads |
| Active projection | Write path | Fast current-state reads | Query stability |
| `asOf` resolver | Write path, projection | Historical reads | Graph fusion and governance |

---

## L3: CRITICAL PATH

1. Finalize lineage contract
2. Implement write path and backfill
3. Validate current-state projection
4. Validate `asOf` resolution and rollback

**Total Critical Path**: 4 major milestones

**Parallel Opportunities**:
- Migration harness and manual playbook work can start once the lineage contract is stable.
- Integrity test authoring can overlap with query resolver work.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Lineage contract accepted | Schema, predecessor, and `asOf` semantics locked | Early Phase 2 |
| M2 | Write and backfill path working | Versions append correctly and rollback path exists | Mid Phase 2 |
| M3 | Phase 3 handoff ready | Current and historical queries pass verification | End Phase 2 |

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-201: Separate Immutable Lineage from Active Projection

**Status**: Proposed for Phase 2 implementation

**Context**: Historical correctness and current-read performance place different demands on the storage model.

**Decision**: Keep immutable lineage history distinct from a current-state projection rather than forcing one structure to serve both roles.

**Consequences**:
- Improves clarity and query performance.
- Requires extra integrity validation to keep projection and lineage synchronized.

<!-- /ANCHOR:architecture -->
---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md`, `plan.md`, `decision-record.md`
**Duration**: Initial design pass
**Agent**: Primary agent

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Primary | Schema and write path | storage and handler modules |
| Primary | Migration and rollback verification | migration harness and tests |
| Primary | Documentation and playbook | spec docs and operator guides |

### Tier 3: Integration
**Agent**: Primary
**Task**: Reconcile migration evidence, query semantics, and handoff to Phase 3

---

## L3+: WORKSTREAM COORDINATION

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Lineage schema and write path | Primary | storage, handler, schema modules | Planned |
| W-B | Backfill and rollback | Primary | migrations, checkpoints, tests | Planned |
| W-C | Query semantics and docs | Primary | retrieval path, playbook, docs | Planned |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-201 | Contract locked | Primary | Backfill and query tasks can begin |
| SYNC-202 | Backfill passes | Primary | `asOf` validation and Phase 3 handoff |

### File Ownership Rules
- Schema and storage edits stay in lineage-focused modules.
- Query semantics changes stay isolated from graph fusion work.
- Docs must record only shipped lineage behavior, not future graph/governance claims.

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- Record contract decisions in `decision-record.md`
- Update `tasks.md` when migration or query milestones move
- Revisit parent phase map once Phase 2 execution begins

### Escalation Path
1. Schema ambiguity -> Phase 2 ADR update
2. Migration risk or rollback weakness -> Phase 1/Phase 2 joint review
3. Query semantics disagreement -> parent roadmap decision

