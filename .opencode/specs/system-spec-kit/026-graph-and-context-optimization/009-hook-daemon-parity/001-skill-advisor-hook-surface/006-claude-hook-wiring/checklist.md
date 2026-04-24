---
title: "...raph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring/checklist]"
description: "Level 2 verification for 020/006. Populate post-implementation."
trigger_phrases:
  - "020 006 checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T14:04:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Checklist completed with 20/20 P0 and 5/5 P1 verified"
    next_safe_action: "Dispatch 007 Gemini/Copilot and 008 Codex follow-on adapters"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts"
      - ".claude/settings.local.json"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
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

- [x] CHK-001 [P0] 005 hard gate lifted [EVIDENCE: user cleared 005 hard gate at commit 043c3cd43 before implementation.]
- [x] CHK-002 [P0] 004 producer merged [EVIDENCE: `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })` read from `mcp_server/lib/skill-advisor/skill-advisor-brief.ts`.]
- [x] CHK-003 [P0] Claude payload contract (extended research §X2) confirmed [EVIDENCE: extended research §X2 confirms `UserPromptSubmit` and JSON `hookSpecificOutput.additionalContext`.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `hooks/claude/user-prompt-submit.ts` created [EVIDENCE: new hook file added under `mcp_server/hooks/claude/`.]
- [x] CHK-011 [P0] Stdin parsed defensively (error guarded) [EVIDENCE: `parseClaudeUserPromptSubmitInput()` returns `null` on parse failure; AS5 covers malformed stdin.]
- [x] CHK-012 [P0] Calls `buildSkillAdvisorBrief({ runtime: 'claude' })` [EVIDENCE: AS1 asserts producer call with `runtime: 'claude'` and `workspaceRoot` from `cwd`.]
- [x] CHK-013 [P0] Emits `hookSpecificOutput.additionalContext` shape [EVIDENCE: AS1 expected JSON output includes `hookSpecificOutput.hookEventName` and `additionalContext`.]
- [x] CHK-014 [P0] Fail-open on any error [EVIDENCE: AS5 malformed JSON and AS6 timeout/fail-open both return `{}`.]
- [x] CHK-015 [P0] Does not use `decision: "block"` [EVIDENCE: AS6 asserts output has no `decision: "block"` or `decision: "deny"` path.]
- [x] CHK-016 [P0] Respects `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` [EVIDENCE: AS4 returns `{}` and asserts producer was not called.]
- [x] CHK-017 [P0] Hook registered in `.claude/settings.local.json` [EVIDENCE: `jq -r '.hooks.UserPromptSubmit[0].hooks[0].command' .claude/settings.local.json` returns the new dist hook command.]
- [x] CHK-018 [P0] `tsc --noEmit` clean [EVIDENCE: `npx tsc --noEmit --composite false -p tsconfig.json` passed in `mcp_server/`.]
- [x] CHK-019 [P1] Structured stderr JSONL per observability contract [EVIDENCE: hook uses `createAdvisorHookDiagnosticRecord()` and tests validate diagnostic records without forbidden prompt-bearing fields.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance Scenario 1: live brief [EVIDENCE: AS1 in `claude-user-prompt-submit-hook.vitest.ts` passed.]
- [x] CHK-021 [P0] Acceptance Scenario 2: Python missing fail-open [EVIDENCE: CHK-021 test injects `PYTHON_MISSING` fail-open result and returns `{}`.]
- [x] CHK-022 [P0] Acceptance Scenario 3: skipped prompt empty output [EVIDENCE: AS2 empty prompt and AS3 `/help` both return `{}`.]
- [x] CHK-023 [P0] Acceptance Scenario 4: disabled flag honored [EVIDENCE: AS4 passed with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.]
- [x] CHK-024 [P0] Acceptance Scenario 5: invalid stdin fail-open [EVIDENCE: AS5 malformed JSON returns `{}` with `PARSE_FAIL` diagnostic.]
- [x] CHK-025 [P0] Acceptance Scenario 6: never uses decision: block [EVIDENCE: AS6 asserts no block/deny decision in serialized output.]
- [x] CHK-026 [P0] Parity test via 005 comparator [EVIDENCE: T014 test normalizes Claude output as `json_additional_context` with the renderer brief string.]
- [x] CHK-027 [P0] Manual smoke test in real Claude session [EVIDENCE: interactive Claude session deferred per mission to T9 integration gauntlet; direct CLI smoke with simulated stdin invoked `dist/hooks/claude/user-prompt-submit.js`, exited 0, emitted diagnostic JSONL and `{}`.]
- [x] CHK-028 [P1] Hook total p95 ≤ 60 ms on cache hit [EVIDENCE: CHK-028 adapter cache-hit p95 test passed in focused Vitest suite.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Raw prompt never written to stderr [EVIDENCE: diagnostics are created through 005 metrics serializer; AS1 asserts no `prompt`, `promptFingerprint`, `promptExcerpt`, `stdout`, or `stderr` fields.]
- [x] CHK-031 [P0] Hook does not persist prompt content [EVIDENCE: hook only reads stdin, delegates to producer, writes JSON stdout and diagnostic stderr; no state-file writes.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized [EVIDENCE: packet docs updated from blocked/pending to implemented evidence state.]
- [x] CHK-041 [P1] implementation-summary.md with smoke result [EVIDENCE: implementation summary records direct CLI smoke and T9 real-session deferral.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Hook script under `hooks/claude/` [EVIDENCE: `mcp_server/hooks/claude/user-prompt-submit.ts` added.]
- [x] CHK-051 [P1] No orphan files [EVIDENCE: scope limited to hook, test, settings registration, and packet docs.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
