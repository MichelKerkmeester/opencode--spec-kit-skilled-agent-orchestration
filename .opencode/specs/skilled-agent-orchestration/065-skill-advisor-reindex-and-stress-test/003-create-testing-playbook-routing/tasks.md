---
title: "Tasks: 065/003 - create testing playbook routing"
description: "Task list for testing-playbook route calibration."
trigger_phrases: ["065/003 tasks", "testing playbook routing tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
    last_updated_at: "2026-05-03T12:05:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed CP-105 testing-playbook routing tasks"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 065/003 - create testing playbook routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [x] Reproduce CP-105
Evidence: baseline CP-105 routed to generic `sk-doc` at 0.866 and did not surface `create:testing-playbook`.
### T-002: [x] Locate testing-playbook route metadata
Evidence: route coverage was added through command bridge projection, explicit phrase boosts, fusion primary-intent handling, Python fallback parity, and inline graphless skill registration.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [x] Add regression coverage
Evidence: `native-scorer.vitest.ts` now contains the 065/003 testing-playbook route regression.
### T-004: [x] Apply route calibration
Evidence: CP-105 now returns `create:testing-playbook` as top-1 at confidence 0.8387.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-005: [x] Run advisor tests
Evidence: `npx vitest run skill_advisor/tests` passed 40 files and 297 tests.
### T-006: [x] Run typecheck, build, and strict validation
Evidence: `npm run typecheck` and `npm run build` passed; strict validation is recorded at the root after all phases.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100; CP-105 passes with the dedicated create route while advisor regression tests remain green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Baseline CP-105 report under parent phase 001.
<!-- /ANCHOR:cross-refs -->
