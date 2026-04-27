---
title: "Feature Specification: hybrid-rag-adoption: Hybrid RAG Adoption"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "002-hybrid-rag-adoption: Hybrid RAG Adoption"
trigger_phrases:
  - "002"
  - "hybrid"
  - "rag"
  - "adoption"
  - "spec"
  - "implementation"
  - "plan"
  - "tasks"
  - "verification"
  - "checklist"
  - "decision"
  - "record"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase manifest: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: hybrid-rag-adoption: Hybrid RAG Adoption

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-13 |
| **Branch** | `main` |
| **Parent Spec** | None (collection root) |
| **Parent Packet** | `hybrid-rag-fusion-upgrade` |
| **Predecessor** | `See child ordering above` |
| **Successor** | None |
| **Handoff Criteria** | Parent manifest, `description.json`, and `graph-metadata.json` stay aligned with the current child phase folders and pass tolerant phase-parent validation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This parent packet coordinates the phased work under `hybrid-rag-adoption: Hybrid RAG Adoption` so the child packets stay discoverable and the root purpose remains clear while implementation details live below the parent level. The current child surface includes 001-architecture-boundary-freeze, 002-memory-review-tool, 003-save-ergonomics, and other child phases.

### Purpose
Keep this sealed phase-parent packet validator-compliant as a lean manifest that preserves the original purpose, lists the child phases, and leaves detailed planning, execution, and verification in the child folders without rewriting archive history.

> **Phase-parent note:** This `spec.md` is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Preserve the root purpose for `002-hybrid-rag-adoption` without rewriting child-phase intent.
- Keep the parent packet discoverable as a lean manifest over the current child phase folders.
- Refresh parent discovery metadata and graph rollup so resume and validation surfaces point at the correct child packets.

### Out of Scope
- Editing any child packet content under `002-hybrid-rag-adoption/[0-9][0-9][0-9]-*/`.
- Deleting or archiving legacy heavy parent docs that already exist beside the lean trio.
- Reconstructing missing historical detail beyond what is needed for the parent manifest.

