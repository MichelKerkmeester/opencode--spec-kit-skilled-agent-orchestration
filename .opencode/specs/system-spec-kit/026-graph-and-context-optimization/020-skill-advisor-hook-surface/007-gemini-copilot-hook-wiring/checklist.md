---
title: "Verification Checklist: Gemini + Copilot Hook Wiring"
description: "Level 2 verification for 020/007. Populate post-implementation."
trigger_phrases:
  - "020 007 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Gemini + Copilot Hook Wiring

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

- [ ] CHK-001 [P0] 005 hard gate lifted + 006 merged
- [ ] CHK-002 [P0] Copilot SDK capability captured for shipped runtime
- [ ] CHK-003 [P0] Gemini hook event schema confirmed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `hooks/gemini/user-prompt-submit.ts` created
- [ ] CHK-011 [P0] `hooks/copilot/user-prompt-submit.ts` created with SDK + wrapper branches
- [ ] CHK-012 [P0] Gemini emits JSON `hookSpecificOutput.additionalContext`
- [ ] CHK-013 [P0] Gemini plain-text stdout is NOT used as injection path
- [ ] CHK-014 [P0] Copilot SDK path uses `onUserPromptSubmitted` return object
- [ ] CHK-015 [P0] Copilot wrapper fallback: prompt-preamble injection
- [ ] CHK-016 [P0] Neither adapter emits notification-only success as "injection"
- [ ] CHK-017 [P0] Both adapters fail-open on any error
- [ ] CHK-018 [P0] Both respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- [ ] CHK-019 [P0] Gemini registered in `.gemini/settings.json`
- [ ] CHK-020 [P0] Copilot registered in runtime config
- [ ] CHK-021 [P0] `tsc --noEmit` clean
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Gemini scenarios 1-6 green
- [ ] CHK-031 [P0] Copilot SDK + wrapper paths green
- [ ] CHK-032 [P0] Cross-runtime parity: 5 fixtures × 3 runtimes identical
- [ ] CHK-033 [P0] Manual Gemini smoke test
- [ ] CHK-034 [P0] Manual Copilot smoke test
- [ ] CHK-035 [P1] Per-adapter p95 ≤ 60 ms cache hit
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Neither adapter persists prompt content
- [ ] CHK-041 [P0] Neither adapter logs prompt content to stderr
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec/plan/tasks synchronized
- [ ] CHK-051 [P1] Runtime capability matrix in implementation-summary.md
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] 2 adapter files + 3 test files
- [ ] CHK-061 [P0] Settings files modified
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 0/23 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
