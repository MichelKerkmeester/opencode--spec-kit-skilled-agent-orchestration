---
title: "Tasks: 065/002 - memory-save negative trigger calibration"
description: "Task list for memory-save routing calibration."
trigger_phrases: ["065/002 tasks", "memory save calibration tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created task list"
    next_safe_action: "start_T001"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 065/002 - memory-save negative trigger calibration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [ ] Reproduce CP-101, CP-104, and `save context`
### T-002: [ ] Locate `memory:save` advisor metadata and scoring inputs
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [ ] Add regression coverage
### T-004: [ ] Apply minimal calibration
### T-005: [ ] Update evidence docs
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-006: [ ] Run advisor tests
### T-007: [ ] Run typecheck and build
### T-008: [ ] Run strict spec validation
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100 when CP-101 and CP-104 pass without regressing `save context`.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Parent: 065
- Baseline report: `../001-baseline-reindex-and-stress-results/002-skill-router-stress-tests/test-report.md`
<!-- /ANCHOR:cross-refs -->
