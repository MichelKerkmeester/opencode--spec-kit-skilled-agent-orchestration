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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 005 hard gate lifts"
    blockers: ["005-advisor-renderer-and-regression-harness"]
    key_files: []

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

- [ ] T001 [P0] Verify 005 hard gate lifted (all P0 green + parity 200/200)
- [ ] T002 [P0] Verify 004 producer available
- [ ] T003 [P0] Read `hooks/claude/session-prime.ts` for pattern
- [ ] T004 [P0] Read research-extended §X2 for Claude payload contract
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P0] Create `mcp_server/hooks/claude/user-prompt-submit.ts`
- [ ] T006 [P0] Implement stdin async read + JSON parse with error guard
- [ ] T007 [P0] Call `buildSkillAdvisorBrief(prompt, { runtime: 'claude', workspaceRoot: cwd })`
- [ ] T008 [P0] Emit `hookSpecificOutput.additionalContext` on non-null brief
- [ ] T009 [P0] Fail-open: any exception → empty stdout + exit 0
- [ ] T010 [P0] Emit structured stderr JSONL per 005 observability contract
- [ ] T011 [P0] Respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` env flag
- [ ] T012 [P0] Register hook in `.claude/settings.local.json`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 [P0] Write `claude-user-prompt-submit-hook.vitest.ts` with 6 acceptance scenarios
- [ ] T014 [P0] Parity test: shared fixtures match via 005 comparator
- [ ] T015 [P0] Run tests green
- [ ] T016 [P0] `tsc --noEmit` clean
- [ ] T017 [P0] Manual smoke test in real Claude session
- [ ] T018 [P0] Mark all P0 checklist items `[x]`
- [ ] T019 [P0] Update implementation-summary.md with Files Changed + smoke result
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
