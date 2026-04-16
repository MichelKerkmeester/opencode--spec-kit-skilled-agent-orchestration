# Iteration 32 — Domain 3: Concurrency and Write Coordination (2/10)

## Investigation Thread
Mapped the live read-modify-write seams that still rely on unlocked temp-file swaps or pre-transaction reads, then checked whether the current test suite exercises those interleavings. This pass focused on how stop-hook state, governed reconsolidation, graph-metadata refresh, and generate-context handoff payloads behave when two writers overlap.

## Findings

### Finding R32-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `170-176`, `221-241`
- **Severity:** P1
- **Description:** `saveState()` still uses a deterministic sibling temp file (`<state>.tmp`), so two writers targeting the same session can swap bytes before rename instead of merely racing on the final file. Because `updateState()` always returns the merged in-memory object even after a failed persist, one caller can observe a "successful" state object while the on-disk file actually contains another writer's payload.
- **Evidence:** `saveState()` writes to `filePath + '.tmp'` and immediately `renameSync()`s it into place (`170-176`). `updateState()` composes a new state from `loadState()` + patch and returns it even when `saveState()` logs a warn path (`221-241`). In the current tests, `hook-state.vitest.ts` only covers single-writer save/load and sequential `updateState()` merges (`91-132`); there is no concurrent writer coverage.
- **Downstream Impact:** Any overlapping hook producers for the same Claude session can lose `lastSpecFolder`, `pendingCompactPrime`, transcript offsets, or producer metadata. Later `loadState()` / `loadMostRecentState()` consumers then recover a false session truth and propagate it into SessionStart, SessionStop, or autosave flows.

### Finding R32-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `60-67`, `119-125`, `244-246`, `261-268`, `281-289`, `302-309`
- **Severity:** P1
- **Description:** `processStopHook()` snapshots state once, performs multiple independent `recordStateUpdate()` calls, and then re-reads state inside `runContextAutosave()`. That creates a split-brain window where overlapping stop hooks can mix fields from different runs or overwrite a newer `lastSpecFolder` using the stale `stateBeforeStop` snapshot.
- **Evidence:** The function captures `stateBeforeStop = loadState(sessionId)` once (`244-246`), then writes metrics/producer metadata (`261-268`), writes `lastSpecFolder` based on the stale snapshot (`281-289`), writes `sessionSummary` (`302-305`), and finally reloads state for autosave (`60-67`, `308-309`). Direct coverage only exercises the pure `detectSpecFolder()` helper in `hook-session-stop.vitest.ts` (`17-88`); no test in `mcp_server/tests/` invokes `processStopHook()` or `runContextAutosave()` under overlapping writes.
- **Downstream Impact:** A single autosave can persist the summary from one stop event into the spec folder selected by another stop event. That feeds `generate-context.js` a mixed payload and can write continuity into the wrong packet or against the wrong transcript offset history.

### Finding R32-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`
- **Lines:** `reconsolidation-bridge.ts:270-306`; `reconsolidation.ts:611-656`, `467-508`, `806-819`, `882-929`
- **Severity:** P1
- **Description:** Governed reconsolidation still chooses and filters candidates before the mutation transaction. The later conflict path deprecates the chosen predecessor without re-checking governed scope or row version, so a candidate that was in-scope at search time can still be superseded after a concurrent scope retag or other metadata rewrite.
- **Evidence:** The bridge over-fetches vector results, applies `candidateMatchesRequestedScope(...)`, and hands the filtered candidate list to `reconsolidate()` before any transaction starts (`270-306`). Inside `reconsolidate()`, `topMatch` is selected from that precomputed list (`611-630`). `executeConflict()` then performs a transactional `UPDATE memory_index SET importance_tier = 'deprecated' WHERE id = ?` with no predecessor-version or scope recheck (`467-508`), while the only version helper in the file tracks `content_hash` and `updated_at`, not governed scope (`806-819`). When a merge succeeds, the successor inherits whatever governance columns are on the current row at insert time (`882-929`). The current test suite only locks in the static pre-filter behavior in `reconsolidation-bridge.vitest.ts` (`255-330`); it never mutates a candidate between scope filter and conflict/merge execution.
- **Downstream Impact:** Cross-scope or freshly re-scoped memories can be deprecated or merged based on stale candidate eligibility. That breaks save isolation and can cause one governed save to rewrite lineage for a memory that no longer belongs to the same tenant/user/agent/session boundary.

