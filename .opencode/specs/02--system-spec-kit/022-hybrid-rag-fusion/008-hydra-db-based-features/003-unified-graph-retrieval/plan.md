---
title: "Implementation [02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/003-unified-graph-retrieval/plan]"
description: "Execution plan for Hydra Phase 3 deterministic graph fusion."
trigger_phrases:
  - "phase 3 plan"
  - "graph fusion plan"
importance_tier: "critical"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch + level3plus-govern | v2.2"
---
# Implementation Plan: 003-unified-graph-retrieval

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP retrieval pipeline plus storage-backed signal modules |
| **Storage** | Existing vector, FTS, causal, and summary data plus Phase 2 lineage references |
| **Testing** | Vitest, retrieval regression harnesses, latency checks, manual trace walkthroughs |

### Overview
Phase 3 integrates graph context into the main retrieval flow. The plan focuses on bounded graph contributions, deterministic ordering, explainability traces, and rollback-safe activation so the retrieval system becomes more coherent without becoming opaque or unstable.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 3 problem statement and scope documented
- [x] Dependencies on Phase 2 and parent ADRs documented
- [x] Determinism, explainability, and rollback requirements documented
- [x] Phase 2 handoff approved

### Definition of Done
- [x] Unified graph scoring path implemented
- [x] Deterministic tie-break and score-trace coverage passes
- [x] Benchmarks stay within agreed latency limits
- [x] Kill-switch rollback path validated
- [x] Docs and playbook reflect shipped behavior

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-process graph-fusion layer inside the current retrieval pipeline, with bounded scoring and traceable stage outputs.

### Key Components
- **Candidate Enrichment Layer**: Pulls graph context into retrieval candidates.
- **Graph Scoring Layer**: Combines causal, entity, and summary signals.
- **Determinism Layer**: Applies explicit tie-break and ordering rules.
- **Explainability Layer**: Emits score contribution traces.
- **Regression Layer**: Benchmarks latency and quality changes against baseline.

### Data Flow
1. Candidate generation produces the initial hybrid set.
2. Graph enrichment gathers causal, entity, and summary neighbors.
3. Unified scoring applies bounded graph contributions.
4. Determinism rules finalize stable ordering.
5. Explainability and telemetry record how graph signals affected results.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Scoring Contract
- [x] Define bounded graph scoring rules
- [x] Define deterministic tie-break order
- [x] Define explainability trace format

### Phase B: Pipeline Integration
- [x] Integrate graph enrichment into the current retrieval stages
- [x] Add score-trace and graph-health telemetry
- [x] Add kill-switch or rollback configuration path

### Phase C: Regression and Rollout Validation
- [x] Add determinism and latency benchmarks
- [x] Add retrieval regression suites
- [x] Add manual playbook scenarios for graph explainability

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Scoring rules, tie-break logic, trace formatting | Vitest |
| Integration | End-to-end retrieval with graph enrichment | Vitest with fixtures |
| Regression | Quality comparisons against Phase 2 baseline | Retrieval harness |
| Performance | Latency and graph-expansion overhead | Benchmark scripts |
| Manual | Explainability and rollback walkthroughs | Playbook scenarios |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 lineage contract | Internal | Yellow | Graph context lacks stable state anchors |
| Existing candidate pipeline | Internal | Green | No clean integration point for graph fusion |
| Parent ADR-002 | Architecture | Green | Service-boundary choice becomes ambiguous |
| Phase 1 build/test controls | Internal | Green | Regression evidence is harder to trust |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Latency regression, unstable ranking, opaque explainability, or degraded quality.
- **Procedure**:
1. Disable graph-fusion activation.
2. Re-run baseline retrieval smoke tests.
3. Compare trace and ranking deltas.
4. Revert graph-fusion changes if the issue cannot be isolated quickly.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Phase 2 lineage -> Graph scoring contract -> Pipeline integration -> Regression validation -> Phase 4 handoff
```

| Phase Step | Depends On | Blocks |
|------------|------------|--------|
| Scoring contract | Phase 2 | Integration and regression work |
| Pipeline integration | Scoring contract | Regression validation |
| Regression validation | Pipeline integration | Phase 4 and Phase 6 confidence |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Scoring and determinism design | High | 2-3 days |
| Pipeline integration | High | 3-5 days |
| Regression and benchmark coverage | Medium-High | 2-4 days |
| **Total** | | **7-12 days** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline regression corpus captured
- [x] Determinism tests authored
- [x] Kill-switch path identified
- [x] Trace sampling strategy chosen

### Rollback Procedure
1. Disable graph fusion.
2. Re-run baseline regression and latency checks.
3. Confirm ordering returns to the pre-phase baseline.
4. Revert graph-fusion code if needed.

### Data Reversal
- **Has data migrations?** No mandatory schema migration is planned for this phase.
- **Reversal procedure**: Disable graph-fusion logic and revert in-process scoring changes.

<!-- /ANCHOR:enhanced-rollback -->
---

## L3: DEPENDENCY GRAPH

```text
+----------------------+
| Graph Scoring Rules  |
+----------+-----------+
           v
