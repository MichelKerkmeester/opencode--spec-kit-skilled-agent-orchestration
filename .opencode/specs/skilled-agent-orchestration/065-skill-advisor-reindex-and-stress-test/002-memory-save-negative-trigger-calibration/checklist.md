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
    recent_action: "Added checklist"
    next_safe_action: "execute_phase"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] Reproduce CP-101 and CP-104 from baseline.
- [ ] CHK-002 [P0] Capture `save context` control before changes.
- [ ] CHK-003 [P1] Identify all `memory:save` scoring inputs.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Calibration is scoped to memory-save routing.
- [ ] CHK-011 [P1] No unrelated advisor behavior changes.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] CP-101 passes.
- [ ] CHK-021 [P0] CP-104 passes.
- [ ] CHK-022 [P0] `save context` still routes to `memory:save` with confidence >= 0.8.
- [ ] CHK-023 [P1] Advisor unit tests pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] File-save negative case and context-preservation positive case are both covered.
- [ ] CHK-FIX-002 [P1] Resource map updated with changed and checked files.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Prompt redaction/prompt-safe behavior unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Implementation summary records before/after confidences.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All phase evidence stays in this folder.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---:|---:|
| P0 Items | 7 | 0/7 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
