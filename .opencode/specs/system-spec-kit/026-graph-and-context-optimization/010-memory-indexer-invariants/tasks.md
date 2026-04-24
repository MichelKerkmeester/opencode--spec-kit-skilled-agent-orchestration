---
title: "Tasks: Memory Indexer [system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/tasks]"
description: "Coordination-root task ledger for the umbrella restructure over the two shipped memory-indexer invariant children."
trigger_phrases:
  - "026/010 coord root tasks"
  - "memory indexer invariants tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants"
    last_updated_at: "2026-04-24T15:55:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Coord-root restructure complete"
    next_safe_action: "Monitor indexer telemetry across both children"
    blockers: []
    completion_pct: 100
    status: "complete"
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
---
# Tasks: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Restructure-only task ledger. Implementation work for each invariant lives in the child packets:

- `001-memory-indexer-lineage-and-concurrency-fix/tasks.md`
- `002-index-scope-and-constitutional-tier-invariants/tasks.md`

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:restructure -->
## 2. RESTRUCTURE TASKS

- [x] T001 (P0) Create coord-root folder `010-memory-indexer-invariants/` — evidence: folder present.
- [x] T002 (P0) `git mv` existing `010-memory-indexer-lineage-and-concurrency-fix/` into `010-memory-indexer-invariants/001-memory-indexer-lineage-and-concurrency-fix/` — evidence: child at nested path.
- [x] T003 (P0) `git mv` existing `011-index-scope-and-constitutional-tier-invariants/` into `010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants/` — evidence: child at nested path.
- [x] T004 (P0) Update in-packet path references via bulk sed (`packet_pointer`, `specFolder`, `spec_folder`, `reviewTarget`) across `*.md`, `*.json`, `*.jsonl` — evidence: `grep` for old flat paths returns zero hits.
- [x] T005 (P1) Scaffold coord-root `spec.md`, `description.json`, `graph-metadata.json` — evidence: all three files present with valid shape.
- [x] T006 (P1) Preserve old flat paths as `aliases` in coord-root `graph-metadata.json` — evidence: aliases array holds the two pre-move paths.
- [x] T007 (P1) Update children's METADATA tables with `Parent`, `Predecessor`, `Successor` fields — evidence: both children now reference the new coord root and sibling ordering.

---

<!-- /ANCHOR:restructure -->
<!-- ANCHOR:done -->
## 3. DONE

All coord-root restructure tasks complete. No open work at this level. Child-packet task lists are independent.

<!-- /ANCHOR:done -->
