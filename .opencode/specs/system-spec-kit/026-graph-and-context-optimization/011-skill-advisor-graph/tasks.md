---
title: "Tasks: Skill Advisor Graph [template:level_2/tasks.md]"
description: "Task breakdown for 011-skill-advisor-graph."
trigger_phrases:
  - "011-skill-advisor-graph"
  - "tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph"
    last_updated_at: "2026-04-13T12:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created tasks"
    next_safe_action: "Implement graph metadata files"
    key_files: ["tasks.md"]

---
# Tasks: Skill Advisor Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Metadata & Compiler

- [x] T001 Create spec folder Level 2 docs (spec.md, plan.md, tasks.md, checklist.md) + description.json + graph-metadata.json
- [x] T002 Author all 20 per-skill `graph-metadata.json` files with correct edge data per edge inventory
- [x] T003 Write `skill_graph_compiler.py` (discover, validate, compile, CLI)
- [x] T004 Run compiler, generate `skill-graph.json`, verify size < 2KB [EVIDENCE: 1950 bytes]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Advisor Integration

- [x] T005 Add `_load_skill_graph()` lazy loader to `skill_advisor.py`
- [x] T006 Implement `_apply_graph_boosts()` with snapshot pattern
- [x] T007 Implement `_apply_family_affinity()` for family-aware boosting
- [x] T008 Implement `_apply_graph_conflict_penalty()` for conflict detection
- [x] T009 Wire T006/T007/T008 into `analyze_request()` + extend `health_check()`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run existing regression suite — verify zero regressions [EVIDENCE: 44/44 pass, 100% rate]
- [x] T011 Add new regression cases for graph boost behavior [EVIDENCE: 3 new P1-GRAPH cases added]
- [x] T012 Write implementation-summary.md, finalize checklist
<!-- /ANCHOR:phase-3 -->
