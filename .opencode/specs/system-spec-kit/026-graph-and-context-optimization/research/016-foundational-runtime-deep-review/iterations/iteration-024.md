# Iteration 24 — Domain 2: State Contract Honesty (4/10)

## Investigation Thread
I re-read the requested state-honesty seams in `post-insert.ts`, `shared-payload.ts`, `code-graph/query.ts`, `graph-metadata-parser.ts`, and `hook-state.ts`, then filtered out the state-promotion findings already captured in Iterations 021-023. This pass kept only still-novel consumer-level breakage: where collapsed runtime state loses its recovery path on the save surface, and where unvalidated hook state is promoted into authoritative resume scope.

## Findings

### Finding R24-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- **Lines:** `1616-1678, 2362-2384`
- **Severity:** P1
- **Description:** `memory_save` decides whether to advertise `runEnrichmentBackfill` before post-insert enrichment runs. That means the only save path with a typed recovery action is the already-known planner-first defer case. If `post-insert.ts:96-208` later collapses a partial runtime miss into `executionStatus.status = 'ran'` plus warning-only side channels, the final save response has no structured retry/backfill action even though the backfill API exists.
- **Evidence:** `buildAtomicPlannerFollowUpActions()` only appends the `enrich` action when `!isPostInsertEnrichmentEnabled()` (`handlers/memory-save.ts:1666-1675`). The actual enrichment result is produced much later by `runPostInsertEnrichmentIfEnabled(...)` (`handlers/memory-save.ts:2362-2384`), after which `response-builder.ts:315-322,569-573` can only add `"Partial enrichment: ... failed"` or the deferred hint. The direct deferred suite locks in the one actionable branch (`tests/post-insert-deferred.vitest.ts:11-47,50-81`), while the save-handler suite only stubs all-green `status: 'ran'` post-insert results (`tests/handler-memory-save.vitest.ts:2592-2606`) and the follow-up API suite covers `runEnrichmentBackfill()` only when invoked manually (`tests/follow-up-api.vitest.ts:102-149`).
- **Downstream Impact:** Agents consuming `memory_save` cannot mechanically distinguish "retry/backfill is available now" from "best-effort enrichment partially failed during this save," and they never receive a machine-actionable follow-up tool for the latter. Recovery falls back to parsing warnings or knowing hidden internal APIs.

### Finding R24-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Lines:** `174-188, 191-327, 415-429, 560-563`
- **Severity:** P1
- **Description:** `session_resume` promotes hook-state `lastSpecFolder` into authoritative recovery scope without validating the packet anchor itself. `buildCachedSessionSummaryCandidate()` lifts `lastSpecFolder` and summary text directly from the unvalidated `HookState`; `evaluateCachedSessionSummaryCandidate()` verifies transcript identity, timestamps, and cache-token fields, but never confirms that the cached packet still exists or that the summary actually belongs to it. When the caller omits `specFolder`, `handleSessionResume()` feeds that cached value into `buildResumeLadder()` as `fallbackSpecFolder`, yet still builds `opencodeTransport` from `args.specFolder ?? null`.
- **Evidence:** `hook-state.ts:83-87` loads persisted state via `JSON.parse(raw) as HookState`. `session-resume.ts:181-187` copies `state.lastSpecFolder` and `state.sessionSummary?.text` directly into the cached candidate; `session-resume.ts:191-327` rejects stale or mismatched transcript identity, but never stats or loads the claimed spec folder. Once accepted, `session-resume.ts:415-429` routes recovery through `fallbackSpecFolder: scopeFallback`, and `session-resume.ts:560-563` immediately drops that derived scope when building `buildOpenCodeTransportPlan({ specFolder: args.specFolder ?? null })`. The regression test only asserts that cached scope drives `memory.specFolder` and emits the scope-fallback hint (`tests/session-resume.vitest.ts:163-202`); it never checks whether the returned transport plan carries the same scope.
- **Downstream Impact:** A parseable but stale or corrupted hook-state file can steer resume recovery into the wrong packet, and the composite result can disagree with itself: the `memory` block resolves from cached scope while `opencodeTransport` still behaves as if no scope was known. That is a control-plane routing bug, not just a stale-summary cosmetic issue.

## Novel Insights
- The remaining Domain 2 risk is now mostly **control-plane asymmetry**. Deferred planner-first saves get a typed recovery action, but comparable runtime degradation branches only get warning strings; cached resume scope is trusted enough to choose a packet, but not trusted enough to propagate the same packet into transport metadata.
- Re-checking `shared-payload.ts`, `code-graph/query.ts`, and `graph-metadata-parser.ts` did not yield another additive consumer-level finding this pass. Their main state-contract collapses are real, but Iterations 021-023 already captured the active promotion paths; the `trustStateFromGraphState()` collapse currently looks more latent because the startup hooks consume `startupSurface`/`graphState` directly rather than the lossy shared payload.

## Next Investigation Angle
Trace the next consumer hop for both surviving seams: which resume/bootstrap transport callers actually act on `opencodeTransport.specFolder`, and whether any save-path caller can synthesize executable recovery actions from post-insert partial-failure or no-work states instead of relying on warning text alone.
