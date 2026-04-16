# Iteration 37 — Domain 3: Concurrency and Write Coordination (7/10)

## Investigation Thread
I stayed on the unlocked hook/save seams from Iterations 031-035, but filtered out the already-written generic temp-path and last-writer-wins findings. This pass focused on three narrower coordination bugs that were still unclaimed: the hidden zero-offset write inside `storeTokenSnapshot()`, the stale `currentSpecFolder` preference inside `detectSpecFolder()`, and the fact that save-time reconsolidation plus assistive review can observe two different pre-transaction candidate snapshots in the same request.

## Findings

### Finding R37-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `175-190`, `244-252`, `257-268`
- **Severity:** P1
- **Description:** `processStopHook()` performs a hidden two-step metrics write for the same transcript parse. `storeTokenSnapshot()` first persists `metrics.lastTranscriptOffset = 0`, and only the later `recordStateUpdate()` replaces that sentinel with `newOffset`. A second stop hook that starts in that interleaving window will read `0` from hook-state and reparse the transcript from the beginning.
- **Evidence:** `storeTokenSnapshot()` does `loadState(sessionId)` and then `updateState(sessionId, { metrics: { ... lastTranscriptOffset: 0 } })` (`session-stop.ts:181-190`). The caller already captured `startOffset` from `stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0` and parsed forward from that point (`session-stop.ts:244-252`), then invokes `storeTokenSnapshot()` before issuing the later `recordStateUpdate(... lastTranscriptOffset: newOffset ...)` patch (`session-stop.ts:257-268`). Existing tests only cover sequential transcript parsing and sequential metric overwrites (`mcp_server/tests/hook-stop-token-tracking.vitest.ts:23-109`, `mcp_server/tests/token-snapshot-store.vitest.ts:14-45`); there is no harness that pauses between the zero-offset write and the final offset write.
- **Downstream Impact:** Overlapping stop hooks can duplicate token accounting, replay already-counted transcript bytes, and churn producer metadata even before the previously documented last-writer-wins overwrite happens. That makes token/cost history and downstream continuity freshness look authoritative while being inflated by a transient sentinel state.

### Finding R37-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `128-145`, `244-246`, `281-296`, `340-369`
- **Severity:** P1
- **Description:** The stop hook can suppress a legitimate packet retarget because `detectSpecFolder()` prefers the supplied `currentSpecFolder` whenever multiple packet paths are present, and `processStopHook()` passes a stale `stateBeforeStop.lastSpecFolder` snapshot into that preference. If another writer has already switched the real active packet, this invocation can still "validate" the old packet and avoid retargeting.
- **Evidence:** `selectDetectedSpecFolder()` returns `currentSpecFolder` whenever it is included in the tail matches, even if other packet matches are also present (`session-stop.ts:128-145`). `processStopHook()` snapshots `stateBeforeStop = loadState(sessionId)` once (`session-stop.ts:244-246`) and later calls `detectSpecFolder(input.transcript_path, stateBeforeStop?.lastSpecFolder ?? null)` (`session-stop.ts:281-281`). When the stale packet remains present in the transcript tail, the code falls into the `detectedSpec === stateBeforeStop.lastSpecFolder` branch and logs `Validated active spec folder from transcript` instead of retargeting (`session-stop.ts:285-296`). The direct helper tests intentionally pin this preference (`mcp_server/tests/hook-session-stop.vitest.ts:17-36`), but they never exercise the case where `currentSpecFolder` is already stale because another stop/precompact writer updated hook-state between the initial snapshot and the detection pass.
- **Downstream Impact:** A session that has really moved to a new packet can keep auto-saving continuity into the previous packet, with an info-level "validated" log that falsely suggests the packet target was freshly confirmed rather than inherited from stale state.

### Finding R37-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `261-306`, `453-500`
- **Severity:** P2
- **Description:** A single save request can observe two different unlocked candidate snapshots before the writer transaction begins. The TM-06 reconsolidation planner does one `vectorSearch` + scope-filter pass, and if it falls through, the assistive reconsolidation block later does a second `vectorSearch` + scope-filter pass. No transaction, lock, or snapshot token ties those two reads together.
- **Evidence:** The main reconsolidation path calls `reconsolidate(...)` with a `findSimilar` callback that performs `vectorIndex.vectorSearch(...)` and `candidateMatchesRequestedScope(...)` before any create/write transaction begins (`reconsolidation-bridge.ts:261-306`). If that path returns `null` or `complement`, the file later runs the assistive block, which performs a second `vectorSearch(...)`, a second governed-scope filter, and may attach `assistiveRecommendation` (`reconsolidation-bridge.ts:453-500`). The handler ordering regression explicitly locks in that reconsolidation planning completes before the normal write transaction starts (`mcp_server/tests/handler-memory-save.vitest.ts:1056-1093`). Current bridge coverage only checks a single static filtered snapshot (`mcp_server/tests/reconsolidation-bridge.vitest.ts:255-330`), while the assistive suite only exercises helper thresholds/logging and never drives a live save flow (`mcp_server/tests/assistive-reconsolidation.vitest.ts:1-180`).
- **Downstream Impact:** A concurrent insert/update can make the main planner miss a candidate that the later assistive pass does see, so the same request can persist as a normal complement while also returning a late review recommendation against a newer candidate universe. That weakens the auditability of save responses and makes stale duplicate creation harder to distinguish from intentional keep-separate behavior.

## Novel Insights
- The most interesting stop-hook races now are **not** just "two writers touch the same file." `session-stop.ts` contains a transient sentinel write (`lastTranscriptOffset: 0`) and a stale selector preference (`currentSpecFolder`) that create their own coordination hazards even before the final autosave re-read happens.
- `detectSpecFolder()`'s "preserve current packet when multiple matches exist" rule is locally sensible but becomes unsafe once `currentSpecFolder` itself is sourced from an unlocked earlier snapshot.
- The save stack has more than one pre-transaction read phase. TM-06 planning and assistive review are separate snapshot consumers, so one request can reason about different candidate worlds before it ever acquires the normal writer transaction.

## Next Investigation Angle
Add adversarial harnesses for the newly isolated interleavings: pause one stop hook between `storeTokenSnapshot()` and the later `recordStateUpdate()`, feed `detectSpecFolder()` a transcript tail with both old and new packet paths while another writer updates `lastSpecFolder`, and insert a near-duplicate between the TM-06 search and the assistive search to prove the same save can produce split-snapshot advisory output.
