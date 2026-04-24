---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
title: "Plan: Memory Indexer Invariants (Coordination Root)"
description: "Coordination-root plan for the two shipped memory-indexer invariant children. No implementation work planned at this level — execution lives in the child packets."
trigger_phrases:
  - "026/010 coord root plan"
  - "memory indexer invariants plan"
importance_tier: "high"
contextType: "plan"
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
---
# Plan: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This coord-root plan exists to satisfy the level-structure contract for the umbrella folder. Both children shipped before this restructure, so there is no outstanding implementation work at the coord-root level. Execution planning lives in:

- `001-memory-indexer-lineage-and-concurrency-fix/plan.md` — executed
- `002-index-scope-and-constitutional-tier-invariants/plan.md` — executed

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:phases -->
## 2. PHASES

| Phase | Status | Delivered By |
|-------|--------|--------------|
| Lineage and concurrency fix | Complete | `001-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md` |
| Index-scope and constitutional-tier invariants | Complete | `002-index-scope-and-constitutional-tier-invariants/implementation-summary.md` |

---

<!-- /ANCHOR:phases -->
<!-- ANCHOR:approach -->
## 3. APPROACH

Restructure-only at coord-root level — no new implementation. The approach was:

1. Create the coord-root folder and scaffold its metadata surfaces.
2. `git mv` the two top-level siblings (`010-memory-indexer-lineage-and-concurrency-fix/`, `011-index-scope-and-constitutional-tier-invariants/`) into nested positions (`001-*/`, `002-*/`).
3. Update in-packet path references via bulk sed (`packet_pointer`, `specFolder`, `spec_folder` fields across `*.md`, `*.json`, `*.jsonl`).
4. Update children's spec.md METADATA tables with new Parent / Predecessor / Successor pointers.
5. Preserve old flat paths in the coord-root's `graph-metadata.json.aliases` for backward-compatible lookups.

---

<!-- /ANCHOR:approach -->
<!-- ANCHOR:verification -->
## 4. VERIFICATION

- Both children validate with their pre-restructure error patterns (no regressions from the move).
- `grep` for old flat paths across the moved tree returns zero stale references.
- Coord-root `graph-metadata.json.aliases` preserves the two pre-move paths so prior cross-references keep resolving.

<!-- /ANCHOR:verification -->
