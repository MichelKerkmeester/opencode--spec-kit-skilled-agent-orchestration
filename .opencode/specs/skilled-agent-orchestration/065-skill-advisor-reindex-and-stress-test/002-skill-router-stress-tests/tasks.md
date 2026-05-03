---
title: "Tasks: 065/002 — skill-router-stress-tests"
description: "Discrete task list for skill router stress test campaign."
trigger_phrases: ["065/002 tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-skill-router-stress-tests"
    last_updated_at: "2026-05-03T09:35:00Z"
    last_updated_by: "claude"
    recent_action: "Tasks scaffolded"
    next_safe_action: "wait_for_001_GO_then_execute_T-001"
    blockers:
      - "Blocked until 001-skill-reindex Complete with GO signal"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0650020000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-065-002-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: 065/002 — skill-router-stress-tests

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in-progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [ ] Verify 001-skill-reindex Complete + GO signal (HALT if not)
### T-002: [ ] Author `scenarios/CP-100-ambiguous.md` (Category A)
### T-003: [ ] Author `scenarios/CP-101-false-positive.md` (Category B)
### T-004: [ ] Author `scenarios/CP-102-low-confidence.md` (Category C)
### T-005: [ ] Author `scenarios/CP-103-multi-skill.md` (Category D)
### T-006: [ ] Author `scenarios/CP-104-novel-phrasing.md` (Category E)
### T-007: [ ] Author `scenarios/CP-105-adversarial.md` (Category F)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-008: [ ] Dispatch CP-100..105 × cli-copilot (6 executions)
### T-009: [ ] Dispatch CP-100..105 × cli-codex (6 executions)
### T-010: [ ] Dispatch CP-100..105 × cli-gemini (6 executions)
### T-011: [ ] Capture all 18 results to `results/CP-NNN-<executor>.json`
### T-012: [ ] Score each CP per pass criteria; tally PASS/WARN/FAIL
### T-013: [ ] Generate `test-report.md` (methodology + per-CP table + aggregate + lessons + recommendations)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-014: [ ] Verify all 18 result files (or documented timeouts/exclusions)
### T-015: [ ] Fill `implementation-summary.md` with concrete results, findings classification, follow-on packet recommendations
### T-016: [ ] Run strict validator on this sub-phase folder
### T-017: [ ] Update parent `065-*/graph-metadata.json`: flip status, set `derived.last_active_child_id` to null
### T-018: [ ] Author parent roll-up `implementation-summary.md` summarizing both 001 + 002 outcomes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100. All 8 requirements (REQ-001..008) met. PASS rate ≥ 80% OR clear list of remediation packets.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- spec.md, plan.md
- Parent: 065-skill-advisor-reindex-and-stress-test
- Sibling: 001-skill-reindex (upstream dependency)
- Pattern reference: 060/004 (test-report structure), 062 (cross-architecture validation)
<!-- /ANCHOR:cross-refs -->
