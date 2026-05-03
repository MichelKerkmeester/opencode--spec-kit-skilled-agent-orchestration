---
title: "Checklist: 065 - skill-advisor routing quality program"
description: "Program-level verification checklist for the 065 phase structure and follow-on routing remediation."
trigger_phrases: ["065 checklist", "skill advisor routing quality checklist"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Added root checklist"
    next_safe_action: "execute_phase_002"
    blockers: []
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---

# Checklist: 065 - skill-advisor routing quality program

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| P0 | Hard blocker | Cannot claim program complete |
| P1 | Required | Must complete or document deferral |
| P2 | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Root phase structure documented in `spec.md`.
- [x] CHK-002 [P0] Child phases 001-005 exist under 065.
- [x] CHK-003 [P1] Next active child points to phase 002 in `graph-metadata.json`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each remediation phase limits code changes to advisor routing surfaces.
- [ ] CHK-011 [P0] No unrelated repo changes are staged with a phase.
- [ ] CHK-012 [P1] Any scorer changes include focused tests.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Target CP scenario passes after each remediation phase.
- [ ] CHK-021 [P0] Known-good advisor prompts remain green.
- [ ] CHK-022 [P1] Full CP-100..CP-105 campaign re-run after phases 002-005.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each failing CP is mapped to one remediation phase.
- [ ] CHK-FIX-002 [P1] Resource maps list every affected or checked surface.
- [ ] CHK-FIX-003 [P1] Parent implementation summary records final results.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Prompt content remains prompt-safe in advisor outputs.
- [ ] CHK-031 [P1] No new path or workspace-root trust bypasses are introduced.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Root spec/plan/tasks/checklist/resource-map exist.
- [ ] CHK-041 [P1] Each completed child phase updates implementation summary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline docs live under `001-baseline-reindex-and-stress-results`.
- [x] CHK-051 [P1] No new top-level specs 066-069 were created.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 9 | 3/9 |
| P1 Items | 8 | 4/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->
