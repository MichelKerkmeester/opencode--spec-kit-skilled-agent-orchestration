---
title: "Decision Record: Agent Improver Deep Loop Alignment [042.005]"
description: "Architectural decisions for aligning sk-agent-improver with deep-loop runtime truth contracts"
trigger_phrases:
  - "042.005"
  - "agent improver decisions"
  - "improvement loop ADR"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Agent Improver Deep Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

## ADR-001: Journal Emission in Orchestrator, Not Agent

**Status**: Proposed
**Context**: The agent-improver agent is deliberately proposal-only (LEAF constraint). Adding journal emission could blur this boundary.
**Decision**: Journal writes happen in the orchestrator (`/improve:agent` command workflow), not in the LEAF agent. The agent stays proposal-only.
**Consequences**: Orchestrator must handle all audit logging. Agent contract remains clean.

---

## ADR-002: Coverage Graph Reuse with Improvement Namespace

**Status**: Proposed
**Context**: Phase 2 built a coverage graph in `deep-loop-graph.sqlite`. Agent-improver needs similar mutation tracking.
**Decision**: Reuse the same SQLite database with `loop_type: "improvement"` namespace. Node kinds: dimension, mutation_type, integration_surface, candidate.
**Consequences**: Single database for all deep-loop products. Namespace isolation via session_id prevents cross-contamination.

---

## ADR-003: Dimension Trajectory as First-Class Convergence Signal

**Status**: Proposed
**Context**: Agent-improver has 5 scoring dimensions. Convergence means all 5 are stable.
**Decision**: Track score trajectories per dimension across iterations. Convergence = all 5 scores stable within epsilon for N consecutive candidates.
**Consequences**: Richer convergence model than simple score plateau. Enables trade-off detection.

---

## ADR-004: Parallel Candidates Are Opt-In

**Status**: Proposed
**Context**: Wave executor from Phase 3 enables parallel processing. Agent improvement is typically sequential.
**Decision**: Parallel candidate generation is opt-in, only when mutation space is broad enough (>3 untried strategies). Default path remains sequential.
**Consequences**: No overhead for simple improvement sessions. Power users can enable parallel exploration.

---

## ADR-005: Backward Compatibility with Existing Sessions

**Status**: Proposed
**Context**: Existing improvement sessions must not break when new fields are added.
**Decision**: All new config fields are optional with sensible defaults. Existing sessions can be resumed without migration.
**Consequences**: Zero migration cost. New capabilities discoverable but not forced.

---

## Cross-References

- **Specification**: See `spec.md`
- **Implementation Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
