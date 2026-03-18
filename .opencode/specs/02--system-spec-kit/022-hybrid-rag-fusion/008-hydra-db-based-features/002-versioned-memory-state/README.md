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

> This folder defines the Level 3+ execution package for turning the current Memory MCP stack into an append-first state model with lineage and temporal-query behavior.

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
| **Depends On** | `../001-baseline-and-safety-rails/` |
| **Next Phase** | `../003-unified-graph-retrieval/` |

<!-- /ANCHOR:overview -->

## 2. DOCUMENTS
<!-- ANCHOR:documents -->

- `spec.md` defines lineage, temporal state, migration, and governance requirements.
- `plan.md` lays out schema, write-path, query, and rollback execution tracks.
- `tasks.md` breaks the phase into discovery, implementation, migration, and verification work.
- `checklist.md` records completed verification gates and linked implementation evidence.
- `decision-record.md` captures the phase-local lineage design decision.
- `implementation-summary.md` records the current truth: implementation completed and validated.

<!-- /ANCHOR:documents -->

## 3. SCOPE BOUNDARY
<!-- ANCHOR:scope-boundary -->

Included here:
- Append-first version state transitions.
- Active projection and `asOf` query semantics.
- Backfill, rollback, and lineage integrity verification.

Explicitly not included here:
- Unified graph retrieval fusion.
- Adaptive ranking loops.
- Shared-memory collaboration rollout.

<!-- /ANCHOR:scope-boundary -->

## 4. RELATED
<!-- ANCHOR:related -->

- Parent roadmap: `../spec.md`
- Phase 1 baseline controls: `../001-baseline-and-safety-rails/spec.md`
- Parent decisions: `../decision-record.md`

<!-- /ANCHOR:related -->
