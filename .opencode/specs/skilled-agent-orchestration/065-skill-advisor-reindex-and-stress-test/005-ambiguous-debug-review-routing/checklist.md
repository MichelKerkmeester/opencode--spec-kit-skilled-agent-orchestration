---
title: "Checklist: 065/005 - ambiguous debug review routing"
description: "Verification checklist for ambiguous debug/review routing calibration."
trigger_phrases: ["065/005 checklist", "ambiguous debug review checklist"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T12:09:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed checklist with CP-100 evidence"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Checklist: 065/005 - ambiguous debug review routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot complete phase |
| P1 | Required | Must complete or document deferral |
| P2 | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Reproduce CP-100 FAIL.
  - Evidence: baseline CP-100 selected broad `sk-code`.
- [x] CHK-002 [P1] Capture clear implementation controls for `sk-code`.
  - Evidence: clear implementation control remains `sk-code` top-1 at confidence 0.95.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Review/debug calibration does not steal clear implementation prompts.
  - Evidence: the implementation control still routes to `sk-code`.
- [x] CHK-011 [P1] Confidence remains calibrated, not forced to 0.95.
  - Evidence: CP-100 confidence is 0.82.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] CP-100 passes with review/debug top1.
  - Evidence: `sk-code-review` is top-1.
- [x] CHK-021 [P0] CP-100 confidence remains between 0.40 and 0.85.
  - Evidence: confidence is 0.82.
- [x] CHK-022 [P1] Clear implementation control still routes to `sk-code`.
  - Evidence: implementation control is `sk-code` top-1 at 0.95.
- [x] CHK-023 [P1] Advisor unit tests pass.
  - Evidence: `npx vitest run skill_advisor/tests` passed 40 files and 297 tests.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Ambiguous problem-diagnosis case and implementation controls are both covered.
  - Evidence: native scorer regression covers both CP-100 and implementation control.
- [x] CHK-FIX-002 [P1] Resource map updated with changed and checked files.
  - Evidence: `resource-map.md` lists changed and checked surfaces.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Prompt-safe output behavior unchanged.
  - Evidence: output shape remains route ids and confidence values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Implementation summary records before/after CP-100 result.
  - Evidence: `implementation-summary.md` records baseline FAIL and post-fix PASS.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All phase evidence stays in this folder.
  - Evidence: phase docs and verification notes are contained under `005-ambiguous-debug-review-routing`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 5 | 5/5 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->
