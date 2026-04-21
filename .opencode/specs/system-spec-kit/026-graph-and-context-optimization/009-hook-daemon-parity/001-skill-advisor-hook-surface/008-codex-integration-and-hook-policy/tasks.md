---
title: "Tasks: Codex Integration + Hook Policy"
description: "Task list for 020/008 — Codex adapter + dynamic policy + Bash deny + fallback + parity."
trigger_phrases:
  - "020 008 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/008-codex-integration-and-hook-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 005 converges"
    blockers: ["005-advisor-renderer-and-regression-harness"]
    key_files: []

---
# Tasks: Codex Integration + Hook Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Verify 005 hard gate lifted + 002/004 merged
- [x] T002 [P0] Capture Codex runtime capability fixture
- [x] T003 [P0] Read research-extended §X4 for Codex policy boundary
- [x] T004 [P0] grep for all hard-coded `hookPolicy: "unavailable"` references
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Dynamic Policy Detector

- [x] T005 [P0] Create `mcp_server/lib/codex-hook-policy.ts`
- [x] T006 [P0] Implement `detectCodexHookPolicy()` with version + hooks-list probes
- [x] T007 [P0] 500ms probe timeout → `unavailable` on hang
- [x] T008 [P0] Session-scoped cache (1 probe per session)
- [x] T009 [P0] Write `codex-hook-policy.vitest.ts` (live, partial, unavailable cases)
- [x] T010 [P0] Replace all hard-coded `hookPolicy: "unavailable"` references via detector
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### UserPromptSubmit Adapter

- [x] T011 [P0] Create `mcp_server/hooks/codex/user-prompt-submit.ts`
- [x] T012 [P0] Defensive stdin/argv input parse
- [x] T013 [P0] Call `buildSkillAdvisorBrief({ runtime: 'codex' })`
- [x] T014 [P0] Emit JSON `hookSpecificOutput.additionalContext`
- [x] T015 [P0] Fail-open on any error
- [x] T016 [P0] Respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- [x] T017 [P0] Write `codex-user-prompt-submit-hook.vitest.ts` (stdin + argv paths)
<!-- /ANCHOR:phase-3 -->

### PreToolUse Bash Deny

- [x] T018 [P0] Create `mcp_server/hooks/codex/pre-tool-use.ts`
- [x] T019 [P0] Load Bash denylist from `.codex/policy.json`
- [x] T020 [P0] Emit `decision: "deny"` only on Bash tool + full-word match
- [x] T021 [P0] Non-Bash tools: emit no decision (allow)
- [ ] T022 [P1] Curate initial denylist from existing repo safety patterns — blocked by sandbox EPERM on `.codex/policy.json`
- [x] T023 [P0] Write PreToolUse tests

### Prompt-Wrapper Fallback

- [x] T024 [P1] Create `mcp_server/hooks/codex/prompt-wrapper.ts`
- [x] T025 [P1] Invoked when detector returns `"unavailable"`
- [x] T026 [P1] Transform next outgoing prompt with brief preamble
- [x] T027 [P1] Test fallback path

### Parity + Registration

- [x] T028 [P0] Extend `advisor-runtime-parity.vitest.ts` to add Codex as 4th runtime
- [x] T029 [P0] Assert all 4 runtimes produce identical `additionalContext` for 5 fixtures
- [ ] T030 [P0] Register Codex hooks in `.codex/settings.json` — blocked by sandbox EPERM on `.codex/settings.json`

## Phase 3: Verification

- [x] T031 [P0] All Codex test files green
- [x] T032 [P0] Parity 4/4 runtimes
- [x] T033 [P0] grep hard-coded "unavailable" → 0 hits
- [x] T034 [P0] Manual Codex smoke test deferred to T9 per execution plan
- [x] T035 [P0] `tsc --noEmit` clean
- [ ] T036 [P0] Mark all P0 checklist items `[x]` — blocked by `.codex/settings.json` EPERM

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- Dynamic detector replaces all hard-coded values
- Parity across 4 runtimes
- Codex runtime capability fixture committed
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessors: `../002-*`, `../004-*`, `../005-*`
- Research: `research-extended §X4`
<!-- /ANCHOR:cross-refs -->
