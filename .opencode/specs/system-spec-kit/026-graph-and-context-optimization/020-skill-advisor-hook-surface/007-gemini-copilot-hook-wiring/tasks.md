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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring"
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

- [ ] T001 [P0] Verify 005 hard gate lifted + 006 merged
- [ ] T002 [P0] Read research-extended §X3 for Copilot transport split
- [ ] T003 [P0] Capture / confirm Copilot SDK capability for shipped runtime version
- [ ] T004 [P0] Read existing `hooks/gemini/session-prime.ts` + `hooks/copilot/session-prime.ts` for patterns
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Gemini adapter

- [ ] T005 [P0] Create `mcp_server/hooks/gemini/user-prompt-submit.ts`
- [ ] T006 [P0] Implement stdin JSON parse for Gemini's prompt-equivalent hook
- [ ] T007 [P0] Emit JSON `hookSpecificOutput.additionalContext`
- [ ] T008 [P0] Fail-open on any error
- [ ] T009 [P0] Respect `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`
- [ ] T010 [P0] Register in `.gemini/settings.json`
- [ ] T011 [P0] Write `gemini-user-prompt-submit-hook.vitest.ts` (6 scenarios)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### Copilot adapter

- [ ] T012 [P0] Create `mcp_server/hooks/copilot/user-prompt-submit.ts`
- [ ] T013 [P0] Implement SDK detection at load time
- [ ] T014 [P0] Implement SDK path: return `{ additionalContext }` from `onUserPromptSubmitted`
- [ ] T015 [P0] Implement wrapper fallback: prompt-preamble injection
- [ ] T016 [P0] Never emit notification-only `{}` as success (wave-2 X3)
- [ ] T017 [P0] Register in Copilot runtime config (follow existing pattern)
- [ ] T018 [P0] Write `copilot-user-prompt-submit-hook.vitest.ts` (SDK + wrapper paths)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
### Cross-runtime parity

- [ ] T019 [P0] Create `advisor-runtime-parity.vitest.ts`
- [ ] T020 [P0] Load 5 canonical fixtures (live, stale, noPassing, failOpen, skipped)
- [ ] T021 [P0] Run each fixture through Claude/Gemini/Copilot adapters
- [ ] T022 [P0] Normalize via 005's `NormalizedAdvisorRuntimeOutput` comparator
- [ ] T023 [P0] Assert identical `additionalContext` strings per fixture
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
## Phase 3: Verification

- [ ] T024 [P0] Run all 3 test files green
- [ ] T025 [P0] `tsc --noEmit` clean
- [ ] T026 [P0] Manual smoke test in real Gemini session
- [ ] T027 [P0] Manual smoke test in real Copilot session (SDK path)
- [ ] T028 [P1] Runtime capability matrix documented in implementation-summary.md
- [ ] T029 [P0] Mark all P0 checklist items `[x]`
<!-- /ANCHOR:phase-5 -->

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
