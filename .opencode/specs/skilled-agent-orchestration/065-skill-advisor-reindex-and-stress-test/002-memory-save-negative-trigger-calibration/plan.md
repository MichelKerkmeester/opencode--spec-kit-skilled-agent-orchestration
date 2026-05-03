---
title: "Plan: 065/002 - memory-save negative trigger calibration"
description: "Implementation plan for memory-save false-positive and semantic-match calibration."
trigger_phrases: ["065/002 plan", "memory save calibration plan"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration"
    last_updated_at: "2026-05-03T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created phase plan"
    next_safe_action: "inspect_memory_save_skill_and_advisor_scoring"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 065/002 - memory-save negative trigger calibration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Investigate why `memory:save` over-scores file-save language and misses context-preservation paraphrases. Tune the narrowest metadata or scoring path and add regression checks for CP-101, CP-104, and `save context`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- CP-101 PASS.
- CP-104 PASS.
- `save context` still routes to `memory:save`.
- Existing advisor test suite passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Prefer metadata/phrase calibration before algorithm changes. If scoring code must change, keep it scoped to disambiguating file-save language from context-preservation language.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps |
|---|---|
| P1 | Inspect `memory:save` metadata, trigger phrases, and scoring lanes |
| P2 | Add regression tests for CP-101, CP-104, and `save context` |
| P3 | Apply minimal calibration |
| P4 | Run advisor tests, typecheck, build, and spec validation |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Use deterministic advisor calls with `--threshold 0.0` plus the existing native scorer tests.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on baseline evidence in `../001-baseline-reindex-and-stress-results/002-skill-router-stress-tests/test-report.md`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the calibration change and keep the regression tests as evidence if they expose the same failure.
<!-- /ANCHOR:rollback -->
