# Iteration 38 — Domain 3: Concurrency and Write Coordination (8/10)

## Investigation Thread
I filtered out the already-written write-side races from Iterations 031-037 and stayed on the remaining directory-level coordination seams around `hook-state.ts`. This pass checked whether the shared state directory's readers and cleanup sweeps tolerate concurrent file turnover from the same hook writers that earlier iterations already showed are unlocked.

## Findings

### Finding R38-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Lines:** `hook-state.ts:131-165`; `session-resume.ts:348-366`
- **Severity:** P2
- **Description:** `loadMostRecentState()` is still all-or-nothing under concurrent file churn. The function wraps the entire directory scan in one `try` block, so a single `statSync`, `readFileSync`, or `JSON.parse` failure on any sibling state file aborts the whole lookup and returns `null`, even if another matching state file is still valid. That turns one transient concurrent delete/replace/read failure into a false cold-start result for all cached-summary consumers.
- **Evidence:** The scan loop enumerates `*.json`, then does `statSync(filePath)`, `readFileSync(filePath, 'utf-8')`, and `JSON.parse(raw)` for each candidate inside one outer `try`; any exception falls through to `catch { return null; }` (`hook-state.ts:131-165`). `getCachedSessionSummaryDecision()` consumes this helper directly when no explicit state is passed (`session-resume.ts:357-365`), so the abort path suppresses cached summary reuse rather than skipping one bad candidate. Direct hook-state coverage only exercises sequential newest/stale/no-scope cases (`tests/hook-state.vitest.ts:135-223`), and the session-resume suite mocks `loadMostRecentState()` instead of exercising mid-scan failure behavior (`tests/session-resume.vitest.ts:8-42,174-202`).
- **Downstream Impact:** One disappearing or unreadable sibling file in the hook-state directory can make resume/startup logic behave as if there is no recoverable recent state at all. That degrades continuity reuse, cached summary recovery, and packet targeting even when a valid matching state file still exists.

### Finding R38-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts`
- **Lines:** `hook-state.ts:243-263`; `session-stop.ts:321-328`; `hooks/gemini/session-stop.ts:77-84`
- **Severity:** P2
- **Description:** Stale-state cleanup is also single-failure fragile. `cleanStaleStates()` wraps the whole sweep in one `try` block, so one concurrent `statSync`/`unlinkSync` failure aborts the remaining cleanup pass and returns a partial `removed` count without any indication that later files were skipped. Both Claude and Gemini `session-stop --finalize` modes trust that count as the cleanup result.
- **Evidence:** `cleanStaleStates()` scans the directory, calls `statSync(filePath)`, conditionally `unlinkSync(filePath)`, and swallows any exception for the whole function before returning `removed` (`hook-state.ts:243-263`). The finalize entrypoints do nothing more than call `cleanStaleStates(FINALIZE_MAX_AGE_MS)` and log the returned count (`hooks/claude/session-stop.ts:321-328`; `hooks/gemini/session-stop.ts:77-84`). The checked-in hook-state test suite stops at `loadMostRecentState()` coverage and never exercises `cleanStaleStates()` at all (`tests/hook-state.vitest.ts:21-223`).
- **Downstream Impact:** A finalize sweep that overlaps with live hook writers can leave stale state files behind while still reporting a seemingly normal cleanup count. Those leftovers increase the odds of later `loadMostRecentState()` scans considering obsolete siblings and make manual maintenance runs look successful when they were only partially applied.

## Novel Insights
- The unclaimed Domain 3 seams are now mostly **directory-level reader/cleanup coordination**, not the already-documented write-side temp-swap races. A single changing sibling file can still poison unrelated recovery and cleanup work.
- `hook-state.ts` has two separate fail-closed loops on the same shared directory: one for recovery (`loadMostRecentState`) and one for cleanup (`cleanStaleStates`). Neither loop degrades per file, so concurrent churn on one entry can suppress operations on every other entry.

## Next Investigation Angle
Add adversarial harnesses around the shared hook-state directory itself: delete or replace one sibling during `loadMostRecentState()` and `cleanStaleStates()`, then verify whether recovery/cleanup skips only the bad file or still aborts the whole pass. If those regressions reproduce, the last Domain 3 iteration can decide whether the remaining work is purely harness debt or whether other directory-wide scans in the runtime share the same poison-pill pattern.
