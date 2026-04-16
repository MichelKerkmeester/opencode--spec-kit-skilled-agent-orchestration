# Iteration 1 — Session lifecycle continuity seam (1/10)

## Investigation Thread
I traced how Claude/Gemini hook state is written at session stop, recovered at session start, and surfaced through startup/resume continuity helpers. The focus was the boundary between `hook-state.ts`, `session-stop.ts`, `startup-brief.ts`, and runtime-specific `session-prime.ts` consumers.

## Findings

### Finding R1-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- **Lines:** `179-192`
- **Severity:** P1
- **Description:** `buildSessionContinuity()` is dead-on-arrival in production because it calls `loadMostRecentState()` without any scope, while `hook-state.ts` explicitly rejects scope-less reads. Claude startup mostly hides this because it separately calls `getCachedSessionSummaryDecision()`, but Gemini startup depends on `startupBrief.sessionContinuity`, so Gemini never receives prior session continuity from persisted hook state.
- **Evidence:** `hook-state.ts:117-129` returns `null` when neither `specFolder` nor `claudeSessionId` is supplied; `startup-brief.ts:179-192` still calls `loadMostRecentState()` with no arguments; `hooks/gemini/session-prime.ts:87-151` only forwards `startupBrief?.sessionContinuity` during `startup`; `tests/startup-brief.vitest.ts:28-42,59-77` masks the bug by mocking `loadMostRecentState()` to return a state object that real code would reject.
- **Downstream Impact:** Gemini startup sessions lose the "Last session worked on..." continuity lane even when valid hook state exists, and any future caller that trusts `buildStartupBrief()` for continuity gets a false "startup summary only" outcome.

### Finding R1-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `60-105,240-309`
- **Severity:** P1
- **Description:** Missing `session_id` values collapse onto a shared temp-state identity. `session-stop`, Claude `session-prime`, and Gemini `session-prime` all substitute `'unknown'`, while `hook-state.ts` hashes only the provided session ID into the state filename. A malformed or partial hook payload therefore reads and writes the same shared bucket, allowing one session's `lastSpecFolder` or `sessionSummary` to bleed into another session's resume/startup flow or autosave target.
- **Evidence:** `hook-state.ts:68-70` derives the state file solely from `sessionId`; `hooks/claude/session-stop.ts:240,299-309` uses `input.session_id ?? 'unknown'` and then autosaves whatever state is stored under that ID; `hooks/claude/session-prime.ts:240-257` and `hooks/gemini/session-prime.ts:188-207` use the same fallback on startup/resume; `tests/hook-state.vitest.ts:86-223`, `tests/hook-session-stop.vitest.ts:17-88`, and `tests/hook-session-stop-replay.vitest.ts:14-56` only cover named-session paths and never exercise the shared `'unknown'` bucket.
- **Downstream Impact:** A single bad hook payload can poison the shared fallback state so later SessionStart/Resume hooks show the wrong active spec folder, and `runContextAutosave()` can persist another session's summary into the wrong packet.

## Novel Insights
This seam is not just "hook state may race"; it already has a runtime contract split. Claude startup bypasses the broken startup-brief continuity lane with a separate scoped resume helper, while Gemini startup still trusts the dead lane directly. The test suite also overstates safety here: one path is green because it mocks impossible runtime behavior, and the other never covers the missing-session-id collision path at all.

## Next Investigation Angle
Trace the compact/recovery handoff next: `compact-inject.ts` -> `hook-state.ts` -> `session-prime.ts` -> `session-resume.ts`, with emphasis on whether cached compact payloads and `producerMetadata` can drift apart or be cleared/replayed in the wrong order.
