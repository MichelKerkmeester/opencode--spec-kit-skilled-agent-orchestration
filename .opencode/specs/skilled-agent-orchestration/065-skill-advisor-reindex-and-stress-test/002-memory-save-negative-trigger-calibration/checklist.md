---
title: "Checklist: 065/002 - memory-save negative trigger calibration"
description: "Verification checklist for memory:save false-positive and semantic-match remediation."
trigger_phrases: ["065/002 checklist", "memory save calibration checklist"]
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/065-skill-advisor-reindex-and-stress-test/002-memory-save-negative-trigger-calibration"
    last_updated_at: "2026-05-03T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Verified completed memory-save calibration"
    next_safe_action: "continue_phase_003_create_testing_playbook_routing"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Checklist: 065/002 - memory-save negative trigger calibration

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

- [x] CHK-001 [P0] Reproduce CP-101 and CP-104 from baseline.
  - Evidence: baseline probes reproduced CP-101 at `memory:save` 0.82 for `save the file I'm working on`; CP-104 omitted `memory:save` for next-session preservation wording.
- [x] CHK-002 [P0] Capture `save context` control before changes.
  - Evidence: control probe retained `save context` as `memory:save` top-1; after calibration confidence is 0.9039.
- [x] CHK-003 [P1] Identify all `memory:save` scoring inputs.
  - Evidence: checked explicit lane, lexical lane, fusion confidence, command bridge projection, Python shim scoring, and graph health inventory.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Calibration is scoped to memory-save routing.
  - Evidence: implementation only adds next-session preservation boost and plain file-save cap for memory-save bridge IDs.
- [x] CHK-011 [P1] No unrelated advisor behavior changes.
  - Evidence: full `skill_advisor/tests` suite passed 40 files / 293 tests; graph health metadata cleanup was required to keep the advisor suite green.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] CP-101 passes.
  - Evidence: `save the file I'm working on` returns `memory:save` confidence 0.49 and non-top1.
- [x] CHK-021 [P0] CP-104 passes.
  - Evidence: `preserve everything we figured out today so the next session doesn't lose it` returns `memory:save` top-1 at confidence 0.82.
- [x] CHK-022 [P0] `save context` still routes to `memory:save` with confidence >= 0.8.
  - Evidence: `save context` returns `memory:save` top-1 at confidence 0.9039.
- [x] CHK-023 [P1] Advisor unit tests pass.
  - Evidence: `npx vitest run skill_advisor/tests` passed 40 files / 293 tests.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] File-save negative case and context-preservation positive case are both covered.
  - Evidence: `native-scorer.vitest.ts` includes 065/002 regression cases for both prompts.
- [x] CHK-FIX-002 [P1] Resource map updated with changed and checked files.
  - Evidence: `resource-map.md` lists scorer, shim, graph metadata, tests, and telemetry check surfaces.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Prompt redaction/prompt-safe behavior unchanged.
  - Evidence: compatibility shim tests passed, including native metadata prompt-redaction coverage.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Implementation summary records before/after confidences.
  - Evidence: `implementation-summary.md` records CP-101, CP-104, and `save context` post-calibration confidences.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All phase evidence stays in this folder.
  - Evidence: phase-local summary, tasks, checklist, and resource map were updated under `065/002`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 7 | 7/7 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->
