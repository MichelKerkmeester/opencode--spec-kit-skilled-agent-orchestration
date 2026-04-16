# Iteration 28 — Domain 2: State Contract Honesty (8/10)

## Investigation Thread
I re-checked the requested Domain 2 seams against prior iterations and Phase 015, then narrowed to one still-unwritten downstream consumer path: what happens when `hook-state.ts` collapses malformed persisted state into `null` and `session-stop.ts` treats that as an ordinary cold start. The other requested seams (`post-insert.ts`, `shared-payload.ts`, `code-graph/query.ts`, and `graph-metadata-parser.ts`) are already materially covered in earlier iterations, so this pass keeps only the additive stop-hook fallout.

## Findings

### Finding R28-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `244-275`
- **Severity:** P1
- **Description:** A malformed hook-state file is collapsed into a fake "first stop for this session" state, so the stop hook replays transcript parsing from byte offset `0` and re-emits token accounting as if no prior cursor existed. `loadState()` returns `null` on any parse failure, and `processStopHook()` immediately turns that into `startOffset = 0` with no corruption signal.
- **Evidence:** `hook-state.ts:83-89` does `JSON.parse(raw) as HookState` and returns `null` on failure. `session-stop.ts:244-252` then derives `startOffset` from `stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0`, so unreadable persisted state becomes indistinguishable from a genuine cold start. If parsing finds messages, the hook proceeds through `storeTokenSnapshot(...)` and the normal metrics update path (`session-stop.ts:257-268`), even though the replay harness only proves idempotent second-run behavior when the prior state file is valid (`tests/hook-session-stop-replay.vitest.ts:42-56`). The token-state suite also covers only valid persisted metrics updates, never malformed state recovery (`tests/token-snapshot-store.vitest.ts:14-45`).
- **Downstream Impact:** Stop-hook token/cost accounting can silently double-count already-parsed transcript history after temp-state corruption, and operators only see an apparently ordinary stop event with a non-zero `parsedMessageCount`. The contract boundary between "new transcript bytes arrived" and "the continuity cursor was unreadable" disappears.

### Finding R28-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `60-67, 279-309, 340-369`
- **Severity:** P1
- **Description:** The same `null` collapse also strips the only disambiguator that preserves the current autosave packet under transcript ambiguity. When prior hook state is unreadable, `session-stop.ts` passes `null` as `currentSpecFolder`, so `detectSpecFolder()` no longer has the existing packet anchor it needs to keep the autosave target stable; the follow-on autosave then either retargets to a lone transcript packet or silently skips because `lastSpecFolder` never becomes recoverable.
- **Evidence:** `loadState()` again reduces malformed persisted state to `null` (`hook-state.ts:83-89`). `processStopHook()` passes `stateBeforeStop?.lastSpecFolder ?? null` into `detectSpecFolder(...)` (`session-stop.ts:279-281`), and `detectSpecFolder()` only preserves an existing packet when `currentSpecFolder` is present in the transcript matches; otherwise it returns the unique match or `null` on ambiguity (`session-stop.ts:340-369`, with selection rules at `session-stop.ts:128-145`). The direct spec-folder tests codify that distinction: multiple packets preserve the current folder only when one is supplied, while the transcript-only ambiguous case returns `null` (`tests/hook-session-stop.vitest.ts:17-50`), and retargeting occurs only when the current folder is absent (`tests/hook-session-stop.vitest.ts:70-88`). If `lastSpecFolder` stays unresolved, `runContextAutosave()` exits early on `!specFolder || !summary` with no warning (`session-stop.ts:60-67`), while replay coverage keeps autosave disabled and never exercises this corrupted-state path (`tests/hook-session-stop-replay.vitest.ts:14-56`).
- **Downstream Impact:** Temp-state corruption can turn a previously stable autosave target into "ambiguous/no target" or an unintended retarget, and the stop hook can silently skip continuity save even though summary extraction succeeded. That is a control-plane routing failure: malformed state is reported to downstream logic as if the session simply had no prior packet anchor.

## Novel Insights
- The remaining additive Domain 2 seam is not in the already-audited trust mappers themselves, but in how the stop hook **consumes** unvalidated persisted state. `hook-state.ts` does not just risk stale reads; it actively collapses "corrupted continuity state" into the same branch used for a legitimate cold start.
- Earlier iterations covered hook-state corruption in startup, resume, and compaction flows. This pass shows the same dishonesty reaches the **write side** too: stop-hook parsing and stop-hook autosave both treat unreadable continuity state as ordinary absence, so the system can both lose packet routing and duplicate transcript accounting in the same event.

## Next Investigation Angle
Stay in Domain 2 and trace whether any higher-level stop-hook or analytics consumer can detect this cold-start-vs-corruption collapse after `processStopHook()` returns. The next pass should inspect whether `parsedMessageCount`, `producerMetadataWritten`, or token snapshots are ever compared against prior continuity state strongly enough to surface "cursor reset because hook state was unreadable" instead of accepting the replay as normal.
