---
title: "Phase README: 005-hierarchical-scope-governance"
description: "Navigation and current-status summary for Hydra roadmap Phase 5."
trigger_phrases:
  - "phase 5"
  - "scope governance"
  - "retention and deletion"
importance_tier: "critical"
contextType: "general"
---
# Phase 5: Hierarchical Scope and Governance

This folder defines the Level 3+ execution package for enforcing hierarchical boundaries, governed ingestion, retention, deletion, and auditability across the Memory MCP server. It is the trust and policy phase that protects the later collaboration rollout.

## Current Status

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Draft |
| **Current Truth** | Documentation package complete; implementation has not started in this phase |
| **Depends On** | `../004-adaptive-retrieval-loops/` plus Phase 2 lineage contracts |
| **Next Phase** | `../006-shared-memory-rollout/` |

## Documents

- `spec.md` defines scope isolation, provenance, retention, deletion, and audit requirements.
- `plan.md` breaks the phase into scope model, governed ingest, and lifecycle enforcement work.
- `tasks.md` tracks governance implementation and verification work.
- `checklist.md` records what is ready now versus what remains unverified.
- `decision-record.md` captures the governance-first decision for this phase.
- `implementation-summary.md` records the truth that this phase is still planning-only.

## Scope Boundary

Included here:
- Tenant, user, agent, and session scope enforcement.
- Provenance and temporal markers for governed ingest.
- Retention, deletion, and audit lifecycle controls.

Explicitly not included here:
- Shared-memory spaces themselves.
- Collaboration conflict resolution and rollout.

## Related

- Parent roadmap: `../spec.md`
- Phase 2 lineage dependency: `../002-versioned-memory-state/spec.md`
- Phase 4 rollout dependency: `../004-adaptive-retrieval-loops/spec.md`
- Parent decisions: `../decision-record.md`
