---
title: "Implementation Plan: 015-hydra-db-based-features"
description: "Six-phase implementation roadmap for HydraDB-inspired memory-state capabilities in system-spec-kit and the Spec Kit Memory MCP server."
trigger_phrases:
  - "implementation plan"
  - "hydra roadmap"
  - "lineage"
  - "governance"
  - "shared memory"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: 015-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js (Memory MCP server) |
| **Framework** | MCP server handlers + modular retrieval/storage subsystems |
| **Storage** | SQLite + vector/FTS indexes (current baseline) |
| **Testing** | Vitest + scenario/integration suites (future implementation phases) |

### Overview
This plan sequences HydraDB-inspired capabilities as an evolutionary extension of the existing Memory MCP server, not a greenfield rewrite. The six phases move from safe baseline setup to lineage, graph unification, adaptive retrieval, hierarchy/governance enforcement, and finally shared-memory collaboration rollout.

**Present vs Target**:
- Present: capabilities exist in separate modules and are not yet a single governed memory-state platform.
- Target: one coherent memory-state lifecycle with lineage, policy boundaries, adaptive quality loops, and controlled collaboration.

[Assumes: Public HydraDB materials describe product direction suitable for roadmap inspiration, but not directly reusable implementation code.]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope are complete in `spec.md`.
- [x] Architecture ordering is documented with ADR alignment.
- [x] Task map exists and is phase-aligned.
- [x] Research grounding docs are referenced and available in this folder.

### Definition of Done (for future implementation)
- [ ] P0 requirements in `spec.md` are implemented and validated.
- [ ] P1 requirements are implemented or formally deferred.
- [ ] Isolation/governance checks pass in CI and scenario tests.
- [ ] Rollback drills pass for each gated capability.
- [ ] Planning docs are updated to match implementation reality.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evolutionary modular monolith with append-first memory lineage, graph-aware retrieval fusion, and policy-enforced governance boundaries.

### Key Components
- **Lineage State Layer**: append-first version transitions and temporal query contracts.
- **Unified Retrieval Layer**: hybrid candidate generation with causal/entity/summary graph enrichment.
- **Adaptive Learning Layer**: access/outcome/correction feedback loops under bounded policies.
- **Hierarchy and Governance Layer**: scope enforcement plus provenance, retention, and deletion controls.
- **Collaboration Layer**: shared-memory spaces with role and conflict policy.
- **Operational Safety Layer**: migrations, capability flags, checkpoints, rollback, and observability.

### Data Flow
1. Ingestion request enters save handler with scope identity and provenance envelope.
2. Validation enforces provenance/temporal fields and scope constraints.
3. Version writer emits lineage transition and updates active projection.
4. Graph index updates causal/entity/summary relationships.
5. Retrieval executes scope/time prefilter, hybrid candidate generation, graph fusion, and ranking.
6. Access/outcome/correction signals are captured for adaptive policy jobs.
7. Governance jobs enforce retention/deletion and record audit outcomes.
8. Shared-memory handlers (when enabled) apply membership and conflict policies.

```text
Ingest -> Validate -> Lineage Write -> Graph Update -> Scoped Retrieval
   ^                                                  |
   |                                                  v
Retention/Delete <- Governance/Audit <- Feedback Outcomes
```

[Assumes: Hydra-inspired "memory as state" and "timeline-aware retrieval" behavior is translated into this plan from public HydraDB descriptions.]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Safety Rails
- [ ] Freeze baseline quality/latency/isolation metrics.
- [ ] Add feature flags and migration checkpoint strategy.
- [ ] Add observability fields for lineage/policy/adaptive paths.

### Phase 2: First-Class Versioned Memory State
- [ ] Introduce lineage schema and append-first state transitions.
- [ ] Add temporal query semantics (`asOf`, active projection behavior).
- [ ] Validate backfill and rollback paths for lineage rollout.

### Phase 3: Unified Graph-Aware Retrieval
- [ ] Fuse causal/entity/summary context in deterministic retrieval flow.
- [ ] Add graph health metrics and deterministic tie-break rules.
- [ ] Verify recall/precision stability against baseline scenarios.

### Phase 4: Self-Improving Retrieval Loops
- [ ] Capture retrieval outcomes and correction signals.
- [ ] Run adaptive ranking in shadow mode with bounded updates.
- [ ] Promote to controlled activation only after guardrail pass.

