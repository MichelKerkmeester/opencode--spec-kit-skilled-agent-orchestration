---
title: "Plan: 065/003 - create testing playbook routing"
description: "Implementation plan for CP-105 testing-playbook route calibration."
trigger_phrases: ["065/003 plan", "testing playbook routing plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created phase plan"
    next_safe_action: "inspect_create_testing_playbook_route"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 065/003 - create testing playbook routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Find why testing-playbook creation does not surface the dedicated create route, then tune route metadata or scoring with regression coverage.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- CP-105 PASS.
- Generic sk-doc controls remain correct.
- Advisor tests, typecheck, build, and spec validation pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Prefer explicit route metadata and phrase coverage before scorer changes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
| Phase | Steps |
|---|---|
| P1 | Inspect create/testing-playbook metadata |
| P2 | Add CP-105 regression coverage |
| P3 | Tune route metadata or scorer behavior |
| P4 | Verify and document |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Use CP-105 plus controls for sk-doc and create-agent routing.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Depends on baseline stress report CP-105.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert the route calibration if generic documentation routing regresses.
<!-- /ANCHOR:rollback -->
