---
title: "Tasks: deep-review CP-Scenario Authoring (003)"
description: "Sub-phase under 062-deep-loop-command-flow-stress-tests. Apply 060/004 methodology."
trigger_phrases:
  - "003-deep-review-cp-scenarios"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-deep-loop-command-flow-stress-tests/003-deep-review-cp-scenarios"
    last_updated_at: "2026-05-02T19:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Mark T-001 in_progress when work starts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-062-2026-05-02"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: deep-review CP-Scenario Authoring (003)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

`[ ]` pending, `[~]` in-progress, `[x]` done

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### T-001: Re-read 060/004 spec/plan/tasks
- `cat .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/004-improve-agent-command-flow-stress-tests/{spec,plan,tasks}.md`

### T-002: Re-read 060/003 §7 (preflight + rubric)
- `cat .opencode/specs/.../003-followup-research/research/research.md`

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### T-003: Author CP-XXX scenario 1 of 6 (apply 13-question preflight)
### T-004: Author CP-XXX scenarios 2-6
### T-005: Build setup-cp-sandbox.sh helper
### T-006: Validate sandbox helper (idempotent dry-run)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

### T-007: Final preflight check across all 6 CPs
### T-008: Hand-off marker for 002 (or 004) stress runs

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

graph-metadata.status=complete, pct=100. Spec success criteria met.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md
- plan.md
- 060/004 reference packet
- 060/003 research

<!-- /ANCHOR:cross-refs -->
