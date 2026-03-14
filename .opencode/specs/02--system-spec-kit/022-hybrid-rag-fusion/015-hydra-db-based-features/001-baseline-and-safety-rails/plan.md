---
title: "Implementation Plan: 001-baseline-and-safety-rails"
description: "Execution plan for Hydra Phase 1 baseline hardening, verification, and rollout safety rails."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 1 plan"
  - "baseline plan"
  - "safety rails plan"
importance_tier: "critical"
contextType: "implementation"
---
<!-- ANCHOR:document -->
# Implementation Plan: 001-baseline-and-safety-rails

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP server handlers plus modular storage/retrieval internals |
| **Storage** | SQLite, vector index, migration checkpoints |
| **Testing** | Vitest, `tsc --noEmit`, manual Node smoke checks |

### Overview
Phase 1 delivers the control-plane work that lets the Hydra roadmap proceed safely. The plan focuses on runtime build integrity, roadmap capability metadata, checkpoint and schema validation tooling, and synchronized documentation so later phases do not inherit drift or rollback gaps.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable and phase-specific
- [x] Dependencies identified
- [x] Parent roadmap and ADR context available

### Definition of Done
- [x] Build path is stable and verified in the MCP package
- [x] Focused Phase 1 verification suite passes
- [x] Manual flag-smoke checks are recorded
- [x] Docs and playbook match delivered behavior
- [x] Remaining baseline gaps are explicitly tracked

---

## 3. ARCHITECTURE

### Pattern
Operational safety layer over the existing MCP server. Phase 1 does not introduce new data-plane behavior; it hardens the control-plane contracts that future data-plane phases rely on.

### Key Components
- **Build Packaging**: Ensures the reviewed source becomes the runtime that operators invoke.
- **Hydra Capability Snapshot Layer**: Reports roadmap phase/capability state without mutating unrelated runtime defaults.
- **Checkpoint Tooling**: Provides reversible migration support for later schema phases.
- **Baseline Evaluation Layer**: Captures baseline state and schema compatibility before larger changes ship.
- **Documentation Surface**: Keeps catalog, playbook, install guidance, and tests aligned with reality.

### Data Flow
1. Source changes are compiled into `dist`.
2. Capability snapshot helpers report roadmap metadata for telemetry, checkpoints, and manual verification.
3. Checkpoint helpers create and restore migration safety artifacts.
4. Baseline evaluation and schema compatibility tests verify the phase boundary.
5. Docs and manual procedures are updated to reflect the delivered slice and open gaps.

---

## 4. IMPLEMENTATION PHASES

### Phase A: Baseline Inventory and Drift Removal
- [x] Identify build/runtime mismatches
- [x] Identify doc and flag drift
- [x] Define Phase 1 verification targets

### Phase B: Safety-Rail Delivery
- [x] Add MCP build script and verify current `dist` generation
- [x] Introduce prefixed Hydra roadmap capability flags
- [x] Harden checkpoint script helper surfaces
- [x] Add schema compatibility validation

### Phase C: Verification and Documentation
- [x] Add focused Vitest coverage for Phase 1 surfaces
- [x] Update feature catalog, playbook, README, install guide, and environment docs
- [x] Run manual baseline and graph snapshot smoke commands
- [x] Decide whether broader Phase 1 observability follow-ups stay here or move forward as tracked residual work

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Type Check | MCP server compile-time safety | `npx tsc --noEmit` |
| Unit | Hydra capability flags, baseline helper behavior, schema compatibility | Vitest |
| Integration | Checkpoint create/restore workflows and existing regression suites | Vitest |
| Manual | Built `dist` phase snapshot checks | `node -e` smoke commands |
| Documentation | Catalog/playbook/README/install guide sync | Manual review against runtime behavior |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing MCP build/package structure | Internal | Green | Phase 1 cannot prove runtime correctness |
| Existing checkpoint scripts | Internal | Green | Rollback readiness remains weak |
| Existing vector schema internals | Internal | Green | Compatibility validation cannot be anchored |
| Existing feature catalog/playbook docs | Internal | Green | Baseline narrative remains inaccurate |
| Parent research docs | Internal | Green | Phase rationale loses traceability |

---

## 7. ROLLBACK PLAN

- **Trigger**: Build regression, misleading capability metadata, failing checkpoint helpers, or documentation that overstates delivery.
- **Procedure**:
1. Revert the baseline control-plane change set.
2. Rebuild the MCP package and re-run the focused verification suite.
3. Restore the last known-good checkpoint state if migration helpers were exercised.
4. Revert documentation to the last truthful state and log the reason Phase 1 did not pass.

---

## L2: PHASE DEPENDENCIES

```text
Inventory -> Build/Flags/Checkpoint Hardening -> Verification -> Handoff to Phase 2
```

