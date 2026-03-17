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
| **Depends On** | `../002-versioned-memory-state/` |
| **Next Phase** | `../004-adaptive-retrieval-loops/` |

<!-- /ANCHOR:overview -->

## 2. DOCUMENTS
<!-- ANCHOR:documents -->

- `spec.md` defines graph fusion goals, deterministic ranking rules, and acceptance scenarios.
- `plan.md` breaks the phase into scoring design, pipeline integration, and regression validation.
- `tasks.md` tracks the completed retrieval integration and verification work.
- `checklist.md` records the shipped verification evidence and review checkpoints for this phase.
- `decision-record.md` captures the graph-integration decision for this phase.
- `implementation-summary.md` records the delivered implementation, rollout approach, and verification evidence.

<!-- /ANCHOR:documents -->

## 3. SCOPE BOUNDARY
<!-- ANCHOR:scope-boundary -->

Included here:
- Unified causal, entity, and summary signal fusion.
- Deterministic ranking and tie-break rules.
- Retrieval explainability and graph-health verification.

Explicitly not included here:
- Adaptive learning loops.
- Governance and scope enforcement rollout.
- Shared-memory collaboration features.

<!-- /ANCHOR:scope-boundary -->

## 4. RELATED
<!-- ANCHOR:related -->

- Parent roadmap: `../spec.md`
- Phase 2 lineage dependency: `../002-versioned-memory-state/spec.md`
- Parent decisions: `../decision-record.md`

<!-- /ANCHOR:related -->