### Phase 5: Hierarchical Scope and Governance Enforcement
- [ ] Enforce tenant/user/agent/session predicates across all read/write/index paths.
- [ ] Require provenance/temporal markers on governed ingestion.
- [ ] Implement retention policies and auditable cascade deletion.

### Phase 6: Shared-Memory Collaboration and Rollout
- [ ] Add shared-memory spaces, roles, and conflict strategies.
- [ ] Gate broad collaboration rollout behind Phase 5 controls.
- [ ] Execute staged release with kill switches and rollback drills.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lineage transitions, scope predicates, adaptive policy bounds | Vitest |
| Integration | Ingest -> lineage -> retrieval -> feedback -> governance lifecycle | Vitest + SQLite fixtures |
| Isolation/Security | Tenant/user/agent/session leak prevention and shared-space boundaries | Scenario test matrix |
| Migration | Forward/backward schema compatibility and checkpoint restore | Migration harness scripts |
| Performance | Retrieval latency, adaptive overhead, queue throughput | Benchmark scripts + telemetry |
| Manual/Staging | Rollback drills and governance audit walkthroughs | Staging runbooks |

Notes:
- This planning phase does not claim these tests have been executed.
- Test execution and evidence collection occur during implementation phases.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/001 - analysis-hydradb-architecture-and-turso-fit.md` | Internal research | Green | Reduces architecture confidence and rationale traceability |
| `research/002 - recommendations-turso-migration-and-hydradb-inspired-roadmap.md` | Internal research | Green | Weakens priority ordering and sequencing rationale |
| Existing Memory MCP schema/migration mechanisms | Internal system | Green | Lineage and governance rollout cannot proceed safely |
| Existing retrieval/candidate pipeline | Internal system | Green | Graph and adaptive phases cannot integrate predictably |
| Existing access/history/conflict signals | Internal system | Green | Adaptive learning and lineage mappings lose signal quality |
| Policy model agreement for hierarchy/governance | Product/Architecture | Yellow | Scope enforcement may be delayed or inconsistent |
| Compliance requirements for retention/deletion | Product/Legal | Yellow | Governance phase may stall at rollout gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: isolation leak, lineage corruption risk, severe retrieval regression, governance enforcement failure, or failed migration checkpoint validation.
- **Procedure**:
1. Disable affected feature flags (`lineage_state`, `adaptive_retrieval`, `scope_enforcement`, `shared_memory`).
2. Route retrieval to prior stable baseline pipeline.
3. Restore migration checkpoint if schema regression is detected.
4. Re-run smoke scenarios for save/search/delete scope behavior.
5. Requeue incomplete jobs from last valid terminal state.
6. Document incident timeline and update phase gates before retry.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Baseline)
   -> Phase 2 (Lineage)
   -> Phase 3 (Graph Retrieval)
   -> Phase 4 (Adaptive Loops)
   -> Phase 5 (Hierarchy + Governance)
   -> Phase 6 (Shared Memory + Rollout)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Baseline | None | 2,3,4,5,6 |
| 2 Lineage | 1 | 3,4,5,6 |
| 3 Graph Retrieval | 2 | 4,6 |
| 4 Adaptive Loops | 3 + 1 metrics | 6 release confidence |
| 5 Hierarchy/Governance | 2 + 1 | 6 production rollout |
| 6 Shared Memory + Rollout | 3 + 4 + 5 | Final launch |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 Baseline and Safety Rails | Medium | 1-2 weeks |
| Phase 2 Versioned State and Lineage | High | 2-3 weeks |
| Phase 3 Unified Graph Retrieval | High | 2-3 weeks |
| Phase 4 Adaptive Retrieval Loops | Medium-High | 1.5-2.5 weeks |
| Phase 5 Hierarchy and Governance | High | 2-3 weeks |
| Phase 6 Shared Memory and Rollout | Medium-High | 1.5-2.5 weeks |
| **Total** | | **10-16 weeks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Migration checkpoint captured.
- [ ] Kill-switch flags validated in staging.
- [ ] Baseline metrics snapshot persisted.
- [ ] Governance audit logging enabled.

### Rollback Procedure
1. Disable active phase flag.
2. Revert to prior stable configuration path.
3. Restore checkpoint if data-plane migration is implicated.
4. Run targeted smoke suite for affected phase boundaries.
5. Confirm queue health and replay safety.
6. Publish incident record with corrective actions.

### Data Reversal
- **Has data migrations?** Yes (planned for lineage, scope, governance, collaboration).
- **Reversal procedure**: checkpoint restore + migration down path + replay-safe queue recovery.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
+-----------------------+
| Phase 1 Baseline      |
+-----------+-----------+
            v
+-----------+-----------+
| Phase 2 Lineage       |
+-----+-----------+-----+
      v           v
+-----+-----+ +---+----------------+
| Phase 3   | | Phase 5 Scope/Gov  |
| Graph     | +---+----------------+
+-----+-----+     |
      v           |
+-----+-----------+ 
| Phase 4 Adaptive |
+-----+-----------+
      v
+-----+-----------------------------+
| Phase 6 Shared Memory + Rollout   |
+-----------------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline Safety | None | Flags, checkpoints, baselines | All downstream phases |
| Lineage State | Baseline | Versioned state contract | Graph, governance, rollout |
| Graph Retrieval | Lineage | Unified retrieval graph | Adaptive and collaboration quality |
| Adaptive Loops | Graph + Baseline metrics | Ranked-feedback policy | Rollout confidence |
| Scope/Governance | Lineage + Baseline | Isolation and compliance controls | Shared-memory production enablement |
| Shared Memory/Rollout | Graph + Adaptive + Governance | Multi-agent collaboration release | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 Baseline** - 1-2 weeks - CRITICAL
2. **Phase 2 Lineage** - 2-3 weeks - CRITICAL
3. **Phase 3 Graph Retrieval** - 2-3 weeks - CRITICAL
4. **Phase 4 Adaptive Loops (shadow to gated active)** - 1.5-2.5 weeks - CRITICAL
5. **Phase 5 Scope/Governance** - 2-3 weeks - CRITICAL
6. **Phase 6 Shared Memory + Rollout** - 1.5-2.5 weeks - CRITICAL

**Total Critical Path**: 10-16 weeks

**Parallel Opportunities**:
- Early Phase 5 policy modeling can begin while late Phase 3 hardening runs.
- Parts of Phase 4 shadow instrumentation can start during Phase 3 integration testing.
- Rollout runbook drafting can begin before Phase 6 final gate.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Roadmap foundation ready | Baseline metrics, flags, checkpoints defined | End Phase 1 |
| M2 | Lineage model active in staging | Temporal/lineage scenarios pass | End Phase 2 |
| M3 | Unified graph retrieval validated | Deterministic ranking and regression checks pass | End Phase 3 |
| M4 | Adaptive loop shadow pass | No guardrail breaches in shadow window | End Phase 4 |
| M5 | Governance gate passed | Isolation and deletion controls validated | End Phase 5 |
| M6 | Collaboration rollout ready | Shared-memory workflows pass rollout and rollback drills | End Phase 6 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

This plan is governed by `decision-record.md` ADR-001 through ADR-003:
- ADR-001: evolutionary extension over greenfield rewrite.
- ADR-002: versioned memory state first.
- ADR-003: hierarchy/governance before broad collaboration.

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the active phase and roadmap boundary before implementation work starts.
- Re-read `spec.md`, `tasks.md`, and `decision-record.md` before changing code or docs.
- Verify whether the task is Phase 1 hardening work or future roadmap work.
- Record evidence targets before starting verification work.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| TASK-SEQ | Respect the documented phase order and handoff gates |
| TASK-SCOPE | Do not claim future phases are implemented before evidence exists |
| TASK-VERIFY | Pair every completion claim with test or document evidence |
| TASK-DOCS | Keep parent and child phase docs synchronized |

### Status Reporting Format

- `STARTED:` phase and scope
- `IN PROGRESS:` current checkpoint and remaining work
- `BLOCKED:` blocker, evidence, and decision needed
- `DONE:` evidence and next-phase handoff state

### Blocked Task Protocol

1. Stop when a phase gate or roadmap truth-in-status rule is violated.
2. Record the blocked item in `tasks.md` and the affected phase folder.
3. Resume only after the dependency or decision is resolved.
<!-- /ANCHOR:ai-protocol -->