### Files to Change
[Parent-level scope is limited to `spec.md`, `description.json`, and `graph-metadata.json`. Detailed execution, planning, and verification remain inside the child phase folders.]
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Status is derived from each child `graph-metadata.json` `derived.status` when present.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-architecture-boundary-freeze/` | architecture-boundary-freeze: Freeze Authority Boundaries | planned |
| 2 | `002-memory-review-tool/` | memory-review-tool: Ship Memory Review First | planned |
| 3 | `003-save-ergonomics/` | save-ergonomics: Wrap JSON-Primary Save Authority | planned |
| 4 | `004-compaction-checkpointing/` | compaction-checkpointing: Preserve Context Before Compaction | planned |
| 5 | `005-bootstrap-guidance/` | bootstrap-guidance: Teach At Existing Bootstrap Surfaces | planned |
| 6 | `006-doctor-debug-overlay/` | doctor-debug-overlay: Add Compact Diagnostics | planned |
| 7 | `007-workflow-guidance-map/` | workflow-guidance-map: Publish Task-To-Tool Routing | planned |
| 8 | `008-rollout-evidence-gates/` | rollout-evidence-gates: Define Measurable Adoption Gates | planned |
| 9 | `009-prototype-backlog/` | prototype-backlog: Record Flagged Prototype Candidates | planned |
| 10 | `010-passive-capture-investigation/` | passive-capture-investigation: Investigate Passive Capture | planned |
| 11 | `011-tool-profile-split-investigation/` | tool-profile-split-investigation: Investigate Tool Profile Splits | planned |
| 12 | `012-drift-detection-evaluation/` | drift-detection-evaluation: Evaluate Drift Detection | planned |
| 13 | `013-fsrs-memory-decay-study/` | fsrs-memory-decay-study: Study FSRS Decay Defaults | planned |
| 14 | `014-bm25-field-weight-evaluation/` | bm25-field-weight-evaluation: Evaluate BM25 Field Weights | planned |
| 15 | `015-rrf-hybrid-retrieval-evaluation/` | rrf-hybrid-retrieval-evaluation: Evaluate RRF Hybrid Retrieval | planned |
| 16 | `016-connected-doc-hints-investigation/` | connected-doc-hints-investigation: Investigate Connected-Doc Hints | planned |
| 17 | `017-temporal-knowledge-graph-investigation/` | temporal-knowledge-graph-investigation: Investigate Temporal Knowledge Graphs | planned |
| 18 | `018-wake-up-context-layering-study/` | wake-up-context-layering-study: Study Wake-Up Context Layering | planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map plus `graph-metadata.json` child rollup.
- Use `/spec_kit:resume system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/[NNN-phase]/` to resume a specific child phase.
- Run `validate.sh --recursive` on the parent when validating the integrated phase train.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-architecture-boundary-freeze` | `002-memory-review-tool` | `001-architecture-boundary-freeze` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `002-memory-review-tool` |
| `002-memory-review-tool` | `003-save-ergonomics` | `002-memory-review-tool` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `003-save-ergonomics` |
| `003-save-ergonomics` | `004-compaction-checkpointing` | `003-save-ergonomics` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `004-compaction-checkpointing` |
| `004-compaction-checkpointing` | `005-bootstrap-guidance` | `004-compaction-checkpointing` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `005-bootstrap-guidance` |
| `005-bootstrap-guidance` | `006-doctor-debug-overlay` | `005-bootstrap-guidance` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `006-doctor-debug-overlay` |
| `006-doctor-debug-overlay` | `007-workflow-guidance-map` | `006-doctor-debug-overlay` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `007-workflow-guidance-map` |
| `007-workflow-guidance-map` | `008-rollout-evidence-gates` | `007-workflow-guidance-map` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `008-rollout-evidence-gates` |
| `008-rollout-evidence-gates` | `009-prototype-backlog` | `008-rollout-evidence-gates` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `009-prototype-backlog` |
| `009-prototype-backlog` | `010-passive-capture-investigation` | `009-prototype-backlog` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `010-passive-capture-investigation` |
| `010-passive-capture-investigation` | `011-tool-profile-split-investigation` | `010-passive-capture-investigation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `011-tool-profile-split-investigation` |
| `011-tool-profile-split-investigation` | `012-drift-detection-evaluation` | `011-tool-profile-split-investigation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `012-drift-detection-evaluation` |
| `012-drift-detection-evaluation` | `013-fsrs-memory-decay-study` | `012-drift-detection-evaluation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `013-fsrs-memory-decay-study` |
| `013-fsrs-memory-decay-study` | `014-bm25-field-weight-evaluation` | `013-fsrs-memory-decay-study` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `014-bm25-field-weight-evaluation` |
| `014-bm25-field-weight-evaluation` | `015-rrf-hybrid-retrieval-evaluation` | `014-bm25-field-weight-evaluation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `015-rrf-hybrid-retrieval-evaluation` |
| `015-rrf-hybrid-retrieval-evaluation` | `016-connected-doc-hints-investigation` | `015-rrf-hybrid-retrieval-evaluation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `016-connected-doc-hints-investigation` |
| `016-connected-doc-hints-investigation` | `017-temporal-knowledge-graph-investigation` | `016-connected-doc-hints-investigation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `017-temporal-knowledge-graph-investigation` |
| `017-temporal-knowledge-graph-investigation` | `018-wake-up-context-layering-study` | `017-temporal-knowledge-graph-investigation` remains discoverable and its successor relationship stays explicit in the parent manifest | Parent `spec.md` phase map and `graph-metadata.json` child list both include `018-wake-up-context-layering-study` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- No additional parent-level open questions are required here. Phase-specific unknowns live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase `spec.md`, `plan.md`, `tasks.md`, and verification docs.
- **Graph metadata**: See `graph-metadata.json` for the current child rollup and derived status.
