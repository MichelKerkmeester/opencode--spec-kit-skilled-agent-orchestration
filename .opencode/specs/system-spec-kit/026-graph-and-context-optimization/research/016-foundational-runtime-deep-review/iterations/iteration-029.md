# Iteration 29 — Domain 2: State Contract Honesty (9/10)

## Investigation Thread
I stayed on the hook-state/read-side seam and looked for additive downstream fallout that earlier iterations had not already logged. The new angle was whether the runtime can actually detect persisted hook-state schema drift, or whether later consumers only pretend to have that distinction while operating on unversioned temp-state JSON.

## Findings

### Finding R29-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Lines:** `174-208`
- **Severity:** P1
- **Description:** The cached-summary schema check is effectively dead for real hook-state inputs. `buildCachedSessionSummaryCandidate(...)` fabricates `schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION` for every loaded `HookState`, but `HookState` itself has no schema-version field and is still loaded from temp-state JSON via unchecked `JSON.parse(...)`. That means parseable persisted state can never surface as `schema_version_mismatch`; it is always treated as current-schema continuity data.
- **Evidence:** `HookState` defines no version marker (`hooks/claude/hook-state.ts:30-48`), and both `loadState()` / `loadMostRecentState()` still trust `JSON.parse(raw) as HookState` (`hooks/claude/hook-state.ts:83-87,147-149`). `buildCachedSessionSummaryCandidate(...)` then stamps the current constant into every candidate (`handlers/session-resume.ts:181-188`), while `evaluateCachedSessionSummaryCandidate(...)` checks `candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION` as if that field came from persisted state (`handlers/session-resume.ts:203-208`). Existing coverage never exercises a real schema-mismatch path: `tests/session-resume.vitest.ts:8-10,163-202` mocks `loadMostRecentState()` directly, and `tests/hook-state.vitest.ts:86-223` covers only happy-path persistence plus scope/staleness behavior.
- **Downstream Impact:** `getCachedSessionSummaryDecision()` can accept or further classify schema-drifted temp-state as if it were current cached continuity, so both `session_resume` and Claude startup reuse are making trust decisions on unversioned state while advertising that a schema-mismatch guard exists.

### Finding R29-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- **Lines:** `130-143`
- **Severity:** P2
- **Description:** Claude startup collapses all cached-summary rejection reasons into the same user-facing "no cached continuity" state. It only distinguishes `accepted` from `rejected`; every rejected reason becomes `sessionContinuity = null` and the memory line is rewritten to `startup summary only (resume on demand)`. Combined with R29-001, hook-state schema drift is surfaced to operators exactly like an ordinary cache miss.
- **Evidence:** `handleStartup()` calls `getCachedSessionSummaryDecision(...)`, then sets `sessionContinuity` only when `status === 'accepted'` and otherwise rewrites the startup memory line to the generic fallback (`hooks/claude/session-prime.ts:130-143`). Rejection logging is delegated to `logCachedSummaryDecision(...)`, which prints a stderr reason but does not change the injected startup surface (`handlers/session-resume.ts:383-393`). The startup tests lock in only the binary contract: `tests/hook-session-start.vitest.ts:138-178` mocks an accepted decision, while `tests/hook-session-start.vitest.ts:180-190` mocks a generic rejected decision; there is no regression for a schema-specific rejection path or distinct startup messaging.
- **Downstream Impact:** When cached continuity fails because the temp-state shape drifted, Claude startup presents the same prompt surface as a benign cold start. Operators lose the signal that the hook-state cache itself is broken or needs migration/quarantine, so recovery silently falls back instead of surfacing a state-integrity problem.

## Novel Insights
- Earlier iterations established that hook-state is unvalidated and can steer prompt/recovery behavior. The additive result here is that the runtime's **own schema-drift vocabulary is mostly theatrical** for cached summaries: the checker exists, but persisted hook state never carries independent version information, so later consumers cannot truly distinguish schema drift from normal cache rejection.
- The downstream collapse is two-stage: `session-resume` first upgrades unversioned temp-state into "current" cached-summary candidates, then Claude startup flattens every rejection into the same continuity-absent UI. That makes cache-integrity failures look routine rather than exceptional.

## Next Investigation Angle
Trace the writer side of this seam: whether `session-stop` / `updateState()` can add an explicit hook-state schema version or quarantine marker, and whether any non-Claude consumer has a machine-readable way to surface temp-state corruption differently from an ordinary cached-summary miss.
