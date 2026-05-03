---
title: "Tasks: 065 - skill-advisor routing quality program"
description: "Program-level task list for the 065 phase structure and follow-on calibration sequence."
trigger_phrases: ["065 tasks", "skill advisor routing quality tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T12:12:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed all remediation phases and final CP replay"
    next_safe_action: "commit_or_resume_from_clean_validation_state"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 065 - skill-advisor routing quality program

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: STRUCTURE
### T-001: [x] Preserve completed baseline under `001-baseline-reindex-and-stress-results`
### T-002: [x] Create follow-on phases 002-005 inside 065
### T-003: [x] Update root spec, description, and graph metadata
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: REMEDIATION SEQUENCE
### T-004: [x] Execute `002-memory-save-negative-trigger-calibration`
Evidence: CP-101 and CP-104 now pass, `save context` remains green, advisor tests/typecheck/build passed, and strict recursive validation passed.
### T-005: [x] Execute `003-create-testing-playbook-routing`
Evidence: CP-105 now returns `create:testing-playbook` top-1 at confidence 0.8387.
### T-006: [x] Execute `004-skill-router-alias-canonicalization`
Evidence: CP-103 now scores alias-aware PASS with `sk-deep-review` satisfying the expected deep-review command capability.
### T-007: [x] Execute `005-ambiguous-debug-review-routing`
Evidence: CP-100 now returns `sk-code-review` top-1 at confidence 0.82, while clear implementation prompts still route to `sk-code`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: FINALIZATION
### T-008: [x] Re-run full CP-100..CP-105 campaign
Evidence: final replay recorded CP-100 `sk-code-review`, CP-101 non-memory top-1, CP-102 no recommendations, CP-103 `sk-deep-review`, CP-104 `memory:save`, and CP-105 `create:testing-playbook`.
### T-009: [x] Update parent status docs with final PASS/WARN/FAIL
Evidence: root spec, plan, tasks, checklist, resource map, description, and graph metadata record the final result.
### T-010: [x] Run recursive strict validation and memory index scan
Evidence: recursive strict validation passed with 0 errors and 0 warnings. `memory_index_scan` completed for the 065 folder with 20 indexed, 18 updated, and 20 unchanged records; graph-metadata JSON files were rejected by the spec-doc indexer as non-doc records.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100 when phases 002-005 complete, the full CP campaign is re-run with documented results, and recursive strict validation passes.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Baseline: `001-baseline-reindex-and-stress-results/`
- Final phase: `005-ambiguous-debug-review-routing/`
<!-- /ANCHOR:cross-refs -->
