# Iteration 36 — Domain 3: Concurrency and Write Coordination (6/10)

## Investigation Thread
I filtered out the already-written temp-file and generic unlocked RMW findings from Iterations 031-035 and stayed on three additive seams: freshness selection while hook-state files are being replaced, assistive reconsolidation decisions made from a pre-transaction snapshot, and the live `generate-context` file-input contract that still teaches a shared handoff filename.

## Findings

### Finding R36-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Lines:** `140-155`, `170-176`
- **Severity:** P2
- **Description:** `loadMostRecentState()` makes its freshness decision from a `statSync()` taken before it reads the JSON payload, while `saveState()` replaces the whole file via temp-write plus `renameSync()`. A concurrent writer can therefore swap in a new generation between the `mtime` read and the `readFileSync()`, so the loader ranks one generation but returns another.
- **Evidence:** The scan loop captures `mtimeMs = statSync(filePath).mtimeMs`, then separately does `readFileSync(filePath, 'utf-8')` and `JSON.parse(raw)` before comparing `mtimeMs` against `newestMtimeMs` (`hook-state.ts:140-155`). The same file is replaced atomically, not updated in place: `saveState()` writes `filePath + '.tmp'` and then `renameSync(tmpPath, filePath)` (`hook-state.ts:170-176`). The direct tests only cover sequential `utimesSync()` ordering and stale-age behavior (`tests/hook-state.vitest.ts:135-223`); they never replace a candidate file between `statSync()` and `readFileSync()`.
- **Downstream Impact:** Startup and resume consumers can recover a session summary or `lastSpecFolder` from a different generation than the freshness metadata that selected it. That can make a stale state look current, or make a current state lose the "newest" tie-break while continuity consumers still trust the returned payload.

### Finding R36-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- **Lines:** `reconsolidation-bridge.ts:453-501`; `memory-save.ts:2159-2170`, `2250-2304`
- **Severity:** P2
- **Description:** The assistive reconsolidation lane still computes and surfaces review recommendations from a pre-transaction search snapshot. Because `runReconsolidationIfEnabled()` runs before the normal writer transaction starts, a concurrent save can merge, supersede, or re-scope the recommended candidate before the current save commits, leaving the returned recommendation stale on arrival.
- **Evidence:** The assistive branch runs `vectorSearch(...)`, filters with `candidateMatchesRequestedScope(...)`, picks `scopedCandidates[0]`, and builds `assistiveRecommendation` immediately (`reconsolidation-bridge.ts:453-501`). `memory-save.ts` explicitly completes that planning step "before ... taking the SQLite writer lock" (`memory-save.ts:2159-2170`), and only later enters `writeTransaction` for the real create/append-only write (`memory-save.ts:2250-2304`). Coverage remains static: `tests/assistive-reconsolidation.vitest.ts:17-234` only checks feature-flag/classifier/logging helpers, and `tests/reconsolidation-bridge.vitest.ts:210-330` exercises fixed mocked search results rather than an interleaving writer that changes the candidate after the recommendation is formed.
- **Downstream Impact:** Operators or follow-up tooling can receive a review recommendation for a memory that has already been deprecated, merged away, or moved out of scope by another save. That creates advisory cleanup work against the wrong target while the current save still succeeds normally.

### Finding R36-003
- **File:** `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Lines:** `data-loader.ts:63-68`; `generate-context.ts:61-83`
- **Severity:** P2
- **Description:** The live file-input loader still hard-codes `/tmp/save-context-data.json` in its `NO_DATA_FILE` error contract, so the executable path itself teaches callers to reuse the same shared handoff filename even though the CLI help now prefers `--stdin`, `--json`, or an arbitrary temp file.
- **Evidence:** When no structured input is provided, `loadCollectedData()` throws an error that tells external agents to "write session data to `/tmp/save-context-data.json`, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]" (`data-loader.ts:63-68`). The same command's help text prefers `--stdin`, `--json`, or "a JSON temp file" instead (`generate-context.ts:61-83`). The authority tests still normalize the fixed filename in file-mode examples (`scripts/tests/generate-context-cli-authority.vitest.ts:55-75`, `77-106`, `223-247`), but there is no regression asserting that the loader's operator-facing failure path avoids the shared filename.
- **Downstream Impact:** Even if command docs are corrected, wrappers or humans who learn the workflow from the runtime error message can still converge on the same global `/tmp/save-context-data.json` path. Concurrent saves can then overwrite each other's structured payload before `generate-context.js` reads it, causing silent cross-packet continuity corruption.

## Novel Insights
- The remaining Domain 3 bugs are no longer just "missing locks on writes." One layer up, the runtime is still making **selection and recommendation decisions from snapshots that can change underneath it**, then surfacing those decisions as if they were still current.
- The `/tmp/save-context-data.json` race is now confirmed in executable code, not only in docs and workflow assets. Earlier iterations showed the guidance surface was broad; this pass shows the runtime error contract itself still reintroduces the same shared-path hazard.
- Hook-state continuity recovery has a second coordination seam beyond unlocked `updateState()`: even readers that never mutate can combine freshness from one file generation with content from another because selection is not tied to the bytes actually returned.

## Next Investigation Angle
Probe whether any caller already assumes these stale decisions are trustworthy: add an adversarial `loadMostRecentState()` test with a replace-between-stat-and-read interleave, an assistive reconsolidation regression where another save supersedes the recommended candidate before `writeTransaction`, and a loader/CLI regression that rejects fixed shared-path advice in the file-input error contract.
