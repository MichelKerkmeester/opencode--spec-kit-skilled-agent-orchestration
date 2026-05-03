---
title: "Checklist: 065/003 - create testing playbook routing"
description: "Verification checklist for routing testing-playbook creation to create:testing-playbook."
trigger_phrases: ["065/003 checklist", "testing playbook routing checklist"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/003-create-testing-playbook-routing"
    last_updated_at: "2026-05-03T12:05:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed checklist with CP-105 evidence"
    next_safe_action: "root_final_validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Checklist: 065/003 - create testing playbook routing

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

- [x] CHK-001 [P0] Reproduce CP-105 from baseline.
  - Evidence: baseline CP-105 was `sk-doc` top-1 at 0.866 with no `create:testing-playbook` route.
- [x] CHK-002 [P1] Identify create testing-playbook route metadata.
  - Evidence: command bridge, inline fallback registration, phrase boosts, and fusion intent bonus were identified as the owning surfaces.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Calibration targets testing-playbook creation only.
  - Evidence: trigger phrases target `/create:testing-playbook`, `create test playbook`, and `create testing playbook`.
- [x] CHK-011 [P1] Generic `sk-doc` routing controls remain valid.
  - Evidence: full advisor suite passed after calibration.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] CP-105 passes with `create:testing-playbook` in top-3.
  - Evidence: CP-105 now returns `create:testing-playbook` top-1 at confidence 0.8387.
- [x] CHK-021 [P1] `create new agent` control still routes to `create:agent`.
  - Evidence: native scorer regression coverage includes the create-agent control.
- [x] CHK-022 [P1] Advisor unit tests pass.
  - Evidence: `npx vitest run skill_advisor/tests` passed 40 files and 297 tests.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Create-route positive case and generic-doc controls are both covered.
  - Evidence: CP-105 positive regression and full advisor regression suite passed.
- [x] CHK-FIX-002 [P1] Resource map updated with changed and checked files.
  - Evidence: `resource-map.md` lists changed scorer, fallback, metadata, and test surfaces.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No new prompt content is exposed.
  - Evidence: only route ids, phrase patterns, and deterministic tests were added.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Implementation summary records before/after CP-105 result.
  - Evidence: `implementation-summary.md` records baseline FAIL and post-fix PASS.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All phase evidence stays in this folder.
  - Evidence: phase docs and verification notes are contained under `003-create-testing-playbook-routing`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 4 | 4/4 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->
