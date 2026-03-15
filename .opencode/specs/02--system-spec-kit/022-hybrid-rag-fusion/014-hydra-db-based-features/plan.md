---
title: "Implementation Plan: 014-hydra-db-based-features"
description: "Delivered six-phase implementation record for HydraDB-inspired memory-state capabilities in system-spec-kit and the Spec Kit Memory MCP server."
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
# Implementation Plan: 014-hydra-db-based-features

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
| **Testing** | Vitest targeted Hydra/doc suites, full `mcp_server` regression, and alignment-drift verification |

### Overview
This plan records the delivered HydraDB-inspired implementation as an evolutionary extension of the existing Memory MCP server, not a greenfield rewrite. The six phases were shipped in sequence from baseline hardening through lineage, graph unification, adaptive retrieval, hierarchy and governance enforcement, and shared-memory collaboration rollout.

**Baseline vs Delivered**:
- Baseline: memory primitives existed across separate modules without a single governed memory-state story.
- Delivered: one coordinated runtime surface spanning lineage state, graph-aware retrieval, adaptive shadow proposals, hierarchical governance, retention and deletion controls, and shared-memory rollout safety.
- Public API note: lineage and `asOf` remain internal storage-layer APIs plus save/search integration, not a standalone public MCP query tool.

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

### Definition of Done
- [x] P0 requirements in `spec.md` are implemented and locally revalidated. [E:2026-03-15 `npx tsc --noEmit`, `npm run build`, targeted Hydra/doc suites, `npm test`]
- [x] P1 requirements are implemented with no remaining spec-level deferrals in this parent pack. [E:tasks.md + implementation-summary.md]
- [x] Isolation/governance checks pass in targeted and full-suite verification. [E:entity-scope.vitest.ts + dual-scope-hooks.vitest.ts + memory-governance.vitest.ts + shared-spaces.vitest.ts]
- [x] Rollback drills pass through roadmap flag opt-outs, adaptive-state reset, and migration checkpoint tests. [E:memory-roadmap-flags.vitest.ts + adaptive-ranking.vitest.ts + migration-checkpoint-scripts.vitest.ts]
- [x] Planning docs are updated to match runtime reality. [E:2026-03-15 truth-sync audit]
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
- [x] Freeze baseline quality/latency/isolation metrics.
- [x] Add feature flags and migration checkpoint strategy.
- [x] Add observability fields for lineage/policy/adaptive paths.

### Phase 2: First-Class Versioned Memory State
- [x] Introduce lineage schema and append-first state transitions.
- [x] Add temporal query semantics (`asOf`, active projection behavior).
- [x] Validate backfill and rollback paths for lineage rollout.

### Phase 3: Unified Graph-Aware Retrieval
- [x] Fuse causal/entity/summary context in deterministic retrieval flow.
- [x] Add graph health metrics and deterministic tie-break rules.
- [x] Verify recall/precision stability against baseline scenarios.

### Phase 4: Self-Improving Retrieval Loops
- [x] Capture retrieval outcomes and correction signals.
- [x] Run adaptive ranking in shadow mode with bounded updates.
- [x] Promote to controlled activation only after guardrail pass.

### Phase 5: Hierarchical Scope and Governance Enforcement
- [x] Enforce tenant/user/agent/session predicates across all read/write/index paths.
- [x] Require provenance/temporal markers on governed ingestion.
- [x] Implement retention policies and auditable cascade deletion.

### Phase 6: Shared-Memory Collaboration and Rollout
- [x] Add shared-memory spaces, roles, and conflict strategies.
- [x] Gate broad collaboration rollout behind Phase 5 controls.
- [x] Execute staged release with kill switches and rollback drills.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lineage transitions, scope predicates, adaptive policy bounds | Vitest |
| Integration | Ingest -> lineage -> retrieval -> feedback -> governance lifecycle | Vitest + SQLite fixtures |
| Isolation/Security | Tenant/user/agent/session leak prevention and shared-space boundaries | Scenario test matrix |
| Migration | Forward/backward schema compatibility and checkpoint restore | Migration harness tests + checkpoint CLIs |
| Performance | Retrieval latency, adaptive overhead, queue throughput | Benchmark scripts + telemetry |
| Manual/Operator | Rollback drills, roadmap flag snapshots, and governance audit walkthroughs | Local runbooks + playbooks |

Notes:
- Local re-verification was rerun on 2026-03-15 with typecheck, build, targeted Hydra/doc suites, full `npm test`, and alignment-drift validation.
- Evidence in this plan is limited to commands rerun during implementation delivery and the 2026-03-15 truth-sync audit.
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
1. Disable affected roadmap flags (`SPECKIT_MEMORY_LINEAGE_STATE`, `SPECKIT_MEMORY_ADAPTIVE_RANKING`, `SPECKIT_MEMORY_SCOPE_ENFORCEMENT`, `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS`, `SPECKIT_MEMORY_SHARED_MEMORY`) or their `SPECKIT_HYDRA_*` compatibility aliases.
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

