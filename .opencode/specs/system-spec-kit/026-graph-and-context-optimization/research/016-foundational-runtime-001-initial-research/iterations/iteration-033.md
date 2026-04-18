# Iteration 33 — Domain 3: Concurrency and Write Coordination (3/10)

## Investigation Thread
I stayed on the already-identified unlocked write seams, but looked for additive bugs beyond "last writer wins": destructive consumers that clear newer state, monotonic progress fields that can move backwards under overlap, and save failures that do not stop the downstream autosave path.

## Findings

### Finding R33-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts`
- **Lines:** `hook-state.ts:184-217`; `session-prime.ts:43-46, 281-287`; `hooks/gemini/session-prime.ts:221-227`; `hooks/gemini/compact-inject.ts:70-75`
- **Severity:** P1
- **Description:** The compact-recovery consumer clears `pendingCompactPrime` by session only, not by payload identity. `handleCompact()` reads one cached payload, but the later `clearCompactPrime(sessionId)` nulls whatever compact payload is current at clear time. If a newer precompact write lands between the read and the clear, the newer payload is erased.
- **Evidence:** `readCompactPrime()` is a plain `loadState(sessionId)` read (`hook-state.ts:184-188`), while `clearCompactPrime()` separately reloads state, sets `pendingCompactPrime: null`, and saves it with no `cachedAt` / content equality check (`hook-state.ts:190-205`). Claude reads the payload in `handleCompact()` and then clears it only after output handoff (`session-prime.ts:43-46, 281-287`); Gemini follows the same pattern in both `session-prime` and `compact-inject` (`hooks/gemini/session-prime.ts:221-227`, `hooks/gemini/compact-inject.ts:70-75`). Current tests cover only sequential cache store/load behavior (`tests/hook-precompact.vitest.ts:23-48`, `tests/hook-session-start.vitest.ts:27-107`) and do not invoke `clearCompactPrime()` or `readAndClearCompactPrime()` under overlap.
- **Downstream Impact:** A fresh compact brief can be deleted by an older recovery consumer, so the next post-compaction or startup recovery falls back to the generic "call memory_context" path even though a newer cached payload had already been produced.

### Finding R33-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `session-stop.ts:119-125, 244-268`; `hook-state.ts:221-241`
- **Severity:** P1
- **Description:** Overlapping Claude stop hooks can move `metrics.lastTranscriptOffset` backwards. Each invocation snapshots `startOffset` once from `stateBeforeStop`, parses forward from that point, and then overwrites the whole `metrics` object with its own `newOffset`. There is no monotonicity guard against an older invocation persisting a smaller offset after a newer invocation already advanced it.
- **Evidence:** `processStopHook()` reads `stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0` once (`session-stop.ts:244-246`), passes that value into `parseTranscript(...)` (`session-stop.ts:249-252`), then writes `lastTranscriptOffset: newOffset` through `recordStateUpdate(...)` (`session-stop.ts:261-268`). `recordStateUpdate()` is just `updateState(sessionId, patch)` (`session-stop.ts:119-125`), and `updateState()` performs a blind `{ ...existing, ...patch }` merge with no compare-and-swap or `Math.max` protection for offsets (`hook-state.ts:221-241`). Existing tests prove incremental parsing and sequential metric overwrites only (`tests/hook-stop-token-tracking.vitest.ts:65-89`, `tests/token-snapshot-store.vitest.ts:25-35`); they do not run two stop hooks against the same session concurrently.
- **Downstream Impact:** A regressed offset makes the next stop hook re-parse already-counted transcript bytes, which can duplicate token snapshots, duplicate producer-metadata updates, and skew cost / usage history while still looking like a normal incremental parse.

### Finding R33-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `hook-state.ts:170-180, 221-241`; `session-stop.ts:60-67, 119-125, 261-309`
- **Severity:** P1
- **Description:** The stop-hook lane treats failed state persistence as non-blocking, then immediately trusts disk for autosave. If `saveState()` loses the shared `.tmp` race or otherwise fails, `updateState()` only logs a warning; `recordStateUpdate()` does not surface that failure; and `runContextAutosave()` still reloads state from disk and can autosave stale `lastSpecFolder` / `sessionSummary` data.
- **Evidence:** `saveState()` returns `false` on write or rename failure (`hook-state.ts:170-180`), but `updateState()` only logs `State update was not persisted` and still returns the in-memory merged object (`hook-state.ts:237-240`). `recordStateUpdate()` ignores persistence outcome entirely (`session-stop.ts:119-125`). Later in the same flow, `runContextAutosave()` reloads `lastSpecFolder` and `sessionSummary` from disk (`session-stop.ts:60-67`) after the three independent state writes (`session-stop.ts:261-304`) and is invoked unconditionally when autosave is enabled (`session-stop.ts:308-309`). The current tests only cover success-path helper behavior (`tests/hook-session-stop.vitest.ts:17-88`) or replay with autosave disabled (`tests/hook-session-stop-replay.vitest.ts:14-56`); none simulate a failed `saveState()` before autosave.
- **Downstream Impact:** The hook can report a routine stop-processing success path while continuity is saved from stale state, skipped for the newly detected packet, or written with an old summary. In practice this turns a local state-write race into cross-packet continuity corruption with only warning logs as evidence.

## Novel Insights
- The next layer of Domain 3 bugs is **identity-free cleanup**: not just concurrent writers, but consumers that clear or overwrite shared state without proving they are operating on the same payload or the latest transcript cursor they originally read.
- The stop-hook seam has two separate failure classes now: mixed snapshots under concurrent success, and stale autosave after known persistence failure. Atomic rename only protects bytes, not the truthfulness of the state that downstream autosave consumes.

## Next Investigation Angle
Add adversarial harnesses for three concrete interleavings: (1) write a new `pendingCompactPrime` between `readCompactPrime()` and `clearCompactPrime()`, (2) run two `processStopHook()` calls with delayed `saveState()` to prove `lastTranscriptOffset` can regress, and (3) force `saveState()` failure in the stop hook and assert autosave aborts instead of reloading stale disk state.
