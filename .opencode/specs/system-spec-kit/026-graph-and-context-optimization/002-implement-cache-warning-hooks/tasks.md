---
title: "Tasks: Cache-Warning Hook System [template:level_3/tasks.md]"
description: "Task Format: T### [P0|P1|P2] Description (file path)"
trigger_phrases:
  - "tasks"
  - "cache warning"
  - "hook replay harness"
  - "UserPromptSubmit hook"
  - "tasks core"
importance_tier: "normal"
contextType: "planning"
---
# Tasks: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P0|P1|P2] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Phase A: Shared State Schema [F19 prerequisite]
- [ ] T001 [P0] Add `lastClaudeTurnAt` and `cacheWarning` fields to `HookState` interface (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`)
- [ ] T002 [P0] Update `updateState()` default seed to include `null` for new fields (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`)
- [ ] T003 [P0] Run `tsc --noEmit` to confirm type safety (no file changes)
- [ ] T004 [P1] Verify `dist/hooks/claude/hook-state.js` rebuilds cleanly (rebuild step from `plan.md` §6)

### Phase B: Replay Harness with Isolation [F20 + F24 prerequisites]
- [ ] T005 [P0] Create `replay-harness.ts` with `runHookReplay()` API (`.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts`)
- [ ] T006 [P0] Implement per-run isolated `TMPDIR` via `mkdtempSync` (same file)
- [ ] T007 [P0] Implement autosave stub via `SPECKIT_GENERATE_CONTEXT_SCRIPT` env override (same file)
- [ ] T008 [P0] Implement side-effect detection asserting no writes outside replay `TMPDIR` (same file)
- [ ] T009 [P0] Add cleanup via `rmSync` in `finally` block (same file)
- [ ] T010 [P1] Smoke-test the harness against an empty fixture before Phase C starts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase C: Stop Hook Timestamp Writer [F4]
- [ ] T011 [P0] Add `updateState({ lastClaudeTurnAt: new Date().toISOString() })` call after transcript parsing (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`)
- [ ] T012 [P0] Verify the call lands BEFORE `runContextAutosave()` so autosave sees the field
- [ ] T013 [P0] Run replay harness against a Stop fixture; assert `lastClaudeTurnAt` is set
- [ ] T014 [P1] Assert `sideEffectsDetected.length === 0` in the test

### Phase D: Shared Hook-State Seam Validation [F7]
- [ ] T015 [P0] No code changes; run replay harness across all 4 hook entry points
- [ ] T016 [P0] Assert all 4 hooks read/write the same `hook-state.json` path
- [ ] T017 [P0] Document the seam contract in `plan.md` §3 architecture (already drafted, verify)
- [ ] T018 [P1] Confirm `compact-inject.ts` is unchanged (`git diff` check)

### Phase E: SessionStart Resume Cost Estimator [F6]
- [ ] T019 [P0] Extend `handleResume()` to read `state.lastClaudeTurnAt` and `state.metrics.estimatedPromptTokens` (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`)
- [ ] T020 [P0] Add env gate: `process.env.CACHE_WARNING_RESUME_ESTIMATE_ENABLED !== 'false'`
- [ ] T021 [P0] Compute heuristic warning section when elapsed exceeds threshold
- [ ] T022 [P0] Verify `handleStartup`, `handleClear`, and `handleCompact` paths are NOT modified
- [ ] T023 [P0] Replay test: `source=resume` with stale state -> warning appears
- [ ] T024 [P0] Replay test: `source=compact` and `source=clear` -> warning suppressed

### Phase F: UserPromptSubmit Warning Hook [F5, highest risk, last]
- [ ] T025 [P0] Create `user-prompt-submit.ts` (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`)
- [ ] T026 [P0] Implement parse stdin -> load state -> compute idle gap -> branch on threshold
- [ ] T027 [P0] Implement env gate: `CACHE_WARNING_SOFT_BLOCK_ONCE` controls block vs observe-only
- [ ] T028 [P0] Implement acknowledgement persistence via `cacheWarning.lastAckAt`
- [ ] T029 [P0] Use exit code `2` for soft-block, `0` for warning-only or no-op
- [ ] T030 [P0] Replay test: stale + soft-block enabled + no ack -> exit `2` once
- [ ] T031 [P0] Replay test: resend after ack -> exit `0` (no second block)
- [ ] T032 [P0] Replay test: stale + soft-block disabled -> exit `0` with warning emitted
- [ ] T033 [P1] Document `UserPromptSubmit` hook entry to add to `.claude/settings.local.json` (do NOT modify the file in this phase; document only)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase Verification
- [ ] T034 [P0] All 6 phases complete; `tsc --noEmit` passes for full `mcp_server` tree
- [ ] T035 [P0] `validate.sh --strict` passes on this spec folder
- [ ] T036 [P1] Document findings in `implementation-summary.md` (post-implementation)
- [ ] T037 [P2] Update `CLAUDE.md` if any new operator-facing rules emerged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] All replay-harness assertions passing
- [ ] `compact-inject.ts` unchanged
- [ ] `.claude/settings.local.json` env keys + `UserPromptSubmit` hook documented (not yet applied)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research pointer**: See `research.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE adapted for 6 sequential phases plus verification.
-->
