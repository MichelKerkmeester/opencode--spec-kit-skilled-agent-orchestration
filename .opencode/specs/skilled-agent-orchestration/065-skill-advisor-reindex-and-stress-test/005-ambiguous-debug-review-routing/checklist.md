---
title: "Checklist: 065/005 - ambiguous debug review routing"
description: "Verification checklist for ambiguous debug/review routing calibration."
trigger_phrases: ["065/005 checklist", "ambiguous debug review checklist"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/005-ambiguous-debug-review-routing"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added checklist"
    next_safe_action: "execute_phase"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] Reproduce CP-100 FAIL.
- [ ] CHK-002 [P1] Capture clear implementation controls for `sk-code`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Review/debug calibration does not steal clear implementation prompts.
- [ ] CHK-011 [P1] Confidence remains calibrated, not forced to 0.95.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] CP-100 passes with review/debug top1.
- [ ] CHK-021 [P0] CP-100 confidence remains between 0.40 and 0.85.
- [ ] CHK-022 [P1] Clear implementation control still routes to `sk-code`.
- [ ] CHK-023 [P1] Advisor unit tests pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Ambiguous problem-diagnosis case and implementation controls are both covered.
- [ ] CHK-FIX-002 [P1] Resource map updated with changed and checked files.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Prompt-safe output behavior unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Implementation summary records before/after CP-100 result.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All phase evidence stays in this folder.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 5 | 0/5 |
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
