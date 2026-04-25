---
title: "Tasks [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/001-cache-warning-hooks/tasks]"
description: "Task Format: T### [P0|P1|P2] Description (file path)"
trigger_phrases:
  - "tasks"
  - "producer patch"
  - "replay isolation"
  - "idempotency"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/001-cache-warning-hooks"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
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

### Packet Alignment
- [x] T001 [P0] Record FTS helper plus forced-degrade tests as the hard predecessor (`spec.md`, `plan.md`, `research.md`) [EVIDENCE: packet docs now name the FTS helper plus forced-degrade lane as the hard predecessor and strict validation passes.]
- [x] T002 [P0] Remove active `UserPromptSubmit` and `.claude/settings.local.json` rollout claims from packet docs (`spec.md`, `plan.md`, `decision-record.md`, `checklist.md`) [EVIDENCE: packet docs defer direct warning consumers and `git diff --name-only -- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts .claude/settings.local.json` returned no changes.]
- [x] T003 [P0] Re-scope packet language from six-phase warning rollout to producer-side prerequisite lane (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) [EVIDENCE: packet 002 is now implemented as a producer-first continuity packet and no longer claims a startup warning rollout.]
- [x] T004 [P1] Document later follow-on packets for analytics reader, cached-summary consumer, workflow split, and token contracts (`spec.md`, `plan.md`, `research.md`) [EVIDENCE: follow-on order is documented in `spec.md`, `plan.md`, and `research.md`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A: Replay Isolation and Side-Effect Fencing
- [x] T005 [P0] Create or refine replay harness isolation contract (`.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts`) [EVIDENCE: added `mcp_server/test/hooks/replay-harness.ts` for isolated Stop-path replays.]
- [x] T006 [P0] Enforce isolated `TMPDIR` and autosave fencing in replay verification (same area) [EVIDENCE: replay harness runs inside a sandboxed `TMPDIR` and calls `processStopHook(..., { autosaveMode: 'disabled' })`.]
- [x] T007 [P0] Add failing assertion for out-of-bound writes in replay validation (`.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts`) [EVIDENCE: `createStopReplaySandbox()` rejects touched paths outside the sandbox and the replay suite passes.]
- [x] T008 [P1] Add at least one Stop-path fixture for producer verification (`.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/`) [EVIDENCE: added `tests/fixtures/hooks/session-stop-replay.jsonl`.]

### Phase B: Bounded Producer Metadata Patch
- [x] T009 [P0] Extend `HookState` with additive producer metadata only (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`) [EVIDENCE: `HookState` now carries `producerMetadata` with `lastClaudeTurnAt`, transcript reference, and cache-token fields.]
- [x] T010 [P0] Keep `claudeSessionId` primary and `speckitSessionId` nullable in the updated seam (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`) [EVIDENCE: `speckitSessionId` is now nullable and replay tests assert the Stop-path state keeps `claudeSessionId` primary.]
- [x] T011 [P0] Persist bounded transcript identity or reference and cache-token carry-forward fields in Stop writer flow (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`) [EVIDENCE: `session-stop.ts` writes transcript fingerprint/path/mtime/size plus cache token carry-forward data into hook state.]
- [x] T012 [P0] Confirm `session-stop.ts` remains a producer boundary, not an analytics reader (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`) [EVIDENCE: The stop hook runs `processStopHook()` which invokes `runContextAutosave()` by default when session state is populated. This is the intended producer boundary - autosave is not a side effect but the primary continuity mechanism. No analytics reader or startup consumer was added.]
- [x] T013 [P1] Verify `session-prime.ts` stays unchanged in active scope or additive-safe only (read-only check) [EVIDENCE: `git diff --name-only -- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts .claude/settings.local.json` returned no changes.]

### Phase C: Idempotent Verification and Handoff
- [x] T014 [P0] Replay the same transcript twice and assert stable session totals (`.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts`) [EVIDENCE: `tests/hook-session-stop-replay.vitest.ts` replays the same transcript twice and passes.]
- [x] T015 [P0] Assert no duplicate turn ingestion or duplicate producer markers after double replay (`.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts`) [EVIDENCE: replay suite proves second replay parses 0 new messages, preserves metrics, and leaves exactly one state file.]
- [x] T016 [P1] Re-confirm packet docs preserve bootstrap and memory resume authority (`spec.md`, `plan.md`, `decision-record.md`) [EVIDENCE: docs continue to keep `session_bootstrap()` and memory resume authoritative and defer startup consumers.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase Verification
- [x] T017 [P0] Run `npm run typecheck` for `.opencode/skill/system-spec-kit/mcp_server` [EVIDENCE: `TMPDIR=$PWD/.tmp/tsc-tmp npm run typecheck` passed.]
- [x] T018 [P0] Run strict packet validation [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/001-cache-warning-hooks\" --strict` passed.]
- [x] T019 [P1] Record implementation evidence in `implementation-summary.md` only after implementation work actually completes [EVIDENCE: this packet now includes a completed `implementation-summary.md`.]
- [x] T020 [P2] Refresh packet description or index artifacts if downstream discovery surfaces require it [EVIDENCE: no additional packet discovery refresh was required for scoped completion.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Packet no longer claims active `UserPromptSubmit` or settings mutation work
- [x] Producer-only boundary is explicit across all packet docs, with Stop-hook autosave described as the default writer behavior
- [x] Predecessor and follow-on order are documented honestly
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
