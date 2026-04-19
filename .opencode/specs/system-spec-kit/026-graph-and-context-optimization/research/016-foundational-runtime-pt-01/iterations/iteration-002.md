# Iteration 2 — hook-state continuity contracts (2/10)

## Investigation Thread
I focused on the `hook-state.ts` continuity contract and traced how its recency lookup is consumed by `startup-brief.ts`, `session-resume.ts`, and the runtime-specific session-prime hooks. The goal was to find foundational failures in the persisted temp-state seam rather than repeat the already-documented stdout/cache-clear issue from Phase 015 iteration 15.

## Findings

### Finding R2-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts`
- **Lines:** `179-183`
- **Severity:** P1
- **Description:** `buildStartupBrief()` asks `hook-state` for the "most recent state" without providing any scope, but `loadMostRecentState()` now hard-fails when neither `specFolder` nor `claudeSessionId` is supplied. That makes `startup-brief`'s own continuity path unreachable in real runtime execution.
- **Evidence:** `buildSessionContinuity()` calls `loadMostRecentState()` with no arguments (`startup-brief.ts:179-183`), while `hook-state.ts` explicitly rejects scope-less calls and returns `null` (`hooks/claude/hook-state.ts:117-129`). `buildStartupBrief()` then omits the `session-continuity` section and emits a "no continuity notes" summary whenever that lookup returns null (`startup-brief.ts:196-246`). This matters at runtime because Gemini and Copilot startup hooks consume `startupBrief.startupSurface` / `startupBrief.sessionContinuity` directly (`hooks/gemini/session-prime.ts:88-151`, `hooks/copilot/session-prime.ts:41-55`). The current tests miss the contract break because `startup-brief.vitest.ts` mocks `loadMostRecentState()` to return a state object instead of exercising the real fail-closed behavior (`tests/startup-brief.vitest.ts:28-42`, `59-77`).
- **Downstream Impact:** Gemini SessionStart and Copilot startup banners can never surface persisted session continuity from `hook-state`, even when valid temp state exists. The shared `startup_brief` payload also loses its `session-continuity` section, so any consumer relying on the startup payload rather than Claude's separate cached-summary path gets a continuity-free startup surface.

### Finding R2-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `131-165`
- **Severity:** P1
- **Description:** `loadMostRecentState()` wraps the entire directory scan in one `try` block, so a single unreadable or malformed `.json` state file aborts the whole lookup and returns `null` for every caller instead of skipping the bad candidate.
- **Evidence:** Inside the scan loop, each candidate is parsed with `JSON.parse(raw)` (`hooks/claude/hook-state.ts:147-148`), but any exception falls through the outer catch and returns `null` for the full operation (`hooks/claude/hook-state.ts:164-165`). `session-resume` depends on this helper to construct cached summary candidates and scope fallback (`handlers/session-resume.ts:357-365`, `409-421`), so one corrupt temp file can suppress additive continuity reuse for the whole project hash. Direct tests only cover matching-scope, no-scope, and stale-age happy paths (`tests/hook-state.vitest.ts:135-223`), and `session-resume.vitest.ts` mocks `loadMostRecentState()` entirely (`tests/session-resume.vitest.ts:8-44`, `163-202`), leaving the malformed-file branch without a tripwire.
- **Downstream Impact:** A single truncated or partially-written hook-state file in `${tmpdir()}/speckit-claude-hooks/<project-hash>/` can disable cached summary acceptance and cached spec-folder fallback in `session_resume`, degrading recovery back to the filesystem ladder even when another valid recent state file exists. Because the failure is surfaced as ordinary `null`, operators see a benign-looking "missing_state" outcome rather than a recoverable temp-state corruption signal.

## Novel Insights
This iteration exposed a deeper contract split than the Phase 015 session-prime review caught: the startup path and the resume path both depend on `hook-state`, but they depend on different, incompatible assumptions. `startup-brief` assumes scope-less recency lookup is legal, while `session-resume` assumes every candidate in the temp-state directory is parseable. Together, those seams make persisted continuity both harder to reach and easier to silently lose than the surrounding runtime surfaces suggest.

## Next Investigation Angle
Follow the same continuity seam into write-side coordination: inspect whether `updateState()` plus the fixed `file.tmp` path can lose fields under overlapping hook writers (`compact-inject`, `session-stop`, `gemini/session-stop`, `gemini/compact-cache`), and cross-check whether any test exercises concurrent writes or temp-file collisions.
