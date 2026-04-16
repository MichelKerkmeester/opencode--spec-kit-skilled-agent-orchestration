# Iteration 4 — Hook-state recovery contract (4/10)

## Investigation Thread
This iteration traced the hook-state recovery seam from `hooks/claude/hook-state.ts` into its startup and resume consumers. The focus was whether recent-state recovery is actually reachable, corruption-tolerant, and semantically aligned with the stored `HookState` contract.

## Findings

### Finding R4-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- **Lines:** `179-198`
- **Severity:** P1
- **Description:** `buildSessionContinuity()` calls `loadMostRecentState()` with no scope, but `hook-state.ts` explicitly rejects scope-less lookups. In live code, the startup brief's continuity path is therefore dead on arrival.
- **Evidence:** `startup-brief.ts:180` does `loadMostRecentState();`, while `hook-state.ts:117-129` logs `scope_unknown_fail_closed` and returns `null` unless `specFolder` or `claudeSessionId` is supplied. Gemini startup then depends directly on `startupBrief.sessionContinuity` for its continuity section (`hooks/gemini/session-prime.ts:87-141`). The direct startup-brief test bypasses this contract by mocking `loadMostRecentState()` to return a state object unconditionally (`tests/startup-brief.vitest.ts:28-76`), so the unreachable path is not exercised.
- **Downstream Impact:** Gemini startup sessions lose their only automatic continuity section, and the shared startup payload degrades to `startup summary only (resume on demand)` even when valid hook state exists on disk.

### Finding R4-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `131-166`
- **Severity:** P1
- **Description:** `loadMostRecentState()` is poison-pill fragile: one malformed JSON sibling file aborts the entire directory scan and returns `null`, even if newer matching state files are valid.
- **Evidence:** The function wraps the full scan in one `try` block (`131-166`) and performs raw `JSON.parse(raw) as HookState` for each candidate (`147-149`). Any parse error falls through to `catch { return null; }` at `164-165`, so the loader never skips past a bad file. Both `startup-brief.ts:179-198` and `handlers/session-resume.ts:348-366` consume this loader. Existing tests cover only happy-path/newest/stale/no-scope behavior (`tests/hook-state.vitest.ts:135-223`), and `tests/session-resume.vitest.ts:8-10,163-202` mocks `loadMostRecentState()` instead of exercising malformed-state recovery.
- **Downstream Impact:** A single corrupted tempdir artifact can suppress cached continuity for both startup and `session_resume`, forcing the system back to ladder recovery with no signal that recovery failed because a sibling state file poisoned the scan.

### Finding R4-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `142-155`
- **Severity:** P2
- **Description:** Recent-state authority is based on filesystem `mtime`, not the logical `updatedAt` stored in `HookState`, so restored or touched files can outrank the actually newest session state.
- **Evidence:** Candidate freshness and winner selection both use `statSync(filePath).mtimeMs` (`142-155`); `state.updatedAt` is never consulted. The current tests codify that behavior by using `utimesSync()` to drive selection and staleness (`tests/hook-state.vitest.ts:165-173,210-216`), which makes filesystem metadata the de facto public contract.
- **Downstream Impact:** `session_resume` can recover the wrong cached scope or summary after backup restore, tempdir migration, or manual `touch`, and startup continuity can point operators at the wrong packet without any schema-level indication that the chosen state is logically stale.

## Novel Insights
The interesting seam here is not just "hook state lacks validation" but that its consumers disagree on what the recovery contract is. `session_resume` treats recent-state lookup as scoped and security-sensitive, while `startup-brief` treats it as a global ambient lookup. The tests also reinforce the wrong authority model: mocks hide the scope contract, and `utimesSync()` bakes filesystem metadata in as the freshness source instead of the persisted state payload.

## Next Investigation Angle
Trace concurrent writers into `hook-state.ts`, especially `compact-inject.ts`, `session-stop.ts`, and Gemini hook producers, to determine whether deterministic `.tmp` filenames and lock-free `updateState()` can lose or interleave continuity updates across runtimes.