+----------+-----------+
| Pipeline Integration |
+----------+-----------+
           v
+----------+-----------+
| Determinism + Traces |
+----------+-----------+
           v
+----------+-----------+
| Regression Validation|
+----------+-----------+
           v
+----------------------+
| Phase 4 Handoff      |
+----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Scoring rules | Phase 2 | Stable graph contract | Integration |
| Pipeline integration | Scoring rules | Unified retrieval path | Traces, benchmarks |
| Determinism and traces | Integration | Explainable rankings | Regression approval |
| Regression validation | Integration, traces | Rollout confidence | Phase 4 shadow learning |

---

## L3: CRITICAL PATH

1. Lock graph scoring contract
2. Integrate into the retrieval pipeline
3. Validate determinism and explainability
4. Validate benchmarks and rollback

**Total Critical Path**: 4 major steps

**Parallel Opportunities**:
- Benchmark harness work can start after scoring rules stabilize.
- Playbook and trace documentation can proceed during regression authoring.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Graph contract locked | Signal weighting and tie-break rules defined | Early Phase 3 |
| M2 | Unified path active in tests | Retrieval pipeline exercises graph scoring | Mid Phase 3 |
| M3 | Phase 4 handoff ready | Determinism, latency, and rollback checks pass | End Phase 3 |

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-301: Keep Graph Fusion In-Process and Deterministic

**Status**: Accepted

**Context**: Retrieval quality needs improvement without adding an external service or opaque ranking path.

**Decision**: Extend the current retrieval pipeline with bounded graph fusion and explicit tie-break rules.

**Consequences**:
- Faster delivery and simpler rollback.
- Requires careful regression measurement and trace design.

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
| Primary | Retrieval integration | search pipeline modules |
| Primary | Regression and benchmarks | tests and benchmark harnesses |
| Primary | Explainability and docs | telemetry, playbook, docs |

### Tier 3: Integration
**Agent**: Primary
**Task**: Reconcile ranking quality, latency, and explainability evidence

---

## L3+: WORKSTREAM COORDINATION

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Scoring contract | Primary | search scoring modules | Complete |
| W-B | Integration and traces | Primary | retrieval and telemetry modules | Complete |
| W-C | Regression and docs | Primary | tests, benchmarks, playbook | Complete |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-301 | Scoring contract approved | Primary | Integration can begin |
| SYNC-302 | Regression suite passes | Primary | Phase 4 handoff decision |

### File Ownership Rules
- Retrieval-path changes stay isolated from adaptive-learning logic.
- Trace formats must be documented before rollout.
- Docs must describe only shipped graph behavior once implementation begins.

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- Update `tasks.md` when scoring, integration, or regression milestones move
- Record contract shifts in `decision-record.md`
- Sync parent roadmap phase map before and after execution starts

### Escalation Path
1. Ranking instability -> Phase 3 ADR review
2. Latency regression -> benchmark and rollback review
3. Contract conflict with Phase 4 -> parent roadmap decision
