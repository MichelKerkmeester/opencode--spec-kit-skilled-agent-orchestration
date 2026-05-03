---
title: "Tasks: 065/001 — skill-reindex"
description: "Discrete task list for skill-reindex sub-phase."
trigger_phrases: ["065/001 tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/001-skill-reindex"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Tasks scaffolded"
    next_safe_action: "execute_T-001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0650010000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-065-001-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 065/001 — skill-reindex

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in-progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [ ] Capture pre-reindex snapshot via `skill_graph_status` + `advisor_status` + 5-prompt `advisor_recommend`
### T-002: [ ] Save snapshot to `pre-snapshot.json`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [ ] Run `/doctor:skill-advisor :auto` (fallback: `skill_graph_scan` + `advisor_rebuild` + `memory_index_scan`)
### T-004: [ ] Capture post-reindex snapshot (same MCP calls + sample)
### T-005: [ ] Save to `post-snapshot.json`
### T-006: [ ] Generate `reindex-diff.md` (counts, scoring deltas, confidence table)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-007: [ ] Run validation gates: status==healthy + per-prompt confidence ≥ 0.8
### T-008: [ ] Fill `implementation-summary.md` (what changed, drift, GO/NO-GO signal for 002)
### T-009: [ ] Run strict validator on this sub-phase folder
### T-010: [ ] Mark sub-phase complete; flip parent `derived.last_active_child_id` to `002-skill-router-stress-tests`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100. All 6 requirements (REQ-001..006) met. GO signal emitted to 002.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- spec.md, plan.md
- Parent: 065-skill-advisor-reindex-and-stress-test
- Sibling: 002-skill-router-stress-tests (consumer of GO signal)
- Skill: `/doctor:skill-advisor`
<!-- /ANCHOR:cross-refs -->
