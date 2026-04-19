---
title: "Verification Checklist: Codex Integration + Hook Policy"
description: "Level 2 verification for 020/008."
trigger_phrases:
  - "020 008 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Codex Integration + Hook Policy

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
- [ ] CHK-002 [P0] 002 + 004 merged
- [ ] CHK-003 [P0] Codex runtime capability fixture captured
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `lib/codex-hook-policy.ts` with `detectCodexHookPolicy()`
- [ ] CHK-011 [P0] All hard-coded `"unavailable"` references replaced (grep clean)
- [ ] CHK-012 [P0] `hooks/codex/user-prompt-submit.ts` created
- [ ] CHK-013 [P0] Defensive stdin/argv input parse
- [ ] CHK-014 [P0] `hooks/codex/pre-tool-use.ts` Bash-only deny
- [ ] CHK-015 [P0] Non-Bash tools emit no decision (allow)
- [ ] CHK-016 [P1] `hooks/codex/prompt-wrapper.ts` fallback
- [ ] CHK-017 [P0] Hooks registered in `.codex/settings.json`
- [ ] CHK-018 [P0] `tsc --noEmit` clean
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Acceptance Scenario 1: live brief via additionalContext
- [ ] CHK-021 [P0] Acceptance Scenario 2: argv-passed JSON
- [ ] CHK-022 [P0] Acceptance Scenario 3: policy detects live
- [ ] CHK-023 [P0] Acceptance Scenario 4: policy detects unavailable
- [ ] CHK-024 [P0] Acceptance Scenario 5: Bash denylist match
- [ ] CHK-025 [P0] Acceptance Scenario 6: non-Bash passthrough
- [ ] CHK-026 [P0] Acceptance Scenario 7: fail-open
- [ ] CHK-027 [P0] Acceptance Scenario 8: cross-runtime parity 4/4
- [ ] CHK-028 [P0] Acceptance Scenario 9: notification-only rejected
- [ ] CHK-029 [P0] Manual Codex smoke test
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No prompt content in adapter logs
- [ ] CHK-031 [P0] Bash denylist transparent + versioned
- [ ] CHK-032 [P0] No notification-only injection path used
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Runtime capability fixture committed
- [ ] CHK-042 [P1] `session-prime.ts` for Codex deferred with documented rationale
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] `hooks/codex/` directory created with 3 files
- [ ] CHK-051 [P0] `lib/codex-hook-policy.ts` present
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 0/24 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
