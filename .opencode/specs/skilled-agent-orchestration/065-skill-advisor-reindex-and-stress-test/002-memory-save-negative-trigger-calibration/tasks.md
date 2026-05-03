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
    recent_action: "Completed calibration, tests, and evidence updates"
    next_safe_action: "continue_phase_003_create_testing_playbook_routing"
    blockers: []
    key_files: []
    completion_pct: 100
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
### T-001: [x] Reproduce CP-101, CP-104, and `save context`
Evidence: direct `skill_advisor.py --threshold 0.0` probes reproduced CP-101 at `memory:save` 0.82, CP-104 missing `memory:save`, and `save context` top-1 `memory:save` 0.9039 before calibration.
### T-002: [x] Locate `memory:save` advisor metadata and scoring inputs
Evidence: checked native explicit/lexical/fusion lanes, command bridge projection, Python shim scoring, and graph health inventory surfaces.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [x] Add regression coverage
Evidence: added 065/002 cases to `skill_advisor/tests/scorer/native-scorer.vitest.ts`, plus compatibility expectations for memory-save command output.
### T-004: [x] Apply minimal calibration
Evidence: added next-session preservation explicit boost and file-save confidence cap for `memory:save` / `command-memory-save`.
### T-005: [x] Update evidence docs
Evidence: `implementation-summary.md`, `tasks.md`, `checklist.md`, `resource-map.md`, `description.json`, and `graph-metadata.json` updated for delivered status.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-006: [x] Run advisor tests
Evidence: `npx vitest run skill_advisor/tests` passed 40 files / 293 tests.
### T-007: [x] Run typecheck and build
Evidence: `npm run typecheck` and `npm run build` both passed in `.opencode/skill/system-spec-kit/mcp_server`.
### T-008: [x] Run strict spec validation
Evidence: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test --strict` passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100: CP-101 and CP-104 pass without regressing `save context`.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Parent: 065
- Baseline report: `../001-baseline-reindex-and-stress-results/002-skill-router-stress-tests/test-report.md`
<!-- /ANCHOR:cross-refs -->
