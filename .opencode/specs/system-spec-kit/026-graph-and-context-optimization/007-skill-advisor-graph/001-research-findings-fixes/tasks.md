---
title: "Tasks: Skill Graph Research Findings Fixes [template:level_2/tasks.md]"
description: "Task breakdown for 001-research-findings-fixes."
trigger_phrases:
  - "001-research-findings-fixes"
  - "tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes"
    last_updated_at: "2026-04-13T16:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created tasks"
    next_safe_action: "Implement fixes"
    key_files: ["tasks.md"]

---
# Tasks: Skill Graph Research Findings Fixes

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
## Phase 1: P0 Fixes (Blocking)

- [ ] T001 Guard against ghost candidates: modify `_apply_graph_boosts()` to skip targets with zero pre-graph score
- [ ] T002 Guard against ghost candidates: modify `_apply_family_affinity()` same guard
- [ ] T003 Fill edge gaps: add outbound edges to `system-spec-kit/graph-metadata.json` (enhances: sk-doc, sk-git, sk-code-opencode)
- [ ] T004 Fill edge gaps: add outbound edges to `sk-doc/graph-metadata.json` (enhances: system-spec-kit)
- [ ] T005 Fill edge gaps: add outbound edges to `mcp-coco-index/graph-metadata.json` (enhances: system-spec-kit)
- [ ] T006 Fill edge gaps: add enhances edges from `sk-improve-prompt/graph-metadata.json` to all 4 CLI skills
- [P] T007 Include `intent_signals` in compiled output: update `compile_graph()` in `skill_graph_compiler.py`
- [P] T008 Compile `prerequisite_for` into runtime adjacency: re-add to edge type filter in `skill_graph_compiler.py`
- [ ] T009 Separate graph evidence: add `_graph_boost_count` tracking to recommendations
- [ ] T010 Separate graph evidence: apply confidence penalty when majority of evidence is graph-derived
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: P1 Fixes (Important)

- [P] T011 Add compiler validation: zero-edge skill warnings
- [P] T012 Add compiler validation: self-edge detection
- [P] T013 Add compiler validation: dependency cycle detection (depends_on chains)
- [P] T014 Add compiler validation: enhances weight asymmetry warnings
- [ ] T015 Add `--audit-drift` flag comparing PHRASE_INTENT_BOOSTERS with graph intent_signals
- [ ] T016 Remove sibling edge between sk-deep-review and sk-deep-research
- [ ] T017 Fix reason ordering: sort by score contribution, group by source type
- [ ] T018 Add CocoIndex failure diagnostics: log subprocess errors as trace reasons
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Regenerate `skill-graph.json` with all metadata fixes
- [ ] T020 Run existing regression suite — verify zero failures
- [ ] T021 Add new regression cases for ghost candidate prevention
- [ ] T022 Run `--audit-drift` and document results
- [ ] T023 Write implementation-summary.md, finalize checklist
<!-- /ANCHOR:phase-3 -->
