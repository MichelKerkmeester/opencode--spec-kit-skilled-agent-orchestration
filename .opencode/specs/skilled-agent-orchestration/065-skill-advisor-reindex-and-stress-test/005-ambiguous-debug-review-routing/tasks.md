---
title: "Tasks: 065/005 - ambiguous debug review routing"
description: "Task list for ambiguous debug/review routing calibration."
trigger_phrases: ["065/005 tasks", "ambiguous debug review tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T12:09:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed ambiguous debug/review routing tasks"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 065/005 - ambiguous debug review routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [x] Reproduce CP-100
Evidence: baseline CP-100 routed ambiguous problem-diagnosis language to broad `sk-code`.
### T-002: [x] Capture clear implementation controls
Evidence: `implement a responsive webflow animation module` remains an implementation control for `sk-code`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [x] Add regression coverage
Evidence: `native-scorer.vitest.ts` now covers CP-100 and the clear implementation control.
### T-004: [x] Apply ambiguous routing calibration
Evidence: ambiguous code-problem language now boosts `sk-code-review`, gives a smaller deep-review signal, and dampens broad `sk-code`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-005: [x] Verify CP-100 PASS
Evidence: CP-100 now returns `sk-code-review` top-1 at confidence 0.82.
### T-006: [x] Run advisor tests and strict validation
Evidence: full advisor tests, typecheck, and build passed; strict validation is recorded at the root after all phases.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100; CP-100 passes and implementation controls remain correct.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Baseline CP-100 report under parent phase 001.
<!-- /ANCHOR:cross-refs -->
