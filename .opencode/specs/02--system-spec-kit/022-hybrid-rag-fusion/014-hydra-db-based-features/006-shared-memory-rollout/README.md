---
title: "Phase README: 006-shared-memory-rollout"
description: "Navigation and current-status summary for Hydra roadmap Phase 6."
trigger_phrases:
  - "phase 6"
  - "shared memory rollout"
  - "collaboration rollout"
importance_tier: "critical"
contextType: "general"
---
# Phase 6: Shared-Memory Rollout

This folder defines the Level 3+ execution package for shared-memory spaces, membership policy, conflict handling, and staged rollout. It is the final release phase of the Hydra roadmap and is intentionally blocked on successful completion of the earlier safety and governance phases.

## Current Status

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Draft |
| **Current Truth** | Documentation package complete; implementation has not started in this phase |
| **Depends On** | `../005-hierarchical-scope-governance/` plus graph and adaptive readiness from Phases 3 and 4 |
| **Next Phase** | None |

## Documents

- `spec.md` defines shared-space, membership, conflict, and rollout requirements.
- `plan.md` breaks the phase into space model, conflict handling, and staged rollout work.
- `tasks.md` tracks collaboration implementation and release work.
- `checklist.md` records what is ready now versus what remains unverified.
- `decision-record.md` captures the opt-in rollout decision for this phase.
- `implementation-summary.md` records the truth that this phase is still planning-only.

## Scope Boundary

Included here:
- Shared-memory spaces and membership rules.
- Conflict strategy and collaboration safety controls.
- Staged rollout, kill switches, and operator runbooks.

Explicitly not included here:
- Pre-governance experiments that bypass Phase 5 controls.
- Unbounded collaboration access.

## Related

- Parent roadmap: `../spec.md`
- Phase 5 gate: `../005-hierarchical-scope-governance/spec.md`
- Parent decisions: `../decision-record.md`
