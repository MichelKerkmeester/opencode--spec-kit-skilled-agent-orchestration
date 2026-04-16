# Iteration 31 — Domain 3: Concurrency and Write Coordination (1/10)

## Investigation Thread
I traced the runtime's unlocked read-modify-write seams, concentrating on hook-state persistence, stop-hook autosave coordination, save-time reconsolidation, graph-metadata refresh, and the shared JSON handoff file used by `generate-context.js`. I filtered out the already-documented fail-open findings from Iterations 011-029 and kept only race windows that were not previously written up.

## Findings

### Finding R31-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `169-176, 221-240`
- **Severity:** P1
- **Description:** `hook-state` still performs an unlocked read-modify-write against a deterministic temp filename. `updateState()` loads the current JSON, overlays the incoming patch, and calls `saveState()`, while `saveState()` always writes through the same sibling temp path (`<session>.json.tmp`) before `renameSync()`. Concurrent hook producers for the same session can therefore overwrite each other's patches or cause one writer to lose the shared temp file before rename.
- **Evidence:** `saveState()` derives `tmpPath = filePath + '.tmp'` and immediately `writeFileSync(tmpPath, ...)` then `renameSync(tmpPath, filePath)` (`hook-state.ts:170-176`). `updateState()` separately does `const existing = loadState(sessionId)` and `{ ...existing, ...patch }` before persisting (`hook-state.ts:221-240`), with no lock, CAS token, or version check. Multiple hook producers write the same state file: Claude compact cache (`hooks/claude/compact-inject.ts:393-407,416-422`), Claude stop hook (`hooks/claude/session-stop.ts:119-125,184-190,261-268,302-304`), Gemini compact cache (`hooks/gemini/compact-cache.ts:158-182`), and Gemini stop hook (`hooks/gemini/session-stop.ts:97-110`). Direct tests cover only sequential overwrites and merges (`tests/hook-state.vitest.ts:114-132`, `tests/hook-precompact.vitest.ts:23-48`, `tests/session-token-resume.vitest.ts:14-48`), not overlapping writers or `.tmp` collisions.
- **Downstream Impact:** A later writer can silently drop another producer's `lastSpecFolder`, `sessionSummary`, `producerMetadata`, or `pendingCompactPrime`, and a failed rename only emits a warning. That undermines both resume continuity and stop-hook autosave targeting.

### Finding R31-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `60-67, 119-125, 261-268, 283-309`
- **Severity:** P1
- **Description:** The Claude stop hook assembles autosave input by writing state in several separate steps and then re-reading disk right before autosave. Because those writes are not coordinated, `runContextAutosave()` can observe a torn snapshot that never existed in the caller's logical flow.
- **Evidence:** `recordStateUpdate()` is only `updateState(sessionId, patch)` plus bookkeeping (`session-stop.ts:119-125`). `processStopHook()` writes metrics/producer metadata (`261-268`), may retarget `lastSpecFolder` (`283-288`), then writes `sessionSummary` (`302-304`) before invoking `runContextAutosave()` (`308-309`). `runContextAutosave()` does a fresh `loadState(sessionId)` and extracts `specFolder` plus `summary` from whatever is on disk at that instant (`60-67`). The replay harness proves only sequential, autosave-disabled behavior (`tests/hook-session-stop-replay.vitest.ts:14-56`), and the direct stop-hook suite only exercises `detectSpecFolder()` in isolation (`tests/hook-session-stop.vitest.ts:17-88`).
- **Downstream Impact:** Concurrent writers can make autosave pair one hook's summary with another hook's packet target, or skip autosave because one field vanished between writes. The resulting continuity save can land in the wrong packet while the stop hook still reports a normal completion path.

