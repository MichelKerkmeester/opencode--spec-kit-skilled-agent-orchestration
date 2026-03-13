---
title: "Phase README: 003-unified-graph-retrieval"
description: "Navigation and current-status summary for Hydra roadmap Phase 3."
trigger_phrases:
  - "phase 3"
  - "graph retrieval"
  - "graph fusion"
importance_tier: "critical"
contextType: "general"
---
# Phase 3: Unified Graph Retrieval

This folder defines the Level 3+ execution package for moving from fragmented retrieval signals to one deterministic graph-aware retrieval path. It covers causal, entity, and summary relationships, plus scoring explainability and regression control.

## Current Status

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Draft |
| **Current Truth** | Documentation package complete; implementation has not started in this phase |
| **Depends On** | `../002-versioned-memory-state/` |
| **Next Phase** | `../004-adaptive-retrieval-loops/` |

## Documents

- `spec.md` defines graph fusion goals, deterministic ranking rules, and acceptance scenarios.
- `plan.md` breaks the phase into scoring design, pipeline integration, and regression validation.
- `tasks.md` tracks retrieval integration and verification work.
- `checklist.md` records what is ready now versus what remains unverified.
- `decision-record.md` captures the graph-integration decision for this phase.
- `implementation-summary.md` records the truth that this phase is still planning-only.

## Scope Boundary

Included here:
- Unified causal, entity, and summary signal fusion.
- Deterministic ranking and tie-break rules.
- Retrieval explainability and graph-health verification.

Explicitly not included here:
- Adaptive learning loops.
- Governance and scope enforcement rollout.
- Shared-memory collaboration features.

## Related

- Parent roadmap: `../spec.md`
- Phase 2 lineage dependency: `../002-versioned-memory-state/spec.md`
- Parent decisions: `../decision-record.md`
