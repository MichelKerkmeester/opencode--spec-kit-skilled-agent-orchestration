# Iteration 39 — Domain 3: Concurrency and Write Coordination (9/10)

## Investigation Thread
I filtered out the temp-path and generic last-writer-wins races already captured in Iterations 031-038 and re-read the remaining coordination seams for caller-visible contract gaps. This pass focused on two narrower questions: whether `session-stop.ts` exposes any truthful autosave outcome once it re-reads hook state, and whether `reconsolidation-bridge.ts` evaluates governed candidates against one coherent snapshot or a candidate-by-candidate mix of live scope rows.

## Findings

### Finding R39-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `60-67`, `108-117`, `299-318`
- **Severity:** P1
- **Description:** The stop hook's result surface reports only the configured autosave mode, not whether autosave actually ran, skipped, or failed after the write-then-read handoff. `runContextAutosave()` re-loads hook state from disk, silently returns if either `lastSpecFolder` or `sessionSummary` is missing, and logs failures internally, but `processStopHook()` never captures that outcome before returning `SessionStopProcessResult`.
- **Evidence:** `runContextAutosave(sessionId)` starts with `const state = loadState(sessionId)` and immediately returns on `!specFolder || !summary` (`session-stop.ts:60-67`). The exported result type only exposes `touchedPaths`, `parsedMessageCount`, `autosaveMode`, and `producerMetadataWritten` (`session-stop.ts:108-117`). After issuing the final `sessionSummary` patch, `processStopHook()` calls `runContextAutosave(sessionId)` and then returns without any autosave result field or retry path (`session-stop.ts:299-318`). Existing coverage does not exercise an enabled autosave path at all: the replay harness only asserts `autosaveMode === 'disabled'` and producer-metadata persistence (`mcp_server/tests/hook-session-stop-replay.vitest.ts:14-22`), while the direct stop-hook suite only tests `detectSpecFolder()` helper behavior (`mcp_server/tests/hook-session-stop.vitest.ts:17-89`).
- **Downstream Impact:** A lost or interleaved `updateState()` write can cause autosave to no-op or fail while the stop hook still reports an apparently normal completion path. Callers and operators have no structured signal that the continuity save was skipped after state reread, so packet freshness can silently regress under exactly the concurrency seam this domain is auditing.

### Finding R39-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `203-237`, `282-306`
- **Severity:** P1
- **Description:** Governed reconsolidation filtering does not evaluate candidates against a single snapshot. The bridge first gets a vector-search result set, then performs a separate `SELECT tenant_id, user_id, agent_id, session_id FROM memory_index WHERE id = ?` for each candidate during `results.filter(...)`. Without a transaction, concurrent scope updates or deletes can make one planning pass mix candidate scopes from different moments in time.
- **Evidence:** `readStoredScope()` performs a standalone point lookup by candidate id (`reconsolidation-bridge.ts:203-217`). `candidateMatchesRequestedScope()` calls that lookup whenever governed scope is present and rejects the candidate if the row is missing or the scope no longer matches (`reconsolidation-bridge.ts:219-237`). The main reconsolidation path then does `vectorIndex.vectorSearch(...)` followed by `results.filter((r) => candidateMatchesRequestedScope(database, r, requestedScope)).slice(...)` before mapping the surviving candidates into the planner input (`reconsolidation-bridge.ts:282-306`). The only targeted regression here uses one mocked candidate and one static `database.prepare().get()` response (`mcp_server/tests/reconsolidation-bridge.vitest.ts:255-330`); it does not exercise multiple candidates or a scope row that changes between successive lookups inside the same filter loop.
- **Downstream Impact:** A single save request can choose merge/conflict/complement from a candidate set that never existed atomically. Under concurrent scope churn, higher-similarity candidates can disappear mid-filter while lower-ranked ones survive, or the entire governed set can collapse to empty, leading the caller to create a new memory from a mixed-snapshot view of the world.

## Novel Insights
- The remaining stop-hook concurrency risk is now less about byte-level races and more about **truthful result reporting**: the hook has no structured way to say whether the autosave reread actually produced a continuity write.
- Save-time reconsolidation has a second read-coordination seam beyond "search before transaction": even the governed scope filter itself is assembled from per-candidate live reads, so one planner pass can reason over a candidate universe that was never consistent at any instant.

## Next Investigation Angle
The last Domain 3 pass should turn these into adversarial harness gaps: one autosave-enabled stop-hook replay that forces `sessionSummary` or `lastSpecFolder` to disappear before `runContextAutosave()` reads state, and one reconsolidation-bridge test with multiple candidates whose governed scope changes between successive `readStoredScope()` calls so the planner's mixed-snapshot behavior becomes directly observable.
