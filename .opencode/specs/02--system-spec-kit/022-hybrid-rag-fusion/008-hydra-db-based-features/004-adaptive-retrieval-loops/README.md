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

> This folder defines the Level 3+ execution package for turning retrieval outcomes, access signals, and correction events into bounded adaptive learning loops under shadow-mode controls.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. DOCUMENTS](#2--documents)
- [3. SCOPE BOUNDARY](#3--scope-boundary)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->


## 1. OVERVIEW
<!-- ANCHOR:overview -->

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Current Truth** | Phase documentation and implementation summary align to shipped work; verification evidence is recorded in this folder. |
| **Depends On** | `../003-unified-graph-retrieval/` |
| **Next Phase** | `../005-hierarchical-scope-governance/` |

<!-- /ANCHOR:overview -->

## 2. DOCUMENTS
<!-- ANCHOR:documents -->

- `spec.md` defines adaptive ranking boundaries, shadow-mode rules, and acceptance scenarios.
- `plan.md` breaks the phase into signal capture, bounded policy, and rollout validation.
- `tasks.md` tracks the completed adaptive-learning implementation and verification work.
- `checklist.md` records the shipped verification evidence and review checkpoints for this phase.
- `decision-record.md` captures the shadow-first decision for this phase.
- `implementation-summary.md` records the delivered implementation, rollout approach, and verification evidence.

<!-- /ANCHOR:documents -->

## 3. SCOPE BOUNDARY
<!-- ANCHOR:scope-boundary -->

Included here:
- Retrieval outcome, access, and correction signal capture.
- Shadow-mode adaptive ranking with bounded updates.
- Rollback, auditability, and promotion criteria.

Explicitly not included here:
- Governance enforcement across all scopes.
- Shared-memory spaces and rollout.

<!-- /ANCHOR:scope-boundary -->

## 4. RELATED
<!-- ANCHOR:related -->

- Parent roadmap: `../spec.md`
- Phase 3 retrieval dependency: `../003-unified-graph-retrieval/spec.md`
- Parent decisions: `../decision-record.md`

<!-- /ANCHOR:related -->
