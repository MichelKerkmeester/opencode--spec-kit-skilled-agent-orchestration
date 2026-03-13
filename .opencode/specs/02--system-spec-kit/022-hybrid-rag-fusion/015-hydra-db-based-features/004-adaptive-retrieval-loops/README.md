---
title: "Phase README: 004-adaptive-retrieval-loops"
description: "Navigation and current-status summary for Hydra roadmap Phase 4."
trigger_phrases:
  - "phase 4"
  - "adaptive retrieval"
  - "shadow ranking"
importance_tier: "critical"
contextType: "general"
---
# Phase 4: Adaptive Retrieval Loops

This folder defines the Level 3+ execution package for turning retrieval outcomes, access signals, and correction events into bounded adaptive learning loops. It is the shadow-mode and policy-governed learning phase of the roadmap.

## Current Status

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Draft |
| **Current Truth** | Documentation package complete; implementation has not started in this phase |
| **Depends On** | `../003-unified-graph-retrieval/` |
| **Next Phase** | `../005-hierarchical-scope-governance/` |

## Documents

- `spec.md` defines adaptive ranking boundaries, shadow-mode rules, and acceptance scenarios.
- `plan.md` breaks the phase into signal capture, bounded policy, and rollout validation.
- `tasks.md` tracks adaptive-learning implementation and verification work.
- `checklist.md` records what is ready now versus what remains unverified.
- `decision-record.md` captures the shadow-first decision for this phase.
- `implementation-summary.md` records the truth that this phase is still planning-only.

## Scope Boundary

Included here:
- Retrieval outcome, access, and correction signal capture.
- Shadow-mode adaptive ranking with bounded updates.
- Rollback, auditability, and promotion criteria.

Explicitly not included here:
- Governance enforcement across all scopes.
- Shared-memory spaces and rollout.

## Related

- Parent roadmap: `../spec.md`
- Phase 3 retrieval dependency: `../003-unified-graph-retrieval/spec.md`
- Parent decisions: `../decision-record.md`
