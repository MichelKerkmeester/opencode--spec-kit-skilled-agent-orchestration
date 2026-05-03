---
title: "Tasks: 065/004 - skill-router alias canonicalization"
description: "Task list for alias canonicalization."
trigger_phrases: ["065/004 tasks", "alias canonicalization tasks"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
    last_updated_at: "2026-05-03T12:07:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed alias canonicalization tasks"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: 065/004 - skill-router alias canonicalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [x] Inventory command/skill id pairs
Evidence: alias groups were defined for create-agent, create-testing-playbook, memory-save, deep-research, and deep-review command/skill pairs.
### T-002: [x] Reproduce CP-103 WARN
Evidence: baseline CP-103 returned the right capability as `sk-deep-review`, but scenario scoring expected `spec_kit:deep-review`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [x] Define alias groups
Evidence: `aliases.ts` and Python fallback alias maps now expose canonical ids and exact accepted aliases.
### T-004: [x] Add alias-aware scoring or reporting
Evidence: native scorer tests use alias helpers, and the Python fallback can canonicalize ids for parity.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-005: [x] Verify CP-103 PASS
Evidence: CP-103 returns `sk-deep-review` at confidence 0.95 and `create:agent` at 0.82; alias-aware scoring accepts `sk-deep-review` for the expected deep-review command capability.
### T-006: [x] Run advisor tests and strict validation
Evidence: full advisor tests, typecheck, and build passed; strict validation is recorded at the root after all phases.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100; CP-103 scores PASS under explicit alias groups without broad alias matching.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- Baseline CP-103 report under parent phase 001.
<!-- /ANCHOR:cross-refs -->
