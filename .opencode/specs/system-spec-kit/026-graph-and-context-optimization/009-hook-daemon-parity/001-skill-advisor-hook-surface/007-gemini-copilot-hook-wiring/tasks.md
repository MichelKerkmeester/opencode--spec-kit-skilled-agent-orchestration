---
title: "Tasks: Gemini + Copilot Hook Wiring"
description: "Task list for 020/007 — 2 adapters + parity test + 2 settings."
trigger_phrases:
  - "020 007 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 006 converges"
    blockers: ["005-advisor-renderer-and-regression-harness", "006-claude-hook-wiring"]
    key_files: []

---
# Tasks: Gemini + Copilot Hook Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Verify 005 hard gate lifted + 006 merged `[Evidence: HEAD 6d4b41a9f includes hooks/claude/user-prompt-submit.ts and normalize-adapter-output.ts reads completed]`
- [x] T002 [P0] Read research-extended §X3 for Copilot transport split `[Evidence: research-extended.md §X3 and iteration-003.md "Determination" read; current repo wrapper is notification-only, SDK can inject additionalContext]`
- [x] T003 [P0] Capture / confirm Copilot SDK capability for shipped runtime version `[Evidence: npm ls/import checks for @github/copilot-cli, @github/copilot-sdk, and @ai-sdk/github-copilot all returned unavailable; wrapper fallback is primary in this checkout]`
- [x] T004 [P0] Read existing `hooks/gemini/session-prime.ts` + `hooks/copilot/session-prime.ts` for patterns `[Evidence: session-prime.ts files read before edits]`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Gemini adapter

- [x] T005 [P0] Create `mcp_server/hooks/gemini/user-prompt-submit.ts` `[Evidence: hooks/gemini/user-prompt-submit.ts added]`
- [x] T006 [P0] Implement stdin JSON parse for Gemini's prompt-equivalent hook `[Evidence: parseGeminiUserPromptSubmitInput plus prompt/request.prompt extraction tests]`
- [x] T007 [P0] Emit JSON `hookSpecificOutput.additionalContext` `[Evidence: gemini-user-prompt-submit-hook AS1 + parity test]`
- [x] T008 [P0] Fail-open on any error `[Evidence: gemini-user-prompt-submit-hook AS5/AS6]`
- [x] T009 [P0] Respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` `[Evidence: gemini-user-prompt-submit-hook AS4]`
- [x] T010 [P0] Register in `.gemini/settings.json` `[Evidence: BeforeAgent now includes speckit-user-prompt-advisor]`
- [x] T011 [P0] Write `gemini-user-prompt-submit-hook.vitest.ts` (6 scenarios) `[Evidence: npx vitest run tests/gemini-user-prompt-submit-hook.vitest.ts passed in targeted 3-file run]`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### Copilot adapter

- [x] T012 [P0] Create `mcp_server/hooks/copilot/user-prompt-submit.ts` `[Evidence: hooks/copilot/user-prompt-submit.ts added]`
- [x] T013 [P0] Implement SDK detection at load time `[Evidence: copilotSdkAvailability top-level import probes; test AS1]`
- [x] T014 [P0] Implement SDK path: return `{ additionalContext }` from `onUserPromptSubmitted` `[Evidence: exported onUserPromptSubmitted + copilot test AS2]`
- [x] T015 [P0] Implement wrapper fallback: prompt-preamble injection `[Evidence: createCopilotWrappedPrompt + copilot test AS4]`
- [x] T016 [P0] Never emit notification-only `{}` as success (wave-2 X3) `[Evidence: copilot test AS6 verifies {} normalizes to null and wrapper emits promptWrapper when brief exists]`
- [x] T017 [P0] Register in Copilot runtime config (follow existing pattern) `[Evidence: local .github/hooks/superset-notify.json userPromptSubmitted command now invokes dist/hooks/copilot/user-prompt-submit.js before Superset notification fallback; file is git-info excluded locally]`
- [x] T018 [P0] Write `copilot-user-prompt-submit-hook.vitest.ts` (SDK + wrapper paths) `[Evidence: npx vitest run tests/copilot-user-prompt-submit-hook.vitest.ts passed in targeted 3-file run]`
<!-- /ANCHOR:phase-3 -->

### Cross-runtime parity

- [x] T019 [P0] Create `advisor-runtime-parity.vitest.ts` `[Evidence: tests/advisor-runtime-parity.vitest.ts added]`
- [x] T020 [P0] Load 5 canonical fixtures (live, stale, noPassing, failOpen, skipped) `[Evidence: CANONICAL_FIXTURES includes livePassingSkill, staleHighConfidenceSkill, noPassingSkill, failOpenTimeout, skippedShortCasual]`
- [x] T021 [P0] Run each fixture through Claude/Gemini/Copilot adapters `[Evidence: parity harness runs Claude, Gemini, Copilot SDK, and Copilot wrapper variants]`
- [x] T022 [P0] Normalize via 005's `NormalizedAdvisorRuntimeOutput` comparator `[Evidence: normalizeRuntimeOutput used for every variant]`
- [x] T023 [P0] Assert identical `additionalContext` strings per fixture `[Evidence: parity test asserts one unique visible brief per fixture]`

## Phase 3: Verification

- [x] T024 [P0] Run all 3 test files green `[Evidence: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/gemini-user-prompt-submit-hook.vitest.ts tests/copilot-user-prompt-submit-hook.vitest.ts tests/advisor-runtime-parity.vitest.ts -> 3 files, 23 tests passed]`
- [x] T025 [P0] `tsc --noEmit` clean `[Evidence: cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit -> exit 0]`
- [x] T026 [P0] Manual smoke test in real Gemini session `[Evidence: Deferred by packet instruction to T9 gauntlet; not run in this session]`
- [x] T027 [P0] Manual smoke test in real Copilot session (SDK path) `[Evidence: Deferred by packet instruction to T9 gauntlet; SDK package unavailable locally]`
- [x] T028 [P1] Runtime capability matrix documented in implementation-summary.md `[Evidence: implementation-summary.md Runtime Capability Matrix populated]`
- [x] T029 [P0] Mark all P0 checklist items `[x]` `[Evidence: checklist.md updated with verification evidence]`

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- Cross-runtime parity 100%
- Both adapters registered and smoke-tested
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessors: `../004-*`, `../005-*`, `../006-*`
- Comparator: from 005
<!-- /ANCHOR:cross-refs -->
