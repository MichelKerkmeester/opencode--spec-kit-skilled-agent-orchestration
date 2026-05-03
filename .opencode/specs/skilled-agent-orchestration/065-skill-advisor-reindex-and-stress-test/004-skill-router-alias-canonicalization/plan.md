---
title: "Plan: 065/004 - skill-router alias canonicalization"
description: "Implementation plan for alias-aware router scoring and documentation."
trigger_phrases: ["065/004 plan", "alias canonicalization plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/004-skill-router-alias-canonicalization"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created phase plan"
    next_safe_action: "inspect_command_skill_aliases"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 065/004 - skill-router alias canonicalization

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Define alias groups for known command/skill pairs and update scoring/reporting logic so capability matches are not marked as warnings because of naming shape alone.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- CP-103 scores PASS with alias-aware criteria.
- Alias groups are explicit and narrow.
- Existing routing gates pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Prefer scenario/reporting canonicalization over scorer output rewrites unless runtime consumers require canonical ids.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
| Phase | Steps |
|---|---|
| P1 | Inventory command ids and skill ids used by advisor |
| P2 | Define alias groups |
| P3 | Add alias-aware scoring checks |
| P4 | Verify CP-103 and controls |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Use CP-103 plus known deep-review and create-agent prompts.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Depends on baseline CP-103 evidence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Remove alias scoring if it masks a genuine route regression.
<!-- /ANCHOR:rollback -->
