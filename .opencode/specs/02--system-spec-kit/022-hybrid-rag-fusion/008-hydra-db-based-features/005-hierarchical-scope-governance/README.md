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

> This folder defines the Level 3+ governance package for hierarchical boundaries, governed ingestion, retention/deletion controls, and auditability before shared collaboration rollout.

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

This folder defines the Level 3+ execution package for enforcing hierarchical boundaries, governed ingestion, retention, deletion, and auditability across the Memory MCP server. It is the trust and policy phase that protects the later collaboration rollout.

Phase 5 is shipped in the live runtime and remains the governance gate that Phase 6 depends on for safe collaboration rollout.

<!-- /ANCHOR:overview -->

## 2. CURRENT STATUS
<!-- ANCHOR:current-status -->

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Current Truth** | Runtime shipped and phase pack synchronized to the delivered governance, retention, deletion, and audit behavior |
| **Depends On** | `../004-adaptive-retrieval-loops/` plus Phase 2 lineage contracts |
| **Next Phase** | `../006-shared-memory-rollout/` |

<!-- /ANCHOR:current-status -->

## 3. DOCUMENTS
<!-- ANCHOR:documents -->

- `spec.md` defines scope isolation, provenance, retention, deletion, and audit requirements.
- `plan.md` breaks the phase into scope model, governed ingest, and lifecycle enforcement work.
- `tasks.md` tracks governance implementation and verification work.
- `checklist.md` records the completion evidence and rollout-readiness checks for the shipped phase.
- `decision-record.md` captures the governance-first decision for this phase.
- `implementation-summary.md` records the shipped implementation, verification set, and any remaining limitations.

<!-- /ANCHOR:documents -->

## 4. SCOPE BOUNDARY
<!-- ANCHOR:scope-boundary -->

Included here:
- Tenant, user, agent, and session scope enforcement.
- Provenance and temporal markers for governed ingest.
- Retention, deletion, and audit lifecycle controls.

Explicitly not included here:
- Shared-memory spaces themselves.
- Collaboration conflict resolution and rollout.

<!-- /ANCHOR:scope-boundary -->

## 5. RELATED
<!-- ANCHOR:related -->

- Parent roadmap: `../spec.md`
- Phase 2 lineage dependency: `../002-versioned-memory-state/spec.md`
- Phase 4 rollout dependency: `../004-adaptive-retrieval-loops/spec.md`
- Parent decisions: `../decision-record.md`

<!-- /ANCHOR:related -->
