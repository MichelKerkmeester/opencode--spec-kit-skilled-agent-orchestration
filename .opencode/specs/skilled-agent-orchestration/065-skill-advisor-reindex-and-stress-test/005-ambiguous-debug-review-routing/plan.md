---
title: "Plan: 065/005 - ambiguous debug review routing"
description: "Implementation plan for CP-100 ambiguous debug/review routing calibration."
trigger_phrases: ["065/005 plan", "ambiguous debug review plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created phase plan"
    next_safe_action: "inspect_debug_review_routing"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 065/005 - ambiguous debug review routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Tune ambiguous code-problem prompts so review/debug routes beat broad implementation routing while preserving uncertainty.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- CP-100 PASS.
- Clear implementation prompts still route to `sk-code`.
- Advisor tests, typecheck, build, and spec validation pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Prefer lane weighting or trigger metadata changes that only affect ambiguous problem-diagnosis language.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
| Phase | Steps |
|---|---|
| P1 | Reproduce CP-100 and implementation controls |
| P2 | Inspect review/debug vs sk-code scoring lanes |
| P3 | Add regression coverage and apply calibration |
| P4 | Verify and document |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Use CP-100 plus clear implementation prompts as controls.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Depends on baseline CP-100 evidence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert calibration if clear implementation routing regresses.
<!-- /ANCHOR:rollback -->