| Phase Step | Depends On | Blocks |
|------------|------------|--------|
| Inventory | Parent roadmap | All later baseline steps |
| Build and flag hardening | Inventory | Verification, docs sync |
| Checkpoint/schema validation | Inventory | Phase 2 lineage start |
| Verification and docs sync | Build and flag hardening, checkpoint/schema validation | Phase 2 handoff |

---

## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Build and runtime alignment | Medium | 0.5-1 day |
| Capability flag and baseline helper hardening | Medium | 0.5-1 day |
| Checkpoint/schema validation | Medium | 0.5-1 day |
| Tests and docs alignment | Medium | 1-2 days |
| **Total** | | **2.5-5 days** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline code paths identified
- [x] Feature metadata boundaries identified
- [x] Test targets defined
- [x] Documentation update list defined

### Rollback Procedure
1. Remove the baseline hardening change set.
2. Rebuild and confirm `dist` matches the reverted state.
3. Re-run the focused verification commands.
4. Revert documentation that depends on the removed change set.

### Data Reversal
- **Has data migrations?** No new data migrations in the delivered slice.
- **Reversal procedure**: Restore prior checkpoint-script behavior and remove any new helper exports if the phase is backed out.

---

## L3: DEPENDENCY GRAPH

```text
+---------------------+
| Build Alignment     |
+----------+----------+
           v
+----------+----------+      +----------------------+
| Hydra Capability    |----->| Docs and Playbook    |
| Metadata            |      | Alignment            |
+----------+----------+      +----------------------+
           v
+----------+----------+
| Checkpoint + Schema |
| Validation          |
+----------+----------+
           v
+----------+----------+
| Phase 2 Handoff     |
+---------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Build Alignment | Existing package config | Current `dist` runtime | All later verification |
| Capability Metadata | Build alignment | Safe phase snapshot contract | Telemetry, checkpoints, manual smoke |
| Checkpoint/Schema Validation | Build alignment | Rollback and compatibility evidence | Phase 2 lineage migrations |
| Docs Sync | Capability metadata and validation | Accurate operator-facing guidance | Future roadmap reviews |

---

## L3: CRITICAL PATH

1. Build alignment and `dist` verification
2. Hydra capability metadata isolation
3. Checkpoint/script/schema validation
4. Documentation and manual smoke completion

**Total Critical Path**: 4 tightly ordered activities

**Parallel Opportunities**:
- Test authoring can proceed while docs are updated.
- Playbook and catalog updates can run in parallel after behavior is verified.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline drift identified | Build, flags, docs, and checkpoint gaps enumerated | Start of Phase 1 |
| M2 | Hardening slice delivered | Build path, capability flags, helpers, and tests land | Mid Phase 1 |
| M3 | Phase 2 handoff ready | Focused verification and docs alignment complete | End of Phase 1 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Baseline Safety Rails Before Data-Plane Evolution

**Status**: Accepted for Phase 1 planning

**Context**: Phase 2 lineage work should not start on top of stale packaging, ambiguous flags, or unverified checkpoint tooling.

**Decision**: Deliver control-plane hardening before any lineage schema expansion.

**Consequences**:
- Improves trust in future rollout evidence.
- Delays visible roadmap functionality slightly, but lowers risk sharply.

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: `spec.md`, `plan.md`, `tasks.md`
**Duration**: Short setup pass
**Agent**: Primary agent only for this documentation pass

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Primary | Code and runtime verification | MCP code and tests |
| Primary | Documentation alignment | Catalog, playbook, README, install guide |
| Primary | Phase packaging | Phase 1 spec documents |

### Tier 3: Integration
**Agent**: Primary
**Task**: Reconcile verification evidence, docs, and phase handoff state
**Duration**: Final integration pass

---

## L3+: WORKSTREAM COORDINATION

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Runtime build alignment | Primary | `package.json`, `dist` outputs | Complete for delivered slice |
| W-B | Capability and checkpoint safety | Primary | config, eval, migration scripts | Complete for delivered slice |
| W-C | Verification and docs | Primary | tests and documentation surfaces | Complete for delivered slice |
| W-D | Residual baseline follow-up | Primary | to be decided | Open |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Runtime changes complete | Primary | Test list and doc update plan |
| SYNC-002 | Tests and docs complete | Primary | Phase 2 handoff readiness |

### File Ownership Rules
- Control-plane code changes stay within existing MCP server modules.
- Docs changes stay within baseline catalog, playbook, and README surfaces.
- Phase documents record truth; they do not invent unshipped implementation.

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- Update `tasks.md` when a delivered baseline item is verified.
- Update `implementation-summary.md` whenever evidence changes.
- Reflect any scope decision about residual Phase 1 work in the parent phase map.

### Escalation Path
1. Runtime packaging or test failures -> MCP maintainer review
2. Docs drift or status confusion -> system-spec-kit maintainer review
3. Phase-boundary disagreements -> parent roadmap decision in `../decision-record.md`

<!-- /ANCHOR:document -->
