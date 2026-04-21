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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/008-codex-integration-and-hook-policy"
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

- [x] CHK-001 [P0] 005 hard gate lifted [Evidence: predecessor commits listed in mission include 005 `043c3cd43` and `e19bf2e21`.]
- [x] CHK-002 [P0] 002 + 004 merged [Evidence: mission lists 002 `47b805f7b` and 004 `4001865cc`/`25c8976e9`.]
- [x] CHK-003 [P0] Codex runtime capability fixture captured [Evidence: `mcp_server/tests/fixtures/codex-runtime-capability.json`.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `lib/codex-hook-policy.ts` with `detectCodexHookPolicy()` [Evidence: `mcp_server/lib/codex-hook-policy.ts` added.]
- [x] CHK-011 [P0] All hard-coded `"unavailable"` references replaced (grep clean) [Evidence: code grep returned 0 hits outside tests/specs.]
- [x] CHK-012 [P0] `hooks/codex/user-prompt-submit.ts` created [Evidence: `mcp_server/hooks/codex/user-prompt-submit.ts`.]
- [x] CHK-013 [P0] Defensive stdin/argv input parse [Evidence: `codex-user-prompt-submit-hook.vitest.ts` AS1-AS4.]
- [x] CHK-014 [P0] `hooks/codex/pre-tool-use.ts` Bash-only deny [Evidence: `codex-pre-tool-use.vitest.ts`.]
- [x] CHK-015 [P0] Non-Bash tools emit no decision (allow) [Evidence: `codex-pre-tool-use.vitest.ts` parameterized Edit/Read/Write test.]
- [x] CHK-016 [P1] `hooks/codex/prompt-wrapper.ts` fallback [Evidence: `codex-prompt-wrapper.vitest.ts`.]
- [ ] CHK-017 [P0] Hooks registered in `.codex/settings.json` — blocked by sandbox EPERM
- [x] CHK-018 [P0] `tsc --noEmit` clean [Evidence: `npx tsc --noEmit --composite false -p tsconfig.json` exited 0.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance Scenario 1: live brief via additionalContext [Evidence: `codex-user-prompt-submit-hook.vitest.ts` AS1.]
- [x] CHK-021 [P0] Acceptance Scenario 2: argv-passed JSON [Evidence: `codex-user-prompt-submit-hook.vitest.ts` AS2.]
- [x] CHK-022 [P0] Acceptance Scenario 3: policy detects live [Evidence: `codex-hook-policy.vitest.ts` live test.]
- [x] CHK-023 [P0] Acceptance Scenario 4: policy detects unavailable [Evidence: `codex-hook-policy.vitest.ts` timeout/unavailable test.]
- [x] CHK-024 [P0] Acceptance Scenario 5: Bash denylist match [Evidence: `codex-pre-tool-use.vitest.ts` deny test.]
- [x] CHK-025 [P0] Acceptance Scenario 6: non-Bash passthrough [Evidence: `codex-pre-tool-use.vitest.ts` non-Bash test.]
- [x] CHK-026 [P0] Acceptance Scenario 7: fail-open [Evidence: malformed stdin and policy-read failure tests return `{}`.]
- [x] CHK-027 [P0] Acceptance Scenario 8: cross-runtime parity 4/4 [Evidence: `advisor-runtime-parity.vitest.ts` passed with `RUNTIMES` including `codex`.]
- [x] CHK-028 [P0] Acceptance Scenario 9: notification-only rejected [Evidence: Codex adapter emits only JSON `additionalContext` or prompt-wrapper output; no notification path added.]
- [x] CHK-029 [P0] Manual Codex smoke test deferred to T9 per execution plan [Evidence: mission T034 explicitly says skip real Codex smoke and document as deferred.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No prompt content in adapter logs [Evidence: Codex user-prompt test asserts diagnostics omit prompt/stdout/stderr fields.]
- [ ] CHK-031 [P0] Bash denylist transparent + versioned — blocked by sandbox EPERM on `.codex/policy.json`
- [x] CHK-032 [P0] No notification-only injection path used [Evidence: No Codex notification hook file or settings path added.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized [Evidence: spec/plan/tasks/checklist/implementation-summary updated with implemented and blocked status.]
- [x] CHK-041 [P1] Runtime capability fixture committed [Evidence: `mcp_server/tests/fixtures/codex-runtime-capability.json`.]
- [x] CHK-042 [P1] `session-prime.ts` for Codex deferred with documented rationale [Evidence: implementation-summary Known Limitations records the deferral.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `hooks/codex/` directory created with 3 files [Evidence: user-prompt-submit, pre-tool-use, and prompt-wrapper files are present.]
- [x] CHK-051 [P0] `lib/codex-hook-policy.ts` present [Evidence: `mcp_server/lib/codex-hook-policy.ts`.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Blocked on `.codex/` configuration writes in this sandbox; code/tests/typecheck are green.

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 22/24 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