---

## Merged Section: 017-markovian-architectures Plan

> **Merge note (2026-03-14)**: Originally `017-markovian-architectures/plan.md`.

# Implementation Plan: 017-markovian-architectures
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Core Runtime** | Spec Kit Memory MCP server |
| **Storage** | SQLite-backed index + queue/state tables |
| **Test Framework** | Vitest |
| **Delivery Model** | Feature-flagged bounded rollout |

### Plan Outcome
This plan translates research into a bounded first milestone with three concrete deliverables:
1. Trace-only session-transition inference for `memory_context` / `memory_search`.
2. Bounded graph-walk additive scoring in Stage 2 behind explicit rollout controls.
3. Advisory ingestion lifecycle forecasting (ETA and failure-risk) from queue state.

Core code for these contracts is implemented and full targeted verification passed, including deterministic rerun and rollout hardening coverage.

The milestone does not include full MDP/MCTS/SSM-runtime work, and it does not reintroduce retired shadow scoring or novelty boost hot-path behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:scope-guardrails -->
## 2. SCOPE GUARDRAILS

### Explicit Non-Goals
- No planner-runtime architecture (MDP, MCTS, policy learning loops).
- No SSM runtime or inference stack redesign.
- No reactivation of historical shadow scoring.
- No novelty boost reintroduction in the retrieval hot path.

### In-Milestone Decision Boundaries
- Transition inference is trace-only in this milestone.
- Transition payload stays in trace surfaces (and trace-gated telemetry diagnostics), not non-trace metadata.
- Graph-walk contribution is additive, bounded, and reversible.
- Forecasts are advisory and confidence-scored, not operational blockers.
- Graduation to broader adaptive runtime behavior is post-milestone work.
<!-- /ANCHOR:scope-guardrails -->

---

<!-- ANCHOR:quality-gates -->
## 3. QUALITY GATES

### Definition of Ready (Planning -> Implementation)
- [x] Bounded first-milestone scope documented in `spec.md`.
- [x] File-level implementation surfaces identified.
- [x] Testing surfaces mapped to concrete Vitest suites.
- [x] Numbered feature branch exists (`017-markovian-architectures`).
- [x] Existing caveats preserved (memory save used JSON fallback and skipped semantic indexing).

### Definition of Done (Implementation Completion Target)
- [x] Transition trace contract implemented and tested.
- [x] Graph-walk bounded scoring implemented and tested.
- [x] Ingestion lifecycle forecast contract implemented and tested.
- [x] Focused verification confirms transition + graph-walk diagnostics telemetry contracts.
- [x] Deterministic ranking and rollback drill checks pass.
- [x] Documentation updates reflect final implementation reality.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 4. EXECUTION ARCHITECTURE

### Implementation Pattern
Extend existing handlers/pipeline incrementally using feature flags and trace-first observability. Keep all additions additive and reversible.

### Workstreams
- **WS1 Transition Trace**: infer and expose transition metadata in trace path only.
- **WS2 Graph-Walk Stage 2**: compute bounded bonus with normalization/restart semantics.
- **WS3 Lifecycle Forecasting**: derive advisory ETA/risk from queue state.
- **WS4 Observability + Safety**: telemetry, envelope formatting, and rollback controls.

### Data Flow
```text
memory_context
   -> build sessionTransition { previousState, currentState, confidence, signalSources, reason? }
   -> forward sessionTransition into memory_search

memory_search
   -> cache + dedup path
   -> post-cache transition injection (trace path)
   -> stage1
   -> stage2 (+ optional bounded graph bonus)
   -> stage3/stage4 deterministic ordering
   -> trace formatter + retrieval telemetry (transitionDiagnostics + graphWalkDiagnostics)

memory_ingest status
   -> queue lifecycle state
   -> forecast helper
   -> advisory ETA/risk fields + caveat
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phase-plan -->
## 5. PHASE PLAN

Status snapshot: Phases 1-5 are implemented and verified for this milestone.

### Phase 1: Preflight and Contract Freeze

**Objective**: Implemented contract/flag freeze for baseline-safe rollout behavior.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

**Exit criteria**:
- Graph-walk rollout flag constants and defaults documented.
- Transition traces explicitly routed through existing `includeTrace` / response-trace controls (no dedicated transition-trace flag).
- Ranking invariants and additive cap rules defined.
- Baseline telemetry markers recorded for comparison.

### Phase 2: Transition Trace Implementation

**Objective**: Implemented trace-only session-transition inference without changing routing behavior.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

**Exit criteria**:
- `memory_context` forwards `sessionTransition` and `memory_search` injects it post-cache when trace is enabled.
- Null-safe behavior for missing/sparse session state.
- No behavior changes when trace path is disabled.

### Phase 3: Stage 2 Graph-Walk Contribution

**Objective**: Implement bounded graph-walk bonus in Stage 2 with deterministic behavior.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`