### Finding R31-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `282-295`
- **Severity:** P1
- **Description:** Save-time reconsolidation still decides on a candidate outside any write lock, and the conflict path does not revalidate that target before deprecating it. This leaves a stale-top-match race that is distinct from the already-documented scope-filter disappearance cases.
- **Evidence:** The bridge callback performs `vectorSearch(...)`, scope-filters the result set, and returns the sliced candidates before any transaction begins (`reconsolidation-bridge.ts:282-295`). `reconsolidate()` then selects `topMatch` and `determineAction(topMatch.similarity)` before dispatching to merge or conflict (`lib/storage/reconsolidation.ts:610-635`). The merge path defends against drift by re-reading the predecessor and checking `predecessorVersion` inside its transaction (`lib/storage/reconsolidation.ts:224-264`), but `executeConflict()` does not: it simply updates `importance_tier = 'deprecated'` and inserts the supersedes edge if the row still exists (`lib/storage/reconsolidation.ts:481-508`). Existing tests cover cross-scope filtering and threshold-band behavior (`tests/reconsolidation-bridge.vitest.ts:255-330`, `tests/gate-d-regression-reconsolidation.vitest.ts:123-195`), not a row-changing race between search and conflict commit.
- **Downstream Impact:** A concurrent save can change the top candidate after similarity search, yet the conflict lane will still deprecate the now-current row and attach a supersedes edge based on stale similarity evidence. That can incorrectly archive or supersede a memory that no longer matched the incoming save.

### Finding R31-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `969-990, 999-1019`
- **Severity:** P2
- **Description:** Graph-metadata refresh is only atomically replacing bytes, not atomically refreshing state. The refresh path reads existing metadata, derives and merges new content, then writes it back without any lock or compare-and-swap, so concurrent refreshes can silently lose each other's merged fields.
- **Evidence:** `refreshGraphMetadataForSpecFolder()` loads `existing`, derives `refreshed`, merges them, and immediately writes the result (`graph-metadata-parser.ts:1015-1019`). `writeGraphMetadataFile()` uses a temp-swap, but the temp name is only `${canonicalFilePath}.tmp-${process.pid}-${Date.now()}` and there is no validation that the target remained unchanged after `existing` was read (`graph-metadata-parser.ts:969-990`). Current coverage only proves single-writer refresh success (`tests/graph-metadata-integration.vitest.ts:107-113`) and pure merge semantics in memory (`tests/graph-metadata-schema.vitest.ts:185-205`); there is no regression for concurrent refreshes or lost `manual` / `last_accessed_at` updates.
- **Downstream Impact:** Two refreshers can each preserve a different view of packet relationships or freshness metadata, and the later rename silently wins. That can drop manual graph edges or timestamps that later retrieval and graph traversal treat as authoritative.

### Finding R31-005
- **File:** `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`
- **Lines:** `59-111`
- **Severity:** P2
- **Description:** The `generate-context` file-input path trusts a caller-supplied JSON file verbatim, while the command layer repeatedly hard-codes the same shared handoff path `/tmp/save-context-data.json`. This institutionalizes a cross-workflow race: concurrent saves can overwrite the file between JSON composition and `generate-context.js` consumption.
- **Evidence:** `loadCollectedData()` accepts `dataFile`, path-sanitizes it, and reads/parses that file with no lock, unique-path requirement, or content fingerprint (`scripts/loaders/data-loader.ts:59-111`). The CLI parser forwards any positional data-file argument directly into workflow execution (`scripts/memory/generate-context.ts:456-462,593-600`). Multiple workflow assets all prescribe the same temp file: planning (`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:540-555`), implementation (`.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:503-507`), completion (`.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:996-1000`), and deep research (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:654-657`). The CLI authority tests also normalize that shared path in happy-path single-invocation runs (`scripts/tests/generate-context-cli-authority.vitest.ts:55-75,77-105,223-247`) and never exercise parallel writers.
- **Downstream Impact:** Two simultaneous save flows can route the wrong session summary into the wrong packet, or one workflow can read partially replaced JSON from another. Because the path is part of the published command contract, this race is systemic rather than an accidental local misuse.

## Novel Insights
- The runtime relies on several **atomic file swaps**, but the real bug class is broader: the surrounding read-modify-write flow is still unlocked. Atomic rename prevents torn bytes, not stale-state decisions or last-writer-wins field loss.
- The conflict path in reconsolidation is now the clearest asymmetry in the save stack: merge defends against predecessor drift, conflict does not. That means write coordination is not uniformly enforced even inside the same feature family.
- The `/tmp/save-context-data.json` issue is not just documentation drift; it is a command-surface contract reinforced by tests, which means concurrency risk is being taught to every caller.

## Next Investigation Angle
Probe whether these races are already observable in existing harnesses with minimal adversarial additions: a dual-writer hook-state test, a stop-hook autosave test with an interleaving writer, a reconsolidation conflict regression that mutates the predecessor between `findSimilar` and commit, and a graph-metadata refresh test that runs two refreshes against the same packet before either re-reads disk.
