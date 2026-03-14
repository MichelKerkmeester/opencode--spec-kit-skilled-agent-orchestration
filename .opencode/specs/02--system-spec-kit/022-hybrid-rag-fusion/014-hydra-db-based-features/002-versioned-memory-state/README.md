---
title: "Phase README: 002-versioned-memory-state"
description: "Navigation and current-status summary for Hydra roadmap Phase 2."
trigger_phrases:
  - "phase 2"
  - "versioned memory state"
  - "lineage phase"
importance_tier: "critical"
contextType: "general"
---
# Phase 2: Versioned Memory State

This folder defines the Level 3+ execution package for turning the current Memory MCP stack into a first-class append-first state model. It is the lineage and temporal-query phase of the Hydra roadmap.

## Current Status

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Draft |
| **Current Truth** | Documentation package complete; implementation has not started in this phase |
| **Depends On** | `../001-baseline-and-safety-rails/` |
| **Next Phase** | `../003-unified-graph-retrieval/` |

## Documents

- `spec.md` defines lineage, temporal state, migration, and governance requirements.
- `plan.md` lays out schema, write-path, query, and rollback execution tracks.
- `tasks.md` breaks the phase into discovery, implementation, migration, and verification work.
- `checklist.md` records what is already prepared versus what remains unverified.
- `decision-record.md` captures the phase-local lineage design decision.
- `implementation-summary.md` records the current truth: docs complete, implementation pending.

## Scope Boundary

Included here:
- Append-first version state transitions.
- Active projection and `asOf` query semantics.
- Backfill, rollback, and lineage integrity verification.

Explicitly not included here:
- Unified graph retrieval fusion.
- Adaptive ranking loops.
- Shared-memory collaboration rollout.

## Related

- Parent roadmap: `../spec.md`
- Phase 1 baseline controls: `../001-baseline-and-safety-rails/spec.md`
- Parent decisions: `../decision-record.md`
