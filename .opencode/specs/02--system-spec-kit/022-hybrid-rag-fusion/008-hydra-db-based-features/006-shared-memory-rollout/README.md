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

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. CURRENT STATUS](#2--current-status)
- [3. DOCUMENTS](#3--documents)
- [4. SCOPE BOUNDARY](#4--scope-boundary)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

This folder defines the Level 3+ execution package for shared-memory spaces, membership policy, conflict handling, and staged rollout. It is the final release phase of the Hydra roadmap and is intentionally blocked on successful completion of the earlier safety and governance phases.

Phase 6 is shipped in the live runtime with opt-in shared-memory controls, deny-by-default membership, conflict handling, and rollout safeguards documented in this phase pack.

<!-- /ANCHOR:overview -->

## 2. CURRENT STATUS

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Current Truth** | Runtime shipped and phase pack synchronized to the delivered shared-memory rollout behavior |
| **Depends On** | `../005-hierarchical-scope-governance/` plus graph and adaptive readiness from Phases 3 and 4 |
| **Next Phase** | None |

## 3. DOCUMENTS

- `spec.md` defines shared-space, membership, conflict, and rollout requirements.
- `plan.md` breaks the phase into space model, conflict handling, and staged rollout work.
- `tasks.md` tracks collaboration implementation and release work.
- `checklist.md` records the completion evidence and rollout-readiness checks for the shipped phase.
- `decision-record.md` captures the opt-in rollout decision for this phase.
- `implementation-summary.md` records the shipped implementation, verification set, and any remaining limitations.

## 4. SCOPE BOUNDARY

Included here:
- Shared-memory spaces and membership rules.
- Conflict strategy and collaboration safety controls.
- Staged rollout, kill switches, and operator runbooks.

Explicitly not included here:
- Pre-governance experiments that bypass Phase 5 controls.
- Unbounded collaboration access.

## 5. RELATED
<!-- ANCHOR:related -->

- Parent roadmap: `../spec.md`
- Phase 5 gate: `../005-hierarchical-scope-governance/spec.md`
- Parent decisions: `../decision-record.md`

<!-- /ANCHOR:related -->
