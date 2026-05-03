---
title: "Tasks: 063 — sk-doc Agent Template Alignment"
description: "Task list for 063a + 063b."
trigger_phrases:
  - "063 tasks"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/063-sk-doc-agent-template-alignment"
    last_updated_at: "2026-05-03T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "T-001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-063-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 063

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

`[ ]` pending, `[~]` in-progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### T-001: Snapshot 40 agent files into improvement/pre-promote-backup/
### T-002: Run cleanup Python (063a) on 40 files
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### T-003: Verify TOML still parses for all 10 .codex files
### T-004: Verify all agent files ≤ 600 lines + RELATED RESOURCES gone
### T-005: Update sk-doc/assets/agents/agent_template.md (063b)
### T-006: Validate sk-doc template (grep new sections present)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

### T-007: Final grep audit: zero RELATED RESOURCES, zero @write in template
### T-008: Mark complete, commit, push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

graph-metadata.status=complete pct=100. Validator 0 errors.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md, plan.md
- 060/061/062 reference packets (production source)
<!-- /ANCHOR:cross-refs -->
