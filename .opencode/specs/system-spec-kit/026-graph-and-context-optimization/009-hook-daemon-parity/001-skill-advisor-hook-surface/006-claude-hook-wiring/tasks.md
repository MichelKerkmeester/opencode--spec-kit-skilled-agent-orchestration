---
title: "Tasks: Claude Hook Wiring (UserPromptSubmit)"
description: "Task list for 020/006 — single hook script + settings.json + tests."
trigger_phrases:
  - "020 006 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T14:04:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "All T001-T019 tasks completed with verification evidence"
    next_safe_action: "Dispatch 007 Gemini/Copilot and 008 Codex follow-on adapters"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts"
      - ".claude/settings.local.json"

---
# Tasks: Claude Hook Wiring (UserPromptSubmit)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Verify 005 hard gate lifted (all P0 green + parity 200/200) [EVIDENCE: user cleared 005 hard gate at commit 043c3cd43; HEAD e19bf2e21 includes predecessor stack.]
- [x] T002 [P0] Verify 004 producer available [EVIDENCE: `mcp_server/lib/skill-advisor/skill-advisor-brief.ts` read; `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })` available.]
- [x] T003 [P0] Read `hooks/claude/session-prime.ts` for pattern [EVIDENCE: `session-prime.ts` read before implementation; mirrored ESM CLI entry + stdout/stderr separation.]
- [x] T004 [P0] Read extended research §X2 for Claude payload contract [EVIDENCE: extended research §X2 confirms `UserPromptSubmit` + JSON `hookSpecificOutput.additionalContext`.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Create `mcp_server/hooks/claude/user-prompt-submit.ts` [EVIDENCE: new TypeScript hook entry created under `hooks/claude/`.]
- [x] T006 [P0] Implement stdin async read + JSON parse with error guard [EVIDENCE: `readStdin()` + `parseClaudeUserPromptSubmitInput()` return fail-open `{}` on malformed input.]
- [x] T007 [P0] Call `buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot: cwd })` [EVIDENCE: hook delegates to producer with `runtime: 'claude'` and `workspaceRootFor(input)`.]
- [x] T008 [P0] Emit `hookSpecificOutput.additionalContext` on non-null brief [EVIDENCE: non-null rendered brief serializes `hookSpecificOutput.hookEventName = UserPromptSubmit` and `additionalContext = brief`.]
- [x] T009 [P0] Fail-open: any exception → empty stdout + exit 0 [EVIDENCE: handler catches all errors and CLI `main().catch()` writes `{}` before exiting 0.]
- [x] T010 [P0] Emit structured stderr JSONL per 005 observability contract [EVIDENCE: hook uses `createAdvisorHookDiagnosticRecord()` + `serializeAdvisorHookDiagnosticRecord()`.]
- [x] T011 [P0] Respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` env flag [EVIDENCE: disabled branch emits `{}` and skips producer invocation.]
- [x] T012 [P0] Register hook in `.claude/settings.local.json` [EVIDENCE: `hooks.UserPromptSubmit` added with command pointing to `dist/hooks/claude/user-prompt-submit.js`; `jq empty` passed.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P0] Write `claude-user-prompt-submit-hook.vitest.ts` with 6 acceptance scenarios [EVIDENCE: focused hook suite covers work-intent, empty prompt, `/help`, disabled flag, invalid JSON, and timeout fail-open; includes Python-missing and p95 checks.]
- [x] T014 [P0] Parity test: shared fixtures match via 005 comparator [EVIDENCE: T014 test asserts `normalizeRuntimeOutput('claude', output)` returns `transport: 'json_additional_context'` and the renderer brief string.]
- [x] T015 [P0] Run tests green [EVIDENCE: `npm exec --workspace=@spec-kit/mcp-server -- vitest run mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts` passed, 9 tests.]
- [x] T016 [P0] `tsc --noEmit` clean [EVIDENCE: `npx tsc --noEmit --composite false -p tsconfig.json` passed in `mcp_server/`.]
- [x] T017 [P0] Manual smoke test in real Claude session [EVIDENCE: real Claude session deferred to T9 integration gauntlet per mission; direct CLI smoke with simulated stdin invoked built hook and exited 0 with diagnostic JSONL + `{}`.]
- [x] T018 [P0] Mark all P0 checklist items `[x]` [EVIDENCE: `checklist.md` now records 20/20 P0 verified.]
- [x] T019 [P0] Update implementation-summary.md with Files Changed + smoke result [EVIDENCE: `implementation-summary.md` updated with files changed, decisions, verification, and smoke-test result.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- Hook registered and smoke-tested
- Parity maintained with 005 comparator
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessors: `../004-*`, `../005-*`
- Existing hook: `../../../../../skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- Settings: `.claude/settings.local.json`
<!-- /ANCHOR:cross-refs -->