**Exit criteria**:
- Graph bonus is bounded and flag-gated.
- Deterministic ordering contract holds.
- Graph diagnostics expose `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState` (`off|trace_only|bounded_runtime`).

### Phase 4: Ingestion Lifecycle Forecasting

**Objective**: Implement advisory ETA/failure-risk forecasts from existing queue state.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

**Exit criteria**:
- Forecast fields are available in status responses.
- Sparse/noisy history degrades to null/caveat safely.
- No ingest status call failures from forecast path.

### Phase 5: Validation and Rollout Readiness

**Objective**: Complete broader rollout hardening, deterministic rerun coverage, and graduation readiness artifacts.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` (targeted suites below)

**Exit criteria**:
- [x] Rollback drill path documented and testable.
- [x] Evaluation criteria and baseline comparison defined.
- [x] Bounded-runtime rollout remains optional and reversible.
<!-- /ANCHOR:phase-plan -->

---

<!-- ANCHOR:test-strategy -->
## 6. TEST STRATEGY

### Core Suites
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts`

### Validation Matrix

| Validation Type | Goal | Minimum Evidence |
|----------------|------|------------------|
| Unit | Contract logic correctness | Transition/graph/forecast helper assertions |
| Handler | API contract stability | Trace and status payload snapshots |
| Pipeline | Ranking determinism | Repeat-run ordering equivalence checks |
| Rollout | Safe enable/disable | Feature flag off-path equals baseline |
| Regression | Legacy behavior preservation | No reintroduction of retired shadow scoring/novelty boost |
<!-- /ANCHOR:test-strategy -->

---

<!-- ANCHOR:rollout -->
## 7. ROLLOUT AND ROLLBACK

### Rollout Ladder
1. `off`: baseline behavior only.
2. `trace_only`: transition and graph trace visible, no ranking impact.
3. `bounded_runtime`: bounded graph bonus enabled behind explicit flag.

Resolution: `SPECKIT_GRAPH_WALK_ROLLOUT` controls explicit rollout state; when unset, rollout resolves to `bounded_runtime` only if graph signals are enabled, otherwise `off`.

### Kill Switches
- Set `SPECKIT_GRAPH_WALK_ROLLOUT=off` (or disable graph signals) to remove graph-walk runtime impact.
- Disable response traces (`includeTrace` / response-trace controls) for transition visibility.
- Disable forecast emission path for ingest status.

### Rollback Procedure
1. Disable all Markovian flags.
2. Validate baseline ordering behavior and ingest responses.
3. Re-run targeted deterministic and contract suites.
4. Keep adaptive rollout proposals bounded or disabled until root cause is resolved.
<!-- /ANCHOR:rollout -->

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES AND CAVEATS

| Dependency/Caveat | Status | Impact | Mitigation |
|-------------------|--------|--------|------------|
| Numbered feature branch `017-markovian-architectures` | Closed | Prerequisite satisfied for implementation and verification | Keep branch active for any post-milestone follow-on specs |
| Prior research artifacts | Available | Needed for rationale and guardrails | Keep citations and constraints aligned |
| Existing trace envelope support | Available | Needed for inspectable rollout while keeping transition payload trace-only | Route new fields through `includeTrace` path and avoid non-trace transition metadata |
| Existing graph/Stage 2 substrate | Available | Needed for bounded graph bonus | Keep additive-only integration |
| Memory save quality caveat (JSON fallback, skipped semantic indexing) | Open caveat | Resume context may be weaker than ideal | Keep caveat documented; treat memory as partial context only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Complexity | Estimate |
|-------|------------|----------|
| Phase 1: Preflight and contracts | Complete | 0 days remaining |
| Phase 2: Transition trace | Complete | 0 days remaining |
| Phase 3: Bounded graph-walk Stage 2 | Complete | 0 days remaining |
| Phase 4: Lifecycle forecasting | Complete | 0 days remaining |
| Phase 5: Validation and rollout readiness | Complete | 0 days remaining |
| **Total** | | **0 days remaining** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:next -->
## 10. NEXT EXECUTION POINTER

- Primary execution checklist is tracked in `tasks.md`.
- Planning/readiness state is tracked in `checklist.md`.
- Milestone implementation and validation are complete on `017-markovian-architectures`.
<!-- /ANCHOR:next -->
