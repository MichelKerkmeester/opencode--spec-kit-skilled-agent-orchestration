---
title: "Verification Checklist: Claude Hook Wiring"
description: "Level 2 verification for 020/006. Populate post-implementation."
trigger_phrases:
  - "020 006 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Claude Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] 005 hard gate lifted
- [ ] CHK-002 [P0] 004 producer merged
- [ ] CHK-003 [P0] Claude payload contract (research-extended §X2) confirmed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `hooks/claude/user-prompt-submit.ts` created
- [ ] CHK-011 [P0] Stdin parsed defensively (error guarded)
- [ ] CHK-012 [P0] Calls `buildSkillAdvisorBrief({ runtime: 'claude' })`
- [ ] CHK-013 [P0] Emits `hookSpecificOutput.additionalContext` shape
- [ ] CHK-014 [P0] Fail-open on any error
- [ ] CHK-015 [P0] Does not use `decision: "block"`
- [ ] CHK-016 [P0] Respects `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- [ ] CHK-017 [P0] Hook registered in `.claude/settings.local.json`
- [ ] CHK-018 [P0] `tsc --noEmit` clean
- [ ] CHK-019 [P1] Structured stderr JSONL per observability contract
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance Scenario 1: live brief
- [ ] CHK-021 [P0] Acceptance Scenario 2: Python missing fail-open
- [ ] CHK-022 [P0] Acceptance Scenario 3: skipped prompt empty output
- [ ] CHK-023 [P0] Acceptance Scenario 4: disabled flag honored
- [ ] CHK-024 [P0] Acceptance Scenario 5: invalid stdin fail-open
- [ ] CHK-025 [P0] Acceptance Scenario 6: never uses decision: block
- [ ] CHK-026 [P0] Parity test via 005 comparator
- [ ] CHK-027 [P0] Manual smoke test in real Claude session
- [ ] CHK-028 [P1] Hook total p95 ≤ 60 ms on cache hit
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Raw prompt never written to stderr
- [ ] CHK-031 [P0] Hook does not persist prompt content
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] implementation-summary.md with smoke result
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Hook script under `hooks/claude/`
- [ ] CHK-051 [P1] No orphan files
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