### Finding R32-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- **Lines:** `969-989`
- **Severity:** P2
- **Description:** `writeGraphMetadataFile()` uses `process.pid + Date.now()` to build its temp path and has no retry loop. Two same-process writes to the same packet within one millisecond still target the same temp file, so one write can clobber the other's temp payload before rename.
- **Evidence:** The writer serializes content, builds `tempPath = \`${canonicalFilePath}.tmp-${process.pid}-${Date.now()}\``, writes it, and renames it immediately (`969-989`). Direct tests do not touch this writer: `graph-metadata-schema.vitest.ts` only exercises `deriveGraphMetadata()`, `mergeGraphMetadata()`, and `validateGraphMetadataContent()` (`166-487`), and no test under `mcp_server/tests/` references `writeGraphMetadataFile()` or `refreshGraphMetadataForSpecFolder()`.
- **Downstream Impact:** A refresh/backfill burst that hits the same packet twice in one process can fail with `ENOENT` on rename or persist the wrong derived payload. The result is stale or mismatched `graph-metadata.json`, which then affects packet discovery and graph traversal surfaces.

### Finding R32-005
- **File:** `.opencode/command/memory/save.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Lines:** `memory/save.md:127`, `359-361`; `spec_kit/deep-research.md:211-213`; `spec_kit/deep-review.md:243-245`; `generate-context.ts:61-82`
- **Severity:** P2
- **Description:** The documented generate-context handoff still normalizes on `/tmp/save-context-data.json` across multiple command surfaces, even though the script itself already supports safer `--stdin`, `--json`, or arbitrary temp-file inputs. Two sessions following the documented flow can overwrite each other's JSON payload before `generate-context.js` reads it.
- **Evidence:** The memory-save command advertises `generate-context.js <json-data-path>` with `/tmp/save-context-data.json` as the concrete example and later tells operators to write the intermediate JSON there (`memory/save.md:127`, `359-361`). The deep-research and deep-review command surfaces repeat the same fixed file path (`spec_kit/deep-research.md:211-213`, `spec_kit/deep-review.md:243-245`). Meanwhile the CLI help in `generate-context.ts` explicitly supports `--stdin`, `--json`, or any temp file and does not require a shared path (`61-82`). Even the script tests codify the fixed filename as the default file-mode example in `scripts/tests/generate-context-cli-authority.vitest.ts` (`55-75`, `77-106`, `223-247`) rather than challenging filename uniqueness.
- **Downstream Impact:** One session can save another session's `specFolder`, `sessionSummary`, or tool/exchange payload into the wrong packet. Because `generate-context.js` treats the input file as authoritative structured data, this becomes a silent cross-packet continuity corruption path rather than a clean failure.

## Novel Insights
The main pattern is not just "missing locks." These seams repeatedly do work in two phases: first they read or filter shared state, then they mutate later while treating that earlier snapshot as authoritative. In the stop-hook lane this produces split-brain autosave payloads, and in reconsolidation it produces stale-governance candidate actions. The command layer repeats the same coordination mistake by standardizing a shared temp filename even though the underlying script already supports lock-free structured input modes.

## Next Investigation Angle
Stress the conflict-tier save path and the stop-hook lane under forced interleaving. In particular: mutate governed scope between `candidateMatchesRequestedScope()` and `executeConflict()`, and run overlapping `processStopHook()` calls for the same session while delaying `saveState()` so the autosave payload can be compared against the final persisted hook-state file.
